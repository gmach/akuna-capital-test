import { useEffect, useState } from "react"
import OrderBook from "./OrderBook"
import OrderEntry from "./OrderEntry"
import './api/server'
import "./App.scss"

function App() {
  const [orderSize, setOrderSize] = useState(0)
  const [orderPrice, setOrderPrice] = useState(0)
  const [book, setBook] = useState({
    bids: [],
    asks: []
  })

  useEffect(() => {
    fetch("/api/orderbook")
      .then((response) => response.json())
      .then((json) => setBook(json))
  }, [])

  const handleSizeChange = (e) => {
    setOrderSize(e.target.value)
  }

  const handlePriceChange = (e) => {
    setOrderPrice(e.target.value)
  }

  const handleClickOrder = async (orderPrice, orderAction) => {
    setOrderPrice(orderPrice)
    let response = await fetch("/api/orderbook", 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          orderAction,
          orderSize,
          orderPrice
        }
      )
    })
    response = await response.json()
    setBook(response)
  }
  
  return (
    <>
      <OrderBook
        book={book}
        handleClickOrder={handleClickOrder}
      />
     <OrderEntry orderSize={orderSize} handleSizeChange={handleSizeChange} orderPrice={orderPrice} handlePriceChange={handlePriceChange} />
    </>
  );
};

export default App;
