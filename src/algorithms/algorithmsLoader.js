

import algo1 from '!!raw-loader!./fibonacci1.js';
import algo2 from '!!raw-loader!./fibonacci2.js';

import algo3 from '!!raw-loader!./primeNumber1.js';
import algo4 from '!!raw-loader!./primeNumber2.js';
import algo5 from '!!raw-loader!./primeNumber3.js';
import algo6 from '!!raw-loader!./power1.js';
import algo7 from '!!raw-loader!./power2.js';

export var algorithms = [
    { name: 'عدد اول عادی', main: algo3, series: undefined, visible: true },
    { name: 'عدد اول فرد', main: algo4, series: undefined, visible: true },
    { name: 'عدد اول رادیکالی', main: algo5, series: undefined, visible: true },
    { name: 'توان عادی', main: algo6, series: undefined, visible: true },
    { name: 'توان بازگشتی', main: algo7, series: undefined, visible: true },
    { name: 'فیبوناتچی مربع کامل', main: algo1, series: undefined, visible: true },
    { name: 'فیبوناتچی حلقه', main: algo2, series: undefined, visible: true }
];


