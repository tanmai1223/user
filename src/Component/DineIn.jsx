import React, { useEffect, useState } from 'react';
import '../Style/home.css';

function DineIn({ total }) {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: '',
    numberOfPeople: ''
  });

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedDetails) {
      setUserDetails(storedDetails);
    }
  }, []);

  const taxAmount = (total * 0.05).toFixed(2); // 5% tax
  const totalCost = (parseFloat(total) + parseFloat(taxAmount)).toFixed(2); // total + tax

  return (
    <div className="dineIn">
      <table>
        <tbody>
          <tr>
            <td>Item total</td>
            <td>₹{total}</td>
          </tr>
          <tr>
            <td>Taxes</td>
            <td>₹{taxAmount}</td>
          </tr>
          <tr>
            <td>Grand Total</td>
            <td>₹{totalCost}</td>
          </tr>
        </tbody>
      </table>

      <div className="details">
        <h2>Your Details</h2>
        <h3>
          {userDetails.name}, {userDetails.phoneNumber}, {userDetails.numberOfPeople} people
        </h3>
      </div>
    </div>
  );
}

export default DineIn;
