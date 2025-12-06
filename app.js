// Global State
let currentUser = null;
let userRole = null;
let currentMachineId = null; // For machine operators
let customers = [];
let materials = [];
let vehicles = [];
let machines = [];
let orders = [];
let weighings = [];
let filteredOrders = [];
let autoWeightInterval = null;
let orderCounter = 1;
let weighingCounter = 1;

// Initialize App
function initApp() {
    loadData();
    if (materials.length === 0) loadDefaultData();
    startAutoWeightSimulation();
    setTodayDates();
}

// Load data from localStorage
function loadData() {
    const savedCustomers = localStorage.getItem('quarry_customers');
    const savedMaterials = localStorage.getItem('quarry_materials');
    const savedVehicles = localStorage.getItem('quarry_vehicles');
    const savedMachines = localStorage.getItem('quarry_machines');
    const savedOrders = localStorage.getItem('quarry_orders');
    const savedWeighings = localStorage.getItem('quarry_weighings');
    const savedOrderCounter = localStorage.getItem('quarry_orderCounter');
    const savedWeighingCounter = localStorage.getItem('quarry_weighingCounter');

    if (savedCustomers) customers = JSON.parse(savedCustomers);
    if (savedMaterials) materials = JSON.parse(savedMaterials);
    if (savedVehicles) vehicles = JSON.parse(savedVehicles);
    if (savedMachines) machines = JSON.parse(savedMachines);
    if (savedOrders) orders = JSON.parse(savedOrders);
    if (savedWeighings) weighings = JSON.parse(savedWeighings);
    if (savedOrderCounter) orderCounter = parseInt(savedOrderCounter);
    if (savedWeighingCounter) weighingCounter = parseInt(savedWeighingCounter);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('quarry_customers', JSON.stringify(customers));
    localStorage.setItem('quarry_materials', JSON.stringify(materials));
    localStorage.setItem('quarry_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('quarry_machines', JSON.stringify(machines));
    localStorage.setItem('quarry_orders', JSON.stringify(orders));
    localStorage.setItem('quarry_weighings', JSON.stringify(weighings));
    localStorage.setItem('quarry_orderCounter', orderCounter.toString());
    localStorage.setItem('quarry_weighingCounter', weighingCounter.toString());
}

// Load default data
function loadDefaultData() {
    customers = [
        { id: 1, name: 'Constructora ABC S.A.', taxId: '900123456-7', phone: '555-0101', email: 'contacto@abc.com', address: 'Av. Principal 123', creditLimit: 50000 },
        { id: 2, name: 'Obras Civiles XYZ Ltda', taxId: '900234567-8', phone: '555-0102', email: 'info@xyz.com', address: 'Calle 45 #23-12', creditLimit: 30000 }
    ];

    materials = [
        { id: 1, name: 'Arena de Río', type: 'Arena', price: 45, stock: 500, description: 'Arena lavada de río, ideal para construcción' },
        { id: 2, name: 'Grava Triturada', type: 'Grava', price: 55, stock: 800, description: 'Grava triturada 3/4"' },
        { id: 3, name: 'Piedra Base', type: 'Piedra', price: 38, stock: 1200, description: 'Piedra para base de carreteras' },
        { id: 4, name: 'Roca para Gavión', type: 'Roca', price: 65, stock: 600, description: 'Roca de gran tamaño para gaviones' }
    ];

    vehicles = [
        { id: 1, plate: 'ABC-123', type: 'Volqueta', capacity: 15, driver: 'Juan Pérez', status: 'available' },
        { id: 2, plate: 'XYZ-789', type: 'Camión', capacity: 10, driver: 'María García', status: 'available' }
    ];

    machines = [
        { id: 1, name: 'Cargadora CAT 950', code: 'CAT950', type: 'Cargadora Frontal', operator: 'Carlos Rodríguez', username: 'maquina1', password: 'maq123', status: 'available' },
        { id: 2, name: 'Excavadora JCB 220', code: 'JCB220', type: 'Excavadora', operator: 'Luis Martínez', username: 'maquina2', password: 'maq123', status: 'available' },
        { id: 3, name: 'Cargadora Komatsu WA380', code: 'KOM380', type: 'Cargadora Frontal', operator: 'Roberto Silva', username: 'maquina3', password: 'maq123', status: 'available' }
    ];

    saveData();
}

// Set today's date in filters
function setTodayDates() {
    const today = new Date().toISOString().split('T')[0];
    const filters = ['filterOrderDateFrom', 'filterOrderDateTo', 'reportDateFrom', 'reportDateTo'];
    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = today;
    });
}

