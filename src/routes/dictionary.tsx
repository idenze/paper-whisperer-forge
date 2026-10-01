import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/dictionary")({
  head: () => ({ meta: [
    { title: "Igbo Dictionary — Ozituma" },
    { name: "description", content: "Search reviewed Igbo dictionary entries and available pronunciations." },
    { property: "og:title", content: "Igbo Dictionary — Ozituma" },
    { property: "og:description", content: "Search reviewed Igbo dictionary entries and available pronunciations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Dictionary" />,
});
