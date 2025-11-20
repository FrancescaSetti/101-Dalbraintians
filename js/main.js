    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    
    // ---------- Hero scroll-away effect (zoom out + fade) ----------
    gsap.to("#heroImage", {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      scale: 1.06,
      opacity: 0
    });

    const framesBg = document.getElementById('framesBg');
framesBg.innerHTML += framesBg.innerHTML; // duplicazione per looping

gsap.to(framesBg, {
  x: "-50%",
  duration: 40,
  repeat: -1,
  ease: "linear"
});

const framesRow = document.getElementById('framesRow');
framesRow.innerHTML += framesRow.innerHTML; // duplicazione per looping

gsap.to(framesRow, {
  x: "-50%",
  duration: 40,
  repeat: -1,
  ease: "linear"
});


// ---------- Film frames looping (duplicate for seamless scroll + animation) ----------
(function setupFrames(){
  const framesRow = document.getElementById('framesRow');
  // duplicate frames for smooth looping effect
  framesRow.innerHTML += framesRow.innerHTML;
  function setWidth(){
    const children = Array.from(framesRow.children);
    let totalW = 0;
    children.forEach(el => totalW += el.offsetWidth + 12);
    framesRow.style.width = totalW + 'px';
  }
  window.addEventListener('load', setWidth);
  window.addEventListener('resize', setWidth);
})();

// Continuous horizontal movement of frames (visual stream)
gsap.to("#framesRow", {
  x: "-50%",   // move left continuously
  duration: 40,
  repeat: -1,
  ease: "linear"
});

// ---------- AUDIO WAVEFORM ----------
const canvas = document.getElementById('wave');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawWaveform(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#6bb8f3";
  for(let i=0;i<canvas.width;i+=4){
    let h = (Math.sin(i*0.02 + Date.now()*0.002)+1)/2 * canvas.height*0.7;
    ctx.fillRect(i,(canvas.height-h)/2,2,h);
  }
  requestAnimationFrame(drawWaveform);
}
drawWaveform()
 // ---------- Categories  ----------
    /** FLOATING TAGS **/
    const visualTags = ["animals","bodyparts","humanface","animalface","houses","landscape","objects","person","vehicles","scenes","cuts","subtitles","text"];
    const audioTags  = ["animals","objects","person","vehicles","audiodescription","dialogue","soundtrack"];
    const audioStrip = document.getElementById('audioStrip');

// ---------- CATEGORIES / FLOATING TAGS ----------

function createTag(className, parent, x, y){
  const tag = document.createElement('div');
  tag.className = 'tag ' + className;
  tag.textContent = className;
  parent.appendChild(tag);

  const targetX = Math.min(Math.max(x + (Math.random()*120 - 60), 0), parent.offsetWidth - 100);
  const targetY = Math.min(Math.max(y + (Math.random()*40 - 20), 0), parent.offsetHeight - 40);

  // "pop" animation: scale + rotation + fade-in
  gsap.fromTo(tag,
    { 
      x: x, 
      y: y, 
      opacity: 0, 
      scale: 0, 
      rotation: gsap.utils.random(-20, 20) 
    },
    { 
      x: targetX, 
      y: targetY, 
      opacity: 1, 
      scale: 1, 
      rotation: 0,
      duration: 0.8,
      ease: "back.out(2)"
    }
  );

  // floating effect
  gsap.to(tag, {
    y: `+=${gsap.utils.random(-10, 10)}`,
    x: `+=${gsap.utils.random(-8, 8)}`,
    duration: gsap.utils.random(1.8, 2.6),
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });

  // remove after 4s
  setTimeout(() => tag.remove(), 4000);
}

