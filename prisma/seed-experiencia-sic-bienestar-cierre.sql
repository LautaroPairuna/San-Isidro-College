-- Foto de cierre de la pagina "Bienestar y Acompanamiento" (bloque
-- "Acompanar para crecer"), editable desde el admin como medio unico.
--
-- Sigue el mismo patron que las fotos de Kindergarden / Primary en
-- seed-medios-editables.sql: un grupo UNICO, un medio adentro y una seccion
-- MEDIA_UNICA que lo apunta. Es idempotente: si el grupo ya tiene un medio,
-- no agrega otro, y si la seccion ya existe solo le completa el medio.
--
-- La foto inicial se copia del grupo "Vida Estudiantil - Bienestar", que existe
-- tanto en local como en produccion (los nombres de archivo difieren entre los
-- dos entornos, por eso no se escriben a mano).

INSERT IGNORE INTO `grupomedios` (`nombre`, `tipoGrupo`, `creadoEn`, `actualizadoEn`)
VALUES ('Experiencia SIC - Bienestar Cierre', 'UNICO', NOW(3), NOW(3));

SET @grupo := (SELECT `id` FROM `grupomedios` WHERE `nombre` = 'Experiencia SIC - Bienestar Cierre');
SET @vacio := (SELECT COUNT(*) = 0 FROM `medio` WHERE `grupoMediosId` = @grupo);

INSERT INTO `medio` (`urlArchivo`, `urlMiniatura`, `textoAlternativo`, `tipo`, `posicion`, `grupoMediosId`, `creadoEn`, `actualizadoEn`)
SELECT src.`urlArchivo`, src.`urlMiniatura`, 'Acompanar para crecer', 'IMAGEN', 10, @grupo, NOW(3), NOW(3)
FROM `medio` src
INNER JOIN `grupomedios` origen ON origen.`id` = src.`grupoMediosId`
WHERE origen.`nombre` = 'Vida Estudiantil - Bienestar' AND @vacio
ORDER BY src.`posicion`, src.`id`
LIMIT 1;

SET @medio := (SELECT `id` FROM `medio` WHERE `grupoMediosId` = @grupo ORDER BY `posicion` LIMIT 1);

INSERT IGNORE INTO `seccion` (`slug`, `pagina`, `orden`, `tipo`, `titulo`, `grupoId`, `medioId`, `creadoEn`, `actualizadoEn`)
VALUES (
  'experiencia-sic-bienestar-cierre',
  'experiencia-sic-bienestar-y-acompanamiento',
  70,
  'MEDIA_UNICA',
  'Bienestar - Foto de cierre',
  NULL,
  @medio,
  NOW(3),
  NOW(3)
);

-- Si la seccion ya existia sin medio asignado, se lo completa.
UPDATE `seccion` SET `medioId` = @medio, `actualizadoEn` = NOW(3)
WHERE `slug` = 'experiencia-sic-bienestar-cierre' AND `medioId` IS NULL;
