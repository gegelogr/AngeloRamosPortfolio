const currentYear = document.getElementById('year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());


const previewLibrary = {
  jeepney: {title: 'Jeepney Passenger Contact Tracing', slides: [
    ['assets/previews/jeepney-tracing.png','Trip register and route overview']
  ]},
  accounting: {title: 'Accounting Suite PH', slides: [
    ['assets/previews/accounting-suite.png','Client access and workspace concept']
  ]},
  quickprint: {title: 'QuickPrint', slides: [
    ['assets/previews/quickprint-cheque.png','Cheque printing workspace'],
    ['assets/previews/quickprint-voucher.png','Voucher document builder']
  ]},
  assets: {title: 'Fixed Assets Management', slides: [
    ['assets/previews/fixed-assets-register.png','Asset register'],
    ['assets/previews/fixed-assets-detail.png','Asset detail and lifecycle']
  ]},
  juancast: {title: 'JuanCast', slides: [
    ['assets/previews/juancast.png','Voting platform concept']
  ]}
};
const previewDialog = document.querySelector('#preview-dialog');
const previewImage = document.querySelector('#preview-image');
const previewTitle = document.querySelector('#preview-title');
const previewDescription = document.querySelector('#preview-desc');
const previewCount = document.querySelector('#preview-count');
const previewProgress = document.querySelector('.preview-progress');
const previewPrevious = document.querySelector('.preview-prev');
const previewNext = document.querySelector('.preview-next');
let currentPreview = null;
let currentSlide = 0;
let previewOpener = null;

function displayPreviewSlide(index) {
  if (!currentPreview) return;
  const slides = currentPreview.slides;
  currentSlide = (index + slides.length) % slides.length;
  const [src, label] = slides[currentSlide];
  previewImage.src = src;
  previewImage.alt = `${currentPreview.title}: ${label} — illustrative interface study`;
  previewTitle.textContent = currentPreview.title;
  previewDescription.textContent = `${label} · illustrative snapshot with sample data`;
  previewCount.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  previewPrevious.hidden = slides.length < 2;
  previewNext.hidden = slides.length < 2;
  previewProgress.replaceChildren(...slides.map((_, i) => {
    const indicator = document.createElement('i');
    if (i === currentSlide) indicator.classList.add('is-current');
    return indicator;
  }));
}

document.querySelectorAll('[data-preview]').forEach((button) => {
  button.addEventListener('click', () => {
    const project = previewLibrary[button.dataset.preview];
    if (!project) return;
    previewOpener = button;
    currentPreview = project;
    displayPreviewSlide(0);
    previewDialog.showModal();
  });
});
const closePreview = () => previewDialog.close();
document.querySelector('.preview-close').addEventListener('click', closePreview);
previewPrevious.addEventListener('click', () => displayPreviewSlide(currentSlide - 1));
previewNext.addEventListener('click', () => displayPreviewSlide(currentSlide + 1));
previewDialog.addEventListener('click', (event) => { if (event.target === previewDialog) closePreview(); });
previewDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); displayPreviewSlide(currentSlide - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); displayPreviewSlide(currentSlide + 1); }
});
previewDialog.addEventListener('close', () => {
  currentPreview = null;
  previewOpener?.focus();
});
let touchStartX = 0;
previewImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, {passive: true});
previewImage.addEventListener('touchend', event => {
  if (!currentPreview || currentPreview.slides.length < 2) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) displayPreviewSlide(currentSlide + (delta < 0 ? 1 : -1));
}, {passive: true});
