<template>
  <Card class="w-5/12">
    <template #title>
      Sign up
    </template>
    <template #content>
      <Fluid>
        <form @submit.prevent="signup" class="grid gap-2">
          <InputText v-model="email" placeholder="Email" type="email" />
          <Password v-model="password" toggleMask />
          <Message v-if="errorMsg" severity="error">{{ errorMsg }}</Message>
          <Button label="Submit" type="submit" :loading="disabled" />

        </form>
      </Fluid>

    </template>
  </Card>
  <Toast />
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const toast = useToast()
const email = ref('');
const password = ref('');
const disabled = ref(false);
const errorMsg = ref('');
const sucessMsg = ref('');


const signup = async () => {
  disabled.value = true;
  errorMsg.value = '';
  sucessMsg.value = '';

  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value
    });

    if (error) throw error;

    toast.add({
      severity: 'success',
      summary: 'Sign up successful',
      detail: 'Account created successfully',
      life: 3000
    });
    navigateTo('/signin');
  } catch (error) {
    if (error instanceof Error)
      errorMsg.value = error.message;
  } finally {
    disabled.value = false;
  }
};

definePageMeta({
  title: 'Sign up',
  layout: 'auth'
});
</script>
