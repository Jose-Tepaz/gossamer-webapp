# 📊 Documentación de API SnapTrade

## 🌐 Base URL
```
http://localhost:4000/api/snaptrade/
```

## 📋 Endpoints Disponibles

### 1. 🔐 **POST /register-user**
Registra un nuevo usuario en SnapTrade y obtiene el `userSecret` necesario para futuras operaciones.

#### **Request Body:**
```json
{
  "userId": "string" // ID único de Memberstack (user_id de Supabase)
}
```

#### **Response:**
```json
{
  "userSecret": "string" // Secreto del usuario que se debe guardar en Supabase
}
```

#### **Flujo:**
1. Se envía el `userId` (ID de Memberstack guardado en Supabase)
2. SnapTrade registra al usuario y devuelve un `userSecret`
3. **IMPORTANTE:** Guardar el `userSecret` en Supabase como `user_secret`

---

### 2. 🔗 **POST /connect-portal-url**
Autentica a un usuario de SnapTrade y devuelve la URL del Portal de Conexión para conectar cuentas de corretaje.

#### **Request Body:**
```json
{
  "userId": "string",           // ID único de Memberstack (user_id de Supabase)
  "userSecret": "string",       // Secreto del usuario (user_secret de Supabase)
  "broker": "string",           // Nombre del broker a conectar
  "immediateRedirect": boolean, // Si true, redirige al sitio del broker
  "customRedirect": "string",   // URL de redirección después de conectar
  "reconnect": "string"         // UUID de conexión para reconectar (opcional)
}
```

#### **Response:**
```json
{
  "portalUrl": "string" // URL del portal de conexión (expira en 5 minutos)
}
```

#### **Parámetros Detallados:**
- **`immediateRedirect`:** Si se configura como `true`, el usuario será redirigido al sitio web del socio en lugar del portal de conexión. Este parámetro se ignora si el portal de conexión se carga dentro de un iframe.
- **`customRedirect`:** URL a la que se redirigirá al usuario después de conectar su cuenta de corretaje. Este parámetro se ignora si el portal de conexión se carga dentro de un iframe.
- **`reconnect`:** El UUID de la conexión de corretaje que se reconectará. Este parámetro debe dejarse vacío a menos que se reconecta una conexión deshabilitada.

---

### 3. 📋 **GET /list-accounts**
Devuelve todas las cuentas de corretaje en todas las conexiones conocidas por SnapTrade para el usuario autenticado.

#### **Query Parameters:**
```
userId: string (required)     // ID único de Memberstack (user_id de Supabase)
userSecret: string (required) // Secreto del usuario (user_secret de Supabase)
```

#### **Request Example:**
```
GET /list-accounts?userId=ms_123456789&userSecret=secret_abc123
```

#### **Response:**
```json
{
  "accounts": [
    {
      "accountId": "uuid",
      "broker": "string",
      "accountName": "string",
      "status": "string",
      "connectedAt": "datetime"
    }
  ]
}
```

---

### 4. 💰 **GET /list-account-holdings**
Devuelve una lista de saldos, posiciones y órdenes recientes de la cuenta especificada.

#### **Query Parameters:**
```
accountId: string (uuid, required) // Identificador único de la cuenta de corretaje
userId: string (required)          // ID único de Memberstack (user_id de Supabase)
userSecret: string (required)      // Secreto del usuario (user_secret de Supabase)
```

#### **Request Example:**
```
GET /list-account-holdings?accountId=123e4567-e89b-12d3-a456-426614174000&userId=ms_123456789&userSecret=secret_abc123
```

#### **Response:**
```json
{
  "accountId": "uuid",
  "balances": [
    {
      "currency": "string",
      "amount": "number",
      "type": "string"
    }
  ],
  "positions": [
    {
      "symbol": "string",
      "quantity": "number",
      "marketValue": "number",
      "costBasis": "number"
    }
  ],
  "orders": [
    {
      "orderId": "string",
      "symbol": "string",
      "side": "string",
      "quantity": "number",
      "status": "string",
      "createdAt": "datetime"
    }
  ]
}
```

