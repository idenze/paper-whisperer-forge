import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ozituma Learn Igbo — Your daily learning journey" },
    { name: "description", content: "Continue your Igbo learning journey with lessons, practice, and cultural context." },
    { property: "og:title", content: "Ozituma Learn Igbo — Your daily learning journey" },
    { property: "og:description", content: "Continue your Igbo learning journey with lessons, practice, and cultural context." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Home" />,
});
