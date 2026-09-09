# Runway: odcinek 01

Zasady ogólne (modele, kształt węzłów, koszty, kolejność pracy, pułapki) są w `produkcja.md` w katalogu głównym. Tutaj tylko to, co dotyczy tego odcinka.

## Scena 1: kuchnia u Olka

Workflow **01 scena 1 - kuchnia u Olka** w projekcie fairyTale.

- Id: `a94fa1c8-cb39-4d69-9ce6-1f40357ffa1f`
- Edytor: <https://app.runwayml.com/video-tools/teams/parciszewski/ai-tools/workflows/a94fa1c8-cb39-4d69-9ce6-1f40357ffa1f/edit>
- Definicja: `runway-scena-1.json` (z niej `narzędzia/graf-runway.js` buduje graf)
- Wersja grafu: 24. 49 węzłów, 52 połączenia, 6 ujęć po 5 s, 14 kwestii.

**Referencje:**

| Węzeł | Asset | Id |
|---|---|---|
| Olek | `olek-kanon.png` (wersja 2: koszulka baby blue, jasne jeansy) | `0b19d26e-cd40-4678-85a4-f3ec45410a15` |
| Tomek | `tomek-kanon` | `c7f2a7f0-7a74-4cc9-9b2c-3928fc625f09` |
| Mieszkanie | `dom-olka` (widok izometryczny, zadanie `82ef5500`) | `9ec36d68-20df-4ff8-90a9-187462340be7` |

**Ujęcia:**

| Ujęcie | Co widać | Referencje | Kwestia w `referenceAudio` |
|---|---|---|---|
| 1.1 | kuchnia rano, Tomek podrzuca placek, Olek klaszcze | Olek, Tomek, mieszkanie | TOMEK: „Dziękuję, dziękuję. Placek numer trzy, prosto z nieba.” |
| 1.2 | zbliżenie: banan jako dwoje oczu i uśmiech | Olek, mieszkanie | OLEK: „Ten się śmieje. Tego zjem pierwszego.” |
| 1.3 | ciepło-zimno: Tomek w lodówce | Olek, Tomek, mieszkanie | OLEK: „Zimno. Bardzo zimno.” |
| 1.4 | pudełko po butach ze skarbami | Olek, Tomek, mieszkanie | TOMEK: „Mój zegarek jest w twoich skarbach?” |
| 1.5 | kluczowe: zajączek od zegarka na suficie | Olek, Tomek, mieszkanie | brak dialogu w tym miejscu |
| 1.6 | Olek w drzwiach ogląda się na pusty sufit | Olek, mieszkanie | brak dialogu w tym miejscu |

Pozostałe 10 kwestii ma własne węzły mowy i wychodzi jako osobne pliki audio do montażu: to bity dziejące się poza tymi sześcioma kadrami (alarm przy stole, chlebak, „Cieplej… Gorąco!”, wymiana o skarbach, wyjście do butów).

**Scena ma około 65 sekund ekranu**, a sześć ujęć po 5 s pokrywa 6 z 10 beatów. Do pełnej sceny brakuje 4-6 ujęć: Tomek klepie kieszenie („Alarm"), chlebak, wyjście w stronę pokoju („Cieplej… Gorąco!") i — najważniejsze — Olek patrzy w sufit, potem na rękę taty, potem znowu w sufit.

## Głosy w tym odcinku

Jeden węzeł na postać, wpięty we wszystkie jej kwestie:

- Olek: **Rachel** — feminine, young, childish — `zrHiDhphv9ZnVXBqCLjz` (węzeł `86a0039c-a2d5-4967-b42b-732ae3959050`, 8 kwestii)
- Tomek: **James** — masculine, middle aged, casual — `IKne3meq5aSn9XLyUdCD` (węzeł `8162a45a-c885-4c71-ac48-5baba4e37071`, 6 kwestii)

Ustawione, ale nieodsłuchane; do zatwierdzenia albo podmiany (pytanie G2 w `TODO.md`). Inni kandydaci z listy Runway: dla Olka `Pip` (feminine, young, cute) `XJ2fW4ybq7HouelYYGcL`, `Katie` (feminine, young, soft) `EXAVITQu4vr4xnSDxMaL`; dla Tomka `Tom` (authoritative) `onwK4e9ZLuTAKqWW03F9`, `Malachi` (confident) `zYcjlYFOd3taleS0gkk3`, `Benjamin` (deep) `pNInz6obpgDQGcFmaJgB`.

## Próba ujęcia 1.1 (2026-09-09)

Uruchomione cztery węzły: kadr, kwestia Tomka, dźwięk tła, ujęcie Seedance. Task `d96b09c7-9672-4b82-8d24-a20508e64d23`. Kadr, kwestia i tło policzyły się w około dwie minuty (27 kredytów razem). Ujęcie wideo po dwudziestu minutach nadal wisiało w kolejce Seedance, bez błędu; stan w „Active runs" w edytorze.

**Kadr zgadza się z kartami:** kuchnia z magnesami i rysunkami na lodówce, chlebak, patelnia na haku, zioła, stół przy oknie, w tle niebieska kanapa, regał z roślinami i model pociągu taty; Tomek w oliwkowej koszuli, dżinsach i z zegarkiem; Olek w nowym kanonie. Kamera w pokoju, nie izometryczna.

**Poprawione w `runway-scena-1.json` po tej próbie** (jeszcze nie wysłane do Runway; wersja 24 w edytorze ma stare prompty, poprawki wejdą przy najbliższym `save_workflow_version`):

1. Trzy placki naraz (jeden leciał, dwa wisiały przy lodówce, patelnia odsunięta) → prompt mówi teraz o jednym placku dokładnie nad patelnią.
2. Model dorysował nutkę przy głowie Tomka → w `wspolne` doszło wykluczenie symboli i nutek.
3. Olek siedział na krześle bez poduszki, choć scenariusz mówi, że ma poduszkę → dopisane w promptach 1.1 i 1.3.

**Do obserwacji:** spodnie Olka czytały się jako szare, nie jako jasne dżinsy z kanonu.

## Do rozstrzygnięcia

- **Bluza kontra kanon** — scenariusz mówi „do kieszeni bluzy”, kanon jest bez bluzy; prompty mówią „do kieszeni”. Pytanie G1 w `TODO.md`.
- **Referencja Tomka** — asset `tomek-kanon` pochodzi z zadania `bd51f021`, które karta Tomka wymienia jako odrzucony wariant B. Pytanie G3 w `TODO.md`.
- **Kuchnia nie ma własnego kanonu.** Pierwszy zatwierdzony kadr 1.1 powinien nim zostać i wejść jako czwarta referencja do pozostałych ujęć; referencja izometryczna trzyma układ, ale nie wygląd kadru z poziomu oczu.
- **Czy `referenceAudio` faktycznie synchronizuje usta** — do sprawdzenia na pierwszym udanym ujęciu.
- Sceny 2-6: ten sam schemat, osobna definicja i osobny workflow na scenę.
