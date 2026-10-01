import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/teachers")({
  head: () => ({ meta: [
    { title: "Find an Igbo Teacher — Ozituma" },
    { name: "description", content: "Discover Igbo teachers, view profiles, and explore lesson booking." },
    { property: "og:title", content: "Find an Igbo Teacher — Ozituma" },
    { property: "og:description", content: "Discover Igbo teachers, view profiles, and explore lesson booking." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Teachers" />,
});
