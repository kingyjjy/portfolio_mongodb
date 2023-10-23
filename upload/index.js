const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination:(req, file, done)=>{
            done(null, './img');
        },
        filename:(req, file, done)=>{
            const ext = path.extname(file.originalname);

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
            done(null, file.fieldname + '-' + uniqueSuffix + ext)
        }
    })
});

module.exports = upload;