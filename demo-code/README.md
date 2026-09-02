# Technical Samples

These files are **sanitized portfolio samples derived from EscenaIA Studio's private production codebase**.

They are intentionally small and reviewable. They demonstrate selected engineering patterns without publishing the complete Core, internal prompts, production configuration, credentials, database schema, private endpoints, or proprietary implementation details.

## Samples

- `ai-authority-gate.mjs` — prevents learned AI output from claiming deterministic or user-confirmed authority.
- `conversational-output-safety.mjs` — fail-closed sanitization for structured AI output.
- `human-review-proposal-flow.mjs` — proposal-first, immutable version flow with stale-version conflict protection.
- `secure-session-cookie.mjs` — signed transaction state and secure cookie primitives.
- `brain-contract.test.mjs` — runnable Node.js tests for authority and sanitizer behavior.

## Run the public tests

```bash
node --test demo-code/brain-contract.test.mjs
```

## Important

These examples are not a drop-in copy of the private production repository. Names, boundaries and implementation details have been reduced where necessary for security and intellectual-property protection.

The private system uses a larger Node.js/Fastify/PostgreSQL architecture with project memory, versioned domain state, provider routing, human review, QA gates and local AI workflows.
