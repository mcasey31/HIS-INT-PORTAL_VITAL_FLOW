import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { actualizarPersonaSetMinimo, buscarPersonasPorDocumento, buscarPersonasPorSetMinimo, createContacto, deleteContactos, empadronarPersonaConSetMinimo, getContactos, getDomicilio, updateContacto, upsertDomicilio } from "./personasApi";
import type { PersonaCandidata } from "./personasApi";
import { getTiposDocumento } from "../shared/catalogosApi";
import type { TipoDocumento } from "../shared/catalogosApi";
import { getProvincias, getLocalidades } from "../shared/ubicacionApi";
import type { ProvinciaDto, LocalidadDto } from "../shared/ubicacionApi";
import type { ScanFlowState, DniScanData, ContactoTipo, ContactoDato, PersonaContactoVinculada, SetMinimoSnapshot } from "./personasTypes";
import {
  CONTACTOS_INICIALES, CONTACTOS_PERSONA_CONTACTO_INICIALES,
  DIRECCION_PAIS_DEFAULT,
  parseApellidosNombres, normalizarFechaParaInput, normalizarSexoEscaneo,
  parseQrData, normalizarValorContacto, calcularEdad
} from "./personasTypes";

export function usePersonasController() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
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
  const [direccionProvincia, setDireccionProvincia] = useState("");
  const [provincias, setProvincias] = useState<ProvinciaDto[]>([]);
  const [localidades, setLocalidades] = useState<LocalidadDto[]>([]);
  const [direccionCalle, setDireccionCalle] = useState("");
  const [direccionNumero, setDireccionNumero] = useState("");
  const [direccionLocalidad, setDireccionLocalidad] = useState("");
  const [direccionLocalidadId, setDireccionLocalidadId] = useState<string | null>(null);
  const pendingLocalidadRef = useRef<string | null>(null);
  const [direccionBarrio, setDireccionBarrio] = useState("");
  const [direccionCodigoPostal, setDireccionCodigoPostal] = useState("");
  const [direccionPiso, setDireccionPiso] = useState("");
  const [direccionDepartamento, setDireccionDepartamento] = useState("");
  const [direccionComentario, setDireccionComentario] = useState("");
  const [personaContactos, setPersonaContactos] = useState<PersonaContactoVinculada[]>([]);
  const [empadronarContactoModalOpen, setEmpadronarContactoModalOpen] = useState(false);
  const [contactoEditandoId, setContactoEditandoId] = useState<string | null>(null);
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
  const [deletedContactosServerIds, setDeletedContactosServerIds] = useState<string[]>([]);
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
        const [tipos, provinciasData] = await Promise.all([
          getTiposDocumento(),
          getProvincias()
        ]);
        setTiposDocumento(tipos);
        setProvincias(provinciasData);
        if (tipos.some(t => t.codigo === "DNI")) {
          setTipoDocumento("DNI");
        } else if (tipos.length > 0) {
          setTipoDocumento(tipos[0].codigo);
        }
        if (provinciasData.length > 0) {
          const defaultProv = provinciasData.find(p => p.id === "CABA") ?? provinciasData[0];
          setDireccionProvincia(defaultProv.nombre);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudieron cargar tipos de documento.");
      }
    };
    run();
  }, []);

  useEffect(() => { numeroInputRef.current?.focus(); }, []);
  useEffect(() => () => { if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current); }, []);

  const direccionPaises = [DIRECCION_PAIS_DEFAULT];
  const direccionProvincias = provincias;
  const direccionLocalidadesFiltradas = useMemo(() =>
    localidades.map(l => l.nombre),
    [localidades]
  );

  const normalizarProvincia = (valor: string) => {
    const q = valor.trim().toLowerCase();
    const match = provincias.find(p => p.nombre.trim().toLowerCase() === q);
    if (match) setDireccionProvincia(match.nombre);
  };

  const normalizarLocalidad = (valor: string) => {
    const q = valor.trim().toLowerCase();
    const match = localidades.find(l => l.nombre.trim().toLowerCase() === q);
    if (match) {
      setDireccionLocalidad(match.nombre);
      setDireccionLocalidadId(match.id);
    }
  };

  const provinciaActual = useMemo(() => {
    const q = direccionProvincia.trim().toLowerCase();
    return provincias.find(p => p.nombre.trim().toLowerCase() === q);
  }, [provincias, direccionProvincia]);

  useEffect(() => {
    if (!provinciaActual) {
      setLocalidades([]);
      return;
    }
    let cancelled = false;
    getLocalidades(provinciaActual.id).then(locs => {
      if (cancelled) return;
      setLocalidades(locs);
      const pending = pendingLocalidadRef.current;
      if (pending) {
        pendingLocalidadRef.current = null;
        const match = locs.find(l => l.nombre === pending);
        if (match) {
          setDireccionLocalidad(match.nombre);
          setDireccionLocalidadId(match.id);
        } else {
          setDireccionLocalidad("");
          setDireccionLocalidadId(null);
        }
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [provinciaActual]);

  useEffect(() => {
    if (direccionLocalidad && !direccionLocalidadesFiltradas.includes(direccionLocalidad)) {
      setDireccionLocalidad("");
      setDireccionLocalidadId(null);
    }
  }, [direccionLocalidad, direccionLocalidadesFiltradas]);

  const mensajeSinResultados = useMemo(() => {
    if (!consultado || candidatos.length > 0) return null;
    if (mostrarSetMinimo) return "No se encontraron candidatos por set minimo. Puede continuar con el enrolamiento directo completando los datos y presionando '+ Empadronar persona'.";
    return `No se encontro persona para el DNI ${numeroDocumento}. Para continuar, use 'Iniciar enrolamiento directo' y complete el set minimo.`;
  }, [consultado, candidatos.length, numeroDocumento, mostrarSetMinimo]);

  const puedeConsultarSetMinimo = tipoDocumento.trim().length > 0 && numeroDocumento.trim().length > 0 && nombre.trim().length > 0 && apellido.trim().length > 0 && fechaNacimiento.trim().length > 0 && sexoBiologico.trim().length > 0;

  const setMinimoCompleto = useMemo(() =>
    tipoDocumento.trim().length > 0 && numeroDocumento.trim().length > 0 && nombre.trim().length > 0 && apellido.trim().length > 0 && fechaNacimiento.trim().length > 0 && sexoBiologico.trim().length > 0,
    [tipoDocumento, numeroDocumento, nombre, apellido, fechaNacimiento, sexoBiologico]
  );

  const tieneTelefonoContacto = useMemo(() => contactos.some(c => c.tipo === "TELEFONO" && c.valor.trim().length > 0), [contactos]);
  const tieneEmailContacto = useMemo(() => contactos.some(c => c.tipo === "CORREO_ELECTRONICO" && c.valor.trim().length > 0), [contactos]);

  const datosContactoCompleto = tieneTelefonoContacto && tieneEmailContacto;
  const direccionCompleta = direccionPais.trim().length > 0 && direccionProvincia.trim().length > 0 && direccionLocalidad.trim().length > 0 && direccionCalle.trim().length > 0 && direccionNumero.trim().length > 0;
  const personaContactoCompleta = personaContactos.length > 0;

  const porcentajeCargaEmpadronamiento = (setMinimoCompleto ? 50 : 0) + (datosContactoCompleto ? 30 : 0) + (direccionCompleta ? 10 : 0) + (personaContactoCompleta ? 10 : 0);

  const puedeConsultar = mostrarSetMinimo ? puedeConsultarSetMinimo : numeroDocumento.trim().length > 0 && tipoDocumento.trim().length > 0;

  const maxPorcentajeCoincidencia = useMemo(() => candidatos.length === 0 ? 0 : Math.max(...candidatos.map(c => c.porcentajeCoincidencia)), [candidatos]);

  const habilitarEmpadronar = mostrarSetMinimo && puedeConsultarSetMinimo && (!consultado || candidatos.length === 0 || maxPorcentajeCoincidencia < 95);

  const selectedCandidato = useMemo(() => candidatos.find(c => c.id === selectedCandidatoId) ?? null, [candidatos, selectedCandidatoId]);

  const bloqueaDatosAmpliados = Boolean(selectedCandidato && !modoEdicionEmpadronamiento);
  const bloqueaSetMinimo = bloqueaDatosAmpliados;

  const requestSetMinimo = () => ({
    tipoDocumento,
    numeroDocumento: numeroDocumento.trim(),
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    fechaNacimiento,
    sexoBiologico,
    email: contactos.find(c => c.tipo === "CORREO_ELECTRONICO" && c.valor.trim().length > 0)?.valor.trim() || undefined,
    telefono: contactos.find(c => c.tipo === "TELEFONO" && c.valor.trim().length > 0)?.valor.trim() || undefined
  });

  const buildSetMinimoSnapshot = (): SetMinimoSnapshot => ({
    tipoDocumento: tipoDocumento.trim().toUpperCase(),
    numeroDocumento: numeroDocumento.trim().toUpperCase(),
    nombre: nombre.trim().toUpperCase(),
    apellido: apellido.trim().toUpperCase(),
    fechaNacimiento: fechaNacimiento.trim(),
    sexoBiologico: sexoBiologico.trim().toUpperCase()
  });

  const buildDomicilioRequest = () => {
    const matchedLocalidad = localidades.find(l => l.nombre === direccionLocalidad);
    return {
      localidadId: matchedLocalidad?.id ?? direccionLocalidadId ?? null,
      pais: direccionPais,
      provincia: direccionProvincia,
      localidad: direccionLocalidad,
      calle: direccionCalle,
      numero: direccionNumero,
      barrio: direccionBarrio,
      codigoPostal: direccionCodigoPostal,
      piso: direccionPiso,
      departamento: direccionDepartamento,
      comentario: direccionComentario
    };
  };

  const aplicarDomicilio = (domicilio: { localidadId?: string | null; pais: string; provincia: string; localidad: string; calle: string; numero: string; barrio: string; codigoPostal: string; piso: string; departamento: string; comentario: string }) => {
    setDireccionPais(domicilio.pais || DIRECCION_PAIS_DEFAULT);
    setDireccionProvincia(domicilio.provincia);
    setDireccionLocalidad(domicilio.localidad || "");
    pendingLocalidadRef.current = domicilio.localidad || null;
    setDireccionLocalidadId(domicilio.localidadId ?? null);
    setDireccionCalle(domicilio.calle);
    setDireccionNumero(domicilio.numero);
    setDireccionBarrio(domicilio.barrio);
    setDireccionCodigoPostal(domicilio.codigoPostal);
    setDireccionPiso(domicilio.piso);
    setDireccionDepartamento(domicilio.departamento);
    setDireccionComentario(domicilio.comentario);
  };

  const persistContactos = async (personaId: string) => {
    const toDelete = deletedContactosServerIds;
    if (toDelete.length > 0) {
      try {
        await deleteContactos(personaId, toDelete);
      } catch {
        // no bloqueante
      }
      setDeletedContactosServerIds([]);
    }
    for (const c of personaContactos) {
      const request = {
        nombre: c.nombre,
        apellido: c.apellido,
        tipoDocumento: c.tipoDocumento,
        numeroDocumento: c.numeroDocumento,
        fechaNacimiento: c.fechaNacimiento,
        sexoBiologico: c.sexoBiologico,
        telefono: c.telefonos.length > 0 ? c.telefonos[0] : undefined,
        email: c.email || undefined
      };
      if (c.serverId) {
        try {
          await updateContacto(personaId, c.serverId, request);
        } catch {
          // no bloqueante por contacto individual
        }
      } else {
        try {
          const created = await createContacto(personaId, request);
          setPersonaContactos(prev => prev.map(pc => pc.id === c.id ? { ...pc, serverId: created.id } : pc));
        } catch {
          // no bloqueante por contacto individual
        }
      }
    }
  };

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

  const estadoEmpadronamiento = useMemo(() => cargaPorEscaneoDni ? "VALIDADO" : presentaDocumentacion ? "PERMANENTE" : "TEMPORAL", [cargaPorEscaneoDni, presentaDocumentacion]);

  const maybeRunRebusquedaCandidatos = async () => {
    if (!setMinimoSnapshot || !puedeConsultarSetMinimo || loading) return;
    const current = buildSetMinimoSnapshot();
    const changed = current.tipoDocumento !== setMinimoSnapshot.tipoDocumento || current.numeroDocumento !== setMinimoSnapshot.numeroDocumento || current.nombre !== setMinimoSnapshot.nombre || current.apellido !== setMinimoSnapshot.apellido || current.fechaNacimiento !== setMinimoSnapshot.fechaNacimiento || current.sexoBiologico !== setMinimoSnapshot.sexoBiologico;
    if (!changed) return;
    const signature = JSON.stringify(current);
    if (lastRebusquedaSignatureRef.current === signature) return;
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
      setError(e instanceof Error ? e.message : "No se pudo ejecutar nueva busqueda de candidatos.");
    } finally { setLoading(false); }
  };

  const consultarCandidatosPorSet = async (data: DniScanData) => {
    const response = await buscarPersonasPorSetMinimo({
      tipoDocumento: "DNI", numeroDocumento: data.numeroDocumento, nombre: data.nombre, apellido: data.apellido, fechaNacimiento: data.fechaNacimiento, sexoBiologico: data.sexoBiologico
    });
    setCandidatos(response);
    setSelectedCandidatoId(response[0]?.id ?? null);
    setConsultado(true);
    setMostrarSetMinimo(true);
  };

  const onConsultar = async (event: FormEvent) => {
    event.preventDefault();
    if (!puedeConsultar) return;
    try {
      setLoading(true);
      setError(null);
      setInfo(null);
      const tipoDocumentoNormalizado = tipoDocumento.trim().toUpperCase();
      const numeroDocumentoNormalizado = numeroDocumento.trim().toUpperCase();
      const snapshotActual = setMinimoSnapshot;
      let cambioDocumentoDesdeUltimoSet = false;
      if (mostrarSetMinimo && snapshotActual) {
        cambioDocumentoDesdeUltimoSet = snapshotActual.tipoDocumento !== tipoDocumentoNormalizado || snapshotActual.numeroDocumento !== numeroDocumentoNormalizado;
      }
      const usarConsultaPorDocumento = !mostrarSetMinimo || cambioDocumentoDesdeUltimoSet;
      const response = usarConsultaPorDocumento
        ? await buscarPersonasPorDocumento(tipoDocumento, numeroDocumento.trim())
        : await buscarPersonasPorSetMinimo(requestSetMinimo());
      setCandidatos(response);
      setSelectedCandidatoId(response[0]?.id ?? null);
      setConsultado(true);
      if (usarConsultaPorDocumento && response.length === 0) {
        prepararSetMinimoParaNuevoEmpadronamiento();
        setMostrarSetMinimo(true);
      }
      if (response.length > 0 && usarConsultaPorDocumento) {
        const selected = response[0];
        const parsed = parseApellidosNombres(selected.apellidosNombres);
        applySetMinimoPrecargado({
          numeroDocumento: selected.numeroDocumento, nombre: parsed.nombre, apellido: parsed.apellido, fechaNacimiento: selected.fechaNacimiento, sexoBiologico: selected.sexoBiologico
        }, false);
        setMostrarSetMinimo(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo consultar personas.");
      setCandidatos([]);
      setConsultado(true);
    } finally { setLoading(false); }
  };

  const onLimpiar = () => {
    setNumeroDocumento("");
    setNombre(""); setOtroNombre(""); setApellido(""); setOtroApellido(""); setNombreSocial("");
    setFechaNacimiento(""); setSexoBiologico(""); setGeneroAutopercibido("");
    setPresentaDocumentacion(false); setCargaPorEscaneoDni(false); setSetMinimoSnapshot(null);
    setRebusquedaModalOpen(false); setRebusquedaCandidatos([]); setSinResultadosModalOpen(false);
    setModoEdicionEmpadronamiento(false);
    lastRebusquedaSignatureRef.current = "";
    setContactos(CONTACTOS_INICIALES); nextContactoIdRef.current = 3; setAdvertenciaContactoModalOpen(false);
    setDireccionPais(DIRECCION_PAIS_DEFAULT); setDireccionProvincia(provincias.find(p => p.id === "CABA")?.nombre ?? (provincias[0]?.nombre ?? ""));
    setDireccionCalle(""); setDireccionNumero(""); setDireccionLocalidad(""); setDireccionLocalidadId(null); setDireccionBarrio("");
    setDireccionCodigoPostal(""); setDireccionPiso(""); setDireccionDepartamento(""); setDireccionComentario("");
    setPersonaContactos([]); setEmpadronarContactoModalOpen(false); setContactoEditandoId(null);
    setContactoNombre(""); setContactoApellido(""); setContactoTipoDocumento("DNI"); setContactoNumeroDocumento("");
    setContactoFechaNacimiento(""); setContactoSexoBiologico("");
    setContactoDatosContacto(CONTACTOS_PERSONA_CONTACTO_INICIALES);
    setContactoScanRawData(""); setContactoScanMessage(null);
    nextPersonaContactoIdRef.current = 1; nextDatoContactoPersonaIdRef.current = 1;
    setDeletedContactosServerIds([]);
    setCandidatos([]); setSelectedCandidatoId(null); setConsultado(false);
    setError(null); setInfo(null); setMostrarSetMinimo(false);
    numeroInputRef.current?.focus();
  };

  const onSeleccionarCandidato = (candidato: PersonaCandidata) => {
    setSelectedCandidatoId(candidato.id);
    setModoEdicionEmpadronamiento(false);
    setInfo(`Candidato seleccionado: ${candidato.apellidosNombres}`);
  };

  const onIniciarEdicionSeleccionado = async () => {
    if (!selectedCandidato) return;
    const parsed = parseApellidosNombres(selectedCandidato.apellidosNombres);
    setTipoDocumento(selectedCandidato.tipoDocumento);
    setNumeroDocumento(selectedCandidato.numeroDocumento);
    setApellido(parsed.apellido);
    setNombre(parsed.nombre);
    setFechaNacimiento(selectedCandidato.fechaNacimiento);
    setSexoBiologico(selectedCandidato.sexoBiologico);
    setSetMinimoSnapshot({
      tipoDocumento: selectedCandidato.tipoDocumento, numeroDocumento: selectedCandidato.numeroDocumento.trim().toUpperCase(),
      nombre: parsed.nombre.trim().toUpperCase(), apellido: parsed.apellido.trim().toUpperCase(),
      fechaNacimiento: selectedCandidato.fechaNacimiento, sexoBiologico: selectedCandidato.sexoBiologico.trim().toUpperCase()
    });
    setCargaPorEscaneoDni(false);
    setMostrarSetMinimo(true);
    setModoEdicionEmpadronamiento(true);
    setInfo(`Editar empadronamiento habilitado para ${selectedCandidato.apellidosNombres}.`);
    try {
      const [domicilio, contactos] = await Promise.all([
        getDomicilio(selectedCandidato.id),
        getContactos(selectedCandidato.id)
      ]);
      if (domicilio && domicilio.id !== "00000000-0000-0000-0000-000000000000") {
        aplicarDomicilio(domicilio);
      }
      if (contactos.length > 0) {
        setPersonaContactos(contactos.map(c => ({
          id: `persona-contacto-vinculada-${nextPersonaContactoIdRef.current++}`,
          serverId: c.id,
          tipoDocumento: c.tipoDocumento,
          numeroDocumento: c.numeroDocumento,
          apellidosNombres: `${c.apellido}, ${c.nombre}`,
          nombre: c.nombre,
          apellido: c.apellido,
          fechaNacimiento: c.fechaNacimiento,
          sexoBiologico: c.sexoBiologico,
          sexoEdad: `${c.sexoBiologico}(${calcularEdad(c.fechaNacimiento)})`,
          telefonos: c.telefono ? [c.telefono] : [],
          email: c.email ?? "",
          estado: "TEMPORAL"
        })));
      }
    } catch {
      // datos ampliados no disponibles
    }
  };

  const onCancelarEdicionEmpadronamiento = () => {
    setModoEdicionEmpadronamiento(false);
    setInfo("Edicion de empadronamiento cancelada.");
  };

  const onGuardarEdicionSetMinimo = async () => {
    if (!selectedCandidatoId || !modoEdicionEmpadronamiento) return false;
    if (!puedeConsultarSetMinimo) return false;
    try {
      setLoading(true); setError(null);
      const updated = await actualizarPersonaSetMinimo(selectedCandidatoId, requestSetMinimo());
      try {
        await upsertDomicilio(selectedCandidatoId, buildDomicilioRequest());
      } catch (e) {
        setError(`Domicilio no guardado: ${e instanceof Error ? e.message : "error desconocido"}`);
      }
      await persistContactos(selectedCandidatoId);
      setCandidatos(prev => prev.map(item => item.id === selectedCandidatoId ? updated : item));
      setSetMinimoSnapshot(buildSetMinimoSnapshot());
      setInfo(`Set minimo actualizado para ${updated.apellidosNombres}.`);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar set minimo.");
      return false;
    } finally { setLoading(false); }
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
      setLoading(true); setError(null);
      const creada = await empadronarPersonaConSetMinimo(requestSetMinimo());
      try {
        await upsertDomicilio(creada.id, buildDomicilioRequest());
      } catch (e) {
        setError(`Domicilio no guardado: ${e instanceof Error ? e.message : "error desconocido"}`);
      }
      await persistContactos(creada.id);
      setCandidatos(prev => [creada, ...prev.filter(item => item.id !== creada.id)]);
      setSelectedCandidatoId(creada.id);
      setConsultado(true);
      setSetMinimoSnapshot(buildSetMinimoSnapshot());
      setInfo(`Persona empadronada: ${creada.apellidosNombres}.`);
      setPersonaCreadaMensaje(`Persona creada con exito en el sistema: ${creada.apellidosNombres}.`);
      setPersonaCreadaModalOpen(true);
      setAdvertenciaContactoModalOpen(false);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo empadronar persona.");
      return false;
    } finally { setLoading(false); }
  };

  const onAgregarContacto = () => {
    const nextId = `contacto-${nextContactoIdRef.current}`;
    nextContactoIdRef.current += 1;
    setContactos(prev => [...prev, { id: nextId, tipo: "", valor: "", uso: "" }]);
  };

  const onEliminarContacto = (contactoId: string) => {
    setContactos(prev => prev.filter(item => item.id !== contactoId));
  };

  const onActualizarContacto = (contactoId: string, patch: Partial<ContactoDato>) => {
    setContactos(prev => prev.map(item => {
      if (item.id !== contactoId) return item;
      const next = { ...item, ...patch };
      if (patch.tipo && patch.tipo !== item.tipo) next.valor = "";
      return next;
    }));
  };

  const resetEmpadronarContactoForm = (contacto?: PersonaContactoVinculada) => {
    if (contacto) {
      setContactoNombre(contacto.nombre);
      setContactoApellido(contacto.apellido);
      setContactoTipoDocumento(contacto.tipoDocumento);
      setContactoNumeroDocumento(contacto.numeroDocumento);
      setContactoFechaNacimiento(contacto.fechaNacimiento);
      setContactoSexoBiologico(contacto.sexoBiologico);
      setContactoDatosContacto([
        { id: "persona-contacto-1", tipo: "TELEFONO", valor: contacto.telefonos[0] ?? "", uso: "PERSONAL" },
        { id: "persona-contacto-2", tipo: "CORREO_ELECTRONICO", valor: contacto.email || "", uso: "PERSONAL" }
      ]);
    } else {
      setContactoNombre(""); setContactoApellido(""); setContactoTipoDocumento("DNI"); setContactoNumeroDocumento("");
      setContactoFechaNacimiento(""); setContactoSexoBiologico("");
      setContactoDatosContacto(CONTACTOS_PERSONA_CONTACTO_INICIALES);
    }
    setContactoScanRawData(""); setContactoScanMessage(null);
    nextDatoContactoPersonaIdRef.current = 1;
  };

  const onAbrirEmpadronarContacto = (contactoId?: string) => {
    if (contactoId) {
      const contacto = personaContactos.find(c => c.id === contactoId);
      if (!contacto) return;
      setContactoEditandoId(contactoId);
      resetEmpadronarContactoForm(contacto);
    } else {
      setContactoEditandoId(null);
      resetEmpadronarContactoForm();
    }
    setEmpadronarContactoModalOpen(true);
  };
  const onCerrarEmpadronarContacto = () => { setEmpadronarContactoModalOpen(false); setContactoScanMessage(null); setContactoEditandoId(null); };

  const onAgregarDatoContactoPersona = () => {
    const next = `persona-contacto-extra-${nextDatoContactoPersonaIdRef.current}`;
    nextDatoContactoPersonaIdRef.current += 1;
    setContactoDatosContacto(prev => [...prev, { id: next, tipo: "", valor: "", uso: "PERSONAL" }]);
  };

  const onEliminarDatoContactoPersona = (id: string) => {
    setContactoDatosContacto(prev => prev.filter(item => item.id !== id));
  };

  const onActualizarDatoContactoPersona = (id: string, patch: Partial<ContactoDato>) => {
    setContactoDatosContacto(prev => prev.map(item => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch };
      if (patch.tipo && patch.tipo !== item.tipo) next.valor = "";
      return next;
    }));
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

  const puedeGuardarPersonaContacto = contactoNombre.trim().length > 0 && contactoApellido.trim().length > 0 && contactoTipoDocumento.trim().length > 0 && contactoNumeroDocumento.trim().length > 0 && contactoFechaNacimiento.trim().length > 0 && contactoSexoBiologico.trim().length > 0;

  const onGuardarPersonaContacto = () => {
    if (!puedeGuardarPersonaContacto) return;
    const telefonos = contactoDatosContacto.filter(item => item.tipo === "TELEFONO" && item.valor.trim().length > 0).map(item => item.valor.trim());
    const email = contactoDatosContacto.find(item => item.tipo === "CORREO_ELECTRONICO" && item.valor.trim().length > 0)?.valor.trim() ?? "";
    const edad = calcularEdad(contactoFechaNacimiento);
    const sexoLabel = contactoSexoBiologico.trim().toUpperCase().startsWith("F") ? "F" : "M";
    const apellidosNombres = `${contactoApellido.trim()}, ${contactoNombre.trim()}`;

    if (contactoEditandoId) {
      setPersonaContactos(prev => prev.map(item => {
        if (item.id !== contactoEditandoId) return item;
        return {
          ...item,
          nombre: contactoNombre.trim(),
          apellido: contactoApellido.trim(),
          tipoDocumento: contactoTipoDocumento,
          numeroDocumento: contactoNumeroDocumento.trim(),
          fechaNacimiento: contactoFechaNacimiento,
          sexoBiologico: contactoSexoBiologico,
          apellidosNombres,
          sexoEdad: `${sexoLabel}(${edad})`,
          telefonos,
          email
        };
      }));
      setInfo(`Se actualizo a ${apellidosNombres} como persona de contacto.`);
    } else {
      const nuevaPersonaContacto: PersonaContactoVinculada = {
        id: `persona-contacto-vinculada-${nextPersonaContactoIdRef.current++}`,
        tipoDocumento: contactoTipoDocumento, numeroDocumento: contactoNumeroDocumento.trim(),
        apellidosNombres, nombre: contactoNombre.trim(), apellido: contactoApellido.trim(),
        fechaNacimiento: contactoFechaNacimiento, sexoBiologico: contactoSexoBiologico,
        sexoEdad: `${sexoLabel}(${edad})`, telefonos, email, estado: "TEMPORAL"
      };
      setPersonaContactos(prev => [...prev, nuevaPersonaContacto]);
      setInfo(`Se agrego a ${apellidosNombres} como persona de contacto.`);
    }
    onCerrarEmpadronarContacto();
  };

  const onTogglePersonaContactoSeleccion = (contactoId: string) => {
    setPersonaContactosSeleccionados(prev => prev.includes(contactoId) ? prev.filter(id => id !== contactoId) : [...prev, contactoId]);
  };

  const onAbrirEliminarPersonaContacto = () => {
    if (personaContactosSeleccionados.length === 0) return;
    setEliminarPersonaContactoModalOpen(true);
  };

  const onCerrarEliminarPersonaContacto = () => { setEliminarPersonaContactoModalOpen(false); };

  const onConfirmarEliminarPersonaContacto = () => {
    if (personaContactosSeleccionados.length === 0) { setEliminarPersonaContactoModalOpen(false); return; }
    const idsSeleccionados = new Set(personaContactosSeleccionados);
    const removedServerIds: string[] = [];
    setPersonaContactos(prev => {
      const kept = prev.filter(item => {
        if (idsSeleccionados.has(item.id)) {
          if (item.serverId) removedServerIds.push(item.serverId);
          return false;
        }
        return true;
      });
      return kept;
    });
    setDeletedContactosServerIds(prev => [...prev, ...removedServerIds]);
    setPersonaContactosSeleccionados([]);
    setEliminarPersonaContactoModalOpen(false);
  };

  const personaEmpadronadaNombre = `${apellido.trim()}, ${nombre.trim()}`.replace(/^,\s*/, "").trim() || "la persona";

  const personaContactosSeleccionadosDetalle = personaContactos.filter(item => personaContactosSeleccionados.includes(item.id));

  const textoConfirmacionEliminarPersonaContacto = personaContactosSeleccionadosDetalle.length === 1
    ? `Desea realmente eliminar a ${personaContactosSeleccionadosDetalle[0].apellidosNombres} como persona de contacto de ${personaEmpadronadaNombre}?`
    : `Desea realmente eliminar a ${personaContactosSeleccionadosDetalle.length} personas de contacto de ${personaEmpadronadaNombre}?`;

  const onAbrirEscaneoDni = () => { setScanModalOpen(true); setScanRawData(""); setScanState("idle"); setScanMessage(null); };

  const onCerrarEscaneoDni = () => {
    setScanModalOpen(false); setScanState("idle"); setScanMessage(null);
    if (scanTimerRef.current) { window.clearTimeout(scanTimerRef.current); scanTimerRef.current = null; }
  };

  const onEjecutarEscaneoDni = async () => {
    const scanned = parseQrData(scanRawData);
    if (!scanned) { setScanState("error"); setScanMessage("No se puede escanear. Intente nuevamente."); return; }
    setScanState("success");
    setScanMessage("Escaneo completado. Volviendo a la pantalla de busqueda...");
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    scanTimerRef.current = window.setTimeout(() => {
      applySetMinimoPrecargado(scanned, true);
      setMostrarSetMinimo(true);
      setInfo("Datos leidos desde escaneo de DNI impactados.");
      onCerrarEscaneoDni();
      void consultarCandidatosPorSet(scanned);
    }, 2000);
  };

  const onCerrarPersonaCreadaModal = () => { setPersonaCreadaModalOpen(false); };

  return {
    tiposDocumento, tipoDocumento, setTipoDocumento, numeroDocumento, setNumeroDocumento,
    candidatos, consultado, loading, error, mostrarSetMinimo, setMostrarSetMinimo,
    nombre, setNombre, otroNombre, setOtroNombre, apellido, setApellido,
    otroApellido, setOtroApellido, nombreSocial, setNombreSocial,
    fechaNacimiento, setFechaNacimiento, sexoBiologico, setSexoBiologico,
    generoAutopercibido, setGeneroAutopercibido, presentaDocumentacion, setPresentaDocumentacion,
    cargaPorEscaneoDni, setSetMinimoSnapshot,
    rebusquedaModalOpen, setRebusquedaModalOpen, rebusquedaCandidatos,
    sinResultadosModalOpen, setSinResultadosModalOpen,
    modoEdicionEmpadronamiento, personaCreadaModalOpen, personaCreadaMensaje,
    contactos, advertenciaContactoModalOpen, setAdvertenciaContactoModalOpen,
    direccionPais, setDireccionPais, direccionProvincia, setDireccionProvincia,
    direccionCalle, setDireccionCalle, direccionNumero, setDireccionNumero,
    direccionLocalidad, setDireccionLocalidad, direccionLocalidadId, direccionBarrio, setDireccionBarrio,
    direccionCodigoPostal, setDireccionCodigoPostal, direccionPiso, setDireccionPiso,
    direccionDepartamento, setDireccionDepartamento, direccionComentario, setDireccionComentario,
    personaContactos, empadronarContactoModalOpen, contactoEditandoId,
    contactoNombre, setContactoNombre, contactoApellido, setContactoApellido,
    contactoTipoDocumento, setContactoTipoDocumento, contactoNumeroDocumento, setContactoNumeroDocumento,
    contactoFechaNacimiento, setContactoFechaNacimiento, contactoSexoBiologico, setContactoSexoBiologico,
    contactoDatosContacto, contactoScanRawData, setContactoScanRawData,
    contactoScanMessage, personaContactosSeleccionados, eliminarPersonaContactoModalOpen,
    selectedCandidatoId, setSelectedCandidatoId, info, setInfo,
    scanModalOpen, scanRawData, setScanRawData, scanState, setScanState, scanMessage, setScanMessage,
    numeroInputRef, direccionPaises, direccionProvincias, direccionLocalidadesFiltradas,
    mensajeSinResultados, puedeConsultarSetMinimo, setMinimoCompleto, datosContactoCompleto,
    direccionCompleta, personaContactoCompleta, porcentajeCargaEmpadronamiento,
    puedeConsultar, maxPorcentajeCoincidencia, habilitarEmpadronar,
    selectedCandidato, bloqueaDatosAmpliados, bloqueaSetMinimo,
    parseApellidosNombres, estadoEmpadronamiento, maybeRunRebusquedaCandidatos,
    onConsultar, onLimpiar, onSeleccionarCandidato, onIniciarEdicionSeleccionado,
    onCancelarEdicionEmpadronamiento, onGuardarEdicionSetMinimo, onEmpadronar, ejecutarEmpadronamiento,
    normalizarProvincia, normalizarLocalidad,
    onAgregarContacto, onEliminarContacto, onActualizarContacto, normalizarValorContacto,
    onAbrirEmpadronarContacto, onCerrarEmpadronarContacto,
    onAgregarDatoContactoPersona, onEliminarDatoContactoPersona, onActualizarDatoContactoPersona,
    onEscanearDniPersonaContacto, puedeGuardarPersonaContacto, onGuardarPersonaContacto,
    onTogglePersonaContactoSeleccion, onAbrirEliminarPersonaContacto, onCerrarEliminarPersonaContacto,
    onConfirmarEliminarPersonaContacto, personaEmpadronadaNombre, personaContactosSeleccionadosDetalle,
    textoConfirmacionEliminarPersonaContacto, onAbrirEscaneoDni, onCerrarEscaneoDni,
    onEjecutarEscaneoDni, onCerrarPersonaCreadaModal
  } as const;
}
