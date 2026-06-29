# Prompts de Diseño e Identidad Visual - Quantum Medical (HIS B2B)

Este documento registra los prompts de diseño y las especificaciones utilizadas para la generación y el desarrollo de los prototipos visuales de la plataforma (Landing Page y Portal de Pacientes). Está optimizado para un modelo **B2B marca blanca**, permitiendo a clínicas de **consultorios ambulatorios** personalizar su identidad con la estética de los centros de salud más prestigiosos del mundo.

---

## 1. Guía de Identidad y Estilo Consensuado (Estilo Internacional de Clínicas)

*   **Enfoque**: Humano, clínico, B2B personalizable y optimizado para consultorios externos/ambulatorios.
*   **Inspiración de Estilos**:
    *   *Estilo Mayo Clinic (EE. UU.)*: Azul marino/imperial profundo (`#005A9C` / `#0A3D62`), superficies blanco perla y gris clínico muy suave, con detalles sutiles en oro/bronce para acentos y estados activos.
    *   *Estilo Cleveland Clinic (EE. UU.)*: Verde esmeralda clínico (`#00843D`), azul cielo suave (`#0078BF`), y negro bronceado neutro (`#4B4B45`) para textos.
    *   *Estilo One Medical (EE. UU.)*: Verde pino oscuro orgánico (`#13382C`), fondo lino/crema cálido (`#FAF6F0`), y acentos en dorado apagado.
    *   *Estilo Peking Union Medical College Hospital (China)*: Verde jade tradicional de alta gama (`#0D5C3A`), oro imperial (`#D4AF37`) y fondos limpios.
*   **Tipografía**:
    *   *Titulares principales*: Serif elegante (ej. `Lora` o `Playfair Display`) en Sentence Case.
    *   *Textos de Interfaz (UI)*: Sans-serif moderno y altamente legible (`Plus Jakarta Sans` o `Inter`).
*   **Maquetación**: Barra de navegación superior horizontal en el portal de pacientes para maximizar el área de trabajo y visualización de la información.

---

## 2. Prompts de Diseño para Generación de Mockups (Figma / AI)

A continuación se detallan los prompts exactos utilizados para generar los prototipos visuales aprobados:

### Prompt A: Página de Inicio Mejorada (`/quantum-home`)

> **Prompt (Español)**:
> "A high-fidelity website homepage UI design for 'quantum.portal' (in lowercase, elegant serif italic font with a blue dot) in Spanish, representing a B2B customizable outpatient clinical platform. The colors are inspired by Mayo Clinic and Cleveland Clinic: deep royal blue, warm gray, slate, and clean white. The hero title reads 'Cuidado Coordinado. Salud Sincronizada.' in elegant sentence-case serif typography. Below, a clean subtitle describes the system as a premium platform for outpatient clinics. Two clean buttons: 'Acceder al Portal' and 'Servicios Médicos'. On the right, a high-quality visual representation of the patient portal on a tablet. Below the hero is a clean grid of 4 self-management service cards (Mis Turnos, Estudios Médicos, Recetas Digitales, Guardia Connect) designed with thin light-gray borders, subtle shadows, and crisp, simple medical icons. Minimalist, premium, professional medical software."

*   **Imagen Generada**: [redesigned_quantum_home.png](file:///C:/Users/mmalf/.gemini/antigravity-ide/brain/8f96e206-e7d4-44eb-b8c0-ec724d8dba81/redesigned_quantum_home_1782563070145.png)

---

### Prompt B: Portal de Pacientes con Barra Horizontal (Estilo Clínicas Internacionales)

> **Prompt (Español)**:
> "A high-fidelity patient portal web interface design for a B2B Hospital Information System (HIS) in Spanish, inspired by the prestigious Mayo Clinic and Cleveland Clinic visual styles. Color scheme: Deep royal blue (#005A9C) as the dominant color, clean warm gray (#F5F5F7) and white surfaces, with subtle warm bronze/gold accents for active states. The typography is highly clean, professional, and readable (sans-serif in sentence case). The layout is a top horizontal navigation bar with links: 'Inicio', 'Historia Clínica', 'Turnos', 'Recetas'. Below is a friendly greeting and a list of outpatient clinic locations (Sede Central, Belgrano, Pilar) with clear wait times. No neons, no purple orbs, no tech-SaaS icons. Figma layout, clinical, trustworthy, premium medical software."

*   **Imagen Generada**: [redesigned_hospital_style.png](file:///C:/Users/mmalf/.gemini/antigravity-ide/brain/8f96e206-e7d4-44eb-b8c0-ec724d8dba81/redesigned_hospital_style_1782562536265.png)

---

## 3. Estructura del Portal para Consultorios Ambulatorios

El diseño y desarrollo del frontend del portal de autogestión prioriza las operaciones clave de consultorios externos:
1.  **Gestión de Turnos**: Agendamiento rápido integrado, turnos activos e historial de citas.
2.  **Historia Clínica Ambulatoria**: Acceso seguro a evoluciones y resultados de estudios/diagnósticos.
3.  **Recetario Digital**: Visualización de recetas cargadas por los médicos para farmacias.
4.  **Guardia Ambulatoria (Guardia Connect)**: Monitoreo de tiempos de espera en tiempo real para consultas de demanda espontánea.
