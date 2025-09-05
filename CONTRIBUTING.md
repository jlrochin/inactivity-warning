# Guía de Contribución

¡Gracias por tu interés en contribuir a `inactivity-warning`! Este documento te guiará a través del proceso de contribución.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

1. Fork este repositorio en GitHub
2. Clone tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/inactivity-warning.git
   cd inactivity-warning
   ```

### 2. Configurar el Entorno de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test
```

### 3. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 4. Hacer Cambios

- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que todos los tests pasen

### 5. Commit y Push

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

### 6. Crear Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "New Pull Request"
3. Describe tus cambios claramente
4. Espera la revisión

## 📋 Convenciones

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato/estilo
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en herramientas/configuración

### Código

- Usa ESLint para mantener consistencia
- Escribe tests para nuevas funcionalidades
- Documenta funciones públicas
- Mantén la compatibilidad con versiones anteriores

### Tests

- Cubre casos edge
- Prueba diferentes frameworks
- Mantén cobertura > 80%
- Usa mocks apropiadamente

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no sea un bug ya reportado
2. Prueba con la última versión
3. Revisa la documentación

### Información Necesaria

- Versión del paquete
- Framework y versión
- Código de ejemplo mínimo
- Pasos para reproducir
- Comportamiento esperado vs actual

## 💡 Sugerir Funcionalidades

### Antes de Sugerir

1. Verifica que no esté ya en el roadmap
2. Considera el impacto en otros frameworks
3. Piensa en casos de uso reales

### Información Útil

- Descripción detallada
- Casos de uso
- Ejemplos de implementación
- Consideraciones de compatibilidad

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes Vue
├── composables/         # Composables Vue
├── react/              # Componentes y hooks React
├── angular/            # Servicios y componentes Angular
├── vanilla/            # Implementación Vanilla JS
└── types/              # Definiciones TypeScript
```

### Principios de Diseño

- **Multi-framework**: Soporte consistente para todos los frameworks
- **Ligero**: Mínimas dependencias externas
- **Configurable**: Opciones flexibles sin complejidad
- **Testeable**: Fácil de testear y mockear

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

### Escribir Tests

- Usa `describe` para agrupar tests relacionados
- Usa `it` para casos de prueba individuales
- Usa `expect` para assertions
- Mockea dependencias externas

## 📚 Documentación

### README.md

- Mantén ejemplos actualizados
- Incluye casos de uso comunes
- Documenta todas las opciones de configuración

### Código

- Documenta funciones públicas
- Usa JSDoc para TypeScript
- Incluye ejemplos en comentarios

## 🔄 Proceso de Release

### Versionado

Seguimos [Semantic Versioning](https://semver.org/):

- `MAJOR`: Cambios incompatibles
- `MINOR`: Nueva funcionalidad compatible
- `PATCH`: Correcciones de bugs

### Release Process

1. Actualizar `package.json` versión
2. Actualizar `CHANGELOG.md`
3. Crear tag en GitHub
4. GitHub Actions publica automáticamente

## ❓ Preguntas

Si tienes preguntas:

- Abre un issue en GitHub
- Únete a nuestras discusiones
- Revisa la documentación existente

## 🙏 Reconocimientos

Gracias a todos los contribuidores que hacen posible este proyecto:

- [Lista de contribuidores](https://github.com/jrochinu/inactivity-warning/graphs/contributors)

---

¡Esperamos tu contribución! 🚀
