import test from "node:test";
import { ok } from "node:assert/strict";
import { equal } from "node:assert/strict";

import { db } from "../src/db/database";

// Test: Creating a new user
test("db.create() should add a new user to the database", async () => {
  const user = await db.create("Alice", 25, ["Reading", "Gaming"]);
  ok(user.id);
  equal(user.username, "Alice");
  equal(user.age, 25); 
  equal(user.hobbies.length, 2); 
});

// Test: Retrieving all users
test("db.getAll() should return an array of users", async () => {
  const users = await db.getAll();
  ok(Array.isArray(users)); 
});

// Test: Retrieving user by ID
test("db.getById() should return the correct user", async () => {
  const newUser = await db.create("Bob", 30, ["Cooking"]);
  const fetchedUser = await db.getById(newUser.id);
  equal(fetchedUser?.username, "Bob"); 
});

// Test: Updating a user
test("db.update() should modify user details", async () => {
  const user = await db.create("Charlie", 40, []);
  await db.update(user.id, "Charlie Updated", 41, ["Chess"]);

  const updatedUser = await db.getById(user.id);
  equal(updatedUser?.username, "Charlie Updated"); 
  equal(updatedUser?.age, 41); 
});

// Test: Deleting a user
test("db.delete() should remove a user from the database", async () => {
  const user = await db.create("Dave", 22, ["Hiking"]);
  const deleted = await db.delete(user.id);

  equal(deleted, true); 
  equal(await db.getById(user.id), undefined); 
});