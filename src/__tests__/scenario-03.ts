const supertest = require("supertest");
const { startServer } = require("../server");

const server = startServer();

describe("Scenario 03: Multiple Users manipulations", () => {
  test("GET /api/users - returns an empty array", async () => {
    const allUsers01 = await supertest(server).get("/api/users");
    expect(allUsers01.body).toEqual([]);

    const newUser01 = {
      username: "Mr. X",
      age: 25,
      hobbies: ["do nothing", "sleeping"],
    };
    const newUser02 = {
      username: "Harry Potter",
      age: 11,
      hobbies: ["magic", "flying on a broom"],
    };
    const newUser03 = {
      username: "Buratino",
      age: 0,
      hobbies: ["learning", "listening to parent"],
    };
    await supertest(server).post("/api/users").send(newUser01);
    await supertest(server).post("/api/users").send(newUser02);
    await supertest(server).post("/api/users").send(newUser03);

    const allUsers02 = await supertest(server).get("/api/users");
    expect(allUsers02.body.length).toBe(3);

    const user02 = allUsers02.body.find(
      (user: typeof user02) => user.username === newUser02.username
    );

    await supertest(server)
      .put(`/api/users/${user02.id}`)
      .send({ username: "Ron Weasley" });

    const allUsers03 = await supertest(server).get("/api/users");

    expect(allUsers03.body.length).toBe(3);
    const absentUser = allUsers03.body.find(
      (user: typeof user02) => user.username === newUser02.username
    );
    expect(absentUser).toBeUndefined();

    await supertest(server).delete(`/api/users/${user02.id}`);
    const allUsers04 = await supertest(server).get("/api/users");
    expect(allUsers04.body.length).toBe(2);
  });
});
