import { MetadataRoute } from "next";
import puppiesData from "@/data/puppies.json";
import { Puppy } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://puppynest.ae";
  const puppies = puppiesData as Puppy[];

  const staticRoutes = [
    "",
    "/puppies",
    "/gone-home",
    "/happy-families",
    "/how-it-works",
    "/faq",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const puppyRoutes = puppies.map((p) => ({
    url: `${baseUrl}/puppies/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...puppyRoutes];
}
