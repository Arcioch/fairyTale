---
name: sprawdz
description: Sprawdź scenariusz odcinka z odcinki/ warstwami od struktury do języka, a na końcu oczami czterolatka oglądającego, rodzica oglądającego razem z nim i aktora głosowego. Użyj, gdy autorka mówi „sprawdź”, „zrecenzuj”, „co jest nie tak z odcinkiem”, „obejrzyj jako dziecko”, albo po napisaniu scenariusza przez /odcinek. Zapisuje raport w folderze odcinka, nic nie poprawia bez --popraw.
argument-hint: [NN lub ścieżka] [--warstwa 1-5] [--tylko-widzowie] [--popraw]
---

# /sprawdz

Recenzja jednego scenariusza. Wynik trafia do `odcinki/NN tytuł/sprawdzenie.md` (nadpisz, jeśli istnieje) i w skrócie do odpowiedzi. Bez `--popraw` nie zmieniasz scenariusza. Z `--popraw` poprawiasz tylko warstwy 3 i 4 (język i fakty); poprawki strukturalne i postaciowe zawsze zostawiasz autorce z propozycją.

## Przed sprawdzeniem

Przeczytaj: `scenariusz.md` i `konspekt.md` odcinka, `świat.md` (w tym „Format”), `postacie/README.md`, `postacie/dorośli.md`, karty użytych postaci, karty miejsc, `odcinki/kanon.md`, `maniery.md` i `czytelnicy.md` z tego folderu.

Uruchom skrypt i wklej jego wynik do raportu jako pierwszą sekcję:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Skrypt liczy czas (wpisuje do metryki), sprawdza sceny (nagłówki, didaskalium na start, narracja poza nawiasem), mówców (nieznani, narrator, nie w metryce, postać bez kwestii), długość kwestii i zdań, maniery z numerami linii, zwroty z kart w kwestiach właściwej postaci, detale, karty miejsc, fakty z kanonu, zgodność z indeksem. To są fakty; nie powtarzaj ich z pamięci i nie polemizuj z nimi. Twoja praca zaczyna się tam, gdzie skrypt się kończy.

## Kolejność: od makro do mikro

Idź warstwami. Jeśli warstwa 1 ma poważny problem, warstwy 3 do 5 rób skrótowo i napisz, że szczegółowa recenzja języka ma sens dopiero po naprawie struktury. Polerowanie kwestii w odcinku ze złym szkieletem to strata czasu autorki.

### Warstwa 1. Struktura i czas

- Jest zwykła sytuacja, zdarzenie wywołujące (do 1,5 min), trzy próby, rozwiązanie, powrót ze zmianą?
- Jedno miejsce główne (plus najwyżej jedno poboczne), jedno zjawisko lub jedna emocja, jedna zmiana zachowania? Wypisz je.
- Każda próba należy do innej postaci i wynika z jej rdzenia? Dwie nie wychodzą, ale wnoszą coś do rozwiązania?
- Rozwiązanie łączy wkłady, czy jedna postać „wygrywa”?
- Czas ze skryptu (historia plus eksperyment) mieści się w 8,5 do 9,5 min? Które sceny są za długie względem konspektu?
- Segment eksperymentu: jest (w odcinku ze zjawiskiem), prowadzi jedno dziecko zgodnie z kolejnością z `świat.md`, mówi do widzów, pokazuje to samo zjawisko rzeczami z domu, nie streszcza historii?
- Żadne dziecko nie pyta dorosłego bez odpowiedzi? Na sali przedszkolnej jest jedna pani?
- Zjawisko (jeśli jest) **widać w kadrze** przy każdym z trzech kroków, czy jest tylko opowiedziane?
- Ostatnie ujęcie to obraz, nie wniosek i nie zapowiedź?
- Scenariusz zgadza się z konspektem? Jeśli nie, które jest lepsze?

### Warstwa 2. Postacie

Dla każdej z czwórki tabela: zwrot z karty (padł w jej kwestii? który?), rdzeń (widać w działaniu?), feler (pokazany raz?), detal widoczny w kadrze (Luna, kieszeń Olka, spinka, czapka).

Osobno:
- Ada i Antek są rozróżnialni? Test: zakryj imiona w kwestiach. Jeśli można zamienić, nie są.
- Olek coś wyjął z kieszeni albo podzielił po równo? Antek powiedział „proszę” albo wrócił po kogoś?
- Zuzia dała porównanie, które potem ktoś powtórzył? Luna zrobiła coś kociego (didaskalium), nie tylko „jest”?
- Rozkład kwestii ze skryptu: czy ktoś dominuje albo znika bez powodu fabularnego?
- Dorosły: zgodny z `dorośli.md` (zawód, humor, własny cel)? Mówi jak dorosły? Ma żart dla rodzica? Nie wygłasza morału?
- Nikt nie jest karykaturą z sekcji „Czego unikać” swojej karty?

### Warstwa 3. Język i zapis

