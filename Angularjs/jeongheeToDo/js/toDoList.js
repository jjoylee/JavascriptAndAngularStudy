
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
  $scope.toDo = [];

  $scope.showCondition = "";

  $scope.addNewToDo = function(event, todoText){
    if(event.keyCode !== 13) return;
    $scope.toDo.push({
      id : uuidGenerator(),
      text : todoText,
      done : false,
      inEditProcess : false
    });
    event.currentTarget.value = "";

    function uuidGenerator(){
      function s4() {
        return ((1 + Math.random()) *  0x10000 | 0).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
  };

  $scope.deleteToDo = function(id){
    var idx = getToDoIdxById(id);
    if(idx) delete $scope.toDo[idx];
    $scope.toDo = $scope.toDo.filter( todo => todo !== undefined);
  };

  var getToDoIdxById = function(id){
    for(var idx in $scope.toDo){
      if($scope.toDo[idx].id === id) return idx;
    }
  };

  $scope.toggleDone = function(id){
    var idx = getToDoIdxById(id);
    if(idx) $scope.toDo[idx].done = !$scope.toDo[idx].done;
  };

  $scope.checkDivStyle = function(doneStatus){
    return (doneStatus === true)? "toDo_check done" : "toDo_check";
  };

  $scope.checkStyle = function(doneStatus){
    return (doneStatus === true)? "far fa-check-circle" : "far fa-circle";
  };

  $scope.textDivStyle = function(doneStatus){
    return (doneStatus === true) ? "toDo_text doneText" : "toDo_text";
  };

  $scope.toggleAllStyle = "toggleAll";

  $scope.toggleAll = function(){
    $scope.toggleAllStyle = ($scope.toggleAllStyle === "toggleAll") ? "" : "toggleAll";
    var done = ($scope.toggleAllStyle === "toggleAll") ? false : true;
    setAllToDoDone(done);

    function setAllToDoDone(done){
      for(var idx in $scope.toDo)
        $scope.toDo[idx].done = done;
    };
  };

  $scope.editToDo = function(id){
    var idx = getToDoIdxById(id);
    if(idx) $scope.toDo[idx].inEditProcess = !$scope.toDo[idx].inEditProcess;
  };

  $scope.getActiveCount = function(){
    return $scope.toDo.filter( todo => todo.done === false).length;
  };

  $scope.doneToDoExist = function(){
    return $scope.toDo.length !== $scope.getActiveCount();
  };

  $scope.clearCompleted = function(){
    $scope.toDo = $scope.toDo.filter( todo => todo.done === false);
  };

  $scope.changeShowCondition = function(condition){
    $scope.showCondition = condition;
  }
});
