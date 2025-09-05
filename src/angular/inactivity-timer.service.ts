import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

export interface InactivityTimerOptions {
  timeoutSeconds?: number
  warningSeconds?: number
  onLogout?: () => void | Promise<void>
  onWarning?: () => void
  onExtend?: () => void
  resetEvents?: string[]
  enabled?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class InactivityTimerService {
  private defaultOptions: Required<InactivityTimerOptions> = {
    timeoutSeconds: 60,
    warningSeconds: 20,
    onLogout: () => {},
    onWarning: () => {},
    onExtend: () => {},
    resetEvents: [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ],
    enabled: true
  }

  // Estado reactivo
  private isWarningVisibleSubject = new BehaviorSubject<boolean>(false)
  private timeRemainingSubject = new BehaviorSubject<number>(0)
  private isActiveSubject = new BehaviorSubject<boolean>(false)

  // Observables públicos
  public isWarningVisible$: Observable<boolean> = this.isWarningVisibleSubject.asObservable()
  public timeRemaining$: Observable<number> = this.timeRemainingSubject.asObservable()
  public isActive$: Observable<boolean> = this.isActiveSubject.asObservable()

  // Variables internas
  private options: Required<InactivityTimerOptions> = { ...this.defaultOptions }
  private inactivityTimer: any = null
  private warningTimer: any = null
  private countdownTimer: any = null

  /**
   * Resetea el timer de inactividad
   */
  private resetTimer(): void {
    // Limpiar timers existentes
    this.clearAllTimers()

    // Ocultar advertencia si está visible
    this.isWarningVisibleSubject.next(false)

    // Solo iniciar timer si está habilitado
    if (!this.options.enabled || !this.isActiveSubject.value) {
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
  private showWarning(): void {
    this.isWarningVisibleSubject.next(true)
    this.timeRemainingSubject.next(this.options.warningSeconds)

    // Ejecutar callback de advertencia
    this.options.onWarning()

    // Iniciar countdown
    this.countdownTimer = setInterval(() => {
      const currentTime = this.timeRemainingSubject.value
      if (currentTime <= 1) {
        this.clearCountdownTimer()
        this.logout()
      } else {
        this.timeRemainingSubject.next(currentTime - 1)
      }
    }, 1000)
  }

  /**
   * Extiende la sesión cuando el usuario confirma
   */
  public extendSession(): void {
    this.isWarningVisibleSubject.next(false)
    this.clearCountdownTimer()

    // Ejecutar callback de extensión
    this.options.onExtend()

    this.resetTimer()
  }

  /**
   * Cierra la sesión por inactividad
   */
  private async logout(): Promise<void> {
    try {
      // Limpiar todos los timers
      this.clearAllTimers()

      // Ocultar advertencia
      this.isWarningVisibleSubject.next(false)

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
  public startMonitoring(): void {
    this.isActiveSubject.next(true)

    // Agregar event listeners
    this.options.resetEvents.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true)
    })

    // Iniciar timer
    this.resetTimer()
  }

  /**
   * Detiene el monitoring de inactividad
   */
  public stopMonitoring(): void {
    this.isActiveSubject.next(false)

    // Limpiar todos los timers
    this.clearAllTimers()

    // Ocultar advertencia
    this.isWarningVisibleSubject.next(false)

    // Remover event listeners
    this.options.resetEvents.forEach(event => {
      document.removeEventListener(event, () => this.resetTimer(), true)
    })
  }

  /**
   * Pausa el monitoring temporalmente
   */
  public pauseMonitoring(): void {
    this.clearAllTimers()
  }

  /**
   * Reanuda el monitoring
   */
  public resumeMonitoring(): void {
    if (this.isActiveSubject.value) {
      this.resetTimer()
    }
  }

  /**
   * Actualiza la configuración del timer
   */
  public updateConfig(newOptions: Partial<InactivityTimerOptions>): void {
    this.options = { ...this.options, ...newOptions }

    // Si está activo, reiniciar con nueva configuración
    if (this.isActiveSubject.value) {
      this.stopMonitoring()
      this.startMonitoring()
    }
  }

  /**
   * Formatea el tiempo restante en formato MM:SS
   */
  public formatTimeRemaining(): string {
    const timeRemaining = this.timeRemainingSubject.value
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  /**
   * Limpia todos los timers
   */
  private clearAllTimers(): void {
    this.clearInactivityTimer()
    this.clearWarningTimer()
    this.clearCountdownTimer()
  }

  /**
   * Limpia el timer de inactividad
   */
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
      this.inactivityTimer = null
    }
  }

  /**
   * Limpia el timer de advertencia
   */
  private clearWarningTimer(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer)
      this.warningTimer = null
    }
  }

  /**
   * Limpia el timer de countdown
   */
  private clearCountdownTimer(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  }

  /**
   * Obtiene el valor actual de isWarningVisible
   */
  public get isWarningVisible(): boolean {
    return this.isWarningVisibleSubject.value
  }

  /**
   * Obtiene el valor actual de timeRemaining
   */
  public get timeRemaining(): number {
    return this.timeRemainingSubject.value
  }

  /**
   * Obtiene el valor actual de isActive
   */
  public get isActive(): boolean {
    return this.isActiveSubject.value
  }
}
