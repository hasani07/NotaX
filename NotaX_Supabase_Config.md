# NotaX Supabase Configuration

## Supabase Account
- **Login Email:** hasani.devtech@gmail.com

## Project Details
- **Project Ref / Project ID:** `rfdiydqzeyvzphbwpoxf`
- **Project URL:** `https://rfdiydqzeyvzphbwpoxf.supabase.co`

## Frontend Key
- **Publishable / Anon Key:**  
  `sb_publishable_mJtTaRCwcPooa1oLfOssaw_uYPTKcb0`

## Frontend Configuration

```js
const SUPABASE_URL = 'https://rfdiydqzeyvzphbwpoxf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mJtTaRCwcPooa1oLfOssaw_uYPTKcb0';
```

## Notes
- The key above is a **publishable / anon key**, intended for frontend use.
- Do **not** place a `service_role` key in frontend code or public GitHub repositories.
- Security for public frontend access should be enforced using **Row Level Security (RLS)** policies in Supabase.

## Vercel Account
- **Login Email:** hasani7group@gmail.com

## Deployment Notes
- NotaX frontend is intended to be deployed on Vercel.
- Keep deployment secrets and any private server-side credentials in Vercel Environment Variables.
- Do **not** store passwords, service-role keys, or other private credentials in this Markdown file or public repositories.

