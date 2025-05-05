const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");
const contactsArray = [];

function contactInit() {
    loadContactData("")
    renderSidebar();
    renderContactList();
}

//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern

async function loadContactData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    const contactsRef = responseToJson.contact;
    contactsArray.push(contactsRef);
    console.log(responseToJson);
}

    console.log(contactsArray);

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

async function renderContactList() {
    await loadContactData();
    console.log(contactsArray);
    
    const contactListContainer = document.getElementById("contact_list_container");
    const allContacts = contactsArray[0].id.map((contact, index) => `
    <div class="contact_list_item" id="contact_${index}">
    <div class="contact_small_img">
            <img src="../assets/imgs/contactIcons/profile_badge.svg" alt="" />
          </div>
          <div class="contact_side_info">
            <div class="contact_side_name">
              <span>${contact.name}</span>
            </div>
            <div class="contact_side_mail">
              <span>antom@gmail.com</span>
            </div>
          </div></div>`).join("");
    contactListContainer.innerHTML = allContacts;
}

function toggleOverlayNewContact(){
    popup.classList.toggle("closed");
    overlay.classList.toggle("fade_out");
}

function toggleOverlay(){
    overlay.classList.add("fade_out");
    newContactPopup.classList.add("closed");
    editContactPopup.classList.add("closed");
}

function eventBubbling(event){
    event.stopPropagation();
}

function newContactOverlay(){
    overlay.classList.remove("fade_out");
    newContactPopup.classList.remove("closed");
}

function editContactOverlay(){
    overlay.classList.remove("fade_out");
    editContactPopup.classList.remove("closed");
}

