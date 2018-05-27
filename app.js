let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let ent = require('ent');

let todolist = [];

/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {
    res.render('todo.ejs', {todolist: todolist});
});

io.sockets.on('connection', function (socket, pseudo) {

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('add_message', function (message) {
        message = ent.encode(message);
        todolist.push(message);
        io.emit('add_message', {message: message});
    });
    socket.on('remove_message', function (index) {
        remove(index);
        io.emit('remove_message', {index: index});
    });
    socket.on('remove_all', function () {
        todolist = [];
        io.emit('remove_all');
    });
});

function remove(index) {
    todolist.splice(index-1, 1);
}

server.listen(8081);