(function (App) {
    'use strict';

    App.detailsPanel = {
        view: view,
        controller: controller
    };

    function view(ctrl) {
        var drug = ctrl.drug();
        return drug ? [
            m('header', [
                m('h1', drug.getName()),
                m('p', drug.getPurpose())
            ]),
            m('section', [
                m('p', [
                    m('strong', 'Generic Name: '),
                    m('span', drug.getGeneric())
                ]),
                m('p', drug.getIndications())
            ]),
            m('section', [
                m('h2', 'Warnings'),
                m('p', drug.getWarnings())
            ]),
            m('section', [
                m('h2', 'Ingredients'),
                m('p', drug.getIngredients())
            ]),
            m('section', [
                m('h2', 'Dosage'),
                m('p', drug.getInstructions())
            ]),
        ] : '';
    }

    function controller() {

        this.drug = m.prop(null);

        App.on(App.values.DRUG_SELECTED_EVENT, function (drug) {
            this.drug(drug);
            $('#app').removeClass('details-off');
        }.bind(this));

    }

})(App);
