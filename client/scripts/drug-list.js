(function (App) {
    'use strict';

    App.drugList = {
        view: view,
        controller: controller
    };

    function view(ctrl) {
        return ctrl.drugs().map(function (data) {
            return m('li.item', [
                m('a', [
                    m('h2', [data.getName()]),
                    m('p', [data.getPurpose()])
                ])
            ]);
        });
    }

    function controller() {

        var me = this;

        this.meta = null;

        this.drugs = m.request({
            url: '/api',
            method: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: { 'endpoint': 'drug/label', search: '', limit:10 }
        }).then(function (data) {

            me.meta = data.meta;

            var results = [];

            data.results && data.results.forEach(function (drug) {
                results.push(new App.Drug(drug));
            });

            return results;

        });

    }

})(App);
