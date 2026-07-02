// ==========================================================
// !!! ENTER YOUR UNIQUE PROJECT API METRICS HERE !!!
// ==========================================================
const SUPABASE_URL = "YOUR_SUPABASE_URL"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabase = null;

try {
    if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch(err) {
    console.warn("Database unconfigured. Entering local sandbox mode.", err.message);
}

const rawEssayText = "Phase_I:_The_Anatomy_of_Structural_Emergence. Modern trends represent the highly complex and dynamic intersection of quantitative data patterns human psychological behavior and macroscopic societal evolution. They are never isolated anomalies or random occurrences but are instead systemic transformations driven by fundamental collective human desires technological paradigm shifts and underlying structural momentum. To truly evaluate the origins of any major structural vector one must analyze how subtle micro-behaviors coalesce into macro-movements. This synthesis begins when isolated innovations interact with simmering social pressures creating an initial node of deviation. Historically these anomalies were discarded as marginal outliers by legacy institutions. However within network theory these nodes serve as early structural indicators of systemic shifts. As more decentralized actors flock toward the innovation a feedback loop activates causing localized behavior to scale exponentially. This scaling mechanism marks the transition from a fleeting fad to an enduring trend. Understanding this evolutionary trajectory requires an analytical mindset capable of recognizing patterns beneath structural noise. Observers must dismantle traditional analytical biases to track these patterns across disparate industrial silos. When technology accelerates cultural dissemination it shortens the latency between concept discovery and mainstream absorption. Consequently organizations that rely on backward-looking metrics find themselves perpetually reactive unable to intercept modern shifts before they redefine the competitive landscape entirely. True literacy requires recognizing that every trend contains structural markers including adoption velocity cultural resonance network density and infrastructure compatibility. By tracking these variables data analysts decode hidden signals establishing predictive models that forecast changes before they disrupt broader economic ecosystems. Phase_II:_The_Mechanics_of_Network_Dissemination. Information cascades through modern social structures using complex scale-free networks that maximize structural velocity while optimizing cross-platform visibility. In past decades structural updates drifted slowly across geographic borders filtered by traditional media gatekeepers. Today digital platforms eliminate friction allowing niche ideologies to transform into global cultural movements almost instantly. This rapid distribution depends on structural components known as super-nodes or influential tastemakers who bridge independent cultural clusters. When an emerging concept moves through a super-node it undergoes validation gaining social capital and mainstream legitimacy. This cross-pollination process creates cascading engagement patterns across demographics. The velocity of this movement is determined by cultural friction and structural alignment. If an idea matches collective anxieties or technological demands it encounters low resistance accelerating through digital channels. Conversely concepts that clash with structural paradigms face resistance requiring more energy to achieve mainstream adoption. During this acceleration phase tracking platforms measure sentiment analytics to quantify cultural velocity. Analysts map user engagement data to determine if a trend is scaling sustainably or burning out. Fleeting transformations spike rapidly but lack underlying infrastructure collapsing when novelty fades. Enduring trends build structural density growing consistently as they integrate into daily habits. This structural differentiation separates short-term visual fads from major structural transformations that reshape global commerce and consumer behavior. Phase_III:_The_Socioeconomic_Feedback_Loop. Once a structural pattern achieves mainstream validation it transitions from a passive cultural reflection into an active economic force. This phase triggers structural feedback loops where consumer behaviors rewrite industrial priorities and alter capital allocations. When capital markets witness sustained behavioral shifts they redirect investments toward infrastructure supporting the trend. This influx of capital accelerates research and development reducing entry barriers and inviting secondary competitors. As options multiply costs fall causing consumer adoption to surge further. This economic cycle explains how niche technological experiments transform into foundational global infrastructure. Consider how digital decentralization shifted from an abstract academic concept into a multi-billion-dollar financial market. This shift did not occur through random chance but followed structural laws governing technology implementation. As early adopters validated alternative consensus mechanisms they laid the foundation for enterprise applications. This structural pattern repeats across green energy automation and artificial intelligence models. Every major transition follows an identical path initialization validation capitalization institutionalization and standard setting. Navigating this environment demands continuous tracking and strategic agility. Thinkers must understand that trends are interconnected systems influencing one another. An accumulation in computing power directly drives capabilities in biotechnology while changing workforce demographics alter urban planning demands. Recognizing these intersections enables strategy experts to construct resilient long-term solutions. Phase_IV:_Predictive_Synthesis_and_Future_Architecture. The ultimate objective of trend analysis is not merely reacting to changes but developing predictive mastery to actively architect future outcomes. Organizations must transition from passive observation to proactive integration. This requires complex data processing engines that blend machine learning algorithms with anthropological research methods. Quantitative metrics show where a trend has been but qualitative tracking reveals where it will go next. When leaders combine these views they build dynamic strategies that survive disruption. As global systems grow interconnected the complexity of trend tracking increases. Solitary vectors now trigger complex secondary reactions across international borders. A regulatory update in one region can instantly alter supply chains and shift consumer habits worldwide. Managing this complexity requires continuous tracking and deep structural literacy. Leaders must separate superficial cultural expressions from the tectonic shifts driving them. Fads alter visual styling but structural trends reshape resource access and human capabilities. As we navigate an uncertain future tracking shifts becomes a vital survival skill. Those who cannot read structural vectors are condemned to react to consequences they failed to anticipate. Conversely those who master trend mechanics turn volatility into opportunity. They recognize that turbulence always precedes structural reorganization. By identifying emerging configurations early they position themselves as architects of the next economic era transforming abstract data streams into tangible human progress.";
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

wordsArray.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word.replace(/_/g, " ") + " ";
    span.className = 'word-node';
    span.id = `node-${index}`;
    streamOutput.appendChild(span);
});

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
    while(activeTokens.length < 8 && (currentIdx + activeTokens.length) < totalWords) {
        let target = currentIdx + activeTokens.length;
        if (Math.random() > 0.65) target = Math.min(totalWords - 1, target + Math.floor(Math.random() * 8));
        if (!activeTokens.some(t => t.index === target)) {
            activeTokens.push(new FloatingVector(wordsArray[target], target));
        }
    }
}

function verifySelection(tokenObj) {
    if (tokenObj.index === currentIdx) {
        document.getElementById(`node-${currentIdx}`).className = 'word-node unlocked';
        if (currentIdx % 6 === 0) document.getElementById(`node-${currentIdx}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        currentIdx++;
        playerScore += 10;
        
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
        timeRemaining = Math.max(0, timeRemaining - 5);
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
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    
    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = completion > 0.7 ? 'var(--success)' : 'var(--accent)';
    for (let x = 0; x < canvas.width; x++) {
        let y = (canvas.height/2) + Math.sin(x*0.01 + waveOffset)*40*(1-completion);
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    activeTokens.forEach(t => t.move());
    waveOffset += 0.02;
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
