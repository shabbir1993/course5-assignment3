(function () {
    'use strict';
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .constant('urlRestaurantServices', "https://davids-restaurant.herokuapp.com")
      .component('foundItems', {
        templateUrl: 'foundItems.html',
        bindings: {
          items: '<',
          title: '@',
          onRemove: '&',
          search: '<'
        }
    });


    NarrowItDownController.$inject = ['MenuSearchService'];
    MenuSearchService.$inject = ['$http', 'urlRestaurantServices'];

    function NarrowItDownController(MenuSearchService) {
      var menu = this;
      menu.searchTerm = '';

      menu.narrow = function(searchTerm) {
        MenuSearchService.getMatchedMenuItems(searchTerm)
          .then(function (response) {
            menu.found = response;
            menu.title = (menu.found.length+" item(s) found");
            menu.filter = searchTerm;
        })
      };
      menu.removeItem = function(itemIndex) {
        menu.found.splice(itemIndex, 1);
        menu.title = (menu.found.length+" item(s) found");
      };
    }


    function MenuSearchService($http, urlRestaurantServices) {
      var service = this;

      service.getMatchedMenuItems = function(searchTerm) {
        return $http({method: "GET", url: (urlRestaurantServices + "/menu_items.json")})
        .then(function (response) {
          var allItems = response.data.menu_items;
          var foundItems = [];

          if (searchTerm.length == 0) {
            allItems = [];
          } else {
          var x;
          for (x in allItems) {
            var str = allItems[x].description;
            if (str.toLowerCase().indexOf(searchTerm) >= 0) {
              foundItems.push(allItems[x]);
            }
          }
        }
        return foundItems;
        })
      };
    }
})();
