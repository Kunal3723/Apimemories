import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) { return res.status(404).json({ message: "User does not exist" }) }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) { return res.status(400).json({ message: "Invalid credentials" }) }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1hr" });

        res.status(200).send({ token, result: existingUser });
       



    } catch (error) {
        res.status(500).json({ message: message.error });
    }
}

export const signup = async (req, res) => {
    const { firstName, lastName, confirmPassword, password, email } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) { return res.status(404).json({ message: "User already exist" }) }

        if (password !== confirmPassword) { return res.status(404).json({ message: "Password does not match" }) }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await userModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1hr" });
        
        res.status(200).send({ token, result: result });
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
}