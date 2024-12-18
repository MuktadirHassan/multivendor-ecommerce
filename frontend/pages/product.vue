<template>
  <div class="max-w-7xl mx-auto p-4 font-sans">
    <!-- Header -->
    <header class="flex justify-between items-center py-4 border-b">
      <!-- Logo -->
      <h1 class="text-2xl font-bold">Exclusive</h1>

      <!-- Navigation -->
      <nav class="flex space-x-6">
        <a href="#" class="text-gray-600 hover:text-black">Home</a>
        <a href="#" class="text-gray-600 hover:text-black">Contact</a>
        <a href="#" class="text-gray-600 hover:text-black">About</a>
        <a href="#" class="text-gray-600 hover:text-black">Sign Up</a>
      </nav>

      <!-- Search Bar and Icons -->
      <div class="flex items-center space-x-4">
        <!-- Search Input -->
        <div class="relative">
          <input type="text" placeholder="What are you looking for?" class="border rounded px-3 py-1 pl-10 w-64" />
          <i class="fa fa-search text-gray-500 absolute left-3 top-2.5"></i>
        </div>

        <!-- Icons -->
        <i class="fa fa-heart text-gray-600 hover:text-black cursor-pointer"></i>
        <i class="fa fa-shopping-cart text-gray-600 hover:text-black cursor-pointer"></i>
        <i class="fa fa-user text-gray-600 hover:text-black cursor-pointer"></i>
      </div>
    </header>

    <!-- Breadcrumbs -->
    <div class="my-4 text-gray-500 text-sm">
      Account / Gaming / <span class="font-semibold text-gray-800">Havic HV G-92 Gamepad</span>
    </div>

    <!-- Product Section -->
    <div class="flex space-x-10">
      <!-- Image Gallery -->
      <div class="flex space-x-4">
        <!-- Left Side Thumbnails -->
        <div class="flex flex-col space-y-4">
          <img v-for="(image, index) in thumbnails" :key="index" :src="image" alt="Thumbnail"
            class="w-20 h-20 border rounded cursor-pointer" />
        </div>

        <!-- Main Product Image -->
        <div>
          <img src="https://via.placeholder.com/400x400" alt="Main Product" class="w-96 h-96 border rounded" />
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Havic HV G-92 Gamepad</h2>
        <div class="flex items-center space-x-2">
          <span class="text-yellow-500 text-lg">★★★★★</span>
          <span class="text-gray-500">(150 Reviews)</span>
          <span class="text-green-500 font-semibold">In Stock</span>
        </div>
        <p class="text-2xl font-bold">$192.00</p>
        <p class="text-gray-600 text-sm">
          PlayStation 5 Controller Skin: High quality vinyl with air channel adhesive for easy
          bubble-free install & mess-free removal. Pressure-sensitive.
        </p>

        <!-- Colors -->
        <div class="flex items-center space-x-2">
          <span>Colours:</span>
          <div class="w-6 h-6 bg-gray-300 border rounded cursor-pointer"></div>
          <div class="w-6 h-6 bg-red-500 border rounded cursor-pointer"></div>
        </div>

        <!-- Size Selector -->
        <div class="flex items-center space-x-2">
          <span>Size:</span>
          <button v-for="size in sizes" :key="size" :class="[
            'px-3 py-1 border rounded cursor-pointer',
            selectedSize === size ? 'border-black' : 'border-gray-300'
          ]" @click="selectedSize = size">
            {{ size }}
          </button>
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center space-x-4">
          <input type="number" min="1" v-model="quantity" class="border w-16 rounded px-2 py-1" />
          <button class="bg-red-500 text-white px-6 py-2 rounded">Buy Now</button>
        </div>

        <!-- Delivery Information (Box Design) -->
        <div class="space-y-4 border-t pt-4">
          <div class="p-4 border rounded flex items-center space-x-2">
            <i class="fa fa-truck text-gray-500"></i>
            <span class="text-sm text-gray-600">
              <strong>Free Delivery:</strong> Enter your postal code for Delivery Availability
            </span>
          </div>
          <div class="p-4 border rounded flex items-center space-x-2">
            <i class="fa fa-undo text-gray-500"></i>
            <span class="text-sm text-gray-600">
              <strong>Return Delivery:</strong> Free 30 Days Delivery Returns.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ProductPart1 />
  <Footer />
</template>

<script>

export default {
  name: "ProductPage",
  data() {
    return {
      sizes: ["XS", "S", "M", "L", "XL"],
      selectedSize: "M",
      quantity: 1,
      thumbnails: [
        "https://via.placeholder.com/100x100", // Left-side Thumbnail 1
        "https://via.placeholder.com/100x100", // Left-side Thumbnail 2
        "https://via.placeholder.com/100x100", // Left-side Thumbnail 3
        "https://via.placeholder.com/100x100", // Left-side Thumbnail 4
      ],
    };
  },
};
</script>

<style>
/* Add custom styling here if needed */
</style>
