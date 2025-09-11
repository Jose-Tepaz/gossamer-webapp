# 💰 Financial Web App - Roadmap & Checklist

## 📋 Contexto del Proyecto

### Descripción
Web app financiera desarrollada con **Next.js** que permite a los usuarios conectar sus cuentas de broker, visualizar sus portafolios y crear modelos de inversión personalizados.

### Tecnologías Principales
- **Next.js 14** - Framework React fullstack con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **ShadCN UI** - Componentes UI accesibles y personalizables
- **Memberstack** - Autenticación, membresías y gestión de usuarios
- **SnapTrade API** - Conexión con brokers y gestión de activos financieros
- **Supabase** - Base de datos PostgreSQL para almacenar modelos de inversión, configuraciones y datos de usuario

### Funcionalidades Principales
Los usuarios podrán:
- ✅ Registrarse e iniciar sesión con Memberstack
- ✅ Conectar su cuenta de broker mediante SnapTrade
- ✅ Visualizar sus activos actuales
- ✅ Crear modelos de inversión personalizados
- ✅ Aplicar estos modelos a su cartera para ajustar la distribución de activos

### Flujo de la Aplicación

#### Páginas Principales
1. **Auth** - Login / Register / Forgot Password
2. **Onboarding** - Pasos para activar cuenta (solo alta nueva)
3. **Connect a Broker** - UI de conexiones con SnapTrade
4. **Choose a Plan** - Selección de planes con Memberstack
5. **Dashboard** - Resumen: conexiones, modelos, estado plan
6. **Vista por Broker** - Lista de assets, Add/Edit Model, Trade
7. **My Models** - CRUD completo de modelos de inversión
8. **Knowledge Base** - Base de conocimientos
9. **Support** - Sistema de soporte
10. **Settings** - Configuraciones de usuario

---

## 🗂️ Estructura de Carpetas Planificada

