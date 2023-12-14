import prisma from "../DB/db.config.js";
import getTimeStamp from "../utils/timeStamp.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";
import fs from "fs";

const secretKey = process.env.secretKey;
const sendMessageOnMail = async (name, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      requireTLS: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        // user: "surajdhavle1106@gmail.com",
        // pass: "tjyl vztp oqql kqtp ",
        user: process.env.emailId,
        pass: process.env.password,
      },
    });

    const info = await transporter.sendMail({
      from: "surajdhavle1106@gmail.com", // sender address
      to: email, // list of receivers
      subject: `Hello${name}`, // Subject line
      text: "Hello world?", // plain text body
      //html: "<b>Hello world?</b>", // html body
      html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Login</title>
</head>

<body style="display: flex; align-items: center;justify-content: center;">
  <div>
    <div class="mainDiv" style="margin-top: 80px;border-radius: 10px;height: 70vh;width: 40vh;border: 10px solid black;">
      <div style="display: flex; align-items: center;justify-content: center;margin-top: 70px;">
        <h3>Congratulations ${name}! 🎉</h3>
      </div>
      <div style="display: flex; align-items: center;justify-content: center">
        <img style="height: 150px;width: 200px;"
        src="https://cdn.pixabay.com/photo/2019/04/24/11/27/flowers-4151900_1280.jpg">
      </div>
    </div>
  </div>
</body>
</html>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

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
    await sendMessageOnMail(first_name, email);
    // const salt = await bcrypt.genSalt(10);
    // const securePassword = await bcrypt.hash(password, salt);
    // const newUser = await prisma.users.create({
    //   data: {
    //     first_name,
    //     last_name,
    //     email,
    //     password: securePassword, //securePass is object
    //     mobile_no,
    //     gender,
    //     age,
    //     date_of_birth: new Date(date_of_birth),
    //     created_at: getTimeStamp(new Date()),
    //   },
    //});
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

  const token = Jwt.sign(payload, secretKey, { expiresIn: "30m" });
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

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    if (password != "") {
      const user = await prisma.users.findFirst({
        where: {
          user_id: userId,
        },
      });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
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
      } else {
        res.json({ status: "failed", message: "Enter unique password" });
      }
    } else {
      res.json({ status: "failed", message: "Enter password" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUserDetails = async (req, res) => {
  const userId = req.user.id;
  const {
    first_name,
    last_name,
    email,
    mobile_no,
    gender,
    age,
    date_of_birth,
  } = req.body;
  if (
    first_name == "" ||
    last_name == "" ||
    email == "" ||
    mobile_no == "" ||
    gender == "" ||
    age == "" ||
    date_of_birth == ""
  ) {
    res.json({ status: "failed", message: "Enter updated fields" });
  } else {
    await prisma.users.update({
      where: {
        user_id: userId,
      },
      data: {
        first_name,
        last_name,
        email,
        mobile_no,
        gender,
        age,
        date_of_birth: new Date(date_of_birth),
      },
    });
    res.json({
      status: "success",
      message: "user details updated successfully",
    });
  }
};
