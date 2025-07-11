

import { PrismaClient } from "@prisma/client";


export const db = new PrismaClient();

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db;
}



//  Problem in development:
// When you're coding (not in production), Next.js refreshes a lot.
// That can create too many database connections, which causes errors.

// This saves the connection globally so it doesn’t create a new one every time your code reloads during development.