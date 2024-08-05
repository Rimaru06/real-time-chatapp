import { OutgoingMessage , SupportedMessage as OutgoingSupportMessages } from "./messages/outgoingMessage";
import { server as WebSocketServer , connection  } from "websocket"
import http from 'http'
import { UserManager } from "./UserManager";
import { IncomingMessage , SupportMessage } from "./messages/incomingMessage";

import { InMemoryStore } from "./store/InMemoryStore";

const server = http.createServer(function(request : any , response : any){
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404);
    response.end();
})

server

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080 , function(){
    console.log((new Date()) + ' Server is listining on port 8080')
})


const wsServer = new WebSocketServer({
    httpServer : server,
    autoAcceptConnections : false
})

function originIsAllowed(origin : string)
{
    return true;
}

wsServer.on('request' , function(request){
    console.log("inside connect")

    if(!originIsAllowed(request.origin))
    {
        request.reject();
        console.log((new Date()) + ' connection from origin ' + request.origin + 'rejected');
        return ;
    }

    var connection = request.accept(null , request.origin);
    console.log((new Date()) + ' connection accepted');

    connection.on('message' , function(message) {
        console.log(message)
        if(message.type === 'utf8')
        {
            console.log(JSON.parse(message.utf8Data))
            try {
                messageHandler(connection , JSON.parse(message.utf8Data));
            } catch (error) {
                
            }
        }
    })
})

function messageHandler(ws : connection , message : IncomingMessage)
{

    if(message.type === SupportMessage.JoinRom)
    {
       
       const payload = message.payload;
       console.log(payload)
        userManager.addUser(payload.name , payload.userId , payload.roomId , ws)
    }
    if (message.type === SupportMessage.SendMessage)
    {
       
        const payload = message.payload;
        const user  = userManager.getUser(payload.roomId , payload.userId);
        console.log(user)
        if(!user)
        {
            console.log("user not found in the db");
            return ;
        }
        
        let chat = store.addChat(payload.userId , user.name , payload.roomId , payload.message);
        console.log(chat)

        if(!chat){
            return ;
        }

        const outgoingPayload : OutgoingMessage = {
            type : OutgoingSupportMessages.addChat,
            payload : {
                chatId : chat.id,
                roomId : payload.roomId,
                message : payload.message,
                name : user.name
            }
        }

        userManager.broadcast(payload.roomId , payload.userId , outgoingPayload);

    }
}
