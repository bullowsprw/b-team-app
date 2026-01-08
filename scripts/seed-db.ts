import { db, client } from '@/db';
import { policies, holidays, users } from '@/db/schema';
import { mockPolicies, mockHolidays, mockEmployees, mockAdmins } from '@/db/mock-data';
import bcrypt from 'bcryptjs';

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

        // 3. Seed Admins
        console.log('... Seeding Admins');
        const adminPasswordHash = await bcrypt.hash("admin123", 10);
        for (const admin of mockAdmins) {
            await db.insert(users).values({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                designation: admin.designation,
                mobile: admin.mobile,
                role: 'admin',
                passwordHash: adminPasswordHash,
                employeeCode: `ADM${admin.id.split('-')[1].padStart(3, '0')}`,
            }).onConflictDoNothing();
        }

        // 4. Seed Users (Employees)
        console.log('... Seeding Employees');
        const defaultPasswordHash = await bcrypt.hash("password123", 10);

        for (const emp of mockEmployees) {
            await db.insert(users).values({
                id: emp.id,
                name: emp.name,
                email: emp.email,
                designation: emp.designation,
                department: emp.department,
                location: emp.location,
                mobile: emp.mobile,
                whatsapp: emp.whatsapp,
                role: 'employee',
                passwordHash: defaultPasswordHash,
                employeeCode: `EMP${emp.id.padStart(3, '0')}`,
            }).onConflictDoUpdate({
                target: users.id,
                set: {
                    department: emp.department,
                    location: emp.location,
                    whatsapp: emp.whatsapp,
                    designation: emp.designation,
                }
            });
        }

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit(0);
    }
}

seed();
