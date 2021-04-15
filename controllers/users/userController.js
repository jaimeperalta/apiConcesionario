'use strict'
const firebase = require("firebase-admin");
const jwt = require('../../services/jwt');
const moment = require('moment');
const saltRounds = 10;

const crear = (req,res) =>{
    const { name, lastName, email, uid, phoneNumber } = req.body;

    if(name && lastName && email && uid && phoneNumber){
        firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((user)=>{
            console.log(user.exists);
            if(user.exists){
                res.status(200).send({
                    status: "userExist",
                    message: "Usuario ya existe"
                })
            }
            else{
                firebase.firestore()
                .collection("users")
                .doc(uid)
                .set({
                    name,
                    lastName,
                    email,
                    phoneNumber,
                    createAt:moment().unix()
                })
                .then(()=>{
                    res.status(200).send({
                        status:"success",
                        message:'usuario creado'
                    })
                })
                .catch(()=>{
                    res.status(200).send({
                        status:"failToCreate",
                        message:'error  al crear usuario'
                    })
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

const login = (req,res)=>{
    const { uid }  = req.body;
    if( uid ){
        firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((doc)=>{
            if( doc.exists ){
                res.status(200).send({
                    status:"success",
                    userData:doc.data(),
                    token:jwt.createToken({...doc.data(),id:doc.id})
                })
            }
            else{
                res.status(200).send({
                    status:"noUser",
                    message:"no existe el usuario"
                })
            }
        })
    }
    else{
        res.status(200).send({
            status:"noCampos",
            message:"Faltan campos"
        })
    }
}

module.exports = {
    crear,
    login
}