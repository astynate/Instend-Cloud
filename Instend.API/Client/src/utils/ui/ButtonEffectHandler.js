export const ButtonEffectHandler = (ref, event) => {
    let element = document.createElement('div');

    element.classList.add('drop');
    ref.current.appendChild(element);

    let mValue = Math.max(ref.current.clientWidth, ref.current.clientHeight);
    let rect = ref.current.getBoundingClientRect();
    let sDiv = element.style;
    let px = 'px';

    sDiv.width = sDiv.height = mValue + px;
    sDiv.left = event.clientX - rect.left - (mValue / 2) + px;
    sDiv.top  = event.clientY - rect.top - (mValue / 2) + px;

    ref.current.appendChild(element);

    setTimeout(() => {
        ref.current.removeChild(element);
    }, 2000);
}