window.onload = function(){
  var toDoArr = [];

  //object와 element의 관계
  var getToDoObjectIdxByText = function(text){
      for(var index in toDoArr){
        if(toDoArr[index].text === text) return index;
      }
  };

  var getToDoObjectByElement = function(toDoElement){
      var text = getToDoElementText(toDoElement);
      if(text) var toDoObject = getToDoObjectByText(text);
      if(toDoObject) return toDoObject;
  };

  var getToDoObjectByText = function(text){
    var index = getToDoObjectIdxByText(text);
    if(index) return toDoArr[index];
    return;
  };

  var isToDoExist = function(text){
    if(getToDoObjectIdxByText(text)) return true;
    return false;
  };

  //add To Do
  var addNewToDo = function(event){
    if(event.keyCode !== 13) return;
    var text = getInputText();
    if(!text) return;
    addToDo(text);
    updateFooterInfo();
  };

  var addToDo = function(text){
    var toDoObject = createToDoObject("active",text);
    var toDoElement = createToDoElement(toDoObject);
    appendToDoElement(toDoElement);
  };

  var getInputText = function(){
    var inputText = document.getElementById('toDo_input').value;
    if(inputText.replace(/^\s+/g, '').length === 0) return;
    if(isToDoExist(inputText)) return;
    document.getElementById('toDo_input').value = "";
    return inputText;
  };

  var createToDoObject = function(status, text){
    var toDoObject = {
      "status" : status,
      "text" : text
    };
    toDoArr.push(toDoObject);
    return toDoObject;
  };

  var appendToDoElement = function(toDoElement){
    document.getElementById("toDoList").appendChild(toDoElement);
  };

  var createText = function(text, type){
    var toDoText = document.createElement("div");
    toDoText.className = (type === "completed")? "toDo_text completed" : "toDo_text";
    toDoText.innerText = text;
    $(toDoText).dblclick(editToDo);
    return toDoText;
  };

  var createButton = function(type){
    var cssType = { "delete" : "fas fa-times", "active" : "far fa-circle", "completed" : "far fa-check-circle"};
    var button = document.createElement("i");
    button.className = cssType[type];
    return button;
  };

  var createButtonDiv = function(type){
    var eventType = { "delete" :  deleteToDo, "active" : changeToDoStatus, "completed" : changeToDoStatus};
    var buttonDiv = document.createElement("div");
    if(eventType.hasOwnProperty(type)) $(buttonDiv).on("click", eventType[type]);
    buttonDiv.className = "toDo_" + type;
    buttonDiv.appendChild(createButton(type));
    return buttonDiv;
  };

  var createToDoDiv = function(){
    var toDoDiv = document.createElement("div");
    toDoDiv.className = "toDo";
    $(toDoDiv).on("mouseenter mouseleave",showDeleteBtn);
    return toDoDiv;
  };

  var createToDoElement = function(toDoObject){
    var toDoDiv = createToDoDiv();
    toDoDiv.appendChild(createButtonDiv(toDoObject.status));
    toDoDiv.appendChild(createText(toDoObject.text,toDoObject.status));
    toDoDiv.appendChild(createButtonDiv("delete"));
    return toDoDiv;
  };

  var updateFooterInfo = function(){
    setActiveCountText();
    setClearCompletedBtn();
  };

  var inputBox = document.getElementById('toDo_input');
  $(inputBox).on("keypress", addNewToDo);

  //delete
  var getTargetToDoElement = function(event){
    var eventBtn = event.currentTarget;
    return eventBtn.parentElement;
  }

  var deleteToDoElement = function(toDoElement){
    document.getElementById("toDoList").removeChild(toDoElement);
  };

  var getToDoElementText = function(toDoElement){
    var text = $(toDoElement).children(".toDo_text").text();
    return text;
  };

  var deleteToDoObject = function(toDoElement){
    var text = getToDoElementText(toDoElement);
    var index = getToDoObjectIdxByText(text);
    if(index) toDoArr.splice(index,1);
  };

  var deleteToDo = function(event){
    var targetToDoElement = getTargetToDoElement(event);
    deleteToDoElement(targetToDoElement);
    deleteToDoObject(targetToDoElement);
    updateFooterInfo();
  };

  //changeToDoStatus
  var changeToDoObjectStatus = function(toDoElement){
    var text = getToDoElementText(toDoElement);
    var toDoObject = getToDoObjectByText(text);
    toDoObject.status = (toDoObject.status === "active")? "completed" : "active";
    return toDoObject;
  };

  var changeToDoElementStatus = function(targetToDoElement, changedToDoObject){
    var changedToDoElement = createToDoElement(changedToDoObject);
     document.getElementById("toDoList").replaceChild(changedToDoElement,targetToDoElement);
  };

  var changeToDoStatus = function(event){
    var targetToDoElement = getTargetToDoElement(event);
    var changedToDoObject = changeToDoObjectStatus(targetToDoElement);
    changeToDoElementStatus(targetToDoElement, changedToDoObject);
    updateFooterInfo();
  };

  var showDeleteBtn = function() {
    $(this).children(".toDo_delete").toggleClass("hover");
  };

  //edit
  var editToDo = function(event){
    var targetToDoElement = getTargetToDoElement(event);
    var toDoObject = getToDoObjectByElement(targetToDoElement);
    startEdit(targetToDoElement);
    endEdit(targetToDoElement,toDoObject);
  };

  var endEdit = function(toDoElement,toDoObject){
    $(".toDo_text > input").on("focusout", function(){
      editToDoText(toDoElement,toDoObject);
    });
  };

  var startEdit = function(toDoElement){
    replaceTextToInput(toDoElement);
    offEvents(toDoElement);
  };

  var editToDoText = function(toDoElement,toDoObject){
    var text = $(toDoElement).find("input").val();
    if(isToDoExist(text)) return;
    editToDoElementText(toDoElement,text);
    toDoObject.text = text;
    onEvents(toDoElement);
  };

  var editToDoElementText = function(toDoElement, text){
    var $toDoText = $(toDoElement).children(".toDo_text");
    $toDoText.remove("input");
    $toDoText.text(text);
  };

  var offEvents = function(toDoElement){
    $(toDoElement).off("mouseenter mouseleave");
    $(toDoElement).find(".toDo_delete").removeClass("hover");
    $(toDoElement).find(".toDo_delete").off("click");
  };

  var onEvents = function(toDoElement){
    $(toDoElement).on("mouseenter mouseleave", showDeleteBtn);
    $(toDoElement).find(".toDo_delete").on("click", deleteToDo);
  };

  var replaceTextToInput = function(toDoElement){
    var $toDoText = $(toDoElement).children(".toDo_text");
    var text = $toDoText.text();
    $toDoText.text("");
    var input = createInput(text);
    $toDoText.append(input);
  };

  var createInput = function(text){
    var input = document.createElement("input");
    input.autofocus;
    input.setAttribute("type", "text");
    input.setAttribute("value", text);
    return input;
  };

  //toggle all
  var setAllObjectStatus = function(type){
    for(var index in toDoArr){
      toDoArr[index].status = type;
    }
  };

  var removeAllToDoElement = function(){
    $("#toDoList").empty();
  };

  var drawAllToDoObjects = function(){
    for(var index in toDoArr){
      var toDoObject = createToDoElement(toDoArr[index]);
      document.getElementById("toDoList").appendChild(toDoObject);
    }
  };

  var drawToDoObjectsByStatus = function(status){
    for(var index in toDoArr){
      if(status !== toDoArr[index].status) continue;
      var toDoObject = createToDoElement(toDoArr[index]);
      document.getElementById("toDoList").appendChild(toDoObject);
    }
  };

  var drawAllToDoList = function(){
    removeAllToDoElement();
    drawAllToDoObjects();
  };

  var setAllStatus = function(type){
    setAllObjectStatus(type);
    drawAllToDoList();
  };

  var toggleAll = function(event){
    var toggleStatus = event.currentTarget.className;
    (toggleStatus === "status_toggle")? setAllStatus("completed") : setAllStatus("active");
    event.currentTarget.classList.toggle("status_toggle");
    updateFooterInfo();
  };

  $("#toggle-all").on("click", toggleAll);

  //set active count
  var setActiveCountText = function(){
    document.getElementById("count").innerText = getActiveCount() + " items left";
  };

  var getActiveCount = function(){
    var count = 0;
    for(var index in toDoArr){
      if(toDoArr[index].status === "active") count++;
    }
    return count;
  };

  //show all toDo
  var drawToDoListByStatus = function(status){
    removeAllToDoElement();
    drawToDoObjectsByStatus(status);
  };

  $("#all").on("click",drawAllToDoList);

  //show active toDo
  $("#active").on("click", function(){
    drawToDoListByStatus("active");
  });

  //show completed toDo
  $("#completed").on("click", function(){
    drawToDoListByStatus("completed");
  });

  //set ClearCompleted Button
  var setClearCompletedBtn = function(){
    var clearCompletedBtn = document.getElementById("clear_completed");
    clearCompletedBtn.className = "clearCompletedBtn";
    if(getActiveCount() < toDoArr.length) clearCompletedBtn.classList.toggle("clearCompletedBtn");
  };

  //clear completed toDo
  $("#clear_completed").on("click", function(){
    deleteCompletedToDoObject();
    drawAllToDoList();
    setClearCompletedBtn();
  });

  var deleteCompletedToDoObject = function(){
    for(var index in toDoArr){
      if(toDoArr[index].status === "active") continue;
      delete toDoArr[index];
    }
    toDoArr = toDoArr.filter(value => value !== undefined);
  };
}
