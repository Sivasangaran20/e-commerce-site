const User = require('../models/User');
const { verifyToken, verifyTokenandAuthorization,verifyTokenandAdmin } = require('./verifyToken');

const router = require('express').Router();

// router.get('/user',(req,res)=>{
//     res.send('the user tested')
// });

// router.post('/userPost',(req,res)=>{
//     const username = req.body.username;
//     res.send('your username is:'+username)
//     console.log(username)
// })


router.put('/:id', verifyTokenandAuthorization ,async(req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new: true}
        );
        return res.status(200).json(updatedUser);
    }catch(err){
        return res.status(500).json(err)
    }
});

router.delete('/:id', verifyTokenandAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted')
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/find/:id', verifyTokenandAdmin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {...others } = user._doc;
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/allusers', verifyTokenandAdmin,async(req,res)=>{
    const query = req.query.new;
    try{
        const users = query ? await User.find().sort({_id: -1}).limit(1) : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/stats',verifyTokenandAdmin,async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$gte:lastYear} } },
            {
                $project:{
                month:{$month: "$createdAt"},
                },
            },
            {
                $group:({
                    _id : "$month",
                    total : {$sum :1 },  
                }),
            },
        ]);
        return res.status(200).json(data);
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router