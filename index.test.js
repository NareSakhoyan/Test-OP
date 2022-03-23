const request = require("supertest");
const { app } = require("./index.js");
const { auth } = require("./middlewares.js");

const agent = request.agent(app);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJQbGFua3Rvbjc4IiwiYWN0aXZlc2Vzc2lvbiI6IjE2NDc5NjQxNjMyOTN1c2VybmFtZSIsImlhdCI6MTY0Nzk2NDE2M30.AAsFUWGUnY6O1EKalzBlkv8qoq0ye1YGo5L-XxtYhMU";

describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("Notes Endpoints", () => {
  beforeEach(function (done) {
    agent.auth(token);
    done();
  });

  it("should create a new note", async () => {
    const res = await request(app)
      .post("/note", auth)
      .set({
        authorization: `Bearer ${token}`,
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
        authorization: `Bearer ${token}`,
      })
      .send({
        title: "This is just a note",
        isDone: false,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title");
  });

  it("should get all notes", async () => {
    const res = await request(app).get("/notes");
    expect(res.statusCode).toEqual(200);
  });

  it("should get a note by its id", async () => {
    const res = await request(app).get("/note/2");
    expect(res.statusCode).toEqual(201);
  });

  it("should achieve the note", async () => {
    const res = await request(app)
      .put("/note/archieve/2", auth)
      .set({
        authorization: `Bearer ${token}`,
      });
    expect(res.body.status).toEqual("archieved");
  });

  it("should delete the note", async () => {
    const res = await request(app)
      .delete("/note/2", auth)
      .set({
        authorization: `Bearer ${token}`,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("deleted");
  });
});

describe("login logout", () => {
  it("login", async () => {
    const res = await request(app).put("/login").send({
      username: "Plankton78",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("logout", async () => {
    const res = await request(app).put("/logout");
    expect(res.statusCode).toEqual(201);
  });
});
