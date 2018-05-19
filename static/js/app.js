function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    login(id_token);
}

function login(token) {
    $.ajax({
        type: "POST",
        url: "http://iitoverflow.herokuapp.com/api/users/OAuthLogin",
        data: { "idToken": token },
        dataType: "json",
        success: function(resp) {
            $.ajax({
                type: "POST",
                url: "http://localhost:5000/login",
                data: JSON.stringify({
                    'id': resp.id,
                    'userID': resp.userId
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function(resp) {
                    if (resp.message = "okay") {
                        currentUser = resp.userID;
                        $.ajax({
                            type: "GET",
                            url: "http://iitoverflow.herokuapp.com/api/Interests/findOne?filter[where][userId]=" + resp.userID + "",
                            dataType: "json",
                            success: function(resp) {
                                if (resp.userId == currentUser) {
                                    window.location.replace("/newsfeed")
                                }
                            },
                            error: function(e) {
                                window.location.replace("/categories")
                            }
                        })
                    } else {
                        alert("error")
                    }
                }

            });
        },
        error: function(e) {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function() {
                window.location.replace("/?access_denied")
            })
        }

    });
}