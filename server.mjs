import express, { json } from 'express';
import client from './mongodb.mjs';
import path from 'path';
import cors from 'cors';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.mjs';
import postRouter from './routes/post.mjs';
// import path from 'path';
const app = express();
const _dir = path.resolve();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.get('/api/posts',async (req,res)=>{
    try {
        let cursor = client.db("CRUD").collection("posts").find({}).sort({_id:-1}).limit(15);
        let results = await cursor.toArray();
        res.send({results:results});
        // console.log(results);
    } catch (error) {
        console.log(error);
        res.status(500).send('please try later');
    }
})
app.use('/api',(req,res,next)=>{
  const token = req.cookies.token;
  try {
    var decoded = jwt.verify(token,process.env.SECRET);
    req.body.decoded = {
      fullName : decoded.fullName,
      // firstName:decoded.firstName,
      // lastName:decoded.lastName,
      email:decoded.email,
      isAdmin:decoded.isAdmin
    }
    console.log(req.body.decoded);
    next();
  } catch(err) {
    // err
    res.status(401).send({ message: "invalid token" });
  }
})
// secure api's is below

app.use("/api", postRouter) // Secure api

app.use('/',express.static(path.join(_dir, 'public'))); 
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})