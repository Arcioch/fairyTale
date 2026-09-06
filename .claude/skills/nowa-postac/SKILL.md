---
name: nowa-postac
description: Dodaj nową postać do postacie/ z karty .docx od autora albo z opisu. Użyj, gdy autor wrzucił folder z plikiem „Postać - Imię.docx”, mówi „dodaj postać”, „nowa postać”, „zrób kartę dla…”, albo chce dorosłego, rodzica, panią z przedszkola, zwierzę. Wyciąga tekst z docx, wypełnia szablon, aktualizuje indeks i świat.md.
argument-hint: [imię] [--dorosły] [--zwierzę]
---

# /nowa-postac

## Krok 1. Źródło

Sprawdź `postacie/<imię>/`. Oczekiwane pliki: `Postać - <Imię>.docx` (bez podkreślnika na początku; jeśli jest, zmień nazwę) i opcjonalnie obraz `.webp`, `.png`, `.jpg`.

Wyciągnij tekst z docx (to zip):

```bash
unzip -p "postacie/<imię>/Postać - <Imię>.docx" word/document.xml | sed -e 's/<\/w:p>/\n/g' -e 's/<[^>]*>//g'
```

Nie edytuj pliku `.docx`. Jeśli docx nie ma, a autor podał opis w rozmowie, pracuj z opisu i zaznacz to w polu „Źródło”.

Jeśli jest obraz, obejrzyj go i opisz w sekcji „Wygląd” to, co widać, oznaczając „na obrazku:”.

## Krok 2. Karta

Skopiuj `postacie/_szablon.md` do `postacie/<imię>/<imię>.md` (imię małymi literami). Wypełnij wszystkie sekcje. Pola „Rdzeń postaci” i „Ulubione zwroty” przepisz dosłownie z docx, w cudzysłowach. Nie dodawaj cech, których nie ma w źródle; jeśli czegoś brakuje (feler, zwroty), wpisz „[brak w docx, do uzupełnienia przez autora]”.

Sekcja „Jak pisać … w bajce” jest twoja. Wymaga:
- funkcji w historii (co robi z fabułą),
- 3 do 5 typowych scen,
- konfliktu z **każdą** istniejącą postacią, po jednej linii,
- kto tę postać równoważy i jaka jest jej jedna lekcja,
- odpowiedników w `przykłady/` (przeczytaj `przykłady/README.md`, sekcję „Galerie typów dzieci”),
- czego unikać (karykatura),
- kontroli przy pisaniu (zwroty, feler, detal, które muszą paść w scenie).

Dla dziecka porównaj rdzeń z czwórką: jeśli nowa postać dubluje czyjś rdzeń, rozdziel je tak, jak Ada i Antek w `postacie/README.md`.

## Krok 3. Dorosły lub zwierzę

`--dorosły`: humor i sposób wychowania wzoruj na `przykłady/blue/rodzice.md` (sekcja 4), rolę mentora na `przykłady/ada bambini naukowczyni/postacie.md`. Dorosły musi mieć własny cel, który dzieci sabotują, i nie może wygłaszać morału. Dopisz, czyim jest rodzicem lub kim jest dla grupy, i zaktualizuj odpowiedni wiersz w `świat.md` (status „ustalone”, decyzja).

`--zwierzę`: zwierzę nie mówi. Ma zachowania, przez które „mówi” jedna z postaci (wzór: Luna i Zuzia). Dopisz do wiersza „Zwierzęta” w `świat.md`.

## Krok 4. Indeks i powiązania

0. Sprawdź `odcinki/kanon.md`: jeśli są fakty o tej postaci (np. dorosły, który już pojawił się bez imienia), wpisz je do karty i oznacz „W karcie” = „tak”.
1. Dopisz wiersz do tabeli w `postacie/README.md` (grupa główna lub nowa sekcja „Dorośli” / „Zwierzęta”).
2. Jeśli postać zderza się z istniejącymi w nowy sposób, uzupełnij tabelę par.
3. Jeśli postać ma swoje miejsce (dom, sala), sprawdź `miejsca/`; jeśli miejsca nie ma, zaproponuj `/nowe-miejsce`, nie zakładaj go sam.
4. Zaktualizuj `README.md` w korzeniu (sekcja „Bohaterowie w skrócie”), jeśli postać jest stała.

## Krok 5. Zgłoszenie

Podaj: ścieżkę karty, listę pól, których nie było w źródle, i pytania do autora (zwłaszcza pokrewieństwo i miejsce). Nie commituj.
