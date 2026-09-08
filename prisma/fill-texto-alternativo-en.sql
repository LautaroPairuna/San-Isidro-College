-- Completa el textoAlternativoEn para los medios que el PDF de correcciones
-- señaló como pendientes de traducir en la versión inglesa del sitio
-- ("Ícono alumnos", "Ícono hectáreas", "Ícono certificados internacionales",
-- "Los invitamos a conocernos"). IDs y nombres de archivo tomados del volcado
-- de producción compartido (colegio_san_isidro.sql); si no coinciden con la
-- base actual, estas filas simplemente no actualizan nada (el WHERE exige
-- también el urlArchivo exacto).
--
-- Correr DESPUÉS de alter-medio-texto-alternativo-en.sql:
--   mysql -u <usuario> -p <base_de_datos> < prisma/fill-texto-alternativo-en.sql
--
-- También se puede cargar/editar cada uno a mano desde el admin, en el nuevo
-- campo "Texto Alternativo (Inglés)" de cada medio.

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
