<template>
  <div class="container">
    <div class="logo">Sundarban</div>
    <div class="form-container">
      <h2>Sign in</h2>
      <form @submit.prevent="handleSubmit">
        <input type="email" v-model="email" placeholder="Email or Phone Number" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="btn">Login</button>
      </form>
      <a href="#">Forgot Password?</a>
    </div>
    <footer class="footer">
      <div class="footer-section">
        <div>
          <h4>Sundarban</h4>
          <p>Subscribe</p>
          <div>
            <input type="email" placeholder="Enter your email" v-model="subscribeEmail" />
            <button @click="handleSubscribe">Submit</button>
          </div>
        </div>
        <div>
          <h4>Support</h4>
          <p>11 Biggyan saroni, Dhaka, Bangladesh</p>
          <p>Email: support@sundarban.com</p>
          <p>Phone: +880123456789</p>
        </div>
        <div>
          <h4>Account</h4>
          <a href="#">My Account</a>
          <a href="#">Login / Register</a>
          <a href="#">Cart</a>
          <a href="#">Wishlist</a>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>
        <div>
          <h4>Download App</h4>
          <img src="https://via.placeholder.com/100" alt="QR Code" />
        </div>
      </div>
      <p style="text-align: center; margin-top: 20px;">
        &copy; Copyright Sundarban 2024. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      subscribeEmail: '',
    };
  },
  methods: {
    handleSubmit() {
      alert(`Logged in with Email: ${this.email}`);
    },
    handleSubscribe() {
      alert(`Subscribed with Email: ${this.subscribeEmail}`);
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}
.logo {
  font-size: 24px;
  margin-bottom: 20px;
}
.form-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 300px;
  text-align: center;
}
.form-container h2 {
  margin-bottom: 20px;
  font-size: 20px;
}
.form-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.form-container .btn {
  width: 100%;
  padding: 10px;
  background: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.form-container .btn:hover {
  background: #e63939;
}
.form-container a {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #ff4d4d;
  text-decoration: none;
}
.footer {
  background: #222;
  color: #fff;
  padding: 20px;
  font-size: 14px;
}
.footer .footer-section {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.footer .footer-section div {
  margin: 10px;
}
.footer .footer-section h4 {
  margin-bottom: 10px;
  font-size: 16px;
}
.footer .footer-section a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}
.footer .footer-section a:hover {
  text-decoration: underline;
}
.footer .footer-section input {
  width: 80%;
  padding: 8px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
}
.footer .footer-section button {
  padding: 8px;
  background: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
