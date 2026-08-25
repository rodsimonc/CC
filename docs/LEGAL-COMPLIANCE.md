# Cumplimiento legal

Este documento agrupa las restricciones legales y regulatorias que aplican al sitio. No reemplaza el asesoramiento jurídico del propio equipo.

## 1. Protección de Datos Personales — Ley 25.326 (Argentina)

Aplicable a todo dato personal tratado por el sitio (usuarios, abogados, consultantes).

Obligaciones clave:

- **Consentimiento informado.** Todo dato personal cargado voluntariamente por el usuario (en el chat o formularios) requiere aviso previo del uso que se le dará. El chat muestra el aviso al iniciar la conversación.
- **Finalidad específica.** Los datos se usan para la derivación al abogado sugerido y contacto posterior. No se ceden a terceros no autorizados.
- **Derechos ARCO.** Acceso, Rectificación, Cancelación y Oposición. Se implementa un endpoint público (`POST /api/v1/data-requests`) para ejercerlos, con respuesta dentro de los 10 días.
- **Registro en la AAIP.** La base de datos de usuarios/abogados debe inscribirse ante la Agencia de Acceso a la Información Pública antes de operar comercialmente.
- **Medidas de seguridad.** Contraseñas con `scrypt`, TLS obligatorio en tránsito, backups cifrados, control de acceso por rol.

## 2. Perfiles de abogados y fuentes públicas

Los perfiles se construyen a partir de:

- **Padrón del CAMDP** — verificación de matrícula activa (obligatorio).
- **Prensa local** (La Capital MdP, Infobrisas, Página12) — indexación de menciones donde el letrado interviene profesionalmente.
- **Información aportada por el propio abogado** — bio, casos representativos anonimizados, publicaciones, cargos docentes, etc.

Fuentes que se estudiaron y se descartaron:

- **MEV SCBA** — requiere credenciales personales del letrado; el fuero penal está restringido a las partes. No se puede scrapear ni cederse cuentas por ToS. Si un abogado quiere mostrar estadística judicial, la carga él mismo con su respaldo.
- **CIJ** — discontinuado por la CSJN en mayo 2025 (Acordada 10/2025).
- **SAIJ scraping automático** — el portal aplica bot protection. Se cita puntualmente cuando el abogado aporta el enlace.

Reglas del proyecto:

- Todo perfil requiere **consentimiento explícito** del abogado (correo trazable o firma) antes de publicarse.
- Sin coincidencia validada en el padrón oficial del CAMDP, el perfil no se publica.
- Opt-out visible en cada perfil (link "Solicitar remoción de mi perfil") con baja efectiva en 48 hs hábiles.
- Las menciones en prensa se muestran con enlace a la nota original y sin edición del contenido.

## 3. Publicidad de la abogacía — Colegio de Abogados de Mar del Plata (CAMDP)

El CAMDP regula la publicidad profesional. Reglas relevantes para este sitio:

- **Prohibido garantizar resultados.** El chatbot no puede prometer ganar un caso, ni dar plazos exactos de resolución. El system prompt lo bloquea explícitamente.
- **Prohibido comparar con otros profesionales.** No se muestran rankings ni frases del tipo "el mejor abogado de MdP".
- **Publicidad honesta.** Se muestra la matrícula, año de inscripción y áreas declaradas. No se sugieren títulos, honores o especializaciones no comprobadas.
- **No captación desleal.** La derivación desde el chat no promete condiciones económicas que el abogado no haya aceptado por escrito.
- **Honorarios.** No se publican tarifas exactas sin declaración firmada del abogado. En su ausencia, se indica "Consultar" y se remite a Ley 27.423 y arancel vigente.

## 4. Chatbot y responsabilidad

- El chatbot muestra al inicio y al final de cada conversación: **"Este servicio no constituye asesoramiento legal. La información brindada es orientativa y no reemplaza la consulta con un profesional matriculado."**
- Toda respuesta del chatbot que sugiera una acción legal concreta viene acompañada del CTA para agendar consulta con un abogado matriculado.
- Los logs de conversación se conservan 12 meses para trazabilidad y auditoría; luego se anonimizan.

## 5. Modelo de derivación

Si en Fase 2/3 se implementa el fee por referido:

- El acuerdo debe respetar las reglas del CAMDP sobre división de honorarios y captación.
- Los términos se firman con cada abogado listado.
- El sitio no cobra al consultante; solo al abogado, si corresponde.

## 6. Trazabilidad

Cada lead generado desde el chat queda registrado con:

- Timestamp UTC.
- IP anonimizada (últimos 8 bits enmascarados).
- Consentimiento marcado (`consent_at`).
- Fuente: `referido_por_moix`.
- Área detectada por el chatbot y abogado recomendado.

## 7. Contacto y auditoría

Responsable del tratamiento: Dr. Cristian Moix.
Correo para ejercicio de derechos ARCO: `datos@moixlegal.com.ar`.
Revisión legal del documento: al menos una vez por año, o ante cambios normativos relevantes.
