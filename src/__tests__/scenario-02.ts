const supertest = require("supertest");
const { startServer } = require("../server");

const server = startServer();

describe("Scenario 02: Errors testing", () => {
  test("GET /api/users/:id - returns 400 for non-uuid id", async () => {
    const response = await supertest(server).get("/api/users/non-uuid-id");
    expect(response.status).toBe(400);
  });

  test("GET /api/users/:id - returns 404 for non-existent user", async () => {
    const response = await supertest(server).get(
      "/api/users/32993ddc-b216-4f5d-8cdc-34fd76f56c1d"
    );
    expect(response.status).toBe(404);
  });

  test("POST /api/users - returns 400 for invalid user data", async () => {
    const response = await supertest(server)
      .post("/api/users")
      .send({
        username: "Mr. X",
        hobbies: ["do nothing", "sleeping"],
      });
    expect(response.status).toBe(400);
  });

  test("PUT /api/users/:id - returns 400 for non-uuid-id user", async () => {
    const response = await supertest(server)
      .put("/api/users/non-uuid-id")
      .send({ username: "Mr. Y" });
    expect(response.status).toBe(400);
  });

  test("PUT /api/users/:id - returns 400 for non-uuid-id", async () => {
    const response = await supertest(server)
      .put("/api/users/non-uuid-id")
      .send({ username: "Mr. Y" });
    expect(response.status).toBe(400);
  });

  test("PUT /api/users/:id - returns 404 for non-existent user", async () => {
    const response = await supertest(server)
      .put("/api/users/32993ddc-b216-4f5d-8cdc-34fd76f56c1d")
      .send({ username: "Mr. Y" });
    expect(response.status).toBe(404);
  });

  test("DELETE /api/users/:id - returns 400 for non-uuid-id", async () => {
    const response = await supertest(server).delete("/api/users/non-uuid-id");
    expect(response.status).toBe(400);
  });

  test("DELETE /api/users/:id - returns 404 for non-existent user", async () => {
    const response = await supertest(server).delete(
      "/api/users/32993ddc-b216-4f5d-8cdc-34fd76f56c1d"
    );
    expect(response.status).toBe(404);
  });

  test("Request to the none existing endpoints returns 404", async () => {
    const response = await supertest(server).get("/api/wrong-endpoint");
    expect(response.status).toBe(404);
  });
});
