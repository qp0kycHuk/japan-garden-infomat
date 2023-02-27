<script setup>
import { computed } from '@vue/reactivity';
import { inject } from 'vue';

const { item } = defineProps(['item'])

const window = inject('window')
const closeItem = inject('closeItem')
const getCurrentItem = inject('getCurrentItem')
const currentItem = computed(getCurrentItem);
</script>

<template>
    <div class="map-dialog" :class="currentItem?.id == item.id ? 'active' : ''">
        <div class="place-card">
            <div class="place-card__img">
                <img :src="item.img" alt="">
            </div>
            <div class="place-card__content">
                <div class="place-card__title">{{ item.title }}</div>
                <div class="place-card__props" v-if="item.props">
                    <div class="place-card__prop" v-for="prop in item.props">
                        {{ prop[0] }} <span>{{ prop[1] }}</span>
                    </div>
                </div>
                <div class="place-card__description" v-html="item.description"></div>
            </div>
            <button class="place-card__close btn btn--primary btn--white-bg btn-fab" @click="closeItem">
                <img :src="`${window.ASSETS_DIR}img/cross.svg`" alt="">
            </button>
        </div>
    </div>
</template>

<style>
</style>