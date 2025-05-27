/**
 * JavaScript สำหรับจัดการห้องเรียน
 * ใช้งานกับ Modal: classManagementModal
 */

document.addEventListener('DOMContentLoaded', function() {
    // ตัวแปรสำหรับเก็บข้อมูลและสถานะต่าง ๆ
    const classManager = {
        currentPage: 1,
        totalPages: 1,
        searchTerm: '',
        classrooms: [],
        filters: {
            academicYear: '',
            level: ''
        },
        isLoading: false,
        csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    };

    // เมื่อ modal แสดง ให้โหลดข้อมูลห้องเรียน
    const classManagementModal = document.getElementById('classManagementModal');
    if (classManagementModal) {
        classManagementModal.addEventListener('shown.bs.modal', function() {
            // โหลดข้อมูลตัวกรอง (ปีการศึกษา, ระดับชั้น)
            fetchFiltersMock();
            
            // โหลดข้อมูลครูสำหรับ dropdown
            fetchTeachersMock();
            
            // โหลดข้อมูลห้องเรียน
            fetchClassroomsMock();
        });
    }

    // ฟังก์ชันสำหรับดึงข้อมูลห้องเรียน (Mock Data)
    function fetchClassroomsMock(page = 1, search = '', filters = {}) {
        // แสดง loading
        classManager.isLoading = true;
        showLoading('classroomList');
        
        // จำลองการโหลดข้อมูล
        setTimeout(() => {
            // ข้อมูล Mock สำหรับห้องเรียน
            const mockClassrooms = [
                {
                    classes_id: "1",
                    classes_name: "ม.5/1",
                    classes_level: "ม.5",
                    classes_room_number: "1",
                    classes_academic_year: "2568",
                    teacher_id: "1",
                    teacher_name: "ครูใจดี มีเมตตา",
                    student_count: 35
                },
                {
                    classes_id: "2",
                    classes_name: "ม.5/2",
                    classes_level: "ม.5",
                    classes_room_number: "2",
                    classes_academic_year: "2568",
                    teacher_id: "2",
                    teacher_name: "ครูสมศรี ดีเสมอ",
                    student_count: 32
                },
                {
                    classes_id: "3",
                    classes_name: "ม.5/3",
                    classes_level: "ม.5",
                    classes_room_number: "3",
                    classes_academic_year: "2568",
                    teacher_id: "3",
                    teacher_name: "ครูประเสริฐ เลิศวิชา",
                    student_count: 30
                },
                {
                    classes_id: "4",
                    classes_name: "ม.4/1",
                    classes_level: "ม.4",
                    classes_room_number: "1",
                    classes_academic_year: "2568",
                    teacher_id: "4",
                    teacher_name: "ครูวิชัย ใจสะอาด",
                    student_count: 36
                },
                {
                    classes_id: "5",
                    classes_name: "ม.4/2",
                    classes_level: "ม.4",
                    classes_room_number: "2",
                    classes_academic_year: "2568",
                    teacher_id: "5",
                    teacher_name: "ครูสมหมาย ตั้งใจเรียน",
                    student_count: 34
                },
                {
                    classes_id: "6",
                    classes_name: "ม.6/1",
                    classes_level: "ม.6",
                    classes_room_number: "1",
                    classes_academic_year: "2568",
                    teacher_id: "6",
                    teacher_name: "ครูมานะ พากเพียร",
                    student_count: 30
                }
            ];
            
            // กรองตามคำค้นหา
            let filteredClassrooms = [...mockClassrooms];
            if (search) {
                const searchLower = search.toLowerCase();
                filteredClassrooms = filteredClassrooms.filter(c => 
                    c.classes_name.toLowerCase().includes(searchLower) || 
                    c.teacher_name.toLowerCase().includes(searchLower)
                );
            }
            
            // กรองตาม filters
            if (filters.academicYear) {
                filteredClassrooms = filteredClassrooms.filter(c => 
                    c.classes_academic_year === filters.academicYear
                );
            }
            
            if (filters.level) {
                filteredClassrooms = filteredClassrooms.filter(c => 
                    c.classes_level === filters.level
                );
            }
            
            // จัดการหน้า
            const itemsPerPage = 5;
            const totalItems = filteredClassrooms.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const currentPage = Math.min(page, totalPages) || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // ข้อมูลที่จะแสดงในหน้าปัจจุบัน
            const currentPageData = filteredClassrooms.slice(startIndex, endIndex);
            
            // อัพเดตข้อมูลใน classManager
            classManager.classrooms = currentPageData;
            classManager.currentPage = currentPage;
            classManager.totalPages = totalPages;
            
            // แสดงข้อมูล
            renderClassroomList();
            renderPagination();
            
            // ซ่อน loading
            classManager.isLoading = false;
            hideLoading('classroomList');
            
        }, 800); // จำลองความล่าช้าในการโหลด 800ms
    }

    // ฟังก์ชันสำหรับดึงข้อมูลตัวกรอง (Mock Data)
    function fetchFiltersMock() {
        showLoading('classroomList');
        
        setTimeout(() => {
            // ข้อมูล Mock สำหรับตัวกรอง
            const mockFilters = {
                academicYears: ["2568", "2567", "2566"],
                levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"]
            };
            
            // อัพเดต dropdown ปีการศึกษา
            const academicYearDropdown = document.getElementById('filterAcademicYear');
            if (academicYearDropdown) {
                // เก็บค่าที่เลือกไว้
                const selectedValue = academicYearDropdown.value;
                
                // ล้างตัวเลือกเดิม (ยกเว้นตัวเลือกแรก - "ทั้งหมด")
                while (academicYearDropdown.options.length > 1) {
                    academicYearDropdown.remove(1);
                }
                
                // เพิ่มตัวเลือกใหม่
                mockFilters.academicYears.forEach(year => {
                    academicYearDropdown.add(new Option(year, year));
                });
                
                // เลือกค่าเดิม (ถ้ามี)
                if (selectedValue) {
                    academicYearDropdown.value = selectedValue;
                }
            }
            
            // อัพเดต dropdown ระดับชั้น
            const levelDropdown = document.getElementById('filterLevel');
            if (levelDropdown) {
                // เก็บค่าที่เลือกไว้
                const selectedValue = levelDropdown.value;
                
                // ล้างตัวเลือกเดิม (ยกเว้นตัวเลือกแรก - "ทั้งหมด")
                while (levelDropdown.options.length > 1) {
                    levelDropdown.remove(1);
                }
                
                // เพิ่มตัวเลือกใหม่
                mockFilters.levels.forEach(level => {
                    levelDropdown.add(new Option(level, level));
                });
                
                // เลือกค่าเดิม (ถ้ามี)
                if (selectedValue) {
                    levelDropdown.value = selectedValue;
                }
            }
            
            // อัพเดต class form dropdowns ด้วย
            const classLevelDropdown = document.getElementById('classes_level');
            if (classLevelDropdown) {
                // เก็บค่าที่เลือกไว้
                const selectedValue = classLevelDropdown.value;
                
                // ล้างตัวเลือกเดิม
                classLevelDropdown.innerHTML = '<option selected disabled value="">เลือกระดับชั้น</option>';
                
                // เพิ่มตัวเลือกใหม่
                mockFilters.levels.forEach(level => {
                    classLevelDropdown.add(new Option(level, level));
                });
                
                // เลือกค่าเดิม (ถ้ามี)
                if (selectedValue) {
                    classLevelDropdown.value = selectedValue;
                }
            }
            
            const classAcademicYearDropdown = document.getElementById('classes_academic_year');
            if (classAcademicYearDropdown) {
                // เก็บค่าที่เลือกไว้
                const selectedValue = classAcademicYearDropdown.value;
                
                // ล้างตัวเลือกเดิม
                classAcademicYearDropdown.innerHTML = '<option selected disabled value="">เลือกปีการศึกษา</option>';
                
                // เพิ่มตัวเลือกใหม่
                mockFilters.academicYears.forEach(year => {
                    classAcademicYearDropdown.add(new Option(year, year));
                });
                
                // เลือกค่าเดิม (ถ้ามี)
                if (selectedValue) {
                    classAcademicYearDropdown.value = selectedValue;
                }
            }
        }, 400);
    }

    // ฟังก์ชันสำหรับดึงข้อมูลครู (Mock Data)
    function fetchTeachersMock() {
        setTimeout(() => {
            // ข้อมูล Mock สำหรับครู
            const mockTeachers = [
                { teacher_id: "1", teacher_name: "ครูใจดี มีเมตตา" },
                { teacher_id: "2", teacher_name: "ครูสมศรี ดีเสมอ" },
                { teacher_id: "3", teacher_name: "ครูประเสริฐ เลิศวิชา" },
                { teacher_id: "4", teacher_name: "ครูวิชัย ใจสะอาด" },
                { teacher_id: "5", teacher_name: "ครูสมหมาย ตั้งใจเรียน" },
                { teacher_id: "6", teacher_name: "ครูมานะ พากเพียร" }
            ];
            
            // อัพเดต dropdown ครูประจำชั้น
            const teacherDropdown = document.getElementById('teacher_id');
            if (teacherDropdown) {
                // เก็บค่าที่เลือกไว้
                const selectedValue = teacherDropdown.value;
                
                // ล้างตัวเลือกเดิม
                teacherDropdown.innerHTML = '<option selected disabled value="">เลือกครูประจำชั้น</option>';
                
                // เพิ่มตัวเลือกใหม่
                mockTeachers.forEach(teacher => {
                    teacherDropdown.add(new Option(teacher.teacher_name, teacher.teacher_id));
                });
                
                // เลือกค่าเดิม (ถ้ามี)
                if (selectedValue) {
                    teacherDropdown.value = selectedValue;
                }
            }
        }, 500);
    }

    // ฟังก์ชันสำหรับแสดงรายการห้องเรียน
    function renderClassroomList() {
        const tableBody = document.querySelector('#classroomList table tbody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (classManager.classrooms.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-info-circle fa-2x mb-3"></i>
                            <p>ไม่พบข้อมูลห้องเรียน</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        classManager.classrooms.forEach(classroom => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${classroom.classes_name}</td>
                <td>${classroom.classes_academic_year}</td>
                <td>${classroom.teacher_name}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary view-class-btn" data-id="${classroom.classes_id}" title="ดูข้อมูล">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-secondary edit-class-btn" data-id="${classroom.classes_id}" title="แก้ไข">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-class-btn" data-id="${classroom.classes_id}" title="ลบ">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // เพิ่ม event listeners สำหรับปุ่มต่าง ๆ
        addClassButtonListeners();
    }

    // ฟังก์ชันสำหรับแสดง pagination
    function renderPagination() {
        const pagination = document.querySelector('#classroomList nav ul');
        
        if (!pagination) return;
        
        pagination.innerHTML = '';
        
        // ถ้ามีเพียงหน้าเดียว ไม่ต้องแสดง pagination
        if (classManager.totalPages <= 1) {
            return;
        }
        
        // ปุ่ม Previous
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        if (classManager.currentPage === 1) {
            prevLi.classList.add('disabled');
        }
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${classManager.currentPage - 1}">Previous</a>`;
        pagination.appendChild(prevLi);
        
        // หน้าต่าง ๆ
        for (let i = 1; i <= classManager.totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.classList.add('page-item');
            if (i === classManager.currentPage) {
                pageLi.classList.add('active');
            }
            pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(pageLi);
        }
        
        // ปุ่ม Next
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        if (classManager.currentPage === classManager.totalPages) {
            nextLi.classList.add('disabled');
        }
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${classManager.currentPage + 1}">Next</a>`;
        pagination.appendChild(nextLi);
        
        // เพิ่ม event listeners สำหรับ pagination
        document.querySelectorAll('#classroomList nav ul li:not(.disabled) a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                fetchClassroomsMock(page, classManager.searchTerm, classManager.filters);
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

    // ฟังก์ชันสำหรับเพิ่ม event listeners ให้กับปุ่มต่าง ๆ ในตาราง
    function addClassButtonListeners() {
        // ปุ่มดูข้อมูล
        document.querySelectorAll('.view-class-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const classId = this.getAttribute('data-id');
                viewClassDetail(classId);
            });
        });
        
        // ปุ่มแก้ไข
        document.querySelectorAll('.edit-class-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const classId = this.getAttribute('data-id');
                editClass(classId);
            });
        });
        
        // ปุ่มลบ
        document.querySelectorAll('.delete-class-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const classId = this.getAttribute('data-id');
                showDeleteConfirmation(classId);
            });
        });
    }

    // ฟังก์ชันสำหรับแสดง modal ยืนยันการลบ
    function showDeleteConfirmation(classId) {
        document.getElementById('deleteClassId').value = classId;
        
        // หาข้อมูลห้องเรียนเพื่อแสดงชื่อ
        const classroom = classManager.classrooms.find(c => c.classes_id === classId);
        if (classroom) {
            document.querySelector('#deleteClassModal .modal-body h5').textContent = `ยืนยันการลบห้องเรียน ${classroom.classes_name}?`;
        }
        
        // แสดง modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteClassModal'));
        deleteModal.show();
    }

    // ฟังก์ชันสำหรับดูรายละเอียดห้องเรียน
    function viewClassDetail(classId) {
        // ในการใช้งานจริง ควรเรียก API เพื่อดึงข้อมูลห้องเรียนตาม classId
        // แต่ในตัวอย่างนี้จะจำลองข้อมูล
        
        // เปิด modal รายละเอียดห้องเรียน
        const classDetailModal = new bootstrap.Modal(document.getElementById('classDetailModal'));
        classDetailModal.show();
        
        // แสดง loading
        document.getElementById('classDetailContent').classList.add('d-none');
        document.getElementById('classDetailLoading').classList.remove('d-none');
        
        // จำลองการโหลดข้อมูล
        setTimeout(() => {
            // หาข้อมูลห้องเรียนจากข้อมูลที่มีอยู่
            const classroom = classManager.classrooms.find(c => c.classes_id === classId);
            
            if (classroom) {
                // กำหนดชื่อห้องเรียนใน title
                document.querySelector('#classDetailModal .class-title').textContent = classroom.classes_name;
                
                // กำหนดข้อมูลห้องเรียนในหน้าแสดงรายละเอียด (จำลอง)
                document.querySelector('#student-count-badge').textContent = classroom.student_count;
                
                // แสดงเนื้อหาและซ่อน loading
                document.getElementById('classDetailContent').classList.remove('d-none');
                document.getElementById('classDetailLoading').classList.add('d-none');
                
                // จำลองการโหลดข้อมูลนักเรียนในห้องเรียน
                fetchClassStudentsMock(classId);
            }
        }, 1000);
    }

    // ฟังก์ชันจำลองการโหลดข้อมูลนักเรียนในห้องเรียน
    function fetchClassStudentsMock(classId) {
        // Mock data สำหรับนักเรียน
        const mockStudents = [
            {
                student_id: "1001",
                student_name: "สมชาย รักเรียน",
                student_number: "1001",
                student_class: "ม.5/1",
                student_score: 90,
                student_violations_count: 2,
                student_image: "https://ui-avatars.com/api/?name=สมชาย&background=95A4D8&color=fff"
            },
            {
                student_id: "1002",
                student_name: "สมศรี ดีมาก",
                student_number: "1002",
                student_class: "ม.5/1",
                student_score: 95,
                student_violations_count: 0,
                student_image: "https://ui-avatars.com/api/?name=สมศรี&background=95A4D8&color=fff"
            },
            {
                student_id: "1003",
                student_name: "มานะ พากเพียร",
                student_number: "1003",
                student_class: "ม.5/1",
                student_score: 85,
                student_violations_count: 3,
                student_image: "https://ui-avatars.com/api/?name=มานะ&background=95A4D8&color=fff"
            },
            {
                student_id: "1004",
                student_name: "สุดา เรียนดี",
                student_number: "1004",
                student_class: "ม.5/1",
                student_score: 92,
                student_violations_count: 1,
                student_image: "https://ui-avatars.com/api/?name=สุดา&background=95A4D8&color=fff"
            },
            {
                student_id: "1005",
                student_name: "วิชัย ใจดี",
                student_number: "1005",
                student_class: "ม.5/1",
                student_score: 88,
                student_violations_count: 2,
                student_image: "https://ui-avatars.com/api/?name=วิชัย&background=95A4D8&color=fff"
            }
        ];
        
        // จำลองการแสดงข้อมูลนักเรียน
        const studentsContainer = document.getElementById('students-list');
        if (studentsContainer) {
            studentsContainer.innerHTML = '';
            
            mockStudents.forEach(student => {
                const scoreClass = student.student_score >= 90 ? 'student-score-high' : 
                                  student.student_score >= 75 ? 'student-score-medium' : 
                                  'student-score-low';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.student_number}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${student.student_image}" alt="${student.student_name}" class="student-avatar me-2">
                            <span class="student-name">${student.student_name}</span>
                        </div>
                    </td>
                    <td>${student.student_class}</td>
                    <td>
                        <div class="progress ${scoreClass}" style="height: 8px; width: 100px;">
                            <div class="progress-bar" role="progressbar" style="width: ${student.student_score}%" aria-valuenow="${student.student_score}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <span class="small">${student.student_score}/100</span>
                    </td>
                    <td>${student.student_violations_count} ครั้ง</td>
                    <td>
                        <button class="btn btn-sm btn-primary-app" data-bs-toggle="modal" data-bs-target="#studentDetailModal" data-id="${student.student_id}">
                            <i class="fas fa-user me-1"></i> ดูข้อมูล
                        </button>
                    </td>
                `;
                
                studentsContainer.appendChild(row);
            });
        }
    }

    // ฟังก์ชันสำหรับแก้ไขห้องเรียน
    function editClass(classId) {
        // หาข้อมูลห้องเรียนจากข้อมูลที่มีอยู่
        const classroom = classManager.classrooms.find(c => c.classes_id === classId);
        
        if (classroom) {
            // เติมข้อมูลในฟอร์ม
            document.getElementById('classId').value = classroom.classes_id;
            
            // รอให้ dropdown โหลดข้อมูลเสร็จก่อน
            setTimeout(() => {
                document.getElementById('classes_level').value = classroom.classes_level;
                document.getElementById('classes_room_number').value = classroom.classes_room_number;
                document.getElementById('classes_academic_year').value = classroom.classes_academic_year;
                document.getElementById('teacher_id').value = classroom.teacher_id;
                
                // เปลี่ยนชื่อหัวฟอร์ม
                document.getElementById('formClassTitle').textContent = 'แก้ไขข้อมูลห้องเรียน';
                
                // แสดงฟอร์ม ซ่อนรายการ
                document.getElementById('classroomList').classList.add('d-none');
                document.getElementById('classroomForm').classList.remove('d-none');
            }, 600);
        }
    }

    // ฟังก์ชันสำหรับบันทึกข้อมูลห้องเรียน (เพิ่มใหม่หรือแก้ไข)
    function saveClassroom(formData) {
        // แสดง loading
        showLoading('classroomForm');
        
        // จำลองการบันทึกข้อมูล
        setTimeout(() => {
            // ในการใช้งานจริง ต้องส่งข้อมูลไปยัง API
            console.log('Saving classroom data:', formData);
            
            // จำลองว่าบันทึกสำเร็จ
            hideLoading('classroomForm');
            
            // แสดง toast แจ้งเตือน
            showToast('บันทึกข้อมูลห้องเรียนเรียบร้อยแล้ว', 'success');
            
            // ซ่อนฟอร์ม แสดงรายการ
            document.getElementById('classroomForm').classList.add('d-none');
            document.getElementById('classroomList').classList.remove('d-none');
            
            // รีเซ็ตฟอร์ม
            document.getElementById('formClassroom').reset();
            
            // โหลดข้อมูลห้องเรียนใหม่
            fetchClassroomsMock();
        }, 800);
    }

    // ฟังก์ชันสำหรับลบห้องเรียน
    function deleteClassroom(classId) {
        // แสดง loading ใน modal
        document.querySelector('#deleteClassModal .modal-body').classList.add('position-relative');
        showLoading('deleteClassModal');
        
        // จำลองการลบข้อมูล
        setTimeout(() => {
            // ในการใช้งานจริง ต้องส่งคำขอลบไปยัง API
            console.log('Deleting classroom:', classId);
            
            // จำลองว่าลบสำเร็จ
            hideLoading('deleteClassModal');
            
            // ปิด modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteClassModal'));
            deleteModal.hide();
            
            // แสดง toast แจ้งเตือน
            showToast('ลบห้องเรียนเรียบร้อยแล้ว', 'success');
            
            // โหลดข้อมูลห้องเรียนใหม่
            fetchClassroomsMock();
        }, 800);
    }

    // ฟังก์ชันแสดงข้อความแจ้งเตือน
    function showToast(message, type) {
        const toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // ถ้าไม่มี container ให้สร้างใหม่
            const newContainer = document.createElement('div');
            newContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(newContainer);
        }
        
        const toastId = `toast-${Date.now()}`;
        const toastHTML = `
            <div class="toast" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}">
                    <strong class="me-auto">${type === 'success' ? 'สำเร็จ' : 'ข้อผิดพลาด'}</strong>
                    <small>เมื่อสักครู่</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        document.querySelector('.toast-container').insertAdjacentHTML('beforeend', toastHTML);
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
        
        // ลบ toast หลังจากแสดงเสร็จ
        const toastElement = document.getElementById(toastId);
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }

    // เพิ่ม event listeners
    document.addEventListener('DOMContentLoaded', function() {
        const classroomSearchInput = document.getElementById('classroomSearch');
        const btnSearchClass = document.getElementById('btnSearchClass');
        const btnShowAddClass = document.getElementById('btnShowAddClass');
        const btnCloseClassForm = document.getElementById('btnCloseClassForm');
        const btnCancelClass = document.getElementById('btnCancelClass');
        const formClassroom = document.getElementById('formClassroom');
        const btnApplyFilter = document.getElementById('btnApplyFilter');
        const confirmDeleteClass = document.getElementById('confirmDeleteClass');
        
        // Event listener สำหรับการค้นหาห้องเรียน
        if (classroomSearchInput && btnSearchClass) {
            btnSearchClass.addEventListener('click', function() {
                classManager.searchTerm = classroomSearchInput.value;
                fetchClassroomsMock(1, classroomSearchInput.value, classManager.filters);
            });
            
            classroomSearchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    classManager.searchTerm = this.value;
                    fetchClassroomsMock(1, this.value, classManager.filters);
                }
            });
        }
        
        // Event listener สำหรับการกรองข้อมูล
        if (btnApplyFilter) {
            btnApplyFilter.addEventListener('click', function() {
                const academicYear = document.getElementById('filterAcademicYear').value;
                const level = document.getElementById('filterLevel').value;
                
                classManager.filters.academicYear = academicYear;
                classManager.filters.level = level;
                
                fetchClassroomsMock(1, classManager.searchTerm, classManager.filters);
            });
        }
        
        // Event listener สำหรับปุ่มเพิ่มห้องเรียนใหม่
        if (btnShowAddClass) {
            btnShowAddClass.addEventListener('click', function() {
                // รีเซ็ตฟอร์ม
                formClassroom.reset();
                document.getElementById('classId').value = '';
                document.getElementById('formClassTitle').textContent = 'เพิ่มห้องเรียนใหม่';
                
                // แสดงฟอร์ม ซ่อนรายการ
                document.getElementById('classroomList').classList.add('d-none');
                document.getElementById('classroomForm').classList.remove('d-none');
                
                // ตรวจสอบว่าข้อมูลตัวกรองถูกโหลดแล้วหรือไม่
                if (document.getElementById('classes_level').options.length <= 1) {
                    fetchFiltersMock();
                }
                
                // ตรวจสอบว่าข้อมูลครูถูกโหลดแล้วหรือไม่
                if (document.getElementById('teacher_id').options.length <= 1) {
                    fetchTeachersMock();
                }
            });
        }
        
        // Event listener สำหรับปุ่มปิดฟอร์ม
        if (btnCloseClassForm) {
            btnCloseClassForm.addEventListener('click', function() {
                document.getElementById('classroomForm').classList.add('d-none');
                document.getElementById('classroomList').classList.remove('d-none');
            });
        }
        
        // Event listener สำหรับปุ่มยกเลิกในฟอร์ม
        if (btnCancelClass) {
            btnCancelClass.addEventListener('click', function() {
                document.getElementById('classroomForm').classList.add('d-none');
                document.getElementById('classroomList').classList.remove('d-none');
            });
        }
        
        // Event listener สำหรับการบันทึกฟอร์ม
        if (formClassroom) {
            formClassroom.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // ตรวจสอบความถูกต้องของฟอร์ม
                if (this.checkValidity()) {
                    // สร้างข้อมูลสำหรับส่งไปบันทึก
                    const formData = {
                        classes_id: document.getElementById('classId').value,
                        classes_level: document.getElementById('classes_level').value,
                        classes_room_number: document.getElementById('classes_room_number').value,
                        classes_academic_year: document.getElementById('classes_academic_year').value,
                        teacher_id: document.getElementById('teacher_id').value
                    };
                    
                    // บันทึกข้อมูล
                    saveClassroom(formData);
                } else {
                    // แสดง validation errors
                    this.classList.add('was-validated');
                }
            });
        }
        
        // Event listener สำหรับปุ่มยืนยันการลบห้องเรียน
        if (confirmDeleteClass) {
            confirmDeleteClass.addEventListener('click', function() {
                const classId = document.getElementById('deleteClassId').value;
                if (classId) {
                    deleteClassroom(classId);
                }
            });
        }
        
        // Event listeners สำหรับปุ่มในหน้ารายละเอียดห้องเรียน
        const btnEditClassDetail = document.getElementById('btnEditClassDetail');
        if (btnEditClassDetail) {
            btnEditClassDetail.addEventListener('click', function() {
                const classDetailModal = bootstrap.Modal.getInstance(document.getElementById('classDetailModal'));
                classDetailModal.hide();
                
                // รอให้ modal ปิดก่อนแล้วค่อยแก้ไข
                setTimeout(() => {
                    // ดึง ID ของห้องเรียนที่กำลังดูอยู่ (จำลอง)
                    // ในสถานการณ์จริง ควรเก็บ ID ไว้ใน data attribute หรือตัวแปร
                    const classId = classManager.classrooms[0].classes_id;
                    editClass(classId);
                }, 500);
            });
        }
        
        // Event listener สำหรับปุ่มส่งออกรายงานในหน้ารายละเอียดห้องเรียน
        const btnExportClassReport = document.getElementById('btnExportClassReport');
        if (btnExportClassReport) {
            btnExportClassReport.addEventListener('click', function() {
                // จำลองการส่งออกรายงาน
                const className = document.querySelector('#classDetailModal .class-title').textContent;
                showToast(`กำลังส่งออกรายงานห้อง ${className}`, 'success');
            });
        }
    });
});