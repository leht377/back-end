const {Schema,model} = require('mongoose');
const materiaSchema = new Schema({
    nombre:{
        type: "string",
        required:true
    },
    descripcion:{
        type: "string",
        required:true
    },
    unidad:{
        type: "string",
        required:true
    },
    cantidad:{
        type: "number",
        required:true
    },
    precio:{
        type: "number",
        required:true
    }

});

const materiaModel = model("materiasprimas",materiaSchema);
exports.materiaModel = materiaModel;