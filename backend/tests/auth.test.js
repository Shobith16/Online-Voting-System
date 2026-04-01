const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const User = require('../models/user');
const Candidateschema = require('../models/candidates');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGODB_URL = mongoUri;
  process.env.JWT_SECRET = 'test-secret-key';

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  app = require('../app');

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
  phone: '9876543210',
  password: 'testpass123',
  State: 'Karnataka',
  District: 'Udupi',
  Taluk: 'Udupi',
};

const adminUser = {
  username: 'adminuser',
  age: 40,
  v_id: 'ADMIN001',
  phone: '1234567890',
  password: 'adminpassword',
  State: 'Karnataka',
  District: 'Bangalore',
  Taluk: 'Bangalore',
  isAdmin: true,
};

describe('Auth & Admin API Tests', () => {
  test('1. Verify isAdmin defaults to false on new user registration', async () => {
    await request(app).post('/signup').send(testUser);
    const user = await User.findOne({ v_id: testUser.v_id });
    expect(user.isAdmin).toBe(false);
  });

  test('2. Standard user login payload includes isAdmin: false', async () => {
    await request(app).post('/signup').send(testUser);
    const res = await request(app).post('/login').send({
      username: testUser.username,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.isAdmin).toBe(false);
  });

  test('3. Test POST /admin/login Success: admin credentials', async () => {
    // Create admin directly in DB since there's no signup for admin
    const hashedPass = await require('bcryptjs').hash(adminUser.password, 10);
    const newAdmin = new User({ ...adminUser, password: hashedPass });
    await newAdmin.save();

    const res = await request(app).post('/admin/login').send({
      username: adminUser.username,
      password: adminUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('4. Test POST /admin/login Failure: regular user credentials', async () => {
    await request(app).post('/signup').send(testUser);
    const res = await request(app).post('/admin/login').send({
      username: testUser.username,
      password: testUser.password,
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid admin credentials');
  });

  test('5. Test verifyAdmin middleware (Protection for /candidates)', async () => {
    // Register and login a regular user
    await request(app).post('/signup').send(testUser);
    const userLogin = await request(app).post('/login').send({
      username: testUser.username,
      password: testUser.password,
    });
    const userToken = userLogin.body.token;

    // Attempt to add candidate with USER token (Should fail)
    const resUser = await request(app)
      .post('/candidates')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ Candidate: 'C1', Age: 50, Party: 'P1', State: 'S1', District: 'D1', Taluk: 'T1' });
    expect(resUser.status).toBe(403);

    // Attempt without token (Should fail)
    const resNoToken = await request(app)
      .post('/candidates')
      .send({ Candidate: 'C2', Age: 50, Party: 'P1', State: 'S1', District: 'D1', Taluk: 'T1' });
    expect(resNoToken.status).toBe(401);

    // Create and login admin
    const hashedPass = await require('bcryptjs').hash(adminUser.password, 10);
    await new User({ ...adminUser, password: hashedPass }).save();
    const adminLogin = await request(app).post('/admin/login').send({
      username: adminUser.username,
      password: adminUser.password,
    });
    const adminToken = adminLogin.body.token;

    // Attempt with ADMIN token (Should succeed)
    const resAdmin = await request(app)
      .post('/candidates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ Candidate: 'C3', Age: 50, Party: 'P1', State: 'S1', District: 'D1', Taluk: 'T1' });
    expect(resAdmin.status).toBe(201);
  });

  test('6. Admin protection for DELETE /candidate_del/:id', async () => {
    // Setup: Add a candidate
    const candidate = new Candidateschema({ Candidate: 'C1', Age: 50, Party: 'P1', State: 'S1', District: 'D1', Taluk: 'T1', Vote: 0 });
    await candidate.save();

    // Regular user attempt
    await request(app).post('/signup').send(testUser);
    const userLogin = await request(app).post('/login').send({ username: testUser.username, password: testUser.password });
    const res = await request(app)
      .delete(`/candidate_del/${candidate._id}`)
      .set('Authorization', `Bearer ${userLogin.body.token}`);
    expect(res.status).toBe(403);
  });

  test('7. Admin protection for DELETE /clearVoters', async () => {
    // Regular user attempt
    await request(app).post('/signup').send(testUser);
    const userLogin = await request(app).post('/login').send({ username: testUser.username, password: testUser.password });
    const res = await request(app)
      .delete('/clearVoters')
      .set('Authorization', `Bearer ${userLogin.body.token}`);
    expect(res.status).toBe(403);
  });
});
