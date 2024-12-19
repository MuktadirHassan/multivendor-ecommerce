<!-- pages/dashboard/users.vue -->
<template>
    <div class="card">
        <DataTable :value="users" :paginator="true" :rows="10" :loading="loading" dataKey="id" filterDisplay="menu"
            :filters="filters" v-model:filters="filters">
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Users</h2>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search" />
                    </span>
                </div>
            </template>

            <Column field="id" header="ID" sortable />

            <Column field="name" header="Name" sortable>
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <Avatar :image="data.avatar" :label="data.name?.charAt(0)" shape="circle" />
                        {{ data.name }}
                    </div>
                </template>
            </Column>

            <Column field="email" header="Email" sortable />

            <Column field="role" header="Role" sortable>
                <template #body="{ data }">
                    <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
                </template>
            </Column>

            <Column field="createdAt" header="Joined" sortable>
                <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" rounded text severity="info" @click="editUser(data)" />
                        <Button icon="pi pi-trash" rounded text severity="danger" @click="confirmDelete(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <ConfirmDialog />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

definePageMeta({
    title: 'Users',
    breadcrumb: [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Users' }
    ],
    layout: 'dashboard',
    middleware: 'auth'
});

const users = ref([]);
const loading = ref(true);
const confirm = useConfirm();
const toast = useToast();
const userService = useUserService();

const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

const getRoleSeverity = (role) => {
    const severities = {
        ADMIN: 'danger',
        SELLER: 'warning',
        USER: 'success'
    };
    return severities[role] || 'info';
};

const editUser = (user) => {
    // Implement edit functionality
    console.log('Edit user:', user);
};

const confirmDelete = (user) => {
    confirm.require({
        message: `Are you sure you want to delete ${user.name}?`,
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteUser(user),
    });
};

const deleteUser = async (user) => {
    try {
        // Implement delete functionality
        toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
};

onMounted(async () => {
    try {
        const response = await userService.getCurrentUser();
        users.value = response.data || [];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.p-datatable {
    @apply shadow-sm rounded-lg overflow-hidden;
}
</style>