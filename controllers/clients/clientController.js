"use strict"
const firebase = require("firebase-admin");
const moment = require('moment');
const pdf = require('html-pdf');
var stream = require('stream');
// agregar validacion de uid con el uid del token si no es el mismo devuelve que no tiene permiso
const crear = ( req, res )=>{

    const { name, lastName, email, phoneNumber, locality,concesionario, localityName, documentId} = req.body;

    if(name, lastName, email, phoneNumber, locality,concesionario, localityName, documentId){
        console.log(req.user);  
        firebase.firestore()
        .collection("clients")
        .doc(locality)
        .collection("users")
        .doc(documentId.toString())
        .get()
        .then((doc)=>{
            if(!doc.exists){
                const user = req.user;
                let client = {
                    name,
                    lastName,
                    email,
                    phoneNumber,
                    locality,
                    localityName,
                    documentId,
                    concesionario,
                    createAt:moment().unix(),
                    updateAt:moment().unix(),
                    createdBy:user.uid,
                    isActive:true
                }
                
                firebase.firestore()
                .collection("clients")
                .doc(locality)
                .collection("users")
                .doc(documentId.toString())
                .set(client)
                .then(()=>{
                    res.status(200).send({
                        status:"success",
                        message:"Cliente creado correctamente"
                    })
                })
                .catch(()=>{
                    res.status(200).send({
                        status:"errorCrear",
                        message:"error al crear el cliente"
                    })
                })
            }
            else{
                res.status(200).send({
                    status:"clientExist",
                    message:"CLiente ya registrado en esta localidad"
                })
            }
        })
    }else{
        res.status(200).send({
            status:"noCampos",
			message:"Faltan campos"
		})
    }
}

const editar = ( req, res )=>{

    const { name, lastName, email, phoneNumber, concesionario ,locality, documentId} = req.body;

    if(name, lastName, email, phoneNumber, locality, documentId, concesionario){
        console.log(req.user);  
        firebase.firestore()
        .collection("clients")
        .doc(locality.toString())
        .collection("users")
        .doc(documentId.toString())
        .get()
        .then((doc)=>{
            console.log(doc.exists)
            if(doc.exists){
                const user = req.user;
                let client = {
                    name,
                    lastName,
                    email,
                    concesionario,
                    phoneNumber,
                    updateAt:moment().unix(),
                    updateBy:user.uid
                }

                firebase.firestore()
                .collection("clients")
                .doc(locality.toString())
                .collection("users")
                .doc(documentId.toString())
                .update(client)
                .then(()=>{
                    res.status(200).send({
                        status:"success",
                        message:"Cliente actualizado correctamente"
                    })
                })
                .catch(()=>{
                    res.status(200).send({
                        status:"errorEditar",
                        message:"error al actualizar el cliente"
                    })
                })
            }
            else{
                res.status(200).send({
                    status:"clientNoExist",
                    message:"no se puede actualizar este cliente"
                })
            }
        })
    }else{
        res.status(200).send({
            status:"noCampos",
			message:"Faltan campos"
		})
    }
}


const eliminar = ( req, res )=>{

    const { locality, documentId} = req.body;

    if(locality, documentId){
        console.log(req.user);  
        firebase.firestore()
        .collection("clients")
        .doc(locality.toString())
        .collection("users")
        .doc(documentId.toString())
        .get()
        .then((doc)=>{
            console.log(doc.exists)
            if(doc.exists){
                const user = req.user;
                let client = {
                    isActive:false,
                    updateAt:moment().unix(),
                    updateBy:user.uid
                }
                
                firebase.firestore()
                .collection("clients")
                .doc(locality.toString())
                .collection("users")
                .doc(documentId.toString())
                .update(client)
                .then(()=>{
                    res.status(200).send({
                        status:"success",
                        message:"Cliente eliminado correctamente"
                    })
                })
                .catch(()=>{
                    res.status(200).send({
                        status:"errorEditar",
                        message:"error al eliminar el cliente"
                    })
                })
            }
            else{
                res.status(200).send({
                    status:"clientNoExist",
                    message:"error al eliminar, no existe el cliente"
                })
            }
        })
    }else{
        res.status(200).send({
            status:"noCampos",
			message:"Faltan campos"
		})
    }
}

const listar = (req,res)=>{

    const { locality } = req.body;
    console.log("localidad ",locality);
    if(!locality ){
        res.status(200).send({
            status:"noCampos",
			message:"Faltan campos"
		})
    }
    else{
        firebase.firestore()
        .collection("clients")
        .doc(locality.toString())
        .collection("users")
        .where("isActive","==",true)
        .orderBy("createAt","desc")
        .get()
        .then((doc)=>{
            if(!doc.empty){
                console.log(doc.empty);
                let data = [];
                doc.forEach((doc) => {
                    data = [...data,{
                         lastName:doc.data().lastName,
                         locality:doc.data().locality,
                         localityName:doc.data().localityName,
                         name:doc.data().name,
                         documentId:doc.data().documentId,
                         phoneNumber:doc.data().phoneNumber,
                         concesionario:doc.data().concesionario,
                         email:doc.data().email,
                    }]
                });

                console.log("la data ",data);
                res.status(200).send({
                    status:"success",
                    data
                })
            }
            else{
                res.status(200).send({
                    status:"noData",
                    data:[]
                })
            }
        })
        .catch((e)=>{
            console.log(e);
            res.status(200).send({
                status:"noData",
                data:[]
            })
        })
    }
}

