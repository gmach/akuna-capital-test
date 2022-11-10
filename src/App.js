import { useState } from "react"
import OrderBook from "./OrderBook"
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

const styles = `
:root {  
  --red-color: #cc4125;
  --green-color: #1c4756;
}

.wrapper {
  background-color: #151825;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  padding: 50px 0;
}

.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.list-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}

.buyMarket, .sellMarket {
  content: '';
  flex: 1 1;
  padding: 3px 5px;
}
.buyMarket {
  background: var(--red-color);
}
.sellMarket {
  background: var(--green-color);
}

.asks .size {
  background: var(--red-color);
}
.asks .size {
  background: var(--red-color);
}

.bids .list-item {
  flex-direction: row-reverse;
}

.bids .list-item:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bids .size {
  background: var(--green-color);
  text-align: right;
}

.list-item:hover {
  opacity: 0.75;
}

.price {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
  flex: 0 0 70px;
  margin: 0;
  padding: 3px 5px;
  text-align: center;
}

.size {
  flex: 1 1;
  margin: 0;
  color: white;
  padding: 3px 5px;
  position: relative;
}

.size:before {
  background-color: var(--row-color);
  content: '';
  height: 100%;
  left: 0;
  opacity: 0.08;
  position: absolute;
  top: 0;
  width: 100%;
}`

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
    if (isMarketBuy || isMarketSell)  {
      let filledSize = 0
      let processed;
      if (isMarketSell) 
        processed = quotes.reduce((previousValue, currentValue) => {
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
        }, []);
      else 
        processed = quotes.reduceRight((previousValue, currentValue) => {
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
        }, []);        
      updatedQuotes = [...processed]
    } else { // add limit order
      quotes.forEach(quote => {
        if (quote[0] === price) 
        quote[1] += size
      })
      updatedQuotes = [...quotes]
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
      <style
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />

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
