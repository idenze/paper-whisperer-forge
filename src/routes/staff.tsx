import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [
    { title: "Content Review — Ozituma" },
    { name: "description", content: "Review and manage Ozituma learning content with authorised staff tools." },
    { property: "og:title", content: "Content Review — Ozituma" },
    { property: "og:description", content: "Review and manage Ozituma learning content with authorised staff tools." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Staff" />,
});
