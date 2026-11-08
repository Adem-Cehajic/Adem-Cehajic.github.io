const cards = document.querySelectorAll('.card-control');

cards.forEach((card) => {
    const cardName = card.dataset.cardName || 'card';
    const isSocialCard = cardName === 'Social profiles';
    let pinned = false;
    let hovered = false;

    const renderCard = () => {
        const revealed = pinned || hovered;
        card.classList.toggle('is-flipped', pinned);
        if (!isSocialCard) {
            card.setAttribute('aria-pressed', String(pinned));
        }
        card.setAttribute('aria-label', `${revealed ? 'Hide' : 'Reveal'} ${cardName}`);
    };

    card.addEventListener('pointerenter', () => {
        hovered = true;
        renderCard();
    });

    card.addEventListener('pointerleave', () => {
        hovered = false;
        renderCard();
    });

    if (isSocialCard) {
        card.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) {
                return;
            }
           
            renderCard();
        });

        card.addEventListener('keydown', (event) => {
            if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) {
                return;
            }
            event.preventDefault();
            renderCard();
        });
    }

});

const cardStage = document.querySelector('.card-stage');
const centerCard = cards[2];

if (cardStage && centerCard && window.matchMedia('(max-width: 800px)').matches) {
    requestAnimationFrame(() => {
        const center = centerCard.getBoundingClientRect();
        const stage = cardStage.getBoundingClientRect();
        cardStage.scrollLeft += center.left - stage.left - (stage.width - center.width) / 2;
    });
}
