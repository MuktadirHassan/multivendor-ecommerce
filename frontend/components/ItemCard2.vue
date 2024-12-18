<script setup lang="ts">
interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 'ps5',
    title: 'PlayStation 5',
    description: 'Black and White version of the PS5 coming out on sale.',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'womens',
    title: "Women's Collections",
    description: 'Featured woman collections that give you another vibe.',
    image: '/api/placeholder/300/300'
  },
  {
    id: 'speakers',
    title: 'Speakers',
    description: 'Amazon wireless speakers.',
    image: '/api/placeholder/200/200'
  },
  {
    id: 'perfume',
    title: 'Perfume',
    description: 'GUCCI INTENSE OUD EDP.',
    image: '/api/placeholder/200/300'
  }
];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-8">
      <span class="text-red-600 font-semibold">Featured</span>
      <h1 class="text-4xl font-bold text-gray-900 mt-2">New Arrival</h1>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="product in products" :key="product.id"
        class="relative bg-gray-900 text-white shadow-lg hover:shadow-xl transition-shadow">
        <template #header>
          <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover rounded-t-lg" />
        </template>

        <template #title>
          <h2 class="text-xl font-bold mb-2">{{ product.title }}</h2>
        </template>

        <template #content>
          <p class="text-gray-300 mb-4">{{ product.description }}</p>
          <Button label="Shop Now" severity="danger" text class="hover:bg-red-600/10" />
        </template>
      </Card>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.p-card {
  @apply bg-gray-900 border-none;
}

.p-card .p-card-content {
  @apply p-4;
}

.p-card .p-card-header {
  @apply p-0;
}

.p-card .p-card-body {
  @apply p-4;
}

.p-button.p-button-text {
  @apply text-red-500 font-semibold;
}
</style>