# Washed Up

## Deployed project

### Svelte (Admin Panel)

* https://washed-up.frederikbarbre.dk

### Expo (User Frontend)

* [Link til Android .apk](https://expo.dev/accounts/washed_up/projects/washedup/builds/c60c72ab-3fca-48d1-a5f6-9122d87d6b21)

Da Apple kræver $100 for at få æren for at installere preview builds af appen, kræver det desværre at man kører et build lokalt, ønsker man at teste appen på iOS. Se nedenstående steps omkring lokal installation.

## Test Bruger

Det er muligt at oprette en bruger selv, men for at få adgang to admin panelet, kan man anvende den nedenstående testbruger.

### Email

- deployed@xyrec.xyz

### Password

- kOdEoRd235

### Stripe testbetaling

- 4242 4242 4242 4242
- Vilkårlig udløbsdato
- Vilkårligt CVC-nummer
- Vilkårligt land

### Lokationer til brugerregistrering

| Code   | Address                           |
| ------ | --------------------------------- |
| 5Y2GQD | Nørrebrogade 157, 2200 København  |
| VE75PK | Banegårdspladsen 1, 8000 Aarhus   |
| ZG5A1W | Østre Stationsvej 27, 5000 Odense |
| 6TVRHY | Vesterbro 27, 9000 Aalborg        |
| 18Q5DN | Exnersgade 22, 6700 Esbjerg       |

### QR-koder til kamerascanning

Disse QR-koder kan bruges til at registere en ny bruger, eller scanne en maskine (hvis man er på den rigtige lokation - VE75PK, Banegårdspladsen 1, 8000 Aarhus)

#### Lokation (VE75PK, Banegårdspladsen 1, 8000 Aarhus)

![QR Location](https://github.com/eaaa-dob-wu-e24a/final-project-fucc/blob/main/qr_location.png)

#### Maskine #7 (Ved ovenstående lokation)

![QR Machine](https://github.com/eaaa-dob-wu-e24a/final-project-fucc/blob/main/qr_machine.png)

## Lokal installation

Ønsker man at teste projektet lokalt på sit IOS Device skal man gøre følgende:
 
- Installer **Expo Go** appen i App Store:
- Klon projektet og åben de i din foretrukne editor
- Opret en ```.env.local```fil på på følgende sti: ```/frontend-expo/.env.local```, og indsæt variabler der kan findes i den afleverede PDF fil.
- ```cd /frontend-expo```
- ```bun i``` eller ```npm i --force```
- ```bun go``` eller ```npm go```
- Du vil få en QR kode i terminalen du kan scanne med dit kamera på dit IOS device, som vil åbne projektet op i **Expo Go** appen.

For at installere nødvendige depandencies, kør igennem terminalen, npm install (eller bun install) i roden og i frontend-expo.

For at teste development lokalt, kan man i frontend-svelte skrive "npm run dev", i frontend-expo "npm go" for at starte appen i Expo Go, og i backend-laravel "php artisan serve" for at starte php serveren.

## Kode kommentering

Da vi har arbejdet i 3 forskellige frameworks, kan det være lidt svært at finde comments. Derfor har vi lavet en liste så i let kan finde de stier vi primært har arbejdet i. 

**NB** Vi har ikke kommenteret shadcn-components.

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

Skal køres i /backend-laravel mappen, efter man har kørt "composer install".

- `php artisan users:list`
- `php artisan admin:create <user_id>`
- `php artisan location:create "Ringvej Syd 104, 8260 Viby"`
- `php artisan notification:test <user_id> <Title> <Body>`

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

## Case description

### Frontend

- React Native App frontend
- Udlejning af vaskemaskine og tørretumbler
- Brugere skal scanne en QR kode for at kunne registrere
- Brugere kan scanne en QR kode på vaskemaskinen eller tørretumbleren for at leje dem
- Alternativt taste en kode som står under QR koden, hvis kamera ikke virker
- Kan også leje igennem appen til en senere dato/tid
- Kan se hvilke vaskemaskiner og tørretumbler er udlejet

### Admin

- Svelte frontend
- Kan se hvilke vaskemaskiner og tørretumbler er udlejet
- Kan generere og se rapporter
- Kan generere labels til QR koder, til print som de skal sætte på vaskemaskinen
- Administere vaskemaskiner og tørretumbler skulle der være nogen problemer
- Administere brugernes tider og sætte priser

### Backend

- Laravel REST API
- MySQL

## ORCA og ER-diagram

Kan findes i deres respektive navngivne filer i roden af projektet.
