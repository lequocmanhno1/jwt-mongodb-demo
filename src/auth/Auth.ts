import { NextFunction, Request, Response } from 'express';
import {User}  from '../model/User';
import cryptojs, {AES} from 'crypto-js';
import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";


const jwtSecretkey = process.env.JWT_SECRET_KEY;

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    if (password.length <6 ){
        return res.status(400).json({message: 'Password less than 6 characters'});
    }
    try {
        var hashPassword: string = cryptojs.SHA256(password).toString(cryptojs.enc.Base64)
        // cryptojs.SHA256(password).toString(CryptoJS.enc.Base64).then(async (hash) => {
        await User.create({
            username,
            password: hashPassword,
            // password:hash
        }).then(user => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecretkey!,
            {
                expiresIn: maxAge, // 3hrs in sec
            }
            );
            res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
            });
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        })
    });
    } catch (error:any) {
        res.status(401).json({
            message: "User not successfully created",
            error: error.message,
        })
    }
    // });
}

// export const login = async (req: Request, res: Response, next: NextFunction) => {
//     const {username, password} = req.body;
//     //Check if username and password are provided
//     if (!username ||!password){
//         return res.status(400).json({message: 'Username and password are required'});
//     }
// }


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var hashPassword = cryptojs.SHA256(req.body.password).toString(cryptojs.enc.Base64)
        const user = await User.findOne({where: {username: req.body.username, password: hashPassword}});

        if (!user){
            const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user!._id, username:req.body.username, role: user!.role },
            jwtSecretkey!,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user!._id,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
    } catch (error:any) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}


//update a basic user to admin user
export const update = async (req: Request, res: Response, next: NextFunction)=>{
    const {role, id } = req.body;

    // Varifying if role and is id present

    if (role && id) {
        // Second - Verifying if the value of role is admin
        if (role === "admin") {
          // Finds the user with the id
          await User.findById(id)
            .then((user) => {
              // Third - Verifies the user is not an admin
              if (user!.role !== "admin") {
                user!.role = role;
                user!.save((err) => {
                  //Monogodb error checker
                  if (err) {
                    res
                      .status(400)
                      .json({ message: "An error occurred", error: err.message });
                    process.exit(1);
                  }
                  res.status(201).json({ message: "Update successful", user });
                });
              } else {
                res.status(400).json({ message: "User is already an Admin" });
              }
            })
            .catch((error) => {
              res
                .status(400)
                .json({ message: "An error occurred", error: error.message });
            });
}
    }
}

export const deleteUser = async (req:Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    await User.findById(id)
    .then((user => user?.remove()))
    .then((user => 
        res.status(201).json({
            message: "User successfully Deleted",
            user,
        })))
    .catch (error => 
            res
            .status(400)
            .json({
                message: "An error occurred",
                error: error.message,
            }))    
}



export const adminAuth = (req:Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecretkey!, (err:any, decodedToken:any) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }