-- Agrega la columna textoAlternativoEn a la tabla medio, para poder cargar
-- un texto alternativo (alt) en inglés distinto del texto en español que ya
-- existe en textoAlternativo. Si queda vacía, el frontend usa textoAlternativo
-- como fallback (no rompe nada para los medios ya cargados).
--
-- Correr una sola vez contra la base de datos de producción:
--   mysql -u <usuario> -p <base_de_datos> < prisma/alter-medio-texto-alternativo-en.sql

ALTER TABLE `medio`
  ADD COLUMN `textoAlternativoEn` varchar(191)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
    AFTER `textoAlternativo`;
