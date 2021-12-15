const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const mongoose = require("mongoose");
//Eliminar la carpeta
//Models
const { materiaModel } = require("./models/materiaModel")
const { ordenModel } = require("./models/ordenModel")
const { productoModel } = require("./models/productoModel")
const cors = require("cors");
const { send } = require("express/lib/response");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/Miche")
    .then(res => console.log("Conectado a la base de datos."))
    .catch(err => console.log(err));

app.get("/", function (req, res) {
    res.send("Home");
});

app.post("/agregarMateriaPrima", function (req, res) {
    const materi = new materiaModel(req.body);
    materi.save(function (err) {
        if (err) {
            res.send({msg:false});
        }else{
            res.send({msg:true});
        }
    })
});

app.get("/listarMaterias", function (req, res) {
    materiaModel.find(function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })

});

app.get("/listarProductos", function (req, res) {
    productoModel.find(function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })

});

app.get("/listCongfigMaterias", function (req, res) {
     materiaModel.find({},{nombre:1,_id:0},function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })

});

app.get("/listarOrdenes", function (req, res) {
    ordenModel.find({estado:"sin producir"},function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })
});

app.post("/ordenProducida", function (req, res) {
    ordenModel.updateOne({_id:req.body._id},{$set:{estado:"por despachar"}},function (err,re){
        if (err) {
            res.send({msg: "No se pudo confirmar la producion de la orden"});
        }else{
            res.send({msg:"Producion confirmada"});
        }
    })
    // res.send(req.params._id)
});

app.get("/listapedidosDespachados", function (req, res) {
    ordenModel.find({ estado: "despachado" }, function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })
});

app.get("/listapedidosPorDespachar", function (req, res) {
    ordenModel.find({ estado: "por despachar" }, function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })
});

app.post("/confirmarDespacho",function (req,res){
    ordenModel.updateOne({_id:req.body._id},{$set:{estado:"despachado"}},function (err,re){
        if (err) {
            res.send({msg:"No se puedo despachar la orden"});
        }else{
            res.send({msg: "Orden despachada"});
        }
    })
})

app.post("/configurarProducto", function (req, res) {
    const producto = new productoModel(req.body);
    producto.save(function (err) {
        if (err) {
            res.send(err);
        }else{
            res.send("guardo");
        }
    })
});

app.listen(8081, function () {
    console.log("El servidor esta corriendo por el puerto 8081");
});