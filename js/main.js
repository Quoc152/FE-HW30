let todos = [
    // {
    //     "stt": 1,
    //     "name": "Buy groceries",
    //     "description": "Buy milk, bread, and eggs",
    //     "dueDate": "2024-08-30",
    //     "priority": 2,
    //     "checked": true,
    //     "subtasks": [
    //         {
    //             "stt": 1,
    //             "name": "Buy milk",
    //             "checked": false
    //         }
    //     ]
    // },
    // {
    //     "stt": 2,
    //     "name": "Complete project report",
    //     "description": "Finish the final report for the project",
    //     "dueDate": "2024-09-15",
    //     "priority": 3,
    //     "checked": false,
    //     "subtasks": [
    //         {
    //             "stt": 2,
    //             "name": "Draft report",
    //             "checked": true
    //         }
    //     ]
    // }
];

let checkedItems = [];
let subtaskitems = [];

// Lưu dữ liệu todos vào LocalStorage
saveToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Lấy dữ liệu todos từ LocalStorage
loadFromLocalStorage = () => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

// Show todos
function showTodo(todo) {
    // Tạo phần tử div cho todo
    const todoDiv = document.createElement('div');
    todoDiv.className = 'flex flex-col border-b-2 border-gray-200 pb-2';

    // Tạo ID duy nhất cho mỗi dropdown
    const todoId = `todo-${todo.stt}`;

    // Cấu trúc HTML cho todo
    todoDiv.innerHTML = `
        <div data-stt="${todo.stt}" class="cursor-pointer flex justify-between">
                <div class="flex gap-3 pb-2">
                    <input id="checkbox-${todo.stt}" class="w-5 h-5" type="checkbox">
                    <div id="mainchecked-${todo.stt}" class="w-5 h-5 flex justify-center items-center border border-gray-300 rounded-full ${todo.checked ? 'bg-teal-300' : ''}">
                        <i class="fa-solid fa-check text-white"></i>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div>
                            <h4 class="w-full text-sm font-bold leading-none pt-2 pb-2 ${todo.checked ? 'line-through' : ''}">${todo.name}</h4>
                            <p class="w-full text-sm font-normal leading-none pt-2 pb-2 ${todo.checked ? 'line-through' : ''}">${todo.description}</p>
                        </div>
                        <div class="w-full flex gap-3">
                            <div class="flex border border-gray-300 rounded-lg p-2 gap-1">
                                <input type="date" class="text-green-500 text-xs font-light leading-[18px]" disabled value="${todo.dueDate}">
                            </div>
                            <div class="relative inline-block">
                                <div class="flex gap-1 border border-gray-300 px-4 py-2 rounded-md text-xs font-light leading-[18px]">
                                    <img src="${getPriorityData(todo.priority).imgSrc}" alt="">
                                    <div>${getPriorityData(todo.priority).text}</div>
                                </div>         
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative inline-block">
                    <div id="dropdownButton-${todo.stt}" class="relative w-6 h-6 flex justify-center items-center rounded-[5px] cursor-pointer">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <ul id="dropdownMenu-${todo.stt}" class="hidden absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Edit</li>
                                    <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Delete</li>
                    </ul>
                </div>
            </div>
    `;

    // Thêm subtask vào todo
    const subtasksContainer = document.createElement('div');
    subtasksContainer.className = 'flex flex-col gap-2 pl-20 pr-20 pb-2 pt-2';

    todo.subtasks.forEach((subtask, index) => {
        const subtaskDiv = document.createElement('div');
        subtaskDiv.className = 'flex justify-center items-center gap-3';
        subtaskDiv.innerHTML = `
            <input class="w-5 h-5" type="checkbox">
            <div id="subchecked-${subtask.name}" class="w-5 h-5 flex justify-center items-center border border-gray-300 rounded-full ${subtask.checked ? 'bg-teal-300' : ''}">
                <i class="fa-solid fa-check text-white"></i>
            </div>
            <p class="w-full text-sm font-normal leading-none pt-2 pb-2 ${subtask.checked ? 'line-through' : ''}">${subtask.name}</p>
        `;
        subtasksContainer.appendChild(subtaskDiv);

        // Thêm sự kiện cho subtask checkbox
        const subtaskCheckbox = subtaskDiv.querySelector('input[type="checkbox"]');
        subtaskCheckbox.addEventListener('change', (event) => {
            updateCheckedItems('subtask', todo.stt, subtask.name, index, event.target.checked);
        });
    });

    todoDiv.appendChild(subtasksContainer);

    // Thêm todo vào container
    document.getElementById('todos-container').appendChild(todoDiv);

    // Gán sự kiện cho checkbox của todo
    const todoCheckbox = todoDiv.querySelector(`#checkbox-${todo.stt}`);
    todoCheckbox.addEventListener('change', (event) => {
        updateCheckedItems('todo', todo.stt, null, null, event.target.checked);
    });

    // Gán sự kiện cho nút và menu dropdown
    const dropdownButton = document.getElementById(`dropdownButton-${todo.stt}`);
    const dropdownMenu = document.getElementById(`dropdownMenu-${todo.stt}`);

    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    dropdownMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const action = event.target.textContent.trim();
            if (action === 'Edit') {
                console.log('Edit action for todo with ID:', todo.stt);
                // Thực hiện hành động chỉnh sửa cho todo hiện tại
                populateEditModal(todo.stt);
            } else if (action === 'Delete') {
                console.log('Delete action for todo with ID:', todo.stt);
                // Thực hiện hành động xóa cho todo hiện tại
                deleteTodoByStt(parseInt(todo.stt, 10));
            }
            dropdownMenu.classList.add('hidden');
        }
    });

    // Thêm sự kiện dblclick vào phần tử chứa todo
    todoDiv.addEventListener('dblclick', () => {
        populateEditModal(parseInt(todo.stt, 10));
    });
}

