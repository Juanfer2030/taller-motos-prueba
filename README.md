# Taller de Motos — Sistema de Control de Alistamientos y Reparaciones

Sistema full stack para la gestión de órdenes de trabajo de un taller de motos: registro de clientes y motos, creación de órdenes con máquina de estados, y gestión de ítems (mano de obra / repuestos) con cálculo automático de totales.

## Stack técnico

- **Backend:** Node.js + Express + Sequelize + MySQL
- **Frontend:** React + React Router + Axios + Tailwind CSS
- **Herramientas:** Vite, nodemon, sequelize-cli

## Estructura del proyecto
taller-motos/
├── backend/
│   ├── config/          # Configuración de sequelize-cli
│   ├── migrations/       # Migraciones de base de datos
│   ├── src/
│   │   ├── config/        # Conexión a la base de datos
│   │   ├── controllers/   # Lógica de negocio de cada endpoint
│   │   ├── middlewares/   # Manejo de errores
│   │   ├── models/        # Modelos Sequelize
│   │   ├── routes/        # Definición de rutas
│   │   └── utils/         # Máquina de estados de las órdenes
│   └── index.js
└── frontend/
└── src/
├── pages/          # Pantallas: Listado, Crear, Detalle
├── services/       # Cliente Axios centralizado
└── utils/          # Máquina de estados (copia para UX)

## Requisitos previos

- Node.js v18 o superior
- MySQL Server 8.0 o superior

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd taller-motos
```

### 2. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido (ajusta los valores según tu entorno):
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=taller_motos
DB_USER=root
DB_PASSWORD=tu_password_de_mysql
DB_DIALECT=mysql
PORT=4000
JWT_SECRET=c8sn239H3Mh1J0A*

Crea la base de datos en MySQL:

```sql
CREATE DATABASE taller_motos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ejecuta las migraciones para crear las tablas:

```bash
npx sequelize-cli db:migrate
```

Levanta el servidor de desarrollo:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:4000`. Verifica con:

GET http://localhost:4000/api/health

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

## Variables de entorno (backend)

| Variable      | Descripción                                  | Ejemplo                  |
|---------------|-----------------------------------------------|---------------------------|
| DB_HOST       | Host de MySQL                                 | 127.0.0.1                 |
| DB_PORT       | Puerto de MySQL                               | 3306                      |
| DB_NAME       | Nombre de la base de datos                    | taller_motos               |
| DB_USER       | Usuario de MySQL                              | root                      |
| DB_PASSWORD   | Contraseña de MySQL                           | (mi contraseña)           |
| DB_DIALECT    | Motor de base de datos usado por Sequelize    | mysql                     |
| PORT          | Puerto en el que corre el servidor Express    | 4000                      |

## Modelo de datos

- **Cliente** `(1) — (N)` **Moto** `(1) — (N)` **WorkOrder** `(1) — (N)` **Item**
- Una moto pertenece a un único cliente; una orden pertenece a una única moto; una orden puede tener varios ítems.

### Máquina de estados de una orden

RECIBIDA → DIAGNOSTICO → EN PROCESO → LISTA → ENTREGADA

`CANCELADA` es alcanzable desde cualquier estado, excepto desde `ENTREGADA`. Cualquier transición fuera de estas reglas es rechazada por el backend con status 400.

## Autenticación y roles

El sistema usa autenticación basada en JWT. Todos los endpoints (excepto login) requieren un token válido enviado en el header:
Authorization: Bearer <token>

### Roles

- **ADMIN**: acceso completo, incluyendo eliminar ítems y registrar nuevos usuarios.
- **MECANICO**: puede ver, crear órdenes, agregar ítems y cambiar estados, pero no puede eliminar ítems ni registrar usuarios.

### Endpoints de autenticación

| Método | Ruta               | Descripción                          | Protegido           |
|--------|--------------------|----------------------------------------|----------------------|
| POST   | /api/auth/login     | Iniciar sesión, devuelve un JWT       | No                   |
| POST   | /api/auth/register  | Registrar un nuevo usuario            | Sí (solo ADMIN)      |

### Usuarios de prueba

Para probar el sistema, puedes crear usuarios directamente en la base de datos, o usar el endpoint de registro con un usuario ADMIN ya existente. Ejemplo de body para login:

```json
{
  "email": "admin@taller.com",
  "password": "admin123"
}
```
## Endpoints principales

| Método | Ruta                                     | Descripción                          | Protegido        |
|--------|--------------------------------------------|----------------------------------------|--------------------|
| POST   | /api/clients                              | Crear cliente                         | Sí                 |
| GET    | /api/clients?search=                      | Listar/buscar clientes                | Sí                 |
| GET    | /api/clients/:id                          | Detalle de cliente                    | Sí                 |
| POST   | /api/bikes                                | Crear moto                            | Sí                 |
| GET    | /api/bikes?plate=                         | Listar/buscar motos por placa         | Sí                 |
| GET    | /api/bikes/:id                            | Detalle de moto                       | Sí                 |
| POST   | /api/work-orders                          | Crear orden de trabajo                | Sí                 |
| GET    | /api/work-orders?status=&plate=&page=&pageSize= | Listar órdenes con filtros/paginación | Sí         |
| GET    | /api/work-orders/:id                      | Detalle de orden                      | Sí                 |
| GET    | /api/work-orders/:id/history              | Historial de cambios de estado        | Sí                 |
| PATCH  | /api/work-orders/:id/status               | Cambiar estado de la orden            | Sí                 |
| POST   | /api/work-orders/:id/items                | Agregar ítem a una orden              | Sí                 |
| DELETE | /api/work-orders/items/:itemId            | Eliminar ítem de una orden            | Sí (solo ADMIN)    |


## Notas de diseño

- El campo `total` de cada orden se recalcula automáticamente (dentro de una transacción) cada vez que se agrega o elimina un ítem, evitando inconsistencias entre los ítems y el total mostrado.
- Las validaciones de negocio (placa única, moto/cliente existente, transiciones de estado válidas) se aplican en el backend, independientemente de las validaciones del frontend.
- Se usó `sequelize.sync({ alter: true })` durante el desarrollo; el entregable final usa migraciones versionadas (`migrations/`) como mecanismo formal de creación de esquema.
- Cada cambio de estado de una orden queda registrado automáticamente en `work_order_status_history`, dentro de la misma transacción que actualiza el estado — permitiendo trazabilidad completa sin depender de que el usuario recuerde registrar el cambio.