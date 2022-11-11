import { createServer } from "miragejs"
import { getOrderBook, handleOrder } from './orderManager'

const handlePost = (schema, request) => {
  const attrs = JSON.parse(request.requestBody)
  const orderAction = attrs.orderAction
  const orderSize = parseInt(attrs.orderSize)
  const orderPrice = attrs.orderPrice
  return handleOrder({orderAction, orderSize, orderPrice})
}

createServer({
  routes() {
    this.get("/api/orderbook", getOrderBook)
    this.post("/api/orderbook", handlePost)
  },
})

