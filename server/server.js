import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';

import { postRouter } from './routes/postRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './routes/authRoute.js';
import { itemRouter } from './routes/itemRoute.js';
// import { userRouter } from './routes/userRoute.js';


dotenv.config();

const port = 6790;
const app = express();


app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use('/posts', postRouter);
app.use('/login', authRouter);
app.use('/items', itemRouter);
// app.use('/user', userRouter);

const credentials={
    key: process.env.TLS_SERVER_KEY,
    cert: process.env.TLS_SERVER_CERT
}

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
// app.listen(port);
