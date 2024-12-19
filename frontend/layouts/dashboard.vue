<!-- layouts/dashboard.vue -->
<template>
    <div class="flex h-screen bg-gray-50 container mx-auto">
        <!-- Sidebar -->
        <Sidebar v-model:visible="sidebarVisible" class="fixed left-0 top-0 h-full">
            <div class="w-64 h-full bg-white border-r border-gray-200">
                <div class="p-4 border-b">
                    <div class="text-xl font-bold text-gray-800">E-Commerce</div>
                </div>

                <Menu :model="menuItems" class="border-none" />
            </div>
        </Sidebar>

        <!-- Main Content -->
        <div class="flex-1 ml-64">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200">
                <div class="flex items-center justify-between px-6 py-4">
                    <Button icon="pi pi-bars" @click="sidebarVisible = !sidebarVisible" text rounded />

                    <div class="flex items-center gap-4">
                        <Avatar label="AH" shape="circle" />
                        <span class="font-medium">Admin User</span>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>

const sidebarVisible = ref(false);

const menuItems = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        to: '/dashboard'
    },
    {
        label: 'Products',
        icon: 'pi pi-box',
        to: '/products'
    },
    {
        label: 'Orders',
        icon: 'pi pi-shopping-cart',
        to: '/orders'
    },
    {
        label: 'Customers',
        icon: 'pi pi-users',
        to: '/customers'
    },
    {
        label: 'Analytics',
        icon: 'pi pi-chart-line',
        to: '/analytics'
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                to: '/settings/profile'
            },
            {
                label: 'Shop',
                icon: 'pi pi-shopping-bag',
                to: '/settings/shop'
            }
        ]
    }
]);
</script>

<style lang="postcss" scoped>
.p-sidebar {
    @apply border-none;
}

.p-menu {
    @apply border-none w-full;
}

.p-menuitem-link {
    @apply flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600;
}

.p-menuitem-icon {
    @apply mr-3;
}
</style>