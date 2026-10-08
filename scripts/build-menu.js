// Build crawlable menu HTML from the owner-supplied menu. Run: node scripts/build-menu.js
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'menu-data.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = item => item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
const money = value => '$' + value.toFixed(2);
const all = data.sections.flatMap(section => section.items.map(item => ({...item, section:section.id})));
const illustrated = all.filter(item => item.look || item.existing);
const featured = ['Peanut Punch','Green Goodness','Immune Boost','Green Day','Banana Strawberry','Hard Rock Shake'].map(name => all.find(item => item.name === name));
const image = (item, hidden = false, feature = false, wide = false) => `<img class="${feature ? 'featuredDrinkImage' : 'menuDrinkImage'}" src="assets/menu/${slug(item)}-640.webp" srcset="assets/menu/${slug(item)}-320.webp 320w, assets/menu/${slug(item)}-640.webp 640w" sizes="${feature ? '(max-width:640px) 220px, 132px' : wide ? '(max-width:640px) calc((100vw - 28px) * .75), (max-width:760px) calc((69vw - 18px) / 2), (max-width:1260px) calc((92vw - 36px) / 3), 375px' : '(max-width:640px) calc((100vw - 28px) * .75), (max-width:760px) calc((69vw - 18px) / 2), (max-width:980px) calc((92vw - 36px) / 3), (max-width:1260px) calc((92vw - 54px) / 4), 277px'}" width="1024" height="1536" loading="lazy" decoding="async" alt="${hidden ? '' : esc(item.name === 'Kid’s Menu' ? 'Representative strawberry banana kids’ smoothie in a Fusion Health cup' : item.name + ' from Fusion Health Juice Bar')}">`;
const badge = item => `${item.favorite ? '<span class="menuLabel">★ Favorite</span>' : ''}${item.signature ? '<span class="menuLabel signatureLabel">Signature</span>' : ''}`;
const pricing = section => section.pricing ? `<ul class="menuSizePrices" aria-label="${esc(section.name)} sizes and prices">${data[section.pricing === 'shake' ? 'shakePrices' : 'juicePrices'].map(([size, price]) => `<li><span>${size}</span><strong>${money(price)}</strong></li>`).join('')}</ul>` : section.price ? `<p class="categoryPrice">${money(section.price)}${section.id === 'acai' ? ' each' : ''}</p>` : '';
const card = (item, section) => `<article class="menuCard${item.look || item.existing ? ' drinkCard' : ''}${item.favorite ? ' favorite' : ''}${item.signature ? ' signature' : ''}" id="item-${section.id === 'cold-beverages' ? 'cold-' : ''}${slug(item)}">
${(item.aliases || []).map(id => `<span id="${id}" class="menuAnchorAlias" aria-hidden="true"></span>`).join('')}
${item.look || item.existing ? image(item, false, false, section.id === 'extras') : ''}
<div class="menuCardBody">${item.favorite || item.signature ? `<div class="menuLabels">${badge(item)}</div>` : ''}<h3>${esc(item.name)}</h3>
${item.ingredients ? `<p>${item.label ? `<strong>${esc(item.label)}:</strong> ` : ''}${esc(item.ingredients)}</p>` : ''}
${item.toppings ? `<p class="menuToppings"><strong>Toppings:</strong> ${esc(item.toppings)}</p>` : ''}
${item.price != null ? `<p class="priceLine">${money(item.price)}</p>` : ''}
<a class="btn ${item.signature ? 'primary' : 'light'} order-item" data-item="${esc(section.id === 'acai' && !item.name.includes('Bowl') ? item.name + ' Acai Bowl' : item.name)}" href="#">Order<span class="sr-only"> ${esc(item.name)}</span></a></div></article>`;
const sections = data.sections.map(section => `<section class="category${section.id === 'cold-beverages' ? ' coldBeverages' : ''}" id="${section.id}" aria-labelledby="title-${section.id}">
${section.id === 'juices' ? '<span id="item-greenobrett" class="menuAnchorAlias" aria-hidden="true"></span>' : ''}
<div class="categoryTitle"><div><span class="eyebrow">${section.items.length > 1 ? section.items.length + ' choices' : 'Choose your flavor'}</span><h2 id="title-${section.id}">${esc(section.name)}</h2></div>${pricing(section)}</div>
<div class="menuGrid">${section.items.map(item => card(item, section)).join('\n')}</div></section>`).join('\n');
const featuredCard = (item, hidden) => `<article class="featuredMenuCard">${image(item, hidden, true)}<div><h3>${esc(item.name)}</h3><p>${esc(item.ingredients)}</p><a href="#item-${slug(item)}"${hidden ? ' tabindex="-1"' : ''}>Find it on the menu</a></div></article>`;
const content = `<section class="hero wrap"><div><span class="eyebrow">Fresh. Natural. Real.</span><h1>Menu built for fresh cravings.</h1><p class="lead">Fresh juices, creamy smoothies, signature shakes, acai bowls, and a little something extra.</p><div class="heroActions"><a class="btn primary order-item" data-item="Peanut Punch" href="#">Order Peanut Punch</a></div></div></section>
<div class="wrap menuContent">
<nav class="categoryNav" aria-label="Menu categories">${[['juices','Juices'],['wellness','Fusion Health'],['smoothies','Smoothies'],['energy-shakes','Shakes'],['acai','Acai Bowls'],['sea-moss','Sea Moss'],['extras','Shots, Kids & Patties'],['cold-beverages','Cold Beverages']].map(([id,label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
<aside class="menuPricing" aria-label="Drink pricing"><div><h2>Juices & smoothies</h2>${pricing({name:'Juices and smoothies',pricing:'juice'})}</div><div><h2>Energy shakes</h2>${pricing({name:'Energy shakes',pricing:'shake'})}</div><div><h2>Make it yours</h2><p>Health additions <strong>+$1.50</strong><br>Protein powder <strong>+$2.00</strong></p></div></aside>
<section class="featuredMenuShowcase" aria-labelledby="featured-menu-title"><div class="featuredMenuHead"><span class="eyebrow">In the spotlight</span><h2 id="featured-menu-title">Fresh blends, in full color.</h2><p>A taste of Fusion before you explore the full menu.</p></div><div class="featuredMenuRail" aria-label="Featured Fusion Health drinks" tabindex="0"><div class="featuredMenuTrack">${featured.map(item => featuredCard(item, false)).join('')}</div><div class="featuredMenuTrack" aria-hidden="true">${featured.map(item => featuredCard(item, true)).join('')}</div></div></section>
${sections}
</div><section class="section wrap"><div class="finalCta"><h2>Found your fresh favorite?</h2><p>Choose your blend and order from Fusion Health Juice Bar.</p><a class="btn primary order-now" href="#">Order Now</a></div></section>`;
let html = fs.readFileSync(path.join(root, 'menu.html'), 'utf8');
html = html.replace(/<body[^>]*>/, '<body class="menuPage">').replace(/<main>[\s\S]*?<\/main>/, `<main>\n${content}\n</main>`);
const schema = {'@context':'https://schema.org','@type':'Menu',name:'Fusion Health Juice Bar Menu',url:'https://fusionhealthjuicebar.com/menu.html',hasMenuSection:data.sections.map(section => ({'@type':'MenuSection',name:section.name,hasMenuItem:section.items.map(item => ({'@type':'MenuItem',name:item.name,description:[item.ingredients,item.toppings ? 'Toppings: ' + item.toppings : ''].filter(Boolean).join(' '),...(item.look || item.existing ? {image:`https://fusionhealthjuicebar.com/assets/menu/${slug(item)}-640.webp`} : {}),...((item.price ?? section.price) != null ? {offers:{'@type':'Offer',price:(item.price ?? section.price).toFixed(2),priceCurrency:'USD'}} : section.pricing ? {offers:data[section.pricing === 'shake' ? 'shakePrices' : 'juicePrices'].map(([name,price]) => ({'@type':'Offer',name,price:price.toFixed(2),priceCurrency:'USD'}))} : {})}))}))};
const gallery = {'@context':'https://schema.org','@type':'ImageGallery',name:'Fusion Health Juice Bar drinks',url:'https://fusionhealthjuicebar.com/menu.html',associatedMedia:illustrated.map(item => ({'@type':'ImageObject',name:item.name,contentUrl:`https://fusionhealthjuicebar.com/assets/menu/${slug(item)}-640.webp`,caption:item.ingredients}))};
let schemaIndex = 0;
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, () => `<script type="application/ld+json">${JSON.stringify(schemaIndex++ === 0 ? schema : gallery)}</script>`);
html = html.replace(/  <script>\s*const featuredRail[\s\S]*?<\/script>/, '  <script defer src="scripts/menu-carousel.js"></script>');
fs.writeFileSync(path.join(root, 'menu.html'), html);
const sitemapPath = path.join(root, 'image-sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g, block => {
  if (block.includes('<loc>https://fusionhealthjuicebar.com/menu.html</loc>')) {
    return `<url>\n    <loc>https://fusionhealthjuicebar.com/menu.html</loc>\n${illustrated.map(item => `    <image:image><image:loc>https://fusionhealthjuicebar.com/assets/menu/${slug(item)}-640.webp</image:loc><image:title>${esc(item.name)}</image:title><image:caption>${esc(item.ingredients)}</image:caption></image:image>`).join('\n')}\n  </url>`;
  }
  if (block.includes('<loc>https://fusionhealthjuicebar.com/</loc>')) {
    for (const item of featured) {
      const oldPath = item.name === 'Green Goodness' ? 'assets/greenobrett.png' : item.existing;
      block = block.replace(/<image:image>[\s\S]*?<\/image:image>/g, entry => entry.includes(oldPath) || entry.includes(`assets/menu/${slug(item)}-640.webp`) ? `<image:image><image:loc>https://fusionhealthjuicebar.com/${item.name === 'Green Goodness' ? `assets/menu/${slug(item)}-640.webp` : item.existing}</image:loc><image:title>${esc(item.name)}</image:title><image:caption>${esc(item.ingredients)}</image:caption></image:image>` : entry);
    }
  }
  return block;
});
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Built ${all.length} menu entries, including ${illustrated.length} illustrated drinks.`);
