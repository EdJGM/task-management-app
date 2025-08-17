
# Task Management App

Aplicación web para la gestión de tareas desarrollada con [Next.js](https://nextjs.org/), Firebase y Tailwind CSS. Permite a los usuarios crear, editar, eliminar y programar tareas, con autenticación y protección de rutas.

## Características

- Registro e inicio de sesión de usuarios (Firebase Auth)
- Creación, edición y eliminación de tareas
- Programación de tareas
- Interfaz moderna y responsiva (Tailwind CSS)
- Protección de rutas para usuarios autenticados

## Instalación

1. Clona el repositorio:
	```bash
	git clone https://github.com/EdJGM/task-management-app.git
	cd task-management-app
	```
2. Instala las dependencias:
	```bash
	npm install
	# o
	yarn install
	```
3. Configura Firebase:
	- Crea un proyecto en [Firebase](https://firebase.google.com/).
	- Copia tus credenciales en `src/firebase/config.ts`.

## Uso

Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

- `src/components/`: Componentes reutilizables
- `src/controllers/`: Lógica de negocio
- `src/models/`: Modelos de datos
- `src/pages/`: Páginas principales
- `src/firebase/`: Configuración de Firebase
- `src/styles/`: Estilos globales y locales

## Tecnologías

- Next.js
- React
- Firebase
- Tailwind CSS
- TypeScript

## Créditos

Desarrollado por EdJGM para el curso Desarrollo Web Avanzado (2024).