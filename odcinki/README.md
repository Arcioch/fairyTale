# Odcinki

Scenariusze odcinków serii i te w trakcie pisania. Odcinek to animacja 3D na YouTube, około 9 minut historii plus wspólna śpiewana czołówka i napisy (razem 10 do 12 minut). Każda postać mówi własnym głosem, narratora nie ma. Format serii jest opisany w `świat.md`, sekcja „Format”.

Jeden odcinek to jeden folder `NN tytuł/` (numer dwucyfrowy, spacja, tytuł po polsku) z plikami:

- `konspekt.md` – szkielet: miejsce, postacie, zjawisko, zdarzenie wywołujące, trzy próby, rozwiązanie, lista scen z szacunkiem minut. Powstaje pierwszy i to jego najczęściej się poprawia.
- `scenariusz.md` – sceny, didaskalia i kwestie, z metryką na górze.
- `sprawdzenie.md` – raport z `/sprawdz`, nadpisywany przy kolejnym sprawdzeniu.

Szablony są w `_szablon/`. Skill `/odcinek` tworzy folder i wypełnia szablony sam. `czołówka.md` to tekst wspólnej piosenki otwierającej (do napisania raz).

`kanon.md` to lista faktów, które gotowe odcinki ustaliły o świecie (przedmioty w miejscach, zwyczaje, nazwy). Każdy następny odcinek musi się z nimi zgadzać. Szczegóły i zasady w samym pliku.

Skrypt do sprawdzenia liczb (czas, sceny, kwestie, długie zdania, maniery, zwroty z kart, kanon, indeks):

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

## Indeks

| Nr | Tytuł | Miejsce | Pora roku | Postacie i dorośli | Zjawisko | Ostatni obraz | Czas | Status |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

## Statusy

| Status | Znaczenie |
|---|---|
| konspekt | jest tylko `konspekt.md`, scenariusz jeszcze nie powstał |
| szkic | scenariusz napisany, nie sprawdzony |
| sprawdzony | przeszedł `/sprawdz`, uwagi naniesione, czeka na autorkę |
| gotowy | autorka zatwierdziła; fakty z odcinka trafiają do `kanon.md`; od tej pory nie zmieniamy tekstu bez prośby |
| w produkcji | scenariusz poszedł do animacji; zmiany tylko po uzgodnieniu z produkcją |

## Zasady numeracji

- Numer dostaje się przy założeniu folderu i nie zmienia go, nawet gdy odcinek trafi do kosza (wtedy w tabeli zostaje wiersz ze statusem „porzucony”).
- Kolejność numerów nie jest kolejnością oglądania. Każdy odcinek stoi osobno (patrz `świat.md`, „Pora roku i czas”), ale świat się nie cofa: kanon obowiązuje.
- Proporcja serii: około dwa na trzy odcinki ze zjawiskiem naukowym, jeden o emocji. W każdym nauka jest lekka.

## Co sprawdzić przed założeniem nowego odcinka

1. Czy miejsce główne ma kartę w `miejsca/`. Jeśli nie, odcinek dzieje się w miejscu jednorazowym opisanym w konspekcie albo najpierw robimy kartę (`/nowe-miejsce`).
2. Czy temat nie dubluje odcinka z tabeli powyżej i czy pora roku różni się od poprzednich.
3. Czy odcinek nie rozstrzyga czegoś, co w `świat.md` ma status „otwarte”, i czy wątek z „Wątki na przyszłość” robi najwyżej jeden krok.
