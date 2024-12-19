<template>
    <div class="card">
        <DataTable :value="users" :paginator="true" :rows="10" :loading="loading" dataKey="id" filterDisplay="menu"
            :filters="filters" v-model:filters="filters" :totalRecords="totalRecords" @page="onPageChange">
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

        <Dialog v-model:visible="editDialog" header="Edit User" modal>
            <div class="flex flex-col gap-4">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="editedUser.name" class="w-full" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="editedUser.email" class="w-full" />
                </div>
                <div class="field">
                    <label for="role">Role</label>
                    <Dropdown id="role" v-model="editedUser.role" :options="roles" class="w-full" />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="closeEditDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>

        <ConfirmDialog />
    </div>
</template>

<script setup lang="ts">
const users = ref([])
const loading = ref(true)
const confirm = useConfirm()
const toast = useToast()
const adminService = useAdminUserService()
const currentPage = ref(1)
const totalRecords = ref(0)
const editDialog = ref(false)
const editedUser = ref({})

const roles = ['ADMIN', 'SELLER', 'USER']

const filters = ref({
    global: { value: null, matchMode: 'contains' }
})

const getRoleSeverity = (role: string) => ({
    ADMIN: 'danger',
    SELLER: 'warning',
    USER: 'success'
}[role] || 'info')

const loadUsers = async (page = 1) => {
    try {
        loading.value = true
        const response = await adminService.getAllUsers(page)
        users.value = response?.data || []
        totalRecords.value = response?.total || 0
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

const onPageChange = (event: any) => {
    currentPage.value = event.page + 1
    loadUsers(currentPage.value)
}

const editUser = (user: any) => {
    editedUser.value = { ...user }
    editDialog.value = true
}

const closeEditDialog = () => {
    editedUser.value = {}
    editDialog.value = false
}

const saveUser = async () => {
    try {
        if (!editedUser.value.id) return
        await adminService.updateUser(editedUser.value.id, editedUser.value)
        await loadUsers(currentPage.value)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User updated', life: 3000 })
        closeEditDialog()
    } catch (error: any) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
}

const confirmDelete = (user: any) => {
    confirm.require({
        message: `Delete ${user.name}?`,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => deleteUser(user)
    })
}

const deleteUser = async (user: any) => {
    try {
        await adminService.deleteUser(user.id)
        await loadUsers(currentPage.value)
        toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted', life: 3000 })
    } catch (error: any) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
}

onMounted(() => {
    loadUsers()
})

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})
</script>