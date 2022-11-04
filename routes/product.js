const Product = require('../models/Product');
const { verifyToken, verifyTokenandAuthorization,verifyTokenandAdmin } = require('./verifyToken');

const router = require('express').Router();


router.post('/',verifyTokenandAdmin,async(req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct =await newProduct.save();
        return res.status(200).json(savedProduct);  
    } catch(err){
        return res.status(500).json(err);
    }
});

router.put('/:id', verifyTokenandAdmin ,async(req,res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new: true}
        );
        return res.status(200).json(updatedProduct);
    }catch(err){
        return res.status(500).json(err)
    }
});

router.delete('/:id', verifyTokenandAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('Product has been deleted')
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/find/:id',async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/allproducts',async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1);
        }else if(qCategory){
            products = await Product.find({
                categories : {
                    $in : [qCategory],
                },
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get("/search", async (req, res) => {
    const perPage = 8;
    let page = parseInt(req.query.page) || 1;
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
  
    try {
      const products = await Product.find({
        title: { $regex: req.query.search, $options: "i" },
      })
        .sort("-createdAt")
        .skip(perPage * page - perPage)
        .limit(perPage)
        .populate("category")
        .exec();
      const count = await Product.count({
        title: { $regex: req.query.search, $options: "i" },
      });
      res.render("shop/index", {
        pageName: "Search Results",
        products,
        successMsg,
        errorMsg,
        current: page,
        breadcrumbs: null,
        home: "/products/search?search=" + req.query.search + "&",
        pages: Math.ceil(count / perPage),
      });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  });
  
module.exports = router