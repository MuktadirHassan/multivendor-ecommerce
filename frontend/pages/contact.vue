<template>
    <div class="contact-page">
      <!-- Top Header -->
      <div class="top-header"></div>
  
      <!-- Navbar -->
      <header class="navbar">
        <div class="brand">Sundarban</div>
        <nav class="nav-links">
          <a href="#">Home</a>
          <a href="#" class="active">Contact</a>
          <a href="#">About</a>
          <a href="#">Sign Up</a>
        </nav>
        <div class="search-cart">
          <input type="text" placeholder="What are you looking for?" class="search-box" />
          <i class="fas fa-heart"></i>
          <i class="fas fa-shopping-cart"></i>
          <i class="fas fa-user"></i>
        </div>
      </header>
  
      <!-- Contact Section -->
      <div class="contact-section">
        <!-- Left Card -->
        <div class="contact-left">
          <div class="contact-item">
            <h3>📞 Call To Us</h3>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: <strong>+8801611112222</strong></p>
          </div>
          <hr />
          <div class="contact-item">
            <h3>✉️ Write To US</h3>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: <strong>customer@exclusive.com</strong></p>
            <p>Emails: <strong>support@exclusive.com</strong></p>
          </div>
        </div>
  
        <!-- Right Form -->
        <div class="contact-right">
          <form>
            <div class="form-row">
              <input type="text" placeholder="Your Name *" />
              <input type="email" placeholder="Your Email *" />
              <input type="text" placeholder="Your Phone *" />
            </div>
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Send Massage</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ContactPage",
  };
  </script>
  
  <style scoped>
  /* General Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }
  
  /* Page Container */
  .contact-page {
    background-color: #ffeded; /* Light pink background */
    min-height: 100vh;
  }
  
  /* Top Header */
  .top-header {
    background-color: #ff8a8a; /* Top header bar */
    height: 20px;
  }
  
  /* Navbar */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background-color: white;
    border-bottom: 1px solid #ddd;
  }
  
  .brand {
    font-size: 24px;
    font-weight: bold;
  }
  
  .nav-links a {
    text-decoration: none;
    color: black;
    margin: 0 15px;
    font-size: 16px;
  }
  
  .nav-links a.active {
    border-bottom: 2px solid red;
  }
  
  .search-cart {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .search-box {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  /* Contact Section */
  .contact-section {
    display: flex;
    gap: 30px;
    justify-content: center;
    margin-top: 50px;
    padding: 0 50px;
  }
  
  /* Left Contact Box */
  .contact-left {
    background-color: #e71e24;
    color: white;
    width: 350px;
    padding: 30px;
    border-radius: 5px;
  }
  
  .contact-item h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .contact-item p {
    font-size: 14px;
    margin: 5px 0;
  }
  
  .contact-left hr {
    border: 0;
    height: 1px;
    background-color: #ff8a8a;
    margin: 20px 0;
  }
  
  /* Right Contact Form */
  .contact-right {
    background-color: #e71e24;
    padding: 30px;
    flex: 1;
    border-radius: 5px;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  .form-row {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .form-row input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
  }
  
  textarea {
    width: 100%;
    height: 150px;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    resize: none;
  }
  
  button {
    background-color: #bf1a1e;
    color: white;
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #a8181c;
  }
  </style>
  