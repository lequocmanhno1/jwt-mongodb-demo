import express from 'express';

const app = express();

const PORT = 5000;

//app.listen(PORT, ()=> console.log('Server is connected to port '+PORT));
app.use(express.json());

import connectDB from './db';
connectDB();


const server = app.listen(PORT, ()=> console.log('Server is listening on port ' +PORT)); 

process.on('unhandledRejection', err => {
    console.log('An error occurred: ${err.message}');
    server.close(()=> process.exit);

});

import router from './auth/Route';

app.use("/api/auth",router);


import cookiesparser from 'cookie-parser';

app.use(cookiesparser());


