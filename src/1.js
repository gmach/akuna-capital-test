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

const isMarketOrder = true
let filledSize = 0
let sizeOrder = 316
asks.forEach(ask=>console.log(ask[0] + '  ' + ask[1]))
  const updatedAsks = asks.reverse().reduce((previousValue, currentValue) => {
    let [quotePrice, quoteSize] = currentValue
    if (filledSize < sizeOrder) {
      const remainingSize = sizeOrder - filledSize
      if (remainingSize < quoteSize) {
        filledSize += remainingSize
        previousValue.push([ quotePrice, quoteSize - remainingSize ] )
      } else 
        filledSize += quoteSize
    } else 
      previousValue.push(currentValue)
    return previousValue;
  }, []);
  console.log("\nNEW ASKSS\n")
  updatedAsks.reverse().forEach(ask=>console.log(ask[0] + '  ' + ask[1]))
