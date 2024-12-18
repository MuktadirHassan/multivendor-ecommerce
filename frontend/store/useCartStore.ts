// stores/useCartStore.ts
import { defineStore } from "pinia";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    formattedTotal: (state) => {
      const total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total);
    },
  },

  actions: {
    initializeFromStorage() {
      if (process.client) {
        const stored = localStorage.getItem("cart");
        if (stored) {
          this.items = JSON.parse(stored);
        }
      }
    },

    addItem(product: {
      id: number;
      name: string;
      price: number;
      image?: string;
      stock: number;
    }) {
      const existingItem = this.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
        } else {
          throw new Error("Not enough stock");
        }
      } else {
        this.items.push({
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          stock: product.stock,
        });
      }

      this.saveToStorage();
    },

    removeItem(itemId: number) {
      const index = this.items.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveToStorage();
      }
    },

    updateQuantity(itemId: number, quantity: number) {
      const item = this.items.find((item) => item.id === itemId);
      if (item) {
        if (quantity <= item.stock && quantity > 0) {
          item.quantity = quantity;
          this.saveToStorage();
        } else {
          throw new Error("Invalid quantity");
        }
      }
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("cart", JSON.stringify(this.items));
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen;
    },
  },
});
