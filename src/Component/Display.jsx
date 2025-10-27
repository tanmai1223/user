import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router";

// ✅ Memoized menu item (unchanged)
const MenuItem = React.memo(({ m, itemCount, increment, decrement }) => (
  <div key={m._id || m.name} className="menu-item">
    <img src={m.image} alt={m.name} loading="lazy" />
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
));

function Display({ item, search }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [count, setCount] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false); // ✅ prevent parallel fetches
  const abortRef = useRef(null); // ✅ cancel previous request if needed

  const fetchMenu = useCallback(
    async (pageNum) => {
      if (fetchingRef.current) return; // block if already fetching
      fetchingRef.current = true;
      setLoading(true);

      // cancel previous fetch if it’s still running
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = item
          ? `http://localhost:3000/api/menu/category?cat=${encodeURIComponent(
              item
            )}&page=${pageNum}&limit=6`
          : `http://localhost:3000/api/menu/lazy?page=${pageNum}&limit=6`;

        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setMenu((prev) => {
            const newItems = data.data.filter(
              (itm) => !prev.some((existing) => existing._id === itm._id)
            );
            return [...prev, ...newItems];
          });
          setHasMore(pageNum < data.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching menu:", err);
        }
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [item]
  );

  // ✅ Initial load
  useEffect(() => {
    setMenu([]);
    setPage(1);
    setHasMore(true);
    fetchMenu(1);
  }, [item, fetchMenu]);

  // ✅ Infinite scroll listener
  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (!scrollContainer) return;

    let scrollTimeout;

    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        const nearBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 200;

        if (nearBottom && !loading && hasMore && !fetchingRef.current) {
          // wait for current to finish, then trigger next
          const nextPage = page + 1;
          setPage(nextPage);
          fetchMenu(nextPage);
        }
        scrollTimeout = null;
      }, 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore, fetchMenu]);

  const filteredMenu = menu.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const increment = (item) => {
    setCount((prev) => ({
      ...prev,
      [item.name]: {
        quantity: (prev[item.name]?.quantity || 0) + 1,
        price: item.price,
        image: item.image,
        time: item.averageTime,
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
          time: item.averageTime,
        },
      };
    });
  };

  return (
    <div className="menu-display">
      {filteredMenu.length > 0 ? (
        filteredMenu.map((m) => {
          const itemCount = count[m.name] || { quantity: 0 };
          return (
            <MenuItem
              key={m._id || m.name}
              m={m}
              itemCount={itemCount}
              increment={increment}
              decrement={decrement}
            />
          );
        })
      ) : (
        !loading && <p>No items found</p>
      )}

      {loading && (
        <div className="loading-placeholder">
          <p>Loading more items...</p>
        </div>
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
