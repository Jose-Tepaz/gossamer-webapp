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
- **Airtable** - Base de datos para almacenar modelos de inversión, configuraciones y datos de usuario

### Funcionalidades Principales
Los usuarios podrán:
- ✅ Registrarse e iniciar sesión con Memberstack
- ✅ Conectar su cuenta de broker mediante SnapTrade
- ✅ Visualizar sus activos actuales
- ✅ Crear modelos de inversión personalizados
- ✅ Aplicar estos modelos a su cartera para ajustar la distribución de activos

### Pantallas del Proyecto
1. **Pantalla de autenticación** - Login/Registro/Recuperar contraseña
2. **Conexión con broker** - Conectar cuenta de broker vía SnapTrade
3. **Selección de plan** - Mostrar y suscribirse a planes
4. **Dashboard principal** - Vista con tabs de activos y detalles
5. **Modelos de inversión** - Crear y aplicar modelos de distribución

---

## 🗂️ Estructura de Carpetas Planificada

```
financial-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── dashboard/
│   │   │   ├── assets/
│   │   │   ├── models/
│   │   │   └── settings/
│   │   ├── broker-connection/
│   │   ├── plans/
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
│   │   ├── dashboard/
│   │   ├── models/
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
│   │   └── models.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSnapTrade.ts
│   │   ├── useAirtable.ts
│   │   └── useModels.ts
│   └── store/
│       ├── authStore.ts
│       └── portfolioStore.ts
├── public/
├── .env.local
├── .env.example
└── package.json
```

---

## 🗄️ Estructura de Base de Datos Airtable

### Tablas Principales

#### 1. **Users** (Usuarios)
```
- id (Primary Key)
- memberstack_id (Text)
- email (Email)
- first_name (Text)
- last_name (Text)
- plan_type (Single Select: Free, Pro, Premium)
- created_at (Date)
- updated_at (Date)
- snaptrade_user_id (Text)
- is_broker_connected (Checkbox)
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
- [ ] **2.7** Configurar base de datos Airtable
- [ ] **2.8** Crear tablas en Airtable (Users, Investment Models, Portfolios, Transactions)
- [ ] **2.9** Obtener API key de Airtable

### **FASE 3: Componentes Base**
- [x] **3.1** Instalar componentes ShadCN necesarios
- [x] **3.2** Crear layout principal
- [x] **3.3** Crear componente Header
- [ ] **3.4** Crear componente Sidebar
- [x] **3.5** Crear componente Footer
- [x] **3.6** Configurar navegación básica

### **FASE 4: Sistema de Autenticación**
- [ ] **4.1** Configurar Memberstack en el proyecto
- [ ] **4.2** Crear página de login
- [ ] **4.3** Crear página de registro
- [ ] **4.4** Crear página de recuperación de contraseña
- [ ] **4.5** Implementar middleware de protección de rutas
- [ ] **4.6** Crear hooks de autenticación
- [ ] **4.7** Implementar manejo de estado de usuario

### **FASE 5: Integración SnapTrade**
- [ ] **5.1** Configurar cliente SnapTrade
- [ ] **5.2** Crear página de conexión con broker
- [ ] **5.3** Implementar flujo OAuth de SnapTrade
- [ ] **5.4** Crear confirmación de conexión exitosa
- [ ] **5.5** Implementar servicio para obtener cuentas
- [ ] **5.6** Implementar servicio para obtener posiciones
- [ ] **5.7** Implementar servicio para obtener historial

### **FASE 6: Dashboard Principal**
- [ ] **6.1** Crear layout del dashboard
- [ ] **6.2** Implementar sistema de tabs
- [ ] **6.3** Crear tab de activos conectados
- [ ] **6.4** Crear tab de detalles de inversiones
- [ ] **6.5** Implementar tabla de activos
- [ ] **6.6** Mostrar valores en tiempo real
- [ ] **6.7** Agregar gráficos básicos

### **FASE 7: Modelos de Inversión**
- [ ] **7.1** Crear página de modelos
- [ ] **7.2** Implementar formulario de creación de modelos
- [ ] **7.3** Implementar edición de modelos
- [ ] **7.4** Implementar eliminación de modelos
- [ ] **7.5** Crear listado de modelos
- [ ] **7.6** Implementar comparación cartera vs modelo
- [ ] **7.7** Calcular y mostrar diferencias
- [ ] **7.8** Sugerir ajustes de cartera

### **FASE 8: Sistema de Suscripciones**
- [ ] **8.1** Crear página de selección de planes
- [ ] **8.2** Integrar pagos con Memberstack
- [ ] **8.3** Implementar restricciones por plan
- [ ] **8.4** Crear página de gestión de suscripción

### **FASE 9: Optimización y Testing**
- [ ] **9.1** Implementar loading states
- [ ] **9.2** Implementar error handling
- [ ] **9.3** Optimizar responsive design
- [ ] **9.4** Optimizar performance
- [ ] **9.5** Testing de componentes
- [ ] **9.6** Testing de integración
- [ ] **9.7** Preparar para deployment

### **FASE 10: Deployment**
- [ ] **10.1** Configurar deployment en Vercel
- [ ] **10.2** Configurar variables de entorno de producción
- [ ] **10.3** Testing en producción
- [ ] **10.4** Documentación final

---

## 📦 Dependencias a Instalar

### Dependencias Principales
```bash
# ShadCN UI
npx shadcn-ui@latest init

# Memberstack
npm install @memberstack/admin @memberstack/dom

# Airtable
npm install airtable

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

# Airtable
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

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

### Airtable
- [Documentación API](https://airtable.com/developers/web/api/introduction)
- [JavaScript SDK](https://github.com/Airtable/airtable.js)

---

## 🎯 Próximos Pasos Inmediatos

1. **Configurar ShadCN UI** - Inicializar y configurar componentes base
2. **Instalar dependencias** - Agregar todas las librerías necesarias
3. **Crear estructura de carpetas** - Organizar el proyecto
4. **Configurar variables de entorno** - Preparar configuración

---

*Última actualización: ${new Date().toLocaleDateString()}* 