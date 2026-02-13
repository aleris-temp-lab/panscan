-- ============================================
-- 005: Seed Data (Demo/Initial Data)
-- Run after all other migrations
-- ============================================

-- ==================
-- SPECIALTIES
-- ==================

INSERT INTO specialties (slug, name_sv, name_no, name_da, name_en, description_sv, description_no, description_da, description_en, icon, sort_order) VALUES
('health-tests', 'Hälsotester', 'Helsetester', 'Sundhedstests', 'Health Tests',
 'Blodprover, DEXA-skanningar och hälsoundersökningar',
 'Blodprøver, DEXA-skanninger og helseundersøkelser',
 'Blodprøver, DEXA-scanninger og sundhedsundersøgelser',
 'Blood tests, DEXA scans, and health checkups',
 'vial', 1),

('plastic-surgery', 'Plastikkirurgi', 'Plastikkirurgi', 'Plastikkirurgi', 'Plastic Surgery',
 'Estetiska och rekonstruktiva ingrepp',
 'Estetiske og rekonstruktive inngrep',
 'Æstetiske og rekonstruktive indgreb',
 'Aesthetic and reconstructive procedures',
 'user-md', 2),

('ophthalmology', 'Ögonsjukvård', 'Øyehelsetjenester', 'Øjenpleje', 'Ophthalmology',
 'Synundersökningar och ögonbehandlingar',
 'Synundersøkelser og øyebehandlinger',
 'Synsundersøgelser og øjenbehandlinger',
 'Eye exams and treatments',
 'eye', 3),

('psychology', 'Digital psykologi', 'Digital psykologi', 'Digital psykologi', 'Digital Psychology',
 'Terapi och mental hälsa online',
 'Terapi og mental helse online',
 'Terapi og mental sundhed online',
 'Online therapy and mental health',
 'brain', 4);

-- ==================
-- SKILLS
-- ==================

INSERT INTO skills (specialty_id, slug, name, description, requires_certification) VALUES
-- Health tests skills
((SELECT id FROM specialties WHERE slug = 'health-tests'), 'phlebotomy', 'Phlebotomy', 'Blood draw certification', true),
((SELECT id FROM specialties WHERE slug = 'health-tests'), 'dexa-operation', 'DEXA Operation', 'DEXA scanner operation', true),
((SELECT id FROM specialties WHERE slug = 'health-tests'), 'health-coaching', 'Health Coaching', 'Lifestyle and health guidance', false),

-- Psychology skills
((SELECT id FROM specialties WHERE slug = 'psychology'), 'cbt-therapy', 'CBT Therapy', 'Cognitive behavioral therapy', true),
((SELECT id FROM specialties WHERE slug = 'psychology'), 'counseling', 'Counseling', 'General counseling', true);

-- ==================
-- CLINICS
-- ==================

INSERT INTO clinics (name, slug, city, country, street_address, postal_code, timezone) VALUES
('Aleris Stockholm City', 'stockholm-city', 'Stockholm', 'SE', 'Sveavägen 125', '113 56', 'Europe/Stockholm'),
('Aleris Göteborg', 'goteborg', 'Göteborg', 'SE', 'Kungsportsavenyen 32', '411 36', 'Europe/Stockholm'),
('Aleris Malmö', 'malmo', 'Malmö', 'SE', 'Stortorget 8', '211 22', 'Europe/Stockholm'),
('Aleris Oslo', 'oslo', 'Oslo', 'NO', 'Karl Johans gate 45', '0162', 'Europe/Oslo'),
('Aleris Bergen', 'bergen', 'Bergen', 'NO', 'Bryggen 12', '5003', 'Europe/Oslo'),
('Aleris København', 'kobenhavn', 'København', 'DK', 'Strøget 52', '1160', 'Europe/Copenhagen');

-- ==================
-- SERVICES (Health Tests)
-- ==================

