# Südstadt volleyteam – Trainingsplan

Statisches Multi-File-Projekt für GitHub Pages und Einbindung via iframe. Die Oberfläche wird aus `config.json` aufgebaut; Layout und Verhalten liegen in `styles.css` und `app.js`.

## Dateien

- `index.html` – Einbettungsseite / Grundgerüst
- `config.json` – Texte, Teamfilter, Hallen und Trainingsdaten
- `styles.css` – Design, responsive Layout und Animationen
- `app.js` – lädt die JSON-Datei, rendert den Plan und verwaltet Filter

## Lokal testen

Da der Browser `config.json` über `fetch()` lädt, öffne die Seite über einen lokalen Webserver und nicht per Doppelklick auf `index.html`.

Zum Beispiel im Projektordner:

```bash
python -m http.server 8000
```

Dann `http://localhost:8000` öffnen.

## Auf GitHub Pages veröffentlichen

1. Lade alle vier Dateien in dasselbe Repository-Verzeichnis hoch.
2. Aktiviere GitHub Pages in den Repository-Einstellungen (Branch und Ordner auswählen).
3. Rufe die veröffentlichte `index.html`-URL auf.
4. Binde genau diese URL in deiner Website ein:

```html
<iframe
  src="https://DEIN-USERNAME.github.io/DEIN-REPOSITORY/"
  title="Trainingsplan Südstadt volleyteam"
  loading="lazy"
  style="width:100%; min-height:900px; border:0;"
></iframe>
```

Passe die URL und die Höhe an. Bei einer eigenen Domain oder einem Unterpfad müssen `index.html`, `app.js`, `styles.css` und `config.json` gemeinsam erreichbar sein.

## Trainingsdaten ändern

Bearbeite `config.json`. Ein Training hat diese Struktur:

```json
{
  "team": "Damen 1",
  "filterTeams": ["Damen"],
  "category": "Damen",
  "hall": "Modeschule",
  "hallFilter": "Modeschule",
  "start": "19:30",
  "end": "22:00"
}
```

- `filterTeams` steuert, bei welchen Teamfiltern ein Training erscheint. Für mehrere passende Filter können mehrere Werte angegeben werden, z. B. `["U16", "U18"]`.
- `hall` ist der angezeigte Hallenname; `hallFilter` ist der Wert, der mit dem Hallenfilter abgeglichen wird.
- `start` und `end` werden links bzw. in der roten Zeitmarkierung angezeigt.
- Hallenwerte in `halls` und `hallFilter` sollten zueinander passen.

Die Trainingsdaten sind aus dem vorhandenen HTML-Prototyp übernommen und sollten vor der Veröffentlichung fachlich überprüft werden.
