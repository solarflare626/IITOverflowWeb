var currentUser;

$(document).ready(function() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
        $.when(getCurrentUser()).done(function(e) {
              $('.follow2').each(function() {
                checker3(this.id)
            });
            $('.followbutton').each(function() {
                checker(this.id);
                checker2(this.id, this.name)
            });
            $('.workround1').each(function() {
                answerGetUpvote(this.id)
            });
            $('.workround2').each(function() {
                answerGetDownVote(this.id)
            });
        });
    });
});

$(document).on('click', '.follow', function() {
    var $this = $(this);
    console.log('test1');
    $this.toggleClass('following');
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

$(document).on('click', '.follow2', function() {
    var $this = $(this);
    $this.toggleClass('following');
    if ($this.is('.following')) {
        id = ($(this).attr('id'));
        follow2(id);
        //console.log("follow user");
        $this.addClass('wait');
    } else {
        id = ($(this).attr('id'));
        unfollow2(id);
        //console.log("unfollow user");
    }
}).on('mouseleave', function() {
    $(this).removeClass('wait');
});



$(document).on('click', '#signout', function() {
    console.log("logout");
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
});

// function newfollow(id) {
//         $('#'+id).toggleClass('following');
//         if ($('#'+id).is('.following')) {
//             id2 = ($('#'+id).attr('id'));
//             follow(id2);
//             $('#'+id).addClass('wait');
//         } else {
//             id2 = ($('#'+id).attr('id'));
//             unfollow(id2);
//         }
// }

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
        url: "http://iitoverflow.herokuapp.com/api/users/"+currentUser+"/questionsfollowed/rel/"+id ,
        dataType: "json",

        success: function(resp) {
            console.log(resp)
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
            //console.log('Found some')
        },

        statusCode: {
            200: function() {
                $("#" + id + ".followbutton").toggleClass('following')
            },

        }
    })

}

function checker2(id, u_id) {
    if (currentUser == u_id) {
        $("#" + id + ".followbutton").prop("disabled", true);
        $("#" + id + ".followbutton").hide();
        $("#" + id + ".answerbutton").css("width", "33.3%");
        $("#" + id + ".up").css("width", "30%");
        $("#" + id + ".down").css("width", "33.3%");
    }
}

// function signOut() {
//
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.disconnect();
//     auth2.signOut().then(function() {
//
//         $.ajax({
//             url: "http://localhost:5000/logout",
//             dataType: "json",
//             success: function(resp) {
//                 if (resp.message = "okay") {
//                     window.location.replace('/');
//                 } else {
//                     console.log("Something went wrong")
//                 }
//             },
//             error: function(e) {
//                 console.log('ERROR')
//             }
//         });
//     });
// }

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

function upvote(q_id) {
            $.ajax({
                type: 'HEAD',
                url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/questionsupvoted/rel/'+q_id,
                data: "json",
                statusCode: {
                    200: function() {
                        $.ajax({
                        url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/questionsupvoted/rel/'+q_id,
                        type: 'DELETE',
                        dataType: "json",
                        success: function (data) {
                            getUpvote(q_id);
                            console.log("upvote have been removed")
                        }
                        });
                    },
                    404: function() {
                        $.ajax({
                            type: "PUT",
                            url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/questionsupvoted/rel/'+q_id,
                            success: function(message) {
                               $.ajax({
                                   type: "DELETE",
                                   url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/questionsdownvoted/rel/'+q_id,
                                   success: function() {
                                       getUpvote(q_id);
                                       getDownVote(q_id);
                                       console.log("Sucessful deleted downvote after upvote!");
                                   }
                               });
                               getUpvote(q_id);
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
        url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/questionsdownvoted/rel/' + q_id,
        statusCode: {
            200: function () {
                $.ajax({
                    url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/questionsdownvoted/rel/' + q_id,
                    type: 'DELETE',
                    dataType: "json",
                    success: function (data) {
                        getDownVote(q_id);
                        console.log("downvote have been removed")
                    }
                });
            },
            404: function () {
                $.ajax({
                    type: "PUT",
                    url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/questionsdownvoted/rel/' + q_id,
                    success: function (message) {
                        $.ajax({
                            type: "DELETE",
                            url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/questionsupvoted/rel/' + q_id,
                            success: function () {
                                getDownVote(q_id);
                                getUpvote(q_id);
                                console.log("Sucessful deleted upvote after downvote!");
                            }
                        });
                        console.log("Downvoted question!");
                        getDownVote(q_id);
                    }
                });
            }
        }
    });
}

function getUpvote(q_id){

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/'+q_id+'/upvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            $("#"+q_id+".up").text(" "+data.count);
        }
    });
}

function getDownVote(q_id) {

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Questions/' + q_id + '/downvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            $("#" + q_id + ".down").text(" " + data.count);
        }
    });
}

