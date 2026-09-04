import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

/**
 * AI crawlers are allowed on purpose.
 *
 * This is a marketing site whose whole job is to be found and quoted. A
 * restaurant owner asking an assistant "what POS works in Egypt and prices in
 * EGP?" is exactly the query we want DevyaPOS to turn up in, and a crawler
 * that is blocked cannot cite us. There is nothing here that is not already
 * public, so the usual reason to block them — training on private content —
 * does not apply. Listing them explicitly rather than leaning on the `*` rule
 * makes the decision visible to whoever reads this next.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — ChatGPT training and browsing
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — live fetch on a user's behalf
  "ClaudeBot", // Anthropic — Claude
  "Claude-User",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "CCBot", // Common Crawl, which most of the others are trained from
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
