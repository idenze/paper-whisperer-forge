# Practise redesign and page-loading fix

## Goal
Bring the proven completion work from the public `learn` source into this project without replacing existing features, then make Practise more playful, clear, and mobile-friendly.

## Changes
- Compare the public `learn` source with this project and selectively port only relevant fixes.
- Replace tab-only navigation with real TanStack page URLs so Home, Learn, Practise, Tutor, Ndebe, Keyboard, Teachers, Dictionary, Profile, and Staff open and reload independently.
- Preserve learner progress and existing lesson, teacher, keyboard, dictionary, Tutor, and Ndebe behavior.
- Redesign the Practise hub and game into a simpler activity-first flow with clearer session choices, lively progress, larger touch targets, friendly feedback, and an improved completion state.
- Keep every language example visibly marked as placeholder until approved content is connected.
- Verify direct loading, refresh, back/forward navigation, and core interactions across desktop and phone widths.

## Technical details
- Keep TanStack file routing and use links for navigation.
- Retain device-saved session progress through `useStickyState`.
- Use existing semantic colors and reusable buttons; add only semantic styling tokens where required.
- Keep free Practise separate from lesson completion and course unlocking.
