<template>
  <div class="font-sans bg-gray-50">
    <!-- Header Section -->
    <header class="flex justify-between items-center px-6 py-4 border-b shadow">
      <div class="text-2xl font-bold">Sundarban</div>
      <nav class="space-x-6 hidden md:flex">
        <a href="#" class="text-gray-700 hover:underline">Home</a>
        <a href="#" class="text-gray-700 hover:underline">Contact</a>
        <a href="#" class="text-gray-700 hover:underline">About</a>
        <a href="#" class="text-gray-700 hover:underline">Sign Up</a>
        <a href="#" class="text-gray-700 hover:underline">AI Suggestions</a>
      </nav>
      <div class="flex space-x-4 items-center">
        <input type="text" placeholder="What are you looking for?" class="border rounded px-3 py-1" />
        <button>❤️</button>
        <button>🛒</button>
      </div>
    </header>

    <!-- Main Section -->
    <main>
      <div class="flex">
        <!-- Sidebar Navigation -->
        <aside class="w-1/5 bg-gray-100 p-4 space-y-4">
          <a v-for="(item, index) in sidebarItems" :key="index" href="#" class="block hover:text-red-500 text-gray-700">
            {{ item }}
          </a>
        </aside>

        <!-- Banner Section -->
        <section class="w-4/5 p-4 relative">
          <div class="relative bg-black rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/1200x400" alt="Promotional Banner" class="w-full" />
            <div class="absolute inset-0 flex flex-col justify-center text-white px-8">
              <h2 class="text-4xl font-bold mb-4">Up to 10% off Voucher</h2>
              <a href="#" class="inline-block px-4 py-2 rounded hover:underline">Shop Now →</a>
            </div>
          </div>
        </section>
      </div>

      <!-- Flash Sales Section -->
      <div class="bg-gray-50 p-6">
        <!-- Header Section with Timer -->
        <div class="flex justify-between items-center mb-8">
          <!-- Title Section -->
          <div>
            <h2 class="text-red-500 font-bold text-lg uppercase">Today's</h2>
            <h1 class="text-5xl font-bold text-black leading-tight">Flash Sales</h1>
          </div>

          <!-- Timer Section -->
          <div class="flex gap-3 text-gray-800">
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

        <!-- Product Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(product, index) in products" :key="index" class="bg-white p-4 rounded-lg shadow-md">
            <div class="relative">
              <img :src="product.image" alt="product" class="w-full h-40 object-cover rounded-lg" />
              <span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{{ product.discount }}%
              </span>
              <div class="absolute top-2 right-2 flex gap-2">
                <button class="bg-red-100 p-2 rounded-full">
                  <i class="fas fa-heart text-red-500"></i>
                </button>
                <button class="bg-red-100 p-2 rounded-full">
                  <i class="fas fa-eye text-red-500"></i>
                </button>
              </div>
            </div>
            <h3 class="text-lg font-bold mt-4">{{ product.name }}</h3>
            <div class="flex items-center justify-between mt-2">
              <div>
                <span class="text-red-500 font-bold text-xl">
                  ${{ product.price }}</span>
                <span class="line-through text-gray-500 text-sm ml-2">
                  ${{ product.originalPrice }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400" v-for="star in 5" :key="star"></i>
                <span class="text-gray-600 text-sm ml-1">({{ product.reviews }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <button class="bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
            View All Products
          </button>
        </div>
      </div>
    </main>
  </div>
  <ItemCard />
  <Footer />
</template>

<script>
export default {
  data() {
    return {
      sidebarItems: [
        "Woman's Fashion",
        "Men's Fashion",
        "Electronics",
        "Home & Lifestyle",
        "Medicine",
        "Sports & Outdoor",
        "Baby's & Toys",
        "Groceries & Pets",
        "Health & Beauty",
      ],
      products: [
        {
          name: "HAVIT HV-G92 Gamepad",
          price: 120,
          originalPrice: 160,
          discount: 40,
          reviews: 88,
          image: "/images/gamepad.jpg",
        },
        {
          name: "AK-900 Wired Keyboard",
          price: 960,
          originalPrice: 1160,
          discount: 35,
          reviews: 75,
          image: "https://via.placeholder.com/150",
        },
        {
          name: "IPS LCD Gaming Monitor",
          price: 370,
          originalPrice: 400,
          discount: 30,
          reviews: 99,
          image: "https://via.placeholder.com/150",
        },
        {
          name: "S-Series Comfort Chair",
          price: 375,
          originalPrice: 400,
          discount: 25,
          reviews: 99,
          image: "https://via.placeholder.com/150",
        },
      ],
    };
  },
};
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

input {
  transition: box-shadow 0.3s;
}

input:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  outline: none;
}

button {
  cursor: pointer;
  font-size: 1.25rem;
}

a {
  transition: color 0.3s;
}

a:hover {
  color: red;
}

/* Timer Styles */
.timer-box {
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 60px;
}

.timer-value {
  display: block;
  font-size: 24px;
  color: #ff4d4f;
  font-weight: bold;
}

.timer-label {
  font-size: 12px;
  color: #888;
}

.dots {
  font-size: 28px;
  color: #ff4d4f;
  line-height: 1;
  margin: 0 5px;
}
</style>