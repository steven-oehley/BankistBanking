'use strict';

// ------------------------------------------------
//  IMPORTS
// ------------------------------------------------

import { domElements } from './domElements.js';

// ------------------------------------------------
// VARIABLES
// ------------------------------------------------

const bgColDark = '#37383d';
const initialCoords = domElements.sectionOne.getBoundingClientRect();

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
function openModal(e) {
  e.preventDefault();
  domElements.modal.classList.remove('hidden');
  domElements.overlay.classList.remove('hidden');
}

function closeModal() {
  domElements.modal.classList.add('hidden');
  domElements.overlay.classList.add('hidden');
}

function handleHover(e, opacityToSet) {
  if (e.target.classList.contains('nav__link')) {
    // here can't accidentally click on an element like span so can use .parentElement
    const targetLink = e.target;
    const logo = targetLink.closest('.nav').querySelector('img');
    domElements.allNavLinks.forEach(link => {
      // Check if the link is not the targetLink
      if (link !== targetLink) {
        // Apply the style change to links that are not the targetLink
        link.style.opacity = opacityToSet;
      }
    });

    logo.style.opacity = opacityToSet;
  }
}
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

// ------- tabs component

// event delegation - so add event listener to common parent
domElements.tabsContainer.addEventListener('click', e => {
  const clickedTab = e.target.closest('.operations__tab'); // here closest makes sense as could accidentally click on span
  console.log(clickedTab);
  // guard clause to return early if null
  if (!clickedTab) return;

  // switch classes
  domElements.allTabs.forEach(tab =>
    tab.classList.remove('operations__tab--active')
  );
  clickedTab.classList.add('operations__tab--active');

  // activate content area

  // const targetContent = document.querySelector(
  //   `.operations__content--${clikedTab.dataset.tab}`
  // );  OR
  // get data attribute from dataset or with get attribute
  // get data-tab with get attribute
  const targetContent = clickedTab.getAttribute('data-tab');
  console.log(targetContent);
  domElements.alltabsContent.forEach(
    tc => tc.classList.remove('operations__content--active') // ! no dot needed for adding and removing classes
  );
  document
    .querySelector(`.operations__content--${targetContent}`)
    .classList.add('operations__content--active');
});

// ------- menu fade navigation
//  ! example of passsing arguments to event handlers
// use mouseover as mousenter does not bubble
domElements.navEl.addEventListener('mouseover', e => handleHover(e, '0.5'));
domElements.navEl.addEventListener('mouseout', e => handleHover(e, '1')); // could also use bind

// ------- Sticky navigation

// ! poor performance with scroll event, especially on mobile
/* window.addEventListener('scroll', () => {
  if (window.scrollY > initialCoords.top) {
    domElements.navEl.classList.add('sticky');
  } else {
    domElements.navEl.classList.remove('sticky');
  }
});
 */

// ! better way with Intersection Observer API
const navHeight = domElements.navEl.getBoundingClientRect().height;

function stickyNav(entries, observer) {
  const [entry] = entries; // Destructure the entries array to get the first entry
  if (!entry.isIntersecting) {
    domElements.navEl.classList.add('sticky');
  } else {
    domElements.navEl.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // Use the viewport as the root
  threshold: 0, // Detect intersection when any part of the target is visible
  rootMargin: `-${navHeight}px 0px`, // Apply a top margin of navHeight pixels
});

// Start observing the header
headerObserver.observe(domElements.headerEl);
