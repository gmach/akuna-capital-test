const OrderBook = ({
  book,
  handleClickOrder
}) => {

  const { bids, asks } = book;

  const DisplayList = (
    {
      list,
      side
    }
  ) => {

    const handleClick = (price, orderAction) => {
      handleClickOrder(price, orderAction)
    }
    return (
      <div className={side}>
        <ol className='list'>
          {list.map(([price, size], index) => {
            const priceStyle = 
            side === 'asks' && index === (list.length - 1) ?
            {
              background: 'white',
              color : 'black'
            }
            :
            {
              background: 'black',
              color : 'white'
            }
            return (
              <li className='list-item'
                key={price}>
                {
                  side === 'asks' && 
                  <>
                  <span className='sellMarket' onClick={()=>handleClick(price, 'marketSell')}></span>
                  <span className='price' style={priceStyle}>{price}</span>
                  <span className='size'
                    onClick={()=>handleClick(price, 'limitSell')}
                  >{size}</span>                    
                  </>
                }
                {
                  side === 'bids' && 
                  <>
                  <span className='buyMarket' onClick={()=>handleClick(price, 'marketBuy')}></span>
                  <span className='price' style={priceStyle}>{price}</span>
                  <span className='size'
                    onClick={()=>handleClick(price)}
                  >{size}</span>  
                  </>
                }            
              </li>
            );
          })}
        </ol>
      </div>
    );
  };  

  return (
    <main className="wrapper">
      <DisplayList 
        list={asks} 
        side='asks'
      />
      <DisplayList 
        list={bids} 
        side='bids'
      />
    </main>
  );
}


export default OrderBook