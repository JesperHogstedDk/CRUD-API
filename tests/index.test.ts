import { equal, ok } from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";
import { server } from "../src/index"; 

test.after(() => {
  server.close();
});

// Test: Server should start successfully
test("Server should respond with 200 OK for root endpoint", async () => {
  const response = await request(server).get("/");
  equal(response.status, 200); 
  ok(response.text.includes("This is a node CRUD API server with watch done with Typescript!"), "Should confirm the server is running");
});

// Test: Invalid route should return 404
test("GET /invalid-route should return 404", async () => {
  const response = await request(server).get("/some-non/existing/resource");
  equal(response.status, 404); 
});

// Test: API should handle errors gracefully
test("GET /api/users should handle errors correctly", async () => {
  const response = await request(server).get("/api/users/");
  equal(response.status, 500); 
  ok(response.body.error.includes("Something went wrong"), "Should return server error message");
});