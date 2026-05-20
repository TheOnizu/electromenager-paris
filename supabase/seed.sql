-- Seed de données de démo
-- À exécuter après schema.sql dans l'éditeur SQL Supabase (ou lors du docker-compose local)

-- ── Marques ──────────────────────────────────────────────────────────────────
insert into brands (name, logo_url) values
  ('Bosch',       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Bosch-logo.svg/320px-Bosch-logo.svg.png'),
  ('Samsung',     'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/320px-Samsung_Logo.svg.png'),
  ('LG',          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/320px-LG_logo_%282015%29.svg.png'),
  ('Whirlpool',   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Whirlpool_logo_2020.svg/320px-Whirlpool_logo_2020.svg.png'),
  ('Siemens',     'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/320px-Siemens-logo.svg.png'),
  ('Electrolux',  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Electrolux-logo.svg/320px-Electrolux-logo.svg.png'),
  ('Miele',       'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Miele_Logo.svg/320px-Miele_Logo.svg.png'),
  ('Beko',        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Beko_logo.svg/320px-Beko_logo.svg.png')
on conflict do nothing;

-- ── Avis publiés ─────────────────────────────────────────────────────────────
insert into reviews (author_name, rating, comment, status) values
  ('Sophie M.',    5, 'Intervention rapide et efficace pour mon lave-linge Bosch. Technicien très professionnel, problème résolu en moins d''une heure. Je recommande vivement !', 'published'),
  ('Thomas B.',    5, 'Mon réfrigérateur Samsung ne refroidissait plus. Diagnostique précis et réparation le jour même. Tarif raisonnable pour la qualité du service.', 'published'),
  ('Camille R.',   4, 'Très bon service, ponctuel et soigneux. Mon lave-vaisselle Siemens fonctionne à nouveau parfaitement. Seul bémol : j''aurais aimé un rappel la veille.', 'published'),
  ('Marc L.',      5, 'Excellent technicien ! Four Whirlpool réparé rapidement. Il a pris le temps d''expliquer la panne et les précautions à prendre. Service impeccable.', 'published'),
  ('Isabelle K.',  5, 'Je suis ravie ! Mon sèche-linge LG a été réparé en 45 minutes. Tarif transparent, pas de mauvaise surprise. Je referai appel à ce professionnel sans hésiter.', 'published'),
  ('François D.',  4, 'Bonne prestation, lave-linge Electrolux réparé correctement. Léger délai sur le créneau mais le technicien a prévenu. Travail de qualité.', 'published')
on conflict do nothing;

-- ── Disponibilités (30 prochains jours ouvrés) ───────────────────────────────
do $$
declare
  d date := current_date + 1;
  day_of_week int;
begin
  while d <= current_date + 30 loop
    day_of_week := extract(dow from d); -- 0=dim, 6=sam
    if day_of_week between 1 and 6 then  -- lundi à samedi
      insert into availability (date, is_available)
      values (d, true)
      on conflict (date) do nothing;
    end if;
    d := d + 1;
  end loop;
end $$;

-- ── Paramètres par défaut (si pas encore insérés) ────────────────────────────
insert into settings (key, value) values
  ('cgv_text', 'En faisant appel à nos services, vous acceptez les conditions suivantes :

1. DEVIS : Un diagnostic est effectué sur place avant toute intervention. Le devis est gratuit et sans engagement. Aucun frais ne sera facturé en cas de refus du devis.

2. PAIEMENT : Le règlement est dû à la fin de l''intervention, par espèces ou virement bancaire.

3. GARANTIE : Toutes nos réparations sont garanties 3 mois pièces et main-d''œuvre. En cas de récidive du même problème, nous intervenons gratuitement.

4. ANNULATION : Toute annulation doit être signalée au moins 24h avant l''intervention prévue.

5. ZONE D''INTERVENTION : Nos interventions sont limitées à Paris intra-muros (75).

En soumettant ce formulaire, vous reconnaissez avoir lu et accepté l''intégralité de ces conditions.'),
  ('review_delay_days', '3'),
  ('review_channel', 'both')
on conflict (key) do nothing;
