// The native <details> component provides keyboard and screen-reader support.
// We only keep one project record open at a time so the archive reads like a file index.
const records = Array.from(document.querySelectorAll('.case-file'));
records.forEach((record) => {
  record.addEventListener('toggle', () => {
    if (!record.open) return;
    records.forEach((other) => { if (other !== record && other.open) other.open = false; });
  });
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');
const closeMenu = () => {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
};
menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (menu.classList.contains('is-open') && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

const currentYear = document.getElementById('year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());


// Local, offline visual archive: interface studies, not verified product screenshots.
const previewLibrary = {
  deped: {title: 'DepEd Learning Management System', slides: [
    ['assets/previews/deped-lms-source.png','Browseable source-based prototype exhibit',true],
    ['assets/previews/deped-lms.png','Illustrative teacher workspace concept',false]
  ]},
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
  const [src, label, isArchive] = slides[currentSlide];
  previewImage.src = src;
  previewImage.alt = `${currentPreview.title}: ${label} — ${isArchive ? "reconstructed from original uploaded source" : "illustrative interface study"}`;
  previewTitle.textContent = currentPreview.title;
  previewDescription.textContent = `${label} · ${isArchive ? "reconstruction from original PHP files" : "illustrative snapshot with sample data"}`;
  document.querySelector('.preview-disclaimer').textContent = isArchive ? 'SOURCE-BASED RECONSTRUCTION / READ-ONLY' : 'CONCEPT PREVIEW / NOT AN ACTUAL SCREENSHOT';
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
    displayPreviewSlide(Number(button.dataset.slide || 0));
    if (typeof previewDialog.showModal === 'function') previewDialog.showModal();
    else previewDialog.setAttribute('open', '');
  });
});
const closePreview = () => {
  if (typeof previewDialog.close === 'function') previewDialog.close();
  else previewDialog.removeAttribute('open');
  if (previewOpener) previewOpener.focus();
};
document.querySelector('.preview-close').addEventListener('click', closePreview);
previewPrevious.addEventListener('click', () => displayPreviewSlide(currentSlide - 1));
previewNext.addEventListener('click', () => displayPreviewSlide(currentSlide + 1));
previewDialog.addEventListener('click', (event) => { if (event.target === previewDialog) closePreview(); });
previewDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); displayPreviewSlide(currentSlide - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); displayPreviewSlide(currentSlide + 1); }
});
previewDialog.addEventListener('close', () => { currentPreview = null; });
let touchStartX = 0;
previewImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, {passive: true});
previewImage.addEventListener('touchend', event => {
  if (!currentPreview || currentPreview.slides.length < 2) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) displayPreviewSlide(currentSlide + (delta < 0 ? 1 : -1));
}, {passive: true});
