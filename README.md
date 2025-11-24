# Marketplace Sync

🔄 Backend API for multi-marketplace integration - sync products, inventory, orders, and credentials across Amazon, Walmart, eBay, Etsy, and Shopify.

## 🚀 Features

- **Multi-marketplace credential management** - Securely store and manage API credentials for multiple marketplaces
- **RESTful API** - Clean, well-documented endpoints for all operations
- **Database-backed** - PostgreSQL for reliable credential storage
- **Audit logging** - Track all credential changes and verification attempts
- **CORS enabled** - Ready for frontend integration
- **Production-ready** - Deployed on Vercel with SSL support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL (via pg)
- **Deployment**: Vercel
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/rakshit782/marketplace-sync.git
cd marketplace-sync
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3001
```

4. **Set up the database**

Run the schema setup (see Database Schema section below)

5. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🗄️ Database Schema

### marketplace_credentials table
```sql
CREATE TABLE marketplace_credentials (
  id SERIAL PRIMARY KEY,
  marketplace VARCHAR(50) NOT NULL UNIQUE,
  credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### credential_changes table (audit log)
```sql
CREATE TABLE credential_changes (
  id SERIAL PRIMARY KEY,
  marketplace VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### List All Credentials
```
GET /api/credentials/list
```
Returns all marketplace credentials (without sensitive data)

### Get Specific Marketplace Credentials
```
GET /api/credentials/:marketplace
```
Returns connection status for specific marketplace

**Parameters:**
- `marketplace` - amazon, walmart, ebay, etsy, shopify

### Add/Update Credentials
```
POST /api/credentials/add
```
Add new or update existing marketplace credentials

**Request Body:**
```json
{
  "marketplace": "amazon",
  "credentials": {
    "accessKey": "your-access-key",
    "secretKey": "your-secret-key",
    "sellerId": "your-seller-id",
    "region": "us-east-1"
  }
}
```

### Update Credentials
```
PUT /api/credentials/:marketplace
```
Update existing marketplace credentials

**Request Body:**
```json
{
  "credentials": {
    "accessKey": "new-access-key",
    "secretKey": "new-secret-key"
  }
}
```

### Test Credentials
```
POST /api/credentials/:marketplace/test
```
Test if credentials are valid

**Request Body:**
```json
{
  "credentials": {
    "accessKey": "your-access-key",
    "secretKey": "your-secret-key"
  }
}
```

### Delete Credentials
```
DELETE /api/credentials/:marketplace
```
Remove marketplace credentials

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
- `DATABASE_URL` - Your PostgreSQL connection string

4. **Add database URL as Vercel secret**
```bash
vercel env add DATABASE_URL
```

## 🔐 Security Notes

- ✅ All credentials are stored encrypted in PostgreSQL JSONB format
- ✅ SSL required for database connections in production
- ✅ CORS enabled for authorized domains only
- ✅ Environment variables for sensitive configuration
- ⚠️ Never commit `.env` file to version control
- ⚠️ Regularly rotate API credentials

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port (default: 3001) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👤 Author

**Rakshit Vaish**
- GitHub: [@rakshit782](https://github.com/rakshit782)

## 🔗 Related Projects

- Frontend integration (coming soon)
- Shopify app integration
- Amazon SP-API connector
- Walmart Marketplace API

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

⭐ Star this repo if you find it helpful!