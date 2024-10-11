document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const registerTypeSection = document.getElementById('register-type-section');
    const volunteerRegisterSection1 = document.getElementById('volunteer-register-section-1');
    const volunteerRegisterSection2 = document.getElementById('volunteer-register-section-2');
    const institutionRegisterSection1 = document.getElementById('institution-register-section-1');
    const institutionRegisterSection2 = document.getElementById('institution-register-section-2');
    const institutionRegisterSection3 = document.getElementById('institution-register-section-3');
    
    let users = [];
    let isSubmitting = false;
    
    // Load users from localStorage
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error('Error loading users from localStorage:', error);
    }

    // Objeto para armazenar temporariamente os dados do formulário
    let tempFormData = {};

    // Verifica se há um usuário logado ao carregar a página
    checkLoggedInUser();

    // Setup textareas
    setupTextarea('volunteer-description', 100, 500);
    setupTextarea('institution-mission', 200, 1000);
    setupTextarea('institution-needs', 150, 800);
    setupTextarea('institution-description', 300, 2000);

    document.getElementById('show-register').addEventListener('click', () => {
        loginSection.classList.remove('active');
        registerTypeSection.classList.add('active');
    });

    document.getElementById('volunteer-button').addEventListener('click', () => {
        registerTypeSection.classList.remove('active');
        volunteerRegisterSection1.classList.add('active');
    });

    document.getElementById('institution-button').addEventListener('click', () => {
        registerTypeSection.classList.remove('active');
        institutionRegisterSection1.classList.add('active');
    });

    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            const activeSection = document.querySelector('section.active');
            activeSection.classList.remove('active');
            registerTypeSection.classList.add('active');
        });
    });

    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const staySignedIn = document.getElementById('stay-signed-in').checked;
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            if (staySignedIn) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                localStorage.setItem('staySignedIn', 'true');
            } else {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            }
            showMessage('login-email', 'Login bem-sucedido!', false);
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } else {
            showMessage('login-email', 'E-mail ou senha incorretos.', true);
            isSubmitting = false;
        }
    });

    document.getElementById('volunteer-register-form-1').addEventListener('submit', (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const name = document.getElementById('volunteer-name').value;
        const surname = document.getElementById('volunteer-surname').value;
        const username = document.getElementById('volunteer-username').value;
        const email = document.getElementById('volunteer-email').value;
        const dob = document.getElementById('volunteer-dob').value;
        const password = document.getElementById('volunteer-password').value;
        const confirmPassword = document.getElementById('volunteer-confirm-password').value;

        let isValid = true;

        if (!validateEmail(email)) {
            showMessage('volunteer-email', 'E-mail inválido.', true);
            isValid = false;
        } else {
            showMessage('volunteer-email', '', false);
        }

        if (!validatePassword(password, confirmPassword)) {
            showMessage('volunteer-password', 'As senhas não coincidem ou têm menos de 8 caracteres.', true);
            isValid = false;
        } else {
            showMessage('volunteer-password', '', false);
        }

        if (!validateUsername(username)) {
            showMessage('volunteer-username', 'O nome de usuário deve ter no mínimo 3 caracteres.', true);
            isValid = false;
        } else {
            showMessage('volunteer-username', '', false);
        }

        if (!validateAge(dob)) {
            showMessage('volunteer-dob', 'Você deve ter pelo menos 18 anos para se cadastrar.', true);
            isValid = false;
        } else {
            showMessage('volunteer-dob', '', false);
        }

        if (!isValid) {
            isSubmitting = false;
            return;
        }

        const existingUser = users.find(user => user.email === email || user.username === username);
        if (existingUser) {
            showMessage('volunteer-email', 'E-mail ou nome de usuário já cadastrado.', true);
            isSubmitting = false;
            return;
        }

        tempFormData = {
            type: 'volunteer',
            name,
            surname,
            username,
            email,
            dob,
            password
        };

        volunteerRegisterSection1.classList.remove('active');
        volunteerRegisterSection2.classList.add('active');
        isSubmitting = false;
    });

    document.getElementById('volunteer-register-form-2').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const profilePicFile = document.getElementById('volunteer-profile-pic').files[0];
        const headerImageFile = document.getElementById('volunteer-header').files[0];

        if (profilePicFile) {
            tempFormData.profilePic = await convertToBase64(profilePicFile);
        }
        if (headerImageFile) {
            tempFormData.headerImage = await convertToBase64(headerImageFile);
        }

        tempFormData.description = document.getElementById('volunteer-description').value;

        if (!validateTextareaLength('volunteer-description', 100, 500)) {
            showMessage('volunteer-description', 'A descrição deve ter entre 100 e 500 caracteres.', true);
            isSubmitting = false;
            return;
        }

        users.push(tempFormData);
        saveUsers();

        showMessage('volunteer-description', 'Cadastro de voluntário concluído!', false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    const multiselectC = document.querySelector('#multiselect-category');
    const toggleC = multiselectC.querySelector('.multiselect-toggle');
    const optionsC = multiselectC.querySelectorAll('input[type="checkbox"]');

    toggleC.addEventListener('click', function() {
        multiselectC.classList.toggle('open');
    });

    document.addEventListener('click', function(event) {
        if (!multiselectC.contains(event.target)) {
            multiselectC.classList.remove('open');
        }
    });
        
    document.getElementById('institution-register-form-1').addEventListener('submit', (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const name = document.getElementById('institution-name').value;
        const owner = document.getElementById('institution-owner').value;
        const cnpj = document.getElementById('institution-cnpj').value;
        const location = document.getElementById('institution-location').value;
        const email = document.getElementById('institution-email').value;
        const password = document.getElementById('institution-password').value;
        const confirmPassword = document.getElementById('institution-confirm-password').value;
        const selectedOptionsC = Array.from(optionsC).filter(option => option.checked).map(option => option.parentNode.textContent.trim());
        
        let isValid = true;

        if (!validateEmail(email)) {
            showMessage('institution-email', 'E-mail inválido.', true);
            isValid = false;
        } else {
            showMessage('institution-email', '', false);
        }

        if (!validatePassword(password, confirmPassword)) {
            showMessage('institution-password', 'As senhas não coincidem ou têm menos de 8 caracteres.', true);
            isValid = false;
        } else {
            showMessage('institution-password', '', false);
        }

        if (!validateCNPJ(cnpj)) {
            showMessage('institution-cnpj', 'CNPJ inválido.', true);
            isValid = false;
        } else {
            showMessage('institution-cnpj', '', false);
        }

        if (selectedOptionsC.length === 0) {
            showMessage('institution-category', 'Selecione pelo menos uma categoria.', true);
            isValid = false;
        } else {
            showMessage('institution-category', '', false);
        }

        if (!isValid) {
            isSubmitting = false;
            return;
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            showMessage('institution-email', 'E-mail já cadastrado.', true);
            isSubmitting = false;
            return;
        }

        tempFormData = {
            type: 'institution',
            name,
            categories: selectedOptionsC,
            owner,
            cnpj,
            location,
            email,
            password
        };

        institutionRegisterSection1.classList.remove('active');
        institutionRegisterSection2.classList.add('active');
        isSubmitting = false;
    });

    const multiselectD = document.querySelector('#multiselect-donation');
    const toggleD = multiselectD.querySelector('.multiselect-toggle');
    const optionsD = multiselectD.querySelectorAll('input[type="checkbox"]');

    toggleD.addEventListener('click', function() {
        multiselectD.classList.toggle('open');
    });

    document.addEventListener('click', function(event) {
        if (!multiselectD.contains(event.target)) {
            multiselectD.classList.remove('open');
        }
    });

    document.getElementById('institution-register-form-2').addEventListener('submit', (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        tempFormData.donationTypes = Array.from(optionsD).filter(option => option.checked).map(option => option.parentNode.textContent.trim());
        tempFormData.mission = document.getElementById('institution-mission').value;
        tempFormData.needs = document.getElementById('institution-needs').value;
        tempFormData.areas = Array.from(document.querySelectorAll('input[name="areas"]:checked')).map(checkbox => checkbox.value);

        if (!validateTextareaLength('institution-mission', 200, 1000)) {
            showMessage('institution-mission', 'A missão deve ter entre 200 e 1000 caracteres.', true);
            isSubmitting = false;
            return;
        }

        if (!validateTextareaLength('institution-needs', 150, 800)) {
            showMessage('institution-needs', 'As necessidades devem ter entre 150 e 800 caracteres.', true);
            isSubmitting = false;
            return;
        }

        institutionRegisterSection2.classList.remove('active');
        institutionRegisterSection3.classList.add('active');
        isSubmitting = false;
    });

    document.getElementById('institution-register-form-3').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const profilePicFile = document.getElementById('institution-profile-pic').files[0];
        const headerImageFile = document.getElementById('institution-header').files[0];

        if (profilePicFile) {
            tempFormData.profilePic = await convertToBase64(profilePicFile);
        }
        if (headerImageFile) {
            tempFormData.headerImage = await convertToBase64(headerImageFile);
        }

        tempFormData.description = document.getElementById('institution-description').value;
        tempFormData.website = document.getElementById('institution-website').value;
        tempFormData.socialMedia = document.getElementById('institution-social-media').value;

        if (!validateTextareaLength('institution-description', 300, 2000)) {
            showMessage('institution-description', 'A descrição deve ter entre 300 e 2000 caracteres.', true);
            isSubmitting = false;
            return;
        }

        users.push(tempFormData);
        saveUsers();

        showMessage('institution-social-media', 'Cadastro de instituição concluído!', false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imgElement.className = 'image-preview';
                    const existingPreview = event.target.parentElement.querySelector('.image-preview');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    event.target.parentElement.appendChild(imgElement);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    function setupTextarea(textareaId, minChars, maxChars) {
        const textarea = document.getElementById(textareaId);
        if (!textarea) {
            console.warn(`Textarea with id "${textareaId}" not found.`);
            return;
        }
    
        const charCountId = `charCount-${textareaId}`;
        let charCount = document.getElementById(charCountId);
    
        if (!charCount) {
            charCount = document.createElement('span');
            charCount.id = charCountId;
            charCount.className = 'char-counter';
            textarea.parentNode.insertBefore(charCount, textarea.nextSibling);
        }
    
        textarea.setAttribute('minlength', minChars);
        textarea.setAttribute('maxlength', maxChars);
    
        function updateCharCount() {
            const length = textarea.value.length;
            charCount.textContent = `${length}/${maxChars}`;
        }
    
        textarea.addEventListener('input', updateCharCount);
        updateCharCount(); // Initial count
    }

    function validateTextareaLength(textareaId, minChars, maxChars) {
        const textarea = document.getElementById(textareaId);
        if (!textarea) {
            console.warn(`Textarea with id "${textareaId}" not found.`);
            return false;
        }
        const length = textarea.value.length;
        return length >= minChars && length <= maxChars;
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password, confirmPassword) {
        return  password.length >= 8 && password === confirmPassword;
    }

    function validateUsername(username) {
        return username.length >= 3;
    }

    function validateCNPJ(cnpj) {
        const cnpjPattern = /^\d{14}$/;
        return cnpjPattern.test(cnpj);
    }

    function validateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 18;
    }

    function showMessage(elementId, message, isError) {
        const errorElement = document.getElementById(`${elementId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = isError ? '#ff3860' : '#4CAF50';
        }
    }

    function checkLoggedInUser() {
        const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            window.location.href = 'profile.html';
        }
    }

    function saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(users));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                users.shift();
                saveUsers();
            }
        }
    }
});