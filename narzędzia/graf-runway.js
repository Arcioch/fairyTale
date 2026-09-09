#!/usr/bin/env node
// Buduje graf workflow Runway dla jednej sceny odcinka.
//
// Uzycie:
//   node "narzędzia/graf-runway.js" "odcinki/01 Kto puścił zajączka/runway-scena-1.json"
//   node "narzędzia/graf-runway.js" <plik.json> --zapisz graf.json
//
// Wypisuje graf w formacie API Runway (do validate_workflow_graph, create_workflow
// albo save_workflow_version przez MCP) i krotkie podsumowanie z szacunkiem kredytow.
//
// Kwestie dialogowe czyta 1:1 ze `scenariusz.md` danego odcinka, z sekcji wskazanej
// sceny. Nigdy nie przepisujemy dialogow recznie.
//
// Identyfikatory wezlow sa liczone z nazwy odcinka, numeru sceny i roli wezla, wiec
// ponowne uruchomienie po poprawce promptu daje te same id: Runway widzi wtedy edycje
// istniejacych wezlow, a nie nowy graf.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KATALOG = path.resolve(__dirname, '..');

// --- stale modeli (kształty ustalone z ruchu zapisu w aplikacji Runway) -----------

const MODEL_OBRAZU = {
  taskType: 'workflow_gemini_image',
  appNodeType: 'gemini-image-3-pro',
  model: 'gemini-3-pro-image-preview',
  nazwaZadania: 'workflow-gemini-image-3-pro-task',
};

const MODEL_WIDEO = {
  taskType: 'workflow_seedance_2',
  appNodeType: 'seedance-2',
  nazwaZadania: 'workflow-seedance-2-task',
  sekundyOd: 4,
  sekundyDo: 15,
};

const MODEL_MOWY = {
  taskType: 'workflow_text_to_speech',
  appNodeType: 'eleven-text-to-speech-3',
  nazwaZadania: 'workflow-generate-audio-task',
  modelId: 'eleven_v3',
};

const MODEL_SFX = {
  taskType: 'workflow_audio_sfx',
  appNodeType: 'eleven-text-to-sfx',
  nazwaZadania: 'workflow-text-to-sfx-task',
};

// kredyty na dzien 2026-09-09, z cost-estimate Runway
const KREDYTY = { obraz: 20, wideoNaSekunde: 36, mowa: 3.5, sfx: 3.5 };

// --- pomocnicze -------------------------------------------------------------------

function uuidZKlucza(klucz) {
  const h = crypto.createHash('sha1').update(klucz).digest('hex').slice(0, 32);
  const wersja = h.slice(12, 16).replace(/^./, '4');
  const wariant = h.slice(16, 20).replace(/^./, '8');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${wersja}-${wariant}-${h.slice(20, 32)}`;
}

function wczytajKwestie(odcinek, scena) {
  const plik = path.join(KATALOG, 'odcinki', odcinek, 'scenariusz.md');
  const tekst = fs.readFileSync(plik, 'utf8');
  const start = tekst.indexOf(`## Scena ${scena}.`);
  if (start === -1) throw new Error(`nie znalazłem sekcji "## Scena ${scena}." w ${plik}`);
  const dalej = tekst.indexOf(`## Scena ${scena + 1}.`, start);
  const fragment = tekst.slice(start, dalej === -1 ? undefined : dalej);
  return [...fragment.matchAll(/\*\*([A-ZĄĆĘŁŃÓŚŹŻ]+):\*\*\s*(.+)/g)]
    .map((m) => ({ kto: m[1], tekst: m[2].trim() }));
}

// --- budowanie grafu ---------------------------------------------------------------

