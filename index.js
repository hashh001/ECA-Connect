const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle static files
  if (req.url.startsWith('/static/') || req.url.endsWith('.css') || req.url.endsWith('.js') || req.url.endsWith('.ico')) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  // Serve the main application
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hobby Connect - Find People Who Share Your Passions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#8EE000',
                        accent: '#406600',
                        dark: '#1F2232',
                        light: '#F5F7FA',
                        muted: '#E6EAEF',
                        neutral: '#0F1724'
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif']
                    },
                    borderRadius: {
                        card: '10px',
                        button: '8px',
                        input: '6px'
                    },
                    boxShadow: {
                        card: '0 6px 18px rgba(15,18,36,0.06)'
                    }
                }
            }
        }
    </script>
    <style>
        :root {
            --primary: #8EE000;
            --accent: #406600;
            --dark: #1F2232;
            --light: #F5F7FA;
            --muted: #E6EAEF;
            --neutral: #0F1724;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F5F7FA;
            color: #0F1724;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: var(--primary);
            color: white;
            border-radius: 8px;
            transition: all 0.14s ease-in;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .btn-primary:hover {
            background-color: #7bc800;
            transform: scale(0.98);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .btn-secondary {
            border: 2px solid var(--accent);
            color: var(--accent);
            border-radius: 8px;
            transition: all 0.14s ease-in;
        }
        
        .btn-secondary:hover {
            background-color: rgba(64, 102, 0, 0.05);
            transform: scale(0.98);
        }
        
        .card {
            border-radius: 10px;
            box-shadow: 0 6px 18px rgba(15,18,36,0.06);
            transition: all 0.3s ease;
        }
        
        .chip {
            border-radius: 16px;
            padding: 4px 12px;
            border: 1px solid var(--muted);
            transition: all 0.15s ease;
        }
        
        .chip.selected {
            background-color: var(--primary);
            color: white;
            border-color: var(--primary);
        }
        
        input:focus, textarea:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
            transition: outline-color 0.12s ease;
        }
        
        .slide-in {
            animation: slideIn 0.3s forwards;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-3px); }
            40%, 80% { transform: translateX(3px); }
        }
        
        .toast {
            animation: toastSlideIn 0.3s forwards, toastFadeOut 0.3s forwards 4s;
            position: relative;
            padding-right: 2.5rem;
        }
        
        .toast::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary);
            animation: toastProgress 4s linear forwards;
        }
        
        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes toastFadeOut {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
        }
        
        @keyframes toastProgress {
            from { width: 100%; }
            to { width: 0%; }
        }
        
        .progress-bar {
            height: 4px;
            background-color: var(--muted);
            border-radius: 2px;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary);
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        
        .tab-active {
            color: var(--primary);
            position: relative;
        }
        
        .tab-active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            background-color: var(--primary);
            border-radius: 2px;
        }

        .availability-chip {
            background-color: rgba(142, 224, 0, 0.1);
            color: var(--accent);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .view-toggle {
            color: #6B7280;
            transition: all 0.15s ease;
        }

        .view-toggle.active {
            background-color: var(--primary);
            color: white;
        }

        .group-card:hover {
            transform: translateY(-2px);
        }

        .chip[data-filter] {
            cursor: pointer;
        }

        .chip[data-filter].selected {
            background-color: var(--primary);
            color: white;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    <!-- Skip to content -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:z-50">
        Skip to content
    </a>
    
    <!-- Main Container -->
    <div id="app" class="flex flex-col min-h-screen">
        <!-- Landing Page -->
        <div id="landing" class="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-white to-[#F5F7FA]">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <div class="flex justify-center mb-6">
                        <div class="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center">
                            <i class="fas fa-users text-white text-2xl"></i>
                        </div>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-neutral mb-4">Find local people who share your hobbies</h1>
                    <p class="text-gray-600 mb-8">Connect with enthusiasts in your area for activities you love</p>
                </div>
                
                <div class="space-y-4">
                    <button id="getStartedBtn" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        Get Started
                    </button>
                    
                    <button id="signInBtn" class="btn-secondary w-full py-3 px-4 font-semibold rounded-lg transition duration-300">
                        Sign In
                    </button>
                    
                    <button class="flex items-center justify-center w-full py-3 px-4 bg-white border border-muted rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition duration-300">
                        <i class="fab fa-google text-red-500 mr-2"></i> 
                        Sign up with Google
                    </button>
                </div>
            </div>
            
            <div class="absolute bottom-8 text-center text-gray-500 text-sm">
                <p>Join over 250,000 people discovering new hobbies</p>
            </div>
        </div>
        
        <!-- Signup Page -->
        <div id="signup" class="hidden min-h-screen p-4 md:p-8 bg-[#F5F7FA]">
            <div class="max-w-md mx-auto">
                <div class="mb-10">
                    <button id="backToLanding" class="text-primary flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <h2 class="text-2xl font-bold mt-4 mb-2">Create your account</h2>
                    <p class="text-gray-600">Join our community of hobby enthusiasts</p>
                </div>
                
                <form id="signupForm" class="space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="name" name="name" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="John Smith" required aria-describedby="name-help">
                        <p id="name-help" class="sr-only">Enter your full name</p>
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="email" name="email" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="you@example.com" required>
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="password" name="password" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="At least 8 characters" required>
                        <div class="mt-2">
                            <div class="progress-bar w-full">
                                <div id="passwordStrength" class="progress-fill w-0"></div>
                            </div>
                            <div id="passwordTips" class="text-xs text-gray-500 mt-1">
                                <p>Use at least 8 characters with a mix of letters, numbers and symbols</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="Re-enter your password" required>
                        <p id="passwordMatchError" class="text-xs text-red-500 mt-1 hidden">Passwords do not match</p>
                    </div>
                    
                    <div class="flex items-center">
                        <input id="terms" type="checkbox" class="h-4 w-4 text-primary rounded border-muted focus:ring-primary">
                        <label for="terms" class="ml-2 block text-sm text-gray-700">
                            I agree to the <a href="#" class="text-primary font-medium">Terms of Service</a> and <a href="#" class="text-primary font-medium">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <div class="space-y-4">
                        <button type="submit" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg shadow-md">
                            Create Account
                        </button>
                        
                        <div class="relative flex items-center">
                            <div class="flex-grow border-t border-muted"></div>
                            <span class="flex-shrink mx-4 text-gray-500 text-sm">or continue with</span>
                            <div class="flex-grow border-t border-muted"></div>
                        </div>
                        
                        <button type="button" class="flex items-center justify-center w-full py-3 px-4 bg-white border border-muted rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                            <i class="fab fa-google text-red-500 mr-2"></i> 
                            Sign up with Google
                        </button>
                    </div>
                </form>
                
                <div class="mt-8 text-center text-sm">
                    <p class="text-gray-600">Already have an account? <button id="goToLogin" class="text-primary font-medium">Sign in</button></p>
                </div>
            </div>
        </div>
        
        <!-- Email Verification Page -->
        <div id="emailVerification" class="hidden min-h-screen p-4 md:p-8 bg-[#F5F7FA]">
            <div class="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen">
                <div class="text-center">
                    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-envelope-open-text text-primary text-3xl"></i>
                    </div>
                    
                    <h2 class="text-2xl font-bold mb-4">Check your inbox</h2>
                    <p class="text-gray-600 mb-6">We sent a verification link to <span id="userEmail" class="font-semibold">you@domain.com</span></p>
                    
                    <div class="space-y-4">
                        <button id="resendBtn" class="btn-secondary w-full py-3 px-4 font-semibold rounded-lg">
                            <span id="resendText">Resend verification</span>
                            <span id="countdown" class="hidden">Resend in <span id="timer">60</span>s</span>
                        </button>
                        
                        <button id="alreadyVerified" class="text-primary font-medium">
                            Already verified? Continue
                        </button>
                    </div>
                    
                    <div class="mt-10 text-sm text-gray-500">
                        <p>Didn't receive the email? Check your spam folder or try resending</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Login Page -->
        <div id="login" class="hidden min-h-screen p-4 md:p-8 bg-[#F5F7FA]">
            <div class="max-w-md mx-auto">
                <div class="mb-10">
                    <button id="backToLandingFromLogin" class="text-primary flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <h2 class="text-2xl font-bold mt-4 mb-2">Welcome back</h2>
                    <p class="text-gray-600">Sign in to your account</p>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label for="loginEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="loginEmail" name="email" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="you@example.com" required>
                    </div>
                    
                    <div>
                        <label for="loginPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="loginPassword" name="password" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="Enter your password" required>
                        <div class="mt-1 text-right">
                            <button type="button" id="forgotPassword" class="text-sm text-primary font-medium">Forgot password?</button>
                        </div>
                    </div>
                    
                    <div class="flex items-center">
                        <input id="remember" type="checkbox" class="h-4 w-4 text-primary rounded border-muted focus:ring-primary">
                        <label for="remember" class="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                    
                    <div>
                        <button type="submit" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg shadow-md">
                            Sign In
                        </button>
                    </div>
                </form>
                
                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-muted"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-[#F5F7FA] text-gray-500">Or sign in with</span>
                    </div>
                </div>
                
                <button class="flex items-center justify-center w-full py-3 px-4 bg-white border border-muted rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                    <i class="fab fa-google text-red-500 mr-2"></i> 
                    Sign in with Google
                </button>
                
                <div class="mt-8 text-center text-sm">
                    <p class="text-gray-600">Don't have an account? <button id="goToSignup" class="text-primary font-medium">Sign up</button></p>
                </div>
            </div>
        </div>
        
        <!-- Create Group Modal -->
        <div id="createGroupModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">Create New Group</h3>
                    <button id="closeCreateGroupModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form id="createGroupForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="groupTitle" class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                            <input type="text" id="groupTitle" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., Weekend Hikers" required>
                        </div>

                        <div>
                            <label for="groupInterest" class="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
                            <select id="groupInterest" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" required>
                                <option value="">Select interest</option>
                                <option value="hiking">Hiking & Outdoors</option>
                                <option value="cooking">Cooking & Food</option>
                                <option value="reading">Books & Reading</option>
                                <option value="music">Music</option>
                                <option value="sports">Sports & Fitness</option>
                                <option value="arts">Arts & Crafts</option>
                                <option value="technology">Technology</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label for="groupLocation" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input type="text" id="groupLocation" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="San Francisco, CA" required>
                        </div>

                        <div class="md:col-span-2">
                            <label for="groupDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="groupDescription" rows="4" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="Tell people what your group is about..."></textarea>
                        </div>

                        <div>
                            <label for="groupMaxMembers" class="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                            <input type="number" id="groupMaxMembers" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="50" min="2" max="500">
                        </div>

                        <div>
                            <label for="groupPrivacy" class="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                            <select id="groupPrivacy" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary">
                                <option value="public">Public - Anyone can join</option>
                                <option value="private">Private - Approval required</option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-4 border-t">
                        <button type="submit" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg">
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Group Detail Modal -->
        <div id="groupDetailModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <!-- Group Header -->
                <div class="relative">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-32 rounded-t-xl"></div>
                    <button id="closeGroupDetailModal" class="absolute top-4 right-4 text-white hover:text-gray-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                    <div class="absolute -bottom-8 left-6">
                        <div class="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg">
                            <i class="fas fa-hiking text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Group Content -->
                <div class="p-6 pt-12">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Main Content -->
                        <div class="lg:col-span-2">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h2 class="text-3xl font-bold">Bay Area Hikers</h2>
                                    <p class="text-gray-600">24 members • 2.3 km away</p>
                                    <div class="flex items-center mt-2 space-x-2">
                                        <span class="availability-chip">Weekends</span>
                                        <span class="availability-chip">Evenings</span>
                                    </div>
                                </div>
                                <button class="btn-primary px-6 py-3 rounded-lg font-semibold">
                                    Join Group
                                </button>
                            </div>

                            <p class="text-gray-700 mb-6 text-lg leading-relaxed">
                                Explore beautiful hiking trails around the Bay Area. All skill levels welcome!
                                We organize weekly hikes to discover hidden gems and enjoy nature together.
                                Our community focuses on safety, fun, and environmental respect.
                            </p>

                            <!-- Upcoming Events -->
                            <div class="mb-6">
                                <h3 class="text-xl font-semibold mb-4">Upcoming Events</h3>
                                <div class="space-y-4">
                                    <div class="border border-muted rounded-lg p-4">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h4 class="font-semibold text-lg">Mission Peak Hike</h4>
                                                <p class="text-gray-600">Saturday, March 23 • 8:00 AM</p>
                                                <p class="text-gray-700 mt-2">Challenge yourself with this popular Bay Area hike!</p>
                                            </div>
                                            <button class="btn-secondary px-4 py-2 rounded-lg">
                                                Join Event
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Activity -->
                            <div>
                                <h3 class="text-xl font-semibold mb-4">Recent Activity</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center space-x-3">
                                        <img src="https://randomuser.me/api/portraits/women/44.jpg" class="w-10 h-10 rounded-full">
                                        <div>
                                            <p class="text-sm"><span class="font-medium">Sarah</span> joined the group</p>
                                            <p class="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-10 h-10 rounded-full">
                                        <div>
                                            <p class="text-sm"><span class="font-medium">Mike</span> posted photos from last weekend's hike</p>
                                            <p class="text-xs text-gray-500">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            <!-- Members -->
                            <div class="bg-light rounded-lg p-4">
                                <h3 class="font-semibold mb-3">Members (24)</h3>
                                <div class="space-y-3">
                                    <div class="flex items-center space-x-3">
                                        <img src="https://randomuser.me/api/portraits/men/12.jpg" class="w-8 h-8 rounded-full">
                                        <div>
                                            <p class="text-sm font-medium">Alex Chen</p>
                                            <p class="text-xs text-gray-500">Organizer</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <img src="https://randomuser.me/api/portraits/women/44.jpg" class="w-8 h-8 rounded-full">
                                        <div>
                                            <p class="text-sm font-medium">Sarah Johnson</p>
                                            <p class="text-xs text-gray-500">Member</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-8 h-8 rounded-full">
                                        <div>
                                            <p class="text-sm font-medium">Mike Davis</p>
                                            <p class="text-xs text-gray-500">Member</p>
                                        </div>
                                    </div>
                                </div>
                                <button class="text-primary text-sm font-medium mt-3">View all members</button>
                            </div>

                            <!-- Group Info -->
                            <div class="bg-light rounded-lg p-4">
                                <h3 class="font-semibold mb-3">Group Info</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Created</span>
                                        <span>Jan 2024</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Location</span>
                                        <span>San Francisco Bay Area</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Privacy</span>
                                        <span>Public</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Chat Preview -->
                            <div class="bg-light rounded-lg p-4">
                                <h3 class="font-semibold mb-3">Group Chat</h3>
                                <div class="space-y-2">
                                    <div class="text-sm">
                                        <span class="font-medium">Alex:</span> Looking forward to this weekend!
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Sarah:</span> Same here! Weather looks perfect.
                                    </div>
                                </div>
                                <button class="btn-secondary w-full mt-3 py-2 rounded-lg text-sm">
                                    Open Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Slot Modal -->
        <div id="addSlotModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Add Availability Slot</h3>
                    <button id="closeSlotModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="addSlotForm" class="space-y-4">
                    <div>
                        <label for="slotDay" class="block text-sm font-medium text-gray-700 mb-1">Day of the week</label>
                        <select id="slotDay" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" required>
                            <option value="">Select a day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="slotStartTime" class="block text-sm font-medium text-gray-700 mb-1">Start time</label>
                            <input type="time" id="slotStartTime" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" required>
                        </div>
                        <div>
                            <label for="slotEndTime" class="block text-sm font-medium text-gray-700 mb-1">End time</label>
                            <input type="time" id="slotEndTime" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" required>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg">
                            Add Slot
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Forgot Password Modal -->
        <div id="forgotPasswordModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Reset your password</h3>
                    <button id="closeForgotModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-6">Enter your email and we'll send you a link to reset your password.</p>
                
                <form id="forgotPasswordForm">
                    <div class="mb-4">
                        <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="resetEmail" class="w-full p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="you@example.com" required>
                    </div>
                    
                    <button type="submit" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Profile Setup -->
        <div id="profileSetup" class="hidden min-h-screen p-4 md:p-8 bg-[#F5F7FA]">
            <div class="max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
                <div id="main-content" class="lg:col-span-1">
                <!-- Progress Bar -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-bold">Set up your profile</h2>
                        <button class="text-primary font-medium">Skip for now</button>
                    </div>
                    <div class="progress-bar w-full">
                        <div id="setupProgress" class="progress-fill w-1/3"></div>
                    </div>
                    <div class="flex justify-between mt-1">
                        <span class="text-sm font-medium text-primary">Interests</span>
                        <span class="text-sm text-gray-500">Availability</span>
                        <span class="text-sm text-gray-500">Location</span>
                    </div>
                </div>
                
                <!-- Step 1: Interests -->
                <div id="step1" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">What are your interests?</h3>
                        <p class="text-gray-600">Select activities you enjoy to find like-minded people</p>
                    </div>
                    
                    <div class="relative mb-4">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                        <input type="text" id="interestSearch" class="w-full pl-10 p-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary" placeholder="Search interests...">
                    </div>
                    
                    <div id="interestsContainer" class="flex flex-wrap gap-2">
                        <div class="chip cursor-pointer">
                            <i class="fas fa-hiking mr-2"></i> Hiking
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-book mr-2"></i> Reading
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-utensils mr-2"></i> Cooking
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-music mr-2"></i> Music
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-paint-brush mr-2"></i> Painting
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-basketball-ball mr-2"></i> Basketball
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-gamepad mr-2"></i> Gaming
                        </div>
                        <div class="chip cursor-pointer">
                            <i class="fas fa-film mr-2"></i> Movies
                        </div>
                    </div>
                    
                    <div class="pt-6">
                        <button id="nextToAvailability" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg">
                            Next: Availability
                        </button>
                    </div>
                </div>
                
                <!-- Step 2: Availability -->
                <div id="step2" class="hidden space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">When are you available?</h3>
                        <p class="text-gray-600">Set your weekly availability for meetups</p>
                    </div>

                    <div class="bg-white rounded-xl p-4 card">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-medium">Your availability slots</h4>
                            <button id="addSlotBtn" class="text-primary font-medium flex items-center">
                                <i class="fas fa-plus mr-1"></i> Add Slot
                            </button>
                        </div>

                        <div id="slotsContainer" class="space-y-3">
                            <div class="availability-slot flex items-center justify-between bg-light p-3 rounded-lg">
                                <div>
                                    <span class="font-medium">Monday</span>
                                    <span class="text-gray-600 ml-2">18:00 - 20:00</span>
                                </div>
                                <button class="delete-slot text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>

                            <div class="availability-slot flex items-center justify-between bg-light p-3 rounded-lg">
                                <div>
                                    <span class="font-medium">Saturday</span>
                                    <span class="text-gray-600 ml-2">10:00 - 14:00</span>
                                </div>
                                <button class="delete-slot text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div id="emptySlots" class="hidden text-center py-8">
                            <i class="fas fa-calendar-plus text-gray-300 text-3xl mb-3"></i>
                            <p class="text-gray-500">No availability slots yet. Add your first slot!</p>
                        </div>
                    </div>
                    
                    <div class="pt-6 flex space-x-4">
                        <button id="backToInterests" class="btn-secondary flex-1 py-3 px-4 font-semibold rounded-lg">
                            Back
                        </button>
                        <button id="nextToLocation" class="btn-primary flex-1 py-3 px-4 font-semibold text-white rounded-lg">
                            Next: Location
                        </button>
                    </div>
                </div>
                
                <!-- Step 3: Location -->
                <div id="step3" class="hidden space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Set your location</h3>
                        <p class="text-gray-600">Help us find people and groups near you</p>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 card">
                        <div class="flex items-center mb-4">
                            <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                            <span>Current Location: <span id="currentLocation" class="font-medium">San Francisco, CA</span></span>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex justify-between mb-2">
                                <label class="text-sm font-medium text-gray-700">Search Radius</label>
                                <span id="radiusValue" class="text-sm font-medium">5 km</span>
                            </div>
                            <input type="range" id="radiusSlider" min="1" max="50" value="5" class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer">
                        </div>
                        
                        <div class="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <p class="text-gray-500">Map Preview</p>
                        </div>
                        
                        <div class="mt-4">
                            <button class="btn-secondary w-full py-3 px-4 font-semibold rounded-lg flex items-center justify-center">
                                <i class="fas fa-location-arrow mr-2"></i> Use Current Location
                            </button>
                        </div>
                    </div>
                    
                    <div class="pt-6 flex space-x-4">
                        <button id="backToAvailability" class="btn-secondary flex-1 py-3 px-4 font-semibold rounded-lg">
                            Back
                        </button>
                        <button id="saveProfile" class="btn-primary flex-1 py-3 px-4 font-semibold text-white rounded-lg">
                            Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- App Shell -->
        <div id="appShell" class="hidden flex flex-col min-h-screen">
            <!-- Header -->
            <header class="bg-white shadow-sm py-3 px-4">
                <div class="max-w-6xl mx-auto flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-users text-white"></i>
                        </div>
                        <h1 class="text-xl font-bold">HobbyConnect</h1>
                    </div>
                    
                    <div class="hidden md:block flex-1 mx-8">
                        <div class="relative max-w-md">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            <input type="text" placeholder="Search groups or activities..." class="w-full pl-10 p-2 border border-muted rounded-lg focus:ring-2 focus:ring-primary">
                        </div>
                    </div>
                    
                    <div class="flex items-center">
                        <button class="md:hidden text-gray-500 mr-3">
                            <i class="fas fa-search text-xl"></i>
                        </button>
                        <div class="relative">
                            <button id="profileDropdown" class="w-10 h-10 rounded-full bg-light flex items-center justify-center">
                                <i class="fas fa-user text-gray-700"></i>
                            </button>
                            <div id="dropdownMenu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                <a href="#" id="devToolsBtn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dev Tools</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <!-- Tab Navigation -->
            <nav class="bg-white border-t border-muted">
                <div class="max-w-6xl mx-auto">
                    <div class="flex justify-around">
                        <a href="#" class="tab-active py-4 px-2 text-center flex flex-col items-center">
                            <i class="fas fa-home text-xl mb-1"></i>
                            <span class="text-xs">Home</span>
                        </a>
                        <a href="#" class="py-4 px-2 text-center flex flex-col items-center text-gray-500">
                            <i class="fas fa-plus-circle text-xl mb-1"></i>
                            <span class="text-xs">Create</span>
                        </a>
                        <a href="#" class="py-4 px-2 text-center flex flex-col items-center text-gray-500">
                            <i class="fas fa-comments text-xl mb-1"></i>
                            <span class="text-xs">Messages</span>
                        </a>
                        <a href="#" class="py-4 px-2 text-center flex flex-col items-center text-gray-500">
                            <i class="fas fa-user text-xl mb-1"></i>
                            <span class="text-xs">Profile</span>
                        </a>
                    </div>
                </div>
            </nav>
            
            <!-- Main Content -->
            <main class="flex-grow bg-light">
                <!-- Discovery Section -->
                <div id="discoverySection" class="max-w-6xl mx-auto lg:grid lg:grid-cols-3 lg:gap-6 h-full">
                    <!-- Left Sidebar - Filters & Quick Actions -->
                    <div class="hidden lg:block bg-white p-6 shadow-sm">
                        <div class="space-y-6">
                            <!-- Quick Create -->
                            <div>
                                <h3 class="font-semibold mb-3">Quick Actions</h3>
                                <button id="createGroupBtn" class="btn-primary w-full py-3 px-4 font-semibold text-white rounded-lg mb-3">
                                    <i class="fas fa-plus mr-2"></i> Create Group
                                </button>
                                <button id="createEventBtn" class="btn-secondary w-full py-3 px-4 font-semibold rounded-lg">
                                    <i class="fas fa-calendar-plus mr-2"></i> Create Event
                                </button>
                            </div>

                            <!-- Filters -->
                            <div>
                                <h3 class="font-semibold mb-3">Filters</h3>

                                <!-- Interest Filter -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="chip cursor-pointer text-xs" data-filter="hiking">
                                            <i class="fas fa-hiking mr-1"></i> Hiking
                                        </span>
                                        <span class="chip cursor-pointer text-xs" data-filter="cooking">
                                            <i class="fas fa-utensils mr-1"></i> Cooking
                                        </span>
                                        <span class="chip cursor-pointer text-xs" data-filter="reading">
                                            <i class="fas fa-book mr-1"></i> Reading
                                        </span>
                                        <span class="chip cursor-pointer text-xs" data-filter="music">
                                            <i class="fas fa-music mr-1"></i> Music
                                        </span>
                                    </div>
                                </div>

                                <!-- Distance Filter -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                                    <select id="distanceFilter" class="w-full p-2 border border-muted rounded-lg text-sm">
                                        <option value="">Any distance</option>
                                        <option value="5">Within 5 km</option>
                                        <option value="10">Within 10 km</option>
                                        <option value="25">Within 25 km</option>
                                        <option value="50">Within 50 km</option>
                                    </select>
                                </div>

                                <!-- Time Filter -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">When</label>
                                    <select id="timeFilter" class="w-full p-2 border border-muted rounded-lg text-sm">
                                        <option value="">Anytime</option>
                                        <option value="today">Today</option>
                                        <option value="week">This week</option>
                                        <option value="month">This month</option>
                                        <option value="weekend">Weekends</option>
                                    </select>
                                </div>
                            </div>

                            <!-- My Groups -->
                            <div>
                                <h3 class="font-semibold mb-3">My Groups</h3>
                                <div class="space-y-2">
                                    <div class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                                            <i class="fas fa-hiking text-blue-600 text-xs"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium">Bay Area Hikers</p>
                                            <p class="text-xs text-gray-500">3 new messages</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                                            <i class="fas fa-utensils text-green-600 text-xs"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium">SF Foodies</p>
                                            <p class="text-xs text-gray-500">Event tomorrow</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Center Content - Feed/Map -->
                    <div class="lg:col-span-2 p-4 lg:p-6">
                        <!-- Header with View Toggle -->
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-2xl font-bold">Discover Groups & Events</h2>
                                <p class="text-gray-600">Find activities near you in San Francisco, CA</p>
                            </div>

                            <!-- View Toggle -->
                            <div class="bg-white rounded-lg p-1 border border-muted">
                                <button id="feedViewBtn" class="view-toggle active px-3 py-2 rounded-md text-sm font-medium">
                                    <i class="fas fa-list mr-1"></i> Feed
                                </button>
                                <button id="mapViewBtn" class="view-toggle px-3 py-2 rounded-md text-sm font-medium">
                                    <i class="fas fa-map mr-1"></i> Map
                                </button>
                            </div>
                        </div>

                        <!-- Feed View -->
                        <div id="feedView" class="space-y-4">
                            <!-- Group Card -->
                            <div class="group-card bg-white rounded-xl card p-6 cursor-pointer hover:shadow-lg transition-shadow" data-group-id="1">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center">
                                        <div class="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                                            <i class="fas fa-hiking text-blue-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold">Bay Area Hikers</h3>
                                            <p class="text-gray-500">24 members • 2.3 km away</p>
                                            <div class="flex items-center mt-1">
                                                <span class="availability-chip">Weekends</span>
                                                <span class="availability-chip ml-2">Evenings</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
                                        Join Group
                                    </button>
                                </div>

                                <p class="text-gray-700 mb-4">Explore beautiful hiking trails around the Bay Area. All skill levels welcome! We organize weekly hikes to discover hidden gems and enjoy nature together.</p>

                                <!-- Upcoming Event -->
                                <div class="bg-light rounded-lg p-4 mb-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h4 class="font-semibold text-primary">Next Event: Mission Peak Hike</h4>
                                            <p class="text-sm text-gray-600">Saturday, 8:00 AM • Mission Peak Regional Preserve</p>
                                        </div>
                                        <button class="btn-secondary px-3 py-1 text-sm rounded-lg">
                                            Join Event
                                        </button>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex -space-x-2">
                                        <img src="https://randomuser.me/api/portraits/women/44.jpg" class="w-8 h-8 rounded-full border-2 border-white">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" class="w-8 h-8 rounded-full border-2 border-white">
                                        <img src="https://randomuser.me/api/portraits/women/68.jpg" class="w-8 h-8 rounded-full border-2 border-white">
                                        <div class="w-8 h-8 rounded-full bg-light border-2 border-white flex items-center justify-center text-xs text-gray-500">+21</div>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button class="text-gray-400 hover:text-primary transition-colors">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                        <button class="text-gray-400 hover:text-primary transition-colors">
                                            <i class="fas fa-share"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Event Card -->
                            <div class="group-card bg-white rounded-xl card p-6 border-l-4 border-accent">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center">
                                        <div class="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center mr-4">
                                            <i class="fas fa-utensils text-green-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold">Italian Cooking Masterclass</h3>
                                            <p class="text-gray-500">Hosted by SF Foodies • 1.8 km away</p>
                                            <div class="flex items-center mt-1">
                                                <span class="availability-chip">Wednesday 7 PM</span>
                                                <span class="text-orange-600 font-medium ml-2 text-sm">4 spots left</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">
                                        Join Event
                                    </button>
                                </div>

                                <p class="text-gray-700 mb-4">Learn to make authentic Italian pasta and sauces from scratch with Chef Marco. Includes wine pairing and a complete dinner. All ingredients provided!</p>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-4">
                                        <span class="text-sm text-gray-600">
                                            <i class="fas fa-calendar mr-1"></i> Tomorrow 7:00 PM
                                        </span>
                                        <span class="text-sm text-gray-600">
                                            <i class="fas fa-dollar-sign mr-1"></i> $85 per person
                                        </span>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button class="text-gray-400 hover:text-primary transition-colors">
                                            <i class="fas fa-heart"></i>
                                        </button>
                                        <button class="text-gray-400 hover:text-primary transition-colors">
                                            <i class="fas fa-share"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Load More -->
                            <div class="text-center py-6">
                                <button class="btn-secondary px-6 py-3 rounded-lg font-semibold">
                                    Load More Groups
                                </button>
                            </div>
                        </div>

                        <!-- Map View -->
                        <div id="mapView" class="hidden">
                            <div class="bg-white rounded-xl card p-4 h-96 flex items-center justify-center">
                                <div class="text-center">
                                    <i class="fas fa-map-marked-alt text-gray-300 text-6xl mb-4"></i>
                                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
                                    <p class="text-gray-500">See groups and events on the map</p>
                                    <button class="btn-primary mt-4 px-4 py-2 rounded-lg">
                                        Load Map View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        <!-- Hello API Page (Dev Tools) -->
        <div id="helloApi" class="hidden min-h-screen p-4 md:p-8 bg-[#F5F7FA]">
            <div class="max-w-4xl mx-auto">
                <div class="mb-6">
                    <button id="backToApp" class="text-primary flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i> Back to App
                    </button>
                    <h2 class="text-2xl font-bold mt-4 mb-2">Developer Tools</h2>
                    <p class="text-gray-600">API status and debugging information</p>
                </div>
                
                <div class="bg-white rounded-xl card p-6">
                    <h3 class="text-xl font-semibold mb-4">API Status</h3>
                    
                    <div class="flex items-center mb-6">
                        <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>API is operational</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="border border-muted rounded-lg p-4">
                            <h4 class="font-medium mb-2">Last Ping</h4>
                            <div class="text-3xl font-bold text-primary">42ms</div>
                            <p class="text-sm text-gray-500 mt-1">Response time</p>
                        </div>
                        <div class="border border-muted rounded-lg p-4">
                            <h4 class="font-medium mb-2">Uptime</h4>
                            <div class="text-3xl font-bold text-primary">99.97%</div>
                            <p class="text-sm text-gray-500 mt-1">Last 30 days</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-medium mb-3">Test API Connection</h4>
                        <div class="flex space-x-3">
                            <button id="pingApi" class="btn-primary px-4 py-2 rounded-lg font-semibold">
                                Ping API
                            </button>
                            <button class="btn-secondary px-4 py-2 rounded-lg font-semibold">
                                View Docs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Toast Container -->
        <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-3"></div>
    </div>

    <script>
        // View Management
        const views = {
            landing: document.getElementById('landing'),
            signup: document.getElementById('signup'),
            emailVerification: document.getElementById('emailVerification'),
            login: document.getElementById('login'),
            profileSetup: document.getElementById('profileSetup'),
            appShell: document.getElementById('appShell'),
            helloApi: document.getElementById('helloApi')
        };
        
        // Show a specific view and hide others
        function showView(viewName) {
            Object.keys(views).forEach(key => {
                if (key === viewName) {
                    views[key].classList.remove('hidden');
                } else {
                    views[key].classList.add('hidden');
                }
            });
        }
        
        // Toast function
        function showToast(message, type = 'success') {
            const toastContainer = document.getElementById('toastContainer');
            
            const toast = document.createElement('div');
            toast.className = \`toast bg-white rounded-lg shadow-lg p-4 flex items-center border-l-4 \${
                type === 'success' ? 'border-primary' : 
                type === 'error' ? 'border-red-500' : 'border-gray-500'
            }\`;
            
            const icon = document.createElement('i');
            icon.className = \`mr-3 \${
                type === 'success' ? 'fas fa-check-circle text-primary' : 
                type === 'error' ? 'fas fa-exclamation-circle text-red-500' : 'fas fa-info-circle text-gray-500'
            }\`;
            
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
                toast.remove();
            }, 4300);
        }
        
        // Event Listeners
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
            showView('emailVerification');
            document.getElementById('userEmail').textContent = document.getElementById('email').value;
            showToast('Account created successfully! Please check your email.', 'success');
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
            showView('profileSetup');
            showToast('Successfully signed in!', 'success');
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
        
        // Profile Setup Navigation
        document.getElementById('nextToAvailability').addEventListener('click', () => {
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('setupProgress').style.width = '66%';
        });
        
        document.getElementById('backToInterests').addEventListener('click', () => {
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step1').classList.remove('hidden');
            document.getElementById('setupProgress').style.width = '33%';
        });
        
        document.getElementById('nextToLocation').addEventListener('click', () => {
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('setupProgress').style.width = '100%';
        });
        
        document.getElementById('backToAvailability').addEventListener('click', () => {
            document.getElementById('step3').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('setupProgress').style.width = '66%';
        });
        
        document.getElementById('saveProfile').addEventListener('click', () => {
            showView('appShell');
            showToast('Profile setup complete! Welcome to HobbyConnect', 'success');
        });
        
        // App Shell
        document.getElementById('profileDropdown').addEventListener('click', () => {
            const dropdown = document.getElementById('dropdownMenu');
            dropdown.classList.toggle('hidden');
        });
        
        document.getElementById('devToolsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            showView('helloApi');
        });
        
        document.getElementById('backToApp').addEventListener('click', () => {
            showView('appShell');
        });
        
        document.getElementById('pingApi').addEventListener('click', () => {
            showToast('API ping successful. Response time: 42ms', 'success');
        });
        
        // Chip Selection
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
        });

        // Slot Management
        let availabilitySlots = [
            { day: 'Monday', startTime: '18:00', endTime: '20:00' },
            { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
        ];

        function renderSlots() {
            const slotsContainer = document.getElementById('slotsContainer');
            const emptySlots = document.getElementById('emptySlots');

            if (availabilitySlots.length === 0) {
                slotsContainer.classList.add('hidden');
                emptySlots.classList.remove('hidden');
            } else {
                slotsContainer.classList.remove('hidden');
                emptySlots.classList.add('hidden');

                slotsContainer.innerHTML = '';

                availabilitySlots.forEach((slot, index) => {
                    const slotDiv = document.createElement('div');
                    slotDiv.className = 'availability-slot flex items-center justify-between bg-light p-3 rounded-lg';
                    slotDiv.innerHTML = \`
                        <div>
                            <span class="font-medium">\${slot.day}</span>
                            <span class="text-gray-600 ml-2">\${slot.startTime} - \${slot.endTime}</span>
                        </div>
                        <button class="delete-slot text-gray-400 hover:text-gray-600" data-index="\${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    \`;
                    slotsContainer.appendChild(slotDiv);
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-slot').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        availabilitySlots.splice(index, 1);
                        renderSlots();
                        showToast('Availability slot removed', 'success');
                    });
                });
            }
        }

        // Add Slot Modal
        document.getElementById('addSlotBtn').addEventListener('click', () => {
            document.getElementById('addSlotModal').classList.remove('hidden');
        });

        document.getElementById('closeSlotModal').addEventListener('click', () => {
            document.getElementById('addSlotModal').classList.add('hidden');
            document.getElementById('addSlotForm').reset();
        });

        // Handle slot form submission
        document.getElementById('addSlotForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const day = document.getElementById('slotDay').value;
            const startTime = document.getElementById('slotStartTime').value;
            const endTime = document.getElementById('slotEndTime').value;

            // Validate times
            if (startTime >= endTime) {
                showToast('End time must be after start time', 'error');
                return;
            }

            // Check for conflicts
            const conflict = availabilitySlots.find(slot =>
                slot.day === day && (
                    (startTime >= slot.startTime && startTime < slot.endTime) ||
                    (endTime > slot.startTime && endTime <= slot.endTime) ||
                    (startTime <= slot.startTime && endTime >= slot.endTime)
                )
            );

            if (conflict) {
                showToast('This time slot conflicts with an existing slot', 'error');
                return;
            }

            // Add the new slot
            availabilitySlots.push({ day, startTime, endTime });

            // Sort slots by day order
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            availabilitySlots.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

            renderSlots();
            document.getElementById('addSlotModal').classList.add('hidden');
            document.getElementById('addSlotForm').reset();
            showToast('Availability slot added successfully', 'success');
        });
        
        // Password Strength
        const passwordInput = document.getElementById('password');
        passwordInput.addEventListener('input', () => {
            const strengthBar = document.getElementById('passwordStrength');
            const tips = document.getElementById('passwordTips');
            const password = passwordInput.value;
            
            let strength = 0;
            if (password.length > 7) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/\\d/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            strengthBar.style.width = \`\${strength}%\`;
            
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
        
        // Password Match Validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        confirmPasswordInput.addEventListener('input', () => {
            const password = passwordInput.value;
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
        
        // Radius Slider
        const radiusSlider = document.getElementById('radiusSlider');
        const radiusValue = document.getElementById('radiusValue');
        
        radiusSlider.addEventListener('input', () => {
            radiusValue.textContent = \`\${radiusSlider.value} km\`;
        });
        
        // Close modal on outside click
        document.getElementById('addSlotModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('addSlotModal')) {
                document.getElementById('addSlotModal').classList.add('hidden');
                document.getElementById('addSlotForm').reset();
            }
        });

        // Discovery Features

        // View Toggle
        document.getElementById('feedViewBtn').addEventListener('click', () => {
            document.getElementById('feedViewBtn').classList.add('active');
            document.getElementById('mapViewBtn').classList.remove('active');
            document.getElementById('feedView').classList.remove('hidden');
            document.getElementById('mapView').classList.add('hidden');
        });

        document.getElementById('mapViewBtn').addEventListener('click', () => {
            document.getElementById('mapViewBtn').classList.add('active');
            document.getElementById('feedViewBtn').classList.remove('active');
            document.getElementById('mapView').classList.remove('hidden');
            document.getElementById('feedView').classList.add('hidden');
        });

        // Filter functionality
        document.querySelectorAll('.chip[data-filter]').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
                // Apply filter logic here
                const selectedFilters = Array.from(document.querySelectorAll('.chip[data-filter].selected'))
                    .map(chip => chip.getAttribute('data-filter'));
                console.log('Active filters:', selectedFilters);
                showToast(\`Filter updated: \${selectedFilters.join(', ') || 'All'}\`, 'success');
            });
        });

        // Distance and time filters
        document.getElementById('distanceFilter').addEventListener('change', (e) => {
            const distance = e.target.value;
            console.log('Distance filter:', distance);
            if (distance) {
                showToast(\`Showing groups within \${distance} km\`, 'success');
            }
        });

        document.getElementById('timeFilter').addEventListener('change', (e) => {
            const time = e.target.value;
            console.log('Time filter:', time);
            if (time) {
                showToast(\`Showing events: \${time}\`, 'success');
            }
        });

        // Create Group Modal
        document.getElementById('createGroupBtn').addEventListener('click', () => {
            document.getElementById('createGroupModal').classList.remove('hidden');
        });

        document.getElementById('closeCreateGroupModal').addEventListener('click', () => {
            document.getElementById('createGroupModal').classList.add('hidden');
            document.getElementById('createGroupForm').reset();
        });

        document.getElementById('createGroupModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('createGroupModal')) {
                document.getElementById('createGroupModal').classList.add('hidden');
                document.getElementById('createGroupForm').reset();
            }
        });

        // Create Group Form
        document.getElementById('createGroupForm').addEventListener('submit', (e) => {
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

            // Close modal and show success
            document.getElementById('createGroupModal').classList.add('hidden');
            document.getElementById('createGroupForm').reset();
            showToast('Group created successfully! Pending approval.', 'success');
        });

        // Group Detail Modal
        document.querySelectorAll('.group-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on buttons
                if (e.target.closest('button')) return;

                document.getElementById('groupDetailModal').classList.remove('hidden');
            });
        });

        document.getElementById('closeGroupDetailModal').addEventListener('click', () => {
            document.getElementById('groupDetailModal').classList.add('hidden');
        });

        document.getElementById('groupDetailModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('groupDetailModal')) {
                document.getElementById('groupDetailModal').classList.add('hidden');
            }
        });

        // Create Event Button (placeholder)
        document.getElementById('createEventBtn').addEventListener('click', () => {
            showToast('Create Event feature coming soon!', 'success');
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Set up location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(() => {
                    document.getElementById('currentLocation').textContent = 'San Francisco, CA';
                }, () => {
                    document.getElementById('currentLocation').textContent = 'Location not available';
                });
            }

            // Initialize slots
            renderSlots();
        });
    </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HobbyConnect server running on http://localhost:${PORT}`);
});
