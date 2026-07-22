-- Create default configuration rows for all website page banners
INSERT INTO public.site_config (id, value, category)
VALUES 
(
  'home_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'home'
),
(
  'about_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'about'
),
(
  'practice_areas_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'practice-areas'
),
(
  'insights_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'insights'
),
(
  'news_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'news'
),
(
  'network_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'network'
)
ON CONFLICT (id) DO NOTHING;
