import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login.css";
import { ApiError } from "../shared/apiError";
import { useAuth } from "./AuthContext";
import { authApi, type LoginCentroOption } from "./authApi";

type LoginStep = "credentials" | "select-centro";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [centros, setCentros] = useState<LoginCentroOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCentros, setIsLoadingCentros] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const centrosResponse = await authApi.getLoginCentros();
        if (!active) {
          return;
        }
        setCentros(centrosResponse);
      } catch {
        if (active) {
          setErrorMessage("No se pudieron cargar los centros para iniciar sesion.");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Usuario y contrasena son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 && centros.length > 0) {
          setStep("select-centro");
          setErrorMessage(null);
          return;
        }
        setErrorMessage(error.message || "No se pudo iniciar sesion.");
      } else {
        setErrorMessage("No se pudo iniciar sesion.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCentroSelect(centroId: string) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password, centroId);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message || "No se pudo iniciar sesion.");
      } else {
        setErrorMessage("No se pudo iniciar sesion.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "select-centro") {
    return (
      <main className="login-shell" aria-label="Seleccion de centro">
        <section className="login-panel">
          <header className="login-header">
            <p className="login-tag">VitalFlow HIS</p>
            <h1>Seleccionar centro</h1>
            <p>
              El usuario <strong>{username}</strong> tiene acceso a multiples centros.
              Seleccione uno para continuar.
            </p>
          </header>

          <div className="centro-list">
            {centros.length === 0 && !isLoadingCentros && (
              <p className="login-error">No hay centros disponibles.</p>
            )}
            {isLoadingCentros && <p>Cargando centros...</p>}
            {centros.map((centro) => (
              <button
                key={centro.id}
                type="button"
                className="centro-button"
                disabled={isSubmitting}
                onClick={() => handleCentroSelect(centro.id)}
              >
                {centro.nombre}
              </button>
            ))}
          </div>

          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

          <button
            type="button"
            className="centro-back"
            disabled={isSubmitting}
            onClick={() => {
              setStep("credentials");
              setErrorMessage(null);
            }}
          >
            Volver
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="login-shell" aria-label="Pantalla de inicio de sesion">
      <section className="login-panel">
        <header className="login-header">
          <p className="login-tag">VitalFlow HIS</p>
          <h1>Iniciar sesion</h1>
          <p>Accede con tus credenciales del sistema para continuar.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </label>

          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting || isLoadingCentros}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
