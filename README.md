# 🗺️ Karibik Saison

An interactive sailing route planning map with **real-time collaboration**, built with Leaflet.js, Express, and Firebase.

## ✨ Features

**Interactive Map:**
- 🔍 Zoom in/out with buttons or scroll wheel
- 🖱️ Pan and drag to explore the Caribbean
- 📍 Real-time coordinate display
- ⌨️ Keyboard shortcuts for navigation
- 📏 Scale control

**Sailing Routes:**
- ✏️ Create custom sailing paths by selecting start and end points
- 🎨 Choose custom colors for each route
- 📅 Set date ranges for your journeys
- 👥 Assign Skipper, Wachführer, and Crew members
- 💾 All routes saved automatically

**Collaboration:**
- 🌐 Real-time sync with Firebase
- 👫 Share routes with friends instantly
- 🔐 Secure authentication with email/password
- ☁️ Cloud-backed, never lose your data
- 📱 Works on any device with internet

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Google account (for Firebase - free)

### Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase (see QUICK_START.md for detailed guide):**
   - Create a Firebase project (free)
   - Get your Firebase config
   - Update `/public/firebase-config.js`

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

5. **Sign in and create paths!**

## How to Use

### Create a Sailing Path
1. Click **"✚ Create Path"** button
2. Click on the map to select start point (green)
3. Click again to select end point (red)
4. Form opens automatically
5. Fill in path details
6. Click **"Save Path"**

### View Path Details
- **Hover over** a path to see information
- **Click** a path to lock the popup
- Click **"Delete Path"** to remove it

### Keyboard Shortcuts
- `+` or `=`: Zoom in
- `-`: Zoom out
- `H`: Reset to home view
- `Esc`: Cancel path creation

### Share with Friends
1. Deploy app to the web (see QUICK_START.md)
2. Send them the URL
3. They sign in with **your same email**
4. All paths sync in real-time! 🎉

## Project Structure

```
karibik/
├── server.js                    # Express server
├── package.json                 # Dependencies
├── QUICK_START.md              # Quick start guide
├── FIREBASE_SETUP.md           # Detailed Firebase setup
├── public/
│   ├── index.html              # Main HTML
│   ├── style.css               # Styling
│   ├── app.js                  # Map and app logic
│   └── firebase-config.js      # Firebase credentials (create this)
└── README.md                    # This file
```

## Technologies

- **Frontend:** HTML5, CSS3, JavaScript, Leaflet.js
- **Backend:** Node.js, Express
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Auth
- **Maps:** OpenStreetMap

## Customization

### Change Initial Map View
Edit `/public/app.js`:
```javascript
const initialLat = 15;      // Latitude
const initialLng = -60;     // Longitude
const initialZoom = 4;      // Zoom level
```

### Change Map Tile Provider
Replace the tile layer URL in `/public/app.js` (currently OpenStreetMap)

### Add/Remove Cities
Edit the `cities` array in `/public/app.js`

## Deployment

Ready to make it live? Options:

### Heroku (Step-by-step in FIREBASE_SETUP.md)
```bash
heroku create karibik-saison
git push heroku main
```

### Railway (Modern & Easy)
1. Push to GitHub
2. Connect Railway to repo
3. One-click deploy

### Replit (Fastest)
Upload files and click "Run"

## Real-Time Sync

How collaboration works:

```
User A creates path → Firebase stores it
                    ↓
User B's app listening → Updates instantly
                    ↓
Path appears on User B's map ✨
```

All users with the **same email** share paths!

## Security Notes

- Test mode expires after 30 days (update rules in Firebase Console)
- For production, enable proper security rules
- Don't commit `firebase-config.js` with real keys
- Use `.gitignore` to exclude it

See FIREBASE_SETUP.md for production setup.

## Troubleshooting

**Paths not syncing?**
- Verify email is the same across users
- Check Firebase Realtime Database is enabled
- Look for errors in browser console (F12)

**Cannot sign in?**
- Check Authentication is enabled in Firebase
- Reset password in Firebase Console

**"Firebase is not defined"?**
- Verify `firebase-config.js` is updated
- Check Firebase SDK script tags loaded

See FIREBASE_SETUP.md for detailed troubleshooting.

## Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000 taken | Change PORT in `server.js` |
| No internet | Firebase needs internet connection |
| Test mode expired | Update security rules in Firebase |
| Paths disappear | Check Firebase Realtime Database settings |

## Future Features

- 🗺️ Multiple users on same view with cursors
- 📊 Route statistics (distance, time, etc.)
- 🎨 More customization options
- 📤 Export routes as files
- 🔔 Notifications for shared paths

## License

MIT

## Author

Created for collaborative sailing adventure planning! ⛵

---

**Ready to explore?** See QUICK_START.md for setup instructions.

