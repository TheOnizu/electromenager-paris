import { describe, it, expect } from 'vitest'
import {
  emailConfirmationClient,
  emailNotificationAdmin,
  emailReviewRequest,
  smsConfirmationClient,
  smsReviewRequest,
} from '../server/utils/notification'

describe('Templates de notification', () => {
  describe('emailConfirmationClient', () => {
    it('contient le nom du client', () => {
      const { html } = emailConfirmationClient('Marie Martin', 'lundi 15 juin 2026')
      expect(html).toContain('Marie Martin')
    })

    it('contient la date', () => {
      const { html } = emailConfirmationClient('Marie Martin', 'lundi 15 juin 2026')
      expect(html).toContain('lundi 15 juin 2026')
    })

    it('a un sujet non vide', () => {
      const { subject } = emailConfirmationClient('Marie Martin', '15 juin')
      expect(subject.length).toBeGreaterThan(0)
    })
  })

  describe('emailNotificationAdmin', () => {
    const booking = {
      name: 'Jean Dupont',
      phone: '0612345678',
      email: 'jean@exemple.fr',
      address: '12 rue de la Paix, 75001 Paris',
      date: 'lundi 15 juin 2026',
    }

    it('contient toutes les infos du client', () => {
      const { html } = emailNotificationAdmin(booking)
      expect(html).toContain('Jean Dupont')
      expect(html).toContain('0612345678')
      expect(html).toContain('jean@exemple.fr')
      expect(html).toContain('12 rue de la Paix')
    })
  })

  describe('emailReviewRequest', () => {
    it('contient le lien vers la page avis', () => {
      const { html } = emailReviewRequest('Lucie', 'https://monsite.fr')
      expect(html).toContain('https://monsite.fr/avis')
    })
  })

  describe('smsConfirmationClient', () => {
    it('contient le prénom et la date', () => {
      const sms = smsConfirmationClient('Pierre', '15 juin')
      expect(sms).toContain('Pierre')
      expect(sms).toContain('15 juin')
    })

    it('fait moins de 160 caractères (un seul SMS)', () => {
      const sms = smsConfirmationClient('Jean-Marie Dupont de la Tour', 'lundi 15 juin 2026')
      expect(sms.length).toBeLessThanOrEqual(160)
    })
  })

  describe('smsReviewRequest', () => {
    it('contient le lien vers la page avis', () => {
      const sms = smsReviewRequest('https://monsite.fr')
      expect(sms).toContain('https://monsite.fr/avis')
    })
  })
})
