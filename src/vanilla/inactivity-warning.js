/**
 * Clase para crear el modal de advertencia de inactividad en Vanilla JavaScript
 */
export class InactivityWarning {
    constructor(options = {}) {
        this.options = {
            title: 'Sesión a punto de expirar',
            message: 'Su sesión se cerrará automáticamente en:',
            instruction: 'Mueva el mouse, haga click o presione cualquier tecla para continuar su sesión',
            extendButtonText: 'Continuar sesión',
            logoutButtonText: 'Cerrar sesión',
            showButtons: false,
            theme: 'default',
            overlayClass: '',
            modalClass: '',
            iconClass: '',
            countdownClass: '',
            onExtend: () => { },
            onLogout: () => { },
            ...options
        }

        this.element = null
        this.isVisible = false
    }

    /**
     * Crea el elemento HTML del modal
     */
    createElement() {
        const overlay = document.createElement('div')
        overlay.className = this.getOverlayClass()

        const modal = document.createElement('div')
        modal.className = this.getModalClass()

        modal.innerHTML = `
      <!-- Header -->
      <div class="vanilla-inactivity-warning-header">
        <div class="vanilla-inactivity-warning-icon ${this.options.iconClass}">
          <svg class="vanilla-inactivity-warning-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Título -->
      <h3 class="vanilla-inactivity-warning-title">
        ${this.options.title}
      </h3>
      
      <!-- Mensaje -->
      <p class="vanilla-inactivity-warning-message">
        ${this.options.message}
      </p>
      
      <!-- Countdown -->
      <div class="vanilla-inactivity-warning-countdown">
        <div class="vanilla-inactivity-warning-countdown-circle ${this.options.countdownClass}">
          <span class="vanilla-inactivity-warning-countdown-text">
            <span class="time-display">0:00</span>
          </span>
        </div>
      </div>
      
      <!-- Información adicional -->
      <p class="vanilla-inactivity-warning-instruction">
        ${this.options.instruction}
      </p>

      <!-- Botones de acción (opcional) -->
      ${this.options.showButtons ? `
        <div class="vanilla-inactivity-warning-actions">
          <button class="vanilla-inactivity-warning-button vanilla-inactivity-warning-button-primary extend-btn">
            ${this.options.extendButtonText}
          </button>
          <button class="vanilla-inactivity-warning-button vanilla-inactivity-warning-button-secondary logout-btn">
            ${this.options.logoutButtonText}
          </button>
        </div>
      ` : ''}
    `

        overlay.appendChild(modal)
        return overlay
    }

    /**
     * Obtiene las clases CSS del overlay
     */
    getOverlayClass() {
        const classes = [
            'vanilla-inactivity-warning-overlay',
            `vanilla-inactivity-warning-theme-${this.options.theme}`,
            this.options.overlayClass
        ]
        return classes.filter(Boolean).join(' ')
    }

    /**
     * Obtiene las clases CSS del modal
     */
    getModalClass() {
        const classes = [
            'vanilla-inactivity-warning-modal',
            `vanilla-inactivity-warning-modal-theme-${this.options.theme}`,
            this.options.modalClass
        ]
        return classes.filter(Boolean).join(' ')
    }

    /**
     * Muestra el modal
     */
    show() {
        if (this.isVisible) return

        this.element = this.createElement()
        document.body.appendChild(this.element)
        this.isVisible = true

        // Agregar event listeners para los botones
        this.attachEventListeners()

        // Agregar estilos si no existen
        this.ensureStyles()
    }

    /**
     * Oculta el modal
     */
    hide() {
        if (!this.isVisible || !this.element) return

        this.element.remove()
        this.element = null
        this.isVisible = false
    }

