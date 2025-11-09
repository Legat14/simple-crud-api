const supertest = require("supertest");
const { startServer } = require("../server");

const server = startServer();

describe("Scenario 01: Basic CRUD Operations", () => {
  let newUserId: string;
  let newUsername: string;

  test("GET /api/users - returns an empty array", async () => {
    const response = await supertest(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /api/users - creates a new user", async () => {
    const newUser = {
      username: "Mr. X",
      age: 25,
      hobbies: ["do nothing", "sleeping"],
    };
    const response = await supertest(server).post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.username).toEqual(newUser.username);
    expect(response.body.age).toEqual(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);
    newUserId = response.body.id;
    newUsername = response.body.username;
  });

  test("GET /api/users/:id - retrieves the created user", async () => {
    const response = await supertest(server).get(`/api/users/${newUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(newUserId);
    expect(response.body.username).toBe(newUsername);
  });

  test("PUT /api/users/:id - updates the user's information", async () => {
    const updatedData = {
      username: "Mr. Y",
      age: 20,
    };
    const response = await supertest(server)
      .put(`/api/users/${newUserId}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.username).not.toBe(newUsername);
    expect(response.body.age).toBe(updatedData.age);
    expect(response.body.id).toBe(newUserId);
  });

  test("DELETE /api/users/:id - deletes the user", async () => {
    const response = await supertest(server).delete(`/api/users/${newUserId}`);
    expect(response.status).toBe(204);
  });

  test("GET /api/users/:id - returns 404 for the deleted user", async () => {
    const response = await supertest(server).get(`/api/users/${newUserId}`);
    expect(response.status).toBe(404);
  });
});
