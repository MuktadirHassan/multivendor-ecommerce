<template>
    <div class="max-w-7xl mx-auto font-sans">
        <header class="flex justify-between items-center py-4 border-b">
            <!-- Logo -->
            <h5 class="text-2xl font-bold">
                <span class="text-gray-900">Sundarban</span>
            </h5>

            <!-- Navigation -->
            <nav class="flex space-x-6">
                <a v-for="item in menuItems" :key="item.label" :href="item.link"
                    class="text-gray-700 hover:text-black transition-colors duration-200">
                    {{ item.label }}
                </a>
            </nav>

            <!-- Search Bar and Icons -->
            <div class="flex items-center space-x-4">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQuery" placeholder="What are you looking for?"
                        class="p-inputtext-sm w-64 border rounded" />
                </span>

                <div class="flex space-x-4">
                    <Button v-for="(icon, index) in icons" :key="index" :icon="icon"
                        class="p-button-text p-button-rounded text-gray-600 hover:text-black"
                        @click="handleIconClick(index)" />
                </div>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const menuItems = [
    { label: 'Home', link: '#' },
    { label: 'Contact', link: '#' },
    { label: 'About', link: '#' },
    { label: 'Sign Up', link: '#' }
]

const icons = ['pi pi-heart', 'pi pi-shopping-cart', 'pi pi-user']

const handleIconClick = (index: number) => {
    switch (index) {
        case 0:
            console.log('Wishlist clicked')
            break
        case 1:
            console.log('Cart clicked')
            break
        case 2:
            console.log('Profile clicked')
            break
    }
}
</script>

<style scoped>
:deep(.p-inputtext) {
    @apply py-1 px-4 text-sm text-gray-600;
}

:deep(.p-inputtext:focus) {
    @apply shadow-sm outline-none border-gray-400;
}

:deep(.p-button-text) {
    @apply p-2;
}

:deep(.p-button-text:focus) {
    @apply shadow-none;
}
</style>