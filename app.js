const express = require("express");
const path = require('path');
const nunjucks = require('nunjucks');
const fs = require('fs');
const indexRouter = require('./routes');
const connect = require('./schemas');
const myinfoRouter = require('./routes/myinfo');
const pageinfoRouter = require('./routes/pageinfo');
const portfolioRouter = require('./routes/portfolio');
const timelineRouter = require('./routes/timeline');
const skillsRouter = require('./routes/skills');
const multer = require('multer');

const app = express();

try{
    fs.readdirSync('img');
}catch(err){
    console.log('img폴더 없음 폴더 생성');
    fs.mkdirSync('img');
}

require('dotenv').config();
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views',{
    express:app,
    watch:true
});
connect();

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'img')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/',indexRouter);
app.use('/myinfo', myinfoRouter);
app.use('/pageinfo',pageinfoRouter);
app.use('/portfolio',portfolioRouter);
app.use('/timeline',timelineRouter);
app.use('/skills',skillsRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터를 찾을수 없음`);
    error.status = 404;
    next(error);
});
app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.send('error');
});



app.listen(app.get('port'), ()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});