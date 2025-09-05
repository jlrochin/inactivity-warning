import React, { useState, useEffect } from "react";
import {
  useInactivityTimer,
  InactivityWarning,
} from "../../src/react/index.js";
import "./App.css";

function App() {
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configuración del timer
  const [config, setConfig] = useState({
    timeoutSeconds: 60,
    warningSeconds: 20,
  });

  // Tema del modal
  const [theme, setTheme] = useState("default");

  // Inicializar el timer
  const inactivityWarning = useInactivityTimer({
    ...config,
    onLogout: async () => {
      console.log("Sesión cerrada por inactividad");
      setIsAuthenticated(false);
    },
    onWarning: () => {
      console.log("Mostrando advertencia de inactividad");
    },
    onExtend: () => {
      console.log("Sesión extendida por el usuario");
    },
  });

  // Toggle de autenticación
  const toggleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  // Login
  const login = () => {
    setIsAuthenticated(true);
    inactivityWarning.startMonitoring();
    console.log("Usuario logueado - Timer iniciado");
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    inactivityWarning.stopMonitoring();
    console.log("Usuario deslogueado - Timer detenido");
  };

  // Actualizar configuración
  const updateConfig = () => {
    inactivityWarning.updateConfig(config);
    console.log("Configuración actualizada:", config);
  };

  // Probar advertencia
  const testWarning = () => {
    if (isAuthenticated) {
      // Simular advertencia inmediata
      inactivityWarning.updateConfig({
        ...config,
        timeoutSeconds: 5,
        warningSeconds: 3,
      });
      inactivityWarning.resetTimer();
    } else {
      alert("Primero inicia sesión para probar la advertencia");
    }
  };

  // Vigilar cambios en autenticación
  useEffect(() => {
    if (isAuthenticated) {
      inactivityWarning.startMonitoring();
    } else {
      inactivityWarning.stopMonitoring();
    }
  }, [isAuthenticated]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Ejemplo React Inactivity Warning</h1>
          <div className="header-actions">
            <span className="user-status">
              Usuario: {isAuthenticated ? "Logueado" : "No logueado"}
            </span>
            <button
              onClick={toggleAuth}
              className={`auth-button ${isAuthenticated ? "logout" : "login"}`}
            >
              {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="config-card">
          <h2 className="config-title">Configuración del Timer</h2>

          <div className="config-grid">
            <div className="config-field">
              <label className="config-label">Tiempo total (segundos)</label>
              <input
                value={config.timeoutSeconds}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    timeoutSeconds: parseInt(e.target.value),
                  }))
                }
                type="number"
                min="10"
                max="600"
                className="config-input"
              />
            </div>

            <div className="config-field">
              <label className="config-label">
                Tiempo de advertencia (segundos)
              </label>
              <input
                value={config.warningSeconds}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    warningSeconds: parseInt(e.target.value),
                  }))
                }
                type="number"
                min="5"
                max={config.timeoutSeconds - 5}
                className="config-input"
              />
            </div>
          </div>

          <div className="config-field">
            <label className="config-label">Tema</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="config-select"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="config-actions">
            <button onClick={updateConfig} className="action-button primary">
              Actualizar Configuración
            </button>

            <button onClick={testWarning} className="action-button warning">
              Probar Advertencia
            </button>
          </div>

          {/* Estado del Timer */}
          <div className="timer-status">
            <h3 className="status-title">Estado del Timer</h3>
            <div className="status-info">
              <p>Activo: {inactivityWarning.isActive ? "Sí" : "No"}</p>
              <p>
                Advertencia visible:{" "}
                {inactivityWarning.isWarningVisible ? "Sí" : "No"}
              </p>
              {inactivityWarning.isWarningVisible && (
                <p>
                  Tiempo restante: {inactivityWarning.formatTimeRemaining()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="instructions">
          <h3 className="instructions-title">Instrucciones</h3>
          <ul className="instructions-list">
            <li>• Inicia sesión para activar el timer de inactividad</li>
            <li>• Configura los tiempos según tus necesidades</li>
            <li>• Mueve el mouse o haz clic para resetear el timer</li>
            <li>
              • Cuando aparezca la advertencia, haz clic para extender la sesión
            </li>
          </ul>
        </div>
      </main>

      {/* Modal de Advertencia */}
      <InactivityWarning
        isVisible={inactivityWarning.isWarningVisible}
        timeRemaining={inactivityWarning.timeRemaining}
        theme={theme}
        showButtons={true}
        onExtend={inactivityWarning.extendSession}
        onLogout={logout}
      />
    </div>
  );
}

export default App;
