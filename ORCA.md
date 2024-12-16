### ORCA-analyse

#### **Objekter (O)**

1. **Vaskemaskiner og tørretumblere:**

   - Primære ressourcer, der udlejes.
   - Tilstand: ledig, optaget, under vedligeholdelse.
   - Attributter: serienummer, model, placering, status.

2. **Brugere:**

   - Kunder, der lejer maskinerne.
   - Attributter: navn, email, betalingsoplysninger, historik for udlejning.

3. **QR-koder og alternative koder:**

   - Identifikatorer for maskinerne.
   - Attributter: unikke ID’er, associeret maskine.

4. **Udlejninger:**

   - Repræsenterer transaktioner mellem brugere og maskiner.
   - Attributter: starttidspunkt, sluttidspunkt, maskine, bruger.

5. **Administratorer:**

   - Håndterer systemet og vedligeholder maskiner.
   - Attributter: navn, rolle, loginoplysninger.

6. **Rapporter:**

   - Genereres til at vise indtjening og brugsstatistik.
   - Attributter: tidsperiode, indtjening pr. maskine, samlet indtjening.

7. **Tidsplaner:**

   - Bruges til fremtidig reservation af maskiner.
   - Attributter: dato, tid, maskine, bruger.

8. **Betalinger:**

   - Repræsenterer betalingstransaktioner
   - Attributter: beløb, tidspunkt, status, betalingsmetode

9. **Notifikationer:**
   - System-til-bruger kommunikation
   - Attributter: type, besked, status, modtager

---

#### **Relationer (R)**

1. **Bruger <-> Maskine:**

   - En bruger kan leje en maskine.
   - Relation: "Leje" mellem en bruger og en maskine (tidspunkt, varighed).

2. **Admin <-> Maskine:**

   - Admin kan tilføje, fjerne, eller opdatere status for maskiner.

3. **Bruger <-> Udlejning:**

   - En bruger kan have en eller flere aktive og tidligere udlejninger.

4. **Admin <-> Rapport:**

   - Admin kan generere rapporter for økonomisk overblik og maskinbrug.

5. **Maskine <-> QR-kode:**

   - Hver maskine har en unik QR-kode.

6. **Udlejning <-> Tidsplan:**

   - Udlejning kan planlægges på forhånd og kobles til en fremtidig tidsplan.

7. **Bruger <-> Betaling:**

   - En bruger har tilknyttet betalinger
   - Betalinger er knyttet til udlejninger

8. **Bruger <-> Notifikation:**
   - Brugere modtager systemnotifikationer

---

#### **Call-to-Actions (C)**

1. **For brugere:**

   - Scan en QR-kode for at starte en udlejning.
   - Tast en kode manuelt for at starte en udlejning, hvis QR-koden ikke virker.
   - Vælg varighed af brugen.
   - Reserver maskiner til en senere dato/tid.
   - Tjek tilgængelighed af maskiner.

2. **For admin:**
   - Overvåg maskinstatus i realtid.
   - Generér og download indkomstrapporter.
   - Udskriv QR-kode labels til nye maskiner.
   - Håndter problemer med maskiner (fx statusændring eller vedligeholdelse).

---

#### **Attributter (A)**

1. **Maskiner:**

   - ID, status (ledig, optaget, under vedligeholdelse), model, placering.

2. **Bruger:**

   - ID, navn, email, betalingsoplysninger, udlejningshistorik.

3. **QR-koder:**

   - Maskin-ID, unik kode.

4. **Udlejninger:**

   - Starttidspunkt, sluttidspunkt, maskine, bruger.

5. **Tidsplaner:**

   - Maskine, bruger, planlagt dato og tid.

6. **Rapporter:**

   - Dato, indtjening, brug per maskine.

7. **Admin:**

   - ID, navn, rolle.

8. **Betalinger:**

   - TransaktionsID, beløb, tidspunkt, status

9. **Notifikationer:**
   - ID, type, besked, tidspunkt, læst-status

---

### Opsummering

Denne analyse strukturerer de vigtigste komponenter i systemet og deres interaktioner. Brugere og maskiner er de centrale objekter, mens QR-koder og tidsplaner er nøgleelementer for udlejning og interaktion. Call-to-Actions fokuserer på funktioner, der gør systemet brugervenligt og administrativt effektivt. Attributterne sikrer, at alle objekter og relationer har de nødvendige data til at understøtte appens funktionalitet.
