const {Schema, model} = require('mongoose');

const clubSchema = new Schema({
    clubid:{
        type:String,
        required:true,
    },
    name: String,
    description : String,
    slogan : String,
    advisor : String,
    m_count : Number
});

module.exports = model("Clubs",clubSchema);