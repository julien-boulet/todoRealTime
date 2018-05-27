let todolist = [];

const app = require('express')();
const server = require('http').createServer(app);
const socket = require('./socket')(todolist,server);

/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {
    res.render('todo.ejs', {todolist: todolist});
});

server.listen(8081);