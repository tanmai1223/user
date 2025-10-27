import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router";

function Display({ item, search }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [count, setCount] = useState({}); // { itemName: { quantity, price, image } }

  const fetchMenu = async () => {
    try {
      const url = item
        ? `http://localhost:3000/api/menu/category?cat=${item}`
        : `http://localhost:3000/api/menu/category`;

      const res = await fetch(url);
      const data = await res.json();
      setMenu(data.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setMenu([]);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [item]);

  const filteredMenu = Array.isArray(menu)
    ? menu.filter((m) =>
        m.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const increment = (item) => {
    setCount((prev) => ({
      ...prev,
      [item.name]: {
        quantity: (prev[item.name]?.quantity || 0) + 1,
        price: item.price,
        image: item.image,
        time:item.averageTime
      },
    }));
  };

  const decrement = (item) => {
    setCount((prev) => {
      const current = prev[item.name]?.quantity || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [item.name]: {
          quantity: current - 1,
          price: item.price,
          image: item.image,
          time:item.averageTime
        },
      };
    });
  };

  return (
    <div className="menu-display">
      {filteredMenu.length > 0 ? (
        filteredMenu.map((m, i) => {
          const itemCount = count[m.name] || { quantity: 0 };
          return (
            <div key={i} className="menu-item">
              <img src={m.image} alt={m.name} />
              <div className="menu-name">
                <p>{m.name}</p>
                <div className="counter">
                  <p>₹{m.price}</p>
                  {itemCount.quantity > 0 && (
                    <>
                      <FaMinus onClick={() => decrement(m)} />
                      <span>{itemCount.quantity}</span>
                    </>
                  )}
                  <FaPlus onClick={() => increment(m)} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No items found</p>
      )}
      <div className="footer">
        <button onClick={() => navigate("/next", { state: count })}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Display;
