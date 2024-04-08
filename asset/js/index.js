// Cette partie concerne le codage pur en js

// document.addEventListener("DOMContentLoaded", function() {
//     const taskInput = document.getElementById("taskInput");
//     const addTaskBtn = document.getElementById("addTaskBtn");
//     const taskList = document.getElementById("taskList");

//     addTaskBtn.addEventListener("click", function() {
//         const taskText = taskInput.value.trim();
//         if (taskText !== "") {
//             const taskItem = document.createElement("li");
//             taskItem.classList.add("task");
//             taskItem.innerHTML = `
//                 <span>${taskText}</span>
//                 <button class="deleteBtn">Supprimer</button>
//             `;
//             taskList.appendChild(taskItem);
//             taskInput.value = "";
//             taskInput.focus();
//         }
//     });

//     taskList.addEventListener("click", function(event) {
//         if (event.target.classList.contains("deleteBtn")) {
//             event.target.parentElement.remove();
//         }
//     });
// });


// Et cette partie concerne le codage avec la bibliothèque js (jquery)

// $(document).ready(function() {
//     const $taskInput = $("#taskInput");
//     const $addTaskBtn = $("#addTaskBtn");
//     const $taskList = $("#taskList");

//     $addTaskBtn.on("click", function() {
//         const taskText = $taskInput.val().trim();
//         if (taskText !== "") {
//             const $taskItem = $("<li>").addClass("task").html(`
//                 <span>${taskText}</span>
//                 <button class="deleteBtn">Supprimer</button>
//             `);
//             $taskList.append($taskItem);
//             $taskInput.val("");
//             $taskInput.focus();
//         }
//     });

//     $taskList.on("click", ".deleteBtn", function() {
//         $(this).parent().remove();
//     });
// });

// Cette partie permet de sauvegarder les taches aujouter l'user sans créer 
// une base manuellement avec xampp ou wampp ou encore Mampp 
// Mais avec seulement le champ tache

// $(document).ready(function() {
//     const $taskInput = $("#taskInput");
//     const $addTaskBtn = $("#addTaskBtn");
//     const $taskList = $("#taskList");

//     // Fonction pour charger les tâches depuis le stockage local lors du chargement de la page
//     function loadTasks() {
//         const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//         tasks.forEach(function(taskText) {
//             addTaskToList(taskText);
//         });
//     }

//     // Fonction pour ajouter une tâche à la liste et au stockage local
//     // La variable d'incrementation
//     let incrVar= 1;
//     function addTaskToList(taskText) {
//         const $taskItem = $("<li>").addClass("task").html(`
//             <span>${incrVar}</span>
//             <span>${taskText}</span>
//             <button class="deleteBtn">Supprimer</button>
//         `);
//         $taskList.append($taskItem);
//         incrVar= incrVar + 1;
//     }

//     // Charger les tâches existantes lors du chargement de la page
//     loadTasks();

//     // Gérer l'ajout de tâche lors du clic sur le bouton "Ajouter"
//     $addTaskBtn.on("click", function() {
//         const taskText = $taskInput.val().trim();
//         if (taskText !== "") {
//             addTaskToList(taskText);
//             // Sauvegarder la tâche dans le stockage local
//             const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//             tasks.push(taskText);
//             localStorage.setItem("tasks", JSON.stringify(tasks));
//             $taskInput.val("");
//             $taskInput.focus();
//         }
//     });

//     // Gérer la suppression de tâche lors du clic sur le bouton "Supprimer"
//     $taskList.on("click", ".deleteBtn", function() {
//         $(this).parent().remove();
//         // Mettre à jour le stockage local après la suppression
//         const taskText = $(this).prev().text();
//         const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//         const index = tasks.indexOf(taskText);
//         if (index !== -1) {
//             tasks.splice(index, 1);
//             localStorage.setItem("tasks", JSON.stringify(tasks));
//         }
//     });
// });


// Cette partie permet de sauvegarder les taches aujouter l'user sans créer 
// une base manuellement avec xampp ou wampp ou encore Mampp 

