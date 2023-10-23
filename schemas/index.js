const mongoose = require('mongoose');

require('dotenv').config();

const mongodbid = process.env.MONGODB_ID;
// console.log(mongodb);
const mongodbpass = process.env.MONGODB_PASS;
const mongodbhost = process.env.MONGODB_HOST;
const mongodbport = process.env.MONGODB_PORT;
const mongodbDB = process.env.MONGODB_DB;
console.log(mongodbid,mongodbpass,mongodbhost,mongodbport,mongodbDB);

const connect =()=>{
    // console.log('몽고디비에 접속합니다.');
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug',true);
    }
    //mongodb://아이디:비밀번호@주소:포트번호/admin
    mongoose.connect(
        `mongodb://${mongodbid}:${mongodbpass}@${mongodbhost}:${mongodbport}/${mongodbDB}`,{
            dbName : 'mydb',
            // useNewUrlParser:true
        }
    ).then(()=>{
        console.log('🎉몽고디비 연결 성공🎉');
    }).catch((err)=>{
        console.log('몽고디비 연결 에러', err);
    });
};

mongoose.connection.on('error',(error)=>{
    console.error('🩸db연결에 실패하심🩸');
});

mongoose.connection.on('disconnected',()=>{
    console.log('db연결 끊겼습니다. 연결을 재시도 합니다.');
    connect(); //연결 재시도
})

module.exports = connect;