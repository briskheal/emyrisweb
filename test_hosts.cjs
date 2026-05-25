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
  const html = await fetchHtml('https://emyrisbio.com/blog');
  const $ = cheerio.load(html);
  
  console.log('--- Listing Page Images ---');
  $('img').each((i, el) => {
    console.log($(el).attr('src'));
  });
}

run().catch(console.error);
