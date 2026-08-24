// Fase 1: chequeo simple de solapamiento en la DB local.
// Fase 2: integrar Cal.com API para leer y bloquear slots.
import { appointmentsRepo } from '../repositories/appointments.repo.js';

export function isSlotAvailable(lawyerId, slotAt) {
  return !appointmentsRepo.existsForLawyerAtSlot(lawyerId, slotAt);
}
