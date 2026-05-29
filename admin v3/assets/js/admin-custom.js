const ADMIN_TOKEN_KEY = 'saudavel_admin_token';
const ADMIN_USER_KEY = 'saudavel_admin_user';

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminSession(token, user) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

function getRequestHeaders(extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  const token = getAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch(path, options = {}) {
  const opts = {
    credentials: 'include',
    headers: getRequestHeaders(options.headers || {}),
    ...options,
  };
  return fetch(path, opts);
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  if (!emailInput || !passwordInput) return;

  const username = emailInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    alert('Por favor, preencha email e senha.');
    return;
  }

  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Falha no login');
    }

    if (!result.user || result.user.role !== 'admin') {
      clearAdminSession();
      throw new Error('Acesso negado. Apenas administradores podem entrar.');
    }

    setAdminSession(result.token, result.user);
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message || 'Erro ao autenticar.');
  }
}

async function validateAdminToken() {
  try {
    const response = await apiFetch('/auth/me');
    if (!response.ok) return null;
    const result = await response.json();
    return result.user;
  } catch (err) {
    return null;
  }
}

async function handleLogout(event) {
  event.preventDefault();
  clearAdminSession();

  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (error) {
    // ignorar erros de logout
  }

  window.location.href = 'login.html';
}

function setupLogoutLinks() {
  document.querySelectorAll('a[href="login.html"]').forEach((link) => {
    link.addEventListener('click', handleLogout);
  });
}

async function ensureAuthenticated() {
  const token = getAdminToken();
  if (window.location.pathname.endsWith('login.html')) {
    if (token) {
      const user = await validateAdminToken();
      if (user && user.role === 'admin') {
        window.location.href = 'index.html';
      }
    }
    return;
  }

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const user = await validateAdminToken();
  if (!user || user.role !== 'admin') {
    clearAdminSession();
    window.location.href = 'login.html';
    return;
  }
}

function createUserRow(user) {
  const tr = document.createElement('tr');

  const nameCell = document.createElement('td');
  const nameList = document.createElement('ul');
  nameList.className = 'list-inline d-flex';
  nameList.innerHTML = `
    <li>
      <img width="35" src="assets/images/doctor.jpg" class="rounded-circle" alt="Foto">
      <span>${user.username || 'Desconhecido'}</span>
    </li>
  `;
  nameCell.appendChild(nameList);

  const roleCell = document.createElement('td');
  roleCell.textContent = user.role || 'user';

  const emailCell = document.createElement('td');
  emailCell.textContent = user.username || '---';

  const phoneCell = document.createElement('td');
  phoneCell.textContent = user.socketId || '---';

  const createdCell = document.createElement('td');
  createdCell.textContent = new Date(user.connectedAt || Date.now()).toLocaleString('pt-PT');

  const accessCell = document.createElement('td');
  accessCell.textContent = new Date(user.connectedAt || Date.now()).toLocaleString('pt-PT');

  const statusCell = document.createElement('td');
  const statusButton = document.createElement('a');
  statusButton.href = '#!';
  statusButton.className = user.role === 'banned' ? 'btn_inativo' : 'btn_ativo';
  statusButton.textContent = user.role === 'banned' ? 'Banido' : 'Ativo';
  statusCell.appendChild(statusButton);

  const actionsCell = document.createElement('td');
  actionsCell.className = 'text-center';
  const actionLink = document.createElement('a');
  actionLink.href = '#!';
  actionLink.title = user.role === 'banned' ? 'Desbanir' : 'Banir';
  actionLink.innerHTML = `<i class="f-16 icofont icofont-trash"></i>`;
  actionLink.addEventListener('click', async (event) => {
    event.preventDefault();
    await toggleUserBan(user.id, user.role === 'banned' ? 'unban' : 'ban');
  });
  actionsCell.appendChild(actionLink);

  tr.appendChild(nameCell);
  tr.appendChild(roleCell);
  tr.appendChild(emailCell);
  tr.appendChild(phoneCell);
  tr.appendChild(createdCell);
  tr.appendChild(accessCell);
  tr.appendChild(statusCell);
  tr.appendChild(actionsCell);

  return tr;
}

