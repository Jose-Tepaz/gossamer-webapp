# 🔐 GUÍA DE SEGURIDAD - Financial App

## ⚠️ INFORMACIÓN CRÍTICA QUE NUNCA DEBE SUBIRSE A GITHUB

### 🚨 **ARCHIVOS PROHIBIDOS**

#### **1. Variables de Entorno**
```bash
# ❌ NUNCA subir estos archivos:
.env
.env.local
.env.development.local
.env.production.local
.env.test.local
```

#### **2. API Keys y Secretos**
```bash
# ❌ NUNCA subir claves reales:
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_1234567890abcdef
MEMBERSTACK_SECRET_KEY=sk_1234567890abcdef
AIRTABLE_API_KEY=patABCDEF1234567890
SNAPTRADE_CONSUMER_SECRET=your_actual_secret
```

#### **3. Datos Financieros**
```bash
# ❌ NUNCA subir datos reales de usuarios:
user-data/
portfolio-data/
transaction-data/
financial-reports/
market-data/
```

#### **4. Configuraciones de Producción**
```bash
# ❌ NUNCA subir configuraciones de producción:
production-config.json
database-credentials.json
ssl-certificates/
```

---

## ✅ **LO QUE SÍ PUEDES SUBIR**

### **Archivos Seguros**
```bash
# ✅ Estos archivos SÍ son seguros:
README.md
package.json
src/
components/
pages/
public/
.gitignore
env.template          # ← Template SIN datos reales
```

### **Ejemplos de Datos Falsos**
```bash
# ✅ Datos de ejemplo/demo son seguros:
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_sb_demo_key_here
AIRTABLE_API_KEY=your_api_key_here
EMAIL=demo@example.com
```

---

## 🛡️ **MEJORES PRÁCTICAS**

### **1. Antes de Hacer Commit**
```bash
# Siempre verifica que no hay datos sensibles:
git status
git diff --cached

# Busca patrones peligrosos:
grep -r "pk_sb_" .
grep -r "pat[A-Z]" .
grep -r "sk_" .
```

### **2. Si Accidentalmente Subes Algo Sensible**
```bash
# 🚨 ACCIÓN INMEDIATA:
# 1. Cambiar TODAS las claves comprometidas
# 2. Revocar tokens en los servicios
# 3. Limpiar el historial de Git

# Limpiar archivo del historial:
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/sensitive/file' \
  --prune-empty --tag-name-filter cat -- --all
```

### **3. Configurar Servicios**
```bash
# Memberstack: Regenerar claves
# Airtable: Revocar token y crear nuevo
# SnapTrade: Cambiar credenciales
```

---

## 🔍 **VERIFICACIÓN DE SEGURIDAD**

### **Lista de Verificación**
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay API keys reales en el código
- [ ] `env.template` solo tiene placeholders
- [ ] No hay datos de usuarios reales
- [ ] No hay credenciales de base de datos
- [ ] No hay certificados SSL

### **Comandos de Verificación**
```bash
# Buscar posibles API keys:
grep -r "pk_sb_" . --exclude-dir=node_modules
grep -r "sk_" . --exclude-dir=node_modules
grep -r "pat[A-Z]" . --exclude-dir=node_modules

# Verificar archivos sensibles:
find . -name "*.env*" -not -path "./node_modules/*"
find . -name "*secret*" -not -path "./node_modules/*"
find . -name "*key*" -not -path "./node_modules/*"
```

---

## 📋 **CHECKLIST ANTES DE SUBIR A GITHUB**

### **Antes de cada commit:**
1. [ ] Revisar `git status` y `git diff`
2. [ ] Verificar que `.env.local` no está incluido
3. [ ] Confirmar que no hay API keys reales
4. [ ] Verificar que no hay datos de usuarios
5. [ ] Revisar que solo hay placeholders en templates

### **Antes del primer push:**
1. [ ] Configurar `.gitignore` correctamente
2. [ ] Crear `env.template` con placeholders
3. [ ] Documentar qué variables se necesitan
4. [ ] Verificar que el repositorio es privado (si es necesario)

### **Regularmente:**
1. [ ] Rotar API keys cada 3-6 meses
2. [ ] Revisar logs de acceso a APIs
3. [ ] Verificar que no hay commits con datos sensibles
4. [ ] Actualizar documentación de seguridad

---

## 🆘 **EN CASO DE EMERGENCIA**

### **Si Expones Datos Sensibles:**
1. **INMEDIATAMENTE**: Cambiar todas las claves comprometidas
2. **REVOCAR**: Tokens y credenciales en todos los servicios
3. **NOTIFICAR**: Al equipo y servicios afectados
4. **DOCUMENTAR**: El incidente y las acciones tomadas
5. **PREVENIR**: Mejorar procesos para evitar repetición

### **Contactos de Emergencia:**
- Memberstack Support: [support@memberstack.com]
- Airtable Support: [support@airtable.com]
- SnapTrade Support: [support@snaptrade.com]

---

## 📞 **RECURSOS ADICIONALES**

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Memberstack Security](https://docs.memberstack.com/security)
- [Airtable Security](https://airtable.com/security)
- [SnapTrade Security](https://docs.snaptrade.com/security)

---

**⚠️ RECUERDA: La seguridad es responsabilidad de todos. Cuando tengas dudas, pregunta antes de subir.** 

# 1. Verificar en qué rama estás
git branch

# 2. Cambiar nombre de rama a main
git branch -M main

# 3. Hacer push a main
git push -u origin main 