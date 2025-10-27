import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import Ordered from "../Component/Ordered";
import Instructions from "../Component/Instruction";
import DineIn from "../Component/DineIn";
import TakeAway from "../Component/TakeAway";
import { FaArrowRight } from "react-icons/fa";
import "../Style/home.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCount = location.state;

  const [items, setItems] = useState(initialCount || {});
  const [selectedOption, setSelectedOption] = useState("DineIn");

  const swipeRef = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Calculate totals
  const total = Object.values(items).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalQty = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalTime = Object.values(items).reduce(
    (acc, item) => acc + item.time * item.quantity,
    0
  );
  const averageTime = totalQty > 0 ? Math.floor(totalTime / totalQty) + 15 : 15;

  // Swipe logic
  const startDrag = (clientX) => {
    setIsDragging(true);
    setIsResetting(false);
    updateDrag(clientX);
  };

  const updateDrag = (clientX) => {
    if (!isDragging) return;
    const rect = swipeRef.current.getBoundingClientRect();
    let x = clientX - rect.left - 30;
    if (x < 0) x = 0;
    if (x > rect.width - 60) x = rect.width - 60;
    setDragX(x);
  };

  const resetSwipe = () => {
    setIsResetting(true);
    setDragX(0);
    setTimeout(() => setIsResetting(false), 300); // smooth reset
  };

  const submitOrder = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (!userDetails) {
        toast.error("User details missing!", {
          position: "top-center",
          autoClose: 3000,
        });
        resetSwipe();
        return;
      }

      const orderItems = Object.entries(items).map(([name, details]) => ({
        name,
        quantity: details.quantity,
      }));

      const totalTimeSafe = Object.values(items).reduce(
        (acc, item) => acc + (item.time || 0) * item.quantity,
        0
      );
      const totalQtySafe = Object.values(items).reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const averageTimeSafe =
        totalQtySafe > 0 ? Math.floor(totalTimeSafe / totalQtySafe) + 15 : 15;

      const body = {
        name: userDetails.name,
        phoneNumber: userDetails.phoneNumber,
        address: userDetails.address,
        numberOfPeople: userDetails.numberOfPeople,
        orderItem: orderItems,
        dineIn: selectedOption === "DineIn",
        averageTime: averageTimeSafe,
      };

      const res = await fetch("http://localhost:3000/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order submitted successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/final"), 2000);
      } else {
        toast.error(data.message || "Failed to submit order", {
          position: "top-center",
          autoClose: 3000,
        });
        resetSwipe();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting order", {
        position: "top-center",
        autoClose: 3000,
      });
      resetSwipe();
    }
  };

  const endDrag = async () => {
    if (!isDragging) return;
    const rect = swipeRef.current.getBoundingClientRect();
    if (dragX > rect.width - 80) {
      await submitOrder();
    } else {
      resetSwipe();
    }
    setIsDragging(false);
  };

  const handleMouseDown = (e) => startDrag(e.clientX);
  const handleMouseMove = (e) => updateDrag(e.clientX);
  const handleMouseUp = () => endDrag();
  const handleTouchStart = (e) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e) => updateDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();

  return (
    <div className="app-container">
      <div className="headings">
        <h2>Welcome 😊</h2>
        <h3>Place your order here...</h3>
      </div>

      {/* Ordered Items */}
      <Ordered count={items} setCount={setItems} />

      <Instructions />

      {/* Toggle Buttons */}
      <div className="toggle-container">
        <button
          className={`toggle-btn ${
            selectedOption === "DineIn" ? "active" : ""
          }`}
          onClick={() => setSelectedOption("DineIn")}
        >
          DineIn
        </button>
        <button
          className={`toggle-btn ${
            selectedOption === "TakeAway" ? "active" : ""
          }`}
          onClick={() => setSelectedOption("TakeAway")}
        >
          TakeAway
        </button>
      </div>

      {/* Render selected option */}
      <div className="option-container">
        {selectedOption === "DineIn" && <DineIn total={total} />}
        {selectedOption === "TakeAway" && (
          <TakeAway total={total} time={averageTime} />
        )}
      </div>

      {/* Swipe Button */}
      <div
        className="swipe-container"
        ref={swipeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="swipe-btn"
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isResetting ? "transform 0.3s ease" : "none",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <FaArrowRight />
        </div>
        <span className="swipe-text">Swipe to Submit</span>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default Main;
