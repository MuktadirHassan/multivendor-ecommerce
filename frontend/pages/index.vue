<template>

  <Header />
  <MainSection />
  <ItemCard />
  <ItemCard1 />
  <ItemCard2 />
  <Footer />
</template>

<script setup lang="ts">


</script>

<style scoped>
input {
  transition: box-shadow 0.3s;
}

input:focus {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  outline: none;
}

button {
  cursor: pointer;
  font-size: 1.25rem;
}

a {
  transition: color 0.3s;
}

a:hover {
  color: red;
}
</style>