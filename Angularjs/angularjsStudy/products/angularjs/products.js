angular.module("exampleApp", ["increment", "ngResource"])
.constant("baseUrl", "http://localhost:5500/products/")
.controller("defaultCtrl", function($scope, $http, $resource, baseUrl){
  $scope.displayMode = "list";
  $scope.currentProduct = null;

  $scope.productsResource = $resource(baseUrl + ":id", {id : "@id"})

  $scope.listProducts = function(){
    $scope.products = $scope.productsResource.query();
  }

  $scope.deleteProduct = function(product){
    product.$delete().then(function(){
      $scope.products.splice($scope.products.indexOf(product), 1);
    });
    $scope.displayMode = "list";

    // $http({
    //   method : "DELETE",
    //   url : baseUrl + product.id
    // }).then(function(){
    //   $scope.products.splice($scope.products.indexOf(product), 1);
    // })
  }

  $scope.createProduct = function(product){
    new $scope.productsResource(product).$save().then(function(newProduct){
      $scope.products.push(newProduct.data);
      $scope.displayMode = "list";
    });

    // $http.post(baseUrl, product).then(function(newProduct){
    //   $scope.products.push(newProduct.data);
    //   $scope.displayMode = "list";
    // });
  }

  $scope.updateProduct = function(product){
    product.$save();
    $scope.displayMode = "list";

    // $http({
    //   url : baseUrl + product.id,
    //   method : "PUT",
    //   data : product
    // }).then(function(modifiedProduct){
    //   for(var i = 0 ; i < $scope.products.length ; i++){
    //     if($scope.products[i].id == modifiedProduct.data.id){
    //       $scope.products[i] = modifiedProduct.data;
    //       break;
    //     }
    //   }
    //   $scope.displayMode = "list";
    // })
  }

  $scope.editOrCreateProduct = function(product){
    $scope.currentProduct = product ? product : {};
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
    if($scope.currentProduct && $scope.currentProduct.$get){
      $scope.currentProduct.$get();
    }
    $scope.currenctProduct = {};
    $scope.displayMode = "list";
    
    // $scope.currentProduct = {};
    // $scope.displayMode = "list";
  }

  $scope.listProducts();
});
