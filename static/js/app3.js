var u_id;

$(document).ready(function() {
    getCurrentUser();
});

function getCurrentUser() {
    return $.ajax({
        type: 'POST',
        url: "http://localhost:5000/getCurrentUser",
        dataType: "json",
        success: function(resp) {
            u_id = resp.message;
        },
        error: function(e) {
            console.log(e)
        }
    })
}

function upvote(q_id) {
            $.ajax({
                type: 'HEAD',
                url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsupvoted/rel/'+q_id,
                data: "json",
                statusCode: {
                    200: function() {
                        $.ajax({
                        url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsupvoted/rel/'+q_id+'',
                        type: 'DELETE',
                        dataType: "json",
                        success: function (data) {
                            console.log("upvote have been removed")
                        }
                        });
                    },
                    404: function() {
                        $.ajax({
                            type: "PUT",
                            url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsupvoted/rel/'+q_id,
                            success: function(message) {
                               $.ajax({
                                   type: "DELETE",
                                   url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsdownvoted/rel/'+q_id,
                                   success: function() {
                                       console.log("Sucessful deleted downvote after upvote!");
                                   }
                               });
                               console.log("Upvoted question!");

                            }
                        });

                }
            }
      });
}

function downvote(q_id) {
        $.ajax({
            type: 'HEAD',
            url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsdownvoted/rel/'+q_id,
            statusCode: {
                200: function() {
                    $.ajax({
                        url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsdownvoted/rel/'+q_id+'',
                        type: 'DELETE',
                        dataType: "json",
                        success: function (data) {
                            console.log("downvote have been removed")
                        }
                        });
                },
                404: function() {
                    $.ajax({
                        type: "PUT",
                        url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsdownvoted/rel/'+q_id,
                        success: function(message) {
                            $.ajax({
                                type: "DELETE",
                                url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsupvoted/rel/'+q_id,
                                success: function() {
                                    console.log("Sucessful deleted upvote after downvote!");
                                }
                            });
                        console.log("Downvoted question!");
                        }
                        });

                }

        }
    });
}