$(document).ready(function() {
    const $taskInput = $("#taskInput");
    const $dueDateInput = $("#dueDateInput"); // Correction de la sélection pour la date d'échéance
    const $priorityInput = $("#priorityInput");
    const $addTaskBtn = $("#addTaskBtn");
    const $taskList = $("#taskList");
    const $completedTasksCount = $("#completedTasksCount"); // Sélection de l'élément HTML pour afficher le nombre de tâches complétées
    const $completedTasksText = $("#completedTasksText"); // Sélection de l'élément HTML pour afficher le texte du nombre de tâches terminées

    let incrVar = 1;

    function addTaskToList(taskText, dueDate, priority, completed) {
        const $taskItem = $("<li>").addClass("task").html(`
            <span>${incrVar}</span>
            <span class="task-text">${taskText}</span>
            <span class="task-due-date">${dueDate}</span>
            <span class="task-priority">${priority}</span>
            <input type="checkbox" class="task-completed">
            <button class="deleteBtn">Supprimer</button>
            <button class="editBtn">Modifier</button> <!-- Bouton "Modifier" ajouté -->
        `);
        $taskList.append($taskItem);
        incrVar = incrVar + 1;
        $taskItem.hide().fadeIn(); // Animation de fondu lors de l'ajout de la tâche
        // Mettre à jour la case à cocher en fonction de l'état de la tâche dans le stockage local
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks.find(task => task.text === taskText && task.dueDate === dueDate && task.priority === priority);
        if (task && task.completed) {
            $taskItem.find(".task-completed").prop("checked", true);
        }
        
        updateCompletedTasksCount(); // Mise à jour du nombre de tâches complétées lors de l'ajout d'une nouvelle tâche
    }
    
    

    function saveTask(taskText, dueDate, priority, completed) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: taskText, dueDate: dueDate, priority: priority, completed: completed });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(function(task) {
            addTaskToList(task.text, task.dueDate, task.priority, task.status, task.completed);
        });
        updateCompletedTasksCount(); // Mise à jour du nombre de tâches complétées lors du chargement de la page
    }

    function updateCompletedTasksCount() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const completedTasks = tasks.filter(task => task.completed).length;
        $completedTasksCount.text(completedTasks); // Mise à jour du texte affichant le nombre de tâches complétées
        $completedTasksText.text(`Nombre de tâches terminées : ${completedTasks}`); // Mise à jour du texte du nombre de tâches terminées
    }

    loadTasks();

    $addTaskBtn.on("click", function() {
        const taskText = $taskInput.val().trim();
        const dueDate = $dueDateInput.val().trim(); // Utilisation correcte de $dueDateInput
        const priority = $priorityInput.val().trim();
        if (taskText !== "") {
            addTaskToList(taskText, dueDate, priority, false);
            saveTask(taskText, dueDate, priority, false);
            $taskInput.val("");
            $dueDateInput.val("");
            $priorityInput.val("");
            $taskInput.focus();
        }
    });

    $taskList.on("click", ".deleteBtn", function() {
        const $taskItem = $(this).parent();
        $taskItem.slideUp(function() {
            $(this).remove();
            updateCompletedTasksCount(); // Mise à jour du nombre de tâches complétées après la suppression d'une tâche
        });
        const taskText = $taskItem.find(".task-text").text();
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(task => task.text === taskText);
        if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
    

    $taskList.on("change", ".task-completed", function() {
        const taskText = $(this).prevAll(".task-text").text();
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(task => task.text === taskText);
        if (index !== -1) {
            tasks[index].completed = $(this).prop('checked');
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        updateCompletedTasksCount(); // Mise à jour du nombre de tâches complétées après le changement d'état d'une tâche
    });
    // Cette partie c'est pour la modification des information entrée par l'utilisateur 

    $taskList.on("click", ".editBtn", function() {
        const $taskItem = $(this).closest(".task");
        const taskText = $taskItem.find(".task-text").text();
        const dueDate = $taskItem.find(".task-due-date").text();
        const priority = $taskItem.find(".task-priority").text();
    
        // Utilisation de la fonction prompt pour afficher une alerte avec les valeurs actuelles et permettre la modification
        const updatedTaskText = prompt("Modifier la tâche :", taskText);
        const updatedDueDate = prompt("Modifier la date d'échéance :", dueDate);
        const updatedPriority = prompt("Modifier la priorité :", priority);
    
        // Vérification si l'utilisateur a cliqué sur "Annuler" ou a laissé le champ vide
        if (updatedTaskText !== null && updatedDueDate !== null && updatedPriority !== null && updatedTaskText.trim() !== "") {
            // Mettre à jour les valeurs dans le DOM
            $taskItem.find(".task-text").text(updatedTaskText);
            $taskItem.find(".task-due-date").text(updatedDueDate);
            $taskItem.find(".task-priority").text(updatedPriority);
    
            // Mettre à jour les valeurs dans le stockage local
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const index = tasks.findIndex(task => task.text === taskText && task.dueDate === dueDate && task.priority === priority);
            if (index !== -1) {
                tasks[index].text = updatedTaskText;
                tasks[index].dueDate = updatedDueDate;
                tasks[index].priority = updatedPriority;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    });
    

// La partie recherche 
$("#searchInput").on("input", function() {
        const searchText = $(this).val().trim().toLowerCase();
        $("#taskList .task").each(function() {
            const taskText = $(this).find(".task-text").text().toLowerCase();
            if (taskText.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    // Ajout d'une animation pour les éléments cachés et affichés
$(".task").on("transitionend", function() {
    if ($(this).hasClass("hide")) {
        $(this).hide();
    }
});
});