<template>
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Exclusive Section -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Exclusive</h3>
          <p class="text-sm">Subscribe</p>
          <p class="text-sm">Get 10% off your first order</p>
          <div class="flex">
            <InputText v-model="email" placeholder="Enter your email" class="w-full rounded-r-none" />
            <Button icon="pi pi-arrow-right" class="p-button-secondary rounded-l-none" />
          </div>
        </div>

        <!-- Support Section -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Support</h3>
          <div class="space-y-2 text-sm">
            <p>111 Bijoy sarani, Dhaka,</p>
            <p>DH 1515, Bangladesh.</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
        </div>

        <!-- Account Section -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Account</h3>
          <ul class="space-y-2">
            <li v-for="(item, index) in accountLinks" :key="index">
              <NuxtLink :to="item.path" class="text-sm hover:text-primary">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Link Section -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Quick Link</h3>
          <ul class="space-y-2">
            <li v-for="(item, index) in quickLinks" :key="index">
              <NuxtLink :to="item.path" class="text-sm hover:text-primary">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Download App Section -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Download App</h3>
          <p class="text-sm">Save $3 with App New User Only</p>

          <!-- QR Code -->
          <div class="bg-gray-700 w-32 h-32 rounded-lg flex items-center justify-center text-xs">
            QR Code Placeholder
          </div>

          <!-- App Store Buttons -->
          <div class="space-y-2">
            <Button label="Google Play" icon="pi pi-google" class="p-button-outlined p-button-secondary w-full" />
            <Button label="App Store" icon="pi pi-apple" class="p-button-outlined p-button-secondary w-full" />
          </div>

          <!-- Social Icons -->
          <div class="flex space-x-4">
            <Button v-for="(social, index) in socialLinks" :key="index" :icon="social.icon"
              class="p-button-rounded p-button-text" @click="navigateToSocial(social.url)" />
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
        <p>&copy; Copyright Puja 2024. All rights reserved</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const email = ref('');

const accountLinks = [
  { label: 'My Account', path: '/account' },
  { label: 'Login / Register', path: '/auth' },
  { label: 'Cart', path: '/cart' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Shop', path: '/shop' },
];

const quickLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms Of Use', path: '/terms' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  { icon: 'pi pi-facebook', url: 'https://facebook.com' },
  { icon: 'pi pi-twitter', url: 'https://twitter.com' },
  { icon: 'pi pi-instagram', url: 'https://instagram.com' },
  { icon: 'pi pi-linkedin', url: 'https://linkedin.com' },
];

const navigateToSocial = (url: string) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
/* Additional custom styles if needed */
.p-inputtext {
  @apply bg-gray-800 border-gray-700;
}

.p-button-secondary {
  @apply bg-gray-800 border-gray-700 hover:bg-gray-700;
}

.text-primary {
  @apply text-blue-400;
}
</style>