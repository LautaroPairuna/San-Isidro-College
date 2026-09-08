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

-- =====================================================================
-- 2026-09-08 — Alt en inglés para el resto de los medios (traducción completa)
-- =====================================================================
-- Completa textoAlternativoEn para todos los demás medios de la tabla (los
-- que no quedaron cubiertos por el bloque anterior), para que ningún medio
-- del sitio en inglés se quede sin alt propio. IDs y nombres de archivo
-- tomados del mismo volcado de producción (colegio_san_isidro.sql); si no
-- coinciden con la base actual, cada fila simplemente no actualiza nada (el
-- WHERE exige también el urlArchivo exacto). Igual que el resto, se puede
-- editar cualquiera de estos textos a mano desde el admin.
UPDATE `medio` SET `textoAlternativoEn` = 'Home hero 1'
  WHERE `id` = 1 AND `urlArchivo` = 'fondo-home-20260702-150406.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Home hero 2'
  WHERE `id` = 2 AND `urlArchivo` = 'fondo-home-2-20260710-144428.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Home hero 3'
  WHERE `id` = 3 AND `urlArchivo` = 'fondo-home-3-20260710-144440.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Welcome 1'
  WHERE `id` = 4 AND `urlArchivo` = 'fondo-bienvenida-20260721-152326.mp4';

UPDATE `medio` SET `textoAlternativoEn` = 'Welcome 2'
  WHERE `id` = 5 AND `urlArchivo` = 'fondo-bienvenida-2-20260423-153810.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Welcome 3'
  WHERE `id` = 6 AND `urlArchivo` = 'fondo-bienvenida-3-20260721-144658.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Built square meters icon'
  WHERE `id` = 11 AND `urlArchivo` = 'ico-m3-construidos-20260423-153910.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Section 3 background'
  WHERE `id` = 12 AND `urlArchivo` = 'fondo-iconos-20260423-153923.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'IRAM'
  WHERE `id` = 13 AND `urlArchivo` = 'logo-iram-20260423-153936.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'IQNet'
  WHERE `id` = 14 AND `urlArchivo` = 'logo-iqnet-20260423-153955.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Cambridge'
  WHERE `id` = 15 AND `urlArchivo` = 'logo-university-of-cambridge-20260423-154002.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Science Bits'
  WHERE `id` = 16 AND `urlArchivo` = 'science-bits-logo-20260423-154008.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Google Education'
  WHERE `id` = 17 AND `urlArchivo` = 'google-education-logo-20260423-154014.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'EPEA'
  WHERE `id` = 18 AND `urlArchivo` = 'epea-logo-20260423-154021.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Facilities video'
  WHERE `id` = 19 AND `urlArchivo` = 'video-de-instalaciones-20260702-152106.mp4';

