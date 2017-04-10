/// <reference path="angular.min.js" />

(function () {
    
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController) 
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)
    .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");
    

    function FoundItems(){

        var ddo = {
           templateUrl : 'foundItems.html',
           scope: {
              theItems: '<',
              onRemove: '&'
       
           },
           controller: FoundItemsDirectiveController,
           controllerAs: 'list',
           bindToController: true
       
         };
       
 	 return ddo;
    }

    function FoundItemsDirectiveController() {
        var list = this;

    }
    //beginning of the main controller
    NarrowItDownController.$inject = ['MenuSearchService']
    function NarrowItDownController(MenuSearchService) {
        var menu = this;

       
        menu.getMyItems = function (searchTerm) {
            
            if (searchTerm === "") {
                menu.warn = true;
                return 1;
            }

            var mspromise = MenuSearchService.getMatchedMenuItems(searchTerm);
            mspromise.then(function (result) {
                
                menu.found = result;
                if (menu.found.length < 1) {
                    menu.warn = true;
                    console.log(menu.found.length);
                } else {
                    menu.warn = false;
                    console.log(menu.found.length);
                }


            }).catch(function (error) {
                console.log(error);
            });
           
        };


        menu.removeItem = function (itemIndex) {
            menu.found.splice(itemIndex, 1);

        };

    }


    //Beginning of MenuSearchService
    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchedTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function (result) {
                //processing returned items to return those we are interested in

                var foundItems = [];
                for (var i = 0; i < result.data.menu_items.length; i++) {
                    var description = result.data.menu_items[i].description;
                    
                    //try and make search term to be in lower too, later on
                    if (description.toLowerCase().indexOf(searchedTerm) !== -1) {
                        foundItems.push(result.data.menu_items[i]);
                    }
                }
                return foundItems;
            }).catch(function (error) {
                console.log(error);
            });

        };


    }
    //end of MenuSearchService


})();
