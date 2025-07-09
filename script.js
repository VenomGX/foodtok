/* ----------  Navigation ---------- */
const navButtons=document.querySelectorAll("nav button, .bottomNav button");
const sections   =document.querySelectorAll("section");
navButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    navButtons.forEach(b=>b.classList.remove("active"));
    sections.forEach(s=>s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

/* ----------  Recipes ---------- */
const recipes=[
  {
    name:"Creamy Garlic Pasta",
    ingredients:["pasta","garlic","cream"],
    video:"https://videos.pexels.com/video-files/5065326/5065326-hd_1920_1080_24fps.mp4",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Pasta",qty:"200 g"},
      {item:"Garlic",qty:"2 cloves"},
      {item:"Heavy cream",qty:"120 ml"}
    ],
    steps:[
      "Boil pasta until al dente.",
      "Sauté minced garlic in butter.",
      "Add cream, toss pasta, season and serve."
    ]
  },
  {
    name:"Tomato Basil Soup",
    ingredients:["tomato","basil","garlic"],
    video:"https://videos.pexels.com/video-files/4057976/4057976-sd_960_506_25fps.mp4",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Tomatoes",qty:"4 large"},
      {item:"Fresh basil",qty:"10 leaves"},
      {item:"Garlic",qty:"1 clove"}
    ],
    steps:[
      "Roast tomatoes & garlic 20 min.",
      "Blend with basil & stock.",
      "Simmer 10 min, finish with cream."
    ]
  },
  {
    name:"Avocado Toast",
    ingredients:["avocado","bread","salt"],
    video:"https://videos.pexels.com/video-files/7929005/7929005-uhd_1440_2560_24fps.mp4",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Bread slices",qty:"2"},
      {item:"Ripe avocado",qty:"1"},
      {item:"Salt & pepper",qty:"to taste"}
    ],
    steps:[
      "Toast bread.",
      "Mash avocado, season.",
      "Spread and enjoy."
    ]
  },
  {
    name:"Easy Mozzarella Sticks",
    ingredients:["mozzarella"],
    video:"https://media.istockphoto.com/id/1046835746/it/video/macro-scatto-di-una-mozzarella-di-bufala-fresca-italiana-e-bio-piena-di-latte-e-sfondo-con.mp4?s=mp4-640x640-is&k=20&c=cMAdcs8mXyWt6KQ0X1byD_TmaKj9QxhiLzGdDxxiZ-U=",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Mozzarella block",qty:"250 g"},
      {item:"Breadcrumbs",qty:"1 cup"},
      {item:"Eggs",qty:"2"}
    ],
    steps:[
      "Cut mozzarella into fingers.",
      "Dip in egg, coat with crumbs (twice).",
      "Fry until golden."
    ]
  },
  {
    name:"Caprese Salad",
    ingredients:["mozzarella","tomato","basil"],
    video:"https://media.istockphoto.com/id/1675664099/it/video/giovane-donna-che-mescola-insalata-di-burrata-al-ristorante.mp4?s=mp4-640x640-is&k=20&c=lAEqSwWW14jT7R74w7cojpf9lEyOSU9o9NOUOEKhVfo=",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Mozzarella",qty:"200 g"},
      {item:"Tomatoes",qty:"2"},
      {item:"Basil",qty:"handful"}
    ],
    steps:[
      "Slice tomato & mozzarella.",
      "Layer alternately with basil.",
      "Drizzle oil, season."
    ]
  },
  {
    name:"Cheesy Mozzarella Bread",
    ingredients:["mozzarella","bread","garlic"],
    video:"https://videos.pexels.com/video-files/3196344/3196344-uhd_2560_1440_25fps.mp4",
    likes:0,
    comments:[],
    ingredientsFull:[
      {item:"Baguette",qty:"1"},
      {item:"Mozzarella",qty:"150 g"},
      {item:"Garlic butter",qty:"2 tbsp"}
    ],
    steps:[
      "Halve baguette, spread garlic butter.",
      "Top with mozzarella.",
      "Bake 8 min @ 200 °C."
    ]
  }
];
const activity = [
  { type: "like", user: "anna", recipe: "Creamy Garlic Pasta", time: "2m ago" },
  { type: "comment", user: "ben", recipe: "Avocado Toast", text: "Looks yum!", time: "5m ago" },
  { type: "like", user: "carla", recipe: "Tomato Basil Soup", time: "10m ago" }
];


