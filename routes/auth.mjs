import express from 'express';
import client from '../mongodb.mjs';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
let router = express.Router()
const usersCollection = client.db("CRUD").collection("users");
// /api/auth/signup
router.post('/signup', async (req, res) => {
    if (!(req.body.firstName) || !(req.body.lastName) || !(req.body.email) || !(req.body.password)) {
        res.status(400).send(`required fields missing, request example: 
            {
                "firstName": "John",
                "lastName": "Doe",
                "email": "abc@abc.com",
                "password": "12345"
            }`);
        return;
    }
    // req.body.email = req.body.email.toLowerCase();//todo validate email
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    try {
        let result = await usersCollection.findOne({email:req.body.email});
        if(!result){
            const insertResponse = await usersCollection.insertOne({
                fullName : `${req.body.firstName} ${req.body.lastName}`,
                email     : req.body.email,
                password  : hashPassword,
                createdOn : new Date()
            })
            console.log("insertResponse",insertResponse);
            res.send({message:"Signup Successful"});
        }else{
            res.status(403).send({message:"User Already Exist"});
        }

    } catch (error) {
        console.log("error getting data mongodb: ", error);
        res.status(500).send({message:"server error, please try later"});
    }
})
router.post('/login',async (req,res)=>{
    if (!(req.body.email) || !(req.body.password)) {
        res.status(400).send(`required fields missing, request example: 
            {
                "email": "abc@abc.com",
                "password": "12345"
            }`);
        return;
    }
    // req.body.email = req.body.email.toLowerCase();//todo validate email
    try {
        let result = await usersCollection.findOne({email:req.body.email});
        //Todo create token for this user
        if(!result) res.status(403).send({message:"You need to SignUp First"});
        
        else{
            // verify by hash
            if (bcrypt.compareSync(req.body.password, result.password)) {
                const token = jwt.sign({
                    isAdmin:false,
                    fullName : result.fullName,
                    email:req.body.email,
                },process.env.SECRET,{
                    expiresIn:"24h"
                });
                res.cookie("token",token,{
                    secure:true,
                    httpOnly:true
                })
                res.send({message:"Login Successful"});
            }
            else res.status(401).send({message:"Login Failed"})
        }
    } catch (error) {
        res.status(500).send({message:"Server error,please try error"})
    }
})
export default router;