const mongoose=require('mongoose');

const list = new mongoose.Schema({
    
    v_id:String
});

module.exports = mongoose.model('Vid_list',list);