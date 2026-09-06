---
name: bajka
description: Napisz nową bajkę na dobranoc dla czterolatka z Adą, Antkiem, Olkiem i Zuzią. Użyj, gdy autor mówi „napisz bajkę”, „nowa bajka o…”, podaje temat, zjawisko albo miejsce, lub chce sam konspekt. Prowadzi od ram przez konspekt do tekstu, zapisuje w bajki/NN tytuł/ i na końcu odpala listę kontrolną.
argument-hint: [temat, zjawisko lub miejsce] [--tylko-konspekt] [--z-konspektu NN]
---

# /bajka

Piszesz bajkę do czytania na głos dziecku w wieku około 4 lat. Wszystko po polsku. Bez emoji.

## Krok 0. Przeczytaj, zanim cokolwiek napiszesz

Zawsze:
- `świat.md` (co jest ustalone, czego bajka nie może rozstrzygać)
- `postacie/README.md` (dynamika grupy, pary, rekwizyty)
- karty postaci, które użyjesz: `postacie/<imię>/<imię>.md` (domyślnie wszystkie cztery)
- kartę miejsca: `miejsca/<nazwa>/<nazwa>.md`
- `bajki/README.md` (żeby nie dublować tematu i wziąć kolejny numer)
- `bajki/kanon.md`: fakty ustalone przez gotowe bajki. Wszystko, co dotyczy Twojego miejsca i Twoich postaci, obowiązuje; nie zmieniaj czerwonego czajnika na niebieski

Do konkretnego zadania:
- szkielet historii: `przykłady/ada bambini naukowczyni/styl.md`, sekcje 2 i 9
- tłumaczenie zjawiska: `przykłady/madroboty/nauka-katalog.md` (tabela główna i wzorce tłumaczenia) oraz `przykłady/madroboty/styl.md`, sekcja 8
- konflikt i humor: `przykłady/blue/rodzenstwo.md`, sekcje 4 i 8; `przykłady/blue/rodzice.md`, sekcja 4, jeśli jest dorosły
- do jednej sceny: pojedynczy `odcinek.md` w `przykłady/*/odcinki/`, nie więcej niż dwa

Nie szukaj niczego w internecie. Nie cytuj seriali, nie używaj ich nazw własnych.

## Krok 1. Ramy

Ustal i wypisz w jednym bloku:

1. **Miejsce.** Jedno. Musi mieć kartę w `miejsca/` albo być jednorazowe (wtedy opisz je w konspekcie w dwóch zdaniach). Bajka nie przenosi się między miejscami, dopóki `miejsca/README.md` nie ma mapy okolicy.
2. **Postacie.** Domyślnie cała czwórka. Mniej tylko na prośbę autora.
3. **Zjawisko.** Jedno, prawdziwe, do wytłumaczenia w trzech krokach na poziomie czterolatka. Jeśli bajka jest o emocji, a nie o zjawisku, zapisz „brak” i oprzyj ją na wzorze z Bluey.
4. **Nowe słowo.** Jedno na bajkę. Wyjaśnione w akcji, nie w definicji.
5. **Zmiana zachowania.** Kto na końcu robi coś inaczej. Nikt tego nie wypowie.
6. **Co jest otwarte w `świat.md` i jak to ominiesz.** Bez imion dorosłych, bez pokrewieństwa, bez wspólnego domu, dopóki nie są ustalone.

Jeśli argument autora dotyka punktu „otwarte” (np. „bajka o mamie Ady”), zatrzymaj się i powiedz to, zamiast rozstrzygać.

## Krok 2. Trzy konspekty do wyboru

Zaproponuj trzy warianty w tabeli: tytuł roboczy, zdarzenie wywołujące, kto robi którą próbę, jak się łączą, jedno pytanie lub obraz na koniec. Każdy wariant w trzech, czterech zdaniach. Wskaż, który polecasz i dlaczego.

Jeśli autor jest przy klawiaturze, zapytaj. Jeśli pracujesz sam (autor nie odpowiada lub prosił, żeby nie pytać), weź polecany wariant i napisz to wprost w raporcie.

Przy `--z-konspektu NN` pomiń ten krok: przeczytaj gotowy `bajki/NN …/konspekt.md` i idź do kroku 4.

## Krok 3. Konspekt

Załóż folder `bajki/NN tytuł/` z kolejnym numerem. Skopiuj `bajki/_szablon/konspekt.md` i wypełnij każdą sekcję. Tabela „Kontrola postaci” musi być pełna: każda postać ma zwrot z karty, feler i detal.

Zasady szkieletu (z Ady Bambini):
- zwykła sytuacja → zdarzenie wywołujące → trzy próby → rozwiązanie → powrót do zwykłej sytuacji z jedną zmianą
- każda próba należy do innej postaci i wynika z jej rdzenia: Ada sprawdza ciałem, Antek buduje i ma pięć pomysłów, Olek tłumaczy w krokach i dzieli po równo, Zuzia patrzy i daje porównanie
- dwie próby nie wychodzą, ale każda coś wnosi; rozwiązanie łączy wkłady, nie wybiera zwycięzcy
- Ada i Antek nie są wymienni: ona jedno wyzwanie, ruch, „to jest proste”; on wiele pomysłów, ręce, „a może tak?!”

