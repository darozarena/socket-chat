const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', client => {
    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(usuario.sala);

        let persona = usuarios.agregarPersona(
            client.id,
            usuario.nombre,
            usuario.sala
        );

        client.broadcast
            .to(persona.sala)
            .emit('listaPersona', usuarios.getPersonasPorSala(persona.sala));
        client.broadcast
            .to(persona.sala)
            .emit(
                'crearMensaje',
                crearMensaje('Administrador', `${persona.nombre} se unió`)
            );

        callback(usuarios.getPersonasPorSala(persona.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                'crearMensaje',
                crearMensaje('Administrador', `${personaBorrada.nombre} salió`)
            );

        client.broadcast
            .to(personaBorrada.sala)
            .emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });
});