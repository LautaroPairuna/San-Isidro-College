-- Secciones y grupos de medios para que las páginas nuevas sean editables
-- desde el admin: la foto de Los invitamos a conocernos (Home), las fotos de
-- Educación personalizada (Colegio), los íconos de Nuestros Propósitos
-- (Proyecto bilingüe), las fotos de El valor del juego (Inicial), las fotos e
-- íconos de Primaria y las fotos de las tarjetas de Secundaria.
--
-- Equivale a GET /api/admin/setup-medios-editables; usá uno u otro, no hace
-- falta correr los dos.
--
-- Se puede correr más de una vez sin romper nada:
--   * los grupos y las secciones se insertan solo si no existen (nombre y slug
--     son UNIQUE);
--   * los medios se cargan solo si el grupo está vacío, así nunca pisa ni
--     duplica lo que hayas subido desde el admin;
--   * las secciones que ya existan solo se completan si no tienen medio o
--     grupo asignado.
--
-- Las tablas son MyISAM, o sea que no hay transacción: si algo falla, corregí y
-- volvé a correr el archivo entero.
--
-- Los archivos que se referencian son los que hoy usa el sitio como respaldo y
-- viven en public/images/medios. Si en el servidor MEDIA_DIR_IMAGES apunta a
-- otra carpeta, copiá esos archivos ahí o resubilos desde el admin.

SET NAMES utf8mb4;

-- ==========================================================================
-- Los invitamos a conocernos - Foto  (página: home)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Home - Los Invitamos a Conocernos', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Home - Los Invitamos a Conocernos');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'fondo-bienvenida.webp', 'Los invitamos a conocernos', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('home-conocernos', 'home', 60, 'MEDIA_UNICA', 'Los invitamos a conocernos - Foto', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'home-conocernos' AND `medioId` IS NULL;

-- ==========================================================================
-- Educación personalizada - Foto 1  (página: colegio)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Colegio - Educacion Personalizada 1', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Colegio - Educacion Personalizada 1');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'image-bienvenida-20250602-232317.webp', 'Educación personalizada 1', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('colegio-personalizada-1', 'colegio', 30, 'MEDIA_UNICA', 'Educación personalizada - Foto 1', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'colegio-personalizada-1' AND `medioId` IS NULL;

-- ==========================================================================
-- Educación personalizada - Foto 2  (página: colegio)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Colegio - Educacion Personalizada 2', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Colegio - Educacion Personalizada 2');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'foto-estudiantil-20250603-005440.webp', 'Educación personalizada 2', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('colegio-personalizada-2', 'colegio', 40, 'MEDIA_UNICA', 'Educación personalizada - Foto 2', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'colegio-personalizada-2' AND `medioId` IS NULL;

-- ==========================================================================
-- Iconos Nuestros Propósitos  (página: academicos-mas-info)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Academicos Mas Info - Iconos Propositos', 'GALERIA', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Academicos Mas Info - Iconos Propositos');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'brindar-contacto-proposito.svg', 'Contacto cotidiano con el inglés', 'ICONO', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'favorecer-comprension-proposito.svg', 'Comprensión y expresión', 'ICONO', 20, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'promover-idioma-proposito.svg', 'Uso del idioma', 'ICONO', 30, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'utilizar-ingles-proposito.svg', 'El inglés como medio de acceso', 'ICONO', 40, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'fortalecer-confianza-proposito.svg', 'Confianza y autonomía', 'ICONO', 50, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'articular-lengua-proposito.svg', 'Articulación con el currículo', 'ICONO', 60, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'ampliar-comprension-proposito.svg', 'Otras culturas', 'ICONO', 70, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'brindar-herramientas-proposito.svg', 'Herramientas para contextos globales', 'ICONO', 80, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('academicos-mas-info-propositos', 'academicos-mas-info', 30, 'GALERIA', 'Iconos Nuestros Propósitos', @grupo, NULL, NOW(3), NOW(3));

-- Si la sección ya existía sin grupo asignado, se lo completa
UPDATE `seccion` SET `grupoId` = @grupo, `actualizadoEn` = NOW(3)
WHERE `slug` = 'academicos-mas-info-propositos' AND `grupoId` IS NULL;