// Login
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === 'admin' && pass === 'admin123') {
        currentUser = 'Administrador';
        userRole = 'admin';
        showMainApp();
    } else if (user === 'operador' && pass === 'operador123') {
        currentUser = 'Operador';
        userRole = 'operator';
        showMainApp();
    } else if (user === 'bascula' && pass === 'bascula123') {
        currentUser = 'Operador de Báscula';
        userRole = 'scale';
        showMainApp();
    } else {
        // Check if it's a machine operator
        const machine = machines.find(m => m.username === user && m.password === pass);
        if (machine) {
            currentUser = machine.operator + ' (' + machine.name + ')';
            userRole = 'machine';
            currentMachineId = machine.id;
            showMainApp();
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    }
}

// Show main app
function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userDisplay').textContent = currentUser;

    // Show tabs based on role
    if (userRole === 'admin') {
        ['tabCustomers', 'tabMaterials', 'tabVehicles', 'tabMachines', 'tabReports'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });
    }

    // Machine operators only see their assigned orders
    if (userRole === 'machine') {
        ['tabDashboard', 'tabOrders', 'tabWeighing'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        const machineOrdersTab = document.getElementById('tabMachineOrders');
        if (machineOrdersTab) machineOrdersTab.classList.remove('hidden');
        loadMachineOrders();
        showTab('machineOrders');
        return;
    }

    loadCustomersToSelect();
    loadMaterialsToSelect();
    loadMachinesToSelect();
    loadDashboard();
    showTab('dashboard');
}

// Logout
function logout() {
    currentUser = null;
    userRole = null;
    currentMachineId = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
}

// Show tab
function showTab(tab) {
    // Hide all sections
    const sections = ['dashboardSection', 'ordersSection', 'weighingSection', 'customersSection', 'materialsSection', 'vehiclesSection', 'machinesSection', 'machineOrdersSection', 'reportsSection'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.remove('border-blue-600', 'text-black');
        t.classList.add('text-gray-500');
    });

    // Show selected section
    const sectionEl = document.getElementById(tab + 'Section');
    if (sectionEl) sectionEl.classList.remove('hidden');

    const activeTab = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (activeTab) {
        activeTab.classList.add('border-blue-600', 'text-black');
        activeTab.classList.remove('text-gray-500');
    }

    // Load data for section
    if (tab === 'dashboard') loadDashboard();
    else if (tab === 'orders') { loadOrders(); filterOrders(); }
    else if (tab === 'weighing') loadWeighingSidebar();
    else if (tab === 'customers') loadCustomers();
    else if (tab === 'materials') loadMaterials();
    else if (tab === 'vehicles') loadVehicles();
    else if (tab === 'machines') loadMachines();
    else if (tab === 'machineOrders') loadMachineOrders();
    else if (tab === 'reports') generateReports();
}

// Auto weight simulation
function startAutoWeightSimulation() {
    autoWeightInterval = setInterval(() => {
        const weight = (Math.random() * 25 + 5).toFixed(2);
        document.getElementById('currentWeight').textContent = weight;
    }, 2000);
}

