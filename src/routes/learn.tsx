import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [
    { title: "Learn Igbo — Ozituma" },
    { name: "description", content: "Follow your Igbo course through clear, ordered lessons and saved progress." },
    { property: "og:title", content: "Learn Igbo — Ozituma" },
    { property: "og:description", content: "Follow your Igbo course through clear, ordered lessons and saved progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Learn" />,
});
