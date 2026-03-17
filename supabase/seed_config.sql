-- Initial Site Configuration
INSERT INTO site_config (id, value, category)
VALUES 
(
  'home_hero_title', 
  '{"en": "Advancing Legal Excellence Across Africa", "am": "በአፍሪካ ህጋዊ የላቀ ብቃትን ማሳደግ"}', 
  'home'
),
(
  'home_hero_subtitle', 
  '{"en": "PAN AFRIC LAW FIRM & NETWORK", "am": "ፓን አፍሪካ የህግ ድርጅት እና ኔትወርክ"}', 
  'home'
),
(
  'contact_phone', 
  '{"value": "+251 911 234 567"}', 
  'contact'
),
(
  'contact_email', 
  '{"value": "info@palf.com"}', 
  'contact'
),
(
  'footer_about', 
  '{"en": "A premier Pan-African legal network dedicated to bridging the gap between local expertise and international standards.", "am": "በአገር በቀል እውቀት እና በዓለም አቀፍ ደረጃዎች መካከል ያለውን ልዩነት ለመሙላት የተቋቋመ ግንባር ቀደም የፓን አፍሪካ የህግ መረብ።"}', 
  'footer'
)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;
