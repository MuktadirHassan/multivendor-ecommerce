<template>
  <div class="max-w-6xl mx-auto p-4 font-sans">
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


    <!-- Main Section -->
    <main class="flex">
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
            <!-- Shop Now button without background color -->
            <a href="#" class="inline-block px-4 py-2 rounded hover:underline">Shop Now →</a>
          </div>
        </div>
      </section>
    </main>
  </div>
  <ItemCard />
  <ItemCard1 />
  <ItemCard2 />
  <Footer />
</template>

<script setup lang="ts">


const sidebarItems = [
  'Electronics',
  'Clothing',
  'Shoes',
  'Books',
  'Furniture',
  'Toys',
  'Accessories',
  'Sports',
  'Beauty',
  'Health',
];



</script>

<style scoped>
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
</style>