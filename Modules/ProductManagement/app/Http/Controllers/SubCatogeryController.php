<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Modules\ProductManagement\Http\Requests\SubCategoryRequest;
use Modules\ProductManagement\Models\Category;
use Modules\ProductManagement\Models\SubCategory;
use Yajra\DataTables\Facades\DataTables;

class SubCatogeryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::orderBy('sort_order', 'asc')->get();
        return view('productmanagement::Sub-catogery', compact('categories'));
    }

    /**
     * Resequence sort orders so they are strictly 1, 2, 3, 4... without gaps.
     */
    private function resequenceOrders()
    {
        $subCategories = SubCategory::orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();

        foreach ($subCategories as $index => $sub) {
            $expected = $index + 1;
            if ($sub->sort_order != $expected) {
                $sub->sort_order = $expected;
                $sub->saveQuietly();
            }
        }
    }

    /**
     * Get DataTable JSON Data.
     */
    public function getData(Request $request)
    {
        $this->resequenceOrders();

        $query = SubCategory::with('category')->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        return DataTables::of($query)
            ->addColumn('sub_category_image', function ($row) {
                $imagePath = !empty($row->image) ? ltrim($row->image, '/') : null;
                return ($imagePath && file_exists(public_path($imagePath))) ? asset($imagePath) : null;
            })
            ->addColumn('category_name', function ($row) {
                return $row->category ? $row->category->name_en : '—';
            })
            ->make(true);
    }

    /**
     * Store a newly created or update existing resource in storage.
     */
    public function store(SubCategoryRequest $request)
    {
        $subCategoryId = $request->input('sub_category_id');

        if ($subCategoryId) {
            $subCategory = SubCategory::findOrFail($subCategoryId);
            $message     = 'Sub Category updated successfully.';
        } else {
            $subCategory             = new SubCategory();
            $maxOrder                = SubCategory::max('sort_order') ?? 0;
            $subCategory->sort_order = $maxOrder + 1;
            $subCategory->status     = 1;
            $message                 = 'Sub Category created successfully.';
        }

        $subCategory->category_id = $request->input('category_id');
        $subCategory->name_en     = $request->input('subCategoryName_en');
        $subCategory->name_ar     = $request->input('subCategoryName_ar');

        if ($request->hasFile('memberPhoto')) {
            // Delete old image if updating
            $oldImagePath = !empty($subCategory->image) ? ltrim($subCategory->image, '/') : null;
            if ($subCategoryId && $oldImagePath && file_exists(public_path($oldImagePath))) {
                File::delete(public_path($oldImagePath));
            }

            $image           = $request->file('memberPhoto');
            $imageName       = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/sub-categories');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $image->move($destinationPath, $imageName);
            $subCategory->image = 'uploads/sub-categories/' . $imageName;
        }

        $subCategory->save();
        $this->resequenceOrders();

        if (!empty($subCategory->image)) {
            $subCategory->image_url = asset(ltrim($subCategory->image, '/'));
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $subCategory,
        ]);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $subCategory = SubCategory::with('category')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $subCategory]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $imagePath   = !empty($subCategory->image) ? ltrim($subCategory->image, '/') : null;
        $subCategory->image_url = ($imagePath && file_exists(public_path($imagePath))) ? asset($imagePath) : null;

        return response()->json(['success' => true, 'data' => $subCategory]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SubCategoryRequest $request, $id)
    {
        return $this->store($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $imagePath = !empty($subCategory->image) ? ltrim($subCategory->image, '/') : null;
        if ($imagePath && file_exists(public_path($imagePath))) {
            File::delete(public_path($imagePath));
        }

        $subCategory->delete();
        $this->resequenceOrders();

        return response()->json([
            'success' => true,
            'message' => 'Sub Category deleted successfully.',
        ]);
    }

    /**
     * Toggle status active / inactive.
     */
    public function toggleStatus($id)
    {
        $subCategory         = SubCategory::findOrFail($id);
        $subCategory->status = $subCategory->status ? 0 : 1;
        $subCategory->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'status'  => $subCategory->status,
        ]);
    }

    /**
     * Reorder sub-category position.
     */
    public function reorder(Request $request, $id)
    {
        $this->resequenceOrders();

        $direction    = $request->input('direction', 'up');
        $subCategory  = SubCategory::findOrFail($id);
        $currentOrder = $subCategory->sort_order;

        if ($direction === 'up' && $currentOrder > 1) {
            $previous = SubCategory::where('sort_order', $currentOrder - 1)->first();
            if ($previous) {
                $subCategory->sort_order = $currentOrder - 1;
                $previous->sort_order    = $currentOrder;
                $subCategory->saveQuietly();
                $previous->saveQuietly();
            }
        } elseif ($direction === 'down') {
            $next = SubCategory::where('sort_order', $currentOrder + 1)->first();
            if ($next) {
                $subCategory->sort_order = $currentOrder + 1;
                $next->sort_order        = $currentOrder;
                $subCategory->saveQuietly();
                $next->saveQuietly();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Sub Category reordered successfully.',
        ]);
    }
}
