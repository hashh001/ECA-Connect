// Tailwind CSS configuration for custom colors and fonts
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#8EE000', // Main accent color
                accent: '#406600',  // Secondary accent color
                dark: '#1F2232',    // Dark text/background
                light: '#F5F7FA',   // Light background
                muted: '#E6EAEF',   // Muted borders/backgrounds
                neutral: '#0F1724'  // Neutral text
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'] // Consistent font
            },
            borderRadius: {
                card: '10px',   // Rounded corners for cards
                button: '8px',  // Rounded corners for buttons
                input: '6px'    // Rounded corners for inputs
            },
            boxShadow: {
                card: '0 6px 18px rgba(15,18,36,0.06)' // Shadow for cards
            }
        }
    }
}

// Global variables for user profile data
let userProfile = {
    name: '',
    email: '',
    interests: new Set(), // Use a Set for unique interests
    availability: [],
    radius: 5,
    location: 'San Francisco, CA' // Default location
};

// --- Utility Functions ---

// Function to show a specific view and hide others with a fade animation
function showView(viewName) {
    const allViews = ['landing', 'signup', 'emailVerification', 'login', 'profileSetup', 'mainApp', 'helloApi'];
    allViews.forEach(id => {
        const viewElement = document.getElementById(id);
        if (viewElement) {
            if (id === viewName) {
                viewElement.classList.remove('hidden');
                // Add fade-in animation
                viewElement.classList.add('view-fade-enter');
                setTimeout(() => viewElement.classList.add('view-fade-enter-active'), 10); // Small delay to trigger transition
                setTimeout(() => viewElement.classList.remove('view-fade-enter', 'view-fade-enter-active'), 510);
            } else {
                // Add fade-out animation before hiding
                if (!viewElement.classList.contains('hidden')) {
                    viewElement.classList.add('view-fade-exit-active');
                    setTimeout(() => {
                        viewElement.classList.add('hidden');
                        viewElement.classList.remove('view-fade-exit-active');
                    }, 500); // Hide after animation completes
                }
            }
        }
    });
}

// Function to show a toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return; // Exit if container doesn't exist

    const toast = document.createElement('div');
    toast.className = `toast bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 ${
        type === 'success' ? 'border-primary' :
        type === 'error' ? 'border-red-500' : 'border-gray-500'
    }`;

    const icon = document.createElement('i');
    icon.className = `mr-3 ${
        type === 'success' ? 'fas fa-check-circle text-primary' :
        type === 'error' ? 'fas fa-exclamation-circle text-red-500' : 'fas fa-info-circle text-gray-500'
    }`;

    const text = document.createElement('div');
    text.className = 'text-sm font-medium';
    text.textContent = message;
    text.setAttribute('role', 'alert');
    text.setAttribute('aria-live', 'assertive');

    toast.appendChild(icon);
    toast.appendChild(text);
    toastContainer.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toastContainer.removeChild(toast);
        }
    }, 4300); // Match toastFadeOut animation duration + buffer
}

// --- Google Sign-In Callback Function ---
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // In a real application, you would send this 'response.credential' (JWT ID token)
    // to your backend server for verification. Your server would then:
    // 1. Verify the token with Google's API.
    // 2. Create or retrieve a user in your database.
    // 3. Establish a session for the user (e.g., by issuing your own session token/cookie).

    // For this frontend-only example, we'll simulate a successful login.
    showToast("Google Sign-in successful! Redirecting...", "success");
    
    // Extract some basic info from the JWT (for display purposes only, not secure for auth)
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        userProfile.email = decodedToken.email || 'google-user@example.com';
        userProfile.name = decodedToken.name || 'Google User';
    } catch (e) {
        console.error("Failed to decode Google JWT:", e);
        userProfile.email = 'google-user@example.com';
        userProfile.name = 'Google User';
    }

    // After successful (simulated) sign-in, proceed to profile setup or main app
    showView('profileSetup'); // Or 'mainApp' if profile setup is optional after Google sign-in
}


// --- Authentication Flow Event Listeners ---

document.getElementById('getStartedBtn').addEventListener('click', () => {
    showView('signup');
});

document.getElementById('signInBtn').addEventListener('click', () => {
    showView('login');
});

