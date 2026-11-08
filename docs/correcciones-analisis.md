# Correcciones para el documento de Análisis

Este material complementario corresponde al documento **Sistema Web de Autogestión Académica y Seguimiento Pedagógico Dinámico**. No modifica ni reemplaza el informe de tesis. Los acuerdos nuevos marcados como **Propuesta para validar** deben confirmarse con el profesor y la institución antes de presentarlos como reglas aprobadas.

## 1. Requerimientos funcionales faltantes

Agregar después de RF-04 y antes de RF-07:

### RF-05 - Registro y publicación de bitácora docente

El sistema debe permitir al docente autenticado, asignado a un espacio curricular, registrar y publicar por curso y módulo horario la fecha, el tema abordado, una descripción de las actividades, consignas y enlaces a recursos de estudio. La publicación debe quedar fechada, asociada al docente, curso y espacio curricular, y visible para estudiantes de ese curso y para los roles institucionales autorizados.

**Criterios de aceptación:** campos obligatorios validados; enlaces limitados a `http` o `https`; autor y fecha de publicación auditables; bitácora consultable cronológicamente; el contenido no se publica si faltan datos requeridos.

### RF-06 - Consulta asincrónica de clases y actividades

El sistema debe permitir al estudiante autenticado consultar las bitácoras y recursos de sus cursos, incluso después de una inasistencia, y localizar la información por espacio curricular, fecha o tema. Debe mostrar las consignas y fechas límite publicadas para las actividades, junto con su estado de entrega cuando exista una entrega asociada.

**Criterios de aceptación:** solo se muestran cursos y datos autorizados para el estudiante; resultados ordenados por fecha; materiales y consignas accesibles desde la consulta; se distingue entre actividad pendiente, entregada y atrasada según fecha límite y registro de entrega.

RF-07 mantiene el asentamiento y consulta de calificaciones formativas. RF-08 mantiene la exportación de reportes consolidados para SGE/CiDi.

## 2. Profundidad de los casos de uso

### CU-01 - Registrar asistencia, revisar alertas y gestionar actas

**Actor principal:** Preceptoría. **Actor secundario:** Dirección, por la recepción de alertas y la firma/seguimiento de actas. **Precondición:** Preceptoría autenticada con turno activo.

**Flujo principal:** Preceptoría selecciona curso y división; revisa la nómina; marca ausencias, ingresa minutos de tardanza o registra un retiro anticipado; confirma la planilla. El sistema calcula la fracción y actualiza el acumulado. Al alcanzar 3, 5, 10 o 20 faltas, el sistema emite la alerta para Preceptoría y Dirección. Preceptoría revisa el caso; en 10 y 20 faltas el sistema precompleta el acta y Preceptoría gestiona el seguimiento y la convocatoria presencial junto con Dirección/tutores. Al alcanzar 25 faltas, el sistema cambia a TEA y notifica a Coordinación Pedagógica para la ficha de acompañamiento.

**Alternativas:** A1, retiro anticipado: Preceptoría registra el retiro y el sistema computa 0,50 falta. A2, asistencia ya confirmada: Preceptoría rectifica o justifica el registro dentro de las 48 horas hábiles; el sistema guarda usuario, fecha y motivo en la auditoría.

**Errores:** E1, duplicado fuera del flujo de rectificación: advertir y no crear un segundo registro. E2, fecha no lectiva o dato inválido: informar y no persistir. E3, usuario sin turno/curso asignado: denegar y auditar.

**Regla de tardanza por validar con Dirección:** hasta 20 minutos = 0,25; de 21 a 39 = 0,50; desde 40 = 1,00. Estos rangos no se superponen.

### CU-02 - Registrar bitácora, consignas y evaluaciones

**Actor principal:** Docente. **Precondición:** autenticado y asignado al curso y espacio curricular.

