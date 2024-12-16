<template>
    <div class="container mx-auto px-4 py-6">
      <!-- Categories Section -->
      <section class="mb-8">
        <h2 class="text-red-500 font-bold mb-3 flex items-center">
          <span class="inline-block w-2 h-6 bg-red-500 mr-2"></span>
          Categories
        </h2>
        <h3 class="text-2xl font-semibold mb-6">Browse By Category</h3>
        <div class="grid grid-cols-6 gap-4">
          <div v-for="(category, index) in categories" :key="index" class="text-center">
            <div
              :class="['rounded-lg p-4 border cursor-pointer', selectedCategory === index ? 'bg-red-500 text-white' : 'bg-gray-100']"
              @click="selectedCategory = index">
              <img :src="category.icon" alt="category.name" class="mx-auto mb-2 w-8 h-8" />
              <p>{{ category.name }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Best Selling Products -->
      <section>
        <h2 class="text-red-500 font-bold mb-3 flex items-center">
          <span class="inline-block w-2 h-6 bg-red-500 mr-2"></span>
          This Month
        </h2>
        <div class="flex justify-between mb-6">
          <h3 class="text-2xl font-semibold">Best Selling Products</h3>
          <button class="bg-red-500 text-white px-4 py-2 rounded">View All</button>
        </div>
        <div class="grid grid-cols-4 gap-6">
          <div v-for="(product, index) in bestSellingProducts" :key="index"
            class="text-center border p-4 rounded-lg relative">
            <!-- Heart and Eye Icons -->
            <button class="absolute top-2 right-8 bg-red-500 text-white p-1 rounded-full">♥</button>
            <button class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">👀</button>
  
            <!-- Product Image -->
            <img :src="product.image" alt="product.name" class="mx-auto mb-4 w-28 h-28" />
  
            <!-- Product Details -->
            <h4 class="font-semibold mb-2">{{ product.name }}</h4>
            <p>
              <span class="text-red-500 font-bold mr-2">${{ product.discountPrice }}</span>
              <span class="line-through text-gray-400">${{ product.originalPrice }}</span>
            </p>
            <div class="flex justify-center mt-2">
              <span v-for="n in 5" :key="n" class="text-yellow-500">&#9733;</span>
              <span class="text-gray-500 ml-2">(65)</span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Products Section -->
      <section class="mt-10">
        <h2 class="text-red-500 font-bold mb-3 flex items-center">
          <span class="inline-block w-2 h-6 bg-red-500 mr-2"></span>
          Our Products
        </h2>
        <h3 class="text-2xl font-semibold mb-6">Explore Our Products</h3>
        <div class="grid grid-cols-4 gap-6">
          <div v-for="(product, index) in products" :key="index" class="text-center border p-4 rounded-lg relative">
            <!-- Heart and Eye Icons -->
            <button class="absolute top-2 right-8 bg-red-500 text-white p-1 rounded-full">♥</button>
            <button class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">👁</button>
  
            <!-- Product Image -->
            <img :src="product.image" alt="product.name" class="mx-auto mb-4 w-28 h-28" />
  
            <!-- Product Details -->
            <h4 class="font-semibold mb-2">{{ product.name }}</h4>
            <p>
              <span class="text-red-500 font-bold mr-2">${{ product.discountPrice }}</span>
              <span class="line-through text-gray-400">${{ product.originalPrice }}</span>
            </p>
            <div class="flex justify-center items-center mt-2">
              <span v-for="n in product.rating" :key="n" class="text-yellow-500">&#9733;</span>
              <span v-for="n in 5 - product.rating" :key="'empty' + n" class="text-gray-300">&#9733;</span>
              <span class="text-gray-500 ml-2">({{ product.reviews }})</span>
            </div>
  
            <!-- Special Badges -->
            <span v-if="product.new"
              class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">NEW</span>
            <button v-if="product.showCart" class="bg-black text-white mt-4 px-4 py-2 rounded">Add To Cart</button>
          </div>
        </div>
        <div class="text-center mt-8">
          <button class="bg-red-500 text-white px-6 py-2 rounded">View All Products</button>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedCategory: 3, // 'Camera' is initially selected
        categories: [
          { name: "Phones", icon: "https://via.placeholder.com/50" },
          { name: "Computers", icon: "https://via.placeholder.com/50" },
          { name: "SmartWatch", icon: "https://via.placeholder.com/50" },
          { name: "Camera", icon: "https://via.placeholder.com/50" },
          { name: "HeadPhones", icon: "https://via.placeholder.com/50" },
          { name: "Gaming", icon: "https://via.placeholder.com/50" },
        ],
        bestSellingProducts: [
          {
            name: "The north coat",
            image: "https://via.placeholder.com/150",
            discountPrice: 260,
            originalPrice: 360,
          },
          {
            name: "Gucci duffle bag",
            image: "https://via.placeholder.com/150",
            discountPrice: 960,
            originalPrice: 1160,
          },
          {
            name: "RGB liquid CPU Cooler",
            image: "https://via.placeholder.com/150",
            discountPrice: 160,
            originalPrice: 170,
          },
          {
            name: "Small BookSelf",
            image: "https://via.placeholder.com/150",
            discountPrice: 360,
            originalPrice: 380,
          },
        ],
        products: [
          {
            name: "Breed Dry Dog Food",
            image: "https://via.placeholder.com/150",
            discountPrice: 100,
            originalPrice: 120,
            rating: 2,
            reviews: 35,
            new: false,
            showCart: false,
          },
          {
            name: "CANON EOS DSLR Camera",
            image: "https://via.placeholder.com/150",
            discountPrice: 360,
            originalPrice: 500,
            rating: 4,
            reviews: 95,
            new: false,
            showCart: true,
          },
          {
            name: "ASUS FHD Gaming Laptop",
            image: "https://via.placeholder.com/150",
            discountPrice: 700,
            originalPrice: 850,
            rating: 5,
            reviews: 325,
            new: false,
            showCart: false,
          },
          {
            name: "Curology Product Set",
            image: "https://via.placeholder.com/150",
            discountPrice: 500,
            originalPrice: 600,
            rating: 4,
            reviews: 145,
            new: false,
            showCart: false,
          },
          {
            name: "Kids Electric Car",
            image: "https://via.placeholder.com/150",
            discountPrice: 960,
            originalPrice: 1100,
            rating: 5,
            reviews: 65,
            new: true,
            showCart: false,
          },
          {
            name: "Jr. Zoom Soccer Cleats",
            image: "https://via.placeholder.com/150",
            discountPrice: 1160,
            originalPrice: 1400,
            rating: 4,
            reviews: 35,
            new: true,
            showCart: false,
          },
          {
            name: "GP11 Shooter USB Gamepad",
            image: "https://via.placeholder.com/150",
            discountPrice: 660,
            originalPrice: 750,
            rating: 4,
            reviews: 55,
            new: true,
            showCart: false,
          },
          {
            name: "Quilted Satin Jacket",
            image: "https://via.placeholder.com/150",
            discountPrice: 660,
            originalPrice: 800,
            rating: 4,
            reviews: 55,
            new: false,
            showCart: false,
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  button {
    outline: none;
    transition: all 0.3s;
  }
  
  button:hover {
    opacity: 0.8;
  }
  </style>