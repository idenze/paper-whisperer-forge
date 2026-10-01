import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/keyboard")({
  head: () => ({ meta: [
    { title: "Igbo Keyboard — Ozituma" },
    { name: "description", content: "Try responsive Igbo, English, and prototype Ndebe keyboard layouts." },
    { property: "og:title", content: "Igbo Keyboard — Ozituma" },
    { property: "og:description", content: "Try responsive Igbo, English, and prototype Ndebe keyboard layouts." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Keyboard" />,
});
