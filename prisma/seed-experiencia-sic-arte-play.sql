-- Las fotos de San Isidro Play pasan a la vista de Arte y creatividad.
--
-- El grupo de medios que alimentaba la seccion de San Isidro Play del overview
-- sigue existiendo con sus fotos; lo unico que cambia es donde se usa y como se
-- llama en el admin, porque "Vida Estudiantil" ya no es una pagina del sitio.
--
-- Idempotente: se puede correr dos veces sin duplicar nada.

-- 1. El grupo pasa a llamarse como la seccion donde se usa ahora.
UPDATE `grupomedios`
SET `nombre` = 'Experiencia SIC - San Isidro Play', `actualizadoEn` = NOW(3)
WHERE `nombre` = 'Vida Estudiantil - Play';

-- Si la base es nueva y no existia el grupo viejo, se crea vacio para que la
-- seccion tenga a que apuntar.
INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Experiencia SIC - San Isidro Play', 'CARRUSEL', NOW(3), NOW(3));

-- 2. La seccion de la vista de Arte y creatividad que muestra la tira de fotos.
INSERT INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `subtitulo`, `propsJson`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES (
  'experiencia-sic-arte-play',
  'experiencia-sic-arte-y-creatividad',
  10,
  'GALERIA',
  'San Isidro Play - Tira de fotos',
  NULL,
  '{"component":"photo-strip","overviewHash":"san-isidro-play"}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - San Isidro Play' LIMIT 1),
  NULL,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `pagina` = VALUES(`pagina`),
  `orden` = VALUES(`orden`),
  `tipo` = VALUES(`tipo`),
  `titulo` = VALUES(`titulo`),
  `propsJson` = VALUES(`propsJson`),
  `grupoId` = VALUES(`grupoId`),
  `actualizadoEn` = NOW(3);

-- 3. La seccion vieja del overview de Vida Estudiantil ya no la usa nadie: el
--    grupo queda referenciado solo desde Arte y creatividad.
DELETE FROM `seccion` WHERE `slug` = 'vida-estudiantil-play';
