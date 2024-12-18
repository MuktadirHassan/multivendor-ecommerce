<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h4 class="text-red-600 text-xl font-bold">Today's</h4>
        <h2 class="text-3xl font-bold">Flash Sales</h2>
      </div>

      <div class="flex items-center gap-4">
        <template v-for="(unit, index) in timeUnits" :key="unit.label">
          <Card class="bg-gray-50 w-20">
            <template #content>
              <div class="text-center">
                <span class="block text-2xl font-bold text-red-600">{{ unit.value }}</span>
                <span class="text-sm text-gray-500">{{ unit.label }}</span>
              </div>
            </template>
          </Card>
          <span v-if="index < timeUnits.length - 1" class="text-2xl text-red-600">:</span>
        </template>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card v-for="product in products" :key="product.id" class="relative">
        <template #header>
          <Badge v-if="product.discount" :value="`-${product.discount}%`" severity="danger"
            class="absolute top-2 left-2 z-10" />
          <div class="relative w-full h-48 bg-gray-100">
            <Galleria :value="product.images" :showThumbnails="false" :showIndicators="product.images.length > 1"
              :autoPlay="false" class="h-full">
              <template #item="slotProps">
                <img :src="slotProps.item" :alt="product.name" @error="handleImageError"
                  class="w-full h-48 object-cover rounded-t-lg" />
              </template>
              <template #indicator="slotProps">
                <div class="indicator-dot" :class="{ active: slotProps.active }"></div>
              </template>
            </Galleria>
          </div>
        </template>
        <template #content>
          <h3 class="text-sm font-medium mb-1">{{ product.name }}</h3>
          <p v-if="product.description" class="text-xs text-gray-500 mb-2 line-clamp-2">
            {{ product.description }}
          </p>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg font-bold text-red-600">
              ${{ (product.price * (1 - product.discount / 100)).toFixed(2) }}
            </span>
            <del class="text-gray-500">${{ product.price }}</del>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Stock: {{ product.stock }}</span>
            <Rating v-if="product.rating" :modelValue="product.rating" :readonly="true" :cancel="false" />
          </div>
          <Button v-if="product.stock > 0" label="Add To Cart" severity="secondary" class="mt-3 w-full" />
          <Button v-else label="Out of Stock" severity="secondary" disabled class="mt-3 w-full" />
        </template>
      </Card>
    </div>

    <div class="text-center">
      <Button label="View All Products" severity="danger" size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">

const timeUnits = ref([
  { value: '03', label: 'Days' },
  { value: '23', label: 'Hours' },
  { value: '19', label: 'Minutes' },
  { value: '56', label: 'Seconds' }
]);

// update timer every second
onNuxtReady(() => {
  setInterval(() => {
    timeUnits.value = timeUnits.value.map(unit => {
      const value = parseInt(unit.value);
      return { ...unit, value: value > 0 ? (value - 1).toString().padStart(2, '0') : '00' };
    });
  }, 1000);

  const handleImageError = (e: Event) => {

  };
});

// fetch products
const featuredProducts = await useProductService().getFeaturedProducts();
const products = ref(featuredProducts?.data);

</script>

<style scoped>
.indicator-dot {
  @apply w-2 h-2 rounded-full bg-gray-300 mx-1 cursor-pointer;
}

.indicator-dot.active {
  @apply bg-red-600;
}

:deep(.p-galleria) {
  @apply h-full;
}

:deep(.p-galleria-item-wrapper) {
  @apply h-full;
}

:deep(.p-galleria-item-container) {
  @apply h-full;
}

:deep(.p-galleria-item) {
  @apply h-full;
}
</style>