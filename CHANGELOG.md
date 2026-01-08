# Changelog

## [1.1.0](https://github.com/Fridgeo/FridgeCookAPI/compare/v1.0.0...v1.1.0) (2026-01-08)


### Features

* add ingredients and diets management with CRUD operations ([8a15c6f](https://github.com/Fridgeo/FridgeCookAPI/commit/8a15c6f7f15a66c640c32d07d5b99eb228108bc7))
* ajouter la documentation de l'API FridgeCook ([0406227](https://github.com/Fridgeo/FridgeCookAPI/commit/0406227184539647eae71a654e89b2ebb68fd993))
* ajouter la table User dans la base de données ([2764da6](https://github.com/Fridgeo/FridgeCookAPI/commit/2764da6d96bade6d3241eef3de1f4bef597d9564))
* ajouter le fichier de configuration pour PM2 ([4b5b85d](https://github.com/Fridgeo/FridgeCookAPI/commit/4b5b85d829202e53d90663c243d209ac48482218))
* ajouter le fichier docker-compose.yml pour la configuration de la base de données ([59b444f](https://github.com/Fridgeo/FridgeCookAPI/commit/59b444fecdb7c0bca64b68387b86c3ffa4212a26))
* ajouter le fichier migration_lock.toml pour la gestion des migrations ([b77921f](https://github.com/Fridgeo/FridgeCookAPI/commit/b77921f78589b881bc7816010171ac5518f9c8e3))
* ajouter le modèle User dans le schéma Prisma ([cdf1a2c](https://github.com/Fridgeo/FridgeCookAPI/commit/cdf1a2c503cb8972e5193f7377299754c167a1f6))
* ajouter le module Recette dans AppModule ([02df093](https://github.com/Fridgeo/FridgeCookAPI/commit/02df0938a50bf065658120abd0727eca0d9e33dc))
* ajouter les dépendances Prisma pour la gestion de la base de données ([efe9c1c](https://github.com/Fridgeo/FridgeCookAPI/commit/efe9c1cd4e4e567d894e76f8ce1377a18bc0c0bf))
* ajouter les interfaces TranslatableString et Step pour gérer le contenu multilingue ([3eab801](https://github.com/Fridgeo/FridgeCookAPI/commit/3eab8014075bc31e4187411e00d82b2f01b37cfb))
* ajouter un fichier .env.example pour la configuration de la base de données ([e451bc5](https://github.com/Fridgeo/FridgeCookAPI/commit/e451bc524e2fb4a538d6dd352c5918a798194909))
* ajouter un script pour lancer Prisma Studio ([bbf3674](https://github.com/Fridgeo/FridgeCookAPI/commit/bbf3674749ef4bdb2139d8d23a0261430d694a53))
* mettre à jour les dépendances pour inclure @nestjs/swagger et @scalar/nestjs-api-reference ([b5c438b](https://github.com/Fridgeo/FridgeCookAPI/commit/b5c438b547b98c71dae5d03c651635ff4a924d92))


### Bug Fixes

* corriger l'espacement dans AppModule et ajouter un message de connexion dans PrismaService ([241abd3](https://github.com/Fridgeo/FridgeCookAPI/commit/241abd3efe61a3f9bd49510166ae8b6d940fb9e2))
* corriger le chemin d'importation de PrismaClient dans prisma.service.ts ([51b28d4](https://github.com/Fridgeo/FridgeCookAPI/commit/51b28d49972208ac71857c3e509d002461b86725))
* corriger le nom du conteneur de la base de données dans docker-compose.yml ([f194130](https://github.com/Fridgeo/FridgeCookAPI/commit/f194130ce9ade8fd745f3833ed47f3f730ce143b))
* supprimer une ligne vide dans docker-compose.yml ([75fbcda](https://github.com/Fridgeo/FridgeCookAPI/commit/75fbcda9aa91655630bff9ea133ee479454a27b0))

## 1.0.0 (2026-01-08)


### Features

* ajouter des tests de bout en bout pour AppController ([991364a](https://github.com/Fridgeo/FridgeCookAPI/commit/991364a7a00658eebcea3e0205786c4aab8e7c1f))
* ajouter la configuration Jest pour les tests de bout en bout ([f119c9a](https://github.com/Fridgeo/FridgeCookAPI/commit/f119c9a0d21257e213de93e832cfbb1011676edf))
* ajouter la dépendance 'prisma' dans package.json ([5a367ab](https://github.com/Fridgeo/FridgeCookAPI/commit/5a367ab0b278e3a5f409f67ea21e79f0529445b9))
* ajouter le contrôleur AppController avec une méthode getHello ([03f8ba9](https://github.com/Fridgeo/FridgeCookAPI/commit/03f8ba94f70e0fcc28cacc70e074ccef781c19ec))
* ajouter le fichier de configuration Prisma ([ed1ea90](https://github.com/Fridgeo/FridgeCookAPI/commit/ed1ea9095ac245d89aeec7fdc2b60ec30bcda7b3))
* ajouter le fichier de schéma Prisma ([94ef322](https://github.com/Fridgeo/FridgeCookAPI/commit/94ef3226966d5d2c63193f5c179e5034e6788895))
* ajouter le fichier principal main.ts avec la configuration de démarrage de l'application ([2dcfcee](https://github.com/Fridgeo/FridgeCookAPI/commit/2dcfcee2c10ec135e4d493a23594342baaa1ca21))
* ajouter le module principal AppModule avec les contrôleurs et services nécessaires ([9e356eb](https://github.com/Fridgeo/FridgeCookAPI/commit/9e356eb97c8a6f2b523a2f492bc499db6617bd74))
* ajouter le répertoire 'generated/prisma' au fichier .gitignore ([62b6dc3](https://github.com/Fridgeo/FridgeCookAPI/commit/62b6dc35742f3ed467e85f24d1c82c94b1d0e521))
* ajouter le service AppService avec une méthode getHello ([7a21637](https://github.com/Fridgeo/FridgeCookAPI/commit/7a2163745afe4de5c36d3b0d8611fb74e9b2aafa))
* ajouter le service Prisma pour la gestion de la base de données ([0b0436c](https://github.com/Fridgeo/FridgeCookAPI/commit/0b0436cb2ed8ff8f340c88817270ad2597d03a52))
* ajouter le workflow release-please pour la gestion des versions ([010ef03](https://github.com/Fridgeo/FridgeCookAPI/commit/010ef03ea91a532a78189a5e3a71a34d2cf63ecc))
* initialize NestJS project with essential configuration files ([fb40d10](https://github.com/Fridgeo/FridgeCookAPI/commit/fb40d10d44f50a53dbf61fcb69a4fe558611ae40))
* renommer le script 'start:dev' en 'dev' dans package.json ([7f7c268](https://github.com/Fridgeo/FridgeCookAPI/commit/7f7c2685b35dfec5811cf35c94d5d3edbc881bff))
