# 🏔️ Sistema de Gestión para Cantera

Sistema integral de gestión de operaciones para canteras de materiales de construcción.

## 🚀 Características Principales

### 📊 Dashboard en Tiempo Real
- KPIs de pedidos activos, ventas diarias, vehículos en planta y toneladas procesadas
- Visualización de actividad reciente
- Métricas actualizadas automáticamente

### 📋 Gestión de Pedidos
- Creación y seguimiento de pedidos
- Estados: Pendiente → En Proceso → Completado → Entregado
- Filtros avanzados por estado, cliente y fechas
- Control de cantidades entregadas vs pedidas

### ⚖️ Sistema de Báscula Integrado
- Pesaje de entrada (vehículo vacío)
- Pesaje de salida (vehículo cargado)
- Cálculo automático de peso neto
- Vinculación directa con pedidos
- Tickets de pesaje imprimibles

### 👥 Gestión de Clientes
- Registro completo de información
- Control de límites de crédito
- Información de contacto y facturación

### 🪨 Catálogo de Materiales
- Arena, Grava, Piedra, Roca, Triturado
- Precios por tonelada
- Control de inventario
- Descripciones detalladas

### 🚛 Control de Vehículos
- Registro de camiones y volquetas
- Capacidades de carga
- Conductores asignados
- Estados de disponibilidad

### 📈 Reportes y Análisis
- Filtros por períodos
- Estadísticas de ventas y producción
- Desglose por material
- Exportación a CSV
- Reportes imprimibles

## 🔐 Usuarios del Sistema

### Administrador
- **Usuario:** admin
- **Contraseña:** admin123
- **Acceso:** Completo a todos los módulos

### Operador
- **Usuario:** operador
- **Contraseña:** operador123
- **Acceso:** Pedidos y báscula

### Operador de Báscula
- **Usuario:** bascula
- **Contraseña:** bascula123
- **Acceso:** Sistema de pesaje

## 💾 Datos de Demostración

El sistema incluye datos precargados:
- 2 clientes de ejemplo
- 4 materiales de construcción
- 2 vehículos registrados

## 🛠️ Tecnologías

- HTML5
- JavaScript (Vanilla)
- Tailwind CSS
- LocalStorage para persistencia

## 📱 Características Técnicas

- Interfaz responsive (móvil, tablet, escritorio)
- Persistencia de datos en navegador
- Tickets imprimibles
- Exportación de reportes
- Validaciones de datos
- Cálculos automáticos

## 🎯 Flujo de Trabajo

1. **Crear Pedido** → Cliente solicita material
2. **Pesaje de Entrada** → Vehículo vacío entra a planta
3. **Carga de Material** → Se carga el material solicitado
4. **Pesaje de Salida** → Vehículo cargado sale de planta
5. **Cálculo Automático** → Sistema calcula peso neto y actualiza pedido
6. **Ticket** → Se genera ticket imprimible con toda la información

## 📖 Uso

Simplemente abra `index.html` en un navegador moderno. No requiere instalación de servidor.

## 🌐 Basado en Mejores Prácticas

Este sistema fue diseñado siguiendo las mejores prácticas de la industria de gestión de canteras, incluyendo:
- Integración con básculas
- Gestión de órdenes de trabajo
- Control de inventario
- Trazabilidad completa
- Reportes de producción

---

**Desarrollado para gestión eficiente de operaciones en canteras**
