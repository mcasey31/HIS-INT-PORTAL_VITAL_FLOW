-- 044 - Estados de entrega de receta digital
--
-- Contexto: sch_hca.receta_digital.estado soloavia dos valores-Etado
-- PUBLICADA_REPOSITORIO y ANULADA-y el dominio no estaba restringido en la
-- base: no habia ningun CHECK constraint, asi que el unico control estaba en
-- el codigo C# (HistoriaClinicaService.cs). La app movil de recepcion
-- necesita distinguir "la receta todavia no se le entrego al paciente" de
-- "ya se le entrego" y de "se imprimio", que es lo que permite el circuito de
-- mostrador.
--
-- Maquina de estados (validada en HistoriaClinicaService):
--
--   PUBLICADA_REPOSITORIO --> PENDIENTE_DE_ENTREGA --> ENTREGADA
--           |                       |
--           +--> IMPRESA ------------+
--           |         |
--           |         +--> ENTREGADA
--           |
--           +--> ANULADA
--
--   ENTREGADA  -> estado final
--   ANULADA    -> estado final
--   IMPRESA    -> ENTREGADA | ANULADA
--
-- Ademas se activa sch_hca.receta_digital_evento, que existia en el esquema
-- pero ningun codigo escribia. Cada transicion queda auditada con
-- tipo_evento, payload_json y el usuario que la ejecuto.

begin;

-- ---------------------------------------------------------------------------
-- 1) Restringir el dominio de estados
-- ---------------------------------------------------------------------------
-- La tabla esta vacia en este entorno, pero el constraint se agrega de forma
-- defensiva: primero se normaliza cualquier estado historico no contemplado a
-- PUBLICADA_REPOSITORIO para que el ALTER no falle por datos existentes.
update sch_hca.receta_digital
set estado = 'PUBLICADA_REPOSITORIO'
where estado is null
   or upper(trim(estado)) not in (
        'PUBLICADA_REPOSITORIO',
        'PENDIENTE_DE_ENTREGA',
        'IMPRESA',
        'ENTREGADA',
        'ANULADA'
   );

alter table sch_hca.receta_digital
    drop constraint if exists receta_digital_estado_chk;

alter table sch_hca.receta_digital
    add constraint receta_digital_estado_chk
    check (estado in (
        'PUBLICADA_REPOSITORIO',
        'PENDIENTE_DE_ENTREGA',
        'IMPRESA',
        'ENTREGADA',
        'ANULADA'
    ));

-- Los items de la receta tienen su propio estado (solo ACTIVA por ahora).
update sch_hca.receta_digital_item
set estado = 'ACTIVA'
where estado is null or upper(trim(estado)) <> 'ACTIVA';

alter table sch_hca.receta_digital_item
    drop constraint if exists receta_digital_item_estado_chk;

alter table sch_hca.receta_digital_item
    add constraint receta_digital_item_estado_chk
    check (estado = 'ACTIVA');

-- ---------------------------------------------------------------------------
-- 2) Habilitar la auditoria de receta_digital_evento
-- ---------------------------------------------------------------------------
-- La tabla existia pero no tenia dominio restringido. tipo_evento registra el
-- motivo de cada transicion.
alter table sch_hca.receta_digital_evento
    drop constraint if exists receta_digital_evento_tipo_chk;

alter table sch_hca.receta_digital_evento
    add constraint receta_digital_evento_tipo_chk
    check (tipo_evento in (
        'CREADA',
        'ESTADO_CAMBIADO',
        'IMPRESA',
        'ANULADA',
        'ENVIADA_EMAIL'
    ));

-- Indice para consultar el historial de una receta sin escanear la tabla.
create index if not exists ix_receta_digital_evento_receta
    on sch_hca.receta_digital_evento (receta_id, created_at desc);

-- Indice para el listado de recetas por estado, que es el filtro que usa la
-- app de recepcion para el tablero de recetas pendientes de entrega.
create index if not exists ix_receta_digital_estado
    on sch_hca.receta_digital (estado, created_at desc);

commit;