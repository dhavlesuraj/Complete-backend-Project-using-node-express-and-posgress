
import "dotenv/config";
import express  from "express";
import fileUpload from "express-fileupload";
const app=express();
const PORT =process.env.PORT || 3000;

app.get("/",(req,res)=>{
    return res.send("Hi Everyone");
});

app.use(fileUpload());    //it is use to upload file or images in database
app.use(express.json());

app.listen(PORT,()=>console.log(`server is running on Port ${PORT}`))

import routes from "./routes/index.js";
app.use(routes);