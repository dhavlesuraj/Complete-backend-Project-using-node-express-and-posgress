import prisma from "../DB/db.config.js";
import getTimeStamp from "../utils/timeStamp.js";
import fs from "fs";

//upload file or images to database

export const uploadImage = async (req, res) => {
  const userId = req.user.id;
  const file = req.files.file;
  const base64Data = file.data.toString("base64");
  //console.log(base64Data);

  try {
    if (req.files.file) {
      const user = await prisma.user_image.findUnique({
        where: {
          user_id: userId,
        },
      });
      if (user) {
        await prisma.user_image.update({
          where: {
            user_id: userId,
          },
          data: {
            image: base64Data,
          },
        });
        return res.json({
          message: "image updated successfully",
        });
      } else {
        await prisma.user_image.create({
          data: {
            user_id: userId,
            image: base64Data,
            created_at: getTimeStamp(new Date()),
          },
        });
        return res.json({
          message: "File uploaded successfully",
        });
      }
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.log(error);
  }
};

//get uploaded file or images to database

export const getFileOrImages = async (req, res) => {
  const userId = req.user.id;
  try {
    // const user = await prisma.user_image.findFirst({
    //   where: {
    //     user_id: userId,
    //   },
    //   select: {
    //     image: true,
    //   },
    // });

    //const user = await prisma.$queryRaw`SELECT * FROM public.users JOIN user_image ON users.user_id=${userId}`;
    const user =
      await prisma.$queryRaw`SELECT u.user_id,first_name,last_name,image from users u JOIN user_image ui ON u.user_id = ui.user_id where u.user_id=${userId};`;
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
  
};
