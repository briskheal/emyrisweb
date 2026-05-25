const https = require('https');
const cheerio = require('cheerio');

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchHtml('https://emyrisbio.com/single-blog?id=18');
  const $ = cheerio.load(html);
  
  console.log('--- Attributes of all images ---');
  $('img').each((i, el) => {
    console.log(`Image ${i}:`);
    for (const attr of Object.keys(el.attribs)) {
      console.log(`  ${attr}: ${el.attribs[attr]}`);
    }
  });
}

run().catch(console.error);
