<template>
  <div class="flash-sales-page">
    <!-- Flash Sales Section -->
    <section class="flash-sales">
      <!-- Header -->
      <div class="flash-header">
        <div class="header-text">
          <h4 class="today-text">Today's</h4>
          <h2 class="flash-title">Flash Sales</h2>
        </div>
        <!-- Timer -->
        <div class="timer">
          <div class="timer-box">
            <span class="timer-value">03</span>
            <span class="timer-label">Days</span>
          </div>
          <div class="dots">:</div>
          <div class="timer-box">
            <span class="timer-value">23</span>
            <span class="timer-label">Hours</span>
          </div>
          <div class="dots">:</div>
          <div class="timer-box">
            <span class="timer-value">19</span>
            <span class="timer-label">Minutes</span>
          </div>
          <div class="dots">:</div>
          <div class="timer-box">
            <span class="timer-value">56</span>
            <span class="timer-label">Seconds</span>
          </div>
        </div>
      </div>

      <!-- Flash Sale Items -->
      <div class="flash-items">
        <!-- Product 1 -->
        <div class="flash-item">
          <span class="discount">-44%</span>
          <img src="https://via.placeholder.com/150" alt="Gamepad" />
          <p class="product-name">HAVIT HV-G92 Gamepad</p>
          <p class="price">$120 <del>$160</del></p>
          <div class="rating">★★★★★ (88)</div>
        </div>
        <!-- Product 2 -->
        <div class="flash-item">
          <span class="discount">-30%</span>
          <img src="https://via.placeholder.com/150" alt="Keyboard" />
          <p class="product-name">AK-900 Wired Keyboard</p>
          <p class="price">$90 <del>$130</del></p>
          <button class="btn-cart">Add To Cart</button>
        </div>
        <!-- Product 3 -->
        <div class="flash-item">
          <span class="discount">-50%</span>
          <img src="https://via.placeholder.com/150" alt="Monitor" />
          <p class="product-name">IPS LCD Gaming Monitor</p>
          <p class="price">$370 <del>$400</del></p>
          <div class="rating">★★★★★ (99)</div>
        </div>
        <!-- Product 4 -->
        <div class="flash-item">
          <span class="discount">-30%</span>
          <img src="https://via.placeholder.com/150" alt="Chair" />
          <p class="product-name">S-Series Comfort Chair</p>
          <p class="price">$375 <del>$450</del></p>
          <div class="rating">★★★★☆ (49)</div>
        </div>
      </div>

      <!-- View All Button -->
      <button class="btn-view-all">View All Products</button>
    </section>
  </div>
</template>

<script>
export default {
  name: "FlashSales",
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
.flash-sales-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 20px 50px;
}

/* Flash Sales Section */
.flash-sales {
  text-align: center;
}

.flash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-text {
  text-align: left;
}

.today-text {
  color: #e53935;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
}

.flash-title {
  font-size: 32px;
  font-weight: bold;
}

/* Timer Section */
.timer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timer-box {
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 70px;
  text-align: center;
}

.timer-value {
  display: block;
  font-size: 24px;
  color: #e53935;
  font-weight: bold;
}

.timer-label {
  font-size: 12px;
  color: #888;
}

.dots {
  font-size: 28px;
  color: #e53935;
  margin: 0 5px;
  line-height: 1;
}

/* Flash Items */
.flash-items {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.flash-item {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 22%;
}

.flash-item img {
  width: 100%;
  max-height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
}

.discount {
  background-color: #e53935;
  color: white;
  padding: 3px 6px;
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 12px;
  border-radius: 3px;
}

.product-name {
  font-size: 14px;
  margin: 10px 0;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #e53935;
}

.price del {
  color: #888;
  margin-left: 5px;
}

.rating {
  font-size: 12px;
  margin-top: 5px;
}

.btn-cart {
  margin-top: 10px;
  background-color: #333;
  color: white;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
}

.btn-view-all {
  margin-top: 30px;
  background-color: #e53935;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 14px;
}
</style>