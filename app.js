(function(){

'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
.directive('foundItemsList', foundItemsListDirective);

function foundItemsListDirective() {
  var ddo = {
    templateUrl: 'foundItemsList.html',
    scope: {
      items: '<',
      remove: '&'
    }
  };

  return ddo;
}


NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService)
{
  var menu = this;
  menu.searchItemDesc="";

  menu.getData = function()
  {
    menu.showMsg =false;
    if(menu.searchItemDesc === undefined || menu.searchItemDesc.length === 0)
    {
      menu.showMsg = true;
    }

    var promise = MenuSearchService.getMatchedMenuItems(menu.searchItemDesc);

    promise.then(function(response)
    {
      console.log("Response data:",response);
      if(response.length === 0)
      {
        menu.showMsg = true;
      }
      menu.menu_items = response;
    })
    .catch(function(error){
        console.log("Something went terribly wrong.");
      });
    };

    menu.RemoveItem = function(index)
    {
      //console.log("Inside RemoveItem");
      menu.menu_items.splice(index,1);
    };
}

MenuSearchService.$inject=['$http','ApiBasePath'];
function MenuSearchService($http,ApiBasePath)
{
  var service = this;

  service.getMatchedMenuItems = function(searchItemDesc) {
    return $http(
    {
      method:"GET",
      url:(ApiBasePath + "/menu_items.json")
    }).then(function (response)
    {
      var foundItems = [];
      for(var i=0;i<response.data.menu_items.length;i++)
      {
        if((searchItemDesc.length !== 0) && (response.data.menu_items[i].description.toLowerCase().indexOf(searchItemDesc.toLowerCase()) !== -1))
        {
          //console.log(response.data.menu_items[i].description);
          foundItems.push(response.data.menu_items[i]);
        }
      }

      //console.log("foundItems",foundItems);

      return foundItems;
    });
  };
}

})();
