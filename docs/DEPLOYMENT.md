# Deployment Guide

This guide covers deploying Marketplace Sync to various platforms.

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- PostgreSQL database (Supabase, Neon, Railway, etc.)
- GitHub repository connected

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Settings > Environment Variables
3. Add:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - `production`

### Step 4: Deploy

```bash
vercel
```

Follow the prompts. Your API will be live at `https://your-project.vercel.app`

### Continuous Deployment

Once connected to GitHub, every push to `main` branch triggers automatic deployment.

---

## Database Setup

### Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run schema from `docs/DATABASE_SETUP.md`
4. Get connection string from Settings > Database
5. Add to Vercel environment variables

**Connection String Format:**
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

---

## Custom Domain

### Add Custom Domain in Vercel

1. Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for verification (usually 5-10 minutes)

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)
- `ALLOWED_ORIGINS` - CORS allowed origins

---

## Post-Deployment

### Security Checklist
- [ ] Configure CORS for production domain only
- [ ] Add authentication middleware
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure SSL (automatic on Vercel)
- [ ] Verify environment variables
- [ ] Test all endpoints

### Testing Production

```bash
curl https://your-domain.vercel.app/api/health
```

Expected response:
```json
{"status":"ok"}
```

---

## Monitoring

### Vercel Analytics
- Automatic in Vercel Dashboard
- Shows requests, errors, performance

### Custom Monitoring
Add Sentry:

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## Troubleshooting

### Deployment Failed
1. Check Vercel logs
2. Verify `vercel.json` configuration
3. Ensure Node.js version compatibility

### Database Connection Error
1. Verify `DATABASE_URL` in environment variables
2. Check database is accessible
3. Verify SSL settings

### 500 Errors
1. Check Vercel function logs
2. Verify all environment variables
3. Test database queries locally

---

For more help, see [Vercel Documentation](https://vercel.com/docs)