-- Seed SQL corregido para las paginas nuevas de Experiencia SIC.
-- Corrige dos cosas:
-- 1. No inserta secciones de "Alianzas" dentro de cada pagina detalle.
-- 2. Inserta grupos y medios propios para Bienestar, Google, Innovacion y los carruseles
--    del overview de Experiencia SIC.
--
-- Requiere que ya existan estos grupos base del seed principal:
-- - Vida Estudiantil - Hero
-- - Vida Estudiantil - Rugby Hockey
-- - Vida Estudiantil - Play
-- - Vida Estudiantil - Bienestar

-- ============================================================================
-- LIMPIEZA DE SECCIONES INCORRECTAS DE LA VERSION ANTERIOR
-- ============================================================================

DELETE FROM `seccion`
WHERE `slug` IN (
  'experiencia-sic-alianzas',
  'experiencia-sic-bienestar-alianzas',
  'experiencia-sic-google-alianzas',
  'experiencia-sic-innovacion-alianzas'
);

-- ============================================================================
-- GRUPOS PROPIOS DE EXPERIENCIA SIC
-- ============================================================================

INSERT INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES
  ('Experiencia SIC - Hero', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Bienestar Carousel', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Bienestar Cards', 'GALERIA', NOW(), NOW()),
  ('Experiencia SIC - Google Carousel', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Innovacion Carousel', 'CARRUSEL', NOW(), NOW()),
  ('Experiencia SIC - Google Logo', 'UNICO', NOW(), NOW()),
  ('Experiencia SIC - Google Students Icons', 'GALERIA', NOW(), NOW()),
  ('Experiencia SIC - Google Teachers Icons', 'GALERIA', NOW(), NOW()),
  ('Experiencia SIC - Google Apps', 'GALERIA', NOW(), NOW()),
  ('Experiencia SIC - Innovacion Students Icons', 'GALERIA', NOW(), NOW()),
  ('Experiencia SIC - Innovacion Tools Icons', 'GALERIA', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `tipoGrupo` = VALUES(`tipoGrupo`),
  `actualizadoEn` = NOW();

DELETE m
FROM `medio` m
INNER JOIN `grupomedios` g ON g.`id` = m.`grupoMediosId`
WHERE g.`nombre` IN (
  'Experiencia SIC - Hero',
  'Experiencia SIC - Bienestar Carousel',
  'Experiencia SIC - Bienestar Cards',
  'Experiencia SIC - Google Carousel',
  'Experiencia SIC - Innovacion Carousel',
  'Experiencia SIC - Google Logo',
  'Experiencia SIC - Google Students Icons',
  'Experiencia SIC - Google Teachers Icons',
  'Experiencia SIC - Google Apps',
  'Experiencia SIC - Innovacion Students Icons',
  'Experiencia SIC - Innovacion Tools Icons'
);

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, x.urlMiniatura, x.textoAlternativo, 'IMAGEN', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'banner-deportes-20250603-004842.webp' AS urlArchivo, 'thumbs/banner-deportes-20250603-004842.webp' AS urlMiniatura, 'Experiencia SIC hero 1' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'banner-deportes-2-20250603-004919.webp', 'thumbs/banner-deportes-2-20250603-004919.webp', 'Experiencia SIC hero 2', 20
  UNION ALL SELECT 'banner-deportes-3-20250603-005009.webp', 'thumbs/banner-deportes-3-20250603-005009.webp', 'Experiencia SIC hero 3', 30
) x
WHERE g.`nombre` = 'Experiencia SIC - Hero';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, x.urlMiniatura, x.textoAlternativo, 'IMAGEN', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'foto-hockey-20250603-005057.webp' AS urlArchivo, 'thumbs/foto-hockey-20250603-005057.webp' AS urlMiniatura, 'Experiencia SIC bienestar 1' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'foto-hockey-2-20250603-005124.webp', 'thumbs/foto-hockey-2-20250603-005124.webp', 'Experiencia SIC bienestar 2', 20
  UNION ALL SELECT 'foto-hockey-3-20250603-005153.webp', 'thumbs/foto-hockey-3-20250603-005153.webp', 'Experiencia SIC bienestar 3', 30
) x
WHERE g.`nombre` = 'Experiencia SIC - Bienestar Carousel';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, x.urlMiniatura, x.textoAlternativo, 'IMAGEN', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'foto-estudiantil-20250603-005440.webp' AS urlArchivo, 'thumbs/foto-estudiantil-20250603-005440.webp' AS urlMiniatura, 'Bienestar card 1' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'foto-estudiantil-2-20250603-005502.webp', 'thumbs/foto-estudiantil-2-20250603-005502.webp', 'Bienestar card 2', 20
  UNION ALL SELECT 'foto-dojo-2-20250603-005253.webp', 'thumbs/foto-dojo-2-20250603-005253.webp', 'Bienestar card 3', 30
  UNION ALL SELECT 'foto-hockey-20250603-005057.webp', 'thumbs/foto-hockey-20250603-005057.webp', 'Bienestar card 4', 40
  UNION ALL SELECT 'foto-hockey-2-20250603-005124.webp', 'thumbs/foto-hockey-2-20250603-005124.webp', 'Bienestar card 5', 50
  UNION ALL SELECT 'foto-isidro-play-20250603-005601.webp', 'thumbs/foto-isidro-play-20250603-005601.webp', 'Bienestar card 6', 60
  UNION ALL SELECT 'foto-balance-1-20260217-194502.webp', 'thumbs/foto-balance-1-20260217-194502.webp', 'Bienestar card 7', 70
  UNION ALL SELECT 'foto-balance-2-20260217-194547.webp', 'thumbs/foto-balance-2-20260217-194547.webp', 'Bienestar card 8', 80
) x
WHERE g.`nombre` = 'Experiencia SIC - Bienestar Cards';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, x.urlMiniatura, x.textoAlternativo, 'IMAGEN', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'foto-isidro-play-20250603-005601.webp' AS urlArchivo, 'thumbs/foto-isidro-play-20250603-005601.webp' AS urlMiniatura, 'Experiencia SIC google 1' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'foto-isidro-play-2-20250603-005640.webp', 'thumbs/foto-isidro-play-2-20250603-005640.webp', 'Experiencia SIC google 2', 20
  UNION ALL SELECT 'foto-isidro-play-3-20250603-005706.webp', 'thumbs/foto-isidro-play-3-20250603-005706.webp', 'Experiencia SIC google 3', 30
) x
WHERE g.`nombre` = 'Experiencia SIC - Google Carousel';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, x.urlMiniatura, x.textoAlternativo, 'IMAGEN', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'foto-estudiantil-20250603-005440.webp' AS urlArchivo, 'thumbs/foto-estudiantil-20250603-005440.webp' AS urlMiniatura, 'Experiencia SIC innovacion 1' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'foto-estudiantil-2-20250603-005502.webp', 'thumbs/foto-estudiantil-2-20250603-005502.webp', 'Experiencia SIC innovacion 2', 20
  UNION ALL SELECT 'foto-estudiantil-3-20250603-005527.webp', 'thumbs/foto-estudiantil-3-20250603-005527.webp', 'Experiencia SIC innovacion 3', 30
) x
WHERE g.`nombre` = 'Experiencia SIC - Innovacion Carousel';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT 'google-education-logo.webp', NULL, 'Google for Education logo', 'IMAGEN', 10, g.`id`, NOW(), NOW()
FROM `grupomedios` g WHERE g.`nombre` = 'Experiencia SIC - Google Logo';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, NULL, x.textoAlternativo, 'ICONO', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'aprendizaje-colaborativo-ico.svg' AS urlArchivo, 'Aprendizaje colaborativo' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'ciudadania-digital-ico.svg', 'Ciudadania digital', 20
  UNION ALL SELECT 'preparacion-futuro-2-ico.svg', 'Creatividad e innovacion', 30
  UNION ALL SELECT 'preparacion-futuro-ico.svg', 'Preparacion para el futuro', 40
) x
WHERE g.`nombre` = 'Experiencia SIC - Google Students Icons';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, NULL, x.textoAlternativo, 'ICONO', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'potenciar-ensenanza-ico.svg' AS urlArchivo, 'Potenciar la ensenanza' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'innovar-confianza-ico.svg', 'Innovar con confianza', 20
  UNION ALL SELECT 'colaborar-crecer-ico.svg', 'Colaborar para crecer', 30
  UNION ALL SELECT 'inspirar-alumnos-ico.svg', 'Inspirar a los alumnos', 40
) x
WHERE g.`nombre` = 'Experiencia SIC - Google Teachers Icons';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, NULL, x.textoAlternativo, 'ICONO', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'google/drive-ico.svg' AS urlArchivo, 'Drive' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'google/gemini-ico.svg', 'Gemini', 20
  UNION ALL SELECT 'google/notebook-lm-ico.svg', 'NotebookLM', 30
  UNION ALL SELECT 'google/calendar-ico.svg', 'Calendar', 40
  UNION ALL SELECT 'google/sites-ico.svg', 'Sites', 50
  UNION ALL SELECT 'google/forms-ico.svg', 'Forms', 60
  UNION ALL SELECT 'google/gmail-ico.svg', 'Gmail', 70
  UNION ALL SELECT 'google/classroom-ico.svg', 'Classroom', 80
  UNION ALL SELECT 'google/sheets-ico.svg', 'Sheets', 90
  UNION ALL SELECT 'google/docs-ico.svg', 'Docs', 100
  UNION ALL SELECT 'google/slides-ico.svg', 'Slides', 110
) x
WHERE g.`nombre` = 'Experiencia SIC - Google Apps';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, NULL, x.textoAlternativo, 'ICONO', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'pensamiento-creativo-ico.svg' AS urlArchivo, 'Pensamiento creativo' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'resolucion-problemas-ico.svg', 'Resolucion de problemas', 20
  UNION ALL SELECT 'trabajo-equipo-ico.svg', 'Trabajo en equipo', 30
  UNION ALL SELECT 'pensamiento-computacional-ico.svg', 'Pensamiento computacional', 40
) x
WHERE g.`nombre` = 'Experiencia SIC - Innovacion Students Icons';

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT x.urlArchivo, NULL, x.textoAlternativo, 'ICONO', x.posicion, g.`id`, NOW(), NOW()
FROM `grupomedios` g
JOIN (
  SELECT 'robotica-ico.svg' AS urlArchivo, 'Robotica' AS textoAlternativo, 10 AS posicion
  UNION ALL SELECT 'programacion-ico.svg', 'Programacion', 20
  UNION ALL SELECT 'electronica-ico.svg', 'Electronica', 30
  UNION ALL SELECT 'diseno-proyectos-ico.svg', 'Diseno de proyectos', 40
  UNION ALL SELECT 'prototipado-ico.svg', 'Prototipado', 50
  UNION ALL SELECT 'resolucion-desafios-ico.svg', 'Resolucion de desafios', 60
  UNION ALL SELECT 'impresion-3d-ico.svg', 'Impresion 3D', 70
) x
WHERE g.`nombre` = 'Experiencia SIC - Innovacion Tools Icons';

