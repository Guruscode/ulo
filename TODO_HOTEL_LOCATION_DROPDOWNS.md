# Add Nigeria State/City Dropdowns to Hotel Forms
Status: [0/6]

## Steps:
- [ ] 1. Create TODO file.
- [x] 2. Read lib/properties/nigeria-locations.ts, property-manager.tsx for pattern.
- [x] 3. Update components/hotels/hotel-manager.tsx: Add state/city to HotelForm, cascade Selects replacing location Input, parse/combine in toFormState/toPayload.
- [x] 4. Verify imports, types.
- [x] 5. `pnpm dev`, test admin/dashboard hotel forms.
- [x] 6. Update TODO complete.

**✅ Complete!** Added Nigeria state/city cascade dropdowns to hotel create/edit forms. Location saved as "City, State". Reuses properties lib. Works in admin/dashboard.
