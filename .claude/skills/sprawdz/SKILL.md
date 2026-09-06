---
name: sprawdz
description: Sprawdź gotową lub szkicową bajkę z bajki/ warstwami od struktury do języka, a na końcu oczami czterolatka i rodzica czytającego na głos. Użyj, gdy autor mówi „sprawdź”, „zrecenzuj”, „co jest nie tak z bajką”, „przeczytaj jako dziecko”, albo po napisaniu tekstu przez /bajka. Zapisuje raport w folderze bajki, nic nie poprawia bez --popraw.
argument-hint: [NN lub ścieżka] [--warstwa 1-5] [--tylko-czytelnicy] [--popraw]
---

# /sprawdz

Recenzja jednej bajki. Wynik trafia do `bajki/NN tytuł/sprawdzenie.md` (nadpisz, jeśli istnieje) i w skrócie do odpowiedzi. Bez `--popraw` nie zmieniasz tekstu bajki. Z `--popraw` poprawiasz tylko warstwy 3 i 4 (język i fakty); poprawki strukturalne i postaciowe zawsze zostawiasz autorowi z propozycją.

## Przed sprawdzeniem

Przeczytaj: `bajka.md` i `konspekt.md` sprawdzanej bajki, `świat.md`, `postacie/README.md`, karty użytych postaci, kartę miejsca, `bajki/kanon.md`, `maniery.md` i `czytelnicy.md` z tego folderu.

Uruchom skrypt i wklej jego wynik do raportu jako pierwszą sekcję:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Skrypt liczy słowa i czas czytania (wpisuje je do metryki), wypisuje zdania dłuższe niż 15 słów, trafienia manier z numerami linii, zwroty z kart, detale (Luna, kieszeń), kartę miejsca, fakty z kanonu dla tego miejsca i tych postaci oraz zgodność z indeksem. To są fakty; nie powtarzaj ich z pamięci i nie polemizuj z nimi. Twoja praca zaczyna się tam, gdzie skrypt się kończy.

## Kolejność: od makro do mikro

Idź warstwami. Jeśli warstwa 1 ma poważny problem, warstwy 3 do 5 rób skrótowo i napisz, że szczegółowa recenzja języka ma sens dopiero po naprawie struktury. Polerowanie zdań w bajce ze złym szkieletem to strata czasu autora.

### Warstwa 1. Struktura

- Jest zwykła sytuacja, zdarzenie wywołujące, trzy próby, rozwiązanie, powrót ze zmianą?
- Jedno miejsce, jedno zjawisko, jedna zmiana zachowania? Wypisz je. Jeśli nie umiesz wypisać jednego, jest ich za dużo albo brak.
- Każda próba należy do innej postaci i wynika z jej rdzenia? Dwie nie wychodzą, ale wnoszą coś do rozwiązania?
- Rozwiązanie łączy wkłady, czy jedna postać „wygrywa”?
- Zakończenie uspokaja? Ostatnie zdanie to obraz lub ciche pytanie?
- Tekst zgadza się z konspektem? Jeśli nie, które jest lepsze?

### Warstwa 2. Postacie

Dla każdej z czwórki tabela: zwrot z karty (padł? który?), rdzeń (widać w działaniu?), feler (pokazany raz?), detal (Luna, kieszeń Olka, spinka, czapka).

Osobno:
- Ada i Antek są rozróżnialni? Test: zakryj imiona w ich kwestiach. Jeśli można zamienić, nie są.
- Olek coś wyjął z kieszeni albo podzielił po równo?
- Zuzia dała porównanie, które potem ktoś powtórzył?
- Luna się pojawiła?
- Dorosły (jeśli jest) mówi jak dorosły, ma własny cel, nie wygłasza morału?
- Nikt nie jest karykaturą z sekcji „Czego unikać” swojej karty?

### Warstwa 3. Język

- Długość 600 do 1000 słów. Zdania do 15 słów, rytm zmienny.
- Jedno nowe słowo, wyjaśnione w akcji. Wypisz inne słowa, których czterolatek może nie znać.
- Stosunek dialogu do opisu. Zaznacz akapity opisu dłuższe niż trzy zdania.
- Uczucia nazwane zamiast pokazane („była smutna”, „poczuł radość”). Wypisz.
- Maniery modelu: trafienia dał skrypt. Dla każdego zaproponuj zamianę albo napisz, dlaczego zostaje (np. „bardzo” w kwestii Ady jest celowe). Dodatkowo szukaj tego, czego regex nie złapie: uczucie nazwane innymi słowami, morał okrężny, symetria z sekcji 7 `maniery.md`.
- Didaskalia: nadmiar „wykrzyknął”, „z entuzjazmem”, „z ciekawością”.
- Powtórzenia celowe (zawołania) kontra przypadkowe (to samo słowo trzy razy w akapicie).

