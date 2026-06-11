import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  buscarPersonaEstructura,
  getNodosEstructuraInterna,
  getRegistrosNodo,
  getTiposDocumentoEstructura,
  NodoEstructuraInterna,
  PersonaIdentificadaEstructura,
  RegistroNodo,
  saveRegistroNodo,
  TipoDocumentoEstructura,
} from "./estructuraInternaApi";

type EstructuraInternaPageProps = {};

const ORDEN_NODOS = [
  "centro",
  "servicio",
  "financiadores-planes",
  "practicas",
  "usuarios-sistema",
  "roles-seguridad",
  "personal",
  "dispositivos",
  "profesionales",
  "grupo-profesionales"
] as const;

export function EstructuraInternaPage({}: EstructuraInternaPageProps) {
  const navigate = useNavigate();
  const [nodoActivo, setNodoActivo] = useState("centro");
  const [expandedPersonal, setExpandedPersonal] = useState(true);
  const [nodos, setNodos] = useState<NodoEstructuraInterna[]>([]);
  const [registros, setRegistros] = useState<RegistroNodo[]>([]);
  const [rolesSeguridad, setRolesSeguridad] = useState<RegistroNodo[]>([]);
  const [centrosCatalogo, setCentrosCatalogo] = useState<RegistroNodo[]>([]);
  const [serviciosCatalogo, setServiciosCatalogo] = useState<RegistroNodo[]>([]);
  const [financiadorSeleccionadoId, setFinanciadorSeleccionadoId] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoEstructura[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaIdentificadaEstructura | null>(null);
  const [editingUsuarioId, setEditingUsuarioId] = useState<string | null>(null);
  const [buscandoPersona, setBuscandoPersona] = useState(false);
  const [mensajePersona, setMensajePersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [nodosResult, tiposDocumentoResult] = await Promise.all([
          getNodosEstructuraInterna(),
          getTiposDocumentoEstructura(),
        ]);
        setNodos(nodosResult);
        setTiposDocumento(tiposDocumentoResult);
        if (tiposDocumentoResult.length > 0) {
          setTipoDocumento(tiposDocumentoResult[0].codigo);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "No se pudieron cargar los nodos de estructura interna.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const nodoSeleccionado = useMemo(() => {
    if (nodos.length === 0) {
      return null;
    }

    return nodos.find((item) => item.id === nodoActivo) ?? nodos[0];
  }, [nodoActivo, nodos]);

  const nodosRaiz = useMemo(
    () => ORDEN_NODOS
      .filter((id) => id !== "dispositivos" && id !== "profesionales" && id !== "grupo-profesionales")
      .map((id) => nodos.find((item) => item.id === id) ?? null)
      .filter((item): item is NodoEstructuraInterna => item !== null),
    [nodos]
  );

  const nodosPersonal = useMemo(
    () => ["dispositivos", "profesionales", "grupo-profesionales"]
      .map((id) => nodos.find((item) => item.id === id) ?? null)
      .filter((item): item is NodoEstructuraInterna => item !== null),
    [nodos]
  );

  useEffect(() => {
    if (!nodoSeleccionado || nodoSeleccionado.id === "personal") {
      setRegistros([]);
      setRolesSeguridad([]);
      setCentrosCatalogo([]);
      setServiciosCatalogo([]);
      setFormValues({});
      return;
    }

    const load = async () => {
      setError(null);
      try {
        if (nodoSeleccionado.id === "usuarios-sistema") {
          const [usuariosResult, rolesResult, centrosResult, serviciosResult] = await Promise.all([
            getRegistrosNodo(nodoSeleccionado.id),
            getRegistrosNodo("roles-seguridad"),
            getRegistrosNodo("centro"),
            getRegistrosNodo("servicio")
          ]);
          setRegistros(usuariosResult);
          setRolesSeguridad(rolesResult);
          setCentrosCatalogo(centrosResult);
          setServiciosCatalogo(serviciosResult);
        } else if (nodoSeleccionado.id === "servicio") {
          const [serviciosResult, centrosResult] = await Promise.all([
            getRegistrosNodo("servicio"),
            getRegistrosNodo("centro")
          ]);
          setRegistros(serviciosResult);
          setServiciosCatalogo(serviciosResult);
          setCentrosCatalogo(centrosResult);
          setRolesSeguridad([]);
        } else if (nodoSeleccionado.id === "practicas") {
          const [practicasResult, centrosResult, serviciosResult] = await Promise.all([
            getRegistrosNodo("practicas"),
            getRegistrosNodo("centro"),
            getRegistrosNodo("servicio")
          ]);
          setRegistros(practicasResult);
          setCentrosCatalogo(centrosResult);
          setServiciosCatalogo(serviciosResult);
          setRolesSeguridad([]);
        } else {
          const result = await getRegistrosNodo(nodoSeleccionado.id);
          setRegistros(result);
          if (nodoSeleccionado.id === "centro") {
            setCentrosCatalogo(result);
            setServiciosCatalogo([]);
          } else {
            setCentrosCatalogo([]);
            setServiciosCatalogo([]);
          }
          if (nodoSeleccionado.id === "roles-seguridad") {
            setRolesSeguridad(result);
          } else {
            setRolesSeguridad([]);
          }
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "No se pudieron cargar registros.";
        setError(message);
        setRegistros([]);
        setRolesSeguridad([]);
        setCentrosCatalogo([]);
        setServiciosCatalogo([]);
      }
    };

    const defaults: Record<string, string> = {};
    nodoSeleccionado.campos.forEach((campo) => {
      defaults[campo.nombre] = "";
    });
    if (nodoSeleccionado.id === "usuarios-sistema") {
      defaults.estado = "ACTIVO";
    }
    if (nodoSeleccionado.id === "centro" || nodoSeleccionado.id === "servicio") {
      defaults.activo = "true";
    }
    if (nodoSeleccionado.id === "practicas") {
      defaults.activa = "true";
    }
    setFormValues(defaults);
    setPersonaSeleccionada(null);
    setEditingUsuarioId(null);
    setFinanciadorSeleccionadoId("");
    setNumeroDocumento("");
    setMensajePersona(null);

    void load();
  }, [nodoSeleccionado]);

  useEffect(() => {
    if (!nodoSeleccionado) {
      return;
    }

    if (nodoSeleccionado.id === "practicas") {
      const centroId = formValues.centro_id || "";
      if (!centroId) {
        if (formValues.servicio_id) {
          setFormValues((prev) => ({ ...prev, servicio_id: "" }));
        }
        return;
      }

      const serviciosFiltrados = serviciosCatalogo.filter((servicio) => servicio.campos.centro_id === centroId);
      const servicioActualValido = serviciosFiltrados.some((servicio) => servicio.id === formValues.servicio_id);

      if (!servicioActualValido && formValues.servicio_id) {
        setFormValues((prev) => ({ ...prev, servicio_id: "" }));
      }
    }
  }, [nodoSeleccionado, centrosCatalogo, serviciosCatalogo, formValues.centro_id, formValues.servicio_id]);

  useEffect(() => {
    if (!nodoSeleccionado || nodoSeleccionado.id !== "usuarios-sistema") {
      return;
    }

    const centroId = formValues.centro_id || "";
    const servicioId = formValues.servicio_id || "";

    if (!centroId || centroId === "TODOS") {
      if (servicioId) {
        setFormValues((prev) => ({ ...prev, servicio_id: "" }));
      }
      return;
    }

    const servicioValido = serviciosCatalogo.some((servicio) => servicio.id === servicioId && servicio.campos.centro_id === centroId);
    if (!servicioValido && servicioId) {
      setFormValues((prev) => ({ ...prev, servicio_id: "" }));
    }
  }, [nodoSeleccionado, serviciosCatalogo, formValues.centro_id, formValues.servicio_id]);

  useEffect(() => {
    if (!nodoSeleccionado || nodoSeleccionado.id !== "usuarios-sistema") {
      return;
    }

    const esMedico = (formValues.rol_nombre ?? "").trim().localeCompare("Medico", undefined, { sensitivity: "accent" }) === 0;
    if (esMedico) {
      return;
    }

    if ((formValues.servicio_id ?? "") || (formValues.matricula_provincial ?? "") || (formValues.matricula_nacional ?? "")) {
      setFormValues((prev) => ({
        ...prev,
        servicio_id: "",
        matricula_provincial: "",
        matricula_nacional: "",
      }));
    }
  }, [
    nodoSeleccionado,
    formValues.rol_nombre,
    formValues.servicio_id,
    formValues.matricula_provincial,
    formValues.matricula_nacional,
  ]);

  useEffect(() => {
    if (!nodoSeleccionado || nodoSeleccionado.id !== "usuarios-sistema") {
      return;
    }

    if (rolesSeguridad.length === 0) {
      return;
    }

    if (!formValues.rol_nombre) {
      const primerRol = rolesSeguridad[0].campos.nombre ?? "";
      if (primerRol) {
        setFormValues((prev) => ({ ...prev, rol_nombre: primerRol }));
      }
    }
  }, [nodoSeleccionado, rolesSeguridad, formValues.rol_nombre]);

  const onBuscarPersona = async () => {
    if (numeroDocumento.trim().length === 0) {
      setError("Debe ingresar un numero de documento para identificar la persona.");
      return;
    }

    setBuscandoPersona(true);
    setError(null);
    setMensajePersona(null);

    try {
      const resultado = await buscarPersonaEstructura(tipoDocumento, numeroDocumento.trim());
      if (resultado.length === 0) {
        setPersonaSeleccionada(null);
        setMensajePersona("No se encontro persona para el documento ingresado. Para continuar debe enrolarla.");
        return;
      }

      const persona = resultado[0];
      setPersonaSeleccionada(persona);
      setFormValues((prev) => ({ ...prev, persona_id: persona.id }));
      setMensajePersona(`Persona identificada: ${persona.apellidosNombres}.`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo identificar la persona.";
      setError(message);
      setPersonaSeleccionada(null);
    } finally {
      setBuscandoPersona(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nodoSeleccionado || nodoSeleccionado.id === "personal") {
      return;
    }

    setSaving(true);
    setError(null);
    setInfo(null);

    try {
      if (nodoSeleccionado.id === "usuarios-sistema") {
        if (!personaSeleccionada) {
          throw new Error("Primero debe identificar una persona existente.");
        }

        const rolNombre = (formValues.rol_nombre ?? "").trim();
        const esRolMedico = rolNombre.localeCompare("Medico", undefined, { sensitivity: "accent" }) === 0;
        const servicioId = (formValues.servicio_id ?? "").trim();
        const matriculaProvincial = (formValues.matricula_provincial ?? "").trim().toUpperCase();
        const matriculaNacional = (formValues.matricula_nacional ?? "").trim().toUpperCase();

        if (esRolMedico) {
          if (!(formValues.centro_id ?? "").trim() || (formValues.centro_id ?? "").trim().toUpperCase() === "TODOS") {
            throw new Error("Para rol Medico debe seleccionar un centro especifico.");
          }
          if (!servicioId) {
            throw new Error("Para rol Medico debe seleccionar un servicio.");
          }
          if (!matriculaProvincial && !matriculaNacional) {
            throw new Error("Para rol Medico debe informar Matricula Provincial (MP...) o Matricula Nacional (MN...).");
          }
        }

        const campos: Record<string, string> = {
          persona_id: personaSeleccionada.id,
          username: (formValues.username ?? "").trim(),
          centro_id: (formValues.centro_id ?? "").trim(),
          rol_nombre: rolNombre,
          estado: (formValues.estado ?? "ACTIVO").trim().toUpperCase(),
        };

        if (editingUsuarioId) {
          campos.id = editingUsuarioId;
        } else {
          campos.temporary_password = (formValues.temporary_password ?? "").trim();
        }

        if (esRolMedico) {
          campos.servicio_id = servicioId;
          if (matriculaProvincial) {
            campos.matricula_provincial = matriculaProvincial;
          }
          if (matriculaNacional) {
            campos.matricula_nacional = matriculaNacional;
          }
        }

        const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
        setInfo(editingUsuarioId ? `Usuario actualizado correctamente (${saved.id}).` : `Usuario creado correctamente (${saved.id}).`);
        const updated = await getRegistrosNodo(nodoSeleccionado.id);
        setRegistros(updated);

        setPersonaSeleccionada(null);
        setEditingUsuarioId(null);
        setNumeroDocumento("");
        setMensajePersona(null);
        setFormValues((prev) => ({
          ...prev,
          persona_id: "",
          username: "",
          temporary_password: "",
          centro_id: "",
          servicio_id: "",
          matricula_provincial: "",
          matricula_nacional: "",
          estado: "ACTIVO",
        }));
        return;
      }

      if (nodoSeleccionado.id === "centro") {
        const campos: Record<string, string> = {
          nombre: (formValues.nombre ?? "").trim(),
          direccion: (formValues.direccion ?? "").trim(),
          telefono: (formValues.telefono ?? "").trim(),
          mail: (formValues.mail ?? "").trim(),
          activo: formValues.activo === "false" ? "false" : "true"
        };

        const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
        setInfo(`Registro guardado en ${saved.nodoId}.`);
        const updated = await getRegistrosNodo(nodoSeleccionado.id);
        setRegistros(updated);
        setCentrosCatalogo(updated);
        setFormValues({ nombre: "", direccion: "", telefono: "", mail: "", activo: "true" });
        return;
      }

      if (nodoSeleccionado.id === "servicio") {
        const campos: Record<string, string> = {
          centro_id: (formValues.centro_id ?? "").trim(),
          nombre: (formValues.nombre ?? "").trim(),
          activo: formValues.activo === "false" ? "false" : "true"
        };

        const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
        setInfo(`Registro guardado en ${saved.nodoId}.`);
        const updated = await getRegistrosNodo(nodoSeleccionado.id);
        setRegistros(updated);
        setServiciosCatalogo(updated);
        setFormValues((prev) => ({
          centro_id: prev.centro_id || "",
          nombre: "",
          activo: "true"
        }));
        return;
      }

      if (nodoSeleccionado.id === "practicas") {
        const campos: Record<string, string> = {
          centro_id: (formValues.centro_id ?? "").trim(),
          servicio_id: (formValues.servicio_id ?? "").trim(),
          nombre: (formValues.nombre ?? "").trim(),
          activa: formValues.activa === "false" ? "false" : "true"
        };

        const duracion = (formValues.duracion_minutos_sugerida ?? "").trim();
        const codigoClinico = (formValues.codigo_clinico ?? "").trim();
        if (duracion.length > 0) {
          campos.duracion_minutos_sugerida = duracion;
        }
        if (codigoClinico.length > 0) {
          campos.codigo_clinico = codigoClinico;
        }

        const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
        setInfo(`Registro guardado en ${saved.nodoId}.`);
        const updated = await getRegistrosNodo(nodoSeleccionado.id);
        setRegistros(updated);
        setFormValues((prev) => ({
          centro_id: prev.centro_id || "",
          servicio_id: "",
          nombre: "",
          duracion_minutos_sugerida: "",
          codigo_clinico: "",
          activa: "true"
        }));
        return;
      }

      if (nodoSeleccionado.id === "financiadores-planes") {
        const planCodigo = (formValues.plan_codigo ?? "").trim();
        const planNombre = (formValues.plan_nombre ?? "").trim();
        const activo = formValues.activo === "false" ? "false" : "true";

        if (!planCodigo || !planNombre) {
          throw new Error("Debe completar codigo y nombre del plan.");
        }

        let financiadorCodigo = "";
        let financiadorNombre = "";
        const campos: Record<string, string> = {
          plan_codigo: planCodigo,
          plan_nombre: planNombre,
          activo,
        };

        if (financiadorSeleccionadoId) {
          const seleccionado = financiadoresCatalogo.find((financiador) => financiador.id === financiadorSeleccionadoId);
          if (!seleccionado) {
            throw new Error("Seleccione un financiador valido.");
          }

          financiadorCodigo = seleccionado.codigo;
          financiadorNombre = seleccionado.nombre;
          campos.financiador_id = seleccionado.id;
        } else {
          financiadorCodigo = (formValues.financiador_codigo ?? "").trim();
          financiadorNombre = (formValues.financiador_nombre ?? "").trim();
          if (!financiadorCodigo || !financiadorNombre) {
            throw new Error("Para alta inicial debe completar codigo y nombre del financiador.");
          }
        }

        campos.financiador_codigo = financiadorCodigo;
        campos.financiador_nombre = financiadorNombre;

        const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
        setInfo(`Relacion Financiador/Plan guardada (${saved.id}).`);

        const updated = await getRegistrosNodo(nodoSeleccionado.id);
        setRegistros(updated);

        const savedFinanciadorId = (saved.campos.financiador_id ?? "").trim();
        if (savedFinanciadorId) {
          setFinanciadorSeleccionadoId(savedFinanciadorId);
        }

        setFormValues((prev) => ({
          ...prev,
          financiador_codigo: savedFinanciadorId ? "" : financiadorCodigo,
          financiador_nombre: savedFinanciadorId ? "" : financiadorNombre,
          plan_codigo: "",
          plan_nombre: "",
          activo: "true",
        }));

        return;
      }

      const campos: Record<string, string> = {};
      Object.entries(formValues).forEach(([key, value]) => {
        if (value.trim().length > 0) {
          campos[key] = value.trim();
        }
      });

      const saved = await saveRegistroNodo(nodoSeleccionado.id, campos);
      setInfo(`Registro guardado en ${saved.nodoId}.`);
      const updated = await getRegistrosNodo(nodoSeleccionado.id);
      setRegistros(updated);

      const next = { ...formValues };
      Object.keys(next).forEach((key) => {
        if (key !== "id" && key !== "grupo_id" && key !== "plan_id" && key !== "financiador_id") {
          next[key] = "";
        }
      });
      setFormValues(next);
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo guardar el registro.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const onLimpiar = () => {
    if (nodoSeleccionado?.id === "usuarios-sistema") {
      setPersonaSeleccionada(null);
      setEditingUsuarioId(null);
      setNumeroDocumento("");
      setMensajePersona(null);
    }

    if (nodoSeleccionado?.id === "financiadores-planes") {
      setFinanciadorSeleccionadoId("");
    }

    const next = { ...formValues };
    Object.keys(next).forEach((key) => {
      next[key] = "";
    });
    if (nodoSeleccionado?.id === "usuarios-sistema") {
      next.estado = "ACTIVO";
      next.centro_id = "";
      next.servicio_id = "";
      next.matricula_provincial = "";
      next.matricula_nacional = "";
      if (rolesSeguridad.length > 0) {
        next.rol_nombre = rolesSeguridad[0].campos.nombre ?? "";
      }
    }
    if (nodoSeleccionado?.id === "centro" || nodoSeleccionado?.id === "servicio") {
      next.activo = "true";
    }
    if (nodoSeleccionado?.id === "servicio") {
      next.centro_id = "";
    }
    if (nodoSeleccionado?.id === "practicas") {
      next.centro_id = "";
      next.servicio_id = "";
      next.activa = "true";
    }
    if (nodoSeleccionado?.id === "financiadores-planes") {
      next.financiador_codigo = "";
      next.financiador_nombre = "";
      next.plan_codigo = "";
      next.plan_nombre = "";
      next.activo = "true";
    }
    setFormValues(next);
  };

  const parseSingleValue = (value: string | null | undefined): string => {
    if (!value) {
      return "";
    }

    return value.split(",")[0]?.trim() ?? "";
  };

  const onEditarUsuario = (registro: RegistroNodo) => {
    const personaId = (registro.campos.persona_id ?? "").trim();
    const username = (registro.campos.username ?? "").trim();
    const centroId = parseSingleValue(registro.campos.centro_id);
    const servicioId = parseSingleValue(registro.campos.servicio_id);
    const matriculaProvincial = parseSingleValue(registro.campos.matricula_provincial);
    const matriculaNacional = parseSingleValue(registro.campos.matricula_nacional);
    const rolNombre = parseSingleValue(registro.campos.rol_nombre);
    const estado = ((registro.campos.estado ?? "ACTIVO").trim().toUpperCase() === "INACTIVO") ? "INACTIVO" : "ACTIVO";

    setEditingUsuarioId(registro.id);
    setPersonaSeleccionada({
      id: personaId,
      apellidosNombres: (registro.campos.persona_nombre ?? "Persona seleccionada").trim() || "Persona seleccionada",
      tipoDocumento: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      sexoBiologico: "",
      estado: "ACTIVO",
      porcentajeCoincidencia: 100,
    });
    setMensajePersona("Modo edicion activo. Puede modificar usuario, centro, servicio, rol y estado.");
    setFormValues((prev) => ({
      ...prev,
      persona_id: personaId,
      username,
      temporary_password: "",
      centro_id: centroId,
      servicio_id: servicioId,
      matricula_provincial: matriculaProvincial,
      matricula_nacional: matriculaNacional,
      rol_nombre: rolNombre,
      estado,
    }));
  };

  const isUsuariosSistema = nodoSeleccionado?.id === "usuarios-sistema";
  const isCentro = nodoSeleccionado?.id === "centro";
  const isServicio = nodoSeleccionado?.id === "servicio";
  const isPracticas = nodoSeleccionado?.id === "practicas";
  const isFinanciadoresPlanes = nodoSeleccionado?.id === "financiadores-planes";
  const isRolMedico = isUsuariosSistema
    ? (formValues.rol_nombre ?? "").trim().localeCompare("Medico", undefined, { sensitivity: "accent" }) === 0
    : false;
  const serviciosUsuariosFiltrados = isUsuariosSistema
    ? serviciosCatalogo.filter((servicio) => servicio.campos.centro_id === formValues.centro_id)
    : [];
  const serviciosFiltradosPorCentro = isPracticas
    ? serviciosCatalogo.filter((servicio) => servicio.campos.centro_id === formValues.centro_id)
    : serviciosCatalogo;
  const financiadoresCatalogo = useMemo(() => {
    const map = new Map<string, { id: string; codigo: string; nombre: string }>();

    registros.forEach((registro) => {
      const financiadorId = (registro.campos.financiador_id ?? "").trim();
      if (!financiadorId || map.has(financiadorId)) {
        return;
      }

      map.set(financiadorId, {
        id: financiadorId,
        codigo: (registro.campos.financiador_codigo ?? "").trim(),
        nombre: (registro.campos.financiador_nombre ?? "").trim(),
      });
    });

    return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [registros]);
  const planesFinanciadorSeleccionado = useMemo(() => {
    if (!financiadorSeleccionadoId) {
      return [];
    }

    return registros
      .filter((registro) => (registro.campos.financiador_id ?? "") === financiadorSeleccionadoId)
      .sort((a, b) => (a.campos.plan_nombre ?? "").localeCompare(b.campos.plan_nombre ?? ""));
  }, [registros, financiadorSeleccionadoId]);

  useEffect(() => {
    if (!isFinanciadoresPlanes || !financiadorSeleccionadoId) {
      return;
    }

    const exists = financiadoresCatalogo.some((financiador) => financiador.id === financiadorSeleccionadoId);
    if (!exists) {
      setFinanciadorSeleccionadoId("");
    }
  }, [isFinanciadoresPlanes, financiadoresCatalogo, financiadorSeleccionadoId]);

  if (loading) {
    return (
      <section className="estructura-page" aria-label="ABM Estructura Interna">
        <p>Cargando estructura interna...</p>
      </section>
    );
  }

  return (
    <section className="estructura-page" aria-label="ABM Estructura Interna">
      <header className="estructura-header">
        <h2>Estructura Interna</h2>
        <p>Configuracion de catalogos maestros para arbol Centro - Servicio - Practica y Personal.</p>
      </header>

      <div className="estructura-content">
        <aside className="estructura-tree" aria-label="Menu arbol de configuracion">
          <p className="estructura-tree-title">Menu arbol</p>
          {nodosRaiz.map((nodo) => {
            if (nodo.id === "personal") {
              return (
                <div key={nodo.id} className="estructura-tree-group">
                  <button
                    type="button"
                    className={`estructura-tree-item ${nodoActivo === nodo.id ? "is-active" : ""}`}
                    onClick={() => setNodoActivo(nodo.id)}
                  >
                    {nodo.titulo}
                  </button>
                  <button
                    type="button"
                    className="estructura-tree-toggle"
                    onClick={() => setExpandedPersonal((prev) => !prev)}
                  >
                    {expandedPersonal ? "Ocultar" : "Ver"} hijos
                  </button>
                  {expandedPersonal ? (
                    <div className="estructura-tree-children">
                      {nodosPersonal.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          className={`estructura-tree-item child ${nodoActivo === child.id ? "is-active" : ""}`}
                          onClick={() => setNodoActivo(child.id)}
                        >
                          {child.titulo}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <button
                key={nodo.id}
                type="button"
                className={`estructura-tree-item ${nodoActivo === nodo.id ? "is-active" : ""}`}
                onClick={() => setNodoActivo(nodo.id)}
              >
                {nodo.titulo}
              </button>
            );
          })}

          <p className="estructura-tree-note">Regla DER: Centro {"->"} Servicio {"->"} Practica.</p>
        </aside>

        <article className="estructura-detail">
          <div className="estructura-detail-head">
            <h3>{nodoSeleccionado?.titulo ?? "Sin nodo"}</h3>
            <span>{nodoSeleccionado?.tabla ?? "-"}</span>
          </div>

          <p>{nodoSeleccionado?.descripcion ?? ""}</p>

          {error ? <p className="estructura-error">{error}</p> : null}
          {info ? <p className="estructura-info">{info}</p> : null}

          {nodoSeleccionado?.campos.length === 0 ? (
            <div className="estructura-alert">Seleccione un nodo hijo de Personal para configurar sus campos.</div>
          ) : isUsuariosSistema ? (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              <section className="estructura-identificacion" aria-label="Identificacion de persona para usuario de sistema">
                <h4>Paso 1 obligatorio: Identificacion de persona</h4>
                <p>Utilice tipo y numero de documento para validar que la persona exista. Si no existe, debe ir a Enrolar.</p>
                <div className="estructura-user-grid">
                  <label>
                    Tipo de documento
                    <select value={tipoDocumento} onChange={(event) => setTipoDocumento(event.target.value)}>
                      {tiposDocumento.map((tipo) => (
                        <option key={tipo.codigo} value={tipo.codigo}>{tipo.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Numero de documento
                    <input
                      value={numeroDocumento}
                      onChange={(event) => setNumeroDocumento(event.target.value)}
                      placeholder="Ingrese numero"
                      disabled={Boolean(editingUsuarioId)}
                    />
                  </label>
                </div>
                <div className="estructura-form-actions estructura-user-actions">
                  <button type="button" onClick={() => void onBuscarPersona()} disabled={Boolean(editingUsuarioId) || buscandoPersona || numeroDocumento.trim().length === 0}>
                    {buscandoPersona ? "Consultando..." : "Consultar persona"}
                  </button>
                  {editingUsuarioId ? (
                    <button type="button" className="btn-outline" onClick={onLimpiar}>Cancelar edicion</button>
                  ) : null}
                  <button type="button" className="btn-outline" onClick={() => navigate("/personas")}>Ir a Enrolar</button>
                </div>

                {personaSeleccionada ? (
                  <div className="estructura-info">
                    <strong>Persona:</strong> {personaSeleccionada.apellidosNombres} - {personaSeleccionada.tipoDocumento} {personaSeleccionada.numeroDocumento}
                  </div>
                ) : null}
                {!personaSeleccionada && mensajePersona ? <div className="estructura-alert">{mensajePersona}</div> : null}
              </section>

              <section className="estructura-alta-usuario" aria-label="Alta de usuario del sistema">
                <h4>Paso 2: Alta de usuario del sistema</h4>
                <div className="estructura-user-grid">
                  <label>
                    username *
                    <input
                      value={formValues.username ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, username: event.target.value }))}
                      placeholder="Ingrese username"
                      aria-label="username"
                    />
                  </label>
                  <label>
                    temporary_password *
                    <input
                      type="password"
                      value={formValues.temporary_password ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, temporary_password: event.target.value }))}
                      placeholder={editingUsuarioId ? "Dejar vacio para mantener actual" : "Ingrese contrasena temporal"}
                      aria-label="temporary_password"
                      disabled={Boolean(editingUsuarioId)}
                    />
                  </label>
                  <label>
                    centro_id *
                    <select
                      value={formValues.centro_id ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, centro_id: event.target.value }))}
                      aria-label="centro_id"
                    >
                      <option value="">Seleccione centro</option>
                      <option value="TODOS">TODOS (alcance centralizado)</option>
                      {centrosCatalogo.map((centro) => (
                        <option key={centro.id} value={centro.id}>{centro.campos.nombre ?? centro.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    rol_nombre *
                    <select
                      value={formValues.rol_nombre ?? ""}
                      onChange={(event) => setFormValues((prev) => ({
                        ...prev,
                        rol_nombre: event.target.value,
                        servicio_id: "",
                        matricula_provincial: "",
                        matricula_nacional: "",
                      }))}
                      aria-label="rol_nombre"
                    >
                      <option value="">Seleccione rol</option>
                      {rolesSeguridad.map((rol) => {
                        const nombre = rol.campos.nombre ?? "";
                        return <option key={rol.id} value={nombre}>{nombre}</option>;
                      })}
                    </select>
                  </label>
                  <label>
                    servicio_id {isRolMedico ? "*" : ""}
                    <select
                      value={formValues.servicio_id ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, servicio_id: event.target.value }))}
                      aria-label="servicio_id"
                      disabled={!isRolMedico || !(formValues.centro_id ?? "").trim() || (formValues.centro_id ?? "").trim().toUpperCase() === "TODOS"}
                    >
                      <option value="">Seleccione servicio</option>
                      {serviciosUsuariosFiltrados.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>{servicio.campos.nombre ?? servicio.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    matricula_provincial {isRolMedico ? "*" : ""}
                    <input
                      value={formValues.matricula_provincial ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, matricula_provincial: event.target.value.toUpperCase() }))}
                      placeholder="Ej. MP12345"
                      aria-label="matricula_provincial"
                      disabled={!isRolMedico}
                    />
                  </label>
                  <label>
                    matricula_nacional {isRolMedico ? "*" : ""}
                    <input
                      value={formValues.matricula_nacional ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, matricula_nacional: event.target.value.toUpperCase() }))}
                      placeholder="Ej. MN67890"
                      aria-label="matricula_nacional"
                      disabled={!isRolMedico}
                    />
                  </label>
                  <label>
                    estado
                    <select
                      value={formValues.estado ?? "ACTIVO"}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, estado: event.target.value }))}
                      aria-label="estado"
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </label>
                </div>
              </section>

              <div className="estructura-form-actions">
                <button
                  type="submit"
                  disabled={
                    saving
                    || !personaSeleccionada
                    || !(formValues.centro_id ?? "").trim()
                    || (isRolMedico && !(formValues.servicio_id ?? "").trim())
                    || (isRolMedico
                      && !(formValues.matricula_provincial ?? "").trim()
                      && !(formValues.matricula_nacional ?? "").trim())
                    || (!editingUsuarioId && !(formValues.temporary_password ?? "").trim())
                  }
                >
                  {saving ? "Guardando..." : editingUsuarioId ? "Actualizar usuario" : "Guardar usuario"}
                </button>
                <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
              </div>
            </form>
          ) : isCentro ? (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              <section className="estructura-master-form" aria-label="ABM Centro">
                <div className="estructura-user-grid">
                  <label>
                    nombre *
                    <input
                      value={formValues.nombre ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, nombre: event.target.value }))}
                      placeholder="Ingrese nombre del centro"
                      aria-label="nombre"
                    />
                  </label>
                  <label>
                    direccion *
                    <input
                      value={formValues.direccion ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, direccion: event.target.value }))}
                      placeholder="Ingrese direccion"
                      aria-label="direccion"
                    />
                  </label>
                  <label>
                    telefono *
                    <input
                      value={formValues.telefono ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, telefono: event.target.value }))}
                      placeholder="Ingrese telefono"
                      aria-label="telefono"
                    />
                  </label>
                  <label>
                    mail *
                    <input
                      type="email"
                      value={formValues.mail ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, mail: event.target.value }))}
                      placeholder="Ingrese mail"
                      aria-label="mail"
                    />
                  </label>
                  <label>
                    activo
                    <select
                      value={formValues.activo ?? "true"}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, activo: event.target.value }))}
                      aria-label="activo"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Desactivo</option>
                    </select>
                  </label>
                </div>
              </section>
              <div className="estructura-form-actions">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !(formValues.nombre ?? "").trim() ||
                    !(formValues.direccion ?? "").trim() ||
                    !(formValues.telefono ?? "").trim() ||
                    !(formValues.mail ?? "").trim()
                  }
                >
                  {saving ? "Guardando..." : "Guardar configuracion"}
                </button>
                <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
              </div>
            </form>
          ) : isServicio ? (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              <section className="estructura-master-form" aria-label="ABM Servicio">
                <div className="estructura-user-grid">
                  <label>
                    centro *
                    <select
                      value={formValues.centro_id ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, centro_id: event.target.value }))}
                      aria-label="centro_id"
                    >
                      <option value="">Seleccione centro</option>
                      {centrosCatalogo.map((centro) => (
                        <option key={centro.id} value={centro.id}>{centro.campos.nombre ?? centro.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    nombre *
                    <input
                      value={formValues.nombre ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, nombre: event.target.value }))}
                      placeholder="Ingrese nombre del servicio"
                      aria-label="nombre"
                    />
                  </label>
                  <label>
                    activo
                    <select
                      value={formValues.activo ?? "true"}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, activo: event.target.value }))}
                      aria-label="activo"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Desactivo</option>
                    </select>
                  </label>
                </div>
              </section>
              <div className="estructura-form-actions">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !(formValues.centro_id ?? "").trim() ||
                    !(formValues.nombre ?? "").trim()
                  }
                >
                  {saving ? "Guardando..." : "Guardar configuracion"}
                </button>
                <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
              </div>
            </form>
          ) : isPracticas ? (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              <section className="estructura-master-form" aria-label="ABM Practicas">
                <div className="estructura-user-grid">
                  <label>
                    centro *
                    <select
                      value={formValues.centro_id ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, centro_id: event.target.value, servicio_id: "" }))}
                      aria-label="centro_id"
                    >
                      <option value="">Seleccione centro</option>
                      {centrosCatalogo.map((centro) => (
                        <option key={centro.id} value={centro.id}>{centro.campos.nombre ?? centro.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    servicio *
                    <select
                      value={formValues.servicio_id ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, servicio_id: event.target.value }))}
                      aria-label="servicio_id"
                    >
                      <option value="">Seleccione servicio</option>
                      {serviciosFiltradosPorCentro.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>{servicio.campos.nombre ?? servicio.id}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    nombre *
                    <input
                      value={formValues.nombre ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, nombre: event.target.value }))}
                      placeholder="Ingrese nombre de la practica"
                      aria-label="nombre"
                    />
                  </label>
                  <label>
                    duracion_minutos_sugerida
                    <input
                      value={formValues.duracion_minutos_sugerida ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, duracion_minutos_sugerida: event.target.value }))}
                      placeholder="Ej. 20"
                      aria-label="duracion_minutos_sugerida"
                    />
                  </label>
                  <label>
                    codigo_clinico
                    <input
                      value={formValues.codigo_clinico ?? ""}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, codigo_clinico: event.target.value }))}
                      placeholder="Codigo clinico"
                      aria-label="codigo_clinico"
                    />
                  </label>
                  <label>
                    activa
                    <select
                      value={formValues.activa ?? "true"}
                      onChange={(event) => setFormValues((prev) => ({ ...prev, activa: event.target.value }))}
                      aria-label="activa"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Desactivo</option>
                    </select>
                  </label>
                </div>
              </section>
              <div className="estructura-form-actions">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    !(formValues.centro_id ?? "").trim() ||
                    !(formValues.servicio_id ?? "").trim() ||
                    !(formValues.nombre ?? "").trim()
                  }
                >
                  {saving ? "Guardando..." : "Guardar configuracion"}
                </button>
                <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
              </div>
            </form>
          ) : isFinanciadoresPlanes ? (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              <section className="estructura-master-form" aria-label="ABM Financiadores y Planes">
                <div className="estructura-financiadores-layout">
                  <div className="estructura-financiadores-lista">
                    <div className="estructura-financiadores-lista-head">
                      <h4>Financiadores</h4>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => setFinanciadorSeleccionadoId("")}
                      >
                        Nuevo financiador
                      </button>
                    </div>

                    {financiadoresCatalogo.length === 0 ? (
                      <p className="estructura-alert">No hay financiadores cargados.</p>
                    ) : (
                      <div className="estructura-financiadores-items">
                        {financiadoresCatalogo.map((financiador) => (
                          <button
                            key={financiador.id}
                            type="button"
                            className={`estructura-financiador-item ${financiadorSeleccionadoId === financiador.id ? "is-active" : ""}`}
                            onClick={() => setFinanciadorSeleccionadoId(financiador.id)}
                          >
                            <strong>{financiador.nombre}</strong>
                            <span>{financiador.codigo || "Sin codigo"}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="estructura-planes-panel">
                    <h4>{financiadorSeleccionadoId ? "Planes del financiador seleccionado" : "Alta inicial (Financiador + Primer Plan)"}</h4>
                    <div className="estructura-user-grid">
                      <label>
                        financiador_codigo *
                        <input
                          value={financiadorSeleccionadoId
                            ? (financiadoresCatalogo.find((item) => item.id === financiadorSeleccionadoId)?.codigo ?? "")
                            : (formValues.financiador_codigo ?? "")}
                          onChange={(event) => setFormValues((prev) => ({ ...prev, financiador_codigo: event.target.value }))}
                          placeholder="Codigo del financiador"
                          aria-label="financiador_codigo"
                          disabled={Boolean(financiadorSeleccionadoId)}
                        />
                      </label>
                      <label>
                        financiador_nombre *
                        <input
                          value={financiadorSeleccionadoId
                            ? (financiadoresCatalogo.find((item) => item.id === financiadorSeleccionadoId)?.nombre ?? "")
                            : (formValues.financiador_nombre ?? "")}
                          onChange={(event) => setFormValues((prev) => ({ ...prev, financiador_nombre: event.target.value }))}
                          placeholder="Nombre del financiador"
                          aria-label="financiador_nombre"
                          disabled={Boolean(financiadorSeleccionadoId)}
                        />
                      </label>
                      <label>
                        plan_codigo *
                        <input
                          value={formValues.plan_codigo ?? ""}
                          onChange={(event) => setFormValues((prev) => ({ ...prev, plan_codigo: event.target.value }))}
                          placeholder="Codigo del plan"
                          aria-label="plan_codigo"
                        />
                      </label>
                      <label>
                        plan_nombre *
                        <input
                          value={formValues.plan_nombre ?? ""}
                          onChange={(event) => setFormValues((prev) => ({ ...prev, plan_nombre: event.target.value }))}
                          placeholder="Nombre del plan"
                          aria-label="plan_nombre"
                        />
                      </label>
                      <label>
                        activo
                        <select
                          value={formValues.activo ?? "true"}
                          onChange={(event) => setFormValues((prev) => ({ ...prev, activo: event.target.value }))}
                          aria-label="activo"
                        >
                          <option value="true">Activo</option>
                          <option value="false">Desactivo</option>
                        </select>
                      </label>
                    </div>

                    <div className="estructura-form-actions">
                      <button
                        type="submit"
                        disabled={
                          saving
                          || !(formValues.plan_codigo ?? "").trim()
                          || !(formValues.plan_nombre ?? "").trim()
                          || (!financiadorSeleccionadoId
                            && (!(formValues.financiador_codigo ?? "").trim() || !(formValues.financiador_nombre ?? "").trim()))
                        }
                      >
                        {saving ? "Guardando..." : financiadorSeleccionadoId ? "Agregar plan" : "Guardar financiador y plan"}
                      </button>
                      <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
                    </div>

                    <div className="estructura-registros-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>plan_id</th>
                            <th>plan_codigo</th>
                            <th>plan_nombre</th>
                            <th>activo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {planesFinanciadorSeleccionado.length === 0 ? (
                            <tr>
                              <td colSpan={4}>{financiadorSeleccionadoId ? "Sin planes para este financiador." : "Seleccione un financiador para ver sus planes."}</td>
                            </tr>
                          ) : (
                            planesFinanciadorSeleccionado.map((registro) => (
                              <tr key={registro.id}>
                                <td>{registro.campos.plan_id ?? registro.id}</td>
                                <td>{registro.campos.plan_codigo ?? "-"}</td>
                                <td>{registro.campos.plan_nombre ?? "-"}</td>
                                <td>{registro.campos.activo ?? "-"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          ) : (
            <form className="estructura-form" onSubmit={(event) => void onSubmit(event)}>
              {nodoSeleccionado?.campos.map((campo) => (
                <label key={campo.nombre}>
                  {campo.nombre} ({campo.tipo}) {campo.obligatorio ? "*" : ""}
                  <input
                    value={formValues[campo.nombre] ?? ""}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [campo.nombre]: event.target.value
                      }))
                    }
                    placeholder={campo.referencia ? `FK: ${campo.referencia}` : `Ejemplo para ${campo.nombre}`}
                    aria-label={campo.nombre}
                  />
                </label>
              ))}
              <div className="estructura-form-actions">
                <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar configuracion"}</button>
                <button type="button" className="btn-outline" onClick={onLimpiar}>Limpiar</button>
              </div>
            </form>
          )}

          {nodoSeleccionado && nodoSeleccionado.id !== "personal" ? (
            <section className="estructura-registros" aria-label="Registros cargados">
              <h4>Registros existentes ({registros.length})</h4>
              {registros.length === 0 ? (
                <p>No hay registros cargados para este nodo.</p>
              ) : isUsuariosSistema ? (
                <div className="estructura-registros-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>persona</th>
                        <th>username</th>
                        <th>centro</th>
                        <th>servicio</th>
                        <th>matricula</th>
                        <th>rol</th>
                        <th>estado</th>
                        <th>ultimo_login</th>
                        <th>acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registros.slice(0, 10).map((registro) => (
                        <tr key={registro.id}>
                          <td>{registro.id}</td>
                          <td>{registro.campos.persona_nombre ?? registro.campos.persona_id ?? "-"}</td>
                          <td>{registro.campos.username ?? "-"}</td>
                          <td>{registro.campos.centro_nombre ?? registro.campos.centro_id ?? "-"}</td>
                          <td>{registro.campos.servicio_nombre ?? registro.campos.servicio_id ?? "-"}</td>
                          <td>{[registro.campos.matricula_provincial, registro.campos.matricula_nacional].filter(Boolean).join(" / ") || "-"}</td>
                          <td>{registro.campos.rol_nombre ?? "-"}</td>
                          <td>{registro.campos.estado ?? "-"}</td>
                          <td>{registro.campos.ultimo_login || "-"}</td>
                          <td>
                            <button
                              type="button"
                              className="icon-edit-btn estructura-edit-icon-btn"
                              onClick={() => onEditarUsuario(registro)}
                              title="Editar usuario"
                              aria-label="Editar usuario"
                            >
                              ✏
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="estructura-registros-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        {nodoSeleccionado.campos
                          .filter((campo) => campo.nombre !== "id")
                          .slice(0, 4)
                          .map((campo) => (
                            <th key={campo.nombre}>{campo.nombre}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registros.slice(0, 10).map((registro) => (
                        <tr key={registro.id}>
                          <td>{registro.id}</td>
                          {nodoSeleccionado.campos
                            .filter((campo) => campo.nombre !== "id")
                            .slice(0, 4)
                            .map((campo) => (
                              <td key={`${registro.id}-${campo.nombre}`}>{registro.campos[campo.nombre] ?? "-"}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}
        </article>
      </div>
    </section>
  );
}
