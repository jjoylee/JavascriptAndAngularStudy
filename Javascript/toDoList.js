window.onload = function(){
  var toDoArr = [];

  //object와 element의 관계

  var objectManager = {
    getToDoObjectIdxByText : function(text){
        for(var index in toDoArr){
          if(toDoArr[index].text === text) return index;
        }
    },
    getToDoObjectByElement : function(toDoElement){
        var text = elementManager.getToDoElementText(toDoElement);
        if(text) var toDoObject = this.getToDoObjectByText(text);
        if(toDoObject) return toDoObject;
    },
    getToDoObjectByText : function(text){
      var index = this.getToDoObjectIdxByText(text);
      if(index) return toDoArr[index];
      return;
    },
    isToDoExist : function(text){
      if(this.getToDoObjectIdxByText(text)) return true;
      return false;
    },
    createToDoObject : function(status, text){
      var toDoObject = {
        "status" : status,
        "text" : text
      };
      toDoArr.push(toDoObject);
      return toDoObject;
    },
    deleteToDoObject : function(toDoElement){
      var text = elementManager.getToDoElementText(toDoElement);
      var index = this.getToDoObjectIdxByText(text);
      if(index) toDoArr.splice(index,1);
    },
    changeToDoObjectStatus : function(toDoElement){
      var text = elementManager.getToDoElementText(toDoElement);
      var toDoObject = this.getToDoObjectByText(text);
      toDoObject.status = (toDoObject.status === "active")? "completed" : "active";
      return toDoObject;
    },
    editToDoObjectText : function(toDoObject,text){
     toDoObject.text = text;
   },
   setAllObjectStatus : function(type){
     for(var index in toDoArr){
       toDoArr[index].status = type;
     }
   },
   drawAllToDoObjects : function(){
     for(var index in toDoArr){
       var toDoObject = elementManager.createToDoElement(toDoArr[index]);
       document.getElementById("toDoList").appendChild(toDoObject);
     }
   },
   drawToDoObjectsByStatus : function(status){
     for(var index in toDoArr){
       if(status !== toDoArr[index].status) continue;
       var toDoObject = elementManager.createToDoElement(toDoArr[index]);
       document.getElementById("toDoList").appendChild(toDoObject);
     }
   },
   deleteCompletedToDoObject : function(){
     for(var index in toDoArr){
       if(toDoArr[index].status === "active") continue;
       delete toDoArr[index];
     }
     toDoArr = toDoArr.filter(value => value !== undefined);
   },
   getActiveCount : function(){
     var count = 0;
     for(var index in toDoArr){
       if(toDoArr[index].status === "active") count++;
     }
     return count;
   }
  }

var elementManager = {
  createToDoElement : function(toDoObject){
    var toDoDiv = this.createToDoDiv();
    toDoDiv.appendChild(this.createButtonDiv(toDoObject.status));
    toDoDiv.appendChild(this.createText(toDoObject.text,toDoObject.status));
    toDoDiv.appendChild(this.createButtonDiv("delete"));
    return toDoDiv;
  },
  appendToDoElement : function(toDoElement){
    document.getElementById("toDoList").appendChild(toDoElement);
  },
  createText : function(text, type){
    var toDoText = document.createElement("div");
    toDoText.className = (type === "completed")? "toDo_text completed" : "toDo_text";
    toDoText.innerText = text;
    $(toDoText).dblclick(editToDo);
    return toDoText;
  },
  createButton : function(type){
    var cssType = { "delete" : "fas fa-times", "active" : "far fa-circle", "completed" : "far fa-check-circle"};
    var button = document.createElement("i");
    button.className = cssType[type];
    return button;
  },
  createButtonDiv : function(type){
    var eventType = { "delete" :  deleteToDo, "active" : changeToDoStatus, "completed" : changeToDoStatus};
    var buttonDiv = document.createElement("div");
    if(eventType.hasOwnProperty(type)) $(buttonDiv).on("click", eventType[type]);
    buttonDiv.className = "toDo_" + type;
    buttonDiv.appendChild(this.createButton(type));
    return buttonDiv;
  },
  createToDoDiv : function(){
    var toDoDiv = document.createElement("div");
    toDoDiv.className = "toDo";
    $(toDoDiv).on("mouseenter mouseleave",this.showDeleteBtn);
    return toDoDiv;
  },
  getTargetToDoElement : function(event){
    var eventBtn = event.currentTarget;
    return eventBtn.parentElement;
  },
  deleteToDoElement : function(toDoElement){
    document.getElementById("toDoList").removeChild(toDoElement);
  },
  getToDoElementText : function(toDoElement){
    var text = $(toDoElement).children(".toDo_text").text();
    return text;
  },
  changeToDoElementStatus : function(targetToDoElement, changedToDoObject){
    var changedToDoElement = this.createToDoElement(changedToDoObject);
    document.getElementById("toDoList").replaceChild(changedToDoElement,targetToDoElement);
  },
  editToDoElementText : function(toDoElement, text){
    var $toDoText = $(toDoElement).children(".toDo_text");
    $toDoText.remove("input");
    $toDoText.text(text);
  },
  offEvents : function(toDoElement){
    $(toDoElement).off("mouseenter mouseleave");
    $(toDoElement).find(".toDo_delete").removeClass("hover");
    $(toDoElement).find(".toDo_delete").off("click");
  },
  onEvents : function(toDoElement){
    $(toDoElement).on("mouseenter mouseleave", this.showDeleteBtn);
    $(toDoElement).find(".toDo_delete").on("click", deleteToDo);
  },
  showDeleteBtn : function() {
    $(this).children(".toDo_delete").toggleClass("hover");
  },
  getInputText : function(){
    var inputText = document.getElementById('toDo_input').value;
    if(inputText.replace(/^\s+/g, '').length === 0) return;
    if(objectManager.isToDoExist(inputText)) return;
    document.getElementById('toDo_input').value = "";
    return inputText;
  },
  replaceTextToInput : function(toDoElement){
    var $toDoText = $(toDoElement).children(".toDo_text");
    var text = $toDoText.text();
    $toDoText.text("");
    var input = this.createInput(text);
    $toDoText.append(input);
  },
  createInput : function(text){
    var input = document.createElement("input");
    input.autofocus;
    input.setAttribute("type", "text");
    input.setAttribute("value", text);
    return input;
  },
  removeAllToDoElement : function(){
    $("#toDoList").empty();
  },
  setClearCompletedBtn : function(){
    var clearCompletedBtn = document.getElementById("clear_completed");
    clearCompletedBtn.className = "clearCompletedBtn";
    if(objectManager.getActiveCount() < toDoArr.length) clearCompletedBtn.classList.toggle("clearCompletedBtn");
  }
}
  //add To Do
  var addNewToDo = function(event){
    if(event.keyCode !== 13) return;
    var text = elementManager.getInputText();
    if(!text) return;
    addToDo(text);
    updateFooterInfo();
  };

  var addToDo = function(text){
    var toDoObject = objectManager.createToDoObject("active",text);
    var toDoElement = elementManager.createToDoElement(toDoObject);
    elementManager.appendToDoElement(toDoElement);
  };

  var updateFooterInfo = function(){
    setActiveCountText();
    elementManager.setClearCompletedBtn();
  };

  var inputBox = document.getElementById('toDo_input');
  $(inputBox).on("keypress", addNewToDo);

  //delete

  var deleteToDo = function(event){
    var targetToDoElement = elementManager.getTargetToDoElement(event);
    elementManager.deleteToDoElement(targetToDoElement);
    objectManager.deleteToDoObject(targetToDoElement);
    updateFooterInfo();
  };

  //changeToDoStatus

  var changeToDoStatus = function(event){
    var targetToDoElement = elementManager.getTargetToDoElement(event);
    var changedToDoObject = objectManager.changeToDoObjectStatus(targetToDoElement);
    elementManager.changeToDoElementStatus(targetToDoElement, changedToDoObject);
    updateFooterInfo();
  };


  //edit
  var editToDo = function(event){
    var targetToDoElement = elementManager.getTargetToDoElement(event);
    var toDoObject = objectManager.getToDoObjectByElement(targetToDoElement);
    startEdit(targetToDoElement);
    endEdit(targetToDoElement,toDoObject);
  };

  var startEdit = function(toDoElement){
    elementManager.replaceTextToInput(toDoElement);
    elementManager.offEvents(toDoElement);
  };

  var endEdit = function(toDoElement,toDoObject){
    $(".toDo_text > input").on("focusout", function(){
      editToDoText(toDoElement,toDoObject);
    });
  };

  var editToDoText = function(toDoElement,toDoObject){
    var text = $(toDoElement).find("input").val();
    if(objectManager.isToDoExist(text)) return;
    elementManager.editToDoElementText(toDoElement,text);
    objectManager.editToDoObjectText(toDoObject,text);
    elementManager.onEvents(toDoElement);
  };

  //toggle all
  var drawAllToDoList = function(){
    elementManager.removeAllToDoElement();
    objectManager.drawAllToDoObjects();
  };

  var setAllStatus = function(type){
    objectManager.setAllObjectStatus(type);
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
    document.getElementById("count").innerText = objectManager.getActiveCount() + " items left";
  };

  //show all toDo
  var drawToDoListByStatus = function(status){
    elementManager.removeAllToDoElement();
    objectManager.drawToDoObjectsByStatus(status);
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

  //clear completed toDo
  $("#clear_completed").on("click", function(){
    objectManager.deleteCompletedToDoObject();
    drawAllToDoList();
    elementManager.setClearCompletedBtn();
  });
}
