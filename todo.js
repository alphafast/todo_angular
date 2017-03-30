angular.module('todoApp', [])
  .controller('todoCtrl', function($scope, $http) {

      //initial
      var todoList = this;

      $scope.newTodo = {
          title: "",
          description: ""
      };

      $scope.modalTodoData = {
          arrayIndex: 0,
          title: "",
          description: ""
      };

      $scope.onLoadPending = false;
      $scope.currentTab = "todo";

      $scope.todoArray = [];

      //initial function
      todoList.todoToast = (toastText) => {
        Materialize.toast(toastText, 4000);
      }

      //connect with API
      todoList.fetchData = (callback) => {
            $http({
                method: 'GET',
                url: 'https://frozen-beach-23954.herokuapp.com/todos'
            }).then((response) => {
                var data = response.data;
                var arrayTemp = [];
                console.log(response);
                $scope.todoArray = [];
                for (var i = 0; i < data.todos.length; i++) {
                    var temp = data.todos[i];
                    var tempObj = {
                        title: temp.title,
                        description: temp.text,
                        completed: temp.completed,
                        completedAt: temp.completedAt,
                        id: temp._id
                    };
                    arrayTemp.push(tempObj);
                }
                if (callback) {
                  callback(arrayTemp, undefined);
                }else{
                    if ($scope.currentTab == "todo") {
                        $scope.todoArray = arrayTemp;
                    }else if ($scope.currentTab == "completed") {
                        var completeArrayTemp = [];
                        for (var i = 0; i < data.todos.length; i++) {
                            var completeTemp = data.todos[i];
                            if (completeTemp.completed == true) {
                                var completeTempObj = {
                                    title: completeTemp.title,
                                    description: completeTemp.text,
                                    completed: completeTemp.completed,
                                    completedAt: completeTemp.completedAt,
                                    id: completeTemp._id
                                };
                                completeArrayTemp.push(completeTempObj);
                            }
                        }
                        $scope.todoArray = completeArrayTemp;
                    }else{
                        $scope.todoArray = arrayTemp;
                    }
                }
            }, (error) => {
                console.log(error);
                if (callback) {
                  callback(undefined, error);
                }
            });
      }

      todoList.addData = (objData, callback) => {
          $http({
              method: 'POST',
              url: 'https://frozen-beach-23954.herokuapp.com/todos',
              data:{
                title: objData.title,
                text: objData.description
              }
          }).then((response) => {
              console.log(response);
              if (callback) {
                  callback(response.data, undefined);
              }
          }, (error) => {
              console.log(error);
              if (callback) {
                  callback(undefined, error);
              }
          });
      }

      todoList.editData = (objData, callback) => {
        $http({
            method: 'PATCH',
            url: `https://frozen-beach-23954.herokuapp.com/todos/${objData.id}`,
            data:{
              title: objData.title,
              text: objData.description
            }
        }).then((response) => {
            console.log(response);
            if (callback) {
                callback(response.data, undefined);
            }
        }, (error) => {
            console.log(error);
            if (callback) {
                callback(undefined, error);
            }
        });
      }

      todoList.setCompleteData = (objData, callback) => {
        var jsonreq = {
        	"completed": objData.completed
        }
        $http({
            method: 'PATCH',
            url: `https://frozen-beach-23954.herokuapp.com/todos/status/${objData.id}`,
            data: jsonreq
        }).then((response) => {
            console.log(response);
            if (callback) {
                callback(response.data, undefined);
            }
        }, (error) => {
            console.log(error);
            if (callback) {
                callback(undefined, error);
            }
        });
      }

      todoList.removeData = (objData, callback) => {
        $http({
            method: 'DELETE',
            url: `https://frozen-beach-23954.herokuapp.com/todos/${objData.id}`,
            data: {}
        }).then((response) => {
            console.log(response);
            if (callback) {
                callback(response.data, undefined);
            }
        }, (error) => {
            console.log(error);
            if (callback) {
                callback(undefined, error);
            }
        });
      }


      // onpageload function
      $scope.onLoadPending = true;
      todoList.fetchData((result, err) => {
          if (result) {
              $scope.todoArray = result;
              $scope.onLoadPending = false;
              todoList.todoToast('Welcome to Todo List.');
          }else{
              $scope.onLoadPending = false;
              todoList.todoToast('Something wrong happened, Please try again.');
          }
      });


      //angular function
      todoList.addTodo = () => {
          if ($scope.newTodo.description == "" || $scope.newTodo.title == "") {
              todoList.todoToast('Please fulfill title and description, Please try agian.');
          }else{
              var todoObj = {
                  title: $scope.newTodo.title,
                  description: $scope.newTodo.description,
              }
              //$scope.todoArray.push(todoObj);
              todoList.addData(todoObj, (result, err) => {
                  if (result) {
                      todoList.clearNewTodoForm();
                      todoList.fetchData();
                      todoList.todoToast(`Todo "${result.title}" was added.`);
                  }else{
                      todoList.todoToast('Cannot add todo now, Please try agian later.');
                  }
              });
          }
      };

      todoList.removeTodo = (index) => {
          if (index > -1) {
            var todoRemovedTitile = $scope.todoArray[index].title;
            todoList.removeData($scope.todoArray[index], (result, err) => {
                if (result) {
                    console.log(result);
                    todoList.fetchData();
                    todoList.todoToast(`Todo "${todoRemovedTitile}" was removed.`);
                }else{
                    todoList.todoToast('Cannot remove todo now, Please try agian later.');
                }
            });
          }
      };

      todoList.editTodo = (index, callback) => {
          $scope.modalTodoData.arrayIndex = index;
          $scope.modalTodoData.title = $scope.todoArray[index].title;
          $scope.modalTodoData.description = $scope.todoArray[index].description;
          callback;
      };

      todoList.saveTodo = (index) => {
          $scope.todoArray[index].title = $scope.modalTodoData.title;
          $scope.todoArray[index].description = $scope.modalTodoData.description;

          todoList.editData($scope.todoArray[index], (result, err) => {
              if (result) {
                  todoList.fetchData();
                  todoList.todoToast(`Todo "${result.todo.title}" was edited.`);
              }else{
                  todoList.todoToast('Cannot edit todo now, Please try agian later.');
              }
          });
      };

      todoList.chengeStatus = (index) => {
          if ($scope.todoArray[index].completed == true) {
              $scope.todoArray[index].completed = false;
          }else{
              $scope.todoArray[index].completed = true;
          }
          todoList.setCompleteData($scope.todoArray[index], (result, err) => {
              if (result) {
                  todoList.fetchData();
                  if (result.todo.completed == true) {
                      todoList.todoToast(`Todo "${result.todo.title}" was completed.`);
                  }else{
                      todoList.todoToast(`Todo "${result.todo.title}" was incompleted.`);
                  }
              }else{
                  todoList.todoToast('Cannot connect to Api, Please try agian later.');
              }
          });
      };

      todoList.setTab = (tabName) => {
          if (tabName == "todo") {
              $scope.currentTab = "todo";
              todoList.fetchData();
          }else if (tabName == "completed") {
              $scope.currentTab = "completed";
              todoList.fetchData();
          }
      }


      //View function
      todoList.clearNewTodoForm = () => {
          $scope.newTodo = {
              title: "",
              description: ""
          };
      };

      todoList.getTodoColor = (status) => {
          if (status == true) {
              return "grey lighten-3";
          }else{
              return "";
          }
      };

      todoList.openModalCallback = () => {
          $('#modal12').modal('open');
      }

      todoList.closeModalCallback = () => {
          $('#modal12').modal('close');
      }

  });
