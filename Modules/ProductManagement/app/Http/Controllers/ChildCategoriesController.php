<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Modules\ProductManagement\Http\Requests\ChildCategoryRequest;
use Modules\ProductManagement\Models\ChildCategory;
use Modules\ProductManagement\Models\SubCategory;
use Yajra\DataTables\Facades\DataTables;

class ChildCategoriesController extends Controller
{
    /**
     * Display listing page for Child Categories.
     * Passes active SubCategories (with their parent Category) to the blade view for dropdown selection.
     */
    public function index()
    {
        // Fetch all active sub-categories with parent category for dropdown select inputs
        $subCategories = SubCategory::with('category')
            ->orderBy('sort_order', 'asc')
            ->get();

        return view('productmanagement::child-categories', compact('subCategories'));
    }

    /**
     * Resequence sort orders so they are strictly 1, 2, 3, 4... without gaps.
     */
    private function resequenceOrders()
    {
        $childCategories = ChildCategory::orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();

        foreach ($childCategories as $index => $child) {
            $expected = $index + 1;
            if ($child->sort_order != $expected) {
                $child->sort_order = $expected;
                $child->saveQuietly();
            }
        }
    }

    /**
     * Fetch DataTables JSON data for Child Categories list.
     * Supports optional filtering by sub_category_id.
     */
    public function getData(Request $request)
    {
        $this->resequenceOrders();

        $subCategoryId = $request->input('sub_category_id');

        // Eager load subCategory and parent category to prevent N+1 queries
        $query = ChildCategory::with(['subCategory.category'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc');

        if ($request->filled('sub_category_id')) {
            $query->where('sub_category_id', $request->input('sub_category_id'));
        }

        return DataTables::of($query)
            ->addColumn('child_category_image', function ($row) {
                // Returns full image URL if file exists, else null
                $imagePath = !empty($row->image) ? ltrim($row->image, '/') : null;
                return ($imagePath && file_exists(public_path($imagePath))) ? asset($imagePath) : null;
            })
            ->addColumn('sub_category_name', function ($row) {
                // Name of the parent Sub Category
                return $row->subCategory ? $row->subCategory->name_en : '—';
            })
            ->addColumn('category_name', function ($row) {
                // Name of the top-level Category (via subCategory)
                return ($row->subCategory && $row->subCategory->category) ? $row->subCategory->category->name_en : '—';
            })
            ->make(true);
    }

    /**
     * Store a newly created Child Category or update an existing one in database.
     */
    public function store(ChildCategoryRequest $request)
    {
        $childCategoryId = $request->input('child_category_id');

        if ($childCategoryId) {
            // Update existing child category
            $childCategory = ChildCategory::findOrFail($childCategoryId);
            $message       = 'Child Category updated successfully.';
        } else {
            // Create new child category
            $childCategory             = new ChildCategory();
            $maxOrder                  = ChildCategory::max('sort_order') ?? 0;
            $childCategory->sort_order = $maxOrder + 1;
            $childCategory->status     = 1; // Default status active
            $message                   = 'Child Category created successfully.';
        }

        // Assign input values to model fields
        $childCategory->sub_category_id = $request->input('sub_category_id');
        $childCategory->name_en         = $request->input('childCategoryName_en');
        $childCategory->name_ar         = $request->input('childCategoryName_ar');

        // Handle Image upload
        if ($request->hasFile('memberPhoto')) {
            // Delete existing old image file if updating
            $oldImagePath = !empty($childCategory->image) ? ltrim($childCategory->image, '/') : null;
            if ($childCategoryId && $oldImagePath && file_exists(public_path($oldImagePath))) {
                File::delete(public_path($oldImagePath));
            }

            $image           = $request->file('memberPhoto');
            $imageName       = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/child-categories');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $image->move($destinationPath, $imageName);
            $childCategory->image = 'uploads/child-categories/' . $imageName;
        }

        $childCategory->save();

        // Resequence sort orders
        $this->resequenceOrders();

        if (!empty($childCategory->image)) {
            $childCategory->image_url = asset(ltrim($childCategory->image, '/'));
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $childCategory,
        ]);
    }

    /**
     * Show/Fetch data for editing a specific Child Category.
     */
    public function edit($id)
    {
        $childCategory = ChildCategory::findOrFail($id);
        $imagePath     = !empty($childCategory->image) ? ltrim($childCategory->image, '/') : null;
        $childCategory->image_url = ($imagePath && file_exists(public_path($imagePath))) ? asset($imagePath) : null;

        return response()->json(['success' => true, 'data' => $childCategory]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ChildCategoryRequest $request, $id)
    {
        return $this->store($request);
    }

    /**
     * Delete a Child Category record permanently/soft delete and remove image file.
     */
    public function destroy($id)
    {
        $childCategory = ChildCategory::findOrFail($id);

        // Delete uploaded image file from server directory if exists
        $imagePath = !empty($childCategory->image) ? ltrim($childCategory->image, '/') : null;
        if ($imagePath && file_exists(public_path($imagePath))) {
            File::delete(public_path($imagePath));
        }

        $childCategory->delete();
        $this->resequenceOrders();

        return response()->json([
            'success' => true,
            'message' => 'Child Category deleted successfully.',
        ]);
    }

    /**
     * Toggle Child Category active (1) / inactive (0) status.
     */
    public function toggleStatus($id)
    {
        $childCategory         = ChildCategory::findOrFail($id);
        $childCategory->status = $childCategory->status ? 0 : 1;
        $childCategory->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'status'  => $childCategory->status,
        ]);
    }

    /**
     * Reorder Child Category position (up or down).
     */
    public function reorder(Request $request, $id)
    {
        $this->resequenceOrders();

        $direction     = $request->input('direction', 'up');
        $childCategory = ChildCategory::findOrFail($id);
        $currentOrder  = $childCategory->sort_order;

        if ($direction === 'up' && $currentOrder > 1) {
            $previous = ChildCategory::where('sort_order', $currentOrder - 1)->first();
            if ($previous) {
                $childCategory->sort_order = $currentOrder - 1;
                $previous->sort_order      = $currentOrder;
                $childCategory->saveQuietly();
                $previous->saveQuietly();
            }
        } elseif ($direction === 'down') {
            $next = ChildCategory::where('sort_order', $currentOrder + 1)->first();
            if ($next) {
                $childCategory->sort_order = $currentOrder + 1;
                $next->sort_order          = $currentOrder;
                $childCategory->saveQuietly();
                $next->saveQuietly();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Child Category reordered successfully.',
        ]);
    }
}
