import React, { useState } from "react";
import "../Style/signin.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    numberOfPeople: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative people count
    if (name === "numberOfPeople" && value < 0) return;

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, numberOfPeople, address, phoneNumber } = formData;

    // 🧾 Empty field check
    if (!name || !numberOfPeople || !address || !phoneNumber) {
      toast.error("Please fill in all the fields!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    // 👤 Name validation — letters and spaces only
    const nameRegex = /^[A-Za-z ]{2,30}$/;
    if (!nameRegex.test(name.trim())) {
      toast.error("Enter a valid name (only letters, min 2 characters).", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    // 👥 Number of people validation
    if (isNaN(numberOfPeople) || Number(numberOfPeople) <= 0) {
      toast.error("Number of people must be a positive number!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    // 🏠 Address validation (min 5 chars)
    if (address.trim().length < 5) {
      toast.error("Please enter a valid address (min 5 characters).", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    // 📞 Phone number validation — 10 digits only
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      toast.error("Enter a valid 10-digit phone number!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Store in localStorage
    localStorage.setItem("userDetails", JSON.stringify(formData));

    toast.success("Details saved successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    // Trigger parent callback after small delay
    setTimeout(() => {
      onSubmit();
    }, 1500);
  };

  return (
    <div className="signin-overlay">
      <div className="signin-popup">
        <h2>Add Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="numberOfPeople"
            placeholder="Number of People"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min="1"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength="10"
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default SignIn;
