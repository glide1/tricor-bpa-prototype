/* jshint devel:true */
(function () {

    $('body').on('click', 'button', function (e) {
        e.preventDefault();
        var href = $('#url').val();
        if (href !== '') {
            $.ajax({
                url: '/api',
                method: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ "endpoint": "drug/label", search: href }),
                success: function(response) {
                    $('#result').text(JSON.stringify(response));
                }
            });
        } else { 
            $('#result').text('No URL supplied.');
            setTimeout(function () {
                $('#result').text('');
            }, 2000);
        }
    });

}) ();
