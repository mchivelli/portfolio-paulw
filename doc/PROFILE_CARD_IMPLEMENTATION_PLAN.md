# Implementation Plan - Profile Card

## Goal Description
Add a `ProfileCard` component to the landing page (`App.tsx`), replacing the existing portrait with a new interactive 3D component. The card will display the user's name, title, and handle, and will use the existing `/portrait2.webp` image.

## Proposed Changes

### UI Components
#### [NEW] [src/components/ui/ProfileCard.tsx](file:///c:/Users/paulm/Desktop/Projects/Website/pers-portfolioV2.1/portfolio-paulw/src/components/ui/ProfileCard.tsx)
- Create new file with the user-provided code for `ProfileCard`.

### Landing Page
#### [MODIFY] [src/App.tsx](file:///c:/Users/paulm/Desktop/Projects/Website/pers-portfolioV2.1/portfolio-paulw/src/App.tsx)
- Import `ProfileCard` from `./components/ui/ProfileCard`.
- Replace the existing `div.portrait-container` (and surrounding markup as needed) with the `<ProfileCard />` component.
- Configure props:
    - `name` from `t('hero.name')` (or hardcoded if translation not easily accessible in the component call, but `t` is available in `App.tsx`)
    - `title`: "Full Stack Developer" (or derive from `t('hero.title')`)
    - `handle`: "paulwallner" (placeholder, will use reasonable default or check for handle)
    - `avatarUrl`: `"/portrait1.png"`
    - `customInnerGradient`: `"linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"` (as requested)
    - `behindGlowColor`: `"rgba(125, 190, 255, 0.67)"`
    - `showUserInfo`: `false` (as requested)
    - Ensure it is responsive (add container sizing if needed).

## Verification Plan

### Manual Verification
1.  Start the development server (`npm run dev`).
2.  Open the landing page in a browser (`http://localhost:5173`).
3.  Verify the `ProfileCard` appears in the Hero section.
4.  Check hover effects (tilt).
5.  Check mobile responsiveness by resizing the browser window.
6.  Capture screenshots of Desktop and Mobile views.