// Load Dashboard
function loadDashboard() {
    // KPIs
    const activeOrders = orders.filter(o => o.status !== 'delivered').length;
    document.getElementById('kpiActiveOrders').textContent = activeOrders;

    const today = new Date().toDateString();
    const todayWeighings = weighings.filter(w => new Date(w.date).toDateString() === today);
    const salesToday = todayWeighings.reduce((sum, w) => sum + (w.total || 0), 0);
    document.getElementById('kpiSalesToday').textContent = '$' + salesToday.toFixed(0);

    const vehiclesInPlant = weighings.filter(w => w.type === 'entry' && !weighings.find(e => e.type === 'exit' && e.plate === w.plate && e.date > w.date)).length;
    document.getElementById('kpiVehicles').textContent = vehiclesInPlant;

    const tonnesToday = todayWeighings.filter(w => w.netWeight).reduce((sum, w) => sum + w.netWeight, 0);
    document.getElementById('kpiTonnes').textContent = tonnesToday.toFixed(1);

    // Recent Orders
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersDiv = document.getElementById('recentOrders');
    if (recentOrders.length === 0) {
        recentOrdersDiv.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pedidos recientes</p>';
    } else {
        recentOrdersDiv.innerHTML = '';
        recentOrders.forEach(order => {
            const customer = customers.find(c => c.id === order.customerId);
            const material = materials.find(m => m.id === order.materialId);
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
            div.innerHTML = `
                <div>
                    <p class="font-semibold">#${order.number} - ${customer?.name || 'N/A'}</p>
                    <p class="text-sm text-gray-600">${material?.name || 'N/A'} - ${order.quantity} Ton</p>
                </div>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            `;
            recentOrdersDiv.appendChild(div);
        });
    }

    // Recent Weighings
    const recentWeighings = weighings.slice(-5).reverse();
    const recentWeighingsDiv = document.getElementById('recentWeighings');
    if (recentWeighings.length === 0) {
        recentWeighingsDiv.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pesajes recientes</p>';
    } else {
        recentWeighingsDiv.innerHTML = '';
        recentWeighings.forEach(weigh => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
            const weightDisplay = weigh.netWeight ? `${weigh.netWeight.toFixed(2)} Ton (Neto)` : `${weigh.weight.toFixed(2)} Ton (${weigh.type === 'entry' ? 'Entrada' : 'Salida'})`;
            div.innerHTML = `
                <div>
                    <p class="font-semibold">${weigh.plate}</p>
                    <p class="text-sm text-gray-600">${weightDisplay}</p>
                </div>
                <p class="text-xs text-gray-500">${new Date(weigh.date).toLocaleTimeString()}</p>
            `;
            recentWeighingsDiv.appendChild(div);
        });
    }
}

// Order Management
function showNewOrderModal() {
    loadCustomersToSelect();
    loadMaterialsToSelect();
    loadMachinesToSelect();
    document.getElementById('newOrderModal').classList.remove('hidden');
}

function createOrder(event) {
    event.preventDefault();

    const customerId = parseInt(document.getElementById('orderCustomer').value);
    const materialId = parseInt(document.getElementById('orderMaterial').value);
    const machineId = parseInt(document.getElementById('orderMachine').value);
    const quantity = parseFloat(document.getElementById('orderQuantity').value);
    const deliveryDate = document.getElementById('orderDeliveryDate').value;
    const notes = document.getElementById('orderNotes').value;

    if (!machineId) {
        alert('Por favor selecciona una máquina para asignar el pedido');
        return;
    }

    const order = {
        id: Date.now(),
        number: orderCounter.toString().padStart(6, '0'),
        customerId,
        materialId,
        machineId,
        quantity,
        delivered: 0,
        deliveryDate,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: currentUser
    };

    orders.push(order);
    orderCounter++;
    saveData();

    closeModal('newOrderModal');
    event.target.reset();
    loadOrders();
    filterOrders();
    alert('Pedido creado exitosamente: #' + order.number);
}

function loadOrders() {
    loadCustomersToFilterSelect();
    loadActiveOrdersToSelect();
}

function filterOrders() {
    const status = document.getElementById('filterOrderStatus').value;
    const customerId = document.getElementById('filterOrderCustomer').value;
    const dateFrom = document.getElementById('filterOrderDateFrom').value;
    const dateTo = document.getElementById('filterOrderDateTo').value;

    filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.deliveryDate).toISOString().split('T')[0];
        const statusMatch = !status || order.status === status;
        const customerMatch = !customerId || order.customerId === parseInt(customerId);
        const dateMatch = (!dateFrom || orderDate >= dateFrom) && (!dateTo || orderDate <= dateTo);
        return statusMatch && customerMatch && dateMatch;
    });

    displayOrders();
}

