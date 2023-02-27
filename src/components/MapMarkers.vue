<script setup>
import { inject } from "vue";
const { items } = defineProps(['items'])

const showItem = inject('showItem')
const getCurrentItem = inject('getCurrentItem')
const window = inject('window')
</script>

<template>
    <div v-for="item in items" class="map-marker" :id="item.id" :class="getCurrentItem()?.id == item.id ? 'active' : ''"
        @click="showItem(item)" :key="item.id" :style="`left: ${item.coords[0]}%; top: ${item.coords[1]}%;`">
        <img :src="`${window.ASSETS_DIR}img/markers/${item.category}.png`" alt="">
    </div>
</template>

<style>
</style>