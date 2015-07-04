(function (App) {
    'use strict';

    App.symptomSelection = {
        view: view,
        controller: controller
    };

    function view(ctrl) {
        if (ctrl.symptoms.length) {
            return ctrl.symptoms.map(function (symptom) {
                return m('li.item.item-button-right', [
                    symptom.value(),
                    m('buttom.button', {
                        onclick: function () {
                            ctrl.removeSymptom(symptom);
                        }
                    }, m('i.icon.ion-ios-trash'))
                ]);
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

    function removeSymptom(symptom) {
        this.remove(symptom);
        symptom.selected(false);
        App.pub(App.values.SYMPTOM_REMOVED_EVENT, symptom);
        App.pub(App.values.SYMPTOM_SELECTION_CHANGE_EVENT, this.symptoms);
    }

    function symptomSelected(symptom) {

        if (symptom.selected()) {
            this.add(symptom);
        } else {
            this.remove(symptom);
        }
        m.redraw();
        App.pub(App.values.SYMPTOM_SELECTION_CHANGE_EVENT, this.symptoms);
    }

    controller.prototype = {
        add: add,
        remove: remove,
        removeSymptom: removeSymptom,
        symptomSelected: symptomSelected
    };

}) (App);
