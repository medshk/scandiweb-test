# Google Cloud Run Deployment Guide

## Prerequisites

1. Google Cloud project with billing enabled
2. Cloud SQL PostgreSQL instance created and running
3. Database and user created in Cloud SQL
4. `gcloud` CLI installed and authenticated
5. Cloud Build API enabled
6. Cloud Run API enabled
7. Secret Manager API enabled (for DB password)

---

## Step 1: Store DB Password in Secret Manager

```bash
gcloud secrets create db-password --data-file=- <<< "YOUR_DB_PASSWORD"
```

---

## Step 2: Build and Deploy

### Option A: Cloud Build (recommended)

Update `cloudbuild.yaml` with your values:
- `_CLOUD_SQL_INSTANCE`: your-project:region:instance-name
- `_DB_NAME`, `_DB_USER`: your database credentials

Then run:
```bash
cd backend
gcloud builds submit --config cloudbuild.yaml
```

### Option B: Manual Deploy

```bash
# 1. Build image
cd backend
docker build -t gcr.io/YOUR_PROJECT_ID/scandiweb-backend .

# 2. Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/scandiweb-backend

# 3. Deploy to Cloud Run
gcloud run deploy scandiweb-backend \
  --image gcr.io/YOUR_PROJECT_ID/scandiweb-backend \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars DB_HOST=127.0.0.1,DB_PORT=5432,DB_NAME=scandiweb_ecommerce,DB_USER=scandiweb_user,DB_CHARSET=utf8 \
  --set-secrets DB_PASSWORD=db-password:latest \
  --add-cloudsql-instances YOUR_PROJECT:REGION:INSTANCE_NAME \
  --memory 512Mi \
  --cpu 1
```

---

## Step 3: Update Frontend URL

After deploying, Cloud Run will give you a URL like:
`https://scandiweb-backend-xxx-uc.a.run.app`

1. Update `frontend/.env`:
```
VITE_GRAPHQL_ENDPOINT=https://scandiweb-backend-xxx-uc.a.run.app/graphql
```

2. Update `backend/public/index.php` CORS:
```php
$allowedOrigins = [
    'https://your-frontend-url.web.app',  // Your frontend URL
    'http://localhost:5173',               // Local dev
];
```

3. Rebuild and deploy the frontend.

---

## Cloud SQL Connection Notes

When using `--add-cloudsql-instances`, Cloud Run automatically starts a Cloud SQL Proxy sidecar. Your app connects to:
- Host: `127.0.0.1`
- Port: `5432`

The proxy handles authentication to Cloud SQL automatically.

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host (use 127.0.0.1 for Cloud SQL Proxy) | `127.0.0.1` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `scandiweb_ecommerce` |
| `DB_USER` | Database user | `scandiweb_user` |
| `DB_PASSWORD` | Database password (from Secret Manager) | (secret) |
| `DB_CHARSET` | Character set | `utf8` |

---

## Troubleshooting

### Health Checks
Cloud Run sends health checks to `/health`. This endpoint is already implemented.

### Database Connection Failed
1. Check Cloud SQL instance is in the same region as Cloud Run
2. Verify the Cloud SQL connection name is correct
3. Check Secret Manager has the right password
4. Use `/debug` endpoint to test connection (remove in production)

### CORS Errors
1. Make sure your frontend URL is in `$allowedOrigins` in `index.php`
2. Cloud Run URL must match exactly (including `https://`)
