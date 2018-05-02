var currentUser;

function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    login(id_token);

function login(token) {
        $.ajax({
            type: "POST",
            url: "http://iitoverflow.herokuapp.com/api/users/OAuthLogin",
            data: {"idToken": token},
            dataType: "json",
            success: function (resp) {
                console.log("SUCCESS LVL 1");
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
                        console.log("SUCCESS LVL 2");
                        if (resp.message = "okay") {
                            currentUser = resp.userID;
                            // console.log("Success")                  // just for checking
                            window.location.replace("/newsfeed");
                        }
                        else{
                            console.log("ERROR!")
                        }
                    }

                });
            }

        });

    }
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}

function signOut() {
    console.log("Signed Out 1");
    var auth2 =gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log("Signed Out 2");
        $.ajax({
           url: "http://localhost:5000/logout",
           dataType: "json",
                success: function (resp) {
                        console.log("Signed Out 3");
                        if (resp.message = "okay") {
                            console.log("User signed out.");
                            window.location.replace("/");
                        }
                        else{
                            console.log("Something went wrong.")
                        }
                }
        });
    });
}
/*
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
                            }
                        }
                    )

*/