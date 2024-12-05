<script setup lang="ts">
import { ref, watch } from 'vue'

const count = ref(0)
const aa = 1

watch(count, (newVal, oldVal) => {
  console.log('count changed', newVal, oldVal)
  aa = 4
})

aa = 2

const errorFunc = () => {
  aa = 3
}
</script>

<template>
  <div class="sample-child">
    <h3>Sample Child Component</h3>
    <button @click="aa = 5">wrong count using click event</button>
    <br /><br />
    <button @click="errorFunc()">wrong count using click event function</button>
    <br /><br />
    <button @click="count++">count is: {{ count }}</button>
  </div>
</template>


<style>
.sample-child {
  border: 1px solid #000;
  padding: 10px;
  border-radius: 10px;
  background-color: #000;
}
</style>