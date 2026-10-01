import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/practise")({
  head: () => ({ meta: [
    { title: "Practise Igbo — Ozituma" },
    { name: "description", content: "Build confidence with short, repeatable Igbo listening, typing, and context activities." },
    { property: "og:title", content: "Practise Igbo — Ozituma" },
    { property: "og:description", content: "Build confidence with short, repeatable Igbo listening, typing, and context activities." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Practise" />,
});
