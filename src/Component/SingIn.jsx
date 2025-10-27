import React, { useState } from "react";
import "../Style/signin.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SingIn({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    numberOfPeople: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate basic fields
    if (
      !formData.name ||
      !formData.numberOfPeople ||
      !formData.address ||
      !formData.phoneNumber
    ) {
      toast.error("Please fill all the fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Store in localStorage
    localStorage.setItem("userDetails", JSON.stringify(formData));

    toast.success("Details saved successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    // Trigger parent callback to hide popup
    onSubmit();
  };

  return (
    <div className="signin-overlay">
      <div className="signin-popup">
        <h2>Add Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="numberOfPeople"
            placeholder="Number of People"
            value={formData.numberOfPeople}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default SingIn;
