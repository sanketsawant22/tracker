import express from "express";

// Socket.io setup
import http from "http";
import { Server as socketio } from "socket.io";

const app = express();
const port = 3000;

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = new socketio(httpServer);


// Set EJS as the template engine
app.set("view engine", "ejs");

// Path setup for __dirname equivalent
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));


// Handle Socket.IO connections
io.on("connection", function (socket) {
    socket.on("send_location", function (data) {

        io.emit("receive_location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        io.emit("user_disconnected", socket.id);
    });

    console.log("New user connected: ", socket.id);
    
});


// Define the root route
app.get("/", (req, res) => {
    res.render("index");
});

// Start the HTTP server (not app.listen)
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
