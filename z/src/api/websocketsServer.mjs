import { WebSocketServer } from 'ws';
const port = 8080
const wss = new WebSocketServer({ port });
import { getOrderBook, handleOrder } from './orderManager.mjs'

wss.on("connection", ws => {
    console.log("new client connected");
    ws.on("message", (data, isBinary)  => {
        const event = JSON.parse(data)
        console.log(`Client has sent us: ${event.msg}`)
        if (event.msg === 'subscribe')
            wss.clients.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    console.log(`sending to client the book`)
                    const orderBook = getOrderBook()
                    client.send(JSON.stringify(orderBook));
                }
            });
        if (event.msg === 'openOrder')
          wss.clients.forEach(client => {
              if (client.readyState === ws.OPEN) {
                  const { orderAction, orderSize, orderPrice } = event.body
                  console.log(`processing order orderAction=${orderAction} orderPrice=${orderPrice} orderSize=${orderSize}`)
                  const orderBook = handleOrder({orderAction, orderSize, orderPrice})
                  console.log(`sending to client the updated book`)
                  client.send(JSON.stringify(orderBook));
              }
          });            
    });
    ws.on("close", () => {
        console.log("the client has connected");
    });
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log(`The WebSocket server is running on port ${port}`);