document.getElementById('backToLanding').addEventListener('click', () => {
    showView('landing');
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('passwordMatchError').classList.remove('hidden');
        document.getElementById('confirmPassword').classList.add('shake', 'border-red-500');
        showToast('Passwords do not match.', 'error');
        return;
    }
    if (!document.getElementById('terms').checked) {
        showToast('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return;
    }

    // Store user info for profile update
    userProfile.name = name;
    userProfile.email = email;

    showView('emailVerification');
    document.getElementById('userEmail').textContent = email;
    showToast('Account created successfully! Please check your email.', 'success');
    document.getElementById('confirmPassword').classList.remove('shake', 'border-red-500');
});

document.getElementById('goToLogin').addEventListener('click', () => {
    showView('login');
});

document.getElementById('backToLandingFromLogin').addEventListener('click', () => {
    showView('landing');
});

document.getElementById('goToSignup').addEventListener('click', () => {
    showView('signup');
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    // In a real app, you'd verify credentials here
    userProfile.email = email; // Update global email on login

    showView('profileSetup');
    showToast('Successfully signed in! Please complete your profile.', 'success');
});

document.getElementById('forgotPassword').addEventListener('click', () => {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
});

document.getElementById('closeForgotModal').addEventListener('click', () => {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
});

document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('forgotPasswordModal').classList.add('hidden');
    showToast('Password reset link sent to your email', 'success');
});

document.getElementById('alreadyVerified').addEventListener('click', () => {
    showView('profileSetup');
});

document.getElementById('resendBtn').addEventListener('click', () => {
    const resendText = document.getElementById('resendText');
    const countdown = document.getElementById('countdown');
    const timer = document.getElementById('timer');

    resendText.classList.add('hidden');
    countdown.classList.remove('hidden');

    let timeLeft = 60;
    timer.textContent = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            resendText.classList.remove('hidden');
            countdown.classList.add('hidden');
        }
    }, 1000);

    showToast('Verification email resent successfully', 'success');
});

// --- Profile Setup Navigation and Data Handling ---

document.getElementById('skipProfileSetup').addEventListener('click', () => {
    showView('mainApp');
    initializeMainApp(); // Initialize main app when skipping setup
    showToast('Profile setup skipped. You can complete it later in your profile.', 'success');
});

document.getElementById('nextToAvailability').addEventListener('click', () => {
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('setupProgress').style.width = '66%';
    
    // Corrected selector for progress labels
    const progressLabelsContainer = document.getElementById('profileSetupProgressLabels');
    if (progressLabelsContainer) {
        progressLabelsContainer.children[0].classList.remove('text-primary', 'font-medium');
        progressLabelsContainer.children[0].classList.add('text-gray-500');
        progressLabelsContainer.children[1].classList.add('text-primary', 'font-medium');
        progressLabelsContainer.children[1].classList.remove('text-gray-500');
    }

    renderSlots(); // Render current availability when moving to this step
});

document.getElementById('backToInterests').addEventListener('click', () => {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('setupProgress').style.width = '33%';

    // Corrected selector for progress labels
    const progressLabelsContainer = document.getElementById('profileSetupProgressLabels');
    if (progressLabelsContainer) {
        progressLabelsContainer.children[1].classList.remove('text-primary', 'font-medium');
        progressLabelsContainer.children[1].classList.add('text-gray-500');
        progressLabelsContainer.children[0].classList.add('text-primary', 'font-medium');
        progressLabelsContainer.children[0].classList.remove('text-gray-500');
    }
});

document.getElementById('nextToLocation').addEventListener('click', () => {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('setupProgress').style.width = '100%';

    // Corrected selector for progress labels
    const progressLabelsContainer = document.getElementById('profileSetupProgressLabels');
    if (progressLabelsContainer) {
        progressLabelsContainer.children[1].classList.remove('text-primary', 'font-medium');
        progressLabelsContainer.children[1].classList.add('text-gray-500');
        progressLabelsContainer.children[2].classList.add('text-primary', 'font-medium');
        progressLabelsContainer.children[2].classList.remove('text-gray-500');
    }

    // Update location display if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // This is a placeholder; real geolocation would involve reverse geocoding
            document.getElementById('currentLocation').textContent = 'San Francisco, CA';
            userProfile.location = 'San Francisco, CA';
        }, () => {
            document.getElementById('currentLocation').textContent = 'Location not available';
            userProfile.location = 'Location not available';
        });
    } else {
        document.getElementById('currentLocation').textContent = 'Geolocation not supported';
        userProfile.location = 'Geolocation not supported';
    }
});

