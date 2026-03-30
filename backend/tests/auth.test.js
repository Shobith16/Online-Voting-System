const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Set environment variables before importing app
  process.env.MONGODB_URL = mongoUri;
  process.env.JWT_SECRET = 'test-secret-key';

  // Disconnect any existing connection before connecting to in-memory DB
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  app = require('../app');

  // Wait for mongoose to connect
  await new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      resolve();
    } else {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    }
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const testUser = {
  username: 'testuser',
  age: 25,
  v_id: 'VID001',
  phone: 9876543210,
  password: 'testpass123',
  State: 'Karnataka',
  District: 'Udupi',
  Taluk: 'Udupi',
};

describe('Auth API Tests', () => {
  test('POST /signup returns 400 if v_id already exists', async () => {
    // First signup should succeed
    const res1 = await request(app).post('/signup').send(testUser);
    expect(res1.status).toBe(200);

    // Second signup with same v_id should return 400
    const res2 = await request(app).post('/signup').send(testUser);
    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe('Username already exists');
  });

  test('POST /login returns 401 for wrong password', async () => {
    // First, register the user
    await request(app).post('/signup').send(testUser);

    // Attempt login with wrong password
    const res = await request(app).post('/login').send({
      username: testUser.username,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid username or password');
  });

  test('POST /checkuser returns "already voted" for a v_id in vid_lists', async () => {
    // Register and login to get a JWT token
    await request(app).post('/signup').send(testUser);
    const loginRes = await request(app).post('/login').send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();

    // Add voter to finished voting list
    await request(app)
      .post('/finishedvotinglist')
      .set('Authorization', `Bearer ${token}`)
      .send({ v_id: testUser.v_id });

    // Now check if user has already voted
    const res = await request(app)
      .post('/checkuser')
      .set('Authorization', `Bearer ${token}`)
      .send({ v_id: testUser.v_id });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('aleary voted once!');
  });
});
