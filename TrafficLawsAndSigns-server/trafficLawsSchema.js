const mongoose = require('mongoose')

const schema ={
    law:{type:String},
    subject:{type:String}
}


const trafficLaws_schema = new mongoose.Schema(schema)
const traffic_law        = mongoose.model('traffic_law',trafficLaws_schema)
module.exports           = traffic_law 
