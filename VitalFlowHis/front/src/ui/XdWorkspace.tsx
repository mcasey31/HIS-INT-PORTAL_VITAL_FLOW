import { ReactNode } from "react";

type XdWorkspaceProps = {
  breadcrumb: ReactNode;
  featureLabel: string;
  buildLabel?: string;
  dateLabel: string;
  title: string;
  statusLabel?: string;
  onTitleClick?: () => void;
  onModulesClick?: () => void;
  modulesOpen?: boolean;
  onProfileClick?: () => void;
  profileOpen?: boolean;
  profileName?: string | null;
  profileCenterLabel?: string | null;
  profileRoles?: string[] | null;
  onLogout: () => void;
  children: ReactNode;
};

export function XdWorkspace({
  breadcrumb,
  featureLabel,
  buildLabel,
  dateLabel,
  title,
  statusLabel,
  onTitleClick,
  onModulesClick,
  modulesOpen,
  onProfileClick,
  profileOpen,
  profileName,
  profileCenterLabel,
  profileRoles,
  onLogout,
  children,
}: XdWorkspaceProps) {
  const safeProfileName = profileName?.trim() || "Usuario";
  const safeProfileCenterLabel = profileCenterLabel?.trim() || "Centro no seleccionado";
  const safeProfileRoles = Array.isArray(profileRoles) ? profileRoles.filter(Boolean) : [];
  const profileInitial = safeProfileName.charAt(0).toUpperCase() || "U";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button
            type="button"
            className={`icon-grid ${modulesOpen ? "is-active" : ""}`}
            aria-label="Ir a Home"
            aria-expanded={modulesOpen}
            onClick={onModulesClick}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
          <p className="breadcrumb">{breadcrumb}</p>
        </div>
        <div className="topbar-right">
          <span>{featureLabel}</span>
          {buildLabel ? <span className="build-tag" aria-label="Version de interfaz">{buildLabel}</span> : null}
          <span>{dateLabel}</span>
          <span className="profile-center-chip" aria-label="Centro activo">Centro: {safeProfileCenterLabel}</span>
          <div className="profile-menu-wrap">
            <button type="button" className={`profile-button ${profileOpen ? "is-open" : ""}`} onClick={onProfileClick}>
              <span className="profile-avatar" aria-hidden="true">{profileInitial}</span>
              <span className="profile-name">{safeProfileName}</span>
            </button>

            {profileOpen ? (
              <div className="profile-menu" role="menu" aria-label="Perfil de usuario">
                <p className="profile-menu-name">{safeProfileName}</p>
                <p className="profile-menu-roles">{safeProfileRoles.length > 0 ? safeProfileRoles.join(" · ") : "Sin roles visibles"}</p>
                <button type="button" className="profile-menu-logout" onClick={onLogout}>
                  Cerrar sesion
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="workspace workspace-flat">
        <div className="canvas-area">
          <div className="canvas-wide">
            <section className="toolbar" aria-label="Selector de vista">
              {onTitleClick ? (
                <button type="button" className="toolbar-title-btn" onClick={onTitleClick}>
                  {title}
                </button>
              ) : (
                <h1>{title}</h1>
              )}
              {statusLabel ? <div className="status-pill">{statusLabel}</div> : null}
            </section>

            <section className="agenda-surface">{children}</section>
          </div>
        </div>
      </section>
    </main>
  );
}
