var u_id;


$(document).ready(function() {
    getCurrentUser();
});

function getUpvote(q_id){

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/'+q_id+'/upvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            voteup = data.count
        }
    });
}

function getDownVote(q_id){

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/'+q_id+'/downvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            votedown = data.count
        }

    });
}

function postUpVote(q_id){
        $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/QuestionUpvotes',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({
            'questionId': q_id,
            'userId': u_id
        }),
        success: function (data) {

        }

    });
}

function deleteUpVote(q_id){
        $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/users/'+u_id+'/questionsupvoted/'+q_id+'',
        type: 'POST',
        dataType: "json",
        success: function (data) {
            votedown = data.count
        }

    });
}

function postDownVote(q_id){
        $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/'+q_id+'/downvotes/count',
        type: 'POST',
        dataType: "json",
        async: false,
        success: function (data) {
            votedown = data.count
        }

    });
}

function deleteDownVote(q_id){
        $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/'+q_id+'/downvotes/count',
        type: 'POST',
        dataType: "json",
        async: false,
        success: function (data) {
            votedown = data.count
        }

    });
}

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
                success: function(message) {
                    console.log("Already upvoted!");
                },
                error: function(message) {
                    if (message.status == 404) {
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
            success: function(message) {
                console.log("Already downvoted!");
            },
            error: function(message) {
                if (message.status == 404) {
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
