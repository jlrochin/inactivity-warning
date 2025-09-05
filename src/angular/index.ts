// Exportar el servicio
export { InactivityTimerService } from './inactivity-timer.service'
export type { InactivityTimerOptions } from './inactivity-timer.service'

// Exportar el componente
export { InactivityWarningComponent } from './inactivity-warning.component'

// Exportar todo como default para importación completa
export default {
  InactivityTimerService: () => import('./inactivity-timer.service').then(m => m.InactivityTimerService),
  InactivityWarningComponent: () => import('./inactivity-warning.component').then(m => m.InactivityWarningComponent)
}
