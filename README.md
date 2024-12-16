# Washed Up

## Deployed project

### Svelte (Admin Panel)

https://washed-up.frederikbarbre.dk

### Expo (User Frontend)

- Link til apk indsættes her

Da Apple kræver $100 for at få æren for at installere preview builds af appen, kræver det desværre at man kører et build lokalt, ønsker man at teste appen på iOS. Se nedenstående steps omkring lokal installation.

## Lokal installation

Ønsker man at teste projektet lokalt, i stedet for den hostede løsning, kan man køre det med følgende steps:

For at installere nødvendige node modules, kør igennem terminalen, npm install (eller bun install) i roden, i frontend-expo, i frontend-svelte og backend-laravel. I backend-laravel kræver det også man kører "composer install".

For at teste development lokalt, kan man i frontend-svelte skrive "npm run dev", i frontend-expo "npm go" for at starte appen i Expo Go, og i backend-laravel "php artisan serve" for at starte php serveren.

## Test Bruger

## Kode kommentering

Da vi har arbejdet i 3 forskellige frameworks, kan det være lidt svært at finde comments. Derfor har vi lavet en liste så i let kan finde de stier vi primært har arbejdet i.

| Framework | Path                             |
| --------- | -------------------------------- |
| Laravel   | `backend-laravel/app/`           |
| Laravel   | `backend-laravel/database/`      |
| Laravel   | `backend-laravel/routes/api.php` |
| Expo      | `frontend-expo/api`              |
| Expo      | `frontend-expo/app`              |
| Expo      | `frontend-expo/components`       |
| Svelte    | `frontend-svelte/src`            |

## CLI Commands

- `php artisan users:list`
- `php artisan admin:create {{user_id}}`
- `php artisan location:create "Ringvej Syd 104, 8260 Viby"`
- `php artisan db:nuke`

## Tech stack

### Frontend

- Expo: User Frontend
- Svelte 5: Admin Panel

### Backend

- Laravel
- MySQL

### DevOps

- VPS (Hetzner)
- Docker
- Docker Compose
- Nginx

## Case specifics

### Frontend

- React Native App frontend
- Udlejning af vaskemaskine og tørretumbler
- Brugere skal scanne en QR kode for at kunne registrere
- Brugere kan scanne en QR kode på vaskemaskinen eller tørretumbleren for at leje dem
- Alternativt taste en kode som står under QR koden, hvis kamera ikke virker
- De kan bestemme hvor meget tid (vask default 3 timer, tørretumbler default 1:30 time)
- Kan også leje igennem appen til en senere dato/tid
- Kan se hvilke vaskemaskiner og tørretumbler er udlejet

### Admin

- Svelte frontend
- Kan se hvilke vaskemaskiner og tørretumbler er udlejet
- Kan generere og se indkomst rapporter
- Kan generere labels til QR koder, til print som de skal sætte på vaskemaskinen
- Administere vaskemaskiner og tørretumbler skulle der være nogen problemer

### Backend

- Laravel -> MySQL database