Zasady tłumaczenia zjawiska (z Mądrobotów):
- trzy kroki, każdy w jednym zdaniu, w kolejności przyczynowej
- porównanie lub personifikacja daje zwykle Zuzia, kroki Olek, sprawdzenie Ada, konstrukcję Antek
- na końcu ktoś powtarza całość w trzech zdaniach i kończy „i dlatego…”

Zasady relacji i humoru (z Bluey):
- konflikt jest emocją, nie zadaniem; rozwiązanie przychodzi od dzieci
- dorosły, jeśli jest, mówi jak dorosły, ma własny cel, a dzieci go sabotują
- humor cichnie przy prawdziwym smutku
- jeden żart dla rodzica, którego dziecko nie musi zrozumieć

Przy `--tylko-konspekt` zakończ tutaj: dopisz wiersz do `bajki/README.md` ze statusem „konspekt” i zgłoś, co wymaga decyzji autora.

## Krok 4. Tekst

Skopiuj `bajki/_szablon/bajka.md` do folderu bajki i napisz tekst według konspektu. Zasady języka:

- **Długość:** 600 do 1000 słów, czyli 5 do 8 minut czytania na głos. Jeden pomysł, jedno miejsce, jedno zjawisko, jedna zmiana.
- **Zdania krótkie.** Najdłuższe zdanie do 15 słów. Rytm zmienny: po trzech krótkich jedno dłuższe.
- **Dużo dialogu, mało opisu.** Opis miejsca to jeden przedmiot, nie inwentarz. Postać widać przez to, co mówi i robi, nie przez przymiotniki.
- **Zwroty z kart wracają.** Każda postać co najmniej raz mówi swoim zwrotem. Zawołania powtarzają się w rytmie, żeby dziecko mogło mówić razem.
- **Nie nazywaj uczuć, pokaż je.** Zamiast „Zuzia była smutna” daj Zuzię, która przytula Lunę i nic nie mówi.
- **Ufaj słuchaczowi.** Nie tłumacz żartu, nie tłumacz morału, nie tłumacz, co postać poczuła. Czterolatek rozumie więcej, niż mówi. Każde zdanie robi dwie rzeczy naraz: pokazuje postać i pcha historię.
- **Bez ironii dla dziecka.** Ironia tylko w żarcie dla rodzica, wyraźnie jako replika dorosłego lub narratora „w cudzysłowie”.
- **Bez fałszywych faktów dla fabuły.** Jeśli zjawisko nie chce się zgodzić z pomysłem, zmień pomysł.
- **Koniec uspokaja.** To bajka na dobranoc. Ostatnie zdanie to obraz albo ciche pytanie, nie wybuch i nie „jaka będzie następna przygoda?”.
- **Dialogi** od półpauzy w nowym wierszu. Didaskalia krótkie i rzadkie: „powiedział” wystarczy, „wykrzyknął z entuzjazmem” nie.

Lista polskich manier modelu, których unikać, jest w `.claude/skills/sprawdz/maniery.md`. Przeczytaj ją przed pisaniem, nie tylko po.

## Krok 5. Sprawdzenie własne

Najpierw uruchom skrypt, który liczy i grepuje za Ciebie:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Skrypt wpisuje słowa i czas czytania do metryki, a wypisuje: zdania dłuższe niż 15 słów, trafienia manier z numerami linii, które zwroty z kart padły, czy jest Luna i kieszeń Olka, czy miejsce ma kartę, fakty z kanonu do sprawdzenia, czy wiersz w indeksie istnieje. Napraw wszystko, co wypisał, i uruchom go jeszcze raz. Celem jest zero trafień w sekcji „Maniery” albo świadoma decyzja przy każdym, które zostaje (wpisz ją do notatek).

Potem przejdź listę z `.claude/skills/sprawdz/SKILL.md` warstwy 1 do 4 (struktura, postacie, język, prawda), czyli to, czego skrypt nie umie: czy próby wynikają z rdzeni, czy porównanie Zuzi działa, czy zjawisko jest prawdziwe, czy bajka nie kłóci się z kanonem. Warstwę 5 (czytelnicy) zostaw autorowi do osobnego `/sprawdz`.

## Krok 6. Zgłoszenie

1. Dopisz wiersz do tabeli w `bajki/README.md` ze statusem „szkic”.
2. W sekcji „Notatki” w `bajka.md` wypisz: który wariant wybrano i dlaczego, co założono w miejscach otwartych, gdzie autor może chcieć coś zmienić, oraz **nowe fakty o świecie**, które bajka ustala (przedmioty w miejscu, zwyczaje, imiona rzeczy). To kandydaci do `bajki/kanon.md`; trafią tam, gdy autor nada status „gotowa”.
3. W odpowiedzi dla autora: tytuł, ścieżka, liczba słów, jedno zdanie o czym jest, lista decyzji do podjęcia. Bez streszczania całej bajki.

Nie commituj. Nie zmieniaj kart postaci ani miejsc; jeśli bajka pokazała, że karta czegoś nie ma, dopisz to do notatek, nie do karty.
