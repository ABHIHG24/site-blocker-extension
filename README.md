# Site Blocker Chrome Extension

A customizable and user-friendly Chrome extension designed to help you stay focused by blocking distracting websites. Personalize your blocking experience with a custom image on the block page and easily manage your block list through an intuitive interface.

## ✨ Features

* **🚫 Dynamic Website Blocking:** Easily add or remove websites to your block list on the fly.
* **🎨 Custom Block Page:** When you visit a blocked site, you're redirected to a clean, user-friendly page.
* **🖼️ Personalized Image:** Upload, save, and remove a custom image or avatar on the block page to make it your own. The extension defaults to a motivational quote if no image is set.
* **🔧 Easy Management:** Manage your block list directly from the extension's popup or from the block page itself.
* **💾 Persistent Storage:** Your custom image and list of blocked sites are saved locally using `chrome.storage`, so your settings are always remembered.
* **🚀 Modern & Efficient:** Built using Manifest V3 and the `declarativeNetRequest` API for fast, efficient, and privacy-preserving blocking.

## 💻 Tech Stack

* **Platform:** Chrome Extension (Manifest V3)
* **Frontend:** React, Vite, HTML5, CSS3
* **Core Logic:** JavaScript (ES6+)
* **APIs:** Chrome Extension APIs (`declarativeNetRequest`, `storage`, `runtime`)

### For Developers (from source code)
1.  Clone this repository to your local machine:
    ```sh
    git clone https://github.com/ABHIHG24/site-blocker-extension.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd site-blocker-extension
    ```
3.  Install the necessary dependencies:
    ```sh
    npm install
    ```
4.  Build the project. This will create a `dist` folder with the ready-to-use extension files.
    ```sh
    npm run build
    ```
5.  Load the extension in Chrome:
    * Open Google Chrome and navigate to `chrome://extensions`.
    * Enable **"Developer mode"** in the top-right corner.
    * Click on the **"Load unpacked"** button.
    * Select the `dist` folder from this project.

## 🛠️ How It Works

This extension uses the modern **Manifest V3** platform for enhanced security and performance.
* **Blocking:** Website blocking is handled by the **`chrome.declarativeNetRequest` API**. This is a powerful and privacy-friendly way to block network requests without the extension needing to read the content of web pages. Rules are defined and updated dynamically based on the user's block list.
* **Data Storage:** The list of blocked websites and the user's custom image (saved as a Data URL) are stored persistently using the **`chrome.storage.local` API**.
* **User Interface:** The extension's popup is built as a modern web application using **React** and bundled with **Vite**. The block page is built with vanilla HTML, CSS, and JavaScript.
