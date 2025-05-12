import type { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";
// import { db } from "../db/database.ts";
const ext = process.env.NODE_ENV === "production" ? ".js" : ".ts";
const { db } = await import(`../db/database${ext}`);

const handleServerError = (res: ServerResponse, error: unknown) => {
    console.error("Server error:", error);
    if (!res.headersSent) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Something went wrong on the server. Please try again later." }));
    }
};

export const handleUserRequest = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        res.setHeader("Content-Type", "application/json");

        console.log(`Worker ${process.pid} handling request at local port ${req.socket.localPort}`);

        switch (req.method) {
            case "GET":
                if (req.url === "/api/users") {
                    try {
                        const users = await db.getAll();
                        res.writeHead(200);
                        return res.end(JSON.stringify(users));
                    } catch (error) {
                        console.error("Error fetching users:", error);
                        handleServerError(res, error);
                    }
                } else if (req.url?.startsWith("/api/users/")) {
                    if (process.env.ENABLE_SERVER_ERROR_TEST === "true") {
                        console.log("Force error triggered!");
                        throw new Error("Simulated server error! TESTING ERROR HANDLING");
                    }

                    const id = req.url.split("/")[3];
                    if (!validate(id)) {
                        res.writeHead(400);
                        return res.end(JSON.stringify({ error: "Invalid UUID format." }));
                    }
                    try {
                        const user = await db.getById(id);
                        if (user) {
                            res.writeHead(200);
                            return res.end(JSON.stringify(user));
                        } else {
                            res.writeHead(404);
                            return res.end(JSON.stringify({ error: "User not found" }));
                        }
                    } catch (error) {
                        console.error("Error fetching user:", error);
                        handleServerError(res, error);
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
                        // console.log("Received body:", body);
                        const { username, age, hobbies } = JSON.parse(body);
                        if (!username || !age || !hobbies || hobbies.length === 0) {
                            res.writeHead(400);
                            return res.end(JSON.stringify({ error: "Missing required fields" }));
                        }
                        try {
                            const newUser = await db.create(username, age, hobbies);
                            res.writeHead(201);
                            return res.end(JSON.stringify(newUser));
                        } catch (error) {
                            console.error("Error creating user:", error);
                            handleServerError(res, error);
                        }
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
                        // console.log("Received body:", body);
                        const { username, age, hobbies } = JSON.parse(body);
                        if (!username || !age || !hobbies || hobbies.length === 0) {
                            res.writeHead(400);
                            return res.end(JSON.stringify({ error: "Missing required fields" }));
                        }
                        try {
                            const updatedUser = await db.update(id, username, age, hobbies);
                            if (updatedUser) {
                                res.writeHead(200);
                                return res.end(JSON.stringify(updatedUser));
                            } else {
                                res.writeHead(404);
                                return res.end(JSON.stringify({ error: "User not found" }));
                            }
                        } catch (error) {
                            console.error("Error updating user:", error);
                            handleServerError(res, error);
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
                    try {
                        const deleted = await db.delete(id);
                        if (deleted) {
                            res.writeHead(204);
                            return res.end();
                        } else {
                            res.writeHead(404);
                            return res.end(JSON.stringify({ error: "User not found" }));
                        }
                    } catch (error) {
                        console.error("Error deleting user:", error);
                        handleServerError(res, error);
                    }
                }
                break;
            default:
                res.writeHead(405, { "Allow": "GET, POST, PUT, DELETE" });
                return res.end(JSON.stringify({ error: "Method Not Allowed" }));
        }
    } catch (error) {
        handleServerError(res, error);
    }
}