function zbudujGraf(def) {
  const { odcinek, scena, referencje, glosy, ujecia } = def;
  const wideo = Object.assign({ sekundy: 5, rozdzielczosc: '720p', proporcje: '16:9' }, def.wideo || {});
  const obraz = Object.assign({ proporcje: '16:9', rozmiar: '1K', sztuk: 1 }, def.obraz || {});

  if (wideo.sekundy < MODEL_WIDEO.sekundyOd || wideo.sekundy > MODEL_WIDEO.sekundyDo) {
    throw new Error(`ujęcie musi trwać od ${MODEL_WIDEO.sekundyOd} do ${MODEL_WIDEO.sekundyDo} s`);
  }

  const kwestie = wczytajKwestie(odcinek, scena);
  const nodes = [];
  const edges = [];
  const id = (rola) => uuidZKlucza(`${odcinek}|scena ${scena}|${rola}`);
  const dodaj = (n) => { nodes.push(n); return n.id; };

  const staly = (rola, x, y, wartosc) => dodaj({
    id: id(rola), nodeType: 'constant-node', constantNodeType: 'prompt',
    nodeProps: { position: { x, y } },
    nodeOutputs: { prompt: { type: 'string', value: wartosc } },
  });

  // 1. referencje obrazkowe (postacie, miejsce)
  const idRef = {};
  Object.keys(referencje).forEach((nazwa, i) => {
    idRef[nazwa] = dodaj({
      id: id(`referencja ${nazwa}`), nodeType: 'asset-node', assetNodeType: 'image',
      nodeProps: { position: { x: 0, y: i * 620 } },
      nodeOutputs: { image: { type: 'image', value: referencje[nazwa] } },
    });
  });

  // 2. głosy: jeden węzeł na postać, wpięty we wszystkie jej kwestie
  const idGlosu = {};
  Object.keys(glosy).forEach((postac, i) => {
    idGlosu[postac] = staly(`głos ${postac}`, 0, Object.keys(referencje).length * 620 + 80 + i * 240, glosy[postac]);
  });

  // 3. ujęcia: prompt kadru -> obraz -> Seedance, plus dźwięk tła
  const idWideo = [];
  ujecia.forEach((u, i) => {
    const y = i * 900;

    // `wspolne` doklejamy do kazdego kadru: opis miejsca i styl serii, zeby nie
    // powtarzac ich w kazdym ujeciu z osobna
    const trescKadru = def.wspolne ? `${u.obraz} ${def.wspolne}` : u.obraz;
    const promptKadru = staly(`prompt kadru ${u.nr}`, 560, y, trescKadru);
    const wezelObrazu = dodaj({
      id: id(`kadr ${u.nr}`), nodeType: 'workflow-node', nodeVersion: 1,
      taskType: MODEL_OBRAZU.taskType, appNodeType: MODEL_OBRAZU.appNodeType,
      nodeProps: { position: { x: 1080, y } },
      nodeInputs: {
        text_prompt: { type: 'string', required: true },
        reference_images: { type: 'image' },
        model: { type: 'string', value: MODEL_OBRAZU.model },
        name: { type: 'string', value: MODEL_OBRAZU.nazwaZadania },
        num_images: { type: 'int', value: obraz.sztuk },
        aspect_ratio: { type: 'string', value: obraz.proporcje },
        image_size: { type: 'string', value: obraz.rozmiar },
        exploreMode: { type: 'boolean', value: false },
      },
      nodeOutputs: { image: { type: 'image' } },
    });
    edges.push({ from: { nodeId: promptKadru, nodeOutput: 'prompt' }, to: { nodeId: wezelObrazu, nodeInput: 'text_prompt' } });
    u.refs.forEach((nazwa, k) => {
      if (!idRef[nazwa]) throw new Error(`ujęcie ${u.nr}: nie ma referencji "${nazwa}"`);
      // kilka krawędzi do jednego wejścia wymaga indeksu, inaczej DUPLICATE_INPUT_CONNECTION
      edges.push({ from: { nodeId: idRef[nazwa], nodeOutput: 'image' }, to: { nodeId: wezelObrazu, nodeInput: 'reference_images', index: k } });
    });

    const promptRuchu = staly(`prompt ruchu ${u.nr}`, 1600, y, u.ruch);
    const wezelWideo = dodaj({
      id: id(`ujęcie ${u.nr}`), nodeType: 'workflow-node', nodeVersion: 1,
      taskType: MODEL_WIDEO.taskType, appNodeType: MODEL_WIDEO.appNodeType,
      nodeProps: { position: { x: 2120, y } },
      nodeInputs: {
        textPrompt: { type: 'string', required: true },
        firstFrame: { type: 'image', required: false },
        lastFrame: { type: 'image', required: false },
        referenceImages: { type: 'image', required: false },
        referenceVideos: { type: 'video', required: false },
        referenceAudio: { type: 'audio', required: false },
        name: { type: 'string', value: MODEL_WIDEO.nazwaZadania },
        aspectRatio: { type: 'string', value: wideo.proporcje },
        duration: { type: 'number', value: wideo.sekundy },
        resolution: { type: 'string', value: wideo.rozdzielczosc },
        generateAudio: { type: 'boolean', value: false },
        bitrate_mode: { type: 'string', value: 'high' },
        exploreMode: { type: 'boolean', value: false },
        creationSource: { type: 'string', value: 'dynamic-workflows' },
        creationSourceAppId: { type: 'string', value: 'dynamic-workflows' },
      },
      nodeOutputs: { video: { type: 'video' } },
    });
    idWideo[i] = wezelWideo;
    edges.push({ from: { nodeId: promptRuchu, nodeOutput: 'prompt' }, to: { nodeId: wezelWideo, nodeInput: 'textPrompt' } });
    edges.push({ from: { nodeId: wezelObrazu, nodeOutput: 'image' }, to: { nodeId: wezelWideo, nodeInput: 'firstFrame' } });

    if (u.sfx) {
      dodaj({
        id: id(`tło ${u.nr}`), nodeType: 'workflow-node', nodeVersion: 1,
        taskType: MODEL_SFX.taskType, appNodeType: MODEL_SFX.appNodeType,
        nodeProps: { position: { x: 2120, y: y + 420 } },
        nodeInputs: {
          promptText: { type: 'string', required: true, value: u.sfx },
          name: { type: 'string', value: MODEL_SFX.nazwaZadania },
          duration: { type: 'int', value: wideo.sekundy },
        },
        nodeOutputs: { audio: { type: 'audio' } },
      });
    }
  });

  // 4. kwestie: każda osobno, głos z węzła postaci, wpięcie w ujęcie jeśli wskazane
  kwestie.forEach((k, j) => {
    if (!idGlosu[k.kto]) throw new Error(`kwestia ${j} (${k.kto}): brak głosu tej postaci w definicji`);
    const wezelMowy = dodaj({
      id: id(`kwestia ${j}`), nodeType: 'workflow-node', nodeVersion: 1,
      taskType: MODEL_MOWY.taskType, appNodeType: MODEL_MOWY.appNodeType,
      nodeProps: { position: { x: 2800, y: j * 260 } },
      nodeInputs: {
        text: { type: 'string', required: true, value: k.tekst },
        name: { type: 'string', value: MODEL_MOWY.nazwaZadania },
        voiceId: { type: 'string' },
        modelId: { type: 'string', value: MODEL_MOWY.modelId },
      },
      nodeOutputs: { audio: { type: 'audio' } },
    });
    edges.push({ from: { nodeId: idGlosu[k.kto], nodeOutput: 'prompt' }, to: { nodeId: wezelMowy, nodeInput: 'voiceId' } });

    const i = ujecia.findIndex((u) => u.kwestia === j);
    if (i >= 0) edges.push({ from: { nodeId: wezelMowy, nodeOutput: 'audio' }, to: { nodeId: idWideo[i], nodeInput: 'referenceAudio' } });
  });

  const koszt =
    ujecia.length * KREDYTY.obraz +
    ujecia.length * wideo.sekundy * KREDYTY.wideoNaSekunde +
    ujecia.filter((u) => u.sfx).length * KREDYTY.sfx +
    kwestie.length * KREDYTY.mowa;

  return { graf: { version: 1, nodes, edges }, kwestie, koszt, wideo };
}

