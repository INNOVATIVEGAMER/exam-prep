import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://exam-prep-self.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/subjects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refunds`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes from DB
  try {
    const supabase = await createClient();

    // Subject pages — /subjects/[code]
    const { data: subjects } = await supabase
      .from("subjects")
      .select("code, created_at");

    const subjectRoutes: MetadataRoute.Sitemap = (subjects ?? []).map(
      (subject) => ({
        url: `${BASE_URL}/subjects/${subject.code}`,
        lastModified: new Date(subject.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }),
    );

    // Paper pages — /subjects/[code]/[paperId]
    // Join papers with subjects to get the subject code for the URL
    const { data: papers } = await supabase
      .from("papers")
      .select("id, created_at, subjects!inner(code)");

    const paperRoutes: MetadataRoute.Sitemap = (papers ?? []).map((paper) => {
      const subjectCode = (paper.subjects as unknown as { code: string }).code;
      return {
        url: `${BASE_URL}/subjects/${subjectCode}/${paper.id}`,
        lastModified: new Date(paper.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...subjectRoutes, ...paperRoutes];
  } catch {
    // If DB is unavailable, return static routes only
    return staticRoutes;
  }
}
