# Washed Up

## Tech stack

### Frontend

- React Native: User Frontend
- Svelte 5: Admin Panel

### Backend

- Laravel
- MySQL

## Case specifics

### Frontend

- Udlejning af vaskemaskine og tørretumbler
- React Native App frontend
- Brugere skal scanne en QR kode for at kunne registrere
- Brugere kan scanne en QR kode på vaskemaskinen eller tørretumbleren for at leje dem
- Alternativt taste en kode som står under QR koden, hvis kamera ikke virker
- De kan bestemme hvor meget tid (vask default 3 timer, tørretumbler default 1:30 time)
- Kan også leje igennem appen til en senere dato/tid

### Admin

- Svelte frontend
- Kan se hvilke vaskemaskiner og tørretumbler er udlejet
- Kan generere og se indkomst rapporter
- Kan generere labels til QR koder, til print som de skal sætte på vaskemaskinen
- Administere vaskemaskiner og tørretumbler skulle der være nogen problemer

### Backend

- Laravel -> MySQL database
