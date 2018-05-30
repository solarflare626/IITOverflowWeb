$('#autocomplete').autocomplete({
                source: function (request, response) {
                    var test = encodeURIComponent(request.term);
                    $.ajax({
                        url: "http://iitoverflow.herokuapp.com/api/Questions?filter[where][question][ilike]=%25"+test+"%25",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.question,
                                    value: item.question
                                }
                            }));
                        }
                    });
                }

            });

alert = function() {
    // console.trace(alert)
};

var input = document.getElementById("autocomplete");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("autocom").click();
    }
});