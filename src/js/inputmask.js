
import Inputmask from "inputmask";

const init = (cover) => {
  const inputs = cover.querySelectorAll('[type="tel"]');
  const im = new Inputmask("+7 ( 9 9 9 ) 9 9 9 - 9 9 - 9 9");
  im.mask(inputs);
  inputs.forEach(element => {
    element.addEventListener('input', inputHandler)
  });
}

function inputHandler(event) {
  if((event.target.value[5] == '8' || event.target.value[5] == '7') && event.target.value[7] == '9' && event.target.value[9] == '_'){
    event.target.value = '9'
  }
}

export default { init }