import type { IncomingMessage, ServerResponse } from "http";
import { db } from "../db/database.ts";
import { validate } from "uuid";

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
                if (!validate(id)) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: "Invalid UUID format." }));
                }
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
                    const { username, age, hobbies } = JSON.parse(body);
                    if (!username || !age || !hobbies || hobbies.length === 0) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ error: "Missing required fields" }));
                    }
                    const newUser = await db.create(username, age, hobbies);
                    res.writeHead(201);
                    return res.end(JSON.stringify(newUser));
                });
            }
            break;
        case "PUT":
            if (req.url?.startsWith("/api/users/")) {
                const id = req.url.split("/")[3];
                if (!validate(id)) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: "Invalid UUID format." }));
                }
                let body = "";
                req.on("data", chunk => {
                    body += chunk.toString();
                });
                req.on("end", async () => {
                    console.log("Received body:", body);
                    const { username, age, hobbies } = JSON.parse(body);
                    if (!username || !age || !hobbies || hobbies.length === 0) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ error: "Missing required fields" }));
                    }
                    const updatedUser = await db.update(id, username, age, hobbies);
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
                if (!validate(id)) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: "Invalid UUID format." }));
                }
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