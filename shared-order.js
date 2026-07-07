const modal = document.querySelector('#orderModal');
const orderText = document.querySelector('#orderText');
const doorDashLink = document.querySelector('#doorDashLink');
const uberLink = document.querySelector('#uberLink');
const closeButton = document.querySelector('.modalClose');
let lastFocusedElement = null;
const DELIVERY_LINKS = window.DELIVERY || {
  doordash: 'https://www.doordash.com/store/fusion-health-juice-bar-hartford-24830459/43583166/',
  ubereats: 'https://www.ubereats.com/store/fusion-health-juice-bar/TKQJd6HRQci0r_1rVjnkiQ'
};
const ITEM_LINKS = {
  'Peanut Punch': {
    doordash: 'https://www.doordash.com/store/fusion-health-juice-bar-hartford-24830459/43583166/?srsltid=AfmBOopNa31vRIURECxJB8kQ0VTXHdDYrIHtSKNDiQ2g-WhJOVZjobBy',
    ubereats: 'https://www.ubereats.com/store/fusion-health-juice-bar/TKQJd6HRQci0r_1rVjnkiQ?diningMode=DELIVERY&mod=quickView&modctx=%257B%2522storeUuid%2522%253A%25224ca40977-a1d1-41c8-b4af-fd6b5639e489%2522%252C%2522sectionUuid%2522%253A%252272e52129-0f84-4fc2-b0f7-670ec1067dfa%2522%252C%2522subsectionUuid%2522%253A%2522ebda8986-7816-471e-a8b9-30f6cb678fde%2522%252C%2522itemUuid%2522%253A%2522fc1d054d-fdae-4e4c-81bb-cd409e56ff7f%2522%252C%2522showSeeDetailsCTA%2522%253Atrue%257D&ps=1'
  }
};

function getToastViewport(){
  let viewport = document.querySelector('.toastViewport');
  if(viewport) return viewport;
  viewport = document.createElement('div');
  viewport.className = 'toastViewport';
  viewport.setAttribute('aria-live', 'polite');
  viewport.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(viewport);
  return viewport;
}

function showToast(message){
  const viewport = getToastViewport();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  viewport.appendChild(toast);
  requestAnimationFrame(()=>toast.classList.add('show'));
  window.setTimeout(()=>{
    toast.classList.remove('show');
    window.setTimeout(()=>toast.remove(), 220);
  }, 2400);
}

function closeOrderModal(){
  if(!modal) return;
  modal.classList.remove('open');
  modal.dataset.state = 'closed';
  document.body.classList.remove('has-modal');
  if(lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
    lastFocusedElement.focus({preventScroll:true});
  }
  lastFocusedElement = null;
}

function doorDashItemUrl(item){
  return DELIVERY_LINKS.doordash;
}

function itemUrl(base, item){
  if(item && ITEM_LINKS[item]){
    if(base === DELIVERY_LINKS.doordash) return ITEM_LINKS[item].doordash;
    if(base === DELIVERY_LINKS.ubereats) return ITEM_LINKS[item].ubereats;
  }
  if(!item) return base;
  if(base.includes('doordash.com/store/')){
    return doorDashItemUrl(item);
  }
  return base;
}

function openOrderModal(item){
  if(!modal) return;
  lastFocusedElement = document.activeElement;
  const label = item ? ` for ${item}` : '';
  orderText.textContent = `Choose DoorDash or Uber Eats${label}. Both buttons open Fusion Health Juice Bar directly.`;
  doorDashLink.href = itemUrl(DELIVERY_LINKS.doordash, item);
  uberLink.href = itemUrl(DELIVERY_LINKS.ubereats, item);
  modal.classList.add('open');
  modal.dataset.state = 'open';
  document.body.classList.add('has-modal');
  showToast(item ? `${item} ready to order` : 'Choose a delivery platform');
  closeButton?.focus({preventScroll:true});
}

document.querySelectorAll('.order-now').forEach((link)=>{
  link.addEventListener('click',(event)=>{
    event.preventDefault();
    openOrderModal('');
  });
});

document.querySelectorAll('.order-item').forEach((link)=>{
  link.addEventListener('click',(event)=>{
    event.preventDefault();
    const item = link.dataset.item || link.textContent.trim();
    openOrderModal(item);
  });
});

closeButton?.addEventListener('click', closeOrderModal);
modal?.addEventListener('click',(event)=>{
  if(event.target === modal) closeOrderModal();
});

function closeMobileMenu(){
  const mobileMenu = document.querySelector('.mobileMenu');
  const menuButton = document.querySelector('.menuBtn');
  mobileMenu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}

document.addEventListener('keydown',(event)=>{
  if(event.key === 'Escape'){
    closeOrderModal();
    closeMobileMenu();
  }
});

document.addEventListener('click',(event)=>{
  const mobileMenu = document.querySelector('.mobileMenu');
  const menuButton = document.querySelector('.menuBtn');
  if(!mobileMenu?.classList.contains('open')) return;
  if(mobileMenu.contains(event.target) || menuButton?.contains(event.target)) return;
  closeMobileMenu();
});

document.querySelectorAll('.mobileMenu a').forEach((link)=>{
  link.addEventListener('click', closeMobileMenu);
});
