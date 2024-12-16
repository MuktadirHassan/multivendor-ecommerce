<template>
    <div class="new-arrival">
      <div class="header">
        <span class="featured">Featured</span>
        <h1>New Arrival</h1>
      </div>
  
      <div class="grid">
        <div class="item ps5">
          <img src="https://via.placeholder.com/400x300" alt="PlayStation 5" />
          <h2>PlayStation 5</h2>
          <p>Black and White version of the PS5 coming out on sale.</p>
          <a href="#" class="shop-now">Shop Now</a>
        </div>
  
        <div class="item womens-collections">
          <img src="https://via.placeholder.com/300x300" alt="Women's Collections" />
          <h2>Women's Collections</h2>
          <p>Featured woman collections that give you another vibe.</p>
          <a href="#" class="shop-now">Shop Now</a>
        </div>
  
        <div class="item speakers">
          <img src="https://via.placeholder.com/200x200" alt="Speakers" />
          <h2>Speakers</h2>
          <p>Amazon wireless speakers.</p>
          <a href="#" class="shop-now">Shop Now</a>
        </div>
  
        <div class="item perfume">
          <img src="https://via.placeholder.com/200x300" alt="Perfume" />
          <h2>Perfume</h2>
          <p>GUCCI INTENSE OUD EDP.</p>
          <a href="#" class="shop-now">Shop Now</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NewArrival',
  };
  </script>
  
  <style scoped>
  .new-arrival {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  .header {
    text-align: left;
    margin-bottom: 20px;
  }
  
  .featured {
    color: red;
    font-weight: bold;
    display: block;
  }
  
  h1 {
    font-size: 2rem;
    margin: 0;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .item {
    background: #000;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .item img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 10px 0;
  }
  
  p {
    font-size: 1rem;
    margin: 10px 0;
  }
  
  .shop-now {
    color: red;
    text-decoration: none;
    font-weight: bold;
  }
  
  .shop-now:hover {
    text-decoration: underline;
  }
  </style>
  