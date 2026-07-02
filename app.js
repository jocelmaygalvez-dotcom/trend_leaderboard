// ==========================================================
// !!! ENTER YOUR UNIQUE PROJECT API METRICS HERE !!!
// ==========================================================
const SUPABASE_URL = "https://ojoimyctafapulfzmovz.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb2lteWN0YWZhcHVsZnptb3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjgzMjEsImV4cCI6MjA5ODU0NDMyMX0.ObsNASNMdhwT35Gfp2MGXIEoQHI_GoblueHmtw3WjUs";

let supabase = null;

try {
    if (SUPABASE_URL !== "https://ojoimyctafapulfzmovz.supabase.co" && typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch(err) {
    console.warn("Database offline mode active.", err.message);
}

// Scaffolding typing prompts covering Senior High School Trends themes
const academicTiers = [
    {
        title: "TIER 1: BASIC CONCEPT",
        sentence: "Trends evolve constantly."
    },
    {
        title: "TIER 2: DURATION COMPONENT",
        sentence: "Fads die quickly while trends stay longer."
    },
    {
        title: "TIER 3: GLOBAL NETWORKS",
        sentence: "Globalization connects local cultures into vast interconnected networks."
    },
    {
        title: "TIER 4: 21ST CENTURY CRITICAL THINKING",
        sentence: "Critical thinking allows students to distinguish between short lived fads and enduring strategic trends."
    },
    {
        title: "TIER 5: STRATEGIC INTUITION",
        sentence: "Strategic analysis examines patterns systematically whereas intuitive thinking relies heavily on immediate gut feelings and personal perceptions."
    },
    {
        title: "TIER 6: MACROSCOPIC SYNTHESIS",
        sentence: "Twenty first century learners must dismantle informational silos and utilize network science to comprehend the macroscopic effects of global climate change."
    }
];

let currentLevelIdx = 0;
let timeRemaining = 15 * 60; // 15 Minutes Matrix Counter
let playerScore = 0;
let playerName = "Anonymous";
let gameInterval;

// Typing system state tracking parameters
let totalCharactersTyped = 0;
let incorrectStrokes = 0;
let levelStartTime = 0;

const promptContainer = document.getElementById('sentence-prompt');
const inputDeck = document.getElementById('typing-deck');
const badgeDisplay = document.getElementById('difficulty-badge');
const timerDisplay = document.getElementById('timer');
const levelCounter = document.getElementById('counter');
const scoreDisplay = document.getElementById('live-score');
const accuracyDisplay = document.getElementById('stat-accuracy');
const wpmDisplay = document.getElementById('stat-wpm');

function buildPromptNodes() {
    promptContainer.innerHTML = "";
    const targetText = academicTiers[currentLevelIdx].sentence;
    
    // Split text into trackable character blocks
    for(let i = 0; i < targetText.length; i++) {
        const span = document.createElement('span');
        span.className = 'char-node';
        if(i === 0) span.className = 'char-node current';
        span.innerText = targetText[i];
        promptContainer.appendChild(span);
    }
    inputDeck.value = "";
}

// Intercept inputs to run structural comparison arrays
function processTypingMetrics() {
    const targetText = academicTiers[currentLevelIdx].sentence;
    const currentInput = inputDeck.value;
    const spans = promptContainer.querySelectorAll('.char-node');
    
    let localErrors = 0;
    
    for(let i = 0; i < spans.length; i++) {
        const charSpan = spans[i];
        const inputChar = currentInput[i];
        
        // Remove tracking animation properties clean
        charSpan.classList.remove('correct', 'incorrect', 'current');
        
        if (inputChar == null) {
            if(i === currentInput.length) charSpan.classList.add('current');
        } else if (inputChar === charSpan.innerText) {
            charSpan.classList.add('correct');
        } else {
            charSpan.classList.add('incorrect');
            localErrors++;
        }
    }
    
    // Track bad strokes for performance validation calculations
    if(currentInput.length > totalCharactersTyped) {
        if(currentInput[currentInput.length - 1] !== targetText[currentInput.length - 1]) {
            incorrectStrokes++;
        }
    }
    totalCharactersTyped = currentInput.length;

    // Refresh telemetry readouts
    calculateLiveStats(currentInput.length, localErrors);

    // Turn checking vectors when sentence boundary is matched perfectly
    if (currentInput === targetText) {
        advanceTier();
    }
}

function calculateLiveStats(inputLength, errors) {
    if(inputLength === 0) return;
    
    // Determine mathematical correctness quotients
    const calculatedAccuracy = Math.max(0, Math.round(((inputLength - errors) / inputLength) * 100));
    accuracyDisplay.innerText = `${calculatedAccuracy}%`;

    // Determine words-per-minute through time offset analysis
    const timeElapsedMinutes = (Date.now() - levelStartTime) / 60000;
    if(timeElapsedMinutes > 0.02) {
        const liveWPM = Math.round((inputLength / 5) / timeElapsedMinutes);
        wpmDisplay.innerText = `${liveWPM} WPM`;
    }
}

function advanceTier() {
    // Generate reward mechanics based on tier scale
    const baseReward = (currentLevelIdx + 1) * 100;
    playerScore += baseReward;
    scoreDisplay.innerText = playerScore.toString().padStart(4, '0');

    currentLevelIdx++;
    
    if (currentLevelIdx >= academicTiers.length) {
        endGame(true);
    } else {
        // Load the next tier configuration safely
        badgeDisplay.innerText = academicTiers[currentLevelIdx].title;
        levelCounter.innerText = `${currentLevelIdx + 1}/6`;
        levelStartTime = Date.now();
        buildPromptNodes();
    }
}

function runClock() {
    if(timeRemaining <= 0) { endGame(false); return; }
    timeRemaining--;
    
    let mins = Math.floor(timeRemaining / 60); 
    let secs = timeRemaining % 60;
    timerDisplay.innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function validateAndStart() {
    const input = document.getElementById('username-field').value.trim();
    if(!input) { alert("Identity validation handle required."); return; }
    
    playerName = input;
    document.getElementById('display-name').innerText = playerName;
    document.getElementById('start-screen').style.display = 'none';
    
    // Unblock system input hooks
    inputDeck.disabled = false;
    inputDeck.focus();
    inputDeck.addEventListener('input', processTypingMetrics);
    
    levelStartTime = Date.now();
    buildPromptNodes();
    
    gameInterval = setInterval(runClock, 1000);
    fetchLeaderboard();
}

async function fetchLeaderboard() {
    const anchor = document.getElementById('leaderboard-anchor');
    if (!supabase) {
        anchor.innerHTML = "<li class='leaderboard-item system-msg' style='color:var(--warning);'>Local Core Sandbox (No DB Metrics)</li>";
        return;
    }
    try {
        const { data, error } = await supabase
            .from('trend_leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);

        if (error) throw error;

        anchor.innerHTML = "";
        if(data.length === 0) {
            anchor.innerHTML = "<li class='leaderboard-item system-msg'>Matrix records database empty.</li>";
            return;
        }
        
        data.forEach((row) => {
            const li = document.createElement('li');
            li.className = 'leaderboard-item';
            if(row.player_name === playerName && row.score === playerScore) {
                li.classList.add('current-user-row');
            }
            li.innerHTML = `
                <span>${row.player_name}</span> 
                <span>${row.wpm}</span> 
                <span>${row.accuracy}%</span> 
                <span>${row.score} PTS</span>`;
            anchor.appendChild(li);
        });
    } catch(e) {
        anchor.innerHTML = "<li class='leaderboard-item system-msg' style='color:var(--danger);'>Leaderboard connection failure.</li>";
    }
}

async function writeLeaderboardMetrics() {
    if (!supabase) return;
    
    // Compute total system final performance averages
    const totalPromptChars = academicTiers.slice(0, currentLevelIdx).reduce((acc, lvl) => acc + lvl.sentence.length, 0);
    const totalMinutesElapsed = (15 * 60 - timeRemaining) / 60;
    const finalWPM = totalMinutesElapsed > 0 ? Math.round((totalPromptChars / 5) / totalMinutesElapsed) : 0;
    const finalAccuracy = totalPromptChars > 0 ? Math.round(((totalPromptChars - incorrectStrokes) / totalPromptChars) * 100) : 100;

    try {
        await supabase
            .from('trend_leaderboard')
            .insert([{ 
                player_name: playerName, 
                score: playerScore, 
                wpm: Math.max(10, finalWPM), 
                accuracy: Math.clamp(finalAccuracy, 5, 100),
                levels_cleared: currentLevelIdx,
                time_left_seconds: timeRemaining 
            }]);
        fetchLeaderboard();
    } catch (e) {
        console.error("Database compilation update failure.", e.message);
    }
}

// Utility clamping helper functions logic
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function endGame(isWin) {
    clearInterval(gameInterval);
    inputDeck.disabled = true;
    
    document.getElementById('end-screen').style.display = 'flex';
    document.getElementById('end-title').innerText = isWin ? "COGNITIVE SIMULATION PASSED" : "TIMELINE CLOCK EXPIRED";
    document.getElementById('end-msg').innerText = `Performance compilation summary logged for ${playerName}: ${playerScore} matrix tracking score points verified.`;
    
    writeLeaderboardMetrics();
}
