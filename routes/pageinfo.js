const express =require('express');
const multer = require('multer');
const upload = require('../upload');
const Pageinfo = require('../schemas/pageinfo');
const fs = require('fs-extra');

const router = express.Router();

router.route('/list/:pagename')
    .get(async(req,res,next)=>{
        try{
            const pagename = req.params.pagename;
            const pageinfo = await Pageinfo.find({pagename: pagename});
            res.status(201).json(pageinfo);
        }catch(err){
            console.error(err);
            next(err);
        }
    });
    
router.route('/list')
    .get(async(req,res,next)=>{
        try{
            const row = await Pageinfo.find({});
            res.render('pageinfo',{row});
        
        }catch(err){
            console.error(err);
            next(err);
        }
    });

router.route('/write', upload.array('img'))
    .get((req,res,next)=>{
        res.render('pageinfo_write')
    })
    .post(upload.array("img"),(async(req,res,next)=>{
        try{
            
            let fileupload;
            for(let i=0; i<req.files.length; i++){
                fs.moveSync('./img/'+req.files[i].filename,'./img/pageinfo/'+req.files[i].filename);
            }
            if(!req.files || req.files.length == 0){
                fileupload = '';
            }else{
                fileupload = {
                    orimg:req.files.map(file=>file.originalname),
                    img:req.files.map(file=>file.filename)
                }
            }
            console.log(req.body, req.files);
            const pageinfo = await Pageinfo.create({
                ...fileupload,
                pagename:req.body.pagename,
                title:req.body.title,
                content:req.body.content,
                animated:req.body.animated,
              
            });
            //res.send(req.body);
            console.log(pageinfo);
            res.redirect('/pageinfo/list');
        }catch(err){
            console.error(err);
            next(err);
        }
    }));

router.route('/edit/:id')
    .get(async(req,res,next)=>{
        try{
            const id = req.params.id;
            const row = await Pageinfo.find({_id:id});
            const rs = row[0];
            let sa='',sb='',sc='',sd='',se='';
            switch(rs.pagename){
                case 'meta':
                    sa='selected';
                    break;
                case 'introdata':
                    sb='selected';
                    break;
                case 'protfoliodata':
                    sc='selected';
                    break;
                case 'aboutdata':
                    sd='selected';
                    break;
                case 'service':
                    se='selected';
                    break;
            }
            const select = {
                sa:sa,
                sb:sb,
                sc:sc,
                sd:sd,
                se,se
            }
            res.render('pageinfo_update',{rs,select});
        
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/edit')
    .post(async(req,res,next)=>{
        try{
            let fileupload;
            if(!req.files || req.files.length == 0){
                fileupload = '';
            }else{
                fileupload = {
                    orimg:req.files.map(file=>file.originalname),
                    img:req.files.map(file=>file.filename)
                }
            }
            const pageinfo = await Pageinfo.updateOne({
                _id:req.body.id
            },{
                title:req.body.title,
                content:req.body.content,
                animated:req.body.animated,
                fileupload
            });
            console.log(pageinfo);
            res.redirect('/pageinfo/list');
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    

    module.exports = router;