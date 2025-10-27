import React, { useState } from "react";
import "../Style/home.css"; // Make sure to include the CSS below

function Instructions() {
  const [showModal, setShowModal] = useState(false);
  const [instruction, setInstruction] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSave = (e) => {
    e.preventDefault();
    setInstruction(e.target.elements.instruction.value); // Save instruction
    setShowModal(false);
  };

  return (
    <div className="cooking-container">
      {/* Display or input field */}
      <div className="instruction-container" onClick={openModal}>
        <span className="instruction-text">
          {instruction ? instruction : "Add cooking instructions (Optional)"}
        </span>
        <span className="edit-icon">✎</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Add Cooking Instructions</h2>
            <form onSubmit={handleSave}>
              <textarea
                name="instruction"
                defaultValue={instruction}
                placeholder="Type your instructions here..."
                className="modal-input"
              />
              <p className="modal-note">
                The restaurant will try its best to follow your request. However, refunds or
                cancellations in this regard won’t be possible.
              </p>
              <div className="modal-buttons">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="next-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Instructions;
