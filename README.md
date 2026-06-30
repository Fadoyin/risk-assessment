# Psychiatric Risk Assessment

Clinical worksheet for documenting suicide, self-harm, and risk-to-others assessments. Submissions generate a narrative summary and are stored in a shared response list.

## Deploy to Vercel

1. Import this repository in [Vercel](https://vercel.com/new).
2. In the Vercel project, open **Storage** → **Create Database** → **KV** and connect it to the project.
3. Deploy. No other environment variables are required.

The app serves a static `index.html` and uses `/api/responses` with Vercel KV for shared storage across users.

## Local development

```bash
npm install
npx vercel dev
```

Use `vercel dev` (not a plain static server) so the `/api/responses` route and KV binding work locally.

## Disclaimer

This tool supports clinical documentation only. It does not replace clinical judgment, supervision, or your service's safeguarding / crisis protocol.
