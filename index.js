'use strict'

require('./services/firebase');
const express = require('express');
const app = express();
const http = require('http');
const userRouter = require('./routes/userRouter');
const clientRouter = require("./routes/clientRouter");

app.use('/user', userRouter);
app.use('/client', clientRouter);
const httpsServer = http.createServer(app);
httpsServer.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + 3560);
});
