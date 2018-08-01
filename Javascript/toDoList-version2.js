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
    if(event.keyCode !== 13) return; // enter를 누를 시 toDo 등록
    var text = getInputText();
    if(!text) return;
    addToDo(text);
    updateFooterInfo();
  };

  var addToDo = function(text){
    var toDoObject = createToDoObject("active",text); // toDoObject 생성
    var toDoElement = createToDoElement(toDoObject); //toDo를 표시하는 Element생성
    appendToDoElement(toDoElement); // Element붙이기
  };

  //inputBox에서 text 입력받기
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

  // 변경된 todoObject를 바탕으로 새로운 element생성 후 targetToDoElement와 replace
  var changeToDoElement = function(targetToDoElement, changedToDoObject){
    var changedToDoElement = createToDoElement(changedToDoObject);
    document.getElementById("toDoList").replaceChild(changedToDoElement,targetToDoElement);
  };

  // click event 발생 시 (check, uncheck)
  var changeToDoStatus = function(event){
    // 이벤트 발생한 toDoElement 가져오기
    var targetToDoElement = getTargetToDoElement(event);
    // todoObject의 status 변경
    var changedToDoObject = changeToDoObjectStatus(targetToDoElement);
    changeToDoElement(targetToDoElement, changedToDoObject);
    updateFooterInfo(); // active toDo count update, clearCompletedBtn 보여주거나 숨기기
  };

  var showDeleteBtn = function() {
    $(this).children(".toDo_delete").toggleClass("hover");
  };

  //edit - dblclick시
  var editToDo = function(event){
    var targetToDoElement = getTargetToDoElement(event); //event가 발생한 toDoElement가져오기
    var toDoObject = getToDoObjectByElement(targetToDoElement); //event가 발생한 toDoObject가져오기
    startEdit(targetToDoElement);
    endEdit(targetToDoElement,toDoObject); // focusout 시 수정 완료
  };

  var endEdit = function(toDoElement,toDoObject){
    $(".toDo_text > input").on("focusout", function(){
      editToDoText(toDoElement,toDoObject); // input tag를 변경한 text로 바꿔 수정 완료
    });
  };

  var startEdit = function(toDoElement){
    replaceTextToInput(toDoElement); // text를 input tag로 바꾸기
    offEvents(toDoElement); // 삭제 버튼을 보여주기 위한 이벤트 off
  };

  var editToDoText = function(toDoElement,toDoObject){
    var text = $(toDoElement).find("input").val(); // input value 가져오기
    if(isToDoExist(text)) return; // 이미 존재하면 수정 x
    toDoObject.text = text; // todoObject의 text 바꾸기
    changeToDoElement(toDoElement,toDoObject);
  };

  var offEvents = function(toDoElement){
    $(toDoElement).off("mouseenter mouseleave");
    $(toDoElement).find(".toDo_delete").removeClass("hover");
    $(toDoElement).find(".toDo_delete").off("click");
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

  //toggle All
  // completed 또는 active로 toDoObject type로 다 set
  var setAllObjectStatus = function(type){
    for(var index in toDoArr){
      toDoArr[index].status = type;
    }
  };

  // 모든 toDoElement를 새로 만든뒤 다 append
  var drawAllToDoObjects = function(){
    for(var index in toDoArr){
      var toDoObject = createToDoElement(toDoArr[index]);
      document.getElementById("toDoList").appendChild(toDoObject);
    }
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

  //show completed toDo
  $("#completed").on("click", function(){
    drawToDoListByStatus("completed");
  });

  var drawAllToDoList = function(){
    removeAllToDoElement();
    drawAllToDoObjects();
  };

  var drawToDoObjectsByStatus = function(status){
    for(var index in toDoArr){
      if(status !== toDoArr[index].status) continue;
      var toDoObject = createToDoElement(toDoArr[index]);
      document.getElementById("toDoList").appendChild(toDoObject);
    }
  };
  
  // toDoList 내용 지우기
  var removeAllToDoElement = function(){
    $("#toDoList").empty();
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
