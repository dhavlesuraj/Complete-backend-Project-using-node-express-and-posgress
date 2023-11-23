
import "dotenv/config";
import express  from "express";
const app=express();
const PORT =process.env.PORT || 3000;

app.get("/",(req,res)=>{
    return res.send("Hi Everyone");
});

app.use(express.json());

app.listen(PORT,()=>console.log(`server is running on Port ${PORT}`))

import routes from "./routes/index.js";
app.use(routes);