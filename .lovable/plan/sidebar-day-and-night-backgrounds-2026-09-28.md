# Sidebar Day and Night Backgrounds

## What will change
- Add a bright coastal-resort sunrise image behind the sidebar in Day mode.
- Add a softly illuminated sunset/twilight resort image behind the sidebar in Night mode.
- Use separate theme-aware overlays so navigation remains readable without making Night mode overly dark.
- Keep the current sidebar layout, controls, theme switching, and mobile drawer behavior unchanged.

## Technical details
- Generate and bundle two coordinated resort images for the sidebar.
- Add semantic sidebar image and overlay tokens for both themes.
- Verify the sidebar in both themes on desktop and mobile, including text contrast and preview errors.
