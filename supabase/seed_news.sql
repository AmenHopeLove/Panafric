-- Seed Data for News Table
INSERT INTO news (title, excerpt, content, category, image_url, published_at, author)
VALUES 
(
  'Pan Afric Law Firm Expands to Nairobi', 
  'We are proud to announce the opening of our new associate office in Nairobi, Kenya, strengthening our East African presence.',
  'Pan Afric Law Firm is excited to announce the formalization of our partnership with a leading Nairobi-based legal practice, marking a significant milestone in our East African expansion strategy. This new associate office will provide our clients with direct access to Kenyan legal expertise while maintaining the high standards of Pan-African collaboration that our firm is known for.\n\nThe Nairobi office will focus on Corporate Advisory, Technology Law, and Infrastructure Finance, catering to the growing demand for cross-border legal services in the region. "Nairobi is a critical hub for African innovation and commerce," said the Managing Partner. "Our presence here ensures we are positioned to support the visionaries and investors driving the continent forward."',
  'Firm News',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
  NOW() - INTERVAL '2 days',
  'Pan Afric Law Firm'
),
(
  'New Investment Proclamation Analysis', 
  'Our team provides a detailed breakdown of the 2026 Ethiopian investment proclamation and its impact on regional trade.',
  'The 2026 Ethiopian Investment Proclamation introduces sweeping changes designed to attract foreign direct investment and streamline the regulatory environment for international firms. Our legal experts have analyzed the key provisions, including the opening of previously restricted sectors and the new incentives for export-oriented manufacturing.\n\nKey Highlights:\n1. Liberalization of logistics and retail sectors.\n2. Enhanced dispute resolution mechanisms for foreign investors.\n3. Simplified licensing procedures through the "Single Window" system.\n\nFor a full advisory report, please contact our investment law department.',
  'Legal Alerts',
  'https://images.unsplash.com/photo-1507679799987-c7377f323b51?auto=format&fit=crop&q=80&w=2000',
  NOW() - INTERVAL '1 week',
  'Pan Afric Legal Team'
),
(
  'Pan-African Arbitration Summit 2026', 
  'Join us in Addis Ababa for the leading summit on alternative dispute resolution in Africa.',
  'The upcoming Pan-African Arbitration Summit will bring together top legal minds, policy makers, and business leaders to discuss the evolution of ADR on the continent. As a silver sponsor, Pan Afric Law Firm will be leading several workshops on cross-border commercial arbitration and the implementation of the AfCFTA protocols.\n\nDate: March 15-17, 2026\nLocation: African Union Headquarters, Addis Ababa\nRegistration is now open for all member network partners.',
  'Press Releases',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000',
  NOW() - INTERVAL '3 days',
  'Media Relations'
);
