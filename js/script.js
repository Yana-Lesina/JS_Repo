'use strict';

const title = (document.getElementsByTagName('h1'))[0];
const startBtn = document.getElementsByClassName('handler_btn')[0];
const resetBtn = document.getElementsByClassName('handler_btn')[1];
const btnPlus = document.querySelector('.screen-btn');

const otherItemsPers = document.querySelectorAll('.main-controls__views > .percent');
const otherItemsNum = document.querySelectorAll('.main-controls__views > .number');

const typeRange = document.querySelector('.rollback > .main-controls__range > input');
const rangeValue  = document.querySelector('.rollback > .main-controls__range > span');

const ttlScreensPrice = document.getElementsByClassName('total-input')[0];
const ttlScreensAmount = document.getElementsByClassName('total-input')[1];
const ttlOtherServsPrice = document.getElementsByClassName('total-input')[2];
const fullTtlPrice = document.getElementsByClassName('total-input')[3];
const ttlWithRollback = document.getElementsByClassName('total-input')[4];

let screens = document.querySelectorAll('.screen');

const initFunc = function() {
  this.addTitle();

  const starter = this.ifCorrectThenStart.bind(appData);
  startBtn.addEventListener('click', starter);

  const resetter = this.reset.bind(appData);
  resetBtn.addEventListener('click', resetter);

  btnPlus.addEventListener('click', this.addScreenBlock);

  const rlbkInstaller = this.instalRlbkValue.bind(appData);

  typeRange.addEventListener('input', rlbkInstaller);
};

