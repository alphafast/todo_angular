angular.module('todoApp', [])
  .controller('todoCtrl', function($scope, $http) {
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

      //connect with API
      todoList.fetchData = (callback) => {
            $http({
                method: 'GET',
                url: 'https://frozen-beach-23954.herokuapp.com/todos'
            }).then((response) => {
                console.log(response);
                if (callback) {
                    callback(response.data);
                }
            }, (error) => {
                console.log(error);
            });

      }

      todoList.fetchData((data) => {
          $scope.todoArray = [];
          for (var i = 0; i < data.todos.length; i++) {
              var temp = data.todos[i];
              var tempObj = {
                  title: temp.title,
                  description: temp.text,
                  status: temp.completed,
                  completedAt: temp.completedAt,
                  id: temp._id
              };
              $scope.todoArray.push(tempObj);
          }
      });

      todoList.addTodo = () => {
          var todoObj = {
              id: 1,
              title: $scope.newTodo.title,
              description: $scope.newTodo.describetion,
              status: 0
          }
          alert(JSON.stringify(todoObj));
          $scope.todoArray.push(todoObj);
          todoList.clearNewTodoForm();
      };



      todoList.removeTodo = (index) => {
          if (index > -1) {
              $scope.todoArray.splice(index, 1);
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
      };

      todoList.clearNewTodoForm = () => {
          $scope.newTodo = {
              title: "",
              description: ""
          };
      };

      todoList.getTodoColor = (status) => {
          if (status == 1) {
              return "grey lighten-3";
          }else{
              return "";
          }
      };

      todoList.chengeStatus = (index) => {
          todoList.fetchData();
          if ($scope.todoArray[index].status == 1) {
              $scope.todoArray[index].status = 0;
          }else{
              $scope.todoArray[index].status = 1;
          }
      };

      todoList.openModalCallback = () => {
          $('#modal12').modal('open');
      }

      todoList.closeModalCallback = () => {
          $('#modal12').modal('close');
      }

  });
