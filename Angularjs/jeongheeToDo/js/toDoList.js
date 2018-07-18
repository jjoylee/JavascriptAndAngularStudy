
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

  $scope.inputVal = "";

  $scope.addNewToDo = function(event){
    if(event.keyCode !== 13) return;
    if($scope.inputVal.replace(/^\s+/g, '').length === 0) return;
    $scope.toDo.push({
      id : uuidGenerator(),
      text : $scope.inputVal,
      done : false,
      inEditProcess : false
    });
    $scope.inputVal = "";

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

  $scope.checkDivStyle = function(done){
    return (!done)? "toDo_check" : "toDo_check done";
  };

  $scope.checkStyle = function(done){
    return (!done)? "far fa-circle" : "far fa-check-circle";
  };

  $scope.textDivStyle = function(done){
    return (!done)? "toDo_text" : "toDo_text doneText";
  };

  $scope.toggleAllStyle = "toggleAll";

  $scope.toggleAll = function(){
    $scope.toggleAllStyle = (!$scope.toggleAllStyle) ? "toggleAll" : "";
    var done = (!$scope.toggleAllStyle) ? true : false;
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
