---
description: How to push your project to GitHub
---

# Push Project to GitHub

Follow these steps to upload your code to GitHub.

## 1. Create a Repository on GitHub Website
1.  Go to [github.com/new](https://github.com/new) and sign in.
2.  **Repository name**: Enter `skin-cancer-detection` (or any name you like).
3.  **Description**: Adding "AI-powered Skin Cancer Detector App" is optional but recommended.
4.  **Public/Private**: Choose whether you want your code to be visible to everyone or just you.
5.  **Initialize**: Do **NOT** check "Add a README file", "Add .gitignore", or "Choose a license". You want an empty repository.
6.  Click **Create repository**.
7.  Copy the HTTPS URL provided (it looks like `https://github.com/your-username/skin-cancer-detection.git`).

## 2. Initialize Git Locally (If not already done)
// turbo
1.  Initialize git in your project folder:
    ```bash
    git init
    ```

## 3. Configure User (If first time using Git)
// turbo
2.  Set your username and email (replace with your actual GitHub details):
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your-email@example.com"
    ```
    *(Note: You can skip this if you've done it before)*

## 4. Stage and Commit Files
// turbo
3.  Add all your project files to git:
    ```bash
    git add .
    ```
// turbo
4.  Commit the changes:
    ```bash
    git commit -m "Initial commit of Skin Cancer Detection App"
    ```

## 5. Link to GitHub and Push
5.  Link your local folder to the GitHub repository you created (Replace URL with your own):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/skin-cancer-detection.git
    ```
6.  Rename default branch to main:
    ```bash
    git branch -M main
    ```
7.  Push your code:
    ```bash
    git push -u origin main
    ```
    *(You may be asked to sign in to GitHub in a browser window)*

## 6. Verify
8.  Refresh your GitHub repository page. You should see all your files!
