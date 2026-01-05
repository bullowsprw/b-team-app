
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// DEBUG: Check what connection string we are actually using
const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) console.error("❌ process.env.DATABASE_URL is UNDEFINED");
else console.log("🔌 process.env.DATABASE_URL found:", rawUrl.replace(/:[^:@]*@/, ':****@').split('@')[1]);

const connectionString = rawUrl || 'postgres://postgres:postgres@localhost:5432/b_team_db';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, {
    prepare: false,
    ssl: 'require'
});
export const db = drizzle(client, { schema });
