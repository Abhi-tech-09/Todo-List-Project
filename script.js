

const taskdiv = document.querySelector(".task-div");
const tasks = document.getElementsByClassName("task")
let todos = [];

window.onload = function () {
    todos = localStorage.getItem("todos");
    if (todos != null) {
        taskdiv.querySelector(".no").remove();
        todos = JSON.parse(todos);
        for (let i = 0; i < todos.length; i++) {
            const task = document.createElement('div');
            task.className = "task";
            task.innerHTML = todos[i];
            taskdiv.appendChild(task);
        }
        update();
    }
};

document.getElementById("add").addEventListener('click', e => {
    e.preventDefault();
    const div = document.querySelector(".task-div");
    let text = document.querySelector(".inputTask").value;
    text = text.trim();
    if (text != '') {
        const check = document.createElement('input');
        check.setAttribute("type", "checkbox");
        check.className = "checkbox";
        check.setAttribute("value", "");
        const output = document.createElement('li')
        output.innerText = text;

        const b1 = document.createElement('button');
        b1.className = 'up';
        b1.innerHTML = `<i class="fas fa-angle-up"></i>`;
        b1.setAttribute("title", "MoveUp")
        const b2 = document.createElement('button');
        b2.className = 'down';
        b2.innerHTML = `<i class="fas fa-angle-down"></i>`;
        b2.setAttribute("title", "MoveDown")
        const task = document.createElement('div');
        task.className = "task";
        task.appendChild(check);
        task.appendChild(b1);
        task.appendChild(b2);
        task.appendChild(output);
        if(tasks.length == 0)
            taskdiv.querySelector(".no").remove();
        div.appendChild(task);
        todos.push(task.innerHTML.toString());
        console.log(todos)
    }
    document.querySelector(".inputTask").value = "";
    document.querySelector(".inputTask").focus();
    update();
    localStorage.setItem("todos", JSON.stringify(todos));
})
document.getElementById("sort").addEventListener('click', e => {
    e.preventDefault();
    let updatedList = [];
    let striked = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].querySelector(".checkbox").checked) {
            striked.push(tasks[i].innerHTML);
        }
        else {
            updatedList.push(tasks[i].innerHTML);
        }
    }
    updatedList = updatedList.concat(striked);
    let cnt = striked.length;
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].innerHTML = updatedList[i];
    }
    update();
})
document.getElementById("delete").addEventListener('click', e => {
    e.preventDefault();
    let mark = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].querySelector(".checkbox").value == "checked") {
            mark.push(1);
        }
        else mark.push(0);
    }
    let cnt = 0;
    for (let i = 0; i < mark.length; i++) {
        if (mark[i] == 1) {
            taskdiv.removeChild(tasks[i - cnt]);
            cnt++;
        }
    }
    update();
})


function goUp(e) {
    let parentElement = e.target.parentElement;
    if (parentElement.className == "up") {
        parentElement = parentElement.parentElement;
    }

    let temp1 = parentElement;
    let temp2 = temp1.previousElementSibling;
    console.log("up")
    // console.log(temp1);
    // console.log(temp2);
    const store = temp2.innerHTML;
    temp2.innerHTML = temp1.innerHTML;
    temp1.innerHTML = store;
    update();

}


function goDown(e) {
    let parentElement = e.target.parentElement;
    if (parentElement.className == "down") {
        parentElement = parentElement.parentElement;
    }

    let temp1 = parentElement;
    let temp2 = temp1.nextElementSibling;
    console.log("down")
    // console.log(e.target.parentElement.className)
    // console.log(temp1);
    // console.log(temp2);
    const store = temp2.innerHTML;
    temp2.innerHTML = temp1.innerHTML;
    temp1.innerHTML = store;
    update();
}


function updateUpDownBtn() {
    const tasks = document.getElementsByClassName("task")
    let up = document.getElementsByClassName("up");
    let down = document.getElementsByClassName("down");
    for (let i = 0; i < up.length; i++) {
        up[i].onclick = goUp;
    }
    for (let i = 0; i < down.length; i++) {
        down[i].onclick = goDown;
    }
}
function updateCheckBox() {
    let task = document.getElementsByClassName("task");
    for (let i = 0; i < task.length; i++) {
        task[i].querySelector('.checkbox').addEventListener('change', () => {
            
            let text = task[i].getElementsByTagName('li')[0].innerText;
            if (task[i].querySelector('.checkbox').checked) {
                task[i].querySelector('.checkbox').value = "checked";
                task[i].getElementsByTagName('li')[0].innerHTML = `<strike>${text}</strike>`;
            }
            else {
                task[i].querySelector('.checkbox').value = '';
                task[i].getElementsByTagName('li')[0].innerHTML = `${text}`;
            }
        })
    }

    for (let i = 0; i < task.length; i++) {
        if (task[i].querySelector(".checkbox").value == "checked") {
            task[i].querySelector(".checkbox").checked = true;
        }
        else {
            task[i].querySelector(".checkbox").checked = false;
        }
    }
}
function addRemoveBtn() {
    const task = document.getElementsByClassName("task")
    if (task.length == 1) {
        task[0].querySelector(".up").style.visibility = "hidden";
        task[0].querySelector(".down").style.visibility = "hidden";
        return;
    }
    task[0].querySelector(".up").style.visibility = "hidden";
    task[0].querySelector(".down").style.visibility = "visible";

    task[task.length - 1].querySelector(".down").style.visibility = "hidden";
    task[task.length - 1].querySelector(".up").style.visibility = "visible";

    for (let i = 1; i < task.length - 1; i++) {
        task[i].querySelector(".up").style.visibility = "visible";
        task[i].querySelector(".down").style.visibility = "visible";
    }
}
function update() {
    updateUpDownBtn();
    updateCheckBox();
    addRemoveBtn();
}


