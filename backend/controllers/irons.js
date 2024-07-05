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
let x = 1000;
const getScaleWeight = (req,res)=>{
    res.json({"weight":x})
    x+=1350;
}

const changeIronWeight = (req,res)=>{
    const { radius, name, weight} = req.body 
    let db = getDatabaseByName('IronStorage');
    let isFound = false;
    for(let i in db){
        if(name === db[i]['name']){
        for(let j in db[i].props){
            //console.log(radius,db[i]['props'][j].radius)
            if(radius == db[i]['props'][j].radius){
                db[i]["props"][j].weight = parseInt(weight)
                console.log(db[i]["props"][j].weight)
                console.log(db[i]["props"])
                isFound = true;
                updateDatabaseByName('IronStorage',JSON.stringify(db))
                res.json({"msg":"done","newWeight":weight})
                break;
            }
        }
      }

      if(isFound)
        break;
    }

    
}

const handleChangePassword = (req,res) =>{
    let {password} = req.body;

    let db = getDatabaseByName('Passwords');

    if(db[0]["ironChangePassword"] === password){
        res.json({"msg":"success"})
    }
    else{
        res.json({"msg":"failed"})
    }
}

module.exports = {
    getIronStorage,
    addIron,
    addIronWeight,
    subtractIronWeight,
    changeIronWeight,
    getScaleWeight,
    handleChangePassword
}