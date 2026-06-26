# TaskMaster : Sample App (deliberately imperfect)

A tiny **TypeScript + Express** task API. It works well enough to run, but it contains **planted problems** that you will discover and fix during the workshop. Do **not** fix them ahead of time, each module asks you to drive the agent to find and resolve them.

> This is a teaching artifact. The bugs and gaps are intentional.

---

## Run it

```bash
cd sample-app
npm install
npm run build      # compiles TypeScript -> dist/
npm test           # runs Jest (one test FAILS on purpose)
npm run dev        # starts the API on http://localhost:3000
```

Try it:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
curl "http://localhost:3000/tasks?minPriority=2"
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task","priority":3}'
```

---

## API surface

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/tasks` | List all tasks; `?minPriority=` filters |
| GET | `/tasks/top?limit=` | Highest-priority tasks first |
| GET | `/tasks/search?q=` | Search task titles |
| POST | `/tasks` | Create a task |

---

## The planted issues (facilitator reference)

> 🔒 **Participants:** try not to read this list too closely before the labs, discovering these *with the agent* is the point. It's here so facilitators can verify outcomes.

<details>
<summary>Spoilers : the intentional problems</summary>

1. **Functional bug — off-by-one filter.** `filterByMinPriority` in
   [`src/tasks.ts`](src/tasks.ts) uses `>` instead of `>=`, so a "minimum priority" filter
   wrongly excludes tasks exactly equal to the threshold.
2. **A failing test.** `src/tasks.test.ts` has a test (`includes tasks exactly equal to the
   threshold`) that fails because of issue #1. Fixing the bug makes it pass.
3. **Missing input validation.** `POST /tasks` in [`src/routes.ts`](src/routes.ts) trusts the
   body completely — empty/missing `title`, out-of-range `priority`, and oversized payloads are
   all accepted.
4. **Security vuln — ReDoS.** `GET /tasks/search` builds a `RegExp` directly from user input,
   enabling catastrophic-backtracking denial of service.
5. **No linter configuration.** There is no ESLint config, so `npm run lint` cannot enforce
   anything yet.
6. **No persistent agent instructions.** There is no `.github/copilot-instructions.md` /
   `AGENTS.md`, so the agent has no project conventions to follow.
7. **Refactor target.** Routing, business logic, and the in-memory store are loosely tangled —
   a good candidate for the Research → Plan → Implement workflow lab.

</details>

---

## How the modules use this app

| Module | What you do here |
| --- | --- |
| 03 Model selection | Use a big model to *find* the filter bug; smaller to apply the fix |
| 04 Context optimization | Attach only the 2–3 files needed to fix `filterByMinPriority` |
| 05 Prompt engineering | Write a precise prompt with stop conditions to fix the test |
| 06 Workflow design | Research → Plan → Implement the validation for `POST /tasks` |
| 07 Deterministic controls | Add ESLint + tests + fix the ReDoS as guardrails |
| 08 Advanced controls | Add `copilot-instructions.md` / `AGENTS.md` and reuse it |
| 10 Capstone | Combine all five levers end-to-end |
