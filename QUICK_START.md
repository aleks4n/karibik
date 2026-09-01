# 🛥️ Karibik Saison - Quick Start Guide

Your map is now configured for **real-time collaboration** with Firebase! Here's how to get started.

## Step 1: Create a Firebase Project (5 minutes)

Follow the detailed guide in `FIREBASE_SETUP.md` to:
1. Create a Firebase project
2. Enable Realtime Database
3. Enable Email/Password Authentication
4. Get your Firebase configuration

## Step 2: Add Your Firebase Config

Open `/public/firebase-config.js` and replace the placeholder values with your actual Firebase config from Step 1.

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    // ... other placeholders
};
```

**After:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD...",
    authDomain: "karibik-saison.firebaseapp.com",
    // ... actual values from Firebase Console
};
```

## Step 3: Test Locally

Your app is already running at `http://localhost:3000`

1. Open in your browser
2. Sign in with any email and password (creates account automatically)
3. Create a sailing path on the map
4. Open another browser tab/window
5. Sign in with **the same email** 
6. See your path appear instantly in the second tab! ✨

## Step 4: Share with Friends

Once deployed (see below), send them the URL. They:
1. Visit your deployed app
2. Sign in with the **same email you use**
3. All paths sync in real-time!

## Features

✅ **Real-time Sync** - Changes appear instantly for all users  
✅ **Authentication** - Each email gets their own account  
✅ **Shared Paths** - Same email = shared paths across all devices  
✅ **Persistent** - Paths saved in Firebase, not just local storage  
✅ **Easy Collaboration** - No complex setup needed  

## Deployment (Optional)

To make it accessible online, deploy to:

### Option A: Heroku (Easiest)
See "Step 8" in `FIREBASE_SETUP.md`

### Option B: Railway (Modern Alternative)
1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Deploy with one click

### Option C: Replit (Fastest)
1. Create a Replit account
2. Upload your files
3. Click "Run"

## Testing Checklist

- [ ] Firebase config is valid (no "Firebase is not defined" errors)
- [ ] Can sign in with email/password
- [ ] Can create a path on the map
- [ ] See path appear in another browser tab with same email
- [ ] Can delete paths
- [ ] Paths persist after page refresh

## Troubleshooting

**"Firebase is not defined"**
- Check `firebase-config.js` is loaded before `app.js`
- Verify Firebase SDK URLs are correct

**"Cannot sign in"**
- Check Authentication is enabled in Firebase Console
- Try different email/password combination
- Check browser console for errors (F12)

**"Paths not syncing"**
- Verify Realtime Database is in test mode
- Check databaseURL in config matches Firebase Console
- Look for red errors in browser console

**"My paths disappeared"**
- Firebase test mode expires after 30 days
- Update security rules in Firebase Console (see FIREBASE_SETUP.md)

## Need Help?

1. Check `FIREBASE_SETUP.md` for detailed instructions
2. Visit Firebase docs: https://firebase.google.com/docs/database
3. Check browser console for error messages (F12)

## Next Steps

- 🌍 Deploy to make it live online
- 👥 Add your friends with the same email
- 🗺️ Start planning your sailing adventures!

Happy sailing! ⛵
