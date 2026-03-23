const https = require('https');
const categories = ['health', 'science', 'nature', 'technology', 'finance', 'law', 'education', 'africa', 'startup', 'industry', 'city', 'team', 'corporate', 'meeting', 'infrastructure'];

async function fetchIDs(category) {
    return new Promise(resolve => {
        https.get(`https://unsplash.com/napi/search/photos?query=${category}&per_page=5`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const validUrls = JSON.parse(data).results.map(r => r.urls.regular);
                    console.log(`{ category: '${category}', urls: [\n` + validUrls.map(url => `  "${url}"`).join(',\n') + '\n] },');
                } catch(e) { console.log('error on', category) }
                resolve();
            });
        });
    });
}
async function run() {
    console.log("const unsplashPool = [");
    for (let c of categories) await fetchIDs(c);
    console.log("];");
}
run();
