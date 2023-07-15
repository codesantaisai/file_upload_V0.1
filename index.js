const { error } = require('console');
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '_' + Date.now() + path.extname(file.originalname))
    }
});


let maxSize = 2 * 1000 * 1000;
let upload = multer({
    storage: storage,
    limits: {
        fileSize:maxSize,
        },
    fileFilter: function (req, file, cb) {
        let fileType = /jpeg|jpg|png/;
        let mimeType = fileType.test(file.mimetype);
        let extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase())

        if (mimeType && extname) {
            cb(null, true)
        } else {
             cb("Error:file upload only supports following only" + fileType)
        }
    }
}).single('myPic');

app.get('/', (req, res) => {
    res.render('signup')
});

app.post('/upload', (req, res) => {
    upload(req, res, function(err){
        if (err) {
            if(err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE"){
               return res.send("File Size Should be less than 2mb")
            }
            
            res.send(err)
        } else {
            res.send("Successfully File Uploaded")
        };
    });
});

app.listen(3000, () => {
    console.log("server connected on Port:3000")
});