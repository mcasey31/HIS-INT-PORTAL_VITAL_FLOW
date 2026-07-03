# HU 17052 - Auditoria del módulo de caja

## Trazabilidad
- Epic: EPICA AUDITORIA
- Feature: FEATURE_17051_AUDITORIA-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17052/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrador de la plataforma ODI Quiero: Que se registre en base de datos las acciones y eventos en el modulo de caja. Para: Poder auditar el comportamiento del sistema en la gestión de cajas. 

 Descripción y comportamiento: Se requiere que cada vez que un usuario realice un evento de login, creación, modificación, cancelación y/o eliminación de datos en el modulo de caja, se registre automáticamente en base toda acción que realice, tomando como condición relevante los siguientes puntos: Identificador del usuario (ID o usuario) 
Fecha y hora exacta (con zona horaria) 
Tipo de acción realizada (creación, modificación, eliminación, cancelación, etc) 
Proceso de la acción (Gestión de Fondo, Apertura o Cierre de caja, Ajuste de caja, Arqueo de Caja, Emitir comprobantes, cobro por caja, Eximir cobro, devolución de cobro, Crear notas de débito o créditos, etc) 
Módulo o componente afectado (Gestión de Cajas) 
Registro o datos afectado (Ejemplo: id paciente, nombres, numero de episodio o encuentro, número de comprobante, id de caja, id del cajero, etc) 
Resultado de la acción (éxito o error) 
URL o endpoint accedido (en sistemas web) 
Dirección IP del usuario. 
Tipo de dispositivo o navegador (user agent) 
Sesión o token utilizado 
Valor anterior y nuevo del dato modificado (si aplica) 
Si fue una acción directa del usuario o automatizada por el sistema 
Si provino de una API, interfaz web, móvil, etc.

## Azure Criterios de Aceptacion
Los registros deben ser inmutables (no editables ni borrables) 
Se debe garantizar el almacenamiento seguro y periódico de estos registros. 
Se debe establecer un plazo mínimo de conservación (por ejemplo, 2 o 5 años, según normativas). 
Solo usuarios autorizados deben poder consultar los registros.

## Azure Tasks
- Task 17522: Análisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