/* ----------  Ingredient filter chips ---------- */
const pills=[],input=document.getElementById("ingredientInput"),
      pillBox=document.getElementById("pillBox"),addBtn=document.getElementById("addBtn"),
      listEl=document.getElementById("recipesList");

input.addEventListener("keydown",e=>{if(e.key==="Enter") addIng();});
addBtn.onclick=addIng;
function addIng(){
  const v=input.value.trim().toLowerCase();
  if(!v||pills.includes(v)) return;
  pills.push(v); input.value=""; renderPills(); refreshRecipes();
}
function renderPills(){
  pillBox.innerHTML=pills.map(p=>`<span class="pill" data-val="${p}">${p} ✕</span>`).join("");
}
pillBox.onclick=e=>{
  if(!e.target.classList.contains("pill")) return;
  pills.splice(pills.indexOf(e.target.dataset.val),1);
  renderPills(); refreshRecipes();
};

const norm=s=>s.toLowerCase().replace(/(.)\1+/g,"$1");
const fuzzy=(a,b)=>norm(a).includes(norm(b))||norm(b).includes(norm(a));

function refreshRecipes(){
  const out=recipes.filter(r=>r.ingredients.some(i=>pills.some(p=>fuzzy(i,p))));
  listEl.innerHTML=out.length
    ? out.map(r=>{
        const idx=recipes.indexOf(r);
        return `<li class="recipeCard" data-idx="${idx}">
                  <video src="${r.video}" muted loop autoplay playsinline></video>
                  <div class="recipeName">${r.name}</div>
                </li>`;
      }).join("")
    :"<li>No recipes match yet.</li>";
}
refreshRecipes();

/* click result → jump to FYP video */
listEl.addEventListener("click",e=>{
  const card=e.target.closest(".recipeCard");
  if(!card) return;
  gotoFYP(+card.dataset.idx);
});
function gotoFYP(idx){
  /* activate FYP section */
  navButtons.forEach(b=>{if(b.dataset.target==="fypSection") b.click();});
  requestAnimationFrame(()=>{
    document.getElementById(`videoCard-${idx}`)
      ?.scrollIntoView({behavior:"smooth",block:"center"});
  });
}

/* ----------  Build FYP feed ---------- */
const fypFeed=document.getElementById("fypFeed");
recipes.forEach((r,idx)=>{
  const card=document.createElement("div");
  card.className="videoCard"; card.id=`videoCard-${idx}`;

  const vid=document.createElement("video");
  Object.assign(vid,{src:r.video,autoplay:true,loop:true,muted:true,playsInline:true});

  const cap=document.createElement("div");
  cap.className="caption"; cap.textContent=r.name;

  const side=document.createElement("div");
  side.className="sideBtns";
  side.innerHTML=`
     <div class="sideBtn likeBtn" data-idx="${idx}">
       <span class="heart-icon">🤍</span><span>${r.likes}</span>
     </div>
     <div class="sideBtn commentBtn" data-idx="${idx}">
       💬<span>${r.comments.length}</span>
     </div>
     <div class="sideBtn recipeBtn" data-idx="${idx}">
       🍴
     </div>
  `;

  card.append(vid,cap,side);
  fypFeed.appendChild(card);
});

/* ----------  Like toggle ---------- */
/* ----------  Like toggle (improved with icon swap) ---------- */
fypFeed.addEventListener("click", e => {
  const like = e.target.closest(".likeBtn");
  if (!like) return;

  const idx = +like.dataset.idx;
  const countSpan = like.querySelector("span:last-child");
  const iconSpan = like.querySelector(".heart-icon");
  const recipe = recipes[idx];

  like.classList.toggle("liked");

  const liked = like.classList.contains("liked");
  recipe.likes += liked ? 1 : -1;
  recipe.likes = Math.max(0, recipe.likes);

  countSpan.textContent = recipe.likes;
  iconSpan.textContent = liked ? "❤️" : "🤍";
});


/* ----------  Comment drawer ---------- */
const modal  = document.getElementById("commentModal");
const listDiv= document.getElementById("commentsList");
let currentIdx = null; // which recipe is open

document.querySelectorAll(".commentBtn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentIdx = +btn.dataset.idx;
    renderComments();
    modal.classList.add("show");
  });
});

