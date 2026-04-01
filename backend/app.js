const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/user');
const Candidateschema = require('./models/candidates');
const V_idlist = require('./models/FinishedVotinglist');
const { verifyToken, verifyAdmin } = require('./middleware/auth');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const mongoURL = process.env.MONGODB_URL
if (!mongoURL) {
  console.error('MONGODB_URL environment variable not set');
  process.exit(1);
}

// Set up MongoDB connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.delete('/clearVoters', verifyAdmin, async (req, res) => {
  console.log('Deleting all voters');
  try {
    await V_idlist.deleteMany({});
    const collection = db.collection('candidates');
    const candidates = await collection.find({}).toArray();

    for (const candidate of candidates) {
      await collection.updateOne({ _id: candidate._id }, { $set: { Vote: 0 } });
    }

    res.json({ message: 'Voters removed successfully' });
  } catch (error) {
    console.error('Error removing voters:', error);
    res.status(500).json({ error: 'Failed to remove voters' });
  }
});

app.post('/checkuser', verifyToken, async (req, res) => {
  const { v_id } = req.body;
  if (!v_id) {
    return res.status(403).send('no voter id found!');
  }

  const userdata = await V_idlist.findOne({ v_id })

  if (!userdata) {
    res.status(200).json({ 'message': 'voter id not found!', 'boolean': 'true' })
  } else {
    res.status(401).json({ 'message': 'aleary voted once!', 'boolean': 'false' })
  }
});

app.post('/finishedvotinglist', verifyToken, async (req, res) => {
  const { v_id } = req.body;
  if (!v_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingcandidate = await V_idlist.findOne({ v_id });
  if (existingcandidate) {
    return res.json({ message: "Candidate have already Voted Once!" });
  }

  const candidateData = new V_idlist({ v_id });

  try {
    await candidateData.save();
    res.status(201).json({ message: 'Voting successfull!' });
  } catch (error) {
    res.status(500).json({ error: 'Voter id addition failed!' });
  }
});

app.put('/candidates/:id', verifyToken, async (req, res) => {
  const candidateId = req.params.id;

  try {
    const { Age, Candidate, District, Party, State, Taluk } = req.body;
    
    let updateData = {};
    if (Candidate) updateData.Candidate = Candidate;
    if (Age) updateData.Age = Age;
    if (Party) updateData.Party = Party;
    if (State) updateData.State = State;
    if (District) updateData.District = District;
    if (Taluk) updateData.Taluk = Taluk;

    // Use $inc for Vote to ensure server-side increment
    const updatedCandidate = await Candidateschema.findByIdAndUpdate(
      candidateId, 
      { ...updateData, $inc: { Vote: 1 } }, 
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

app.delete('/candidate_del/:id', verifyAdmin, async (req, res) => {
  const candidateId = req.params.id;
  try {
    await Candidateschema.findByIdAndDelete(candidateId);
    res.json({ message: 'Candidate removed successfully' });
  } catch (error) {
    console.error('Error removing candidate:', error);
    res.status(500).json({ error: 'Failed to remove candidate' });
  }
});

app.get('/candidates_details', async (req, res) => {
  try {
    const collection = db.collection('candidates');
    const candidates = await collection.find({}).toArray();
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user', async (req, res) => {
  try {
    const collection = db.collection('voters');
    const voters = await collection.find({}).toArray();
    res.json(voters);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/candidates', 
  verifyAdmin,
  [
    body('Candidate').notEmpty().withMessage('Candidate name is required'),
    body('Age').isNumeric().withMessage('Age must be a number'),
    body('Party').notEmpty().withMessage('Party is required'),
    body('State').notEmpty().withMessage('State is required'),
    body('District').notEmpty().withMessage('District is required'),
    body('Taluk').notEmpty().withMessage('Taluk is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
  const { Candidate, Age, Party, State, District, Taluk, Vote } = req.body;

  const existingcandidate = await Candidateschema.findOne({ Candidate });
  if (existingcandidate) {
    return res.json({ message: "Candidate already Registered!" });
  }

  const candidateData = new Candidateschema({
    Candidate,
    Age,
    Party,
    State,
    District,
    Taluk,
    Vote: Vote || 0,
  });

  try {
    await candidateData.save();
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

app.post('/signup', 
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('age').isInt({ min: 18 }).withMessage('Age must be at least 18'),
    body('v_id').notEmpty().withMessage('Voter ID is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('State').notEmpty().withMessage('State is required'),
    body('District').notEmpty().withMessage('District is required'),
    body('Taluk').notEmpty().withMessage('Taluk is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
  const { username, age, v_id, phone, password, State, District, Taluk } = req.body;

  const existingUser = await User.findOne({ v_id });
  if (existingUser) {
    return res.status(400).json({ message: "Voter ID already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    age,
    v_id,
    phone,
    State,
    District,
    Taluk,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
  const { username, password } = req.body;

  const userdata = await User.findOne({ username })
  if (!userdata) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isvalid = await bcrypt.compare(password, userdata.password);
  if (isvalid) {
    const token = jwt.sign(
      { v_id: userdata.v_id, username: userdata.username, isAdmin: userdata.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ 'message': 'Successfully Loggedin!', 'v_id': userdata.v_id, isAdmin: userdata.isAdmin, token })
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
  const { username, password } = req.body;

  const userdata = await User.findOne({ username });
  if (!userdata || !userdata.isAdmin) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const isvalid = await bcrypt.compare(password, userdata.password);
  if (isvalid) {
    const token = jwt.sign(
      { v_id: userdata.v_id, username: userdata.username, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ message: 'Admin logged in successfully', token });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

const port = process.env.PORT || 5000
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

module.exports = app;