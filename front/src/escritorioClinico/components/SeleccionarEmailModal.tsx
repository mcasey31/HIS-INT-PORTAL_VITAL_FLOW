import { useEffect, useState } from "react";
import { enviarRecetasEmail, obtenerCorreosPaciente } from "../escritorioClinicoApi";

type Props = {
  pacienteId: string;
  recetaIds: string[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function SeleccionarEmailModal({ pacienteId, recetaIds, onClose, onSuccess, onError }: Props) {
  const [correos, setCorreos] = useState<string[] | null>(null);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    obtenerCorreosPaciente(pacienteId).then(res => {
      const lista = res.correos.filter(Boolean);
      setCorreos(lista);
      if (lista.length === 1) setSelectedEmail(lista[0]);
      else if (lista.length > 0) setSelectedEmail(lista[0]);
      setLoading(false);
    }).catch(() => {
      setCorreos([]);
      setLoading(false);
      onError("No se pudieron obtener los correos del paciente.");
    });
  }, [pacienteId]);

  async function handleEnviar() {
    if (!selectedEmail) return;
    setSending(true);
    try {
      const res = await enviarRecetasEmail({ pacienteId, email: selectedEmail, recetaIds });
      onSuccess(res.message);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Error al enviar el email.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-label="Enviar recetas por correo" onClick={e => e.stopPropagation()}>
        <h3>Enviar recetas por correo electrónico</h3>

        {loading ? <p style={{ textAlign: "center", padding: "1rem" }}>Cargando correos...</p>
        : correos === null || correos.length === 0 ? <>
          <p className="hc-empty">El paciente no tiene correos electrónicos registrados.</p>
          <div className="confirm-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cerrar</button>
          </div>
        </>
        : <>
          <label style={{ display: "block", marginTop: "1rem" }}>
            Correo electrónico
            <select
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
              value={selectedEmail}
              onChange={e => setSelectedEmail(e.target.value)}
            >
              {correos.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </label>

          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#666" }}>
            Se enviarán {recetaIds.length} receta(s) del día de la fecha.
          </p>

          <div className="confirm-actions" style={{ marginTop: "1.5rem" }}>
            <button type="button" className="btn-outline" onClick={onClose} disabled={sending}>Cancelar</button>
            <button type="button" onClick={handleEnviar} disabled={!selectedEmail || sending}>
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </>}
      </section>
    </div>
  );
}