**Flujo principal:**
1. Selecciona curso, espacio curricular y módulo horario.
2. El sistema propone la fecha y muestra la bitácora pendiente de completar, si existe.
3. Registra tema, descripción de actividades, recursos y consignas.
4. Para cada actividad evaluable, indica título, tipo y fecha límite.
5. Publica la bitácora; el sistema valida, fecha y asocia la autoría, y la deja visible al curso.
6. El docente abre el seguimiento de una actividad y consulta quién entregó, quién tiene una entrega pendiente y quién está atrasado.
7. Registra para cada entrega una valoración cuantitativa o cualitativa y, cuando corresponda, una devolución. Una entrega desaprobada no puede guardarse sin retroalimentación.
8. El sistema guarda la calificación con fecha y autor, actualiza el promedio provisional y la hace visible al estudiante correspondiente.

**Alternativas:** A1, el docente guarda un borrador y lo publica más tarde; A2, una actividad no requiere entrega, por lo que no se genera estado de entrega; A3, el docente corrige una calificación y el sistema conserva auditoría del valor anterior y del usuario que la modificó.

**Errores:** E1, datos obligatorios incompletos; E2, enlace con esquema inválido; E3, intento de calificar una entrega desaprobada sin devolución; E4, el usuario no está asignado al curso. En todos los casos el sistema informa el problema y no persiste un registro inválido.

**Postcondiciones:** bitácora publicada y/o actividad, entrega y valoración persistidas con sus relaciones, autoría y fechas; datos visibles únicamente para roles autorizados.

### CU-03 - Consultar bitácora, actividades y calificaciones

**Actor principal:** Estudiante. **Precondición:** autenticado y matriculado en el curso consultado.

**Flujo principal:**
1. Ingresa a “Mis Clases / Bitácora”.
2. Filtra por espacio curricular, fecha o tema.
3. Consulta las bitácoras en orden cronológico, con actividades, recursos y fechas límite.
4. Abre una actividad y consulta su estado personal: pendiente, entregada o atrasada.
5. Consulta sus valoraciones, devoluciones y promedios provisionales disponibles.

**Alternativas:** A1, si no hay filtros, el sistema muestra las clases más recientes; A2, si todavía no existe una calificación, muestra “Sin calificar” sin inferir una nota; A3, si no hay una entrega requerida, informa que la actividad no solicita entrega.

**Errores:** E1, no hay resultados para los filtros elegidos; E2, el recurso ya no está disponible; E3, se solicita un curso ajeno al estudiante. El sistema informa el resultado y no expone datos de otros estudiantes.

**Postcondiciones:** ninguna modificación de datos académicos; quedan visibles solo bitácoras, entregas y calificaciones propias o de acceso público para el curso.

### CU-04 - Auditar avance pedagógico, alertas y reportes

**Actores principales:** Coordinación Pedagógica y Dirección. **Precondición:** autenticados con permisos de supervisión institucional definidos en RBAC.

**Flujo principal:**
1. Abre el panel de supervisión y selecciona período, curso o espacio curricular.
2. Consulta el semáforo de bitácoras actualizadas y pendientes.
3. Consulta indicadores agregados de actividades publicadas, entregas pendientes/atrasadas y calificaciones cargadas, sin alterar registros docentes.
4. Revisa alertas de inasistencia en los umbrales vigentes y selecciona un caso TEA para emitir o consultar la ficha de intervención.
5. Genera el reporte de asistencia y calificaciones para facilitar la carga en SGE/CiDi (RF-08).

**Alternativas:** A1, el filtro no devuelve datos y el panel presenta el estado vacío; A2, el período está incompleto y se genera un reporte parcial identificado como tal.

**Errores:** E1, intento de acceso sin permiso; E2, falla al generar el reporte, que no debe presentarse como descargado; E3, no hay información suficiente para emitir una ficha TEA. El sistema informa el error y conserva la auditoría.

**Postcondiciones:** las consultas no modifican datos de asistencia, bitácora o calificaciones; la generación de reportes y fichas queda auditada.

**Ajuste de seguridad:** el documento limita actualmente RBAC a Administrador, Preceptor, Docente y Estudiante, pero CU-04 asigna funciones a Coordinación y Dirección. Agregar esos roles y definir permisos explícitos de lectura, exportación y emisión de ficha antes de afirmar que RBAC cubre todos los actores.

## 3. Diagramas UML para insertar

