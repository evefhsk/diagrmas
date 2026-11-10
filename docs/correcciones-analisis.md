# Correcciones para el documento de Análisis

Este material complementario corresponde al documento **Sistema Web de Autogestión Académica y Seguimiento Pedagógico Dinámico**. No modifica ni reemplaza el informe de tesis. Los acuerdos nuevos marcados como **Propuesta para validar** deben confirmarse con el profesor y la institución antes de presentarlos como reglas aprobadas.

## 1. Requerimientos funcionales faltantes

Agregar después de RF-04 y antes de RF-07:

### RF-05 - Registro y publicación de bitácora docente

El sistema debe permitir al docente autenticado, asignado a un espacio curricular, registrar y publicar por curso y módulo horario la fecha, el tema abordado, una descripción de las actividades, consignas y enlaces a recursos de estudio. La publicación debe quedar fechada, asociada al docente, curso y espacio curricular, y visible para estudiantes de ese curso y para los roles institucionales autorizados.

**Criterios de aceptación:** campos obligatorios validados; enlaces limitados a `http` o `https`; autor y fecha de publicación auditables; bitácora consultable cronológicamente; el contenido no se publica si faltan datos requeridos.

### RF-06 - Consulta asincrónica de clases y actividades

El sistema debe permitir al estudiante autenticado consultar las bitácoras y recursos de sus cursos, incluso después de una inasistencia, y localizar la información por espacio curricular, fecha o tema. Para las tareas publicadas en Google Classroom, el portal podrá mostrar título, curso, fecha límite, enlace oficial y el estado/calificación propia cuando la API y la autorización del centro lo permitan. La entrega del trabajo se realiza en Classroom, que mantiene el registro oficial.

**Criterios de aceptación:** solo se muestran cursos y datos autorizados para el estudiante; resultados ordenados por fecha; materiales y consignas accesibles desde la consulta; se distingue entre actividad pendiente, entregada y atrasada según fecha límite y registro de entrega.

**Límite de alcance:** la vista del portal es de consulta y acceso; no crea, modifica ni entrega tareas de Classroom. Si no se autoriza la API o esta no devuelve los datos, el portal ofrece el acceso al Classroom del curso sin inventar ni guardar estados de entrega.

RF-07 mantiene el asentamiento y consulta de calificaciones formativas. RF-08 se redefine como preparación de una vista filtrable de asistencia para facilitar la carga manual en el sistema provincial que corresponda. No implica transmisión, sincronización ni importación automática a SGE/CiDi.

### RF-08 - Filtrar asistencias para carga manual en el sistema provincial

El sistema debe permitir a Preceptoría consultar la asistencia confirmada por curso, división y fecha, y filtrar la nómina para mostrar únicamente estudiantes ausentes. La vista debe facilitar la transcripción de esos registros en el sistema provincial de destino, sin enviar datos automáticamente ni presuponer que exista un formato de importación.

**Criterios de aceptación:** el filtro muestra solo estudiantes con estado ausente para el curso, división y fecha seleccionados; permite volver a la nómina completa; muestra un total que coincide con los resultados; no modifica registros al filtrar; restringe la consulta a roles autorizados y registra las acciones de consulta/exportación que se acuerden. Un eventual archivo descargable y sus campos/formato requieren validación previa con la institución y no se consideran importables por SGE/CiDi hasta que exista una especificación oficial.

