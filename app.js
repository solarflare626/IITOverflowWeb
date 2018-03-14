

$("#googlebutton").click(function(){
    $.ajax
    ({
            url: "http://localhost:3000/api/users/OAuthLogin",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'email': $("#googlebutton").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (e) {
            },
            success: function (resp) {
               console.log(resp)

            }
    });
});