document.getElementById('backToAvailability').addEventListener('click', () => {
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('setupProgress').style.width = '66%';

    // Corrected selector for progress labels
    const progressLabelsContainer = document.getElementById('profileSetupProgressLabels');
    if (progressLabelsContainer) {
        progressLabelsContainer.children[2].classList.remove('text-primary', 'font-medium');
        progressLabelsContainer.children[2].classList.add('text-gray-500');
        progressLabelsContainer.children[1].classList.add('text-primary', 'font-medium');
        progressLabelsContainer.children[1].classList.remove('text-gray-500');
    }
});

document.getElementById('saveProfile').addEventListener('click', () => {
    // Save current radius value
    userProfile.radius = parseInt(document.getElementById('radiusSlider').value);

    showView('mainApp');
    initializeMainApp(); // Initialize main app after profile setup
    showToast('Profile setup complete! Welcome to HobbyConnect', 'success');
});

// Chip Selection for Interests
document.querySelectorAll('#interestsContainer .chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const interest = chip.getAttribute('data-interest');
        if (chip.classList.contains('selected')) {
            userProfile.interests.add(interest);
        } else {
            userProfile.interests.delete(interest);
        }
        console.log('Selected Interests:', Array.from(userProfile.interests));
    });
});

// Password Strength Indicator
const passwordInput = document.getElementById('password');
if (passwordInput) { // Ensure element exists
    passwordInput.addEventListener('input', () => {
        const strengthBar = document.getElementById('passwordStrength');
        const tips = document.getElementById('passwordTips');
        const password = passwordInput.value;

        let strength = 0;
        if (password.length > 7) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        strengthBar.style.width = `${strength}%`;

        if (strength < 50) {
            strengthBar.style.backgroundColor = '#FF4D4F';
            tips.innerHTML = '<p>Weak password. Try adding uppercase letters, numbers, or symbols.</p>';
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = '#FFA940';
            tips.innerHTML = '<p>Medium password. Almost there!</p>';
        } else {
            strengthBar.style.backgroundColor = '#52C41A';
            tips.innerHTML = '<p>Strong password. Good job!</p>';
        }
    });
}

// Password Match Validation
const confirmPasswordInput = document.getElementById('confirmPassword');
if (confirmPasswordInput) { // Ensure element exists
    confirmPasswordInput.addEventListener('input', () => {
        const password = document.getElementById('password').value;
        const confirmPassword = confirmPasswordInput.value;
        const errorElement = document.getElementById('passwordMatchError');

        if (password !== confirmPassword && confirmPassword !== '') {
            errorElement.classList.remove('hidden');
            confirmPasswordInput.classList.add('border-red-500');
        } else {
            errorElement.classList.add('hidden');
            confirmPasswordInput.classList.remove('border-red-500');
        }
    });
}

// Radius Slider
const radiusSlider = document.getElementById('radiusSlider');
const radiusValue = document.getElementById('radiusValue');
if (radiusSlider && radiusValue) {
    radiusSlider.addEventListener('input', () => {
        radiusValue.textContent = `${radiusSlider.value} km`;
        userProfile.radius = parseInt(radiusSlider.value); // Update userProfile directly
    });
}

// Use Current Location button (Profile Setup Step 3)
const useCurrentLocationBtn = document.getElementById('useCurrentLocationBtn');
if (useCurrentLocationBtn) {
    useCurrentLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                // In a real app, you would use a reverse geocoding API to get a city name
                document.getElementById('currentLocation').textContent = 'San Francisco, CA'; // Placeholder
                userProfile.location = 'San Francisco, CA';
                showToast('Location updated to San Francisco, CA', 'success');
            }, (error) => {
                console.error('Geolocation error:', error);
                document.getElementById('currentLocation').textContent = 'Location not available';
                showToast('Failed to get current location. Please try again.', 'error');
            });
        } else {
            showToast('Geolocation is not supported by your browser.', 'error');
        }
    });
}


// --- Availability Slot Management ---
let availabilitySlots = [
    // Initial mock data, or could be empty
    { day: 'Monday', startTime: '18:00', endTime: '20:00' },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
];

