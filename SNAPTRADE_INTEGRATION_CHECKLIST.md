# 📋 Checklist de Integración SnapTrade

## 🎯 Objetivo
Integrar SnapTrade con el sistema existente (Memberstack + Supabase) para permitir la conexión de cuentas de corretaje y gestión de inversiones.

---

## 📋 **FASE 1: Configuración y Preparación**

### **1.1 Variables de Entorno**
- [ ] Agregar `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000` al `.env.local`
- [ ] Verificar que el backend esté corriendo en `http://localhost:4000`
- [ ] Confirmar que los endpoints de SnapTrade estén funcionando

### **1.2 Verificación de Backend**
- [ ] Probar endpoint `/register-user` con Postman/curl
- [ ] Probar endpoint `/connect-portal-url` con Postman/curl
- [ ] Probar endpoint `/list-accounts` con Postman/curl
- [ ] Probar endpoint `/list-account-holdings` con Postman/curl

---

## 📋 **FASE 2: Tipos y Interfaces TypeScript**

### **2.1 Actualizar Tipos de SnapTrade**
- [ ] Revisar `src/types/snaptrade.ts` existente
- [ ] Agregar interfaces para los nuevos endpoints:
  - [ ] `SnapTradeRegisterUserRequest`
  - [ ] `SnapTradeRegisterUserResponse`
  - [ ] `SnapTradeConnectPortalRequest`
  - [ ] `SnapTradeConnectPortalResponse`
  - [ ] `SnapTradeAccount`
  - [ ] `SnapTradeAccountHoldings`
  - [ ] `SnapTradeBalance`
  - [ ] `SnapTradePosition`
  - [ ] `SnapTradeOrder`

### **2.2 Actualizar Tipos de Supabase**
- [ ] Verificar que `UserData` tenga el campo `user_secret`
- [ ] Agregar tipos para estados de conexión de broker
- [ ] Crear interfaces para manejo de errores de SnapTrade

---

## 📋 **FASE 3: Servicios y API**

### **3.1 Crear Servicio de SnapTrade**
- [ ] Crear/actualizar `src/lib/snaptrade-service.ts`
- [ ] Implementar función `registerUserInSnapTrade(userId: string)`
- [ ] Implementar función `getConnectPortalUrl(params: ConnectPortalParams)`
- [ ] Implementar función `getUserAccounts(userId: string, userSecret: string)`
- [ ] Implementar función `getAccountHoldings(accountId: string, userId: string, userSecret: string)`
- [ ] Agregar manejo de errores y logging

### **3.2 Crear API Routes (Opcional)**
- [ ] Crear `src/app/api/snaptrade/register/route.ts`
- [ ] Crear `src/app/api/snaptrade/connect-portal/route.ts`
- [ ] Crear `src/app/api/snaptrade/accounts/route.ts`
- [ ] Crear `src/app/api/snaptrade/holdings/route.ts`

---

## 📋 **FASE 4: Hooks y Estado**

### **4.1 Crear Hook de SnapTrade**
- [ ] Crear `src/hooks/useSnapTrade.ts`
- [ ] Implementar estado para:
  - [ ] `isRegistered` - Si el usuario está registrado en SnapTrade
  - [ ] `userSecret` - Secreto del usuario
  - [ ] `accounts` - Lista de cuentas conectadas
  - [ ] `selectedAccount` - Cuenta seleccionada
  - [ ] `holdings` - Holdings de la cuenta seleccionada
  - [ ] `loading` - Estado de carga
  - [ ] `error` - Errores

### **4.2 Funciones del Hook**
- [ ] `registerUser()` - Registrar usuario en SnapTrade
- [ ] `connectBroker(broker: string)` - Conectar broker
- [ ] `loadAccounts()` - Cargar cuentas del usuario
- [ ] `loadAccountHoldings(accountId: string)` - Cargar holdings
- [ ] `refreshData()` - Refrescar todos los datos

---

## 📋 **FASE 5: Integración con Autenticación**

### **5.1 Actualizar Sincronización de Usuario**
- [ ] Modificar `src/lib/memberstack-supabase-sync.ts`
- [ ] Agregar registro automático en SnapTrade después del registro en Memberstack
- [ ] Guardar `userSecret` en Supabase automáticamente
- [ ] Manejar errores de registro en SnapTrade

### **5.2 Actualizar Hook de Usuario**
- [ ] Modificar `src/hooks/useUserData.ts`
- [ ] Agregar función `getUserSecret()`
- [ ] Agregar función `updateUserSecret(secret: string)`
- [ ] Agregar función `isSnapTradeConnected()`

---

## 📋 **FASE 6: Componentes de UI**

### **6.1 Componente de Conexión de Broker**
- [ ] Crear `src/components/snaptrade/BrokerConnection.tsx`
- [ ] Implementar lista de brokers disponibles
- [ ] Implementar botón de conexión
- [ ] Implementar manejo de redirección al portal
- [ ] Implementar estado de conexión

### **6.2 Componente de Lista de Cuentas**
- [ ] Crear `src/components/snaptrade/AccountsList.tsx`
- [ ] Mostrar cuentas conectadas
- [ ] Implementar selección de cuenta
- [ ] Mostrar estado de cada cuenta
- [ ] Implementar botón de reconexión

### **6.3 Componente de Holdings**
- [ ] Crear `src/components/snaptrade/AccountHoldings.tsx`
- [ ] Mostrar balances por moneda
- [ ] Mostrar posiciones
- [ ] Mostrar órdenes recientes
- [ ] Implementar actualización automática

### **6.4 Componente de Dashboard**
- [ ] Crear `src/components/snaptrade/SnapTradeDashboard.tsx`
- [ ] Integrar todos los componentes anteriores
- [ ] Implementar navegación entre secciones
- [ ] Implementar estado de carga global

