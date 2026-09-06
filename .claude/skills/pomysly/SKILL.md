---
name: pomysly
description: Burza mózgów na tematy nowych odcinków (bajek). Użyj, gdy autor pyta „o czym może być bajka”, „daj pomysły”, „co jeszcze nie było”, albo podaje ograniczenie (miejsce, postać, zjawisko, pora roku). Krzyżuje zjawiska z katalogu Mądrobotów z konfliktami par postaci i miejscami z kartami, zwraca tabelę pomysłów do wyboru, nic nie zapisuje.
argument-hint: [ograniczenie: postać, miejsce, zjawisko, emocja] [--ile N]
---

# /pomysly

Zwracasz listę pomysłów na odcinki, z których autorka wybiera. Nie piszesz konspektu ani scenariusza (to robi `/odcinek`). Nie zapisujesz plików.

## Źródła pomysłów

Przeczytaj i połącz trzy listy:

1. **Zjawiska:** `przykłady/madroboty/nauka-katalog.md` (tabela główna) oraz sekcje „Jakie zjawiska można tu pokazać” w kartach `miejsca/*/`. Wybieraj zjawiska, które czterolatek może zobaczyć w domu lub na podwórku: parowanie, cień, magnes, równowaga, piasek i woda, dźwięk. Nie: planety, komputer, telefon, chyba że da się je sprowadzić do rzeczy w ręku.
2. **Konflikty:** tabela par z `postacie/README.md` i sekcje „Konflikty, które generuje” w kartach postaci. Każdy pomysł ma jedną parę na pierwszym planie.
3. **Miejsca i kłopoty:** karty w `miejsca/` i ich sekcje „Jakie kłopoty tu się zdarzają”. Kłopot jest zdarzeniem wywołującym.

Pomysł bez zjawiska jest dozwolony (bajka o emocji w stylu Bluey), ale wtedy musi mieć wyraźną emocję i zmianę zachowania.

## Filtry

Odrzuć pomysł, jeśli:
- dubluje temat z tabeli w `odcinki/README.md` albo powtarza porę roku dwóch ostatnich odcinków,
- wymaga rozstrzygnięcia czegoś, co w `świat.md` ma status „otwarte” (rodzice z imienia, wspólny dom, droga między miejscami),
- wymaga więcej niż jednego miejsca,
- jest przeróbką konkretnego odcinka z `przykłady/*/odcinki/` (wzory brać z `styl.md`, nie z fabuł),
- zjawisko wymaga kłamstwa dla fabuły.

Lista tematów już „zużytych” przez seriale (`przykłady/ada bambini naukowczyni/styl.md` sekcja 7, `przykłady/blue/styl.md` sekcja 5) nie jest zakazana. Jest ostrzeżeniem: jeśli bierzesz taki temat, potrzebujesz własnego zdarzenia i własnego rozwiązania.

## Wynik

Domyślnie 8 pomysłów (lub `--ile`). Tabela:

| Nr | Tytuł roboczy | Miejsce | Pora roku | Zjawisko lub emocja (co widać w kadrze) | Para na pierwszym planie | Dorosły i jego cel | Zdarzenie wywołujące | Kto robi trzy próby | Ostatni obraz |
|---|---|---|---|---|---|---|---|---|---|

Pod tabelą:
- trzy pomysły, które polecasz, po jednym zdaniu dlaczego,
- pomysły, które odrzuciłeś przez filtry, jeśli autor podał ograniczenie, którego nie da się spełnić, i dlaczego.

Różnicuj: nie więcej niż dwa pomysły w tym samym miejscu, każda para postaci co najmniej raz, co najmniej jeden pomysł bez zjawiska.

Gdy autor wybierze numer, odpowiedz „uruchamiam `/odcinek`” i przekaż mu pełen wiersz tabeli jako argument.