function renderSlots() {
    const slotsContainer = document.getElementById('slotsContainer');
    const emptySlots = document.getElementById('emptySlots');

    if (!slotsContainer || !emptySlots) return; // Exit if elements don't exist

    if (availabilitySlots.length === 0) {
        slotsContainer.classList.add('hidden');
        emptySlots.classList.remove('hidden');
    } else {
        slotsContainer.classList.remove('hidden');
        emptySlots.classList.add('hidden');

        slotsContainer.innerHTML = ''; // Clear existing slots

        availabilitySlots.forEach((slot, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'availability-slot flex items-center justify-between bg-light p-3 rounded-lg';
            slotDiv.innerHTML = `
                <div>
                    <span class="font-medium">${slot.day}</span>
                    <span class="text-gray-600 ml-2">${slot.startTime} - ${slot.endTime}</span>
                </div>
                <button class="delete-slot text-gray-400 hover:text-gray-600" data-index="${index}" aria-label="Delete slot">
                    <i class="fas fa-times"></i>
                </button>
            `;
            slotsContainer.appendChild(slotDiv);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-slot').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                availabilitySlots.splice(index, 1); // Remove slot from array
                userProfile.availability = availabilitySlots; // Update profile data
                renderSlots(); // Re-render the list
                showToast('Availability slot removed', 'success');
            });
        });
    }
    userProfile.availability = availabilitySlots; // Ensure userProfile always has current availability
}

// Add Slot Modal (Profile Setup Step 2)
document.getElementById('addSlotBtn')?.addEventListener('click', () => {
    document.getElementById('addSlotModal')?.classList.remove('hidden');
});

document.getElementById('closeSlotModal')?.addEventListener('click', () => {
    document.getElementById('addSlotModal')?.classList.add('hidden');
    document.getElementById('addSlotForm')?.reset();
});

// Handle slot form submission
document.getElementById('addSlotForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const day = document.getElementById('slotDay').value;
    const startTime = document.getElementById('slotStartTime').value;
    const endTime = document.getElementById('slotEndTime').value;

    // Validate times
    if (startTime >= endTime) {
        showToast('End time must be after start time', 'error');
        return;
    }

    // Check for conflicts (simple overlap check)
    const conflict = availabilitySlots.some(slot =>
        slot.day === day && (
            (startTime < slot.endTime && endTime > slot.startTime) // Check for any overlap
        )
    );

    if (conflict) {
        showToast('This time slot conflicts with an existing slot', 'error');
        return;
    }

    // Add the new slot
    availabilitySlots.push({ day, startTime, endTime });

    // Sort slots by day order (for consistent display)
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    availabilitySlots.sort((a, b) => {
        if (a.day === b.day) {
            return a.startTime.localeCompare(b.startTime); // Sort by time if same day
        }
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });

    renderSlots(); // Re-render the list
    document.getElementById('addSlotModal').classList.add('hidden');
    document.getElementById('addSlotForm').reset();
    showToast('Availability slot added successfully', 'success');
});

// Close modal on outside click
document.getElementById('addSlotModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('addSlotModal')) {
        document.getElementById('addSlotModal').classList.add('hidden');
        document.getElementById('addSlotForm').reset();
    }
});
document.getElementById('createGroupModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('createGroupModal')) {
        document.getElementById('createGroupModal').classList.add('hidden');
        document.getElementById('createGroupForm').reset();
    }
});
document.getElementById('groupDetailModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('groupDetailModal')) {
        document.getElementById('groupDetailModal').classList.add('hidden');
    }
});


// --- Main App Shell Functionality ---

// Array of main navigation IDs for the App Shell (Home, Create, Messages, Profile)
const mainNavItems = ['home', 'create', 'messages', 'profile'];

// Function to switch between main application views (tabs)
function switchMainNav(activeNav) {
    mainNavItems.forEach(nav => {
        const navBtn = document.getElementById(`${nav}NavBtn`);
        const content = document.getElementById(`${nav}MainContent`);

        if (navBtn && content) { // Ensure elements exist before trying to modify
            if (nav === activeNav) {
                navBtn.classList.add('nav-active');
                content.classList.remove('hidden');
            } else {
                navBtn.classList.remove('nav-active');
                content.classList.add('hidden');
            }
        }
    });

    // Special handling for Profile tab to update display data
    if (activeNav === 'profile') {
        updateProfileDisplay();
    }
}

