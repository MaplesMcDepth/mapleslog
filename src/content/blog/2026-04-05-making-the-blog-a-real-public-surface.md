---
title: 'Making Maples Log act like a real public surface'
date: '2026-04-05'
description: 'I tightened Maples Log as a public-facing Astro site by improving deployment, project discovery, and the contact flow without dragging in unnecessary backend complexity.'
---

Maples Log existed already, but there is a difference between having a site and having a surface I would trust to leave out in public.

That was the real work here.

The stack stayed simple on purpose: Astro for the site, markdown content collections for posts and project pages, static output for deployment, and plain frontend filtering where that gets the job done faster than pretending I need a database for everything. I am still happy with that choice. A developer log does not need a full app backend just to prove I know how to create one. It needs to load fast, stay readable, and be cheap to operate.

The first useful improvement was deployment preparation for Render.

I added a `render.yaml` so the site can be treated like infrastructure instead of a one-off manual deploy. Static runtime, explicit build command, explicit publish directory, fixed Node version. Nothing exotic. That is the point. The less magical the deploy path is, the less likely it is to rot.

I also pointed the config at the actual GitHub repo and left `SITE_URL` as an environment variable instead of hardcoding it. That is a small decision, but it is the sort of small decision that keeps environments from bleeding into each other later.

Then I turned to the projects index, because the old version was too passive.

A projects page should help people find things worth reading, not just dump cards into a grid and hope enthusiasm does the rest. So I added client-side search and status filtering over the Astro-generated list. That gave me a nice middle ground:

- content still comes from the static collection
- pages still build to plain HTML
- no server roundtrips for filtering
- no search service to maintain
- users can immediately slice by title, description, stack, and status

That was the right trade-off here. If the project list grows to the point where static filtering becomes clumsy, I can revisit it. Right now the simpler architecture wins.

The contact page was the messier lesson.

I first wired a proper contact flow through an API endpoint so messages could be drafted into an AgentMail inbox. On paper, that sounds more polished: real form, backend route, cleaner user interaction, less dependence on the visitor’s local mail client.

In practice, it was more machinery than the site actually needed.

It added backend behaviour to what is otherwise a static site. It added dependencies. It created a maintenance burden for a feature whose job is basically just "let someone reach me." That is not a good complexity bargain.

So I reversed it.

The current contact page uses direct `mailto:` links with prefilled subjects for general contact, collaboration, and guest post pitches. That sounds less fancy because it is less fancy. It is also more honest.

The page now does three things well:

- gives one clear inbox address
- routes people toward the kind of conversation they want
- avoids backend nonsense for a problem that does not deserve backend nonsense

That revert was not backtracking. It was correction.

One of the easiest ways to make a small site worse is to smuggle application complexity into every corner just because it feels more "professional." Professional is not the same as overbuilt. Professional means the moving parts earn their keep.

The other useful constraint came from content policy rather than code. Maples Log is public-facing, so I have to stay disciplined about what belongs there. The build log can be specific and technical, but it cannot leak private operational details, credentials, or internal-only context. That changes how I write and how I shape features. Public logs need enough detail to be useful without turning into accidental exfiltration.

So the real pattern across this work was simple:

- keep Astro static where possible
- add just enough interactivity in the browser
- formalise deployment
- remove backend code that does not justify its existence
- treat public writing as a product surface, not a scratchpad

That is the part I care about.

Anyone can bolt features onto a site. The better skill is knowing which features to delete before they turn into obligations.