El diagrama general de casos de uso y los diagramas específicos existentes pueden incorporarse como figuras en el documento, con título y referencia cruzada desde CU-01 a CU-04:

- General: [casos-uso-general.svg](../diagrams/casos-uso-general.svg)
- CU-01: [caso-uso-asistencia.svg](../diagrams/caso-uso-asistencia.svg)
- CU-02: [caso-uso-bitacora.svg](../diagrams/caso-uso-bitacora.svg)
- CU-03: [caso-uso-consulta.svg](../diagrams/caso-uso-consulta.svg)
- CU-04: [caso-uso-auditoria.svg](../diagrams/caso-uso-auditoria.svg)
- CU-05 / RF-09 (propuesta): [caso-uso-comunicacion.svg](../diagrams/caso-uso-comunicacion.svg)
- RF-10 Classroom API (propuesta): [caso-uso-classroom.svg](../diagrams/caso-uso-classroom.svg)
- Clases revisado: [clases-dominio.svg](../diagrams/clases-dominio.svg)

En el diagrama general, representar RF-05 junto a CU-02 y RF-06 junto a CU-03; mantener RF-07 como registro docente/consulta estudiantil y RF-08 como reporte para SGE/CiDi.

## 4. Continuidad operativa y copias de seguridad

Agregar a requerimientos no funcionales. Los objetivos numéricos siguientes son **Propuesta para validar** con Sistemas según infraestructura y capacidad disponible:

- **RNF-03 - Copias de seguridad:** realizar copia cifrada diaria de la base de datos y copia semanal completa; conservar al menos 30 días; restringir el acceso a personal autorizado y registrar cada ejecución y resultado.
- **RNF-04 - Recuperación:** documentar el procedimiento de restauración y probarlo al menos trimestralmente en un entorno separado. Registrar duración, integridad de datos recuperados y responsable de la prueba.
- **RNF-05 - Continuidad:** objetivo propuesto RPO de hasta 24 horas y RTO de hasta 4 horas ante pérdida total del servicio. Informar al responsable y a usuarios cuando se interrumpa la disponibilidad; no confirmar operaciones que no hayan sido persistidas.
- **RNF-06 - Resguardo:** almacenar las copias fuera del equipo/servidor primario y proteger los datos personales de menores con controles de acceso y cifrado en reposo y tránsito.

Los valores de retención, RPO y RTO deben quedar aprobados por la institución; no presentarlos como capacidades ya implementadas.

## 5. Casos de prueba detallados

Completar la sección de pruebas con entradas, pasos y resultados esperados. La columna de resultado obtenido debe llenarse durante UAT; no declarar pruebas “Aprobadas” sin evidencia ejecutada.

### CP-001 - Carga nominal de asistencia

- **Entrada:** curso de prueba con 30 estudiantes; 27 presentes y 3 ausentes.
- **Pasos:** abrir asistencia; seleccionar curso y fecha; marcar los 3 ausentes; confirmar; consultar el registro persistido.
- **Esperado:** 30 estados guardados una sola vez, autor/fecha registrados y operación terminada en menos de 30 segundos.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-002 - Límite inferior de tardanza

- **Entrada:** estudiante de prueba, demora de 20 minutos.
- **Pasos:** marcar tardanza; ingresar 20; confirmar; consultar fracción y acumulado.
- **Esperado:** se asignan 0,25 faltas y el acumulado se actualiza una sola vez.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-003 - Rangos de tardanza

- **Entrada:** casos independientes de 21, 39 y 40 minutos.
- **Pasos:** registrar cada demora en una asistencia de prueba; confirmar; consultar fracción.
- **Esperado:** 21 y 39 minutos asignan 0,50; 40 minutos asigna 1,00. Si la regla institucional difiere, actualizar RF-02 y repetir la prueba.
- **Obtenido:** Pendiente de validación de regla y ejecución UAT.

### CP-004 - Umbrales de alerta y acta

- **Entrada:** acumulados de prueba inmediatamente antes y al alcanzar 3, 5, 10 y 20 faltas.
- **Pasos:** ingresar faltas hasta cada umbral; revisar paneles de Preceptoría y Dirección; comprobar el formulario de acta en 10 y 20.
- **Esperado:** alertas en 3, 5, 10 y 20; formulario precompletado en 10 y 20; sin duplicar la misma alerta para el mismo hito.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-005 - Pase a TEA

