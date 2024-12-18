<template>
    <div class="flex gap-2">
        <Button :label="label" :icon="cart ? 'pi pi-shopping-cart' : ''" @click="addToCart" :disabled="!inStock"
            :class="{ 'p-button-success': !cart, 'p-button-secondary': cart }" />
        <Toast />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '~/store/useCartStore';

const props = defineProps<{
    product: {
        id: number
        name: string
        price: number
        stock: number
        image?: string
    }
}>()

const cart = useCartStore()
const toast = useToast()

const inStock = computed(() => props.product.stock > 0)
const label = computed(() => inStock.value ? 'Add to Cart' : 'Out of Stock')

const addToCart = () => {
    try {
        cart.addItem(props.product)
        toast.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${props.product.name} added to cart`,
            life: 3000
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: (error as Error).message,
            life: 3000
        })
    }
}
</script>