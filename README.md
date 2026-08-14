# Sistema de Administración para Tienditas / Abarrotes

## Descripción general

Plataforma web para la administración de una tienda de abarrotes ("tiendita"), pensada para dos tipos de usuario: el **encargado/dueño** y el **cajero**. Permite gestionar compras a proveedores, ventas, cierres de caja y control de almacén (inventario).

## Objetivo

Ofrecer una herramienta simple y accesible que le permita a cualquier persona, sin conocimientos técnicos, registrar su tienda y comenzar a operar (ventas, inventario, proveedores) sin fricción.

> **Nota:** "Accesible" aquí se interpreta como facilidad de uso (UX simple, curva de aprendizaje baja, pensado para usuarios no técnicos). Si además se busca cumplir estándares de accesibilidad web (WCAG), debe declararse como requerimiento no funcional aparte.

## Roles del sistema

| Acción | Encargado | Cajero |
|---|:---:|:---:|
| Registrar tienda | ✅ | ❌ |
| Agregar / eliminar productos | ✅ | ❌ |
| Editar precio de un producto | ✅ | ✅ |
| Consultar listado de productos | ✅ | ✅ |
| Aceptar / gestionar cajeros | ✅ | ❌ |
| Ver resumen del mes | ✅ | ❓ *(a definir)* |
| Ver resumen del día | ✅ | ✅ |
| Cobrar productos (venta) | ✅ | ✅ |
| Generar cierre de caja | ✅ | ✅ |
| Administrar almacén (cantidades) | ✅ | ✅ |
| Ver pedidos a proveedores | ✅ | ✅ |
| Crear un pedido a proveedor | ✅ | ❓ *(a definir)* |
| Marcar pedido como recibido/finalizado | ✅ | ✅ |
| Gestionar proveedores (alta/edición) | ✅ | ❓ *(a definir)* |

Los ítems marcados con ❓ son ambiguos en la versión original y deben resolverse antes de implementar permisos.

---

## Requerimientos funcionales

### 1. Autenticación y registro
- **RF-01:** El sistema debe permitir registrar un usuario con correo, nombre, contraseña y tipo de usuario (Encargado o Cajero).
- **RF-02:** El sistema debe validar que el correo no esté previamente registrado.
- **RF-03:** El sistema debe permitir iniciar sesión con correo y contraseña.
- **RF-04:** *(pendiente de definir)* El sistema debe permitir recuperar/restablecer contraseña.

### 2. Gestión de tienda (Encargado)
- **RF-05:** Tras registrarse como Encargado, el usuario debe completar un formulario con nombre y dirección de su tiendita.
- **RF-06:** Al registrar la tiendita, el sistema debe generar un UID único que la identifique.
- **RF-07:** *(fuera de alcance v1)* Un encargado podrá administrar múltiples tienditas en el futuro. En esta versión, un encargado tiene una sola tiendita.
- **RF-08:** El Encargado debe poder ver un resumen mensual de su tiendita (ventas, cierres de caja, etc.).

### 3. Gestión de cajeros
- **RF-09:** El Cajero debe registrarse indicando el UID de la tiendita en la que trabaja.
- **RF-10:** *(pendiente de definir)* Mecanismo para que el cajero obtenga el UID (¿el encargado se lo comparte manualmente desde su panel? ¿código/link de invitación?).
- **RF-11:** *(pendiente de definir)* Al registrarse, el cajero debe quedar en estado "pendiente" hasta que el Encargado lo acepte. Mientras esté pendiente, no debería poder operar en el sistema.
- **RF-12:** El Encargado debe poder ver el listado de cajeros de su tiendita, aceptarlos y revocarles el acceso.

### 4. Productos
- **RF-13:** El Encargado debe poder crear, editar (todos los campos) y eliminar productos.
- **RF-14:** El Cajero solo debe poder editar el precio de un producto y consultar su información.
- **RF-15:** *(pendiente de definir)* Campos mínimos de un producto: nombre, precio de venta, costo (opcional), cantidad en almacén, categoría (opcional), unidad de medida, código de barras (opcional).

### 5. Ventas / Cobro
- **RF-16:** El sistema debe permitir registrar una venta seleccionando uno o varios productos (tipo carrito).
- **RF-17:** El sistema debe calcular el total automáticamente y guardar un registro de la venta (para el historial del día).
- **RF-18:** *(pendiente de definir)* Al registrar una venta, el sistema debe descontar automáticamente la cantidad correspondiente del almacén.
- **RF-19:** *(pendiente de definir)* Registrar método de pago (efectivo/tarjeta), necesario para que el cierre de caja tenga sentido.

