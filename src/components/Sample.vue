<script setup>
import { onMounted } from 'vue'

const aa = 1

onMounted(() => {
  aa = 2
})

const errorFunc = () => {
  aa = 3
}
</script>

<template>
  <div class="sample">
    <h3>Sample Component</h3>
    <button @click="errorFunc()">wrong count using click event function</button>
    <br /><br />
    <button @click="count++">count is: {{ count }}</button>

    <br /><br />
    <hr />
  </div>
</template>

<style>
.sample {
  border: 1px solid #000;
  padding: 10px;
  border-radius: 10px;
  background-color: #4b4b4b;
}
</style>