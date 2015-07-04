(function (App) {
    'use strict';

    var id = 0,
        JOIN_CHAR = ' ',
        NOT_AVAILABLE_STR = '(info not available)';

    App.Drug = function (fdaDescriptor) {
        this.id = (function (id) {
            return function () {
                return id;
            }
        })(id++);
        this.selected = m.prop(false);
        this.getDescriptor = function () {
            return fdaDescriptor;
        }
    };

    App.Drug.prototype = {
        getIngredients: function () {
            return process([this.getActiveIngredients(), this.getOtherIngredients()].join(JOIN_CHAR));
        },
        getActiveIngredients: function () {
            var data = this.getDescriptor();
            return array(data.active_ingredient);
        },
        getInstructions: function () {
            var data = this.getDescriptor();
            return process([array(data.dosage_and_administration), array(data.keep_out_of_reach_of_children)].join(JOIN_CHAR));
        },
        getOtherIngredients: function () {
            var data = this.getDescriptor();
            return array(data.inactive_ingredient);
        },
        getIndications: function () {
            var data = this.getDescriptor();
            return array(data.indications_and_usage);
        },
        getName: function () {
            var data = this.getDescriptor();
            return process(data.openfda.brand_name);
        },
        getGeneric: function () {
            var data = this.getDescriptor();
            return data.openfda.generic_name;
        },
        getWarnings: function () {
            var data = this.getDescriptor();
            return process([array(data.warnings), array(data.when_using)].join(JOIN_CHAR));
        },
        getPurpose: function () {
            var data = this.getDescriptor();
            return process(data.purpose);
        }
    };

    function array(a) {
        return a ? a.join ? (a.join(', ') + '.') : a : NOT_AVAILABLE_STR;
    }

    function process(string) {
        if (typeof string !== 'array') string = array(string);
        if ((!string) || (string.replace(NOT_AVAILABLE_STR, '').trim() === '')) {
            return NOT_AVAILABLE_STR;
        }
        return string
            .replace(NOT_AVAILABLE_STR, '')
            .replace(/(•)/g, '\n• ')
            .trim();
    }

}) (App);