    /**
     * Actualiza el tiempo restante mostrado
     */
    updateTimeRemaining(timeRemaining) {
        if (!this.element) return

        const timeDisplay = this.element.querySelector('.time-display')
        if (timeDisplay) {
            const minutes = Math.floor(timeRemaining / 60)
            const seconds = timeRemaining % 60
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`
        }
    }

    /**
     * Actualiza las opciones del modal
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions }

        if (this.isVisible) {
            this.hide()
            this.show()
        }
    }

    /**
     * Adjunta los event listeners
     */
    attachEventListeners() {
        if (!this.element) return

        const extendBtn = this.element.querySelector('.extend-btn')
        const logoutBtn = this.element.querySelector('.logout-btn')

        if (extendBtn) {
            extendBtn.addEventListener('click', () => {
                this.options.onExtend()
            })
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.options.onLogout()
            })
        }
    }

    /**
     * Asegura que los estilos CSS estén cargados
     */
    ensureStyles() {
        if (document.getElementById('vanilla-inactivity-warning-styles')) return

        const style = document.createElement('style')
        style.id = 'vanilla-inactivity-warning-styles'
        style.textContent = this.getStyles()
        document.head.appendChild(style)
    }

    /**
     * Obtiene los estilos CSS
     */
    getStyles() {
        return `
      /* Estilos base para Vanilla Inactivity Warning */
      .vanilla-inactivity-warning-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
      }

      .vanilla-inactivity-warning-modal {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 2rem;
        max-width: 28rem;
        width: 100%;
        margin: 1rem;
        animation: slideIn 0.3s ease-out;
      }

      .vanilla-inactivity-warning-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
      }

      .vanilla-inactivity-warning-icon {
        background-color: #fef3c7;
        padding: 0.75rem;
        border-radius: 50%;
      }

      .vanilla-inactivity-warning-icon-svg {
        width: 2rem;
        height: 2rem;
        color: #d97706;
      }

      .vanilla-inactivity-warning-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        text-align: center;
        margin-bottom: 1rem;
      }

      .vanilla-inactivity-warning-message {
        color: #6b7280;
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .vanilla-inactivity-warning-countdown {
        text-align: center;
        margin-bottom: 2rem;
      }

      .vanilla-inactivity-warning-countdown-circle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 5rem;
        height: 5rem;
        background-color: #fee2e2;
        border-radius: 50%;
      }

      .vanilla-inactivity-warning-countdown-text {
        font-size: 1.5rem;
        font-weight: bold;
        color: #dc2626;
      }

      .vanilla-inactivity-warning-instruction {
        font-size: 0.875rem;
        color: #6b7280;
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .vanilla-inactivity-warning-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
      }

      .vanilla-inactivity-warning-button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .vanilla-inactivity-warning-button-primary {
        background-color: #3b82f6;
        color: white;
      }

      .vanilla-inactivity-warning-button-primary:hover {
        background-color: #2563eb;
      }

      .vanilla-inactivity-warning-button-secondary {
        background-color: #6b7280;
        color: white;
      }

      .vanilla-inactivity-warning-button-secondary:hover {
        background-color: #4b5563;
      }

      /* Animaciones */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideIn {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Tema oscuro */
      .vanilla-inactivity-warning-theme-dark .vanilla-inactivity-warning-modal {
        background-color: #1f2937;
        color: #f9fafb;
      }

      .vanilla-inactivity-warning-theme-dark .vanilla-inactivity-warning-title {
        color: #f9fafb;
      }

      .vanilla-inactivity-warning-theme-dark .vanilla-inactivity-warning-message,
      .vanilla-inactivity-warning-theme-dark .vanilla-inactivity-warning-instruction {
        color: #d1d5db;
      }

      /* Tema minimal */
      .vanilla-inactivity-warning-theme-minimal .vanilla-inactivity-warning-modal {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .vanilla-inactivity-warning-theme-minimal .vanilla-inactivity-warning-icon {
        background-color: #f3f4f6;
      }

      .vanilla-inactivity-warning-theme-minimal .vanilla-inactivity-warning-icon-svg {
        color: #6b7280;
      }

      .vanilla-inactivity-warning-theme-minimal .vanilla-inactivity-warning-countdown-circle {
        background-color: #f3f4f6;
      }

      .vanilla-inactivity-warning-theme-minimal .vanilla-inactivity-warning-countdown-text {
        color: #374151;
      }
    `
    }

    /**
     * Destruye el modal y limpia recursos
     */
    destroy() {
        this.hide()
    }
}
