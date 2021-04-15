window.addEventListener('DOMContentLoaded', () => {

//Tabs

   const tabs = document.querySelectorAll('.tabheader__item'),
         tabsContent = document.querySelectorAll('.tabcontent'),
         tabsParent = document.querySelector('.tabheader__items');

   function hibeTabContent() {
      tabsContent.forEach(item => {
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });

      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }
   

   function showTabContent(i = 0) {
      tabsContent[i].classList.add('show', 'fade');
      tabsContent[i].classList.remove('hide');
      tabs[i].classList.add('tabheader__item_active');
   }

   hibeTabContent();
   showTabContent();

   tabsParent.addEventListener('click', (event) => {
      const target = event.target;

      if (target && target.classList.contains('tabheader__item')) {
         tabs.forEach((item, i) => {
            if( target == item) {
               hibeTabContent();
               showTabContent(i);
            }
         });
      }

   });

   //Timer

   const deadline = '2021-02-11';

   function getTimeRemaining(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 *60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

      return{
         'total' : t,
         'days' : days,
         'hours' : hours,
         'minutes' : minutes,
         'seconds' : seconds
      };
   }

   function getZero(num) {
      if (num >= 0 && num < 10) {
         return '0' + num;
      } else {
         return num;
      }
   }
   
   function setClock (selector, endtime) {
      const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

      updateClock();

      function updateClock() {
         const t = getTimeRemaining(endtime);

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }
   }
   setClock('.timer', deadline);

   //Modal

   const modalTrigger = document.querySelectorAll('[data-modal]'),
         modal = document.querySelector('.modal');
   
   
   modalTrigger.forEach(btn => {
      btn.addEventListener('click', openModal);
   });     

   function closeModal() {
      modal.classList.add('hide');
      modal.classList.remove('show');
      document.body.style.overflow = '';
   }

   function openModal() {
      modal.classList.add('show');
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
      clearTimeout(timerId);
   };

   modal.addEventListener('click', (e) => {
      if(e.target === modal  || e.target.getAttribute('data-close') == '') {
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {
      if(e.code === 'Escape' && modal.classList.contains('show')) {
         closeModal();
      }
   });

   const timerId = setTimeout(openModal, 300000);

   function showModalByScroll() {
      if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
         openModal();
         window.removeEventListener('scroll', showModalByScroll);
      }
   }

   window.addEventListener('scroll', showModalByScroll);

   // Using class and constructor

   class MenuCard{
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.descr = descr; 
         this.price = price;
         this.parent = document.querySelector(parentSelector);
         this.classes = classes;
         this.transfer = 27;
         this.changeToUAH();
      }

      changeToUAH() {
         this.price = this.price * this.transfer;
      }

      render() {
         const element = document.createElement('div');
         if(this.classes.length === 0) {
            this.element = 'menu__item';
            element.classList.add(this.element);
         } else {
            this.classes.forEach( i => element.classList.add(i))
         }

         element.innerHTML = `
               <img src=${this.src} alt=${this.alt}>
               <h3 class="menu__item-subtitle">${this.title}</h3>
               <div class="menu__item-descr">${this.descr}</div>
               <div class="menu__item-divider"></div>
               <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
               </div>
         `;
         this.parent.append(element);
      }
   }

      const getResource = async (url) => {
         const res = await fetch(url);

         if(!res.ok) {
            throw new Error (`Could not fetch ${url}, status: ${res.status}`)
         }
         return await res.json()
      } 

      getResource('http://localhost:3000/menu')
            .then( data => {
               data.forEach(({img, altimg, title, descr, price}) => {
                  new MenuCard (img, altimg, title, descr, price, '.menu .container').render();
                  
               });
            });

    //Form 

    const form = document.querySelectorAll('form');

   const message = {
      loading: 'icons/spinner.svg',
      success: 'Спасибо! скоро мы вам позвоним!',
      failure: 'Что-то пошло не так...'
   };

   form.forEach(item => {
      bindpostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: "POST",
         headers: {
            'Content-type' : 'application/json'
         },
         body: data
      });
      return await res.json();
   };

    function bindpostData(form){
       form.addEventListener('submit', (e) => {
          e.preventDefault();

          let statusMessage = document.createElement('img');
          statusMessage.src = message.loading;
          statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
          `;

         form.insertAdjacentElement('afterend', statusMessage);
         
         const formData = new FormData(form);

         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         postData('http://localhost:3000/requests', json)
         .then(data => {
            console.log(data);
            showThanksModal(message.success);
            statusMessage.remove();
         }).catch(() => {
            showThanksModal(message.failure);
         }).finally(() => {
            form.reset();
         })
       });
    }

    function showThanksModal (message){
       const prevModalDialog = document.querySelector('.modal__dialog');

       prevModalDialog.classList.add('hide');
       openModal();
       
       const thanksModal = document.createElement('div');
       thanksModal.classList.add('modal__dialog');
       thanksModal.innerHTML = `
         <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
         </div>
       `;

       document.querySelector('.modal').append(thanksModal);
       
       setTimeout(() => {
         thanksModal.remove();
       prevModalDialog.classList.add('show');
       prevModalDialog.classList.remove('hide');
       closeModal();
       }, 4000);
    }

    //Slider

    let slideIndex = 1;
    let offset = 0;

    const  slides = document.querySelectorAll('.offer__slide'),
            prev = document.querySelector('.offer__slider-prev'),
            next = document.querySelector('.offer__slider-next'),
            total = document.querySelector('#total'),
            current = document.querySelector('#current'),
            sliderWrapper = document.querySelector('.offer__slider-wrapper'),
            sliderField = document.querySelector('.offer__slider-inner'),
            width = window.getComputedStyle(sliderWrapper).width;

   if(slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
   } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
   }

    sliderField.style.width = 100 * slides.length + '%';

    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
       slide.style.width = width;
    });

    next.addEventListener('click', () => {
      if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
          offset = 0;
      } else {
          offset += +width.slice(0, width.length - 2); 
      };

      sliderField.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == slides.length){
         slideIndex = 1;
      } else {
         slideIndex++;
      }

      if(slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   });

   prev.addEventListener('click', () => {
      if (offset == 0) {
          offset = (+width.slice(0, width.length - 2) * (slides.length - 1));
      } else {
          offset -= +width.slice(0, width.length - 2); 
      };

      sliderField.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == 1){
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      if(slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   });

   //Calculater

   const result = document.querySelector('.calculating__result span');
   let sex, height, weight, age, ratio;

   if(localStorage.getItem('sex')) {
      sex = localStorage.getItem('sex');
   } else {
      sex = 'female';
      sex = localStorage.setItem('sex', 'female')
   }

   if(localStorage.getItem('ratio')) {
      ratio = localStorage.getItem('ratio');
   } else {
      ratio = 1.375;
      ratio = localStorage.setItem('ratio', 1.375)
   }

   function initLocalStorage(selector, activeClass) {
      const el = document.querySelectorAll(selector);

      el.forEach(i => {
         i.classList.remove(activeClass);
         if(i.getAttribute('id') === localStorage.getItem('sex')) {
            i.classList.add(activeClass)
         }
         if(i.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
            i.classList.add(activeClass)
         }
      })
   }

   initLocalStorage('#gender div', 'calculating__choose-item_active');
   initLocalStorage('.calculating__choose_big div', 'calculating__choose-item_active');

   function calcTotal(){
      if(!sex || !height || !weight || !age || !ratio) {
         result.textContent = '______';
         return
      }
      if(sex === 'female') {
         result.textContent = Math.round((444.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)
      } else {
         result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio)
      }
   }

   function getStaticInformation(selector, activeClass) {
      const elem = document.querySelectorAll(selector);

      elem.forEach(i => {
         i.addEventListener('click', (e) => {
            if(e.target.getAttribute('data-ratio')) {
               ratio = e.target.getAttribute('data-ratio');
               localStorage.setItem('ratio', e.target.getAttribute('data-ratio'))
            } else {
               sex = e.target.getAttribute('id');
               localStorage.setItem('sex', e.target.getAttribute('id'))
            }
            
            elem.forEach(i => {
               i.classList.remove(activeClass)
            });
   
            e.target.classList.add(activeClass);
   
            calcTotal();

         })
      
      });
   }

   getStaticInformation('#gender div', 'calculating__choose-item_active');
   getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

   function getDynamicInformation(selector) {
      const input = document.querySelector(selector);

      input.addEventListener('input', () => {
         if(input.value.match(/\D/g)) {
            input.style.border = '1px solid red';
         } else {
            input.style.border = 'none';
         }

         switch(input.getAttribute('id')){
            case 'height':
               height = +input.value;
               break;
            case 'weight':
               weight = +input.value;
               break;
            case 'age':
               age = +input.value;
               break;
         }
         calcTotal();
      });
      
   }

   getDynamicInformation('#height');
   getDynamicInformation('#weight');
   getDynamicInformation('#age');
});
