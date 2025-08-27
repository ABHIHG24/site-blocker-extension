document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENT REFERENCES ---
  const mainImage = document.getElementById("mainImage");
  const imageUpload = document.getElementById("imageUpload");
  const saveBtn = document.getElementById("saveBtn");
  const removeBtn = document.getElementById("removeBtn");
  const newSiteInput = document.getElementById("new-site");
  const addBtn = document.getElementById("add-btn");
  const blockedListUl = document.getElementById("blocked-list");

  let selectedFile = null;
  let blockedSites = [];

  // --- HELPER FUNCTIONS ---
  const updateRulesInBackend = () => {
    chrome.runtime.sendMessage({ action: "updateRules", sites: blockedSites });
  };

  // --- IMAGE FEATURE LOGIC ---
  function loadUserPhoto() {
    chrome.storage.local.get(["userImage"], (result) => {
      if (result.userImage) {
        mainImage.src = result.userImage;
        removeBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
      } else {
        mainImage.src = "quote1.webp";
        removeBtn.style.display = "none";
        saveBtn.style.display = "none";
      }
    });
  }

  imageUpload.addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
    if (!selectedFile) return;
    mainImage.src = URL.createObjectURL(selectedFile);
    saveBtn.style.display = "inline-block";
    removeBtn.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      chrome.storage.local.set({ userImage: imageDataUrl }, () => {
        saveBtn.style.display = "none";
        removeBtn.style.display = "inline-block";
        alert("Your picture has been saved!");
      });
    };
    reader.readAsDataURL(selectedFile);
  });

  removeBtn.addEventListener("click", () => {
    chrome.storage.local.remove("userImage", () => {
      mainImage.src = "quote1.webp";
      removeBtn.style.display = "none";
      saveBtn.style.display = "none";
      imageUpload.value = "";
      selectedFile = null;
      alert("Your picture has been removed.");
    });
  });

  // --- SITE MANAGEMENT LOGIC ---
  function renderBlockedList() {
    blockedListUl.innerHTML = ""; // Clear the list
    blockedSites.forEach((site, index) => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";

      const siteSpan = document.createElement("span");
      siteSpan.textContent = site;

      const removeSiteBtn = document.createElement("button");
      removeSiteBtn.textContent = "✖";
      removeSiteBtn.style.backgroundColor = "transparent";
      removeSiteBtn.style.border = "none";
      removeSiteBtn.style.color = "red";
      removeSiteBtn.style.cursor = "pointer";
      removeSiteBtn.style.fontSize = "16px";

      removeSiteBtn.addEventListener("click", () => {
        removeSite(index);
      });

      li.appendChild(siteSpan);
      li.appendChild(removeSiteBtn);
      blockedListUl.appendChild(li);
    });
  }

  function removeSite(indexToRemove) {
    blockedSites = blockedSites.filter((_, index) => index !== indexToRemove);
    chrome.storage.local.set({ blockedSites: blockedSites }, () => {
      updateRulesInBackend();
      renderBlockedList();
    });
  }

  function addSite() {
    const newSite = newSiteInput.value.trim();
    if (newSite && !blockedSites.includes(newSite)) {
      blockedSites.push(newSite);
      chrome.storage.local.set({ blockedSites: blockedSites }, () => {
        updateRulesInBackend();
        renderBlockedList();
        newSiteInput.value = "";
        alert(`'${newSite}' has been added to your block list.`); // Added alert
      });
    }
  }

  addBtn.addEventListener("click", addSite);

  function loadBlockedSites() {
    chrome.storage.local.get(["blockedSites"], (result) => {
      if (result.blockedSites) {
        blockedSites = result.blockedSites;
        renderBlockedList();
      }
    });
  }

  // --- INITIALIZE THE PAGE ---
  loadUserPhoto();
  loadBlockedSites();
});
