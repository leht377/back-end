const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const mongoose = require("mongoose");


//Models
const { materiaModel } = require("./models/materiaModel")
const { ordenModel } = require("./models/ordenModel")
const { productoModel } = require("./models/productoModel")
const { usuarioModel } = require("./models/usuarioModel")

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/Miche")
    .then(res => console.log("Conectado a la base de datos."))
    .catch(err => console.log(err));

app.post("/crearUsuario", function (req, res) {
    const user = new usuarioModel(req.body)
    user.save(function (err) {
        if (err) {
            res.send({ msg: "usuario no registrado" })
        } else {
            res.send({ msg: "usuario registrado" })
        }

    })
})
app.post("/validarUsuario", async function (req, res) {
    const userlogin =  req.body.usuario;
    const passwordlogin = req.body.contrasena;
    await usuarioModel.findOne({ "usuario": userlogin }, function (err, myUser) {
        if (!err) {
            if(myUser != null){
                if (myUser["usuario"] === userlogin && myUser["contrasena"] === passwordlogin) {
                    res.send({validacion:true});
                }else{
                    res.send({validacion:false})
                }
            }else{
                res.send({validacion:false})
            }
        }
    }).clone().catch(function (err) { console.log(err) })
})

app.post("/agregarMateriaPrima", function (req, res) {
    const materi = new materiaModel(req.body);
    materi.save(function (err) {
        if (err) {
            res.send({ msg: false });
        } else {
            res.send({ msg: true });
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
    }).sort({ nombre: 1 }).clone().catch(function (err) { console.log(err) })

});


app.post("/editarMateriaPrima", function (req, res) {
    materiaModel.updateOne({ nombre: req.body.nombre }, { $set: { nombre: req.body.nombre, descripcion: req.body.descripcion, unidad: req.body.unidad, cantidad: req.body.cantidad, precio: req.body.precio } }, function (err, re) {
        if (err) {
            res.send({ msg: "No se pudo actualizar la materia" });
        } else {
            res.send({ msg: "Actualizacion Exitosa" });
        }
    })
});
app.get("/materiaMasVendida", function (req, res) {
    materiaModel.find({}, function (error, lista) {
        if (lista != null) {
            res.send(lista[0]);
        } else {
            res.send(lista[0]);
        }
    }).sort({ cantidadVendida: -1 }).limit(1)

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
    materiaModel.find({}, { nombre: 1, _id: 0 }, function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    }).sort({ nombre: 1 })
});

app.get("/listarOrdenes", function (req, res) {
    ordenModel.find({ estado: "sin producir" }, function call(error, lista) {
        if (lista != null) {
            res.send(lista);
        } else {
            res.send(lista);
        }
    })
});

app.post("/ordenProducida", function (req, res) {
    ordenModel.updateOne({ _id: req.body._id }, { $set: { estado: "por despachar" } }, function (err, re) {
        if (err) {
            res.send({ msg: "No se pudo confirmar la producion de la orden" });
        } else {
            res.send({ msg: "Producion confirmada" });
        }
    })
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

app.post("/confirmarDespacho", function (req, res) {
    ordenModel.updateOne({ _id: req.body._id }, { $set: { estado: "despachado" } }, function (err, re) {
        if (err) {
            res.send({ msg: "No se puedo despachar la orden" });
        } else {
            res.send({ msg: "Orden despachada" });
        }
    })
})

app.post("/validarOrdenProducion", function (req, res) {
    var nameMaterias = [];
    for (let i in req.body) {
        nameMaterias.push(i)
    }
    materiaModel.find({ nombre: { $in: nameMaterias } }, function (err, lis) {
        var status = true;
        var cantidad = 0;
        var materia = "";
        for (let i in lis) {
            if (req.body[lis[i]["nombre"]] > lis[i]["cantidad"]) {
                status = false;
                materia = lis[i]["nombre"];
                cantidad = req.body[lis[i]["nombre"]] - lis[i]["cantidad"];
                break;
            }
        }

        res.send({ mensage: status, "NomMateria": materia, "cantidadFaltante": cantidad });
    });
})
app.post("/descontarInventario", async function (req, res) {
    var valorDB = 0;
    var valorPedido = 0;
    var valorDescuento = 0;
    var valorCantidadVendida = 0;
    var valorNuevoCantidadVendida = 0;
    await materiaModel.find({ nombre: req.body.nombre }, function (err, lis) {
        if (!err) {
            valorDB = lis[0]["cantidad"];
            valorCantidadVendida = lis[0]["cantidadVendida"]
            valorPedido = req.body.cantidad;
            valorNuevoCantidadVendida = valorCantidadVendida + valorPedido;
            valorDescuento = valorDB - valorPedido;
            materiaModel.updateOne({ nombre: req.body.nombre }, { $set: { cantidad: valorDescuento, cantidadVendida: valorNuevoCantidadVendida } }, function (err, re) {
                if (err) {
                    // res.send({ msg: "No se puedo despachar la orden" });
                    console.log(err)
                } else {
                    res.send("ok");
                    // res.send({ msg: "Orden despachada" });
                }
            }).clone().catch(function (err) { console.log(err) })
        }
    }).clone().catch(function (err) { console.log(err) })
})

app.post("/GuardarOrden", async function (req, res) {
    const orden = new ordenModel(req.body);
    await orden.save(function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send("ok")
        }
    })
})


app.post("/configurarProducto", function (req, res) {
    const producto = new productoModel(req.body);
    producto.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send("guardo");
        }
    })
});

app.listen(8081, function () {
    console.log("El servidor esta corriendo por el puerto 8081");
});