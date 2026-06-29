import { useNavigate } from "react-router-dom";

export function FacturacionPage() {
  const navigate = useNavigate();

  return (
    <section className="home-page" aria-label="Modulo Facturacion">
      <header className="home-hero">
        <h2>Facturacion</h2>
        <p>Entrada operativa al circuito HIS → outbox → CONV_FACT para episodios, prefactura y facturas.</p>
      </header>

      <section className="home-access" aria-label="Acciones del modulo Facturacion">
        <div className="home-access-title-row">
          <span aria-hidden="true" className="home-access-marker" />
          <h3>Acciones disponibles</h3>
        </div>

        <div className="home-access-grid">
          <article className="home-access-card">
            <div className="home-access-icon" aria-hidden="true">AD</div>
            <h4>Probar Admision</h4>
            <p>Admitir un paciente y verificar que el evento de facturacion se publique y quede trazable por turno.</p>
            <button type="button" className="home-access-link" onClick={() => navigate("/admision")}>IR A ADMISION <span aria-hidden="true">{"->"}</span></button>
          </article>

          <article className="home-access-card">
            <div className="home-access-icon" aria-hidden="true">EI</div>
            <h4>Estado del Modulo</h4>
            <p>Revise si CONV_FACT esta activo desde Estructura Interna antes de ejecutar pruebas o procesar episodios.</p>
            <button type="button" className="home-access-link" onClick={() => navigate("/estructura-interna")}>REVISAR ACTIVACION <span aria-hidden="true">{"->"}</span></button>
          </article>
        </div>
      </section>
    </section>
  );
}