function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center py-8 text-gray-500">No hay pedidos que coincidan con los filtros</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    filteredOrders.forEach(order => {
        const customer = customers.find(c => c.id === order.customerId);
        const material = materials.find(m => m.id === order.materialId);
        const machine = machines.find(m => m.id === order.machineId);
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-4 font-semibold">#${order.number}</td>
            <td class="p-4">${customer?.name || 'N/A'}</td>
            <td class="p-4">${material?.name || 'N/A'}</td>
            <td class="p-4 text-right">${order.quantity.toFixed(2)}</td>
            <td class="p-4 text-right">${order.delivered.toFixed(2)}</td>
            <td class="p-4">${new Date(order.deliveryDate).toLocaleDateString()}</td>
            <td class="p-4 text-sm">${machine?.code || 'N/A'}</td>
            <td class="p-4"><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td class="p-4 text-center">
                <button onclick="viewOrderDetail(${order.id})" class="text-blue-600 hover:underline text-sm">Ver</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const customer = customers.find(c => c.id === order.customerId);
    const material = materials.find(m => m.id === order.materialId);

    let detail = `PEDIDO #${order.number}\n\n`;
    detail += `Cliente: ${customer?.name || 'N/A'}\n`;
    detail += `Material: ${material?.name || 'N/A'}\n`;
    detail += `Cantidad pedida: ${order.quantity} Ton\n`;
    detail += `Cantidad entregada: ${order.delivered} Ton\n`;
    detail += `Pendiente: ${(order.quantity - order.delivered).toFixed(2)} Ton\n`;
    detail += `Fecha de entrega: ${new Date(order.deliveryDate).toLocaleDateString()}\n`;
    detail += `Estado: ${getStatusText(order.status)}\n`;
    if (order.notes) detail += `\nNotas: ${order.notes}`;

    alert(detail);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'in-process': 'En Proceso',
        'completed': 'Completado',
        'delivered': 'Entregado'
    };
    return statusMap[status] || status;
}

// Weighing System
function handleWeighTypeChange() {
    const type = document.getElementById('weighType').value;
    const exitFields = document.getElementById('exitWeighFields');

    if (type === 'exit') {
        exitFields.classList.remove('hidden');
        loadActiveOrdersToSelect();
    } else {
        exitFields.classList.add('hidden');
    }
}

function processWeighing(event) {
    event.preventDefault();

    const type = document.getElementById('weighType').value;
    const plate = document.getElementById('weighPlate').value.toUpperCase();
    const driver = document.getElementById('weighDriver').value;
    const notes = document.getElementById('weighNotes').value;
    const weight = parseFloat(document.getElementById('currentWeight').textContent);

    let weighing = {
        id: Date.now(),
        number: weighingCounter.toString().padStart(8, '0'),
        type,
        plate,
        driver,
        weight,
        notes,
        date: new Date().toISOString(),
        createdBy: currentUser
    };

    // If exit weighing, calculate net weight
    if (type === 'exit') {
        const orderId = parseInt(document.getElementById('weighOrder').value);
        if (!orderId) {
            alert('Por favor selecciona un pedido');
            return;
        }

        const entryWeighing = weighings.find(w => w.plate === plate && w.type === 'entry' && !w.paired);
        if (!entryWeighing) {
            alert('No se encontró pesaje de entrada para esta placa');
            return;
        }

        const netWeight = weight - entryWeighing.weight;
        if (netWeight <= 0) {
            alert('Error: El peso de salida debe ser mayor al peso de entrada');
            return;
        }

        weighing.orderId = orderId;
        weighing.entryWeighingId = entryWeighing.id;
        weighing.netWeight = netWeight;
        weighing.entryWeight = entryWeighing.weight;
        weighing.exitWeight = weight;

        // Update order
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.delivered += netWeight;
            if (order.status === 'pending') order.status = 'in-process';
            if (order.delivered >= order.quantity) order.status = 'completed';

            // Calculate total
            const material = materials.find(m => m.id === order.materialId);
            weighing.total = netWeight * (material?.price || 0);
        }

        // Mark entry as paired
        entryWeighing.paired = true;
    }

    weighings.push(weighing);
    weighingCounter++;
    saveData();

    showWeighTicket(weighing);
    clearWeighForm();
    loadWeighingSidebar();
    loadDashboard();
}

function clearWeighForm() {
    document.getElementById('weighType').value = '';
    document.getElementById('weighPlate').value = '';
    document.getElementById('weighDriver').value = '';
    document.getElementById('weighNotes').value = '';
    document.getElementById('exitWeighFields').classList.add('hidden');
}

