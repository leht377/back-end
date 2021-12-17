const {Schema,model} = require('mongoose');
const usuarioSchema = new Schema({
    nombre:{
        type: "string",
        required:true
    },
    apellido:{
        type: "String",
        required:true
    },
    cargo:{
        type: "Number",
        required:true
    },
    usuario:{
        type: "String",
        required:true,
        unique:true
    },
    contrasena:{
        type: "String",
        required:true
    }
});
const usuarioModel = model("usuarios",usuarioSchema);
exports.usuarioModel = usuarioModel;