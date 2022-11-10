import { useState } from "react"
import OrderBook from "./OrderBook"
import "./App.scss"
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


function App() {
  const [orderSize, setOrderSize] = useState(0)
  const [book, setBook] = useState({
    bids,
    asks
  })

  const handleChange = (e) => {
    setOrderSize(e.target.value)
  }

  const handleClickOrder = (price, orderAction) => {
    const { bids, asks } = book;
    let updatedQuotes = []
    const isMarketSell = orderAction === 'marketSell'
    const isMarketBuy = orderAction === 'marketBuy'
    const isLimitBuy = orderAction === 'limitBuy'
    const isLimitSell = orderAction === 'limitSell'
    const size = parseInt(orderSize)
    const quotes = isMarketBuy || isLimitSell ? asks : bids
    if (isLimitBuy || isLimitSell)  { // limit order   
      quotes.forEach(quote => {
        if (quote[0] === price) 
          quote[1] += size
      })
      updatedQuotes = [...quotes]
    } else { // market order      
      let filledSize = 0
      const reducerFn = (previousValue, currentValue) => {
        let [quotePrice, quoteSize] = currentValue
        if (filledSize < size) {
          const remainingSize = size - filledSize
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
    setBook(updatedBook)
  }
  
  return (
    <>
      <OrderBook
        book={book}
        handleClickOrder={handleClickOrder}
      />
      <label htmlFor="size">Enter # of contracts/size</label>
      <input 
        type="number"
        value={orderSize} 
        placeholder="10" 
        step="1" 
        min="1" 
        onChange={handleChange}
        name="size"/>
    </>
  );
};

export default App;
