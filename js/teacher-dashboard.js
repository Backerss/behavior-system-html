// Set current date
document.addEventListener('DOMContentLoaded', function() {
    // Set current date in Thai format
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const thaiDate = today.toLocaleDateString('th-TH', options);
    document.querySelector('.current-date').textContent = thaiDate;
    
    // Initialize charts
    initViolationTrendChart();
    initViolationTypesChart();
    
    // Mobile navigation active state
    const navLinks = document.querySelectorAll('.bottom-navbar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => {
                item.classList.remove('text-primary-app');
            });
            this.classList.add('text-primary-app');
        });
    });
    
    // Sidebar navigation active state
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    menuItems.forEach(item => {
        if (!item.hasAttribute('data-bs-toggle')) {
            item.addEventListener('click', function(e) {
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                this.classList.add('active');
            });
        }
    });
    
    // Student search in violation modal
    const studentSearchInput = document.querySelector('#newViolationModal input[placeholder="พิมพ์ชื่อหรือรหัสนักเรียน..."]');
    const selectedStudentContainer = document.querySelector('.selected-student');
    
    if (studentSearchInput) {
        studentSearchInput.addEventListener('keyup', function(e) {
            // Simulating search - in a real app, this would be an AJAX call
            if (e.key === 'Enter' && this.value.trim() !== '') {
                // Show selected student (this is just a mockup)
                selectedStudentContainer.classList.remove('d-none');
                this.value = '';
            }
        });
        
        // Remove selected student
        const removeStudentBtn = document.querySelector('.selected-student .btn-close');
        if (removeStudentBtn) {
            removeStudentBtn.addEventListener('click', function() {
                selectedStudentContainer.classList.add('d-none');
            });
        }
    }
    
    // Date restriction for violation date (max 3 days in the past)
    const dateInput = document.querySelector('#violationDate');
    if (dateInput) {
        const today = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);
        
        dateInput.valueAsDate = today;
        dateInput.min = threeDaysAgo.toISOString().split('T')[0];
        dateInput.max = today.toISOString().split('T')[0];
    }
    
    // Initialize popovers and tooltips if using them
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // สำหรับแสดงฟอร์มเพิ่มประเภทพฤติกรรมใหม่
    const btnShowAddViolationType = document.getElementById('btnShowAddViolationType');
    const violationTypesList = document.getElementById('violationTypesList');
    const violationTypeForm = document.getElementById('violationTypeForm');
    const btnCloseViolationForm = document.getElementById('btnCloseViolationForm');
    const btnCancelViolationType = document.getElementById('btnCancelViolationType');
    const formViolationTitle = document.getElementById('formViolationTitle');
    const studentSearch = document.getElementById('studentSearch');
    const btnSearchStudent = document.getElementById('btnSearchStudent');
    const classFilter = document.getElementById('classFilter');
    
    // ปุ่มแสดงฟอร์มเพิ่มใหม่
    if (btnShowAddViolationType) {
        btnShowAddViolationType.addEventListener('click', function() {
            // รีเซ็ตฟอร์ม
            formViolationType.reset();
            document.getElementById('violationTypeId').value = '';
            formViolationTitle.textContent = 'เพิ่มประเภทพฤติกรรมใหม่';
            
            // แสดงฟอร์ม ซ่อนรายการ
            violationTypesList.classList.add('d-none');
            violationTypeForm.classList.remove('d-none');
        });
    }
    
    // ปุ่มปิดฟอร์ม
    if (btnCloseViolationForm) {
        btnCloseViolationForm.addEventListener('click', function() {
            violationTypeForm.classList.add('d-none');
            violationTypesList.classList.remove('d-none');
        });
    }
    
    // ปุ่มยกเลิกในฟอร์ม
    if (btnCancelViolationType) {
        btnCancelViolationType.addEventListener('click', function() {
            violationTypeForm.classList.add('d-none');
            violationTypesList.classList.remove('d-none');
        });
    }
    
    // จัดการปุ่มแก้ไข
    const editButtons = document.querySelectorAll('.edit-violation-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const violationId = this.getAttribute('data-id');
            
            // ในสถานการณ์จริงต้อง fetch ข้อมูลจาก API
            // นี่เป็นเพียงตัวอย่าง mockup:
            let mockData = {
                violations_id: violationId,
                violations_name: '',
                violations_category: '',
                violations_points_deducted: 0,
                violations_description: ''
            };
            
            if (violationId === '1') {
                mockData = {
                    violations_id: '1',
                    violations_name: 'ผิดระเบียบการแต่งกาย',
                    violations_category: 'medium',
                    violations_points_deducted: 5,
                    violations_description: 'นักเรียนแต่งกายไม่ถูกระเบียบตามข้อกำหนดของโรงเรียน'
                };
            } else if (violationId === '2') {
                mockData = {
                    violations_id: '2',
                    violations_name: 'มาสาย',
                    violations_category: 'light',
                    violations_points_deducted: 3,
                    violations_description: 'นักเรียนมาโรงเรียนหลังเวลา 08:00 น.'
                };
            } else if (violationId === '3') {
                mockData = {
                    violations_id: '3',
                    violations_name: 'ทะเลาะวิวาท',
                    violations_category: 'severe',
                    violations_points_deducted: 20,
                    violations_description: 'นักเรียนก่อเหตุทะเลาะวิวาท ทำร้ายร่างกายผู้อื่น'
                };
            }
            
            // เติมข้อมูลลงในฟอร์ม
            document.getElementById('violationTypeId').value = mockData.violations_id;
            document.getElementById('violations_name').value = mockData.violations_name;
            document.getElementById('violations_category').value = mockData.violations_category;
            document.getElementById('violations_points_deducted').value = mockData.violations_points_deducted;
            document.getElementById('violations_description').value = mockData.violations_description;
            
            // เปลี่ยนชื่อหัวฟอร์ม
            formViolationTitle.textContent = 'แก้ไขประเภทพฤติกรรม';
            
            // แสดงฟอร์ม ซ่อนรายการ
            violationTypesList.classList.add('d-none');
            violationTypeForm.classList.remove('d-none');
        });
    });
    
    // จัดการปุ่มลบ
    const deleteButtons = document.querySelectorAll('.delete-violation-btn');
    const deleteViolationModal = new bootstrap.Modal(document.getElementById('deleteViolationModal'));
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const violationId = this.getAttribute('data-id');
            document.getElementById('deleteViolationId').value = violationId;
            deleteViolationModal.show();
        });
    });
    
    // ปุ่มยืนยันการลบ
    const confirmDeleteBtn = document.getElementById('confirmDeleteViolation');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const violationId = document.getElementById('deleteViolationId').value;
            
            // ในสถานการณ์จริงต้องส่ง request ไปลบข้อมูลในฐานข้อมูล
            console.log('Deleting violation with ID: ' + violationId);
            
            // จำลองการลบสำเร็จ
            // show notification toast
            const toast = new bootstrap.Toast(document.createElement('div'));
            
            // ปิด modal ยืนยันการลบ
            deleteViolationModal.hide();
            
            // ในสถานการณ์จริง ควรมีการแสดงผลลัพธ์การลบและ refresh ข้อมูลใหม่
        });
    }
    
    // การบันทึกฟอร์ม
    if (formViolationType) {
        formViolationType.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // ตรวจสอบความถูกต้องของฟอร์ม
            if (this.checkValidity()) {
                // อ่านข้อมูลจากฟอร์ม
                const formData = {
                    violations_id: document.getElementById('violationTypeId').value,
                    violations_name: document.getElementById('violations_name').value,
                    violations_category: document.getElementById('violations_category').value,
                    violations_points_deducted: document.getElementById('violations_points_deducted').value,
                    violations_description: document.getElementById('violations_description').value
                };
                
                // ในสถานการณ์จริงต้องส่ง request ไปเพิ่ม/แก้ไขข้อมูลในฐานข้อมูล
                console.log('Saving violation data:', formData);
                
                // จำลองการบันทึกสำเร็จ
                // show success toast
                
                // กลับไปแสดงรายการ
                violationTypeForm.classList.add('d-none');
                violationTypesList.classList.remove('d-none');
                
                // ในสถานการณ์จริง ควรมีการ refresh ข้อมูลใหม่
            } else {
                // แสดงข้อความเตือนกรณีกรอกข้อมูลไม่ครบ/ไม่ถูกต้อง
                this.classList.add('was-validated');
            }
        });
    }
    
    // ค้นหาประเภทพฤติกรรม
    const violationTypeSearch = document.getElementById('violationTypeSearch');
    if (violationTypeSearch) {
        violationTypeSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || this.value.length > 2) {
                // ในสถานการณ์จริงต้องค้นหาข้อมูลจากฐานข้อมูล
                console.log('Searching for: ' + this.value);
                
                // จำลองแสดงผลการค้นหา
                // ...
            }
        });
    }
    
    // แก้ไขการใช้ jQuery ด้วย Vanilla JavaScript
    const violationTypesModal = document.getElementById('violationTypesModal');
    if (violationTypesModal) {
        violationTypesModal.addEventListener('shown.bs.modal', function() {
            fetchViolations();
        });
    }
    
    const newViolationModal = document.getElementById('newViolationModal');
    if (newViolationModal) {
        newViolationModal.addEventListener('show.bs.modal', function() {
            // ตั้งค่าวันที่และเวลาเริ่มต้น
            const dateInput = document.getElementById('violationDate');
            const timeInput = document.getElementById('violationTime');
            
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
            
            if (timeInput) {
                const now = new Date();
                now.setHours(8, 0, 0); // ตั้งเวลาเริ่มต้นเป็น 8:00 น.
                timeInput.value = now.toTimeString().substring(0, 5);
            }
            
            // เรียก function อื่นๆ ที่ต้องการ
            updateViolationSelects();
        });
    }

    if (studentSearch && btnSearchStudent) {
        btnSearchStudent.addEventListener('click', function() {
            searchStudents();
        });
        
        studentSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchStudents();
            }
        });
    }
    
    if (classFilter) {
        classFilter.addEventListener('change', function() {
            searchStudents();
        });
    }
});

