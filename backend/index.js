import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend to connect (React dev server)
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}

const getAllConnectedClients = (roomId) =>{
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) =>{
      return {
        socketId,
        userName : userSocketMap[socketId] 

      }
    }
  ) // its map type thats why we converted it in array

}

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  socket.on('join' , ({roomId , userName}) =>{
    userSocketMap[socket.id] = userName
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // notifying all users a new user is joined
    clients.forEach(({socketId})=>{
      io.to(socketId).emit('joined' , {
        clients , 
        userName,
        socketId: socket.id
      })
    })

  })

  socket.on('code-change' , ({roomId , code})=>{
    socket.in(roomId).emit("code-change" , {code});
  })

  socket.on("sync-code" , ({socketId , code})=>{
    io.to(socketId).emit("code-change" , {code});
  })

  socket.on('disconnecting' , ()=>{
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
      socket.in(roomId).emit('disconnected' , {
        socketId:socket.id,
        userName:userSocketMap[socket.id]
      })
    })
    console.log(`${userSocketMap[socket.id]} leaved the room`)
    delete userSocketMap[socket.id]
  })

  // socket.on("disconnect", () => {
  //   console.log("❌ User disconnected:", socket.id);
  // });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
