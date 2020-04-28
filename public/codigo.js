let ModuloChat = function () {
    let modulo = {
        listaMensaje: [],
        listaUsuario: []
    };

    function _agregarUsuario(usuario) {
        modulo.listaUsuario.push(usuario);
    }

    function _agregarMensaje(mensaje) {
        modulo.listaMensaje.push(mensaje);
    }

    function _eliminarMensaje() {
        modulo.listaMensaje = [];
        modulo.listaUsuario = [];
    }
    modulo.obtnerCantidaddeMensaje = function () {
        return modulo.listaMensaje.length;
    }

    modulo.agregarMensaje = _agregarMensaje;
    modulo.eliminarMensaje = _eliminarMensaje;
    modulo.agregarUsuario = _agregarUsuario;


    return modulo;
}();

const socket = io();               //coneccion con el socket

let actions = document.getElementById("actions");          //traigo todos los elementos del html
let dmensaje = document.getElementById('chat-mensaje');
let wmensaje = document.getElementById('chat-windows');
let usuario = document.getElementById('usuario');
let mensaje = document.getElementById('mensaje');
let btnenvar = document.getElementById('btnenviar');
let conectar = document.getElementById('conectar');
let conectados = document.getElementById('conectados');
let boton = document.getElementById('boton');
let usuarioInput = document.getElementById('usuarioInput');
let botonC=document.getElementById('botonC');
let listaConectados = [];


let ModuloSocket = function () {
    socket.on('chat-mensaje', (data) => {                        //escucho el evento "chat.mensaje" y agrego los mensajes mas el usuario al html
        actions.innerHTML = "";
        dmensaje.innerHTML += `<p>                          
        <strong> ${data.usuario} </strong>:  ${data.mensaje}
        </p>`;
    })
}

ModuloSocket();                                                  //instancio la funcion 





mensaje.addEventListener('keypress', function () {              //con el evento keypress cada ves que el usuariio ponga algo en el input mensaje
    socket.emit('escribiendo', usuario.value);                 // envio el usuario al servidor
});


socket.on('escribiendo', (data) => {                                 // escucho el evento escribiendo y remplazo el actions por un div con el nombre del usuario
    actions.innerHTML = `<div>${data} esta escribiendo...</div>`;    // que esta escribiendo

});


socket.on('conectar', (data) => {
    conectados.innerHTML += `<div class="chat-container">
    <h4 id="${data}" class="letras">${data} en linea</h4>
    </div>`;
    listaConectados.push(data);
    dmensaje.innerHTML += `<p>                          
        <strong> ${data} </strong> se a conectado:)
        </p>`;

});

socket.on('desconectado', (data) => {
    conect = document.getElementById(data);
    eliminar = conect.parentNode;
    eliminar.removeChild(conect);
    dmensaje.innerHTML += `<p>                          
        <strong> ${data} </strong> se a desconectado:(
        </p>`;

});



desconectar.addEventListener("click", () => {
    socket.emit('desconectado', usuario.value);
    conectar.style.display='block';
    usuario.style.display = 'block';                                     // cambio los style de los botones
    desconectar.style.display='none';
    mensaje.style.display='none';
    btnenvar.style.display='none'
});

conectar.addEventListener("click", () => {
    if (usuario.value == '') {
        alert('Por favor ingrese un usuario');                     // si en el input no hay nada, se manda un alert     
        return false;
    }
    else{
        socket.emit('conectar', usuario.value);
        conectar.style.display = 'none'
        usuario.style.display = 'none'                        // cambio los style de los botones
        desconectar.style.display = 'block'
        mensaje.style.display='block'
        btnenvar.style.display='block'
   
    }
});



btnenvar.addEventListener("click", () => {                         // escucho el evento clic en el boton de enviar
    if (mensaje.value == '') {
        alert('Por favor ingrese un mensaje');                     // si en el input no hay nada, se manda un alert
        return false;
    }
    if (usuario.value == '') {
        alert('Por favor ingrese un usuario');                     // si en el input no hay nada, se manda un alert
        return false;
    }



    socket.emit('chat-mensaje', {                                  //envio al servidor el mensaje y el usuario en forma de objeto ya que solo se puede enviar un dato
        mensaje: mensaje.value,
        usuario: usuario.value
    })


    socket.emit('conectado', usuario.value);


    ModuloChat.agregarMensaje(mensaje.value);
    mensaje.value = '';

    if (ModuloChat.obtnerCantidaddeMensaje() == 10) { // cuando llego al limite de mensajes se vacia el chat

        dmensaje.innerHTML = `<div id='chat-mensaje'> </div>`
        ModuloChat.eliminarMensaje();

    }
})


