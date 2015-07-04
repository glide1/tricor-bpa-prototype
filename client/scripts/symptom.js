(function (App) {
    'use strict';

    var count = 0;

    App.Symptom = function (symptom) {

        var id = ++count;
        this.value = m.prop(symptom);
        this.selected = m.prop(false);

        this.id = function () {
            return id;
        }

    };

}) (App);
