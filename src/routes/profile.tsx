import { createFileRoute } from "@tanstack/react-router";
import { LearnApp } from "@/components/app-shell";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Your Profile — Ozituma" },
    { name: "description", content: "Manage your Ozituma learner profile and learning preferences." },
    { property: "og:title", content: "Your Profile — Ozituma" },
    { property: "og:description", content: "Manage your Ozituma learner profile and learning preferences." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <LearnApp tab="Profile" />,
});
