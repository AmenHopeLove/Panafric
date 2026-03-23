const fs = require('fs');
let data = fs.readFileSync('unsplash_urls.js', 'utf16le');
if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);

// Ensure the start and end brackets exist
if (!data.trim().startsWith('const unsplashPool')) {
    data = `const unsplashPool = [\n${data}\n];`;
}

const output = `export ${data}

export function getRandomUnsplashImage(cat: string) { 
    const safeCat = cat ? cat.toLowerCase().trim() : 'corporate'; 
    const pool = unsplashPool.find(x => x.category === safeCat) || unsplashPool[Math.floor(Math.random() * unsplashPool.length)]; 
    return pool.urls[Math.floor(Math.random() * pool.urls.length)] || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800'; 
}
`;
fs.writeFileSync('src/lib/unsplash-pool.ts', output, 'utf8');
