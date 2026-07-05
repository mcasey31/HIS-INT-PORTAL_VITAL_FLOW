import { useEffect, useState, useCallback } from "react";
import type { DisplayTurneraResponse } from "./turneraTypes";
import { getDisplay } from "./turneraApi";
import { POLL_INTERVAL_MS } from "./turneraTypes";

const ESTILO_LLAMADO = "llamado-activo";
const ESTILO_SALA = "sala-espera";

export function TurneraPage() {
  const [data, setData] = useState<DisplayTurneraResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await getDisplay();
      setData(result);
      setError(null);
    } catch {
      setError("Conectando...");
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="turnera-container">
      <header className="turnera-header">
        <div className="turnera-header-left">
          <span className="turnera-logo">VitalFlow</span>
          <span className="turnera-subtitle">Centro Medico</span>
        </div>
        <div className="turnera-header-center">
          <h1>SALA DE ESPERA</h1>
        </div>
        <div className="turnera-header-right">
          <span className="turnera-reloj">{new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </header>

      {error && !data && (
        <div className="turnera-loading">
          <div className="turnera-loading-spinner" />
          <p>{error}</p>
        </div>
      )}

      {data && (
        <main className="turnera-main">
          {data.ultimoLlamado && (
            <section className={`turnera-section ${ESTILO_LLAMADO}`}>
              <div className="turnera-llamado-badge">LLAMANDO</div>
              <div className="turnera-llamado-paciente">{data.ultimoLlamado.paciente}</div>
              {data.ultimoLlamado.documento && (
                <div className="turnera-llamado-doc">{data.ultimoLlamado.documento}</div>
              )}
            </section>
          )}

          <section className={`turnera-section ${ESTILO_SALA}`}>
            <div className="turnera-sala-header">
              <h2>Pacientes en Sala de Espera</h2>
              <span className="turnera-contador">{data.salaEspera.length}</span>
            </div>

            {data.salaEspera.length === 0 ? (
              <div className="turnera-vacia">
                <p>No hay pacientes en sala de espera</p>
              </div>
            ) : (
              <table className="turnera-tabla">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Paciente</th>
                    <th>Documento</th>
                    <th>Llegada</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaEspera.map((item, idx) => (
                    <tr key={item.id} className={idx < 3 ? "turnera-proximo" : ""}>
                      <td className="turnera-pos">{idx + 1}</td>
                      <td className="turnera-nombre">{item.paciente}</td>
                      <td className="turnera-doc">{item.documento}</td>
                      <td className="turnera-hora">
                        {item.llegada ? new Date(item.llegada).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {data.enAtencion.length > 0 && (
            <section className="turnera-section en-consulta">
              <div className="turnera-sala-header">
                <h2>En Consulta</h2>
                <span className="turnera-contador">{data.enAtencion.length}</span>
              </div>
              <table className="turnera-tabla">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.enAtencion.map((item) => (
                    <tr key={item.id}>
                      <td className="turnera-nombre">{item.paciente}</td>
                      <td className="turnera-doc">{item.documento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>
      )}

      <footer className="turnera-footer">
        <p>VitalFlow HIS — {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </footer>
    </div>
  );
}
