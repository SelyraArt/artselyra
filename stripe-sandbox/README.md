# Selyra — Stripe Embedded Checkout (sandbox)

Esta carpeta es una preparación aislada. No activa pagos en artselyra.com.

## Arquitectura
- GitHub Pages sirve la interfaz estática.
- Un backend seguro crea sesiones de Stripe Checkout con `ui_mode: embedded`.
- El backend verifica productos, precios, disponibilidad y envío; nunca confía en precios enviados por el navegador.
- Webhooks firmados confirman pagos y actualizan pedidos e inventario. Una página de éxito por sí sola no confirma un pago.

## Pendiente antes de conectar
1. Elegir y desplegar hosting del backend con HTTPS.
2. Configurar `STRIPE_SECRET_KEY` de sandbox y `STRIPE_WEBHOOK_SECRET` como secretos del hosting, nunca en GitHub.
3. Obtener la clave publicable de sandbox y el ID de precio `price_...` del producto de prueba.
4. Definir un catálogo real con precios y disponibilidad; los originales deben reservarse de forma atómica para evitar dobles ventas.
5. Definir zonas de envío, tarifas, impuestos de Canarias y países admitidos.
6. Implementar endpoints seguros de creación de sesión y webhook; probar pagos y errores antes de activar.

No pegar claves privadas en archivos, commits ni conversaciones. El producto de 1 € es solo de sandbox.
