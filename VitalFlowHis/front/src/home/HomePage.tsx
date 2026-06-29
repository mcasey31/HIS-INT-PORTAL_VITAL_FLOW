import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type HomeAccessCard = {
  key: string;
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
};

export function HomePage() {
  const navigate = useNavigate();
  const conveniosLandingUrl = "http://localhost:8080/convenios/referencias";
  const facturacionLandingUrl = "http://localhost:8080/facturacion/final";
  const { username, roles } = useAuth();
  const [now, setNow] = useState(() => new Date());
  const hasRole = (name: string) => roles.some((role) => role.toLowerCase() === name.toLowerCase());
  const canAccessPersonas =
    hasRole("Administrador")
    || hasRole("Enrolamiento Persona")
    || hasRole("Administrador Seguridad");
  const canAccessAgenda =
    hasRole("Administrador")
    || hasRole("Administrativo")
    || hasRole("Cajero")
    || hasRole("Auditor");
  const canAccessTurnos =
    hasRole("Administrador")
    || hasRole("Administrativo")
    || hasRole("Cajero")
    || hasRole("Auditor");
  const canAccessAdmision =
    hasRole("Administrador")
    || hasRole("Administrativo")
    || hasRole("Cajero")
    || hasRole("Auditor");
  const canAccessEscritorioClinico = hasRole("Administrador") || hasRole("Medico") || hasRole("Auditor");
  const canAccessEstructuraInterna = hasRole("Administrador") || hasRole("Administrador Seguridad");
  const canAccessConvenios = canAccessEstructuraInterna;
  const canAccessFacturacion =
    hasRole("Administrador")
    || hasRole("Administrativo")
    || hasRole("Cajero")
    || hasRole("Auditor")
    || hasRole("Medico");

  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
    : "Usuario";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const dateLabel = useMemo(() => {
    const weekday = now.toLocaleDateString("es-AR", { weekday: "long" });
    const day = now.toLocaleDateString("es-AR", { day: "numeric" });
    const month = now.toLocaleDateString("es-AR", { month: "long" });
    const year = now.toLocaleDateString("es-AR", { year: "numeric" });
    const time = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    const normalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${normalizedWeekday} ${day} de ${month} de ${year} - ${time} hs`;
  }, [now]);

  const cards: HomeAccessCard[] = [
    {
      key: "personas",
      title: "Personas",
      description: "Identificacion y empadronamiento de personas.",
      icon: "PR",
      onClick: () => navigate("/personas")
    },
    {
      key: "agendas",
      title: "Gestion de agendas",
      description: "Administracion integral de agendas medicas.",
      icon: "AG",
      onClick: () => navigate("/agenda")
    },
    {
      key: "turnos",
      title: "Turnos",
      description: "Operacion de turnos y seguimiento operativo.",
      icon: "TU",
      onClick: () => navigate("/turnos")
    },
    {
      key: "admision",
      title: "Admision",
      description: "Landing de admision programada y confirmacion de arribo.",
      icon: "AD",
      onClick: () => navigate("/admision")
    },
    {
      key: "escritorio-clinico",
      title: "Escritorio clinico",
      description: "Vista clinica para atencion y seguimiento.",
      icon: "EC",
      onClick: () => navigate("/escritorio-clinico")
    },
    {
      key: "convenios",
      title: "Convenios",
      description: "Configuracion funcional de financiadores y planes para CONV_FACT.",
      icon: "CV",
      onClick: () => window.location.assign(conveniosLandingUrl)
    },
    {
      key: "facturacion",
      title: "Facturacion",
      description: "Ingreso operativo al circuito de facturacion HIS y trazabilidad de eventos.",
      icon: "FC",
      onClick: () => window.location.assign(facturacionLandingUrl)
    },
    {
      key: "estructura-interna",
      title: "Estructura Interna",
      description: "ABMs de estructura jerarquica y personal por DER.",
      icon: "EI",
      onClick: () => navigate("/estructura-interna")
    }
  ].filter((card) => {
    switch (card.key) {
      case "personas":
        return canAccessPersonas;
      case "agendas":
        return canAccessAgenda;
      case "turnos":
        return canAccessTurnos;
      case "admision":
        return canAccessAdmision;
      case "escritorio-clinico":
        return canAccessEscritorioClinico;
      case "convenios":
        return canAccessConvenios;
      case "facturacion":
        return canAccessFacturacion;
      case "estructura-interna":
        return canAccessEstructuraInterna;
      default:
        return false;
    }
  });

  return (
    <section className="home-page" aria-label="Home de accesos directos">
      <header className="home-hero">
        <h2>Te damos la bienvenida nuevamente, {displayName}!</h2>
        <p>{dateLabel}</p>
      </header>

      <section className="home-access" aria-label="Accesos directos">
        <div className="home-access-title-row">
          <span aria-hidden="true" className="home-access-marker" />
          <h3>Accesos directos</h3>
        </div>

        <div className="home-access-grid">
          {cards.map((card) => (
            <article key={card.key} className="home-access-card">
              <div className="home-access-icon" aria-hidden="true">
                {card.icon}
              </div>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              <button
                type="button"
                className="home-access-link"
                onClick={card.onClick}
                disabled={!card.onClick}
                aria-disabled={!card.onClick}
              >
                INGRESAR <span aria-hidden="true">{"->"}</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
