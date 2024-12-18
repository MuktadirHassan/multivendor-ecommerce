<template>
    <main class="flex max-w-7xl mx-auto">
        <!-- Sidebar Navigation -->
        <aside class="w-1/5 bg-gray-100 p-4">
            <Menu :model="menuItems" class="bg-transparent border-none" />
        </aside>

        <!-- Banner Section -->
        <section class="w-4/5 p-4">
            <Card class="relative overflow-hidden border-none bg-black">
                <template #content>
                    <Image src="https://via.placeholder.com/1200x400" alt="Promotional Banner" class="w-full" preview />
                    <div class="absolute inset-0 flex flex-col justify-center text-white px-8">
                        <h2 class="text-4xl font-bold mb-4">Up to 10% off Voucher</h2>
                        <Button label="Shop Now →" class="p-button-text p-button-rounded text-white hover:underline"
                            @click="handleShopNow" />
                    </div>
                </template>
            </Card>
        </section>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuItems = ref([
    { label: 'Electronics', command: () => navigateToCategory('electronics') },
    { label: 'Clothing', command: () => navigateToCategory('clothing') },
    { label: 'Shoes', command: () => navigateToCategory('shoes') },
    { label: 'Books', command: () => navigateToCategory('books') },
    { label: 'Furniture', command: () => navigateToCategory('furniture') },
    { label: 'Toys', command: () => navigateToCategory('toys') },
    { label: 'Accessories', command: () => navigateToCategory('accessories') },
    { label: 'Sports', command: () => navigateToCategory('sports') },
    { label: 'Beauty', command: () => navigateToCategory('beauty') },
    { label: 'Health', command: () => navigateToCategory('health') }
])

const navigateToCategory = (category: string) => {
    console.log(`Navigating to ${category}`)
}

const handleShopNow = () => {
    console.log('Shop now clicked')
}
</script>

<style scoped>
:deep(.p-menu) {
    @apply bg-transparent;
}

:deep(.p-menu .p-menuitem-link) {
    @apply px-2 py-2 text-gray-700 hover:text-red-500 transition-colors;
}

:deep(.p-menu .p-menuitem-link:focus) {
    @apply shadow-none;
}

:deep(.p-button-text) {
    @apply border-0 bg-transparent;
}
</style>