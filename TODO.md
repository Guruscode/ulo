# Property Location State/City Dropdown Implementation
Status: [0/8] - In Progress

## Steps:
- [ ] 1. Create lib/properties/nigeria-locations.ts with full 36 Nigeria states and major cities per state (~10-20 each).
- [ ] 2. Update components/properties/property-manager.tsx: Add state/city to form; replace Input with cascade Selects; combine to location on save.
- [ ] 3. Update app/dashboard/add-property/page.tsx: Add state/city fields; replace location Input.
- [ ] 4. Update app/dashboard/edit-property/[id]/page.tsx: Add state/city fields; replace location Input; parse initial.
- [ ] 5. Update components/dashboard/properties-manager.tsx: Update modals with state/city; combine in mock.
- [ ] 6. Test cascade UI in all forms (state → cities).
- [ ] 7. Verify payloads/logs show "City, State".
- [ ] 8. Run `pnpm dev`; check dashboard/admin forms. Complete task.

