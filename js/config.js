/* ============================================================
   VELOURA — template configuration
   Everything a new client needs to change lives here.
   Prices, service names and copy are edited directly in
   index.html — this file controls behaviour and contact.
   ============================================================ */

window.VELOURA = {
  brand: "VELOURA",

  /* WhatsApp number in international format, digits only */
  whatsapp: "918308936941",

  /* Pre-filled messages. {service} / {package} are replaced
     with the item's name from data-service attributes. */
  messages: {
    general: "Hi VELOURA! I'd like to book an appointment. What are your timings?",
    service: "Hi VELOURA! I'd like to book {service}. Could you share available slots this week?",
    bridal: "Hi VELOURA! I'm getting married and would like to know more about {package}. Could we set up a consult?",
    offer: "Hi VELOURA! I'd like to claim the 20% first-visit offer. What slots do you have this week?",
  },

  /* Scroll-triggered offer popup */
  offer: {
    enabled: true,
    scrollDepth: 0.38, // fire after 38% of the page
    fallbackDelay: 30000, // …or after 30s, whichever first
    oncePerSession: true, // uses sessionStorage
  },
};
