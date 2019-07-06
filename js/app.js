'use strict';
document.addEventListener('DOMContentLoaded', function () {
    function openConnection(action, data) {
        var url = 'https://vuejs-http-f1138.firebaseio.com/todo.json';
        var methodLoad = 'GET';
        var methodSave = 'PUT';
        var http = new XMLHttpRequest();

        if (action === 'save') {
            http.open(methodSave, url);
            http.onreadystatechange = function () {
                if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
                    return 'success';
                } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
                    console.log('Error!');
                }
            };
            http.send(data);
        } else {
            http.open(methodLoad, url);
            http.onreadystatechange = function () {
                if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
                    loadData(JSON.parse(http.responseText));
                } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 200) {
                    console.log('Error!');
                }
            };
            http.send();
        }
    }

    function loadData(data) {
        $toDoList.innerHTML = '';
        $completedTasksList.innerHTML = '';

        for (var i = 0; i < data.tasks.length; i++) {
            generateCheckbox(data.tasks[i], 'todo');
        }

        for (var i = 0; i < data.completed.length; i++) {
            generateCheckbox(data.completed[i], 'completed');
        }
    }

    function saveData() {
        var $toDoListCheckboxes = $toDoList.querySelectorAll('.checkbox');
        var $completedListCheckboxes = $completedTasksList.querySelectorAll('.checkbox');
        var toDoArray = [];
        var completedArray = [];

        for (var i = 0; i < $toDoListCheckboxes.length; i++) {
            var toDoCheckboxText = $toDoListCheckboxes[i].querySelector('.checkbox__text').innerText;
            toDoArray.push(toDoCheckboxText);
        }

        for (var i = 0; i < $completedListCheckboxes.length; i++) {
            var completedCheckboxText = $completedListCheckboxes[i].querySelector('.checkbox__text').innerText;
            completedArray.push(completedCheckboxText);
        }

        var dataObject = {
            'tasks': toDoArray,
            'completed': completedArray
        };

        openConnection('save', JSON.stringify(dataObject));
    }

    function generateCheckbox(value, type) {
        if (value.length > 0) {
            var newTaskCheckbox = htmlCheckbox.replace(regex, value);
            var $tasksItem = document.createElement('li');

            if (type === 'todo') {
                $tasksItem.classList.add(toDoItemClass);
                $toDoList.appendChild($tasksItem);
                $tasksItem.innerHTML = newTaskCheckbox;
            } else if (type === 'completed') {
                $tasksItem.classList.add(completedTaskItemClass);
                $completedTasksList.appendChild($tasksItem);
                $tasksItem.innerHTML = newTaskCheckbox;
                $tasksItem.querySelector('.checkbox__control').setAttribute('checked', true);
            }

            if ($tasksItem.querySelector('.checkbox')) {
                $tasksItem.querySelector('.checkbox').addEventListener('change', checkboxOnChange);
            }

            if ($tasksItem.querySelector('.delete')) {
                $tasksItem.querySelector('.delete').addEventListener('click', deleteTask);
            }

            if ($tasksItem.querySelector('.edit')) {
                $tasksItem.querySelector('.edit').addEventListener('click', editTask);
            }
        }
    }

    function checkboxOnChange(event) {
        var tempNode = this.parentNode;
        if (event.target.checked) {
            var $completedTasksItem = document.createElement('li');
            $completedTasksItem.classList.add(completedTaskItemClass);
            $completedTasksList.appendChild($completedTasksItem);
            $completedTasksItem.appendChild(tempNode);
        } else {
            var $toDoTasksItem = document.createElement('li');
            $toDoTasksItem.classList.add(toDoItemClass);
            $toDoList.appendChild($toDoTasksItem);
            $toDoTasksItem.appendChild(tempNode);
        }
    }

    function deleteTask() {
        this.parentNode.parentNode.remove();
    }

    function editTask() {
        this.parentNode.insertAdjacentHTML('afterbegin', editInput);

        var $checkboxControl = this.parentNode.querySelector('.checkbox__control');
        var $editInput = this.parentNode.querySelector('.edit-input');
        var $editInputControl = $editInput.querySelector('.edit-input__control');
        var $editInputOk = $editInput.querySelector('.edit-input__ok');
        var $editInputCancel = $editInput.querySelector('.edit-input__cancel');
        $editInputControl.value = $checkboxControl.value;

        $editInputOk.addEventListener('click', editTaskOk);
        $editInputCancel.addEventListener('click', editTaskCancel);
    }

    function editTaskOk() {
        var value = this.parentNode.querySelector('.edit-input__control').value;
        var $checkboxControl = this.parentNode.parentNode.querySelector('.checkbox__control');
        var $checkboxText = this.parentNode.parentNode.querySelector('.checkbox__text');
        $checkboxControl.value = value;
        $checkboxText.innerText = value;
        this.parentNode.remove();
    }

    function editTaskCancel() {
        this.parentNode.remove();
    }

    var $toDoList = document.querySelector('.to-do__list');
    var $completedTasksList = document.querySelector('.completed-tasks__list');
    var $addTaskTextarea = document.querySelector('.add-task__form .textarea__control');
    var $addTaskSubmit = document.querySelector('.add-task__submit');
    var $loadButton = document.querySelector('.load-save__load');
    var $saveButton = document.querySelector('.load-save__save');
    var checkBoxArray = document.querySelectorAll('.checkbox');

    var completedTaskItemClass = 'complete-tasks__item';
    var toDoItemClass = 'to-do__item';

    var htmlCheckbox =
        '<div class="wrap-item">' +
        '<div class="checkbox">' +
        '<label class="checkbox__label">' +
        '<input type="checkbox" name="task" value="${checkbox-value}" class="checkbox__control">' +
        '<span class="checkbox__text">${checkbox-value}</span>' +
        '</label>' +
        '</div>' +
        '<button class="delete btn btn-danger">' +
        '<span>Delete</span>' +
        '</button>' +
        '<button class="edit btn btn-warning">' +
        '<span>Edit</span>' +
        '</button>' +
        '</div>';

    var editInput =
        '<div class="edit-input">' +
        '<label class="edit-input__label"><input type="text" value="" class="edit-input__control"></label>' +
        '<button class="edit-input__ok btn btn-success"><span>OK</span></button>' +
        '<button class="edit-input__cancel btn btn-danger"><span>Cancel</span></button>' +
        '</div>'
    ;

    var regex = new RegExp('\\$\{checkbox-value\}', 'g');

    for (var i = 0; i < checkBoxArray.length; i++) {
        checkBoxArray[i].addEventListener('change', checkboxOnChange);
    }

    $addTaskSubmit.addEventListener('click', function (event) {
        event.preventDefault();
        var newTaskText = $addTaskTextarea.value;
        $addTaskTextarea.value = '';
        generateCheckbox(newTaskText, 'todo');
    });

    $loadButton.addEventListener('click', function () {
        openConnection('load');
    });

    $saveButton.addEventListener('click', function () {
        saveData();
    });
});
