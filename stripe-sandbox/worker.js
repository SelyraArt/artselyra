// Selyra — Stripe Embedded Checkout sandbox ONLY.
// Deploy to Cloudflare Worker selyra-payments-test after reviewing.
// Required secret: STRIPE_SECRET_KEY (sk_test_...)
// Required plain variable: STRIPE_PUBLISHABLE_KEY (pk_test_...)
// Price is fixed server-side. Never accept arbitrary client-supplied price IDs.
const PRICE_ID = "price_1UUv335fqJSLSBtdZ6JwXgIi";
const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
const html = (content) => new Response(content, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "content-security-policy": "default-src 'self'; script-src 'self' https://js.stripe.com 'unsafe-inline'; frame-src https://checkout.stripe.com https://*.stripe.com; connect-src 'self' https://api.stripe.com https://*.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.stripe.com" } });
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") return json({ status: "ok", mode: "test", payments: "not-live" });
    if (url.pathname === "/" && request.method === "GET") return html(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Selyra · Prueba de pago</title><style>body{font-family:system-ui,sans-serif;background:#f8f7f3;color:#242321;max-width:620px;margin:5vh auto;padding:22px}main{background:white;border:1px solid #ddd;border-radius:14px;padding:28px}h1{font-family:Georgia,serif;font-weight:400}#checkout{min-height:40px}.notice{background:#eee9df;padding:12px;border-radius:8px}button{padding:12px 20px;border:0;border-radius:6px;background:#222;color:#fff}button:disabled{opacity:.5}</style><main><small>SELYRA · ENTORNO DE PRUEBA</small><h1>Pago integrado</h1><p>Obra original (prueba) · 1,00 €</p><p class="notice">Esta página utiliza exclusivamente Stripe en modo de prueba. No se enviará ningún pedido ni se cobrará dinero real.</p><div id="status">Preparando formulario…</div><div id="checkout"></div></main><script src="https://js.stripe.com/v3/"></script><script>
(async()=>{const status=document.getElementById('status');try{const c=await fetch('/config');if(!c.ok)throw new Error('Falta configurar la clave publicable de prueba.');const {publishableKey}=await c.json();const stripe=Stripe(publishableKey);const checkout=await stripe.initEmbeddedCheckout({fetchClientSecret:async()=>{const r=await fetch('/create-checkout-session',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});const data=await r.json();if(!r.ok)throw new Error(data.error||'No se pudo iniciar la prueba');return data.clientSecret}});status.textContent='';checkout.mount('#checkout')}catch(e){status.textContent='No se pudo cargar: '+e.message}})();
</script></html>`);
    if (url.pathname === "/return" && request.method === "GET") return html('<!doctype html><html lang="es"><meta charset="utf-8"><title>Selyra · Prueba</title><body style="font-family:system-ui;padding:40px"><h1>Prueba finalizada</h1><p>Comprueba el resultado del pago en el panel de Stripe (entorno de prueba). Esta página no confirma por sí sola un pago.</p><a href="/">Volver a la prueba</a></body>');
    if (url.pathname === "/config" && request.method === "GET") {
      if (!env.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_")) return json({ error: "Publicable test key not configured" }, 503);
      return json({ publishableKey: env.STRIPE_PUBLISHABLE_KEY });
    }
    if (url.pathname === "/create-checkout-session" && request.method === "POST") {
      if (!env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) return json({ error: "Test secret not configured" }, 503);
      if (!env.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_")) return json({ error: "Test publishable key not configured" }, 503);
      if (Number(request.headers.get("content-length") || "0") > 1024) return json({ error: "Request too large" }, 413);
      const form = new URLSearchParams({
        mode: "payment", ui_mode: "embedded",
        "line_items[0][price]": PRICE_ID, "line_items[0][quantity]": "1",
        return_url: url.origin + "/return?session_id={CHECKOUT_SESSION_ID}",
        "metadata[project]": "selyra-sandbox"
      });
      const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: "Bearer " + env.STRIPE_SECRET_KEY, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      const data = await r.json();
      if (!r.ok) return json({ error: "Stripe could not create a test checkout session", stripeCode: data.error?.code || null }, 502);
      return json({ clientSecret: data.client_secret });
    }
    return json({ error: "Not found" }, 404);
  }
};
