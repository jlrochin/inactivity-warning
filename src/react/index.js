// Exportar el hook
export { useInactivityTimer } from './useInactivityTimer.js'

// Exportar el componente
export { InactivityWarning, default as InactivityWarningComponent } from './InactivityWarning.jsx'

// Exportar todo como default para importación completa
export default {
    useInactivityTimer: () => import('./useInactivityTimer.js').then(m => m.useInactivityTimer),
    InactivityWarning: () => import('./InactivityWarning.jsx').then(m => m.InactivityWarning)
}