---

## 🔄 Flujo de Integración Completo

### **Paso 1: Registro de Usuario**
```typescript
// 1. Usuario se registra en Memberstack
const memberstackUser = await memberstack.signupMemberEmailPassword({...})

// 2. Se sincroniza con Supabase
await syncUserWithSupabase(memberstackUser)

// 3. Se registra en SnapTrade
const response = await fetch('http://localhost:4000/api/snaptrade/register-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: memberstackUser.id })
})

const { userSecret } = await response.json()

// 4. Se guarda el userSecret en Supabase
await updateUserSecret(memberstackUser.id, userSecret)
```

### **Paso 2: Conectar Broker**
```typescript
// 1. Obtener datos del usuario desde Supabase
const userData = await getUserDataFromSupabase(memberstackUserId)

// 2. Generar URL del portal de conexión
const response = await fetch('http://localhost:4000/api/snaptrade/connect-portal-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userData.user_id,
    userSecret: userData.user_secret,
    broker: 'etrade',
    immediateRedirect: false,
    customRedirect: 'https://tu-app.com/dashboard'
  })
})

const { portalUrl } = await response.json()

// 3. Redirigir al usuario al portal
window.location.href = portalUrl
```

### **Paso 3: Listar Cuentas**
```typescript
// Obtener todas las cuentas conectadas
const response = await fetch(`http://localhost:4000/api/snaptrade/list-accounts?userId=${userData.user_id}&userSecret=${userData.user_secret}`)
const { accounts } = await response.json()
```

### **Paso 4: Obtener Holdings**
```typescript
// Obtener detalles de una cuenta específica
const response = await fetch(`http://localhost:4000/api/snaptrade/list-account-holdings?accountId=${accountId}&userId=${userData.user_id}&userSecret=${userData.user_secret}`)
const holdings = await response.json()
```

---

## 🔐 Consideraciones de Seguridad

### **Variables de Entorno Necesarias:**
```env
# Backend
SNAPTRADE_CLIENT_ID=tu_client_id
SNAPTRADE_CLIENT_SECRET=tu_client_secret

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### **Manejo de Secretos:**
- **`userSecret`** debe almacenarse de forma segura en Supabase
- **Nunca** exponer `userSecret` en el frontend
- Usar API routes para operaciones que requieran `userSecret`

### **Validaciones:**
- Verificar que el usuario esté autenticado en Memberstack
- Verificar que exista `userSecret` en Supabase antes de hacer llamadas a SnapTrade
- Manejar errores de autenticación y conexión

---

## 📝 Notas Importantes

1. **URLs de Portal:** Las URLs del portal de conexión expiran en 5 minutos
2. **Reconexión:** Usar el parámetro `reconnect` solo para reconectar conexiones deshabilitadas
3. **Iframe:** Los parámetros `immediateRedirect` y `customRedirect` se ignoran si el portal se carga en iframe
4. **UserID:** No usar emails como `userId`, usar IDs únicos e inmutables
5. **Rotación de Secretos:** Si `userSecret` se ve comprometido, debe rotarse

---

## 🧪 Testing

### **Endpoints de Prueba:**
```bash
# 1. Registrar usuario
curl -X POST http://localhost:4000/api/snaptrade/register-user \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-123"}'

# 2. Conectar portal
curl -X POST http://localhost:4000/api/snaptrade/connect-portal-url \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-123", "userSecret": "secret", "broker": "etrade"}'

# 3. Listar cuentas
curl "http://localhost:4000/api/snaptrade/list-accounts?userId=test-user-123&userSecret=secret"

# 4. Obtener holdings
curl "http://localhost:4000/api/snaptrade/list-account-holdings?accountId=uuid&userId=test-user-123&userSecret=secret"
```
