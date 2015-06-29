/* jshint devel:true */
(function () {

    $('body').on('click', 'a', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if (href !== '#') {
            $.ajax({
                url: href,
                success: function(response) {
                    $('#result').text(response);
                }
            });
        } else {
            $('#result').text('No URL supplied.');
            setTimeout(function () {
                $('#result').text('');
            }, 2000)
        }
    });

}) ();
