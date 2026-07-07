const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ingredients = JSON.parse(fs.readFileSync(path.join(root, 'ingredients.json'), 'utf8'));
const outDir = path.join(root, 'ingredients');
const siteUrl = 'https://fusionhealthjuices.com';
const businessName = 'Fusion Health Juice Bar';
const address = '879 New Britain Ave, Hartford, CT 06106';
const phone = '+18604610575';
const displayPhone = '(860) 461-0575';
const seoKeywords = 'fresh juices Hartford CT, smoothies Hartford CT, juice bar Hartford CT, peanut punch Hartford CT, sea moss juice Hartford, Jamaican juice bar Hartford, green juice Hartford CT';

function escapeHtml(value){
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function schema(value){
  return JSON.stringify(value).replaceAll('</', '<\\/');
}

function pageFor(ingredient){
  const benefits = ingredient.benefits.map((benefit)=>`<li>${escapeHtml(benefit)}</li>`).join('');
  const title = `${ingredient.name} Drinks in Hartford CT | Fusion Health Juice Bar`;
  const description = `${ingredient.name} in fresh juices, smoothies, wellness drinks, and Jamaican-inspired blends at Fusion Health Juice Bar in Hartford, CT.`;
  const canonical = `${siteUrl}/ingredients/${ingredient.slug}/`;
  const drinkCards = ingredient.drinks.map((drink)=>`<article class="menuCard"><h3>${escapeHtml(drink)}</h3><p>${escapeHtml(ingredient.name)} is featured in or pairs naturally with ${escapeHtml(drink)}. Visit the Hartford menu to explore fresh juices, smoothies, sea moss drinks, and wellness add-ins.</p><a class="btn light" href="../../menu.html">View Menu</a></article>`).join('');
  const faqItems = [
    {
      q: `How is ${ingredient.name} used in drinks?`,
      a: `${ingredient.name} is popular in fresh juices, smoothies, shakes, or wellness add-ins for flavor, texture, and nutrients that support everyday wellness.`
    },
    {
      q: `Which Fusion Health drinks include ${ingredient.name}?`,
      a: `Menu items such as ${ingredient.drinks.join(', ')} feature ${ingredient.name} or pair naturally with it. Ask the team about current options and add-ins.`
    },
    {
      q: `Is ${ingredient.name} a medical treatment?`,
      a: `No. Fusion Health Juice Bar shares ingredient information for general wellness education only, not medical advice.`
    },
    {
      q: `Where can I find ${ingredient.name} drinks in Hartford, CT?`,
      a: `${businessName} serves fresh juices, smoothies, and wellness drinks at ${address}.`
    }
  ];
  const faqCards = faqItems.map((item)=>`<article class="menuCard"><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`).join('');
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'Restaurant'],
        '@id': `${siteUrl}/#localbusiness`,
        name: businessName,
        url: siteUrl,
        telephone: phone,
        image: `${siteUrl}/logo.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '879 New Britain Ave',
          addressLocality: 'Hartford',
          addressRegion: 'CT',
          postalCode: '06106',
          addressCountry: 'US'
        },
        servesCuisine: ['Fresh juices', 'Smoothies', 'Jamaican-inspired drinks', 'Wellness drinks'],
        sameAs: [
          'https://www.instagram.com/fusionhealthjuices/',
          'https://www.facebook.com/fusionhealthjuicebar/',
          'https://www.tiktok.com/@fusionhealthjuicebar?is_from_webapp=1&sender_device=pc'
        ]
      },
      {
        '@type': 'DefinedTerm',
        name: ingredient.name,
        description: ingredient.description,
        url: canonical,
        inDefinedTermSet: `${siteUrl}/ingredients/`
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item)=>({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        }))
      }
    ]
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="keywords" content="${escapeHtml(`${ingredient.name} drinks Hartford CT, ${ingredient.name} juice Hartford, ${seoKeywords}`)}" />
  <meta name="geo.region" content="US-CT" />
  <meta name="geo.placename" content="Hartford" />
  <meta name="geo.position" content="41.7384;-72.7138" />
  <meta name="ICBM" content="41.7384, -72.7138" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}/logo.png" />
  <meta property="og:image:alt" content="${businessName} logo for healthy juices and smoothies in Hartford CT" />
  <meta property="og:site_name" content="${businessName}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${siteUrl}/logo.png" />
  <meta name="twitter:image:alt" content="${businessName} logo for healthy juices and smoothies in Hartford CT" />
  <link rel="stylesheet" href="../../styles.css" />
  <script type="application/ld+json">${schema(pageSchema)}</script>
</head>
<body>
  <header class="top">
    <div class="wrap nav">
      <a class="brand" href="../../index.html"><img decoding="async" src="../../logo-small.webp" width="66" height="66" alt="Fusion Health Juice Bar logo for healthy juices smoothies and shakes in Hartford CT"><span>Fusion Health Juice Bar</span></a>
      <nav class="links" aria-label="Main navigation">
        <a href="../../menu.html">Menu</a>
        <a href="../../index.html#peanut-punch">Peanut Punch</a>
        <a href="../../location.html">Location</a>
        <a class="btn primary" href="../../menu.html">Order Now</a>
      </nav>
      <button class="menuBtn" type="button" aria-label="Open navigation" aria-controls="mobileMenu" aria-expanded="false" onclick="const menu=this.closest('.top').querySelector('.mobileMenu'); const isOpen=menu.classList.toggle('open'); this.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); this.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>
    <nav class="mobileMenu" id="mobileMenu" aria-label="Mobile navigation">
      <a href="../../about.html">About</a>
      <a href="../../menu.html">Menu</a>
      <a href="../../index.html#peanut-punch">Peanut Punch</a>
      <a href="../../location.html">Location</a>
      <a class="btn primary" href="../../menu.html">Order Now</a>
    </nav>
  </header>
  <main>
    <section class="hero wrap">
      <div>
        <h1>${escapeHtml(ingredient.name)} drinks in Hartford, CT.</h1>
        <p class="lead">${escapeHtml(ingredient.description)} Find ${escapeHtml(ingredient.name.toLowerCase())} in fresh juices, smoothies, wellness drinks, and Jamaican-inspired blends at ${businessName}.</p>
        <div class="heroActions">
          <a class="btn primary" href="../../menu.html">Explore the Menu</a>
          <a class="btn light" href="../../index.html#ingredient-spotlight">Ingredient Spotlight</a>
          <a class="btn light" href="../../location.html">Visit Hartford Location</a>
        </div>
      </div>
    </section>
    <section class="section wrap">
      <div class="ingredientPanel loaded">
        <div>
          <span class="eyebrow">Fresh ingredient note</span>
          <h2>${escapeHtml(ingredient.name)} in fresh blends</h2>
          <p>${escapeHtml(ingredient.description)}</p>
          <p class="ingredientStory">Chosen for flavor, body, and the kind of natural lift people come to a neighborhood juice bar for.</p>
          <p class="ingredientDrinks">Ingredients may support everyday routines, but drinks are not medical treatments.</p>
        </div>
        <div>
          <h3>Why customers ask for it</h3>
          <ul>${benefits}</ul>
        </div>
      </div>
    </section>
    <section class="section wrap">
      <div class="sectionHead">
        <h2>Drinks with ${escapeHtml(ingredient.name)}</h2>
        <p>These menu items feature ${escapeHtml(ingredient.name)} or pair naturally with its flavor and wellness profile.</p>
      </div>
      <div class="menuGrid">${drinkCards}</div>
    </section>
    <section class="section wrap">
      <div class="sectionHead">
        <h2>${escapeHtml(ingredient.name)} FAQ</h2>
      </div>
      <div class="menuGrid">${faqCards}</div>
    </section>
    <section class="section wrap">
      <div class="finalCta">
        <h2>Visit Fusion Health Juice Bar in Hartford</h2>
        <p>${address}. Call <a href="tel:${phone}">${displayPhone}</a> or browse fresh juices, smoothies, peanut punch, sea moss drinks, and Jamaican-inspired wellness beverages.</p>
        <a class="btn primary" href="../../menu.html">View Menu</a>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="wrap">
      <div class="footerGrid">
        <div class="footerBrand"><img decoding="async" src="../../logo-small.webp" width="66" height="66" loading="lazy" alt="Fusion Health Juice Bar logo for healthy juices smoothies and shakes in Hartford CT"><div><h2>Fusion Health Juice Bar</h2><p>Fresh juices, smoothies, sea moss drinks, Jamaican-inspired wellness beverages, and Connecticut's best Peanut Punch.</p></div></div>
        <div><h3>Explore</h3><a class="footerLink" href="../../index.html">Home</a><a class="footerLink" href="../../about.html">About</a><a class="footerLink" href="../../menu.html">Menu</a><a class="footerLink" href="../../location.html">Location</a></div>
        <div><h3>Visit</h3><p>879 New Britain Ave<br>Hartford, CT 06106</p><p style="margin-top:8px"><a href="tel:${phone}">${displayPhone}</a></p><a class="footerLink" href="${siteUrl}">Website</a></div>
        <div><h3>Service Areas</h3><p>Hartford, West Hartford, New Britain, Wethersfield, East Hartford, Bloomfield, Windsor, Manchester, and nearby Connecticut communities.</p></div>
      </div>
      <div class="socialFollow" aria-labelledby="social-follow-title"><h3 id="social-follow-title">Follow us</h3><p>Keep up with fresh juices, smoothies, Peanut Punch, SeaMoss products, specials, and behind-the-counter Fusion Health moments.</p><div class="socialButtons"><a class="socialButton instagram" href="https://www.instagram.com/fusionhealthjuices/" target="_blank" rel="noopener" aria-label="Follow Fusion Health Juice Bar on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg></a><a class="socialButton facebook" href="https://www.facebook.com/fusionhealthjuicebar/" target="_blank" rel="noopener" aria-label="Follow Fusion Health Juice Bar on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.1 0-5 1.9-5 5v3H6v4h3v4h4v-4h3.2l.8-4h-4V9c0-.7.3-1 1-1z"></path></svg></a><a class="socialButton tiktok" href="https://www.tiktok.com/@fusionhealthjuicebar?is_from_webapp=1&amp;sender_device=pc" target="_blank" rel="noopener" aria-label="Follow Fusion Health Juice Bar on TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3c.4 3 2.1 4.9 5 5.2v3.3c-1.9-.1-3.5-.7-5-1.8V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.5a2 2 0 1 0 1.4 1.9V3h2.6z"></path></svg></a></div></div>
      <div class="footerSeo">Fusion Health Juice Bar proudly serves Hartford, West Hartford, New Britain, Wethersfield, East Hartford, Bloomfield, Windsor, Manchester, and surrounding Connecticut areas with fresh juices, smoothies, peanut punch, green juices, sea moss drinks, and Jamaican-inspired wellness beverages.</div>
      <div class="footerCredit">Powered by <a href="https://reimagebs.com/" target="_blank" rel="noopener">REIMAGE BUSINESS SOLUTIONS</a></div>
      <div class="footerBottom"><span>&copy; 2026 Fusion Health Juice Bar. All rights reserved.</span><span>879 New Britain Ave, Hartford, CT 06106</span></div>
    </div>
  </footer>
</body>
</html>
`;
}

fs.mkdirSync(outDir, {recursive: true});
for(const ingredient of ingredients){
  const dir = path.join(outDir, ingredient.slug);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageFor(ingredient));
}
