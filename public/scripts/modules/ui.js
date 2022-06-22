export const showSmallMapUnsustainable = () => {
    const showBetterStation = document.getElementById('showBetterStation');
    const hiddenSection = document.getElementById('map2');
    const comparison = document.getElementById('comparison')
    const animation = document.getElementById('animation-tree-bad')
    showBetterStation.addEventListener('click', () => {
        hiddenSection.classList.remove('hidden');
        comparison.style.marginTop = '22em';
        animation.style.position = 'absolute';
        animation.style.top = '45em';
        animation.style.left = '0.5em';
    })
}

export const showSmallMapLittlesustainable = () => {
    const showBetterStation = document.getElementById('showBetterStation');
    const hiddenSection = document.getElementById('map2');
    const comparison = document.getElementById('comparison')
    const animation = document.getElementById('animation-tree-bad')
    showBetterStation.addEventListener('click', () => {
        hiddenSection.classList.remove('hidden');
        hiddenSection.style.marginTop = '4em';
        comparison.style.marginTop = '22em';
        animation.style.position = 'absolute';
        animation.style.top = '55em';
        animation.style.left = '0.5em';
    })
}