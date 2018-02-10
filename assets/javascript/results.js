var Results = function() {
    var _searchResult;
    var _data;
    var _dishData;
    var _db;

    function init() {
        _db = Common.getDatabase();
        initEventHandlers();
        _searchResult = getParameterByName("searchResult");
        getFoodData(_searchResult);
    }

    function initEventHandlers() {
        $("#searchButton").on("click", function(event) {
            event.preventDefault();
            var searchResult = $("#mySearch").val().trim();
            getFoodData(searchResult);
        });
    }

    //region API
    function getFoodData(dish) {
        var dishNameSearchURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/autocomplete";
        var numberOfDishes = 10;
        $.ajax({
            url: dishNameSearchURL,
            method: "GET",
            headers: {
                "X-Mashape-Key": "oD0quCJPwGmsh9p2ugkl92457MaKp1SDTMujsn6p1JeIntcBRt"
            },
            data: {
                number: numberOfDishes,
                query: dish
            },
            success: function(res, status) {
                // todo: show search parameters.
                _data = res;
                renderList();
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
    function searchDishInstructions() {

        var instructionSearchURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + $(this).attr("data-dishID") + "/information"
        $.ajax({
            url: instructionSearchURL,
            method: "GET",
            headers: {
                "X-Mashape-Key": "oD0quCJPwGmsh9p2ugkl92457MaKp1SDTMujsn6p1JeIntcBRt"
            },

            success: function(res, status) {
                _dishData = res;
                showDishInstructions();
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
    //endregion

    function renderList() {
        $("#dishDisplay").html(`
            <h3>These are your Results. Click on any of them for Recipes:<h3>
        `);
        for (var i = 0; i < _data.length; i++) {
            $("#dishDisplay").append(`
                <h5 class="btn dishLinks" data-dishID="${_data[i].id}">${_data[i].title}</h5><br> 
            `);
        }
        $(".dishLinks").on("click", searchDishInstructions);

        var selected = getParameterByName("dishid");

        if (selected) {
            $(`[data-dishid=${selected}]`).click();
        }
    }

    function showDishInstructions() {
        $("#selectionDisplay").html(`
                    <div>
                        <button class="btn btn-danger" id="favDishButton" data-dishid="${_dishData.id}"><i class="fas fa-heart"></i></button>
                        <h2>${_dishData.title}</h2>
                        <img src="${_dishData.image}">
                        <h3>Ingredients</h3>  
                        <div id="extendedIngredients"></div>
                        <h3>Instructions</h3>  
                        <div id="analyzedInstructions"></div>                      
                    </div>
                `);
        for (var i = 0; i < _dishData.extendedIngredients.length; i++) {
            $("#extendedIngredients").append(`
                        <p>${Number.isInteger(_dishData.extendedIngredients[i].amount) ? _dishData.extendedIngredients[i].amount : _dishData.extendedIngredients[i].amount.toFixed(2)} ${_dishData.extendedIngredients[i].unit} ${_dishData.extendedIngredients[i].name}</p>
                    `);
        }
        for (var j = 0; j < _dishData.analyzedInstructions[0].steps.length; j++) {
            $("#analyzedInstructions").append(`
                        <p>${_dishData.analyzedInstructions[0].steps[j].number}. ${_dishData.analyzedInstructions[0].steps[j].step}</p>
                    `);
        }
        $("#favDishButton").on("click", addToFavorites);
    }

    function addToFavorites() {
        var userID = Cookies.get("UserID");
        if (userID) {
            console.log(userID);
        } else {
            Cookies.set("redirectUrl", window.location.href + "&dishid=" + $(this).attr("data-dishid"));
            console.log("You are not logged in.");
        }
    }

    //region Helpers
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    //endregion

    return {
        init: init,
    };
}();

$(function () {
    Results.init();
});