import "./style/costume.scss";
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/collapse';

import { chart } from './lib/chart';
import { editor } from './lib/editor';
import { algorithms } from './algorithms/algorithmsLoader';

import RunWorker from "./run.worker";
const runWorker = new RunWorker();

// ***************************
function sendToWorker(massage) {
    runWorker.postMessage(massage);
    return new Promise(resolve => { sendToWorker.resolve = resolve });
}

runWorker.onmessage = function (response) {
    sendToWorker.resolve(response.data);
}
// ***************************

var mainAlgorithm = 0;
var $algoList = $("#mainAlgorithm");
var $loopCount = $("#inputLoop");
var loopCount = $loopCount.val();

function getCurrentAlgo() {
    return algorithms[mainAlgorithm].main;
}

function appendAlgorithmsToList() {
    var temp = '';
    algorithms.forEach((algo, index) => {
        temp += `<option value="${index}">${algo.name}</option>`
    });
    $algoList.append($(temp));
}