// Hàm để hiển thị tất cả todos
function renderTodos() {
    todos = loadFromLocalStorage();
    document.getElementById('todos-container').innerHTML = ''; // Xóa nội dung hiện tại
    todos.forEach(todo => showTodo(todo));
    updateTodosCount(todos);
}

renderTodos();

// Cập nhật dữ liệu hình ảnh và văn bản dựa trên priority
function getPriorityData(priority) {
    const priorityData = {
        1: {
            imgSrc: 'img/Content/BsFlagRed.svg',
            text: 'P1'
        },
        2: {
            imgSrc: 'img/Content/BsFlagOrange.svg',
            text: 'P2'
        },
        3: {
            imgSrc: 'img/Content/BsFlagBlue.svg',
            text: 'P3'
        },
        4: {
            imgSrc: 'img/Content/BsFlagGreen.svg',
            text: 'P4'
        }
    };

    return priorityData[priority] || {
        imgSrc: 'img/Content/BsFlag.svg',
        text: 'Priority'
    };
}

// Hàm để thêm hoặc xóa item khỏi mảng
function updateCheckedItems(type, todoStt, subtaskName = null, subtaskIndex = null, checked) {
    if (checked) {
        // Thêm vào mảng nếu chưa có
        if (!checkedItems.some(item => item.type === type && item.todoStt === todoStt && item.subtaskName === subtaskName)) {
            checkedItems.push({ type, todoStt, subtaskName, subtaskIndex });
        }
    } else {
        // Xóa khỏi mảng
        checkedItems = checkedItems.filter(item => !(item.type === type && item.todoStt === todoStt && item.subtaskName === subtaskName));
    }
    console.log('Checked items:', checkedItems);
}

// Hàm xóa todo
function deleteTodoByStt(stt) {
    const index = todos.findIndex(todo => todo.stt === stt);

    if (index !== -1) {
        todos.splice(index, 1);
        saveToLocalStorage(todos);
        renderTodos();
    } else {
        console.error('Todo with the given stt not found');
    }
}

// Hàm để mark hoặc unmark các items trong todos dựa trên checkedItems
function markCompleted() {
    checkedItems.forEach(item => {
        if (item.type === 'todo') {
            // Tìm todo theo stt và cập nhật thuộc tính checked
            const todo = todos.find(t => t.stt === item.todoStt);
            if (todo) {
                todo.checked = !todo.checked; // Mark hoặc unmark
                saveToLocalStorage(todos);
                renderTodos();
            }
        } else if (item.type === 'subtask') {
            // Tìm todo và subtask theo stt và tên, sau đó cập nhật thuộc tính checked
            const todo = todos.find(t => t.stt === item.todoStt);
            if (todo && todo.subtasks[item.subtaskIndex]) {
                todo.subtasks[item.subtaskIndex].checked = !todo.subtasks[item.subtaskIndex].checked; // Mark hoặc unmark
                saveToLocalStorage(todos);
                renderTodos();
            }
        }
    });
}

// Gán sự kiện cho nút "Mark Completed"
document.getElementById('mark-btn').addEventListener('click', () => {
    markCompleted();
    checkedItems = [];
    console.log('Todos after mark completed:', todos);
});

