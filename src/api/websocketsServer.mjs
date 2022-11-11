import { WebSocketServer } from 'ws';
const port = 8080
const wss = new WebSocketServer({ port });
import { getOrderBook, handleOrder } from './orderManager.mjs'

wss.on("connection", socket => {
    console.log("new client connected");
    socket.on("message", (data, isBinary)  => {
        const event = JSON.parse(data)
        console.log(`Client has sent us: ${event.msg}`)
        let orderBook = getOrderBook()
        if (event.msg === 'subscribe') {
            orderBook = getOrderBook()
            if (socket.readyState === socket.OPEN) {
                console.log('sending orderBook to client')
                socket.send(JSON.stringify(orderBook)); 
            }
        }
        if (event.msg === 'openOrder') {
            const { orderAction, orderSize, orderPrice } = event.body
            if (orderSize == 0 || orderPrice == 0) return;
            console.log(`processing order orderAction=${orderAction} orderPrice=${orderPrice} orderSize=${orderSize}`)
            orderBook = handleOrder({orderAction, orderSize, orderPrice})
            wss.clients.forEach(client => {
                if (client.readyState === socket.OPEN)
                    client.send(JSON.stringify(orderBook));
            });            
        }       
    });
    socket.on("close", () => {
        console.log("the client has connected");
    });
    socket.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log(`The WebSocket server is running on port ${port}`);