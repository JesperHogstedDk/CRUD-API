import type { IncomingMessage, ServerResponse } from "http";
import { db } from "../db/database.ts";

export const handleUserRequest = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json");

    switch (req.method) {
        case "GET":
            if (req.url === "/api/users") {
                res.writeHead(200);
                const users = await db.getAll();
                return res.end(JSON.stringify(users));
            } else if (req.url?.startsWith("/api/users/")) {
                const id = req.url.split("/")[3];
                const user = await db.getById(id);
                if (user) {
                    res.writeHead(200);
                    return res.end(JSON.stringify(user));
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: "User not found" }));
                }
            }
            break;
        case "POST":
            if (req.url === "/api/users") {
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });
                req.on("end", async () => {
                    console.log("Received body:", body);
                    const { name, age, email } = JSON.parse(body);
                    const newUser = await db.create(name, age, email);
                    res.writeHead(201);
                    return res.end(JSON.stringify(newUser));
                });
            }
            break;
        case "PUT":            
            if (req.url?.startsWith("/api/users/")) {
                const id = req.url.split("/")[3];
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });
                req.on("end", async () => {
                    console.log("Received body:", body);
                    const { name, age, email } = JSON.parse(body);
                    const updatedUser = await db.update(id, name, age, email);
                    if (updatedUser) {
                        res.writeHead(200);
                        return res.end(JSON.stringify(updatedUser));
                    } else {
                        res.writeHead(404);
                        return res.end(JSON.stringify({ error: "User not found" }));
                    }
                });
                break
            }
        case "DELETE":
            if (req.url?.startsWith("/api/users/")) {
                const id = req.url.split("/")[3];
                const deleted = await db.delete(id);
                if (deleted) {
                    res.writeHead(204);
                    return res.end();
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: "User not found" }));
                }
            }
            break;
        default:
            res.writeHead(405, { "Allow": "GET, POST, PUT, DELETE" });
            return res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
}