function showWeighTicket(weighing) {
    document.getElementById('ticketNumber').textContent = weighing.number;
    document.getElementById('ticketDate').textContent = new Date(weighing.date).toLocaleString();
    document.getElementById('ticketPlate').textContent = weighing.plate;
    document.getElementById('ticketDriver').textContent = weighing.driver || 'N/A';

    if (weighing.type === 'exit' && weighing.netWeight) {
        document.getElementById('ticketEntryWeight').textContent = weighing.entryWeight.toFixed(2) + ' Ton';
        document.getElementById('ticketExitWeight').textContent = weighing.exitWeight.toFixed(2) + ' Ton';
        document.getElementById('ticketNetWeight').textContent = weighing.netWeight.toFixed(2) + ' Ton';

        const order = orders.find(o => o.id === weighing.orderId);
        if (order) {
            const customer = customers.find(c => c.id === order.customerId);
            const material = materials.find(m => m.id === order.materialId);
            document.getElementById('ticketOrderNumber').textContent = order.number;
            document.getElementById('ticketCustomer').textContent = customer?.name || 'N/A';
            document.getElementById('ticketMaterial').textContent = material?.name || 'N/A';
            document.getElementById('ticketOrderInfo').classList.remove('hidden');
        }
    } else {
        if (weighing.type === 'entry') {
            document.getElementById('ticketEntryWeight').textContent = weighing.weight.toFixed(2) + ' Ton';
        } else {
            document.getElementById('ticketExitWeight').textContent = weighing.weight.toFixed(2) + ' Ton';
        }
        document.getElementById('ticketNetWeight').textContent = '-';
        document.getElementById('ticketOrderInfo').classList.add('hidden');
    }

    document.getElementById('weighTicketModal').classList.remove('hidden');
}

function loadWeighingSidebar() {
    const recent = weighings.slice(-10).reverse();
    const sidebar = document.getElementById('weighingSidebar');

    if (recent.length === 0) {
        sidebar.innerHTML = '<p class="text-gray-500 text-center py-8">No hay pesajes registrados</p>';
        return;
    }

    sidebar.innerHTML = '';
    recent.forEach(w => {
        const div = document.createElement('div');
        div.className = 'p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100';
        div.onclick = () => showWeighTicket(w);
        const weightText = w.netWeight ? `${w.netWeight.toFixed(2)} Ton (Neto)` : `${w.weight.toFixed(2)} Ton`;
        const typeText = w.type === 'entry' ? '📥 Entrada' : '📤 Salida';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <p class="font-semibold text-sm">${w.plate}</p>
                <span class="text-xs text-gray-500">${typeText}</span>
            </div>
            <p class="text-sm text-gray-600">${weightText}</p>
            <p class="text-xs text-gray-500">${new Date(w.date).toLocaleTimeString()}</p>
        `;
        sidebar.appendChild(div);
    });
}

// Customer Management
function showNewCustomerModal() {
    document.getElementById('newCustomerModal').classList.remove('hidden');
}

function createCustomer(event) {
    event.preventDefault();

    const customer = {
        id: Date.now(),
        name: document.getElementById('customerName').value,
        taxId: document.getElementById('customerTaxId').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value,
        creditLimit: parseFloat(document.getElementById('customerCreditLimit').value) || 0
    };

    customers.push(customer);
    saveData();

    closeModal('newCustomerModal');
    event.target.reset();
    loadCustomers();
    loadCustomersToSelect();
    alert('Cliente creado exitosamente');
}

function loadCustomers() {
    const container = document.getElementById('customersList');
    if (customers.length === 0) {
        container.innerHTML = '<p class="col-span-full text-gray-500 text-center py-8">No hay clientes registrados</p>';
        return;
    }

    container.innerHTML = '';
    customers.forEach(customer => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow p-6';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-bold">${customer.name}</h3>
                <button onclick="deleteCustomer(${customer.id})" class="text-red-600 hover:text-red-800">🗑️</button>
            </div>
            <p class="text-sm text-gray-600 mb-1"><strong>NIT/ID:</strong> ${customer.taxId}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Tel:</strong> ${customer.phone || 'N/A'}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Email:</strong> ${customer.email || 'N/A'}</p>
            <p class="text-sm text-gray-600 mb-3"><strong>Dirección:</strong> ${customer.address || 'N/A'}</p>
            <div class="border-t pt-3">
                <p class="text-sm font-semibold text-blue-600">Límite de Crédito: $${customer.creditLimit.toFixed(2)}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function deleteCustomer(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        customers = customers.filter(c => c.id !== id);
        saveData();
        loadCustomers();
        loadCustomersToSelect();
    }
}

function loadCustomersToSelect() {
    const select = document.getElementById('orderCustomer');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar cliente...</option>';
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

function loadCustomersToFilterSelect() {
    const select = document.getElementById('filterOrderCustomer');
    if (!select) return;
    select.innerHTML = '<option value="">Todos</option>';
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

// Material Management
function showNewMaterialModal() {
    document.getElementById('newMaterialModal').classList.remove('hidden');
}

function createMaterial(event) {
    event.preventDefault();

    const material = {
        id: Date.now(),
        name: document.getElementById('materialName').value,
        type: document.getElementById('materialType').value,
        price: parseFloat(document.getElementById('materialPrice').value),
        stock: parseFloat(document.getElementById('materialStock').value) || 0,
        description: document.getElementById('materialDescription').value
    };

    materials.push(material);
    saveData();

    closeModal('newMaterialModal');
    event.target.reset();
    loadMaterials();
    loadMaterialsToSelect();
    alert('Material creado exitosamente');
}

function loadMaterials() {
    const container = document.getElementById('materialsList');
    if (materials.length === 0) {
        container.innerHTML = '<p class="col-span-full text-gray-500 text-center py-8">No hay materiales registrados</p>';
        return;
    }

    container.innerHTML = '';
    materials.forEach(material => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow p-6';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-lg font-bold">${material.name}</h3>
                    <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">${material.type}</span>
                </div>
                <button onclick="deleteMaterial(${material.id})" class="text-red-600 hover:text-red-800">🗑️</button>
            </div>
            <p class="text-sm text-gray-600 mb-3">${material.description || 'Sin descripción'}</p>
            <div class="border-t pt-3">
                <p class="text-2xl font-bold text-green-600 mb-1">$${material.price.toFixed(2)} <span class="text-sm text-gray-600">/ Tonelada</span></p>
                <p class="text-sm text-gray-600">Stock: ${material.stock.toFixed(2)} Ton</p>
            </div>
        `;
        container.appendChild(div);
    });
}

