function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    login(id_token);

function login(token) {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:3000/api/users/OAuthLogin",
            data: {"idToken": token},
            dataType: "json",
            success: function (resp) {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:5000/login",
                    data: JSON.stringify({"data": resp.id}),
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    success: function (resp) {
                        if (resp.message = "okay") {
                            console.log("OKAY!")
                           // window.location.replace("getSession")
                        }
                        else{
                            console.log("ERROR!")
                        }
                    }

                });

            },

        });

    }
}

$('#autocomplete').autocomplete({
                source: function (request, response) {
                    $.ajax({
                      //  url: "http://127.0.0.1:3000/api/Tags?filter=%7B%20%22fields%22%3A%20%7B%22id%22%3A%20true%2C%20%22name%22%3A%20true%2C%20%22createdAt%22%3A%20false%2C%20%22updatedAt%22%3A%20false%2C%20%22deletedAt%22%3A%20false%2C%20%22categoryID%22%3A%20false%7D%7D",
                        url: "http://127.0.0.1:3000/api/Tags?filter=%7B%20%22where%22%20%3A%7B%20%22name%22%20%3A%20%7B%20%22like%22%3A%20%22%25"+request.term+"%25%22%7D%7D%7D",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {;
                            response($.map(data, function (item) {

                                return {
                                    label: item.name,
                                    value: item.name
                                }
                            }));
                        }
                    });
                },

            });


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $.ajax({
           url: "http://localhost:5000/logout",
           dataType: "json",
                success: function (resp) {
                        if (resp.message = "okay") {
                            console.log("User signed out.")
                        }
                        else{
                            console.log("Something went wrong")
                        }
                }
        });
    });
}


