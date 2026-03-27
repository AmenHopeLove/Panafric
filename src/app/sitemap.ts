export default async function sitemap() {
  const baseUrl = 'https://palf-web-platform.vercel.app';

  const routes = [
    '',
    '/about',
    '/practice-areas',
    '/insights',
    '/network',
    '/careers',
    '/contact',
    '/news',
    '/ai-assistant'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
