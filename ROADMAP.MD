# ✅ Checklist Web App – Gossamer

## 🔐 Auth
- [x] Login  
- [x] Register  
- [x] Recuperar contraseña (flujo + emails de reset)  
- [x] Validación de email (confirmación vía Memberstack / Supabase) *(recomendado)*  
- [x] Manejo de sesiones expiradas y auto-logout seguro *(recomendado)*  

---

## 🧭 Onboarding
- [ ] **Connect broker**  
  - [ ] Ingresar lista de brokers permitidos  
  - [ ] Validar conexión vía API de SnapTrade (o servicio correspondiente)  
  - [ ] Guardar la conexión en Supabase asociada al usuario  

- [ ] **Select plan**  
  - [ ] Conectar con **Memberstack** (planes, precios, upgrades/downgrades)  
  - [ ] Validar estado de suscripción en tiempo real (activo, vencido, pendiente)  
  - [ ] Redirección al dashboard solo si el plan está activo  

---

## 📊 Dashboard
- [ ] **Home**  
  - [ ] Conectar datos reales (Supabase, brokers, señales activas, métricas principales)  
  - [ ] Definir métricas a mostrar (balance, rendimiento, últimas señales, etc.)  

- [x] **My Models**  

- [x] **Signal**  

- [ ] **Knowledge base**  
  - [x] Conectado a Supabase  
  - [ ] Subir información real (FAQ, tutoriales, documentación interna)  
  - [ ] Implementar buscador (opcional pero recomendado)  

- [x] **Broker (detalle de conexión individual ya funciona)**  

- [ ] **Brokers (lista completa)**  
  - [ ] Ingresar lista de brokers permitidos  
  - [ ] Mostrar estado de conexión de cada broker  

- [ ] **Support**  
  - [ ] Conectar con **GoHighLevel** para tickets/conversaciones  
  - [ ] Mostrar historial de interacciones al usuario  

- [ ] **Settings**  
  - [ ] Construir la página (perfil, notificaciones, idioma, etc.)  
  - [ ] Conectar con Memberstack para sincronizar nombre, email, plan  
  - [ ] Opción para cambiar contraseña (si no se hace desde auth)  
  - [ ] Opción de desconectar broker / borrar cuenta *(recomendado)*  

---

## ⚙️ Infraestructura y Seguridad
- [ ] Integrar roles/permissions en Memberstack (ej. admin, usuario, premium)  
- [ ] Validar acceso seguro a datos en Supabase (RLS policies bien configuradas)  
- [ ] Manejo de errores global en Next.js (páginas 404 / 500 personalizadas)  
- [ ] Logs de errores en frontend (ej: Sentry) *(recomendado)*  
- [ ] Protección de rutas (middleware Next.js que valide auth antes de entrar al dashboard)  

---

## 📦 Extras / Futuro
- [ ] Notificaciones (emails y dentro del dashboard: nuevas señales, cambios de plan, etc.)  
- [ ] Integración con Stripe vía Memberstack (si no está ya listo)  
- [ ] QA de usabilidad en móvil (responsivo y performance en Lighthouse)  
- [ ] Documentación interna del flujo de datos (Memberstack ⇔ Supabase ⇔ Next.js)  
