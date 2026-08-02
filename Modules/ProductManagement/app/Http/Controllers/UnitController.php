<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\ProductManagement\Http\Requests\UnitRequest;
use Modules\ProductManagement\Models\Unit;
use Yajra\DataTables\Facades\DataTables;

/**
 * UnitController — Unit CRUD Operations
 *
 * ഈ controller unit-ന്റെ create, read, update, delete operations handle ചെയ്യുന്നു.
 * Product-ൽ unit assign ചെയ്യാൻ (e.g., KG, Piece, Litre) ഈ module ഉപയോഗിക്കും.
 *
 * Route prefix : /product-management/units
 *
 * Functions:
 *   index()          → List page return ചെയ്യുന്നു
 *   resequenceOrders() → Sort order gap fix ചെയ്യുന്നു (internal)
 *   getData()        → DataTable JSON return ചെയ്യുന്നു
 *   store()          → Create or Update ചെയ്യുന്നു
 *   show()           → Single record return ചെയ്യുന്നു
 *   edit()           → Edit data return ചെയ്യുന്നു
 *   update()         → store()-ലേക്ക് delegate ചെയ്യുന്നു
 *   destroy()        → Delete ചെയ്യുന്നു
 *   toggleStatus()   → Active/Inactive toggle ചെയ്യുന്നു
 *   reorder()        → Sort order up/down ചെയ്യുന്നു
 */
class UnitController extends Controller
{
    // ============================================================
    // INDEX
    // ============================================================

    /**
     * Display the units listing page.
     *
     * Input  : None
     * Output : 'productmanagement::units' blade view return ചെയ്യുന്നു.
     */
    public function index()
    {
        return view('productmanagement::units');
    }

    // ============================================================
    // PRIVATE HELPER
    // ============================================================

    /**
     * Resequence sort_order values so they are 1, 2, 3, 4... without gaps.
     *
     * Input  : None (database-ൽ നിന്ന് directly read ചെയ്യുന്നു)
     * Output : None (database silently update ചെയ്യുന്നു)
     *
     * ഉദ്ദേശ്യം: Delete / Move ചെയ്ത ശേഷം sort_order-ൽ gaps വരരുത്.
     *           ഉദാ: 1, 2, 4 → 1, 2, 3 ആക്കി fix ചെയ്യുന്നു.
     */
    private function resequenceOrders()
    {
        $units = Unit::orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();
        foreach ($units as $index => $unit) {
            $expectedOrder = $index + 1;
            if ($unit->sort_order != $expectedOrder) {
                $unit->sort_order = $expectedOrder;
                $unit->saveQuietly(); // Events trigger ചെയ്യാതെ save
            }
        }
    }

    // ============================================================
    // GET DATA (DataTable)
    // ============================================================

    /**
     * Return JSON data for DataTables (AJAX).
     *
     * Input  : Request $request → DataTable-ൽ നിന്ന് ഉള്ള AJAX request
     * Output : JSON response with columns:
     *            - id
     *            - name_en    (English name)
     *            - name_ar    (Arabic name)
     *            - short_name (Abbreviation)
     *            - status     (0 or 1)
     *            - sort_order (Display position)
     *
     * URL    : GET /product-management/units
     */
    public function getData(Request $request)
    {
        // Sort order gap fix ചെയ്ത ശേഷം data fetch ചെയ്യുന്നു
        $this->resequenceOrders();

        // sort_order ascending ആയി units fetch ചെയ്യുന്നു
        // is_deleted = 1 ആയ rows DataTable-ൽ കാണിക്കില്ല (soft deleted)
        $units = Unit::query()->where('is_deleted', 0)->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        return DataTables::of($units)
            ->addColumn('name_en', function ($row) {
                // English name column return ചെയ്യുന്നു
                return $row->name_en;
            })
            ->addColumn('name_ar', function ($row) {
                // Arabic name column return ചെയ്യുന്നു
                return $row->name_ar;
            })
            ->addColumn('short_name', function ($row) {
                // Short name or dash return ചെയ്യുന്നു
                return $row->short_name ?? '—';
            })
            ->make(true);
    }

