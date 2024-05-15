const mongoose=require('mongoose');

const candidateSchema = new mongoose.Schema({
    Candidate:String,
    Age:Number,
    Party:String,
    State:String,
    District:String,
    Taluk:String,
    Vote:Number
});

module.exports = mongoose.model('Candidates',candidateSchema);