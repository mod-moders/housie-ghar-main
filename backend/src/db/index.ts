/**
 * PostgreSQL connection pool
 */

import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,                       // Maximum number of connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // bumped from 2000 — public proxy has more latency than internal network
  ssl: {
    rejectUnauthorized: false,   // Railway's managed Postgres uses certs Node won't validate by default
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('📦 PostgreSQL client connected');
});

export default pool;