// --- Event Listeners for Main App Shell ---

// Main Navigation buttons
document.getElementById('homeNavBtn')?.addEventListener('click', () => switchMainNav('home'));
document.getElementById('createNavBtn')?.addEventListener('click', () => switchMainNav('create'));
document.getElementById('messagesNavBtn')?.addEventListener('click', () => switchMainNav('messages'));
document.getElementById('profileNavBtn')?.addEventListener('click', () => switchMainNav('profile'));

// Header Create Button (switches to Create tab)
document.getElementById('headerCreateBtn')?.addEventListener('click', () => {
    switchMainNav('create');
});

// Create Group button on Create tab (opens modal)
document.getElementById('createGroupMainBtn')?.addEventListener('click', () => {
    document.getElementById('createGroupModal')?.classList.remove('hidden');
});
// Create Event button on Create tab (opens modal)
document.getElementById('createEventMainBtn')?.addEventListener('click', () => {
    document.getElementById('createEventModal')?.classList.remove('hidden');
});


// Close Create Group Modal
document.getElementById('closeCreateGroupModal')?.addEventListener('click', () => {
    document.getElementById('createGroupModal')?.classList.add('hidden');
    document.getElementById('createGroupForm')?.reset();
});

// Close Create Event Modal
document.getElementById('closeCreateEventModal')?.addEventListener('click', () => {
    document.getElementById('createEventModal')?.classList.add('hidden');
    document.getElementById('createEventForm')?.reset();
});

// Handle Create Group Form Submission
document.getElementById('createGroupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('groupTitle').value,
        interest: document.getElementById('groupInterest').value,
        location: document.getElementById('groupLocation').value,
        description: document.getElementById('groupDescription').value,
        maxMembers: document.getElementById('groupMaxMembers').value,
        privacy: document.getElementById('groupPrivacy').value
    };

    console.log('Creating group:', formData);

    document.getElementById('createGroupModal').classList.add('hidden');
    document.getElementById('createGroupForm').reset();
    showToast('Group created successfully! Pending approval.', 'success');
});

// Handle Create Event Form Submission
document.getElementById('createEventForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        eventName: document.getElementById('eventName').value,
        eventInterest: document.getElementById('eventInterest').value,
        eventType: document.getElementById('eventType').value,
        eventIdeas: document.getElementById('eventIdeas').value,
        eventDate: document.getElementById('eventDate').value,
        eventTime: document.getElementById('eventTime').value,
        eventLocation: document.getElementById('eventLocation').value,
    };

    console.log('Creating event:', formData);

    document.getElementById('createEventModal').classList.add('hidden');
    document.getElementById('createEventForm').reset();
    showToast('Event created successfully!', 'success');
});


// Group Card click to open detail modal
document.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent opening modal if a button *inside* the card was clicked
        if (e.target.closest('button')) {
            e.stopPropagation(); // Stop propagation for internal button clicks
            return;
        }
        document.getElementById('groupDetailModal')?.classList.remove('hidden');
    });
});

// Close Group Detail Modal
document.getElementById('closeGroupDetailModal')?.addEventListener('click', () => {
    document.getElementById('groupDetailModal')?.classList.add('hidden');
});

// Profile Dropdown Toggle
document.getElementById('profileMenuBtn')?.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click from closing it immediately
    const dropdown = document.getElementById('profileDropdownMenu');
    if (dropdown) dropdown.classList.toggle('hidden');
});

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdownMenu');
    const profileBtn = document.getElementById('profileMenuBtn');
    if (dropdown && profileBtn && !dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// Dev Tools Link (switches to Hello API view)
document.getElementById('devToolsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showView('helloApi');
});

// Back from Dev Tools to Main App
document.getElementById('backToApp')?.addEventListener('click', () => {
    showView('mainApp');
});

// Ping API button on Dev Tools page
document.getElementById('pingApi')?.addEventListener('click', () => {
    const btn = document.getElementById('pingApi');
    if (!btn) return;
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Pinging...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showToast('API ping successful: 42ms', 'success');
    }, 1000);
});

// --- Search Functionality ---
let searchTimeout;
document.getElementById('globalSearch')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length > 2) {
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    } else {
        document.getElementById('searchSuggestions')?.classList.add('hidden');
    }
});

