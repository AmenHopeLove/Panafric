-- Update Vision and Mission with live website content
UPDATE public.site_config 
SET value = '{"en": "To be the most trusted and respected law firm in our community, known for our legal excellence, ethical standards, and dedication to client service. Our firm aspires to be ranked among the top law firms in Ethiopia by 2035.", "am": "በሕግ ልህቀታችን፣ በሥነ-ምግባር ደረጃዎቻችን እና ለደንበኞች አገልግሎት በሚኖረን ቁርጠኝነት በማህበረሰባችን ውስጥ በጣም የታመነ እና የተከበረ የሕግ ድርጅት መሆን። ድርጅታችን እስከ 2035 ድረስ በኢትዮጵያ ውስጥ ካሉ ቀዳሚ የሕግ ድርጅቶች ተርታ ለመሰለፍ ያልማል።"}'
WHERE id = 'visionDesc';

UPDATE public.site_config 
SET value = '{"en": "To provide high-quality legal services with integrity, efficiency, and a commitment to achieving the best possible outcomes for our clients.", "am": "ከፍተኛ ጥራት ያለው የሕግ አገልግሎት በታማኝነት፣ በብቃት እና ለደንበኞቻችን የተሻለ ውጤት ለማስመዝገብ ባለን ቁርጠኝነት መስጠት።"}'
WHERE id = 'missionDesc';

-- Add History and Logo config (Idempotent Insert)
INSERT INTO public.site_config (id, value)
VALUES 
('aboutHistory', '{"en": "Founded in 2000, our law firm has grown from a small practice to a respected legal institution. Over the past decades, we have helped thousands of clients navigate complex legal challenges and achieve favorable outcomes.", "am": "በ1995 የተመሰረተው የእኛ ሕግ ፈርም፣ ከትንሽ ስራ ጀምሮ ወደ የተከበረ የሕግ ተቋም ተለውጧል። ባለፉት አስርት ዓመታት ውስጥ በርካታ ደንበኞችን በሕግ ተግዳሮቶች ውስጥ ለመርዳት እና አዎንታዊ ውጤቶችን ለማግኘት አግዝተናል።"}'::jsonb),
('logoDesc', '{"en": "Our logo represents the core values and mission of our law firm, combining two powerful symbols into one unified identity.", "am": "የእኛ አርማ የሕግ ድርጅታችንን ዋና እሴቶች እና ተልዕኮ የሚወክል ሲሆን ሁለት ኃይለኛ ምልክቶችን ወደ አንድ የተዋሃደ ማንነት ያጣምራል።"}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET value = EXCLUDED.value;