### 6. Resumen y cierre de caja
- **RF-20:** El sistema debe mostrar un resumen del día con el historial de cobros realizados.
- **RF-21:** El sistema debe permitir generar el cierre de caja del día.
- **RF-22:** *(pendiente de definir)* El cierre de caja debe especificar qué información incluye: total vendido, efectivo esperado, efectivo contado, diferencia, desglose por método de pago.
- **RF-23:** *(pendiente de definir)* Una vez generado el cierre del día, ¿se bloquean las ventas de ese día para evitar modificaciones posteriores?

### 7. Almacén / Inventario
- **RF-24:** El Encargado y el Cajero deben poder consultar y actualizar las cantidades disponibles de cada producto.
- **RF-25:** *(pendiente de definir)* Al marcar un pedido a proveedor como recibido, el sistema debe actualizar automáticamente las cantidades en almacén.
- **RF-26:** El sistema no debe permitir que el stock de un producto sea negativo.

### 8. Proveedores
- **RF-27:** El sistema debe permitir registrar proveedores con su información de contacto y los productos que suministran.
- **RF-28:** El Encargado debe poder guardar una lista de "Productos solicitados comúnmente" por proveedor, para prellenar pedidos futuros.

### 9. Pedidos a proveedores
- **RF-29:** El Encargado debe poder crear una lista de tipo "Pedido" asociada a un proveedor específico.
- **RF-30:** Un pedido puede tener 3 estados: **Pendiente**, **Finalizada**, **No confirmada**.
- **RF-31:** Un pedido tiene una duración máxima de 2 semanas en estado Pendiente antes de pasar automáticamente a "No confirmada" (requiere un proceso automático / job programado).
- **RF-32:** *(pendiente de definir)* ¿Quién puede marcar un pedido como "Finalizada" — solo el Cajero, o también el Encargado?
- **RF-33:** Un pedido en estado "No confirmada" debe eliminarse automáticamente transcurrido un tiempo adicional (job programado).
  - *(pendiente de definir)* ¿Ese plazo se cuenta desde la creación del pedido, o desde que pasó a "No confirmada"?
- **RF-34:** El Encargado debe poder generar un nuevo pedido a partir de la lista de "Productos solicitados comúnmente" de un proveedor.

---

## Reglas de negocio: ciclo de vida de un Pedido

```
[Creado] → Pendiente
             │
             ├── Se marca como recibido ──────────► Finalizada
             │
             └── Pasan 2 semanas sin finalizar ───► No confirmada
                                                        │
                                                        └── Pasa un plazo adicional
                                                            (a definir desde cuándo)
                                                            ──► Se elimina
```

---

## Consideraciones no funcionales

- **Multi-tenancy:** los datos de cada tiendita deben estar completamente aislados; un cajero no debe poder acceder a información de una tiendita distinta a la suya.
- **Seguridad:** contraseñas hasheadas, sesiones seguras, control de permisos por rol en cada endpoint (no solo en la interfaz).
- **UX/Accesibilidad:** interfaz simple, mobile-first (muchas tienditas operan desde celular).
- **Conectividad:** evaluar si se necesita soporte para baja conectividad u operación offline, común en este tipo de negocios.
- **Respaldo de datos:** backups periódicos, considerando que es información financiera del negocio.

## Preguntas / puntos por definir

- [x] ¿Cómo obtiene el cajero el UID de la tiendita?
  - El encargado la otorga
- [x] ¿El cajero queda "pendiente" hasta ser aceptado? ¿Puede usar el sistema mientras tanto?
  - No
- [x] ¿Quién puede finalizar un pedido: solo cajero, o también encargado?
  - Ambos
- [ ] ¿Se actualiza el almacén automáticamente al recibir un pedido?
- [ ] ¿Qué información exacta lleva el cierre de caja?
- [ ] ¿El cajero puede ver el resumen mensual, o solo el diario?
- [ ] ¿El cajero puede crear pedidos o solo consultarlos/recibirlos?
- [ ] ¿El plazo de eliminación de un pedido "No confirmada" se cuenta desde su creación o desde que cambió de estado?
- [ ] ¿Se requiere soporte offline?

## Usuarios de prueba
Encargado: carlos.ruiz@ejemplo.com / encargado123
Empleado: laura.gomez@ejemplo.com / empleado123
Admin: admin@minishop.com / admin123