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

    <main class="content">
      <aside class="sidebar">
        <p>Manage My Account</p>
        <ul>
          <li><a href="#" class="active">My Profile</a></li>
          <li><a href="#">Address Book</a></li>
          <li><a href="#">My Payment Options</a></li>
        </ul>
        <p>My Orders</p>
        <ul>
          <li><a href="#">My Returns</a></li>
          <li><a href="#">My Cancellations</a></li>
        </ul>
        <p>My Wishlist</p>
      </aside>

      <section class="profile-content">
        <div class="profile-text">
          <p class="breadcrumb">Home / My Account</p>
          <div class="welcome">Welcome! <span class="highlight">Puja Barman</span></div>
        </div>

        <!-- Updated Red Box Section -->
        <div class="form-container">
          <h2>Edit Your Profile</h2>
          <form>
            <div class="form-group">
              <div class="form-field">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" value="Md" />
              </div>
              <div class="form-field">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" value="Rimel" />
              </div>
            </div>
            <div class="form-group">
              <div class="form-field">
                <label for="email">Email</label>
                <input type="email" id="email" value="rimel1111@gmail.com" />
              </div>
              <div class="form-field">
                <label for="address">Address</label>
                <input type="text" id="address" value="Kingston, 5236, United State" />
              </div>
            </div>
            <h3>Password Changes</h3>
            <div class="form-group">
              <div class="form-field">
                <label for="current-password">Current Password</label>
                <input type="password" id="current-password" />
              </div>
              <div class="form-field">
                <label for="new-password">New Password</label>
                <input type="password" id="new-password" />
              </div>
              <div class="form-field">
                <label for="confirm-password">Confirm New Password</label>
                <input type="password" id="confirm-password" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn">Cancel</button>
              <button type="submit" class="save-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
  <Footer />
</template>

<script>
import Footer from '~/components/Footer.vue';

export default {
  name: "AccountPage",
};
</script>

<style scoped>
/* General Styling */
.container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.brand {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding-bottom: 2px;
  font-weight: 500;
}

.nav-links a.active {
  border-bottom: 2px solid #000;
}

.search-cart {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-cart i {
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.profile-icon {
  width: 30px;
  height: 30px;
  background-color: red;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
}

/* Main Content */
.content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

/* Sidebar */
.sidebar {
  width: 20%;
  background-color: #f9f9f9;
  padding: 20px;
}

.sidebar p {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.sidebar ul li a.active {
  color: red;
  font-weight: bold;
}

/* Top Header */
.top-header {
  background-color: #ff8a8a;
  /* Top header bar */
  height: 20px;
}

/* Profile Content */
.profile-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.profile-text {
  width: 20%;
}

.breadcrumb {
  font-size: 14px;
  color: #888;
}

.welcome {
  font-size: 16px;
  margin: 10px 0;
}

.welcome .highlight {
  color: red;
}

/* Form Container */
.form-container {
  width: 80%;
  /* Increased size of the box */
  background-color: #d32f2f;
  /* Updated red color to match */
  padding: 40px;
  /* Increased padding */
  border-radius: 8px;
  color: white;
}

.form-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-field {
  flex: 1;
}

.form-field label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.form-field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.cancel-btn {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.save-btn {
  background-color: white;
  color: #d32f2f;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>