# app/api — Route Handlers

All handlers use the Node.js runtime. They use `fs`/`sharp`, so do not switch them to edge.
`app/og/route.tsx`, which lives outside this folder, is the only edge route.

## `chat/route.ts`: POST `{ message: string }` → `{ reply }` | `{ error }`
- Uses `groq-sdk` with model `llama-3.1-8b-instant` and reads `GROQ_API_KEY`.
- Stateless and single-turn: there is no conversation history and no streaming. Each call sends the system prompt plus one user message.
- `generateSystemPrompt()` is rebuilt on **every request**. It concatenates the `about-data` `mainContent`,
  every project's `longDescription`, its technologies, and the markdown it reads with `fs` from `app/_data/content/`.
  The model is told to answer only from that context and to refer to Iheb in the third person.
- Response types are in `api/models/MessageResp.ts` (`MessageResp`, `MessageRespError`). These types are also
  imported client-side by `components/terminal/terminal.tsx`.
- Client: `components/terminal/terminal.tsx` handles the `help` and `clear` commands locally and sends everything else here.

## `contact/route.ts`: POST `{ name, email, subject, message }`
- Validates with a **loose** zod schema (`z.string()`). The stricter client schema with min/max lengths is in
  `components/contact/schema.ts`. If you change validation, update both.
- Sends through Resend from `onboarding@resend.dev` to `EMAIL_ADDRESS` with the subject `Portfolio: <subject>`.
  It returns 500 if `EMAIL_ADDRESS` or `RESEND_API_KEY` is missing.
- User input is interpolated into the HTML without escaping.

## `images/[...path]/route.ts`: GET `/api/images/<path under public>?w=&h=&q=&f=`
- Reads `public/<path>` and resizes it with sharp (`fit: inside`, no enlargement). `f` accepts jpeg, png, webp or avif
  (default webp). `q` defaults to 80.
- Sends `Cache-Control: public, max-age=31536000, immutable`.
- `components/ui/lazy-image.tsx` routes `src` values that start with `/images/` through this endpoint.
  `/optimized/...` paths, which most project data uses, are served statically and skip it.
- There is no explicit path-traversal check.

## `models/MessageResp.ts`
Shared request and response types. This file is not a route.