function createMedicoRow(medico) {
  const tr = document.createElement('tr');

  const nameCell = document.createElement('td');
  const nameList = document.createElement('ul');
  nameList.className = 'list-inline d-flex';
  nameList.innerHTML = `
    <li>
      <img width="35" src="assets/images/doctor.jpg" class="rounded-circle" alt="Foto">
      <span>${medico.nome || 'Desconhecido'}</span>
    </li>
  `;
  nameCell.appendChild(nameList);

  const specialtyCell = document.createElement('td');
  specialtyCell.textContent = medico.especilidade || '---';

  const licenseCell = document.createElement('td');
  licenseCell.textContent = medico.licenca || '---';

  const unitCell = document.createElement('td');
  unitCell.textContent = medico.trabalho || '---';

  const phoneCell = document.createElement('td');
  phoneCell.textContent = medico.telefone || '---';

  const emailCell = document.createElement('td');
  emailCell.textContent = medico.email || '---';

  const createdCell = document.createElement('td');
  createdCell.textContent = medico.createdAt ? new Date(medico.createdAt).toLocaleDateString('pt-PT') : '---';

  const statusCell = document.createElement('td');
  const statusButton = document.createElement('a');
  statusButton.href = '#!';
  statusButton.className = 'btn_ativo';
  statusButton.textContent = medico.ativo ? 'Ativo' : 'Inativo';
  statusCell.appendChild(statusButton);

  const actionsCell = document.createElement('td');
  actionsCell.className = 'text-center';
  actionsCell.innerHTML = '<a href="#"><i class="f-16 icofont icofont-trash"></i></a>';

  tr.appendChild(nameCell);
  tr.appendChild(specialtyCell);
  tr.appendChild(licenseCell);
  tr.appendChild(unitCell);
  tr.appendChild(phoneCell);
  tr.appendChild(emailCell);
  tr.appendChild(createdCell);
  tr.appendChild(statusCell);
  tr.appendChild(actionsCell);

  return tr;
}

function createPacienteRow(utente) {
  const tr = document.createElement('tr');

  const nameCell = document.createElement('td');
  const nameList = document.createElement('ul');
  nameList.className = 'list-inline d-flex';
  nameList.innerHTML = `
    <li>
      <img width="35" src="assets/images/doctor.jpg" class="rounded-circle" alt="Foto">
      <span>${utente.nome || 'Desconhecido'} ${utente.sobrenome || ''}</span>
    </li>
  `;
  nameCell.appendChild(nameList);

  const genderCell = document.createElement('td');
  genderCell.textContent = utente.genero || '---';

  const birthCell = document.createElement('td');
  birthCell.textContent = utente.dataNascimento ? new Date(utente.dataNascimento).toLocaleDateString('pt-PT') : '---';

  const biCell = document.createElement('td');
  biCell.textContent = utente.bi || '---';

  const emailCell = document.createElement('td');
  emailCell.textContent = utente.email || '---';

  const phoneCell = document.createElement('td');
  phoneCell.textContent = utente.telefone || '---';

  const addressCell = document.createElement('td');
  addressCell.textContent = utente.morada || '---';

  const professionCell = document.createElement('td');
  professionCell.textContent = utente.profissao || '---';

  const bloodCell = document.createElement('td');
  bloodCell.textContent = utente.gsanguineo || '---';

  const rhCell = document.createElement('td');
  rhCell.textContent = utente.factorrh || '---';

  const weightCell = document.createElement('td');
  weightCell.textContent = utente.peso || '---';

  const heightCell = document.createElement('td');
  heightCell.textContent = utente.altura || '---';

  const allergyCell = document.createElement('td');
  allergyCell.textContent = utente.alergia || '---';

  const detailsCell = document.createElement('td');
  detailsCell.textContent = utente.detalhes || '---';

  const specialCell = document.createElement('td');
  specialCell.textContent = utente.condespeciais || '---';

  const unitCell = document.createElement('td');
  unitCell.textContent = utente.unidadeSaude || '---';

  const registeredCell = document.createElement('td');
  registeredCell.textContent = utente.createdAt ? new Date(utente.createdAt).toLocaleDateString('pt-PT') : '---';

  const lastVisitCell = document.createElement('td');
  lastVisitCell.textContent = utente.ultimaConsulta || '---';

  const emergencyCell = document.createElement('td');
  emergencyCell.textContent = utente.telemergencia || '---';

  const statusCell = document.createElement('td');
  const statusButton = document.createElement('a');
  statusButton.href = '#!';
  statusButton.className = 'btn_ativo';
  statusButton.textContent = 'Ativo';
  statusCell.appendChild(statusButton);

  const actionsCell = document.createElement('td');
  actionsCell.className = 'text-center';
  actionsCell.innerHTML = '<a href="#"><i class="f-16 icofont icofont-trash"></i></a>';

  tr.appendChild(nameCell);
  tr.appendChild(genderCell);
  tr.appendChild(birthCell);
  tr.appendChild(biCell);
  tr.appendChild(emailCell);
  tr.appendChild(phoneCell);
  tr.appendChild(addressCell);
  tr.appendChild(professionCell);
  tr.appendChild(bloodCell);
  tr.appendChild(rhCell);
  tr.appendChild(weightCell);
  tr.appendChild(heightCell);
  tr.appendChild(allergyCell);
  tr.appendChild(detailsCell);
  tr.appendChild(specialCell);
  tr.appendChild(unitCell);
  tr.appendChild(registeredCell);
  tr.appendChild(lastVisitCell);
  tr.appendChild(emergencyCell);
  tr.appendChild(statusCell);
  tr.appendChild(actionsCell);

  return tr;
}