// Hàm để xóa các items trong todos dựa trên checkedItems
function deleteCheckedItems() {
    checkedItems.forEach(item => {
        if (item.type === 'todo') {
            // Tìm và xóa todo theo stt
            const todoIndex = todos.findIndex(t => t.stt === item.todoStt);
            if (todoIndex > -1) {
                // Xóa todo khỏi mảng todos
                todos.splice(todoIndex, 1);
                saveToLocalStorage(todos);
                renderTodos();
            }
        } else if (item.type === 'subtask') {
            // Tìm todo theo stt và xóa subtask
            const todo = todos.find(t => t.stt === item.todoStt);
            if (todo && todo.subtasks[item.subtaskIndex]) {
                // Xóa subtask khỏi mảng subtasks
                todo.subtasks.splice(item.subtaskIndex, 1);
                saveToLocalStorage(todos);
                renderTodos();
            }
        }
    });
}

// Tìm todo theo stt và hiển thị dữ liệu vào form edit
function populateEditModal(todoStt) {
    const todo = todos.find(t => t.stt === todoStt);

    if (!todo) {
        console.error('Todo not found');
        return;
    }

    // Cập nhật thông tin trong modal
    const modal = document.getElementById('editModal');
    const inputs = modal.querySelectorAll('input');
    const priorityElement = modal.querySelector('.selected-priority');

    modal.setAttribute('data-todo-stt', todoStt);

    // Cập nhật các trường nhập liệu
    inputs[0].value = todo.name;
    inputs[0].className += ` ${todo.checked ? 'line-through' : ''}`;
    inputs[1].value = todo.description;
    inputs[2].value = todo.dueDate;

    // Cập nhật Priority
    const priorityOptions = modal.querySelectorAll('.priority-options li');
    priorityOptions.forEach(option => {
        if (option.getAttribute('data-priority') == todo.priority) {
            priorityElement.innerHTML = option.innerHTML;
            priorityElement.setAttribute('data-priority', todo.priority);
        }
    });

    // Cập nhật Subtasks 
    const subtaskEditContainer = document.getElementById('subtaskedit');
    subtaskEditContainer.innerHTML = ''; // Xóa các subtask hiện tại
    document.getElementById('subtaskadd').innerHTML = '';

    todo.subtasks.forEach(subtask => {
        const subtaskDiv = document.createElement('div');
        subtaskDiv.className = 'flex justify-center items-center gap-3 pl-4 pr-4';
        subtaskDiv.innerHTML = `
            <div id="" data-checked="${subtask.checked}" class="w-5 h-5 flex justify-center items-center border border-gray-300 rounded-full ${subtask.checked ? 'bg-teal-300' : ''}">
                <i class="fa-solid fa-check text-white"></i>
            </div>
            <input class="w-full text-xs font-normal leading-none p-2 ${subtask.checked ? 'line-through' : ''}" type="text" value="${subtask.name}">
        `;
        subtaskEditContainer.appendChild(subtaskDiv);
    });

    // Hiển thị modal
    modal.classList.remove('hidden');
}

// Tìm stt lớn nhất của substasks trong 1 todos được chỉ định
function findMaxSubtaskStt(todoStt) {
    const todo = todos.find(todo => todo.stt === todoStt);

    if (!todo) {
        console.error(`Todo with stt ${todoStt} not found.`);
        return;
    }

    const maxSubtaskStt = todo.subtasks.reduce((max, subtask) => {
        return Math.max(max, subtask.stt);
    }, 0);

    return maxSubtaskStt;
}

// In ra số lượng todo đã hoàn thành/tổng todos
function updateTodosCount(todos) {
    // Tính tổng số todos
    let totalTodos = todos.length;

    // Tính tổng số todos đã hoàn thành
    let completedTodos = todos.filter(todo => todo.checked).length;

    // Cập nhật nội dung cho các phần tử HTML
    document.getElementById('comlTodos').innerText = completedTodos;
    document.getElementById('allTodos').innerText = totalTodos;
}

// DELETE MODAL
// Hiển thị modal
function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('hidden');
}

// Ẩn modal
function hideConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.add('hidden');
}

// Khi nhấn vào nút "Delete"
document.getElementById('delete-btn').addEventListener('click', () => {
    if (checkedItems.length === 0) {
        return;
    }
    showConfirmModal();
});

// Khi người dùng xác nhận xóa
document.getElementById('confirmDelete').addEventListener('click', () => {
    deleteCheckedItems();
    hideConfirmModal();
    console.log('Todos after deletion:', todos);
});

// Khi người dùng hủy xóa
document.getElementById('cancelDelete').addEventListener('click', () => {
    hideConfirmModal();
});

