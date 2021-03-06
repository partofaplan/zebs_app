var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zkptest1985@gmail.com',
        pass: 'god-is-our-protector'
    }
});

var srvr = http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var dir = './uploads/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var newpath = dir + '_' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded' + "\r\n");
                res.write("\r\n");
                res.write('Files uploaded so far...' + "\r\n");
                fs.readdirSync(dir).forEach(file => {
                    res.write(file + "\r\n");
                });
                res.end();
            });
            var mailOptions = {
                from: 'zkptest1985@gmail.com',
                to: 'zperki5@wgu.edu',
                subject: 'File was uploaded',
                text: files.filetoupload.name + ' was uploaded!'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end;
    }
}).listen(9000, '0.0.0.0');

