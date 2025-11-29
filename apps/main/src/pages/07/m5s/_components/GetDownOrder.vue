<script setup lang="ts">
import { useStore } from '@nanostores/vue'

import { $roleOrders } from '../_stores/getDownOrder'

const roleOrderStore = useStore($roleOrders)
</script>

<template>
  <slot v-for="order in roleOrderStore" :key="order" :name="order" />
</template>
