# LCKDIN Build

> From "I have an idea" to "we have a team, a plan, and our first deliverables."

LCKDIN Build is a student collaboration and project-execution platform. A student describes a project idea; an AI project coordinator powered by **Gemma 4** (an open-weight model run locally) turns it into a structured project brief, identifies the roles and skills needed, and drafts actionable tasks. The app recommends potential collaborators from stored profile data, creates a project workspace, and gives an **advisory** review of submitted work against each task's acceptance criteria.

LCKDIN Build is **not** a job board, an internship scraper, a general-purpose chatbot, or an autonomous code-deployment agent.

> **Status: pre-development.** This repository currently holds the project instructions and specification only. No application code has been written yet, and Gemma 4 integration has not been tested. This README will be updated as features are built and verified.

## The problem

Students often have ideas for apps, research, startups, competitions, or community projects but struggle to move from idea to execution. They may not know which skills the project needs, which roles their team is missing, who would complement their abilities, how to break the idea into milestones, or whether submitted work meets the task requirements.

## How it works (planned MVP flow)

1. A student enters a project idea.
2. Gemma 4 generates a structured project brief (draft).
3. The student reviews, edits, and confirms the brief.
4. The app recommends fictional **demo** collaborators using deterministic skill-overlap scoring.
5. The student selects collaborators.
6. The app creates a workspace and tasks with acceptance criteria.
7. A team member submits text work for a task.
8. Gemma 4 reviews the submission against the task's exact acceptance criteria.
9. The student explicitly accepts the work or requests changes.

### What is AI-generated, what is deterministic, and what needs approval

| Area | Handled by |
| --- | --- |
| Project brief, roles, skills, milestones | Gemma 4 — labeled as an AI-generated draft |
| Initial tasks and effort estimates | Gemma 4 — effort labeled as AI-estimated |
| Collaborator ranking ("project fit") | Deterministic TypeScript scoring from stored profile fields |
| Submission review | Gemma 4 — labeled as advisory |
| Saving a project, selecting collaborators, accepting work | Explicit user action only |

All model output is treated as untrusted: it is validated against schemas server-side before use, and the model never executes SQL, shell commands, code, or URLs.

## Tech stack (planned)

- Next.js (App Router) + TypeScript
- Tailwind CSS (shadcn/ui where useful)
- Supabase (Postgres) for persistence — optional for the first local prototype
- Gemma 4 via a local inference runtime (e.g. Ollama), called only from server-side routes

No paid AI APIs, job-board integrations, scraping, email/SMS, or GitHub OAuth.

## Getting started

> Setup instructions will be completed once the app is scaffolded. Planned steps:

1. **Prerequisites:** Node.js 20+, npm, and a local inference runtime with a Gemma 4 model.
2. **Install dependencies:** `npm install`
3. **Configure environment:** copy `.env.example` to `.env.local` and fill in values:
   ```bash
   OLLAMA_BASE_URL=http://localhost:11434
   GEMMA_MODEL=REPLACE_WITH_VERIFIED_GEMMA_4_MODEL_TAG
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
   Never commit `.env.local`. Never expose the service-role key to the browser.
4. **Run Gemma locally:** start your runtime and confirm the model responds. The exact model tag will be documented here once verified.
5. **Run the app:** `npm run dev`

**Model variant/runtime tested:** _not yet tested._

## Demo mode

The MVP uses clearly labeled **fictional demo profiles** as seed data. They are not real people, and no real invitations are ever sent; invitations are simulated in-app.

## Not implemented (out of scope for the MVP)

Internship/job listings or scraping, LinkedIn/Indeed/Handshake integrations, email/SMS/push notifications, real invitations, GitHub integration, code execution or deployment, payments, real-time chat, video calls, calendar integrations, native mobile apps, and multi-agent orchestration.

## Known limitations

- AI reviews are advisory and cannot certify that work is correct.
- "Project fit" is a transparent skills-overlap heuristic, not a measure of compatibility or likelihood of success.
- A `localhost` Gemma endpoint is not reachable from a remotely deployed app.

## Repository layout

```text
CLAUDE.md          Mandatory instructions for AI-assisted development
docs/MVP_SPEC.md   Product and engineering specification (source of truth)
docs/design/       Google Stitch screenshots and design assets
```

## License

Released under the [MIT License](LICENSE).


