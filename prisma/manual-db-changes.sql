-- Cambios manuales para aplicar contra la base de datos de producción, en el
-- orden en que aparecen acá abajo. Se pueden ir agregando más bloques a este
-- mismo archivo a medida que surjan (cada uno con su fecha/motivo), para
-- tener un solo script de referencia en vez de uno nuevo por cambio.
--
-- Correr:
--   mysql -u <usuario> -p <base_de_datos> < prisma/manual-db-changes.sql

-- =====================================================================
-- 2026-09-08 — Alt en inglés para Medio (correcciones de accesibilidad)
-- =====================================================================
-- Agrega textoAlternativoEn a la tabla medio, para poder cargar un alt en
-- inglés distinto del texto en español que ya existe en textoAlternativo.
-- Si queda vacía, el frontend usa textoAlternativo como fallback (no rompe
-- nada para los medios ya cargados). Nota: "prisma db push" (que ya corre
-- solo en el script de start) también agrega esta columna sola en el
-- próximo deploy, así que este ALTER es sólo para aplicarlo antes/aparte.
ALTER TABLE `medio`
  ADD COLUMN `textoAlternativoEn` varchar(191)
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
    AFTER `textoAlternativo`;

-- Completa el alt en inglés de los medios que el PDF de correcciones marcó
-- como pendientes de traducir ("Ícono alumnos", "Ícono hectáreas", "Ícono
-- certificados internacionales", "Los invitamos a conocernos"). IDs y
-- nombres de archivo tomados del volcado de producción compartido
-- (colegio_san_isidro.sql); si no coinciden con la base actual, estas filas
-- simplemente no actualizan nada (el WHERE exige también el urlArchivo
-- exacto). También se pueden cargar/editar a mano desde el admin, en el
-- nuevo campo "Texto Alternativo (Inglés)" de cada medio.
UPDATE `medio` SET `textoAlternativoEn` = 'International students icon'
  WHERE `id` = 7 AND `urlArchivo` = 'ico-alumnos-extranjeros-20260423-153836.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Students icon'
  WHERE `id` = 8 AND `urlArchivo` = 'ico-alumnos-20260423-153843.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'International certifications icon'
  WHERE `id` = 9 AND `urlArchivo` = 'ico-certificados-internacionales-20260423-153852.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Hectares icon'
  WHERE `id` = 10 AND `urlArchivo` = 'ico-hectarias-20260423-153900.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'We invite you to get to know us'
  WHERE `id` = 154 AND `urlArchivo` = 'fondo-bienvenida-20260814-145541.webp';
