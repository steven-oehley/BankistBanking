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
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  }
});

domElements.btnToTop.addEventListener('click', () =>
  domElements.headerEl.scrollIntoView({ behavior: 'smooth' })
);
// ------- tabs component

// event delegation - so add event listener to common parent
domElements.tabsContainer.addEventListener('click', e => {
  const clickedTab = e.target.closest('.operations__tab'); // here closest makes sense as could accidentally click on span
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
// ! how intersection observer api works
// allows to track how a target element intersects another element or the viewport
function observerCallback(entries, observer) {
  // takes entries and observer itself as arguments
  // Each entry describes an intersection change for one observed target element
  const [entry] = entries; // take out first entry
  if (!entry.isIntersecting) {
    domElements.navEl.classList.add('sticky');
    domElements.btnToTop.classList.remove('hidden');
  } else {
    domElements.navEl.classList.remove('sticky');
    domElements.btnToTop.classList.add('hidden');
  }
}
const observerOptions = {
  root: null, // what we are checking for if the target element intersects - can be another element or viewport - null (viewport)
  threshold: 0, // percentage of target and root intersecting - when threshold met, callback fires - 0.2 = 20% for example (can specify an array of thresholds)
  rootMargin: `-${
    domElements.navEl.getBoundingClientRect().height
  }px 0px 0px 0px`, //without this there is would be an overlap of nav and section one, positive will add negative will take away
  // only add margin to top
};
const headerObserver = new IntersectionObserver(
  observerCallback,
  observerOptions
); // takes call back and object of options
headerObserver.observe(domElements.headerEl); // tells observer what target element to observe - this case sectionOne

// ------- Reveal elements on scroll
// used with css opacity and transform: translate(8rem)
const sectionObsOptions = { target: null, threshold: 0.25 };
function sectionObsCallback(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.isIntersecting && entry.target.classList.remove('section--hidden');
  observer.unobserve(entry); // unobserve for performance
}
const sectionObserver = new IntersectionObserver(
  sectionObsCallback,
  sectionObsOptions
);
domElements.allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// ------- Lazy Load Images
function loadImages(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = `${entry.target.dataset.src}`;
  // entry.target.classList.remove('lazy-img'); dont do this else you will unblur before load
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
}
const imgObserverOptions = { target: null, threshold: 0, rootMargin: '300px' };
const imgObserver = new IntersectionObserver(loadImages, imgObserverOptions);
domElements.lazyImages.forEach(img => imgObserver.observe(img));

// ------- Slider Component

// Initialize slider variables
let currentSlide = 0;
const maxSlide = domElements.slides.length;

// Function to show a specific slide
function goToSlide(slide) {
  // Loop through all slides
  domElements.slides.forEach((s, index) => {
    // Calculate and set the transform property to display the slide
    s.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
}

// Function to move to the next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % maxSlide; // Update currentSlide index
  goToSlide(currentSlide); // Display the new slide
}

// Function to move to the previous slide
function prevSlide() {
  currentSlide = (currentSlide - 1 + maxSlide) % maxSlide; // Update currentSlide index
  goToSlide(currentSlide); // Display the new slide
}

// Add event listeners to the slider navigation buttons
domElements.btnSliderR.addEventListener('click', nextSlide);
domElements.btnSliderL.addEventListener('click', prevSlide);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// Initially display the first slide
goToSlide(currentSlide);
