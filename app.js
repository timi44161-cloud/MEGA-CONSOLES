<script>
        // User data storage (in real app, this would be in database)
        let currentUser = null;
        let userGames = [];
        let userAchievements = [];
        let userStats = {
            gamesPlayed: 0,
            hoursPlayed: 0,
            achievementsUnlocked: 0,
            friendsOnline: 0
        };

        // Sample games database
        const gameDatabase = {
            action: [
                {name: "God of War", icon: "⚔️", progress: 67, lastPlayed: "2 hours ago", trophies: 15},
                {name: "Call of Duty", icon: "🔫", progress: 89, lastPlayed: "1 day ago", trophies: 8}
            ],
            racing: [
                {name: "Gran Turismo", icon: "🏎️", progress: 45, lastPlayed: "3 hours ago", trophies: 12},
                {name: "Need for Speed", icon: "🚗", progress: 78, lastPlayed: "5 days ago", trophies: 6}
            ],
            sports: [
                {name: "FIFA 24", icon: "⚽", progress: 92, lastPlayed: "1 hour ago", trophies: 20},
                {name: "NBA 2K24", icon: "🏀", progress: 34, lastPlayed: "1 week ago", trophies: 4}
            ]
             
        };

        // Login functionality
        function completeLogin() {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!username || !email || !password) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }

            currentUser = {
                username: username,
                email: email,
                isFirstTime: true
            };

            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('setupScreen').classList.remove('hidden');
        }
        // Function to handle login
function completeLogin() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe")?.checked || false;;

    if (!username || !email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    // Save to localStorage if "Remember Me" is checked
    if (rememberMe) {
        localStorage.setItem("savedUsername", username);
        localStorage.setItem("savedEmail", email);
    } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedEmail");
    }
    currentUser = {
        username: username,
        email: email,
        isFirstTime: true
    };

    // Hide login, show setup
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("setupScreen").classList.remove("hidden");
}

