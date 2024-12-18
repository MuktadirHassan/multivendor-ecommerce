<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Search Bar Section -->
        <div class="mb-8">
            <div class="flex gap-4 mb-4">
                <span class="p-input-icon-left flex-1">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQuery" placeholder="Search products..." class="w-full"
                        @keyup.enter="handleSearch" />
                </span>
                <div class="flex items-center gap-2">
                    <label class="text-sm">AI Search</label>
                    <InputSwitch v-model="useAiSearch" @update:modelValue="handleSearch" />
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
            <ProgressSpinner />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <Message severity="error">{{ error }}</Message>
        </div>

        <!-- Results Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card v-for="product in products" :key="product.id" class="h-full">
                <template #header>
                    <img :src="product.images[0] || '/placeholder-product.png'" :alt="product.name"
                        class="w-full h-48 object-cover" />
                </template>
                <template #title>
                    {{ product.name }}
                </template>
                <template #content>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-lg font-bold">${{ product.price.toFixed(2) }}</span>
                        <div class="flex items-center">
                            <Rating :modelValue="product.rating" :readonly="true" :cancel="false" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- No Results State -->
        <div v-if="!loading && products.length === 0" class="text-center py-8">
            <Message severity="info">No products found</Message>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductService } from '~/composables/useProductService'
import type { Product } from '~/types/product'

const productService = useProductService()

const searchQuery = ref('')
const useAiSearch = ref(false)
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        products.value = []
        return
    }

    loading.value = true
    error.value = null

    try {
        if (useAiSearch.value) {
            const response = await productService.getAiSearch(searchQuery.value)
            products.value = response?.data || []
        } else {
            const response = await productService.searchProducts(searchQuery.value)
            products.value = response?.data || []
        }
    } catch (err) {
        error.value = 'Failed to fetch products. Please try again.'
        console.error('Search error:', err)
    } finally {
        loading.value = false
    }
}

// Debounce search
const debouncedSearch = useDebounceFn(handleSearch, 1000)

watch(searchQuery, () => {
    debouncedSearch()
})
</script>