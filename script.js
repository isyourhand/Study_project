'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const slcoords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation

// 1. Add event listener to common parent element.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // 2. Determine what element originated the event.

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabs[0].parentElement.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = opacity;
  }
};

//////////////////////////////////////////////////////////////////
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////////////////
// Sticky navigation

// old way
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// new way
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  if (entry.isIntersecting) nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide >= maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide <= 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();

  // Event handlers
  btnLeft.addEventListener('click', prevSlide);

  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log(typeof e.target.dataset);
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
      curSlide = slide;
    }
  });
};
slider();

/////////////////////////////////////////////////////////////////////////

// Dom content loaded Event
// this event is fired by the document as soon as the HTML is completely parsed.
// which means that the HTML has been downloaded and be converted to the DOM tree.
// Also, all scripts must be downloaded and executed before the DOM content loaded event can happen.

document.addEventListener('DOMContentLoaded', function (e) {
  // This event Just HTML and JavaScript need to be loaded.
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded.', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

//////////////////////////////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// // going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white'; // 设置h1.children中第一个元素的style
// h1.lastElementChild.style.color = 'black'; // 设置h1.children中最后一个元素的style

// // going upwards: parents
// console.log(h1.parentNode); // 参考上面
// console.log(h1.parentElement); // 参考上面

// h1.closest('.header').style.background = 'var(--gradient-secondary)'; // 获取最近的类名为'.header'的html元素。

// h1.closest('h1').style.background = 'var(--gradient-primary)'; // 获取自己。

// // Going sideways: siblings
// console.log(h1.previousElementSibling); // 获取前一个兄弟元素
// console.log(h1.nextElementSibling); // 获取后一个兄弟元素

// console.log(h1.previousSibling); // 获取前一个兄弟node
// console.log(h1.nextSibling); // 获取后一个兄弟node

// console.log(h1.parentElement.children); // 获取全部兄弟元素
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// // rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
//   console.log(e.currentTarget);

//   // Stop propagation
// });

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   //e.stopPropagation();
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(e.currentTarget);
//   },
//   true
// );

// const h1 = document.querySelector('h1', function (e) {});

// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListrner: Great! You are reading the heading :D');

//   h1.removeEventListener('mouseenter');
// }); // 允许为一个元素的特定事件注册多个监听器。

// // old way
// h1.onmouseleave = function (e) {
//   alert('addEventListrner: Great! You are reading the heading :D');
// }; // 只能为一个元素的特定事件指定一个处理函数。

// h1.onclick = function (e) {
//   alert('addEventListrner: Great! You are reading the heading :D');
// };

/////////////////////////////////////////////////////////////////////

// console.log(document.documentElement); // 获取整个HTML
// console.log(document.head); // 获取html中的head部分
// console.log(document.body); // 获取html中的bbody部分

// console.log(document.querySelector('.header')); // 选择第一个查询到的class名为header的元素。返回静态。
// console.log(document.querySelectorAll('.section')); // 可以在document和元素节点上调用,获取指定范围内的元素。选择所有查询到的class名为section的元素，返回一个静态的 NodeList 对象。

// console.log(document.getElementById('section--1')); // 与querySelector('#section--1')是一样，但是更直观。返回静态。
// console.log(document.getElementsByTagName('button')); // 只能在document对象上调用,获取整个文档的元素。返回一个动态的 HTMLCollection 对象。

// console.log(document.getElementsByClassName('btn', 'header')); // 可以传入多个 class,返回匹配任一 class 的元素。返回一个动态的 HTMLCollection 对象。可以在某个节点上调用,搜索该节点的后代元素。

// // Creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</buttn>';

// document.querySelector('.header').prepend(message); // 在匹配元素的内部开始位置插入新元素。
// document.querySelector('.header').append(message); // 再插入一次会覆盖之前的操作，可以得出结论，该方法是动态的。还有，DOM元素是唯一的，所以只能移动已经插入的元素。
// document.querySelector('.header').append(message.cloneNode(true)); // 当然DOM为我们提供了复制的方法。

// document.querySelector('.header').after(message); // 在匹配元素的后面插入新元素，不是内部，不改变原元素。
// document.querySelector('.header').before(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     message.parentElement.removeChild(message); // 旧的删除方法。
//   });

// // Styles
// message.style.backgroundColor = '#37383d'; // 在元素上设置style
// message.style.width = '120%';

// console.log(getComputedStyle(message).height); // 如果没有在元素上设置height，message.style.height的结果是undefined。但getComputedStyle() 可以获取这些attributes，无论是设置过的还是没设置过的。

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 5 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered'); // 这个设置了Css里的properties
// const htmlElement = document.querySelector('.section');
// htmlElement.style.setProperty('background-Color', 'blue');

// // Attriutes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // 有些attribute可以直接获取。
// console.log(logo.className); // 注意获取class时要输入class而不是className

// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer); // 这种自定义的attribut只能通过getAttribute获取
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist'); // 设置一个Attribute

// // 获取连接时不同方法的一些区别
// console.log(logo.src); // 会得到绝对连接，比如http://127.0.0.1:8080/starter/img/logo.png
// console.log(logo.getAttribute('src')); // 会得到相对连接，如img/logo.png

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('1', '2');
// logo.classList.remove('1', '2');
// logo.classList.toggle('1');
// logo.classList.contains('2');

// // Don't use, will override all the existing classes, and also it allows us to only put one class.
// logo.className = 'lyx';
// console.log(logo.className);
