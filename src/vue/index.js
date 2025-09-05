// Vue 3 - Composable y componente
export { useInactivityTimer } from '../composables/useInactivityTimer.js'
export { default as InactivityWarning } from '../components/InactivityWarning.vue'

// Exportar todo como default para importación completa
export default {
    useInactivityTimer: () => import('../composables/useInactivityTimer.js').then(m => m.useInactivityTimer),
    InactivityWarning: () => import('../components/InactivityWarning.vue')
}
