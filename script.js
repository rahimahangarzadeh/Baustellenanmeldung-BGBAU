// ============================================================
// JANNING GROUP - Baustellenanmeldung BG BAU
// ============================================================

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => console.log('ServiceWorker registriert:', registration))
      .catch(err => console.log('ServiceWorker Fehler:', err));
  });
}

// ============================================================
// VORLAGEN-DATEN
// ============================================================

const templates = {
  magazin: {
    arbeitgeber: 'Janning Group',
    projektname: 'Magazin & Werkstatt',
    mitarbeiterAnzahl: '2',
    nachunternehmer: 'Nein',
    personenaufnahmemittel: 'Ja',
    kontaminierteBereiche: 'Nein',
    asbest: 'Nein'
  },
  rohrbau: {
    arbeitgeber: 'Janning Rohrbau GmbH',
    projektname: 'Rohrbauarbeiten',
    mitarbeiterAnzahl: '4',
    nachunternehmer: 'Nein',
    personenaufnahmemittel: 'Nein',
    kontaminierteBereiche: 'Ja',
    asbest: 'Nein'
  },
  tiefbau: {
    arbeitgeber: 'Janning Tiefbau GmbH',
    projektname: 'Tiefbauarbeiten',
    mitarbeiterAnzahl: '6',
    nachunternehmer: 'Ja',
    personenaufnahmemittel: 'Ja',
    kontaminierteBereiche: 'Ja',
    asbest: 'Nein'
  },
  horizontalbohrung: {
    arbeitgeber: 'Janning Bohrtechnik GmbH',
    projektname: 'Horizontalbohrung',
    mitarbeiterAnzahl: '3',
    nachunternehmer: 'Nein',
    personenaufnahmemittel: 'Nein',
    kontaminierteBereiche: 'Nein',
    asbest: 'Nein'
  },
  fernwaerme: {
    arbeitgeber: 'Janning Rohrbau GmbH',
    projektname: 'Fernwärmeleitungen',
    mitarbeiterAnzahl: '5',
    nachunternehmer: 'Ja',
    personenaufnahmemittel: 'Nein',
    kontaminierteBereiche: 'Ja',
    asbest: 'Nein'
  },
  glasfaser: {
    arbeitgeber: 'Janning Tiefbau GmbH',
    projektname: 'Glasfaserverlegung',
    mitarbeiterAnzahl: '4',
    nachunternehmer: 'Nein',
    personenaufnahmemittel: 'Nein',
    kontaminierteBereiche: 'Nein',
    asbest: 'Nein'
  }
};

// ============================================================
// INITIALISIERUNG
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeForm();
  initializeTemplates();
  initializeMap();
  initializeFormSubmit();
});

function initializeForm() {
  // Aktuelles Datum und Zeit setzen
  const now = new Date();
  const dateTimeString = now.toISOString().slice(0, 16);
  document.getElementById('datum').value = dateTimeString;
  
  // Nachunternehmer Radio-Button Event
  const nachunternehmerRadios = document.querySelectorAll('input[name="nachunternehmer"]');
  nachunternehmerRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const subGroup = document.getElementById('subGroup');
      if (e.target.value === 'Ja') {
        subGroup.classList.remove('hidden');
      } else {
        subGroup.classList.add('hidden');
        document.getElementById('nameSub').value = '';
        document.getElementById('mitarbeiterSub').value = '';
      }
    });
  });
}

// ============================================================
// VORLAGEN
// ============================================================

function initializeTemplates() {
  const templateButtons = document.querySelectorAll('.template-btn');
  
  templateButtons.forEach(button => {
    button.addEventListener('click', () => {
      const templateType = button.dataset.template;
      applyTemplate(templateType);
      
      // Visuelles Feedback
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  });
}

function applyTemplate(templateType) {
  const template = templates[templateType];
  if (!template) return;
  
  // Formularfelder ausfüllen
  Object.keys(template).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'radio') {
        const radio = document.querySelector(`input[name="${key}"][value="${template[key]}"]`);
        if (radio) radio.checked = true;
        
        // Nachunternehmer-Logik triggern
        if (key === 'nachunternehmer') {
          radio.dispatchEvent(new Event('change'));
        }
      } else {
        element.value = template[key];
      }
    }
  });
}

