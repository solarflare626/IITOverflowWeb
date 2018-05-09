var currentUser;

// $( document ).ready(function() {
//     $.when(getCurrentUser()).done(function(e) {
//         $('.followbutton').each(function () {
//             checker(this.id);
//             // console.log("#"+this.id+"");
//         });
//     });
// });

function newsfeed(){
    $.when(getCurrentUser()).done(function(e) {
        $('.followbutton').each(function () {
            checker(this.id);
            // console.log("#"+this.id+"");
        });
    })
}

    $('button').click(function() {
        var $this = $(this);
        $this.toggleClass('following')
        if ($this.is('.following')) {
             id = ($(this).attr('id'));
             follow(id);
            $this.addClass('wait');
        }
        else{
            id = ($(this).attr('id'));
            unfollow(id);
        }
    }).on('mouseleave', function() {
        $(this).removeClass('wait');
    });

function follow(id){
        $.ajax({
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            url: "http://iitoverflow.herokuapp.com/api/QuestionFollows",
            dataType: "json",
            data: JSON.stringify({
                        'questionId': id,
                        'userId': currentUser
                    }),
            success: function (resp) {
                console.log(resp);
            },
            error: function (e) {
                console.log(e)
            }
        });

    }

function unfollow(id){
      $.ajax({
            type: "DELETE",
            url: "http://iitoverflow.herokuapp.com/api/users/"+currentUser+"/questionsfollowed/"+id+"",
            dataType: "json",

            success: function (resp) {
                console.log("sucessfuly unFollowed")
            },
            error: function (e) {
                console.log("error")
            }
        });

}

function checker(id){
    $.ajax({
        type: "HEAD",
        url: "http://iitoverflow.herokuapp.com/api/users/"+currentUser+"/questionsfollowed/rel/"+id+"",
        dataType: "json",
        success: function(resp){
            console.log('Found some')
        },

        statusCode: {
            200: function() {
                $("#"+id+".followbutton").toggleClass('following')
                },

  }


    })

}


$('#autocomplete').autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "http://iitoverflow.herokuapp.com/api/Questions?filter[where][question][ilike]=%"+request.term+"%",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.question,
                                    value: item.id
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

function login(token) {
        $.ajax({
            type: "POST",
            url: "http://iitoverflow.herokuapp.com/api/users/OAuthLogin",
            data: {"idToken": token},
            dataType: "json",
            success: function (resp) {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:5000/login",
                    data: JSON.stringify({
                        'id': resp.id,
                        'userID': resp.userId
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    success: function (resp) {
                        if (resp.message = "okay") {
                            currentUser = resp.userID;
                            $.ajax({
                                type: "GET",
                                url: "http://iitoverflow.herokuapp.com/api/Interests/findOne?filter[where][userId]="+resp.userID+"",
                                dataType: "json",
                                success: function (resp) {
                                    if (resp.userId == currentUser){
                                        window.location.replace("/newsfeed")
                                    }
                                },
                                error: function (e){
                                    window.location.replace("/categories")
                                }
                            })
                        }
                        else{
                            alert("error")
                        }
                    }

                });
            }

        });
    }

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
    newsfeed();
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $.ajax({
           url: "http://localhost:5000/logout",
           dataType: "json",
                success: function (resp) {
                        if (resp.message = "okay") {
                            window.location.replace('/');
                        }
                        else{
                            console.log("Something went wrong")
                        }
                },
                error: function (e) {
                        console.log('ERROR')
                }
        });
    });
}

function getCurrentUser(){
    return $.ajax({
                type: 'GET',
                url: "http://localhost:5000/getCurrentUser",
                dataType: "json",
                    success: function (resp) {
                        currentUser = resp.message;
                    },
                    error: function (e) {
                        console.log(e)
                    }
            })
}