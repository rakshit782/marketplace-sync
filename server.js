const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all credentials (without sensitive data)
app.get('/api/credentials/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT marketplace, last_verified, is_active FROM marketplace_credentials'
    );
    res.json({
      success: true,
      credentials: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credentials'
    });
  }
});

// Get specific marketplace credentials
app.get('/api/credentials/:marketplace', async (req, res) => {
  try {
    const { marketplace } = req.params;
    const result = await pool.query(
      'SELECT marketplace, last_verified, is_active FROM marketplace_credentials WHERE marketplace = $1',
      [marketplace.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        connected: false,
        marketplace: marketplace
      });
    }

    res.json({
      success: true,
      connected: true,
      marketplace: marketplace,
      lastVerified: result.rows.last_verified,
      isActive: result.rows.is_active
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credentials'
    });
  }
});

// Add or update credentials
app.post('/api/credentials/add', async (req, res) => {
  try {
    const { marketplace, credentials } = req.body;

    if (!marketplace || !credentials) {
      return res.status(400).json({
        success: false,
        error: 'Missing marketplace or credentials'
      });
    }

    const marketplaceLower = marketplace.toLowerCase();

    // Check if exists
    const existing = await pool.query(
      'SELECT id FROM marketplace_credentials WHERE marketplace = $1',
      [marketplaceLower]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update
      result = await pool.query(
        `UPDATE marketplace_credentials 
         SET credentials = $1, updated_at = CURRENT_TIMESTAMP, is_active = true 
         WHERE marketplace = $2 
         RETURNING id`,
        [JSON.stringify(credentials), marketplaceLower]
      );

      await pool.query(
        'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
        [marketplaceLower, 'updated', 'success']
      );
    } else {
      // Create
      result = await pool.query(
        `INSERT INTO marketplace_credentials (marketplace, credentials) 
         VALUES ($1, $2) 
         RETURNING id`,
        [marketplaceLower, JSON.stringify(credentials)]
      );

      await pool.query(
        'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
        [marketplaceLower, 'created', 'success']
      );
    }

    res.json({
      success: true,
      credentialId: result.rows.id,
      message: 'Credentials saved successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    
    await pool.query(
      'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
      [req.body.marketplace?.toLowerCase(), 'created', 'failed']
    ).catch(console.error);

    res.status(500).json({
      success: false,
      error: 'Failed to save credentials'
    });
  }
});

// Update credentials
app.put('/api/credentials/:marketplace', async (req, res) => {
  try {
    const { marketplace } = req.params;
    const { credentials } = req.body;

    if (!credentials) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials'
      });
    }

    const marketplaceLower = marketplace.toLowerCase();

    const result = await pool.query(
      `UPDATE marketplace_credentials 
       SET credentials = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE marketplace = $2 
       RETURNING id`,
      [JSON.stringify(credentials), marketplaceLower]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Credentials not found'
      });
    }

    await pool.query(
      'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
      [marketplaceLower, 'updated', 'success']
    );

    res.json({
      success: true,
      message: 'Credentials updated successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update credentials'
    });
  }
});

// Test credentials (placeholder - implement actual API testing)
app.post('/api/credentials/:marketplace/test', async (req, res) => {
  try {
    const { marketplace } = req.params;
    const { credentials } = req.body;

    // Implement actual testing logic here based on marketplace
    // For now, simulate successful test
    
    const marketplaceLower = marketplace.toLowerCase();

    // Update last_verified timestamp
    await pool.query(
      `UPDATE marketplace_credentials 
       SET last_verified = CURRENT_TIMESTAMP 
       WHERE marketplace = $1`,
      [marketplaceLower]
    );

    await pool.query(
      'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
      [marketplaceLower, 'verified', 'success']
    );

    res.json({
      success: true,
      message: 'Connection test successful'
    });
  } catch (error) {
    console.error('Test error:', error);
    
    await pool.query(
      'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
      [req.params.marketplace?.toLowerCase(), 'verified', 'failed']
    ).catch(console.error);

    res.status(500).json({
      success: false,
      error: 'Connection test failed'
    });
  }
});

// Delete credentials
app.delete('/api/credentials/:marketplace', async (req, res) => {
  try {
    const { marketplace } = req.params;
    const marketplaceLower = marketplace.toLowerCase();

    const result = await pool.query(
      'DELETE FROM marketplace_credentials WHERE marketplace = $1',
      [marketplaceLower]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Credentials not found'
      });
    }

    await pool.query(
      'INSERT INTO credential_changes (marketplace, action, status) VALUES ($1, $2, $3)',
      [marketplaceLower, 'deleted', 'success']
    );

    res.json({
      success: true,
      message: 'Credentials removed successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete credentials'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
