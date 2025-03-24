const express = require('express');
const route = express.Router();
const employeeController = require('../controllers/EmployeeController');
const Employee = require('../models/Employee');
// get , post , put/patch , delete
// CRUD operations ! 
// Create
route.post('/addemp' , employeeController.createemployee);

// Read
route.get('/getemps/:id' , employeeController.getemployees);
route.get('/getemps' , employeeController.getemployees);
route.get('/getemp/:id' , employeeController.getemployee);
route.put('/updateemp/:id' , employeeController.updateemployee);
route.delete('/deleteemp/:id' , employeeController.deleteemployee);
module.exports = route;