// Chart initialization functions
function initViolationTrendChart() {
    const ctx = document.getElementById('violationTrend');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            datasets: [{
                label: 'พฤติกรรมที่ถูกบันทึก',
                data: [12, 19, 8, 15, 20, 27, 30],
                borderColor: 'rgb(16, 32, 173)',
                backgroundColor: 'rgba(16, 32, 173, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'จำนวนการบันทึก'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'วันที่'
                    }
                }
            }
        }
    });
    
    // ฟังก์ชันกรองข้อมูลตามประเภทพฤติกรรม
    document.querySelectorAll('#trendFilterDropdown + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filter = this.getAttribute('data-filter');
            const url = `/api/violations/trends?filter=${filter}`;
            
            fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // อัพเดทข้อมูลกราฟ
                    chart.data.labels = data.labels;
                    chart.data.datasets[0].data = data.values;
                    chart.update();
                    
                    // อัพเดทชื่อปุ่ม dropdown
                    document.getElementById('trendFilterDropdown').textContent = this.textContent;
                    
                    // อัพเดทสถานะ active
                    document.querySelectorAll('#trendFilterDropdown + .dropdown-menu .dropdown-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
}

function initViolationTypesChart() {
    const ctx = document.getElementById('violationTypes');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'ผิดระเบียบการแต่งกาย',
                'มาสาย',
                'ใช้โทรศัพท์ในเวลาเรียน',
                'ไม่ส่งการบ้าน',
                'อื่นๆ'
            ],
            datasets: [{
                data: [30, 25, 15, 20, 10],
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#17a2b8',
                    '#fd7e14',
                    '#6c757d'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// ฟังก์ชันค้นหานักเรียน
function searchStudents() {
    const searchTerm = document.getElementById('studentSearch').value;
    const classId = document.getElementById('classFilter').value;
    
    let url = '/students?';
    if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}&`;
    }
    if (classId) {
        url += `class=${encodeURIComponent(classId)}&`;
    }
    
    window.location.href = url;
}

/**
 * JavaScript สำหรับจัดการประเภทพฤติกรรม
 * ใช้งานกับ Modal: violationTypesModal
 */

// ตัวแปรสำหรับเก็บข้อมูลและสถานะต่าง ๆ
const violationManager = {
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
    violations: [],
    isLoading: false,
    csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 'mock-csrf-token'
};

// ฟังก์ชันสำหรับดึงข้อมูลประเภทพฤติกรรมทั้งหมด
function fetchViolations(page = 1, search = '') {
    violationManager.isLoading = true;
    showLoading('violationTypesList');
    
    // จำลองการดึงข้อมูลจาก API โดยใช้ mockup data
    try {
        setTimeout(() => {
            const mockViolations = [
                {
                    violations_id: "1",
                    violations_name: "ผิดระเบียบการแต่งกาย",
                    violations_category: "severe",
                    violations_points_deducted: 5,
                    violations_description: "นักเรียนแต่งกายไม่ถูกระเบียบตามข้อกำหนดของโรงเรียน"
                },
                {
                    violations_id: "2", 
                    violations_name: "มาโรงเรียนสาย",
                    violations_category: "medium",
                    violations_points_deducted: 3,
                    violations_description: "นักเรียนมาโรงเรียนหลังเวลา 08:30 น."
                },
                {
                    violations_id: "3",
                    violations_name: "ไม่ส่งการบ้าน",
                    violations_category: "medium", 
                    violations_points_deducted: 2,
                    violations_description: "นักเรียนไม่ส่งงานตามกำหนด"
                },
                {
                    violations_id: "4",
                    violations_name: "ใช้โทรศัพท์ในห้องเรียน",
                    violations_category: "medium",
                    violations_points_deducted: 3,
                    violations_description: "นักเรียนใช้โทรศัพท์มือถือในเวลาเรียนโดยไม่ได้รับอนุญาต"
                },
                {
                    violations_id: "5",
                    violations_name: "ทะเลาะวิวาท",
                    violations_category: "severe",
                    violations_points_deducted: 10,
                    violations_description: "นักเรียนทะเลาะวิวาทกับผู้อื่น"
                },
                {
                    violations_id: "6",
                    violations_name: "ลืมอุปกรณ์การเรียน",
                    violations_category: "light",
                    violations_points_deducted: 1,
                    violations_description: "นักเรียนลืมนำอุปกรณ์การเรียนมาโรงเรียน"
                },
                {
                    violations_id: "7",
                    violations_name: "หนีเรียน",
                    violations_category: "medium",
                    violations_points_deducted: 4,
                    violations_description: "นักเรียนไม่เข้าเรียนโดยไม่มีเหตุผลอันสมควร"
                }
            ];
            
            // กรองตามคำค้นหา (ถ้ามี)
            let filteredViolations = mockViolations;
            if (search) {
                const searchLower = search.toLowerCase();
                filteredViolations = mockViolations.filter(v => 
                    v.violations_name.toLowerCase().includes(searchLower) || 
                    v.violations_description.toLowerCase().includes(searchLower)
                );
            }
            
            // จำลองการแบ่งหน้า
            const itemsPerPage = 5;
            const totalItems = filteredViolations.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const currentPage = Math.min(page, totalPages) || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // ข้อมูลที่จะแสดงในหน้าปัจจุบัน
            const currentPageData = filteredViolations.slice(startIndex, endIndex);
            
            // อัพเดตข้อมูลใน violationManager
            violationManager.violations = currentPageData;
            violationManager.currentPage = currentPage;
            violationManager.totalPages = totalPages;
            
            // แสดงข้อมูล
            renderViolationsList();
            renderPagination();
            
            // ซ่อน loading
            violationManager.isLoading = false;
            hideLoading('violationTypesList');
            
        }, 800); // จำลองความล่าช้าในการโหลด 800ms
    } catch (error) {
        console.error('Error fetching violations:', error);
        handleConnectionError();
    }
}

// ฟังก์ชันสำหรับแสดงรายการประเภทพฤติกรรม
function renderViolationsList() {
    const tableBody = document.querySelector('#violationTypesList table tbody');
    
    if (violationManager.violations.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="text-muted">
                        <i class="fas fa-info-circle fa-2x mb-3"></i>
                        <p>ไม่พบข้อมูลประเภทพฤติกรรม</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    violationManager.violations.forEach(violation => {
        // สร้าง badge สำหรับระดับความรุนแรง
        let categoryBadge = '';
        let categoryText = '';
        
        switch (violation.violations_category) {
            case 'light':
                categoryBadge = '<span class="badge bg-info text-white">เบา</span>';
                categoryText = 'เบา';
                break;
            case 'medium':
                categoryBadge = '<span class="badge bg-warning text-dark">ปานกลาง</span>';
                categoryText = 'ปานกลาง';
                break;
            case 'severe':
                categoryBadge = '<span class="badge bg-danger text-white">รุนแรง</span>';
                categoryText = 'รุนแรง';
                break;
        }
        
        // สร้าง row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${violation.violations_name}</td>
            <td>${categoryBadge}</td>
            <td>${violation.violations_points_deducted}</td>
            <td class="text-truncate" style="max-width: 200px;">${violation.violations_description || '-'}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary edit-violation-btn" data-id="${violation.violations_id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-violation-btn" data-id="${violation.violations_id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // เพิ่ม event listeners สำหรับปุ่มแก้ไขและลบ
    attachEditButtonListeners();
    attachDeleteButtonListeners();
}

// ฟังก์ชันสำหรับแสดง pagination
function renderPagination() {
    const pagination = document.querySelector('#violationTypesList nav ul');
    
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    // ปุ่ม Previous
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    if (violationManager.currentPage === 1) {
        prevLi.classList.add('disabled');
    }
    prevLi.innerHTML = `<a class="page-link" href="#" data-page="${violationManager.currentPage - 1}">Previous</a>`;
    pagination.appendChild(prevLi);
    
    // หน้าต่าง ๆ
    for (let i = 1; i <= violationManager.totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        if (i === violationManager.currentPage) {
            pageLi.classList.add('active');
        }
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageLi);
    }
    
    // ปุ่ม Next
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    if (violationManager.currentPage === violationManager.totalPages) {
        nextLi.classList.add('disabled');
    }
    nextLi.innerHTML = `<a class="page-link" href="#" data-page="${violationManager.currentPage + 1}">Next</a>`;
    pagination.appendChild(nextLi);
    
    // เพิ่ม event listeners สำหรับ pagination
    document.querySelectorAll('#violationTypesList nav ul li:not(.disabled) a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            fetchViolations(page, violationManager.searchTerm);
        });
    });
}

// ฟังก์ชันสำหรับแสดง loading
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingHTML = `
            <div class="text-center py-5 loading-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
            </div>
        `;
        
        const loadingEl = document.createElement('div');
        loadingEl.innerHTML = loadingHTML;
        loadingEl.classList.add('loading-container');
        container.appendChild(loadingEl);
    }
}

// ฟังก์ชันสำหรับซ่อน loading
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingEl = container.querySelector('.loading-container');
        if (loadingEl) {
            container.removeChild(loadingEl);
        }
    }
}

// ฟังก์ชันสำหรับแสดงข้อความผิดพลาด
function showError(message) {
    // สร้าง toast สำหรับแสดงข้อความผิดพลาด
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) return;
    
    const toastId = `error-toast-${Date.now()}`;
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
            <div class="toast-header bg-danger text-white">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong class="me-auto">ข้อผิดพลาด</strong>
                <small>เมื่อสักครู่</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // ลบ toast หลังจากแสดง
    toastEl.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}

// ฟังก์ชันสำหรับแสดงข้อความสำเร็จ
function showSuccess(message) {
    // สร้าง toast สำหรับแสดงข้อความสำเร็จ
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) return;
    
    const toastId = `success-toast-${Date.now()}`;
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
            <div class="toast-header bg-success text-white">
                <i class="fas fa-check-circle me-2"></i>
                <strong class="me-auto">สำเร็จ</strong>
                <small>เมื่อสักครู่</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // ลบ toast หลังจากแสดง
    toastEl.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}

// ฟังก์ชันสำหรับบันทึกประเภทพฤติกรรมใหม่หรืออัปเดต
function saveViolation(formData) {
    // จำลองการส่งข้อมูลไปยัง API
    setTimeout(() => {
        const data = {
            success: true,
            message: formData.get('violations_id') ? 'อัปเดตประเภทพฤติกรรมเรียบร้อยแล้ว' : 'เพิ่มประเภทพฤติกรรมใหม่เรียบร้อยแล้ว'
        };
        
        if (data.success) {
            showSuccess(data.message);
            
            // รีเซ็ตฟอร์มและซ่อนฟอร์ม
            document.getElementById('violationTypeForm').classList.add('d-none');
            document.getElementById('violationTypesList').classList.remove('d-none');
            document.getElementById('formViolationType').reset();
            
            // โหลดข้อมูลใหม่
            fetchViolations(violationManager.currentPage, violationManager.searchTerm);
        } else {
            showError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    }, 800);
}

// ฟังก์ชันสำหรับลบประเภทพฤติกรรม
function deleteViolation(violationId) {
    // จำลองการลบข้อมูล
    setTimeout(() => {
        const data = {
            success: true,
            message: 'ลบประเภทพฤติกรรมเรียบร้อยแล้ว'
        };
        
        if (data.success) {
            showSuccess(data.message);
            
            // ปิด modal ยืนยันการลบ
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteViolationModal'));
            deleteModal.hide();
            
            // โหลดข้อมูลใหม่
            fetchViolations(violationManager.currentPage, violationManager.searchTerm);
        } else {
            showError('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    }, 800);
}

// แก้ไขฟังก์ชัน showLoading เพื่อให้ทำงานได้กับ HTML
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingHTML = `
            <div class="text-center py-5 loading-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
            </div>
        `;
        
        const loadingEl = document.createElement('div');
        loadingEl.innerHTML = loadingHTML;
        loadingEl.classList.add('loading-container');
        container.appendChild(loadingEl);
    }
}

// แก้ไขฟังก์ชัน hideLoading เพื่อให้ทำงานได้กับ HTML
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const loadingEl = container.querySelector('.loading-container');
        if (loadingEl) {
            container.removeChild(loadingEl);
        }
    }
}

// ฟังก์ชันสำหรับดึงข้อมูลประเภทพฤติกรรมตาม ID
function fetchViolationById(violationId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const mockViolations = [
                {
                    violations_id: "1",
                    violations_name: "ผิดระเบียบการแต่งกาย",
                    violations_category: "severe",
                    violations_points_deducted: 5,
                    violations_description: "นักเรียนแต่งกายไม่ถูกระเบียบตามข้อกำหนดของโรงเรียน"
                },
                {
                    violations_id: "2", 
                    violations_name: "มาโรงเรียนสาย",
                    violations_category: "medium",
                    violations_points_deducted: 3,
                    violations_description: "นักเรียนมาโรงเรียนหลังเวลา 08:30 น."
                },
                {
                    violations_id: "3",
                    violations_name: "ไม่ส่งการบ้าน",
                    violations_category: "medium", 
                    violations_points_deducted: 2,
                    violations_description: "นักเรียนไม่ส่งงานตามกำหนด"
                },
                {
                    violations_id: "4",
                    violations_name: "ใช้โทรศัพท์ในห้องเรียน",
                    violations_category: "medium",
                    violations_points_deducted: 3,
                    violations_description: "นักเรียนใช้โทรศัพท์มือถือในเวลาเรียนโดยไม่ได้รับอนุญาต"
                },
                {
                    violations_id: "5",
                    violations_name: "ทะเลาะวิวาท",
                    violations_category: "severe",
                    violations_points_deducted: 10,
                    violations_description: "นักเรียนทะเลาะวิวาทกับผู้อื่น"
                },
                {
                    violations_id: "6",
                    violations_name: "ลืมอุปกรณ์การเรียน",
                    violations_category: "light",
                    violations_points_deducted: 1,
                    violations_description: "นักเรียนลืมนำอุปกรณ์การเรียนมาโรงเรียน"
                },
                {
                    violations_id: "7",
                    violations_name: "หนีเรียน",
                    violations_category: "medium",
                    violations_points_deducted: 4,
                    violations_description: "นักเรียนไม่เข้าเรียนโดยไม่มีเหตุผลอันสมควร"
                }
            ];
            
            const violation = mockViolations.find(v => v.violations_id === violationId);
            
            if (violation) {
                resolve(violation);
            } else {
                reject(new Error('ไม่พบข้อมูลประเภทพฤติกรรม'));
            }
        }, 500); // จำลองความล่าช้า 500ms
    });
}

// ฟังก์ชันสำหรับเพิ่ม event listeners ให้กับปุ่มแก้ไข
function attachEditButtonListeners() {
    document.querySelectorAll('.edit-violation-btn').forEach(button => {
        button.addEventListener('click', function() {
            const violationId = this.getAttribute('data-id');
            
            // แสดง loading ในฟอร์ม
            document.getElementById('violationTypesList').classList.add('d-none');
            document.getElementById('violationTypeForm').classList.remove('d-none');
            document.getElementById('formViolationTitle').textContent = 'กำลังโหลดข้อมูล...';
            
            // ดึงข้อมูลประเภทพฤติกรรม
            fetchViolationById(violationId)
                .then(violation => {
                    // เติมข้อมูลลงในฟอร์ม
                    document.getElementById('violationTypeId').value = violation.violations_id;
                    document.getElementById('violations_name').value = violation.violations_name;
                    document.getElementById('violations_category').value = violation.violations_category;
                    document.getElementById('violations_points_deducted').value = violation.violations_points_deducted;
                    document.getElementById('violations_description').value = violation.violations_description || '';
                    
                    // เปลี่ยนชื่อหัวฟอร์ม
                    document.getElementById('formViolationTitle').textContent = 'แก้ไขประเภทพฤติกรรม';
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
                    
                    // กลับไปหน้ารายการ
                    document.getElementById('violationTypeForm').classList.add('d-none');
                    document.getElementById('violationTypesList').classList.remove('d-none');
                });
        });
    });
}

// ฟังก์ชันสำหรับเพิ่ม event listeners ให้กับปุ่มลบ
function attachDeleteButtonListeners() {
    document.querySelectorAll('.delete-violation-btn').forEach(button => {
        button.addEventListener('click', function() {
            const violationId = this.getAttribute('data-id');
            document.getElementById('deleteViolationId').value = violationId;
            
            // หาชื่อประเภทพฤติกรรมจากข้อมูลที่มีอยู่
            const violation = violationManager.violations.find(v => v.violations_id == violationId);
            if (violation) {
                document.querySelector('#deleteViolationModal .modal-body h5').textContent = 
                    `ยืนยันการลบประเภทพฤติกรรม "${violation.violations_name}"?`;
            }
            
            // แสดง modal ยืนยันการลบ
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteViolationModal'));
            deleteModal.show();
        });
    });
}

// Initialize เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // เชื่อมต่อกับ Elements ต่าง ๆ
    const violationTypesList = document.getElementById('violationTypesList');
    const violationTypeForm = document.getElementById('violationTypeForm');
    const btnShowAddViolationType = document.getElementById('btnShowAddViolationType');
    const btnCloseViolationForm = document.getElementById('btnCloseViolationForm');
    const btnCancelViolationType = document.getElementById('btnCancelViolationType');
    const formViolationType = document.getElementById('formViolationType');
    const violationTypeSearch = document.getElementById('violationTypeSearch');
    const confirmDeleteViolation = document.getElementById('confirmDeleteViolation');
    
    // ตรวจสอบว่า Elements ที่จำเป็นมีอยู่หรือไม่
    if (!violationTypesList || !violationTypeForm || !formViolationType) return;
    
    // โหลดข้อมูลประเภทพฤติกรรมเมื่อ modal แสดง
    const violationTypesModal = document.getElementById('violationTypesModal');
    if (violationTypesModal) {
        violationTypesModal.addEventListener('shown.bs.modal', function() {
            fetchViolations();
        });
    }
    
    // กำหนด event ให้กับปุ่มเพิ่มประเภทพฤติกรรมใหม่
    if (btnShowAddViolationType) {
        btnShowAddViolationType.addEventListener('click', function() {
            // รีเซ็ตฟอร์ม
            formViolationType.reset();
            document.getElementById('violationTypeId').value = '';
            document.getElementById('formViolationTitle').textContent = 'เพิ่มประเภทพฤติกรรมใหม่';
            
            // แสดงฟอร์ม ซ่อนรายการ
            violationTypesList.classList.add('d-none');
            violationTypeForm.classList.remove('d-none');
            
            // ล้างข้อความผิดพลาด
            formViolationType.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            formViolationType.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        });
    }
    
    // กำหนด event ให้กับปุ่มปิดฟอร์ม
    if (btnCloseViolationForm) {
        btnCloseViolationForm.addEventListener('click', function() {
            violationTypeForm.classList.add('d-none');
            violationTypesList.classList.remove('d-none');
        });
    }
    
    // กำหนด event ให้กับปุ่มยกเลิกในฟอร์ม
    if (btnCancelViolationType) {
        btnCancelViolationType.addEventListener('click', function() {
            violationTypeForm.classList.add('d-none');
            violationTypesList.classList.remove('d-none');
        });
    }
    
    // กำหนด event ให้กับฟอร์มบันทึกประเภทพฤติกรรม
    formViolationType.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ล้างข้อความผิดพลาด
        this.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        this.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        
        // ตรวจสอบความถูกต้องของฟอร์ม
        if (this.checkValidity()) {
            // สร้าง FormData และแปลงเป็น object
            const formData = new FormData(this);
            
            // เรียกฟังก์ชันบันทึกข้อมูล
            saveViolation(formData);
        } else {
            // แสดงข้อความที่ browser validate
            this.classList.add('was-validated');
        }
    });
    
    // กำหนด event ให้กับช่องค้นหา
    if (violationTypeSearch) {
        violationTypeSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                violationManager.searchTerm = this.value;
                fetchViolations(1, this.value);
            }
        });
        
        // ปุ่มค้นหา (ถ้ามี)
        const searchButton = violationTypeSearch.nextElementSibling;
        if (searchButton && searchButton.tagName === 'BUTTON') {
            searchButton.addEventListener('click', function() {
                violationManager.searchTerm = violationTypeSearch.value;
                fetchViolations(1, violationTypeSearch.value);
            });
        }
    }
    
    // กำหนด event ให้กับปุ่มยืนยันการลบ
    if (confirmDeleteViolation) {
        confirmDeleteViolation.addEventListener('click', function() {
            const violationId = document.getElementById('deleteViolationId').value;
            if (violationId) {
                deleteViolation(violationId);
            }
        });
    }
});

// ฟังก์ชันอัพเดต select box สำหรับประเภทการกระทำผิด
function updateViolationSelects() {
    // ข้อมูล mockup แทนการใช้ API
    const mockViolations = [
        {
            violations_id: "1",
            violations_name: "ผิดระเบียบการแต่งกาย",
            violations_category: "severe",
            violations_points_deducted: 5,
            violations_description: "นักเรียนแต่งกายไม่ถูกระเบียบตามข้อกำหนดของโรงเรียน"
        },
        {
            violations_id: "2", 
            violations_name: "มาโรงเรียนสาย",
            violations_category: "medium",
            violations_points_deducted: 3,
            violations_description: "นักเรียนมาโรงเรียนหลังเวลา 08:30 น."
        },
        {
            violations_id: "3",
            violations_name: "ไม่ส่งการบ้าน",
            violations_category: "medium", 
            violations_points_deducted: 2,
            violations_description: "นักเรียนไม่ส่งงานตามกำหนด"
        },
        {
            violations_id: "4",
            violations_name: "ใช้โทรศัพท์ในห้องเรียน",
            violations_category: "medium",
            violations_points_deducted: 3,
            violations_description: "นักเรียนใช้โทรศัพท์มือถือในเวลาเรียนโดยไม่ได้รับอนุญาต"
        },
        {
            violations_id: "5",
            violations_name: "ทะเลาะวิวาท",
            violations_category: "severe",
            violations_points_deducted: 10,
            violations_description: "นักเรียนทะเลาะวิวาทกับผู้อื่น"
        },
        {
            violations_id: "6",
            violations_name: "ลืมอุปกรณ์การเรียน",
            violations_category: "light",
            violations_points_deducted: 1,
            violations_description: "นักเรียนลืมนำอุปกรณ์การเรียนมาโรงเรียน"
        },
        {
            violations_id: "7",
            violations_name: "หนีเรียน",
            violations_category: "medium",
            violations_points_deducted: 4,
            violations_description: "นักเรียนไม่เข้าเรียนโดยไม่มีเหตุผลอันสมควร"
        }
    ];

    // อัพเดตตัวเลือกใน select
    updateSelectOptions(mockViolations);
    
    console.log('อัพเดตตัวเลือกการกระทำผิดเรียบร้อย');
}

// เพิ่มฟังก์ชันที่ใช้งานจริงในการอัพเดตตัวเลือก
function updateSelectOptions(violations) {
    const selects = document.querySelectorAll('select[data-violation-select]');
    
    selects.forEach(select => {
        // เก็บค่าที่เลือกไว้ (ถ้ามี)
        const selectedValue = select.value;
        
        // ล้างตัวเลือกเดิม (ยกเว้นตัวเลือกแรก)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // เพิ่มตัวเลือกใหม่
        violations.forEach(violation => {
            const option = new Option(violation.violations_name, violation.violations_id);
            
            // เพิ่ม data-category และ data-points
            option.dataset.category = violation.violations_category;
            option.dataset.points = violation.violations_points_deducted;
            
            select.add(option);
        });
        
        // เลือกค่าเดิม (ถ้ามี)
        if (selectedValue) {
            select.value = selectedValue;
        }
        
        // เพิ่ม event listener เพื่ออัพเดตค่าคะแนนที่หัก
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const pointsField = document.getElementById('pointsDeducted');
            
            if (pointsField && selectedOption.dataset.points) {
                pointsField.value = selectedOption.dataset.points;
            }
        });
    });
}

// เพิ่ม event listener เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // เมื่อเปิด modal บันทึกพฤติกรรม
    const newViolationModal = document.getElementById('newViolationModal');
    if (newViolationModal) {
        newViolationModal.addEventListener('show.bs.modal', function() {
            // อัพเดตตัวเลือกประเภทการกระทำผิดเมื่อเปิด modal
            updateViolationSelects();
            
            // ตั้งค่าวันที่และเวลาเริ่มต้น
            const dateInput = document.getElementById('violationDate');
            const timeInput = document.getElementById('violationTime');
            
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
            
            if (timeInput) {
                const now = new Date();
                now.setHours(8, 0, 0); // ตั้งเวลาเริ่มต้นเป็น 8:00 น.
                timeInput.value = now.toTimeString().substring(0, 5);
            }
        });
        
        // เพิ่ม event listener สำหรับการเลือกนักเรียน
        const studentSearchInput = document.querySelector('#newViolationModal input[placeholder="พิมพ์ชื่อหรือรหัสนักเรียน..."]');
        const selectedStudentContainer = document.querySelector('.selected-student');
        const closeBtn = document.querySelector('.selected-student .btn-close');
        
        if (studentSearchInput) {
            studentSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    selectedStudentContainer.classList.remove('d-none');
                    this.value = '';
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                selectedStudentContainer.classList.add('d-none');
            });
        }
        
        // เพิ่ม event listener สำหรับการบันทึกพฤติกรรม
        const saveButton = document.querySelector('#newViolationModal .modal-footer .btn-primary-app');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // สร้าง toast แจ้งเตือนการบันทึกสำเร็จ
                const toastContainer = document.querySelector('.toast-container');
                if (toastContainer) {
                    const toastId = `success-toast-${Date.now()}`;
                    const toastHTML = `
                        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                            <div class="toast-header bg-success text-white">
                                <i class="fas fa-check-circle me-2"></i>
                                <strong class="me-auto">สำเร็จ</strong>
                                <small>เมื่อสักครู่</small>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                บันทึกพฤติกรรมสำเร็จ
                            </div>
                        </div>
                    `;
                    
                    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
                    
                    const toastEl = document.getElementById(toastId);
                    const toast = new bootstrap.Toast(toastEl);
                    toast.show();
                    
                    // ปิด modal
                    const modal = bootstrap.Modal.getInstance(newViolationModal);
                    modal.hide();
                }
            });
        }
    }
});

// ปรับปรุงฟังก์ชันแสดง Toast ให้ทำงานได้แม้ไม่มีการโหลด Bootstrap
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // สร้าง toast container ถ้าไม่มี
        const newContainer = document.createElement('div');
        newContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(newContainer);
        toastContainer = newContainer;
    }
    
    const toastId = `${type}-toast-${Date.now()}`;
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
            <div class="toast-header ${bgClass} text-white">
                <i class="fas fa-${icon} me-2"></i>
                <strong class="me-auto">${type === 'success' ? 'สำเร็จ' : 'ข้อผิดพลาด'}</strong>
                <small>เมื่อสักครู่</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastEl = document.getElementById(toastId);
    
    try {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } catch (error) {
        // Fallback ในกรณีที่ Bootstrap ไม่ทำงาน
        console.warn('Bootstrap Toast not available, using fallback');
        toastEl.classList.add('show');
        toastEl.style.display = 'block';
        setTimeout(() => {
            toastEl.classList.remove('show');
            toastEl.style.display = 'none';
            toastEl.remove();
        }, 3000);
    }
}