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
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    handleSubmit() {
      alert(`Logged in with Email: ${this.email}`);
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
</style>