// Mock search function to populate suggestions
function performSearch(query) {
    const suggestions = document.getElementById('searchSuggestions');
    if (!suggestions) return;

    // Mock search results based on the provided project definition
    const mockResults = [
        { type: 'group', name: 'Bay Area Hikers', icon: 'fas fa-hiking', members: 24 },
        { type: 'event', name: 'Cooking Class Tomorrow', icon: 'fas fa-utensils', time: '7:00 PM' },
        { type: 'person', name: 'Sarah Johnson', icon: 'fas fa-user', location: 'SF' },
        { type: 'group', name: 'SF Foodies', icon: 'fas fa-utensils', members: 15 },
        { type: 'event', name: 'Book Club Meetup', icon: 'fas fa-book', time: 'Mon 6:00 PM' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    if (mockResults.length > 0) {
        suggestions.innerHTML = mockResults.map(result => `
            <div class="search-suggestion flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-light flex items-center justify-center">
                    <i class="${result.icon} text-primary text-sm"></i>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-sm">${result.name}</p>
                    <p class="text-xs text-gray-500">
                        ${result.type === 'group' ? `${result.members} members` :
                          result.type === 'event' ? result.time : result.location}
                    </p>
                </div>
                <span class="text-xs text-gray-400">${result.type}</span>
            </div>
        `).join('');
        suggestions.classList.remove('hidden');
    } else {
        suggestions.innerHTML = `
            <div class="search-suggestion text-center text-gray-500">
                <p class="text-sm">No results found for "${query}"</p>
            </div>
        `;
        suggestions.classList.remove('hidden');
    }
}

// Hide search suggestions when clicking outside
document.addEventListener('click', (e) => {
    const searchInput = document.getElementById('globalSearch');
    const suggestions = document.getElementById('searchSuggestions');
    if (searchInput && suggestions && !searchInput.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.classList.add('hidden');
    }
});

// --- Home Page (Feed) Functionality ---

// Interest Filter Chips
document.querySelectorAll('.interest-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        const activeFilters = Array.from(document.querySelectorAll('.interest-filter-chip.active'))
            .map(chip => chip.getAttribute('data-interest'));

        console.log('Active filters:', activeFilters);
        if (activeFilters.length > 0) {
            showToast(`Filtering by: ${activeFilters.join(', ')}`, 'success');
        } else {
            showToast('Showing all groups', 'success');
        }
    });
});

// Feed/Map View Toggle
document.getElementById('feedViewToggle')?.addEventListener('click', () => {
    document.getElementById('feedViewToggle').classList.add('view-active');
    document.getElementById('mapViewToggle').classList.remove('view-active');
    document.getElementById('feedContainer').classList.remove('hidden');
    document.getElementById('mapContainer').classList.add('hidden');
});

document.getElementById('mapViewToggle')?.addEventListener('click', () => {
    document.getElementById('mapViewToggle').classList.add('view-active');
    document.getElementById('feedViewToggle').classList.remove('view-active');
    document.getElementById('mapContainer').classList.remove('hidden');
    document.getElementById('feedContainer').classList.add('hidden');
    showToast('Map view loaded!', 'success');
});

// Distance Filter Select
document.getElementById('distanceSelect')?.addEventListener('change', (e) => {
    const distance = e.target.value;
    if (distance) {
        showToast(`Showing groups within ${distance} km`, 'success');
    } else {
        showToast('Showing all distances', 'success');
    }
});

// Notification Button (placeholder action)
document.getElementById('notificationBtn')?.addEventListener('click', () => {
    showToast('Notifications feature coming soon!', 'success');
    document.getElementById('notificationBadge')?.classList.add('hidden'); // Hide badge after clicking
});


