#!/usr/bin/env node
// Hook PostToolUse dla Claude Code (konfiguracja w .claude/settings.json).
// Po każdym Write/Edit pliku odcinki/<NN tytuł>/scenariusz.md uruchamia narzędzia/sprawdz.js
// i oddaje wynik modelowi jako dodatkowy kontekst. Dla innych plików milczy.
// Nie zmienia żadnych plików (bez --metryka); to robią skille jawnie.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function czytajStdin() {
  try { return fs.readFileSync(0, "utf8"); } catch { return ""; }
}

let dane = {};
try { dane = JSON.parse(czytajStdin() || "{}"); } catch { process.exit(0); }

const sciezka =
  (dane.tool_input && dane.tool_input.file_path) ||
  (dane.tool_response && dane.tool_response.filePath) ||
  "";
if (!sciezka) process.exit(0);

const norm = sciezka.replace(/\\/g, "/");
const m = norm.match(/\/odcinki\/([^/]+)\/scenariusz\.md$/);
if (!m || m[1].startsWith("_")) process.exit(0);

const folder = path.dirname(sciezka);
const skrypt = path.join(__dirname, "sprawdz.js");
const wynik = spawnSync(process.execPath, [skrypt, folder], { encoding: "utf8" });

const tresc = (wynik.stdout || "") + (wynik.stderr ? "\n" + wynik.stderr : "");
const naglowek =
  "Automatyczne sprawdzenie scenariusza (hook, narzędzia/sprawdz.js). " +
  "To są fakty z pliku, nie opinie. Przed zgłoszeniem odcinka autorce napraw wszystko z sekcji „Maniery”, " +
  "„Kwestie i zdania”, „Sceny” i „Postacie i zwroty z kart” albo wpisz do notatek, dlaczego coś zostaje. " +
  "Fakty z sekcji „Kanon” obowiązują.\n\n";

const out = {
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: naglowek + tresc,
  },
};
process.stdout.write(JSON.stringify(out));
