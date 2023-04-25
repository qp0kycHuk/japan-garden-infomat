const Vue = require('vue/dist/vue.esm-bundler');
import { defineComponent } from "vue";
import { Panzoom } from "@fancyapps/ui";
import toggle from 'npm-kit-toggle';
import ripple from 'npm-kit-ripple';

import './scss/index.scss';
import getSupportedEvents from "./js/functions/getSupportedEvents";
import MapMarkers from "./components/MapMarkers.vue";
import MapDialog from "./components/MapDialog.vue";

import { items } from './itemsData';
import fancybox from './js/fancybox'


const $root = document.getElementById('root')

const pages = {
	started: 'page-started',
	withRules: 'page-with-rules',
	main: 'page-main'
}

let currentPage = pages.started;
console.log(currentPage);

let mapPanzoom;
const baseScale = 1;
const minScale = 1;
const maxScale = 3;
const step = (maxScale - minScale) / 3;

fancybox.init()
ripple.init()
toggle.init()

ripple.attach('.btn')
ripple.attach('.waved')
ripple.deAttach('.btn--link')
const globalObject = window



const appComponent = defineComponent({
	data() {
		return {
			currentItem: undefined,
			startedTimeout: undefined,
			items,

		}
	},
	mounted() {
		document.addEventListener(getSupportedEvents().end, this.mouseEndHundler)
	},
	unmounted() {
		clearTimeout(this.startedTimeout)
		document.removeEventListener(getSupportedEvents().end, this.mouseEndHundler)
	},
	methods: {
		showItem(item) {
			if (this.currentItem) {
				if (this.currentItem.id !== item.id) {
					this.currentItem = undefined
					setTimeout(() => this.currentItem = item, 350)
				} else {
					this.currentItem = undefined
				}
			} else {
				this.currentItem = item

			}
		},
		closeItem() {
			this.currentItem = undefined
		},
		clear() {
			this.closeItem()
			setPage(pages.started)

			const $map = document.querySelector('.map')
			$map?.classList.remove('active');
			$root?.classList.remove('map-active')

			mapPanzoom?.zoomTo(baseScale);
			const $cover = document.querySelector("#map-panzoom")
			if (mapPanzoom?.transform.scale == maxScale || (mapPanzoom?.transform.scale + step) >= maxScale) {
				$cover?.classList.add('max-scale')
			} else {
				$cover?.classList.remove('max-scale')

			}
		},
		mouseEndHundler() {
			clearTimeout(this.startedTimeout)
			this.startedTimeout = setTimeout(this.clear, 2 * 60 * 1000);
		}

	},
	provide() {
		return {
			window: globalObject,
			showItem: this.showItem,
			closeItem: this.closeItem,
			getCurrentItem: () => this.currentItem,
			items: this.items
		}
	}


})

const app = Vue.createApp(appComponent)
app.component('map-markers', MapMarkers)
app.component('map-dialog', MapDialog)
app.mount(document.getElementById('map'))

document.addEventListener('click', clickHandler)

const $arrow = document.querySelector('.map-arrow')
// $arrow?.addEventListener(getSupportedEvents().start, arrowHandler)
setPage(currentPage)
initMapPanzoom()

function initMapPanzoom() {
	const $zoomInBtn = document.querySelector('.map-zoom-in')
	const $zoomOutBtn = document.querySelector('.map-zoom-out')
	const $cover = document.querySelector("#map-panzoom")
	if (!$cover) return

	mapPanzoom = new Panzoom($cover, {
		panOnlyZoomed: true,
		baseScale,
		minScale,
		maxScale,
		step,
		pinchToZoom: true,
		friction: 1,
		bounceForce: 0.25,

		wheel: () => false,
		click: () => false,
	});

	$cover.addEventListener(getSupportedEvents().end, () => {
		checkPanzoom()
		setTimeout(checkPanzoom, 100)
	})

	$zoomInBtn.addEventListener('click', (event) => {
		event.stopPropagation();
		mapPanzoom.zoomIn();
		checkPanzoom()

	})

	$zoomOutBtn.addEventListener('click', (event) => {
		event.stopPropagation();
		mapPanzoom.zoomTo(baseScale);
		checkPanzoom()

	})

	function checkPanzoom() {
		if (mapPanzoom.transform.scale == maxScale || (mapPanzoom.transform.scale + step) >= maxScale) {
			$cover.classList.add('max-scale')
		} else {
			$cover.classList.remove('max-scale')

		}
	}
}

function arrowHandler(event) {
	const $map = event.target.closest('.map')
	$map.classList.toggle('active');
	$root.classList.toggle('map-active')
}

function clickHandler(event) {
	console.log('clickHandler');
	if (event.target.closest('[data-route-to]')) {
		const page = event.target.closest('[data-route-to]').getAttribute('data-route-to');
		setPage(page)
	}

}

function setPage(page) {
	currentPage = page;
	Object.values(pages).forEach((el) => $root.classList.remove(el))
	$root.classList.add(page)
}


function checkTime() {
	const currentTime = new Date()
	const nightTime = new Date()
	const morningTime = new Date()
	nightTime.setHours(18, 0, 0)
	morningTime.setHours(6, 0, 0)

	if (currentTime >= nightTime) {
		morningTime.setDate(morningTime.getDate() + 1)
	}

	let offset = Math.min(Math.abs(nightTime - currentTime), Math.abs(morningTime - currentTime))
	if (nightTime - currentTime < 0 && morningTime - currentTime >= 0) {
		offset = morningTime - currentTime
	}

	if (nightTime - currentTime >= 0 && morningTime - currentTime < 0) {
		offset = nightTime - currentTime
	}

	if (currentTime >= nightTime || currentTime <= morningTime) {
		document.body.classList.add('dark')
	}

	if (currentTime <= nightTime && currentTime >= morningTime) {
		document.body.classList.remove('dark')
	}

	console.log(document.body.classList.contains('dark') ? 'night' : 'day')

	setTimeout(
		checkTime,
		offset + 1000
	)
}

checkTime()