-- Tira de fotos de la vista "Fe y compromiso social".
--
-- Reusa el grupo que ya alimenta la seccion del overview, asi las fotos de
-- servicio se cargan una sola vez desde el admin y se ven en los dos lados.
--
-- Idempotente: se puede correr dos veces sin duplicar nada.

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Experiencia SIC - Fe y Compromiso Carousel', 'CARRUSEL', NOW(3), NOW(3));

INSERT INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `subtitulo`, `propsJson`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES (
  'experiencia-sic-fe-servicio-fotos',
  'experiencia-sic-fe-y-compromiso-social',
  10,
  'GALERIA',
  'Fe y compromiso - Tira de fotos de servicio',
  NULL,
  '{"component":"photo-strip","overviewHash":"servicio"}',
  (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Fe y Compromiso Carousel' LIMIT 1),
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
