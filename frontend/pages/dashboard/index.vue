<!-- pages/dashboard/index.vue -->
<template>
    <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card v-for="stat in stats" :key="stat.title" class="shadow-sm">
                <template #content>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-gray-500">{{ stat.title }}</div>
                            <div class="text-2xl font-semibold mt-1">{{ stat.value }}</div>
                            <div class="text-sm mt-2" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% from last month
                            </div>
                        </div>
                        <div :class="`p-3 rounded-full ${stat.bgColor}`">
                            <i :class="`${stat.icon} text-xl ${stat.iconColor}`"></i>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenue Chart -->
            <Card>
                <template #title>
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Revenue Overview</h3>
                        <Dropdown v-model="selectedPeriod" :options="periods" optionLabel="name" />
                    </div>
                </template>
                <template #content>
                    <Chart type="line" :data="revenueData" :options="chartOptions" height="300" />
                </template>
            </Card>

            <!-- Orders Chart -->
            <Card>
                <template #title>
                    <h3 class="text-lg font-semibold mb-4">Recent Orders</h3>
                </template>
                <template #content>
                    <Chart type="bar" :data="ordersData" :options="chartOptions" height="300" />
                </template>
            </Card>
        </div>

        <!-- Recent Orders Table -->
        <Card>
            <template #title>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Latest Transactions</h3>
                    <Button label="View All" link />
                </div>
            </template>
            <template #content>
                <DataTable :value="recentOrders" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="orderId" header="Order ID" />
                    <Column field="customer" header="Customer" />
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column field="amount" header="Amount">
                        <template #body="slotProps">
                            ${{ slotProps.data.amount.toFixed(2) }}
                        </template>
                    </Column>
                    <Column field="date" header="Date" />
                </DataTable>
            </template>
        </Card>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Dashboard',
    breadcrumb: [
        { label: 'Dashboard', link: '/dashboard' }
    ],
    layout: 'dashboard',
    middleware: 'auth'
});

const stats = ref([
    {
        title: 'Total Revenue',
        value: '$54,230',
        trend: 12.5,
        icon: 'pi pi-dollar',
        bgColor: 'bg-primary-100',
        iconColor: 'text-primary-600'
    },
    {
        title: 'Total Orders',
        value: '1,240',
        trend: 8.2,
        icon: 'pi pi-shopping-cart',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    {
        title: 'Total Users',
        value: '3,592',
        trend: -2.4,
        icon: 'pi pi-users',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        title: 'Avg. Order Value',
        value: '$43.73',
        trend: 5.6,
        icon: 'pi pi-chart-line',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
    }
]);

const periods = ref([
    { name: 'Last Week', code: 'week' },
    { name: 'Last Month', code: 'month' },
    { name: 'Last Year', code: 'year' }
]);

const selectedPeriod = ref(periods.value[0]);

const revenueData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Revenue',
        data: [30000, 45000, 38000, 52000, 48000, 54000],
        borderColor: '#4F46E5'
    }]
});

const ordersData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Orders',
        data: [420, 380, 450, 520, 480, 540],
        backgroundColor: '#4F46E5'
    }]
});

const chartOptions = ref({
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
});

const recentOrders = ref([
    {
        orderId: '#12345',
        customer: 'John Doe',
        status: 'DELIVERED',
        amount: 124.00,
        date: '2024-03-18'
    },
    {
        orderId: '#12346',
        customer: 'Jane Smith',
        status: 'PENDING',
        amount: 85.50,
        date: '2024-03-18'
    },
    {
        orderId: '#12347',
        customer: 'Mike Johnson',
        status: 'PROCESSING',
        amount: 246.75,
        date: '2024-03-17'
    }
]);

const getStatusSeverity = (status) => {
    const severities = {
        DELIVERED: 'success',
        PENDING: 'warning',
        PROCESSING: 'info',
        CANCELLED: 'danger'
    };
    return severities[status];
};
</script>