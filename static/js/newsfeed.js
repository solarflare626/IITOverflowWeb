    $("#submitbutton3").click(function() {


        var editorText = CKEDITOR.instances.textarea.getData();
        var posttitle = document.getElementById('title').value
        var gettags = document.getElementById('tagsID').value
        var cleartitle = document.getElementById('title');
        var cleartags = document.getElementsByClassName('tag-editor-tag');
        var category = $('.popup').attr('id');
        $('#post').fadeOut('slow');
        $(this).fadeOut('slow');
        //alert(category)





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
                        }
                        console.log(cleartags[i].innerText);

                        // EDIT

                        $.ajax({
                            type: "POST",
                            url: "http://iitoverflow.herokuapp.com/api/Questions/" + qid + "/tags",
                            data: JSON.stringify(data1),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(result) {
                                //alert('ok');

                            },
                            error: function(result) {
                                //alert(result);
                                console.log(JSON.stringify(result));
                            }
                        });

                        // EDIT

                    }

                    var question = '<div id="newqedit_' + result.id + '" style="display: block;" class="newdiv">';
                    question += '<div class="titlepost">Title: ' + result.question + ' <i onclick="showhide(' + result.id + ')" class="fa fa-reply"></i> <i id="' + result.id + '" class="fa fa-heart qheart" name="mark as duplicate"></i><div></div>';


                    question += '<button class="btn btn-danger" id= "duplicate_' + result.id + '" style="display: none;">DUPLICATE</button>'

                    question += '<div class="titlepost">'

                    question += '<div class="titlepostpicture">{{ user.picture }}</div>'

                    question += '<h4 class="titlepostname">{{ user.displayname }}</h4>'

                    question += ' <div class=" editanddeleteButtonCont"><i onclick="showhide(' + result.id + ')" class="fa fa-edit Newsfeed-editButton "></i><i id=' + result.id + 'class="fas fa-trash-alt qheart"></i><i onclick="showhide1(' + result.id + ')" class="fas fa-copy duplicate"></i></div>'

                    for (i = 0; i < tagslength; i++) {

                        question += '<h5 class="titlepostTitle">Title: ' + result.question + '</h5>'
                        question += ' </div>'


                        question += '<div class="categorypost">Category:' + result.question + '<div></div></div>'

                        question += '<div class="tagspost">Tags:' + result.cleartags + ' <div></div></div>'


                        question += '<div class="newpostbuttons"><button class="follow followbutton"><span class="msg-follow">Follow</span><span class="msg-following">Following</span><span class="msg-unfollow">Unfollow</span></button><button class="votebutton">Vote</button><button><button class="commentbutton">Comment</button><button class="answerbutton">Answer</button></div>'



                        question += ' <div>'



                        question += '<div class="titlepost">'

                        question += '<div class="answerdiv"><textarea class="answertextarea" id= "result.id" placeholder="Write an Answer"> </textarea><input class="submitanswerbutton" id=' + result.question + ' value=submit type="button"><div></div></div>'


                        question += '<div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div></div></div>';


                        // question += '<div class="descriptionpost">Description:' + result.questiondesc + '<div></div></div><div class="categorypost">Category: ' + result.categoryId + ' <div></div></div><div class="tagspost">Tags: ' + result.cleartags + '<div></div></div><div class="newpostbuttons"><button class="followbutton">Follow</button><button> </button><button class="votebutton">Vote</button><button></button><button class="commentbutton">Comment</button><button></button><button class="answerbutton">Answer</button><button><div></div></button></div><!-- TOEDIT --><div></div><!-- TOEDIT --><div class="answerdiv"><textarea class="answertextarea" id="answer_5" placeholder="Write an Answer"> </textarea><input class="submitanswerbutton" id="5" value="submit" type="button"><div></div></div><div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div></div></div>';
                        $("#newsfeedParent").prepend(question);

                        //$("#newsfeedParent").html( question +$("#newsfeedParent").html());
                        $('#toReload').load(location.href + ' #toReload')


                        $('.tag-editor-tag').html("");




                        question += '<div class="answerdiv"><textarea class="answertextarea" id= "result.id" placeholder="Write an Answer"> </textarea><input class="submitanswerbutton" id=' + result.question + ' value=submit type="button"><div></div></div>'






                    },
                    error: function(result) {
                        //alert('error');
                    }
                });

            // question += '</div>';

            //var displaytitle = document.getElementById('titlebarid');
            $("#form1").hide('slow'); $(".submitbutton2").hide('slow'); $(".popupwrapper").hide('slow'); $(".tagsarea").hide('slow'); $("#tagsID+.tag-editor").hide('slow'); $(".submitbutton3").hide('slow'); $("newDivs").show('slow'); $(".titlebar").show('slow'); $("tagsbar").show('slow'); $("categorybar").show('slow');

            $('#newDivs').append('<div class="titlepost">' + 'Title: ' + posttitle + '<div>');

            $('#newDivs').append('<div class="descriptionpost">' + 'Description: ' + editorText + '<div>');

            $('#newDivs').append('<div class="categorypost">' + 'Category: ' + catty + '<div>'); $('#newDivs').append('<div class="tagspost">' + 'Tags: ' + gettags + '<div>'); $('#newDivs').append('<div class="newpostbuttons"><button class="followbutton">Follow<button> <button class="votebutton" >Vote<button><button class="commentbutton">Comment<button><button class="answerbutton">Answer<button><div>'); $('#newDivs').append('<div class="answerdiv"><textarea class="answertextarea" placeholder="Write an Answer"></textarea><input class="submitanswerbutton" type="button" value="submit"><div>'); $('#newDivs').append('<div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div>'); cleartitle.value = "";

            selectedCategory.text = "";



        })


    function CKupdate() {
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
            CKEDITOR.instances[instance].setData('');
        }
    }
    $('#tagsID').tagEditor({

        autocomplete: {
            delay: 0, // show suggestions immediately
            position: {
                collision: 'flip'
            }, // automatic menu position up/down
            source: ['notch', 'qb', 'daku']


        },
        forceLowercase: false,

    }); $(".categorybutton").on("click", function() {
        $("#myModal").show();
        $("#myModal").css("z-index", "10002");
    });
    var catty, cattyid, selectedCategory, btn; $('.categorypopups').on('click', function() {
        selectedCategory = document.getElementsByClassName('popup');
        catty = this.text;
        cattyid = $(this).attr('id');
        ////alert(cattyid);
        var text2 = document.createTextNode(catty);
        //selectedCategory.setAttribute('id', cattyid)
        $('.popup').attr('id', cattyid);

        var modal = document.getElementById('myModal');

        modal.style.display = 'none';
        $('.categorybutton').append(text2);



    });

    $(".heart").on('click', function() {
            console.log($(this));
            var delbutton = $(this).attr('id');
            //alert(delbutton)
            $.ajax({
                type: "DELETE",
                url: "http://iitoverflow.herokuapp.com/api/Answers/" + delbutton,
                success: function(result) {
                    //alert('ok');
                    $('#toReload').load(location.href + ' #toReload')

                },
                error: function(result) {
                    //alert(result);
                }
            });



        },
        error: function(result) {
            //alert(result);
        }
    });

    })

    $(".qheart").on('click', function() {
        console.log($(this));
        var qdelbutton = $(this).attr('id');


    })

    //alert(qdelbutton)
    $.ajax({
    type: "DELETE",
    url: "http://iitoverflow.herokuapp.com/api/Questions/" + qdelbutton,
    success: function(result) {
        //alert('ok');


    },
    error: function(result) {
        //alert(result);
    }
    });




    })


    $(".submitbutton5").click(function() {


                var qid = $(this).attr('id');
                var editorText = CKEDITOR.instances.textarea.getData();
                var posttitle = document.getElementById('titleedit').value;
                var gettags = document.getElementById('tagsIDedit').value;
                var cleartitle = document.getElementById('titleedit');
                var cleartags = document.getElementsByClassName('tag-editor-tag');
                console.log(cleartags);
                // var category = document.getElementsByClassName('categorypopups')[0].id;

                $(".submitbutton5").click(function() {

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


                                                        // EDIT

                                                        $.ajax({
                                                            type: "POST",
                                                            url: "http://iitoverflow.herokuapp.com/api/Questions/" + qid + "/tags",
                                                            data: JSON.stringify(data1),
                                                            dataType: "json",
                                                            contentType: "application/json",

                                                            success: function(result1) {
                                                                // //alert('ok');
                                                                console.log(result1);

                                                                // EDIT

                                                            },
                                                            error: function(result1) {
                                                                ////alert(result1);
                                                                console.log(JSON.stringify(result1));
                                                            }
                                                        });

                                                        success: function(result1) {
                                                            // //alert('ok');
                                                            console.log(result1);




                                                            // EDIT

                                                        }


                                                        // EDIT






                                                        // $("#newsfeedParent").load(location.href + " #contentCenter");

                                                    },
                                                    error: function(result) {
                                                        //alert('error');
                                                    }
                                                });






                                        })


                                    //  $('.newpostinput').keydown(function (e){
                                    //  if(e.keyCode == 13){
                                    //      //alert('you pressed enter ^_^');
                                    //      var aid = $(this).attr('id');
                                    //      var commentText = document.getElementsByClassName('commenttextarea');
                                    //      var data = {
                                    //          "answerId": aid,           
                                    //          "comment":  commentText
                                    //      }
                                    //      $.ajax({
                                    //                      type: "POST",
                                    //                      url: "http://iitoverflow.herokuapp.com/api/Comments",
                                    //                      data: JSON.stringify(data),
                                    //                      dataType: "json",
                                    //                      contentType: "application/json",
                                    //                      success: function(result) {
                                    //                          //alert('ok');

                                    //                      },
                                    //                      error: function(result) {
                                    //                          //alert(result);

                                    //                      }
                                    //                  });





                                    //  }
                                    // }



                                        $(".submitbutton3").click(function() {


                                            var editorText = CKEDITOR.instances.textarea.getData();
                                            var posttitle = document.getElementById('title').value
                                            var gettags = document.getElementById('tagsID').value
                                            var cleartitle = document.getElementById('title');
                                            var cleartags = document.getElementsByClassName('tag-editor-tag');
                                            var category = $('.popup').attr('id');
                                            //alert(category)

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
                                                        }
                                                        console.log(cleartags[i].innerText);

                                                        // EDIT

                                                        $.ajax({
                                                            type: "POST",
                                                            url: "http://iitoverflow.herokuapp.com/api/Questions/" + qid + "/tags",
                                                            data: JSON.stringify(data1),
                                                            dataType: "json",
                                                            contentType: "application/json",
                                                            success: function(result) {
                                                                //alert('ok');

                                                            },
                                                            error: function(result) {
                                                                //alert(result);
                                                                console.log(JSON.stringify(result));
                                                            }
                                                        });

                                                        // EDIT

                                                    }

                                                    var question = '<div id="newqedit_' + result.id + '" style="display: block;" class="newdiv">';
                                                    question += '<div class="titlepost">Title: ' + result.question + ' <i onclick="showhide(' + result.id + ')" class="fa fa-reply"></i> <i id="' + result.id + '" class="fa fa-heart qheart"></i><div></div>';


                                                    question += '<button class="btn btn-danger" id= "duplicate_' + result.id + '" style="display: none;">DUPLICATE</button>'

                                                    question += '<div class="titlepost">'

                                                    question += '<div class="titlepostpicture"><img src="../static/images/phillip.jpg"></div>'

                                                    question += '<h4 class="titlepostname">Franco Jigo C. Pacana</h4>'

                                                    question += ' <div class=" editanddeleteButtonCont"><i onclick="showhide(' + result.id + ')" class="fa fa-edit Newsfeed-editButton "></i><i id=' + result.id + 'class="fas fa-trash-alt qheart"></i><i onclick="showhide1(' + result.id + ')" class="fas fa-copy duplicate"></i></div>'

                                                    question += '<h5 class="titlepostTitle">Title: ' + result.question + '</h5>'
                                                    question += ' </div>'

                                                    question += '<h5 class="titlepostTitle">Title: ' + result.question + '</h5>'
                                                    question += ' </div>'

                                                    question += ' <div class="descriptionpost">Description: ' + result.questiondesc + '<div></div></div>'

                                                    question += '<div class="categorypost">Category:' + result.question + '<div></div></div>'

                                                    question += '<div class="tagspost">Tags:' + result.cleartags + ' <div></div></div>'


                                                    question += '<div class="newpostbuttons"><button class="follow followbutton"><span class="msg-follow">Follow</span><span class="msg-following">Following</span><span class="msg-unfollow">Unfollow</span></button><button class="votebutton">Vote</button><button><button class="commentbutton">Comment</button><button class="answerbutton">Answer</button></div>'



                                                    question += ' <div>'




                                                    question += '<div class="answerdiv"><textarea class="answertextarea" id= "result.id" placeholder="Write an Answer"> </textarea><input class="submitanswerbutton" id=' + result.question + ' value=submit type="button"><div></div></div>'


                                                    question += '<div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div></div></div>';


                                                    // question += '<div class="descriptionpost">Description:' + result.questiondesc + '<div></div></div><div class="categorypost">Category: ' + result.categoryId + ' <div></div></div><div class="tagspost">Tags: ' + result.cleartags + '<div></div></div><div class="newpostbuttons"><button class="followbutton">Follow</button><button> </button><button class="votebutton">Vote</button><button></button><button class="commentbutton">Comment</button><button></button><button class="answerbutton">Answer</button><button><div></div></button></div><!-- TOEDIT --><div></div><!-- TOEDIT --><div class="answerdiv"><textarea class="answertextarea" id="answer_5" placeholder="Write an Answer"> </textarea><input class="submitanswerbutton" id="5" value="submit" type="button"><div></div></div><div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div></div></div>';



                                                    // question += '</div>';


                                                    $("#newsfeedParent").prepend(question);

                                                    //$("#newsfeedParent").html( question +$("#newsfeedParent").html());
                                                    $('#toReload').load(location.href + '#toReload')


                                                    $('.tag-editor-tag').html("");









                                                },
                                                error: function(result) {
                                                    //alert('error');
                                                }
                                            });

                                        },
                                        error: function(result) {
                                            //alert('error');
                                        }
                                    });


                                //var displaytitle = document.getElementById('titlebarid');
                                $("#form1").hide('slow'); $(".submitbutton2").hide('slow'); $(".popupwrapper").hide('slow'); $(".tagsarea").hide('slow'); $("#tagsID+.tag-editor").hide('slow'); $(".submitbutton3").hide('slow'); $("newDivs").show('slow'); $(".titlebar").show('slow'); $("tagsbar").show('slow'); $("categorybar").show('slow');

                                $('#newDivs').append('<div class="titlepost">' + 'Title: ' + posttitle + '<div>');

                                $('#newDivs').append('<div class="descriptionpost">' + 'Description: ' + editorText + '<div>');

                                $('#newDivs').append('<div class="categorypost">' + 'Category: ' + catty + '<div>'); $('#newDivs').append('<div class="tagspost">' + 'Tags: ' + gettags + '<div>'); $('#newDivs').append('<div class="newpostbuttons"><button class="followbutton">Follow<button> <button class="votebutton" >Vote<button><button class="commentbutton">Comment<button><button class="answerbutton">Answer<button><div>'); $('#newDivs').append('<div class="answerdiv"><textarea class="answertextarea" placeholder="Write an Answer"></textarea><input class="submitanswerbutton" type="button" value="submit"><div>'); $('#newDivs').append('<div class="newpostinput"><input class="commenttextarea" placeholder="Write a Comment"><div>'); cleartitle.value = "";

                                selectedCategory.text = "";



                            })


                        function CKupdate() {
                            for (instance in CKEDITOR.instances) {
                                CKEDITOR.instances[instance].updateElement();
                                CKEDITOR.instances[instance].setData('');
                            }
                        }

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

                                //COMMENT


                            }
                        });





                        $('.submitanswerbutton').click(function() {

                            var qid = $(this).attr('id');
                            //alert(qid);

                            var answer = $("#answer_" + qid).val();
                            // var answer = $('.answertextarea#' + qid ).val();  

                            var category = document.getElementById('')
                                //alert(answer);
                            var data = {
                                "answer": answer,
                                "questionId": qid,
                                "userId": "{{curuser}}"
                            }

                            $.ajax({
                                type: "POST",
                                url: "https://iitoverflow.herokuapp.com/api/Answers",
                                data: JSON.stringify(data),
                                dataType: "json",
                                contentType: "application/json",
                                success: function(result) {
                                    //alert('ok');
                                    $('#toReload').load(location.href + ' #toReload')
                                        //alert('reloaded');
                                },
                                error: function(result) {
                                    //alert(result);
                                }
                            });

                        })

                        $(document).ready(function() {
                            $(".submitbutton2").on('click', function() {
                                $("#form1").hide('slow');

                            })

                            $(".submitbutton4").on('click', function() {
                                $("#form2").hide('slow');

                            })


                            $(".submitanswerbutton").on('click', function() {

                            })
                        }) $(document).ready(function() {
                            $(".submitbutton2").on('click', function() {
                                $(".submitbutton3").hide('slow');
                            })
                        }) $(document).ready(function() {
                            $(".submitbutton2").on('click', function() {
                                $(".popupwrapper").hide('slow');
                            })
                        }) $(document).ready(function() {
                            $(".submitbutton2").on('click', function() {
                                $(".tagsarea").hide('slow');
                                $("#tagsID+.tag-editor").hide();
                            })
                        }) $(document).ready(function() {
                            $(".submitbutton2").on('click', function() {
                                $(this).hide('slow');
                            })



                        });

                        $('.categorypopups').click(function() {
                            var category = $(this).val();
                            var txt = $(this).text();
                            var id = $(this).attr('id');
                            var text = document.createTextNode(txt);
                            var popup = document.getElementsByClassName('popup');
                            $('#myModal').hide('slow');
                            popup.appendChild(text);
                            popup.setAttribute("id", id);
                            $(".categorycontainer").show();

                        });

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

                            $("#title").focus(function() {
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
                                //$("#postQuestionModal").fadeIn();

                                // $('#tagsID').tagEditor({
                                //      initialTags: ['Hello', 'World', 'Example', 'Tags'],
                                //    delimiter: ', ', /* space and comma */
                                //  placeholder: 'Enter tags ...',
                                //clickDelete: true,
                            });
                            //});
                        }); $(document).mouseup(function(e) {
                            var container = $(".askquestion");
                            var catmodal = $("#myModal").is(":visible");
                            // if the target of the click isn't the container nor a descendant of the container
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
                        }); $(document).mouseup(function(e) {
                            var container = $("#myModal.modal-content");
                            // if the target of the click isn't the container nor a descendant of the container
                            if (!container.is(e.target) && container.has(e.target).length == 0) {
                                $("#myModal").hide();
                            }
                        }); $("#hider").click(function() {

                            $("#hider").fadeOut("slow");
                            $("#form2").hide("slow");
                        });

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