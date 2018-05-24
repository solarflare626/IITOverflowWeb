$(document).ready(function () {


    class sideChat{

        constructor(obj){


        }
    }
    
        

    

    getDate = function (date) {

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


/*  Start chat  */

    function isOnline(online){
        console.log("online: ", online);
        return (online ? '<span class="contact-status online"></span>':'');
    }
    function reloadchatlist(chatUser) {
        if(chatUser){
        $.ajax({
            url: url + "users/"+chatUser+"/chatlist",
            method: 'get',
            dataType: "JSON",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                console.log(data);
                console.log("gasgas");
                var convolist = data;
                var convoStore = "";
                var profilepic;
                for (var i = 0; i < convolist.length; i++) {


                    profilepic = convolist[i].profilepic;
                    convoStore += '<div class="sidebar-name " onclick="javascript:register_popup( \'' +
                        convolist[i].id + '\',\'' + convolist[i].displayname +
                        '\');"> <div class="convoName"><a class="wrap"style="position: relative;">'+isOnline(convolist[i].online)+'<img class="img-circle" width="30" height="30" src="' +
                        profilepic + '" /><span>' + convolist[i].displayname + '</span>';

                    if (convolist[i].unread > 0) {
                        convoStore += '<span id="unread_' + convolist[i].id +
                            '" style="position: absolute;bottom: -2px;left: -2px;"  class="label label-danger">' +
                            convolist[i].unread + '</span>';
                    }


                    convoStore += '</a></div></div>';
                }

                $("#convos").html(convoStore);
            },
            error: function (data) {}
        });
    }

        return true;
    }
});
    

    $('#optionBtn').click(function (e) {
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

    $(document).ready(function () {
        $('.chatBody').collapse();

    }); 
    var m_pic;
    var m_id;
    var m_element
    $(document).ready(function () {

       
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
                    success: function (data) {

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
                    error: function (data) {


                    }

                });
            }
            //code goes here that will be run every 5 seconds.    

        

    });
    function urlify(text) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        //var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url, b, c) {
            var url2 = (c == 'www.') ? 'http://' + url : url;
            return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
        })
    }

    function sendMessage($id, $message, $this, $message_panel) {


        if ($message != '') {
            $this.parents('.popup-box').find('.chat_input').val('');


            $.ajax({
                url: url+"users/"+socketUser+"/conversation/"+$id.split("_")[1],
                method: "POST",
                data: {
                    msg: $message
                },
                dataType: "JSON",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (data) {
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
                error: function (data) {


                }
            });




        }

    }
    $(document).on('keyup', '.chat_input', function (e) {
        if (e.which === 13) {
            //return sendMessage(getMessageText());
            var $this = $(this);
            var $message = urlify($this.parents('.popup-box').find('.chat_input').val().trim());
            var $message_panel = $this.parents('.popup-box').find('.popup-messages');
            var $id = $this.parents('.popup-box').attr('id');

            sendMessage($id, $message, $this, $message_panel)
        }
    });
    $(document).on('click', '.popup-box button.btn-chat', function (e) {

        var $this = $(this);
        var $message = urlify($this.parents('.popup-box').find('.chat_input').val().trim());
        var $message_panel = $this.parents('.popup-box').find('.popup-messages');
        var $id = $this.parents('.popup-box').attr('id');


        sendMessage($id, $message, $this, $message_panel);

    });




    $(document).on('click', '.panel-heading span.icon_minim', function (e) {
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
    Array.remove = function (array, from, to) {
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

                calculate_popups();
                return;
            }
        }
    }
    //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
    function display_popups() {
        var right = 235;
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
            url: url+"/users/"+socketUser+"/conversation/"+id.split("_")[1],
            method: "GET",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                var element = '';
                data = data;
                var pic;

                for (var i = 0; i < data.length; i++) {

                    var $messageData = data[i];
                    pic = $messageData.picture;

                    console.log("message",$messageData);


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
                            '</p><time style ="text-align:left;" datetime="2009-11-13T20:00">'+$messageData.displayname  + '</time></div></div></div>';

                    }



                }
                $("#m_" + id).empty();
                $("#m_" + id).append(element);


                var panel = $('#m_' + id);
                //$('#m_'+id).animate({scrollTop: $('#m_'+id).get(0).scrollHeight}, 700);
                $('#m_' + id).scrollTop($('#m_' + id).get(0).scrollHeight);




            },
            error: function (data) {


            }
        });
        document.getElementById(id).style.display = "block";

        $("#unread_" + id).hide();



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


/*
<script>
for (let index = 1; index < 100; index++) {
  $.ajax({
            type: "DELETE",
            url: "http://iitoverflow.herokuapp.com/api/Interests/"+index,
            dataType: "json",
            success: function (resp) {
                console.log(resp);
            },
            error : function (err) {
              console.log(err);
        }
        });
      }
  

 
</script>*/