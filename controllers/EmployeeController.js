const Employee = require('../models/Employee')

const createemployee = async(req , res) =>{
    try{
        const {id , name , email , phone , city} = req.body
        const employee = new Employee({
            id , name , email , phone , city
        })
        await employee.save()
        res.status(201).json(Employee)
    }catch(err){
        console.log("Error Occured " + err);
        res.status(500).json({message : 'Server error occured !'})
    }
}

const getemployees = async(req , res) => {
    try{
        const employees = await Employee.find();
        const employeeid = req.params.id;
        if(employeeid){
            for(let i in employees){
                if(employees[i].id == employeeid){
                    res.status(201).json(employees[i]);
                    break;      
                }
            }
        }else{
            res.status(201).json(employees);
        }

    }catch(err){
        console.log("error occured while retriving : " + err);
        res.status(500).json({message : "Server error occured !"})
    }
}

const getemployee = async(req , res) => {
    try{
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            console.log("No Employee found !");
            res.status(400).json({message : "No Employee ID Found !"})
        }
        res.status(201).json(employee) 
    }catch(err){
        console.log("error occured while retriving : " + err);
        res.status(500).json({message : "Server error occured !"})
    }
}

const updateemployee = async(req , res) => {
    try{
        const {id , name , email , phone , city} = req.body;
        const employees = await Employee.find();
        let ID = "";
        for(let i in employees){
            if(employees[i].id == req.params.id){
                ID = employees[i]._id;
                break;
            }
        }
        if(ID.length == 0){
            console.log("No Employee found !");
            res.status(400).json({message : "No Employee ID Found !"})
        }else
        {
            const Ename = await Employee.findByIdAndUpdate(ID , {id , name , email , phone , city});
            if(Ename){
                res.status(201).json(Ename);
            }else{
                console.log("No Employee found !");
                res.status(400).json({message : "No Employee ID Found !"})
            }
        }
    }catch(err){
        res.status(500).json({message : "Server error occured !" + err})
    }
}

const deleteemployee = async(req , res) => {
    try{
        const employees = await Employee.find();
        let ID = "";
        for(let i in employees){
            if(employees[i].id == req.params.id){
                ID = employees[i]._id;
                break;
            }
        }
        console.log(ID);
        if(ID.length == 0){
            console.log("No Employee found to delete !");
            res.status(400).json({message : "No Employee ID Found !"})
        }else
        {
            await Employee.findByIdAndDelete(ID);
            res.status(201).send()
        }
    }catch(err){
        res.status(500).json({message : "Server error occured !"})
    }
}

module.exports = {
    createemployee , 
    getemployee , 
    getemployees ,
    deleteemployee ,
    updateemployee
};