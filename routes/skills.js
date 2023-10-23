const express =require('express');
const Skills = require('../schemas/skills');
const upload = require('../upload');
const fs = require('fs-extra');

const router = express.Router();
router.route('/list/id')
    .get(async(req,res,next)=>{
        try{
            const skills = await Skills.find();
            res.json(skills);
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/list')
    .get(async(req,res,next)=>{
        try{
            const row = await Skills.find({});
            res.render('skills',{row, title:'나의 스킬'});
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/write')
    .get(async(req,res,next)=>{
        res.render('skills_write',{title:'나의 스킬 입력'});
    })
    .post(upload.single('img'), async(req,res,next)=>{
        try{
            fs.moveSync('./img/'+req.file.filename, './img/skills/'+req.file.filename);

            var fileupload ='';
            if(req.file){
                fileupload ={
                    orimg:req.file.originalname,
                    img:req.file.filename   
                }
            }
            const data = {
                name:req.body.name,
                value:req.body.value
            }
            const datas = {...data, ...fileupload}
            const skills = await Skills.create(datas);
            console.log(skills);
            res.redirect('/skills/list');
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/edit/:id')
    .get(async(req,res,next)=>{
        try{
            const id = req.params.id;
            //const {id} = req.params;
            const row = await Skills.find({_id:id});
            const rs = row[0];
            res.render('skills_update', {rs, title:'스킬 수정'});
        }catch(err){
            console.error(err);
            next(err);
        }
    });
router.route('/edit')
    .post(upload.single('img'),async(req,res,next)=>{
        
        try{
            const {id}=req.params;
            var fileupload = '';
            if(req.body.imgchk ==1){
                //기존 파일 삭제 후 
                fs.removeSync('./img/skills/'+req.body.imgname);
                //새 파일 등록
                fileupload = {
                    orimg:req.file.originalname,
                    img:req.file.filename
                }
            }
            const skills = await Skills.updateOne({_id:id},{
                name:req.body.name,
                value:req.body.value,
                ...fileupload
            });
            console.log(skills);
            res.redirect('/skills/list')
        }catch(err){
            console.error(err);
            next(err);
        }
    });
    //delete
router.route('/del/:id')
    .get(async(req,res,next)=>{
        try{
            const id = req.params.id; 
            const row = await Skills.deleteOne();
            const rs = row[0];
            res.render('skills', {rs, title:'스킬 수정'});
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    module.exports = router;