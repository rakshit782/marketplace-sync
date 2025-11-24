# Database Setup Guide

This guide will help you set up the PostgreSQL database for Marketplace Sync.

## Prerequisites

- PostgreSQL 12+ installed (local or cloud)
- Database access credentials
- psql CLI or GUI tool (pgAdmin, DBeaver, etc.)

## Quick Start

### Option 1: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U your_username -d postgres

# Create database
CREATE DATABASE marketplace_sync;

# Connect to the new database
\c marketplace_sync

# Run the schema (copy-paste from below)
```

### Option 2: Using GUI Tool

1. Open pgAdmin/DBeaver
2. Create a new database named `marketplace_sync`
3. Open SQL query editor
4. Copy-paste and run the schema below

## Database Schema

```sql
-- Create marketplace_credentials table
CREATE TABLE IF NOT EXISTS marketplace_credentials (
  id SERIAL PRIMARY KEY,
  marketplace VARCHAR(50) NOT NULL UNIQUE,
  credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create credential_changes table (audit log)
CREATE TABLE IF NOT EXISTS credential_changes (
  id SERIAL PRIMARY KEY,
  marketplace VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_credentials_marketplace 
  ON marketplace_credentials(marketplace);

CREATE INDEX IF NOT EXISTS idx_marketplace_credentials_is_active 
  ON marketplace_credentials(is_active);

CREATE INDEX IF NOT EXISTS idx_credential_changes_marketplace 
  ON credential_changes(marketplace);

CREATE INDEX IF NOT EXISTS idx_credential_changes_created_at 
  ON credential_changes(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE marketplace_credentials IS 'Stores encrypted API credentials for various marketplaces';
COMMENT ON TABLE credential_changes IS 'Audit log for all credential-related operations';

COMMENT ON COLUMN marketplace_credentials.marketplace IS 'Marketplace identifier (amazon, walmart, ebay, etsy, shopify)';
COMMENT ON COLUMN marketplace_credentials.credentials IS 'Encrypted JSON containing API keys and tokens';
COMMENT ON COLUMN marketplace_credentials.is_active IS 'Whether these credentials are currently active';
COMMENT ON COLUMN marketplace_credentials.last_verified IS 'Timestamp of last successful credential verification';

COMMENT ON COLUMN credential_changes.action IS 'Action type: created, updated, verified, deleted';
COMMENT ON COLUMN credential_changes.status IS 'Action status: success or failed';
```

## Verify Installation

```sql
-- Check if tables were created
\dt

-- View table structure
\d marketplace_credentials
\d credential_changes

-- Test insert
INSERT INTO marketplace_credentials (marketplace, credentials) 
VALUES ('test', '{"key": "value"}');

-- Verify insert
SELECT * FROM marketplace_credentials;

-- Clean up test data
DELETE FROM marketplace_credentials WHERE marketplace = 'test';
```

## Cloud Database Options

### Supabase (Recommended for this project)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Use SQL Editor to run schema
5. Add connection string to `.env`:
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### Neon.tech

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Run schema in SQL Editor
5. Add to `.env`

### Railway

1. Go to [railway.app](https://railway.app)
2. New Project > PostgreSQL
3. Copy connection string
4. Connect via psql and run schema
5. Add to `.env`

### Heroku Postgres

1. Heroku dashboard > Resources
2. Add Heroku Postgres
3. Settings > Database Credentials
4. Run schema via Heroku CLI:
   ```bash
   heroku pg:psql < schema.sql
   ```

## Environment Configuration

Update your `.env` file:

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[parameters]
```

Example:
```
postgresql://admin:secret123@localhost:5432/marketplace_sync?sslmode=require
```

## Common Issues

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Authentication Failed

```bash
# Reset password
sudo -u postgres psql
ALTER USER your_username WITH PASSWORD 'new_password';
```

### SSL Required

Add to connection string:
```
?sslmode=require
```

Or in code (already implemented):
```javascript
ssl: { rejectUnauthorized: false }
```

## Backup and Restore

### Backup

```bash
pg_dump -U username -d marketplace_sync > backup.sql
```

### Restore

```bash
psql -U username -d marketplace_sync < backup.sql
```

## Maintenance

### View Audit Log

```sql
SELECT * FROM credential_changes 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Active Credentials

```sql
SELECT marketplace, is_active, last_verified 
FROM marketplace_credentials;
```

### Clean Old Audit Logs (older than 90 days)

```sql
DELETE FROM credential_changes 
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Performance Tips

1. **Regular VACUUM**
   ```sql
   VACUUM ANALYZE marketplace_credentials;
   VACUUM ANALYZE credential_changes;
   ```

2. **Monitor Query Performance**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM marketplace_credentials WHERE marketplace = 'amazon';
   ```

3. **Index Usage**
   ```sql
   SELECT * FROM pg_stat_user_indexes;
   ```

## Security Checklist

- [ ] Use SSL connections in production
- [ ] Set strong database password
- [ ] Enable connection pooling (already implemented)
- [ ] Regular backups scheduled
- [ ] Audit logs monitored
- [ ] Database user has minimal required permissions
- [ ] Connection string stored securely (not in code)

## Need Help?

If you encounter issues:
1. Check PostgreSQL logs
2. Verify connection string format
3. Test connection with psql
4. Check firewall/security groups
5. Open an issue on GitHub

---

Last Updated: November 24, 2025