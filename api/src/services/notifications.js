// Fase 1: stubs. Fase 2: integración real con Resend y Twilio.
export async function notifyLeadCreated(lead) {
  console.log('[notifications] lead creado', { id: lead.id, area: lead.area });
}

export async function notifyAppointmentBooked(appointment) {
  console.log('[notifications] turno reservado', { id: appointment.id, slot: appointment.slot_at });
}
