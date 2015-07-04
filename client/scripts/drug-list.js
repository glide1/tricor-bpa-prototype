(function (App) {
    'use strict';

    App.drugList = {
        view: view,
        controller: controller
    };

    function view(ctrl) {

        var result,
            drugs = ctrl.drugs(),
            meta = ctrl.meta.results;

        if (drugs && drugs.length) {

            result = drugs.map(function (data) {
                return m('li.item', {
                    class: data.selected() ? 'active' : '',
                    onclick: function () {
                        ctrl.drugSelected(data);
                    }
                }, [
                    m('h2', [data.getName()]),
                    m('p', [data.getPurpose()])
                ]);
            });

            if (meta.total > (meta.skip + meta.limit)) {
                result.push(m('li.item.text-center.load-more', {
                    onclick: function () {
                        $(this).html('<i class="icon ion-load-a"></i>');
                        ctrl.more();
                    }
                }, 'Load More'));
            }

            return result;

        } else {
            return m('li.item.text-center.text-muted', '(no results found.)')
        }
    }

    function controller() {

        var me = this,
            pos = 0,
            lastQuery;

        this.meta = null;
        this.drugs = m.prop([]);
        find();

        App.on(App.values.SYMPTOM_SELECTION_CHANGE_EVENT, function (symptoms) {
            pos = 0;
            me.drugs([]);
            find(symptoms);
        });

        this.more = function () {
            pos += App.cfg.pageSize;
            find(lastQuery);
        };

        this.drugSelected = function (drug) {

            drug.selected(true);

            for (var drugs = me.drugs(),
                     i = 0, l = drugs.length; i < l; i++) {
                if (drugs[i].id() !== drug.id()) {
                    drugs[i].selected(false);
                }
            }

            App.pub(App.values.DRUG_SELECTED_EVENT, drug);

        };

        function find(symptoms) {

            var q = [];

            if (symptoms && symptoms.length) {
                lastQuery = symptoms;
                q = symptoms.map(function (item) {
                    return '"' + item.value() + '"';
                });
            }

            m.request({
                url: App.cfg.serviceURI,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: {
                    skip: pos,
                    limit: App.cfg.pageSize,
                    endpoint: App.cfg.endpoint,
                    search: q.join('+AND+').replace(/\s/g, '+')
                },
                unwrapSuccess: function(response) {
                    me.meta = response.meta ? response.meta : {};
                    return response.results;
                },
                unwrapError: function(response) {
                    me.meta = {};
                    me.drugs([]);
                },
                type: App.Drug
            }).then(function( data ) {
                me.drugs(me.drugs().concat(data));
            });

        };

    }

})(App);
