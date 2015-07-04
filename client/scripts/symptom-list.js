(function (App) {

    App.symptomList = {
        view: symptomListView,
        controller: symptomListController
    };

    function symptomListView(ctrl) {
        return [
            m('form.search', { config: formCfg }, [
                filterView,
                m('i.glyphicon.glyphicon-search', { onclick: ctrl.search })
            ]),
            m('.ionic.iscroll', [
                m('ul.list', [
                    ctrl.symptoms().map(function (symptom) {
                        return m('li.item.item-checkbox', [
                            m('label.checkbox', [
                                m('input[type="checkbox"]', {value: symptom.id()})
                            ]),
                            symptom.value()
                        ]);
                    })
                ])
            ])
        ];
    }

    function symptomListController() {

        var me = this;

        this.list = new listCtrl({
            filter: function (item) {
                return (item.value().indexOf(me.filter.query()) > -1);
            }
        });

        this.filter = new filterCtrl();

        this.symptoms = m.request({ url: '/fixtures/symptoms.json' }).then(function (data) {
            var symptoms = [];
            data.forEach(function (symptom) {
                symptoms.push(new App.Symptom(symptom));
            });
            return symptoms;
        });

        this.search = function () {

        };

    }

    function filterView(ctrl) {
        return m('input[type="search"][placeholder="find/ filter symptoms..."]', {
            value: ctrl.query(),
            oninput: m.withAttr('value', ctrl.query)
        })
    }

    function filterCtrl() {
        this.query = m.prop('');
    }

    function listView(ctrl) {

    }

    function listCtrl(opts) {

    }

    function formCfg (element, isInitialized) {
        if (isInitialized) return;
        App.$(element).submit(function (e) {
            e.preventDefault();
        })
    }

    function ulCfg(element, initialized) {
        if (initialized) {

        } else {
            new IScroll(element, App.iscrollCfg);
        }
    }

})(App);