// Function to auto-fill saved login
window.onload = function() {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedUsername && savedEmail) {
        document.getElementById("username").value = savedUsername;
        document.getElementById("email").value = savedEmail;
        document.getElementById("rememberMe").checked = true;
    }
};


        // Game selection for new users
        let selectedGenres = [];
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.game-option').forEach(option => {
                option.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    const genre = this.dataset.game;
                    if (selectedGenres.includes(genre)) {
                        selectedGenres = selectedGenres.filter(g => g !== genre);
                    } else {
                        selectedGenres.push(genre);
                    }
                });
            });
        });

        function completeSetup() {
            if (selectedGenres.length === 0) {
                showNotification('Please select at least one game genre!', 'error');
                return;
            }

            // Generate personalized game library
            userGames = [];
            selectedGenres.forEach(genre => {
                if (gameDatabase[genre]) {
                    userGames.push(...gameDatabase[genre]);
                }
            });

            // Generate initial stats
            userStats = {
                gamesPlayed: userGames.length,
                hoursPlayed: Math.floor(Math.random() * 300) + 50,
                achievementsUnlocked: userGames.reduce((total, game) => total + game.trophies, 0),
                friendsOnline: Math.floor(Math.random() * 15) + 3
            };

            document.getElementById('setupScreen').classList.add('hidden');
            document.getElementById('mainInterface').style.display = 'block';
            
            initializeInterface();
            showNotification('Welcome to Mega Consoles! 🎮', 'success');
        }

        function initializeInterface() {
            // Set user info
            document.getElementById('displayUsername').textContent = currentUser.username;
            document.getElementById('welcomeUsername').textContent = currentUser.username;
            document.getElementById('trophyCount').textContent = userStats.achievementsUnlocked;
            
            // Update stats
            document.getElementById('gamesPlayed').textContent = userStats.gamesPlayed;
            document.getElementById('hoursPlayed').textContent = userStats.hoursPlayed;
            document.getElementById('achievementsUnlocked').textContent = userStats.achievementsUnlocked;
            document.getElementById('friendsOnline').textContent = userStats.friendsOnline;
            
            // Populate all sections
            populateRecentGames();
            populateAllGames();
            populateAchievements();
            populateSocialContent();
            updateTime();
            setInterval(updateTime, 1000);
            
            // Make sure home section is active by default
            showSection('home');
        }

        function populateRecentGames() {
            const container = document.getElementById('recentGames');
            const recentGames = userGames.slice(0, 6); // Show first 6 games
            
            container.innerHTML = recentGames.map(game => `
                <div class="game-card" oncontextmenu="showContextMenu(event, '${game.name}')">
                    <div class="game-icon">${game.icon}</div>
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <small>Last played: ${game.lastPlayed}</small>
                        <div class="game-progress">
                            <div class="progress-bar" style="width: ${game.progress}%"></div>
                        </div>
                        <small>${game.progress}% complete • ${game.trophies} trophies</small>
                    </div>
                </div>
            `).join('');
        }

        function populateAllGames() {
            const container = document.getElementById('allGames');
            container.innerHTML = userGames.map(game => `
                <div class="game-card" oncontextmenu="showContextMenu(event, '${game.name}')">
                    <div class="game-icon">${game.icon}</div>
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <small>Last played: ${game.lastPlayed}</small>
                        <div class="game-progress">
                            <div class="progress-bar" style="width: ${game.progress}%"></div>
                        </div>
                        <small>${game.progress}% complete • ${game.trophies} trophies</small>
                    </div>
                </div>
            `).join('');
        }

        function populateAchievements() {
            const container = document.getElementById('achievementsList');
            const achievements = [
                {name: "First Steps", desc: "Completed your first game", icon: "👶", rarity: "Common"},
                {name: "Speed Runner", desc: "Finished a game in under 5 hours", icon: "⚡", rarity: "Rare"},
                {name: "Trophy Hunter", desc: "Unlocked 50 trophies", icon: "🏆", rarity: "Epic"},
                {name: "Social Gamer", desc: "Played with 10 friends", icon: "👥", rarity: "Uncommon"}
            ];

            container.innerHTML = achievements.map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div>
                        <h4>${achievement.name}</h4>
                        <p>${achievement.desc}</p>
                        <small style="color: #ff6b35;">${achievement.rarity}</small>
                    </div>
                </div>
            `).join('');

            // Also populate recent achievements on home
            document.getElementById('recentAchievements').innerHTML = achievements.slice(0, 3).map(achievement => `
                <div class="achievement-item">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div>
                        <h4>${achievement.name}</h4>
                        <p>${achievement.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        // Navigation
        function showSection(section) {
            // Hide all content sections
            document.querySelectorAll('[id$="-content"]').forEach(el => {
                el.classList.add('hidden');
            });
            
            // Show selected section
            document.getElementById(section + '-content').classList.remove('hidden');
            
            // Update navigation - find the clicked nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to the correct nav item
            const activeNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.toLowerCase().includes(section.toLowerCase()) ||
                (section === 'home' && item.textContent.includes('Home')) ||
                (section === 'games' && item.textContent.includes('Your Games')) ||
                (section === 'achievements' && item.textContent.includes('Achievements')) ||
                (section === 'store' && item.textContent.includes('Mega Store')) ||
                (section === 'creator' && item.textContent.includes('Creator')) ||
                (section === 'social' && item.textContent.includes('Social')) ||
                (section === 'settings' && item.textContent.includes('Customize'))
            );
            
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
        }

        // Context menu for games
        function showContextMenu(event, gameName) {
            event.preventDefault();
            const contextMenu = document.getElementById('contextMenu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = event.pageX + 'px';
            contextMenu.style.top = event.pageY + 'px';
            contextMenu.dataset.gameName = gameName;
        }

        // Hide context menu when clicking elsewhere
        document.addEventListener('click', function() {
            document.getElementById('contextMenu').style.display = 'none';
        });

        // Context menu actions
        function updateGame() {
            const gameName = document.getElementById('contextMenu').dataset.gameName;
            showNotification(`Updating ${gameName}...`, 'info');
        }

        function deleteGame() {
            const gameName = document.getElementById('contextMenu').dataset.gameName;
            if (confirm(`Are you sure you want to delete ${gameName}?`)) {
                showNotification(`${gameName} deleted successfully`, 'success');
                // Remove from userGames array and refresh display
                userGames = userGames.filter(game => game.name !== gameName);
                populateRecentGames();
                populateAllGames();
            }
        }

        function sendToFriend() {
            const gameName = document.getElementById('contextMenu').dataset.gameName;
            const friendName = prompt('Enter friend\'s username:');
            if (friendName) {
                showNotification(`${gameName} sent to ${friendName}! They can download it now.`, 'success');
            }
        }

        function modifyGame() {
            const gameName = document.getElementById('contextMenu').dataset.gameName;
            showNotification(`Opening Mega Store for ${gameName} mods...`, 'info');
            // Simulate opening mod store
            setTimeout(() => {
                showSection('store');
                document.getElementById('store-content').innerHTML = `
                    <h2>🛒 Mega Store - ${gameName} Mods</h2>
                    <div class="games-grid">
                        <div class="game-card">
                            <div class="game-icon">🎨</div>
                            <div class="game-info">
                                <h3>Graphics Enhancement Mod</h3>
                                <p>Ultra HD textures and lighting</p>
                                <button class="btn" onclick="downloadMod('Graphics Enhancement')">Download - Free</button>
                            </div>
                        </div>
                        <div class="game-card">
                            <div class="game-icon">🎵</div>
                            <div class="game-info">
                                <h3>Sound Pack Mod</h3>
                                <p>Professional audio overhaul</p>
                                <button class="btn" onclick="downloadMod('Sound Pack')">Download - $2</button>
                            </div>
                        </div>
                        <div class="game-card">
                            <div class="game-icon">🏎️</div>
                            <div class="game-info">
                                <h3>Performance Boost</h3>
                                <p>Optimize for 60+ FPS</p>
                                <button class="btn" onclick="downloadMod('Performance Boost')">Download - $1</button>
                            </div>
                        </div>
                    </div>
                `;
            }, 1000);
        }
        

        function downloadMod(modName) {
            showNotification(`${modName} mod downloaded and installed!`, 'success');
        }
        function goBackToStore() {
    document.getElementById("modsSection").classList.add("hidden");
    document.getElementById("store-content").classList.remove("hidden");
}
       
        // Settings functionality
        function toggleSetting(element) {
            element.classList.toggle('active');
            const settingName = element.parentElement.querySelector('span').textContent;
            const isActive = element.classList.contains('active');
            showNotification(`${settingName} ${isActive ? 'enabled' : 'disabled'}`, 'info');
        }

        // Time display
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        }

        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification show ${type}`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Logout functionality
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                currentUser = null;
                userGames = [];
                userAchievements = [];
                document.getElementById('mainInterface').style.display = 'none';
                document.getElementById('loginScreen').classList.remove('hidden');
                document.getElementById('setupScreen').classList.add('hidden');
                
                // Reset form
                document.getElementById('username').value = '';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                
                showNotification('Logged out successfully', 'success');
            }
        }

        // Initialize first section as active
        document.addEventListener('DOMContentLoaded', function() {
            // Set home as default active section
            document.getElementById('home-content').classList.remove('hidden');
        });

        // Simulate some dynamic features
        setInterval(() => {
            if (currentUser && Math.random() < 0.1) { // 10% chance every interval
                const messages = [
                    'Friend just came online!',
                    'New game update available',
                    'Achievement unlocked by friend!',
                    'Friend invites you to party,check social hub'
                    
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showNotification(randomMessage, 'info');
            }
        }, 30000); // Check every 30 seconds

        // Easter egg: Konami code
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                showNotification('🎉 MEGA CHEAT ACTIVATED! Unlimited trophies!', 'success');
                document.getElementById('trophyCount').textContent = '999';
                document.getElementById('achievementsUnlocked').textContent = '999';
                konamiCode = [];
            }
        });

        // Auto-save user progress (simulation)
        setInterval(() => {
            if (currentUser) {
                console.log('Auto-saving user progress...', {
                    user: currentUser.username,
                    games: userGames.length,
                    trophies: userStats.achievementsUnlocked
                });
            }
        }, 60000); // Save every minute
        // Open TV & Movies section
function openStreaming() {
    // You can make this go to a custom screen or just alert for now
    alert("📺 TV & Movies section coming soon! Opening streaming hub...");
    
    // Example: If you want it to load an iframe or change section
    // document.getElementById("creator-content").classList.add("hidden");
    // document.getElementById("streaming-content").classList.remove("hidden");
}

// Open Mega TV creator interface
function openMegaTV() {
    // Hide other creator options
    document.querySelector(".creator-options").style.display = "none";

    // Show MegaTV login interface
    document.getElementById("megatv-interface").classList.remove("hidden");
    document.getElementById("megatvLogin").classList.remove("hidden");
    document.getElementById("megatv-dashboard").classList.add("hidden");
}

// Set up Mega TV after login
function setupMegaTV() {
    const creatorName = document.getElementById("creatorUsername").value.trim();
    const creatorBio = document.getElementById("creatorBio").value.trim();

    if (!creatorName) {
        alert("Please enter your creator name!");
        return;
    }

    // Save data (localStorage for now)
    localStorage.setItem("creatorName", creatorName);
    localStorage.setItem("creatorBio", creatorBio);
    localStorage.setItem("lastPosted", "Never");
    localStorage.setItem("followerCount", 0);
    localStorage.setItem("viewCount", 0);

    // Update dashboard display
    document.getElementById("creatorName").textContent = creatorName;
    document.getElementById("lastPosted").textContent = "Never";
    document.getElementById("followerCount").textContent = "0";
    document.getElementById("viewCount").textContent = "0";

    // Hide login, show dashboard
    document.getElementById("megatvLogin").classList.add("hidden");
    document.getElementById("megatv-dashboard").classList.remove("hidden");
}

// Load saved MegaTV data on refresh
window.addEventListener("load", function() {
    const savedName = localStorage.getItem("creatorName");
    const savedBio = localStorage.getItem("creatorBio");

    if (savedName) {
        document.getElementById("creatorName").textContent = savedName;
        document.getElementById("creatorBio").value = savedBio || "";
        document.getElementById("followerCount").textContent = localStorage.getItem("followerCount") || "0";
        document.getElementById("viewCount").textContent = localStorage.getItem("viewCount") || "0";
        document.getElementById("lastPosted").textContent = localStorage.getItem("lastPosted") || "Never";

        document.querySelector(".creator-options").style.display = "none";
        document.getElementById("megatv-interface").classList.remove("hidden");
        document.getElementById("megatvLogin").classList.add("hidden");
        document.getElementById("megatv-dashboard").classList.remove("hidden");
    }
});
function goBackFromMegaTV() {
   document.querySelector(".creator-options").style.display = "grid";
    document.getElementById("megatv-interface").classList.add("hidden");
}

// Initial storage values
let usedStorage = 247;   // GB
let totalStorage = 1024; // GB

// Function to update storage UI
function updateStorageUI() {
    const percent = ((usedStorage / totalStorage) * 100).toFixed(1);
    document.getElementById("storageBar").style.width = percent + "%";
    document.getElementById("storageText").textContent =
        `${usedStorage} GB / ${totalStorage} GB used (${percent}%)`;
}

// Function to "buy" storage
function buyStorage(extraGB) {
    totalStorage += extraGB;
    updateStorageUI();
    alert(`🎉 You successfully bought +${extraGB} GB!`);
}

// Run once on load
document.addEventListener("DOMContentLoaded", updateStorageUI);

// Function to switch settings tab
function showSetting(setting) {
    // Hide all settings contents
    document.querySelectorAll(".settings-content").forEach(el => el.classList.add("hidden"));

    // Remove highlight from all tabs
    document.querySelectorAll(".settings-tab").forEach(tab => tab.classList.remove("active"));

    // Show the selected setting
    document.getElementById("settings-" + setting).classList.remove("hidden");

    // Highlight the clicked tab
    event.target.classList.add("active");
}


// UNIVERSAL BACK BUTTON FUNCTIONALITY
        let navigationHistory = [];

        function showSection(section) {
            // Add current section to history before changing
            const currentSection = getCurrentSection();
            if (currentSection && currentSection !== section) {
                navigationHistory.push(currentSection);
            }

            // Hide all content sections
            document.querySelectorAll('[id$="-content"]').forEach(el => {
                el.classList.add('hidden');
            });
            
            // Show selected section
            document.getElementById(section + '-content').classList.remove('hidden');
            
            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                item.textContent.toLowerCase().includes(section.toLowerCase()) ||
                (section === 'home' && item.textContent.includes('Home')) ||
                (section === 'games' && item.textContent.includes('Your Games')) ||
                (section === 'achievements' && item.textContent.includes('Achievements')) ||
                (section === 'store' && item.textContent.includes('Mega Store')) ||
                (section === 'creator' && item.textContent.includes('Creator')) ||
                (section === 'social' && item.textContent.includes('Social')) ||
                (section === 'settings' && item.textContent.includes('Customize'))
            );
            
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

            // Show/hide back button
            updateBackButton();
        }

        function getCurrentSection() {
            const visibleSection = document.querySelector('[id$="-content"]:not(.hidden)');
            return visibleSection ? visibleSection.id.replace('-content', '') : null;
        }

        function updateBackButton() {
            const backBtn = document.getElementById('backButton');
            if (navigationHistory.length > 0) {
                backBtn.classList.remove('hidden');
            } else {
                backBtn.classList.add('hidden');
            }
        }

        function goBack() {
            if (navigationHistory.length > 0) {
                const previousSection = navigationHistory.pop();
                
                // Don't add to history when going back
                document.querySelectorAll('[id$="-content"]').forEach(el => {
                    el.classList.add('hidden');
                });
                
                document.getElementById(previousSection + '-content').classList.remove('hidden');
                
                // Update nav
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const activeNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
                    item.textContent.toLowerCase().includes(previousSection.toLowerCase()) ||
                    (previousSection === 'home' && item.textContent.includes('Home')) ||
                    (previousSection === 'games' && item.textContent.includes('Your Games')) ||
                    (previousSection === 'achievements' && item.textContent.includes('Achievements')) ||
                    (previousSection === 'store' && item.textContent.includes('Mega Store')) ||
                    (previousSection === 'creator' && item.textContent.includes('Creator')) ||
                    (previousSection === 'social' && item.textContent.includes('Social')) ||
                    (previousSection === 'settings' && item.textContent.includes('Customize'))
                );
                
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }

                updateBackButton();
                playSound('back');
            }
        }

        // SOUND SYSTEM
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        function playSound(type) {
            let frequency, duration;
            
            switch(type) {
                case 'click':
                    frequency = 800;
                    duration = 0.1;
                    break;
                case 'success':
                    frequency = 1000;
                    duration = 0.15;
                    break;
                case 'error':
                    frequency = 300;
                    duration = 0.2;
                    break;
                case 'back':
                    frequency = 600;
                    duration = 0.12;
                    break;
                default:
                    frequency = 500;
                    duration = 0.1;
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        }

        // Add sound to all buttons
        document.addEventListener('DOMContentLoaded', function() {
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn') || e.target.classList.contains('sound-btn')) {
                    playSound('click');
                }
            });
        });
        // SETTINGS FUNCTIONALITY
        function showSettingsTab(tab) {
            // Hide all settings content
            document.querySelectorAll('.settings-content').forEach(el => {
                el.classList.add('hidden');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById('settings-' + tab).classList.remove('hidden');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
            
            playSound('click');
        }

        function applyTheme(theme) {
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('active');

                option.style.border = '2px solid transparent';
            });
            
            event.target.classList.add('active');
            event.target.style.border = '2px solid #ff6b35';
            
            showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied!`, 'success');
            playSound('success');
        }
 // SOCIAL HUB ENHANCEMENTS
        let activeParty = null;
        let partyMembers = [];

        function createParty() {
            const partyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            activeParty = {
                code: partyCode,
                host: currentUser.username,
                members: [currentUser.username],
                createdAt: new Date()
            };
            
            showNotification(`Party created! Code: ${partyCode}`, 'success');
            updatePartyChatBox();
            playSound('success');
        }

        function joinParty() {
            const partyCode = prompt('Enter party code:');
            if (partyCode && partyCode.length === 6) {
                activeParty = {
                    code: partyCode,
                    host: 'Alex_Gamer23',
                    members: ['Alex_Gamer23', 'Sarah_Pro', currentUser.username]
                };
                showNotification(`Joined party ${partyCode}!`, 'success');
                updatePartyChatBox();
                playSound('success');
            } else if (partyCode) {
                showNotification('Invalid party code!', 'error');
                playSound('error');
            }
        }
        

        



    </script>
</body>
</html>