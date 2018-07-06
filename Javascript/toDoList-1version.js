window.onload = function(){
  //add
  var appendContent = function(toDo){
    var text = document.getElementById('toDo_input').value;
    document.getElementById('toDo_input').value = "";
    if(!text || text === "" || text === " ") return false;
    var toDoContent = createToDoContent(text);
    toDo.appendChild(toDoContent);
  }

  var createToDoContent = function(text){
    var toDoContent = document.createElement("div");
    toDoContent.className = "toDo_content"
    toDoContent.innerText = text;
    return toDoContent;
  }

  var appendButton = function(toDo, type){
    var buttonDiv = createButtonDiv(type);
    var button = createButton(type);
    buttonDiv.appendChild(button);
    toDo.appendChild(buttonDiv);
  }

  var createButton = function(type){
    var cssType = { "delete" : "fas fa-times", "uncheck" : "far fa-circle", "check" : "far fa-check-circle"};
    var button = document.createElement("i");
    button.className = cssType[type];
    return button
  }

  var createButtonDiv = function(type){
    var eventType = { "delete" : removeToDo, "check" : changeToDoStatus, "uncheck" :changeToDoStatus};
    var buttonDiv = document.createElement("div");
    buttonDiv.className = "toDo_" + type;
    buttonDiv.onclick = eventType[type];
    return buttonDiv;
  }

  var createToDoDiv = function(status){
    var toDoDiv = document.createElement("div");
    toDoDiv.className = "toDo",
    toDoDiv.setAttribute("status",status);
    return toDoDiv;
  }

  var appendToDo = function(status){
    var toDoList = document.getElementById("toDoList");
    var toDo = createToDoDiv(status);
    appendButton(toDo, status);
    if(appendContent(toDo) === false) return false;
    appendButton(toDo, "delete");
    appendButton(toDo, "update");
    toDoList.appendChild(toDo);
  }

  var addNewToDo = function(event){
    if(event.keyCode === 13)
      appendToDo("uncheck");
  }

  var inputBox = document.getElementById('toDo_input');
  inputBox.addEventListener("keypress", addNewToDo);

  //delete
  var removeToDo = function(event){
    var deleteBtn = event.currentTarget;
    var parentToDo = deleteBtn.parentElement;
    document.getElementById("toDoList").removeChild(parentToDo);
  }

  //complete
  var changeToDoStatus = function(event){
    var checkBtn = event.currentTarget;
    var parentToDo = checkBtn.parentElement;
    changeStatusAndCss(parentToDo);
  }

  var changeStatusAndCss = function(parentToDo){
    changeStatus(parentToDo);
    changeContentCss(parentToDo);
    var checkButtonDiv = changeButtonDiv(parentToDo);
    changeButton(checkButtonDiv);
  }

  var changeStatus = function(parentToDo){
    var status = parentToDo.getAttribute("status");
    if(status==="uncheck") parentToDo.setAttribute("status","check");
    else parentToDo.setAttribute("status","uncheck");
  }

  var changeButtonDiv = function(parentToDo){
    var checkButtonDiv = parentToDo.getElementsByTagName("div")[0];
    checkButtonDiv.classList.toggle("toDo_check");
    checkButtonDiv.classList.toggle("toDo_uncheck");
    return checkButtonDiv;
  }

  var changeButton = function(checkButtonDiv){
    var checkButton = checkButtonDiv.getElementsByTagName("i")[0];
    checkButton.classList.toggle("fa-circle");
    checkButton.classList.toggle("fa-check-circle");
  }

  var changeContentCss = function(parentToDo){
    var contentDiv = parentToDo.getElementsByTagName("div")[1];
    contentDiv.classList.toggle("complete");
  }
}
