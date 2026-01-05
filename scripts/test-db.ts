
import { client } from '@/db';

async function testConnection() {
    console.log('🔌 Testing Database Connection...');
    console.log('URL (Masked):', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));

    try {
        const res = await client`SELECT 1 as connected`;
        console.log('✅ Connection Successful!', res);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
        console.log('\n--- Troubleshooting ---');
        console.log('1. Check your Password in .env.local');
        console.log('2. Ensure no Firewalls are blocking port 5432 or 6543');
        console.log('3. Supabase projects go to sleep after inactivity - log in to dashboard to wake it up.');
    } finally {
        process.exit(0);
    }
}

testConnection();
