# BuzzPlanners Deployment Guide for Hostinger

## Overview
BuzzPlanners is ready for deployment on Hostinger. The app has been optimized for production with responsive design, proper image handling, and responsive mobile layout. You have two deployment options.

## Pre-deployment Checklist
✅ Build successful (`npm run build`)
✅ All images use correct case-sensitive paths
✅ Responsive design implemented for mobile and desktop
✅ Dynamic routes working correctly
✅ Static assets optimized

## Hostinger Deployment Steps

### Option 1: Node.js Hosting (Recommended)

1. **Prepare the build files:**
   ```bash
   cd /e/BuzzPlanners
   npm run build
   ```

2. **Upload files to Hostinger:**
   - Upload the entire project folder to your Hostinger hosting account
   - Ensure all files including `.next`, `public`, `package.json` are uploaded
   - Upload `.env.local` file with your environment variables

3. **Configure Hostinger Node.js settings:**
   - Set Node.js version to 18.x or 20.x
   - Set startup file to: `server.js` or use the default Next.js startup
   - Set the PORT environment variable (usually provided by Hostinger)

4. **Install dependencies on Hostinger:**
   ```bash
   npm install --production
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

### Option 2: Static Export (Alternative)

If you prefer static hosting, you can use static export with some limitations:

1. **Enable static export:**
   - Uncomment `output: 'export'` in `next.config.ts`
   - Convert dynamic routes to static pages if needed

2. **Build static files:**
   ```bash
   npm run build
   ```

3. **Upload the `out` folder contents to your hosting root directory**

## Environment Variables

Make sure to set these environment variables on Hostinger:

```
NODE_ENV=production
PORT=3000
# Add your database connection strings and API keys here
```

## Post-deployment Verification

1. **Test all pages:**
   - Home page: `/`
   - Flight search: `/flight-search`
   - Travel packages: `/travel-packages`
   - Travel package details: `/travel-packages/1`
   - Dashboard: `/dashboard`

2. **Verify responsive design:**
   - Test on mobile devices
   - Check tablet and desktop layouts
   - Verify filter sidebars toggle correctly

3. **Check images:**
   - All images load correctly
   - Logo displays properly
   - Card images show without errors

4. **Test functionality:**
   - Search forms work
   - Filters function properly
   - Navigation works
   - Mobile menu toggles

## Troubleshooting

### Common Issues:

1. **Images not loading:**
   - Check file case sensitivity
   - Verify image paths in `/public` folder

2. **Build errors:**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

3. **Responsive issues:**
   - Clear browser cache
   - Test on actual devices
   - Check CSS media queries

### Performance Optimization:

1. **Image optimization:**
   - Images are set to `unoptimized: true` for compatibility
   - Consider using WebP format for better compression

2. **Bundle optimization:**
   - Current build size is optimized
   - First Load JS is within acceptable limits

## File Structure for Deployment

```
BuzzPlanners/
├── .next/                 # Build output
├── public/               # Static assets
├── src/                  # Source code
├── package.json         # Dependencies
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── .env.local          # Environment variables
```

## Support

For additional support:
- Check Hostinger's Node.js hosting documentation
- Ensure your hosting plan supports Node.js applications
- Monitor server logs for any runtime errors

---

**Status:** ✅ Ready for deployment
**Last Updated:** December 2024
**Node.js Version:** 18.x or 20.x recommended
