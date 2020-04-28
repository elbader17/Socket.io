const express = require('express');
const path = require('path');
const app = express();
const socketIO = require('socket.io');

let lMensajes=[];
//configuracion
app.set('port', process.env.PORT || 3000);

//archivos static::  la carpeta raiz donde el navegador obtendra sus recuros
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('Server on port: ' + app.get('port'));
})

const io = socketIO(server);


io.on("connection", (socket) => {
    console.log('Nueva conexion ' + socket.id);
    socket.on("chat-mensaje", (data) => {
        lMensajes.push(data);
        io.sockets.emit("chat-mensaje", data);
        //le envio el mensaje a todos los sockets conectados
        return lMensajes
    })

    // escucho los datos (data)= el usuario 
    socket.on("escribiendo", (data) => {
        socket.broadcast.emit("escribiendo", data);
        // con el broadcast emito a todos los socket menos al que lo envio

    });


    socket.on("conectar", (data) => {
        socket.broadcast.emit("conectar", data);
    });

    socket.on("desconectado", (data) => {
        socket.broadcast.emit("desconectado", data);
    });


});
