# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-11-24

### Fixed
- **CRITICAL**: Fixed bug in `server.js` line 54 - `result.rows.last_verified` changed to `result.rows[0].last_verified`
- **CRITICAL**: Fixed bug in `server.js` line 55 - `result.rows.is_active` changed to `result.rows[0].is_active`
- **CRITICAL**: Fixed bug in `server.js` line 93 - `result.rows.id` changed to `result.rows[0].id`
- **CRITICAL**: Fixed bug in `server.js` line 115 - `result.rows.id` changed to `result.rows[0].id`

### Security
- **CRITICAL**: Removed `.env` file from repository (contained sensitive credentials)
- Added `.gitignore` to prevent future accidental commits of sensitive files
- Created issue #1 to document node_modules removal from Git history

### Added
- Comprehensive `README.md` with full documentation
- `SECURITY.md` with security best practices and policies
- `docs/DATABASE_SETUP.md` with complete database setup guide
- `CHANGELOG.md` to track all changes

### Changed
- Updated `package.json` with proper project name: `marketplace-sync`
- Added project description to `package.json`
- Added relevant keywords to `package.json`
- Added author name to `package.json`
- Removed unnecessary `git` dependency from `package.json`
- Removed unnecessary `vercel` dependency from production dependencies

### Documentation
- Added API endpoint documentation in README
- Added database schema documentation
- Added deployment guide for Vercel
- Added security checklist
- Added environment variable documentation
- Added troubleshooting guides

## [1.0.0] - 2025-11-24

### Initial Release
- Basic Express.js server setup
- PostgreSQL database integration
- Marketplace credential management endpoints
- CORS support
- Vercel deployment configuration
- Basic error handling

---

## Summary of Critical Fixes

### Code Bugs (Production Issues)

All four bugs were in the credential response handling:

1. **GET /api/credentials/:marketplace** - Lines 54-55
   - Attempted to access properties directly on `result.rows` array
   - Should access first element: `result.rows[0]`
   - **Impact**: API returns `undefined` for `lastVerified` and `isActive`

2. **POST /api/credentials/add** - Line 93
   - Returned `result.rows.id` instead of `result.rows[0].id`
   - **Impact**: API returns `undefined` for `credentialId` in response

3. **PUT /api/credentials/:marketplace** - Line 115
   - Same issue as above
   - **Impact**: Credential updates fail silently

### Security Issues (Critical)

1. **Exposed `.env` file**
   - Contained database credentials and API keys
   - Publicly visible on GitHub
   - **Action Taken**: Removed from repository
   - **Recommendation**: Rotate all exposed credentials immediately

2. **node_modules in Git**
   - 191KB package-lock.json committed
   - Full node_modules directory tracked
   - **Action Taken**: Created issue #1 with removal instructions
   - **Status**: Requires manual cleanup by repository owner

### Repository Quality

1. **Missing Documentation**
   - No README, no setup guide, no API docs
   - **Action Taken**: Added comprehensive documentation

2. **Poor package.json**
   - Generic name "new-perp-1"
   - No description or keywords
   - Unnecessary dependencies
   - **Action Taken**: Complete package.json overhaul

---

## Migration Guide

If you're upgrading from the previous version:

1. **Update your local repository**
   ```bash
   git pull origin main
   npm install
   ```

2. **Create new .env file**
   - The old `.env` was removed for security
   - Copy from `.env.example` (coming soon)
   - Add your credentials

3. **Update Vercel environment variables**
   - Ensure `DATABASE_URL` is set
   - All other credentials should be added as needed

4. **Test the fixes**
   - All credential endpoints should now return correct data
   - Verify `credentialId`, `lastVerified`, `isActive` are populated

---

## Next Steps

- [ ] Remove node_modules from Git history (see issue #1)
- [ ] Rotate all exposed API credentials
- [ ] Add authentication middleware
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up CI/CD pipeline
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Set up error monitoring (Sentry)
- [ ] Add API documentation (Swagger/OpenAPI)