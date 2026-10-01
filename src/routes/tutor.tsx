import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [
    { title: "Igbo Tutor — Ozituma" },
    { name: "description", content: "Explore the clearly labelled sample Igbo tutor experience." },
    { property: "og:title", content: "Igbo Tutor — Ozituma" },
    { property: "og:description", content: "Explore the clearly labelled sample Igbo tutor experience." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Tutor" />,
});
