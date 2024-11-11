<template>
  <Card class="w-5/12">
    <template #title>
      Sign in
    </template>
    <template #content>
      <Fluid>
        <form @submit.prevent="signin" class="grid gap-2">
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
const route = useRoute()

const signin = async () => {
  disabled.value = true;
  errorMsg.value = '';
  sucessMsg.value = '';
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (error) throw error;

    toast.add({
      severity: 'success',
      summary: 'Sign in successful',
      life: 3000
    });
    const redirectTo = route.query.redirect as string;
    navigateTo(redirectTo || '/');
  } catch (error) {
    if (error instanceof Error)
      errorMsg.value = error.message;
  } finally {
    disabled.value = false;
  }
};

definePageMeta({
  title: 'Sign up',
  layout: 'auth',
});
</script>