- Kwestie do 40 słów, zdania do 15, rytm zmienny. Monologi ze skryptu: jak je rozbić działaniem.
- Jedno nowe słowo, wyjaśnione w akcji. Wypisz inne słowa, których czterolatek może nie znać.
- Dialog nie opisuje tego, co widać. Wypisz kwestie, które da się usunąć, bo obraz je zastępuje.
- Didaskalia mówią, co widać i słychać, nie co postać czuje. Wypisz „(smutna)”, „(z zapałem)” i zaproponuj czyn.
- Maniery: trafienia dał skrypt. Dla każdego zaproponuj zamianę albo napisz, dlaczego zostaje (np. „bardzo” w kwestii Ady jest celowe). Dodatkowo szukaj tego, czego regex nie złapie: uczucie nazwane innymi słowami, morał okrężny, symetria z sekcji 7 `maniery.md`.
- Powtórzenia celowe (zawołania) kontra przypadkowe (to samo słowo w trzech kwestiach z rzędu).
- Zapis: każda scena ma nagłówek z miejscem i porą, zaczyna się didaskalium, nie ma narracji, nie ma terminów filmowych, sekcja „Zasady zapisu” z szablonu usunięta.

### Warstwa 4. Prawda i bezpieczeństwo świata

- Zjawisko jest prawdziwe i wyjaśnione zgodnie z nauką na poziomie dziecka? Jeśli masz wątpliwość, napisz ją i nie zgaduj. Czy to, co ma być pokazane w kadrze, da się pokazać (para jest widoczna, magnes przez stół nie)?
- Odcinek nie rozstrzyga niczego ze `świat.md` o statusie „otwarte” i nie robi więcej niż jednego kroku w „Wątkach na przyszłość”?
- Miejsca zgadzają się z kartami w `miejsca/`? Nowe szczegóły miejsca wypisz: autorka zdecyduje, czy trafią do karty.
- **Kanon.** Skrypt wypisał fakty z `odcinki/kanon.md` dla tych miejsc i postaci. Sprawdź każdy: odcinek się zgadza, milczy, czy przeczy. Sprzeczność to błąd do naprawy najpierw, chyba że autorka chce zmienić kanon (wtedy wpis do „Fakty wycofane” i poprawka odcinka źródłowego).
- **Nowe fakty.** Wypisz wszystko, co ten odcinek ustala o świecie po raz pierwszy (przedmiot w miejscu, zwyczaj, nazwa, kto co lubi), po jednym zdaniu, w formacie wiersza kanonu: fakt, źródło, dotyczy. Trafią do `kanon.md` dopiero przy statusie „gotowy”.
- Brak nazw własnych, cytatów i rozpoznawalnych scen z seriali wzorcowych. Brak nazwisk, adresów, prawdziwego przedszkola.
- Morał nie pada wprost. Szukaj zdań typu „nauczyli się, że”, „od tej pory”, „najważniejsze jest”.

### Warstwa 5. Widzowie

Trzy symulacje według `czytelnicy.md`: **czterolatek oglądający**, **rodzic oglądający razem** i **aktor głosowy**. Przejdź scenariusz scena po scenie i notuj reakcje przy konkretnych kwestiach lub didaskaliach, nie ogólnie. Nie raportuj „uniwersalnego widza”; każda uwaga ma personę.

Przy `--tylko-widzowie` rób tylko tę warstwę.

## Format raportu (`sprawdzenie.md`)

```
# Sprawdzenie: [tytuł]

Data: [dzisiaj]. Czas: [m] min. Sceny: [n]. Status przed: [z metryki].

## Werdykt w trzech zdaniach
[Co działa, co nie, co robić najpierw.]

## Wynik skryptu
[wklejony wynik narzędzia/sprawdz.js bez zmian]

## Do naprawy najpierw (warstwa 1 i 2)
- [uwaga ze sceną, linią lub cytatem i propozycją]

## Język, zapis i fakty (warstwa 3 i 4)
- [uwaga: cytat → propozycja]

## Czterolatek oglądający
- [scena, kwestia]: [reakcja z listy w czytelnicy.md] [dlaczego]

## Rodzic oglądający razem
- [scena, kwestia]: [reakcja] [dlaczego]

## Aktor głosowy
- [postać, linia]: [reakcja] [dlaczego]

## Kanon
- zgodność: [każdy fakt ze skryptu: zgadza się / milczy / PRZECZY (cytat)]
- nowe fakty do kanonu po zatwierdzeniu:
  | Fakt | Źródło | Dotyczy |
  |---|---|---|

## Co zostawić w spokoju
[Rzeczy, które działają i których autorka nie powinna ruszać przy poprawkach.]

## Do decyzji autorki
- [pytania, których recenzja nie rozstrzyga]
```

W odpowiedzi dla autorki podaj werdykt, trzy najważniejsze uwagi i ścieżkę do raportu. Nie wklejaj całego raportu.

Po sprawdzeniu zmień status w metryce `scenariusz.md` i w `odcinki/README.md` na „sprawdzony” tylko wtedy, gdy warstwy 1 i 2 są czyste. Inaczej status zostaje „szkic”.

Gdy autorka mówi, że odcinek jest **gotowy**: zmień status w obu miejscach, przenieś wiersze z sekcji „nowe fakty do kanonu” w `sprawdzenie.md` do tabeli w `odcinki/kanon.md` (kolejne numery, kolumna „W karcie” = „nie”) i zaproponuj `/nowe-miejsce --z-odcinka NN` lub aktualizację karty postaci dla faktów, które powinny trafić do kart.
