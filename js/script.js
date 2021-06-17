import tabs from './modules/tabs';
import card from './modules/card';
import form from './modules/form';
import modal from './modules/modal';
import slider from './modules/slider';
import timer from './modules/timer';
import calc from './modules/calc';
import {openModal} from './modules/modal'

window.addEventListener('DOMContentLoaded', () => {
   const timerId = setTimeout(() => openModal('.modal', timerId), 30000);

   tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
   card();
   form('form', timerId);
   modal('[data-modal]', '.modal', timerId);
   slider({
      container: '.offer__slider',
      nextArrow: '.offer__slider-next',
      prevArrow: '.offer__slider-prev',
      totalCounter: '#total',
      slide: '.offer__slide',
      currentCounter: '#current',
      wrapper: '.offer__slider-wrapper', 
      field: '.offer__slider-inner'
   });
   timer('.timer', '2021-04-20');
   calc();
});