function hideComments(){
  modal.classList.add("closing");
  setTimeout(()=>modal.classList.remove("show","closing"), 250);
}

document.getElementById("closeModal").onclick = hideComments;

/* close if user taps the backdrop */
modal.addEventListener("click", e => {
  if (e.target === modal) hideComments();
});

/* swipe-down to close */
let startY = 0;
const panel = document.querySelector(".commentPanel");
panel.addEventListener("touchstart", e => startY = e.touches[0].clientY);
panel.addEventListener("touchend",   e => {
  if (e.changedTouches[0].clientY - startY > 80) hideComments();
});

/* build comment rows */
function renderComments(){
  const data = recipes[currentIdx].comments;
  listDiv.innerHTML = data.map((c,i)=>`
    <div class="commentRow" data-i="${i}">
      <img class="avatarSm" src="https://placehold.co/32x32" alt="">
      <div class="commentText">
        <strong>@${c.user}</strong> ${c.text}
        <div class="commentActions">
          <span class="commentLike ${c.liked?"liked":""}" data-i="${i}">♥ ${c.likes}</span>
          <span class="replyBtn" data-i="${i}">Reply</span>
        </div>
      </div>
    </div>`).join("");
}

/* like a comment */
listDiv.addEventListener("click",e=>{
  if(e.target.classList.contains("commentLike")){
    const i = e.target.dataset.i;
    const c = recipes[currentIdx].comments[i];
    c.liked = !c.liked;
    c.likes += c.liked ? 1 : -1;
    renderComments();
  }
  /* reply pre-fills input */
  if(e.target.classList.contains("replyBtn")){
    const user = recipes[currentIdx].comments[e.target.dataset.i].user;
    const fld  = document.getElementById("commentField");
    fld.value = `@${user} `;
    fld.focus();
  }
});

/* add new comment */
document.getElementById("sendComment").onclick = () => {
  const fld = document.getElementById("commentField");
  const txt = fld.value.trim();
  if(!txt) return;
  recipes[currentIdx].comments.push({user:"you",text:txt,likes:0,liked:false});
  fld.value = "";
  renderComments();
};
document.getElementById("commentField").addEventListener("keydown",e=>{
  if(e.key==="Enter") document.getElementById("sendComment").click();
});

/* ----------  Recipe drawer ---------- */
const recipeModal=document.getElementById("recipeModal");
const recipeTitle=document.getElementById("recipeTitle");
const ingList=document.getElementById("recipeIngList");
const stepList=document.getElementById("recipeStepList");

/* open from 🍴 button */
fypFeed.addEventListener("click",e=>{
  const btn=e.target.closest(".recipeBtn");
  if(!btn) return;
  renderRecipe(+btn.dataset.idx);
  recipeModal.classList.add("show");
});

/* close handlers */
function hideRecipe(){
  recipeModal.classList.add("closing");
  setTimeout(()=>recipeModal.classList.remove("show","closing"),250);
}
document.getElementById("closeRecipeModal").onclick=hideRecipe;
recipeModal.addEventListener("click",e=>{if(e.target===recipeModal) hideRecipe();});
/* swipe-down */
let recipeStartY=0;
recipeModal.querySelector(".recipePanel")
  .addEventListener("touchstart",e=>recipeStartY=e.touches[0].clientY);
recipeModal.querySelector(".recipePanel")
  .addEventListener("touchend",e=>{
    if(e.changedTouches[0].clientY-recipeStartY>80) hideRecipe();
  });

function renderRecipe(i) {
  const r = recipes[i];
  recipeTitle.textContent = r.name;

  ingList.innerHTML = r.ingredientsFull.map(x => `
    <li class="recipeItem">
      <span class="ingredientDot">•</span>
      <span class="ingredientText"><strong>${x.qty}</strong> ${x.item}</span>
    </li>
  `).join("");

  stepList.innerHTML = r.steps.map((s, k) => `
    <li class="stepItem">
      <div class="stepNumber">${k + 1}</div>
      <div class="stepText">${s}</div>
    </li>
  `).join("");
}


/* ----------  Profile grid ---------- */
const grid=document.getElementById("profileGrid");
recipes.forEach(r=>{
  const v=document.createElement("video");
  Object.assign(v,{src:r.video,autoplay:true,loop:true,muted:true,playsInline:true});
  grid.appendChild(v);
});


