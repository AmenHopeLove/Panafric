-- Add homepage hero banner configuration key if it doesn't exist
INSERT INTO public.site_config (id, value, category)
VALUES (
  'home_hero_banner',
  '{"image_url": "", "overlay_opacity": "0.6"}',
  'home'
)
ON CONFLICT (id) DO NOTHING;
