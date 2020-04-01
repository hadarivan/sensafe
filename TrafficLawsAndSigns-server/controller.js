const mongoose      = require('mongoose')
const consts        = require('./consts')
const traffic_law   = require('./trafficLawsSchema')
const traffic_sign  = require('./trafficSignsSchema')
const connection    = require('./db')


module.exports={
//get all traffic laws
   async getAllTrafficLaws(req,res,next){
      
        const result = await traffic_law.find({})
        if(result) 
            res.json(result)
        else
            res.status(404).send('not found')
    },
//add new law
async addNewLaw(req,res,next){
    const{
        law = null,
        subject = null
    } = req.body
    const trafficLaw = new traffic_law({law, subject})
    trafficLaw.save()
    if(trafficLaw){
        console.log("law was added!")
        res.json(trafficLaw)
    }
    else
        res.status(404).send('could not add law')
},
//edit law by law
    async editTrafficLawByLaw(req, res,next){  
        const {law=null,newLaw = null} = req.body;
        const result =await traffic_law.findOneAndUpdate({law},{$set:{law:newLaw}},{});
        console.log(law);
        if(result==null) 
            res.send("law was not found") 
        else if(result) 
            res.json(result);
        else res.status(404).send('not found')
    },
//delete law
 async  deleteTrafficLaw(req, res, next){
        const {law = null} = req.body
        const result = await traffic_law.findOneAndDelete({law})
        console.log(result);
    if(result==null) 
        res.send("law was not found") 
    else if(result) 
        res.json(result);
    else 
        res.status(404).send('not found');
    },
//traffic signs queries

// get all traffic signs
async getAllTrafficSigns(req,res,next){
      
    const result = await traffic_sign.find({})
    if(result) 
        res.json(result)
    else
        res.status(404).send('not found')
    },
// add new sign
    async addNewTrafficSign(req,res,next){
        const{
            id = null,
            name = null,
            toDo = null,
            image = null
        } = req.body
        const trafficSign = new traffic_sign({id, name, toDo, image})
        trafficSign.save()
        if(trafficSign){
            console.log("traffic sign was added!")
            res.json(trafficSign)
        }
        else
            res.status(404).send('could not add traffic sign')
    },
//edit trsaffic sign by id
async editTrafficSignById(req, res,next){  
    const {id=null,newId = null} = req.body;
    const result =await traffic_sign.findOneAndUpdate({id},{$set:{id:newId}},{});
    console.log(id);
    if(result==null) 
        res.send("traffic sign was not found") 
    else if(result) 
        res.json(result);
    else res.status(404).send('not found')
},
//edit trsaffic sign by name
    async editTrafficSignByName(req, res,next){  
        const {name=null,newName = null} = req.body;
        const result =await traffic_sign.findOneAndUpdate({name},{$set:{name:newName}},{});
        console.log(name);
        if(result==null) 
            res.send("traffic sign was not found") 
        else if(result) 
            res.json(result);
        else res.status(404).send('not found')
    },
//edit trsaffic sign by to do
    async editTrafficSignBytoDo(req, res,next){  
        const {toDo=null,newToDo = null} = req.body;
        const result =await traffic_sign.findOneAndUpdate({toDo},{$set:{toDo:newToDo}},{});
        console.log(toDo);
        if(result==null) 
            res.send("traffic sign was not found") 
        else if(result) 
            res.json(result);
        else res.status(404).send('not found')
    },
//edit trsaffic sign by image
    async editTrafficSignByImage(req, res,next){  
        const {image=null,newImage = null} = req.body;
        const result =await traffic_sign.findOneAndUpdate({image},{$set:{image:newImage}},{});
        console.log(image);
        if(result==null) 
            res.send("traffic sign was not found") 
        else if(result) 
            res.json(result);
        else res.status(404).send('not found')
    },
//delete traffic sign by name
    async  deleteTrafficSign(req, res, next){
        const {name = null} = req.body
        const result = await traffic_sign.findOneAndDelete({name})
        console.log(result);
        if(result==null) 
            res.send("traffic sign was not found") 
        else if(result) 
            res.json(result);
        else res.status(404).send('not found');
    }
}