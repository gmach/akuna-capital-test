import { createServer, Model } from "miragejs"

const initOrderBook = () => {
  const tickSize = 0.25
  const askMax = 2971.50
  const askMin = 2967
  const bidMax = 2966.75
  const bidMin = 2963.50
  const maxSize = 300
  const minSize = 1

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
  const getRandom = (min, max) => Math.round(Math.random() * (max - min) + min)

  const asks = range(askMin, askMax, tickSize).map(e => [e, getRandom(minSize, maxSize)]).reverse()
  const bids = range(bidMin, bidMax, tickSize).map(e => [e, getRandom(minSize, maxSize)]).reverse()
  return {
    bids,
    asks
  }
}

let orderBook = localStorage.orderBook; 
if (orderBook != null)
  orderBook = JSON.parse(orderBook);
else {
  orderBook = initOrderBook()
  localStorage.orderBook = JSON.stringify(orderBook)
}

const handlePost = (schema, request) => {
  let attrs = JSON.parse(request.requestBody)
  const orderAction = attrs.orderAction
  const orderSize = parseInt(attrs.orderSize)
  const orderPrice = attrs.orderPrice
  const { bids, asks } = orderBook;
  let updatedQuotes = []
  const isMarketSell = orderAction === 'marketSell'
  const isMarketBuy = orderAction === 'marketBuy'
  const isLimitBuy = orderAction === 'limitBuy'
  const isLimitSell = orderAction === 'limitSell'
  const quotes = isMarketBuy || isLimitSell ? asks : bids
  if (isLimitBuy || isLimitSell)  { // limit order   
    quotes.forEach(quote => {
      if (quote[0] === orderPrice) 
        quote[1] += orderSize
    })
    updatedQuotes = [...quotes]
  } else { // market order      
    let filledSize = 0
    const reducerFn = (previousValue, currentValue) => {
      let [quotePrice, quoteSize] = currentValue
      if (filledSize < orderSize) {
        const remainingSize = orderSize - filledSize
        if (remainingSize < quoteSize) {
          filledSize += remainingSize
          previousValue.push([ quotePrice, quoteSize - remainingSize ] )
        } else 
          filledSize += quoteSize
      } else 
        previousValue.push(currentValue)
      return previousValue;
    }
    const processedQuotes = isMarketSell ? quotes.reduce(reducerFn, []) : quotes.reduceRight(reducerFn, []);        
    updatedQuotes = [...processedQuotes]
  }
  const updatedBook = isMarketBuy || isLimitSell ? 
  {
    asks : isLimitSell ? updatedQuotes : updatedQuotes.reverse(),
    bids
  } : 
  {
    asks, 
    bids: updatedQuotes
  }
  orderBook = { ...updatedBook }
  localStorage.orderBook = JSON.stringify(orderBook)
  return updatedBook
}

createServer({
  models: {
    orderBook: Model,
  },
  routes() {
    this.get("/api/orderbook", () => orderBook)
    this.post("/api/orderbook", handlePost)
  },
})

