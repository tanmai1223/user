import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";

// ✅ Reusable menu item
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
  const fetchingRef = useRef(false);
  const abortRef = useRef(null);

  // 🔹 Fetch menu items (category/lazy load)
  const fetchMenu = useCallback(
    async (pageNum) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setLoading(true);

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
        if (err.name !== "AbortError") console.error("Error fetching menu:", err);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [item]
  );

  // 🟢 Fetch data initially or when category changes (skip during search)
  useEffect(() => {
    if (search?.trim()) return; // skip if searching
    setMenu([]);
    setPage(1);
    setHasMore(true);
    fetchMenu(1);
  }, [item, fetchMenu, search]);

  // 🔍 Fetch search results directly from backend
  useEffect(() => {
    if (!search?.trim()) return; // skip if no search

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/menu/search?query=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        if (data.success) {
          setMenu(data.data);
          setHasMore(false);
        } else {
          setMenu([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [search]);

  // 🔄 Infinite scroll only for non-search mode
  useEffect(() => {
    if (search?.trim()) return;

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
          const nextPage = page + 1;
          setPage(nextPage);
          fetchMenu(nextPage);
        }
        scrollTimeout = null;
      }, 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore, fetchMenu, search]);

  // ➕➖ Counter functions
  const increment = (item) => {
    setCount((prev) => ({
      ...prev,
      [item.name]: {
        quantity: (prev[item.name]?.quantity || 0) + 1,
        price: item.price,
        image: item.image,
        time: item.averageTime,
        category: item.category,
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
          category: item.category,
        },
      };
    });
  };

  // 🟢 Handle Next Button
  const handleNext = () => {
    const selectedItems = Object.values(count).filter((c) => c.quantity > 0);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item!");
      return;
    }
    navigate("/next", { state: count });
  };

  return (
    <div className="menu-display">
      <Toaster position="top-center" reverseOrder={false} />

      {menu.length > 0 ? (
        menu.map((m) => {
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
          <p>Loading...</p>
        </div>
      )}

      <div className="footer">
        <button
          className={Object.values(count).some((c) => c.quantity > 0) ? "active-btn" : ""}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Display;