// ============================================================
// KARTEN-FUNKTIONALITÄT
// ============================================================

let map = null;
let marker = null;
let selectedLocation = null;

function initializeMap() {
  const openMapBtn = document.getElementById('openMapBtn');
  const closeMapBtn = document.getElementById('closeMapBtn');
  const mapModal = document.getElementById('mapModal');
  const searchBtn = document.getElementById('searchBtn');
  const confirmBtn = document.getElementById('confirmLocationBtn');
  
  openMapBtn.addEventListener('click', () => {
    mapModal.classList.remove('hidden');
    if (!map) {
      createMap();
    }
  });
  
  closeMapBtn.addEventListener('click', () => {
    mapModal.classList.add('hidden');
  });
  
  // Modal schließen bei Klick außerhalb
  mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) {
      mapModal.classList.add('hidden');
    }
  });
  
  searchBtn.addEventListener('click', searchAddress);
  
  // Enter-Taste im Suchfeld
  document.getElementById('mapSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchAddress();
    }
  });
  
  confirmBtn.addEventListener('click', confirmLocation);
}

function createMap() {
  // Karte initialisieren (Deutschland Zentrum)
  map = L.map('leafletMap').setView([51.1657, 10.4515], 6);
  
  // OpenStreetMap Tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Klick auf Karte
  map.on('click', (e) => {
    setMarker(e.latlng);
    reverseGeocode(e.latlng);
  });
  
  // Karte nach kurzer Verzögerung neu rendern
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}

function setMarker(latlng) {
  if (marker) {
    marker.setLatLng(latlng);
  } else {
    marker = L.marker(latlng).addTo(map);
  }
  
  selectedLocation = {
    lat: latlng.lat,
    lng: latlng.lng,
    address: ''
  };
}

async function searchAddress() {
  const searchInput = document.getElementById('mapSearch');
  const query = searchInput.value.trim();
  
  if (!query) return;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const latlng = L.latLng(result.lat, result.lon);
      
      map.setView(latlng, 15);
      setMarker(latlng);
      
      selectedLocation.address = result.display_name;
      updateSelectedAddress(result.display_name);
    } else {
      alert('Adresse nicht gefunden. Bitte versuchen Sie es erneut.');
    }
  } catch (error) {
    console.error('Fehler bei der Adresssuche:', error);
    alert('Fehler bei der Adresssuche. Bitte versuchen Sie es erneut.');
  }
}

async function reverseGeocode(latlng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      selectedLocation.address = data.display_name;
      updateSelectedAddress(data.display_name);
    }
  } catch (error) {
    console.error('Fehler beim Reverse Geocoding:', error);
  }
}

function updateSelectedAddress(address) {
  const selectedAddrEl = document.getElementById('selectedAddr');
  selectedAddrEl.textContent = address;
  selectedAddrEl.classList.add('has-addr');
}

function confirmLocation() {
  if (!selectedLocation || !selectedLocation.address) {
    alert('Bitte wählen Sie zuerst einen Standort auf der Karte aus.');
    return;
  }
  
  // Daten in Formular übertragen
  document.getElementById('baustelle').value = selectedLocation.address;
  document.getElementById('baustelleLat').value = selectedLocation.lat;
  document.getElementById('baustelleLng').value = selectedLocation.lng;
  
  // Modal schließen
  document.getElementById('mapModal').classList.add('hidden');
}

// ============================================================
// FORMULAR-ABSENDEN
// ============================================================

function initializeFormSubmit() {
  const form = document.getElementById('baustellenForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validierung
    if (!validateForm()) {
      return;
    }
    
    // Formulardaten sammeln
    const formData = collectFormData();
    
    // Absenden
    await submitForm(formData);
  });
}

