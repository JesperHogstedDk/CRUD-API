import { deepEqual, equal, ok } from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { server } from "../src/index";

test.after(() => {
  server.close();
});

test("i. GET /api/users should return an empty array", async () => {
  const response = await request(server).get("/api/users");
  ok(response.body); 
  equal(response.status, 200); 
  deepEqual(response.body, []);  
});

test("ii. POST /api/users should create a new user", async () => {
  const newUser = { username: "Alice", age: 25, hobbies: ["Reading", "Gaming"] };
  const response = await request(server).post("/api/users").send(newUser);
  equal(response.status, 201); 
  ok(response.body.id); 
  deepEqual(response.body.username, "Alice"); 
  deepEqual(response.body.age, 25); 
});

test("iii. GET /api/users/{userId} should retrieve created user", async () => {
  const createResponse = await request(server).post("/api/users").send({ username: "Bob", age: 30, hobbies: ["Cooking"] });
  const userId = createResponse.body.id;

  const response = await request(server).get(`/api/users/${userId}`);
  equal(response.status, 200); 
  deepEqual(response.body.username, "Bob"); 
});

test("iv. PUT /api/users/{userId} should update the user", async () => {
  const createResponse = await request(server).post("/api/users").send({ username: "Charlie", age: 40, hobbies: ["Thai boxing"] });
  const userId = createResponse.body.id;

  const updatedData = { username: "Charlie Updated", age: 41, hobbies: ["Chess"] };
  const response = await request(server).put(`/api/users/${userId}`).send(updatedData);

  equal(response.status, 200); 
  deepEqual(response.body.username, "Charlie Updated"); 
});

test("v. DELETE /api/users/{userId} should remove user and vi. GET /api/users/{userId} should retrieve error message 'User not found ", async () => {
  const createResponse = await request(server).post("/api/users").send({ username: "Dave", age: 22, hobbies: ["Hiking"] });
  const userId = createResponse.body.id;    

  const deleteResponse = await request(server).delete(`/api/users/${userId}`);
  equal(deleteResponse.status, 204); 

  const getResponse = await request(server).get(`/api/users/${userId}`);
  equal(getResponse.status, 404);     
  deepEqual(getResponse.body.error, "User not found");
});
