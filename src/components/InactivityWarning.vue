<template>
  <div 
    v-if="isVisible" 
    class="vue-inactivity-warning-overlay"
    :class="overlayClass"
  >
    <div 
      class="vue-inactivity-warning-modal" 
      :class="modalClass"
    >
      <!-- Header -->
      <div class="vue-inactivity-warning-header">
        <div 
          class="vue-inactivity-warning-icon" 
          :class="iconClass"
        >
          <slot name="icon">
            <svg 
              class="vue-inactivity-warning-icon-svg" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </slot>
        </div>
      </div>
      
      <!-- Título -->
      <h3 class="vue-inactivity-warning-title">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      
      <!-- Mensaje -->
      <p class="vue-inactivity-warning-message">
        <slot name="message">
          {{ message }}
        </slot>
      </p>
      
      <!-- Countdown -->
      <div class="vue-inactivity-warning-countdown">
        <div 
          class="vue-inactivity-warning-countdown-circle" 
          :class="countdownClass"
        >
          <span class="vue-inactivity-warning-countdown-text">
            {{ formatTimeRemaining() }}
          </span>
        </div>
      </div>
      
      <!-- Información adicional -->
      <p class="vue-inactivity-warning-instruction">
        <slot name="instruction">
          {{ instruction }}
        </slot>
      </p>

      <!-- Botones de acción (opcional) -->
      <div 
        v-if="showButtons" 
        class="vue-inactivity-warning-actions"
      >
        <button 
          class="vue-inactivity-warning-button vue-inactivity-warning-button-primary"
          @click="onExtendSession"
        >
          {{ extendButtonText }}
        </button>
        <button 
          class="vue-inactivity-warning-button vue-inactivity-warning-button-secondary"
          @click="onLogoutNow"
        >
          {{ logoutButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InactivityWarning',
  props: {
    // Estado
    isVisible: {
      type: Boolean,
      default: false
    },
    timeRemaining: {
      type: Number,
      default: 0
    },
    
    // Textos personalizables
    title: {
      type: String,
      default: 'Sesión a punto de expirar'
    },
    message: {
      type: String,
      default: 'Su sesión se cerrará automáticamente en:'
    },
    instruction: {
      type: String,
      default: 'Mueva el mouse, haga click o presione cualquier tecla para continuar su sesión'
    },
    extendButtonText: {
      type: String,
      default: 'Continuar sesión'
    },
    logoutButtonText: {
      type: String,
      default: 'Cerrar sesión'
    },
    
    // Configuración de UI
    showButtons: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'default', // 'default', 'dark', 'minimal'
      validator: (value) => ['default', 'dark', 'minimal'].includes(value)
    },
    
    // Clases CSS personalizadas
    overlayClass: {
      type: String,
      default: ''
    },
    modalClass: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    countdownClass: {
      type: String,
      default: ''
    },
    
    // Callbacks
    onExtend: {
      type: Function,
      default: () => {}
    },
    onLogout: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['extend', 'logout'],
  computed: {
    // Clases dinámicas basadas en el tema
    computedOverlayClass() {
      const baseClass = 'vue-inactivity-warning-overlay'
      const themeClass = `vue-inactivity-warning-theme-${this.theme}`
      return [baseClass, themeClass, this.overlayClass].filter(Boolean).join(' ')
    },
    
    computedModalClass() {
      const baseClass = 'vue-inactivity-warning-modal'
      const themeClass = `vue-inactivity-warning-modal-theme-${this.theme}`
      return [baseClass, themeClass, this.modalClass].filter(Boolean).join(' ')
    },
    
    computedIconClass() {
      const baseClass = 'vue-inactivity-warning-icon'
      const themeClass = `vue-inactivity-warning-icon-theme-${this.theme}`
      return [baseClass, themeClass, this.iconClass].filter(Boolean).join(' ')
    },
    
    computedCountdownClass() {
      const baseClass = 'vue-inactivity-warning-countdown-circle'
      const themeClass = `vue-inactivity-warning-countdown-theme-${this.theme}`
      return [baseClass, themeClass, this.countdownClass].filter(Boolean).join(' ')
    }
  },
  methods: {
    formatTimeRemaining() {
      const minutes = Math.floor(this.timeRemaining / 60)
      const seconds = this.timeRemaining % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    
    onExtendSession() {
      this.$emit('extend')
      this.onExtend()
    },
    
    onLogoutNow() {
      this.$emit('logout')
      this.onLogout()
    }
  }
}
</script>

<style scoped>
/* Estilos base */
.vue-inactivity-warning-overlay {
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

.vue-inactivity-warning-modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  margin: 1rem;
  animation: slideIn 0.3s ease-out;
}

.vue-inactivity-warning-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.vue-inactivity-warning-icon {
  background-color: #fef3c7;
  padding: 0.75rem;
  border-radius: 50%;
}

.vue-inactivity-warning-icon-svg {
  width: 2rem;
  height: 2rem;
  color: #d97706;
}

.vue-inactivity-warning-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 1rem;
}

.vue-inactivity-warning-message {
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.vue-inactivity-warning-countdown {
  text-align: center;
  margin-bottom: 2rem;
}

.vue-inactivity-warning-countdown-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background-color: #fee2e2;
  border-radius: 50%;
}

.vue-inactivity-warning-countdown-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #dc2626;
}

.vue-inactivity-warning-instruction {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.vue-inactivity-warning-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.vue-inactivity-warning-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.vue-inactivity-warning-button-primary {
  background-color: #3b82f6;
  color: white;
}

.vue-inactivity-warning-button-primary:hover {
  background-color: #2563eb;
}

.vue-inactivity-warning-button-secondary {
  background-color: #6b7280;
  color: white;
}

.vue-inactivity-warning-button-secondary:hover {
  background-color: #4b5563;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
.vue-inactivity-warning-theme-dark .vue-inactivity-warning-modal {
  background-color: #1f2937;
  color: #f9fafb;
}

.vue-inactivity-warning-theme-dark .vue-inactivity-warning-title {
  color: #f9fafb;
}

.vue-inactivity-warning-theme-dark .vue-inactivity-warning-message,
.vue-inactivity-warning-theme-dark .vue-inactivity-warning-instruction {
  color: #d1d5db;
}

/* Tema minimal */
.vue-inactivity-warning-theme-minimal .vue-inactivity-warning-modal {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.vue-inactivity-warning-theme-minimal .vue-inactivity-warning-icon {
  background-color: #f3f4f6;
}

.vue-inactivity-warning-theme-minimal .vue-inactivity-warning-icon-svg {
  color: #6b7280;
}

.vue-inactivity-warning-theme-minimal .vue-inactivity-warning-countdown-circle {
  background-color: #f3f4f6;
}

.vue-inactivity-warning-theme-minimal .vue-inactivity-warning-countdown-text {
  color: #374151;
}
</style>
