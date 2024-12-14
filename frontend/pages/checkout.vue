<template>
    <div class="checkout-page">
      <!-- Header Section -->
      <header class="header">
        <div class="logo">Sundarban</div>
        <nav class="nav">
          <a href="#">Home</a>
          <a href="#">Contact</a>
          <a href="#">About</a>
          <a href="#">Sign Up</a>
        </nav>
        <input type="text" placeholder="Search..." class="search-bar" />
        <div class="icons">
          <span>❤️</span>
          <span>🛒</span>
        </div>
      </header>
  
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        Account / My Account / Product / View Cart / Checkout
      </div>
  
      <!-- Main Content -->
      <div class="content-container">
        <!-- Billing Details Section -->
        <div class="billing-details">
          <h2>Billing Details</h2>
          <form>
            <div class="form-group">
              <input type="text" placeholder="First Name*" class="input-field" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Company Name" class="input-field" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Street Address*" class="input-field" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Apartment, floor, etc. (optional)" class="input-field" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Town/City*" class="input-field" />
            </div>
            <div class="form-group">
              <input type="text" placeholder="Phone Number*" class="input-field" />
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email Address*" class="input-field" />
            </div>
            <div class="form-group save-info">
              <label>
                <input type="checkbox" /> Save this information for faster check-out next time
              </label>
            </div>
          </form>
        </div>
  
        <!-- Order Summary Section -->
        <div class="order-summary">
          <div class="order-items">
            <div class="item">
              <img src="https://via.placeholder.com/150" alt="LCD Monitor" class="product-img" />
              <p>LCD Monitor</p>
              <p>$650</p>
            </div>
            <div class="item">
              <img src="https://via.placeholder.com/150" alt="RGB Keyboard" class="product-img" />
              <p>RGB Gamepad</p>
              <p>$100</p>
            </div>
          </div>
          <hr />
          <div class="price-details">
            <p class="subtotal">Subtotal: <span>$750</span></p>
            <p class="shipping">Shipping: <span>Free</span></p>
            <p><strong>Total: $750</strong></p>
          </div>
  
          <!-- Payment Options -->
          <div class="payment-options">
            <label><input type="radio" name="payment" /> Bank</label>
            <label><input type="radio" name="payment" /> Cash on delivery</label>
            <div class="coupon-section">
              <input type="text" placeholder="Coupon Code" />
              <button class="apply-btn">Apply Coupon</button>
            </div>
            <button class="place-order-btn">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CheckoutPage",
  };
  </script>
  
  <style scoped>
  /* Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Adjusting font-family for a more modern look */
  }
  
  .checkout-page {
    width: 100%;
    background-color: #f4f4f4; /* Added a light background to contrast with content */
  }
  
  /* Header Section */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    background-color: #fff; /* White background to separate from main content */
    border-bottom: 1px solid #ddd; /* Subtle bottom border */
  }
  .header .logo {
    font-size: 26px;
    font-weight: bold;
    color: #333;
  }
  .header .nav a {
    margin: 0 15px;
    text-decoration: none;
    color: #444;
    font-weight: 500;
  }
  .header .search-bar {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .header .icons span {
    margin-left: 15px;
    font-size: 24px;
    cursor: pointer;
  }
  
  /* Breadcrumb Section */
  .breadcrumb {
    margin: 20px 30px;
    color: #777;
    font-size: 16px;
    font-weight: 400;
  }
  
  /* Content Container */
  .content-container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Billing Details Section */
  .billing-details {
    width: 55%;
    padding: 25px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  .billing-details h2 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 25px;
  }
  .billing-details form {
    display: flex;
    flex-direction: column;
  }
  .billing-details .form-group {
    margin-bottom: 20px;
  }
  .billing-details .input-field {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    margin-top: 5px;
    background-color: #fafafa; /* Slight background color */
  }
  .billing-details .save-info {
    font-size: 14px;
    color: #555;
  }
  .billing-details .save-info input {
    margin-right: 10px;
  }
  
  /* Order Summary Section */
  .order-summary {
    width: 40%;
    padding: 25px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  .order-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .order-items .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order-items .product-img {
    width: 45px;
    height: 45px;
    margin-right: 15px;
  }
  .price-details {
    margin: 20px 0;
  }
  .price-details p {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
  }
  .price-details .subtotal,
  .price-details .shipping {
    border-bottom: 1px solid #ddd; /* Adding underline */
    padding-bottom: 10px; /* Adding some space for visual separation */
  }
  .price-details strong {
    font-size: 18px;
    color: #333;
  }
  .payment-options {
    margin-top: 25px;
  }
  .payment-options label {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
    color: #555;
  }
  .coupon-section {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .coupon-section input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
  }
  /* Apply Coupon Button Color */
  .apply-btn {
    padding: 12px 20px;
    background-color: #f5a623; /* Updated color to match image */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .apply-btn:hover {
    background-color: #e28b1f; /* Slightly darker color for hover effect */
  }
  .place-order-btn {
    margin-top: 25px;
    width: 100%;
    padding: 14px;
    background-color: #ff5a5f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .place-order-btn:hover {
    background-color: #e04e4f;
  }
  
  /* Save Information Section - Checkbox Color Change */
  .billing-details .save-info input:checked + label {
    color: #f5a623; /* Update text color on checked */
  }
  .billing-details .save-info input:checked {
    background-color: #f5a623; /* Matching color when checked */
    border-color: #f5a623;
  }
  </style>