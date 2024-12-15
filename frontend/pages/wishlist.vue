<template>
    <div id="app" class="container">
      <!-- Header Section -->
      <header class="header">
        <h1>Sundarban</h1>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Sign Up</a></li>
          </ul>
        </nav>
      </header>
  
      <!-- Wishlist Section -->
      <section class="wishlist">
        <h2>Wishlist (4)</h2>
        <div class="wishlist-items">
          <div class="wishlist-item" v-for="(item, index) in wishlistItems" :key="index">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="item-details">
              <p class="item-name">{{ item.name }}</p>
              <p class="price">{{ item.price }}</p>
            </div>
            <button class="remove">&times;</button>
          </div>
        </div>
        <button class="move-all">Move All to Bag</button>
      </section>
  
      <!-- Just For You Section -->
      <section class="just-for-you">
        <h2>Just For You</h2>
        <div class="recommendations">
          <div class="recommendation" v-for="(item, index) in recommendations" :key="index">
            <img :src="item.image" :alt="item.name" />
            <p>{{ item.name }}</p>
            <p class="price">{{ item.price }}</p>
            <p class="rating">{{ item.rating }} ★</p>
          </div>
        </div>
        <button class="see-all">See All</button>
      </section>
  
      <!-- Footer Section -->
      <footer class="footer">
        <div class="footer-columns">
          <div class="footer-column">
            <h3>Sundarban</h3>
            <p>Get 10% off your first order</p>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>My Account</h4>
            <ul>
              <li><a href="#">Login</a></li>
              <li><a href="#">Order History</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Download App</h4>
            <ul class="app-links">
              <li><a href="#">Google Play</a></li>
              <li><a href="#">App Store</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        wishlistItems: [
          { image: 'bag.png', name: 'Special Office Bag', price: '$300' },
          { image: 'cooler.png', name: 'RGB Liquid CPU Cooler', price: '$150' },
          { image: 'gamepad.png', name: 'GP1 Shooter USB Gamepad', price: '$65' },
          { image: 'jacket.png', name: 'Outland Satin Jacket', price: '$80' }
        ],
        recommendations: [
          { image: 'laptop.png', name: 'ASUS ROG Gaming Laptop', price: '$999', rating: 4.8 },
          { image: 'monitor.png', name: 'IPS LED Gaming Monitor', price: '$500', rating: 4.5 },
          { image: 'gamepad-red.png', name: 'HSM XT-2 USB Gamepad', price: '$50', rating: 4.2 },
          { image: 'keyboard.png', name: 'RGB XYZ Mechanical Keyboard', price: '$75', rating: 4.7 }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  /* General Layout */
  .container {
    font-family: Arial, sans-serif;
    color: #333;
    margin: 0 auto;
    max-width: 1200px;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e1e1e1;
    background-color: #fefefe;
  }
  
  nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  nav ul li a {
    text-decoration: none;
    color: #666;
  }
  
  .wishlist {
    margin: 20px 0;
  }
  
  .wishlist h2 {
    color: #222;
    margin-bottom: 10px;
  }
  
  .wishlist-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .wishlist-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ddd;
    background-color: #fff;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .wishlist-item .item-image img {
    max-width: 80%;
    height: auto;
    margin-bottom: 10px;
  }
  
  .wishlist-item .item-details {
    text-align: center;
  }
  
  .wishlist-item .item-name {
    font-size: 14px;
    margin: 5px 0;
  }
  
  .wishlist-item .price {
    font-weight: bold;
    color: #e74c3c;
    margin-bottom: 10px;
  }
  
  .wishlist-item .remove {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #e74c3c;
    font-size: 18px;
    cursor: pointer;
  }
  
  .just-for-you h2 {
    margin-bottom: 10px;
    color: #222;
  }
  
  .recommendations {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .recommendation {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .recommendation .price {
    color: #e74c3c;
    font-weight: bold;
  }
  
  footer {
    background: #000;
    color: #fff;
    padding: 30px 20px;
    border-top: 1px solid #e1e1e1;
  }
  
  footer .footer-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: space-between;
  }
  
  footer .footer-column {
    flex: 1 1 180px;
    min-width: 180px;
  }
  
  footer h3, footer h4 {
    margin-bottom: 10px;
    color: #fff;
  }
  
  footer a {
    text-decoration: none;
    color: #fff;
  }
  
  footer ul {
    list-style: none;
    padding: 0;
  }
  
  footer ul li {
    margin-bottom: 8px;
  }
  
  footer .app-links {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  </style>
  