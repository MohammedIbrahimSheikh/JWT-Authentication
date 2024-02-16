import express from 'express';
import  client  from '../mongodb.mjs';
const db = client.db("CRUD");
const col = db.collection("posts");

let router = express.Router()


// POST    /api/post
router.post('/post', async (req, res, next) => {

    if (!req.body.title && !req.body.text) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }
    try {
        const insertResponse = await col.insertOne({
            // _id: "7864972364724b4h2b4jhgh42",
            title: req.body.title,
            text: req.body.text,
            fullName:req.body.decoded.fullName,
            email:req.body.decoded.email,
            createdOn: new Date()
        });
        res.send('post created');
    } catch (e) {
        console.log("error inserting mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})
router.get('/posts',async (req,res)=>{
    try {
        let cursor = client.db("CRUD").collection("posts").find({email:req.body.email,fullName:req.body.decoded.fullName}).sort({_id:-1}).limit(15);
        let results = await cursor.toArray();
        res.send({results:results});
        // console.log(results);
    } catch (error) {
        console.log(error);
        res.status(500).send('please try later');
    }
})
export default router