import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;
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
  const limit = window.innerWidth <= 768 ? 6 : 15;


  // 🔹 Fetch menu items (category/lazy load)
  const fetchMenu = useCallback(
    async (pageNum, reset = false) => {
      if (fetchingRef.current) return;

      fetchingRef.current = true;
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = item
          ? `${API_URL}/api/menu/category?cat=${encodeURIComponent(
              item,
            )}&page=${pageNum}&limit=${limit}`
          : `${API_URL}/api/menu/lazy?page=${pageNum}&limit=${limit}`;

        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          const receivedItems = data.data || [];

          setMenu((prev) => {
            const existingItems = reset ? [] : prev;

            const newItems = receivedItems.filter(
              (itm) =>
                !existingItems.some((existing) => existing._id === itm._id),
            );

            return [...existingItems, ...newItems];
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
        if (abortRef.current === controller) {
          abortRef.current = null;
          fetchingRef.current = false;
          setLoading(false);
        }
      }
    },
    [item, limit],
  );

  // 🟢 Fetch data initially or when category changes (skip during search)
  useEffect(() => {
    if (search?.trim()) return;

    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    fetchingRef.current = false;

    setMenu([]);
    setPage(1);
    setHasMore(true);

    fetchMenu(1, true);

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [item, search, fetchMenu]);

  // 🔍 Fetch search results directly from backend
  useEffect(() => {
    if (!search?.trim()) return; // skip if no search

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/menu/search?query=${encodeURIComponent(search)}`,
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

    // If the container cannot be found, use the browser window.
    const useWindowScroll =
      !scrollContainer ||
      scrollContainer.scrollHeight <= scrollContainer.clientHeight;

    let timeout;

    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        let nearBottom = false;

        if (useWindowScroll) {
          const scrollPosition = window.scrollY + window.innerHeight;

          nearBottom =
            scrollPosition >= document.documentElement.scrollHeight - 250;
        } else {
          nearBottom =
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight - 250;
        }

        if (nearBottom && !loading && hasMore && !fetchingRef.current) {
          const nextPage = page + 1;

          setPage(nextPage);
          fetchMenu(nextPage);
        }

        timeout = null;
      }, 150);
    };

    if (useWindowScroll) {
      window.addEventListener("scroll", handleScroll);
    } else {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    // Check immediately in case the content doesn't fill the screen.
    handleScroll();

    return () => {
      if (useWindowScroll) {
        window.removeEventListener("scroll", handleScroll);
      } else {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }

      clearTimeout(timeout);
    };
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

      const updatedCount = { ...prev };

      if (current === 1) {
        // Remove the item completely when quantity reaches 0
        delete updatedCount[item.name];
      } else {
        updatedCount[item.name] = {
          ...updatedCount[item.name],
          quantity: current - 1,
        };
      }

      return updatedCount;
    });
  };

  // 🟢 Handle Next Button
  const handleNext = () => {
    const selectedItems = Object.fromEntries(
      Object.entries(count).filter(([, item]) => item.quantity > 0),
    );
    if (Object.keys(selectedItems).length === 0) {
      toast.error("Please select at least one item!");
      return;
    }
    navigate("/next", { state: selectedItems });
  };
  return (
    <div className="menu-display">
      <Toaster position="top-center" reverseOrder={false} />

      {menu.length > 0
        ? menu.map((m) => {
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
        : !loading && <p>No items found</p>}

      {loading && (
        <div className="loading-placeholder">
          <p>Loading...</p>
        </div>
      )}

      <div className="footer">
        <button
          className={
            Object.values(count).some((c) => c.quantity > 0) ? "active-btn" : ""
          }
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Display;
