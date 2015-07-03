/* jshint devel:true */
(function () {

    var scrolls = [],
        timeout;

    $('.iscroll').each(function() {
       scrolls.push(new IScroll(this, {
           mouseWheel: true,
           scrollbars: false
       }));
    });

    $(window).resize(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            $.each(scrolls, function (i, scroll) {
                scroll.refresh();
            });
        }, 150);
    });

    $('body').on('click', 'button', function (e) {
        e.preventDefault();
        var href = $('#url').val();
        if (href !== '') {
            $.ajax({
                url: '/api',
                method: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({"endpoint": "drug/label", search: href}),
                success: function (response) {
                    $('#result').html('<textarea disabled readonly>' + JSON.stringify(response, null, '    ') + '</textarea>');
                }
            });
        } else {
            $('#result').text('No URL supplied.');
            setTimeout(function () {
                $('#result').text('');
            }, 2000);
        }
    });

    var $container = $('.st-container'),
        CLASS = 'st-effect-3';

    $('button').click(function (e) {

        e.preventDefault();
        e.stopPropagation();

        $container.removeClass(CLASS);
        $container.addClass(CLASS);
        $container.addClass('st-menu-open');

        document.addEventListener('click', bodyClickFn);

    });

    function bodyClickFn(evt) {
        if (!hasParentClass(evt.target, 'st-menu')) {
            $container.removeClass('st-menu-open');
            document.removeEventListener('click', bodyClickFn);
        }
    }

    function hasParentClass(e, classname) {
        e = e.get ? e.get(0) : e;
        if (e === document) return false;
        if ($(e).hasClass(classname)) {
            return true;
        }
        return e.parentNode && hasParentClass(e.parentNode, classname);
    }

})();