// ---------- Spawn visual tags ABOVE video stream ----------
function spawnVisualTags(){
  const filmStrip = document.querySelector('.film-strip'); // contenitore assoluto
  const x = Math.random() * (filmStrip.offsetWidth - 80);
  const y = Math.random() * (filmStrip.offsetHeight - 40);

  let shuffledVisualTags = [...visualTags];
  function getNextVisualTag() {
    if (shuffledVisualTags.length === 0) shuffledVisualTags = [...visualTags];
    return shuffledVisualTags.splice(Math.floor(Math.random()*shuffledVisualTags.length), 1)[0];
  }

  createTag(getNextVisualTag(), filmStrip, x, y); // append sopra film-strip
  setTimeout(spawnVisualTags, 400 + Math.random()*700);
}
spawnVisualTags();


    function spawnAudioTags(){
      const x = Math.random()*(audioStrip.offsetWidth-80);
      const y = Math.random()*(audioStrip.offsetHeight-40);
      createTag("audio "+audioTags[Math.floor(Math.random()*audioTags.length)], audioStrip, x, y);
      setTimeout(spawnAudioTags, 500 + Math.random()*700);
    }
    spawnAudioTags();
    
    // === Neural Overlay Animation ===
const neuralCanvas = document.getElementById('neuralOverlay');
if (neuralCanvas) {
  const ctx = neuralCanvas.getContext('2d');
  function resizeNeural() {
    neuralCanvas.width = neuralCanvas.offsetWidth;
    neuralCanvas.height = neuralCanvas.offsetHeight;
  }
  window.addEventListener('resize', resizeNeural);
  resizeNeural();

  const nodes = Array.from({length: 30}, () => ({
    x: Math.random() * neuralCanvas.width,
    y: Math.random() * neuralCanvas.height,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  }));

  function drawNeural() {
    ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    ctx.strokeStyle = 'rgba(107,184,243,0.35)';
    ctx.lineWidth = 0.8;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 140) {
          ctx.globalAlpha = 1 - dist / 140;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#6bb8f3';
    for (const n of nodes) {
      n.x += n.dx;
      n.y += n.dy;
      if (n.x < 0 || n.x > neuralCanvas.width) n.dx *= -1;
      if (n.y < 0 || n.y > neuralCanvas.height) n.dy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawNeural);
  }
  drawNeural();
}


    /** PARTICIPANT CHARTS  **/
//---------- Custom plugin for vertical error bars ---------- 
  const errorBarPlugin = {
    id: 'errorBars',
    afterDatasetsDraw(chart, args, options) {
      const {ctx, scales: {x, y}} = chart;
      chart.data.datasets.forEach((dataset) => {
        if (!dataset.error) return;
        dataset.data.forEach((value, index) => {
          const err = dataset.error[index];
          if (!err) return;

          const barX = x.getPixelForTick(index);
          const barY = y.getPixelForValue(value);
          const plusY = y.getPixelForValue(value + err.plus);
          const minusY = y.getPixelForValue(value - err.minus);

          ctx.save();
          ctx.strokeStyle = options.color || '#333';
          ctx.lineWidth = options.width || 2;

          // vertical line
          ctx.beginPath();
          ctx.moveTo(barX, plusY);
          ctx.lineTo(barX, minusY);
          ctx.stroke();

          // top cap
          ctx.beginPath();
          ctx.moveTo(barX - 6, plusY);
          ctx.lineTo(barX + 6, plusY);
          ctx.stroke();

          // bottom cap
          ctx.beginPath();
          ctx.moveTo(barX - 6, minusY);
          ctx.lineTo(barX + 6, minusY);
          ctx.stroke();

          ctx.restore();
        });
      });
    }
  };
  
  Chart.register(errorBarPlugin);


// ---------- Sample size chart ----------
const participantsData = {
  labels: ['Blind 🦻', 'Deaf 👁️', 'TD-A 🦻', 'TD-V 👁️', 'TD-AV 🦻👁️'],
  datasets: [{
    label: 'Sample size',
    data: [9, 9, 10, 10, 10],
    backgroundColor: ['#9be7d6', '#bfe0ff', '#ffd486', '#ffb2b2', '#d9b7ff'],
    borderColor: ['#56bfa6', '#5aa8e6', '#e6a43d', '#e67373', '#b98ef6'],
    borderWidth: 1
  }]
};

const participantsOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Sample size' } 
      }
    }
  };

