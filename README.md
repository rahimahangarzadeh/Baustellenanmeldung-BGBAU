# 🏗️ Baustellenanmeldung BG BAU - PWA

Eine Progressive Web App für die Baustellenanmeldung bei der BG BAU (Berufsgenossenschaft der Bauwirtschaft) der Janning Group.

## 📱 Features

- ✅ **Progressive Web App** - Installierbar auf Smartphone und Desktop
- 🗺️ **Interaktive Kartenauswahl** - Baustellenort per Karte auswählen
- 📋 **Vorlagen-System** - 6 vordefinierte Tätigkeitsprofile
- 🔄 **Offline-Fähigkeit** - Daten werden lokal gespeichert und später synchronisiert
- 📤 **n8n Integration** - Direkte Webhook-Anbindung
- 🎨 **Modernes Design** - Industrial-Professional mit orange Akzenten

## 🚀 Installation auf GitHub Pages

1. Repository erstellen
2. Alle Dateien hochladen
3. In Repository Settings → Pages → Source auf "main branch" setzen
4. Die App ist verfügbar unter: `https://[username].github.io/[repository-name]/`

## 📁 Dateien

```
├── icon-192.png              # App-Icon (192x192)
├── icon-512.png              # App-Icon (512x512)
├── index.html                # Hauptseite
├── style.css                 # Styling
├── script.js                 # Hauptlogik
├── service-worker.js         # PWA Service Worker
├── manifest.json             # PWA Manifest
├── n8n-integration.js        # n8n Webhook-Integration
└── README.md                 # Diese Datei
```

## 🛠️ Tätigkeitsvorlagen

Die App bietet 6 vordefinierte Vorlagen:

1. **Magazin & Werkstatt**
2. **Rohrbauarbeiten**
3. **Tiefbauarbeiten**
4. **Horizontalbohrung**
5. **Fernwärmeleitungen**
6. **Glasfaser**

## 📋 Formularfelder

### Pflichtfelder (*)
- Datum
- E-Mail-Adresse für Zustellung
- Name des Arbeitsverantwortlichen
- Firma (Mehrfachauswahl)
- Baustelle (mit Kartenauswahl)
- Arbeitgeber
- Mitarbeiteranzahl
- Nachunternehmer (Ja/Nein)
- Zeitraum (Beginn & Ende)
- Sicherheitsangaben (Personenaufnahmemittel, kontaminierte Bereiche, Asbest)

### Optionale Felder
- Auftragsnummer
- Projektname
- Name Subunternehmer
- Mitarbeiteranzahl Subunternehmer

## 🔗 n8n Webhook

Die Daten werden an folgenden Webhook gesendet:
```
https://n8n.node.janning-it.de/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5
```

Jeder Request enthält das Feld `formular_typ: "BaustellenanmeldungBGBAU"` für das Switch-Statement in n8n.

## 📱 Als App installieren

### Android
1. Öffne die Webseite in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle "Zum Startbildschirm hinzufügen"

### iOS
1. Öffne die Webseite in Safari
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Home-Bildschirm"

### Desktop (Chrome/Edge)
1. Klicke auf das ⊕ Symbol in der Adressleiste
2. Oder: Menü → "App installieren"

## 🎨 Design

Das Design basiert auf dem Industrial-Professional Theme mit:
- **Hauptfarben**: Grau (#1a1a18), Orange (#e8610a)
- **Schriftarten**: Barlow & Barlow Condensed
- **Responsive Design** für alle Bildschirmgrößen

## 🔧 Technologien

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Leaflet.js (Karten)
- Service Worker API
- Fetch API
- LocalStorage API

## 📝 Lizenz

© 2025 Janning Group - Alle Rechte vorbehalten

## 🤝 Support

Bei Fragen oder Problemen wenden Sie sich bitte an die IT-Abteilung der Janning Group.

---

**Version**: 1.0.0  
**Erstellt**: Februar 2025
