# Because of Sales — Offers Page

A Next.js page that sits between Beehiiv's subscriber survey (page 2) and thank-you page (page 4), letting new subscribers claim free third-party resources.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo in Vercel — it auto-detects Next.js
3. Set environment variables (when you add Supabase):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Beehiiv Redirect URL

In Beehiiv: **Publication Settings → Subscribe Flow → Post-subscribe redirect URL**

```
https://your-vercel-domain.vercel.app/?email={{subscriber.email}}
```

Beehiiv will inject the subscriber's email as a URL parameter automatically.

## Wiring Up the Backend (next steps)

1. **Beehiiv Webhook** — point Beehiiv's webhook to `/api/opt-in` to receive survey data keyed by email
2. **Supabase** — uncomment the Supabase block in `app/api/opt-in/route.ts` and add your keys
3. **Partner delivery** — add an email send (Resend/SendGrid) or CRM webhook in the same route

## File Structure

```
app/
  page.tsx            # Server component — reads ?email= from URL
  OffersClient.tsx    # All interactive UI
  offers.module.css   # Scoped styles
  globals.css         # CSS variables + resets
  layout.tsx          # Google Fonts, metadata
  api/opt-in/
    route.ts          # POST endpoint — receives opt-in payload
public/
  logo.jpg            # Because of Sales horizontal logo
```