UPDATE `medio` SET `textoAlternativoEn` = 'Kindergarten banner'
  WHERE `id` = 20 AND `urlArchivo` = 'banner-kindergarten-20260702-144934.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Primary banner'
  WHERE `id` = 21 AND `urlArchivo` = 'banner-primary-20260702-145432.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Secondary banner'
  WHERE `id` = 22 AND `urlArchivo` = 'banner-secondary-20260702-145839.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Student life hero 1'
  WHERE `id` = 23 AND `urlArchivo` = 'banner-deportes-20260702-151136.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Student life hero 2'
  WHERE `id` = 24 AND `urlArchivo` = 'banner-deportes-2-20260727-211549.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Student life hero 3'
  WHERE `id` = 25 AND `urlArchivo` = 'banner-deportes-3-20260727-222916.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Rugby and hockey 1'
  WHERE `id` = 26 AND `urlArchivo` = 'foto-hockey-20260727-221802.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Rugby and hockey 2'
  WHERE `id` = 27 AND `urlArchivo` = 'foto-hockey-2-20260727-221825.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Rugby and hockey 3'
  WHERE `id` = 28 AND `urlArchivo` = 'foto-hockey-3-20260727-222314.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Dojo 1'
  WHERE `id` = 29 AND `urlArchivo` = 'foto-dojo-20260423-154231.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Dojo 2'
  WHERE `id` = 30 AND `urlArchivo` = 'foto-dojo-2-20260702-153117.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Dojo 3'
  WHERE `id` = 31 AND `urlArchivo` = 'foto-dojo-3-20260727-212728.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Gym 1'
  WHERE `id` = 32 AND `urlArchivo` = 'foto-balance-1-20260710-150911.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Gym 2'
  WHERE `id` = 33 AND `urlArchivo` = 'foto-balance-2-20260710-150925.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Gym 3'
  WHERE `id` = 34 AND `urlArchivo` = 'foto-balance-3-20260710-151150.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing 1'
  WHERE `id` = 35 AND `urlArchivo` = 'foto-estudiantil-20260727-201225.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing 2'
  WHERE `id` = 36 AND `urlArchivo` = 'foto-estudiantil-2-20260727-200856.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing 3'
  WHERE `id` = 37 AND `urlArchivo` = 'foto-estudiantil-3-20260727-201958.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Project center card icon'
  WHERE `id` = 41 AND `urlArchivo` = 'ico-centro-proyecto-20260423-154353.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Global citizens card icon'
  WHERE `id` = 42 AND `urlArchivo` = 'ico-ciudadanos-globales-20260423-154400.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Innovation and technology card icon'
  WHERE `id` = 43 AND `urlArchivo` = 'ico-innovacion-tecnologia-20260423-154406.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Sports card icon'
  WHERE `id` = 44 AND `urlArchivo` = 'ico-deportes-20260423-154412.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Arts card icon'
  WHERE `id` = 45 AND `urlArchivo` = 'ico-artes-20260423-154421.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Sustainability card icon'
  WHERE `id` = 46 AND `urlArchivo` = 'ico-sustentabilidad-20260423-154434.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card icon'
  WHERE `id` = 47 AND `urlArchivo` = 'ico-bienestar-20260423-154440.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Person card'
  WHERE `id` = 48 AND `urlArchivo` = 'centro-proyecto-20260901-152112.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Global citizens card'
  WHERE `id` = 49 AND `urlArchivo` = 'ciudadanos-globales-20260901-160140.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Innovation and technology card'
  WHERE `id` = 50 AND `urlArchivo` = 'innovacion-tecnologia-20260901-152257.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Sports card'
  WHERE `id` = 51 AND `urlArchivo` = 'deportes-20260901-152651.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Arts card'
  WHERE `id` = 52 AND `urlArchivo` = 'artes-20260901-153844.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Sustainability card'
  WHERE `id` = 53 AND `urlArchivo` = 'sustentabilidad-20260901-155458.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card'
  WHERE `id` = 54 AND `urlArchivo` = 'bienestar-20260702-143719.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience hero 1'
  WHERE `id` = 55 AND `urlArchivo` = 'banner-experiencia-20260727-204802.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience hero 2'
  WHERE `id` = 56 AND `urlArchivo` = 'banner-experiencia-2-20260727-205045.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience hero 3'
  WHERE `id` = 57 AND `urlArchivo` = 'banner-experiencia-3-20260727-205831.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience wellbeing 1'
  WHERE `id` = 58 AND `urlArchivo` = 'foto-bienestar-20260727-133731.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience wellbeing 2'
  WHERE `id` = 59 AND `urlArchivo` = 'foto-bienestar-2-20260727-133937.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience wellbeing 3'
  WHERE `id` = 60 AND `urlArchivo` = 'foto-bienestar-3-20260727-202237.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience Google 1'
  WHERE `id` = 61 AND `urlArchivo` = 'foto-google-20260902-143250.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience Google 3'
  WHERE `id` = 63 AND `urlArchivo` = 'foto-google-3-20260902-144729.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience innovation 1'
  WHERE `id` = 64 AND `urlArchivo` = 'foto-innovacion-20260902-145256.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience innovation 2'
  WHERE `id` = 65 AND `urlArchivo` = 'foto-innovacion-2-20260902-145228.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SIC Experience innovation 3'
  WHERE `id` = 66 AND `urlArchivo` = 'foto-innovacion-3-20260902-145158.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Google for Education logo'
  WHERE `id` = 67 AND `urlArchivo` = 'google-education-logo-20260713-031258.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Collaborative learning'
  WHERE `id` = 68 AND `urlArchivo` = 'aprendizaje-colaborativo-ico-20260713-042159.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Digital citizenship'
  WHERE `id` = 69 AND `urlArchivo` = 'ciudadania-digital-ico-20260713-042210.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Creativity and innovation'
  WHERE `id` = 70 AND `urlArchivo` = 'creacion-innovacion-ico-20260713-034623.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Preparation for the future'
  WHERE `id` = 71 AND `urlArchivo` = 'preparacion-futuro-ico-20260713-034647.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Empowering teaching'
  WHERE `id` = 72 AND `urlArchivo` = 'potenciar-ensenanza-ico-20260713-034658.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Innovating with confidence'
  WHERE `id` = 73 AND `urlArchivo` = 'innovar-confianza-ico-20260713-034704.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Collaborating to grow'
  WHERE `id` = 74 AND `urlArchivo` = 'colaborar-crecer-ico-20260713-034710.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Inspiring students'
  WHERE `id` = 75 AND `urlArchivo` = 'inspirar-alumnos-ico-20260713-034721.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Drive'
  WHERE `id` = 76 AND `urlArchivo` = 'drive-ico-20260713-034739.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Gemini'
  WHERE `id` = 77 AND `urlArchivo` = 'gemini-ico-20260713-034745.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'NotebookLM'
  WHERE `id` = 78 AND `urlArchivo` = 'notebook-lm-ico-20260713-034752.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Calendar'
  WHERE `id` = 79 AND `urlArchivo` = 'calendar-ico-20260713-034758.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Sites'
  WHERE `id` = 80 AND `urlArchivo` = 'sites-ico-20260713-034810.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Forms'
  WHERE `id` = 81 AND `urlArchivo` = 'forms-ico-20260713-034821.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Gmail'
  WHERE `id` = 82 AND `urlArchivo` = 'gmail-ico-20260713-034828.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Classroom'
  WHERE `id` = 83 AND `urlArchivo` = 'classroom-ico-20260713-034835.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Sheets'
  WHERE `id` = 84 AND `urlArchivo` = 'sheets-ico-20260713-034842.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Docs'
  WHERE `id` = 85 AND `urlArchivo` = 'docs-ico-20260713-034848.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Slides'
  WHERE `id` = 86 AND `urlArchivo` = 'slides-ico-20260713-034855.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Creative thinking'
  WHERE `id` = 87 AND `urlArchivo` = 'pensamiento-creativo-ico-20260713-034905.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Problem solving'
  WHERE `id` = 88 AND `urlArchivo` = 'resolucion-problemas-ico-20260713-034914.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Teamwork'
  WHERE `id` = 89 AND `urlArchivo` = 'trabajo-equipo-ico-20260713-034923.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Computational thinking'
  WHERE `id` = 90 AND `urlArchivo` = 'pensamiento-computacional-ico-20260713-034935.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Robotics'
  WHERE `id` = 91 AND `urlArchivo` = 'robotica-ico-20260713-035001.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Programming'
  WHERE `id` = 92 AND `urlArchivo` = 'programacion-ico-20260713-035009.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Electronics'
  WHERE `id` = 93 AND `urlArchivo` = 'electronica-ico-20260713-035015.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Project design'
  WHERE `id` = 94 AND `urlArchivo` = 'diseno-proyectos-ico-20260713-035023.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Prototyping'
  WHERE `id` = 95 AND `urlArchivo` = 'prototipado-ico-20260713-035040.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Challenge solving'
  WHERE `id` = 96 AND `urlArchivo` = 'resolucion-desafios-ico-20260713-035047.svg';

