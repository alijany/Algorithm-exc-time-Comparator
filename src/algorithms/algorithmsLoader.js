

import algo1 from '!!raw-loader!./fibonacci1.js';
import algo2 from '!!raw-loader!./fibonacci2.js';
import algo3 from '!!raw-loader!./primeNumber1.js';
import algo4 from '!!raw-loader!./primeNumber2.js';
import algo5 from '!!raw-loader!./primeNumber3.js';
import algo6 from '!!raw-loader!./power1.js';
import algo7 from '!!raw-loader!./power2.js';
import algo8 from '!!raw-loader!./nQueen.js';
import algo9 from '!!raw-loader!./hanoi.js';

var algorithms_assignment1 = [
    { name: 'فیبوناتچی مربع کامل', main: algo1, series: undefined, visible: true },
    { name: 'فیبوناتچی حلقه', main: algo2, series: undefined, visible: true },
    { name: 'عدد اول عادی', main: algo3, series: undefined, visible: true },
    { name: 'عدد اول فرد', main: algo4, series: undefined, visible: true },
    { name: 'عدد اول رادیکالی', main: algo5, series: undefined, visible: true },
    { name: 'توان عادی', main: algo6, series: undefined, visible: true },
    { name: 'توان بازگشتی', main: algo7, series: undefined, visible: true }
];


var algorithms_assignment2 = [
    { name: 'nQueen', main: algo8, series: undefined, visible: true }
];

var algorithms_assignment3 = [
    { name: 'hanoi', main: algo9, series: undefined, visible: true }
];

export var algorithms = [algorithms_assignment1, algorithms_assignment2, algorithms_assignment3];
