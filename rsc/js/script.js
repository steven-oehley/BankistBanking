'use strict';

// ------------------------------------------------
//  IMPORTS
// ------------------------------------------------

import { domElements } from './domElements.js';

// ------------------------------------------------
// VARIABLES
// ------------------------------------------------

const bgColDark = '#37383d';

// ------------------------------------------------
// ELEMENT CREATION
// ------------------------------------------------

// ------- create a cookie message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>`;

domElements.headerEl.append(message);
message.style.backgroundColor = bgColDark;
message.style.width = '80%';

// ------------------------------------------------
// FUNCTIONS
// ------------------------------------------------

// ------- modal functions
const openModal = function (e) {
  e.preventDefault();
  domElements.modal.classList.remove('hidden');
  domElements.overlay.classList.remove('hidden');
};

const closeModal = function () {
  domElements.modal.classList.add('hidden');
  domElements.overlay.classList.add('hidden');
};
// ------------------------------------------------
// EVENT LISTENERS
// ------------------------------------------------

// ------- modal eventListeners

// open
domElements.btnsOpenModal.forEach(btnM =>
  btnM.addEventListener('click', openModal)
);

// close click button
domElements.btnCloseModal.addEventListener('click', closeModal);
domElements.overlay.addEventListener('click', closeModal);

// close esc key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !domElements.modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ------- cookie eventListeners
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', () => message.remove()); // not use domElements not on DOM when imported

// ------- learn more (smooth scroll)
domElements.btnScrollTo.addEventListener('click', e => {
  // ! need to add scroll-behaviour property on html element in css
  e.preventDefault();
  // old approach
  const sectionOneCoords = domElements.sectionOne.getBoundingClientRect(); // get co-ordinates for element want to scroll to
  window.scrollTo({
    left: sectionOneCoords.left,
    top: sectionOneCoords.top + window.scrollY, // need to add current scroll to top otherwise wont work
    behavior: 'smooth',
  });

  // modern approach (only works on latest browsers)
  /* domElements.sectionOne.scrollIntoView({ behaviour: 'smooth' }); */
});

// ------- navigation (smooth scroll)

//  ! without delegation (add too many unecessary eventHandlers, impact performance)
// adds second event handler for open account link/button
/* domElements.allNavLinks.forEach(navLink => {
  navLink.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = e.target.getAttribute('href'); // instead of this as no this in arrow
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  });
}); */

// ! event delegation add one event listener to common parent element
domElements.navUlEl.addEventListener('click', e => {
  e.preventDefault();
  // get matching strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn') // exclude the open account nav__link
  ) {
    const targetId = e.target.getAttribute('href');
    console.log(document.querySelector(targetId));
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  }
});
