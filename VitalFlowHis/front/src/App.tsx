import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AdmisionPage } from "./admision/AdmisionPage";
import { AgendaPage } from "./agenda/AgendaPage";
import { ChangePasswordPage } from "./auth/ChangePasswordPage";
import { LoginPage } from "./auth/LoginPage";
import { useAuth } from "./auth/AuthContext";
import { authApi } from "./auth/authApi";
import { EstructuraInternaPage } from "./abms/EstructuraInternaPage";
import { EscritorioClinicoPage } from "./escritorioClinico/EscritorioClinicoPage";
import { ConveniosPage } from "./home/ConveniosPage";
import { FacturacionPage } from "./home/FacturacionPage";
import { HomePage } from "./home/HomePage";
import { useUnsavedChanges } from "./navigation/UnsavedChangesContext";
import { PersonasPage } from "./personas/PersonasPage";
import { TurnosPage } from "./turnos/TurnosPage";
import { XdWorkspace } from "./ui/XdWorkspace";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

const APP_BUNDLE_SCRIPT_REGEX = /<script[^>]*src="([^"]*\/assets\/index-[^"]+\.js)"[^>]*><\/script>/i;

export function App() {
  const { isAuthenticated, isInitializing, logout, username, centroId, roles, mustChangePassword } = useAuth();
  const { hasUnsavedChanges, clearUnsavedChanges, confirmNavigation } = useUnsavedChanges();
  const navigate = useNavigate();
  const location = useLocation();
  const today = useMemo(() => new Date().toLocaleDateString("es-AR"), []);
  const [openHu7027Token, setOpenHu7027Token] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [buildLabel, setBuildLabel] = useState<string>("build: n/a");
  const [centroDisplayName, setCentroDisplayName] = useState<string>("Centro no seleccionado");
  const [hcaVistaActual, setHcaVistaActual] = useState<"agenda" | "panoramica">("agenda");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const script = document.querySelector<HTMLScriptElement>("script[src*='/assets/index-']");
    if (!script?.src) {
      return;
    }

    const match = script.src.match(/index-([A-Za-z0-9_-]+)\.js/);
    if (!match || !match[1]) {
      return;
    }

    setBuildLabel(`build: ${match[1].slice(0, 8)}`);
  }, []);

  useEffect(() => {
    const getCurrentBundlePath = () => {
      const bundleScript = document.querySelector<HTMLScriptElement>("script[src*='/assets/index-']");
      if (!bundleScript) {
        return null;
      }

      try {
        return new URL(bundleScript.src, window.location.origin).pathname;
      } catch {
        return bundleScript.getAttribute("src");
      }
    };

    const currentBundlePath = getCurrentBundlePath();
    if (!currentBundlePath) {
      return;
    }

    const checkForNewBuild = async () => {
      try {
        const response = await fetch(`/index.html?ts=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "cache-control": "no-cache"
          }
        });

        if (!response.ok) {
          return;
        }

        const html = await response.text();
        const match = html.match(APP_BUNDLE_SCRIPT_REGEX);
        if (!match || !match[1]) {
          return;
        }

        const nextBundlePath = match[1];
        if (nextBundlePath !== currentBundlePath && !hasUnsavedChanges) {
          window.location.reload();
        }
      } catch {
        // Swallow polling failures to avoid affecting UX when offline/transient network issues occur.
      }
    };

    const intervalId = window.setInterval(() => {
      void checkForNewBuild();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) {
      setCentroDisplayName("Centro no seleccionado");
      return () => {
        active = false;
      };
    }

    if (!centroId || centroId === "global") {
      setCentroDisplayName("Todos los centros");
      return () => {
        active = false;
      };
    }

    setCentroDisplayName(centroId);

    void (async () => {
      try {
        const centros = await authApi.getLoginCentros();
        if (!active) {
          return;
        }

        const centroActual = centros.find(centro => centro.id === centroId);
        if (centroActual) {
          setCentroDisplayName(centroActual.nombre);
        }
      } catch {
        // Keep fallback id when catalog cannot be loaded.
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated, centroId]);

  useEffect(() => {
    const onHcaVistaChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ vista?: "agenda" | "panoramica" }>;
      const vista = customEvent.detail?.vista;
      if (vista === "agenda" || vista === "panoramica") {
        setHcaVistaActual(vista);
      }
    };

    window.addEventListener("vitalflow:hca-vista", onHcaVistaChange as EventListener);
    return () => {
      window.removeEventListener("vitalflow:hca-vista", onHcaVistaChange as EventListener);
    };
  }, []);

  const isLoginRoute = location.pathname === "/login";

  if (isInitializing) {
    return (
      <main className="login-shell" aria-label="Inicializando sesion">
        <section className="login-panel">
          <header className="login-header">
            <p className="login-tag">VitalFlow HIS</p>
            <h1>Cargando sesion</h1>
            <p>Estamos verificando tu acceso.</p>
          </header>
        </section>
      </main>
    );
  }

  if (isLoginRoute) {
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (mustChangePassword) {
    return <ChangePasswordPage />;
  }

  const path = location.pathname;
  const isHome = path === "/";
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase() : "Usuario";
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

  const isAgenda = path.startsWith("/agenda");
  const isPersonas = path.startsWith("/personas");
  const isTurnos = path.startsWith("/turnos");
  const isAdmision = path.startsWith("/admision");
  const isEscritorioClinico = path.startsWith("/escritorio-clinico");
  const isConvenios = path.startsWith("/convenios");
  const isFacturacion = path.startsWith("/facturacion");
  const isEstructuraInterna = canAccessEstructuraInterna && path.startsWith("/estructura-interna");

  const breadcrumbItems: BreadcrumbItem[] = isAgenda
    ? [{ label: "Agenda", path: "/agenda" }, { label: "Agregar agenda" }]
    : isPersonas
      ? [{ label: "Persona", path: "/personas" }, { label: "Identificacion de personas" }]
      : isTurnos
        ? [{ label: "Turnos", path: "/turnos" }, { label: "Asignar turno" }]
        : isAdmision
          ? [{ label: "Admision", path: "/admision" }, { label: "Landing" }]
          : isEscritorioClinico
            ? [{ label: "Historia clinica", path: "/escritorio-clinico" }, { label: hcaVistaActual === "panoramica" ? "Panoramica" : "Agenda asistencial" }]
            : isConvenios
              ? [{ label: "Convenios", path: "/convenios" }, { label: "Seteo del modulo" }]
              : isFacturacion
                ? [{ label: "Facturacion", path: "/facturacion" }, { label: "Acciones disponibles" }]
            : isEstructuraInterna
              ? [{ label: "ABMs", path: "/estructura-interna" }, { label: "Estructura Interna" }]
              : [{ label: "Inicio", path: "/" }, { label: "Accesos directos" }];

  const breadcrumb = (
    <nav className="breadcrumb-trail" aria-label="Ruta actual">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const key = `${item.label}-${index}`;

        return (
          <span key={key} className="breadcrumb-item-wrap">
            {!isLast && item.path ? (
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => navigateWithGuard(item.path!)}
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? "breadcrumb-current" : "breadcrumb-node"}>{item.label}</span>
            )}

            {!isLast ? <span className="breadcrumb-separator" aria-hidden="true">&gt;</span> : null}
          </span>
        );
      })}
    </nav>
  );

  const title = isAgenda
    ? "Agregar agenda"
    : isPersonas
      ? "Identificacion de personas"
      : isTurnos
        ? "Asignar turno"
        : isAdmision
          ? "Admision"
          : isEscritorioClinico
            ? "Escritorio clinico"
          : isConvenios
            ? "Convenios"
            : isFacturacion
              ? "Facturacion"
        : isEstructuraInterna
          ? "Estructura Interna"
          : "Home";

  const navigateWithGuard = (targetPath: string) => {
    if (!confirmNavigation("cambiar de modulo")) {
      return;
    }

    const currentUrl = `${location.pathname}${location.search}`;
    const parsedTarget = new URL(targetPath, window.location.origin);
    const samePath = parsedTarget.pathname === location.pathname;

    if (samePath) {
      parsedTarget.searchParams.set("reset", Date.now().toString());
    }

    const finalTarget = parsedTarget.search
      ? `${parsedTarget.pathname}${parsedTarget.search}`
      : parsedTarget.pathname;

    if (finalTarget === currentUrl) {
      return;
    }

    clearUnsavedChanges();
    navigate(finalTarget);
  };

  const handleLogout = async () => {
    if (!confirmNavigation("cerrar sesion")) {
      return;
    }

    clearUnsavedChanges();
    setProfileOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <XdWorkspace
      breadcrumb={breadcrumb}
      featureLabel="VitalFlow HIS"
      buildLabel={buildLabel}
      dateLabel={today}
      title={title}
      statusLabel="Integracion API activa"
      onTitleClick={isAgenda ? () => setOpenHu7027Token((prev) => prev + 1) : undefined}
      onModulesClick={() => {
        setProfileOpen(false);
        navigateWithGuard("/");
      }}
      modulesOpen={false}
      onProfileClick={() => {
        setProfileOpen((prev) => !prev);
      }}
      profileOpen={profileOpen}
      profileName={displayName}
      profileCenterLabel={centroDisplayName}
      profileRoles={roles}
      onLogout={() => void handleLogout()}
    >
      <Routes key={`${location.pathname}${location.search}`}>
        <Route path="/" element={<HomePage />} />
        <Route path="/agenda" element={canAccessAgenda ? <AgendaPage openHu7027Token={openHu7027Token} /> : <HomePage />} />
        <Route path="/personas" element={canAccessPersonas ? <PersonasPage /> : <HomePage />} />
        <Route path="/turnos" element={canAccessTurnos ? <TurnosPage /> : <HomePage />} />
        <Route path="/admision" element={canAccessAdmision ? <AdmisionPage /> : <HomePage />} />
        <Route path="/escritorio-clinico" element={canAccessEscritorioClinico ? <EscritorioClinicoPage /> : <HomePage />} />
        <Route path="/convenios" element={canAccessConvenios ? <ConveniosPage /> : <HomePage />} />
        <Route path="/facturacion" element={canAccessFacturacion ? <FacturacionPage /> : <HomePage />} />
        <Route path="/estructura-interna" element={canAccessEstructuraInterna ? <EstructuraInternaPage /> : <HomePage />} />
      </Routes>
    </XdWorkspace>
  );
}
