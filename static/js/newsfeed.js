///////////////////////////////////////   VARIABLES    //////////////////////////////////////////////
var catty, cattyid, selectedCategory, btn;

///////////////////////////////////////   FUNCTIONS   ////////////////////////////////////////////// 
    function CKupdate() {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
            CKEDITOR.instances[instance].setData('');
        }
    }
// --------------------------------------------------------------------------------------------------------
    function showhide(id) {
        var div = document.getElementById("qedit_" + id);
        var div1 = document.getElementById("newqedit_" + id);
        if (div.style.display !== "none") {
            div.style.display = "none";
            div1.style.display = "block";

            $("#hider").fadeOut("slow");
            $("#post").fadeOut('slow');
            $("#form2").css("z-index", "9998");
            $("#newpost").css("z-index", "10001");
        } else {
            div.style.display = "block";
            div1.style.display = "block";
            $("#hider").fadeIn('slow');
            $("#post").fadeIn('slow');
            $("#form2").css("z-index", "10003");
            $("#newpost").css("z-index", "9999");

        }
    }
// --------------------------------------------------------------------------------------------------------
        function showhide1(id) {
            var x = document.getElementById("duplicate_" + id);
            if (x.style.display === "none") {
                x.style.display = "block";
                $("#hider").fadeOut("slow");
            } else {
                x.style.display = "none";
                $("#hider").fadeOut("slow");
            }
        }
///////////////////////////////////////   INITIALIZE   ////////////////////////////////////////////// 
/*    $('#tagsID').tagEditor({
        autocomplete: {
            delay: 0, // show suggestions immediately
            position: {
                collision: 'flip'
            }, // automatic menu position up/down
            source: []
        },
        forceLowercase: false,
    });*/
///////////////////////////////////////   ON KEY PRESS   ////////////////////////////////////////////// 
        $('input[type=text]').on('keydown', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var a = $(this).attr('id');
                alert(a)
                var aid = a.split("_").pop()
                alert(aid);
                var comment = $('#' + a).val();
                console.log(comment);
                //COMMENT
                var data = {
                    "comment": comment,
                    "answerId": aid,
                    "userId": "{{curuser}}"
                }
                $.ajax({
                    type: "POST",
                    url: "http://iitoverflow.herokuapp.com/api/Answers/" + aid + "/comments",
                    data: JSON.stringify(data),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        alert('ok');
                        $('#toReload').load(location.href + ' #toReload')
                            //alert('reloaded');
                    },
                    error: function(result) {
                        alert(result);
                    }
                });
            }
        });
