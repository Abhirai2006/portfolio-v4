# Security notes

A short list of what is protected, what is public on purpose, and what to do if something looks wrong.

## What is public on purpose

- The Supabase URL and the **publishable** keys in `.env`. They are built to be used in the browser. What they can do is decided by Row Level Security in the database, not by keeping them secret.
- The reviews and anime recommendations people submit.

## What is kept secret

- `AI_API_KEY` (and `GITHUB_TOKEN` if used) live only in Cloudflare as **Secrets**. The code reads them on the server and they never reach the browser. The built files were scanned for keys and none were found.
- There is no Supabase service-role key anywhere in the project.

## Nobody can change or delete data

Every table has Row Level Security turned on. Visitors can only:

| Table | Can read | Can add | Can edit or delete |
| --- | --- | --- | --- |
| `reviews` | published ones | yes, with length and rating checks | no |
| `site_events` | no | yes, with checks | no |
| `site_visitor_totals` | yes | through the counter function only | no |
| `site_visitor_sessions` | no | through the counter function only | no |
| `recommendations` and votes (anime page) | yes | yes, with length checks | no |

`supabase/migrations/20261004000000_lock_down_writes.sql` also revokes edit and delete rights explicitly, in case one is ever granted by mistake. Run it once in the SQL editor if you manage the database yourself.

The anime recommendations live in a separate Supabase project. Run this there too:

```sql
REVOKE UPDATE, DELETE, TRUNCATE ON public.recommendations FROM anon, authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON public.recommendation_votes FROM anon, authenticated;
```

To remove a bad review or recommendation, open the table in the Supabase dashboard and delete the row, or set `published` / `hidden` as needed.

## What the server code does

- `/api/chat` only accepts same-site requests, checks the shape and size of the messages, caps the reply length and limits each visitor to 12 messages a minute.
- The anime page's server functions (mood search, recommendations, votes) have the same origin check and per-visitor limits, and cover images can only come from the Kitsu image host.
- `/api/public/poster` only fetches images from Kitsu over https, does not follow redirects, refuses anything that is not a normal image (no SVG) and caps the size.
- Every response carries `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS headers (see `src/server.ts`).
- All external links use `rel="noreferrer"`, and nothing renders user text as HTML.

The in-code rate limit is per server instance, so it slows abuse down but is not a hard cap. Add a real one in Cloudflare:

1. Dashboard → your domain or Worker → **Security** → **WAF** → **Rate limiting rules**.
2. Match the path `/api/chat`, limit to about 10 requests per minute per IP, action **Block**.
3. For stronger spam protection on the review and recommendation forms, add Cloudflare Turnstile.

## If a key leaks

1. Delete the key where it was issued (Google AI Studio, GitHub, Supabase).
2. Create a new one and add it in Cloudflare as a Secret.
3. Redeploy.

Report a security problem by emailing abhirai2006@gmail.com.