async function loadConnectedUsers() {
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;

  try {
    const response = await apiFetch('/mensagens/users');
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAdminSession();
        window.location.href = 'login.html';
        return;
      }
      throw new Error('Não foi possível carregar a lista de usuários.');
    }

    const data = await response.json();
    tableBody.innerHTML = '';

    if (!data.users || data.users.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="8" class="text-center">Nenhum usuário conectado encontrado.</td>';
      tableBody.appendChild(emptyRow);
      return;
    }

    data.users.forEach((user) => {
      tableBody.appendChild(createUserRow(user));
    });
  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao carregar usuários.');
  }
}

async function loadMedicos() {
  const tableBody = document.getElementById('medicosTableBody');
  if (!tableBody) return;

  try {
    const response = await apiFetch('/medicos');
    if (!response.ok) throw new Error('Não foi possível carregar a lista de médicos.');

    const data = await response.json();
    tableBody.innerHTML = '';

    const medicos = data.dados || [];
    if (medicos.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="9" class="text-center">Nenhum médico encontrado.</td>';
      tableBody.appendChild(emptyRow);
      return;
    }

    medicos.forEach((medico) => {
      tableBody.appendChild(createMedicoRow(medico));
    });
  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao carregar médicos.');
  }
}

async function loadPacientes() {
  const tableBody = document.getElementById('pacientesTableBody');
  if (!tableBody) return;

  try {
    const response = await apiFetch('/utente');
    if (!response.ok) throw new Error('Não foi possível carregar a lista de pacientes.');

    const data = await response.json();
    tableBody.innerHTML = '';

    const pacientes = data.dados || [];
    if (pacientes.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="21" class="text-center">Nenhum paciente encontrado.</td>';
      tableBody.appendChild(emptyRow);
      return;
    }

    pacientes.forEach((paciente) => {
      tableBody.appendChild(createPacienteRow(paciente));
    });
  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao carregar pacientes.');
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  loginForm.addEventListener('submit', handleLoginSubmit);
}

async function initAdminCustom() {
  setupLogoutLinks();
  await ensureAuthenticated();
  setupLoginForm();

  const pageName = window.location.pathname.split('/').pop();
  if (pageName === 'utilizadores.html') {
    await loadConnectedUsers();
  } else if (pageName === 'medicos.html') {
    await loadMedicos();
  } else if (pageName === 'pacientes.html') {
    await loadPacientes();
  }
}

window.addEventListener('DOMContentLoaded', initAdminCustom);
