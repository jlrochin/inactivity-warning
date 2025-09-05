<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-xl font-semibold text-gray-900">Inactivity Warning</span>
            </div>
            <nav class="hidden md:flex space-x-6">
              <a href="#" @click="currentView = 'demo'" :class="currentView === 'demo' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'">Demo</a>
              <a href="#" @click="currentView = 'docs'" :class="currentView === 'docs' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'">Documentación</a>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <div class="w-2 h-2 rounded-full" :class="isAuthenticated ? 'bg-green-500' : 'bg-gray-400'"></div>
              <span class="text-sm text-gray-600">
                {{ isAuthenticated ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <button
              @click="toggleAuth"
              class="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              {{ isAuthenticated ? 'Logout' : 'Login' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Demo View -->
      <div v-if="currentView === 'demo'">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Inactivity Warning
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Un componente moderno y reutilizable para manejar advertencias de cierre de sesión por inactividad. 
            Compatible con Vue 3, React, Angular y Vanilla JavaScript.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Vue 3</span>
            <span class="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">React</span>
            <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Angular</span>
            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Vanilla JS</span>
          </div>
        </div>

      <!-- Demo Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <!-- Configuration Panel -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Configuración del Timer</h2>
          
          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo total (segundos)
                </label>
                <input
                  v-model.number="config.timeoutSeconds"
                  type="number"
                  min="10"
                  max="600"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de advertencia (segundos)
                </label>
                <input
                  v-model.number="config.warningSeconds"
                  type="number"
                  min="5"
                  :max="config.timeoutSeconds - 5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tema del Modal
              </label>
              <select
                v-model="theme"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div class="flex gap-3">
              <button
                @click="updateConfig"
                class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Actualizar Configuración
              </button>
              
              <button
                @click="testWarning"
                class="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Probar Advertencia
              </button>
            </div>
          </div>
        </div>

        <!-- Status Panel -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Estado del Timer</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-600">Estado del Timer</span>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :class="inactivityWarning.isActive.value ? 'bg-green-500' : 'bg-gray-400'"></div>
                <span class="text-sm font-semibold" :class="inactivityWarning.isActive.value ? 'text-green-700' : 'text-gray-500'">
                  {{ inactivityWarning.isActive.value ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-600">Advertencia Visible</span>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :class="inactivityWarning.isWarningVisible.value ? 'bg-yellow-500' : 'bg-gray-400'"></div>
                <span class="text-sm font-semibold" :class="inactivityWarning.isWarningVisible.value ? 'text-yellow-700' : 'text-gray-500'">
                  {{ inactivityWarning.isWarningVisible.value ? 'Visible' : 'Oculta' }}
                </span>
              </div>
            </div>
            
            <div v-if="inactivityWarning.isWarningVisible.value" class="p-4 bg-red-50 rounded-lg border border-red-200">
              <div class="text-center">
                <div class="text-3xl font-bold text-red-600 mb-2">
                  {{ inactivityWarning.formatTimeRemaining() }}
                </div>
                <div class="text-sm text-red-700">Tiempo restante</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-16">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">Cómo Usar</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div class="font-medium text-blue-900">Inicia Sesión</div>
                <div class="text-sm text-blue-700">Haz clic en "Login" para activar el timer</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div class="font-medium text-blue-900">Configura Tiempos</div>
                <div class="text-sm text-blue-700">Ajusta los tiempos y actualiza la configuración</div>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div class="font-medium text-blue-900">Interactúa</div>
                <div class="text-sm text-blue-700">Mueve el mouse para resetear el timer</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <div class="font-medium text-blue-900">Prueba la Advertencia</div>
                <div class="text-sm text-blue-700">Usa "Probar Advertencia" para simular</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentation View -->
      <div v-if="currentView === 'docs'">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Documentación
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Guía completa para implementar Inactivity Warning en cualquier framework. 
            Ejemplos, configuración y mejores prácticas.
          </p>
        </div>

        <!-- Documentation Content -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Documentación Completa</h2>
        
        <!-- Installation -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Instalación</h3>
          <div class="bg-gray-900 rounded-lg p-4 mb-4">
            <code class="text-green-400">npm install vue-inactivity-warning</code>
          </div>
          <p class="text-gray-600 mb-4">
            Instala el paquete usando npm o yarn. El componente es compatible con múltiples frameworks y no requiere dependencias adicionales.
          </p>
        </div>

        <!-- Vue 3 Usage -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Vue 3 - Uso Básico</h3>
          <div class="bg-gray-900 rounded-lg p-4 mb-4">
            <pre class="text-gray-300 text-sm"><code>&lt;template&gt;
  &lt;div&gt;
    &lt;!-- Tu contenido aquí --&gt;
    &lt;InactivityWarning
      :is-visible="inactivityWarning.isWarningVisible.value"
      :time-remaining="inactivityWarning.timeRemaining.value"
      :theme="'default'"
      :show-buttons="true"
      @extend="inactivityWarning.extendSession"
      @logout="handleLogout"
    /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { useInactivityTimer, InactivityWarning } from 'vue-inactivity-warning'

// Configuración del timer
const config = {
  timeoutSeconds: 300, // 5 minutos
  warningSeconds: 30   // 30 segundos de advertencia
}

// Inicializar el composable
const inactivityWarning = useInactivityTimer(config)

// Función para manejar logout
const handleLogout = () => {
  console.log('Usuario desconectado por inactividad')
  // Aquí puedes redirigir al login o limpiar la sesión
}
&lt;/script&gt;</code></pre>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-2">Explicación:</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li><strong>useInactivityTimer:</strong> Composable que maneja toda la lógica del timer</li>
              <li><strong>isWarningVisible:</strong> Estado reactivo que indica si la advertencia está visible</li>
              <li><strong>timeRemaining:</strong> Tiempo restante antes del logout automático</li>
              <li><strong>extendSession:</strong> Función para extender la sesión cuando el usuario interactúa</li>
            </ul>
          </div>
        </div>

        <!-- React Usage -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">React - Uso Básico</h3>
          <div class="bg-gray-900 rounded-lg p-4 mb-4">
            <pre class="text-gray-300 text-sm"><code>import React from 'react'
import { useInactivityTimer, InactivityWarning } from 'vue-inactivity-warning/react'

function App() {
  const config = {
    timeoutSeconds: 300,
    warningSeconds: 30
  }

  const inactivityWarning = useInactivityTimer(config)

  const handleLogout = () => {
    console.log('Usuario desconectado por inactividad')
  }

  return (
    &lt;div&gt;
      {/* Tu contenido aquí */}
      &lt;InactivityWarning
        isVisible={inactivityWarning.isWarningVisible}
        timeRemaining={inactivityWarning.timeRemaining}
        theme="default"
        showButtons={true}
        onExtend={inactivityWarning.extendSession}
        onLogout={handleLogout}
      /&gt;
    &lt;/div&gt;
  )
}

export default App</code></pre>
          </div>
          <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <h4 class="font-semibold text-cyan-900 mb-2">Explicación:</h4>
            <ul class="text-sm text-cyan-800 space-y-1">
              <li><strong>useInactivityTimer:</strong> Hook personalizado que funciona igual que el composable de Vue</li>
              <li><strong>Props:</strong> Las props son las mismas pero usando la convención de React (camelCase)</li>
              <li><strong>Eventos:</strong> onExtend y onLogout en lugar de @extend y @logout</li>
            </ul>
          </div>
        </div>

        <!-- Angular Usage -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Angular - Uso Básico</h3>
          <div class="bg-gray-900 rounded-lg p-4 mb-4">
            <pre class="text-gray-300 text-sm"><code>// app.component.ts
import { Component } from '@angular/core'
import { InactivityTimerService } from 'vue-inactivity-warning/angular'

@Component({
  selector: 'app-root',
  template: `
    &lt;div&gt;
      &lt;!-- Tu contenido aquí --&gt;
      &lt;app-inactivity-warning
        [isVisible]="inactivityService.isWarningVisible$ | async"
        [timeRemaining]="inactivityService.timeRemaining$ | async"
        theme="default"
        [showButtons]="true"
        (extend)="inactivityService.extendSession()"
        (logout)="handleLogout()"
      &gt;&lt;/app-inactivity-warning&gt;
    &lt;/div&gt;
  `
})
export class AppComponent {
  constructor(public inactivityService: InactivityTimerService) {
    // Configurar el timer
    this.inactivityService.configure({
      timeoutSeconds: 300,
      warningSeconds: 30
    })
  }

  handleLogout() {
    console.log('Usuario desconectado por inactividad')
  }
}</code></pre>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="font-semibold text-red-900 mb-2">Explicación:</h4>
            <ul class="text-sm text-red-800 space-y-1">
              <li><strong>InactivityTimerService:</strong> Servicio inyectable que maneja la lógica del timer</li>
              <li><strong>Observables:</strong> isWarningVisible$ y timeRemaining$ son observables de RxJS</li>
              <li><strong>configure:</strong> Método para configurar los tiempos del timer</li>
              <li><strong>Async Pipe:</strong> Usa el pipe async para suscribirte a los observables</li>
            </ul>
          </div>
        </div>

        <!-- Vanilla JS Usage -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Vanilla JavaScript - Uso Básico</h3>
          <div class="bg-gray-900 rounded-lg p-4 mb-4">
            <pre class="text-gray-300 text-sm"><code>&lt;!-- HTML --&gt;
&lt;div id="app"&gt;
  &lt;!-- Tu contenido aquí --&gt;
  &lt;div id="inactivity-warning"&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;script type="module"&gt;
import { InactivityTimer, InactivityWarning } from 'vue-inactivity-warning/vanilla'

// Configuración
const config = {
  timeoutSeconds: 300,
  warningSeconds: 30
}

// Crear instancias
const timer = new InactivityTimer(config)
const warning = new InactivityWarning('#inactivity-warning', {
  theme: 'default',
  showButtons: true
})

// Configurar eventos
timer.onWarning(() => {
  warning.show(timer.getTimeRemaining())
})

timer.onTimeout(() => {
  console.log('Usuario desconectado por inactividad')
  // Redirigir al login
})

warning.onExtend(() => {
  timer.extendSession()
  warning.hide()
})

warning.onLogout(() => {
  console.log('Usuario desconectado manualmente')
  // Redirigir al login
})

// Iniciar el timer
timer.start()
&lt;/script&gt;</code></pre>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-900 mb-2">Explicación:</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
              <li><strong>InactivityTimer:</strong> Clase que maneja la lógica del timer</li>
              <li><strong>InactivityWarning:</strong> Clase que maneja la UI del modal de advertencia</li>
              <li><strong>Eventos:</strong> onWarning, onTimeout, onExtend, onLogout para manejar diferentes estados</li>
              <li><strong>start():</strong> Método para iniciar el timer</li>
            </ul>
          </div>
        </div>

        <!-- Configuration Options -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Opciones de Configuración</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">Propiedad</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">Valor por defecto</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900">Descripción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-900 font-mono">timeoutSeconds</td>
                  <td class="px-4 py-3 text-sm text-gray-600">number</td>
                  <td class="px-4 py-3 text-sm text-gray-600">300</td>
                  <td class="px-4 py-3 text-sm text-gray-600">Tiempo total antes del logout automático (en segundos)</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-900 font-mono">warningSeconds</td>
                  <td class="px-4 py-3 text-sm text-gray-600">number</td>
                  <td class="px-4 py-3 text-sm text-gray-600">30</td>
                  <td class="px-4 py-3 text-sm text-gray-600">Tiempo de advertencia antes del logout (en segundos)</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-900 font-mono">theme</td>
                  <td class="px-4 py-3 text-sm text-gray-600">string</td>
                  <td class="px-4 py-3 text-sm text-gray-600">'default'</td>
                  <td class="px-4 py-3 text-sm text-gray-600">Tema del modal: 'default', 'dark', 'minimal'</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-sm text-gray-900 font-mono">showButtons</td>
                  <td class="px-4 py-3 text-sm text-gray-600">boolean</td>
                  <td class="px-4 py-3 text-sm text-gray-600">true</td>
                  <td class="px-4 py-3 text-sm text-gray-600">Mostrar botones de extender sesión y logout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Events -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Eventos</h3>
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">@extend / onExtend</h4>
              <p class="text-sm text-gray-600">Se dispara cuando el usuario hace clic en "Extender Sesión"</p>
              <div class="bg-gray-900 rounded p-2 mt-2">
                <code class="text-green-400 text-sm">// Vue: @extend="handleExtend"</code><br>
                <code class="text-green-400 text-sm">// React: onExtend={handleExtend}</code>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">@logout / onLogout</h4>
              <p class="text-sm text-gray-600">Se dispara cuando el usuario hace clic en "Cerrar Sesión" o cuando se agota el tiempo</p>
              <div class="bg-gray-900 rounded p-2 mt-2">
                <code class="text-green-400 text-sm">// Vue: @logout="handleLogout"</code><br>
                <code class="text-green-400 text-sm">// React: onLogout={handleLogout}</code>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div class="mb-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Mejores Prácticas</h3>
          <div class="space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-2">✅ Configuración Recomendada</h4>
              <ul class="text-sm text-green-800 space-y-1">
                <li>• Usa 5-15 minutos para timeoutSeconds en aplicaciones web</li>
                <li>• Configura 30-60 segundos para warningSeconds</li>
                <li>• Siempre proporciona una forma de extender la sesión</li>
                <li>• Guarda el trabajo del usuario antes del logout automático</li>
              </ul>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="font-semibold text-yellow-900 mb-2">⚠️ Consideraciones</h4>
              <ul class="text-sm text-yellow-800 space-y-1">
                <li>• El timer se resetea con cualquier interacción del usuario</li>
                <li>• Considera pausar el timer durante videos o presentaciones</li>
                <li>• En móviles, el timer puede pausarse cuando la app está en segundo plano</li>
                <li>• Prueba diferentes temas para encontrar el que mejor se adapte a tu diseño</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>

    <!-- Modal de Advertencia -->
    <InactivityWarning
      :is-visible="inactivityWarning.isWarningVisible.value"
      :time-remaining="inactivityWarning.timeRemaining.value"
      :theme="theme"
      :show-buttons="true"
      @extend="inactivityWarning.extendSession"
      @logout="logout"
    />

    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-gray-200 mt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-600">
            © 2024 Inactivity Warning. Hecho con ❤️ para la comunidad de desarrolladores.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { InactivityWarning, useInactivityTimer } from '../src/vue/index.js'

// Estado de la vista actual
const currentView = ref('demo')

// Estado de autenticación
const isAuthenticated = ref(false)

// Configuración del timer
const config = ref({
  timeoutSeconds: 60,
  warningSeconds: 20
})

// Tema del modal
const theme = ref('default')

// Inicializar el timer
const inactivityWarning = useInactivityTimer({
  ...config.value,
  onLogout: async () => {
    console.log('Sesión cerrada por inactividad')
    isAuthenticated.value = false
  },
  onWarning: () => {
    console.log('Mostrando advertencia de inactividad')
  },
  onExtend: () => {
    console.log('Sesión extendida por el usuario')
  }
})

// Toggle de autenticación
const toggleAuth = () => {
  if (isAuthenticated.value) {
    logout()
  } else {
    login()
  }
}

// Login
const login = () => {
  isAuthenticated.value = true
  inactivityWarning.startMonitoring()
  console.log('Usuario logueado - Timer iniciado')
}

// Logout
const logout = () => {
  isAuthenticated.value = false
  inactivityWarning.stopMonitoring()
  console.log('Usuario deslogueado - Timer detenido')
}

// Actualizar configuración
const updateConfig = () => {
  inactivityWarning.updateConfig(config.value)
  console.log('Configuración actualizada:', config.value)
}

// Probar advertencia
const testWarning = () => {
  if (isAuthenticated.value) {
    // Simular advertencia inmediata
    inactivityWarning.updateConfig({
      ...config.value,
      timeoutSeconds: 5,
      warningSeconds: 3
    })
    inactivityWarning.resetTimer()
  } else {
    alert('Primero inicia sesión para probar la advertencia')
  }
}

// Vigilar cambios en autenticación
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    inactivityWarning.startMonitoring()
  } else {
    inactivityWarning.stopMonitoring()
  }
})
</script>

<style>
/* Estilos básicos para el ejemplo */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
</style>