function validateForm() {
  // Alle Pflichtfelder prüfen
  const requiredFields = document.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (field.type === 'checkbox') {
      // Mindestens eine Checkbox in Gruppe muss gewählt sein
      const checkboxes = document.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(checkboxes).some(cb => cb.checked);
      if (!checked) {
        isValid = false;
        showFieldError(field, 'Bitte wählen Sie mindestens eine Option');
      }
    } else if (!field.value.trim()) {
      isValid = false;
      showFieldError(field, 'Dieses Feld ist erforderlich');
    } else {
      clearFieldError(field);
    }
  });
  
  if (!isValid) {
    showFormMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
  }
  
  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('invalid');
  
  // Entferne alte Fehlermeldung
  const existingError = field.parentElement.querySelector('.invalid-msg');
  if (existingError) {
    existingError.remove();
  }
  
  // Füge neue Fehlermeldung hinzu
  const errorMsg = document.createElement('div');
  errorMsg.className = 'invalid-msg';
  errorMsg.textContent = message;
  field.parentElement.appendChild(errorMsg);
}

function clearFieldError(field) {
  field.classList.remove('invalid');
  const errorMsg = field.parentElement.querySelector('.invalid-msg');
  if (errorMsg) {
    errorMsg.remove();
  }
}

function collectFormData() {
  const form = document.getElementById('baustellenForm');
  const formData = {
    formular_typ: 'BaustellenanmeldungBGBAU',
    datum: document.getElementById('datum').value,
    email: document.getElementById('email').value,
    arbeitsverantwortlicher: document.getElementById('arbeitsverantwortlicher').value,
    firma: [],
    baustelle: document.getElementById('baustelle').value,
    baustelleLat: document.getElementById('baustelleLat').value || '',
    baustelleLng: document.getElementById('baustelleLng').value || '',
    arbeitgeber: document.getElementById('arbeitgeber').value,
    auftragsnummer: document.getElementById('auftragsnummer').value || '',
    projektname: document.getElementById('projektname').value || '',
    mitarbeiterAnzahl: document.getElementById('mitarbeiterAnzahl').value,
    nachunternehmer: document.querySelector('input[name="nachunternehmer"]:checked').value,
    nameSub: document.getElementById('nameSub').value || '',
    mitarbeiterSub: document.getElementById('mitarbeiterSub').value || '',
    datumBeginn: document.getElementById('datumBeginn').value,
    datumEnde: document.getElementById('datumEnde').value,
    personenaufnahmemittel: document.querySelector('input[name="personenaufnahmemittel"]:checked').value,
    kontaminierteBereiche: document.querySelector('input[name="kontaminierteBereiche"]:checked').value,
    asbest: document.querySelector('input[name="asbest"]:checked').value
  };
  
  // Firma (Mehrfachauswahl)
  const firmaCheckboxes = document.querySelectorAll('input[name="firma"]:checked');
  firmaCheckboxes.forEach(cb => {
    formData.firma.push(cb.value);
  });
  
  return formData;
}

async function submitForm(formData) {
  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.innerHTML;
  
  // Button deaktivieren und Spinner anzeigen
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Wird gesendet...';
  
  try {
    const response = await fetch('https://n8n.node.janning-it.de/webhook/368921c2-1f7c-4c9c-911e-713601dd76d5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      showFormMessage('Formular erfolgreich übermittelt!', 'success');
      
      // Formular nach 2 Sekunden zurücksetzen
      setTimeout(() => {
        document.getElementById('baustellenForm').reset();
        initializeForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    } else {
      throw new Error('Server-Fehler');
    }
  } catch (error) {
    console.error('Fehler beim Absenden:', error);
    showFormMessage('Fehler beim Absenden des Formulars. Bitte versuchen Sie es erneut.', 'error');
  } finally {
    // Button wieder aktivieren
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function showFormMessage(message, type) {
  const messageEl = document.getElementById('formMessage');
  messageEl.textContent = message;
  messageEl.className = `form-message ${type}`;
  messageEl.classList.remove('hidden');
  
  // Nach 5 Sekunden ausblenden
  setTimeout(() => {
    messageEl.classList.add('hidden');
  }, 5000);
}

// ============================================================
// AUTO-HIDE HEADER ON SCROLL
// ============================================================
let lastScrollTop = 0;
let scrollThreshold = 100; // Erst nach 100px scrollen reagieren
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Nur reagieren wenn genug gescrollt wurde
  if (Math.abs(scrollTop - lastScrollTop) < 5) return;
  
  if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
    // Runterscrollen - Header verstecken
    header.classList.add('header-hidden');
  } else {
    // Hochscrollen - Header zeigen
    header.classList.remove('header-hidden');
  }
  
  lastScrollTop = scrollTop;
});
