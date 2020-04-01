const mongoose = require('mongoose')

const schema ={
    id:{type:Number},
    name:{type:String},
    toDo:{type:String},
    image:{type:String}
}


const trafficSigns_schema  = new mongoose.Schema(schema)
const traffic_sign         = mongoose.model('traffic_sign',trafficSigns_schema)
module.exports             = traffic_sign 
