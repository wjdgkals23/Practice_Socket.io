var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var rooms = "";

app.get("/", function(req, res){
    console.log(req.params.id)
    rooms = req.params.id;
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on("connection", function(socket){
    socket.on('login', function (data) {
        console.log("Message from Client: " + data.name);
        socket.name = data.name;
        socket.userid = data.userid;
        socket.join(data.rooms);
        io.emit('login %s in %s room', data.name, data.rooms);
    });

    socket.on('chat', function(data){
        console.log("Message from %s : %s", socket.name, data.msg);

        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        socket.broadcast.emit('chat', msg);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected: ' + socket.name);
    });
});

io.sockets.in(rooms).emit("chat", "test complete");

server.listen(3000, function(){
    console.log("Socket IO server listening on port 3000")
});