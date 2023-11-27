import prisma from "../DB/db.config.js";
import getTimeStamp from "../utils/timeStamp.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import config from "../utils/config.js";

//* create user
export const createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      mobile_no,
      gender,
      age,
      date_of_birth,
    } = req.body;
    if (
      [
        first_name,
        last_name,
        email,
        password,
        mobile_no,
        gender,
        age,
        date_of_birth,
      ].some((field) => field?.trim() === "")
    ) {
      return res.json({ status: "failed", message: "all fields are required" });
    }
    const regexEmail = /^[a-zA-Z]+[0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;

    if (!email.match(regexEmail)) {
      return res.json({
        status: 400,
        message: "Please Enter valid Email",
      });
    }
    const regexMob = /^[6789]\d{9}$/;
    if (!mobile_no.match(regexMob)) {
      return res.json({
        status: 400,
        message: "Please Enter valid mobile Number",
      });
    }
    const ageAsInteger = parseInt(age);
    if (!isNaN(ageAsInteger) && ageAsInteger <= 0) {
      return res.json({
        status: 400,
        message: "Please Enter valid age",
      });
    }
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.json({
        status: 400,
        message: "Email Already Taken,Please Anther Email.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password: securePassword, //securePass is object
        mobile_no,
        gender,
        age,
        date_of_birth: new Date(date_of_birth),
        created_at: getTimeStamp(new Date()),
      },
    });
    res.json({ status: "success", message: "user create successfully" });
  } catch (error) {
    console.log(error);
  }
};

//* user login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if ((email && password) == "") {
    return res.json({ status: "failed", message: "All fields are required" });
  }
  const user = await prisma.users.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.json({
      status: "failed",
      message: "please try to login with correct credential",
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.json({
      status: "failed",
      message: "please try to login with correct credential",
    });
  }
  const payload = {
    user: {
      id: user.user_id,
    },
  };

  const token = Jwt.sign(payload, config.secretKey, { expiresIn: "10m" });
  res.json({ token });
  //return res.json({status:200,message:"user Login Successfully"});
};


//* get data on authored user
export const getAuthUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.users.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: false,
        mobile_no: true,
        gender: true,
        age: true,
        date_of_birth: true,
        created_at: true,
      },
    });

    return res.send(user);
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword =async (req,res) => {
  try {
    const userId = req.user.id;
    const newPassword=req.body.password;
    if (newPassword != ""){
      const user = await prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
      const passwordMatch = await bcrypt.compare( newPassword,user.password);
      if(!passwordMatch){
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(newPassword, salt);  
        await prisma.users.update({
          where: {
            user_id: userId,
          },
          data: {
            password: securePassword,
          },
        });
        res.json({
          status: "success",
          message: "user password updated successfully",
        });
      }else{
      res.json({status:"failed", message: "Enter unique password"});
      }
    }else{
    res.json({ status: "failed", message: "Enter password" });
    }
  } catch (error) {
    console.log(error);
  }
};
