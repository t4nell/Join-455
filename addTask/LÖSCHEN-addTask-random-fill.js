// Hilfsfunktionen
function getRandomInt(min, max) {
    addContacts();
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// Die Hauptfunktion
function fillRandomForm() {
    // 1. Titel & Beschreibung
    const titles = [
        'Neues Feature implementieren',
        'Bug fixen',
        'Dokumentation schreiben',
        'Kunden-Feedback prüfen',
        'Test-Case erstellen',
    ];
    const descriptions = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Diese Aufgabe dient zur Validierung des Workflows.',
        'Bitte teste alle Randfälle und dokumentiere die Ergebnisse.',
        'Abhängigkeiten prüfen und abschließendes Review organisieren.',
        'Setup einer Demo-Umgebung und Durchlauf eines Beispiel-Workflows.',
    ];
    const title = titles[getRandomInt(0, titles.length - 1)];
    const desc = descriptions[getRandomInt(0, descriptions.length - 1)];
    document.getElementById('title').value = title;
    document.getElementById('description').value = desc;

    // 2. Fälligkeitsdatum: zufällig zwischen morgen und in 30 Tagen
    const today = new Date();
    const offsetDays = getRandomInt(1, 30);
    const dueDate = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    document.getElementById('due_date').value = formatDate(dueDate);

    // 3. Priorität
    const prios = ['urgent', 'medium', 'low'];
    const prio = prios[getRandomInt(0, prios.length - 1)];
    const prioInput = document.querySelector(`input[name="priority"][value="${prio}"]`);
    if (prioInput) {
        prioInput.checked = true;
        // UI-Update
        if (typeof switchBtnPriority === 'function') switchBtnPriority(prio);
    }

    // 4. Assigned to (Checkboxen) anpassen
    // ------------------------------------
    // Wähle zufällig 1–3 Kontakte aus contactsArray aus
    const total = contactsArray.length;
    const k = getRandomInt(1, Math.min(3, total));

    // Hilfsfunktion zum Mischen
    function shuffle(arr) {
        return arr
            .map((v) => ({ v, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ v }) => v);
    }

    // Erzeuge Array [0,1,2,…,total-1] und mixe es
    const allIndices = Array.from({ length: total }, (_, i) => i);
    const selectedIndices = shuffle(allIndices).slice(0, k);

    // 4.1 Alle Checkboxen zurücksetzen
    allIndices.forEach((i) => {
        const cb = document.getElementById(`option_${i}`);
        if (cb) cb.checked = false;
    });

    // 4.2 Ausgewählte Checkboxen setzen & Namen einsammeln
    const names = selectedIndices.map((i) => {
        const contact = contactsArray[i];
        // Checkbox anklicken
        const cb = document.getElementById(`option_${i}`);
        if (cb) cb.checked = true;
        // Name zurückgeben
        return `${contact.name} ${contact.surname}`;
    });

    // 4.3 Toggle-Input updaten (sichtbare Liste)
    if (toggle) toggle.value = names.join(', ');

    // 4.4 Platzhalter-Icons erzeugen
    if (selectedUser) {
        selectedUser.innerHTML = selectedIndices
            .map((i) => {
                const c = contactsArray[i];
                const bgColor = contactsArray[i].color;
                const initials = c.name.charAt(0).toUpperCase() + c.surname.charAt(0).toUpperCase();
                return `
        <div class="placeholder_icon">
    <div class="profile_icon" style="background-color: ${bgColor}">
      <span>${initials}</span>
    </div>
  </div>`;
            })
            .join('');
    }
    // 5. Kategorie
    const catItems = Array.from(document.querySelectorAll('.category_dropdown_item')).map((li) =>
        li.textContent.trim()
    );
    const cat = catItems[getRandomInt(0, catItems.length - 1)];
    const catInput = document.getElementById('category_dropdown_input');
    if (catInput) catInput.value = cat;

    // 6. Subtasks: 1–3 zufällige Unteraufgaben
    const subContainer = document.getElementById('new_tag_container');
    if (subContainer) {
        subContainer.innerHTML = ''; // alte löschen
        const numSubs = getRandomInt(1, 3);
        for (let i = 1; i <= numSubs; i++) {
            // Verwende eure bestehende Template-Funktion
            subContainer.innerHTML += getNewTagTemplate(`Subtask ${i}`);
        }
    }
}

// Event-Listener an den Button hängen
document.getElementById('randomFillBtn').addEventListener('click', fillRandomForm);