-- ==========================================================================
-- El valor del juego - Foto 1  (página: kindergarden)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Kindergarden - Valor del Juego 1', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Kindergarden - Valor del Juego 1');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'banner-kindergarten-20250602-210920.webp', 'El valor del juego 1', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('kindergarden-juego-1', 'kindergarden', 10, 'MEDIA_UNICA', 'El valor del juego - Foto 1', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'kindergarden-juego-1' AND `medioId` IS NULL;

-- ==========================================================================
-- El valor del juego - Foto 2  (página: kindergarden)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Kindergarden - Valor del Juego 2', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Kindergarden - Valor del Juego 2');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'foto-isidro-play-20250603-005601.webp', 'El valor del juego 2', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('kindergarden-juego-2', 'kindergarden', 20, 'MEDIA_UNICA', 'El valor del juego - Foto 2', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'kindergarden-juego-2' AND `medioId` IS NULL;

-- ==========================================================================
-- La literatura como punto de partida - Foto  (página: primary)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Primary - Literatura', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Primary - Literatura');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'banner-primary-20250602-202252.webp', 'La literatura como punto de partida', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('primary-literatura', 'primary', 10, 'MEDIA_UNICA', 'La literatura como punto de partida - Foto', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'primary-literatura' AND `medioId` IS NULL;

-- ==========================================================================
-- Aprendizajes significativos - Foto  (página: primary)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Primary - Aprendizajes', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Primary - Aprendizajes');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'foto-estudiantil-2-20250603-005502.webp', 'Aprendizajes significativos', 'IMAGEN', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('primary-aprendizajes', 'primary', 20, 'MEDIA_UNICA', 'Aprendizajes significativos - Foto', NULL, @medio, NOW(3), NOW(3));

-- Si la sección ya existía sin medio asignado, se lo completa
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'primary-aprendizajes' AND `medioId` IS NULL;

-- ==========================================================================
-- Ejes transversales - Iconos y fotos  (página: primary)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Primary - Ejes Transversales', 'GALERIA', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Primary - Ejes Transversales');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'competencia-comunicativa-primary-card.svg', 'Competencia comunicativa', 'ICONO', 10, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'alfabetizacion-primary-card.svg', 'Alfabetización científica y tecnológica', 'ICONO', 20, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'resolucion-problemas-primary-card.svg', 'Resolución de problemas', 'ICONO', 30, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'formacion-personal-primary-card.svg', 'Formación personal, social y ciudadana global', 'ICONO', 40, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'sustentabilidad-primary-card.svg', 'Educación para la Sustentabilidad', 'ICONO', 50, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'banner-primary-20250602-202252.webp', 'Competencia comunicativa', 'IMAGEN', 60, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'foto-balance-1-20260217-194502.webp', 'Alfabetización científica y tecnológica', 'IMAGEN', 70, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'foto-estudiantil-20250603-005440.webp', 'Resolución de problemas', 'IMAGEN', 80, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'foto-hockey-20250603-005057.webp', 'Formación personal, social y ciudadana global', 'IMAGEN', 90, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio
UNION ALL
SELECT 'foto-balance-3-20260217-194614.webp', 'Educación para la Sustentabilidad', 'IMAGEN', 100, @grupo, NOW(3), NOW(3) FROM DUAL WHERE @vacio;

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('primary-ejes', 'primary', 30, 'GALERIA', 'Ejes transversales - Iconos y fotos', @grupo, NULL, NOW(3), NOW(3));

-- Si la sección ya existía sin grupo asignado, se lo completa
UPDATE `seccion` SET `grupoId` = @grupo, `actualizadoEn` = NOW(3)
WHERE `slug` = 'primary-ejes' AND `grupoId` IS NULL;

-- ==========================================================================
-- Una formación que trasciende el aula - Fotos  (página: secondary)
-- ==========================================================================

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Academicos Mas Info - Cards Proyecto de Vida', 'GALERIA', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Academicos Mas Info - Cards Proyecto de Vida');
-- El grupo ya tiene sus medios cargados: acá solo se engancha la sección.

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES ('secondary-formacion', 'secondary', 10, 'GALERIA', 'Una formación que trasciende el aula - Fotos', @grupo, NULL, NOW(3), NOW(3));

-- Si la sección ya existía sin grupo asignado, se lo completa
UPDATE `seccion` SET `grupoId` = @grupo, `actualizadoEn` = NOW(3)
WHERE `slug` = 'secondary-formacion' AND `grupoId` IS NULL;

-- ==========================================================================
-- Verificación
-- ==========================================================================

SELECT s.`slug`, s.`pagina`, s.`tipo`, g.`nombre` AS grupo, m.`urlArchivo` AS medio_unico,
       (SELECT COUNT(*) FROM `medio` x WHERE x.`grupoMediosId` = COALESCE(s.`grupoId`, m.`grupoMediosId`)) AS medios_en_grupo
FROM `seccion` s
LEFT JOIN `grupomedios` g ON g.`id` = s.`grupoId`
LEFT JOIN `medio` m ON m.`id` = s.`medioId`
WHERE s.`slug` IN (
  'home-conocernos',
  'colegio-personalizada-1',
  'colegio-personalizada-2',
  'academicos-mas-info-propositos',
  'kindergarden-juego-1',
  'kindergarden-juego-2',
  'primary-literatura',
  'primary-aprendizajes',
  'primary-ejes',
  'secondary-formacion'
)
ORDER BY s.`pagina`, s.`orden`;
