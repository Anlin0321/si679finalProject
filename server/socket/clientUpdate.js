import { Server } from 'socket.io';

let io = null;
const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // for development only!
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('A client  connected');
        socket.on('disconnect', () => console.log('Client disconnected'));
    });
}

const updatePost = (postId, updatedFields) => {
    io.emit('updatePost', postId, updatedFields);
}

const addPost = (newPost) => {
    io.emit('addPost', newPost);
}

const deletePost = (deleteId) => {
    io.emit('deletePost', deleteId);
}

export const socket = {
    initSocket,
    updatePost,
    addPost,
    deletePost
}