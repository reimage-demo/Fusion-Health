"""Validate the menu's content, links, structured data, and shipped image assets."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'menu-data.json').read_text())
html = (ROOT / 'menu.html').read_text()

class MenuParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.images, self.cards = [], [], [], []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a':
            self.links.append(attrs)
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'article' and 'menuCard' in attrs.get('class', '').split():
            self.cards.append(attrs)

parser = MenuParser()
parser.feed(html)
assert len(parser.ids) == len(set(parser.ids)), 'Duplicate HTML IDs'
assert len(parser.cards) == 65
assert sum('drinkCard' in card['class'].split() for card in parser.cards) == 44
assert [len(section['items']) for section in data['sections']] == [9,10,12,11,8,1,4,10]
assert sum(bool(item.get('favorite')) for section in data['sections'] for item in section['items']) == 14
for link in parser.links:
    href = link.get('href', '')
    if href.startswith('#') and len(href) > 1:
        assert href[1:] in parser.ids, f'Broken anchor: {href}'
for image in parser.images:
    assert (ROOT / image['src']).is_file(), f'Missing image: {image["src"]}'
    assert 'alt' in image and 'width' in image and 'height' in image
    for candidate in image.get('srcset', '').split(','):
        if candidate.strip():
            assert (ROOT / candidate.strip().split()[0]).is_file()
schema = [json.loads(text) for text in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]
assert len(schema[0]['hasMenuSection']) == 8
assert len(schema[1]['associatedMedia']) == 44
assert schema[0]['hasMenuSection'][4]['hasMenuItem'][0]['offers']['price'] == '16.50'
assert schema[0]['hasMenuSection'][5]['hasMenuItem'][0]['offers']['price'] == '25.00'
assert data['juicePrices'] == [['XS',7.25],['Small',8.25],['Medium',10.25],['Large',12.25]]
assert data['shakePrices'] == [['Medium',11],['Large',12.5],['Extra-large',14.5]]
assert [item['price'] for item in data['sections'][-1]['items']] == [10,2.5,3,3,2,3,3,3,10,10]
items = {item['name']:item for section in data['sections'] for item in section['items']}
assert 'bee pollen' in items['Peanut Punch']['ingredients'] and 'honey' not in items['Peanut Punch']['ingredients']
assert 'passion fruit' in data['sections'][0]['items'][1]['ingredients']
assert 'moringa' in items['Royal Flush']['ingredients']
assert 'ashwagandha' in items['Fusion Super Shake']['ingredients']
assert 'coconut strips' not in items['Berry Fresh']['ingredients'].lower()
assert 'coconut strips' in items['Berry Fresh']['toppings'].lower()
assert 'Pistachio Bliss' in [item['name'] for item in data['sections'][2]['items']]
assert 'Maca Madness Shake' in [item['name'] for item in data['sections'][3]['items']]
assert not {'Greenobrett','Simple Beets','Spotless','Apple Power','Spring Juice','Strawberry Swing','Hot Beverages','Staple Snacks'} & items.keys()
originals = list((ROOT / 'assets/menu/originals').glob('*.png'))
assert len(originals) == 44, f'Expected 44 original images, found {len(originals)}'
assert len({hashlib.sha256(p.read_bytes()).hexdigest() for p in originals}) == 44, 'Duplicated drink image'
assert len(list((ROOT / 'assets/menu').glob('*.webp'))) == 88
print('PASS: 65 entries, 44 unique drink images, 88 responsive assets, 14 favorites, prices, recipes, anchors, and structured data.')