// Gán sự kiện cho background của modal để đóng khi click vào
document.getElementById('confirmModal').addEventListener('click', function (event) {
    if (event.target === this) {
        hideConfirmModal();
    }
});

// FORM ADD TASK
// Priority selection
document.addEventListener("DOMContentLoaded", function () {
    function setupPrioritySelection(container) {
        const selectedPriority = container.querySelector('.selected-priority');
        const priorityOptions = container.querySelector('.priority-options');

        selectedPriority.addEventListener('click', function () {
            priorityOptions.classList.toggle('hidden');
        });

        priorityOptions.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI' || event.target.tagName === 'IMG') {
                selectedPriority.innerHTML = event.target.closest('li').innerHTML;
                priorityOptions.classList.add('hidden');
                // Cập nhật giá trị data-priority trong sự kiện này
                const priorityValue = event.target.closest('li').getAttribute('data-priority');
                selectedPriority.setAttribute('data-priority', priorityValue);
            }
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', function (event) {
            if (!selectedPriority.contains(event.target) && !priorityOptions.contains(event.target)) {
                priorityOptions.classList.add('hidden');
            }
        });
    }

    // Cấu hình priority cho form thêm
    setupPrioritySelection(document.querySelector('form'));

    // Cấu hình priority cho modal chỉnh sửa
    setupPrioritySelection(document.getElementById('editModal'));
});


// Lựa chọn từng priority
document.querySelectorAll('.priority-options li').forEach(option => {
    option.addEventListener('click', function () {
        const priorityValue = this.getAttribute('data-priority');
        const priorityText = this.innerText.trim();

        const priorityElement = document.querySelector('.selected-priority');
        priorityElement.querySelector('img').src = this.querySelector('img').src;
        priorityElement.innerText = priorityText;
        priorityElement.setAttribute('data-priority', priorityValue);

        this.parentElement.classList.add('hidden');
    });
});

// Dropdown edit và delete
document.addEventListener('click', function (event) {
    var dropdownButton = document.getElementById('dropdownButton');
    var dropdownMenu = document.getElementById('dropdownMenu');

    // Kiểm tra nếu click vào nút dropdownButton
    if (dropdownButton.contains(event.target)) {
        dropdownMenu.classList.toggle('hidden');
    } else {
        // Đóng dropdown nếu click ra ngoài
        dropdownMenu.classList.add('hidden');
    }
});

// Add task
document.getElementById('AddTask-btn').addEventListener('click', () => {
    const form = document.querySelector('form');
    const addTaskBtn = document.getElementById('AddTask-btn');

    form.classList.remove('hidden');  // Hiển thị form
    addTaskBtn.classList.add('hidden'); // Ẩn thẻ AddTask-btn
});

document.getElementById('Cancel-btn').addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút
    const form = document.querySelector('form');
    const addTaskBtn = document.getElementById('AddTask-btn');

    form.classList.add('hidden');
    addTaskBtn.classList.remove('hidden');
});

// Thêm một todo
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Lấy dữ liệu từ các trường nhập liệu
    const taskName = this.querySelector('input[type="text"][placeholder="Task name"]').value;
    const description = this.querySelector('input[type="text"][placeholder="Description"]').value;
    const dueDate = this.querySelector('input[type="date"]').value;
    const priorityElement = this.querySelector('.selected-priority');
    const priority = priorityElement.getAttribute('data-priority'); // Default priority if not set

    // Kiểm tra nếu taskName trống
    if (!taskName) {
        alert('Please enter the task name.');
        return;
    }

    let maxStt = todos.reduce((max, todo) => Math.max(max, todo.stt), 0);

    // Tạo đối tượng todo mới
    const newTodo = {
        stt: ++maxStt,
        name: taskName,
        description: description,
        dueDate: dueDate,
        priority: parseInt(priority, 10),
        checked: false,
        subtasks: []
    };

    todos.push(newTodo);

    saveToLocalStorage(todos);
    renderTodos();

    this.reset();
    // Reset lại giá trị của priority
    priorityElement.innerHTML = `
        <img src="img/Content/BsFlag.svg" alt="">
        Priority
    `;
    priorityElement.setAttribute('data-priority', '');

    this.classList.add('hidden');
    document.getElementById('AddTask-btn').classList.remove('hidden');
});


// EDIT MODAL
// Add subtask
document.getElementById('AddSubTask-btn').addEventListener('click', () => {
    const addSubForm = document.getElementById('AddsubtaskForm');
    const addSubBtn = document.getElementById('AddSubTask-btn');

    addSubForm.classList.remove('hidden');
    addSubBtn.classList.add('hidden');
});

