(function (App) {
    'use strict';

    App.symptomSelection = {
        view: view,
        controller: controller
    };

    function view(ctrl) {
        if (ctrl.symptoms.length) {
            return ctrl.symptoms.map(function (symptom) {
                return m('li.item', symptom.value());
            });
        } else {
            return [
                m('li.item.text-center', [
                    m('span.text-muted', '(select symptoms below)')
                ])
            ];
        }
    }

    function controller() {

        this.symptoms = [];

        App.on(App.values.SYMPTOM_SELECTED_EVENT, this.symptomSelected.bind(this));

    }

    function add(symptom) {
        this.symptoms.push(symptom);
    }

    function remove(symptom) {
        var all = this.symptoms,
            clean = [];
        all.forEach(function (existing) {
            if (existing.id() !== symptom.id()) {
                clean.push(existing);
            }
        });
        this.symptoms = clean;
    }

    function symptomSelected(symptom) {
        if (symptom.selected()) {
            this.add(symptom);
        } else {
            this.remove(symptom);
        }
    }

    controller.prototype = {
        add: add,
        remove: remove,
        symptomSelected: symptomSelected
    };

}) (App);