---

## 📋 **FASE 7: Páginas**

### **7.1 Página de Conexión de Broker**
- [ ] Crear `src/app/(protected)/connect-broker/page.tsx`
- [ ] Implementar flujo de conexión
- [ ] Manejar redirección desde portal
- [ ] Mostrar estado de conexión

### **7.2 Página de Cuentas**
- [ ] Crear `src/app/(protected)/accounts/page.tsx`
- [ ] Mostrar lista de cuentas
- [ ] Implementar gestión de cuentas
- [ ] Implementar reconexión

### **7.3 Página de Holdings**
- [ ] Crear `src/app/(protected)/holdings/page.tsx`
- [ ] Mostrar detalles de holdings
- [ ] Implementar filtros y búsqueda
- [ ] Implementar exportación de datos

---

## 📋 **FASE 8: Navegación y Layout**

### **8.1 Actualizar Sidebar**
- [ ] Agregar "Connect Broker" al menú
- [ ] Agregar "Accounts" al menú
- [ ] Agregar "Holdings" al menú
- [ ] Implementar indicadores de estado

### **8.2 Actualizar Dashboard Principal**
- [ ] Agregar resumen de cuentas conectadas
- [ ] Agregar resumen de holdings
- [ ] Implementar widgets de SnapTrade
- [ ] Mostrar estado de conexión

---

## 📋 **FASE 9: Manejo de Errores**

### **9.1 Errores de SnapTrade**
- [ ] Crear `src/lib/snaptrade-errors.ts`
- [ ] Definir tipos de errores específicos
- [ ] Implementar manejo de errores de API
- [ ] Implementar retry logic

### **9.2 Notificaciones**
- [ ] Implementar notificaciones de éxito
- [ ] Implementar notificaciones de error
- [ ] Implementar notificaciones de advertencia
- [ ] Implementar notificaciones de información

---

## 📋 **FASE 10: Testing y Validación**

### **10.1 Testing de Servicios**
- [ ] Probar `registerUserInSnapTrade()`
- [ ] Probar `getConnectPortalUrl()`
- [ ] Probar `getUserAccounts()`
- [ ] Probar `getAccountHoldings()`

### **10.2 Testing de Hooks**
- [ ] Probar `useSnapTrade` hook
- [ ] Probar estados de carga
- [ ] Probar manejo de errores
- [ ] Probar actualización de datos

### **10.3 Testing de Componentes**
- [ ] Probar `BrokerConnection` component
- [ ] Probar `AccountsList` component
- [ ] Probar `AccountHoldings` component
- [ ] Probar `SnapTradeDashboard` component

### **10.4 Testing de Flujo Completo**
- [ ] Probar registro de usuario
- [ ] Probar conexión de broker
- [ ] Probar listado de cuentas
- [ ] Probar visualización de holdings

---

## 📋 **FASE 11: Optimización y Mejoras**

### **11.1 Performance**
- [ ] Implementar cache de datos
- [ ] Implementar lazy loading
- [ ] Optimizar re-renders
- [ ] Implementar debouncing

### **11.2 UX/UI**
- [ ] Implementar loading states
- [ ] Implementar skeleton loaders
- [ ] Implementar animaciones
- [ ] Implementar responsive design

### **11.3 Seguridad**
- [ ] Validar inputs del usuario
- [ ] Implementar rate limiting
- [ ] Implementar sanitización
- [ ] Implementar logging de seguridad

---

## 📋 **FASE 12: Documentación y Deployment**

### **12.1 Documentación**
- [ ] Actualizar README.md
- [ ] Crear guía de usuario
- [ ] Documentar APIs
- [ ] Crear ejemplos de uso

### **12.2 Deployment**
- [ ] Configurar variables de entorno de producción
- [ ] Probar en staging
- [ ] Deploy a producción
- [ ] Monitorear errores

---

## 🎯 **Criterios de Éxito**

### **Funcionalidad Básica**
- [ ] Usuario puede registrarse en SnapTrade automáticamente
- [ ] Usuario puede conectar cuentas de broker
- [ ] Usuario puede ver sus cuentas conectadas
- [ ] Usuario puede ver holdings de sus cuentas

### **Experiencia de Usuario**
- [ ] Flujo de conexión es intuitivo
- [ ] Datos se cargan rápidamente
- [ ] Errores se manejan gracefully
- [ ] UI es responsive y accesible

### **Integración**
- [ ] SnapTrade se integra sin problemas con Memberstack
- [ ] Datos se sincronizan correctamente con Supabase
- [ ] No hay conflictos con funcionalidad existente
- [ ] Sistema es escalable y mantenible

---

## 📝 **Notas de Implementación**

### **Orden de Prioridad**
1. **Alta:** Fases 1-5 (Configuración, tipos, servicios, hooks, integración)
2. **Media:** Fases 6-8 (Componentes, páginas, navegación)
3. **Baja:** Fases 9-12 (Errores, testing, optimización, deployment)

### **Dependencias**
- Backend de SnapTrade debe estar funcionando
- Supabase debe estar configurado correctamente
- Memberstack debe estar funcionando
- Variables de entorno deben estar configuradas

### **Riesgos**
- SnapTrade API puede tener limitaciones de rate
- URLs de portal expiran en 5 minutos
- userSecret debe manejarse de forma segura
- Errores de conexión pueden afectar UX

---

## 🚀 **Próximos Pasos**

1. **Revisar checklist completo**
2. **Confirmar que backend está funcionando**
3. **Comenzar con Fase 1: Configuración y Preparación**
4. **Implementar paso a paso siguiendo el orden de prioridad**
5. **Probar cada fase antes de continuar**
6. **Documentar cualquier desviación del plan**
