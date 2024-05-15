const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const User = require('./models/user');
const Candidateschema = require('./models/candidates');
const V_idlist = require('./models/FinishedVotinglist');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

const mongoURL = process.env.MONGODB_URL 
// console.log(mongoURL);
if (!mongoURL) {
    console.error('MONGODB_URL environment variable not set');
    process.exit(1);
  }

// Set up MongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

app.delete('/clearVoters', async (req, res) => {
  console.log('Deleting all voters');
  try {
    // Delete all voters from the V_idlist collection
    await V_idlist.deleteMany({});

    // Fetch all candidates from the candidates collection
    const collection = db.collection('candidates');
    const candidates = await collection.find({}).toArray();

    // Reset vote count for all candidates and update them in the database
    for (const candidate of candidates) {
      candidate.Vote = 0; // Reset vote count to 0
      // Update candidate in the database
      await collection.updateOne({ _id: candidate._id }, { $set: { Vote: 0 } });
    }

    // Respond with success message
    res.json({ message: 'Voters removed successfully' });
  } catch (error) {
    console.error('Error removing voters:', error);
    res.status(500).json({ error: 'Failed to remove voters' });
  }
});




app.post('/checkuser',async (req,res) => {
  const {v_id} = req.body;
  console.log("voter-id:",v_id)
  if (!v_id) {
      res.status(403).send('no voter id found!');

  }

  const userdata= await V_idlist.findOne({v_id})
  
  if(!userdata){
    
    res.status(200).json({'message':'voter id not found!','boolean':'true'})
  } else {
    console.log('aleary voted once!')
    res.status(401).json({'message':'aleary voted once!','boolean':'false'})
  }


});

app.post('/finishedvotinglist', async (req, res) => {
  const { v_id } = req.body;
  console.log(v_id);
  // Validate form fields
  if (!v_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  
  const existingcandidate = await V_idlist.findOne({ v_id });
    if (existingcandidate) {
      return res.json({ message: "Candidate have already Voted Once!" });
  }

  // Save the form data to the database
  const candidateData = new V_idlist({
    v_id,
    
  });

  try {
    await candidateData.save();
    console.log(candidateData)
    res.status(201).json({ message: 'Voting successfull!' });
    console.log('Thankyou for Voting!')
  } catch (error) {
    res.status(500).json({ error: 'Voter id addition failed!' });
  }
});

app.put('/candidates/:id', async (req, res) => {
  const candidateId = req.params.id;
  const { Age, Candidate, District, Party, State, Taluk ,Vote } = req.body;

  try {
    const updatedCandidate = await Candidateschema.findByIdAndUpdate(candidateId, {
      Candidate,
      Age,
      Party,
      State,
      District,
      Taluk,
      Vote
    }, { new: true });

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});


// Backend API endpoint for deleting a candidate
app.delete('/candidate_del/:id', async (req, res) => {
  const candidateId = req.params.id;
  console.log('Deleting candidate')

  try {
    // Delete the candidate from the database
    await Candidateschema.findByIdAndDelete(candidateId);
    res.json({ message: 'Candidate removed successfully' });
  } catch (error) {
    console.error('Error removing candidate:', error);
    res.status(500).json({ error: 'Failed to remove candidate' });
  }
});



app.get('/candidates_details', async (req, res) => {
  try {
    // const db = client.db('Voters');
    const collection = db.collection('candidates');
    // console.log(collection);
    // Fetch all details of candidates
    const candidates = await collection.find({}).toArray();
    // console.log(candidates)
    res.json(candidates);
    
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user', async (req, res) => {
  try {
    // const db = client.db('Voters');
    const collection = db.collection('voters');
    // console.log(collection);
    // Fetch all details of candidates
    const voters = await collection.find({}).toArray();
    // console.log(candidates)
    res.json(voters);
    
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/candidates', async (req, res) => {
  const { Candidate, Age, Party, State, District, Taluk ,Vote } = req.body;
  console.log(Candidate, Age, Party, State, District, Taluk ,Vote);
  // Validate form fields
  if (!Candidate || !Age || !Party || !State || !District || !Taluk || !Vote) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  
  const existingcandidate = await Candidateschema.findOne({ Candidate });
    if (existingcandidate) {
      return res.json({ message: "Candidate already Registered!" });
  }

  // Save the form data to the database
  const candidateData = new Candidateschema({
    Candidate,
    Age,
    Party,
    State,
    District,
    Taluk,
    Vote,
  });

  try {
    await candidateData.save();
    console.log(candidateData)
    res.status(201).json({ message: 'Candidate added successfully' });
    console.log('Candidate added successfully')
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

app.post('/signup', async (req, res) => {
  console.log(req.body)
  const { username, age, v_id, phone, password,State,District,Taluk } = req.body;
  
  if (!username || !age || !v_id || !phone ||!State ||
    !District ||!Taluk ||!password) {
    console.log(username, age, v_id, phone, password,State,District,Taluk)  
    return res.status(400).send('All fields are required',username, age, v_id, phone, password,State,District,Taluk);
  }
  const existingUser = await User.findOne({ v_id });
    if (existingUser) {
      console.log('User already exists')
      return res.status(400).json({ message: "Username already exists" });
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
    password:hashedPassword,
  });

  try {
    await newUser.save();
    console.log(newUser)
    res.status(200).send('User registered successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});
app.post('/login',async (req,res) => {
  const {username,password} = req.body;
  console.log(username)
  if (!username && !password) {
      res.status(403).send('User name or password is not set');

  }

  const userdata= await User.findOne({username})
  console.log(userdata)
  const isvalid= await bcrypt.compare(password,userdata.password);
  // if(password==userdata.password){
  if(isvalid){
    console.log(userdata)
    res.status(200).json({'message':'Successfully Loggedin!','v_id' :userdata.v_id})
  } else {
    res.status(401).send('Invalid username or password');
  }


});
// const port = process.env.PORT || 3000;
const port = process.env.PORT||5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});