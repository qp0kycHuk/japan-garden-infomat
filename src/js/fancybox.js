import { Fancybox } from "@fancyapps/ui";
import ru from "@fancyapps/ui/src/Fancybox/l10n/ru"
import "@fancyapps/ui/dist/fancybox.css";

const init = () => {
  Fancybox.defaults.trapFocus = false
  Fancybox.defaults.autoFocus = false
  Fancybox.defaults.placeFocusBack = false
  Fancybox.defaults.l10n = ru
  Fancybox.defaults.template.spinner = '<div class="progress progress-circle"> </div>'


  const defaultOptions = {
    dragToClose: false,
    mainClass: 'fancybox-custom-modal',
    on: {
      done: (fancybox, slide) => {
      }
    }
  }

  Fancybox.bind('[data-fancybox-modal]', defaultOptions)

  Fancybox.modal = { defaultOptions }
  Fancybox.modal.open = (src, options) => {
    Fancybox.show([{
      src: src,
      ...options
    }], {
      ...defaultOptions,
      ...options
    })
  }

  window.Fancybox = Fancybox
}

export default { init }