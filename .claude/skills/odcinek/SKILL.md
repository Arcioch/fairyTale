---
name: odcinek
description: Napisz scenariusz nowego odcinka animowanej serii dla czterolatków z Adą, Antkiem, Olkiem i Zuzią (3D, każda postać własnym głosem, bez narratora, ok. 9 minut). Użyj, gdy autorka mówi „napisz odcinek”, „nowy odcinek o…”, „napisz bajkę”, podaje temat, zjawisko albo miejsce, lub chce sam konspekt. Prowadzi od ram przez konspekt do scenariusza, zapisuje w odcinki/NN tytuł/ i na końcu odpala skrypt sprawdzający.
argument-hint: [temat, zjawisko lub miejsce] [--tylko-konspekt] [--z-konspektu NN]
---

# /odcinek

Piszesz scenariusz odcinka animacji 3D dla dzieci w wieku około 4 lat. Format serii: `świat.md`, sekcja „Format”. Wszystko po polsku. Bez emoji.

## Krok 0. Przeczytaj, zanim cokolwiek napiszesz

Zawsze:
- `świat.md` (format serii, co ustalone, wątki na przyszłość)
- `postacie/README.md` (dynamika grupy, pary, rekwizyty) i `postacie/dorośli.md`
- karty postaci, które użyjesz: `postacie/<imię>/<imię>.md` (domyślnie wszystkie cztery)
- kartę miejsca głównego: `miejsca/<nazwa>/<nazwa>.md`
- `odcinki/README.md` (żeby nie dublować tematu ani pory roku i wziąć kolejny numer)
- `odcinki/kanon.md`: fakty ustalone przez gotowe odcinki obowiązują
- `.claude/skills/sprawdz/maniery.md` (w tym sekcja o scenariuszu)

Do konkretnego zadania:
- szkielet historii: `przykłady/ada bambini naukowczyni/styl.md`, sekcje 2 i 9
- tłumaczenie zjawiska: `przykłady/madroboty/nauka-katalog.md` i `przykłady/madroboty/styl.md`, sekcja 8
- konflikt i humor: `przykłady/blue/rodzenstwo.md`, sekcje 4 i 8; `przykłady/blue/rodzice.md`, sekcja 4, jeśli jest dorosły
- do jednej sceny: pojedynczy `odcinek.md` w `przykłady/*/odcinki/`, nie więcej niż dwa

Nie szukaj niczego w internecie. Nie cytuj seriali, nie używaj ich nazw własnych.

## Krok 1. Ramy

Ustal i wypisz w jednym bloku:

1. **Miejsce główne.** Jedno, z kartą w `miejsca/` albo jednorazowe (opis w konspekcie). **Miejsce poboczne** najwyżej jedno. Odcinek 9-minutowy wytrzymuje dwa miejsca, nie trzy.
2. **Pora roku i pora dnia.** Inna niż w ostatnich odcinkach z indeksu.
3. **Postacie.** Domyślnie cała czwórka. **Dorośli** z `postacie/dorośli.md`: najwyżej dwoje w odcinku, każde z własnym celem.
4. **Zjawisko.** Jedno, prawdziwe, do wytłumaczenia w trzech krokach na poziomie czterolatka. Seria ma proporcję około dwa na trzy odcinki ze zjawiskiem; sprawdź w indeksie, czego teraz brakuje. Odcinek o emocji: wpisz „brak” i oprzyj go na wzorze z Bluey. W każdym odcinku nauka jest lekka: pokazana, nie wykładana.
5. **Nowe słowo.** Jedno na odcinek. Wyjaśnione w akcji, nie w definicji.
6. **Zmiana zachowania.** Kto na końcu robi coś inaczej. Nikt tego nie wypowie.
7. **Co jest otwarte w `świat.md` i jak to ominiesz.** Wątek z „Wątki na przyszłość” może zrobić najwyżej jeden krok.
8. **Eksperyment.** Kto z czwórki prowadzi (kolejność z `świat.md`, „Format serii”: Olek, Ada, Antek, Zuzia, potem od nowa; sprawdź w indeksie, kto był ostatnio), gdzie (jego dom) i co pokazuje. To samo zjawisko co w historii, rzeczy z każdego domu, dorosły obok. Odcinek bez zjawiska (o emocji) segmentu nie ma: wpisz „brak”.

Jeśli argument autorki dotyka punktu „otwarte”, zatrzymaj się i powiedz to, zamiast rozstrzygać.

## Krok 2. Trzy konspekty do wyboru

Zaproponuj trzy warianty w tabeli: tytuł roboczy, zdarzenie wywołujące, kto robi którą próbę, jak się łączą, ostatni obraz. Każdy wariant w trzech, czterech zdaniach. Wskaż, który polecasz i dlaczego.

