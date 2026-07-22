-- Add homepage video URL configuration key if it doesn't exist
INSERT INTO public.site_config (id, value, category)
VALUES (
  'home_video_url',
  '{"url": "", "title": "Watch Our Story: Legal Excellence Across Africa"}',
  'home'
)
ON CONFLICT (id) DO NOTHING;
