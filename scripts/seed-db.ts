
import { db, client } from '@/db';
import { policies, holidays, users } from '@/db/schema';
import { mockPolicies, mockHolidays, mockEmployees } from '@/db/mock-data';
import { hash } from 'bcryptjs'; // We might need to install bcryptjs if not present, or use a simple mock hash for now

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Seed Policies
        console.log('... Seeding Policies');
        for (const p of mockPolicies) {
            await db.insert(policies).values({
                id: p.id,
                title: p.title,
                version: p.version,
                fileUrl: p.fileUrl,
                description: p.description,
            }).onConflictDoNothing();
        }

        // 2. Seed Holidays
        console.log('... Seeding Holidays');
        for (const h of mockHolidays) {
            await db.insert(holidays).values({
                id: h.id,
                name: h.name,
                date: h.date,
                type: h.type as "public" | "optional",
            }).onConflictDoNothing();
        }

        // 3. Seed Users (Employees)
        console.log('... Seeding Employees');
        // We need to match the mockEmployees structure to the users schema
        // mockEmployees has: id, name, designation, mobile, email
        // users schema has: id, name, email, designation, mobile, role, etc.

        // Default password hash for "password123" (approximate)
        // In real app we would use bcrypt.hash("password123", 10)
        const defaultPasswordHash = "$2a$10$abcdefghijklmnopqrstuvwxyz123456";

        for (const emp of mockEmployees) {
            await db.insert(users).values({
                id: emp.id,
                name: emp.name,
                email: emp.email,
                designation: emp.designation,
                mobile: emp.mobile,
                role: 'employee',
                passwordHash: defaultPasswordHash,
                employeeCode: `EMP${emp.id.padStart(3, '0')}`,
            }).onConflictDoNothing();
        }

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

seed();