UPDATE `medio` SET `textoAlternativoEn` = '3D printing'
  WHERE `id` = 97 AND `urlArchivo` = 'impresion-3d-ico-20260713-035058.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Tutoring'
  WHERE `id` = 114 AND `urlArchivo` = 'tutorias-ico-20260713-035844.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Emotional education'
  WHERE `id` = 115 AND `urlArchivo` = 'educacion-emocional-ico-20260713-035852.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Working alongside families'
  WHERE `id` = 116 AND `urlArchivo` = 'trabajo-familia-ico-20260713-035859.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Holistic development'
  WHERE `id` = 117 AND `urlArchivo` = 'desarrollo-integral-ico-20260713-035907.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Emotional support'
  WHERE `id` = 118 AND `urlArchivo` = 'sosten-emocional-ico-20260713-035915.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Psycho-pedagogical guidance'
  WHERE `id` = 119 AND `urlArchivo` = 'acompanamiento-pedagogico-ico-20260713-035921.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'School coexistence'
  WHERE `id` = 120 AND `urlArchivo` = 'convivencia-escolar-ico-20260713-035929.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Interdisciplinary work'
  WHERE `id` = 121 AND `urlArchivo` = 'trabajo-interdisciplinario-ico-20260713-035935.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 1'
  WHERE `id` = 122 AND `urlArchivo` = 'foto-card-tutorias-20260721-150251.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 2'
  WHERE `id` = 123 AND `urlArchivo` = 'foto-card-educacion-emocional-20260721-151048.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 3'
  WHERE `id` = 124 AND `urlArchivo` = 'foto-card-trabajo-familias-20260721-151558.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 4'
  WHERE `id` = 125 AND `urlArchivo` = 'foto-card-desarrollo-integral-20260721-152446.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 5'
  WHERE `id` = 126 AND `urlArchivo` = 'foto-card-soporte-emocional-20260721-153124.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 6'
  WHERE `id` = 127 AND `urlArchivo` = 'foto-card-guia-pedagogica-20260721-153137.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 7'
  WHERE `id` = 128 AND `urlArchivo` = 'foto-card-convivencia-escolar-20260721-153148.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Wellbeing card 8'
  WHERE `id` = 129 AND `urlArchivo` = 'foto-card-trabajo-interdisciplinario-20260721-153156.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Personalized education 1'
  WHERE `id` = 130 AND `urlArchivo` = 'image-bienvenida-20260831-155658.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Personalized education 2'
  WHERE `id` = 131 AND `urlArchivo` = 'foto-estudiantil-20260831-155824.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Everyday contact with English'
  WHERE `id` = 132 AND `urlArchivo` = 'brindar-contacto-proposito-20260814-144222.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Comprehension and expression'
  WHERE `id` = 133 AND `urlArchivo` = 'favorecer-comprension-proposito-20260814-144230.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Language use'
  WHERE `id` = 134 AND `urlArchivo` = 'promover-idioma-proposito-20260814-144236.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'English as a means of access'
  WHERE `id` = 135 AND `urlArchivo` = 'utilizar-ingles-proposito-20260814-144242.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Confidence and autonomy'
  WHERE `id` = 136 AND `urlArchivo` = 'fortalecer-confianza-proposito-20260814-144255.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Curriculum alignment'
  WHERE `id` = 137 AND `urlArchivo` = 'articular-lengua-proposito-20260814-144302.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Other cultures'
  WHERE `id` = 138 AND `urlArchivo` = 'ampliar-comprension-proposito-20260814-144308.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Tools for global contexts'
  WHERE `id` = 139 AND `urlArchivo` = 'brindar-herramientas-proposito-20260814-144317.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'The value of play 1'
  WHERE `id` = 140 AND `urlArchivo` = 'banner-kindergarten-20260901-133449.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'The value of play 2'
  WHERE `id` = 141 AND `urlArchivo` = 'foto-isidro-play-20260901-135425.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Literature as a starting point'
  WHERE `id` = 142 AND `urlArchivo` = 'banner-primary-20260901-133725.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Meaningful learning'
  WHERE `id` = 143 AND `urlArchivo` = 'foto-estudiantil-2-20260901-133809.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Communicative competence'
  WHERE `id` = 144 AND `urlArchivo` = 'competencia-comunicativa-primary-card-20260814-144415.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Scientific and technological literacy'
  WHERE `id` = 145 AND `urlArchivo` = 'alfabetizacion-primary-card-20260814-144420.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Problem solving'
  WHERE `id` = 146 AND `urlArchivo` = 'resolucion-problemas-primary-card-20260814-144426.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Personal, social and global citizenship education'
  WHERE `id` = 147 AND `urlArchivo` = 'formacion-personal-primary-card-20260814-144437.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Education for Sustainability'
  WHERE `id` = 148 AND `urlArchivo` = 'sustentabilidad-primary-card-20260814-144443.svg';

