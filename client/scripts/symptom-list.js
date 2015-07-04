(function (App) {
    'use strict';

    App.symptomList = {
        view: symptomListView,
        controller: symptomListController
    };

    function symptomListView(ctrl) {
        return [
            m('form.search', { config: formCfg }, [
                filterView(ctrl.filter),
                ctrl.filter.query()
                    ? m('button.ionic.unstyled', { onclick: ctrl.clear }, m('i.ion-ios-close-outline'))
                    : '',
            ]),
            m('div.ionic.iscroll.panel-body', {
                config: App.isMobile() ? function (e, i) {
                    App.cfg.scroll.fn(e, i, ctrl)
                } : App.noop
            }, listView(ctrl.list))
        ];
    }

    function symptomListController() {

        var me = this;

        this.list = new listCtrl({
            filter: function (item) {
                var value = item.value().toLowerCase(),
                    query = me.filter.query().toLowerCase();
                return (value.indexOf(query) > -1);
            }
        });

        this.filter = new filterCtrl();

        this.clear = function () {
            me.filter.query('');
        };
    }

    function filterView(ctrl) {
        return m('input[type="search"][placeholder="find/filter symptoms..."]', {
            value: ctrl.query(),
            oninput: m.withAttr('value', ctrl.query)
        })
    }

    function filterCtrl() {
        this.query = m.prop('');
    }

    function listView(ctrl) {
        var results = ctrl.symptoms().filter(ctrl.filter).map(function (symptom) {
            return m('li.item.item-checkbox', [
                m('label.checkbox', [
                    m('input[type="checkbox"]', {
                        value: symptom.id(),
                        checked: symptom.selected(),
                        onchange: function (e) {
                            symptom.selected(this.checked);
                            ctrl.onItemChecked(symptom);
                        }
                    })
                ]),
                symptom.value()
            ]);
        });
        return m('ul.list', results.length ? results : m('li.item.text-center', [
            m('span.text-muted', '(no match found)')
        ]));
    }

    function listCtrl(opts) {

        this.symptoms = m.request({
            url: '/fixtures/symptoms.json'
        }).then(function (data) {
            var symptoms = [];
            data.forEach(function (symptom) {
                symptoms.push(new App.Symptom(symptom));
            });
            return symptoms;
        });

        this.filter = opts.filter;

        App.on(App.values.SYMPTOM_REMOVED_EVENT, this.itemChecked.bind(this));

    }

    listCtrl.prototype = {
        itemChecked: function (oSymptom) {

            for (var symptom = null,
                     symptoms = this.symptoms(),
                     l = symptoms.length,
                     i = 0; i < l; ++i) {
                if (symptoms[i].id() == oSymptom.id()) {
                    symptom = symptoms[i];
                    break;
                }
            }

            symptom.selected(oSymptom.selected());
            m.redraw();
        },
        onItemChecked: function (symptom) {
            App.pub(App.values.SYMPTOM_SELECTED_EVENT, symptom);
        }
    };

    function formCfg (element, isInitialized) {
        if (isInitialized) return;
        App.$(element).submit(function (e) {
            e.preventDefault();
        })
    }

})(App);
