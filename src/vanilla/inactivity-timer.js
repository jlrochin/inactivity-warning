/**
 * Clase para manejar el cierre automático de sesión por inactividad en Vanilla JavaScript
 */
export class InactivityTimer {
    constructor(options = {}) {
        this.options = {
            timeoutSeconds: 60,
            warningSeconds: 20,
            onLogout: () => { },
            onWarning: () => { },
            onExtend: () => { },
            resetEvents: [
                'mousedown',
                'mousemove',
                'keypress',
                'scroll',
                'touchstart',
                'click',
                'keydown'
            ],
            enabled: true,
            ...options
        }

        // Estado
        this.isWarningVisible = false
        this.timeRemaining = 0
        this.isActive = false

        // Timers
        this.inactivityTimer = null
        this.warningTimer = null
        this.countdownTimer = null

        // Callbacks para notificar cambios
        this.onStateChange = null

        // Bind methods
        this.resetTimer = this.resetTimer.bind(this)
    }

    /**
     * Resetea el timer de inactividad
     */
    resetTimer() {
        // Limpiar timers existentes
        this.clearAllTimers()

        // Ocultar advertencia si está visible
        this.setWarningVisible(false)

        // Solo iniciar timer si está habilitado
        if (!this.options.enabled || !this.isActive) {
            return
        }

        // Configurar timer de advertencia
        const warningTimeMs = (this.options.timeoutSeconds - this.options.warningSeconds) * 1000
        this.warningTimer = setTimeout(() => {
            this.showWarning()
        }, warningTimeMs)

        // Configurar timer de cierre de sesión
        const timeoutMs = this.options.timeoutSeconds * 1000
        this.inactivityTimer = setTimeout(() => {
            this.logout()
        }, timeoutMs)
    }

    /**
     * Muestra la advertencia de inactividad
     */
    showWarning() {
        this.setWarningVisible(true)
        this.setTimeRemaining(this.options.warningSeconds)

        // Ejecutar callback de advertencia
        this.options.onWarning()

        // Iniciar countdown
        this.countdownTimer = setInterval(() => {
            if (this.timeRemaining <= 1) {
                this.clearCountdownTimer()
                this.logout()
            } else {
                this.setTimeRemaining(this.timeRemaining - 1)
            }
        }, 1000)
    }

    /**
     * Extiende la sesión cuando el usuario confirma
     */
    extendSession() {
        this.setWarningVisible(false)
        this.clearCountdownTimer()

        // Ejecutar callback de extensión
        this.options.onExtend()

        this.resetTimer()
    }

    /**
     * Cierra la sesión por inactividad
     */
    async logout() {
        try {
            // Limpiar todos los timers
            this.clearAllTimers()

            // Ocultar advertencia
            this.setWarningVisible(false)

            // Ejecutar callback de logout
            await this.options.onLogout()

            console.log('Sesión cerrada por inactividad')
        } catch (error) {
            console.error('Error al cerrar sesión por inactividad:', error)
        }
    }

    /**
     * Inicia el monitoring de inactividad
     */
    startMonitoring() {
        this.setActive(true)

        // Agregar event listeners
        this.options.resetEvents.forEach(event => {
            document.addEventListener(event, this.resetTimer, true)
        })

        // Iniciar timer
        this.resetTimer()
    }

    /**
     * Detiene el monitoring de inactividad
     */
    stopMonitoring() {
        this.setActive(false)

        // Limpiar todos los timers
        this.clearAllTimers()

        // Ocultar advertencia
        this.setWarningVisible(false)

        // Remover event listeners
        this.options.resetEvents.forEach(event => {
            document.removeEventListener(event, this.resetTimer, true)
        })
    }

    /**
     * Pausa el monitoring temporalmente
     */
    pauseMonitoring() {
        this.clearAllTimers()
    }

    /**
     * Reanuda el monitoring
     */
    resumeMonitoring() {
        if (this.isActive) {
            this.resetTimer()
        }
    }

    /**
     * Actualiza la configuración del timer
     */
    updateConfig(newOptions) {
        this.options = { ...this.options, ...newOptions }

        // Si está activo, reiniciar con nueva configuración
        if (this.isActive) {
            this.stopMonitoring()
            this.startMonitoring()
        }
    }

    /**
     * Formatea el tiempo restante en formato MM:SS
     */
    formatTimeRemaining() {
        const minutes = Math.floor(this.timeRemaining / 60)
        const seconds = this.timeRemaining % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    /**
     * Establece el estado de visibilidad de la advertencia
     */
    setWarningVisible(visible) {
        this.isWarningVisible = visible
        this.notifyStateChange()
    }

    /**
     * Establece el tiempo restante
     */
    setTimeRemaining(time) {
        this.timeRemaining = time
        this.notifyStateChange()
    }

    /**
     * Establece el estado activo
     */
    setActive(active) {
        this.isActive = active
        this.notifyStateChange()
    }

    /**
     * Notifica cambios de estado
     */
    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange({
                isWarningVisible: this.isWarningVisible,
                timeRemaining: this.timeRemaining,
                isActive: this.isActive
            })
        }
    }

    /**
     * Limpia todos los timers
     */
    clearAllTimers() {
        this.clearInactivityTimer()
        this.clearWarningTimer()
        this.clearCountdownTimer()
    }

    /**
     * Limpia el timer de inactividad
     */
    clearInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer)
            this.inactivityTimer = null
        }
    }

    /**
     * Limpia el timer de advertencia
     */
    clearWarningTimer() {
        if (this.warningTimer) {
            clearTimeout(this.warningTimer)
            this.warningTimer = null
        }
    }

    /**
     * Limpia el timer de countdown
     */
    clearCountdownTimer() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer)
            this.countdownTimer = null
        }
    }

    /**
     * Destruye la instancia y limpia recursos
     */
    destroy() {
        this.stopMonitoring()
        this.onStateChange = null
    }
}
