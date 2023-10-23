const express =require('express');
const Category = require('../schemas/category');
const Portfolio = require('../schemas/portfolio');
const upload = require('../upload');
const fs = require('fs-extra');

const router = express.Router();
router.route('/list')
    .get(async(req,res,next)=>{
        try{
            const row = await Portfolio.find({});
            res.render('portfolio',{row});
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/write')
    .get((req,res,next)=>{
        res.render('portfolio_write',{title:'포트폴리오'});
    })
    
    
    // .route('/write')
    // .route('/update/:id')
    // .route('/delete/:id')

    module.exports = router;