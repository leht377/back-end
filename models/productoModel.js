const {Schema,model} = require('mongoose');
const productoSchema = new Schema({
    nombre:{
        type: "string",
        required:true
    },
    materias_primas:{
        type: "String",
        required:true
    }
})
const productoModel = model("productos",productoSchema);
exports.productoModel = productoModel;