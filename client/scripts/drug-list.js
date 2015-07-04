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

        find();

        App.on(App.values.SYMPTOM_SELECTION_CHANGE_EVENT, find);

        function find(symptoms) {

            var q = [];

            if (symptoms && symptoms.length) {
                q = symptoms.map(function (item) {
                    return '"' + item.value() + '"';
                });
            }

            me.drugs = m.request({
                url: '/api',
                method: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: {
                    limit:10,
                    endpoint: 'drug/label',
                    search: q.join('+AND+').replace(/\s/g, '+')
                }
            }).then(function (data) {

                me.meta = data.meta ? data.meta : {};

                var results = [];

                data.results && data.results.forEach(function (drug) {
                    results.push(new App.Drug(drug));
                });

                return results;

            });

        }

    }

})(App);
