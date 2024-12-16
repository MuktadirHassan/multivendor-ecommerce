<template>
    <div id="dashboard">
      <!-- Sidebar Navigation -->
      <div id="sidebar">
        <ul>
          <li class="sidebar-red"><span>Manage Users</span></li>
          <li class="sidebar-red"><span>Manage Seller</span></li>
          <li class="sidebar-red"><span>View Orders</span></li>
          <li class="sidebar-red"><span>Manage Products</span></li>
          <li class="sidebar-red"><span>Analytics</span></li>
          <li class="sidebar-red"><span>Payments</span></li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div id="main-content">
        <header>
          <span class="brand">Sundarban</span>
          <div class="profile">
            <span class="role">Anik Hasan.<br />Manager</span>
          </div>
        </header>
  
        <!-- Users Section -->
        <div id="users-section">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th class="header-red">Name</th>
                <th class="header-red">Email</th>
                <th class="header-red">Role</th>
                <th class="header-red">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in 5" :key="row">
                <td class="row-user">User {{ row }}</td>
                <td class="row-light">user{{ row }}@example.com</td>
                <td class="row-light">Admin</td>
                <td class="row-light">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
  
    
      </div>
    </div>
    <Footer/>
  </template>
  
  <script>
import Footer from '~/components/Footer.vue';

  export default {
    name: "AdminDashboard",
  };
  </script>
  
  <style>
  #dashboard {
    display: flex;
    font-family: Arial, sans-serif;
  }
  
  /* Sidebar Styles */
  #sidebar {
    background-color: #f7f7f7;
    width: 20%;
    padding: 20px;
    border-right: 1px solid #ddd;
  }
  #sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  #sidebar li {
    margin: 10px 0;
    font-weight: bold;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }
  #sidebar li:hover {
    border-bottom: 2px solid #3498db;
    color: #3498db;
  }
  #sidebar li span {
    text-decoration: underline;
    color: #333;
    font-size: 14px;
  }
  .sidebar-red {
    background-color: rgba(255, 0, 0, 0.2);
    color: #e74c3c;
    padding: 5px;
    border-radius: 5px;
  }
  .sidebar-red:hover {
    background-color: rgba(255, 0, 0, 0.4);
  }
  
  /* Main Content Styles */
  #main-content {
    width: 80%;
    padding: 20px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .brand {
    font-size: 24px;
    font-weight: bold;
  }
  .profile {
    text-align: right;
  }
  .profile .name {
    font-weight: bold;
  }
  
  /* Users Section Styles */
  #users-section {
    margin-top: 20px;
  }
  #users-section h2 {
    margin-bottom: 10px;
  }
  #users-section table {
    width: 100%;
    border-collapse: collapse;
  }
  #users-section th {
    background-color: #e74c3c;
    color: #fff;
    padding: 10px;
    text-align: left;
    font-weight: bold;
  }
  #users-section td {
    padding: 10px;
    text-align: left;
  }
  .row-user {
    background-color: #ad4470;
    color: #fff;
    font-weight: bold;
    height: 30px;
  }
  .row-light {
    background-color: #ecf0f1;
    color: #2c3e50;
    height: 30px;
  }
  
  /* Additional Features Section */
  #additional-features {
    margin-top: 40px;
  }
  #additional-features h2 {
    margin-bottom: 10px;
  }
  </style>
  