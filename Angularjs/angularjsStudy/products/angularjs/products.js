angular.module("exampleApp", [])
.constant("baseUrl", "http://localhost:5500/products/")
.controller("defaultCtrl", function($scope, $http, baseUrl){
  $scope.displayMode = "list";
  $scope.currentProduct = null;

  $scope.listProducts = function(){
    $http.get(baseUrl).then(function(response){
      $scope.products = response.data;
    })
  }

  $scope.deleteProduct = function(product){
    $http({
      method : "DELETE",
      url : baseUrl + product.id
    }).then(function(){
      $scope.products.splice($scope.products.indexOf(product), 1);
    })
  }

  $scope.createProduct = function(product){
    $http.post(baseUrl, product).then(function(newProduct){
      $scope.products.push(newProduct.data);
      $scope.displayMode = "list";
    });
  }

  $scope.updateProduct = function(product){
    $http({
      url : baseUrl + product.id,
      method : "PUT",
      data : product
    }).then(function(modifiedProduct){
      for(var i = 0 ; i < $scope.products.length ; i++){
        if($scope.products[i].id == modifiedProduct.data.id){
          $scope.products[i] = modifiedProduct.data;
          break;
        }
      }
      $scope.displayMode = "list";
    })
  }

  $scope.editOrCreateProduct = function(product){
    $scope.currentProduct = product ? angular.copy(product) : {};
    $scope.displayMode = "edit";
  }

  $scope.saveEdit = function(product){
    if(angular.isDefined(product.id)){
      $scope.updateProduct(product);
    } else {
      $scope.createProduct(product);
    }
  }

  $scope.cancelEdit = function(){
    $scope.currentProduct = {};
    $scope.displayMode = "list";
  }

  $scope.listProducts();
});
