import { useEffect, useState, useCallback } from "react"
import useWebSocket from "react-use-websocket";
import OrderBook from "./OrderBook"
import OrderEntry from "./OrderEntry"
import "./App.scss"

const webSocketsURL = 'ws://localhost:8080'


function App() {
  const [orderSize, setOrderSize] = useState(0)
  const [orderPrice, setOrderPrice] = useState(0)
  const [book, setBook] = useState({
    bids: [],
    asks: []
  })
  const [useMockServer, setUseMockServer] = useState(false)

  const { sendJsonMessage, lastMessage } = useWebSocket(webSocketsURL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: (closeEvent) => false,
    onMessage: (event) => {
      const response = JSON.parse(event.data)
      if (response) {
        setBook(response)
      }
    },
    onError: (e) => { 
      console.log('got websocket eror from server ' + e)
      setUseMockServer(true)
      console.log('useMockServer is ' + useMockServer)
    }
  });

  const fetchOrderBook = useCallback(
    async () => {
      if (useMockServer) {
        await import('./api/mockServer')
        let response = await fetch("/api/orderbook")
        response = await response.json()
        setBook(response)
      } else 
        sendJsonMessage({
          msg: 'subscribe'
        });
    },
    [useMockServer]
  );

  useEffect(() => {
    fetchOrderBook()
  }, [useMockServer])

  const handleSizeChange = (e) => {
    setOrderSize(e.target.value)
  }

  const handlePriceChange = (e) => {
    setOrderPrice(e.target.value)
  }

  const handleClickOrder = async (orderPrice, orderAction) => {
    if (useMockServer) {
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
    } else {
      setOrderPrice(orderPrice)
      sendJsonMessage({
        msg: 'openOrder',
        body: {
          orderAction, 
          orderSize, 
          orderPrice
        }
      });
    }
  }
  if (book.asks.length === 0 && book.bids.length === 0)
    return (<div className="loader"></div>)

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