gossamer-webapp/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   ├── connect-broker/
│   │   │   └── page.tsx
│   │   ├── choose-plan/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── broker/
│   │   │   ├── [brokerId]/
│   │   │   │   ├── assets/
│   │   │   │   ├── models/
│   │   │   │   └── trade/
│   │   │   └── page.tsx
│   │   ├── models/
│   │   │   ├── create/
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   ├── knowledge-base/
│   │   │   └── page.tsx
│   │   ├── support/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── snaptrade/
│   │   │   ├── memberstack/
│   │   │   └── airtable/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (ShadCN components)
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── broker-connection/
│   │   ├── plan-selection/
│   │   ├── dashboard/
│   │   ├── broker-view/
│   │   ├── models/
│   │   ├── knowledge-base/
│   │   ├── support/
│   │   ├── settings/
│   │   ├── layout/
│   │   └── common/
│   ├── lib/
│   │   ├── memberstack.ts
│   │   ├── snaptrade.ts
│   │   ├── airtable.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── snaptrade.ts
│   │   ├── models.ts
│   │   └── broker.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSnapTrade.ts
│   │   ├── useSupabase.ts
│   │   ├── useModels.ts
│   │   └── useBroker.ts
│   └── store/
│       ├── authStore.ts
│       ├── portfolioStore.ts
│       └── brokerStore.ts
├── public/
├── .env.local
├── .env.example
└── package.json
```

---

## 🗄️ Estructura de Base de Datos Supabase

### Tablas Principales

#### 1. **user_data** (Datos de Usuario)
```
- id (Primary Key - UUID)
- user_id (Text) - ID de Memberstack
- email (Text)
- first_name (Text)
- last_name (Text)
- user_secret (Text) - ID de SnapTrade
- created_at (Timestamp with time zone)
- updated_at (Timestamp with time zone)
```

#### 2. **Investment_Models** (Modelos de Inversión)
```
- id (Primary Key)
- user_id (Link to Users)
- name (Text)
- description (Long Text)
- allocations (JSON - Array of {symbol, percentage})
- total_percentage (Number)
- created_at (Date)
- updated_at (Date)
- is_active (Checkbox)
```

#### 3. **Portfolios** (Portafolios)
```
- id (Primary Key)
- user_id (Link to Users)
- broker_name (Text)
- account_id (Text)
- account_type (Single Select: Individual, Joint, IRA, etc.)
- total_value (Currency)
- last_sync (Date)
- positions (JSON - Array of positions)
- created_at (Date)
- updated_at (Date)
```

#### 4. **Transactions** (Transacciones)
```
- id (Primary Key)
- user_id (Link to Users)
- portfolio_id (Link to Portfolios)
- type (Single Select: Buy, Sell, Dividend, etc.)
- symbol (Text)
- quantity (Number)
- price (Currency)
- total_amount (Currency)
- transaction_date (Date)
- created_at (Date)
```

#### 5. **User_Settings** (Configuraciones de Usuario)
```
- id (Primary Key)
- user_id (Link to Users)
- notifications_enabled (Checkbox)
- email_alerts (Checkbox)
- default_currency (Single Select: USD, EUR, etc.)
- risk_tolerance (Single Select: Conservative, Moderate, Aggressive)
- investment_goals (Multiple Select)
- created_at (Date)
- updated_at (Date)
```

---

## ✅ CHECKLIST DE DESARROLLO

### **FASE 1: Configuración Inicial** 
- [x] **1.1** Crear proyecto Next.js con TypeScript y Tailwind
- [x] **1.2** Instalar y configurar ShadCN UI
- [x] **1.3** Instalar dependencias principales
- [x] **1.4** Configurar estructura de carpetas
- [x] **1.5** Configurar variables de entorno
- [x] **1.6** Crear archivo .env.example

### **FASE 2: Servicios Externos**
- [ ] **2.1** Configurar cuenta Memberstack
- [ ] **2.2** Obtener API keys de Memberstack
- [ ] **2.3** Configurar planes de suscripción en Memberstack
- [ ] **2.4** Registrarse en SnapTrade
- [ ] **2.5** Obtener credenciales API de SnapTrade
- [ ] **2.6** Configurar webhooks de SnapTrade
- [ ] **2.7** Configurar base de datos Supabase
- [ ] **2.8** Crear tablas en Supabase (user_data, Investment Models, Portfolios, Transactions)
- [ ] **2.9** Obtener API keys de Supabase

### **FASE 3: Componentes Base y Layout**
- [x] **3.1** Instalar componentes ShadCN necesarios
- [x] **3.2** Crear layout principal
- [x] **3.3** Crear componente Header
- [ ] **3.4** Crear componente Sidebar
- [x] **3.5** Crear componente Footer
- [x] **3.6** Configurar navegación básica
- [ ] **3.7** Crear componentes de navegación comunes

### **FASE 4: Sistema de Autenticación**
- [ ] **4.1** Configurar Memberstack en el proyecto
- [ ] **4.2** Crear página de login
- [ ] **4.3** Crear página de registro
- [ ] **4.4** Crear página de recuperación de contraseña
- [ ] **4.5** Implementar middleware de protección de rutas
- [ ] **4.6** Crear hooks de autenticación
- [ ] **4.7** Implementar manejo de estado de usuario

### **FASE 5: Onboarding y Flujo de Activación**
- [ ] **5.1** Crear página de onboarding
- [ ] **5.2** Implementar pasos de activación de cuenta
- [ ] **5.3** Crear flujo de verificación de email
- [ ] **5.4** Implementar redirección post-registro
- [ ] **5.5** Crear componentes de progreso de onboarding

### **FASE 6: Conexión con Brokers**
- [ ] **6.1** Configurar cliente SnapTrade
- [ ] **6.2** Crear página de conexión con broker
- [ ] **6.3** Implementar flujo OAuth de SnapTrade
- [ ] **6.4** Crear confirmación de conexión exitosa
- [ ] **6.5** Implementar servicio para obtener cuentas
- [ ] **6.6** Implementar servicio para obtener posiciones
- [ ] **6.7** Implementar servicio para obtener historial
- [ ] **6.8** Crear componentes de selección de broker

### **FASE 7: Sistema de Planes y Suscripciones**
- [ ] **7.1** Crear página de selección de planes
- [ ] **7.2** Integrar pagos con Memberstack
- [ ] **7.3** Implementar restricciones por plan
- [ ] **7.4** Crear página de gestión de suscripción
- [ ] **7.5** Implementar comparación de planes
- [ ] **7.6** Crear componentes de pricing

### **FASE 8: Dashboard Principal**
- [ ] **8.1** Crear layout del dashboard
- [ ] **8.2** Implementar resumen de conexiones
- [ ] **8.3** Mostrar estado del plan actual
- [ ] **8.4** Crear vista de modelos activos
- [ ] **8.5** Implementar widgets de resumen
- [ ] **8.6** Agregar gráficos básicos
- [ ] **8.7** Crear componentes de estadísticas

### **FASE 9: Vista por Broker**
- [ ] **9.1** Crear layout de vista por broker
- [ ] **9.2** Implementar lista de assets
- [ ] **9.3** Crear funcionalidad Add/Edit Model
- [ ] **9.4** Implementar funcionalidad Trade
- [ ] **9.5** Crear componentes de tabla de activos
- [ ] **9.6** Implementar filtros y búsqueda
- [ ] **9.7** Crear componentes de gráficos por broker

### **FASE 10: Gestión de Modelos (CRUD)**
- [ ] **10.1** Crear página principal de modelos
- [ ] **10.2** Implementar formulario de creación de modelos
- [ ] **10.3** Implementar edición de modelos
- [ ] **10.4** Implementar eliminación de modelos
- [ ] **10.5** Crear listado de modelos
- [ ] **10.6** Implementar comparación cartera vs modelo
- [ ] **10.7** Calcular y mostrar diferencias
- [ ] **10.8** Sugerir ajustes de cartera
- [ ] **10.9** Crear componentes de formularios de modelo

### **FASE 11: Knowledge Base**
- [ ] **11.1** Crear página de Knowledge Base
- [ ] **11.2** Implementar sistema de categorías
- [ ] **11.3** Crear componentes de búsqueda
- [ ] **11.4** Implementar sistema de artículos
- [ ] **11.5** Crear componentes de navegación de KB
- [ ] **11.6** Implementar sistema de favoritos

### **FASE 12: Sistema de Soporte**
- [ ] **12.1** Crear página de soporte
- [ ] **12.2** Implementar formulario de contacto
- [ ] **12.3** Crear sistema de tickets
- [ ] **12.4** Implementar chat en vivo (opcional)
- [ ] **12.5** Crear FAQ dinámico
- [ ] **12.6** Implementar sistema de feedback

### **FASE 13: Configuraciones de Usuario**
- [ ] **13.1** Crear página de settings
- [ ] **13.2** Implementar configuración de perfil
- [ ] **13.3** Crear configuración de notificaciones
- [ ] **13.4** Implementar configuración de seguridad
- [ ] **13.5** Crear configuración de preferencias
- [ ] **13.6** Implementar exportación de datos

### **FASE 14: Optimización y Testing**
- [ ] **14.1** Implementar loading states
- [ ] **14.2** Implementar error handling
- [ ] **14.3** Optimizar responsive design
- [ ] **14.4** Optimizar performance
- [ ] **14.5** Testing de componentes
- [ ] **14.6** Testing de integración
- [ ] **14.7** Preparar para deployment

### **FASE 15: Deployment**
- [ ] **15.1** Configurar deployment en Vercel
- [ ] **15.2** Configurar variables de entorno de producción
- [ ] **15.3** Testing en producción
- [ ] **15.4** Documentación final

---

## 📦 Dependencias a Instalar

### Dependencias Principales
```bash
# ShadCN UI
npx shadcn-ui@latest init

