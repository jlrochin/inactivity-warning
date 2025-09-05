import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InactivityTimerService } from './inactivity-timer.service'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-inactivity-warning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isWarningVisible$ | async" 
      class="angular-inactivity-warning-overlay"
      [class]="overlayClass"
    >
      <div class="angular-inactivity-warning-modal" [class]="modalClass">
        <!-- Header -->
        <div class="angular-inactivity-warning-header">
          <div class="angular-inactivity-warning-icon" [class]="iconClass">
            <ng-content select="[slot=icon]">
              <svg class="angular-inactivity-warning-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </ng-content>
          </div>
        </div>
        
        <!-- Título -->
        <h3 class="angular-inactivity-warning-title">
          <ng-content select="[slot=title]">{{ title }}</ng-content>
        </h3>
        
        <!-- Mensaje -->
        <p class="angular-inactivity-warning-message">
          <ng-content select="[slot=message]">{{ message }}</ng-content>
        </p>
        
        <!-- Countdown -->
        <div class="angular-inactivity-warning-countdown">
          <div class="angular-inactivity-warning-countdown-circle" [class]="countdownClass">
            <span class="angular-inactivity-warning-countdown-text">
              {{ formatTimeRemaining() }}
            </span>
          </div>
        </div>
        
        <!-- Información adicional -->
        <p class="angular-inactivity-warning-instruction">
          <ng-content select="[slot=instruction]">{{ instruction }}</ng-content>
        </p>

        <!-- Botones de acción (opcional) -->
        <div *ngIf="showButtons" class="angular-inactivity-warning-actions">
          <button 
            (click)="onExtendSession()" 
            class="angular-inactivity-warning-button angular-inactivity-warning-button-primary"
          >
            {{ extendButtonText }}
          </button>
          <button 
            (click)="onLogoutNow()" 
            class="angular-inactivity-warning-button angular-inactivity-warning-button-secondary"
          >
            {{ logoutButtonText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./inactivity-warning.component.css']
})
export class InactivityWarningComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Sesión a punto de expirar'
  @Input() message: string = 'Su sesión se cerrará automáticamente en:'
  @Input() instruction: string = 'Mueva el mouse, haga click o presione cualquier tecla para continuar su sesión'
  @Input() extendButtonText: string = 'Continuar sesión'
  @Input() logoutButtonText: string = 'Cerrar sesión'
  @Input() showButtons: boolean = false
  @Input() theme: string = 'default'
  @Input() overlayClass: string = ''
  @Input() modalClass: string = ''
  @Input() iconClass: string = ''
  @Input() countdownClass: string = ''

  @Output() extend = new EventEmitter<void>()
  @Output() logout = new EventEmitter<void>()

  // Observables del servicio
  isWarningVisible$: Observable<boolean>
  timeRemaining$: Observable<number>
  isActive$: Observable<boolean>

  // Suscripciones
  private subscriptions: Subscription[] = []

  // Estado local
  timeRemaining: number = 0

  constructor(private inactivityTimerService: InactivityTimerService) {
    this.isWarningVisible$ = this.inactivityTimerService.isWarningVisible$
    this.timeRemaining$ = this.inactivityTimerService.timeRemaining$
    this.isActive$ = this.inactivityTimerService.isActive$
  }

  ngOnInit(): void {
    // Suscribirse a los cambios de timeRemaining para formatear
    const timeRemainingSub = this.timeRemaining$.subscribe(time => {
      this.timeRemaining = time
    })
    this.subscriptions.push(timeRemainingSub)
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  /**
   * Formatea el tiempo restante en formato MM:SS
   */
  formatTimeRemaining(): string {
    const minutes = Math.floor(this.timeRemaining / 60)
    const seconds = this.timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  /**
   * Maneja la extensión de sesión
   */
  onExtendSession(): void {
    this.inactivityTimerService.extendSession()
    this.extend.emit()
  }

  /**
   * Maneja el cierre de sesión inmediato
   */
  onLogoutNow(): void {
    this.inactivityTimerService.stopMonitoring()
    this.logout.emit()
  }
}
