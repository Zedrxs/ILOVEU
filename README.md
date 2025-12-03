## Rechner Trainer

Eine einfache, moderne Lern-Website, auf der du Aufgaben aus einer Konfigurationsdatei auswählst und mit einem geführten, KI-ähnlichen Rechentrainer Schritt für Schritt löst. Du gibst Zwischenergebnisse ein, bekommst Erklärungen und kannst am Ende deine eigene Lösung mit der KI-Lösung vergleichen und Punkte sammeln.

### Features

- **Passwort-Schutz** beim Betreten der Seite (Standardpasswort: `lernen`, anpassbar in `app.js`).
- **Aufgaben aus Konfiguration** in `tasks.json` (Titel, Beschreibung, Schwierigkeit, Punkte, Schritte, finale Lösung).
- **Moderner UI-Stil** mit klaren Panels für Aufgabenliste und Rechentrainer.
- **Geführte Zwischen-Schritte**: Du musst nacheinander logische Zwischenergebnisse eintragen, bevor du zur nächsten Stufe kommst.
- **Finaler Vergleich**: Am Ende gibst du dein Endergebnis ein, die „KI“ vergleicht es mit der gespeicherten Lösung und erklärt den Rechenweg.
- **Punktesystem** je nach Schwierigkeitsgrad der Aufgaben (z. B. einfach / mittel / schwer).

### Projektstruktur

- `index.html` – Einstiegspunkt der Anwendung (Login-Screen + App-Layout).
- `style.css` – Modernes, dunkles UI-Design.
- `app.js` – Logik für Login, Laden der Aufgaben, Schritt-für-Schritt-Trainer und Punktesystem.
- `tasks.json` – Konfigurationsdatei für alle Aufgaben, Schritte und Lösungen.
- `package.json` – Kleine Hilfe, um schnell einen lokalen Webserver zu starten.

### Starten der Anwendung

#### Variante 1: Mit Node.js (empfohlen)

1. Stelle sicher, dass **Node.js** installiert ist.
2. Öffne ein Terminal im Projektordner:

   ```bash
   cd "c:\Users\zedru\Documents\rechner app"
   npm start
   ```

3. Im Terminal wird dir eine Adresse angezeigt, z. B. `http://localhost:3000` oder `http://localhost:5000`. Diese im Browser öffnen.

> Hinweis: Das Skript nutzt `npx serve .`, um einen einfachen statischen Server zu starten.

#### Variante 2: Mit beliebigem statischen Server / VS Code

- Du kannst z. B. die VS-Code-Erweiterung **Live Server** nutzen oder ein anderes Tool, das einen statischen Server bereitstellt.
- Wichtig ist, dass die Seite **über HTTP** geladen wird (z. B. `http://localhost:...`), damit `tasks.json` korrekt per `fetch` geladen werden kann. Ein direktes Öffnen der `index.html` als Datei (`file://...`) funktioniert sonst nicht sauber.

### Passwort ändern

In `app.js` steht am Anfang:

```js
const APP_PASSWORD = 'lernen';
```

Ändere den String einfach auf dein gewünschtes Passwort.

### Aufgaben anpassen

In `tasks.json` findest du ein Array von Aufgaben:

- **id** – Eindeutige Kennung (interner Name).
- **title** – Titel der Aufgabe.
- **difficulty** – z. B. `einfach`, `mittel`, `schwer`.
- **points** – Punktzahl für die Aufgabe.
- **shortDescription** / **description** – Kurz- und Langbeschreibung.
- **steps** – Array von Zwischenschritten:
  - `prompt` – Frage/Texthinweis an den Schüler.
  - `expectedType` – aktuell vor allem `"number"`.
  - `expectedValue` – erwarteter Wert.
  - `tolerance` – Toleranz für Zahlen (z. B. bei Dezimalzahlen).
  - `assistantHint` – Tipp der KI bei falscher Eingabe.
  - `assistantExplain` – Erklärung, wenn der Schritt richtig war.
- **finalAnswer** – Objekt mit finaler Lösung:
  - `type` (`"number"`),
  - `value`,
  - `tolerance`,
  - `assistantSummary` – Erklärung des gesamten Lösungswegs.

Du kannst vorhandene Aufgaben ändern oder neue hinzufügen. Achte darauf, dass die JSON-Struktur gültig bleibt (Kommas, Anführungszeichen etc.).

### Anpassungsideen

- Weitere Aufgabentypen (z. B. Gleichungssysteme, Textaufgaben).
- Zusätzliche Schwierigkeitsstufen und Punkte-Boni.
- Speicherung des Fortschritts im `localStorage`.
- Extra-Ansicht mit Auswertung (Quote richtige Aufgaben, durchschnittliche Schwierigkeit usw.).


