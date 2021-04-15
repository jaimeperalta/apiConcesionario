'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'consultectConseccionario';
exports.createToken = function(user){
	const payload = {
		uid: user.id,
		name: user.name,
		lastName: user.lastName,
		email: user.email,
		exp: moment().add(1,'days').unix()
	}
	return jwt.encode(payload, secret);
}