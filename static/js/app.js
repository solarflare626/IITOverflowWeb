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
                            }));
                        }
                    });
                }

            });

