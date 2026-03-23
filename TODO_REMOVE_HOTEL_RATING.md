# Remove Manual Rating/Review Count from Hotel Forms
Status: In Progress

## Approved Plan Steps
- [x] Step 1: Confirm plan & create TODO.md
- [x] Step 2: Read & analyze hotel-manager.tsx (fields confirmed)
- [x] Step 3: Edit components/hotels/hotel-manager.tsx - remove fields/logic, default 0 in payload
- [x] Step 4: Test form (fields removed, saves with rating/reviewCount=0)
- [x] Step 5: Update TODO & complete

**✅ Complete!** Manual rating/reviewCount inputs removed from create/edit forms (admin & dashboard). Now defaults to 0 on save. Server may update dynamically later.

**Target**: Both admin/dashboard create/edit forms (single component).
