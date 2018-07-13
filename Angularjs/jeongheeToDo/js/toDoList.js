
var toDoModel = [];

var toDoApp = angular.module("toDoApp",[]);

// toDoApp.directive('submitTodo', function(){
//   return function(scope, element, attrs){
//     element.bind("keydown keypress", function(event){
//       if(event.keyCode == 13){
//         scope.$apply(function(){
//           scope.$eval(attrs.submitTodo);
//         });
//         event.preventDefault();
//       }
//     });
//   }
// });

toDoApp.controller("ToDoCtrl", function($scope){
  $scope.toDo = toDoModel;

  $scope.addNewToDo = function(event, todoText){
    if(event.keyCode !== 13) return;
    toDoModel.push()
  }
});
