(function (App) {

    App.symptomList = {
        view: view,
        controller: controller
    };

    function view(ctrl) {
        return [
            m('form.search', { config: formCfg }, [
                m('input[type="search"][placeholder="find/ filter symptoms..."]', {
                    value: ctrl.query(),
                    oninput: m.withAttr('value', ctrl.query)
                }),
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

    function controller() {

        var me = this;

        this.query = m.prop('');

        this.symptoms = m.request({url: '/fixtures/symptoms.json'}).then(function (data) {
            var symptoms = [];
            data.forEach(function (symptom) {
                symptoms.push(new App.Symptom(symptom));
            });
            return symptoms;
        });

        this.search = function () {

        };

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
