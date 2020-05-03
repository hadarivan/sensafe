const Question = require('../models/questions');  

module.exports = {
    async getLevel1Questions(req, res) {    
        var result = await Question.find({level:1}); //returns all the competitions
        var i = result.length, t, j;
        result = result.slice();
        while (--i) t = result[i], result[i] = result[j = ~~(Math.random() * (i+1))], result[j] = t;
        result = result.slice(0,10)
        if(result) res.json(result);
            else res.status(404).send('not found');       
    },
    async getLevel2Questions(req, res) {    
        const result = await Question.find({level:2}); //returns all the competitions
            if(result) res.json(result);
            else res.status(404).send('not found');       
    },
    async getLevel3Questions(req, res) {    
        const result = await Question.find({level:3}); //returns all the competitions
            if(result) res.json(result);
            else res.status(404).send('not found');       
    },
    async routeNotFound(req, res){  //show product by season,gender,age,brand,price
        return res.send("Route not found, please try a different one");
    }
}

