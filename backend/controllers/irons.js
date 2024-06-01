const { updateDatabaseByName, getDatabaseByName } = require("./databaseController")
const addIron = (req,res) =>{
    const { name, weight, radius } = req.body
    const newObj = {
        name,
        weight,
        radius
    }
    let ironDb = getDatabaseByName('IronStorage');
    ironDb.push(newObj);
    updateDatabaseByName('IronStorage',JSON.stringify(ironDb))
    res.json({"msg":"success"})
}

const addIronWeight = (req,res) =>{
    
}

const subtractIronWeight = (req,res) =>{

}

const getIronStorage = (req,res)=>{
    let db = getDatabaseByName('IronStorage');
    res.json(db);
}

const getScaleWeight = (req,res)=>{
    res.json({"weight":168705})
}

const changeIronWeight = (req,res)=>{

}

module.exports = {
    getIronStorage,
    addIron,
    addIronWeight,
    subtractIronWeight,
    changeIronWeight,
    getScaleWeight
}