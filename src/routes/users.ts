import type { IncomingMessage, ServerResponse } from "http";

export const handleUserRequest = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" ) {
        res.writeHead(200);
        const users = [
            { id: 11, name: "Jesper" },
            { id: 21, name: "Karen" },
        ];
        return res.end(JSON.stringify(users));
    }
}