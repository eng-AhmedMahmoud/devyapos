import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { clientIp } from "@/lib/rate-limit";

/*
 * The lead and consent rate limits key on X-Real-IP (lib/rate-limit.ts). That
 * is only safe while nginx overwrites the header from the connection and the
 * container cannot be reached any other way — the X-Ray's /sec phase refuted a
 * spoofed-header bypass on exactly those two facts, checked on the host. These
 * tests pin both in the files that ship them, so a config change that breaks
 * either fails CI instead of quietly reopening the bypass.
 */

const nginx = readFileSync("deploy/nginx.conf", "utf8");
const compose = readFileSync("docker-compose.prod.yml", "utf8");

/** Top-level `server { … }` blocks, by brace depth. */
function serverBlocks(conf: string): string[] {
  const blocks: string[] = [];
  const text = conf.replace(/#.*$/gm, "");
  let at = text.indexOf("server {");
  while (at !== -1) {
    let depth = 0;
    let end = at;
    for (let i = text.indexOf("{", at); i < text.length; i++) {
      if (text[i] === "{") depth++;
      if (text[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    blocks.push(text.slice(at, end + 1));
    at = text.indexOf("server {", end);
  }
  return blocks;
}

describe("deploy/nginx.conf", () => {
  const blocks = serverBlocks(nginx);

  // Two TLS servers, plus one :80 server that sends both names to
  // https://pos.movingsystems.tech in a single hop.
  it("has the three server blocks", () => {
    expect(blocks).toHaveLength(3);
  });

  it("every block that proxies to the app sets X-Real-IP from the connection", () => {
    const proxying = blocks.filter((b) => b.includes("proxy_pass"));
    expect(proxying.length).toBeGreaterThan(0);
    for (const b of proxying) {
      expect(b).toMatch(/proxy_pass\s+http:\/\/devya_devyapos;/);
      expect(b).toMatch(/proxy_set_header\s+X-Real-IP\s+\$remote_addr;/);
    }
  });

  it("the upstream is the loopback port the container publishes", () => {
    expect(nginx).toMatch(/upstream devya_devyapos\s*\{[^}]*server 127\.0\.0\.1:3009;/);
  });

  it("no block discloses the nginx version", () => {
    for (const b of blocks) expect(b).toMatch(/server_tokens\s+off;/);
  });
});

describe("docker-compose.prod.yml", () => {
  it("publishes the container on loopback only", () => {
    const ports = [...compose.matchAll(/^\s*-\s*"([^"]+:\d+)"\s*$/gm)].map((m) => m[1]);
    expect(ports).toEqual(["127.0.0.1:3009:3000"]);
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("http://x/api/lead", { headers });

  it("takes nginx's X-Real-IP", () => {
    expect(clientIp(req({ "x-real-ip": "198.51.100.7" }))).toBe("198.51.100.7");
    expect(clientIp(req({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });

  it("prefers X-Real-IP over a client-written X-Forwarded-For", () => {
    expect(clientIp(req({ "x-real-ip": "198.51.100.7", "x-forwarded-for": "203.0.113.9" }))).toBe("198.51.100.7");
  });

  it("puts anything that is not an IP address in one shared bucket", () => {
    for (const value of ["evil", "10.0.0.1, 10.0.0.2", "../x", "999.1.1.1", `r-${Math.random()}`]) {
      expect(clientIp(req({ "x-real-ip": value }))).toBe("unknown");
    }
    expect(clientIp(req({ "x-forwarded-for": "203.0.113.9, not-an-ip" }))).toBe("unknown");
  });

  it("falls back to the last X-Forwarded-For hop, then to the shared bucket", () => {
    expect(clientIp(req({ "x-forwarded-for": "203.0.113.9, 198.51.100.8" }))).toBe("198.51.100.8");
    expect(clientIp(req({}))).toBe("unknown");
  });
});