const participantsChart = new Chart(
  document.getElementById('participantsChart'),
  { type: 'bar', data: participantsData, options: participantsOptions } 
);
 
  //----------Age chart + SD--------------
const ageData = {
  labels: ['Blind 🦻', 'Deaf 👁️', 'TD-A 🦻', 'TD-V 👁️', 'TD-AV 🦻👁️'],
  datasets: [{
    label: 'Age ± SD',
    data: [44, 24, 39, 37, 35],
    backgroundColor: ['#9be7d6', '#bfe0ff', '#ffd486', '#ffb2b2', '#d9b7ff'],
    borderColor: ['#56bfa6', '#5aa8e6', '#e6a43d', '#e67373', '#b98ef6'],
    borderWidth: 1,
    // SD error bars
    error: [
      {plus:14, minus:14},
      {plus:4, minus:4},
      {plus:17, minus:17},
      {plus:15, minus:15},
      {plus:13, minus:13}
    ]
  }]
};

const ageOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const sd = ctx.dataset.error[ctx.dataIndex];
            return `Age: ${ctx.raw} ± ${sd.plus}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, max: 60, title: { display: true, text: 'Age' } }
    },
    errorBars: { color: '#333', width: 2 } // used by plugin // questo è responsabile della legenda eh
  };



const ageChart = new Chart(
  document.getElementById('ageChart'),
  { type: 'bar', data: ageData, options: ageOptions } 
);

// ---------- GSAP fade-in animations for charts ----------
const toAnimate = document.querySelectorAll('.chart-container, .stimulus-icons');
toAnimate.forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 40 }, {
    opacity: 1, y: 0,
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    duration: 0.9,
    ease: "power2.out"
  });
});
// ---- Computational model visual demos ----

//// Motion energy: dynamic Gabor wavelets
//const motionCtx = document.getElementById('motionEnergyCanvas').getContext('2d');
//function drawGaborDemo(){
  //const ctx = motionCtx;
  //const {width, height} = ctx.canvas;
  //ctx.clearRect(0,0,width,height);
  //const t = Date.now()*0.002;
  //for(let i=0;i<4;i++){
    //const x = width*(i+1)/5;
    //const freq = 0.05 + 0.02*i;
    //const phase = t + i;
    //for(let y=0;y<height;y++){
      //const val = Math.sin((y*freq)+phase);
      //ctx.fillStyle = `rgba(${120+60*val},${130+60*val},${140+60*val},0.9)`;
      //ctx.fillRect(x-10,y,20,1);
    //}
  //}
  //requestAnimationFrame(drawGaborDemo);
//}
//drawGaborDemo();

//// Power Spectrum: synthetic waveform
//const powerCtx = document.getElementById('powerSpectrumCanvas').getContext('2d');
//function drawSpectrum(){
  //const ctx = powerCtx;
  //const {width, height} = ctx.canvas;
  //ctx.clearRect(0,0,width,height);
  //for(let i=0;i<width;i+=3){
    //const amp = Math.sin(i*0.03 + Date.now()*0.003)*0.5 + 0.5;
    //const h = amp * height*0.8;
    //ctx.fillStyle = "#6bb8f3";
    //ctx.fillRect(i, height - h, 2, h);
  //}
  //requestAnimationFrame(drawSpectrum);
//}
//drawSpectrum();


// VGG features
//const vggCtx = document.getElementById('vggCanvas').getContext('2d');

//function drawVGG() {
  //const {width, height} = vggCtx.canvas;
  //vggCtx.clearRect(0, 0, width, height);

  //const layers = 3; // simulate 3 convolutional layers
  //for(let l = 0; l < layers; l++){
    //for(let i=0; i<10; i++){
      //let val = Math.random() * height * (0.3 + 0.2*l); // higher layers have taller activations
      //// different color per layer
      //const colors = [
        //`rgba(100,150,250,${0.5 + 0.2*l})`,
        //`rgba(250,100,150,${0.5 + 0.2*l})`,
        //`rgba(150,250,100,${0.5 + 0.2*l})`
      //];
      //vggCtx.fillStyle = colors[l];
      //vggCtx.fillRect(i*20+10, height-val, 10, val);
    //}
  //}

  //// optional: label
  //vggCtx.fillStyle = 'black';
  //vggCtx.font = '14px sans-serif';
  //vggCtx.fillText("VGG features", 10, 20);

  //requestAnimationFrame(drawVGG);
//}

//drawVGG();



//// VGG-ish features
//const vggishCtx = document.getElementById('vggishCanvas').getContext('2d');

//function drawVGGish() {
  //const {width, height} = vggishCtx.canvas;
  //vggishCtx.clearRect(0, 0, width, height);

  //const cols = 12; // number of “feature maps” horizontally
  //const rows = 8;  // number of “feature maps” vertically
  //const cellWidth = width / cols;
  //const cellHeight = height / rows;

  //for(let r = 0; r < rows; r++){
    //for(let c = 0; c < cols; c++){
      //const intensity = Math.floor(Math.random() * 255); // activation value
      //vggishCtx.fillStyle = `rgb(${intensity}, ${255-intensity}, ${Math.floor(intensity/2)})`;
      //vggishCtx.fillRect(c * cellWidth, r * cellHeight, cellWidth-2, cellHeight-2); // small gap for clarity
    //}
  //}

  //// optional: label
  //vggishCtx.fillStyle = 'black';
  //vggishCtx.font = '14px sans-serif';
  //vggishCtx.fillText("VGG-ish features", 10, 20);

  //requestAnimationFrame(drawVGGish);
//}

//drawVGGish();

//// GPT-4 semantic embeddings: floating concept graph
//const semCtx = document.getElementById('semanticCanvas').getContext('2d');
//const nodes = Array.from({length:12},()=>({
  //x: Math.random()*250,
  //y: Math.random()*150,
  //dx: (Math.random()-0.5)*1.5,
  //dy: (Math.random()-0.5)*1.5
//}));
//function drawSemanticGraph(){
  //const ctx = semCtx;
  //const {width,height}=ctx.canvas;
  //ctx.clearRect(0,0,width,height);
  //ctx.strokeStyle="rgba(100,150,255,0.4)";
  //ctx.lineWidth=1.2;
  //for(let i=0;i<nodes.length;i++){
    //const a=nodes[i];
    //for(let j=i+1;j<nodes.length;j++){
      //const b=nodes[j];
      //const d=Math.hypot(a.x-b.x,a.y-b.y);
      //if(d<80){
        //ctx.beginPath();
        //ctx.moveTo(a.x,a.y);
        //ctx.lineTo(b.x,b.y);
        //ctx.stroke();
      //}
    //}
  //}
  //ctx.fillStyle="#6bb8f3";
  //for(const n of nodes){
    //n.x+=n.dx; n.y+=n.dy;
    //if(n.x<0||n.x>width) n.dx*=-1;
    //if(n.y<0||n.y>height) n.dy*=-1;
    //ctx.beginPath();
    //ctx.arc(n.x,n.y,4,0,Math.PI*2);
    //ctx.fill();
  //}
  //requestAnimationFrame(drawSemanticGraph);
//}
//drawSemanticGraph();

// ===== Simulated auditory feature visualization =====
const audioCanvas = document.getElementById('audioFeatures');
if (audioCanvas) {
  const aCtx = audioCanvas.getContext('2d');
  function drawAudioFeatures() {
    aCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
    const bars = 32;
    for (let i = 0; i < bars; i++) {
      const freq = i / bars;
      const amp = Math.sin(Date.now() * 0.002 + freq * 10) * 0.4 + 0.6;
      const barHeight = amp * audioCanvas.height * 0.8;
      const hue = 200 + i * 3;
      aCtx.fillStyle = `hsl(${hue},70%,60%)`;
      const barWidth = audioCanvas.width / bars;
      aCtx.fillRect(i * barWidth + 4, audioCanvas.height - barHeight, barWidth - 8, barHeight);
    }
    requestAnimationFrame(drawAudioFeatures);
  }
  drawAudioFeatures();
}
