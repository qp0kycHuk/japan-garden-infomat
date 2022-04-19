import showPass from "./show-pass";
import fancybox from "./fancybox";
import Swiper, { Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy } from 'swiper';
import rangeSlider from './range-slider';
import tab from 'npm-kit-tab';
import toggle from 'npm-kit-toggle';
import ripple from 'npm-kit-ripple';
import theme from './theme';

import 'npm-kit-ripple/index.css';
import 'swiper/css';



function loadHandler() {
  fancybox.init();
  showPass.init();
  rangeSlider.init()
  tab.init();
  toggle.init();
  ripple.init();
  theme.init();

  ripple.attach('.btn')
  ripple.attach('.waved')
  ripple.deAttach('.btn--link')
}

const init = () => {
  Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy]);
  Swiper.defaults.touchStartPreventDefault = false
  window.Swiper = Swiper
  window.ripple = ripple

  window.addEventListener('DOMContentLoaded', () => loadHandler())
}

const destroy = () => {
  window.addEventListener('DOMContentLoaded', () => loadHandler())

  ripple.destroy()
  tab.destroy()
  toggle.destroy()
  theme.destroy()
}


export default { init, destroy } 