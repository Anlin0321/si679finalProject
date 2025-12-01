import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

// import https from 'https';  // Commented out for HTTP in development

import { postRouter } from './routes/postRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './routes/authRoute.js';
import { itemRouter } from './routes/itemRoute.js';
import { userRouter } from './routes/userRoute.js';
import { socket } from './socket/clientUpdate.js';
import { postService } from './services/postService.js';



dotenv.config();

const port = 6790;
const app = express();
const server = http.createServer(app);
socket.initSocket(server);



app.use(cors());

app.use(express.static('static'));

app.use(express.json());

app.use('/posts', postRouter);
app.use('/login', authRouter);
app.use('/items', itemRouter);
app.use('/user', userRouter);

// Error handler must be LAST to catch errors from routes
app.use(errorHandler);

// HTTPS configuration (commented out for HTTP in development)
// const credentials={
//     key: process.env.TLS_SERVER_KEY,
//     cert: process.env.TLS_SERVER_CERT
// }

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(port, () => {
//     console.log(`Server started on port ${port}`)
// })


postService.watchPosts();

// HTTP server for development
server.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
