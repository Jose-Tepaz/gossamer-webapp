# 🚀 Setup Guide - Financial App

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:
- Node.js 18+ instalado
- npm o yarn como gestor de paquetes
- Cuentas en los siguientes servicios:
  - [Memberstack](https://memberstack.com)
  - [SnapTrade](https://snaptrade.com)
  - [Airtable](https://airtable.com)

## 🔧 Configuración del Entorno

### 1. Clonar Variables de Entorno

```bash
# Copia el archivo template
cp env.template .env.local
```

### 2. Configurar Memberstack

1. Ve a tu dashboard de Memberstack
2. Navega a **Settings > API Keys**
3. Copia las siguientes claves:
   - **Public Key** → `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY`
   - **Secret Key** → `MEMBERSTACK_SECRET_KEY`

### 3. Configurar SnapTrade

1. Regístrate en [SnapTrade Developer Portal](https://snaptrade.com/developers)
2. Crea una nueva aplicación
3. Obtén las credenciales:
   - **Client ID** → `NEXT_PUBLIC_SNAPTRADE_CLIENT_ID`
   - **Consumer Key** → `SNAPTRADE_CONSUMER_KEY`
   - **Consumer Secret** → `SNAPTRADE_CONSUMER_SECRET`

### 4. Configurar Airtable

1. Ve a tu cuenta de Airtable
2. Crea una nueva base con el nombre "Financial App"
3. Configura las siguientes tablas:

#### Tabla: **Users**
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

#### Tabla: **Investment_Models**
```
- id (Primary Key)
- user_id (Link to Users)
- name (Text)
- description (Long Text)
- allocations (Long Text - JSON format)
- total_percentage (Number)
- created_at (Date)
- updated_at (Date)
- is_active (Checkbox)
```

#### Tabla: **Portfolios**
```
- id (Primary Key)
- user_id (Link to Users)
- broker_name (Text)
- account_id (Text)
- account_type (Single Select: Individual, Joint, IRA, etc.)
- total_value (Currency)
- last_sync (Date)
- positions (Long Text - JSON format)
- created_at (Date)
- updated_at (Date)
```

#### Tabla: **Transactions**
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

#### Tabla: **User_Settings**
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

4. Obtén las credenciales de Airtable:
   - Ve a **Account > API**
   - Genera un **Personal Access Token** → `AIRTABLE_API_KEY`
   - Copia el **Base ID** de tu base → `AIRTABLE_BASE_ID`

### 5. Archivo .env.local Final

Tu archivo `.env.local` debería verse así:

```env
# MEMBERSTACK
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_1234567890abcdef
MEMBERSTACK_SECRET_KEY=sk_1234567890abcdef

# SNAPTRADE
NEXT_PUBLIC_SNAPTRADE_CLIENT_ID=your_actual_client_id
SNAPTRADE_CONSUMER_KEY=your_actual_consumer_key
SNAPTRADE_CONSUMER_SECRET=your_actual_consumer_secret

# AIRTABLE
AIRTABLE_API_KEY=patABCDEF1234567890
AIRTABLE_BASE_ID=appXYZ1234567890

# APPLICATION
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Ejecutar el Proyecto

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔍 Verificar la Configuración

Una vez que tengas todas las variables configuradas, puedes verificar que todo funciona:

1. **Memberstack**: Las páginas de auth deberían cargar sin errores
2. **SnapTrade**: La página de conexión con brokers debería mostrar los brokers disponibles
3. **Airtable**: Los datos deberían guardarse y recuperarse correctamente

## 🆘 Solución de Problemas

### Error: "Missing environment variables"
- Verifica que el archivo `.env.local` esté en la raíz del proyecto
- Asegúrate de que todas las variables estén configuradas
- Reinicia el servidor de desarrollo después de cambiar las variables

### Error: "Memberstack authentication failed"
- Verifica que las claves de Memberstack sean correctas
- Asegúrate de que el dominio esté configurado en Memberstack

### Error: "SnapTrade API error"
- Verifica las credenciales de SnapTrade
- Asegúrate de que tu aplicación esté aprobada en SnapTrade

### Error: "Airtable connection failed"
- Verifica que el API key y Base ID sean correctos
- Asegúrate de que las tablas existan con los nombres exactos

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
- [Documentación de Memberstack](https://developers.memberstack.com/)
- [Documentación de SnapTrade](https://docs.snaptrade.com/)
- [Documentación de Airtable](https://airtable.com/developers/web/api/introduction) 