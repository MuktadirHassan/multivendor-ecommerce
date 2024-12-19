<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <InputText v-model="email" type="email" class="w-full" :class="{ 'p-invalid': v$.email.$error }"
              placeholder="Email address" />
            <small class="text-red-500" v-if="v$.email.$error">
              {{ v$.email.$errors[0].$message }}
            </small>
          </div>

          <div>
            <Password v-model="password" :feedback="false" class="w-full" :class="{ 'p-invalid': v$.password.$error }"
              placeholder="Password" toggleMask />
            <small class="text-red-500" v-if="v$.password.$error">
              {{ v$.password.$errors[0].$message }}
            </small>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Checkbox v-model="rememberMe" :binary="true" />
            <label class="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <div class="text-sm">
            <NuxtLink to="/forgot-password" class="text-blue-600 hover:text-blue-500">
              Forgot password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <Button type="submit" :loading="loading" label="Sign in" class="w-full" />
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-500">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>

    <Toast position="top-center" />
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email as validateEmail } from '@vuelidate/validators'
const { signIn } = useAuth()

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const loading = ref(false)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const toast = useToast()

const rules = {
  email: { required, validateEmail },
  password: { required }
}

const v$ = useVuelidate(rules, { email, password })

const handleLogin = async () => {
  try {
    loading.value = true
    const isValid = await v$.value.$validate()

    if (!isValid) return

    await signIn("credentials", {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
  } catch (error: any) {
    const message = error.response?.data.message || error.message
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message || 'Login failed',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>