function deleteMaterial(id) {
    if (confirm('¿Está seguro de eliminar este material?')) {
        materials = materials.filter(m => m.id !== id);
        saveData();
        loadMaterials();
        loadMaterialsToSelect();
    }
}

function loadMaterialsToSelect() {
    const select = document.getElementById('orderMaterial');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar material...</option>';
    materials.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `${m.name} - $${m.price}/Ton`;
        select.appendChild(option);
    });
}

// Vehicle Management
function showNewVehicleModal() {
    document.getElementById('newVehicleModal').classList.remove('hidden');
}

function createVehicle(event) {
    event.preventDefault();

    const vehicle = {
        id: Date.now(),
        plate: document.getElementById('vehiclePlate').value.toUpperCase(),
        type: document.getElementById('vehicleType').value,
        capacity: parseFloat(document.getElementById('vehicleCapacity').value),
        driver: document.getElementById('vehicleDriver').value,
        status: 'available'
    };

    vehicles.push(vehicle);
    saveData();

    closeModal('newVehicleModal');
    event.target.reset();
    loadVehicles();
    alert('Vehículo creado exitosamente');
}

function loadVehicles() {
    const tbody = document.getElementById('vehiclesTableBody');
    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">No hay vehículos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    vehicles.forEach(vehicle => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        const statusText = vehicle.status === 'available' ? 'Disponible' : 'En uso';
        const statusClass = vehicle.status === 'available' ? 'text-green-600' : 'text-orange-600';
        tr.innerHTML = `
            <td class="p-4 font-semibold">${vehicle.plate}</td>
            <td class="p-4">${vehicle.type}</td>
            <td class="p-4 text-right">${vehicle.capacity.toFixed(2)}</td>
            <td class="p-4">${vehicle.driver || 'N/A'}</td>
            <td class="p-4"><span class="${statusClass}">${statusText}</span></td>
            <td class="p-4 text-center">
                <button onclick="deleteVehicle(${vehicle.id})" class="text-red-600 hover:underline text-sm">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteVehicle(id) {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
        vehicles = vehicles.filter(v => v.id !== id);
        saveData();
        loadVehicles();
    }
}

// Load active orders to select
function loadActiveOrdersToSelect() {
    const select = document.getElementById('weighOrder');
    if (!select) return;

    const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'delivered');
    select.innerHTML = '<option value="">Seleccionar pedido...</option>';

    activeOrders.forEach(order => {
        const customer = customers.find(c => c.id === order.customerId);
        const material = materials.find(m => m.id === order.materialId);
        const option = document.createElement('option');
        option.value = order.id;
        option.textContent = `#${order.number} - ${customer?.name} - ${material?.name} (${(order.quantity - order.delivered).toFixed(2)} Ton pendiente)`;
        select.appendChild(option);
    });
}

