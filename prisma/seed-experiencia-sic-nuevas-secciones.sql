-- Seed SQL para las tres secciones nuevas del overview de Experiencia SIC
-- que reemplazan a la seccion de San Isidro Play:
--   1. Fe y compromiso social  (forma-home-2, fondo verde)
--   2. Arte y creatividad      (forma-home-5, fondo blanco)
--   3. Houses                  (forma-home-2, fondo verde)
--
-- Los carruseles arrancan con las fotos que ya usaba San Isidro Play para que
-- las secciones no queden vacias; desde el admin se pueden reemplazar.

-- ============================================================================
-- GRUPOS DE MEDIOS
-- ============================================================================

INSERT INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES
  ('Experiencia SIC - Fe y Compromiso Carousel', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Arte y Creatividad Carousel', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Houses Carousel', 'CARRUSEL', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `tipoGrupo` = VALUES(`tipoGrupo`),
  `actualizadoEn` = NOW();

DELETE m
FROM `medio` m
INNER JOIN `grupomedios` g ON g.`id` = m.`grupoMediosId`
WHERE g.`nombre` IN (
  'Experiencia SIC - Fe y Compromiso Carousel',
  'Experiencia SIC - Arte y Creatividad Carousel',
  'Experiencia SIC - Houses Carousel'
);

-- Las fotos iniciales se copian del grupo que ya usaba San Isidro Play, asi los
-- carruseles arrancan con contenido real en cualquier entorno (los nombres de
-- archivo difieren entre local y produccion, por eso se copian en vez de
-- escribirlos a mano). Desde el admin se reemplazan sin tocar la base.

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT
  src.`urlArchivo`,
  src.`urlMiniatura`,
  CONCAT(destino.`etiqueta`, ' ', ROW_NUMBER() OVER (PARTITION BY destino.`etiqueta` ORDER BY src.`posicion`, src.`id`)),
  src.`tipo`,
  src.`posicion`,
  destino.`id`,
  NOW(),
  NOW()
FROM `medio` src
INNER JOIN `grupomedios` origen ON origen.`id` = src.`grupoMediosId`
CROSS JOIN (
  SELECT `id`, 'Fe y compromiso social' AS `etiqueta` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Fe y Compromiso Carousel'
  UNION ALL SELECT `id`, 'Arte y creatividad' FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Arte y Creatividad Carousel'
  UNION ALL SELECT `id`, 'Houses' FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Houses Carousel'
) destino
WHERE origen.`nombre` = 'Vida Estudiantil - Play';

-- ============================================================================
-- SECCIONES DEL OVERVIEW
-- ============================================================================

INSERT INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `subtitulo`, `propsJson`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES
(
  'experiencia-sic-fe-y-compromiso-social',
  'experiencia-sic',
  50,
  'GALERIA',
  'Fe y compromiso social',
  NULL,
  '{"component":"feature-card","overviewHash":"fe-y-compromiso-social","locales":{"es":{"title":"Fe y compromiso social","description":"Nuestra orientacion catolica acompana el crecimiento humano y espiritual de los estudiantes, promoviendo una fe que se expresa en el amor al projimo, el cuidado de la naturaleza y el compromiso con los demas. A traves del ejemplo cotidiano y de experiencias de servicio, buscamos formar personas libres, solidarias y capaces de contribuir a transformar su comunidad."},"en":{"title":"Faith and Social Commitment","description":"Our Catholic orientation supports the human and spiritual growth of our students, fostering a faith expressed through love for others, care for nature, and commitment to the community. Through everyday example and service experiences, we seek to form free and caring people, able to help transform their community."}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Fe y Compromiso Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-arte-y-creatividad',
  'experiencia-sic',
  60,
  'GALERIA',
  'Arte y creatividad',
  NULL,
  '{"component":"feature-card","overviewHash":"arte-y-creatividad","locales":{"es":{"title":"Arte y creatividad","description":"El arte forma parte de la vida de San Isidro College y constituye una dimension esencial de nuestra propuesta de formacion integral. A traves de la Musica, el Canto, las Artes Visuales, el Teatro y la Expresion Corporal, los estudiantes desarrollan su sensibilidad, descubren sus talentos y encuentran nuevas maneras de comunicar y crear."},"en":{"title":"Art and Creativity","description":"Art is part of life at San Isidro College and an essential dimension of our integral education. Through Music, Singing, Visual Arts, Theatre, and Body Expression, students develop their sensitivity, discover their talents, and find new ways to communicate and create."}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Arte y Creatividad Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-houses',
  'experiencia-sic',
  70,
  'GALERIA',
  'Houses',
  NULL,
  '{"component":"feature-card","overviewHash":"houses","locales":{"es":{"title":"Houses","description":"Creemos que la educacion se construye mucho mas alla del aula: en los aprendizajes, los vinculos, los desafios compartidos, los logros y los valores que practicamos cada dia. Con esta mirada nace el Sistema de Houses de San Isidro College: una nueva tradicion destinada a fortalecer la pertenencia, el encuentro y la participacion de todos nuestros estudiantes."},"en":{"title":"Houses","description":"We believe education is built far beyond the classroom: in learning, in relationships, in shared challenges, in achievements, and in the values we practise every day. With this vision, the San Isidro College House System is born: a new tradition meant to strengthen belonging, connection, and the participation of all our students."}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Houses Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `pagina` = VALUES(`pagina`),
  `orden` = VALUES(`orden`),
  `tipo` = VALUES(`tipo`),
  `titulo` = VALUES(`titulo`),
  `subtitulo` = VALUES(`subtitulo`),
  `propsJson` = VALUES(`propsJson`),
  `grupoId` = VALUES(`grupoId`),
  `medioId` = VALUES(`medioId`),
  `actualizadoEn` = NOW();
