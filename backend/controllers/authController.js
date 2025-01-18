const mongoose = require('mongoose');
const Auth = require('../models/authModel')
const {registerSchema} = require('../middlewares/validator');
const {loginSchema} = require('../middlewares/validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    const {firstName, lastName, phone, email, password, confirmPassword} = req.body

    try{
        const {error, value} = registerSchema.validate({
            firstName, lastName, phone, email, password, confirmPassword
        })
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }

        const existingUser = await Auth.findOne({email})
        if(existingUser){
            return res.status(400).json({message: 'Email already exists'})
        }
        // Hash Password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new Auth({
            firstName, lastName, phone, email, password: hashedPassword
        })
        const result = await user.save()
        // jwt
        const token = jwt.sign(
            { userId: result._id, email: result.email},
                process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION
            }
        )

        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1 hour timeout
            httpOnly: true
        })

        return res.status(201).json({message: 'User registered successfully', data: result})
    }catch (error){
        return res.status(400).json({message: "Error occured while creating the user", error: error.message})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const {error, value} = loginSchema.validate({
            email, password
        })
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        
        const user = await Auth.findOne({email})
        if(!user){
            return res.status(400).json({message: 'User not found'})
        }
        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        // jwt
        const token = jwt.sign(
            { userId: user._id, email: user.email},
                process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION
            }
        )

        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1 hour timeout
            httpOnly: true
        })

        res.status(200).json({message:"login successfull", user: user.firstName})

    }catch (error){
        return res.status(400).json({message:"Error occurred during login ", error: error.message})
    }
}

const logout = (req, res) => {
    res.clearCookie('token')
    res.redirect('/');
    res.status(200).json({message: 'Logged out'})
}

module.exports = {register, login, logout}