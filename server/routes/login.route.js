const router = require('express').Router();
const bcrypt = require('bcrypt')
const { User } = require('../models/user.model')
const jwt = require('jsonwebtoken')

router.post('/', async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            res.status(404).json({message: 'User not found'})
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(400).json({message: 'Invalid credentials'})
            return;
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.status(200).json({
            userName: user.userName,
            email: user.email,
            token, 
            message: 'Login succesful'
        })
        
    } catch (err) {
        res.status(500).json({message: 'server error'})
        console.error(err)
    }12
})

module.exports = router;
