const taskdiv = document.querySelector(".task-div");
const tasks = document.getElementsByClassName("task")
let todos = [];

window.onload = function () {
    todos = localStorage.getItem("todos");
    todos = JSON.parse(todos);
    if (todos == null) { return; }
    if (todos.length > 0) {
        taskdiv.querySelector(".no").remove();
        for (let i = 0; i < todos.length; i++) {
            const task = document.createElement('div');
            task.className = "task";
            task.innerHTML = todos[i];
            taskdiv.appendChild(task);
        }
        update();
        updateDrag();
    }
};


document.getElementById("add").addEventListener('click', e => {
    e.preventDefault();
    const div = document.querySelector(".task-div");
    let text = document.querySelector(".inputTask").value;
    text = text.trim();
    if (text != '') {
        let task = createTodo(text);
        if (tasks.length == 0)
            taskdiv.querySelector(".no").remove();
        div.appendChild(task);
        document.querySelector(".inputTask").value = "";
        document.querySelector(".inputTask").focus();
        update();
        updateDrag();
    }

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

function createTodo(text) {
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
    task.setAttribute("draggable", true);
    task.appendChild(check);
    task.appendChild(b1);
    task.appendChild(b2);
    task.appendChild(output);
    task.querySelector('.checkbox').addEventListener('change', check)
    return task;
}
function goUp(e) {
    let parentElement = e.target.parentElement;
    if (parentElement.className == "up") {
        parentElement = parentElement.parentElement;
    }

    let temp1 = parentElement;
    let temp2 = temp1.previousElementSibling;

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
function check() {
    let ele = this.parentElement;
    let text = ele.getElementsByTagName('li')[0].innerText;
    if (ele.querySelector('.checkbox').checked) {
        ele.querySelector('.checkbox').value = "checked";
        ele.getElementsByTagName('li')[0].innerHTML = `<strike>${text}</strike>`;
        ele.style.backgroundColor = "rgb(53 175 54 / 50%)";
    }
    else {
        ele.querySelector('.checkbox').value = '';
        ele.getElementsByTagName('li')[0].innerHTML = `${text}`;
        ele.style.backgroundColor = "rgb(255 255 255 / 0%)";
    }
    updateStorage();
}
function updateCheckBox() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].querySelector('.checkbox').removeEventListener('change', check);
        tasks[i].querySelector('.checkbox').addEventListener('change', check)
    }


    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].querySelector(".checkbox").value == "checked") {
            tasks[i].querySelector(".checkbox").checked = true;
            tasks[i].style.backgroundColor = "rgb(53 175 54 / 50%)";
        }
        else {
            tasks[i].querySelector(".checkbox").checked = false;
            tasks[i].style.backgroundColor = "rgb(255 255 255 / 0%)";
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
function updateStorage() {
    todos = [];
    for (let i = 0; i < tasks.length; i++) {
        todos.push(tasks[i].innerHTML);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}
function updateDrag() {
    let taskArray = document.querySelectorAll(".task");
    let dropTask = null;
    taskArray.forEach(task => {
        task.setAttribute("draggable", true);
        task.addEventListener("dragstart", e => {
            // console.log("start");
            e.target.classList.add('dragging');
            // console.log("start" , e.target)
        })
        task.addEventListener("dragend", e => {
            e.preventDefault();
            let currEle = document.querySelector('.dragging');
            if (currEle == null) return;
            // console.log(currEle);
            while (currEle.classList[0] != "task") currEle = currEle.parentElement;
            while (dropTask.className != "task") dropTask = dropTask.parentElement;
            // console.log("end",currEle , dropTask);
            if (currEle != null) {
                let temp = currEle.innerHTML;
                currEle.innerHTML = dropTask.innerHTML;
                dropTask.innerHTML = temp;
                e.target.classList.remove('dragging');
            }
            update();
        })
        task.addEventListener("dragover", e => {
            e.preventDefault();
            taskArray.forEach(taskele => {
                let top = taskele.offsetTop;
                let bottom = top + taskele.offsetHeight + 6;
                if (e.clientY >= top && e.clientY <= bottom) {
                    dropTask = taskele;

                    // console.log("over" , taskele);
                }
            })
        })
    });
}
function update() {
    if (taskdiv.childElementCount == 0) {
        const no = document.createElement('div')
        no.className = "no";
        no.innerHTML = "No todos remaining...";
        taskdiv.append(no);
    }
    if (tasks.length > 0) {
        updateUpDownBtn();
        updateCheckBox();
        addRemoveBtn();
    }
    updateStorage();
}
document.getElementById("cf").addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(".filter-section").style.display = "block";
    document.getElementById("tags").addEventListener("change", e => {
        e.preventDefault();
        const listdiv = document.createElement('div')
        listdiv.className = "taglist";
        const li = document.createElement('li');
        li.className = "tagId"
        li.innerHTML = `${document.getElementById("tags").value}`;
        const btn = document.createElement('button')
        btn.innerHTML = "X";
        btn.className = "cross";
        listdiv.append(li);
        listdiv.append(btn);
        document.querySelector(".selectedtags").appendChild(listdiv);
        let crosses = document.getElementsByClassName("cross");
        for (let i = 0; i < crosses.length; i++) {
            crosses[i].addEventListener('click', e => {
                const par = e.target.parentElement;
                par.remove();
            })
        }
        document.querySelector(".selectedtags").scrollTop = document.querySelector(".selectedtags").scrollHeight;
    })
    document.getElementById("API").addEventListener('click', e => {
        e.preventDefault();
        e.preventDefault();
        let tags = "";
        let taglist = document.getElementsByClassName("tagId");
        for (let i = 0; i < taglist.length; i++) {
            tags += `${taglist[i].innerText};`;
        }
        let start = document.querySelector(".startR").value;
        let end = document.querySelector(".stopR").value;
        console.log(tags);
        str = `https://codeforces.com/api/problemset.problems?tags=${tags}`

        fetch(str,
            {
                method: "GET"
            }
        ).then(res => res.json())
            .then(data => {
                let problems = [];
                if (start > 0 && end > 0) {
                    for (let i = 0; i < data.result.problems.length; i++) {
                        let currProblem = data.result.problems[i];
                        if (currProblem.rating >= start && currProblem.rating <= end)
                            problems.push(currProblem);
                    }
                }
                else
                    problems = data.result.problems;
                // console.log(problems);
                for (let i = 0; i < 4; i++) {
                    var idx = Math.floor(Math.random() * problems.length);
                    let task = createTodo('');
                    const li = task.getElementsByTagName('li')[0];
                    li.innerHTML = `<a target="_blank" href = "https://codeforces.com/problemset/problem/${problems[idx].contestId}/${problems[idx].index}">${problems[idx].name}</a>`;
                    if (tasks.length == 0)
                        taskdiv.querySelector(".no").remove();
                    taskdiv.appendChild(task);
                }

                document.querySelector(".filter-section").style.display = "none";
                update();
                updateDrag();
            })
    })

})