const buscar = (req,res)=>{

    const { documentId, locality } = req.body;
    console.log("localidad ",locality);
    if(!documentId && !locality ){
        res.status(500).send({
            status:"noCampos",
            message:"Faltan campos"
        })
    }
    else{
        firebase.firestore()
        .collection("clients")
        .doc(locality.toString())
        .collection("users")
        .where("isActive","==",true)
        .where("documentId","==",+documentId)
        .orderBy("createAt","desc")
        .get()
        .then((doc)=>{
            if(!doc.empty){
                console.log(doc.empty);
                let data = [];
                doc.forEach((doc) => {
                    data = [...data,{
                         lastName:doc.data().lastName,
                         locality:doc.data().locality,
                         localityName:doc.data().localityName,
                         name:doc.data().name,
                         documentId:doc.data().documentId,
                         phoneNumber:doc.data().phoneNumber,
                         concesionario:doc.data().concesionario,
                         email:doc.data().email,
                    }]
                });

                console.log("la data ",data);
                res.status(200).send({
                    status:"success",
                    data
                })
            }
            else{
                res.status(200).send({
                    status:"noData",
                    data:[]
                })
            }
        })
        .catch((e)=>{
            console.log(e);
            res.status(200).send({
                status:"noData",
                data:[]
            })
        })
    }
}

const reporte = (req,res)=>{

    const { locality, localityName, reporte } = req.body;
    if(!locality, !localityName, !reporte ){
        res.status(500).send({
            status:"noCampos",
            message:"Faltan campos"
        })
    }

    firebase.firestore()
    .collection("clients")
    .doc(locality.toString())
    .collection("users")
    .orderBy("createAt","desc")
    .get()
    .then((doc)=>{
        if(!doc.empty){
            let html = ""
            let concesionarios = ["Concesionario 1","Concesionario 2", "Concesionario 3"];
            if(reporte == 2){
                let datos = {};
                doc.forEach((doc)=>{
                    if(datos[doc.data().concesionario]){
                        datos[doc.data().concesionario] = [...datos[doc.data().concesionario],doc.data()]
                    }else{
                        datos[doc.data().concesionario] = [doc.data()]
                    }
                })
                        
                html += `<div><p style="text-align:center">Reporte de clientes por concesionario en la localidad ${localityName}</p></div>`;
                Object.keys(datos).forEach(row=>{
                    html += `
                        <div style="text-align:center;margin-bottom:10px;margin-top:10px;"><p style="color:#515151">${concesionarios[row-1]}</p></div>
                        <table style="font-family: arial, sans-serif;width:100%;border-collapse: collapse;">
                          <tr style="border-bottom: 1px solid gray;">
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Nombre</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Apellido</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Documento</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Email</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Localidad</th>
                            <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">concesionario</th>
                          </tr>
                    `
                    datos[row].forEach((val,index)=>{
                        html += `
                            <tr ${index%2 == 0?" style='background-color: #dddddd' ":""}>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.name}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.lastName}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.documentId}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.email}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.localityName}</td>
                                <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${concesionarios[val.concesionario -1]}</td>
                            </tr>
                        `
                    })
                    html += "</table>"
                })

            }
            else{
                html += `<div><p style="text-align:center">Reporte de clientes por localidad ${localityName}</p></div>`;
                html += `<table style="font-family: arial, sans-serif;width:100%;border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid gray;">
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Nombre</th>
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Apellido</th>
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Documento</th>
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Email</th>
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">Localidad</th>
                    <th style="border: 1px solid #dddddd;text-align: left;padding: 4px;">concesionario</th>
                  </tr>
                `;
                let index = 0;
                doc.forEach((val) => {
                    console.log(index);
                    html += `
                    <tr ${index%2 == 0?" style='background-color: #dddddd' ":""}>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.data().name}</td>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.data().lastName}</td>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.data().documentId}</td>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.data().email}</td>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px"">${val.data().localityName}</td>
                        <td style="border: 1px solid #dddddd;text-align: left;padding: 4px;word-break: break-word;font-size:10px">${concesionarios[val.data().concesionario -1]}</td>
                    </tr>
                    `
                    index++;
                });

                html += "</table>"
            }
            

            pdf.create(html).toBuffer(async function(err, buffer){
                let subir = await uploadPicture(buffer.toString('base64'), +new Date())
                console.log(subir);
                res.status(200).send({
                    url:subir
                })
            });
        }
        else{
            res.status(200).send({
                status:"noData",
            })
        }
    })
}

const uploadPicture = function(base64, id) {
    return new Promise((resolve, reject) => {
        if (!base64) {
            reject("news.provider#uploadPicture - Could not upload picture because at least one param is missing.");
        }
        let bucket = firebase.storage().bucket();
        let bufferStream = new stream.PassThrough();
        bufferStream.end(new Buffer.from(base64, 'base64'));
        let file = bucket.file(`reports/${id}.pdf`);
        bufferStream.pipe(file.createWriteStream({
            metadata: {
                contentType: 'application/pdf'
            }
        })).on('error', error => {
            reject(`news.provider#uploadPicture - Error while uploading picture ${JSON.stringify(error)}`);
        }).on('finish', (file) => {
            const publicUrl = 'https://firebasestorage.googleapis.com/v0/b/conseccionario.appspot.com/o/reports%2F'+id+'.pdf?alt=media'
            resolve(publicUrl);
        });
    })
}


module.exports = {
    crear,
    editar,
    eliminar,
    listar,
    buscar,
    reporte
}