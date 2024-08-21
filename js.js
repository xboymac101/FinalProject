document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('popup');
  const infoPopup = document.getElementById('infoPopup');
  const contactForm = document.getElementById('contactForm');
  const contactList = document.getElementById('contactList');
  const searchInput = document.getElementById('searchInput');

  let contacts = [
    {
      name: 'Nour Ammar',
      phone: '+972 54-768-9443',
      address: 'Dizengoff St 50, Tel Aviv-Yafo, 6433201',
      email: 'nour.ammar@gmail.com',
      notes: 'Friend from university',
      img: 'https://randomuser.me/api/portraits/men/75.jpg',
      nickname: 'Nouri'
    },
    {
      name: 'Sara Cohen',
      phone: '+972 52-556-6677',
      address: 'Ben Yehuda St 78, Tel Aviv-Yafo, 6347711',
      email: 'sara.cohen@gmail.com',
      notes: 'Colleague from work',
      img: 'https://randomuser.me/api/portraits/women/82.jpg',
      nickname: 'Sari'
    },
    {
      name: 'Yousef Halabi',
      phone: '+972 50-321-4321',
      address: 'Jabotinsky St 15, Ramat Gan, 5244211',
      email: 'yousef.halabi@gmail.com',
      notes: 'Gym buddy',
      img: 'https://randomuser.me/api/portraits/men/41.jpg',
      nickname: 'Yosi'
    },
    {
      name: 'Amira Barak',
      phone: '+972 54-789-6543',
      address: 'Herzl St 7, Rishon LeZion, 7535901',
      email: 'amira.barak@gmail.com',
      notes: 'Neighbor',
      img: 'https://randomuser.me/api/portraits/women/22.jpg',
      nickname: 'Mira'
    }
  ];
  function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  function renderContacts() {
    sortContacts();
    contactList.innerHTML = '';
    contacts
      .filter(contact => contact.name.toLowerCase().includes(searchInput.value.toLowerCase()))
      .forEach((contact, index) => {
        const contactItem = document.createElement('li');
        contactItem.className = 'contact-item';

        contactItem.innerHTML = `
                    <img src="${contact.img}" alt="${contact.name}" class="contact-image">
                    <span><strong>${contact.name}</strong></span>
                    <span>${contact.phone}</span>
                    <div class="buttons">
                        <button class="info-btn" data-index="${index}">ℹ️</button>
                        <button class="edit-btn" data-index="${index}">✏️</button>
                        <button class="delete-btn" data-index="${index}">🗑️</button>
                    </div>
                `;

        contactItem.addEventListener('mouseover', function () {
          contactItem.classList.add('hovered');
        });

        contactItem.addEventListener('mouseout', function () {
          contactItem.classList.remove('hovered');
        });

        contactList.appendChild(contactItem);
      });

    document.querySelectorAll('.info-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const index = this.getAttribute('data-index');
        showInfo(index);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const index = this.getAttribute('data-index');
        openPopup(index);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteIndex = this.getAttribute('data-index');
        confirmDeletePopup.style.display = 'flex';
      });
    });
  }

  function showInfo(index) {
    const contact = contacts[index];
    const infoContent = `
            <img src="${contact.img}" alt="${contact.name}" class="contact-image"><br>
            <strong>Name:</strong> ${contact.name}<br>
            <strong>Nickname:</strong> ${contact.nickname}<br>
            <strong>Phone:</strong> ${contact.phone}<br>
            <strong>Address:</strong> ${contact.address}<br>
            <strong>Email:</strong> ${contact.email}<br>
            <strong>Notes:</strong> ${contact.notes}
        `;
    document.getElementById('infoContent').innerHTML = infoContent;
    infoPopup.style.display = 'flex';
  }

  function isPhoneNumberValid(phone) {
    const phoneRegex = /^\+972\s\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  function isNameDuplicate(name) {
    return contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());
  }

  function openPopup(index = "") {
    document.getElementById('contactIndex').value = index;
    document.getElementById('popupTitle').textContent = index === "" ? "Create Contact" : "Edit Contact";
    document.getElementById('name').value = index === "" ? "" : contacts[index].name;
    document.getElementById('phone').value = index === "" ? "+972 " : contacts[index].phone;
    document.getElementById('address').value = index === "" ? "" : contacts[index].address;
    document.getElementById('email').value = index === "" ? "" : contacts[index].email;
    document.getElementById('notes').value = index === "" ? "" : contacts[index].notes;
    document.getElementById('nickname').value = index === "" ? "" : contacts[index].nickname;
    popup.style.display = 'flex';
  }

  function closePopup() {
    popup.style.display = 'none';
  }

  function getRandomUserImage(callback) {
    fetch('https://randomuser.me/api/')
      .then(response => response.json())
      .then(data => {
        const img = data.results[0].picture.medium;
        callback(img);
      })
      .catch(error => {
        console.error('Error fetching random user image:', error);
        callback('https://randomuser.me/api/portraits/lego/0.jpg');
      });
  }

  function addContact(contact) {
    contacts.push(contact);
    renderContacts();
  }

  function updateContact(index, contact) {
    contacts[index] = contact;
    renderContacts();
  }

  function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
  }

  function deleteContacts() {
    contacts = [];
    renderContacts();
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const index = document.getElementById('contactIndex').value;
    const name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const notes = document.getElementById('notes').value;
    const nickname = document.getElementById('nickname').value;

    if (!isPhoneNumberValid(phone)) {
      alert("Please enter a valid phone number (must be in the format +972 XX-XXX-XXXX).");
      return;
    }

    if (isNameDuplicate(name)) {
      alert("This name already exists. Please choose a different name.");
      return;
    }

    getRandomUserImage(function (img) {
      const contact = { name, phone, address, email, notes, img, nickname };

      if (index === "") {
        addContact(contact);
      } else {
        updateContact(index, contact);
      }
      closePopup();
    });
  });

  document.getElementById('openPopup').addEventListener('click', () => {
    openPopup();
  });

  document.getElementById('closePopup').addEventListener('click', closePopup);
  document.getElementById('closeInfoPopup').addEventListener('click', () => infoPopup.style.display = 'none');

  document.getElementById('confirmDelete').addEventListener('click', () => {
    deleteContact(deleteIndex);
    confirmDeletePopup.style.display = 'none';
  });

  document.getElementById('cancelDelete').addEventListener('click', () => {
    confirmDeletePopup.style.display = 'none';
  });

  document.getElementById('confirmDeleteAll').addEventListener('click', () => {
    deleteContacts();
    confirmDeleteAllPopup.style.display = 'none';
  });

  document.getElementById('cancelDeleteAll').addEventListener('click', () => {
    confirmDeleteAllPopup.style.display = 'none';
  });

  document.getElementById('deleteAllContacts').addEventListener('click', () => {
    confirmDeleteAllPopup.style.display = 'flex';
  });

  searchInput.addEventListener('input', renderContacts);

  renderContacts(); 
});
