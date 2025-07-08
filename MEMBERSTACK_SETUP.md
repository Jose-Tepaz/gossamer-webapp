# Configuración de Memberstack

## 🚀 Pasos para configurar Memberstack

### 1. Crear cuenta en Memberstack
1. Ve a [Memberstack](https://memberstack.com) y crea una cuenta
2. Crea un nuevo proyecto/aplicación
3. Obtén tus API keys del dashboard

### 2. Configurar variables de entorno
1. Copia el archivo `env.template` a `.env.local`
2. Reemplaza los valores placeholder con tus keys reales:

```bash
# En .env.local
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_tu_public_key_aqui
MEMBERSTACK_SECRET_KEY=sk_tu_secret_key_aqui
```

### 3. Configurar planes de suscripción (opcional)
En el dashboard de Memberstack, crea estos planes:
- **Free**: Plan gratuito básico
- **Pro**: Plan profesional
- **Premium**: Plan premium

### 4. Configurar campos personalizados
En Memberstack, configura estos campos personalizados:
- `firstName` (string)
- `lastName` (string)

### 5. Configurar dominio permitido
En las configuraciones de Memberstack:
- Agrega `localhost:3000` para desarrollo
- Agrega tu dominio de producción cuando deploys

## 🔧 Funcionalidades implementadas

### ✅ Autenticación completa
- **Login**: Formulario con validación y estados de carga
- **Registro**: Formulario con campos personalizados
- **Logout**: Función para cerrar sesión
- **Protección de rutas**: Componente ProtectedRoute
- **Persistencia**: Sesión automática entre recargas

### ✅ Gestión de usuarios
- **Datos del usuario**: Nombre, email, plan de suscripción
- **Estados de carga**: Spinners y estados de loading
- **Manejo de errores**: Mensajes de error claros
- **Redirección automática**: Después de login/registro

### ✅ Integración con UI
- **Sidebar**: Muestra información del usuario y plan
- **Dashboard**: Datos reales del usuario autenticado
- **Responsive**: Funciona en desktop y móvil

## 🧪 Cómo probar

### Sin API keys (modo demo)
La aplicación funcionará pero mostrará errores de conexión. Los formularios están listos para cuando agregues las keys.

### Con API keys configuradas
1. Agrega tus keys a `.env.local`
2. Reinicia el servidor: `npm run dev`
3. Ve a `/register` para crear una cuenta
4. Ve a `/login` para iniciar sesión
5. Serás redirigido a `/dashboard` automáticamente

## 🔍 Debugging

### Errores comunes
- **"Invalid API key"**: Verifica que las keys estén correctas
- **"Domain not allowed"**: Agrega tu dominio en Memberstack
- **"Network error"**: Verifica tu conexión a internet

### Logs útiles
Los errores se muestran en:
- Console del navegador (F12)
- Mensajes de error en los formularios
- Terminal del servidor

## 📝 Próximos pasos

1. **Configurar webhooks**: Para sincronizar datos con Airtable
2. **Implementar reset de contraseña**: Página de recuperación
3. **Agregar más validaciones**: Campos adicionales
4. **Configurar planes de pago**: Integración con Stripe
5. **Personalizar emails**: Templates de Memberstack

## 🆘 Soporte

Si tienes problemas:
1. Revisa la [documentación de Memberstack](https://docs.memberstack.com)
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el dominio esté permitido en Memberstack
4. Revisa los logs del navegador y servidor 