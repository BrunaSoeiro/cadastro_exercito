// Seletores
const linkQuadro = document.getElementById('link-quadro');
const linkCarrossel = document.getElementById('link-carrossel');
const quadroView = document.getElementById('quadro-view');
const carousel = document.getElementById('carousel');

// Função para mostrar o quadro (substitui o carrossel)
function showQuadro() {
    carousel.classList.add('hidden');      // esconde o carrossel
    quadroView.classList.add('active');    // mostra o quadro
    quadroView.setAttribute('aria-hidden', 'false');
}

// Função para voltar ao carrossel
function showCarousel() {
    quadroView.classList.remove('active');
    quadroView.setAttribute('aria-hidden', 'true');

    // espera um pouco para suavizar a transição antes de mostrar o carrossel
    setTimeout(() => {
        carousel.classList.remove('hidden');
    }, 250);
}

// Eventos dos botões da sidebar
if (linkQuadro) {
    linkQuadro.addEventListener('click', e => {
        e.preventDefault();
        showQuadro();
    });
}

if (linkCarrossel) {
    linkCarrossel.addEventListener('click', e => {
        e.preventDefault();
        showCarousel();
    });
}

// Permite fechar o quadro com ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') showCarousel();
});
