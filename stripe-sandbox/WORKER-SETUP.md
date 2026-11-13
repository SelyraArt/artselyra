# Prueba aislada de Stripe Embedded Checkout

Código: `worker.js`. Preparado para pegar en el editor del Worker de Cloudflare llamado `selyra-payments-test`. **No desplegado automáticamente.**

## Configuración
1. En Cloudflare Worker → Configuración → Variables y secretos: mantener `STRIPE_SECRET_KEY` como secreto, con valor `sk_test_...`.
2. Añadir `STRIPE_PUBLISHABLE_KEY` con valor `pk_test_...` (variable normal o secreto). No compartir claves en chats ni capturas.
3. En Cloudflare → Editar código: sustituir `Hello World` por `worker.js` y pulsar Implementar.
4. Abrir la URL `https://selyra-payments-test.<subdominio>.workers.dev/` para visualizar el pago integrado de prueba.
5. Usar las tarjetas de prueba oficiales de Stripe; verificar la transacción en Stripe sandbox.

## Límites de seguridad
- Precio de prueba fijo: `price_1UUv335fqJSLSBtdZ6JwXgIi` (1 EUR). Solo clave de Stripe `sk_test_` aceptada; no hay pagos reales.
- No conecta aún con el carrito de artselyra.com, no recoge envíos, no aplica impuestos automáticos ni crea pedidos reales.
- No usar este prototipo para producción: antes se necesita validar catálogo, precios, disponibilidad, gastos de envío, impuestos, autenticación/limitación de solicitudes, almacenamiento de pedidos y webhooks Stripe firmados. Los originales únicos requieren prevención de ventas duplicadas.
- La ruta /return no verifica pagos. Verificar mediante webhook antes de marcar pedidos como pagados.
- La web pública en GitHub Pages no se modifica.
