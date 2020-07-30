const Instructor = require('../models/instructor'); 
var md5 = require('md5');

module.exports = {
    async createInstructor(req, res) {    
        const {
            id=null,
            name=null,
            className=null,
            password=null,
            image="https://cdn0.iconfinder.com/data/icons/occupation-002/64/teacher-teach-occupation-avatar-512.png",
        } = req.body;
        console.log(typeof(id))
        if (id.match(/^[0-9]+$/) === null)
        {
            res.json("בבקשה להכניס מספר")

        }
        else {const result= await Instructor.find({id}); // checks if instructor already exists}
        if(id===null || name ===null || className===null || password ===null || image===null) {
            res.json("בבקשה למלא את כל הפרטים")
        }

        if(result.length===0){
        const instructor = new Instructor({id,name,className,password,image})
        console.log(instructor)
    
        instructor.save(function (err) {
            if (err) { 
                handleError(res, err);
            }
            else {
                res.send(instructor);
            }
        });
        }
        else if(result.length>0) res.json("instructor already exists");
        else res.status(404).send('not found')      
    }
    },
    async editId(req, res){  //edit id
        const {id=null, update=null} = req.body;
        const result =await Instructor.findOneAndUpdate({id},{$set:{id:update}},{});
        if(result==null || id==="") res.json("not found")  // checks if instructor exist if exist then edit id
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editImage(req, res){  //edit id
        const {id=null, image=null} = req.body;
        const result =await Instructor.findOneAndUpdate({id},{$set:{image:image}},{});
        if(result==null || id==="") res.json("not found")  // checks if instructor exist if exist then edit id
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editName(req, res){  //edit name
        const {id=null, name=null} = req.body;
        const result =await Instructor.findOneAndUpdate({id},{$set:{name:name}},{});
        if(result==null || id==="") res.json("Not found")  // checks if instructor exist if exist then edit name
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editClassName(req, res){  //edit class name
        const {id=null, className=null,update=null} = req.body;
        const result =await Instructor.findOneAndUpdate({id,className},{$set:{'className.$':update}},{});
        if(result==null || id==="") res.json("No products was found")  // checks if instructor exist if exist then edit class name
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async deleteClassName(req, res){  //delete class
        const {id=null, className=null} = req.body;
        const result = await Instructor.findOneAndUpdate({id},{$pull:{className:className}})
        console.log(result);
        if(result==null) res.json("No products was found") // checks if insturctor exist if exist then delete class name
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async addClassName(req, res){  //add class
        const {id=null, className=null} = req.body;
        const result = await Instructor.findOneAndUpdate({id},{$push:{className:className}})
        console.log(result);
        if(result==null) res.json("No products was found") // checks if instructor exist if exist then add class name
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async editAll(req, res){  //edit class name
        const {id=null, changeId=null ,name=null} = req.body;
        const result =await Instructor.findOneAndUpdate({id},{$set:{id:changeId, name:name}},{});
        if(result==null || id==="") res.json("No products was found")  // checks if instructor exist if exist then edit class name
        else if(result) res.json(result);
        else res.status(404).send('not found');
    },
    async allData(req, res){  //add class
            const result = await Instructor.find({}); //returns all the instructors
            if(result) res.json(result);
            else res.status(404).send('not found');    
    },
    async OneInstructor(req, res){  //add class
        const {id=null} = req.body;
        const result = await Instructor.find({id}); //returns all the instructors
        if(result) res.json(result);
        else res.status(404).send('not found');    
},
    async routeNotFound(req, res){  
        return res.json("Route not found, please try a different one");
    }
}

