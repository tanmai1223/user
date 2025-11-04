# 🍔 Restaurant User App — Smart Food Ordering Platform

An interactive **Food Ordering Web App** built with **React.js**, designed for a seamless restaurant user experience — from menu browsing to checkout with dine-in or takeaway options.

---

## 🚀 Live Demo  
👉 [User App (Netlify)](https://usersappt.netlify.app/)

---

## 🧠 Overview  
This app allows users to quickly browse restaurant items, select quantities, choose between **Dine-In** or **Takeaway**, and submit their order — all while maintaining a smooth, mobile-friendly experience.  
All user data and cart items are stored temporarily in **localStorage** until the order is confirmed.

---

## 🧩 Pages and Flow  

### 🪪 1️⃣ User Details Popup  
🔹 The app begins with a **popup form** requesting:
- Name  
- Number of People  
- Address  
- Phone Number  

✅ Features:
- Form validation (all fields required)
- Data saved securely in **localStorage**
- Moves to next step after valid submission

📸 **Screenshot:**  
<img width="418" height="700" alt="image" src="https://github.com/user-attachments/assets/a287ca4d-a5e3-417c-86d9-3516bab0ea77" />


---

### 🐱 2️⃣ Menu Page (Home)  
🍽️ Displays categories and paginated item lists.

✅ Features:
- Category filters — click to view items from that specific category  
- Infinite scroll — loads more items as you scroll  
- Search bar — filters items dynamically  
- “+” button to add items → becomes “- 1 +” for quantity control  
- Floating “Next” button activates once at least 1 item is added

📸 **Screenshot:**  
<img width="426" height="701" alt="image" src="https://github.com/user-attachments/assets/df6db349-0007-4872-8ad7-2f4c7eda4835" />

---

### 🧾 3️⃣ Order Review Page  
🧺 Displays the **selected items list** for confirmation.
💳 Choose between:
- 🍽️ **Dine-In**
- 🥡 **Takeaway**

✅ Features:
- Modify item quantities or remove items  
- Dynamic price calculation  
- Fully editable cart
- Displays **final cost summary**  
- Swipe button to confirm order  
- Once swiped:
  - Order details + user info from **localStorage** are sent to **backend DB**


📸 **Screenshot:**  
<img width="425" height="711" alt="image" src="https://github.com/user-attachments/assets/920693b9-7eb9-4d7c-be16-5c5f2ac8bf40" />

---

### 🏁 4️⃣ Checkout Page 
🧺 Displays the **Thank you** for ordering.

✅ Features:
  - LocalStorage is cleared
  - Countdown page shows “Redirecting in 3 seconds…” before returning to the main screen  

📸 **Screenshot:**  
<img width="417" height="698" alt="image" src="https://github.com/user-attachments/assets/111c9419-caac-44ac-b362-4ad5e1023324" />


---

## 🧰 Tech Stack  

| Layer | Technology |
|-------|-------------|
| Frontend | React.js |
| State Management | useState, useEffect |
| Data Storage | localStorage |
| API |fetch (connected to backend server) |
| Pagination | Custom Infinite Scroll |
| Deployment | Netlify |

---

## ⚙️ Setup Instructions  

```bash
# Clone the repository
git clone https://github.com/htanmai/user.git

# Navigate into project
cd user

# Install dependencies
npm install

# Run locally
npm run dev
```
## 🔗 Related Repositories
- 👤 User App: https://github.com/htanmai/user

- ⚙️ Backend API: https://github.com/htanmai/backend

- 🍽️ Main Full Stack Repo: https://github.com/htanmai/fullstack

## 👩‍💻 Author
Hekkadka Tanmai 📧 htanmai.23@gmail.com
