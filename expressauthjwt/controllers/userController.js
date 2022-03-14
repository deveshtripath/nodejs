import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class UserController {
    static userRegistration = async(req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password == password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ emal: email })
                            /// genrate jwt token
                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" })

                        res.status(201).send({ "status": "success", "message": "Registration Succcessful", "token": token })

                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "Unable to register" })
                    }

                } else {
                    res.send({ "status": "failed", "message": "Passward and confirm password does not match" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fieled are required" })
            }
        }
    }

    static userLogin = async(req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {
                        // genrate token
                        const saved_user = await UserModel.findOne({ emal: email })
                            /// genrate jwt token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" })

                        res.send({ "status": "Success", "message": "Login Successfully done by you ", "token": token })
                    } else {
                        res.send({ "status": "failed", "message": "Email and Password is not correct" })
                    }
                } else {
                    res.send({ "status": "failed", "message": "You are not registerd user" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fieled are required" })
            }
        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to login" })
        }
    }

    static changeUserPassword = async(req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ "status": "failed", "message": "Passward and confirm password does not match" })

            } else {
                const salt = await bcrypt.genSalt(10)
                const newhashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newhashPassword } })
                res.send({ "status": "Success", "message": "password change Successfully done by you " })
            }
        } else {
            res.send({ "status": "failed", "message": "All fieled are required" })
        }

    }


    static loggedUser = async(req, res) => {
        res.send({ "user": req.user })
    }

    static sendUserPasswordResetEmail = async(req, res) => {
        const { email } = req.body
        if (email) {
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "5d" })
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)
                res.send({ "status": "success", "message": "Reset passoword is successfull" })

            } else {
                res.send({ "status": "failed", "message": "Email does not exist..." })
            }
        } else {
            res.send({ "status": "failed", "message": "Email Fiield is required" })
        }
    }


    static userPasswordReset = async(req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY

        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password === password_confirmation) {
                    res.send({ "status": "failed", "message": "New passwod and confirm password does not match" })
                } else {
                    const newhashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(user._id, { $set: { password: newhashPassword } })
                    res.send({ "status": "success", "message": "Email send .... Check your email success" })
                }
            } else {
                res.send({ "status": "failed", "message": "ALL fields are required" })
            }

        } catch (error) {
            res.send({ "status": "failed", "message": "Email already exists" })
        }
    }
}

export default UserController




// $2b$10$YA4M3WmLKBZbhKl1DWGXn.XhRgodkJoOJq1A20v1EyNmC.q3FKL/a        old  --- hello
// $2b$10$R2rLBQYy.EDI4o3Ktek2B.5wX1bc.E37kouppbTQjEJVAmJC.LsYC        new -- sujai