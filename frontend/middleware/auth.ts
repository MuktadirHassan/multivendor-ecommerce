export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // user not logged in and trying to access a protected route
  if (!user.value) {
    return navigateTo({
      name: "signin",
      query: { redirect: to.fullPath },
    });
  }
});