**Supuesto a validar:** según lo informado para este análisis, no se dispone de una API o publicación de código abierto de SGE/CiDi utilizable para esta integración. La revisión exploratoria del [portal público de CiDi](https://cidi.cba.gov.ar/portal-publico/) y del [sitio de SGE](https://sge.cba.gov.ar/) no permitió localizar documentación pública de desarrolladores para asistencia; esto no demuestra que no exista una interfaz privada o documentación institucional. Confirmar con el Ministerio/institución el nombre del sistema de destino, el procedimiento vigente, los permisos y cualquier mecanismo oficial antes de cerrar el alcance.

CiDi debe mencionarse como mecanismo de identidad/acceso solo si la institución confirma que aplica al acceso a SGE; no tratar “SGE” y “CiDi” como nombres equivalentes de un mismo sistema.

## 2. Profundidad de los casos de uso

### CU-01 - Registrar asistencia, revisar alertas y gestionar actas

**Actor principal:** Preceptoría. **Actor secundario:** Dirección, por la recepción de alertas y la firma/seguimiento de actas. **Precondición:** Preceptoría autenticada con turno activo.

**Flujo principal:** Preceptoría selecciona curso y división; revisa la nómina; marca ausencias, ingresa minutos de tardanza o registra un retiro anticipado; confirma la planilla. El sistema calcula la fracción y actualiza el acumulado. Para facilitar la carga posterior, Preceptoría puede filtrar la nómina confirmada por fecha y estado “Ausente”; esta consulta no transmite datos a otro sistema. Al alcanzar 3, 5, 10 o 20 faltas, el sistema emite la alerta para Preceptoría y Dirección. Preceptoría revisa el caso; en 10 y 20 faltas el sistema precompleta el acta y Preceptoría gestiona el seguimiento y la convocatoria presencial junto con Dirección/tutores. Al alcanzar 25 faltas, el sistema cambia a TEA y notifica a Coordinación Pedagógica para la ficha de acompañamiento.

**Alternativas:** A1, retiro anticipado: Preceptoría registra el retiro y el sistema computa 0,50 falta. A2, asistencia ya confirmada: Preceptoría rectifica o justifica el registro dentro de las 48 horas hábiles; el sistema guarda usuario, fecha y motivo en la auditoría.

**Errores:** E1, duplicado fuera del flujo de rectificación: advertir y no crear un segundo registro. E2, fecha no lectiva o dato inválido: informar y no persistir. E3, usuario sin turno/curso asignado: denegar y auditar.

**Regla de tardanza por validar con Dirección:** hasta 20 minutos = 0,25; de 21 a 39 = 0,50; desde 40 = 1,00. Estos rangos no se superponen.

### CU-02 - Registrar bitácora, consignas y evaluaciones

**Actor principal:** Docente. **Precondición:** autenticado y asignado al curso y espacio curricular.

**Flujo principal:**
1. Selecciona curso, espacio curricular y módulo horario.
2. El sistema propone la fecha y muestra la bitácora pendiente de completar, si existe.
3. Registra tema, descripción de actividades, recursos y consignas.
4. Asocia enlaces a recursos y, cuando corresponda, al curso o tarea oficial de Classroom; las tareas y sus fechas se crean y mantienen en Classroom.
5. Publica la bitácora; el sistema valida, fecha y asocia la autoría, y la deja visible al curso.
6. El docente registra en el portal las valoraciones formativas que pertenecen al seguimiento pedagógico local, diferenciadas de las calificaciones oficiales de Classroom.
7. El portal conserva fecha, autor y devolución de la valoración formativa; una valoración desaprobada requiere retroalimentación.
8. El estudiante consulta la bitácora desde el portal y abre Classroom para ver, entregar o revisar la tarea oficial.

**Alternativas:** A1, el docente guarda un borrador de bitácora y lo publica más tarde; A2, si la API de Classroom no está habilitada, el docente deja el enlace al curso y el estudiante consulta allí las tareas; A3, el docente corrige una valoración formativa local y el sistema conserva auditoría del valor anterior y del usuario que la modificó.

**Errores:** E1, datos obligatorios incompletos; E2, enlace con esquema inválido; E3, valoración formativa desaprobada sin devolución; E4, el usuario no está asignado al curso; E5, falla de lectura de Classroom, que no debe mostrarse como tarea sincronizada. En todos los casos el sistema informa el problema y no persiste un registro inválido.

**Postcondiciones:** bitácora y valoración formativa local publicadas con autoría y fechas; las tareas, entregas y calificaciones oficiales continúan en Classroom. Los datos se muestran solo a roles autorizados.

### CU-03 - Consultar bitácora, actividades y calificaciones

**Actor principal:** Estudiante. **Precondición:** autenticado y matriculado en el curso consultado.

**Flujo principal:**
1. Ingresa a “Mis Clases / Bitácora”.
2. Filtra por espacio curricular, fecha o tema.
3. Consulta las bitácoras en orden cronológico, con recursos y enlaces a las tareas oficiales de Classroom.
4. Si el acceso está autorizado, el portal consulta y muestra el estado/calificación propios de Classroom como datos de solo lectura.
5. Abre el enlace oficial para ver o entregar la tarea en Classroom; consulta en el portal las valoraciones formativas locales y sus devoluciones.

**Alternativas:** A1, si no hay filtros, el sistema muestra las clases más recientes; A2, si la API no está disponible, se ofrece el enlace a Classroom y no se presenta un estado de entrega; A3, si no existe valoración formativa local, muestra “Sin valoración” sin inferir una nota.

**Errores:** E1, no hay resultados para los filtros elegidos; E2, el recurso ya no está disponible; E3, se solicita un curso ajeno al estudiante. El sistema informa el resultado y no expone datos de otros estudiantes.

**Postcondiciones:** ninguna modificación de tareas, entregas ni calificaciones de Classroom; el estudiante ve únicamente sus datos personales, las bitácoras autorizadas y las valoraciones formativas locales.

### CU-04 - Auditar avance pedagógico, alertas y reportes

**Actores principales:** Coordinación Pedagógica y Dirección. **Precondición:** autenticados con permisos de supervisión institucional definidos en RBAC.

**Flujo principal:**
1. Abre el panel de supervisión y selecciona período, curso o espacio curricular.
2. Consulta el semáforo de bitácoras actualizadas y pendientes.
3. Consulta indicadores agregados de bitácoras y valoraciones formativas locales; si hay acceso de lectura a Classroom, puede ver los estados agregados de tareas sin alterar entregas ni calificaciones oficiales.
4. Revisa alertas de inasistencia en los umbrales vigentes y selecciona un caso TEA para emitir o consultar la ficha de intervención.
5. Consulta indicadores agregados de asistencia. La preparación de la nómina filtrada de ausentes para su carga manual en el sistema provincial corresponde a Preceptoría y se describe en CU-01/RF-08; no hay envío automático desde la plataforma.

**Alternativas:** A1, el filtro no devuelve datos y el panel presenta el estado vacío; A2, Classroom no responde o la API no está autorizada y el panel conserva bitácoras y enlaces locales sin inventar estados externos.

**Errores:** E1, intento de acceso sin permiso; E2, falla al consultar Classroom, que no debe presentarse como información actualizada; E3, no hay información suficiente para emitir una ficha TEA. El sistema informa el error y conserva la auditoría.

**Postcondiciones:** las consultas no modifican datos de asistencia, bitácora o calificaciones; la emisión de fichas queda auditada.

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

En el diagrama general, representar RF-05 junto a CU-02 y RF-06 junto a CU-03; mantener RF-07 como registro docente/consulta estudiantil y RF-08 como filtro de ausentes para carga manual, sin actor ni conexión directa con SGE/CiDi.

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

### CP-006 - Publicación de bitácora con enlace a Classroom

- **Entrada:** docente asignado, módulo horario, tema y URL HTTPS a una tarea o recurso de Classroom; segundo intento con tema vacío y tercero con URL inválida.
- **Pasos:** guardar el caso válido; consultar como estudiante del curso; repetir con cada dato inválido.
- **Esperado:** la bitácora válida aparece con fecha y autor; los intentos inválidos reciben validación y no se publican.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-007 - Consulta asincrónica y acceso a tareas

- **Entrada:** bitácoras de dos fechas y dos espacios curriculares, enlaces a tareas publicadas en Classroom y, si está autorizada la API, estado de entrega de prueba del estudiante.
- **Pasos:** iniciar sesión como estudiante; filtrar por espacio/fecha; consultar la tarea y su enlace; comparar estado propio con Classroom; repetir con API sin autorización.
- **Esperado:** resultados cronológicos; el enlace abre Classroom; solo se muestra el estado propio autorizado; sin API, el portal informa que no pudo consultarlo y no modifica ni crea estados de entrega.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-008 - Valoración formativa local y retroalimentación

- **Entrada:** valoración formativa local cuantitativa/cualitativa aprobada y desaprobada; intento de desaprobar sin devolución.
- **Pasos:** registrar ambos tipos de valoración; intentar guardar desaprobación sin feedback; agregar feedback y guardar; consultar como estudiante y docente.
- **Esperado:** se aceptan valores válidos; se rechaza la desaprobación sin devolución; valoración, fecha y feedback quedan asociados al estudiante y docente y solo visibles a roles autorizados. No se modifican notas ni entregas oficiales de Classroom.
- **Obtenido:** Pendiente de ejecución UAT.

### CP-009 - Filtro de ausentes para carga manual

- **Entrada:** nóminas de asistencia confirmadas de varios cursos/divisiones y fechas, con estados presentes, ausentes y tardanzas.
- **Pasos:** seleccionar curso, división y fecha; aplicar el filtro de ausentes; comparar la lista y el total con los registros fuente. Si se aprueba una descarga, validar solo el formato acordado por la institución.
- **Esperado:** la vista facilita la transcripción manual y coincide con los registros; no se presupone archivo importable ni comunicación automática con SGE/CiDi.
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

### CP-012 - Filtro de estudiantes ausentes

- **Entrada:** asistencia confirmada de un curso/división y fecha con estudiantes presentes, ausentes y tardanzas.
- **Pasos:** abrir la nómina confirmada; seleccionar curso, división y fecha; aplicar el filtro “Ausentes”; comparar nombres y total con los registros fuente; volver a la nómina completa.
- **Esperado:** se muestran exclusivamente estudiantes cuyo estado sea ausente en esa fecha; el total coincide con la lista; cambiar el filtro no modifica ni transmite registros; solo acceden roles autorizados.
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

### RF-10 - Consulta y acceso unificado a Google Classroom (propuesta)

El portal debe facilitar que el estudiante encuentre las tareas publicadas en
Google Classroom desde una vista organizada por curso, espacio curricular y
fecha. Cuando la institución autorice la API, el portal consultará en modo de
solo lectura tareas publicadas y el estado/calificación propios del estudiante;
al seleccionar una tarea, abrirá su enlace oficial en Classroom para ver las
instrucciones y realizar la entrega. Classroom seguirá siendo la fuente oficial
de tareas, entregas y calificaciones. El portal no crea, modifica, sube ni
entrega trabajos en Classroom y no almacena copias de esos archivos.

**Criterios a validar:** solicitar solo scopes de lectura necesarios; filtrar
cursos/tareas según la identidad del usuario; conservar identificadores y enlaces
para evitar duplicar elementos en la vista; mostrar estado y nota solo si la API
los autoriza; si la API no está disponible, ofrecer el acceso al curso sin
presentar información desactualizada como actual. Confirmar autorización del
administrador de Workspace, tipo de cuenta/licencia y verificación OAuth antes
de comprometer la integración.

La documentación oficial confirma la consulta de tareas y entregas propias; la
entrega sigue el flujo de Classroom:

- [Listar cursos autorizados](https://developers.google.com/workspace/classroom/reference/rest/v1/courses/list)
- [Listar tareas publicadas](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWork/list)
- [Listar materiales de clase](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWorkMaterials/list)
- [Consultar entregas propias](https://developers.google.com/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions/list)
- [Autorización y scopes de Classroom API](https://developers.google.com/workspace/classroom/guides/auth)

La consulta propuesta requiere autorización OAuth 2.0 y consentimiento de
usuario. Los scopes deben verificarse contra la referencia de cada método:
`courses.list` requiere permiso de lectura de cursos; `courseWork.list` y
`studentSubmissions.list` documentan permisos de lectura de trabajos para el
usuario o para estudiantes administrados. Consultar materiales requiere un
scope adicional solo si esa operación forma parte del alcance. Solicitar el
conjunto mínimo y revisar la verificación aplicable. La plataforma no copiará
archivos de entrega ni persistirá calificaciones oficiales.

**Antecedentes y límites de evidencia:** [Algebraix anuncia](https://www.algebraix.com/faq)
la importación de actividades y calificaciones desde Classroom. El [aviso de
privacidad de SISGA](https://www.sisga.com.co/PoliticaPrivacidad.html) declara
el uso de APIs de Google para Classroom y Drive y que solicita autorización
para integrar esos servicios. Las fuentes públicas revisadas no identifican el
flujo OAuth 2.0, los scopes ni los endpoints usados por esos productos; por eso
no deben citarse como evidencia de llamadas a `courses.list` o `courseWork.list`.
La [ruta SIS que Google documenta](https://developers.google.com/workspace/classroom/sis-integrations/validate-your-SIS)
mediante OneRoster 1.2 es distinta de la consulta por API de Classroom y no
acredita compatibilidad del SGE/CiDi provincial.

**Decisiones pendientes:** confirmar con el administrador de Workspace si se
autoriza la API y OAuth para las cuentas del colegio; determinar si se mostrarán
estados de entrega/notas o solo enlaces; acordar qué sistema es fuente oficial de
cada dato. La integración completa de entrega desde el portal queda fuera de este
alcance, ya que las tareas creadas manualmente en Classroom no necesariamente
pueden modificarse o entregarse por una aplicación externa.