import { FormEvent, useState } from "react";
import { ApiError } from "../shared/apiError";
import { useAuth } from "./AuthContext";

export function ChangePasswordPage() {
  const { changePassword, username } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("La confirmacion de contrasena no coincide.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message || "No se pudo actualizar la contrasena.");
      } else {
        setErrorMessage("No se pudo actualizar la contrasena.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-shell" aria-label="Cambio obligatorio de contrasena">
      <section className="login-panel">
        <header className="login-header">
          <p className="login-tag">VitalFlow HIS</p>
          <h1>Cambiar contrasena</h1>
          <p>
            {username ? `${username}, ` : ""}debes cambiar tu contrasena temporal para continuar.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Contrasena actual
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </label>

          <label>
            Nueva contrasena
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </label>

          <label>
            Confirmar nueva contrasena
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </label>

          {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Actualizar contrasena"}
          </button>
        </form>
      </section>
    </main>
  );
}
