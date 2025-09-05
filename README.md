# Multi-Framework Inactivity Warning

Componente reutilizable para advertencia de cierre de sesión por inactividad compatible con **Vue 3**, **React**, **Angular** y **Vanilla JavaScript**.

## 🚀 Características

- ⏰ **Timer configurable** - Personaliza el tiempo de inactividad y advertencia
- 🎨 **Múltiples temas** - Default, Dark y Minimal
- 🔧 **Altamente personalizable** - Props, callbacks y estilos
- 📱 **Responsive** - Funciona en desktop y móvil
- 🎯 **TypeScript ready** - Tipos incluidos
- 🪶 **Ligero** - Sin dependencias pesadas
- 🌐 **Multi-framework** - Compatible con los frameworks más populares
- ♿ **Accesible** - Diseño accesible por defecto

## 📦 Instalación

```bash
npm install vue-inactivity-warning
# o
yarn add vue-inactivity-warning
# o
pnpm add vue-inactivity-warning
```

## 🌐 Frameworks Soportados

- **Vue 3** - Composable + Componente
- **React** - Hook + Componente
- **Angular** - Servicio + Componente
- **Vanilla JavaScript** - Clases ES6

## 🚀 Uso por Framework

### Vue 3

```vue
<template>
  <div>
    <!-- Tu aplicación -->
    <InactivityWarning
      :is-visible="isWarningVisible"
      :time-remaining="timeRemaining"
      @extend="extendSession"
      @logout="logout"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useInactivityTimer, InactivityWarning } from "vue-inactivity-warning";

const { isWarningVisible, timeRemaining, startMonitoring, extendSession } =
  useInactivityTimer({
    timeoutSeconds: 60,
    warningSeconds: 20,
    onLogout: () => {
      console.log("Sesión cerrada por inactividad");
    },
  });

startMonitoring();
</script>
```

### React

```jsx
import React, { useState, useEffect } from "react";
import {
  useInactivityTimer,
  InactivityWarning,
} from "vue-inactivity-warning/react";

function App() {
  const inactivityWarning = useInactivityTimer({
    timeoutSeconds: 60,
    warningSeconds: 20,
    onLogout: () => {
      console.log("Sesión cerrada por inactividad");
    },
  });

  useEffect(() => {
    inactivityWarning.startMonitoring();
  }, []);

  return (
    <div>
      {/* Tu aplicación */}
      <InactivityWarning
        isVisible={inactivityWarning.isWarningVisible}
        timeRemaining={inactivityWarning.timeRemaining}
        onExtend={inactivityWarning.extendSession}
        onLogout={() => console.log("Logout")}
      />
    </div>
  );
}
```

### Angular

```typescript
import { Component, OnInit } from "@angular/core";
import {
  InactivityTimerService,
  InactivityWarningComponent,
} from "vue-inactivity-warning/angular";

@Component({
  selector: "app-root",
  template: `
    <div>
      <!-- Tu aplicación -->
      <app-inactivity-warning
        [isVisible]="isWarningVisible$ | async"
        [timeRemaining]="timeRemaining$ | async"
        (extend)="extendSession()"
        (logout)="logout()"
      ></app-inactivity-warning>
    </div>
  `,
})
export class AppComponent implements OnInit {
  isWarningVisible$ = this.timerService.isWarningVisible$;
  timeRemaining$ = this.timerService.timeRemaining$;

  constructor(private timerService: InactivityTimerService) {}

  ngOnInit() {
    this.timerService.startMonitoring();
  }

  extendSession() {
    this.timerService.extendSession();
  }

  logout() {
    this.timerService.stopMonitoring();
  }
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import {
        InactivityTimer,
        InactivityWarning,
      } from "vue-inactivity-warning/vanilla";

      const timer = new InactivityTimer({
        timeoutSeconds: 60,
        warningSeconds: 20,
        onLogout: () => {
          console.log("Sesión cerrada por inactividad");
        },
      });

      const warning = new InactivityWarning({
        onExtend: () => timer.extendSession(),
        onLogout: () => timer.stopMonitoring(),
      });

      // Escuchar cambios de estado
      timer.onStateChange = (state) => {
        if (state.isWarningVisible) {
          warning.show();
        } else {
          warning.hide();
        }
      };

      // Iniciar monitoring
      timer.startMonitoring();
    </script>
  </head>
  <body>
    <!-- Tu aplicación -->
  </body>
</html>
```

## ⚙️ Configuración Común

Todos los frameworks comparten la misma configuración:

```javascript
{
  timeoutSeconds: 60,        // Tiempo total antes de cerrar sesión
  warningSeconds: 20,        // Tiempo para mostrar advertencia
  onLogout: () => {},        // Callback de cierre de sesión
  onWarning: () => {},       // Callback de advertencia
  onExtend: () => {},        // Callback de extensión
  resetEvents: [             // Eventos que resetean el timer
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'keydown'
  ],
  enabled: true              // Si el timer está habilitado
}
```

## 🔧 API Común

### Métodos Disponibles

- `startMonitoring()` - Inicia el monitoring
- `stopMonitoring()` - Detiene el monitoring
- `pauseMonitoring()` - Pausa temporalmente
- `resumeMonitoring()` - Reanuda el monitoring
- `extendSession()` - Extiende la sesión
- `resetTimer()` - Resetea el timer
- `updateConfig(options)` - Actualiza la configuración
- `formatTimeRemaining()` - Formatea el tiempo restante

### Estado Reactivo

- `isWarningVisible` - Si la advertencia está visible
- `timeRemaining` - Tiempo restante en segundos
- `isActive` - Si el monitoring está activo

## 🎨 Personalización del Modal

### Propiedades Comunes

- `title` - Título del modal
- `message` - Mensaje principal
- `instruction` - Instrucciones para el usuario
- `extendButtonText` - Texto del botón de extensión
- `logoutButtonText` - Texto del botón de cierre
- `showButtons` - Mostrar botones de acción
- `theme` - Tema ('default', 'dark', 'minimal')
- `overlayClass` - Clases CSS adicionales para el overlay
- `modalClass` - Clases CSS adicionales para el modal
- `iconClass` - Clases CSS adicionales para el ícono
- `countdownClass` - Clases CSS adicionales para el countdown

### Temas Incluidos

- **default**: Tema claro estándar
- **dark**: Tema oscuro
- **minimal**: Tema minimalista

## 📁 Estructura del Proyecto

```
src/
├── vue/           # Vue 3 - Composable + Componente
├── react/         # React - Hook + Componente
├── angular/       # Angular - Servicio + Componente
├── vanilla/       # Vanilla JS - Clases ES6
└── index.js       # Exportaciones principales
```

## 📱 Ejemplos Completos

Ver el directorio `examples/` para ejemplos completos de cada framework:

- `examples/vue/` - Ejemplo con Vue 3
- `examples/react/` - Ejemplo con React
- `examples/angular/` - Ejemplo con Angular
- `examples/vanilla/` - Ejemplo con Vanilla JavaScript

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/vue-inactivity-warning.git

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor abre un issue o pull request.

## 📞 Soporte

Si tienes problemas o preguntas, por favor abre un issue en GitHub.
