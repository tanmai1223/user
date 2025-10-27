import React, { useEffect, useState } from 'react';

function TakeAway({ total,time }) {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedDetails) {
      setUserDetails(storedDetails);
    }
  }, []);

  const taxAmount = (total * 0.05).toFixed(2); // 5% tax
  const deliveryFee = (total * 0.03).toFixed(2); // 3% delivery fee
  const totalCost = (
    parseFloat(total) +
    parseFloat(taxAmount) +
    parseFloat(deliveryFee)
  ).toFixed(2);

  return (
    <div className="dineIn">
      <table>
        <tbody>
          <tr>
            <td>Item total</td>
            <td>₹{total}</td>
          </tr>
          <tr>
            <td>Delivery Fee</td>
            <td>₹{deliveryFee}</td>
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
          {userDetails.name}, {userDetails.phoneNumber}
        </h3>
      </div>
      <hr />
      <div className="details">
        <h3>Delivery at Home - {userDetails.address}</h3>
        <h3>Delivery in {time} min</h3>
      </div>
    </div>
  );
}

export default TakeAway;
