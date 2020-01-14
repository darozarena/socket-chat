class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return persona;
    }

    getPersona(id) {
        return this.personas.filter(pers => pers.id === id)[0];
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        return this.personas.filter(pers => pers.sala === sala);
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(pers => pers.id != id);

        return personaBorrada;
    }
}

module.exports = { Usuarios };