// Thêm sự kiện click cho nút SaveAddSup
document.getElementById('SaveAddSup').addEventListener('click', () => {
    const inputField = document.getElementById('subtaskInput');
    const subtaskName = document.getElementById('subtaskInput').value.trim();
    const addSubForm = document.getElementById('AddsubtaskForm');
    const addSubBtn = document.getElementById('AddSubTask-btn');
    const subtaskField = document.getElementById('subtaskadd');


    if (subtaskName) {
        let maxSttSubItem = subtaskitems.reduce((max, subtaskitem) => Math.max(max, subtaskitem.stt), 0);

        subtaskitems.push({
            stt: ++maxSttSubItem,
            name: subtaskName,
            checked: false
        });

        // Tạo phần tử div cho subtask mới
        const subtaskDiv = document.createElement('div');
        subtaskDiv.className = 'flex justify-center items-center gap-3 pl-4 pr-4';
        subtaskDiv.innerHTML = `
            <div id="" data-checked="false" class="w-5 h-5 flex justify-center items-center border border-gray-300 rounded-full">
                <i class="fa-solid fa-check text-white"></i>
            </div>
            <input class="w-full text-xs font-normal leading-none p-2" type="text" value="${subtaskName}" readonly>
        `;
        subtaskField.appendChild(subtaskDiv);

        addSubBtn.classList.remove('hidden');
        addSubForm.classList.add('hidden');
        inputField.value = '';

        console.log('Danh sách subtasks hiện tại:', subtaskitems);
    } else {
        console.log('Vui lòng nhập tên subtask.');
    }
});

// Cancel subtask
document.getElementById('CancelAddSup').addEventListener('click', () => {
    const addSubForm = document.getElementById('AddsubtaskForm');
    const addSubBtn = document.getElementById('AddSubTask-btn');
    const subtaskInput = addSubForm.querySelector('input[type="text"]');

    addSubBtn.classList.remove('hidden');
    addSubForm.classList.add('hidden');
    subtaskInput.value = '';
});

// Hủy edit
document.getElementById('CancelEdit-btn').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('editModal').classList.add('hidden');
    subtaskitems = [];
});

// Save edit
document.getElementById('SaveEdit-btn').addEventListener('click', function() {
    const modal = document.getElementById('editModal');
    const todoStt = parseInt(modal.getAttribute('data-todo-stt'), 10);
    const todoIndex = todos.findIndex(t => t.stt === todoStt);

    if (todoIndex === -1) {
        console.error('Todo not found');
        return;
    }

    // Lấy dữ liệu từ modal
    const inputs = modal.querySelectorAll('input');
    const priority = modal.querySelector('.selected-priority').getAttribute('data-priority');
    // Tìm stt lớn nhất của subtasks hiện tại
    const maxSubtaskStt = findMaxSubtaskStt(todoStt);

    // Cập nhật thông tin của todo
    todos[todoIndex] = {
        ...todos[todoIndex],
        name: inputs[0].value,
        description: inputs[1].value,
        dueDate: inputs[2].value,
        priority: priority,
        subtasks: [] // Khởi tạo danh sách subtasks mới
    };

    // Lấy các subtasks từ modal và tạo stt mới
    const subtaskEditContainer = document.getElementById('subtaskedit');
    const subtaskDivs = subtaskEditContainer.querySelectorAll('.flex'); // Chọn tất cả các phần tử với lớp 'flex'
    let nextStt = maxSubtaskStt;

    subtaskDivs.forEach(div => {
        const subtaskNameInput = div.querySelector('input');
        const subtaskCheckedDiv = div.querySelector('div[data-checked]');


        if (subtaskNameInput && subtaskCheckedDiv) {
            const subtaskName = subtaskNameInput.value;
            const subtaskChecked = subtaskCheckedDiv.getAttribute('data-checked') === 'true';

            todos[todoIndex].subtasks.push({
                name: subtaskName,
                stt: ++nextStt,
                checked: subtaskChecked
            });
        } else {
            console.error('Subtask elements are missing or incorrectly configured');
        }
    });

    // Thêm các subtasks từ subtaskitems vào todos
    subtaskitems.forEach(subtask => {
        todos[todoIndex].subtasks.push({
            name: subtask.name,
            stt: nextStt++,
            checked: subtask.checked
        });
    });

    subtaskitems = [];

    // Đóng modal
    modal.classList.add('hidden');
    console.log(todos);

    saveToLocalStorage(todos);
    renderTodos();
});










