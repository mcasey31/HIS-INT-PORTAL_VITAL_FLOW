import { useState } from "react";
import { kioscoArribo } from "./turneraApi";
import type { KioscoArriboResponse } from "./turneraTypes";
import { useSearchParams } from "react-router-dom";

export function KioscoPage() {
  const [searchParams] = useSearchParams();
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KioscoArriboResponse | null>(null);

  const centroId = searchParams.get("centroId") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = documento.trim();
    if (!doc || !centroId) {
      setResult({ ok: false, mensaje: "Documento y centroId son requeridos.", paciente: null, turnoId: null });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await kioscoArribo({ documento: doc, centroId });
      setResult(res);
    } catch {
      setResult({ ok: false, mensaje: "Error de conexion con el servidor.", paciente: null, turnoId: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kiosco-page">
      <div className="kiosco-card">
        <div className="kiosco-logo">VitalFlow</div>
        <h1 className="kiosco-titulo">Autopresentacion</h1>
        <p className="kiosco-subtitulo">Ingrese su numero de documento para confirmar su llegada</p>

        <form onSubmit={handleSubmit} className="kiosco-form">
          <div className="kiosco-input-group">
            <label htmlFor="documento">Numero de Documento</label>
            <input
              id="documento"
              type="text"
              inputMode="numeric"
              value={documento}
              onChange={(e) => {
                setDocumento(e.target.value);
                setResult(null);
              }}
              placeholder="Ej: 12345678"
              disabled={loading}
              autoFocus
            />
          </div>
          <button type="submit" className="kiosco-btn" disabled={loading || !documento.trim()}>
            {loading ? "Buscando turno..." : "Confirmar Llegada"}
          </button>
        </form>

        {result && (
          <div className={`kiosco-resultado ${result.ok ? "kiosco-exito" : "kiosco-error"}`}>
            {result.ok ? (
              <>
                <div className="kiosco-check">✓</div>
                <p className="kiosco-msg">{result.mensaje ?? "Llegada confirmada."}</p>
                {result.paciente && <p className="kiosco-paciente">Bienvenido/a, {result.paciente}</p>}
                <p className="kiosco-turno-id">Turno: {result.turnoId}</p>
              </>
            ) : (
              <>
                <div className="kiosco-x">✗</div>
                <p className="kiosco-msg">{result.mensaje ?? "No se pudo confirmar la llegada. Verifique el documento."}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
