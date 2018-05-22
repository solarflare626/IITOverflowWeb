var currentUser;

$(document).ready(function() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
        $.when(getCurrentUser()).done(function(e) {
            $('.followbutton').each(function() {
                checker(this.id);
                checker2(this.id,this.name)
            });
        });
    });
});

$(".follow").on("click", function() {
    var $this = $(this);
    $this.toggleClass('following')
    if ($this.is('.following')) {
        id = ($(this).attr('id'));
        follow(id);
        $this.addClass('wait');
    } else {
        id = ($(this).attr('id'));
        unfollow(id);
    }
}).on('mouseleave', function() {
    $(this).removeClass('wait');
});

function follow(id) {
    $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: "http://iitoverflow.herokuapp.com/api/QuestionFollows",
        dataType: "json",
        data: JSON.stringify({
            'questionId': id,
            'userId': currentUser
        }),
        success: function(resp) {
            console.log(resp);
        },
        error: function(e) {
            console.log(e)
        }
    });

}

function unfollow(id) {
    $.ajax({
        type: "DELETE",
        url: "http://iitoverflow.herokuapp.com/api/users/" + currentUser + "/questionsfollowed/" + id + "",
        dataType: "json",

        success: function(resp) {
            console.log("sucessfuly unFollowed")
        },
        error: function(e) {
            console.log("error")
        }
    });

}

function checker(id) {

    $.ajax({
        type: "HEAD",
        url: "http://iitoverflow.herokuapp.com/api/users/" + currentUser + "/questionsfollowed/rel/" + id + "",
        dataType: "json",
        success: function(resp) {
            console.log('Found some')
        },

        statusCode: {
            200: function() {
                $("#" + id + ".followbutton").toggleClass('following')
            },

        }


    })

}

function checker2(id,u_id){

        if (currentUser == u_id) {
        $("#" + id + ".followbutton").prop( "disabled", true );
    }

}






    $('#autocomplete').autocomplete({
                source: function (request, response) {
                    var test = encodeURIComponent(request.term);
                    $.ajax({
                        url: "http://iitoverflow.herokuapp.com/api/Questions?filter[where][question][ilike]=%25"+test+"%25",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.question,
                                    value: item.question
                                }
                            }));
                        }
                    });
                }

            });

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    login(id_token);
}


function signOut() {

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    auth2.signOut().then(function() {

        $.ajax({
            url: "http://localhost:5000/logout",
            dataType: "json",
            success: function(resp) {
                if (resp.message = "okay") {
                    window.location.replace('/');
                } else {
                    console.log("Something went wrong")
                }
            },
            error: function(e) {
                console.log('ERROR')
            }
        });
    });
}

function getCurrentUser() {
    return $.ajax({
        type: 'POST',
        url: "http://localhost:5000/getCurrentUser",
        dataType: "json",
        success: function(resp) {
            currentUser = resp.message;
        },
        error: function(e) {
            console.log(e)
        }
    })
}