-- ============================================================================
-- SECCIONES
-- ============================================================================

INSERT INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `subtitulo`, `propsJson`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES
(
  'experiencia-sic-hero',
  'experiencia-sic',
  10,
  'HERO',
  'Experiencia San Isidro',
  NULL,
  '{"component":"hero","locales":{"es":{"title":"Experiencia San Isidro","description":"La experiencia de crecer, aprender y compartir va mucho mas alla del aula. En San Isidro College, cada actividad complementa la formacion academica y ofrece nuevas oportunidades para desarrollar talentos, fortalecer vinculos y disfrutar de una comunidad que inspira a crecer."},"en":{"title":"San Isidro Experience","description":"The experience of growing, learning, and sharing goes far beyond the classroom. At San Isidro College, each activity complements academic development and creates new opportunities to build talents, strengthen bonds, and enjoy a community that inspires growth."}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Hero' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-y-acompanamiento',
  'experiencia-sic',
  20,
  'GALERIA',
  'Bienestar y Acompanamiento',
  NULL,
  '{"component":"feature-card","overviewHash":"bienestar-y-acompanamiento","detailHref":"/experiencia-sic/bienestar-y-acompanamiento","locales":{"es":{"title":"Bienestar y Acompanamiento","description":"Creemos que cada alumno aprende mejor cuando se siente seguro, escuchado y acompanado. Por eso promovemos un entorno de confianza, respeto y cercania, donde el bienestar forma parte de la experiencia educativa de todos los dias.","readMore":"Leer mas"},"en":{"title":"Wellbeing and Guidance","description":"We believe every student learns better when they feel safe, heard, and supported. That is why we promote an environment of trust, respect, and closeness, where wellbeing is part of the educational experience every day.","readMore":"Read more"}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Bienestar Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-reference-school',
  'experiencia-sic',
  30,
  'GALERIA',
  'Google Reference School',
  NULL,
  '{"component":"feature-card","overviewHash":"google-reference-school","detailHref":"/experiencia-sic/google-reference-school","locales":{"es":{"title":"Google Reference School","description":"La innovacion forma parte de nuestra identidad desde el primer dia. Como Google Reference School, integramos la tecnologia de manera significativa para potenciar el aprendizaje, la creatividad y la colaboracion, preparando a nuestros alumnos para los desafios del futuro.","readMore":"Leer mas"},"en":{"title":"Google Reference School","description":"Innovation has been part of our identity from day one. As a Google Reference School, we integrate technology in meaningful ways to strengthen learning, creativity, and collaboration, preparing our students for the challenges of the future.","readMore":"Read more"}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Google Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-y-robotica',
  'experiencia-sic',
  40,
  'GALERIA',
  'Innovacion y Robotica',
  NULL,
  '{"component":"feature-card","overviewHash":"innovacion-y-robotica","detailHref":"/experiencia-sic/innovacion-y-robotica","locales":{"es":{"title":"Innovacion y Robotica","description":"Un espacio donde las ideas se convierten en proyectos. Nuestro Laboratorio de Innovacion y Robotica invita a los alumnos a explorar, disenar, construir y experimentar, desarrollando habilidades para resolver los desafios del presente y del futuro.","readMore":"Leer mas"},"en":{"title":"Innovation and Robotics","description":"A space where ideas become projects. Our Innovation and Robotics Lab invites students to explore, design, build, and experiment, developing the skills to solve the challenges of the present and the future.","readMore":"Read more"}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Innovacion Carousel' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-intro',
  'experiencia-sic-bienestar-y-acompanamiento',
  10,
  'TEXTO_RICO',
  'Bienestar y Acompanamiento',
  'En San Isidro College entendemos que educar es acompanar.',
  '{"component":"rich-text","locales":{"es":{"intro":{"p1":"En San Isidro College entendemos que educar es acompanar. El bienestar de nuestros alumnos es un pilar de nuestra propuesta educativa, porque sabemos que sentirse contenido, seguro y escuchado es fundamental para aprender, crecer y desarrollar todo su potencial."},"philosophy":{"title":"Una filosofia centrada en la persona","paragraphs":["Creemos en una educacion que forme integralmente, contemplando tanto el desarrollo academico como el crecimiento emocional y social de cada estudiante.","Por eso trabajamos para que cada alumno encuentre en el colegio un espacio de pertenencia, confianza y cuidado, donde pueda expresarse, vincularse con otros y construir una imagen positiva de si mismo."]}},"en":{"intro":{"p1":"At San Isidro College, we understand that educating means accompanying. Our students wellbeing is a core pillar of our educational proposal, because feeling supported, safe, and heard is essential to learn, grow, and develop their full potential."},"philosophy":{"title":"A philosophy centered on the person","paragraphs":["We believe in an education that forms the whole person, considering both academic development and the emotional and social growth of each student.","That is why we work so that every student finds at school a space of belonging, trust, and care, where they can express themselves, connect with others, and build a positive image of themselves."]}}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-cards-1',
  'experiencia-sic-bienestar-y-acompanamiento',
  20,
  'GALERIA',
  'Tarjetas Bienestar - Grupo 1',
  NULL,
  '{"component":"flip-cards","sourceGroup":"Experiencia SIC - Bienestar Cards","cardKeys":["tutorias","educacionEmocional","trabajoFamilias","desarrolloIntegral"]}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Bienestar Cards' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-community',
  'experiencia-sic-bienestar-y-acompanamiento',
  30,
  'TEXTO_RICO',
  'Una comunidad que acompana',
  NULL,
  '{"component":"rich-text","locales":{"es":{"title":"Una comunidad que acompana","paragraphs":["El bienestar se construye todos los dias a traves del vinculo entre alumnos, docentes, tutores y familias. Por eso fomentamos una comunicacion cercana y un trabajo conjunto que permita sostener a cada estudiante en su recorrido escolar.","Las tutorias, la educacion emocional y las acciones preventivas forman parte de una cultura institucional orientada al cuidado, el respeto y la convivencia."]},"en":{"title":"A community that supports","paragraphs":["Wellbeing is built every day through the bond among students, teachers, tutors, and families. That is why we encourage close communication and joint work that supports each student throughout their school journey.","Tutoring, emotional education, and preventive actions are part of an institutional culture oriented toward care, respect, and coexistence."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-eoe',
  'experiencia-sic-bienestar-y-acompanamiento',
  40,
  'TEXTO_RICO',
  'Un acompanamiento profesional - Equipo de Orientacion Escolar (EOE)',
  NULL,
  '{"component":"rich-text","locales":{"es":{"title":"Un acompanamiento profesional - Equipo de Orientacion Escolar (EOE)","paragraphs":["Ademas del acompanamiento cotidiano que brindan docentes y tutores, San Isidro College cuenta con un Equipo de Orientacion Escolar integrado por profesionales de Psicologia y Psicopedagogia que acompanan las trayectorias de nuestros estudiantes y trabajan de manera articulada con las familias, los docentes y, cuando es necesario, con profesionales externos."]},"en":{"title":"Professional support - School Guidance Team (EOE)","paragraphs":["In addition to the daily support provided by teachers and tutors, San Isidro College has a School Guidance Team made up of Psychology and Psychopedagogy professionals who support our students pathways and work in coordination with families, teachers, and, when necessary, external professionals."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-cards-2',
  'experiencia-sic-bienestar-y-acompanamiento',
  50,
  'GALERIA',
  'Tarjetas Bienestar - Grupo 2',
  NULL,
  '{"component":"flip-cards","sourceGroup":"Experiencia SIC - Bienestar Cards","cardKeys":["sostenEmocional","acompanamientoPsicopedagogico","convivenciaEscolar","trabajoInterdisciplinario"]}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Bienestar Cards' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-bienestar-closing',
  'experiencia-sic-bienestar-y-acompanamiento',
  60,
  'TEXTO_RICO',
  'Acompanar para crecer',
  NULL,
  '{"component":"rich-text","locales":{"es":{"title":"Acompanar para crecer","paragraphs":["En San Isidro College entendemos que cada alumno recorre un camino unico. Por eso promovemos una cultura del cuidado donde el bienestar, la cercania y el acompanamiento forman parte de la experiencia educativa de todos los dias. Nuestro compromiso es brindar a cada estudiante las herramientas, el apoyo y la confianza necesarios para crecer, aprender y desarrollar todo su potencial."]},"en":{"title":"Supporting growth","paragraphs":["At San Isidro College, we understand that each student follows a unique path. That is why we promote a culture of care where wellbeing, closeness, and guidance are part of the educational experience every day. Our commitment is to provide each student with the tools, support, and confidence they need to grow, learn, and develop their full potential."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-intro',
  'experiencia-sic-google-reference-school',
  10,
  'TEXTO_RICO',
  'San Isidro College es Google Reference School',
  'Es un reconocimiento que distingue a instituciones educativas que integran la tecnologia de Google de manera innovadora para transformar la ensenanza y el aprendizaje.',
  '{"component":"rich-text","sourceGroup":"Experiencia SIC - Google Logo","logoKey":"m-exp-google-logo","locales":{"es":{"intro":{"p1":"Es un reconocimiento que distingue a instituciones educativas que integran la tecnologia de Google de manera innovadora para transformar la ensenanza y el aprendizaje."},"whatIs":{"title":"Que es ser Google Reference School?","paragraphs":["Ser Google Reference School significa formar parte de una comunidad internacional de instituciones que se destacan por utilizar la tecnologia como una herramienta para potenciar el aprendizaje, la creatividad y la colaboracion.","Este reconocimiento refleja nuestro compromiso con una educacion innovadora, donde la tecnologia acompana el desarrollo de habilidades fundamentales para el presente y el futuro."]}},"en":{"intro":{"p1":"It is a recognition that distinguishes educational institutions that integrate Google technology in innovative ways to transform teaching and learning."},"whatIs":{"title":"What does it mean to be a Google Reference School?","paragraphs":["Being a Google Reference School means being part of an international community of institutions that stand out for using technology as a tool to strengthen learning, creativity, and collaboration.","This recognition reflects our commitment to innovative education, where technology supports the development of essential skills for the present and the future."]}}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Google Logo' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-students',
  'experiencia-sic-google-reference-school',
  20,
  'TEXTO_RICO',
  'Que significa para nuestros alumnos?',
  NULL,
  '{"component":"icon-grid","sourceGroup":"Experiencia SIC - Google Students Icons","itemKeys":["collaborativeLearning","digitalCitizenship","creativeThinking","futureReady"],"locales":{"es":{"title":"Que significa para nuestros alumnos?","items":{"collaborativeLearning":{"title":"Aprendizaje colaborativo","description":"Los alumnos trabajan en equipo utilizando herramientas digitales que favorecen la comunicacion y la construccion conjunta del conocimiento."},"digitalCitizenship":{"title":"Ciudadania digital","description":"Aprenden a utilizar la tecnologia de manera responsable, etica y segura."},"creativeThinking":{"title":"Creatividad e innovacion","description":"La tecnologia se convierte en un medio para crear, investigar, resolver problemas y desarrollar nuevas ideas."},"futureReady":{"title":"Preparacion para el futuro","description":"Desarrollan competencias digitales que seran fundamentales en la universidad, el mundo laboral y los desafios del siglo XXI."}}},"en":{"title":"What does it mean for our students?","items":{"collaborativeLearning":{"title":"Collaborative learning","description":"Students work as a team using digital tools that encourage communication and the shared construction of knowledge."},"digitalCitizenship":{"title":"Digital citizenship","description":"They learn to use technology in a responsible, ethical, and safe way."},"creativeThinking":{"title":"Creativity and innovation","description":"Technology becomes a means to create, investigate, solve problems, and develop new ideas."},"futureReady":{"title":"Future readiness","description":"They develop digital competencies that will be essential in university, the workplace, and the challenges of the 21st century."}}}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Google Students Icons' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-teachers',
  'experiencia-sic-google-reference-school',
  30,
  'TEXTO_RICO',
  'Que significa para nuestros docentes?',
  NULL,
  '{"component":"icon-grid","sourceGroup":"Experiencia SIC - Google Teachers Icons","itemKeys":["enhanceTeaching","innovateWithConfidence","collaborateToGrow","inspireStudents"],"locales":{"es":{"title":"Que significa para nuestros docentes?","items":{"enhanceTeaching":{"title":"Potenciar la ensenanza","description":"La tecnologia acompana el trabajo docente, ofreciendo nuevas herramientas para enriquecer cada experiencia de aprendizaje."},"innovateWithConfidence":{"title":"Innovar con confianza","description":"Nuestros docentes reciben formacion y acompanamiento continuo para incorporar nuevas metodologias y aprovechar todo el potencial de las herramientas digitales."},"collaborateToGrow":{"title":"Colaborar para crecer","description":"La planificacion compartida y el intercambio de recursos fortalecen el trabajo en equipo y promueven una comunidad profesional de aprendizaje."},"inspireStudents":{"title":"Inspirar a los alumnos","description":"La innovacion comienza con docentes preparados para despertar la curiosidad, fomentar la creatividad y acompanar a cada estudiante en su desarrollo."}}},"en":{"title":"What does it mean for our teachers?","items":{"enhanceTeaching":{"title":"Enhancing teaching","description":"Technology supports teachers work by offering new tools to enrich every learning experience."},"innovateWithConfidence":{"title":"Innovating with confidence","description":"Our teachers receive ongoing training and support to incorporate new methodologies and make the most of digital tools."},"collaborateToGrow":{"title":"Collaborating to grow","description":"Shared planning and resource exchange strengthen teamwork and promote a professional learning community."},"inspireStudents":{"title":"Inspiring students","description":"Innovation begins with prepared teachers who spark curiosity, encourage creativity, and support each student in their development."}}}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Google Teachers Icons' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-technology',
  'experiencia-sic-google-reference-school',
  40,
  'TEXTO_RICO',
  'La tecnologia como parte del aprendizaje',
  NULL,
  '{"component":"rich-text","locales":{"es":{"title":"La tecnologia como parte del aprendizaje","paragraphs":["En San Isidro College la tecnologia no reemplaza al docente: potencia la ensenanza. Desde la apertura del colegio, la innovacion y las herramientas digitales forman parte de nuestra propuesta educativa. Google Workspace for Education acompana la experiencia diaria de alumnos y docentes, promoviendo un aprendizaje dinamico, colaborativo y organizado desde los primeros anos."]},"en":{"title":"Technology as part of learning","paragraphs":["At San Isidro College, technology does not replace the teacher: it strengthens teaching. Since the school opened, innovation and digital tools have been part of our educational proposal. Google Workspace for Education supports the daily experience of students and teachers, promoting dynamic, collaborative, and organized learning from the earliest years."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-apps',
  'experiencia-sic-google-reference-school',
  50,
  'TEXTO_RICO',
  'Google Workspace for Education',
  NULL,
  '{"component":"apps-grid","sourceGroup":"Experiencia SIC - Google Apps","apps":["drive","gemini","notebookLm","calendar","sites","forms","gmail","classroom","sheets","docs","slides"]}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Google Apps' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-google-closing',
  'experiencia-sic-google-reference-school',
  60,
  'TEXTO_RICO',
  'Cierre',
  NULL,
  '{"component":"rich-text","locales":{"es":{"paragraphs":["En San Isidro College creemos que innovar no significa incorporar mas tecnologia, sino generar mejores oportunidades para aprender. Ser Google Reference School es el reflejo de ese compromiso con una educacion que prepara a nuestros alumnos para el mundo que viene."]},"en":{"paragraphs":["At San Isidro College, we believe that innovating does not mean adding more technology, but creating better opportunities to learn. Being a Google Reference School reflects that commitment to an education that prepares our students for the world ahead."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-intro',
  'experiencia-sic-innovacion-y-robotica',
  10,
  'TEXTO_RICO',
  'Laboratorio de Innovacion y Robotica',
  'Un espacio donde las ideas se convierten en proyectos.',
  '{"component":"rich-text","locales":{"es":{"lead":"Un espacio donde las ideas se convierten en proyectos.","paragraphs":["En San Isidro College creemos que las mejores experiencias de aprendizaje nacen cuando los alumnos tienen la oportunidad de experimentar.","Nuestro Laboratorio de Innovacion y Robotica es un espacio pensado para despertar la curiosidad, fomentar la creatividad y transformar las ideas en proyectos reales.","A traves de desafios, experiencias practicas y trabajo colaborativo, los estudiantes desarrollan habilidades que trascienden el conocimiento tecnico y los preparan para un mundo en constante evolucion."]},"en":{"lead":"A space where ideas become projects.","paragraphs":["At San Isidro College, we believe the best learning experiences happen when students have the opportunity to experiment.","Our Innovation and Robotics Lab is designed to spark curiosity, encourage creativity, and turn ideas into real projects.","Through challenges, hands-on experiences, and collaborative work, students develop skills that go beyond technical knowledge and prepare them for a constantly evolving world."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-students',
  'experiencia-sic-innovacion-y-robotica',
  20,
  'TEXTO_RICO',
  'Que desarrollan nuestros alumnos?',
  NULL,
  '{"component":"icon-grid","sourceGroup":"Experiencia SIC - Innovacion Students Icons","itemKeys":["creativeThinking","problemSolving","teamwork","computationalThinking"],"locales":{"es":{"title":"Que desarrollan nuestros alumnos?","items":{"creativeThinking":{"title":"Pensamiento creativo","description":"Aprenden a imaginar, disenar y transformar ideas en soluciones innovadoras."},"problemSolving":{"title":"Resolucion de problemas","description":"Analizan desafios, experimentan diferentes alternativas y encuentran soluciones mediante el ensayo y la mejora continua."},"teamwork":{"title":"Trabajo en equipo","description":"Cada proyecto fomenta la colaboracion, la comunicacion y el aprendizaje compartido."},"computationalThinking":{"title":"Pensamiento computacional","description":"Desarrollan habilidades de programacion, logica y secuenciacion para comprender como funciona la tecnologia y crear con ella."}}},"en":{"title":"What do our students develop?","items":{"creativeThinking":{"title":"Creative thinking","description":"They learn to imagine, design, and transform ideas into innovative solutions."},"problemSolving":{"title":"Problem solving","description":"They analyze challenges, test different alternatives, and find solutions through iteration and continuous improvement."},"teamwork":{"title":"Teamwork","description":"Each project encourages collaboration, communication, and shared learning."},"computationalThinking":{"title":"Computational thinking","description":"They develop programming, logic, and sequencing skills to understand how technology works and create with it."}}}}}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Innovacion Students Icons' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-lab',
  'experiencia-sic-innovacion-y-robotica',
  30,
  'TEXTO_RICO',
  'Un espacio para experimentar',
  NULL,
  '{"component":"rich-text","locales":{"es":{"title":"Un espacio para experimentar","paragraphs":["Nuestro laboratorio integra distintas herramientas y tecnologias para que los alumnos puedan investigar, construir y aprender de manera activa."]},"en":{"title":"A space to experiment","paragraphs":["Our lab brings together different tools and technologies so students can investigate, build, and learn actively."]}}}',
  NULL,
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-tools',
  'experiencia-sic-innovacion-y-robotica',
  40,
  'TEXTO_RICO',
  'Herramientas del laboratorio',
  NULL,
  '{"component":"tools-grid","sourceGroup":"Experiencia SIC - Innovacion Tools Icons","items":[{"key":"robotics","labelEs":"Robotica","labelEn":"Robotics"},{"key":"programming","labelEs":"Programacion","labelEn":"Programming"},{"key":"electronics","labelEs":"Electronica","labelEn":"Electronics"},{"key":"projectDesign","labelEs":"Diseno de proyectos","labelEn":"Project design"},{"key":"prototyping","labelEs":"Prototipado","labelEn":"Prototyping"},{"key":"challengeSolving","labelEs":"Resolucion de desafios","labelEn":"Challenge solving"},{"key":"printing3d","labelEs":"Impresion 3D","labelEn":"3D printing"}]}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Innovacion Tools Icons' LIMIT 1),
  NULL,
  NOW(),
  NOW()
),
(
  'experiencia-sic-innovacion-closing',
  'experiencia-sic-innovacion-y-robotica',
  50,
  'TEXTO_RICO',
  'Cierre',
  NULL,
  '{"component":"rich-text","locales":{"es":{"paragraphs":["Nuestro Laboratorio de Innovacion y Robotica es una expresion del compromiso de San Isidro College con una educacion innovadora. En conjunto con nuestra propuesta tecnologica y nuestro reconocimiento como Google Reference School, este espacio impulsa a los alumnos a aprender, crear y desarrollar las habilidades que les permitiran desenvolverse con confianza en el mundo del manana."]},"en":{"paragraphs":["Our Innovation and Robotics Lab expresses San Isidro College commitment to innovative education. Together with our technological proposal and our recognition as a Google Reference School, this space encourages students to learn, create, and develop the skills that will allow them to move confidently in the world of tomorrow."]}}}',
  NULL,
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
