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
    console.warn("Database bypassed. Working inside local staging array loop.", err.message);
}

// Scaffolding sentences covering Senior High School "Trends, Networks, and Critical Thinking"
const structuralLevels = [
    "Trends_evolve_constantly.",                                                                                                                        // Easy (3 words)
    "Fads_die_quickly_while_trends_stay_longer.",                                                                                                      // Easy-Medium (6 words)
    "Globalization_connects_local_cultures_into_vast_interconnected_networks.",                                                                        // Medium (7 words)
    "Critical_thinking_allows_students_to_distinguish_between_short_lived_fads_and_enduring_strategic_trends.",                                         // Medium-Hard (11 words)
    "Strategic_analysis_examines_patterns_systematically_whereas_intuitive_thinking_relies_heavily_on_immediate_gut_feelings_and_personal_perceptions.", // Hard (14 words)
    "Twenty_first_century_learners_must_dismantle_informational_silos_and_utilize_network_science_to_comprehend_the_macroscopic_effects_of_climate_change." // Advanced (15 words)
];

// Merge array items into a single processing line sequence
const rawEssayText = structuralLevels.join(" ");
const wordsArray = rawEssayText.split(" ");
const totalWords = wordsArray.length;

let currentIdx = 0;
let timeRemaining = 15 * 60; 
let playerScore = 0;
let playerName = "Anonymous";
let gameInterval;
let activeTokens = [];
let waveOffset = 0;

const streamOutput = document.getElementById('stream-output');
const tokenField = document.getElementById('token-field');
const timerDisplay = document.getElementById('timer');
const counterDisplay = document.getElementById('counter');
const scoreDisplay = document.getElementById('live-score');
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Populate text framework panel elements
wordsArray.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word.replace(/_/g, " ") + " ";
    span.className = 'word-node';
    span.id = `node-${index}`;
    streamOutput.appendChild(span);
});
counterDisplay.innerText = `0/${totalWords}`;

class FloatingVector {
    constructor(wordText, index) {
        this.text = wordText;
        this.index = index;
        this.element = document.createElement('div');
        this.element.className = 'interactive-token';
        this.element.innerText = wordText.replace(/_/g, " ");
        this.x = Math.random() * (tokenField.clientWidth - 110);
        this.y = Math.random() * (tokenField.clientHeight - 40);
        this.vx = (Math.random() - 0.5) * 2.0;
        this.vy = (Math.random() - 0.5) * 2.0;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.addEventListener('click', () => verifySelection(this));
        tokenField.appendChild(this.element);
    }
    move() {
        this.x += this.vx; this.y += this.vy;
        if (this.x <= 0 || this.x >= tokenField.clientWidth - this.element.clientWidth) this.vx *= -1;
        if (this.y <= 0 || this.y >= tokenField.clientHeight - this.element.clientHeight) this.vy *= -1;
        this.element.style.left = `${this.x}px`; this.element.style.top = `${this.y}px`;
    }
    clear() { this.element.remove(); }
}

function syncPool() {
    activeTokens = activeTokens.filter(t => { if(t.index < currentIdx){ t.clear(); return false; } return true; });
    while(activeTokens.length < 6 && (currentIdx + activeTokens.length) < totalWords) {
        let target = currentIdx + activeTokens.length;
        if (Math.random() > 0.7) target = Math.min(totalWords - 1, target + Math.floor(Math.random() * 5));
        if (!activeTokens.some(t => t.index === target)) {
            activeTokens.push(new FloatingVector(wordsArray[target], target));
        }
    }
}

function verifySelection(tokenObj) {
    if (tokenObj.index === currentIdx) {
        document.getElementById(`node-${currentIdx}`).className = 'word-node unlocked';
        if (currentIdx % 4 === 0) document.getElementById(`node-${currentIdx}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        currentIdx++;
        playerScore += 15; // Increased reward values
        
        scoreDisplay.innerText = playerScore.toString().padStart(4, '0');
        counterDisplay.innerText = `${currentIdx}/${totalWords}`;
        tokenObj.clear();
        activeTokens = activeTokens.filter(t => t !== tokenObj);
        
        if (currentIdx >= totalWords) {
            endGame(true);
        } else {
            document.getElementById(`node-${currentIdx}`).className = 'word-node current-target';
            syncPool();
        }
    } else {
        playerScore = Math.max(0, playerScore - 5);
        timeRemaining = Math.max(0, timeRemaining - 4);
        scoreDisplay.innerText = playerScore.toString().padStart(4, '0');
        tokenObj.element.style.borderColor = 'var(--danger)';
        setTimeout(() => { tokenObj.element.style.borderColor = 'var(--accent)'; }, 200);
    }
}

function runClock() {
    if(timeRemaining <= 0) { endGame(false); return; }
    timeRemaining--;
    let mins = Math.floor(timeRemaining / 60); let secs = timeRemaining % 60;
    timerDisplay.innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function renderGraphicsLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let completion = currentIdx / totalWords;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    
    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = completion > 0.8 ? 'var(--success)' : 'var(--accent)';
    for (let x = 0; x < canvas.width; x++) {
        let y = (canvas.height/2) + Math.sin(x*0.015 + waveOffset)*35*(1-completion);
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    activeTokens.forEach(t => t.move());
    waveOffset += 0.03;
    requestAnimationFrame(renderGraphicsLoop);
}

function validateAndStart() {
    const input = document.getElementById('username-field').value.trim();
    if(!input) { alert("Identity validation token required."); return; }
    playerName = input;
    document.getElementById('display-name').innerText = playerName;
    document.getElementById('start-screen').style.display = 'none';
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    document.getElementById(`node-${currentIdx}`).className = 'word-node current-target';
    
    syncPool();
    gameInterval = setInterval(runClock, 1000);
    renderGraphicsLoop();
    fetchLeaderboard();
}

async function fetchLeaderboard() {
    const anchor = document.getElementById('leaderboard-anchor');
    if (!supabase) {
        anchor.innerHTML = "<li class='leaderboard-item' style='color:var(--warning);'>Local Engine Active (No DB Configured)</li>";
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
            anchor.innerHTML = "<li class='leaderboard-item'>No synchronized records found</li>";
        }
        data.forEach((row, i) => {
            const li = document.createElement('li');
            li.className = 'leaderboard-item';
            li.innerHTML = `<span>${i+1}. ${row.player_name}</span> <span>${row.score} PTS</span>`;
            anchor.appendChild(li);
        });
    } catch(e) {
        console.log("Database fetch failed:", e.message);
        anchor.innerHTML = "<li class='leaderboard-item' style='color:var(--danger);'>DB Connection Refused</li>";
    }
}

async function writeLeaderboardMetrics() {
    if (!supabase) return;
    try {
        await supabase
            .from('trend_leaderboard')
            .insert([{ 
                player_name: playerName, 
                score: playerScore, 
                words_completed: currentIdx, 
                time_left_seconds: timeRemaining 
            }]);
        fetchLeaderboard();
    } catch (e) {
        console.log("Database update error:", e.message);
    }
}

function endGame(isWin) {
    clearInterval(gameInterval);
    document.getElementById('end-screen').style.display = 'flex';
    document.getElementById('end-title').innerText = isWin ? "SIMULATION COMPLETED" : "TIMELINE FAULT";
    document.getElementById('end-msg').innerText = `Final score compiled for ${playerName}: ${playerScore} points logged to base matrix.`;
    writeLeaderboardMetrics();
}