# Memberstack
npm install @memberstack/admin @memberstack/dom

# Supabase
npm install @supabase/supabase-js

# HTTP Client
npm install axios

# Iconos
npm install lucide-react

# Validaciones
npm install zod

# Manejo de formularios
npm install react-hook-form @hookform/resolvers

# Estado global (opcional)
npm install zustand

# Utilidades de fecha
npm install date-fns
```

### Dependencias de Desarrollo
```bash
npm install -D @types/node
```

---

## 🔧 Variables de Entorno Necesarias

```env
# Memberstack
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=
MEMBERSTACK_SECRET_KEY=

# SnapTrade
NEXT_PUBLIC_SNAPTRADE_CLIENT_ID=
SNAPTRADE_CONSUMER_KEY=
SNAPTRADE_CONSUMER_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 📚 Recursos y Documentación

### Memberstack
- [Documentación oficial](https://developers.memberstack.com/admin-node-package/quick-start)
- [Guía de integración](https://developers.memberstack.com/)

### SnapTrade
- [Documentación API](https://docs.snaptrade.com/reference/API%20Status/ApiStatus_check)
- [Guía de integración](https://docs.snaptrade.com/)

### ShadCN UI
- [Documentación](https://ui.shadcn.com/)
- [Componentes](https://ui.shadcn.com/docs/components)

### Supabase
- [Documentación oficial](https://supabase.com/docs)
- [JavaScript SDK](https://supabase.com/docs/reference/javascript)
- [Guía de migración](https://supabase.com/docs/guides/migrations)

---

## 🎯 Próximos Pasos Inmediatos

1. **Completar FASE 3** - Terminar componentes base y navegación
2. **Configurar servicios externos** - Memberstack, SnapTrade y Supabase
3. **Implementar autenticación** - Sistema completo de login/registro
4. **Crear flujo de onboarding** - Pasos de activación de cuenta
5. **Desarrollar conexión con brokers** - Integración SnapTrade
6. **Implementar sistema de planes** - Integración Memberstack

---

*Última actualización: ${new Date().toLocaleDateString()}* 