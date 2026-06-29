import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  actualizarPersonaSetMinimo,
  buscarPersonasPorDocumento,
  buscarPersonasPorApellidoNombre,
  buscarPersonasPorSetMinimo,
  empadronarPersonaConSetMinimo,
  PersonaCandidata
} from "./personasApi";
import { getTiposDocumento, TipoDocumento } from "../shared/catalogosApi";

type PersonasPageProps = {};

type ScanFlowState = "idle" | "error" | "success";

type DniScanData = {
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexoBiologico: string;
};

export type ContactoTipo = "" | "TELEFONO" | "CORREO_ELECTRONICO";
export type ContactoUso = "" | "PERSONAL" | "LABORAL" | "OTRO";

type ContactoDato = {
  id: string;
  tipo: ContactoTipo;
  valor: string;
  uso: ContactoUso;
};

type PersonaContactoVinculada = {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  apellidosNombres: string;
  sexoEdad: string;
  telefonos: string[];
  email: string;
  estado: "TEMPORAL";
};

type ProvinciaDireccion = {
  nombre: string;
  localidades: string[];
};

type SetMinimoSnapshot = {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexoBiologico: string;
};

const CONTACTOS_INICIALES: ContactoDato[] = [
  { id: "contacto-1", tipo: "TELEFONO", valor: "", uso: "" },
  { id: "contacto-2", tipo: "CORREO_ELECTRONICO", valor: "", uso: "" }
];

const CONTACTOS_PERSONA_CONTACTO_INICIALES: ContactoDato[] = [
  { id: "persona-contacto-1", tipo: "TELEFONO", valor: "", uso: "PERSONAL" },
  { id: "persona-contacto-2", tipo: "CORREO_ELECTRONICO", valor: "", uso: "PERSONAL" }
];

const DIRECCION_PAISES = ["Argentina", "Uruguay", "Chile", "Paraguay"];

const DIRECCION_PROVINCIAS: ProvinciaDireccion[] = [
  { nombre: "Buenos Aires", localidades: ["La Plata", "Mar del Plata", "Bahia Blanca", "Quilmes", "San Isidro"] },
  {
    nombre: "Ciudad Autonoma de Buenos Aires",
    localidades: ["Comuna 1", "Comuna 2", "Comuna 3", "Comuna 4", "Comuna 5"]
  },
  { nombre: "Cordoba", localidades: ["Cordoba Capital", "Villa Carlos Paz", "Rio Cuarto", "Villa Maria"] },
  { nombre: "Mendoza", localidades: ["Ciudad de Mendoza", "Godoy Cruz", "Guaymallen", "San Rafael"] }
];

const DIRECCION_PAIS_DEFAULT = "Argentina";
const DIRECCION_PROVINCIA_DEFAULT = "Ciudad Autonoma de Buenos Aires";


