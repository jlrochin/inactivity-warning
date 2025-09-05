// Exportar las clases
export { InactivityTimer } from './inactivity-timer.js'
export { InactivityWarning } from './inactivity-warning.js'

// Exportar todo como default para importación completa
export default {
    InactivityTimer: () => import('./inactivity-timer.js').then(m => m.InactivityTimer),
    InactivityWarning: () => import('./inactivity-warning.js').then(m => m.InactivityWarning)
}
