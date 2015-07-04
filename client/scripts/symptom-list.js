(function (App) {

    App.symptomList = {
        view: symptomListView,
        controller: symptomListController
    };

    function symptomListView(ctrl) {
        return [
            m('form.search', { config: formCfg }, [
                filterView(ctrl.filter),
                m('i.glyphicon.glyphicon-search', { onclick: ctrl.search })
            ]),
            m('.ionic.iscroll', [
                listView(ctrl.list)
            ])
        ];
    }

    function symptomListController() {

        var me = this;

        this.list = new listCtrl({
            filter: function (item) {
                return (item.value().toLowerCase().indexOf(me.filter.query().toLowerCase()) > -1);
            }
        });

        this.filter = new filterCtrl();

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
        return m('ul.list', [
            ctrl.symptoms().filter(ctrl.filter).map(function (symptom) {
                return m('li.item.item-checkbox', [
                    m('label.checkbox', [
                        m('input[type="checkbox"]', { value: symptom.id() })
                    ]),
                    symptom.value()
                ]);
            })
        ]);
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
