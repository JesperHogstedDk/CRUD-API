import type { IncomingMessage, ServerResponse } from "http";
import { db } from "../db/database.ts";

export const handleUserRequest = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" ) {
        res.writeHead(200);
        const users = await db.getAll();
        return res.end(JSON.stringify(users));
    } else if (req.method === "POST" ) {        
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { name } = JSON.parse(body);
            const newUser = await db.create(name);
            res.writeHead(201);
            return res.end(JSON.stringify(newUser));
        });
    } else {
        res.writeHead(405, { "Allow": "GET, POST" });
        return res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
}