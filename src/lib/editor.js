import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
// import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint';

import 'codemirror/addon/display/panel.js';

import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/javascript-lint.js'

import { JSHINT } from 'jshint';
window.JSHINT = JSHINT;

export var editor = CodeMirror($("#code")[0], {
    value: "",
    mode: "javascript",
    theme: "material",
    lineNumbers: true,
    lineWrapping: true,
    lint: true,
    gutters: ['CodeMirror-lint-markers'],
    extraKeys: { "Ctrl-Space": "autocomplete" }
});

editor.setSize("auto", "100%");

