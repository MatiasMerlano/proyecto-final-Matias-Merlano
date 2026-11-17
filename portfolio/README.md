Proyecto final — Matias Merlano

Descripción general

Este proyecto integra dos aplicaciones web independientes: Portfolio y RobotCare, desarrolladas con React y Vite, que comparten un backend construido con Node.js, Express y SQLite.

El proyecto conserva los recursos visuales originales y presenta una estructura organizada, una interfaz adaptable a dispositivos móviles y funcionalidades de interacción con el usuario.

Aplicaciones

1. Portfolio

Sitio web personal para presentar información y contenido del proyecto.

- Interfaz desarrollada con React.
- Diseño adaptable a diferentes tamaños de pantalla.
- Ejecución independiente mediante Vite.

2. RobotCare

Plataforma conceptual de asistencia robótica orientada al acompañamiento de adultos mayores y personas con movilidad reducida.

Incluye:

- Página de inicio y presentación del proyecto.
- Sección de beneficios.
- Catálogo de Robot Básico y Robot Avanzado.
- Formulario de contacto conectado al backend.
- Asistente virtual de preguntas frecuentes.
- Panel de administración para consultar los mensajes recibidos.
- Buscador y filtros de mensajes.
- Diseño adaptable a dispositivos móviles.

Nota: Las características de los robots son propuestas ilustrativas de un proyecto académico. No representan dispositivos médicos certificados ni productos comerciales validados.

Tecnologías utilizadas

Tecnología| Uso
HTML, CSS y JavaScript| Estructura, diseño y lógica
React| Desarrollo de interfaces
Vite| Entorno de desarrollo y compilación
Node.js| Entorno de ejecución del backend
Express| Creación de la API
SQLite| Almacenamiento de información
better-sqlite3| Conexión con la base de datos
JWT| Autenticación del administrador
bcryptjs| Protección de contraseñas
Helmet| Configuración de seguridad HTTP
CORS| Control de acceso entre aplicaciones
express-rate-limit| Limitación de solicitudes

Requisitos

- Node.js 20 o superior.
- npm.
- Visual Studio Code (recomendado).

Instalación y configuración

1. Abre la carpeta principal del proyecto en Visual Studio Code.

2. Abre una terminal en la carpeta raíz.

3. Instala las dependencias:
   
   "npm install"

4. En la carpeta "backend/", copia el archivo ".env.example" y crea un archivo llamado ".env".

5. Configura las variables de entorno, incluyendo "JWT_SECRET", "ADMIN_USER" y "ADMIN_PASSWORD".

6. Utiliza una contraseña de administrador segura y no compartas el archivo ".env".

Ejecución del proyecto

El proyecto utiliza tres servicios independientes. Cada uno debe ejecutarse en una terminal diferente.

Terminal 1 — Backend

"npm run dev:backend"

Terminal 2 — Portfolio

"npm run dev:portfolio"

Terminal 3 — RobotCare

"npm run dev:robotcare"

Direcciones locales

- Backend: http://localhost:4000
- Portfolio: http://localhost:5173
- RobotCare: http://localhost:5174

Backend y API

El backend centraliza las operaciones de contacto, autenticación, administración y respuestas del asistente virtual.

Rutas disponibles

Método| Endpoint| Función
POST| "/api/contact"| Valida y guarda mensajes de contacto.
POST| "/api/auth/login"| Autentica al administrador y devuelve un JWT.
GET| "/api/admin/messages"| Consulta los mensajes recibidos. Requiere autenticación.
POST| "/api/chat"| Procesa preguntas frecuentes de RobotCare.
GET| "/api/health"| Comprueba el estado del servidor.

Base de datos

Se utiliza SQLite mediante "better-sqlite3".

La base de datos almacena principalmente:

- Usuarios administradores y sus contraseñas protegidas mediante hash.
- Mensajes enviados desde los formularios de contacto.
- Información de origen y fecha de recepción de los mensajes.

El archivo de la base de datos se genera dentro de la carpeta de datos del backend.

Panel administrativo

RobotCare incorpora un panel de acceso restringido que permite:

- Iniciar y cerrar sesión.
- Consultar los mensajes recibidos.
- Actualizar la bandeja de entrada.
- Buscar mensajes por nombre, correo electrónico o contenido.
- Filtrar mensajes según su origen.
- Consultar indicadores de mensajes de RobotCare y Portfolio.

La autenticación utiliza tokens JWT y las rutas administrativas están protegidas.

Asistente virtual

RobotCare incluye un asistente de preguntas frecuentes que permite consultar información sobre:

- El proyecto RobotCare.
- El Robot Básico.
- El Robot Avanzado.
- Funciones y características propuestas.
- Beneficios y medios de contacto.

El asistente funciona mediante reglas y reconocimiento de palabras clave. No utiliza un modelo de inteligencia artificial generativa conectado a un proveedor externo.

Seguridad

El backend incorpora diferentes medidas de protección:

- Validación de los datos recibidos.
- Contraseñas almacenadas mediante hash con bcryptjs.
- Autenticación mediante JWT.
- Protección de cabeceras HTTP con Helmet.
- Configuración de CORS.
- Limitación de solicitudes mediante express-rate-limit.
- Restricción de acceso a las rutas administrativas.

Las credenciales y claves privadas deben mantenerse en el archivo ".env", sin publicarlas en repositorios.

Compilación

Para generar las versiones de producción de las aplicaciones frontend, ejecuta desde la carpeta principal:

"npm run build"

Este comando compila Portfolio y RobotCare.

Autor

Matias Merlano

Proyecto académico de desarrollo web.