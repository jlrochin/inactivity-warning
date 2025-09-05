import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable para manejar el cierre automático de sesión por inactividad
 * @param {Object} options - Opciones de configuración
 * @param {number} options.timeoutSeconds - Tiempo en segundos para cerrar sesión (default: 60 = 1 minuto)
 * @param {number} options.warningSeconds - Tiempo en segundos para mostrar advertencia (default: 20 = 20 segundos)
 * @param {Function} options.onLogout - Callback ejecutado al cerrar sesión
 * @param {Function} options.onWarning - Callback ejecutado al mostrar advertencia
 * @param {Function} options.onExtend - Callback ejecutado al extender sesión
 * @param {Array} options.resetEvents - Eventos que resetean el timer (opcional)
 * @param {boolean} options.enabled - Si el timer está habilitado (default: true)
 */
export function useInactivityTimer(options = {}) {
    const {
        timeoutSeconds = 60,
        warningSeconds = 20,
        onLogout = () => { },
        onWarning = () => { },
        onExtend = () => { },
        resetEvents = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
            'keydown'
        ],
        enabled = true
    } = options

    // Estado reactivo
    const isWarningVisible = ref(false)
    const timeRemaining = ref(0)
    const isActive = ref(false)

    // Variables internas
    let inactivityTimer = null
    let warningTimer = null
    let countdownTimer = null

    /**
     * Resetea el timer de inactividad
     */
    const resetTimer = () => {
        // Limpiar timers existentes
        clearTimeout(inactivityTimer)
        clearTimeout(warningTimer)
        clearTimeout(countdownTimer)

        // Ocultar advertencia si está visible
        isWarningVisible.value = false

        // Solo iniciar timer si está habilitado
        if (!enabled || !isActive.value) {
            return
        }

        // Configurar timer de advertencia
        const warningTimeMs = (timeoutSeconds - warningSeconds) * 1000
        warningTimer = setTimeout(() => {
            showWarning()
        }, warningTimeMs)

        // Configurar timer de cierre de sesión
        const timeoutMs = timeoutSeconds * 1000
        inactivityTimer = setTimeout(() => {
            logout()
        }, timeoutMs)
    }

    /**
     * Muestra la advertencia de inactividad
     */
    const showWarning = () => {
        isWarningVisible.value = true
        timeRemaining.value = warningSeconds

        // Ejecutar callback de advertencia
        onWarning()

        // Iniciar countdown
        countdownTimer = setInterval(() => {
            timeRemaining.value--

            if (timeRemaining.value <= 0) {
                clearInterval(countdownTimer)
                logout()
            }
        }, 1000)
    }

    /**
     * Extiende la sesión cuando el usuario confirma
     */
    const extendSession = () => {
        isWarningVisible.value = false
        clearInterval(countdownTimer)

        // Ejecutar callback de extensión
        onExtend()

        resetTimer()
    }

    /**
     * Cierra la sesión por inactividad
     */
    const logout = async () => {
        try {
            // Limpiar todos los timers
            clearTimeout(inactivityTimer)
            clearTimeout(warningTimer)
            clearInterval(countdownTimer)

            // Ocultar advertencia
            isWarningVisible.value = false

            // Ejecutar callback de logout
            await onLogout()

            console.log('Sesión cerrada por inactividad')
        } catch (error) {
            console.error('Error al cerrar sesión por inactividad:', error)
        }
    }

    /**
     * Inicia el monitoring de inactividad
     */
    const startMonitoring = () => {
        isActive.value = true

        // Agregar event listeners
        resetEvents.forEach(event => {
            document.addEventListener(event, resetTimer, true)
        })

        // Iniciar timer
        resetTimer()
    }

    /**
     * Detiene el monitoring de inactividad
     */
    const stopMonitoring = () => {
        isActive.value = false

        // Limpiar todos los timers
        clearTimeout(inactivityTimer)
        clearTimeout(warningTimer)
        clearInterval(countdownTimer)

        // Ocultar advertencia
        isWarningVisible.value = false

        // Remover event listeners
        resetEvents.forEach(event => {
            document.removeEventListener(event, resetTimer, true)
        })
    }

    /**
     * Pausa el monitoring temporalmente
     */
    const pauseMonitoring = () => {
        clearTimeout(inactivityTimer)
        clearTimeout(warningTimer)
        clearInterval(countdownTimer)
    }

    /**
     * Reanuda el monitoring
     */
    const resumeMonitoring = () => {
        if (isActive.value) {
            resetTimer()
        }
    }

    /**
     * Actualiza la configuración del timer
     */
    const updateConfig = (newOptions) => {
        Object.assign(options, newOptions)

        // Si está activo, reiniciar con nueva configuración
        if (isActive.value) {
            stopMonitoring()
            startMonitoring()
        }
    }

    /**
     * Formatea el tiempo restante en formato MM:SS
     */
    const formatTimeRemaining = () => {
        const minutes = Math.floor(timeRemaining.value / 60)
        const seconds = timeRemaining.value % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    // Limpiar al desmontar
    onUnmounted(() => {
        stopMonitoring()
    })

    return {
        // Estado
        isWarningVisible,
        timeRemaining,
        isActive,

        // Métodos
        startMonitoring,
        stopMonitoring,
        pauseMonitoring,
        resumeMonitoring,
        extendSession,
        resetTimer,
        updateConfig,
        formatTimeRemaining
    }
}
