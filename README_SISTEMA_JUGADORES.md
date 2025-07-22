# Sistema de Gestión de Jugadores - Andorra FC Manager

## 📋 Resumen del Proyecto

Sistema completo de gestión de jugadores para el modo carrera de FC24, implementado con arquitectura moderna manteniendo HTML5, CSS3 y JavaScript Vanilla.

## ✅ Fase 1 Completada - Base de Datos Centralizada y Modal CRUD

### 🚀 Funcionalidades Implementadas

#### 1. Base de Datos JSON Centralizada
- **Archivo**: `js/database/players.json`
- **Estructura completa** con metadata, jugadores y estadísticas
- **12 jugadores migrados** desde el HTML hardcodeado
- **Validación de datos** y esquemas consistentes

#### 2. Clase PlayerDatabase
- **Archivo**: `js/database/PlayerDatabase.js`
- **Métodos CRUD completos**:
  - `addPlayer()` - Crear jugador
  - `updatePlayer()` - Actualizar jugador  
  - `deletePlayer()` - Eliminar (soft delete)
  - `searchPlayers()` - Búsqueda avanzada con filtros
- **Carga asíncrona** con error handling
- **Sistema de backup** en localStorage
- **Validaciones** de integridad de datos

#### 3. Modal de Gestión Avanzado
- **Archivo**: `src/html/components/player-management-modal.html`
- **Navegación por tabs**: Básico, Estadísticas, Contrato, Atributos
- **Formulario completo** con validaciones
- **Subida de imágenes** (drag & drop)
- **Atributos dinámicos** según posición
- **Estados de carga** y notificaciones

#### 4. Estilos CSS Responsivos
- **Archivo**: `css/player-management-modal.css`
- **Design system consistente** con la app existente
- **Animaciones suaves** y transiciones
- **Responsive design** para móviles
- **Estados interactivos** hover/focus/active

#### 5. Integración Completa
- **Página jugadores.html actualizada**
- **Carga dinámica** de tabla desde JSON
- **Botones de acción** (Editar/Eliminar) por jugador
- **Actualización en tiempo real** de estadísticas
- **Navegación por dropdown** de temporadas

## 📁 Estructura de Archivos

```
fc-database-webapp/
├── js/
│   ├── database/
│   │   ├── players.json              # Base de datos centralizada
│   │   └── PlayerDatabase.js         # Clase principal CRUD
│   ├── migration/
│   │   └── migratePlayersToJSON.js   # Script migración HTML→JSON
│   └── PlayerManagementModal.js      # Modal gestión completa
├── css/
│   └── player-management-modal.css   # Estilos del modal
├── src/html/
│   ├── components/
│   │   └── player-management-modal.html # Componente modal
│   ├── jugadores.html                # Página principal (actualizada)
│   └── index.html                    # Página inicio (actualizada)
└── README_SISTEMA_JUGADORES.md       # Esta documentación
```

## 🔧 Uso del Sistema

### 1. Cargar Base de Datos
```javascript
// La base de datos se carga automáticamente
await window.PlayerDB.loadDatabase();
```

### 2. Añadir Jugador
```javascript
const nuevoJugador = {
  basicInfo: {
    name: "Lionel Messi",
    position: "ED",
    age: 36
  },
  gameStats: {
    rating: 91,
    potential: 91
  }
};

const resultado = window.PlayerDB.addPlayer(nuevoJugador);
```

### 3. Buscar Jugadores
```javascript
// Buscar por posición
const delanteros = window.PlayerDB.searchPlayers({ 
  position: "DC", 
  sortBy: "rating" 
});

// Buscar por rango de rating
const estrellas = window.PlayerDB.searchPlayers({ 
  minRating: 80,
  maxRating: 95 
});
```

### 4. Abrir Modal de Gestión
```html
<!-- Botón para añadir -->
<button data-action="add-player">Añadir Jugador</button>

<!-- Botón para editar -->
<button data-action="edit-player" data-player-id="player_id_123">
  Editar
</button>
```

## 📊 Estructura de Datos

### Jugador Completo
```json
{
  "id": "unique_string_id",
  "basicInfo": {
    "name": "string",
    "fullName": "string", 
    "position": "POR|DFC|MC|DC",
    "age": 25,
    "nationality": "España",
    "nationalityCode": "ES",
    "photoUrl": "path/to/image",
    "dorsal": 10
  },
  "gameStats": {
    "rating": 82,
    "potential": 88,
    "value": "32.5M",
    "salary": "60K",
    "contract": {
      "years": 5,
      "startDate": "2024-07-01",
      "endDate": "2029-06-30"
    }
  },
  "attributes": {
    "pace": 85,
    "shooting": 78,
    "passing": 75,
    "dribbling": 88,
    "defending": 35,
    "physical": 72
  },
  "seasonStats": {
    "2024-2025": {
      "appearances": 32,
      "goals": 14,
      "assists": 8,
      "rating": 8.1,
      "minutesPlayed": 2880
    }
  },
  "status": {
    "isActive": true,
    "isYouthPlayer": false,
    "onLoan": false,
    "transferListed": false,
    "injured": false,
    "importance": "Clave",
    "form": "Normal",
    "preferredFoot": "Derecha"
  }
}
```

