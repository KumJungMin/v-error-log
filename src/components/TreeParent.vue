<template>
  <div>
    <Sample @item-clicked="some"/>
  </div>
</template>

<script setup>
import Sample from './Sample.vue'

const a = 1

const some = (item) => {
  a = 2
}
</script>