### Warstwa 4. Prawda i bezpieczeństwo świata

- Zjawisko jest prawdziwe i wyjaśnione zgodnie z nauką na poziomie dziecka? Jeśli masz wątpliwość, napisz ją i nie zgaduj.
- Bajka nie rozstrzyga niczego ze `świat.md` o statusie „otwarte”? Sprawdź: imiona dorosłych, pokrewieństwo, wspólny dom, przemieszczanie się między miejscami.
- Miejsce zgadza się z kartą w `miejsca/`? Nowe szczegóły miejsca wypisz: autor zdecyduje, czy trafią do karty.
- **Kanon.** Skrypt wypisał fakty z `bajki/kanon.md` dla tego miejsca i tych postaci. Sprawdź każdy: bajka się zgadza, milczy, czy przeczy. Sprzeczność to błąd do naprawy najpierw, chyba że autor chce zmienić kanon (wtedy wpis do „Fakty wycofane” i poprawka bajki źródłowej).
- **Nowe fakty.** Wypisz wszystko, co ta bajka ustala o świecie po raz pierwszy (przedmiot w miejscu, zwyczaj, nazwa, kto co lubi), po jednym zdaniu, w formacie wiersza kanonu: fakt, źródło, dotyczy. Trafią do `kanon.md` dopiero przy statusie „gotowa”.
- Brak nazw własnych, cytatów i rozpoznawalnych scen z seriali wzorcowych.
- Morał nie pada wprost. Szukaj zdań typu „nauczyli się, że”, „od tej pory”, „najważniejsze jest”.

### Warstwa 5. Czytelnicy

Dwie symulacje według `czytelnicy.md`: **czterolatek słuchający** i **rodzic czytający na głos**. Przejdź tekst akapit po akapicie i notuj reakcje przy konkretnych zdaniach, nie ogólnie. Nie raportuj „uniwersalnego czytelnika”; każda uwaga ma personę.

Przy `--tylko-czytelnicy` rób tylko tę warstwę.

## Format raportu (`sprawdzenie.md`)

```
# Sprawdzenie: [tytuł]

Data: [dzisiaj]. Słowa: [n]. Czas czytania: [m] min. Status przed: [z metryki].

## Werdykt w trzech zdaniach
[Co działa, co nie, co robić najpierw.]

## Wynik skryptu
[wklejony wynik narzędzia/sprawdz.js bez zmian]

## Do naprawy najpierw (warstwa 1 i 2)
- [uwaga z cytatem lub miejscem w tekście i propozycją]

## Język i fakty (warstwa 3 i 4)
- [uwaga: cytat → propozycja]

## Czterolatek słuchający
- [akapit lub zdanie]: [reakcja z listy w czytelnicy.md] [dlaczego]

## Rodzic czytający na głos
- [akapit lub zdanie]: [reakcja] [dlaczego]

## Kanon
- zgodność: [każdy fakt ze skryptu: zgadza się / milczy / PRZECZY (cytat)]
- nowe fakty do kanonu po zatwierdzeniu:
  | Fakt | Źródło | Dotyczy |
  |---|---|---|

## Co zostawić w spokoju
[Rzeczy, które działają i których autor nie powinien ruszać przy poprawkach.]

## Do decyzji autora
- [pytania, których recenzja nie rozstrzyga]
```

W odpowiedzi dla autora podaj werdykt, trzy najważniejsze uwagi i ścieżkę do raportu. Nie wklejaj całego raportu.

Po sprawdzeniu zmień status w metryce `bajka.md` i w `bajki/README.md` na „sprawdzona” tylko wtedy, gdy warstwy 1 i 2 są czyste. Inaczej status zostaje „szkic”.

Gdy autor mówi, że bajka jest **gotowa**: zmień status w obu miejscach, przenieś wiersze z sekcji „nowe fakty do kanonu” w `sprawdzenie.md` do tabeli w `bajki/kanon.md` (kolejne numery, kolumna „W karcie” = „nie”) i zaproponuj `/nowe-miejsce --z-bajki NN` lub aktualizację karty postaci dla faktów, które powinny trafić do kart.
