import prisma from "../DB/db.config.js";
import getTimeStamp from "../utils/timeStamp.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  const userId = req.user.id;
  try {
    if (req.file) {
      const path = req.file.path;
      //console.log(path);

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
            image: path,
          },
        });
        return res.json({
          message: "image updated successfully",
          filename: req.file.filename,
        }); 
      } else {
        
        await prisma.user_image.create({
          data: {
            user_id: userId,
            image: path,
            created_at: getTimeStamp(new Date()),
          },
        });
        return res.json({
          message: "File uploaded successfully",
          filename: req.file.filename,
        });
      }
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.log(error);
  }
};
