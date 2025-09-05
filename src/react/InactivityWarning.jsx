import React from "react";
import "./InactivityWarning.css";

/**
 * Componente React para mostrar advertencia de cierre de sesión por inactividad
 */
export function InactivityWarning({
  isVisible = false,
  timeRemaining = 0,
  title = "Sesión a punto de expirar",
  message = "Su sesión se cerrará automáticamente en:",
  instruction = "Mueva el mouse, haga click o presione cualquier tecla para continuar su sesión",
  extendButtonText = "Continuar sesión",
  logoutButtonText = "Cerrar sesión",
  showButtons = false,
  theme = "default",
  overlayClass = "",
  modalClass = "",
  iconClass = "",
  countdownClass = "",
  onExtend = () => {},
  onLogout = () => {},
  children,
}) {
  // Formatear tiempo restante
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Clases dinámicas basadas en el tema
  const computedOverlayClass = [
    "react-inactivity-warning-overlay",
    `react-inactivity-warning-theme-${theme}`,
    overlayClass,
  ]
    .filter(Boolean)
    .join(" ");

  const computedModalClass = [
    "react-inactivity-warning-modal",
    `react-inactivity-warning-modal-theme-${theme}`,
    modalClass,
  ]
    .filter(Boolean)
    .join(" ");

  const computedIconClass = [
    "react-inactivity-warning-icon",
    `react-inactivity-warning-icon-theme-${theme}`,
    iconClass,
  ]
    .filter(Boolean)
    .join(" ");

  const computedCountdownClass = [
    "react-inactivity-warning-countdown-circle",
    `react-inactivity-warning-countdown-theme-${theme}`,
    countdownClass,
  ]
    .filter(Boolean)
    .join(" ");

  if (!isVisible) {
    return null;
  }

  return (
    <div className={computedOverlayClass}>
      <div className={computedModalClass}>
        {/* Header */}
        <div className="react-inactivity-warning-header">
          <div className={computedIconClass}>
            {children?.icon || (
              <svg
                className="react-inactivity-warning-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Título */}
        <h3 className="react-inactivity-warning-title">
          {children?.title || title}
        </h3>

        {/* Mensaje */}
        <p className="react-inactivity-warning-message">
          {children?.message || message}
        </p>

        {/* Countdown */}
        <div className="react-inactivity-warning-countdown">
          <div className={computedCountdownClass}>
            <span className="react-inactivity-warning-countdown-text">
              {formatTimeRemaining()}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <p className="react-inactivity-warning-instruction">
          {children?.instruction || instruction}
        </p>

        {/* Botones de acción (opcional) */}
        {showButtons && (
          <div className="react-inactivity-warning-actions">
            <button
              onClick={onExtend}
              className="react-inactivity-warning-button react-inactivity-warning-button-primary"
            >
              {extendButtonText}
            </button>
            <button
              onClick={onLogout}
              className="react-inactivity-warning-button react-inactivity-warning-button-secondary"
            >
              {logoutButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InactivityWarning;