const appData = {
  title: '',
  screens: [],//
  count: 0, //количество экранов всех типов
  screenPrice: 0, //
  adaptive: true,
  rollback: 0, 
  servicePricesPersent: 0,//
  servicePricesNumber: 0,//
  fullPrice: 0,
  servicePercentPrice: 0,
  servicesPersent: {},//
  servicesNumber: {},//
  init: initFunc,


  ifCorrectThenStart: function () {
      screens = document.querySelectorAll('.screen'); //переопределение
      let ifVoid;

      screens.forEach( screen => {
        const select = screen.querySelector('select');
        const input = screen.querySelector('input');
        
        if(select.value === '' || input.value === '') {
          ifVoid = true;
        } else {
          ifVoid = false;
        }

      });

      if(ifVoid === false) {
        startBtn.style.display = 'none';
        resetBtn.style.removeProperty('display');

        this.disableSetter(true);
        this.start();
      } else {
        alert('Данные не введены, расчёты невозможны\nВведите данные и всё будет в порядке!');
      } 
  },

  
  reset:  function() {
    startBtn.style.removeProperty('display');
    resetBtn.style.display = 'none';

    this.disableSetter(false); //
    this.removeRlbkValue(); //
    
    this.removeScreens();
    this.removeScreenBlock();
    this.removeServices();

    this.removePrices();//??
    this.deleteResult();//
  }, 


  disableSetter: function(needDisable) {
    const select = document.querySelectorAll('[name="views-select"]');
    const inputs = document.querySelectorAll('.main-controls__input > input');
    const checkboxes = document.querySelectorAll('.main-controls__checkbox > input ');

    const setArrDisable = (arr, needDisable )=> {
      arr.forEach( elem => {
        elem.disabled = needDisable;
      });
    };

    setArrDisable(select, needDisable);
    btnPlus.disabled = needDisable;
    setArrDisable(inputs, needDisable);
    setArrDisable(checkboxes, needDisable);
    //typeRange.disabled = needDisable;
  },

  instalRlbkValue: function() {
    rangeValue.textContent = typeRange.value + '%';
    this.rollback = typeRange.value;
    ttlWithRollback.value = Math.ceil(this.fullPrice - (this.fullPrice * (this.rollback/100)));//эквивалентно расчёту this.servicePercentPrice в методе addPrices
  },

  removeRlbkValue: function() {
    typeRange.value = 0;
    rangeValue.textContent = '0%';
    this.rollback = 0;
  },

  addTitle: function () {
    document.title = title.textContent;
  },

  start: function() {
    this.addScreens();
    this.addServices();
    this.addPrices();

    this.showResult();

    console.log(appData);
  }, 

  showResult: function() {
    ttlScreensPrice.value = this.screenPrice;
    ttlScreensAmount.value = this.count;
    ttlOtherServsPrice.value = this.servicePricesPersent + this.servicePricesNumber;
    fullTtlPrice.value = this.fullPrice;
    ttlWithRollback.value = this.servicePercentPrice;
  },

  deleteResult: function() {
    ttlScreensPrice.value = 0;
    ttlScreensAmount.value = 0;
    ttlOtherServsPrice.value = 0;
    fullTtlPrice.value = 0;
    ttlWithRollback.value = 0;
  },

  addScreens: function() {
    screens = document.querySelectorAll('.screen'); //переопределение коллекции

    screens.forEach( (screen, index) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');
      const selectName = select.options[select.selectedIndex].textContent;

      this.screens.push({
        id: index, 
        name: selectName, 
        price: +select.value * +input.value,
        amount: +input.value //количество экранов данного типа
      });
    });
  },

  removeScreens: function() {
    screens.forEach( (screen, index) => {
      const select = screen.querySelector('select');
      const input = screen.querySelector('input');

      select.selectedIndex = 0;
      input.value = 0;
    });

    this.screens.splice(0, this.screens.length);
  },

  addServices: function() {
    otherItemsPers.forEach( (item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if(check.checked)
      {
        this.servicesPersent[label.textContent] = +input.value;
      }
    });

    otherItemsNum.forEach( (item) => {
      const check = item.querySelector('input[type=checkbox]');
      const label = item.querySelector('label');
      const input = item.querySelector('input[type=text]');

      if(check.checked)
      {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  removeServices: function() {
    otherItemsPers.forEach( (item) => {
      const check = item.querySelector('input[type=checkbox]');
      if(check.checked) {check.checked = false;}
    });

    otherItemsNum.forEach( (item) => {
      const check = item.querySelector('input[type=checkbox]');
      if(check.checked) {check.checked = false;}
    });

    this.servicesPersent = {};
    this.servicesNumber = {};
  },

  addScreenBlock: function() {
    const cloneScreen = screens[0].cloneNode(true);
    screens[screens.length - 1].after(cloneScreen);
    screens = document.querySelectorAll('.screen'); //переопределение, чтобы новые не добавлялись постоянно после 1-го
  },

  removeScreenBlock: function() {
    if(screens.length > 1) {
      for(let i = 1; i < screens.length; i++) {
        screens[i].remove();
        screens = document.querySelectorAll('.screen'); //переопределение чтобы правильно считалась длина NodeList
      };
    }
  },

  addPrices: function() {
    ////Вар 1 рассчёта стоимости экранов
    // for ( let screen of appData.screens ) {
    //   appData.screenPrice += screen.price
    // }
    
    //Вар 2 рассчёта стоимости экранов
    let initialValue = 0;
    this.screenPrice = this.screens.reduce( (accumulator, key) => {
      return accumulator + key.price;
    }, initialValue);

    for(let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for(let key in this.servicesPersent) {
      this.servicePricesPersent += this.screenPrice * (this.servicesPersent[key]/100);
    }

    //расчёт общего кол-ва экранов всех типов
    for(let key of this.screens) {
      this.count += key.amount;
    }

    this.fullPrice =  this.screenPrice + this.servicePricesPersent + this.servicePricesNumber;
    this.servicePercentPrice = Math.ceil(this.fullPrice - (this.fullPrice * (this.rollback/100)));
  },

  removePrices: function() {
    this.screenPrice = 0;
    this.servicePricesNumber = 0;
    this.servicePricesPersent = 0;
    this.count = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
  },

  logger: function() {
    //console.log(appData);
  }
};


const calc = initFunc.bind(appData);
calc();