import GLTransitions from "gl-transitions";
import createREGL from "regl";
import createREGLTransition from "regl-transition";
import gsap from "gsap";


import './scss/index.scss';

const ASPECT_RATIO = 1
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth * ASPECT_RATIO
canvas.height = window.innerHeight * ASPECT_RATIO
const themes = {
	light: 'LIGHT',
	dark: 'DARK',
}

const $root = document.getElementById('root')


const regl = createREGL({ canvas: canvas });
const gl = GLTransitions.find((tr) => tr.name == "morph")
const transition = createREGLTransition(regl, gl)
let currentTheme = checkIsNight().isNight ? themes.dark : themes.light

checkTime()
window.addEventListener('resize',()=>{
	changeBackground(currentTheme)
})

// Pages code
const pages = {
	started: 'page-started',
	withRules: 'page-with-rules',
	main: 'page-main'
}

let currentPage = pages.started;


document.addEventListener('click', clickHandler)
setPage(currentPage)

function clickHandler(event) {
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

function checkIsNight() {
	const currentTime = new Date()
	const nightTime = new Date()
	const morningTime = new Date()
	nightTime.setHours(18, 0, 0)
	morningTime.setHours(6, 0, 0)

	if (currentTime >= nightTime) {
		morningTime.setDate(morningTime.getDate() + 1)
	}

	let isNight = false
	let offset = Math.min(Math.abs(nightTime - currentTime), Math.abs(morningTime - currentTime))
	if (nightTime - currentTime < 0 && morningTime - currentTime >= 0) {
		offset = morningTime - currentTime
	}

	if (nightTime - currentTime >= 0 && morningTime - currentTime < 0) {
		offset = nightTime - currentTime
	}

	if (currentTime >= nightTime || currentTime <= morningTime) {
		isNight = true
	}

	if (currentTime <= nightTime && currentTime >= morningTime) {
		isNight = false
	}

	return {
		isNight,
		offset
	}
}

function checkTime() {
	const { isNight, offset } = checkIsNight()

	document.body.classList.toggle('dark', isNight)
	changeBackground(isNight ? themes.dark : themes.light)

	setTimeout(
		checkTime,
		offset + 1000
	)
}

async function changeBackground(theme) {
	const lightSrc = document.querySelector('.started__background-inner.light').currentSrc
	const darkSrc = document.querySelector('.started__background-inner.dark').currentSrc
	const imgSrcs = theme == themes.dark ? [lightSrc, darkSrc] : [darkSrc, lightSrc]
	const imgs = await Promise.all(imgSrcs.map(loadImage))
	const [from, to] = imgs.map(img => regl.texture(img));

	if (theme === currentTheme) {
		transition({ from, to, progress: 1 })
		return
	}
	currentTheme = theme



	const options = {
		from,
		to,
		strength: 0.1,
		progress: 0
	}

	const tick = regl.frame(() => {
		transition(options);
	});

	gsap.fromTo(
		options,
		{ progress: 0, },
		{
			progress: 1,
			duration: 3,
			onComplete() {
				tick.cancel()
			}
		},
	)

}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.onabort = reject;
		img.src = src;
	});
}