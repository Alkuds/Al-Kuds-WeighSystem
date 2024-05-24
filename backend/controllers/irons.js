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
    console.log(name,weight,radius);
    const update = updateDatabaseByName('IronStorage',JSON.stringify(ironDb))
    if(update)
        res.json({"msg":"success"})
    else
        res.json({"msg":"failed"})
}

const addIronWeight = (req,res) =>{

}

const subtractIronWeight = (req,res) =>{

}

const getIronStorage = (req,res)=>{

}

const changeIronWeight = (req,res)=>{

}

module.exports = {
    getIronStorage,
    addIron,
    addIronWeight,
    subtractIronWeight,
    changeIronWeight
}