INSERT INTO services (specialty_id, slug, name_sv, name_no, name_da, name_en, short_description_sv, short_description_no, short_description_da, short_description_en, price_sek, price_nok, price_dkk, delivery_type, duration_minutes, is_published, sort_order) VALUES
((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'basic-blood-panel',
 'Bas blodpanel', 'Basis blodpanel', 'Basis blodpanel', 'Basic Blood Panel',
 '15 viktiga biomarkörer för din hälsa',
 '15 viktige biomarkører for din helse',
 '15 vigtige biomarkører for dit helbred',
 '15 essential biomarkers for your health',
 1495, 1695, 1195, 'physical', 15, true, 1),

((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'comprehensive-blood-panel',
 'Omfattande blodpanel', 'Omfattende blodpanel', 'Omfattende blodpanel', 'Comprehensive Blood Panel',
 '40+ biomarkörer för djupgående insikt',
 '40+ biomarkører for dyptgående innsikt',
 '40+ biomarkører for dybdegående indsigt',
 '40+ biomarkers for in-depth insights',
 2995, 3395, 2395, 'physical', 20, true, 2),

((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'dexa-body-scan',
 'DEXA kroppsanalys', 'DEXA kroppsanalyse', 'DEXA kropsanalyse', 'DEXA Body Scan',
 'Exakt mätning av kroppssammansättning',
 'Nøyaktig måling av kroppssammensetning',
 'Præcis måling af kropssammensætning',
 'Precise body composition measurement',
 1995, 2295, 1595, 'physical', 30, true, 3),

((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'health-consultation-video',
 'Hälsokonsultation (video)', 'Helsekonsultasjon (video)', 'Sundhedskonsultation (video)', 'Health Consultation (Video)',
 'Resultatgenomgång med läkare online',
 'Resultatgjennomgang med lege online',
 'Resultatgennemgang med læge online',
 'Results review with doctor online',
 995, 1095, 795, 'video', 30, true, 4);

-- ==================
-- PROGRAMS
-- ==================

INSERT INTO programs (specialty_id, slug, name_sv, name_no, name_da, name_en, description_sv, description_no, description_da, description_en, price_monthly_sek, price_monthly_nok, price_monthly_dkk, duration_months, features, is_published, sort_order) VALUES
((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'weight-management',
 'Viktkontroll', 'Vektkontroll', 'Vægtkontrol', 'Weight Management',
 'Personlig vägledning för hållbar viktnedgång',
 'Personlig veiledning for bærekraftig vekttap',
 'Personlig vejledning til bæredygtigt vægttab',
 'Personalized guidance for sustainable weight loss',
 499, 549, 399, 6,
 '["Månatlig DEXA-skanning", "Kostplan", "Träningsvägledning", "Chat med coach"]',
 true, 1),

((SELECT id FROM specialties WHERE slug = 'health-tests'),
 'preventive-health',
 'Förebyggande hälsa', 'Forebyggende helse', 'Forebyggende sundhed', 'Preventive Health',
 'Årlig uppföljning för långsiktig hälsa',
 'Årlig oppfølging for langsiktig helse',
 'Årlig opfølgning for langsigtet sundhed',
 'Annual follow-up for long-term health',
 299, 349, 249, NULL,
 '["Årlig blodpanel", "Årlig DEXA", "Hälsorapport", "AI-analys"]',
 true, 2);

-- ==================
-- LAB TESTS REFERENCE
-- ==================

INSERT INTO lab_tests (code, name_sv, name_no, name_da, name_en, unit, reference_low_male, reference_high_male, reference_low_female, reference_high_female, category) VALUES
('HBA1C', 'HbA1c (långtidssocker)', 'HbA1c (langtidsblodsukker)', 'HbA1c (langtidsblodsukker)', 'HbA1c (long-term blood sugar)', 'mmol/mol', 20, 42, 20, 42, 'metabolic'),
('GLUC', 'Glukos (fasteblodsocker)', 'Glukose (fastende)', 'Glukose (fastende)', 'Glucose (fasting)', 'mmol/L', 4.0, 6.0, 4.0, 6.0, 'metabolic'),
('CHOL', 'Totalkolesterol', 'Totalkolesterol', 'Totalkolesterol', 'Total Cholesterol', 'mmol/L', NULL, 5.0, NULL, 5.0, 'lipids'),
('HDL', 'HDL-kolesterol', 'HDL-kolesterol', 'HDL-kolesterol', 'HDL Cholesterol', 'mmol/L', 1.0, NULL, 1.2, NULL, 'lipids'),
('LDL', 'LDL-kolesterol', 'LDL-kolesterol', 'LDL-kolesterol', 'LDL Cholesterol', 'mmol/L', NULL, 3.0, NULL, 3.0, 'lipids'),
('TRIG', 'Triglycerider', 'Triglyserider', 'Triglycerider', 'Triglycerides', 'mmol/L', NULL, 1.7, NULL, 1.7, 'lipids'),
('TSH', 'TSH (sköldkörtel)', 'TSH (skjoldbruskkjertel)', 'TSH (skjoldbruskkirtel)', 'TSH (thyroid)', 'mIU/L', 0.4, 4.0, 0.4, 4.0, 'thyroid'),
('FT4', 'Fritt T4', 'Fritt T4', 'Frit T4', 'Free T4', 'pmol/L', 12, 22, 12, 22, 'thyroid'),
('VITD', 'Vitamin D', 'Vitamin D', 'Vitamin D', 'Vitamin D', 'nmol/L', 50, 125, 50, 125, 'vitamins'),
('FERR', 'Ferritin (järndepå)', 'Ferritin (jernlager)', 'Ferritin (jernlager)', 'Ferritin (iron stores)', 'µg/L', 30, 300, 15, 150, 'blood'),
('HB', 'Hemoglobin', 'Hemoglobin', 'Hæmoglobin', 'Hemoglobin', 'g/L', 130, 170, 120, 150, 'blood'),
('CRP', 'CRP (inflammation)', 'CRP (inflammasjon)', 'CRP (inflammation)', 'CRP (inflammation)', 'mg/L', NULL, 5, NULL, 5, 'inflammation'),
('CREA', 'Kreatinin (njurfunktion)', 'Kreatinin (nyrefunksjon)', 'Kreatinin (nyrefunktion)', 'Creatinine (kidney function)', 'µmol/L', 60, 105, 45, 90, 'kidney'),
('ALT', 'ALT (leverfunktion)', 'ALT (leverfunksjon)', 'ALT (leverfunktion)', 'ALT (liver function)', 'U/L', NULL, 45, NULL, 35, 'liver'),
('PSA', 'PSA (prostata)', 'PSA (prostata)', 'PSA (prostata)', 'PSA (prostate)', 'µg/L', NULL, 4.0, NULL, NULL, 'male_health');
