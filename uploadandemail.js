var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: "mail.google.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "partofaplan@gmail.com",
    pass: "god-is-our-protector"
  }
});


http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
	  var oldpath = files.filetoupload.path;
	  var newpath = './' + files.filetoupload.name;
	  fs.rename(oldpath, newpath, function (err) {
	    if (err) throw err;
	    res.write('File uploaded');
	    res.end();
	  });
	  var mailOptions = {
        from: 'partofaplan@gmail.com',
        to: 'zperki5@wgu.edu',
        subject: 'File was uploaded',
        text: files.filetoupload.name + ' was uploaded!'
      };
	  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
      });
    }); 
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submite">');
    res.write('</form>');
    return res.end;
  }
}).listen(8080);
