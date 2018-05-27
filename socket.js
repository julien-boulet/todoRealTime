const socket = function (todolist,server) {

    const io = require('socket.io').listen(server);
    const ent = require('ent');

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
};

module.exports = socket;

