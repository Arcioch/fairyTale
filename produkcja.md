# Produkcja w Runway

Jak ze scenariusza powstaje materiał: referencje, prompty, graf workflow, dźwięk, koszty i pułapki. Obowiązuje dla wszystkich odcinków. Rzeczy specyficzne dla jednego odcinka są w `odcinki/<NN tytuł>/runway.md`.

Stan na 2026-09-09: zrobiona scena 1 odcinka 01 (workflow `a94fa1c8-cb39-4d69-9ce6-1f40357ffa1f`), z niej wzięte wszystkie wzorce poniżej.

## Konto i projekt

- Runway, konto **Piotr** (team `parciszewski`), plan Pro. MCP jest podpięte do tego samego workspace.
- Projekt **fairyTale**: <https://app.runwayml.com/video-tools/teams/parciszewski/ai-tools/projects/d6ee41e5-b5ee-4ad3-9f3b-aaec64b0ae4f>
- Workflow trzymamy w tym projekcie, po jednym na scenę, nazwane `NN scena N - opis` (np. „01 scena 1 - kuchnia u Olka").

## Zasada numer jeden: referencje

Każdy kadr z postacią powstaje z jej obrazem kanonicznym wpiętym jako referencja, nigdy z samego opisu w promptcie. Tak samo wnętrza: każde ujęcie w mieszkaniu Olka dostaje referencję układu (`dom-olka`). Bez tego model za każdym razem wymyśla postać i pokój od nowa.

Identyfikatory referencji (assetów) zbieramy raz na postać i miejsce i zapisujemy w definicji sceny. Jak je zdobyć: w edytorze Runway wstaw węzeł Image, wybierz asset z biblioteki, a potem odczytaj wartość z zapisanego grafu. MCP `list_recent` pokazuje tylko przykładowe assety Runway, nie te z projektu.

Prompty piszemy po angielsku, tak jak prompty bazowe w kartach postaci, i powtarzamy w nich strój z kanonu. Referencja trzyma twarz i sylwetkę, prompt pilnuje ubrania i sytuacji.

## Modele i parametry

| Rola | Model | Węzeł w API | Uwagi |
|---|---|---|---|
| kadr kluczowy | Nano Banana Pro (`gemini-3-pro-image-preview`) | `workflow_gemini_image` / `gemini-image-3-pro` | 16:9, 1K, jeden obraz na węzeł |
| ujęcie | Seedance 2.0 | `workflow_seedance_2` / `seedance-2` | 4 do 15 s, 720p, `generateAudio: false` |
| kwestia | ElevenLabs v3 | `workflow_text_to_speech` / `eleven-text-to-speech-3` | `voiceId` + `modelId: eleven_v3` |
| dźwięk tła | ElevenLabs SFX | `workflow_audio_sfx` / `eleven-text-to-sfx` | `promptText` + `duration` |

Kadr wchodzi w ujęcie przez `firstFrame`, więc ruch startuje z zatwierdzonego obrazu. Kwestia wchodzi w `referenceAudio` ujęcia, czyli steruje ustami i tempem.

## Głosy

`voiceId` to identyfikator głosu ElevenLabs: ten sam identyfikator znaczy ten sam głos, w każdej kwestii i w każdym odcinku. W grafie nie wpisujemy go do każdej kwestii z osobna, tylko trzymamy **jeden węzeł tekstowy na postać** i z niego ciągniemy kabel do wszystkich jej kwestii. Zmiana głosu postaci to podmiana jednej wartości.

Odsłuch przed generowaniem: w węźle Eleven v3 ikona ustawień, pole „Voice", lista 49 gotowych głosów i przycisk odtwarzania z próbką. Próbka nie generuje kwestii z odcinka.

Wybrane głosy zapisujemy w kartach postaci, żeby były stałe w serii. Obsada głosów to decyzja autorki.

Ograniczenie: w liście Runway **nie ma głosu małego chłopca**. Głosy dziecięce to młode kobiece (m.in. „Rachel — feminine, young, childish"); w animacji małych chłopców standardowo dubbingują kobiety. Alternatywy, jeśli to nie wystarczy: własny głos z biblioteki ElevenLabs (czy identyfikator z konta ElevenLabs działa w tym polu — do sprawdzenia) albo nagranie dziecka.

## Jak zbudować graf sceny

Grafu nie klikamy ręcznie. Buduje go `narzędzia/graf-runway.js` z pliku definicji `odcinki/<NN tytuł>/runway-scena-N.json`. Wzorzec: `odcinki/01 Kto puścił zajączka/runway-scena-1.json`.

```bash
node "narzędzia/graf-runway.js" "odcinki/01 Kto puścił zajączka/runway-scena-1.json"
```

Definicja sceny zawiera:

- `odcinek`, `scena` — skrypt czyta z nich kwestie 1:1 ze `scenariusz.md`, z sekcji tej sceny,
- `referencje` — nazwa referencji → id assetu,
- `glosy` — imię postaci (wielkimi literami, tak jak w scenariuszu) → `voiceId`,
- `obraz` i `wideo` — proporcje, rozmiar, sekundy, rozdzielczość,
- `wspolne` — tekst doklejany do każdego promptu kadru: opis miejsca i styl serii,
- `ujecia` — lista: `nr`, `refs`, `obraz` (prompt kadru), `ruch` (prompt ruchu), `sfx`, `kwestia` (numer kwestii w scenie, licząc od zera, albo `null`).

Skrypt wypisuje graf i podsumowanie: węzły, sekundy materiału, liczbę kwestii i szacowany koszt. Identyfikatory węzłów liczy z nazwy odcinka, numeru sceny i roli węzła, więc przegenerowanie po poprawce promptu daje te same id: Runway widzi edycję, a nie nowy graf.

Wysyłka do Runway przez MCP: `validate_workflow_graph`, potem `create_workflow` (nowa scena) albo `save_workflow_version` (poprawka). **Generowanie kosztuje kredyty i wymaga wyraźnej zgody autora.**

## Kształt węzłów w API

MCP nie zwraca grafu przez `get_workflow`, a zasób `runway://docs/workflows/examples` jest niedostępny z poziomu narzędzi. Kształty poniżej ustalone z ruchu zapisu w aplikacji; siedzą w `narzędzia/graf-runway.js`.

```json
{"id":"<uuid>","nodeType":"constant-node","constantNodeType":"prompt",
 "nodeProps":{"position":{"x":0,"y":0}},
 "nodeOutputs":{"prompt":{"type":"string","value":"..."}}}

{"id":"<uuid>","nodeType":"asset-node","assetNodeType":"image",
 "nodeProps":{"position":{"x":0,"y":0}},
 "nodeOutputs":{"image":{"type":"image","value":"<id assetu>"}}}

{"id":"<uuid>","nodeType":"workflow-node","nodeVersion":1,
 "taskType":"workflow_seedance_2","appNodeType":"seedance-2",
 "nodeInputs":{"textPrompt":{"type":"string","required":true},
               "firstFrame":{"type":"image","required":false},
               "referenceAudio":{"type":"audio","required":false},
               "aspectRatio":{"type":"string","value":"16:9"},
               "duration":{"type":"number","value":5},
               "resolution":{"type":"string","value":"720p"},
               "generateAudio":{"type":"boolean","value":false}},
 "nodeOutputs":{"video":{"type":"video"}}}
```

Krawędzie: `{"from":{"nodeId","nodeOutput"},"to":{"nodeId","nodeInput"}}`. Kilka krawędzi do jednego wejścia (kilka referencji w `reference_images`) wymaga pola `index` w `to`, inaczej walidator zwraca `DUPLICATE_INPUT_CONNECTION`. Wartości można wpisywać na sztywno w `nodeInputs` zamiast ciągnąć kablem (tak są zrobione kwestie i efekty dźwiękowe).

## Ile trwa ujęcie, ile trwa scena

Seedance daje na jedno ujęcie **od 4 do 15 sekund**. Scena limitu nie ma, bo składa się z ujęć.

Nie ma sensu opisywać w jednym promptcie całej sceny i liczyć na minutę materiału: model dostaje jedno ujęcie i trzyma jedną ciągłą akcję. Im więcej beatów w jednym promptcie, tym bardziej postacie i wnętrze odpływają od referencji, a model sam wstawia cięcia. Zasada jak w zwykłej animacji: jedno ujęcie to jedna czynność, scena powstaje z ujęć.

Ile ujęć na scenę: policz czas sceny miarą projektu (słowa dialogu przez 140 na minutę plus 4 s na didaskalium — robi to `narzędzia/sprawdz.js`) i podziel przez długość ujęcia. Scena na 65 sekund to około 12 ujęć po 5 s. Każde didaskalium jest kandydatem na osobne ujęcie.

## Co wychodzi z uruchomienia

Osobne pliki, nie zmontowana scena:

- obrazy (kadry kluczowe),
- klipy wideo, każdy osobno,
- pliki z kwestiami,
- pliki z dźwiękiem tła.

Węzła montażowego w grafie nie ma i Runway sam tego nie sklei. Złożenie sceny to montaż. Czy klip wideo niesie ze sobą ścieżkę z `referenceAudio`, czy trzeba ją podłożyć — do potwierdzenia na pierwszym udanym ujęciu.

## Koszty

Ceny z `validate_workflow_graph` z `estimate_cost`, stan na 2026-09-09:

| Element | Koszt |
|---|---|
| kadr (Nano Banana Pro, 1K) | 20 |
| wideo (Seedance 2.0, 720p) | ok. 36 za sekundę: 5 s = 180, 15 s = 540 |
| kwestia albo efekt dźwiękowy (Eleven) | ok. 3,5 |

Z tego: scena na 12 ujęć po 5 s to około 2400 kredytów, a cały odcinek (8,6 minuty, około 100 ujęć) rząd **19 000 kredytów**. Warto znać ten rząd wielkości przed planowaniem serii.

## Kolejność pracy (i dlaczego taka)

1. **Kadr próbny jednego ujęcia** (20 kredytów). Sprawdza naraz: czy postać wychodzi z aktualnego kanonu, czy miejsce zgadza się z kartą, czy kadr nie poszedł w izometrię, czy styl trzyma serię.
2. **Jedna kwestia** (ok. 3,5). Sprawdza głos: akcent, tempo, czy nie brzmi jak lektor. Najtańszy moment na zmianę obsady.
3. **Ujęcie wideo** (180 za 5 s). Dopiero z zatwierdzonym kadrem i głosem.
4. Reszta kadrów sceny, potem reszta ujęć.

Poprawka promptu kosztuje 20 kredytów na etapie kadru i 180 na etapie wideo. Stąd ta kolejność.

## Pułapki

- **Podpisane URL-e wygasają** (kilkanaście godzin). W grafie trzymamy identyfikatory assetów, nie linki. Do pobrania pliku bierzemy świeży URL z `get_task`.
- **Kanon się zmienia.** Po każdej podmianie obrazu kanonicznego trzeba sprawdzić dwie rzeczy: id assetu w definicji sceny i opis stroju w promptach. Stary opis plus nowa referencja to najgorszy wariant, bo model próbuje pogodzić sprzeczność.
- **Scenariusz kontra kanon.** Jeśli didaskalia mówią o rzeczy, której nie ma w kanonie (kieszeń bluzy, a kanon bez bluzy), to nie jest problem promptu, tylko pytanie do autorki. Zapisujemy w `TODO.md`.
- **Model dorysowuje symbole** (nutki, serduszka). „No text" ich nie wyklucza; trzeba wprost napisać, że nie ma symboli.
- **Przycisk „Replace" w węźle referencji czyści go od razu**, bez pytania i z autozapisem.
- **Kolejka Seedance bywa długa.** Klip 5-sekundowy potrafi wisieć kilkanaście minut bez błędu. Stan widać w panelu „Active runs" w edytorze, razem z liczbą zużytych kredytów.
- **MCP `run_workflow` z `node_ids`** uruchamia tylko wskazane węzły; reszta grafu stoi. Do prób to jedyny sensowny tryb.