- **Entrada:** estudiante con 24 faltas y luego una falta adicional.
- **Pasos:** consultar estado en 24; registrar una falta; volver a consultar estado, alerta y ficha.
- **Esperado:** en 24 permanece Regular; al alcanzar 25 cambia a TEA, se notifica a Coordinación y se habilita la ficha. Las modificaciones quedan auditadas.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-006 - Publicación de bitácora

- **Entrada:** docente asignado, módulo horario, tema, actividad y URL HTTPS válida; segundo intento con tema vacío y tercero con URL inválida.
- **Pasos:** guardar el caso válido; consultar como estudiante del curso; repetir con cada dato inválido.
- **Esperado:** la bitácora válida aparece con fecha y autor; los intentos inválidos reciben validación y no se publican.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-007 - Consulta asincrónica

- **Entrada:** bitácoras de dos fechas y dos espacios curriculares, incluyendo recursos disponibles y una actividad.
- **Pasos:** iniciar sesión como estudiante; filtrar por cada espacio y fecha; abrir un material; consultar actividad y estado propio.
- **Esperado:** resultados cronológicos y filtrados correctamente; material accesible; no aparecen cursos ni datos personales de otros estudiantes.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-008 - Calificación y retroalimentación

- **Entrada:** entrega aprobada y desaprobada; nota cuantitativa/cualitativa; intento de desaprobar sin devolución.
- **Pasos:** registrar ambos tipos de valoración; intentar guardar desaprobación sin feedback; agregar feedback y guardar; consultar como estudiante y docente.
- **Esperado:** se aceptan valores válidos; se rechaza la desaprobación sin devolución; nota, fecha y feedback quedan asociados a la entrega y solo visibles a roles autorizados; promedio provisional recalculado.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-009 - Reporte para SGE/CiDi

- **Entrada:** conjunto de asistencia y calificaciones con caracteres acentuados, campos vacíos permitidos y varios cursos.
- **Pasos:** seleccionar período; generar CSV y PDF; abrirlos con herramientas compatibles; comparar filas y totales con la fuente.
- **Esperado:** formatos descargables, estructura acordada, totales coincidentes y codificación legible; error explícito si falla la generación.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-010 - Control de acceso por rol

- **Entrada:** cuentas de prueba de Estudiante, Docente, Preceptor, Coordinación, Dirección y Administrador.
- **Pasos:** iniciar sesión con cada rol; intentar consultar y modificar datos dentro y fuera de su alcance; probar acceso directo a URL restringida.
- **Esperado:** acceso permitido solo según matriz RBAC aprobada; estudiante no ve notas ajenas; acciones no autorizadas se bloquean y registran.
- **Obtenido:** Pendiente de aprobación RBAC y ejecución UAT.

### CP-011 - Rendimiento

- **Entrada:** entorno de prueba documentado, 30 registros de asistencia y carga concurrente representativa de usuarios institucionales.
- **Pasos:** medir al menos 30 consultas y cargas; registrar latencia mediana y percentil 95; repetir durante horario de carga acordado.
- **Esperado:** consultas por debajo de 1,5 s y carga de lista completa por debajo de 30 s; adjuntar resultados crudos y configuración del entorno.
- **Obtenido:** Pendiente de ejecución UAT.

Agregar también casos para copia de seguridad y restauración una vez aprobados RNF-03/RNF-04; por ejemplo, restaurar una copia en entorno aislado y comparar conteos, integridad referencial y registros recientes.

## 6. Medición y validación de indicadores

Antes de comprometer metas, relevar una línea base durante al menos dos semanas lectivas y comparar con un piloto equivalente. Registrar fecha, muestra, método, responsable y fuente de cada medición.