///////////////////////////////////////   ON CLICKS   //////////////////////////////////////////////
$(document).ready(function() {
    
});
        $(document).on('click', '#hider', function() {
            $("#hider").fadeOut("slow");
            $("#form2").hide("slow");
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.answerbutton', function() {
            var id = $(this).attr('id');
            $('.answertextarea#answer_' + id).focus();
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.commentbutton', function() {
            $('.commenttextarea').focus();
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('#title', 'click', function() {
            console.log("TITLE FOCUS");
            $("#post").show();
            $("#form1").show();
            $("#submitbutton3").show();
            $("#tags-container").show();
            $("#tagsID").show();
            $("#tagsID+.tag-editor").show();
            $(".popupwrapper").show();
            $(".submitbutton3").show();
            $(".submitbutton2").show();
            $("newDivs").show();
            $(".titlebar").show();
            $("tagsbar").show();
            $("categorybar").show();
            $(".categorycontainer").show();
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.heart' , function() {
            console.log($(this));
            var delbutton = $(this).attr('id');
            $.ajax({
                type: "DELETE",
                url: "http://iitoverflow.herokuapp.com/api/Answers/" + delbutton,
                success: function(result) {
                    $('#toReload').load(location.href + ' #toReload')

                },
                error: function(result) {
                }
            });
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.qheart' , function() {
            console.log($(this));
            var qdelbutton = $(this).attr('id');
            $.ajax({
                type: "DELETE",
                url: "http://iitoverflow.herokuapp.com/api/Questions/" + qdelbutton,
                success: function(result) {
                },
                error: function(result) {
                }
            });
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.categorybutton', function() {
            $("#myModal").show();
            $("#myModal").css("z-index", "10002");
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click','.categorypopups', function() {
            selectedCategory = document.getElementsByClassName('popup');
            catty = this.text;
            cattyid = $(this).attr('id');
            var text2 = document.createTextNode(catty);
            $('.popup').attr('id', cattyid);
            var modal = document.getElementById('myModal');
            modal.style.display = 'none';
            $('.categorybutton').append(text2);
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.submitbutton2', function() {
            $("#form1").hide('slow');
            $(".submitbutton3").hide('slow');
            $(".popupwrapper").hide('slow');
            $(".tagsarea").hide('slow');
            $("#tagsID+.tag-editor").hide();
            $(this).hide('slow');
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.submitbutton3', function() {
            var editorText = CKEDITOR.instances.textarea.getData();
            var posttitle = document.getElementById('title').value
             var gettags = document.getElementById('tagsID').value
            var cleartitle = document.getElementById('title');
            var cleartags = document.getElementsByClassName('tag-editor-tag');
            var category = $('.popup').attr('id');
            document.getElementById(".titlearea").value = "";
            document.getElementById(".tag-editor").value = "";
            CKEDITOR.instances['#cke_textarea'].setData('');
            var data = {
                "question": posttitle,
                "questiondesc": editorText,
                 "categoryId": category,
                "userId": "{{ curuser }}"
             }
            $.ajax({
                type: "POST",
                url: "https://iitoverflow.herokuapp.com/api/Questions",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(result) {
                    //alert('ok');
                    qid = result.id;
                    var tagslength = cleartags.length;
                    for (i = 0; i < tagslength; i++) {
                        var data1 = {
                            "name": cleartags[i].innerText,
                            "categoryId": category
                        };
                        console.log(cleartags[i].innerText);
                        $.ajax({
                            type: "POST",
                            url: "http://iitoverflow.herokuapp.com/api/Questions/" + qid + "/tags",
                            data: JSON.stringify(data1),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(result) {
                            },
                            error: function(result) {
                                console.log(JSON.stringify(result));
                            }
                        });
                    }
                 }
            });
        $('#toReload').load(location.href + ' #toReload');
        $("#form1").hide('slow');
        $(".submitbutton2").hide('slow');
        $(".popupwrapper").hide('slow');
        $(".tagsarea").hide('slow');
        $("#tagsID+.tag-editor").hide('slow');
        $(".submitbutton3").hide('slow');
        $("newDivs").show('slow');
        $(".titlebar").show('slow');
        $("tagsbar").show('slow');
        $("categorybar").show('slow');
});
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.submitbutton4', function() {
            $("#form2").hide('slow');
        });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.submitbutton5', function() {
            var qid = $(this).attr('id');
            var editorText = CKEDITOR.instances.textarea.getData();
            var posttitle = document.getElementById('titleedit').value;
            var gettags = document.getElementById('tagsIDedit').value;
            var cleartitle = document.getElementById('titleedit');
            var cleartags = document.getElementsByClassName('tag-editor-tag');
            console.log(cleartags);
            var data = {
                "question": posttitle,
                "questiondesc": editorText,
                "userId": "{{ curuser }}"
            };
            $.ajax({
                    type: "PUT",
                    url: "https://iitoverflow.herokuapp.com/api/Questions",
                    data: JSON.stringify(data),
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        console.log(result);
                        alert('gaga');
                        qid = result.id;
                        $('#qedit_' + qid).modal('toggle');
                        var tagslength = cleartags.length;
                        $.ajax({
                                type: "PUT",
                                url: "https://iitoverflow.herokuapp.com/api/Questions",
                                data: JSON.stringify(data),
                                dataType: "json",
                                contentType: "application/json",
                                success: function(result) {
                                    console.log(result);
                                    alert('gaga');
                                    qid = result.id;
                                    $('#qedit_' + qid).modal('toggle');
                                    var tagslength = cleartags.length;
                                    for (i = 0; i < tagslength; i++) {
                                        var data1 = {
                                            "name": cleartags[i].innerText,
                                            "categoryId": category
                                        };
                                        console.log(cleartags[i].innerText);
                                        $.ajax({
                                            type: "POST",
                                            url: "http://iitoverflow.herokuapp.com/api/Questions/" + qid + "/tags",
                                            data: JSON.stringify(data1),
                                            dataType: "json",
                                            contentType: "application/json",
                                            success: function(result1) {
                                                console.log(result1);
                                            },
                                            error: function(result1) {
                                                console.log(JSON.stringify(result1));
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
            });
// --------------------------------------------------------------------------------------------------------
        $(document).on('click', '.submitanswerbutton', function() {
            var qid = $(this).attr('id');
            var answer = $("#answer_" + qid).val();
            var category = document.getElementById('');
            var data = {
                "answer": answer,
                "questionId": qid,
                "userId": "{{curuser}}"
            };
            $.ajax({
                type: "POST",
                url: "https://iitoverflow.herokuapp.com/api/Answers",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: function(result) {
                    $('#toReload').load(location.href + ' #toReload')
                },
                error: function(result) {
                }
            });
        });
///////////////////////////////////////   ON DOCUMENT READY   //////////////////////////////////////////////
        $(document).ready(function() {
            $(".comments-container").hide();
            $("#post").hide();
            $("#submitbutton3").hide();
            $("#tags-container").hide();
            $("#form1").hide();
            $("#tagsID").hide();
            $("#tagsID+.tag-editor").hide();
            $(".popupwrapper").hide();
            $(".submitbutton3").hide();
            $(".submitbutton2").hide();
            $("newDivs").hide();
            $(".titlebar").hide();
            $("tagsbar").hide();
            $("categorybar").hide();
            $(".categorycontainer").hide();
            $('.tag-editor-tag').html("");
        });
///////////////////////////////////////   MOUSE EVENTS   //////////////////////////////////////////////
        $(document).mouseup(function(e) {
            var container = $(".askquestion");
            var catmodal = $("#myModal").is(":visible");
            if (!container.is(e.target) && container.has(e.target).length == 0 && !catmodal) {
                $("#post").hide();
                $("#submitbutton3").hide();
                $("#form1").hide();
                $("#tagsID").hide();
                $("#tagsID+.tag-editor").hide();
                $(".popupwrapper").hide();
                $(".submitbutton3").hide();
                $(".submitbutton2").hide();
                $("newDivs").hide();
                $(".titlebar").hide();
                $("tagsbar").hide();
                $("categorybar").hide();
                $(".categorycontainer").hide();
                $("#myModal").hide();
            }
        });
// --------------------------------------------------------------------------------------------------------
        $(document).mouseup(function(e) {
            var container = $("#myModal.modal-content");
            if (!container.is(e.target) && container.has(e.target).length == 0) {
                $("#myModal").hide();
            }
        });
///////////////////////////////////////   CHAT AND NOTIFICATIONS   //////////////////////////////////////////////
var url = "https://iitoverflow.herokuapp.com/api/";
// var url = "http://localhost:3000/api/";
// var socketUrl = 'http://localhost:3000';
var socketUrl = "https://iitoverflow.herokuapp.com";
var user = "{{ user | tojson }}";
console.log(user);
var socketUser = "{{ user.id |safe}}";
//var socketUser =2;
var questionFollowing = [{
    "id": 1,
    "question": "What is C++",
    "questiondesc": "hahAHaha",
    "createdAt": "2018-05-19T09:35:27.000Z",
    "updatedAt": "2018-05-19T09:35:27.000Z",
    "deletedAt": null,
    "userId": 1,
    "categoryId": 1
}];
var userFollowing = [{
    "id": 1
}];
var interests = [{
    "id": 1
}];
const chatSocket = io(socketUrl + '/chat');
const notificationSocket = io(socketUrl + '/notification');
chatSocket.on('connection', function(socket) {
    console.log("connected");
});
chatSocket.on('wentOffline', function(data) {
    $("#user_" + data.user + "_status").attr("class", "");

    console.log(data.user, " is now offline");
});
chatSocket.on('wentOnline', function(data) {
    $("#user_" + data.user + "_status").attr("class", "contact-status online");

    console.log(data.user, " is now online");
});
notificationSocket.on('newQuestion', function(data) {
    console.log("New Question");
    console.log(data);

    if (!data.user.picture) {
        data.user.picture =
            "http://128.199.115.0:9000/profile/1525848116220_11_660d3813f01744a62ed30efef4db4b8483480ac4_1525848129695.jpg";
    }
    var holdNewQuestionHtml = "";
    if (data.question.userId != socketUser)
        if ($.grep(userFollowing, function(obj) {
                return obj.id === data.question.userId;
            })[0] || $.grep(interests, function(obj) {
                return obj.id === data.question.categoryId;
            })[0]) {
            holdNewQuestionHtml +=
                '<li><a href="/Question/' + data.question.id +
                '" class="notification-box"><div class="row"><div class="col-lg-3 col-sm-3 col-3 text-center"><img src="' +
                data.user.picture +
                '" class="w-50 img-circle" width="30" height="30" ></div><div class="col-lg-8 col-sm-8 col-8"><strong class="text-info">' +
                data.user.displayname + '</strong> posted a new Question: ' + data.question.question +
                '<div><small class="text-warning">' + getDate(data.question.createdAt) +
                '</small> </div></div> </div></a></li>';
            $("#notification-content").append(holdNewQuestionHtml);

        }
});
notificationSocket.on('newAnswer', function(data) {
    if (!data.user.picture) {
        data.user.picture =
            "http://128.199.115.0:9000/profile/1525848116220_11_660d3813f01744a62ed30efef4db4b8483480ac4_1525848129695.jpg";
    }
    var holdNewAnswerHtml = "";
    if (data.answer.userId != socketUser);
    if (data.question.userId == socketUser) {
        holdNewAnswerHtml +=
            '<li><a href="/Question/' + data.question.id +
            '" class="notification-box"><div class="row"><div class="col-lg-3 col-sm-3 col-3 text-center"><img src="' +
            data.user.picture +
            '" class="w-50 img-circle" width="30" height="30" ></div><div class="col-lg-8 col-sm-8 col-8"><strong class="text-info">' +
            data.user.displayname + '</strong> answered your question: ' + data.answer.answer +
            '<div><small class="text-warning">' + getDate(data.answer.createdAt) +
            '</small> </div></div> </div></a></li>';

        $("#notification-content").append(holdNewAnswerHtml);
    } else if ($.grep(questionFollowing, function(obj) {
            return obj.id === data.question.id;
        })[0]) {
        holdNewAnswerHtml +=
            '<li><a href="/Question/' + data.question.id +
            '" class="notification-box"><div class="row"><div class="col-lg-3 col-sm-3 col-3 text-center"><img src="' +
            data.user.picture +
            '" class="w-50 img-circle" width="30" height="30" ></div><div class="col-lg-8 col-sm-8 col-8"><strong class="text-info">' +
            data.user.displayname + '</strong> answered a question you\'re following: ' + data.answer.answer +
            '<div><small class="text-warning">' + getDate(data.answer.createdAt) +
            '</small> </div></div> </div></a></li>';

        $("#notification-content").append(holdNewAnswerHtml);
    }

    console.log("New Answer");
    console.log(data);
});
notificationSocket.on('newComment', function(data) {
    if (!data.user.picture) {
        data.user.picture =
            "http://128.199.115.0:9000/profile/1525848116220_11_660d3813f01744a62ed30efef4db4b8483480ac4_1525848129695.jpg";
    }
    var holdNewAnswerHtml = "";
    if (data.answer.userId == socketUser && data.comment.userId != socketUser) {
        holdNewAnswerHtml +=
            '<li><a href="/Question/' + data.question.id +
            '" class="notification-box"><div class="row"><div class="col-lg-3 col-sm-3 col-3 text-center"><img src="' +
            data.user.picture +
            '" class="w-50 img-circle" width="30" height="30" ></div><div class="col-lg-8 col-sm-8 col-8"><strong class="text-info">' +
            data.user.displayname + '</strong> commented on your answer: ' + data.comment.comment +
            '<div><small class="text-warning">' + getDate(data.comment.createdAt) +
            '</small> </div></div> </div></a></li>';

        $("#notification-content").append(holdNewAnswerHtml);
    }
    console.log("New Comment");
    console.log(data);
});
chatSocket.on('message', function(data) {

    console.log(data);

    m_pic = data.user.picture;

    if (popups.indexOf("solo_" + data.message.conversationId) > -1) {


        var m_element =
            '<div class="row msg_container base_receive"><div class="col-md-2 col-xs-2 avatar"><img src="' +
            m_pic +
            '" class=" img-responsive "></div><div class="col-md-10 col-xs-10"><div class="messages msg_receive"><p>' +
            data.message.message +
            '</p><time style ="text-align:left;" datetime="2009-11-13T20:00">' +
            data.user.displayname +
            '</time></div></div></div>';

        $("#m_solo_" + data.message.conversationId).append(m_element);



        var panel = $("#m_solo_" + data.message.conversationId);
        //$('#m_'+id).animate({scrollTop: $('#m_'+id).get(0).scrollHeight}, 700);
        $("#m_solo_" + data.message.conversationId).scrollTop($(
                "#m_solo_" + data.message.conversationId).get(0)
            .scrollHeight);
    } else if ($("#unread_solo_" + data.message.conversationId).length) {
        if ($("#unread_solo_" + data.message.conversationId).html() == '') {
            $("#unread_solo_" + data.message.conversationId).html("1");
        } else {
            var holdValue = parseInt($("#unread_solo_" + data.message.conversationId).html());
            console.log(holdValue++);
            $("#unread_solo_" + data.message.conversationId).html(holdValue);
        }
    }
});
chatSocket.emit("connected", {
    id: socketUser
});
sendMessage2 = function() {
    //console.log($("#message").val());
    chatSocket.emit("messageSent", $("#message").val());

}

getDate = function(date) {

    var date2 = new Date().getTime() - new Date(date).getTime();

    var seconds = Math.floor(date2 / 1000);

    if (Math.floor(seconds / 3600) >= 24)
        return new Date(date).toUTCString();

    if (Math.floor(seconds / 3600))
        return "" + Math.floor(seconds / 3600) + " hours ago";

    if (Math.floor(seconds / 60))
        return "" + Math.floor(seconds / 60) + " minutes ago";

    if (Math.floor(seconds / 1))
        return "" + Math.floor(seconds / 1) + " seconds ago";

    return "Just now";
    return new Date(date).toUTCString();



}

hello = function() {
    console.log("hello");
}
//var url = "http://localhost:3000/api/";
function isOnline(online, id) {
    console.log("online: ", online);
    return (online ? '<span id="user_' + id + '_status" class="contact-status online"></span>' : '<span id="user_' + id + '_status"></span>');
}

function reloadchatlist() {
    $.ajax({
        url: url + "users/" + socketUser + "/chatlist",
        method: 'get',
        dataType: "JSON",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            console.log(data);
            var convolist = data;
            var convoStore = "";
            var profilepic;
            for (var i = 0; i < convolist.length; i++) {


                profilepic = convolist[i].profilepic;
                convoStore += '<div class="sidebar-name " onclick="javascript:register_popup( \'' +
                    convolist[i].id + '\',\'' + convolist[i].displayname +
                    '\');"> <div class="convoName"><a class="wrap"style="position: relative;">' + isOnline(convolist[i].online, convolist[i].userid) + '<img class="img-circle" width="30" height="30" src="' +
                    profilepic + '" /><span>' + convolist[i].displayname + '</span>';

                // if (convolist[i].unread > 0) {
                convoStore += '<span id="unread_' + convolist[i].id +
                    '" style="position: absolute;bottom: -2px;left: -2px;"  class="label label-danger">' +
                    (convolist[i].unread == 0 ? '' : convolist[i].unread) + '</span>';
                //}


                convoStore += '</a></div></div>';
            }

            $("#convos").html(convoStore);
            
        },
        error: function(data) {}
    });

    return true;
}
$(document).ready(function() {
    var chatHtml = '<div class="container sideChatContainer">' +
        '<div id="sideChat">' +
        '<div id="sideChatHeader" type="button" class="btn btn-primary chatBtn" data-toggle="collapse" data-target="#chatBody" style="display: inline-flex;">' +
        '<div style="width: 200px;">' +
        '<label  id="chatLabel" style="float:left;padding-left:10px;padding-top: 2px;">Chat </label>' +
        '</div>' +
        '<div >' +
        '<!--<a  id = "optionBtn" role="button" class="glyphicon glyphicon-cog button" data-target="Options" data-toggle="collapse2" data-hover="tooltip" data-tooltip-content="Options" data-tooltip-position="below" style="font-size: 15px;text-decoration: none;"></a>-->' +
        '</div>' +

        '</div>' +
        '<div id="chatBody" class="collapse">' +

        '<div id="convos" class="chat-sidebar tabcontent convos" style="padding-top: 2px;overflow-y: scroll;">' +

        '</div> </div></div></div>';
    $("#sideChat").replaceWith(chatHtml);
    $('.chatBody').collapse();

    reloadchatlist();


});
$('#optionBtn').click(function(e) {
    e.stopPropagation();
});

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("chat-sidebar");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function() {
    $('.chatBody').collapse();

});
var m_pic;
var m_id;
var m_element
$(document).ready(function() {

    if (popups.length > 0) {
        $.ajax({
            url: "/updateChat",
            method: "GET",
            data: {
                id: popups
            },
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {

                //console.log(data);
                if (data.length != 0) {
                    //console.log(popups);
                    //console.log(data[0].id)


                    for (var i = 0; i < data.length; i++) {


                        if (data[i].profilePic != null) {
                            m_pic = "/avatar/" + data[i].profilePic;
                        } else {
                            m_pic =
                                "http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg";
                        }

                        if (popups.indexOf("solo_" + data[i].conversationId) > -1) {


                            m_element =
                                '<div class="row msg_container base_receive"><div class="col-md-2 col-xs-2 avatar"><img src="' +
                                m_pic +
                                '" class=" img-responsive "></div><div class="col-md-10 col-xs-10"><div class="messages msg_receive"><p>' +
                                data[i].message +
                                '</p><time style ="text-align:left;" datetime="2009-11-13T20:00">' +
                                data[i].firstname + ' ' + data[i].lastname +
                                '</time></div></div></div>';

                            $("#m_solo_" + data[i].conversationId).append(m_element);



                            var panel = $("#m_solo_" + data[i].conversationId);
                            //$('#m_'+id).animate({scrollTop: $('#m_'+id).get(0).scrollHeight}, 700);
                            $("#m_solo_" + data[i].conversationId).scrollTop($(
                                    "#m_solo_" + data[i].conversationId).get(0)
                                .scrollHeight);
                        }
                    }

                }


            },
            error: function(data) {


            }

        });
    }
    //code goes here that will be run every 5 seconds.    
});

function urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url, b, c) {
        var url2 = (c == 'www.') ? 'http://' + url : url;
        return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
    })
}

function sendMessage($id, $message, $this, $message_panel) {
    if ($message != '') {
        $this.parents('.popup-box').find('.chat_input').val('');
        $.ajax({
            url: url + "users/" + socketUser + "/conversation/" + $id.split("_")[1],
            method: "POST",
            data: {
                msg: $message
            },
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                var $element = '';
                var profilepic;

                profilepic = user.picture;

                $element += '<div id="' + data.id +
                    '"  class="row msg_container base_sent"><div class="col-md-10 col-xs-10"><div class="messages msg_sent"><p>';
                $element += $message;
                $element +=
                    '</p><time class ="time"datetime="2009-11-13T20:00">You</time></div></div><div class="col-md-2 col-xs-2 avatar"><img src="' +
                    profilepic + '" class=" img-responsive "></div></div>';
                $hold = $($element);
                $message_panel.append($hold);
                //$message_panel.animate({ scrollTop: $(element).offset().top }, 1000);
                $message_panel.animate({
                    scrollTop: $message_panel.get(0).scrollHeight
                }, 700);

            },
            error: function(data) {
            }
        });
    }

}

$(document).on('keyup', '.chat_input', function(e) {
    if (e.which === 13) {
        //return sendMessage(getMessageText());
        var $this = $(this);
        var $message = urlify($this.parents('.popup-box').find('.chat_input').val().trim());
        var $message_panel = $this.parents('.popup-box').find('.popup-messages');
        var $id = $this.parents('.popup-box').attr('id');

        sendMessage($id, $message, $this, $message_panel)
    }
});

$(document).on('click', '.popup-box button.btn-chat', function(e) {

    var $this = $(this);
    var $message = urlify($this.parents('.popup-box').find('.chat_input').val().trim());
    var $message_panel = $this.parents('.popup-box').find('.popup-messages');
    var $id = $this.parents('.popup-box').attr('id');
    sendMessage($id, $message, $this, $message_panel);

});

$(document).on('click', '.panel-heading span.icon_minim', function(e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.popup-box').find('.message_body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.popup-box').find('.message_body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};
//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;
//arrays of popups ids
var popups = [];
//this is used to close a popup
function close_popup(id) {

    for (var iii = 0; iii < popups.length; iii++) {
        if (id == popups[iii]) {
            Array.remove(popups, iii);
            document.getElementById('b_' + id).style.display = "block";
            document.getElementById(id).style.display = "none";
            //$("#"+id).remove();
            $("#" + id + " span.icon_minim").removeClass('glyphicon-plus').addClass('glyphicon-minus');

            calculate_popups();
            return;
        }
    }
}
//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups() {
    var right = 330;
    var iii = 0;
    for (iii; iii < total_popups; iii++) {
        if (popups[iii] != undefined) {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 280;
            element.style.display = "block";
        }
    }
    for (var jjj = iii; jjj < popups.length; jjj++) {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}
//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name) {
    for (var iii = 0; iii < popups.length; iii++) {
        //already registered. Bring it to front.
        if (id == popups[iii]) {
            Array.remove(popups, iii);
            popups.unshift(id);
            calculate_popups();
            return;
        }
    }
    var element = '<div class="popup-box chat-popup" id="' + id + '" > ';
    element = element + '<div class="panel-heading popup-head" >';
    element = element + '<div class="popup-head-left">' + name + '</div>';
    element = element +
        '<div class="popup-head-right"><a ><span id="minim_chat_window" class="glyphicon glyphicon-minus icon_minim"></span></a><a href="javascript:close_popup(\'' +
        id + '\');">&#10005;</a></div>';
    element = element + '<div style="clear: both"></div></div><div id="b_' + id + '" class="message_body ' + id +
        '" ><div id="m_' + id + '" class="popup-messages">';
    element +=
        '</div><div class="input-group" style="padding-top:4px;padding-bottom:4px;"><input id="btn-input" class="form-control input-sm chat_input" placeholder="Write your message here..." type="text" style="float:bottom"><span class="input-group-btn"><button class="btn-chat btn btn-primary btn-sm">Send</button> </span></div></div></div>';
    // Insert msg body
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML +
        element;
    popups.unshift(id);
    calculate_popups();
    $.ajax({
        url: url + "/users/" + socketUser + "/conversation/" + id.split("_")[1],
        method: "GET",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            var element = '';
            data = data;
            var pic;
            for (var i = 0; i < data.length; i++) {
                var $messageData = data[i];
                pic = $messageData.picture;
                console.log("message", $messageData);
                console.log("sender: ", $messageData.senderid, " user: ", socketUser);
                if ($messageData.senderid == socketUser) {
                    element +=
                        '<div class="row msg_container base_sent"><div class="col-md-10 col-xs-10"><div class="messages msg_sent"><p>' +
                        $messageData.message +
                        '</p><time datetime="2009-11-13T20:00">You</time></div></div><div class="col-md-2 col-xs-2 avatar"><img class="chatvatar" src="' +
                        pic + '" class=" img-responsive "></div></div>';
                } else {
                    element +=
                        '<div class="row msg_container base_receive"><div class="col-md-2 col-xs-2 avatar"><img src="' +
                        pic +
                        '" class=" img-responsive "></div><div class="col-md-10 col-xs-10"><div class="messages msg_receive"><p>' +
                        $messageData.message +
                        '</p><time style ="text-align:left;" datetime="2009-11-13T20:00">' + $messageData.displayname + '</time></div></div></div>';
                }
            }
            $("#m_" + id).empty();
            $("#m_" + id).append(element);
            var panel = $('#m_' + id);
            //$('#m_'+id).animate({scrollTop: $('#m_'+id).get(0).scrollHeight}, 700);
            $('#m_' + id).scrollTop($('#m_' + id).get(0).scrollHeight);
        },
        error: function(data) {
        }
    });
    document.getElementById(id).style.display = "block";
    $("#unread_" + id).html('');
}
//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups() {
    var width = window.innerWidth;
    if (width < 540) {
        total_popups = 0;
    } else {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width / 320);
    }
    display_popups();
}
//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);