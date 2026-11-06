# Meteo – PWA pro ThingSpeak

Webová aplikace pro Android (a cokoli s prohlížečem), která zobrazuje kanál ThingSpeak.
Výchozí kanál: **349749**. Kanál, Read API Key a interval obnovení jde změnit v nastavení (ozubené kolo).

## Co umí
- dlaždice pro každé pojmenované pole kanálu: aktuální hodnota, trend za poslední hodinu, min/max a křivka za 24 h
- po klepnutí detail s velkým grafem za 24 h / 7 dní / 30 dní (delší období jsou průměrovaná přímo ThingSpeakem), kurzor prstem, statistiky
- stav stanice: vysílá / dlouho bez dat (>20 min) / mlčí (>3 h)
- automatické obnovení (výchozí 1 min) a obnovení při návratu do appky
- funguje offline: ukáže naposledy stažená data
- jednotky bere z názvu pole, např. `Teplota [°C]` nebo `Tlak (hPa)`; bez nich je odhadne podle slova (teplota, vlhkost, tlak, vítr…)

## Nasazení
PWA se dá nainstalovat jen z **HTTPS** adresy. Stačí nahrát celou složku (index.html, manifest.webmanifest, sw.js, icons/) na jakýkoli statický hosting:

- **GitHub Pages**: nový repozitář, nahrát soubory, Settings → Pages → Deploy from branch. Adresa bude `https://<uživatel>.github.io/<repo>/`.
- **Vlastní server / NAS**: libovolný webserver s HTTPS. V tailnetu jde použít `tailscale serve`, který HTTPS certifikát zařídí sám (pak to ale poběží jen na zařízeních v tailnetu).

## Instalace na telefon
Otevři adresu v Chromu → menu ⋮ → **Přidat na plochu / Instalovat aplikaci**.

## Úpravy
- Název appky: `manifest.webmanifest` (`name`, `short_name`) a `<title>` v index.html. Nadpis v appce se bere z názvu kanálu na ThingSpeaku.
- Po změně souborů zvyš `VERSION` v `sw.js`, ať si telefony stáhnou novou verzi.
