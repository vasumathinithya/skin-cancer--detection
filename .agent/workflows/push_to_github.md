---
description: How to push your project to GitHub
---

# Push Project to GitHub

I have already initialized your local repository and linked it to `https://github.com/vasumathinithya/skin-cancer-detection.git`.

## To Complete the Push:

Since GitHub requires you to sign in, please run this single command in your terminal:

```bash
git push -u origin main
```

*(You will be asked to sign in via browser or enter your GitHub credentials)*

## Troubleshooting

If you see an error like `remote origin already exists`:
```bash
git remote set-url origin https://github.com/vasumathinithya/skin-cancer-detection.git
git push -u origin main
```

If you see an error like `refusing to merge unrelated histories` (if the repo was not empty):
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```
