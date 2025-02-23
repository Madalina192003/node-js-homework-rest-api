const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/userModel");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
  it("should return 200 and a token", async () => {
    const testUser = new User({
      email: "test@example.com",
      password: "password123",
    });
    await testUser.save();

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
    expect(typeof response.body.user.subscription).toBe("string");

    await User.deleteOne({ email: "test@example.com" });
  });
});
