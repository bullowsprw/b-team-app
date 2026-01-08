
import { users, policies, holidays, announcements } from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Mock DB connection for seed script (won't actually run without DB, but good for structure)
// In a real scenario w/o DB, we might skip this or use a mock driver.
// For now, we'll just log what would happen or create a dummy structure if we were using a real DB.
// Since we are in 'stub' mode without a real postgres instance running accessible via standard PG envs yet (maybe),
// we will focus on the data structure.

// HOWEVER, to make the Frontend work with "Mock Data" without a real DB connection, 
// we should probably modify the API routes to return static data if DB fails.
// But the plan says "seed.ts". Let's create a file that exports mock data we can use in our API routes 
// until the DB is truly connected.
export const mockPolicies = [
    { id: "1", title: "Employee Handbook", version: "1.0", fileUrl: "#", description: "General guidelines" },
    { id: "2", title: "Leave Policy", version: "2.1", fileUrl: "#", description: "Rules regarding leaves" },
    { id: "3", title: "IT Security Policy", version: "1.0", fileUrl: "#", description: "Security protocols" },
];

export const mockHolidays = [
    { id: "1", name: "New Year's Day", date: "2024-01-01", type: "public" },
    { id: "2", name: "Independence Day", date: "2024-07-04", type: "public" },
    { id: "3", name: "Labor Day", date: "2024-09-02", type: "public" },
];

export const mockAdmins = [
    { id: "admin-1", name: "Bullows Admin One", designation: "System Administrator", mobile: "+91 9876543210", email: "admin1@bullows.com" },
    { id: "admin-2", name: "Bullows Admin Two", designation: "HR Operations", mobile: "+91 9876543211", email: "admin2@bullows.com" },
    { id: "admin-3", name: "Bullows Admin Three", designation: "IT Manager", mobile: "+91 9876543212", email: "admin3@bullows.com" },
];

export const mockEmployees = [
    { id: "1", name: "Sarah Smith", designation: "HR Executive", department: "Human Resources", location: "Global Office", mobile: "+1 234 567 8901", whatsapp: "+1 234 567 8901", email: "sarah@bullows.com" },
    { id: "2", name: "Mike Johnson", designation: "Senior Developer", department: "Engineering", location: "Tech Hub", mobile: "+1 234 567 8902", whatsapp: "+1 234 567 8902", email: "mike@bullows.com" },
    { id: "3", name: "Emily Davis", designation: "Product Designer", department: "Design", location: "Creative Studio", mobile: "+1 234 567 8903", whatsapp: "+1 234 567 8903", email: "emily@bullows.com" },
    { id: "4", name: "David Brown", designation: "QA Engineer", department: "Engineering", location: "Tech Hub", mobile: "+1 234 567 8904", whatsapp: "+1 234 567 8904", email: "david@bullows.com" },
    { id: "5", name: "Lisa Wilson", designation: "Marketing Lead", department: "Marketing", location: "Global Office", mobile: "+1 234 567 8905", whatsapp: "+1 234 567 8905", email: "lisa@bullows.com" },
    { id: "6", name: "Robert Taylor", designation: "Operations Manager", department: "Operations", location: "London", mobile: "+1 234 567 8906", whatsapp: "+1 234 567 8906", email: "robert@bullows.com" },
];