## 🎨 Características del Modal

### Tabs de Navegación
1. **👤 Básico**: Información personal, posición, nacionalidad
2. **📊 Estadísticas**: Rating, potencial, valor, estadísticas temporada
3. **📋 Contrato**: Fechas, duración, estado del jugador
4. **⚡ Atributos**: Atributos físicos y técnicos con barras visuales

### Validaciones Implementadas
- **Campos obligatorios**: Nombre, posición, edad, rating
- **Rangos numéricos**: Rating (40-99), Edad (15-45)
- **Formatos específicos**: Valores monetarios, fechas
- **Validación en tiempo real** con mensajes de error

### Funcionalidades Avanzadas
- **Atributos específicos de portero** (se muestran solo para POR)
- **Cálculo automático de rating visual** con colores
- **Upload de imágenes** con preview
- **Estados de carga** durante guardado
- **Auto-completado inteligente** de campos

## 🔄 Migración de Datos

### Script de Migración Automática
```javascript
// Ejecutar migración desde consola del navegador
window.migratePlayersToJSON();
```

El script:
1. **Extrae jugadores** de las tablas HTML existentes
2. **Genera datos faltantes** de forma inteligente
3. **Calcula atributos** basados en posición y rating
4. **Crea estadísticas realistas** de temporada
5. **Exporta JSON** listo para usar

## 📱 Responsive Design

### Breakpoints
- **768px**: Adaptación tablet
- **480px**: Optimización móvil

### Adaptaciones Móviles
- **Tabs colapsados** (solo iconos)
- **Formulario en columna única**
- **Botones de acción apilados**
- **Modal de altura completa**

## 🚦 Estados y Feedback

### Notificaciones
- **✅ Éxito**: Jugador guardado/actualizado
- **❌ Error**: Validaciones fallidas
- **⚠️ Advertencia**: Datos incompletos

### Estados de Carga
- **Spinner animado** durante operaciones
- **Deshabilitación de botones** temporal
- **Feedback visual** en tiempo real

## 🔧 Configuración y Personalización

### Variables CSS Personalizables
```css
:root {
  --modal-max-width: 900px;
  --error-color: #ff6b6b;
  --success-color: #4caf50;
  --primary-color: #0066cc;
}
```

### Eventos Personalizados
```javascript
// Escuchar cambios en jugadores
document.addEventListener('playerAdded', (e) => {
  console.log('Nuevo jugador:', e.detail);
});

document.addEventListener('playerUpdated', (e) => {
  console.log('Jugador actualizado:', e.detail);
});
```

## 🐛 Solución de Problemas

### Errores Comunes

1. **Base de datos no carga**
   ```javascript
   // Verificar en consola
   console.log(window.PlayerDB.isLoaded);
   ```

2. **Modal no aparece**
   ```javascript
   // Verificar que el CSS está cargado
   console.log(document.querySelector('#playerManagementModal'));
   ```

3. **Validaciones fallan**
   ```javascript
   // Verificar reglas de validación
   console.log(window.PlayerManagement.validationRules);
   ```

## 🚀 Próximas Fases

### Fase 2: Funcionalidades Avanzadas (Pendiente)
- [ ] Filtros avanzados en tabla jugadores
- [ ] Exportación/importación de datos
- [ ] Historial de cambios por jugador
- [ ] Comparación de jugadores
- [ ] Gráficos de evolución

### Fase 3: Script Python OCR (Pendiente)
- [ ] Sistema de extracción automática desde capturas
- [ ] Integración con base de datos
- [ ] Procesamiento de imágenes
- [ ] Matching inteligente de jugadores

## 💡 Notas Técnicas

- **Compatible** con todos los navegadores modernos
- **Sin dependencias externas** (Vanilla JS)
- **Optimizado** para rendimiento
- **Escalable** para hasta 200+ jugadores
- **Mantenible** con código modular

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crear un issue en el repositorio con:
- Descripción detallada del problema
- Pasos para reproducir
- Navegador y versión
- Capturas de pantalla si aplica

---

**✨ Sistema implementado con éxito - Fase 1 completada al 100%** 