| Indicador | Método de cálculo | Evidencia y frecuencia |
|---|---|---|
| Reducción del tiempo administrativo de Preceptoría | `(mediana de minutos diarios antes - mediana después) / mediana antes × 100` | Muestreo cronometrado de jornadas comparables; semanal durante piloto. Meta 80%: validar, no asumir. |
| Errores de cálculo de inasistencias | `registros con fracción incorrecta / registros auditados × 100` | Comparación de muestra contra cálculo manual independiente; por período. Meta 0% con tamaño de muestra informado. |
| Bitácoras publicadas dentro de 24 h | `clases publicadas dentro de 24 h / clases dictadas × 100` | Marcas de tiempo de horario y publicación; semanal por espacio curricular. Meta 100% sujeta a datos completos. |
| Tiempo de detección de riesgo TEA | Mediana de tiempo desde alcanzar el umbral hasta generar alerta visible; comparar línea base y piloto | Logs de asistencia/alertas y registro manual del proceso anterior; por umbral. Meta de reducción 50%: validar durante piloto. |

No reportar estos porcentajes como resultados obtenidos antes del piloto. Diferenciar claramente **meta**, **método**, **resultado medido** y **fecha de validación**.

## 7. Comunicación pedagógica e integración con Classroom

Estos dos objetivos fueron recordados para completar el análisis. Se proponen
para validación con el profesor y la institución; no deben presentarse como
funcionalidades ya implementadas ni como acuerdos aprobados.

### RF-09 - Comunicación pedagógica asincrónica (propuesta)

La plataforma debe permitir que un estudiante autenticado plantee una consulta
pedagógica vinculada a un curso, bitácora o actividad, y que el docente
correspondiente responda dentro de la plataforma.

**Criterios a validar:** acceso solo para participantes autorizados; contexto
visible (curso/actividad); fecha y autoría registradas; notificación de respuesta;
retención y moderación acordadas; no exponer datos de contacto personales. Es un
canal asincrónico propio de la plataforma, separado de Classroom y de servicios
de mensajería externos.

**CU-05 propuesto:** estudiante plantea una duda; el sistema la asocia al curso y
destinatario; el docente responde; la consulta y la respuesta quedan visibles a
los participantes autorizados y auditables. Definir si se permiten mensajes
iniciados por docentes, adjuntos, edición/eliminación y escalamiento a
Coordinación.

### RF-10 - Integración con Google Classroom API (propuesta)

La plataforma debe permitir al docente publicar materiales y tareas en el curso
correspondiente de Google Classroom. La aplicación organiza bitácoras, enlaces,
consignas y fechas por curso, espacio curricular, tema y fecha; además consulta
los estados de entrega y calificaciones autorizados para presentarlos junto al
seguimiento académico.

**Criterios a validar:** publicar materiales como `CourseWorkMaterial` y tareas
como `CourseWork`; conservar los identificadores y enlaces de Classroom para
evitar duplicados; consultar `StudentSubmission.state`, `late`, `assignedGrade` y
`alternateLink`; mostrar los datos solo a los roles autorizados; registrar los
resultados/errores de sincronización. Definir cómo se reflejan cambios,
eliminaciones, entregas tardías y notas corregidas.

La documentación oficial confirma esas operaciones y recursos:

- [Classroom API: CourseWorkMaterials](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWorkMaterials)
- [Classroom API: CourseWork](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWork)
- [Classroom API: StudentSubmissions](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions)
- [Autorización y scopes de Classroom API](https://developers.google.com/workspace/classroom/guides/auth)

La integración requiere OAuth 2.0 y consentimiento según el rol. La API ofrece,
entre otros, los scopes `classroom.courseworkmaterials`,
`classroom.coursework.students` y sus variantes de solo lectura; debe solicitarse
el mínimo necesario y revisarse el proceso de verificación aplicable. La
plataforma debe mapear los cursos y usuarios institucionales con los
identificadores de Google, sin guardar tokens en el navegador.

**Decisiones pendientes:** cuál sistema es la fuente oficial de tareas, entregas
y notas; si la nota se ingresa en Classroom o en la plataforma; cómo resolver
conflictos y sincronización fallida; qué cursos/cuentas institucionales pueden
autorizar la app. La API no reemplaza la organización pedagógica de la plataforma:
el objetivo es presentar materiales y seguimiento ordenados, con enlaces a la
actividad correspondiente en Classroom.