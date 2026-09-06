# Bajki

Gotowe bajki i te w trakcie pisania. Jedna bajka to jeden folder `NN tytuł/` (numer dwucyfrowy, spacja, tytuł po polsku) z dwoma plikami:

- `konspekt.md` – szkielet: miejsce, postacie, zjawisko, zdarzenie wywołujące, trzy próby, rozwiązanie, jedno pytanie na koniec. Powstaje pierwszy i to jego najczęściej się poprawia.
- `bajka.md` – tekst do czytania na głos z krótką metryką na górze.

Po sprawdzeniu skillem `/sprawdz` w folderze pojawia się też `sprawdzenie.md` z raportem. Raport się nadpisuje przy kolejnym sprawdzeniu.

Szablony obu plików są w `_szablon/`. Skill `/bajka` tworzy folder i wypełnia szablony sam.

`kanon.md` to lista faktów, które gotowe bajki ustaliły o świecie (przedmioty w miejscach, zwyczaje, nazwy). Każda następna bajka musi się z nimi zgadzać. Szczegóły i zasady w samym pliku.

Skrypt do szybkiego sprawdzenia liczb (słowa, długie zdania, maniery, zwroty z kart, kanon, indeks):

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

## Indeks

| Nr | Tytuł | Miejsce | Postacie | Zjawisko | Pytanie lub obraz na koniec | Słowa | Status |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Statusy

| Status | Znaczenie |
|---|---|
| konspekt | jest tylko `konspekt.md`, tekst jeszcze nie powstał |
| szkic | tekst napisany, nie sprawdzony |
| sprawdzona | przeszła `/sprawdz`, uwagi naniesione, czeka na autora |
| gotowa | autor zatwierdził; fakty z bajki trafiają do `kanon.md`; od tej pory nie zmieniamy tekstu bez prośby |

## Zasady numeracji

- Numer dostaje się przy założeniu folderu i nie zmienia go, nawet gdy bajka trafi do kosza (wtedy w tabeli zostaje wiersz ze statusem „porzucona”).
- Kolejność numerów nie jest kolejnością czytania. Każda bajka stoi osobno (patrz `świat.md`, punkt o czasie).

## Co sprawdzić przed założeniem nowej bajki

1. Czy miejsce ma kartę w `miejsca/`. Jeśli nie, bajka dzieje się w miejscu jednorazowym opisanym w konspekcie albo najpierw robimy kartę (`/nowe-miejsce`).
2. Czy temat nie dubluje już istniejącej bajki z tabeli powyżej.
3. Czy bajka nie rozstrzyga czegoś, co w `świat.md` ma status „otwarte”.