// --- uruchomienie ------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('podaj plik definicji sceny, np. "odcinki/01 Kto puścił zajączka/runway-scena-1.json"');
    process.exit(1);
  }
  const plikDef = path.isAbsolute(args[0]) ? args[0] : path.join(KATALOG, args[0]);
  const def = JSON.parse(fs.readFileSync(plikDef, 'utf8'));
  const { graf, kwestie, koszt, wideo } = zbudujGraf(def);

  const iZapisz = args.indexOf('--zapisz');
  if (iZapisz !== -1 && args[iZapisz + 1]) {
    const cel = path.isAbsolute(args[iZapisz + 1]) ? args[iZapisz + 1] : path.join(KATALOG, args[iZapisz + 1]);
    fs.writeFileSync(cel, JSON.stringify(graf), 'utf8');
    console.error(`graf zapisany: ${cel}`);
  } else {
    process.stdout.write(JSON.stringify(graf));
    process.stdout.write('\n');
  }

  console.error(
    `\nodcinek ${def.odcinek}, scena ${def.scena}\n` +
    `węzły: ${graf.nodes.length}, połączenia: ${graf.edges.length}\n` +
    `ujęcia: ${def.ujecia.length} po ${wideo.sekundy} s (${def.ujecia.length * wideo.sekundy} s materiału)\n` +
    `kwestie ze scenariusza: ${kwestie.length}\n` +
    `szacowany koszt pełnego uruchomienia: ok. ${Math.round(koszt)} kredytów`
  );
}

if (require.main === module) main();

module.exports = { zbudujGraf, wczytajKwestie, uuidZKlucza };
