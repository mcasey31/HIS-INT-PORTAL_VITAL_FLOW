begin;

alter table sch_agenda.efector
    add column if not exists usuario_id uuid,
    add column if not exists matricula_provincial varchar(64),
    add column if not exists matricula_nacional varchar(64);

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_efector_usuario_sistema'
          and conrelid = 'sch_agenda.efector'::regclass
    ) then
        alter table sch_agenda.efector
            add constraint fk_efector_usuario_sistema
            foreign key (usuario_id)
            references sch_seguridad.usuario_sistema(id);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'uq_efector_usuario_id'
          and conrelid = 'sch_agenda.efector'::regclass
    ) then
        alter table sch_agenda.efector
            add constraint uq_efector_usuario_id unique (usuario_id);
    end if;
end
$$;

-- Backfill legacy medico effectors where the user and efector share the same id.
update sch_agenda.efector e
set usuario_id = e.id,
    updated_at = now()
from sch_seguridad.usuario_sistema u
where e.usuario_id is null
  and u.id = e.id;

-- Recover matriculas from legacy efector name labels when available.
update sch_agenda.efector
set matricula_provincial = substring(upper(nombre) from '(MP[0-9A-Z]{2,})'),
    updated_at = now()
where matricula_provincial is null
  and nombre ~* 'MP[0-9A-Z]{2,}';

update sch_agenda.efector
set matricula_nacional = substring(upper(nombre) from '(MN[0-9A-Z]{2,})'),
    updated_at = now()
where matricula_nacional is null
  and nombre ~* 'MN[0-9A-Z]{2,}';

commit;
