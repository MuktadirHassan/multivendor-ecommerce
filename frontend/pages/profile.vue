<template>
  <Card>
    <template #title>
      Profile
    </template>
    <template #content>
      <Fluid>
        <p>Profile page</p>
        <p>Email: {{ user?.email }}</p>
        <Button label="Logout" @click="logout" />
      </Fluid>
    </template>

  </Card>
  <Toast />
</template>

<script lang="ts" setup>
const { value: user } = useSupabaseUser()
const client = useSupabaseClient()
const toast = useToast()
const router = useRouter()

async function logout() {
  try {
    toast.add({
      severity: 'info',
      summary: 'Logging out',
      life: 2000
    })
    await client.auth.signOut()

    toast.add({
      severity: 'success',
      summary: 'Logged out',
      life: 2000
    })
    router.push('/')
  } catch (error) {
    console.error(error)
  }
}

definePageMeta({
  title: 'Profile',
  layout: 'auth',
  middleware: 'auth'
})
</script>

<style></style>