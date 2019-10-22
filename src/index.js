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