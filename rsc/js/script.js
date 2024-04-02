'use strict';

//  imports
import { domElements } from './domElements.js';
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

domElements.btnsOpenModal.forEach(btnM =>
  btnM.addEventListener('click', openModal)
);

domElements.btnCloseModal.addEventListener('click', closeModal);
domElements.overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !domElements.modal.classList.contains('hidden')) {
    closeModal();
  }
});
