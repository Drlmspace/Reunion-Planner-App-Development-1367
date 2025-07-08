# Production Deployment Guide

## Building for Production

The app has been built for production. The `dist` folder contains all the optimized files ready for deployment.

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. **Drag & Drop Deployment:**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area
   - Your app will be live instantly with a random URL
   - You can customize the domain name

2. **Git Integration (Advanced):**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Auto-deploys on every commit

### Option 2: Vercel (Free)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your project
   - Set build command: `npm run build`
   - Set output directory: `dist`

### Option 3: GitHub Pages (Free)

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting (Free)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

3. **Deploy:**
   ```bash
   firebase deploy
   ```

## Production Optimizations Included

✅ **Code Splitting**: Vendor libraries separated for better caching
✅ **Minification**: JavaScript and CSS are minified
✅ **Tree Shaking**: Unused code is removed
✅ **Asset Optimization**: Images and assets are optimized
✅ **Source Maps**: Available for debugging
✅ **Hash-based Caching**: Files have hash names for cache busting
✅ **Gzip Compression**: Ready for server compression

## Environment Variables for Production

If you want to connect to a real Supabase backend in production:

1. **For Netlify/Vercel**: Set environment variables in the dashboard:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **For Static Hosting**: Create a `.env.production` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Performance Tips

- The app uses HashRouter, so it works on any static hosting
- All routes are client-side, no server configuration needed
- Demo mode works offline after first load
- Admin login: Username: `GameMicey`, Password: `RUReady25?`

## Security Notes

- No sensitive data is exposed in the client
- Admin credentials are for demo purposes only
- All user data in demo mode is stored locally
- Production should use real authentication via Supabase

## Testing Production Build Locally

```bash
npm run preview
```

This starts a local server with the production build to test before deployment.