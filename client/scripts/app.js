(function (App) {
    'use strict';

    m.mount(q('.symptom-selection .list'), App.symptomSelection);

    m.mount(q('.symptom-chooser'), App.symptomList);

    m.mount(q('.drug-list .list'), App.drugList);

    m.mount(q('.details-panel .panel-body'), App.detailsPanel);

    function q(selector) {
        return document.querySelector(selector);
    }

}) (App);
