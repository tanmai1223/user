import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import "../Style/home.css";

function Ordered({ count, setCount, onTotalChange }) { // <-- added setCount
  const [data, setData] = useState({ ...count });
  const orderedItems = Object.entries(data);

  // Whenever `data` changes, update parent states
  useEffect(() => {
    setCount && setCount(data); // update Main's items
    const total = Object.values(data).reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    onTotalChange && onTotalChange(total);
  }, [data, setCount, onTotalChange]);

  const increment = (name, item) => {
    setData((prev) => ({
      ...prev,
      [name]: { ...item, quantity: (item.quantity || 0) + 1 },
    }));
  };

  const decrement = (name, item) => {
    setData((prev) => {
      const updated = { ...prev };
      if (item.quantity <= 1) delete updated[name];
      else updated[name] = { ...item, quantity: item.quantity - 1 };
      return updated;
    });
  };

  return (
    <div className="ordered-container">
      {orderedItems.length > 0 ? (
        orderedItems.map(([name, details], i) => (
          <div key={i} className="ordered-item">
            <img src={details.image} alt={name} className="ordered-image" />
            <div className="ordered-detail">
              <div>
                <p className="ordered-name">{name}</p>
                <p className="ordered-price">₹{details.price}</p>
              </div>
              <div className="quantity-controls">
                <FaMinus
                  onClick={() => decrement(name, details)}
                  className="icon"
                />
                <span className="qty">{details.quantity}</span>
                <FaPlus
                  onClick={() => increment(name, details)}
                  className="icon"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-items">No items ordered yet</p>
      )}
    </div>
  );
}

export default Ordered;
