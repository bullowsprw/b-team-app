// db/schema.ts
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    date
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("password_hash"),
    employeeCode: text("employee_code"),
    designation: text("designation"),
    role: text("role").$type<"admin" | "employee">().default("employee"),
    mobile: text("mobile"),
    dob: date("dob"),
    doj: date("doj"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export const policies = pgTable("policy", {
    id: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    version: text("version"),
    fileUrl: text("file_url").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const holidays = pgTable("holiday", {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    date: date("date").notNull(),
    type: text("type").$type<"public" | "optional">().default("public"),
});

export const announcements = pgTable("announcement", {
    id: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    date: timestamp("date").defaultNow(),
});

export const tickets = pgTable("ticket", {
    id: text("id").notNull().primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    category: text("category").notNull(), // HR, IT, Admin, Other
    description: text("description").notNull(),
    status: text("status").$type<"Open" | "In Progress" | "Closed">().default("Open"),
    attachmentUrl: text("attachment_url"),
    createdAt: timestamp("created_at").defaultNow(),
});
