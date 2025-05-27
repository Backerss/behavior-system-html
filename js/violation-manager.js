/**
 * JavaScript สำหรับจัดการประเภทพฤติกรรม
 * ใช้งานกับ Modal: violationTypesModal
 */

document.addEventListener('DOMContentLoaded', function() {
    // ตัวแปรสำหรับเก็บข้อมูลและสถานะต่าง ๆ
    const violationManager = {
        currentPage: 1,
        totalPages: 1,
        searchTerm: '',
        violations: [],
        isLoading: false,
        csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    };

    // เมื่อ modal แสดง ให้ใช้ mock data แทนการเรียก API
    const violationTypesModal = document.getElementById('violationTypesModal');
    if (violationTypesModal) {
        violationTypesModal.addEventListener('shown.bs.modal', function() {
            // ใช้ fetchViolationsMock แทน fetchViolations เพื่อป้องกัน 404 error
            fetchViolationsMock();
        });
    }

    // หน้า event listeners สำหรับ modal อื่นๆ
    const newViolationModal = document.getElementById('newViolationModal');
    if (newViolationModal) {
        newViolationModal.addEventListener('show.bs.modal', function() {
            // อัพเดตตัวเลือกประเภทการกระทำผิดเมื่อเปิด modal
            updateViolationSelects();
        });
    }

    // Mock function for fetching violations
    function fetchViolationsMock(page = 1, search = '') {
        // แสดง loading
        showLoading('violationTypesList');
        
        // จำลองการโหลดข้อมูล
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

            // Filter results if search term provided
            let filteredViolations = mockViolations;
            if (search) {
                const searchLower = search.toLowerCase();
                filteredViolations = mockViolations.filter(v => 
                    v.violations_name.toLowerCase().includes(searchLower) || 
                    v.violations_description.toLowerCase().includes(searchLower)
                );
            }
            
            // Handle pagination
            const itemsPerPage = 5;
            const totalItems = filteredViolations.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const currentPage = Math.min(page, totalPages) || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // Get current page data
            const currentPageData = filteredViolations.slice(startIndex, endIndex);
            
            // Update the table with the mock data
            updateViolationTable(currentPageData, currentPage, totalPages);
            
            // ซ่อน loading
            hideLoading('violationTypesList');
        }, 500);
    }

    // Function to update the violation type table
    function updateViolationTable(violations, currentPage, totalPages) {
        const tableBody = document.querySelector('#violationTypesList table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (violations.length === 0) {
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
        
        violations.forEach(violation => {
            // Create category badge
            let categoryBadge = '';
            
            switch (violation.violations_category) {
                case 'light':
                    categoryBadge = '<span class="badge bg-info">เบา</span>';
                    break;
                case 'medium':
                    categoryBadge = '<span class="badge bg-warning text-dark">ปานกลาง</span>';
                    break;
                case 'severe':
                    categoryBadge = '<span class="badge bg-danger">รุนแรง</span>';
                    break;
            }
            
            // Create row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${violation.violations_name}</td>
                <td>${categoryBadge}</td>
                <td>${violation.violations_points_deducted} คะแนน</td>
                <td class="text-truncate" style="max-width: 200px;">${violation.violations_description || '-'}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary edit-violation-type" data-id="${violation.violations_id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-violation-type" data-id="${violation.violations_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Update pagination
        updatePagination(currentPage, totalPages);
        
        // Add event listeners for the buttons
        addViolationButtonListeners();
    }

    // Function to update pagination
    function updatePagination(currentPage, totalPages) {
        const pagination = document.querySelector('#violationTypesList nav ul');
        if (!pagination) return;
        
        pagination.innerHTML = '';
        
        // Previous button
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        if (currentPage === 1) prevLi.classList.add('disabled');
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
        pagination.appendChild(prevLi);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.classList.add('page-item');
            if (i === currentPage) pageLi.classList.add('active');
            pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(pageLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        if (currentPage === totalPages) nextLi.classList.add('disabled');
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
        pagination.appendChild(nextLi);
        
        // Add event listeners for pagination
        document.querySelectorAll('#violationTypesList nav ul li:not(.disabled) a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                fetchViolationsMock(page);
            });
        });
    }

    // ฟังก์ชันสำหรับแสดง loading state
    function showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // ตรวจสอบว่ามี loading อยู่แล้วหรือไม่
        if (container.querySelector('.loading-container')) {
            return; // ถ้ามีอยู่แล้วให้ไม่ต้องสร้างใหม่
        }
        
        // สร้าง loading element
        const loadingHTML = `
            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style="z-index: 10;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">กำลังโหลดข้อมูล</p>
                </div>
            </div>
        `;
        
        const loadingEl = document.createElement('div');
        loadingEl.classList.add('loading-container', 'position-relative');
        loadingEl.innerHTML = loadingHTML;
        
        // เพิ่มเข้าไปที่ container
        container.style.position = 'relative';
        container.appendChild(loadingEl);
    }

    // ฟังก์ชันสำหรับซ่อน loading
    function hideLoading(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // ลบ loading elements
        const loadingElements = container.querySelectorAll('.loading-container');
        loadingElements.forEach(el => {
            container.removeChild(el);
        });
    }

    // Function to add event listeners to the edit and delete buttons
    function addViolationButtonListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-violation-type').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editViolationType(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-violation-type').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                document.getElementById('deleteViolationId').value = id;
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteViolationModal'));
                deleteModal.show();
            });
        });
    }

    // Function to edit a violation type
    function editViolationType(id) {
        // Find the violation type in our mock data
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
            // ... other violations
        ];
        
        const violation = mockViolations.find(v => v.violations_id === id);
        if (!violation) return;
        
        // Fill the form with the violation data
        document.getElementById('violationTypeId').value = violation.violations_id;
        document.getElementById('violations_name').value = violation.violations_name;
        document.getElementById('violations_category').value = violation.violations_category;
        document.getElementById('violations_points_deducted').value = violation.violations_points_deducted;
        document.getElementById('violations_description').value = violation.violations_description || '';
        
        // Show the form and hide the list
        document.getElementById('violationTypesList').classList.add('d-none');
        document.getElementById('violationTypeForm').classList.remove('d-none');
        document.getElementById('formViolationTitle').textContent = 'แก้ไขประเภทพฤติกรรม';
    }

    // Additional event listeners for the form
    document.addEventListener('DOMContentLoaded', function() {
        const btnShowAddViolationType = document.getElementById('btnShowAddViolationType');
        const btnCloseViolationForm = document.getElementById('btnCloseViolationForm');
        const btnCancelViolationType = document.getElementById('btnCancelViolationType');
        const violationTypeForm = document.getElementById('formViolationType');
        const violationTypesList = document.getElementById('violationTypesList');
        const confirmDeleteViolation = document.getElementById('confirmDeleteViolation');
        const violationTypeSearch = document.getElementById('violationTypeSearch');
        
        if (btnShowAddViolationType) {
            btnShowAddViolationType.addEventListener('click', function() {
                // Reset form
                violationTypeForm.reset();
                document.getElementById('violationTypeId').value = '';
                document.getElementById('formViolationTitle').textContent = 'เพิ่มประเภทพฤติกรรมใหม่';
                
                // Show form, hide list
                violationTypesList.classList.add('d-none');
                document.getElementById('violationTypeForm').classList.remove('d-none');
            });
        }
        
        if (btnCloseViolationForm) {
            btnCloseViolationForm.addEventListener('click', function() {
                document.getElementById('violationTypeForm').classList.add('d-none');
                violationTypesList.classList.remove('d-none');
            });
        }
        
        if (btnCancelViolationType) {
            btnCancelViolationType.addEventListener('click', function() {
                document.getElementById('violationTypeForm').classList.add('d-none');
                violationTypesList.classList.remove('d-none');
            });
        }
        
        if (violationTypeForm) {
            violationTypeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // In a real app, you would save the data here
                console.log('Form submitted');
                
                // Hide the form and show the list
                document.getElementById('violationTypeForm').classList.add('d-none');
                violationTypesList.classList.remove('d-none');
                
                // Refresh the list
                fetchViolationsMock();
            });
        }
        
        if (confirmDeleteViolation) {
            confirmDeleteViolation.addEventListener('click', function() {
                const id = document.getElementById('deleteViolationId').value;
                
                // In a real app, you would delete the data here
                console.log('Deleting violation type', id);
                
                // Close the confirmation modal
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteViolationModal'));
                deleteModal.hide();
                
                // Refresh the list
                fetchViolationsMock();
            });
        }
        
        if (violationTypeSearch) {
            violationTypeSearch.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    const searchTerm = this.value.trim();
                    fetchViolationsMock(1, searchTerm);
                }
            });
            
            // Search button
            const searchButton = violationTypeSearch.nextElementSibling;
            if (searchButton && searchButton.tagName === 'BUTTON') {
                searchButton.addEventListener('click', function() {
                    const searchTerm = violationTypeSearch.value.trim();
                    fetchViolationsMock(1, searchTerm);
                });
            }
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
        const selects = document.querySelectorAll('select[data-violation-select]');
        
        selects.forEach(select => {
            // เก็บค่าที่เลือกไว้ (ถ้ามี)
            const selectedValue = select.value;
            
            // ล้างตัวเลือกเดิม (ยกเว้นตัวเลือกแรก)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // เพิ่มตัวเลือกใหม่
            mockViolations.forEach(violation => {
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
        
        console.log('อัพเดตตัวเลือกการกระทำผิดเรียบร้อย');
    }
});