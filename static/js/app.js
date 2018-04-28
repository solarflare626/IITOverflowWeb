$('#autocomplete').autocomplete({
                source: function (request, response) {
                    $.ajax({
                      //  url: "http://127.0.0.1:3000/api/Tags?filter=%7B%20%22fields%22%3A%20%7B%22id%22%3A%20true%2C%20%22name%22%3A%20true%2C%20%22createdAt%22%3A%20false%2C%20%22updatedAt%22%3A%20false%2C%20%22deletedAt%22%3A%20false%2C%20%22categoryID%22%3A%20false%7D%7D",
                        url: "http://127.0.0.1:3000/api/Tags?filter=%7B%20%22where%22%20%3A%7B%20%22name%22%20%3A%20%7B%20%22like%22%3A%20%22%25"+request.term+"%25%22%7D%7D%7D",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {;
                            console.log(request);
                            console.log(data);
                            response($.map(data, function (item) {

                                return {
                                    label: item.name,
                                    value: item.name
                                }
                            }));
                        }
                    });
                },

            })

