(() => {
  const rail = document.querySelector('.featuredMenuRail');
  if (!rail) return;
  const mobile = window.matchMedia('(max-width:640px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  let advanceTimer;
  let resumeTimer;
  function start() {
    clearInterval(advanceTimer);
    if (!mobile.matches || reducedMotion.matches || document.hidden || rail.contains(document.activeElement)) return;
    advanceTimer = setInterval(() => {
      const cards = [...rail.querySelector('.featuredMenuTrack').children];
      const offsets = cards.map(card => card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - 14);
      const next = offsets.find(left => left > rail.scrollLeft + 8) ?? offsets[0];
      rail.scrollTo({left:Math.max(0, next),behavior:'smooth'});
    }, 3500);
  }
  function pause() {
    clearInterval(advanceTimer);
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(start, 6000);
  }
  rail.addEventListener('touchstart', pause, {passive:true});
  rail.addEventListener('pointerdown', pause);
  rail.addEventListener('focusin', pause);
  rail.addEventListener('focusout', pause);
  mobile.addEventListener('change', start);
  reducedMotion.addEventListener('change', start);
  document.addEventListener('visibilitychange', start);
  start();
})();
