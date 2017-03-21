var fs = require('fs');
var express = require('express');
var bodyParder = require('body-parser');
var multer = require('multer');

var app = express();//初始化app

app.use(bodyParder()); 
app.use(express.static(__dirname + ''));
app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);//让options请求快速返回
    else next();
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        var fileformat = (file.originalname).split('.');
        cb(null, file.fieldname + '-' + Date.now()+'.'+fileformat[fileformat.length-1]);  
    }
});

var upload = multer({ storage: storage })
// var upload = multer({ dest: 'uploads/' })

app.get('/file', function(req, res){
    res.send('download file');
});

app.post('/file', upload.single('file'), function (req, res, next) {
    var file = req.file;
    console.log(file.path);
    res.send('saved file');
});

app.listen(8000,function(){
    console.log('listen on port 8000');
});