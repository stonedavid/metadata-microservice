// server.js

const express = require("express");
const multer = require("multer");
const http = require("http");
const fs = require("fs");
var upload = multer({
    dest: "client/upload/"
});

var app = express();
var server = http.createServer(app);

// empty out upload folder
fs.readdirSync("client/upload").forEach(function(file) {
    fs.unlink("client/upload/" + file, function() {
        console.log("Deleted:", file);
    });
});

app.use(express.static(__dirname + '/client'));

app.post("/upload", upload.single('file'), function(req, res) {
    var tmp_path = req.file.path;
    var target_path = 'client/upload/' + req.file.originalname;
    fs.readFile(tmp_path, function(err, data) {
        if (err) throw err;
        fs.writeFile(target_path, data, function(err) {
            if (err) throw err;
            fs.unlink(req.file.destination + req.file.filename, function(err) {
                if (err) throw err;
                console.log(req.file.destination + req.file.filename, "deleted");
            });
        });
    });

    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.write("<pre><code>Name: " + req.file.originalname + "\n");
    res.write("Path: " + "<a href='https://metadata-microservice-dxstone.c9users.io/upload/" 
        + req.file.originalname + "'>/upload/" + req.file.originalname + "'</a>\n");
    res.write("Mimetype: " + req.file.mimetype + "\n");
    res.end("Size: " + req.file.size + "\n" +
        "<a href='" + "https://metadata-microservice-dxstone.c9users.io" + "'>Upload another file</a></code></pre>");
});


server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Upload server listening at", addr.address + ":" + addr.port);
})