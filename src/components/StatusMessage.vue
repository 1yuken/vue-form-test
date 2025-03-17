<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  }
});

const messageClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800';
  }
});
</script>

<template>
    <div class="mt-4 p-3 rounded-md" :class="messageClass">
      {{ message }}
    </div>
  </template>