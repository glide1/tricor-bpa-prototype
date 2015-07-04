(function (App) {

    var count = 0;

    App.Symptom = function (symptom) {

        var id = ++count;
        this.value = m.prop(symptom);

        this.id = function () {
            return id;
        }

    };

}) (App);