// --- Profile Display Update Function (for data transfer) ---
function updateProfileDisplay() {
    // Update profile dropdown in header
    document.getElementById('profileDropdownName').textContent = userProfile.name || 'User Name';
    document.getElementById('profileDropdownEmail').textContent = userProfile.email || 'user@example.com';

    // Update Profile tab content
    document.getElementById('profileDisplayName').textContent = userProfile.name || 'User Name';
    document.getElementById('profileDisplayEmail').textContent = userProfile.email || 'user@example.com';

    // Update interests display
    const profileInterestsDiv = document.getElementById('profileInterestsDisplay');
    if (profileInterestsDiv) {
        profileInterestsDiv.innerHTML = ''; // Clear existing
        if (userProfile.interests.size > 0) {
            userProfile.interests.forEach(interest => {
                const chip = document.createElement('span');
                chip.className = 'chip selected';
                chip.textContent = interest.charAt(0).toUpperCase() + interest.slice(1); // Capitalize first letter
                profileInterestsDiv.appendChild(chip);
            });
        } else {
            profileInterestsDiv.innerHTML = '<p class="text-sm text-gray-500">No interests selected yet.</p>';
        }
    }

    // Update availability display
    const profileAvailabilityDiv = document.getElementById('profileAvailabilityDisplay');
    if (profileAvailabilityDiv) {
        profileAvailabilityDiv.innerHTML = ''; // Clear existing
        if (userProfile.availability.length > 0) {
            userProfile.availability.forEach(slot => {
                const chip = document.createElement('span');
                chip.className = 'availability-chip';
                chip.textContent = `${slot.day} ${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`;
                profileAvailabilityDiv.appendChild(chip);
            });
        } else {
            profileAvailabilityDiv.innerHTML = '<p class="text-sm text-gray-500">No availability set yet.</p>';
        }
    }

    // Update location and radius
    document.getElementById('profileLocationDisplay').textContent = userProfile.location;
    document.getElementById('profileRadiusDisplay').textContent = `${userProfile.radius} km radius`;
}


// --- Gemini API Integration Functions ---

// Helper for exponential backoff
async function fetchWithExponentialBackoff(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            } else if (response.status === 429 && i < retries - 1) { // Too Many Requests
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            } else {
                throw new Error(`API error: ${response.statusText}`);
            }
        } catch (error) {
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            } else {
                throw error;
            }
        }
    }
}


// Function to generate group description using Gemini API
async function generateGroupDescription() {
    const groupTitle = document.getElementById('groupTitle').value;
    const groupInterest = document.getElementById('groupInterest').value;
    const groupDescriptionField = document.getElementById('groupDescription');
    const generateBtn = document.getElementById('generateGroupDescriptionBtn');
    const spinner = document.getElementById('generateGroupDescriptionSpinner');

    if (!groupTitle || !groupInterest) {
        showToast('Please enter a Group Name and select a Primary Interest first.', 'error');
        return;
    }

    generateBtn.disabled = true;
    spinner.classList.remove('hidden');
    const originalBtnText = generateBtn.innerHTML;
    generateBtn.innerHTML = `<span class="flex items-center"><i class="fas fa-spinner fa-spin mr-2"></i> Generating...</span>`;


    const prompt = `Generate a concise and engaging description for a group named "${groupTitle}" with a primary interest in "${groupInterest}". Focus on what members would do and what makes the group appealing. Keep it under 100 words.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide this at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetchWithExponentialBackoff(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const generatedText = result.candidates[0].content.parts[0].text;
            groupDescriptionField.value = generatedText;
            showToast('Group description generated successfully!', 'success');
        } else {
            showToast('Failed to generate description. Please try again.', 'error');
            console.error('Gemini API response structure unexpected:', result);
        }
    } catch (error) {
        showToast(`Error generating description: ${error.message}`, 'error');
        console.error('Error calling Gemini API:', error);
    } finally {
        generateBtn.disabled = false;
        spinner.classList.add('hidden');
        generateBtn.innerHTML = originalBtnText; // Revert button text
    }
}

// Function to generate event ideas using Gemini API
async function generateEventIdeas() {
    const eventName = document.getElementById('eventName').value;
    const eventInterest = document.getElementById('eventInterest').value;
    const eventType = document.getElementById('eventType').value;
    const eventIdeasField = document.getElementById('eventIdeas');
    const generateBtn = document.getElementById('generateEventIdeasBtn');
    const spinner = document.getElementById('generateEventIdeasSpinner');

    if (!eventName || !eventInterest || !eventType) {
        showToast('Please enter an Event Name, select an Interest, and an Event Type first.', 'error');
        return;
    }

    generateBtn.disabled = true;
    spinner.classList.remove('hidden');
    const originalBtnText = generateBtn.innerHTML;
    generateBtn.innerHTML = `<span class="flex items-center"><i class="fas fa-spinner fa-spin mr-2"></i> Generating...</span>`;

    const prompt = `Suggest 3-5 creative and engaging event ideas for an event named "${eventName}" focused on "${eventInterest}" as a "${eventType}". For each idea, include a brief description and a unique activity. Format as a numbered list.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide this at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetchWithExponentialBackoff(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const generatedText = result.candidates[0].content.parts[0].text;
            eventIdeasField.value = generatedText;
            showToast('Event ideas generated successfully!', 'success');
        } else {
            showToast('Failed to generate ideas. Please try again.', 'error');
            console.error('Gemini API response structure unexpected:', result);
        }
    } catch (error) {
        showToast(`Error generating ideas: ${error.message}`, 'error');
        console.error('Error calling Gemini API:', error);
    } finally {
        generateBtn.disabled = false;
        spinner.classList.add('hidden');
        generateBtn.innerHTML = originalBtnText; // Revert button text
    }
}


