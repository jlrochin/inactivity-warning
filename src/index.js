// Vue 3 - Composable y componente
export { useInactivityTimer } from './composables/useInactivityTimer.js'
export { default as InactivityWarning } from './components/InactivityWarning.vue'

// React - Hook y componente
export { useInactivityTimer as useInactivityTimerReact } from './react/useInactivityTimer.js'
export { InactivityWarning as InactivityWarningReact } from './react/InactivityWarning.jsx'

// Angular - Servicio y componente
export { InactivityTimerService } from './angular/inactivity-timer.service.ts'
export { InactivityWarningComponent } from './angular/inactivity-warning.component.ts'

// Vanilla JavaScript - Clases
export { InactivityTimer } from './vanilla/inactivity-timer.js'
export { InactivityWarning as InactivityWarningVanilla } from './vanilla/inactivity-warning.js'

// Exportar todo como default para importación completa
export default {
    // Vue 3
    useInactivityTimer: () => import('./composables/useInactivityTimer.js').then(m => m.useInactivityTimer),
    InactivityWarning: () => import('./components/InactivityWarning.vue'),

    // React
    useInactivityTimerReact: () => import('./react/useInactivityTimer.js').then(m => m.useInactivityTimer),
    InactivityWarningReact: () => import('./react/InactivityWarning.jsx').then(m => m.InactivityWarning),

    // Angular
    InactivityTimerService: () => import('./angular/inactivity-timer.service.ts').then(m => m.InactivityTimerService),
    InactivityWarningComponent: () => import('./angular/inactivity-warning.component.ts').then(m => m.InactivityWarningComponent),

    // Vanilla JavaScript
    InactivityTimer: () => import('./vanilla/inactivity-timer.js').then(m => m.InactivityTimer),
    InactivityWarningVanilla: () => import('./vanilla/inactivity-warning.js').then(m => m.InactivityWarning)
}
