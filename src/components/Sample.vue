<script setup>
import { onMounted } from 'vue'
import { useErrorLogger } from  '../composbles/use-error'

const { sendErrorLog } = useErrorLogger();
const emit = defineEmits(['item-clicked'])

const aa = 1

onMounted(() => {
  aa = 2
})

function errorFunc() {
  try {
  aa = 3
  } catch(e) {
    console.log('errorFunc error')
    sendErrorLog(e)
  }
}

</script>

<template>
  <div class="sample">
    <h3>Sample Component</h3>
    <button @click="errorFunc()">wrong count using click event function</button>
    <br /><br />
    <button @click="emit('item-clicked', { name: 'sample' })">emit event</button>

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