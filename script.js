// --- État ---
let taches = JSON.parse(localStorage.getItem("taches")) || [];
let filtre = "toutes";

// --- Éléments du DOM ---
const form = document.getElementById("form");
const input = document.getElementById("input");
const liste = document.getElementById("liste");
const vide = document.getElementById("vide");
const compteur = document.getElementById("compteur");
const boutonsFiltre = document.querySelectorAll(".filtres button");

// --- Fonctions ---
function sauvegarder() {
  localStorage.setItem("taches", JSON.stringify(taches));
}

function afficher() {
  liste.innerHTML = "";

  const visibles = taches.filter((t) => {
    if (filtre === "actives") return !t.finie;
    if (filtre === "finies") return t.finie;
    return true;
  });

  visibles.forEach((t) => {
    const li = document.createElement("li");
    if (t.finie) li.classList.add("finie");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.finie;
    check.addEventListener("change", () => {
      t.finie = check.checked;
      sauvegarder();
      afficher();
    });

    const texte = document.createElement("span");
    texte.textContent = t.texte; // textContent = pas de risque XSS

    const suppr = document.createElement("button");
    suppr.className = "suppr";
    suppr.textContent = "✕";
    suppr.setAttribute("aria-label", "Supprimer");
    suppr.addEventListener("click", () => {
      taches = taches.filter((x) => x.id !== t.id);
      sauvegarder();
      afficher();
    });

    li.append(check, texte, suppr);
    liste.appendChild(li);
  });

  vide.hidden = visibles.length > 0;
  const restantes = taches.filter((t) => !t.finie).length;
  compteur.textContent = `${restantes} tâche(s) à faire sur ${taches.length}`;
}

// --- Événements ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texte = input.value.trim();
  if (!texte) return;
  taches.push({ id: Date.now(), texte, finie: false });
  input.value = "";
  sauvegarder();
  afficher();
});

boutonsFiltre.forEach((b) => {
  b.addEventListener("click", () => {
    filtre = b.dataset.filtre;
    boutonsFiltre.forEach((x) => x.classList.toggle("actif", x === b));
    afficher();
  });
});

afficher();