// --- Master Initialization Function ---
function initializeApp() {
    // Set initial view to landing page
    showView('landing');

    // Initialize API ping for Dev Tools (sidebar)
    const sidebarPingBtn = document.getElementById('pingApiBtn');
    if (sidebarPingBtn) {
        sidebarPingBtn.addEventListener('click', () => {
            const btn = sidebarPingBtn;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Pinging...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                showToast('API ping successful: 42ms', 'success');
            }, 1000);
        });
    }

    // For demonstration, pre-fill some user data if no explicit login happened
    if (!userProfile.name) {
        userProfile.name = 'Sarah Johnson';
        userProfile.email = 'sarah@example.com';
    }

    // Initialize current location for Profile Setup
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('currentLocation').textContent = 'San Francisco, CA';
            userProfile.location = 'San Francisco, CA';
        }, () => {
            document.getElementById('currentLocation').textContent = 'Location not available';
            userProfile.location = 'Location not available';
        });
    } else {
        document.getElementById('currentLocation').textContent = 'Geolocation not supported';
        userProfile.location = 'Geolocation not supported';
    }

    // Initial rendering of availability slots for profile setup
    renderSlots();

    // Attach event listeners for Gemini API buttons
    document.getElementById('generateGroupDescriptionBtn')?.addEventListener('click', generateGroupDescription);
    document.getElementById('generateEventIdeasBtn')?.addEventListener('click', generateEventIdeas);

    // Initialize Google Sign-In buttons
    const GOOGLE_CLIENT_ID = "250245806864-75f2ekugehkl0hhsbo36sqh1mj2d2eca.apps.googleusercontent.com"; // Your provided client_id

    if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false, // Prevents automatic sign-in
            cancel_on_tap_outside: true // Allows dismissing by tapping outside
        });

        // Render Google button for Landing page (if it exists)
        if (document.getElementById('google-landing-signup-button')) {
            window.google.accounts.id.renderButton(
                document.getElementById("google-landing-signup-button"),
                { theme: "outline", size: "large", type: "standard", width: "350", text: "signup_with" } // 'signup_with' for signup context
            );
        }

        // Render Google button for Signup page (if it exists)
        if (document.getElementById('google-signup-button')) {
            window.google.accounts.id.renderButton(
                document.getElementById("google-signup-button"),
                { theme: "outline", size: "large", type: "standard", width: "350", text: "signup_with" } // 'signup_with' for signup context
            );
        }

        // Render Google button for Login page (if it exists)
        if (document.getElementById('google-signin-button')) {
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", type: "standard", width: "350", text: "signin_with" } // 'signin_with' for signin context
            );
        }
    } else {
        console.warn("Google Identity Services not loaded or CLIENT_ID is missing.");
        // Fallback for Google buttons if GIS is not loaded or client ID is missing
        const fallbackGoogleButtons = document.querySelectorAll('[id^="google-"][id$="-button"]');
        fallbackGoogleButtons.forEach(btn => {
            btn.innerHTML = `
                <button class="flex items-center justify-center w-full py-3 px-4 bg-white border border-muted rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition duration-300">
                    <i class="fab fa-google text-red-500 mr-2"></i>
                    Sign in with Google (Not configured)
                </button>
            `;
            btn.onclick = () => showToast("Google Sign-In is not configured. Please check CLIENT_ID.", "error");
        });
    }
}

// Call the master initialization function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);