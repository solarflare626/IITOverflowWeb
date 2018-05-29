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
// --------------------------------------------------------------------------------------------------------
///////////////////////////////////////   INITIALIZE   ////////////////////////////////////////////// 
    $('#tagsID').tagEditor({
        autocomplete: {
            delay: 0, // show suggestions immediately
            position: {
                collision: 'flip'
            }, // automatic menu position up/down
            source: []
        },
        forceLowercase: false,
    });
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
                        $('#toReload').load(location.href + '#toReload')
                            //alert('reloaded');
                    },
                    error: function(result) {
                        alert(result);
                    }
                });
            }
        });
///////////////////////////////////////   ON BUTTON CLICKS   //////////////////////////////////////////////
    $(document).on('#title', 'focus', function() {
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
                    qid = result.id
                    var tagslength = cleartags.length
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
        $('#toReload').load(location.href + '#toReload');
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
                    $(document).mouseup(function(e) {
                            var container = $("#myModal.modal-content");
                            if (!container.is(e.target) && container.has(e.target).length == 0) {
                                $("#myModal").hide();
                            }
                        });
                        $("#hider").click(function() {
                            $("#hider").fadeOut("slow");
                            $("#form2").hide("slow");
                        });

                        

                        function showhide1(id) {

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
                            var x = document.getElementById("duplicate_" + id);
                            if (x.style.display === "none") {
                                x.style.display = "block";
                                $("#hider").fadeOut("slow");
                            } else {
                                x.style.display = "none";
                                $("#hider").fadeOut("slow");
                            }
                        }
                        $('.answerbutton').click(function() {
                            var id = $(this).attr('id');
                            //alert(id);
                            //alert($('.answertextarea').attr('id'));
                            $('.answertextarea#answer_' + id).focus();
                        });

                        $('.commentbutton').click(function() {
                            $('.commenttextarea').focus();
                        });