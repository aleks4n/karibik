# Firebase Setup Guide for Karibik Saison

This guide will help you set up Firebase for real-time collaboration on your sailing map. **No authentication needed!** 

Everyone who visits your app sees and shares the same sailing paths.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `karibik-saison` (or anything you prefer)
4. Click **"Continue"** → **"Continue"** → **"Create project"**
5. Wait for the project to be created

## Step 2: Enable Realtime Database

1. In the Firebase Console, go to **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Select your region (e.g., `europe-west1`)
4. Choose **"Start in test mode"** (allows read/write for everyone)
5. Click **"Enable"**

✅ That's it! You're done with Firebase setup.

⚠️ **Important**: Test mode expires after 30 days. For production, set up proper security rules.

## Step 3: Get Your Config

1. Go to **Project Settings** (gear icon at top)
2. Under **"Your apps"**, click **"Web"** (or add if not present)
3. You'll see a configuration object that looks like:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD...",
    authDomain: "karibik-saison.firebaseapp.com",
    databaseURL: "https://karibik-saison-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "karibik-saison",
    storageBucket: "karibik-saison.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
};
```

## Step 4: Add Config to Your App

1. Open `/public/firebase-config.js` in your editor
2. Replace the placeholder values with your actual Firebase config
3. Save the file

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

## Step 5: Run Your App

```bash
npm start
```

Open `http://localhost:3000` in your browser.

You should immediately see the map with **no login screen**! 🎉

## Step 6: Test It Out

1. **First user**: 
   - Open `http://localhost:3000`
   - Create a sailing path on the map
   
2. **Second user (different browser/device)**:
   - Open `http://localhost:3000`
   - See the path appear instantly in real-time!

3. **To test locally**:
   - Open `http://localhost:3000` in two browser tabs
   - Create a path in tab 1
   - See it appear instantly in tab 2 ✨

## Sharing with Friends

Once deployed (see below), share the URL with your friends:
1. They visit your deployed app
2. They see all shared paths in real-time
3. No signup needed!

## Step 7 (Optional): Deploy to Heroku

Make your app accessible online!

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a Heroku app:
   ```bash
   heroku create karibik-saison-app
   ```

4. Deploy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. Your app is live at: `https://karibik-saison-app.herokuapp.com`

Share this URL with your friends!

## Troubleshooting

### "Firebase is not defined"
- Make sure `firebase-config.js` is loaded BEFORE `app.js`
- Check your internet connection

### "Cannot connect to database"
- Verify Realtime Database URL is correct in `firebase-config.js`
- Make sure Database is in test mode
- Check browser console for errors (F12)

### "Test mode expired"
- Go to Realtime Database → Rules
- Replace with:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ This allows anyone to read/write (fine for shared collaborative map)

For more security, use:
```json
{
  "rules": {
    ".read": true,
    ".write": true,
    ".validate": "newData.isString() || newData.hasChildren(['id', 'title', 'startPoint', 'endPoint'])"
  }
}
```

## How It Works

```
User A creates path → Firebase stores in "shared/paths"
                    ↓
User B's app listening → Updates instantly
                    ↓
Path appears on User B's map ✨
```

All users share the same database - no accounts needed!

## Need Help?

Check Firebase docs: https://firebase.google.com/docs/database
