angular.module('todoApp', [])
  .controller('todoCtrl', function($scope) {
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

      $scope.todoArray = [
          {
              id: 1,
              title: "todo list 1",
              description: "Hello This is first todo.",
              status: 0
          },
          {
              id: 2,
              title: "todo list 2",
              description: "Hello This is secound todo.",
              status: 0
          },
          {
              id: 3,
              title: "todo list 3",
              description: "Hello This is third todo.",
              status: 1
          }
      ];

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
