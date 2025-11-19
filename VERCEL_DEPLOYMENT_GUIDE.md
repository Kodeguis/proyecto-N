# 🌹 Proyecto Nicolinda - Instrucciones de Despliegue en Vercel

## 📋 Pasos para importar el proyecto en Vercel con el nombre "nicolinda"

### 1. **Acceder a Vercel**
- Ve a [vercel.com](https://vercel.com)
- Inicia sesión con tu cuenta

### 2. **Importar Proyecto**
- Haz clic en "New Project" o "Nuevo Proyecto"
- Selecciona "Import Git Repository" o "Importar Repositorio de Git"

### 3. **Conectar GitHub**
- Busca el repositorio: `Kodeguis/proyecto-N`
- Si no aparece, asegúrate de que tu cuenta de GitHub esté conectada

### 4. **Configurar el Proyecto**
**Nombre del proyecto:** `nicolinda` (¡IMPORTANTE! Usa este nombre exacto)

**Configuración del Framework:**
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 5. **Variables de Entorno (IMPORTANTE)**
Necesitas agregar estas variables de entorno desde la configuración de Supabase:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

**Para obtener estos datos:**
1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia la URL y la anon key

### 6. **Deploy**
- Haz clic en "Deploy" o "Desplegar"
- Espera a que termine el proceso

### 7. **Verificar**
Una vez completado, tu aplicación estará disponible en:
**`https://nicolinda.vercel.app`**

## 🎯 Funcionalidades Implementadas

✅ **Sistema de puntos en tiempo real** - Sincronización entre admin y usuarios  
✅ **Desbloqueo por calendario** - Mensajes diarios se desbloquean progresivamente  
✅ **Panel de administración** - Gestión completa de usuarios y puntos  
✅ **Trivia romántica** - Sistema de preguntas con puntuación  
✅ **Cupones de amor** - Sistema de cupones desbloqueables  
✅ **Mensajes diarios** - 31 mensajes románticos con calendario  
✅ **Sección de cumpleaños** - Página especial para cumpleaños  

## 🔧 Solución de Problemas Comunes

### Si el deploy falla:
1. Asegúrate de que todas las variables de entorno estén correctas
2. Verifica que el nombre del proyecto sea exactamente "nicolinda"
3. Revisa los logs de build en el panel de Vercel

### Si la base de datos no funciona:
1. Verifica que las migraciones de Supabase estén aplicadas
2. Asegúrate de que las RLS policies estén configuradas
3. Revisa la conexión con Supabase

## 📱 Vista Previa
Una vez desplegado, podrás acceder a:
- **`https://nicolinda.vercel.app`** - Aplicación principal
- Panel de administración con contraseña: `kode123`

## 🚀 Listo para el Amor!
Tu aplicación "Nicolinda" está lista para ser desplegada con todas las funcionalidades románticas implementadas. ¡Disfruta creando momentos especiales! 💝

---
**Creado con amor y tecnología** ❤️‍🔥