UPDATE `medio` SET `textoAlternativoEn` = 'Communicative competence'
  WHERE `id` = 149 AND `urlArchivo` = 'banner-primary-20260901-134443.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Scientific and technological literacy'
  WHERE `id` = 150 AND `urlArchivo` = 'foto-balance-1-20260901-144111.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Problem solving'
  WHERE `id` = 151 AND `urlArchivo` = 'foto-estudiantil-20260901-151240.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Personal, social and global citizenship education'
  WHERE `id` = 152 AND `urlArchivo` = 'foto-hockey-20260901-151452.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Education for Sustainability'
  WHERE `id` = 153 AND `urlArchivo` = 'foto-balance-3-20260901-135106.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Art and creativity 1'
  WHERE `id` = 155 AND `urlArchivo` = 'foto-isidro-play-20260902-152849.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Art and creativity 2'
  WHERE `id` = 156 AND `urlArchivo` = 'foto-isidro-play-2-20260902-152909.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Art and creativity 3'
  WHERE `id` = 157 AND `urlArchivo` = 'foto-isidro-play-3-20260902-152932.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and social commitment 1'
  WHERE `id` = 158 AND `urlArchivo` = 'foto-isidro-play-20260902-150040.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and social commitment 2'
  WHERE `id` = 159 AND `urlArchivo` = 'foto-isidro-play-2-20260902-150114.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and social commitment 3'
  WHERE `id` = 160 AND `urlArchivo` = 'foto-isidro-play-3-20260902-150335.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Houses 1'
  WHERE `id` = 161 AND `urlArchivo` = 'foto-isidro-play-20260902-154632.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Houses 2'
  WHERE `id` = 162 AND `urlArchivo` = 'foto-isidro-play-2-20260902-154700.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Houses 3'
  WHERE `id` = 163 AND `urlArchivo` = 'foto-isidro-play-3-20260902-154721.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Guiding growth'
  WHERE `id` = 164 AND `urlArchivo` = 'foto-estudiantil-20260902-132721.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and commitment 1'
  WHERE `id` = 165 AND `urlArchivo` = 'foto-servicio-20260902-133826.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and commitment 2'
  WHERE `id` = 166 AND `urlArchivo` = 'foto-servicio-2-20260902-132957.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and commitment 3'
  WHERE `id` = 167 AND `urlArchivo` = 'foto-servicio-3-20260902-133021.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and commitment 4'
  WHERE `id` = 168 AND `urlArchivo` = 'foto-servicio-4-20260902-133217.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Faith and commitment 5'
  WHERE `id` = 169 AND `urlArchivo` = 'foto-servicio-5-20260902-133126.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 1'
  WHERE `id` = 170 AND `urlArchivo` = 'foto-san-isidro-play-1-20260902-134647.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 2'
  WHERE `id` = 171 AND `urlArchivo` = 'foto-san-isidro-play-2-20260902-134711.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 3'
  WHERE `id` = 172 AND `urlArchivo` = 'foto-san-isidro-play-3-20260902-134728.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 4'
  WHERE `id` = 173 AND `urlArchivo` = 'foto-san-isidro-play-4-20260902-134743.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 5'
  WHERE `id` = 174 AND `urlArchivo` = 'foto-san-isidro-play-5-20260902-135152.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Service photo 6'
  WHERE `id` = 175 AND `urlArchivo` = 'foto-servicio-6-20260902-133735.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'Service photo 7'
  WHERE `id` = 176 AND `urlArchivo` = 'foto-servicio-7-20260902-134112.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'San Isidro Play 6'
  WHERE `id` = 177 AND `urlArchivo` = 'foto-san-isidro-play-6-20260902-135310.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SP 7'
  WHERE `id` = 178 AND `urlArchivo` = 'foto-san-isidro-play-7-20260902-135337.webp';

UPDATE `medio` SET `textoAlternativoEn` = 'SP 8'
  WHERE `id` = 179 AND `urlArchivo` = 'foto-san-isidro-play-8-20260902-135425.webp';
