<script setup lang="ts">
interface Category {
  name: string;
  icon: string;
}

interface Product {
  name: string;
  image: string;
  discountPrice: number;
  originalPrice: number;
  rating?: number;
  reviews?: number;
  new?: boolean;
  showCart?: boolean;
}

const selectedCategory = ref(3);

const categories: Category[] = [
  { name: "Phones", icon: "/api/placeholder/50/50" },
  { name: "Computers", icon: "/api/placeholder/50/50" },
  { name: "SmartWatch", icon: "/api/placeholder/50/50" },
  { name: "Camera", icon: "/api/placeholder/50/50" },
  { name: "HeadPhones", icon: "/api/placeholder/50/50" },
  { name: "Gaming", icon: "/api/placeholder/50/50" },
];

const bestSellingProducts: Product[] = [
  {
    name: "The north coat",
    image: "/api/placeholder/150/150",
    discountPrice: 260,
    originalPrice: 360,
  },
  {
    name: "Gucci duffle bag",
    image: "/api/placeholder/150/150",
    discountPrice: 960,
    originalPrice: 1160,
  },
  {
    name: "RGB liquid CPU Cooler",
    image: "/api/placeholder/150/150",
    discountPrice: 160,
    originalPrice: 170,
  },
  {
    name: "Small BookSelf",
    image: "/api/placeholder/150/150",
    discountPrice: 360,
    originalPrice: 380,
  },
];

const products: Product[] = [
  {
    name: "Breed Dry Dog Food",
    image: "/api/placeholder/150/150",
    discountPrice: 100,
    originalPrice: 120,
    rating: 2,
    reviews: 35,
    new: false,
    showCart: false,
  },
  // ... rest of the products array
];
</script>

<template>
  <div class="container max-w-7xl mx-auto px-4 py-6">
    <!-- Categories Section -->
    <section class="mb-8">
      <SectionHeader title="Categories" subtitle="Browse By Category" />
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Button v-for="(category, index) in categories" :key="index" :class="['p-button-text flex flex-col items-center p-4',
          selectedCategory === index ? 'p-button-danger' : '']" @click="selectedCategory = index">
          <img :src="category.icon" :alt="category.name" class="mb-2 w-8 h-8" />
          <span>{{ category.name }}</span>
        </Button>
      </div>
    </section>

    <!-- Best Selling Products -->
    <section class="mb-8">
      <SectionHeader title="This Month" subtitle="Best Selling Products">
        <template #action>
          <Button label="View All" severity="danger" />
        </template>
      </SectionHeader>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card v-for="(product, index) in bestSellingProducts" :key="index" class="relative">
          <template #header>
            <div class="relative">
              <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover" />
              <div class="absolute top-2 right-2 flex gap-2">
                <Button icon="pi pi-heart" rounded severity="danger" text />
                <Button icon="pi pi-eye" rounded severity="danger" text />
              </div>
            </div>
          </template>

          <template #content>
            <h4 class="font-semibold mb-2">{{ product.name }}</h4>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-red-500 font-bold">${{ product.discountPrice }}</span>
                <span class="line-through text-gray-400 ml-2">${{ product.originalPrice }}</span>
              </div>
              <Rating :modelValue="5" readonly :cancel="false" />
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- Products Section -->
    <section>
      <SectionHeader title="Our Products" subtitle="Explore Our Products" />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card v-for="(product, index) in products" :key="index" class="relative">
          <template #header>
            <div class="relative">
              <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover" />
              <Badge v-if="product.new" severity="success" class="absolute top-2 left-2">
                NEW
              </Badge>
              <div class="absolute top-2 right-2 flex gap-2">
                <Button icon="pi pi-heart" rounded severity="danger" text />
                <Button icon="pi pi-eye" rounded severity="danger" text />
              </div>
            </div>
          </template>

          <template #content>
            <h4 class="font-semibold mb-2">{{ product.name }}</h4>
            <div class="mb-2">
              <span class="text-red-500 font-bold">${{ product.discountPrice }}</span>
              <span class="line-through text-gray-400 ml-2">${{ product.originalPrice }}</span>
            </div>
            <div class="flex justify-between items-center">
              <Rating :modelValue="product.rating" readonly :cancel="false" />
              <span class="text-gray-500">({{ product.reviews }})</span>
            </div>
            <Button v-if="product.showCart" label="Add To Cart" severity="danger" class="w-full mt-4" />
          </template>
        </Card>
      </div>

      <div class="text-center mt-8">
        <Button label="View All Products" severity="danger" size="large" />
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.p-card {
  @apply hover:shadow-lg transition-shadow;
}

.p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
  @apply text-yellow-500;
}

.p-button.p-button-text:not(.p-button-danger) {
  @apply text-gray-700 hover:bg-gray-100;
}

.p-button.p-button-danger.p-button-text:hover {
  @apply bg-red-100;
}
</style>