export function usePersonas() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [apellidoBusqueda, setApellidoBusqueda] = useState("");
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [modoBusqueda, setModoBusqueda] = useState<"documento" | "nombre">("documento");
  const [candidatos, setCandidatos] = useState<PersonaCandidata[]>([]);
  const [consultado, setConsultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarSetMinimo, setMostrarSetMinimo] = useState(false);
  const [nombre, setNombre] = useState("");
  const [otroNombre, setOtroNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [otroApellido, setOtroApellido] = useState("");
  const [nombreSocial, setNombreSocial] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexoBiologico, setSexoBiologico] = useState("");
  const [generoAutopercibido, setGeneroAutopercibido] = useState("");
  const [presentaDocumentacion, setPresentaDocumentacion] = useState(false);
  const [cargaPorEscaneoDni, setCargaPorEscaneoDni] = useState(false);
  const [setMinimoSnapshot, setSetMinimoSnapshot] = useState<SetMinimoSnapshot | null>(null);
  const [rebusquedaModalOpen, setRebusquedaModalOpen] = useState(false);
  const [rebusquedaCandidatos, setRebusquedaCandidatos] = useState<PersonaCandidata[]>([]);
  const [sinResultadosModalOpen, setSinResultadosModalOpen] = useState(false);
  const [modoEdicionEmpadronamiento, setModoEdicionEmpadronamiento] = useState(false);
  const [personaCreadaModalOpen, setPersonaCreadaModalOpen] = useState(false);
  const [personaCreadaMensaje, setPersonaCreadaMensaje] = useState("Persona creada con exito en el sistema.");
  const [contactos, setContactos] = useState<ContactoDato[]>(CONTACTOS_INICIALES);
  const [advertenciaContactoModalOpen, setAdvertenciaContactoModalOpen] = useState(false);
  const [direccionPais, setDireccionPais] = useState(DIRECCION_PAIS_DEFAULT);
  const [direccionProvincia, setDireccionProvincia] = useState(DIRECCION_PROVINCIA_DEFAULT);
  const [direccionCalle, setDireccionCalle] = useState("");
  const [direccionNumero, setDireccionNumero] = useState("");
  const [direccionLocalidad, setDireccionLocalidad] = useState("");
  const [direccionBarrio, setDireccionBarrio] = useState("");
  const [direccionCodigoPostal, setDireccionCodigoPostal] = useState("");
  const [direccionPiso, setDireccionPiso] = useState("");
  const [direccionDepartamento, setDireccionDepartamento] = useState("");
  const [direccionComentario, setDireccionComentario] = useState("");
  const [personaContactos, setPersonaContactos] = useState<PersonaContactoVinculada[]>([]);
  const [empadronarContactoModalOpen, setEmpadronarContactoModalOpen] = useState(false);
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoApellido, setContactoApellido] = useState("");
  const [contactoTipoDocumento, setContactoTipoDocumento] = useState("DNI");
  const [contactoNumeroDocumento, setContactoNumeroDocumento] = useState("");
  const [contactoFechaNacimiento, setContactoFechaNacimiento] = useState("");
  const [contactoSexoBiologico, setContactoSexoBiologico] = useState("");
  const [contactoDatosContacto, setContactoDatosContacto] = useState<ContactoDato[]>(CONTACTOS_PERSONA_CONTACTO_INICIALES);
  const [contactoScanRawData, setContactoScanRawData] = useState("");
  const [contactoScanMessage, setContactoScanMessage] = useState<string | null>(null);
  const [personaContactosSeleccionados, setPersonaContactosSeleccionados] = useState<string[]>([]);
  const [eliminarPersonaContactoModalOpen, setEliminarPersonaContactoModalOpen] = useState(false);
  const [selectedCandidatoId, setSelectedCandidatoId] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanRawData, setScanRawData] = useState("");
  const [scanState, setScanState] = useState<ScanFlowState>("idle");
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const scanTimerRef = useRef<number | null>(null);
  const lastRebusquedaSignatureRef = useRef<string>("");
  const numeroInputRef = useRef<HTMLInputElement | null>(null);
  const nextContactoIdRef = useRef(3);
  const nextDatoContactoPersonaIdRef = useRef(1);
  const nextPersonaContactoIdRef = useRef(1);

  useEffect(() => {
    const run = async () => {
      try {
        const tipos = await getTiposDocumento();
        setTiposDocumento(tipos);
        if (tipos.some((t) => t.codigo === "DNI")) {
          setTipoDocumento("DNI");
        } else if (tipos.length > 0) {
          setTipoDocumento(tipos[0].codigo);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "No se pudieron cargar tipos de documento.";
        setError(message);
      }
    };

    run();
  }, []);

  useEffect(() => {
    numeroInputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) {
        window.clearTimeout(scanTimerRef.current);
      }
    };
  }, []);

  const direccionLocalidadesFiltradas = useMemo(() => {
    const provincia = DIRECCION_PROVINCIAS.find((item) => item.nombre === direccionProvincia);
    return provincia?.localidades ?? [];
  }, [direccionProvincia]);
  const direccionPaises = [DIRECCION_PAIS_DEFAULT];
  const direccionProvincias = DIRECCION_PROVINCIAS;

  useEffect(() => {
    if (direccionLocalidad && !direccionLocalidadesFiltradas.includes(direccionLocalidad)) {
      setDireccionLocalidad("");
    }
  }, [direccionLocalidad, direccionLocalidadesFiltradas]);

  const mensajeSinResultados = useMemo(() => {
    if (!consultado || candidatos.length > 0) {
      return null;
    }

    if (mostrarSetMinimo) {
      return "No se encontraron candidatos por set minimo. Puede continuar con el enrolamiento directo completando los datos y presionando '+ Empadronar persona'.";
    }

    return `No se encontro persona para el DNI ${numeroDocumento}. Para continuar, use 'Iniciar enrolamiento directo' y complete el set minimo.`;
  }, [consultado, candidatos.length, numeroDocumento, mostrarSetMinimo]);

  const puedeConsultarSetMinimo =
    tipoDocumento.trim().length > 0 &&
    numeroDocumento.trim().length > 0 &&
    nombre.trim().length > 0 &&
    apellido.trim().length > 0 &&
    fechaNacimiento.trim().length > 0 &&
    sexoBiologico.trim().length > 0;

  const setMinimoCompleto = useMemo(
    () =>
      tipoDocumento.trim().length > 0 &&
      numeroDocumento.trim().length > 0 &&
      nombre.trim().length > 0 &&
      apellido.trim().length > 0 &&
      fechaNacimiento.trim().length > 0 &&
      sexoBiologico.trim().length > 0,
    [tipoDocumento, numeroDocumento, nombre, apellido, fechaNacimiento, sexoBiologico]
  );

  const tieneTelefonoContacto = useMemo(
    () => contactos.some((contacto) => contacto.tipo === "TELEFONO" && contacto.valor.trim().length > 0),
    [contactos]
  );

  const tieneEmailContacto = useMemo(
    () => contactos.some((contacto) => contacto.tipo === "CORREO_ELECTRONICO" && contacto.valor.trim().length > 0),
    [contactos]
  );

  const datosContactoCompleto = tieneTelefonoContacto && tieneEmailContacto;
  const direccionCompleta =
    direccionPais.trim().length > 0 &&
    direccionProvincia.trim().length > 0 &&
    direccionLocalidad.trim().length > 0 &&
    direccionCalle.trim().length > 0 &&
    direccionNumero.trim().length > 0;
  const personaContactoCompleta = personaContactos.length > 0;

  const porcentajeCargaEmpadronamiento =
    (setMinimoCompleto ? 50 : 0) +
    (datosContactoCompleto ? 30 : 0) +
    (direccionCompleta ? 10 : 0) +
    (personaContactoCompleta ? 10 : 0);

  const puedeConsultar = mostrarSetMinimo
    ? puedeConsultarSetMinimo
    : modoBusqueda === "nombre"
      ? apellidoBusqueda.trim().length > 0 && nombreBusqueda.trim().length > 0
      : numeroDocumento.trim().length > 0 && tipoDocumento.trim().length > 0;

  const maxPorcentajeCoincidencia = useMemo(() => {
    if (candidatos.length === 0) {
      return 0;
    }

    return Math.max(...candidatos.map((c) => c.porcentajeCoincidencia));
  }, [candidatos]);

  const habilitarEmpadronar =
    mostrarSetMinimo &&
    puedeConsultarSetMinimo &&
    (!consultado || candidatos.length === 0 || maxPorcentajeCoincidencia < 95);

  const selectedCandidato = useMemo(
    () => candidatos.find((candidato) => candidato.id === selectedCandidatoId) ?? null,
    [candidatos, selectedCandidatoId]
  );

  const bloqueaDatosAmpliados = Boolean(selectedCandidato && !modoEdicionEmpadronamiento);
  const bloqueaSetMinimo = bloqueaDatosAmpliados;

  const parseApellidosNombres = (value: string) => {
    const split = value.split(",", 2);
    return {
      apellido: (split[0] ?? "").trim(),
      nombre: (split[1] ?? "").trim()
    };
  };

  const requestSetMinimo = () => ({
    tipoDocumento,
    numeroDocumento: numeroDocumento.trim(),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    fechaNacimiento,
    sexoBiologico,
    email:
      contactos.find((contacto) => contacto.tipo === "CORREO_ELECTRONICO" && contacto.valor.trim().length > 0)?.valor.trim() ||
      undefined,
    telefono:
      contactos.find((contacto) => contacto.tipo === "TELEFONO" && contacto.valor.trim().length > 0)?.valor.trim() ||
      undefined
  });

  const buildSetMinimoSnapshot = (): SetMinimoSnapshot => ({
    tipoDocumento: tipoDocumento.trim().toUpperCase(),
    numeroDocumento: numeroDocumento.trim().toUpperCase(),
    nombre: nombre.trim().toUpperCase(),
    apellido: apellido.trim().toUpperCase(),
    fechaNacimiento: fechaNacimiento.trim(),
    sexoBiologico: sexoBiologico.trim().toUpperCase()
  });

  const applySetMinimoPrecargado = (data: DniScanData, fromScan: boolean) => {
    setTipoDocumento("DNI");
    setNumeroDocumento(data.numeroDocumento);
    setNombre(data.nombre);
    setApellido(data.apellido);
    setFechaNacimiento(data.fechaNacimiento);
    setSexoBiologico(data.sexoBiologico);
    setOtroNombre("");
    setOtroApellido("");
    setNombreSocial("");
    setGeneroAutopercibido("");
    setPresentaDocumentacion(fromScan ? true : presentaDocumentacion);
    setCargaPorEscaneoDni(fromScan);
    setSetMinimoSnapshot({
      tipoDocumento: "DNI",
      numeroDocumento: data.numeroDocumento.trim().toUpperCase(),
      nombre: data.nombre.trim().toUpperCase(),
      apellido: data.apellido.trim().toUpperCase(),
      fechaNacimiento: data.fechaNacimiento,
      sexoBiologico: data.sexoBiologico.trim().toUpperCase()
    });
  };

  const prepararSetMinimoParaNuevoEmpadronamiento = () => {
    setSelectedCandidatoId(null);
    setModoEdicionEmpadronamiento(false);
    setNombre("");
    setApellido("");
    setFechaNacimiento("");
    setSexoBiologico("");
    setSetMinimoSnapshot(null);
    setCargaPorEscaneoDni(false);
  };

  const estadoEmpadronamiento = useMemo(() => {
    if (cargaPorEscaneoDni) {
      return "VALIDADO";
    }

    return presentaDocumentacion ? "PERMANENTE" : "TEMPORAL";
  }, [cargaPorEscaneoDni, presentaDocumentacion]);

  const maybeRunRebusquedaCandidatos = async () => {
    if (!setMinimoSnapshot || !puedeConsultarSetMinimo || loading) {
      return;
    }

    const current = buildSetMinimoSnapshot();
    const changed =
      current.tipoDocumento !== setMinimoSnapshot.tipoDocumento ||
      current.numeroDocumento !== setMinimoSnapshot.numeroDocumento ||
      current.nombre !== setMinimoSnapshot.nombre ||
      current.apellido !== setMinimoSnapshot.apellido ||
      current.fechaNacimiento !== setMinimoSnapshot.fechaNacimiento ||
      current.sexoBiologico !== setMinimoSnapshot.sexoBiologico;

    if (!changed) {
      return;
    }

    const signature = JSON.stringify(current);
    if (lastRebusquedaSignatureRef.current === signature) {
      return;
    }

    lastRebusquedaSignatureRef.current = signature;

    try {
      setLoading(true);
      const result = await buscarPersonasPorSetMinimo(requestSetMinimo());

      if (result.length > 0) {
        setRebusquedaCandidatos(result);
        setRebusquedaModalOpen(true);
      } else {
        setSinResultadosModalOpen(true);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo ejecutar nueva busqueda de candidatos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const normalizarFechaParaInput = (value: string): string => {
    const raw = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    if (/^\d{8}$/.test(raw)) {
      return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    }

    const slash = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (slash) {
      return `${slash[3]}-${slash[2]}-${slash[1]}`;
    }

    return raw;
  };

  const normalizarSexoEscaneo = (value: string): string => {
    const raw = value.trim().toUpperCase();
    if (raw.startsWith("M")) {
      return "M";
    }

    if (raw.startsWith("F")) {
      return "F";
    }

    if (raw.startsWith("X")) {
      return "X";
    }

    return "";
  };

  const parseQrData = (rawInput: string): DniScanData | null => {
    const raw = rawInput.trim();
    if (!raw) {
      return null;
    }

    if (raw.startsWith("{")) {
      try {
        const payload = JSON.parse(raw) as Record<string, string>;
        const numeroDoc = (payload.numeroDocumento ?? payload.dni ?? payload.documento ?? "").trim();
        const nombreRaw = (payload.nombre ?? payload.nombres ?? "").trim();
        const apellidoRaw = (payload.apellido ?? payload.apellidos ?? "").trim();
        const fecha = normalizarFechaParaInput(payload.fechaNacimiento ?? payload.fecha_nacimiento ?? "");
        const sexo = normalizarSexoEscaneo(payload.sexoBiologico ?? payload.sexo ?? "");

        if (!numeroDoc || !nombreRaw || !apellidoRaw || !fecha || !sexo) {
          return null;
        }

        return {
          numeroDocumento: numeroDoc.toUpperCase(),
          nombre: nombreRaw,
          apellido: apellidoRaw,
          fechaNacimiento: fecha,
          sexoBiologico: sexo
        };
      } catch {
        return null;
      }
    }

    const atValues = raw.split("@");
    if (atValues.length >= 7) {
      const apellidoRaw = (atValues[1] ?? "").trim();
      const nombreRaw = (atValues[2] ?? "").trim();
      const sexoRaw = (atValues[3] ?? "").trim();
      const numeroDoc = (atValues[4] ?? "").trim();
      const fechaRaw = (atValues[6] ?? "").trim();
      const fecha = normalizarFechaParaInput(fechaRaw);
      const sexo = normalizarSexoEscaneo(sexoRaw);

      if (!numeroDoc || !nombreRaw || !apellidoRaw || !fecha || !sexo) {
        return null;
      }

      return {
        numeroDocumento: numeroDoc.toUpperCase(),
        nombre: nombreRaw,
        apellido: apellidoRaw,
        fechaNacimiento: fecha,
        sexoBiologico: sexo
      };
    }

    return null;
  };

  const consultarCandidatosPorSet = async (data: DniScanData) => {
    const response = await buscarPersonasPorSetMinimo({
      tipoDocumento: "DNI",
      numeroDocumento: data.numeroDocumento,
      nombre: data.nombre,
      apellido: data.apellido,
      fechaNacimiento: data.fechaNacimiento,
      sexoBiologico: data.sexoBiologico
    });

    setCandidatos(response);
    setSelectedCandidatoId(response[0]?.id ?? null);
    setConsultado(true);
    setMostrarSetMinimo(true);
  };

  const onConsultar = async (event: FormEvent) => {
    event.preventDefault();
    if (!puedeConsultar) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfo(null);

      let response: PersonaCandidata[];

      if (modoBusqueda === "nombre") {
        response = await buscarPersonasPorApellidoNombre(apellidoBusqueda.trim(), nombreBusqueda.trim());
      } else {
        const tipoDocumentoNormalizado = tipoDocumento.trim().toUpperCase();
        const numeroDocumentoNormalizado = numeroDocumento.trim().toUpperCase();
        const snapshotActual = setMinimoSnapshot;
        let cambioDocumentoDesdeUltimoSet = false;
        if (mostrarSetMinimo && snapshotActual) {
          cambioDocumentoDesdeUltimoSet =
            snapshotActual.tipoDocumento !== tipoDocumentoNormalizado ||
            snapshotActual.numeroDocumento !== numeroDocumentoNormalizado;
        }
        const usarConsultaPorDocumento = !mostrarSetMinimo || cambioDocumentoDesdeUltimoSet;

        response = usarConsultaPorDocumento
          ? await buscarPersonasPorDocumento(tipoDocumento, numeroDocumento.trim())
          : await buscarPersonasPorSetMinimo(requestSetMinimo());

        if (usarConsultaPorDocumento && response.length === 0) {
          prepararSetMinimoParaNuevoEmpadronamiento();
          setMostrarSetMinimo(true);
        }

        if (response.length > 0 && usarConsultaPorDocumento) {
          const selected = response[0];
          const parsed = parseApellidosNombres(selected.apellidosNombres);
          applySetMinimoPrecargado(
            {
            numeroDocumento: selected.numeroDocumento,
            nombre: parsed.nombre,
            apellido: parsed.apellido,
            fechaNacimiento: selected.fechaNacimiento,
            sexoBiologico: selected.sexoBiologico
          },
          false
        );
        setMostrarSetMinimo(true);
      }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo consultar personas.";
      setError(message);
      setCandidatos([]);
      setConsultado(true);
    } finally {
      setLoading(false);
    }
  };

  const onLimpiar = () => {
    setNumeroDocumento("");
    setApellidoBusqueda("");
    setNombreBusqueda("");
    setNombre("");
    setOtroNombre("");
    setApellido("");
    setOtroApellido("");
    setNombreSocial("");
    setFechaNacimiento("");
    setSexoBiologico("");
    setGeneroAutopercibido("");
    setPresentaDocumentacion(false);
    setCargaPorEscaneoDni(false);
    setSetMinimoSnapshot(null);
    setRebusquedaModalOpen(false);
    setRebusquedaCandidatos([]);
    setSinResultadosModalOpen(false);
    setModoEdicionEmpadronamiento(false);
    lastRebusquedaSignatureRef.current = "";
    setContactos(CONTACTOS_INICIALES);
    nextContactoIdRef.current = 3;
    setAdvertenciaContactoModalOpen(false);
    setDireccionPais(DIRECCION_PAIS_DEFAULT);
    setDireccionProvincia(DIRECCION_PROVINCIA_DEFAULT);
    setDireccionCalle("");
    setDireccionNumero("");
    setDireccionLocalidad("");
    setDireccionBarrio("");
    setDireccionCodigoPostal("");
    setDireccionPiso("");
    setDireccionDepartamento("");
    setDireccionComentario("");
    setPersonaContactos([]);
    setEmpadronarContactoModalOpen(false);
    setContactoNombre("");
    setContactoApellido("");
    setContactoTipoDocumento("DNI");
    setContactoNumeroDocumento("");
    setContactoFechaNacimiento("");
    setContactoSexoBiologico("");
    setContactoDatosContacto(CONTACTOS_PERSONA_CONTACTO_INICIALES);
    setContactoScanRawData("");
    setContactoScanMessage(null);
    nextPersonaContactoIdRef.current = 1;
    nextDatoContactoPersonaIdRef.current = 1;
    setCandidatos([]);
    setSelectedCandidatoId(null);
    setConsultado(false);
    setError(null);
    setInfo(null);
    setMostrarSetMinimo(false);
    numeroInputRef.current?.focus();
  };

  const onSeleccionarCandidato = (candidato: PersonaCandidata) => {
    setSelectedCandidatoId(candidato.id);
    setModoEdicionEmpadronamiento(false);
    setInfo(`Candidato seleccionado: ${candidato.apellidosNombres}`);
  };

  const onIniciarEdicionSeleccionado = () => {
    if (!selectedCandidato) {
      return;
    }

    const parsed = parseApellidosNombres(selectedCandidato.apellidosNombres);
    setTipoDocumento(selectedCandidato.tipoDocumento);
    setNumeroDocumento(selectedCandidato.numeroDocumento);
    setApellido(parsed.apellido);
    setNombre(parsed.nombre);
    setFechaNacimiento(selectedCandidato.fechaNacimiento);
    setSexoBiologico(selectedCandidato.sexoBiologico);
    setSetMinimoSnapshot({
      tipoDocumento: selectedCandidato.tipoDocumento,
      numeroDocumento: selectedCandidato.numeroDocumento.trim().toUpperCase(),
      nombre: parsed.nombre.trim().toUpperCase(),
      apellido: parsed.apellido.trim().toUpperCase(),
      fechaNacimiento: selectedCandidato.fechaNacimiento,
      sexoBiologico: selectedCandidato.sexoBiologico.trim().toUpperCase()
    });
    setCargaPorEscaneoDni(false);
    setMostrarSetMinimo(true);
    setModoEdicionEmpadronamiento(true);
    setInfo(`Editar empadronamiento habilitado para ${selectedCandidato.apellidosNombres}.`);
  };

  const onCancelarEdicionEmpadronamiento = () => {
    setModoEdicionEmpadronamiento(false);
    setInfo("Edicion de empadronamiento cancelada.");
  };

  const onGuardarEdicionSetMinimo = async () => {
    if (!selectedCandidatoId || !modoEdicionEmpadronamiento) {
      return false;
    }

    if (!puedeConsultarSetMinimo) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const updated = await actualizarPersonaSetMinimo(selectedCandidatoId, requestSetMinimo());
      setCandidatos((prev) => prev.map((item) => (item.id === selectedCandidatoId ? updated : item)));
      setSetMinimoSnapshot(buildSetMinimoSnapshot());
      setInfo(`Set minimo actualizado para ${updated.apellidosNombres}.`);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo actualizar set minimo.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onEmpadronar = async () => {
    if (!puedeConsultarSetMinimo) {
      setError("Complete todos los campos del set de datos minimos para empadronar.");
      return false;
    }

    if (!datosContactoCompleto) {
      setAdvertenciaContactoModalOpen(true);
      return false;
    }

    return ejecutarEmpadronamiento();
  };

  const ejecutarEmpadronamiento = async () => {
    try {
      setLoading(true);
      setError(null);
      const creada = await empadronarPersonaConSetMinimo(requestSetMinimo());
      setCandidatos((prev) => [creada, ...prev.filter((item) => item.id !== creada.id)]);
      setSelectedCandidatoId(creada.id);
      setConsultado(true);
      setSetMinimoSnapshot(buildSetMinimoSnapshot());
      setInfo(`Persona empadronada: ${creada.apellidosNombres}.`);
      setPersonaCreadaMensaje(`Persona creada con exito en el sistema: ${creada.apellidosNombres}.`);
      setPersonaCreadaModalOpen(true);
      setAdvertenciaContactoModalOpen(false);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo empadronar persona.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onAgregarContacto = () => {
    const nextId = `contacto-${nextContactoIdRef.current}`;
    nextContactoIdRef.current += 1;
    setContactos((prev) => [...prev, { id: nextId, tipo: "", valor: "", uso: "" }]);
  };

  const onEliminarContacto = (contactoId: string) => {
    setContactos((prev) => prev.filter((item) => item.id !== contactoId));
  };

  const onActualizarContacto = (contactoId: string, patch: Partial<ContactoDato>) => {
    setContactos((prev) =>
      prev.map((item) => {
        if (item.id !== contactoId) {
          return item;
        }

        const next = { ...item, ...patch };
        if (patch.tipo && patch.tipo !== item.tipo) {
          next.valor = "";
        }

        return next;
      })
    );
  };

  const normalizarValorContacto = (tipo: ContactoTipo, rawValue: string) => {
    if (tipo === "TELEFONO") {
      return rawValue.replace(/[^0-9]/g, "");
    }

    return rawValue;
  };

  const calcularEdad = (fecha: string) => {
    const nacimiento = new Date(fecha);
    if (Number.isNaN(nacimiento.getTime())) {
      return 0;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad -= 1;
    }

    return Math.max(edad, 0);
  };

  const resetEmpadronarContactoForm = () => {
    setContactoNombre("");
    setContactoApellido("");
    setContactoTipoDocumento("DNI");
    setContactoNumeroDocumento("");
    setContactoFechaNacimiento("");
    setContactoSexoBiologico("");
    setContactoDatosContacto(CONTACTOS_PERSONA_CONTACTO_INICIALES);
    setContactoScanRawData("");
    setContactoScanMessage(null);
    nextDatoContactoPersonaIdRef.current = 1;
  };

  const onAbrirEmpadronarContacto = () => {
    resetEmpadronarContactoForm();
    setEmpadronarContactoModalOpen(true);
  };

  const onCerrarEmpadronarContacto = () => {
    setEmpadronarContactoModalOpen(false);
    setContactoScanMessage(null);
  };

  const onAgregarDatoContactoPersona = () => {
    const next = `persona-contacto-extra-${nextDatoContactoPersonaIdRef.current}`;
    nextDatoContactoPersonaIdRef.current += 1;
    setContactoDatosContacto((prev) => [...prev, { id: next, tipo: "", valor: "", uso: "PERSONAL" }]);
  };

  const onEliminarDatoContactoPersona = (id: string) => {
    setContactoDatosContacto((prev) => prev.filter((item) => item.id !== id));
  };

  const onActualizarDatoContactoPersona = (id: string, patch: Partial<ContactoDato>) => {
    setContactoDatosContacto((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const next = { ...item, ...patch };
        if (patch.tipo && patch.tipo !== item.tipo) {
          next.valor = "";
        }

        return next;
      })
    );
  };

  const onEscanearDniPersonaContacto = () => {
    const scanned = parseQrData(contactoScanRawData);
    if (!scanned) {
      setContactoScanMessage("No se pudo leer el DNI. Verifique el codigo y reintente.");
      return;
    }

    setContactoNombre(scanned.nombre);
    setContactoApellido(scanned.apellido);
    setContactoTipoDocumento("DNI");
    setContactoNumeroDocumento(scanned.numeroDocumento);
    setContactoFechaNacimiento(scanned.fechaNacimiento);
    setContactoSexoBiologico(scanned.sexoBiologico);
    setContactoScanMessage("Datos del DNI aplicados al set minimo de la persona de contacto.");
  };

  const puedeGuardarPersonaContacto =
    contactoNombre.trim().length > 0 &&
    contactoApellido.trim().length > 0 &&
    contactoTipoDocumento.trim().length > 0 &&
    contactoNumeroDocumento.trim().length > 0 &&
    contactoFechaNacimiento.trim().length > 0 &&
    contactoSexoBiologico.trim().length > 0;

  const onGuardarPersonaContacto = () => {
    if (!puedeGuardarPersonaContacto) {
      return;
    }

    const telefonos = contactoDatosContacto
      .filter((item) => item.tipo === "TELEFONO" && item.valor.trim().length > 0)
      .map((item) => item.valor.trim());
    const email =
      contactoDatosContacto.find((item) => item.tipo === "CORREO_ELECTRONICO" && item.valor.trim().length > 0)?.valor.trim() ?? "";

    const edad = calcularEdad(contactoFechaNacimiento);
    const sexoLabel = contactoSexoBiologico.trim().toUpperCase().startsWith("F") ? "F" : "M";
    const apellidosNombres = `${contactoApellido.trim()}, ${contactoNombre.trim()}`;
    const nuevaPersonaContacto: PersonaContactoVinculada = {
      id: `persona-contacto-vinculada-${nextPersonaContactoIdRef.current++}`,
      tipoDocumento: contactoTipoDocumento,
      numeroDocumento: contactoNumeroDocumento.trim(),
      apellidosNombres,
      sexoEdad: `${sexoLabel}(${edad})`,
      telefonos,
      email,
      estado: "TEMPORAL"
    };

    setPersonaContactos((prev) => [...prev, nuevaPersonaContacto]);
    setInfo(`Se agrego a ${apellidosNombres} como persona de contacto.`);
    onCerrarEmpadronarContacto();
  };

  const onTogglePersonaContactoSeleccion = (contactoId: string) => {
    setPersonaContactosSeleccionados((prev) =>
      prev.includes(contactoId) ? prev.filter((id) => id !== contactoId) : [...prev, contactoId]
    );
  };

  const onAbrirEliminarPersonaContacto = () => {
    if (personaContactosSeleccionados.length === 0) {
      return;
    }

    setEliminarPersonaContactoModalOpen(true);
  };

  const onCerrarEliminarPersonaContacto = () => {
    setEliminarPersonaContactoModalOpen(false);
  };

  const onConfirmarEliminarPersonaContacto = () => {
    if (personaContactosSeleccionados.length === 0) {
      setEliminarPersonaContactoModalOpen(false);
      return;
    }

    const idsSeleccionados = new Set(personaContactosSeleccionados);
    const eliminados = personaContactos.filter((item) => idsSeleccionados.has(item.id));

    setPersonaContactos((prev) => prev.filter((item) => !idsSeleccionados.has(item.id)));
    setPersonaContactosSeleccionados([]);
    setEliminarPersonaContactoModalOpen(false);

    if (eliminados.length === 1) {
      setInfo(`Se elimino a ${eliminados[0].apellidosNombres} como persona de contacto.`);
      return;
    }

    setInfo(`Se eliminaron ${eliminados.length} personas de contacto.`);
  };

  const personaEmpadronadaNombre =
    `${apellido.trim()}, ${nombre.trim()}`.replace(/^,\s*/, "").trim() || "la persona";

  const personaContactosSeleccionadosDetalle = personaContactos.filter((item) =>
    personaContactosSeleccionados.includes(item.id)
  );

  const textoConfirmacionEliminarPersonaContacto =
    personaContactosSeleccionadosDetalle.length === 1
      ? `Desea realmente eliminar a ${personaContactosSeleccionadosDetalle[0].apellidosNombres} como persona de contacto de ${personaEmpadronadaNombre}?`
      : `Desea realmente eliminar a ${personaContactosSeleccionadosDetalle.length} personas de contacto de ${personaEmpadronadaNombre}?`;

  const onAbrirEscaneoDni = () => {
    setScanModalOpen(true);
    setScanRawData("");
    setScanState("idle");
    setScanMessage(null);
  };

  const onCerrarEscaneoDni = () => {
    setScanModalOpen(false);
    setScanState("idle");
    setScanMessage(null);

    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  };

  const onEjecutarEscaneoDni = async () => {
    const scanned = parseQrData(scanRawData);

    if (!scanned) {
      setScanState("error");
      setScanMessage("No se puede escanear. Intente nuevamente.");
      return;
    }

    setScanState("success");
    setScanMessage("Escaneo completado. Volviendo a la pantalla de busqueda...");

    if (scanTimerRef.current) {
      window.clearTimeout(scanTimerRef.current);
    }

    scanTimerRef.current = window.setTimeout(() => {
      applySetMinimoPrecargado(scanned, true);
      setMostrarSetMinimo(true);
      setInfo("Datos leidos desde escaneo de DNI impactados.");
      onCerrarEscaneoDni();
      void consultarCandidatosPorSet(scanned);
    }, 2000);
  };

  const onCerrarPersonaCreadaModal = () => {
    setPersonaCreadaModalOpen(false);
  };


  return {
    tiposDocumento,
    setTiposDocumento,
    tipoDocumento,
    setTipoDocumento,
    numeroDocumento,
    setNumeroDocumento,
    apellidoBusqueda,
    setApellidoBusqueda,
    nombreBusqueda,
    setNombreBusqueda,
    modoBusqueda,
    setModoBusqueda,
    candidatos,
    setCandidatos,
    consultado,
    setConsultado,
    loading,
    setLoading,
    error,
    setError,
    mostrarSetMinimo,
    setMostrarSetMinimo,
    nombre,
    setNombre,
    otroNombre,
    setOtroNombre,
    apellido,
    setApellido,
    otroApellido,
    setOtroApellido,
    nombreSocial,
    setNombreSocial,
    fechaNacimiento,
    setFechaNacimiento,
    sexoBiologico,
    setSexoBiologico,
    generoAutopercibido,
    setGeneroAutopercibido,
    presentaDocumentacion,
    setPresentaDocumentacion,
    cargaPorEscaneoDni,
    setCargaPorEscaneoDni,
    setMinimoSnapshot,
    setSetMinimoSnapshot,
    rebusquedaModalOpen,
    setRebusquedaModalOpen,
    rebusquedaCandidatos,
    setRebusquedaCandidatos,
    sinResultadosModalOpen,
    setSinResultadosModalOpen,
    modoEdicionEmpadronamiento,
    setModoEdicionEmpadronamiento,
    personaCreadaModalOpen,
    setPersonaCreadaModalOpen,
    personaCreadaMensaje,
    setPersonaCreadaMensaje,
    contactos,
    setContactos,
    advertenciaContactoModalOpen,
    setAdvertenciaContactoModalOpen,
    direccionPais,
    setDireccionPais,
    direccionProvincia,
    setDireccionProvincia,
    direccionCalle,
    setDireccionCalle,
    direccionNumero,
    setDireccionNumero,
    direccionLocalidad,
    setDireccionLocalidad,
    direccionBarrio,
    setDireccionBarrio,
    direccionCodigoPostal,
    setDireccionCodigoPostal,
    direccionPiso,
    setDireccionPiso,
    direccionDepartamento,
    setDireccionDepartamento,
    direccionComentario,
    setDireccionComentario,
    personaContactos,
    setPersonaContactos,
    empadronarContactoModalOpen,
    setEmpadronarContactoModalOpen,
    contactoNombre,
    setContactoNombre,
    contactoApellido,
    setContactoApellido,
    contactoTipoDocumento,
    setContactoTipoDocumento,
    contactoNumeroDocumento,
    setContactoNumeroDocumento,
    contactoFechaNacimiento,
    setContactoFechaNacimiento,
    contactoSexoBiologico,
    setContactoSexoBiologico,
    contactoDatosContacto,
    setContactoDatosContacto,
    contactoScanRawData,
    setContactoScanRawData,
    contactoScanMessage,
    setContactoScanMessage,
    personaContactosSeleccionados,
    setPersonaContactosSeleccionados,
    eliminarPersonaContactoModalOpen,
    setEliminarPersonaContactoModalOpen,
    selectedCandidatoId,
    setSelectedCandidatoId,
    info,
    setInfo,
    scanModalOpen,
    setScanModalOpen,
    scanRawData,
    setScanRawData,
    scanState,
    setScanState,
    scanMessage,
    setScanMessage,
    scanTimerRef,
    lastRebusquedaSignatureRef,
    numeroInputRef,
    nextContactoIdRef,
    nextDatoContactoPersonaIdRef,
    nextPersonaContactoIdRef,
    direccionPaises,
    direccionProvincias,
    direccionLocalidadesFiltradas,
    mensajeSinResultados,
    puedeConsultarSetMinimo,
    setMinimoCompleto,
    tieneTelefonoContacto,
    tieneEmailContacto,
    datosContactoCompleto,
    direccionCompleta,
    personaContactoCompleta,
    porcentajeCargaEmpadronamiento,
    puedeConsultar,
    maxPorcentajeCoincidencia,
    habilitarEmpadronar,
    selectedCandidato,
    bloqueaDatosAmpliados,
    bloqueaSetMinimo,
    parseApellidosNombres,
    requestSetMinimo,
    buildSetMinimoSnapshot,
    applySetMinimoPrecargado,
    estadoEmpadronamiento,
    maybeRunRebusquedaCandidatos,
    normalizarFechaParaInput,
    normalizarSexoEscaneo,
    parseQrData,
    consultarCandidatosPorSet,
    onConsultar,
    onLimpiar,
    onSeleccionarCandidato,
    onIniciarEdicionSeleccionado,
    onCancelarEdicionEmpadronamiento,
    onGuardarEdicionSetMinimo,
    onEmpadronar,
    ejecutarEmpadronamiento,
    onAgregarContacto,
    onEliminarContacto,
    onActualizarContacto,
    normalizarValorContacto,
    calcularEdad,
    resetEmpadronarContactoForm,
    onAbrirEmpadronarContacto,
    onCerrarEmpadronarContacto,
    onAgregarDatoContactoPersona,
    onEliminarDatoContactoPersona,
    onActualizarDatoContactoPersona,
    onEscanearDniPersonaContacto,
    puedeGuardarPersonaContacto,
    onGuardarPersonaContacto,
    onTogglePersonaContactoSeleccion,
    onAbrirEliminarPersonaContacto,
    onCerrarEliminarPersonaContacto,
    onConfirmarEliminarPersonaContacto,
    personaEmpadronadaNombre,
    personaContactosSeleccionadosDetalle,
    textoConfirmacionEliminarPersonaContacto,
    onAbrirEscaneoDni,
    onCerrarEscaneoDni,
    onEjecutarEscaneoDni,
    onCerrarPersonaCreadaModal
  };
}
