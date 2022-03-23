const request = require("supertest");
const { app } = require("./index.js");
const { auth } = require("./middlewares.js");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJQbGFua3Rvbjc4IiwiYWN0aXZlc2Vzc2lvbiI6IjE2NDc5NjQxNjMyOTN1c2VybmFtZSIsImlhdCI6MTY0Nzk2NDE2M30.AAsFUWGUnY6O1EKalzBlkv8qoq0ye1YGo5L-XxtYhMU"

describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("Notes Endpoints", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/note", auth)
      .set({
        authorization:
          `Bearer ${token}`,
      })
      .send({
        title: "This is just a note",
        isDone: false,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title");
  });

  it("should update the note", async () => {
    const res = await request(app)
      .put("/note/2", auth)
      .set({
        authorization:
          `Bearer ${token}`,
      })
      .send({
        title: "This is just a note",
        isDone: false,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title");
  });

  it("should update the note", async () => {
    const res = await request(app)
      .get("/notes")
    expect(res.statusCode).toEqual(200);
  });
});
