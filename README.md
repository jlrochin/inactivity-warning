# Inactivity Warning

[![npm version](https://badge.fury.io/js/inactivity-warning.svg)](https://badge.fury.io/js/inactivity-warning)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/jrochinu/inactivity-warning.svg)](https://github.com/jrochinu/inactivity-warning/stargazers)

Un componente moderno y reutilizable para manejar advertencias de cierre de sesión por inactividad. Compatible con **Vue 3**, **React**, **Angular** y **Vanilla JavaScript**.

## ✨ Características

- 🚀 **Multi-framework**: Soporte para Vue 3, React, Angular y Vanilla JS
- ⚡ **Ligero**: Solo ~37KB comprimido
- 🎨 **Temas**: Múltiples temas incluidos (default, dark, minimal)
- 🔧 **Configurable**: Tiempos personalizables y eventos flexibles
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- 🛡️ **TypeScript**: Soporte completo para TypeScript
- 🧪 **Testeable**: Fácil de testear y mockear

## 📦 Instalación

```bash
npm install inactivity-warning
```

## 🚀 Uso Rápido

### Vue 3

```vue
<template>
  <div>
    <!-- Tu contenido aquí -->
    <InactivityWarning
      :is-visible="inactivityWarning.isWarningVisible.value"
      :time-remaining="inactivityWarning.timeRemaining.value"
      theme="default"
      :show-buttons="true"
      @extend="inactivityWarning.extendSession"
      @logout="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInactivityTimer, InactivityWarning } from 'inactivity-warning'

const config = {
  timeoutSeconds: 300, // 5 minutos
  warningSeconds: 30   // 30 segundos de advertencia
}

const inactivityWarning = useInactivityTimer(config)

const handleLogout = () => {
  console.log('Usuario desconectado por inactividad')
  // Redirigir al login o limpiar la sesión
}
</script>
```

### React

```jsx
import React from 'react'
import { useInactivityTimer, InactivityWarning } from 'inactivity-warning/react'

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
    <div>
      {/* Tu contenido aquí */}
      <InactivityWarning
        isVisible={inactivityWarning.isWarningVisible}
        timeRemaining={inactivityWarning.timeRemaining}
        theme="default"
        showButtons={true}
        onExtend={inactivityWarning.extendSession}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App
```

### Angular

```typescript
// app.component.ts
import { Component } from '@angular/core'
import { InactivityTimerService } from 'inactivity-warning/angular'

@Component({
  selector: 'app-root',
  template: `
    <div>
      <!-- Tu contenido aquí -->
      <app-inactivity-warning
        [isVisible]="inactivityService.isWarningVisible$ | async"
        [timeRemaining]="inactivityService.timeRemaining$ | async"
        theme="default"
        [showButtons]="true"
        (extend)="inactivityService.extendSession()"
        (logout)="handleLogout()"
      ></app-inactivity-warning>
    </div>
  `
})
export class AppComponent {
  constructor(public inactivityService: InactivityTimerService) {
    this.inactivityService.configure({
      timeoutSeconds: 300,
      warningSeconds: 30
    })
  }

  handleLogout() {
    console.log('Usuario desconectado por inactividad')
  }
}
```

### Vanilla JavaScript

```html
<div id="app">
  <!-- Tu contenido aquí -->
  <div id="inactivity-warning"></div>
</div>

<script type="module">
import { InactivityTimer, InactivityWarning } from 'inactivity-warning/vanilla'

const config = {
  timeoutSeconds: 300,
  warningSeconds: 30
}

const timer = new InactivityTimer(config)
const warning = new InactivityWarning('#inactivity-warning', {
  theme: 'default',
  showButtons: true
})

timer.onWarning(() => {
  warning.show(timer.getTimeRemaining())
})

timer.onTimeout(() => {
  console.log('Usuario desconectado por inactividad')
})

warning.onExtend(() => {
  timer.extendSession()
  warning.hide()
})

warning.onLogout(() => {
  console.log('Usuario desconectado manualmente')
})

timer.start()
</script>
```

## ⚙️ Configuración

### Opciones de Configuración

| Propiedad | Tipo | Valor por defecto | Descripción |
|-----------|------|-------------------|-------------|
| `timeoutSeconds` | `number` | `300` | Tiempo total antes del logout automático (en segundos) |
| `warningSeconds` | `number` | `30` | Tiempo de advertencia antes del logout (en segundos) |
| `theme` | `string` | `'default'` | Tema del modal: `'default'`, `'dark'`, `'minimal'` |
| `showButtons` | `boolean` | `true` | Mostrar botones de extender sesión y logout |

### Eventos

| Evento | Descripción | Parámetros |
|--------|-------------|------------|
| `@extend` / `onExtend` | Se dispara cuando el usuario hace clic en "Extender Sesión" | Ninguno |
| `@logout` / `onLogout` | Se dispara cuando el usuario hace clic en "Cerrar Sesión" o cuando se agota el tiempo | Ninguno |

## 🎨 Temas

### Default
```javascript
theme: 'default'
```

### Dark
```javascript
theme: 'dark'
```

### Minimal
```javascript
theme: 'minimal'
```

## 📱 Ejemplo en Vivo

Puedes ver un ejemplo completo funcionando en: [Demo en Vivo](https://jrochinu.github.io/inactivity-warning/)

## 🧪 Testing

```bash
# Instalar dependencias de desarrollo
npm install

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/jrochinu/inactivity-warning.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar linting
npm run lint
```

## 📋 Roadmap

- [ ] Soporte para Vue 2
- [ ] Más temas personalizables
- [ ] Integración con frameworks de autenticación
- [ ] Soporte para Web Workers
- [ ] Modo offline/online detection
- [ ] Internacionalización (i18n)

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) para más detalles.

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**jlrupton** - [GitHub](https://github.com/jrochinu)

## 🙏 Agradecimientos

- [Vue.js](https://vuejs.org/) - Framework progresivo
- [React](https://reactjs.org/) - Biblioteca para interfaces de usuario
- [Angular](https://angular.io/) - Plataforma de desarrollo web
- [Vite](https://vitejs.dev/) - Herramienta de construcción rápida

## 📊 Estadísticas

![GitHub stars](https://img.shields.io/github/stars/jrochinu/inactivity-warning.svg)
![GitHub forks](https://img.shields.io/github/forks/jrochinu/inactivity-warning.svg)
![GitHub issues](https://img.shields.io/github/issues/jrochinu/inactivity-warning.svg)
![GitHub pull requests](https://img.shields.io/github/issues-pr/jrochinu/inactivity-warning.svg)

---

⭐ Si este proyecto te ha sido útil, ¡dale una estrella en GitHub!