    // ============================================================
    // STORE (Create + Update)
    // ============================================================

    /**
     * Store a newly created or update existing unit in the database.
     *
     * Input (from UnitRequest form):
     *   - unitName_en : string (required) → English name
     *   - unitName_ar : string (required) → Arabic name
     *   - short_name  : string (optional) → Abbreviation
     *   - unit_id     : integer (optional) → ID ഉണ്ടെങ്കിൽ update, ഇല്ലെങ്കിൽ create
     *
     * Output : JSON response:
     *   { success: true, message: "...", data: { unit object } }
     *
     * URL    : POST /product-management/units/store
     */
    public function store(UnitRequest $request)
    {
        // unit_id ഉണ്ടെങ്കിൽ → update, ഇല്ലെങ്കിൽ → create
        $unitId = $request->input('unit_id');

        if ($unitId) {
            // Existing unit update ചെയ്യുന്നു
            $unit    = Unit::findOrFail($unitId);
            $message = 'Unit updated successfully.';
        } else {
            // പുതിയ unit create ചെയ്യുന്നു
            $unit             = new Unit();
            $maxOrder         = Unit::max('sort_order') ?? 0;
            $unit->sort_order = $maxOrder + 1; // List-ന്റെ end-ൽ add ചെയ്യുന്നു
            $unit->status     = 0;             // Default: Inactive
            $message          = 'Unit created successfully.';
        }

        // Form values unit object-ൽ assign ചെയ്യുന്നു
        $unit->name_en    = $request->input('unitName_en');
        $unit->name_ar    = $request->input('unitName_ar');
        $unit->short_name = $request->input('short_name');

        // Database-ൽ save ചെയ്യുന്നു
        $unit->save();

        // Gap fix ചെയ്യുന്നു
        $this->resequenceOrders();

        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $unit,
        ]);
    }

    // ============================================================
    // SHOW
    // ============================================================

    /**
     * Display the specified unit's data.
     *
     * Input  : $id → URL-ൽ നിന്ന് unit-ന്റെ ID
     * Output : JSON response:
     *   { success: true, data: { unit object } }
     *
     * URL    : GET /product-management/units/{id}
     */
    public function show($id)
    {
        // ID ഉപയോഗിച്ച് unit fetch ചെയ്യുന്നു — ഇല്ലെങ്കിൽ 404 throw ചെയ്യുന്നു
        $unit = Unit::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $unit,
        ]);
    }

    // ============================================================
    // EDIT
    // ============================================================

    /**
     * Return the unit's data for the edit modal/form.
     *
     * Input  : $id → URL-ൽ നിന്ന് unit-ന്റെ ID
     * Output : JSON response:
     *   { success: true, data: { id, name_en, name_ar, short_name, status, sort_order } }
     *
     * URL    : GET /product-management/units/edit/{id}
     */
    public function edit($id)
    {
        // ID ഉപയോഗിച്ച് unit fetch ചെയ്യുന്നു
        $unit = Unit::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $unit,
        ]);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Update the specified unit (delegates to store()).
     *
     * Input  : UnitRequest $request, $id → unit ID
     * Output : store()-ന്റെ JSON response
     *
     * URL    : POST /product-management/units/store (with unit_id hidden field)
     */
    public function update(UnitRequest $request, $id)
    {
        // Store method തന്നെ create/update handle ചെയ്യുന്നു
        return $this->store($request);
    }

    // ============================================================
    // DESTROY
    // ============================================================

    /**
     * Remove the specified unit from the database.
     *
     * Input  : $id → URL-ൽ നിന്ന് unit-ന്റെ ID
     * Output : JSON response:
     *   { success: true, message: "Unit deleted successfully." }
     *
     * URL    : DELETE /product-management/units/delete/{id}
     */
    public function destroy($id)
    {
        // ID ഉപയോഗിച്ച് unit fetch ചെയ്യുന്നു — ഇല്ലെങ്കിൽ 404
        $unit = Unit::findOrFail($id);

        // Hard delete ഇല്ല — is_deleted = 1 set ചെയ്‌ത് soft delete ചെയ്യുന്നു
        // DataTable query-ൽ is_deleted = 0 filter ഉള്ളതിനാൽ ഈ row DataTable-ൽ കാണില്ല
        $unit->is_deleted = 1;
        $unit->save();

        // Delete ചെയ്ത ശേഷം sort_order gap fix ചെയ്യുന്നു
        $this->resequenceOrders();

        return response()->json([
            'success' => true,
            'message' => 'Unit deleted successfully.',
        ]);
    }

    // ============================================================
    // TOGGLE STATUS
    // ============================================================

    /**
     * Toggle the unit's status between Active (1) and Inactive (0).
     *
     * Input  : $id → URL-ൽ നിന്ന് unit-ന്റെ ID
     * Output : JSON response:
     *   { success: true, message: "Status updated successfully.", status: 0|1 }
     *
     * URL    : POST /product-management/units/status/{id}
     */
    public function toggleStatus($id)
    {
        // Unit fetch ചെയ്യുന്നു
        $unit = Unit::findOrFail($id);

        // Current status-ൽ നിന്ന് opposite value set ചെയ്യുന്നു
        // status = 1 ആണെങ്കിൽ → 0, status = 0 ആണെങ്കിൽ → 1
        $unit->status = $unit->status ? 0 : 1;
        $unit->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'status'  => $unit->status, // New status value return ചെയ്യുന്നു
        ]);
    }

    // ============================================================
    // REORDER
    // ============================================================

    /**
     * Move a unit up or down in the sort order.
     *
     * Input:
     *   $id              → URL-ൽ നിന്ന് unit-ന്റെ ID
     *   Request direction → 'up' or 'down' (default: 'up')
     *
     * Output : JSON response:
     *   { success: true, message: "Unit reordered successfully." }
     *
     * Logic:
     *   'up'   → Current unit-ന്റെ sort_order - 1 ആക്കുന്നു, previous-ന്റേത് + 1 ആക്കുന്നു
     *   'down' → Current unit-ന്റെ sort_order + 1 ആക്കുന്നു, next-ന്റേത് - 1 ആക്കുന്നു
     *
     * URL    : POST /product-management/units/reorder/{id}
     */
    public function reorder(Request $request, $id)
    {
        // Reorder ചെയ്യുന്നതിന് മുമ്പ് gap fix ചെയ്യുന്നു
        $this->resequenceOrders();

        // Direction: 'up' or 'down' — default 'up'
        $direction    = $request->input('direction', 'up');
        $unit         = Unit::findOrFail($id);
        $currentOrder = $unit->sort_order;

        if ($direction === 'up' && $currentOrder > 1) {
            // മുകളിലേക്ക് move ചെയ്യാൻ → previous unit-മായി swap ചെയ്യുന്നു
            $previous = Unit::where('sort_order', $currentOrder - 1)->first();
            if ($previous) {
                $unit->sort_order     = $currentOrder - 1;
                $previous->sort_order = $currentOrder;
                $unit->saveQuietly();
                $previous->saveQuietly();
            }
        } elseif ($direction === 'down') {
            // താഴേക്ക് move ചെയ്യാൻ → next unit-മായി swap ചെയ്യുന്നു
            $next = Unit::where('sort_order', $currentOrder + 1)->first();
            if ($next) {
                $unit->sort_order = $currentOrder + 1;
                $next->sort_order = $currentOrder;
                $unit->saveQuietly();
                $next->saveQuietly();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Unit reordered successfully.',
        ]);
    }
}
