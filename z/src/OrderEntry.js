const OrderEntry = ({orderSize, handleSizeChange, orderPrice, handlePriceChange}) => {
  return (
    <>
    <div className="orderEntry">
      <label htmlFor="orderSize" className="labelText">Enter # of contracts </label>
      <input 
        type="number"
        className="orderSize"
        value={orderSize} 
        placeholder="10" 
        step="1" 
        min="1" 
        onChange={handleSizeChange}
        name="size"/>      
    </div>
    <div className="orderEntry">
      <label htmlFor="orderPrice" className="labelText">Enter Price</label>
      <input 
        type="number"
        className="orderPrice"
        value={orderPrice} 
        placeholder="0.0" 
        step="0.25" 
        min="0" 
        onChange={handlePriceChange}
        name="price"/>        
    </div>    
    </>
    
  )
}

export default OrderEntry