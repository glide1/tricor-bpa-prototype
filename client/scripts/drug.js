(function (App) {
    'use strict';

    var id = 0;

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
            var data = this.getDescriptor();
            return this.getActiveIngredients() + ' ' + this.getOtherIngredients();
        },
        getActiveIngredients: function () {
            var data = this.getDescriptor();
            return array(data.active_ingredient);
        },
        getInstructions: function () {
            var data = this.getDescriptor();
            return array(data.dosage_and_administration) +
                '.' + array(data.keep_out_of_reach_of_children);
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
            return data.openfda.brand_name || 'Unnamed';
        },
        getGeneric: function () {
            var data = this.getDescriptor();
            return data.openfda.generic_name;
        },
        getWarnings: function () {
            var data = this.getDescriptor();
            return array(data.warnings) +
                ' ' + array(data.when_using);
        },
        getPurpose: function () {
            var data = this.getDescriptor();
            return data.purpose || '(purpose not available)';
        }
    };

    function array(a) {
        return a ? (a.join(', ') + '.') : '(not available)';
    }

}) (App);
