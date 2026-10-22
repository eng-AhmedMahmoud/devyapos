import { llmsTxt } from "@/lib/llms";

/* Built once at `next build`, like robots.txt and sitemap.xml. */
export const dynamic = "force-static";

/** /llms.txt — see lib/llms.ts. */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
