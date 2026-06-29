import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, type LoginCentroOption } from "../auth/authApi";

export function ConveniosPage() {
  const navigate = useNavigate();
  const [centros, setCentros] = useState<LoginCentroOption[]>([]);
  const [isLoadingCentros, setIsLoadingCentros] = useState(true);
  const [centrosError, setCentrosError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const centrosResponse = await authApi.getLoginCentros();
        if (!active) {
          return;
        }

        setCentros(centrosResponse);
        setCentrosError(null);
      } catch {
        if (active) {
          setCentrosError("No se pudieron cargar los centros del convenio.");
        }
      } finally {
        if (active) {
          setIsLoadingCentros(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="home-page" aria-label="Modulo Convenios">
      <header className="home-hero">
        <h2>Convenios</h2>
        <p>Configuracion funcional del modulo CONV_FACT dentro del HIS.</p>
      </header>

      <section className="home-access" aria-label="Acciones del modulo Convenios">
        <div className="home-access-title-row">
          <span aria-hidden="true" className="home-access-marker" />
          <h3>Seteo del modulo</h3>
        </div>

        <div className="home-access-grid">
          <article className="home-access-card">
            <div className="home-access-icon" aria-hidden="true">CF</div>
            <h4>Activacion</h4>
            <p>Active o desactive el modulo CONV_FACT desde Estructura Interna para que el HIS publique eventos de admision al outbox.</p>
            <button type="button" className="home-access-link" onClick={() => navigate("/estructura-interna")}>IR A ESTRUCTURA INTERNA <span aria-hidden="true">{"->"}</span></button>
          </article>

          <article className="home-access-card">
            <div className="home-access-icon" aria-hidden="true">FP</div>
            <h4>Financiadores y Planes</h4>
            <p>Configure las asociaciones Centro | Financiador | Plan para que la admision nazca correctamente vinculada al convenio.</p>
            <button type="button" className="home-access-link" onClick={() => navigate("/estructura-interna")}>CONFIGURAR ASOCIACIONES <span aria-hidden="true">{"->"}</span></button>
          </article>
        </div>

        <article className="home-access-card" aria-label="Centros disponibles para convenio">
          <div className="home-access-title-row">
            <span aria-hidden="true" className="home-access-marker" />
            <h3>Centros disponibles</h3>
          </div>

          {isLoadingCentros ? (
            <p>Cargando centros...</p>
          ) : centrosError ? (
            <p>{centrosError}</p>
          ) : centros.length > 0 ? (
            <ul>
              {centros.map((centro) => (
                <li key={centro.id}>{centro.nombre}</li>
              ))}
            </ul>
          ) : (
            <p>No hay centros disponibles.</p>
          )}
        </article>
      </section>
    </section>
  );
}