/* ----------  Modern Upload interactions ---------- */
const nameFld      = document.getElementById("uploadName");
const videoFld     = document.getElementById("uploadVideo");
const videoPrev    = document.getElementById("videoPreview");
const ingField     = document.getElementById("uploadIngField");
const ingPillsBox  = document.getElementById("uploadIngPills");
const stepField    = document.getElementById("uploadStepField");
const stepListEl   = document.getElementById("uploadStepList");
const postBtn      = document.getElementById("uploadSubmit");

const ingArr = [];
const stepArr = [];

/* live video preview */
videoFld.addEventListener("input", () => {
  const url = videoFld.value.trim();
  if (url) {
    videoPrev.src = url;
    videoPrev.style.display = "block";
  } else {
    videoPrev.removeAttribute("src");
    videoPrev.style.display = "none";
  }
});

/* ingredient chips */
ingField.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const v = ingField.value.trim();
    if (v && !ingArr.includes(v.toLowerCase())) {
      ingArr.push(v);
      ingField.value = "";
      renderIngPills();
    }
  }
});

function renderIngPills() {
  ingPillsBox.innerHTML = ingArr
    .map(i => `<span class="pill" data-val="${i}">${i} ✕</span>`)
    .join("");
}

ingPillsBox.addEventListener("click", e => {
  if (e.target.classList.contains("pill")) {
    const val = e.target.dataset.val;
    ingArr.splice(ingArr.indexOf(val), 1);
    renderIngPills();
  }
});

/* steps builder */
stepField.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const v = stepField.value.trim();
    if (v) {
      stepArr.push(v);
      stepField.value = "";
      renderSteps();
    }
  }
});

function renderSteps() {
  stepListEl.innerHTML = stepArr
    .map((s, i) => `<li data-i="${i}">${s}</li>`)
    .join("");
}

/* post recipe */
postBtn.addEventListener("click", () => {
  const name  = nameFld.value.trim();
  const video = videoFld.value.trim();

  if (!name || !video) {
    alert("Please enter a recipe name and a video URL.");
    return;
  }
  if (!ingArr.length) {
    alert("Add at least one ingredient.");
    return;
  }

  const newRecipe = {
    name,
    video,
    ingredients: ingArr.map(x => x.toLowerCase()),
    likes: 0,
    comments: [],
    ingredientsFull: ingArr.map(i => ({ item: i, qty: "" })),
    steps: stepArr.length ? stepArr : ["Enjoy!"]
  };

  /* push & render everywhere */
  recipes.push(newRecipe);
  const idx = recipes.length - 1;
  createFYPCard(newRecipe, idx);
  createProfileThumb(newRecipe);
  refreshRecipes();

  /* reset form */
  [nameFld, videoFld].forEach(f => (f.value = ""));
  ingArr.length = stepArr.length = 0;
  renderIngPills();
  renderSteps();
  videoPrev.removeAttribute("src");
  videoPrev.style.display = "none";

  /* jump user to their new post in the feed */
  navButtons.forEach(b => {
    if (b.dataset.target === "fypSection") b.click();
  });
  requestAnimationFrame(() =>
    document.getElementById(`videoCard-${idx}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  );
});
const activityList = document.getElementById("activityList");

function renderActivity() {
  activityList.innerHTML = activity.map(a => {
    const recipeIndex = recipes.findIndex(r => r.name.toLowerCase().trim() === a.recipe.toLowerCase().trim());
    const dataAttr = `data-idx="${recipeIndex}"`;

    return `
      <li class="activityItem" ${dataAttr}>
        <img class="activityAvatar" src="https://placehold.co/48x48" alt="@${a.user}" />
        <div class="activityText">
          <p class="activityMessage">
            <strong>@${a.user}</strong> ${
              a.type === "like"
                ? `liked your <em>${a.recipe}</em>`
                : `commented on <em>${a.recipe}</em>: “${a.text}”`
            }
          </p>
          <span class="activityTime">${a.time}</span>
        </div>
      </li>`;
  }).join("");
}


// Call this once to load activity feed on page load
renderActivity();
activityList.addEventListener("click", (e) => {
  const item = e.target.closest(".activityItem");
  if (!item) return;
  const idx = +item.dataset.idx;
  if (!isNaN(idx)) gotoFYP(idx);
});




