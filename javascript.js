const cards = document.querySelectorAll('.card-control');
const cardStage = document.querySelector('.card-stage');
const centerCard = document.querySelector('.card-wrap-about .card-control');
const projectBoard = cardStage?.querySelector('.project-board');

const centerCardInStage = () => {
    if (!cardStage || !centerCard || !window.matchMedia('(max-width: 800px)').matches) {
        return;
    }

    const center = centerCard.getBoundingClientRect();
    const stage = cardStage.getBoundingClientRect();
    cardStage.scrollLeft += center.left - stage.left - (stage.width - center.width) / 2;
};

const onNextFrame = (callback) => {
    if (document.visibilityState === 'hidden') {
        window.setTimeout(callback, 16);
        return;
    }
    requestAnimationFrame(callback);
};

const flipCardDownThen = (card, stage, reducedMotion, callback) => {
    const flipper = card.querySelector('.card-flipper');
    const startsFaceUp = card.matches(':hover');
    stage.classList.add('is-flipping-down');

    if (!flipper || reducedMotion || !startsFaceUp) {
        window.setTimeout(() => {
            stage.classList.remove('is-flipping-down');
            callback();
        }, reducedMotion ? 20 : 0);
        return;
    }

    let flipFinished = false;
    let flipFallback;
    const finishFlip = () => {
        if (flipFinished) {
            return;
        }
        flipFinished = true;
        flipper.removeEventListener('transitionend', handleFlipEnd);
        window.clearTimeout(flipFallback);
        stage.classList.remove('is-flipping-down');
        callback();
    };
    const handleFlipEnd = (event) => {
        if (event.target === flipper && event.propertyName === 'transform') {
            finishFlip();
        }
    };

    flipper.addEventListener('transitionend', handleFlipEnd);
    const flipDuration = parseFloat(window.getComputedStyle(flipper).transitionDuration) * 1000;
    flipFallback = window.setTimeout(finishFlip, flipDuration + 80);
};

const replayOriginalDeck = (stage, board, reducedMotion) => {
    const replayDuration = reducedMotion ? 20 : 1400;
    stage.classList.remove('is-projects-view', 'is-projects-lifting', 'is-projects-entering');
    board.classList.remove('is-entering');
    board.setAttribute('aria-hidden', 'true');
    stage.setAttribute('aria-label', 'A row of three cards');
    stage.scrollLeft = 0;
    stage.classList.add('is-replaying');
    void stage.offsetWidth;

    onNextFrame(() => {
        stage.classList.remove('is-replaying');
        window.setTimeout(() => {
            centerCardInStage();
            stage.classList.remove('is-transitioning');
        }, replayDuration);
    });
};

cards.forEach((card) => {
    const cardName = card.dataset.cardName || 'card';
    let hovered = false;

    const renderCard = () => {
        card.setAttribute('aria-label', `${hovered ? 'Hide' : 'Reveal'} ${cardName}`);
    };

    card.addEventListener('pointerenter', () => {
        hovered = true;
        renderCard();
    });

    card.addEventListener('pointerleave', () => {
        hovered = false;
        renderCard();
    });

    if (cardName === 'Projects') {
        card.addEventListener('click', () => {
            if (!cardStage || !projectBoard || cardStage.classList.contains('is-transitioning') || cardStage.classList.contains('is-flipping-down')) {
                return;
            }

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            flipCardDownThen(card, cardStage, reducedMotion, () => {
                const stackDuration = reducedMotion ? 20 : 820;
                const liftDuration = reducedMotion ? 20 : 680;
                const projectDealDuration = reducedMotion ? 20 : 1800;

                cardStage.classList.add('is-transitioning', 'is-preparing-stack');
                cardStage.scrollLeft = 0;
                void cardStage.offsetWidth;

                onNextFrame(() => {
                    cardStage.classList.remove('is-preparing-stack');
                    cardStage.classList.add('is-stacking');
                });

                window.setTimeout(() => {
                    cardStage.classList.remove('is-stacking');
                    cardStage.classList.add('is-leaving');
                }, stackDuration);

                window.setTimeout(() => {
                    cardStage.classList.remove('is-leaving');
                    cardStage.classList.add('is-projects-view', 'is-projects-entering');
                    cardStage.setAttribute('aria-label', 'Project gallery');
                    projectBoard.setAttribute('aria-hidden', 'false');
                    cardStage.scrollLeft = 0;
                    projectBoard.classList.add('is-entering');

                    window.setTimeout(() => {
                        projectBoard.classList.remove('is-entering');
                        cardStage.classList.remove('is-projects-entering', 'is-transitioning');
                    }, projectDealDuration);
                }, stackDuration + liftDuration);
            });
        });
    }

    if (cardName === 'Back to cards') {
        card.addEventListener('click', () => {
            if (!cardStage || !projectBoard || !cardStage.classList.contains('is-projects-view') || cardStage.classList.contains('is-transitioning')) {
                return;
            }

            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            flipCardDownThen(card, cardStage, reducedMotion, () => {
                const packDuration = reducedMotion ? 20 : 980;
                const liftDuration = reducedMotion ? 20 : 680;

                cardStage.classList.add('is-transitioning', 'is-preparing-project-pack');
                void cardStage.offsetWidth;

                onNextFrame(() => {
                    cardStage.classList.remove('is-preparing-project-pack');
                    cardStage.classList.add('is-packing-projects');
                });

                window.setTimeout(() => {
                    cardStage.classList.remove('is-packing-projects');
                    cardStage.classList.add('is-projects-lifting');
                }, packDuration);

                window.setTimeout(() => {
                    replayOriginalDeck(cardStage, projectBoard, reducedMotion);
                }, packDuration + liftDuration);
            });
        });
    }
});

if (cardStage && centerCard && window.matchMedia('(max-width: 800px)').matches) {
    onNextFrame(centerCardInStage);
}

document.querySelectorAll('.project-link[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
});