Jeśli autorka jest przy klawiaturze, zapytaj. Jeśli pracujesz sam, weź polecany wariant i napisz to wprost w raporcie.

Przy `--z-konspektu NN` pomiń ten krok: przeczytaj gotowy `odcinki/NN …/konspekt.md` i idź do kroku 4.

## Krok 3. Konspekt

Załóż folder `odcinki/NN tytuł/` z kolejnym numerem. Skopiuj `odcinki/_szablon/konspekt.md` i wypełnij każdą sekcję, w tym **listę scen z szacunkiem minut** (suma 8,5 do 9,5) i sekcję „Co widać, a czego nie trzeba mówić”. Tabela „Kontrola postaci” musi być pełna.

Zasady szkieletu (z Ady Bambini):
- zwykła sytuacja → zdarzenie wywołujące (ok. 1,5 min od startu) → trzy próby (4 do 5 min) → rozwiązanie → powrót do zwykłej sytuacji z jedną zmianą
- każda próba należy do innej postaci i wynika z jej rdzenia: Ada sprawdza ciałem, Antek buduje i ma pięć pomysłów, Olek tłumaczy w krokach i dzieli po równo, Zuzia patrzy i daje porównanie
- dwie próby nie wychodzą, ale każda coś wnosi; rozwiązanie łączy wkłady, nie wybiera zwycięzcy
- Ada i Antek nie są wymienni: ona jedno wyzwanie, ruch, „to jest proste”; on wiele pomysłów, ręce, „a może tak?!”

Zasady tłumaczenia zjawiska (z Mądrobotów):
- trzy kroki, każdy w jednej krótkiej kwestii, w kolejności przyczynowej, przerywane działaniem
- porównanie lub personifikacja daje zwykle Zuzia, kroki Olek, sprawdzenie Ada, konstrukcję Antek
- w animacji zjawisko trzeba **pokazać**: para z czajnika, cień, który wędruje, magnes, który ciągnie. Konspekt mówi, co widać w kadrze przy każdym kroku

Zasady relacji i humoru (z Bluey):
- konflikt jest emocją, nie zadaniem; rozwiązanie przychodzi od dzieci
- dorosły mówi jak dorosły, ma własny cel z `dorośli.md`, a dzieci go sabotują; nie wygłasza morału
- dorosły zawsze odpowiada dziecku, które pyta; może nie znać całej odpowiedzi, ale nie zbywa i nie odkłada „bo nie ma czasu”. Ciekawość, która ma wrócić później, zostaje dziecku w głowie: patrzy, nie pyta, mówi o tym przy drugim spotkaniu z rzeczą (`świat.md`, „Format serii”)
- w przedszkolu na sali jest jedna pani, nie obie naraz
- humor cichnie przy prawdziwym smutku
- co najmniej jeden żart dla rodzica oglądającego, w kwestii dorosłego, którego dziecko nie musi zrozumieć; więcej takich smaczków jest mile widziane, byle każdy w ustach dorosłego
- gagi fizyczne są dla dziecka: przewrócenie, Luna, dorosły robiący coś głupiego. W animacji gag musi być widoczny, nie opowiedziany

Przy `--tylko-konspekt` zakończ tutaj: dopisz wiersz do `odcinki/README.md` ze statusem „konspekt” i zgłoś, co wymaga decyzji autorki.

## Krok 4. Scenariusz

Skopiuj `odcinki/_szablon/scenariusz.md`, wypełnij metrykę i pisz sceny według konspektu. Usuń z pliku sekcję „Zasady zapisu”. Format:

- `## Scena N. Miejsce, pora dnia`; każda scena zaczyna się didaskalium: co widać w pierwszym ujęciu.
- Kwestia: `**IMIĘ:** tekst`. Imiona wielkimi literami, dokładnie jak w kartach. Luna nie mówi.
- Didaskalia w nawiasach: co widać i słychać. Nigdy, co postać czuje; zamiast „(smutna)” daj „(siada na krawężniku, kopie kamyk)”.
- **Narratora nie ma.** Każdy akapit jest kwestią albo nawiasem. Jeśli coś trzeba wiedzieć, ktoś to mówi albo to widać.
- Bez terminów filmowych (zbliżenie, cięcie, kamera). Scenariusz mówi, co się dzieje; reżyser decyduje jak.

