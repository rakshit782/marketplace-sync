# Contributing to Marketplace Sync

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Be respectful and professional in all interactions. We're building this together.

## How Can I Contribute?

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use a clear title** that describes the issue
3. **Provide details**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (Node version, OS, etc.)
   - Error messages or logs

### Suggesting Features

1. **Check existing issues** for similar suggestions
2. **Describe the use case** - why is this needed?
3. **Explain the expected behavior**
4. **Provide examples** if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test your changes**
5. **Commit with clear messages**: `git commit -m 'Add feature: description'`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/marketplace-sync.git
cd marketplace-sync

# Add upstream remote
git remote add upstream https://github.com/rakshit782/marketplace-sync.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Set up database
psql -U postgres -d marketplace_sync -f docs/DATABASE_SETUP.md

# Start development server
npm run dev
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Code Style Guidelines

### JavaScript

- Use ES6+ syntax
- Use `const` and `let`, avoid `var`
- Use async/await instead of callbacks
- Use template literals for strings
- Add comments for complex logic

### Example:

```javascript
// Good
const getUserById = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Avoid
function getUserById(userId, callback) {
  pool.query('SELECT * FROM users WHERE id = ' + userId, function(err, result) {
    if (err) return callback(err);
    callback(null, result.rows[0]);
  });
}
```

### Database Queries

- **Always use parameterized queries** (prevent SQL injection)
- Use descriptive column names
- Add indexes for frequently queried columns

```javascript
// Good
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// NEVER do this
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### Error Handling

- Always use try-catch blocks
- Log errors with context
- Return appropriate HTTP status codes
- Don't expose sensitive information in error messages

```javascript
try {
  // Your code
} catch (error) {
  console.error('Context about what failed:', error);
  res.status(500).json({
    success: false,
    error: 'Generic user-friendly message'
  });
}
```

## Testing

### Before Submitting PR

- [ ] All endpoints tested manually
- [ ] No console errors
- [ ] Database queries optimized
- [ ] Error cases handled
- [ ] Code follows style guidelines
- [ ] No sensitive data in commits

### Testing Checklist

```bash
# Test all CRUD operations
curl http://localhost:3001/api/health
curl http://localhost:3001/api/credentials/list
# ... test all endpoints

# Check for errors
npm run dev
# Monitor console for errors

# Verify database
psql -U postgres -d marketplace_sync
SELECT * FROM marketplace_credentials;
```

## Commit Message Guidelines

### Format

```
type: short description

Longer description if needed
- Bullet points for changes
- More details

Closes #issue-number
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```
feat: add Walmart API integration

- Add Walmart credentials endpoint
- Implement order sync
- Add error handling

Closes #42
```

```
fix: correct response structure in GET /credentials/:marketplace

Fixed bug where response returned undefined for lastVerified
and isActive fields due to incorrect array access.

Closes #15
```

## Pull Request Guidelines

### PR Title

Use the same format as commit messages:
- `feat: add new feature`
- `fix: resolve bug with X`
- `docs: update README`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All endpoints working
- [ ] No errors in console

## Checklist
- [ ] Code follows style guidelines
- [ ] No sensitive data committed
- [ ] Documentation updated
- [ ] No breaking changes

## Related Issues
Closes #issue-number
```

## Project Structure

```
marketplace-sync/
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore rules
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── README.md           # Project documentation
├── CHANGELOG.md        # Version history
├── CONTRIBUTING.md     # This file
├── SECURITY.md         # Security policies
└── docs/
    └── DATABASE_SETUP.md
```

## Review Process

1. **Automated checks** (coming soon)
   - Linting
   - Tests
   - Security scan

2. **Code review**
   - Maintainer reviews code
   - Provides feedback
   - Approves or requests changes

3. **Merge**
   - Once approved, PR is merged
   - Branch is deleted

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with your question
4. Tag it with `question` label

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Thanked in CHANGELOG

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to Marketplace Sync! 🚀