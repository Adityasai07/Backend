const express = require('express');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const session = require('express-session');
const monogodbStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeeRoutes = require('./routes/employeeRoutes');
const User = require('./models/User');
const BannedUser = require('./models/BannedUser');
const app = express()
const PORT = process.env.PORT || 8000

// console.log(process.env)
app.set("view engine" , "ejs");
dotenv.config()
app.use(bodyparser.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
// console.log("Mongo URI:", process.env.mongouri);

mongoose.connect(process.env.mongouri).then(()=>{
            console.log("Connected to mongo db !");
        }
    ).catch((error)=>{
            console.log("Error occured " + error);
    }
)

// session key componets
const store = new monogodbStore({
    uri : process.env.mongouri,
    collection : "MySession"
});

app.use(session({
    secret: 'Sai',
    resave: false,
    store : store ,
    saveUninitialized: false    ,
    cookie: { 
        maxAge: 10 * 60 * 1000  // Session expires after 30 minutes (1800000 ms)
    }
  }));


const banned = async(req , res , next) => {
    if(!req.session.user){
        console.log("Your id not auth user , sorry !!!");
        return res.redirect('/SignIn');
    }
    const {userId} = req.session.user;
    console.log(userId);
    if(!await BannedUser.findOne({userId : userId})){
        next();
        return;
    }else{
        req.session.destroy((err) => {
            if(err){
                console.log("Session destroyed !!!! " + err);
            }
        });
        console.log("Your id is banned , sorry !!!");
        return res.redirect('/SignIn');
    }
}


// routing - gets
app.get('/Signup' , (req , res)=>{
    return res.render('Signup');
});
app.get('/SignIn' , (req , res)=>{
    return res.render('SignIn');
});
app.get('/Home' , banned ,(req , res)=>{
    if(!req.session.user){
        return res.redirect('/SignIn');
    }else{
        const {userId , userEmail , userName} = req.session.user;
        console.log(userId , userEmail , userName);
        return res.render('Home' , {userId , userEmail , userName});
    }
});

app.get('/logout' , (req , res) =>{
    req.session.destroy((err)=>{
        if(err){
            console.log("Logout Failed !!!");
        }else{
            return res.redirect('/SignIn');
        }
    })
});
// forms - post
app.post('/ban/:userId' , async(req , res) => {
    try{
        console.log("Entered to Ban ! ");
        const banUserId = await User.findOne({userId : req.params.userId});
        console.log(banUserId);
        console.log(await BannedUser.findOne({userId : req.params.userId}));
        if(await BannedUser.findOne({userId : req.params.userId})){
            console.log("Already Ban !");
            return res.redirect("/SignIn");
        }
        if(banUserId.userId){
            const bannedUser  = new BannedUser({
                userId : banUserId.userId
            });
            console.log("Found the user to Ban !");
            await bannedUser.save();
            console.log("Banned Successfully !");
            res.redirect('/SignIn');
        }else{
            console.log("No user found to Ban! ");
            res.redirect('/SignIn');
        }
    }catch(err){
        console.log("Error occured ! " + err);
        res.status(500).send();
    }
});

app.post('/SignInForm' , async(req , res) => {
    try{
        const {xuserId , xpassword} = req.body;
        const user = await User.findOne({userId : xuserId});
        if(!user){
            console.log("No user Found !");
            return res.redirect('/SignIn');
        }if(await bcrypt.compare(xpassword , user.password)){
            console.log("entered and correct password!!!");
            req.session.user = {
                userId : user.userId ,
                userEmail : user.userEmail ,
                userName : user.userName
            }
            console.log(req.session.user);
            if(!req.session.user){
                console.log("Session not created !!!!" + err);
                return res.redirect('/SignIn');        
            }
            return res.redirect('/Home');
        }else{
            console.log("Wrong password !");
            return res.redirect('/SignIn');
        }
    }catch(err){
        console.log("Error Occured !!!!" + err);
        return res.redirect('/SignIn');
    }
})
 
app.post('/signupForm' , async(req , res) => {
    try{
        console.log("Entered !");
        const {userId , password , userName , userEmail} = req.body;
        console.log(req.body);
        let newuser = new User({
            userId , password , userName , userEmail
        });
        newuser = new User({
            userId , password : await bcrypt.hash(password , 12), userName , userEmail
        })
        console.log(newuser);
        await newuser.save();
        console.log("Saved !!!");
        console.log("Redirect Success !");
        return res.redirect('/SignIn');
    }catch(err){
        console.log("Error Occured !!!!");
        return res.redirect('/Signup');
    }
})

// Employee implementation
app.use('/Employees' , employeeRoutes)


// jwt 

app.use('/api/SignIn' , async(req , res) => {
    try{
        const {userId , password} = req.body;
        const user = await User.findOne({userId : userId});
        console.log( {userId , password} + user + " "+ await bcrypt.compare(password , user.password ));
        if(user.userId === userId && await bcrypt.compare(password ,user.password)){
            console.log("Entered !");
            const accessToken = jwt.sign( {userId : user.userId, userName : user.userName , password : user.password , userEmail : user.userEmail }, process.env.secretKey); 
            res.json({userId : user.userId, userName : user.userName , password : user.password , userEmail : user.userEmail , accessToken});
        }else{
            console.log("No match !");
            res.json({userId , password , message : "No Match"});
        }

    }catch(err){
        console.log("Error " + err);
        res.status(500).send("Error occured !"+ err);
    }
});

const verifyjwt = (req , res , next)=>{
    const token = req.headers.auth;
    if(token){
        const newToken = token.split(' ')[1];
        jwt.verify(newToken , process.env.secretKey , (err , user) =>{
            if(err){
                console.log(err);
            }else{
                req.user = user ; 
                next();
            }
        })
    }else{
        console.log("Error token : " + token);
    }
};


app.delete('/api/delete/:id' , verifyjwt , async(req , res) => {
    try{if(req.params.id === req.user.userId){
        if(await User.findOne({userId : req.params.id})){
             
            res.json({"message" : "Deleted successful"});
        }else{
            res.json({"message" : "No ID to Delete"});
        }
    }}
    catch(err){
        console.log("error : " + err);
        res.json({"message" : "Not Deleted"});
    }
})

app.listen(PORT , ()=>{
    console.log(PORT);
    console.log(`server is running at ${PORT} !!!`);

});