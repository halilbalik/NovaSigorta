-- Nova Sigorta Örnek Veri Scripti
-- PgAdmin'de çalıştırın

-- Daha fazla sigorta türü ekleyelim
INSERT INTO "Insurances" ("Name", "Description", "IsActive", "CreatedAt") VALUES
('Trafik Sigortası', 'Zorunlu trafik sigortası', TRUE, NOW()),
('Dask Sigortası', 'Doğal afet sigortası', TRUE, NOW()),
('Hayat Sigortası', 'Kişisel hayat sigortası', TRUE, NOW()),
('Seyahat Sigortası', 'Yurt içi ve yurt dışı seyahat sigortası', TRUE, NOW()),
('İşveren Sorumluluk Sigortası', 'İşveren mali sorumluluk sigortası', FALSE, NOW()), -- Pasif örneği
('Mesleki Sorumluluk Sigortası', 'Mesleki hata ve kusurlar sigortası', TRUE, NOW()),
('Yangın Sigortası', 'İşyeri yangın sigortası', TRUE, NOW()),
('Nakliyat Sigortası', 'Eşya nakliyat sigortası', TRUE, NOW());

-- Örnek başvurular ekleyelim
INSERT INTO "Applications" ("InsuranceId", "SelectedDate", "Phone", "CreatedAt") VALUES
-- Kasko başvuruları
(1, '2025-02-15', '05321234567', '2025-01-20 10:30:00'),
(1, '2025-02-20', '05339876543', '2025-01-22 14:15:00'),
(1, '2025-03-01', '05355678901', '2025-01-25 09:45:00'),

-- Konut sigortası başvuruları
(2, '2025-02-10', '05441234567', '2025-01-21 11:20:00'),
(2, '2025-02-25', '05459876543', '2025-01-23 16:30:00'),
(2, '2025-03-05', '05465678901', '2025-01-26 13:10:00'),

-- Sağlık sigortası başvuruları
(3, '2025-02-12', '05531234567', '2025-01-22 08:45:00'),
(3, '2025-02-18', '05549876543', '2025-01-24 12:20:00'),

-- Trafik sigortası başvuruları (yeni eklenen)
(4, '2025-02-08', '05621234567', '2025-01-23 15:30:00'),
(4, '2025-02-22', '05639876543', '2025-01-25 10:15:00'),

-- Hayat sigortası başvuruları
(6, '2025-02-28', '05721234567', '2025-01-24 14:45:00'),
(6, '2025-03-10', '05739876543', '2025-01-26 11:30:00'),

-- Seyahat sigortası başvuruları
(7, '2025-02-05', '05821234567', '2025-01-25 09:20:00'),
(7, '2025-02-14', '05839876543', '2025-01-27 16:45:00'),

-- Mesleki sorumluluk başvuruları
(9, '2025-03-15', '05921234567', '2025-01-26 13:30:00'),

-- Yangın sigortası başvuruları
(10, '2025-02-26', '05621987654', '2025-01-27 10:45:00'),
(10, '2025-03-08', '05639871234', '2025-01-28 12:15:00');

-- Ek admin kullanıcıları (isteğe bağlı)
INSERT INTO "Admins" ("Username", "PasswordHash", "CreatedAt") VALUES
('manager', '$2a$11$rWjRHzUMHEpTr/L5dUw2fOPm8kD7FHPt4DcmJ5xH7W.UqOGHK9c/m', NOW()), -- Şifre: admin123
('supervisor', '$2a$11$rWjRHzUMHEpTr/L5dUw2fOPm8kD7FHPt4DcmJ5xH7W.UqOGHK9c/m', NOW()); -- Şifre: admin123

-- Veri ekleme tamamlandı!
-- Kontrol sorguları:

-- Toplam sigorta sayısı
SELECT COUNT(*) as "Toplam Sigorta" FROM "Insurances";

-- Aktif sigorta sayısı
SELECT COUNT(*) as "Aktif Sigorta" FROM "Insurances" WHERE "IsActive" = TRUE;

-- Toplam başvuru sayısı
SELECT COUNT(*) as "Toplam Başvuru" FROM "Applications";

-- Sigorta türüne göre başvuru sayıları
SELECT
    i."Name" as "Sigorta Türü",
    COUNT(a."Id") as "Başvuru Sayısı"
FROM "Insurances" i
LEFT JOIN "Applications" a ON i."Id" = a."InsuranceId"
GROUP BY i."Id", i."Name"
ORDER BY COUNT(a."Id") DESC;

-- Son eklenen başvurular
SELECT
    a."Id",
    i."Name" as "Sigorta",
    a."Phone",
    a."SelectedDate",
    a."CreatedAt"
FROM "Applications" a
JOIN "Insurances" i ON a."InsuranceId" = i."Id"
ORDER BY a."CreatedAt" DESC
LIMIT 10;
