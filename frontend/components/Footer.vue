<template>
    <div class="footer-container">
      <footer>
        <div class="footer-content">
          <!-- Exclusive Section -->
          <div class="footer-section">
            <h3>Exclusive</h3>
            <p>Subscribe</p>
            <p>Get 10% off your first order</p>
            <div class="email-input">
              <input type="email" placeholder="Enter your email" />
              <button>&rarr;</button>
            </div>
          </div>
  
          <!-- Support Section -->
          <div class="footer-section">
            <h3>Support</h3>
            <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
  
          <!-- Account Section -->
          <div class="footer-section">
            <h3>Account</h3>
            <ul>
              <li><a href="#">My Account</a></li>
              <li><a href="#">Login / Register</a></li>
              <li><a href="#">Cart</a></li>
              <li><a href="#">Wishlist</a></li>
              <li><a href="#">Shop</a></li>
            </ul>
          </div>
  
          <!-- Quick Link Section -->
          <div class="footer-section">
            <h3>Quick Link</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms Of Use</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
  
          <!-- Download App Section -->
          <div class="footer-section">
            <h3>Download App</h3>
            <p>Save $3 with App New User Only</p>
            <div class="qr-placeholder">QR Code Placeholder</div>
            <div class="app-buttons">
              <button>Google Play</button>
              <button>App Store</button>
            </div>
            <div class="social-icons">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; Copyright Rimel 2022. All right reserved</p>
        </div>
      </footer>
    </div>
  </template>
  
  <style scoped>
  .footer-container {
    background-color: #000;
    color: #fff;
    font-family: Arial, sans-serif;
    padding: 2rem 0;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 1rem;
  }
  
  .footer-section {
    margin: 1rem;
    text-align: left;
  }
  
  .footer-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .footer-section p,
  .footer-section ul,
  .footer-section li {
    margin: 0.5rem 0;
    list-style: none;
    font-size: 0.9rem;
  }
  
  .footer-section a {
    color: #fff;
    text-decoration: none;
  }
  
  .footer-section a:hover {
    text-decoration: underline;
  }
  
  .email-input {
    display: flex;
    align-items: center;
  }
  
  .email-input input {
    padding: 0.5rem;
    border: none;
    border-radius: 4px 0 0 4px;
    outline: none;
  }
  
  .email-input button {
    padding: 0.5rem;
    background-color: #fff;
    color: #000;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
  }
  
  .qr-placeholder {
    width: 120px;
    height: 120px;
    background-color: #444;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .app-buttons button {
    display: block;
    background: #fff;
    color: #000;
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .social-icons a {
    color: #fff;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #333;
    font-size: 0.8rem;
  }
  </style>
  