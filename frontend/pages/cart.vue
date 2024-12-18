<template>
  <div class="max-w-7xl mx-auto p-4 font-sans">
    <!-- Header -->
    <header class="flex justify-between items-center py-4 border-b">
      <!-- Logo -->
      <h5 class="text-2xl font-bold">Sundarban</h5>

      <!-- Navigation -->
      <nav class="flex space-x-6">
        <a href="#" class="text-gray-700 hover:text-black">Home</a>
        <a href="#" class="text-gray-700 hover:text-black">Contact</a>
        <a href="#" class="text-gray-700 hover:text-black">About</a>
        <a href="#" class="text-gray-700 hover:text-black">Sign Up</a>
      </nav>

      <!-- Search Bar and Icons -->
      <div class="flex items-center space-x-4">
        <!-- Search Bar -->
        <div class="relative">
          <input type="text" placeholder="What are you looking for?"
            class="border px-4 py-1 pl-10 w-64 text-gray-600 text-sm rounded" />
          <i class="fa fa-search absolute left-3 top-2 text-gray-400"></i>
        </div>

        <!-- Icons -->
        <i class="fa fa-heart text-gray-600 hover:text-black cursor-pointer"></i>
        <i class="fa fa-shopping-cart text-gray-600 hover:text-black cursor-pointer"></i>
        <i class="fa fa-user text-gray-600 hover:text-black cursor-pointer"></i>
      </div>
    </header>


    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="#">Home</a> / <span>Cart</span>
    </div>

    <!-- Cart Table -->
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>LCD Monitor</td>
          <td>$600</td>
          <td>
            <input type="number" min="0" value="1" />
          </td>
          <td>$600</td>
        </tr>
        <tr>
          <td>#1 Gamepad</td>
          <td>$550</td>
          <td>
            <input type="number" min="0" value="2" />
          </td>
          <td>$1100</td>
        </tr>
      </tbody>
    </table>

    <!-- Buttons -->
    <div class="buttons">
      <button class="btn">Return To Shop</button>
      <button class="btn">Update Cart</button>
    </div>

    <!-- Coupon Section -->
    <div class="coupon-section">
      <input type="text" placeholder="Coupon Code" />
      <button class="btn">Apply Coupon</button>
    </div>

    <!-- Cart Total -->
    <div class="cart-total">
      <h3>Cart Total</h3>
      <div class="summary">
        <p>Subtotal: <span>$1700</span></p>
        <p>Shipping: <span>Free</span></p>
        <p>Total: <span>$1700</span></p>
      </div>
      <button class="btn checkout">Proceed to checkout</button>
    </div>
  </div>
  <Footer />
</template>

<script>
import Footer from '~/components/Footer.vue';

export default {
  name: "CartPage",
};
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: black;
}

.nav a {
  margin: 0 10px;
  color: black;
  text-decoration: none;
  font-size: 16px;
}

.search-cart {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-cart input {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-cart .icons span {
  font-size: 20px;
  cursor: pointer;
}

.breadcrumb {
  margin: 20px 0;
  color: #888;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ff0000;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.cart-table th,
.cart-table td {
  padding: 15px;
  border: 1px solid #fff;
}

.cart-table input[type="number"] {
  width: 60px;
  padding: 5px;
  border: none;
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.coupon-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.coupon-section input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
}

.btn {
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  text-transform: uppercase;
}

.cart-total {
  border: 1px solid #ddd;
  padding: 20px;
  max-width: 300px;
  margin-left: auto;
}

.cart-total h3 {
  margin-bottom: 15px;
}

.cart-total .summary p {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.checkout {
  width: 100%;
  margin-top: 20px;
}
</style>