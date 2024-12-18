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
    <!-- Wishlist Header -->
    <div class="wishlist-header">
      <h3>Trending</h3>
      <button class="move-to-bag">See All</button>
    </div>

    <!-- Wishlist Grid -->
    <div class="wishlist-grid">
      <div class="product-card" v-for="(product, index) in products" :key="index">
        <!-- Discount Badge -->
        <div class="discount-badge" v-if="product.discount">-{{ product.discount }}%</div>
        <!-- Remove Icon -->
        <div class="remove-icon"><i class="fa fa-trash"></i></div>
        <!-- Product Image -->
        <img :src="product.image" alt="Product Image" />
        <!-- Product Details -->
        <div class="product-details">
          <button class="btn btn-dark w-100 add-to-cart">
            <i class="fa fa-shopping-cart mr-2"></i> Add To Cart
          </button>
          <h4>{{ product.name }}</h4>
          <p>
            <span class="price">${{ product.price }}</span>
            <del v-if="product.oldPrice" class="old-price">${{ product.oldPrice }}</del>
          </p>
        </div>
      </div>
    </div>
  </div>
  <mensFashionPart1 />
  <mensFashionPart2 />
  <Footer />
</template>

<script>
import Footer from '~/components/Footer.vue';
import WomensFashion2 from './womensFashion2.vue';
import WomensFashionPart2 from '~/components/womensFashionPart2.vue';

export default {
  data() {
    return {
      products: [
        {
          name: "T-shirt",
          price: 960,
          oldPrice: 1160,
          discount: 35,
          image: "https://via.placeholder.com/250x250",
        },
        {
          name: "Belt",
          price: 1960,
          image: "https://via.placeholder.com/250x250",
        },
        {
          name: "A.P.C Men's Mahe Necklace-Silver",
          price: 550,
          image: "https://via.placeholder.com/250x250",
        },
        {
          name: "Quilted Satin Jacket",
          price: 750,
          image: "https://via.placeholder.com/250x250",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* General Container */
.wishlist-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.nav-links a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
}

.search-and-icons {
  display: flex;
  align-items: center;
}

.search-bar {
  display: flex;
}

.search-bar input {
  border: 1px solid #ccc;
  border-radius: 20px 0 0 20px;
  padding: 5px 10px;
}

.search-bar button {
  background-color: #333;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 0 20px 20px 0;
  cursor: pointer;
}

.icons {
  margin-left: 20px;
}

.icons i {
  font-size: 18px;
  margin-right: 15px;
  cursor: pointer;
}

/* Wishlist Header */
.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
}

.wishlist-header h3 {
  font-size: 24px;
  margin: 0;
}

.move-to-bag {
  padding: 8px 16px;
  border: 1px solid #333;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

/* Product Grid */
.wishlist-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5%;
}

.product-card {
  width: 23%;
  margin: 1%;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.product-card img {
  width: 100%;
  height: 180px;
  background-color: #f9f9f9;
  object-fit: contain;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4d4f;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
}

.remove-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  color: #ff4d4f;
  cursor: pointer;
}

.product-details {
  padding: 10px 0;
}

.add-to-cart {
  background-color: #070707;
  color: white;
  border: none;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}

.product-details h4 {
  margin: 10px 0;
  font-size: 16px;
}

.price {
  color: #d9534f;
  font-weight: bold;
}

.old-price {
  text-decoration: line-through;
  color: #aaa;
  margin-left: 5px;
}
</style>