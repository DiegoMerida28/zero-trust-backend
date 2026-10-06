# Zero Trust Backend

Backend desarrollado para la implementación de una aplicación web segura bajo un enfoque **Zero Trust en AWS**.

El proyecto implementa autenticación mediante JWT, validación continua del usuario, arquitectura hexagonal, acceso a MySQL con privilegios mínimos y diferentes mecanismos de protección para reducir la superficie de ataque.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- bcrypt
- Zod
- Helmet
- CORS
- express-rate-limit
- dotenv
- Nodemon

## Arquitectura

El backend utiliza una estructura basada en **Arquitectura Hexagonal**, separando la lógica de negocio de los mecanismos externos como HTTP, MySQL y JWT.

```text
src/
├── application/
│   ├── authService.js
│   └── userService.js
│
├── config/
│   └── env.js
│
├── domain/
│   ├── user.js
│   └── userRepositoryPort.js
│
├── infrastructure/
│   ├── db.js
│   ├── tokenService.js
│   └── userRepository.js
│
├── interfaces/
│   ├── authController.js
│   ├── authValidator.js
│   ├── routes.js
│   └── userController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── loginRateLimiter.js
│
├── app.js
└── server.js
```

## Principios Zero Trust implementados

La aplicación aplica diferentes principios relacionados con Zero Trust:

- Ninguna solicitud a recursos protegidos es confiable por defecto.
- El JWT se valida antes de permitir acceso a recursos protegidos.
- Se verifica la firma, expiración, issuer y audience del JWT.
- El estado actual del usuario se consulta nuevamente en MySQL.
- Un usuario desactivado pierde acceso incluso si conserva un JWT válido.
- Se utilizan mensajes genéricos ante errores de autenticación.
- Las contraseñas se almacenan mediante hashes bcrypt.
- Se validan los datos recibidos mediante Zod.
- Se limita la cantidad de intentos de autenticación.
- Se utilizan encabezados HTTP de seguridad mediante Helmet.
- El usuario de MySQL utilizado por la aplicación opera con privilegios mínimos.
- Las consultas SQL utilizan parámetros para reducir el riesgo de inyección SQL.

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=zero_trust_db
DB_USER=zero_trust_app
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_ISSUER=zero-trust-backend
JWT_AUDIENCE=zero-trust-frontend

FRONTEND_ORIGIN=http://localhost:5173
```

`JWT_SECRET` debe contener al menos 64 caracteres.

El archivo `.env` no debe almacenarse en Git.

## Instalación

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Iniciar el servidor normalmente:

```bash
npm start
```

Por defecto, el backend utiliza:

```text
http://localhost:3000
```

## Endpoints

### Estado del servicio

```http
GET /api/health
```

Permite comprobar que el backend se encuentra disponible.

### Inicio de sesión

```http
POST /api/auth/login
```

Ejemplo de solicitud:

```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

Si las credenciales son correctas, el backend genera un JWT.

### Usuario autenticado

```http
GET /api/auth/me
```

Requiere:

```http
Authorization: Bearer <token>
```

El backend valida el JWT y comprueba nuevamente en la base de datos que el usuario continúe activo.

### Dashboard protegido

```http
GET /api/dashboard
```

Requiere:

```http
Authorization: Bearer <token>
```

Solo puede acceder un usuario autenticado y actualmente autorizado.

## Protección contra intentos repetidos

El endpoint de autenticación utiliza `express-rate-limit`.

La configuración actual permite un máximo de cinco intentos fallidos dentro de una ventana de 15 minutos antes de responder temporalmente con un error de demasiados intentos.

Esta protección a nivel de aplicación se complementará durante el despliegue en AWS con mecanismos adicionales como **Fail2Ban**.

## Seguridad de base de datos

La aplicación utiliza un usuario independiente de MySQL.

Este usuario no utiliza privilegios administrativos y solamente dispone de los permisos necesarios para las operaciones realizadas por el backend.

Esto aplica el principio de:

**Least Privilege (mínimo privilegio).**

## Validación continua

Los recursos protegidos no confían únicamente en que un JWT haya sido emitido anteriormente.

Para cada solicitud protegida:

1. Se comprueba la presencia del token.
2. Se valida criptográficamente el JWT.
3. Se verifica su expiración, issuer y audience.
4. Se obtiene nuevamente el usuario desde MySQL.
5. Se comprueba que la cuenta continúe activa.
6. Solo entonces se autoriza la solicitud.

Por lo tanto, una cuenta desactivada pierde inmediatamente el acceso a los recursos protegidos aunque conserve un JWT que todavía no haya expirado.

## Despliegue

El proyecto está diseñado para desplegarse posteriormente en AWS dentro de una arquitectura segmentada con:

- VPC de Frontend.
- VPC de Backend.
- VPC Peering.
- Security Groups con mínimo privilegio.
- Comunicación privada entre Frontend y Backend.
- HTTPS.
- Certificado digital.
- Nginx como servidor web y reverse proxy.
- Fail2Ban para bloqueo temporal ante intentos repetidos de autenticación.

## Estado del proyecto

Backend local funcional con:

- Conexión a MySQL.
- Autenticación mediante usuario y contraseña.
- Contraseñas protegidas mediante bcrypt.
- Generación y validación de JWT.
- Dashboard protegido.
- Endpoint `/api/auth/me`.
- Validación del estado activo del usuario.
- Rate limiting en autenticación.
- Validación de entradas.
- Encabezados HTTP de seguridad.
- Arquitectura modular basada en puertos y adaptadores.

Las siguientes etapas incluyen el desarrollo del Frontend y el despliegue de la solución en AWS.