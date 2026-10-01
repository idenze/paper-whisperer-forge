import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/ndebe")({
  head: () => ({ meta: [
    { title: "Ndebe Studio — Ozituma" },
    { name: "description", content: "Explore the prototype Ndebe typing and learning studio." },
    { property: "og:title", content: "Ndebe Studio — Ozituma" },
    { property: "og:description", content: "Explore the prototype Ndebe typing and learning studio." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Ndebe" />,
});
