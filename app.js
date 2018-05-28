let todolist = [];
let fileName = "";

const app = require('express')();
const server = require('http').createServer(app);
const multer = require('multer');
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const ent = require('ent');
const fs = require('file-system');

app.use(bodyParser.json());

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        fileName = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, fileName);
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count

/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {
    res.render('todo.ejs', {todolist: todolist});
}).post("/api/Upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        io.emit('new_file', {fileName: fileName});
    });
}).get('/images/:imageName', function(req, res) {
    console.log('retrun ' + req.params.imageName);
    const contentType = 'image/jpg';
    var fileToLoad = fs.readFileSync('images/'+req.params.imageName);
    res.writeHead(200, {'Content-Type':  contentType });
    res.end(fileToLoad, 'binary');
});

io.sockets.on('connection', function (socket) {

    socket.on('add_message', function (message) {
        message = ent.encode(message);
        todolist.push(message);
        io.emit('add_message', {message: message});
    }).on('remove_message', function (index) {
        todolist.splice(index-1, 1);
        io.emit('remove_message', {index: index});
    }).on('remove_all', function () {
        todolist = [];
        io.emit('remove_all');
    });

});

server.listen(8081);