function answerUpvote(a_id) {
            $.ajax({
                type: 'HEAD',
                url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/answersupvoted/rel/'+a_id,
                data: "json",
                statusCode: {
                    200: function() {
                        $.ajax({
                        url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/answersupvoted/rel/'+a_id,
                        type: 'DELETE',
                        dataType: "json",
                        success: function (data) {
                            answerGetUpvote(a_id);
                            console.log("upvote have been removed")
                        }
                        });
                    },
                    404: function() {
                        $.ajax({
                            type: "PUT",
                            url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/answersupvoted/rel/'+a_id,
                            success: function(message) {
                               $.ajax({
                                   type: "DELETE",
                                   url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/answersdownvoted/rel/'+a_id,
                                   success: function() {
                                       answerGetUpvote(a_id);
                                       answerGetDownVote(a_id);
                                       console.log("Sucessful deleted downvote after upvote!");
                                   }
                               });
                               answerGetUpvote(a_id);
                               console.log("Upvoted question!");

                            }
                        });

                }
            }
      });
}

function answerDownvote(a_id) {
    $.ajax({
        type: 'HEAD',
        url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/answersdownvoted/rel/' + a_id,
        statusCode: {
            200: function () {
                $.ajax({
                    url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/answersdownvoted/rel/' + a_id,
                    type: 'DELETE',
                    dataType: "json",
                    success: function (data) {
                        answerGetDownVote(a_id);
                        console.log("downvote have been removed")
                    }
                });
            },
            404: function () {
                $.ajax({
                    type: "PUT",
                    url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/answersdownvoted/rel/' + a_id,
                    success: function (message) {
                        $.ajax({
                            type: "DELETE",
                            url: 'http://iitoverflow.herokuapp.com/api/users/' + currentUser + '/answersupvoted/rel/' + a_id,
                            success: function () {
                                answerGetDownVote(a_id);
                                answerGetUpvote(a_id);
                                console.log("Sucessful deleted upvote after downvote!");
                            }
                        });
                        console.log("Downvoted question!");
                        answerGetDownVote(a_id);
                    }
                });
            }
        }
    });
}

function answerGetUpvote(a_id){

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Answers/'+a_id+'/upvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            $("#"+a_id+".up").text(" "+data.count);
        }
    });
}

function answerGetDownVote(a_id) {

    $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/Answers/'+a_id+'/downvotes/count',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function (data) {
            $("#" + a_id + ".down").text(" " + data.count);
        }
    });
}

function thisonclick(id){
    var url ='/question/'+id;
    window.location.assign(url)
}

function checker3(id){
     $.ajax({
        url: 'http://iitoverflow.herokuapp.com/api/users/'+currentUser+'/following/'+id,
        type: 'GET',
        dataType: "json",
        async: false,
        statusCode: {
            200: function () {
                $("#" + id + ".follow2").toggleClass('following')
            },
            404: function () {
                console.clear()
            }
        }
    });
}

function follow2(id) {
    $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: "http://iitoverflow.herokuapp.com/api/following",
        dataType: "json",
        data: JSON.stringify({
            'id': id,
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

function unfollow2(id) {
    $.ajax({
        type: "DELETE",
        url: "http://iitoverflow.herokuapp.com/api/users/"+currentUser+"/following/rel/"+id ,
        dataType: "json",

        success: function(resp) {
            console.log(resp)
        },
        error: function(e) {
            console.log("error")
        }
    });
}

function deleteCom(c_id,a_id){
    $.ajax({
        type: "DELETE",
        url: "http://iitoverflow.herokuapp.com/api/Answers/"+a_id+"/comments/"+c_id ,
        dataType: "json",

        success: function(resp) {
            console.log(resp)
        },
        error: function(e) {
            console.log("error")
        }
    });
}
