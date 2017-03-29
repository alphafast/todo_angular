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

      $scope.todoArray = [];

      //initial function
      todoList.todoToast = (toastText) => {
        Materialize.toast(toastText, 4000);
      }

      //connect with API
      todoList.fetchData = (errorCallback, resultCallback) => {
            $http({
                method: 'GET',
                url: 'https://frozen-beach-23954.herokuapp.com/todos'
            }).then((response) => {
                var data = response.data;
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
                    $scope.todoArray.push(tempObj);
                }
                if (resultCallback) {
                  resultCallback(response);
                }
            }, (error) => {
                console.log(error);
                if (errorCallback) {
                  errorCallback(error);
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
                  callback(response.data);
              }
          }, (error) => {
              console.log(error);
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
                callback(response.data);
            }
        }, (error) => {
            console.log(error);
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
                callback(response.data);
            }
        }, (error) => {
            console.log(error);
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
                callback(response.data);
            }
        }, (error) => {
            console.log(error);
        });
      }


      // onpageload function
      todoList.fetchData();
      todoList.todoToast('Welcome to Todo List.');


      //angular function
      todoList.addTodo = () => {
          var todoObj = {
              title: $scope.newTodo.title,
              description: $scope.newTodo.describetion,
          }
          $scope.todoArray.push(todoObj);
          todoList.addData(todoObj, () => {
            todoList.clearNewTodoForm();
            todoList.fetchData();
            todoList.todoToast('Todo was added.');
          })
      };

      todoList.removeTodo = (index) => {
          if (index > -1) {
            todoList.removeData($scope.todoArray[index], () => {
              todoList.fetchData();
              todoList.todoToast('Todo was removed.');
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

          todoList.editData($scope.todoArray[index], () => {
            todoList.fetchData();
            todoList.todoToast('Todo was edited.');
          });
      };


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

      todoList.chengeStatus = (index) => {
          if ($scope.todoArray[index].completed == true) {
              $scope.todoArray[index].completed = false;
          }else{
              $scope.todoArray[index].completed = true;
          }
          todoList.setCompleteData($scope.todoArray[index], () => {
            todoList.fetchData();
            todoList.todoToast('Todo was completed.');
          });
      };

      todoList.openModalCallback = () => {
          $('#modal12').modal('open');
      }

      todoList.closeModalCallback = () => {
          $('#modal12').modal('close');
      }

  });
