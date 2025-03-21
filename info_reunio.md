<!-- vaques sense parts els ultims X mesos:

- sex === 'f'
- !absence
- startReproductionDate !== null
- startReproductionDate to Today > X [opcional amb flag a front] (Incloure [animal] que fa menys de [X] mesos que té edat per reproduir-se) => no inclurà aquest filtre
- (X month before today < births with dates < Today) === 0 (es a dir, amb 0 births entre X mesos abans i avui) -->

Al crear una vaca, diferenciar entre vaca comprada i vaca nascuda!!!!

- Vaca comprada no te id de mare ni pare
- Vaca nascuda es obligatori posar id mare i pare

1Vaca:

- Vaca sense edat reproductiva:
  -- Sense edat
  -- No mitjana
- Vaca amb edat reproductiva i 0 parts:
  -- Novella des de X mesos
  -- No mitjana
- Vaca amb edat reproductiva i 1 part:
  -- Ultim part fa X mesos
  -- No mitjana
- Vaca amb edat reproductiva i 2+ parts:
  -- Ultim part fa X mesos
  -- SI mitjana parts

Vaques:

- mitjana parts ramat històric
- mitjana parts ramat per any

DADES IMPORTANTS!
longCode: (son diferents, no tots iguals)
shortCode: (vaques: 4 últimes, ovelles: 5 ultimes xifres | del codi llarg) (poden repetirse. si es repeteixen el llarg es diferent)

registrarPart (aquesta accio es un POST a cows on ja es passa amb la info de la nova vaca, l'id de la vacaMare i la id del pare (s'ha de seleccionar d'un llistat))

Sort cows:
per codi curt
per dataNaixament
