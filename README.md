# Washed Up

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
