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
                            window.location.replace("getSession")
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


