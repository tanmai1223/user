import React, { useState, useEffect } from "react";
import "../Style/main.css";
import Display from "../Component/Display";
import Signin from "../Component/SingIn";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSignin, setShowSignin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsed = JSON.parse(userDetails);
      if (parsed.name) {
        const formattedName =
          parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1).toLowerCase();
        setUserName(formattedName);
      }
    } else {
      setShowSignin(true);
    }
  }, []);

  const categories = [
    { name: "Burger", img: "burger.svg" },
    { name: "Pizza", img: "pizza.svg" },
    { name: "Drinks", img: "drinks.svg" },
    { name: "Pasta", img: "pasta.svg" },
    { name: "Snacks", img: "snack.svg" },
    { name: "Meals", img: "meals.svg" },
    { name: "Starters", img: "starter.svg" },
    { name: "Tiffins", img: "tiffins.svg" },
  ];

  return (
    <div className="home-page">
      <div className="headings">
        <h2>
          Welcome {userName ? ` ${userName}` : ""} 😊
        </h2>
        <h3>Place your order here...</h3>
      </div>

      <div className="searchbar">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="category">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`items ${selectedCategory === cat.name ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            <img src={cat.img} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 👇 Scrollable section */}
      <div className="scroll-container">
        <Display item={selectedCategory} search={searchTerm} />
      </div>

      {showSignin && (
        <Signin
          onSubmit={() => {
            setShowSignin(false);
            const userDetails = JSON.parse(localStorage.getItem("userDetails"));
            if (userDetails?.name) {
              const formattedName =
                userDetails.name.charAt(0).toUpperCase() +
                userDetails.name.slice(1).toLowerCase();
              setUserName(formattedName);
            }
          }}
        />
      )}
    </div>
  );
}

export default Home;
