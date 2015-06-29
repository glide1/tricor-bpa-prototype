/* jshint devel:true */
(function () {

    $('body').on('click', 'button', function (e) {
        e.preventDefault();
        var href = $('#url').val();
        if (href !== '') {
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
