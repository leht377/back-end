const {Schema,model} = require('mongoose');
const ordenSchema = new Schema({
    contenido:{
        type: "string",
        required:true
    },
    destino:{
        type: "string",
        required:true
    },
    costo:{
        type: "number",
        required:true
    },
    fecha_creacion:{
        type: "string",
        required:true
    },
    fecha_de_despacho:{
        type: "string",
        required:true
    },
    despachado:{
        type: "boolean",
        required:true
    },
    estado: {
        type: "String",
        required:true
    }
});
const ordenModel = model("ordenes",ordenSchema);
exports.ordenModel = ordenModel;