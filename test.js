
// let arr = [1,2,3,7,4,5];
// arr.sort();
// arr.forEach((i) => {
//     console.log(i);
// });

// for(i of arr){
//     console.log(typeof(i));
// }

// let date = new Date();
// console.log(date);

const path = require('path');
const os = require('os');
const fs = require('fs');
const http = require('http');
const express = require('express');
// console.log(os.type() + " " + os.version() + "\n" + os.freemem() + "\n" +  os.cpus());

// console.log(__dirname)
// console.log(__filename)

// console.log(path.dirname(__filename))
// console.log(path.parse(__filename));

// fs.readFile("test.txt" , "utf-8" , (err , data)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log(data);
//     }

// });

// const writingfile = "Aditya sai Kudupudi";

// fs.writeFile("test2.txt" , writingfile , (err)=>{
//     if(err){console.log(err);}
// });

// fs.rename("test2.txt" , "testing2.txt" , (err)=>{
//     if(err){console.log(err);}
// });
// fs.unlink("testing2.txt" ,(err)=>{

// });
// console.log();


// const serverX = http.createServer((req , res) => {
//     res.write("ABCDEF");
//     res.end(); 
// }).listen(8000);

// const ms = require('./m');
// const {addition , subtraction} = require('./m');
// console.log(addition(4 , 6));
// console.log(ms.addition(3 , 5));

// console.log("Hi")

const test = express()


test.get('/aditya' , (req , res) => {
    res.send("Aditya created !");
})
const ismobile = ((req , res , next)=>{
    const mobileNumber = req.query.mnumber; // Assuming the number is passed as a query parameter

    // Regex to validate a 10-digit mobile number (India-specific example)
    const mobileRegex = /^[6-9]\d{9}$/;

    if (mobileNumber && mobileRegex.test(mobileNumber)) {
        next(); // Valid mobile number, proceed to the next middleware
    } else {
        res.status(400).send("Invalid Mobile Number! Please provide a valid 10-digit number.");
    }
})
test.get('/sai' , (req , res) => {
    res.send("sai created !");
})
test.get('/Kudupudi' , (req , res) => {
    res.send("Kudupudi created !");
})
test.get('/mobile' , ismobile ,(req , res) => {
    res.send("Mobile Number is Valid !");
})

test.listen(8000 , ()=>{
    console.log("Started !");
})
