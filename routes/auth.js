const User = require('../models/User');

const router = require('express').Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')

router.get("/login",(req,res)=>{
    res.render("signin")
})

router.get("/register",(req,res)=>{
    res.render("signup")
})


router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).render("signin")
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.status(401).json('wrong credentials')
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if (OriginalPassword !== req.body.password) {
            res.status(401).json('wrong credentials');
        }
        else {
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC, { expiresIn: "1h" })
            
            return res.status(200).cookie("token",token,{httpOnly:true})
            .render("products");
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

router.put('/logout',async(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.render("index")
})

module.exports = router