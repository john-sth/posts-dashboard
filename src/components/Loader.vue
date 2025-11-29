<script setup>
import loader from '@/assets/loader.png'
</script>

<template>
  <div class="loader flex align-center justify-center my-5">
    <img :src="loader" alt="Loading..." />
  </div>
</template>

<style scoped>
.loader {
  margin: 2rem 0;
}
</style>
