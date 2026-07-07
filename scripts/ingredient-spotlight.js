const INGREDIENTS_URL = 'ingredients.json';
const CACHE_KEY = 'fusionHealth.ingredients.v1';
const CACHE_TIME_KEY = 'fusionHealth.ingredients.cachedAt.v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const ROTATION_DAYS = 1;
const FALLBACK_INGREDIENTS = [
  {
    name: 'Kale',
    slug: 'kale',
    description: 'Kale is a nutrient-dense leafy green commonly used in juices and smoothies at Fusion Health Juice Bar.',
    benefits: [
      'Rich in antioxidants',
      'Contains vitamins A, C, and K',
      'Contains iron and calcium'
    ],
    drinks: ['Greenobrett', 'Royal Flush']
  }
];

function readCache(){
  try{
    const cachedAt = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);
    const cached = localStorage.getItem(CACHE_KEY);
    if(!cached || Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return JSON.parse(cached);
  }catch(error){
    return null;
  }
}

function writeCache(ingredients){
  try{
    localStorage.setItem(CACHE_KEY, JSON.stringify(ingredients));
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
  }catch(error){
    // Storage can fail in private browsing; the spotlight still works without it.
  }
}

async function loadIngredients(){
  const cached = readCache();
  if(cached && Array.isArray(cached) && cached.length) return cached;

  const response = await fetch(INGREDIENTS_URL, {cache: 'no-cache'});
  if(!response.ok) throw new Error(`Could not load ${INGREDIENTS_URL}`);
  const ingredients = await response.json();
  if(!Array.isArray(ingredients) || !ingredients.length) throw new Error('Ingredient data is empty');
  writeCache(ingredients);
  return ingredients;
}

function pickIngredient(ingredients){
  const dayNumber = Math.floor(Date.now() / 86400000);
  const rotationIndex = Math.floor(dayNumber / ROTATION_DAYS) % ingredients.length;
  return ingredients[rotationIndex];
}

function updateStructuredData(ingredient){
  const existing = document.querySelector('#ingredientStructuredData');
  if(existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'ingredientStructuredData';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: ingredient.name,
    url: `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}ingredients/${ingredient.slug}/`
  });
  document.head.appendChild(script);
}

function renderIngredient(ingredient){
  const section = document.querySelector('#ingredient-spotlight');
  if(!section) return;

  const title = section.querySelector('[data-ingredient-name]');
  const description = section.querySelector('[data-ingredient-description]');
  const benefits = section.querySelector('[data-ingredient-benefits]');
  const drinks = section.querySelector('[data-ingredient-drinks]');
  const link = section.querySelector('[data-ingredient-link]');

  title.textContent = ingredient.name;
  description.textContent = `${ingredient.description} Explore how this ingredient fits into fresh juices, smoothies, green juices, sea moss drinks, and wellness blends in Hartford, CT.`;

  benefits.innerHTML = '';
  ingredient.benefits.slice(0, 3).forEach((benefit)=>{
    const item = document.createElement('li');
    item.textContent = benefit;
    benefits.appendChild(item);
  });

  drinks.textContent = ingredient.drinks?.length
    ? `Find it in: ${ingredient.drinks.join(', ')}`
    : 'Ask about adding it to your next blend.';

  link.href = `ingredients/${ingredient.slug}/`;
  link.textContent = `Explore ${ingredient.name} drinks`;

  section.classList.add('loaded');
  updateStructuredData(ingredient);
}

async function initIngredientSpotlight(){
  try{
    const ingredients = await loadIngredients();
    renderIngredient(pickIngredient(ingredients));
  }catch(error){
    renderIngredient(FALLBACK_INGREDIENTS[0]);
  }
}

initIngredientSpotlight();
