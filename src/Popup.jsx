import React, { useEffect, useState } from "react";

// Helper: update dynamic rules via background message
const updateDynamicRules = (sites) => {
  chrome.runtime.sendMessage({ action: "updateRules", sites }, (response) => {
    if (response && response.status === "ok") {
      console.log("Dynamic rules updated");
    } else {
      console.error("Error updating dynamic rules", response && response.error);
    }
  });
};

// Helper: refresh the current tab if its URL matches a blocked pattern
const refreshCurrentTabIfBlocked = (sites) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const currentUrl = tabs[0].url;
      // Remove wildcards for a basic match
      const isBlocked = sites.some((pattern) => {
        const cleanPattern = pattern.replace("*://", "").replace(/\*/g, "");
        return currentUrl.includes(cleanPattern);
      });
      if (isBlocked) {
        // Force navigation to your blocked page immediately
        chrome.tabs.update(tabs[0].id, {
          url: chrome.runtime.getURL("blocked.html"),
        });
      }
    }
  });
};

const Popup = () => {
  const [blockedSites, setBlockedSites] = useState([]);
  const [newSite, setNewSite] = useState("");

  // Helper: update localStorage, state, dynamic rules, and refresh tab if needed
  const updateSites = (sites) => {
    localStorage.setItem("blockedSites", JSON.stringify(sites));
    setBlockedSites(sites);
    updateDynamicRules(sites);
    refreshCurrentTabIfBlocked(sites);
  };

  // Load blocked sites from localStorage or default JSON on mount
  useEffect(() => {
    const stored = localStorage.getItem("blockedSites");
    if (stored) {
      const sites = JSON.parse(stored);
      setBlockedSites(sites);
    } else {
      fetch("/blockedSites.json")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.blocked) {
            localStorage.setItem("blockedSites", JSON.stringify(data.blocked));
            setBlockedSites(data.blocked);
            updateDynamicRules(data.blocked);
          }
        })
        .catch((error) =>
          console.error("Error loading default blocked sites:", error)
        );
    }
  }, []);

  // Add a new site manually
  const addSite = (site) => {
    if (!site) return;
    if (!blockedSites.includes(site)) {
      const newList = [...blockedSites, site];
      updateSites(newList);
    }
  };

  // Remove a site from the list
  const removeSite = (index) => {
    const newList = blockedSites.filter((_, i) => i !== index);
    updateSites(newList);
  };

  // Add the current active website
  const addCurrentWebsite = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        try {
          const urlObj = new URL(tabs[0].url);
          const domain = urlObj.hostname;
          // Create a pattern; you can adjust as needed
          const pattern = `*://${domain}/*`;
          addSite(pattern);
        } catch (err) {
          console.error("Invalid URL", err);
        }
      }
    });
  };

  // Enterprise-level inline styles
  const containerStyle = {
    maxWidth: "600px",
    width: "90%",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    margin: "20px auto",
  };

  const imageStyle = {
    maxWidth: "100%",
    height: "auto",
    marginBottom: "20px",
    borderRadius: "4px",
  };

  const linkStyle = {
    display: "inline-block",
    margin: "0 10px",
    textDecoration: "none",
    color: "#0073e6",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  };

  // Scrollable list style
  const listStyle = {
    listStyleType: "none",
    padding: 0,
    margin: "20px 0 0",
    textAlign: "left",
    maxHeight: "200px",
    overflowY: "auto",
  };

  const listItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const inputStyle = {
    padding: "8px",
    fontSize: "14px",
    flexGrow: 1,
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "#0073e6",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginLeft: "10px",
  };

  const removeBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
    fontSize: "16px",
  };

  // Row style for grouping elements in a row
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <img src="/quote1.webp" alt="Motivational Quote" style={imageStyle} />
      <h2>This site is blocked!</h2>
      <p>For more learning, visit:</p>
      <div>
        <a
          href="https://www.udemy.com/"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          Udemy
        </a>
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
        >
          YouTube
        </a>
      </div>
      <hr />
      <h3>Blocked Websites:</h3>
      <ul style={listStyle}>
        {blockedSites.map((site, index) => (
          <li key={index} style={listItemStyle}>
            {site}
            <button style={removeBtnStyle} onClick={() => removeSite(index)}>
              ✖
            </button>
          </li>
        ))}
      </ul>
      {/* Row for manually adding a site */}
      <div style={rowStyle}>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Add website (e.g. *.example.com)"
          style={inputStyle}
        />
        <button
          style={buttonStyle}
          onClick={() => {
            addSite(newSite);
            setNewSite("");
          }}
        >
          Add
        </button>
      </div>
      {/* Separate row for adding the current website */}
      <div style={{ ...rowStyle, justifyContent: "center" }}>
        <button style={buttonStyle} onClick={addCurrentWebsite}>
          Add Current Website
        </button>
      </div>
    </div>
  );
};

export default Popup;
