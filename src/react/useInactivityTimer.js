import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook personalizado para manejar el cierre automático de sesión por inactividad en React
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

    // Estado
    const [isWarningVisible, setIsWarningVisible] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isActive, setIsActive] = useState(false)

    // Referencias para los timers
    const inactivityTimerRef = useRef(null)
    const warningTimerRef = useRef(null)
    const countdownTimerRef = useRef(null)

    /**
     * Resetea el timer de inactividad
     */
    const resetTimer = useCallback(() => {
        // Limpiar timers existentes
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current)
            inactivityTimerRef.current = null
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current)
            warningTimerRef.current = null
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
        }

        // Ocultar advertencia si está visible
        setIsWarningVisible(false)

        // Solo iniciar timer si está habilitado
        if (!enabled || !isActive) {
            return
        }

        // Configurar timer de advertencia
        const warningTimeMs = (timeoutSeconds - warningSeconds) * 1000
        warningTimerRef.current = setTimeout(() => {
            showWarning()
        }, warningTimeMs)

        // Configurar timer de cierre de sesión
        const timeoutMs = timeoutSeconds * 1000
        inactivityTimerRef.current = setTimeout(() => {
            logout()
        }, timeoutMs)
    }, [enabled, isActive, timeoutSeconds, warningSeconds])

    /**
     * Muestra la advertencia de inactividad
     */
    const showWarning = useCallback(() => {
        setIsWarningVisible(true)
        setTimeRemaining(warningSeconds)

        // Ejecutar callback de advertencia
        onWarning()

        // Iniciar countdown
        countdownTimerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(countdownTimerRef.current)
                    logout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [warningSeconds, onWarning])

    /**
     * Extiende la sesión cuando el usuario confirma
     */
    const extendSession = useCallback(() => {
        setIsWarningVisible(false)
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
        }

        // Ejecutar callback de extensión
        onExtend()

        resetTimer()
    }, [onExtend, resetTimer])

    /**
     * Cierra la sesión por inactividad
     */
    const logout = useCallback(async () => {
        try {
            // Limpiar todos los timers
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current)
                inactivityTimerRef.current = null
            }
            if (warningTimerRef.current) {
                clearTimeout(warningTimerRef.current)
                warningTimerRef.current = null
            }
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current)
                countdownTimerRef.current = null
            }

            // Ocultar advertencia
            setIsWarningVisible(false)

            // Ejecutar callback de logout
            await onLogout()

            console.log('Sesión cerrada por inactividad')
        } catch (error) {
            console.error('Error al cerrar sesión por inactividad:', error)
        }
    }, [onLogout])

    /**
     * Inicia el monitoring de inactividad
     */
    const startMonitoring = useCallback(() => {
        setIsActive(true)
    }, [])

    /**
     * Detiene el monitoring de inactividad
     */
    const stopMonitoring = useCallback(() => {
        setIsActive(false)

        // Limpiar todos los timers
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current)
            inactivityTimerRef.current = null
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current)
            warningTimerRef.current = null
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
        }

        // Ocultar advertencia
        setIsWarningVisible(false)
    }, [])

    /**
     * Pausa el monitoring temporalmente
     */
    const pauseMonitoring = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current)
            inactivityTimerRef.current = null
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current)
            warningTimerRef.current = null
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
        }
    }, [])

    /**
     * Reanuda el monitoring
     */
    const resumeMonitoring = useCallback(() => {
        if (isActive) {
            resetTimer()
        }
    }, [isActive, resetTimer])

    /**
     * Formatea el tiempo restante en formato MM:SS
     */
    const formatTimeRemaining = useCallback(() => {
        const minutes = Math.floor(timeRemaining / 60)
        const seconds = timeRemaining % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }, [timeRemaining])

    // Efecto para manejar los event listeners
    useEffect(() => {
        if (!isActive) return

        // Agregar event listeners
        resetEvents.forEach(event => {
            document.addEventListener(event, resetTimer, true)
        })

        // Iniciar timer
        resetTimer()

        // Cleanup
        return () => {
            resetEvents.forEach(event => {
                document.removeEventListener(event, resetTimer, true)
            })
        }
    }, [isActive, resetEvents, resetTimer])

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            stopMonitoring()
        }
    }, [stopMonitoring])

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
        formatTimeRemaining
    }
}
