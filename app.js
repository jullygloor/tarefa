// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SRV Worker registrado em', reg.scope))
      .catch(err => console.error('Erro ao registrar Service Worker:', err));
  });
}

// Instalação do PWA
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
  installBtn.addEventListener('click', async () => {
    installBtn.hidden = true;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log(choice.outcome === 'accepted' ? 'Instalado!' : 'Instalação rejeitada');
    deferredPrompt = null;
  });
});

// Lista de tarefas (LocalStorage para simples persistência)
const listEl = document.getElementById('task-list');
const inputEl = document.getElementById('new-task');
const addBtn = document.getElementById('add-task');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  listEl.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.textContent = task;
    const rm = document.createElement('button');
    rm.textContent = '❌';
    rm.onclick = () => deleteTask(idx);
    li.appendChild(rm);
    listEl.appendChild(li);
  });
}

function addTask() {
  const txt = inputEl.value.trim();
  if (!txt) return;
  tasks.push(txt);
  inputEl.value = '';
  updateStorage();
}

function deleteTask(idx) {
  tasks.splice(idx, 1);
  updateStorage();
}

function updateStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

addBtn.onclick = addTask;
window.onload = renderTasks;
