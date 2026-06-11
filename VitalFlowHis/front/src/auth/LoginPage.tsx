import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../shared/apiError";
import { useAuth } from "./AuthContext";
import { authApi, type LoginCentroOption } from "./authApi";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [centros, setCentros] = useState<LoginCentroOption[]>([]);
  const [centroId, setCentroId] = useState("");
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
        if (centrosResponse.length === 1) {
          setCentroId(centrosResponse[0].id);
        }
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
      await login(username.trim(), password, centroId || undefined);
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

          <label>
            Centro
            <select
              value={centroId}
              onChange={(event) => setCentroId(event.target.value)}
              disabled={isSubmitting || isLoadingCentros}
            >
              <option value="">Sin seleccionar (solo administrador)</option>
              {centros.map((centro) => (
                <option key={centro.id} value={centro.id}>
                  {centro.nombre}
                </option>
              ))}
            </select>
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
