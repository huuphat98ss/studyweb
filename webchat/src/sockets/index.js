import socketChat from "./socketChat";
import socketContact from "./socketContact";

let initSockets = (io) =>{
    socketChat(io);
    socketContact(io);
}

module.exports = initSockets 