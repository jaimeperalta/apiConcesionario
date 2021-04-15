'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret =  'consultectConseccionario';

exports.ensureAuth = (req,res,next)=>{
	if(!req.headers.authorization){
		return res.status(403).send({
			message: "No autorizado"
		})
	}
	const token = req.headers.authorization;
	let payload;
	try{
		payload = jwt.decode(token,secret);
		if(payload.exp <= moment().unix()){
			return res.status(401).send({
				message:"Token expirado"
			})
		}
	}
	catch(ex){
		return res.status(404).send({
			message:"Token no valido"
		})
	}
	req.user = payload;
	next();
}