const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin:"https://realtime-temporal-chat.vercel.app",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`)
    })

    socket.on("send_message", (data)=>{
        
        // 'data' debe coincidir con la interfaz Message del frontend:
        // { user: string, message: string, room: string, time: string }
        
        console.log("Mensaje recibido:", data);
        
        // El método más importante: 'socket.to(room).emit(event, data)'
        // Esto envía el mensaje a *todos* los demás en esa sala, excepto al remitente.
        socket.to(data.roomId).emit("receive_message", data);
        
        // NOTA: Si quisieras enviarlo a todos (incluyendo al remitente),
        // usarías: io.in(data.room).emit("receive_message", data);
    })

    socket.on("disconnect",()=>{
        console.log("Usuario desconectado", socket.id);
        
    })
} )

server.listen(3001,()=>{
    console.log("server running");
    
})