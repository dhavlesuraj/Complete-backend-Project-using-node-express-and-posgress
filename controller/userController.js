import prisma from "../DB/db.config.js";
import getTimeStamp from "../middleware/timeStamp.js";
import bcrypt from "bcrypt";


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
      return res.send("all fields are required");
    }
    //let regex =new Rejex("^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$");
    const regexEmail = /^[a-zA-Z]+[0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;
    
    if (!email.match(regexEmail)) {
            return res.json({
              status: 400,
              message: "Please Enter valid Email",
            });
    }
    const regexMob = /^[6789]\d{9}$/;
    if(!mobile_no.match(regexMob)){
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
    res.send("success");
  } catch (error) {
    console.log(error);
  }
};

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
  return res.send("user Login Successfully");
  console.log(email);
};