Zasady dialogu dla czterolatka i dla aktora głosowego:
- **Czas:** 8,5 do 9,5 minuty razem: historia plus segment eksperymentu. Skrypt liczy: słowa dialogu przez 140 na minutę plus 4 sekundy na didaskalium. Typowo 700 do 900 słów dialogu historii, 40 do 50 didaskaliów, 5 do 8 scen, plus eksperyment 0,5 do 1,5 minuty.
- **Eksperyment:** po ostatniej scenie nagłówek `## Eksperyment. Imię, miejsce` (przed drugą linią `---`). Zaczyna się didaskalium (dziecko u siebie, rzeczy na stole, dorosły w kadrze bez kwestii). Mówi jedno dziecko, wprost do widzów, po swojemu (Olek numeruje, Ada „dobra, robimy”, Antek buduje, Zuzia mówi, jak wygląda). Pokazuje, jak zrobić to samo zjawisko w domu, nie streszcza historii. Jedno zdanie o bezpieczeństwie, jeśli trzeba. Może skończyć pytaniem do widzów; to jedyne miejsce, gdzie wolno.
- **Kwestie krótkie.** Zdanie do 15 słów. Kwestia do 40 słów; dłuższa to monolog, rozbij działaniem albo wtrąceniem innej postaci. Dzieci mówią równoważnikami: „Ja pierwsza!”, nie „Ja chcę być pierwsza!”.
- **Dialog nie opisuje obrazu.** Nie „patrz, pada deszcz”, skoro deszcz widać. Dialog mówi to, czego obraz nie pokaże: zamiar, spór, pomysł, tłumaczenie.
- **Zwroty z kart wracają** w kwestiach właściwej postaci. Zawołania powtarzają się w rytmie, żeby dziecko mogło mówić razem z ekranem.
- **Każda postać ma swój głos.** Ada skraca, Antek przerywa i wtrąca „proszę”, Olek numeruje („po pierwsze”), Zuzia porównuje. Test: zakryj imię, poznaj po kwestii.
- **Uczucia w ciele, nie w słowie.** Zamiast „jestem smutna” daj didaskalium z czynem i ciszę.
- **Ufaj widzowi.** Nie tłumacz żartu, nie tłumacz morału, nie tłumacz, co postać poczuła. Każda kwestia robi dwie rzeczy naraz: pokazuje postać i pcha historię.
- **Bez ironii dla dziecka.** Ironia tylko w żarcie dla rodzica, w ustach dorosłego.
- **Bez fałszywych faktów dla fabuły.** Jeśli zjawisko nie chce się zgodzić z pomysłem, zmień pomysł.
- **Koniec to obraz**, nie wniosek. Ostatnie ujęcie z konspektu. Bez „do zobaczenia w następnym odcinku” (to należy do napisów, nie do historii).
- Piosenka w odcinku (opcjonalnie, nie w każdym): blok `**PIOSENKA:**`, do 8 wersów, o zjawisku albo o tym, co dzieci właśnie robią. Czołówki nie pisz; jest wspólna w `odcinki/czołówka.md`.

## Krok 5. Sprawdzenie własne

Najpierw skrypt:

```bash
node "narzędzia/sprawdz.js" NN --metryka
```

Skrypt wpisuje sceny, kwestie, słowa dialogu i szacowany czas do metryki, a wypisuje: sceny bez didaskalium na starcie, narrację poza nawiasem, nieznanych mówców, kwestie powyżej 40 słów, zdania powyżej 15 słów, maniery z numerami linii (osobno dialog i didaskalia), które zwroty z kart padły w kwestiach właściwej postaci, detale, karty miejsc, fakty z kanonu, zgodność z indeksem. Napraw wszystko, co wypisał, i uruchom go jeszcze raz. Celem jest zero trafień w „Maniery” i „Sceny” albo świadoma decyzja przy każdym, które zostaje (wpisz ją do notatek).

Potem przejdź warstwy 1 do 4 z `.claude/skills/sprawdz/SKILL.md` (struktura, postacie, język, prawda), czyli to, czego skrypt nie umie: czy próby wynikają z rdzeni, czy zjawisko widać w kadrze, czy porównanie Zuzi działa, czy odcinek nie kłóci się z kanonem. Warstwę 5 (widzowie) zostaw autorce do osobnego `/sprawdz`.

## Krok 6. Zgłoszenie

1. Dopisz wiersz do tabeli w `odcinki/README.md` ze statusem „szkic” (z kolumną „Eksperyment”: kto prowadzi).
2. W sekcji „Notatki” w `scenariusz.md` wypisz: który wariant wybrano i dlaczego, co założono, **nowe fakty o świecie**, które odcinek ustala (kandydaci do `kanon.md`, trafią tam przy statusie „gotowy”), i trafienia skryptu, które celowo zostają.
3. W odpowiedzi dla autorki: tytuł, ścieżka, szacowany czas, liczba scen, jedno zdanie o czym jest, lista decyzji do podjęcia. Bez streszczania całego odcinka.

Nie commituj. Nie zmieniaj kart postaci ani miejsc; jeśli odcinek pokazał, że karta czegoś nie ma, dopisz to do notatek.
