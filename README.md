# EntregaYa Tres Valles

Plataforma de delivery local para Tres Valles, Veracruz, enfocada en negocios locales, pedidos simples y rentabilidad real.

## Objetivo

- Validar el MVP en una zona pequeña.
- Generar pedidos con pocos negocios y pocos repartidores.
- Construir un modelo financiero realista.
- Escalar solo cuando se compruebe la rentabilidad.

## Estructura base

- `docs/`: análisis de negocio, finanzas, operación y roadmap.
- `frontend/`: UX del cliente, negocio, repartidor y administración.
- `backend/`: API, servicios, controladores y middleware.
- `database/`: esquema SQL y semillas demo.
- `business/`: configuración operativa y zonas.
- `tests/`: validación técnica y financiera.

## Ejecutar

```bash
npm install
npm run dev
```

## Stack sugerido

- Frontend: HTML, CSS, JavaScript (MVP)
- Backend: Node.js + Express (fase 1)
- Base de datos: PostgreSQL o SQLite para MVP local
- Persistencia inicial: localStorage para prototipos y validación

## Fase actual

Se está dejando una base técnica con estructura escalable, sin caer en complejidad innecesaria antes de validar la operación local.