// Reports
function generateReports() {
    const dateFrom = document.getElementById('reportDateFrom').value;
    const dateTo = document.getElementById('reportDateTo').value;

    const filteredWeighings = weighings.filter(w => {
        const weighDate = new Date(w.date).toISOString().split('T')[0];
        return w.netWeight && (!dateFrom || weighDate >= dateFrom) && (!dateTo || weighDate <= dateTo);
    });

    const totalSales = filteredWeighings.reduce((sum, w) => sum + (w.total || 0), 0);
    const totalTonnes = filteredWeighings.reduce((sum, w) => sum + w.netWeight, 0);
    const completedOrders = new Set(filteredWeighings.map(w => w.orderId)).size;
    const avgPrice = totalTonnes > 0 ? totalSales / totalTonnes : 0;

    document.getElementById('reportTotalSales').textContent = '$' + totalSales.toFixed(2);
    document.getElementById('reportTotalTonnes').textContent = totalTonnes.toFixed(2);
    document.getElementById('reportCompletedOrders').textContent = completedOrders;
    document.getElementById('reportAvgPrice').textContent = '$' + avgPrice.toFixed(2);

    // Sales by Material
    const salesByMaterial = {};
    filteredWeighings.forEach(w => {
        const order = orders.find(o => o.id === w.orderId);
        if (!order) return;
        const material = materials.find(m => m.id === order.materialId);
        if (!material) return;

        if (!salesByMaterial[material.id]) {
            salesByMaterial[material.id] = {
                name: material.name,
                tonnes: 0,
                orders: new Set(),
                sales: 0
            };
        }

        salesByMaterial[material.id].tonnes += w.netWeight;
        salesByMaterial[material.id].orders.add(w.orderId);
        salesByMaterial[material.id].sales += w.total || 0;
    });

    const tbody = document.getElementById('salesByMaterialBody');
    const salesData = Object.values(salesByMaterial);

    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No hay datos para el período seleccionado</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    salesData.forEach(data => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
            <td class="p-3">${data.name}</td>
            <td class="p-3 text-right">${data.tonnes.toFixed(2)}</td>
            <td class="p-3 text-right">${data.orders.size}</td>
            <td class="p-3 text-right font-semibold">$${data.sales.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportReportCSV() {
    const dateFrom = document.getElementById('reportDateFrom').value;
    const dateTo = document.getElementById('reportDateTo').value;

    let csv = 'Fecha,Ticket,Placa,Pedido,Cliente,Material,Toneladas,Total\n';

    weighings.filter(w => {
        const weighDate = new Date(w.date).toISOString().split('T')[0];
        return w.netWeight && (!dateFrom || weighDate >= dateFrom) && (!dateTo || weighDate <= dateTo);
    }).forEach(w => {
        const order = orders.find(o => o.id === w.orderId);
        const customer = customers.find(c => c.id === order?.customerId);
        const material = materials.find(m => m.id === order?.materialId);

        csv += `${new Date(w.date).toLocaleDateString()},${w.number},${w.plate},${order?.number || 'N/A'},${customer?.name || 'N/A'},${material?.name || 'N/A'},${w.netWeight.toFixed(2)},${(w.total || 0).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_cantera_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printReport() {
    window.print();
}

// Machine Management
function showNewMachineModal() {
    document.getElementById('newMachineModal').classList.remove('hidden');
}

function createMachine(event) {
    event.preventDefault();

    const machine = {
        id: Date.now(),
        name: document.getElementById('machineName').value,
        code: document.getElementById('machineCode').value.toUpperCase(),
        type: document.getElementById('machineType').value,
        operator: document.getElementById('machineOperator').value,
        username: document.getElementById('machineUsername').value,
        password: document.getElementById('machinePassword').value,
        status: 'available'
    };

    machines.push(machine);
    saveData();

    closeModal('newMachineModal');
    event.target.reset();
    loadMachines();
    loadMachinesToSelect();
    alert('Máquina creada exitosamente');
}

function loadMachines() {
    const tbody = document.getElementById('machinesTableBody');
    if (!tbody) return;

    if (machines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">No hay máquinas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    machines.forEach(machine => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        const statusText = machine.status === 'available' ? 'Disponible' : 'En uso';
        const statusClass = machine.status === 'available' ? 'text-green-600' : 'text-orange-600';
        tr.innerHTML = `
            <td class="p-4 font-semibold">${machine.code}</td>
            <td class="p-4">${machine.name}</td>
            <td class="p-4">${machine.type}</td>
            <td class="p-4">${machine.operator}</td>
            <td class="p-4"><span class="${statusClass}">${statusText}</span></td>
            <td class="p-4 text-center">
                <button onclick="deleteMachine(${machine.id})" class="text-red-600 hover:underline text-sm">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteMachine(id) {
    if (confirm('¿Está seguro de eliminar esta máquina?')) {
        machines = machines.filter(m => m.id !== id);
        saveData();
        loadMachines();
        loadMachinesToSelect();
    }
}

function loadMachinesToSelect() {
    const select = document.getElementById('orderMachine');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar máquina...</option>';
    machines.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `${m.code} - ${m.name}`;
        select.appendChild(option);
    });
}

// Machine Orders View (for machine operators)
function loadMachineOrders() {
    const container = document.getElementById('machineOrdersContainer');
    if (!container) return;

    // Get only pending orders assigned to this machine
    const myOrders = orders.filter(o => o.machineId === currentMachineId && o.status === 'pending');

    if (myOrders.length === 0) {
        container.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">No tienes pedidos pendientes asignados</p></div>';
        return;
    }

    container.innerHTML = '';
    myOrders.forEach(order => {
        const customer = customers.find(c => c.id === order.customerId);
        const material = materials.find(m => m.id === order.materialId);
        const machine = machines.find(m => m.id === order.machineId);

        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-lg p-6';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-blue-600">Pedido #${order.number}</h3>
                    <p class="text-sm text-gray-500 mt-1">Creado: ${new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Cliente</p>
                    <p class="font-semibold text-lg">${customer?.name || 'N/A'}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Material</p>
                    <p class="font-semibold text-lg">${material?.name || 'N/A'}</p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Cantidad Solicitada</p>
                    <p class="font-bold text-2xl text-blue-600">${order.quantity.toFixed(2)} Ton</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Cantidad Entregada</p>
                    <p class="font-bold text-2xl text-green-600">${order.delivered.toFixed(2)} Ton</p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Cantidad Pendiente</p>
                    <p class="font-bold text-2xl text-orange-600">${(order.quantity - order.delivered).toFixed(2)} Ton</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Fecha de Entrega</p>
                    <p class="font-semibold text-lg">${new Date(order.deliveryDate).toLocaleDateString()}</p>
                </div>
            </div>

            ${order.notes ? `<div class="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400"><p class="text-sm"><strong>Observaciones:</strong> ${order.notes}</p></div>` : ''}

            <div class="flex gap-3">
                <button onclick="markOrderAsDelivered(${order.id})" class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold transition">
                    ✅ Marcar como Cargado y Entregado
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function markOrderAsDelivered(orderId) {
    if (!confirm('¿Confirmas que este pedido ha sido cargado completamente y está listo para entrega?')) {
        return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = 'delivered';
    order.delivered = order.quantity;
    order.completedAt = new Date().toISOString();
    order.completedBy = currentUser;

    saveData();
    loadMachineOrders();
    alert('Pedido #' + order.number + ' marcado como entregado exitosamente');
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Initialize when page loads
window.onload = initApp;
