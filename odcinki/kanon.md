# Kanon

Fakty, które ustaliły gotowe odcinki i które od tej pory obowiązują we wszystkich następnych. Karty w `postacie/` i `miejsca/` mówią, jak świat ma wyglądać; kanon mówi, co już zostało powiedziane na głos i czego nie wolno zmienić bez poprawienia bajki.

Zasady:
- Do kanonu trafia fakt dopiero, gdy odcinek ma status **gotowy**. Wcześniej `/sprawdz` wypisuje go w `sprawdzenie.md` jako propozycję, a autor decyduje.
- Fakt to jedno zdanie, konkretne: „w kuchni Olka czajnik jest czerwony”, nie „kuchnia Olka jest przytulna”.
- Każdy fakt ma źródło (numer bajki) i adres: karta miejsca lub postaci, do której powinien trafić. Gdy trafi, kolumna „W karcie” dostaje „tak”. Fakt zostaje w kanonie także po przeniesieniu, bo kanon jest listą kontrolną, a karta opisem.
- Skrypt `narzędzia/sprawdz.js` wypisuje przy sprawdzaniu odcinka wszystkie fakty dotyczące jej miejsca i postaci. `/odcinek` czyta kanon przed pisaniem.
- Jeśli nowy odcinek musi coś zmienić w kanonie (autorka tak chce), poprawiamy też odcinek źródłowy albo dopisujemy w nim notatkę. Fakt sprzeczny z kanonem bez tej poprawki to błąd warstwy 4 w `/sprawdz`.

## Fakty

| Nr | Fakt | Źródło (odcinek) | Dotyczy | W karcie |
|---|---|---|---|---|
| | | | | |

Kolumna „Dotyczy”: nazwa miejsca z `miejsca/` (np. `dom olka`), imię postaci (np. `Olek`, `Luna`) albo `świat` dla rzeczy ogólnych (pora roku, jak daleko do przedszkola). Może być kilka, po przecinku.

## Fakty wycofane

| Nr | Fakt | Dlaczego wycofany | Co poprawiono |
|---|---|---|---|
| | | | |
