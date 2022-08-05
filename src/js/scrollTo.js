function clickHandler(event) {
    function scrollTo() {
        const target = event.target.closest('[data-scroll]');
        const href = target.getAttribute('data-scroll');

        if (!href) return;
        if (href[0] != '#' || href == '#') return;

        event.preventDefault();

        var element = document.querySelector(href);
        const offset = 45;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    if (event.target.closest('[data-scroll]')) scrollTo();



}


const init = () => {
    document.addEventListener('click', clickHandler)
}

const destroy = () => {
    document.removeEventListener('click', clickHandler)
}

export default { init, destroy }