<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Modules\ProductManagement\Http\Requests\CategoryRequest;
use Modules\ProductManagement\Models\Category;
use Yajra\DataTables\Facades\DataTables;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('productmanagement::Categories-list');
    }

    /**
     * Resequence sort orders so they are strictly 1, 2, 3, 4... without gaps.
     */
    private function resequenceOrders()
    {
        $categories = Category::orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();
        foreach ($categories as $index => $cat) {
            $expectedOrder = $index + 1;
            if ($cat->sort_order != $expectedOrder) {
                $cat->sort_order = $expectedOrder;
                $cat->saveQuietly();
            }
        }
    }

    /**
     * Get DataTable Json Data (Pure Data - No HTML)
     */
    public function getData(Request $request)
    {
        $this->resequenceOrders();

        $categories = Category::query()->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        return DataTables::of($categories)
            ->addColumn('category_image', function ($row) {
                $imagePath = !empty($row->image) ? ltrim($row->image, '/') : null;
                return ($imagePath && file_exists(public_path($imagePath))) ? asset($imagePath) : null;
            })
            ->make(true);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('productmanagement::Categories');
    }

    /**
     * Store a newly created or update existing resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $categoryId = $request->input('category_id');

        if ($categoryId) {
            $category = Category::findOrFail($categoryId);
            $message  = 'Category updated successfully.';
        } else {
            $category = new Category();
            $maxOrder = Category::max('sort_order') ?? 0;
            $category->sort_order = $maxOrder + 1;
            $category->status     = 0;
            $message  = 'Category created successfully.';
        }

        $category->name_en = $request->input('categoryName_en');
        $category->name_ar = $request->input('categoryName_ar');

        if ($request->hasFile('memberPhoto')) {
            // Delete old image if updating
            $oldImagePath = !empty($category->image) ? ltrim($category->image, '/') : null;
            if ($categoryId && $oldImagePath && file_exists(public_path($oldImagePath))) {
                File::delete(public_path($oldImagePath));
            }

            $image = $request->file('memberPhoto');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('uploads/categories');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $image->move($destinationPath, $imageName);
            $category->image = 'uploads/categories/' . $imageName;
        }

        $category->save();
        $this->resequenceOrders();

        if (!empty($category->image)) {
            $category->image_url = asset(ltrim($category->image, '/'));
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $category
        ]);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json(['success' => true, 'data' => $category]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $category = Category::findOrFail($id);
        $imagePath = !empty($category->image) ? ltrim($category->image, '/') : null;
        if ($imagePath && file_exists(public_path($imagePath))) {
            $category->image_url = asset($imagePath);
        } else {
            $category->image_url = null;
        }
        return response()->json(['success' => true, 'data' => $category]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, $id)
    {
        return $this->store($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $imagePath = !empty($category->image) ? ltrim($category->image, '/') : null;
        if ($imagePath && file_exists(public_path($imagePath))) {
            File::delete(public_path($imagePath));
        }

        $category->delete();
        $this->resequenceOrders();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.'
        ]);
    }

    /**
     * Toggle status active/inactive
     */
    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);
        $category->status = $category->status ? 0 : 1;
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully.',
            'status'  => $category->status
        ]);
    }

    /**
     * Reorder category order position
     */
    public function reorder(Request $request, $id)
    {
        $this->resequenceOrders();

        $direction = $request->input('direction', 'up');
        $category  = Category::findOrFail($id);
        $currentOrder = $category->sort_order;

        if ($direction === 'up' && $currentOrder > 1) {
            $previous = Category::where('sort_order', $currentOrder - 1)->first();
            if ($previous) {
                $category->sort_order = $currentOrder - 1;
                $previous->sort_order = $currentOrder;
                $category->saveQuietly();
                $previous->saveQuietly();
            }
        } elseif ($direction === 'down') {
            $next = Category::where('sort_order', $currentOrder + 1)->first();
            if ($next) {
                $category->sort_order = $currentOrder + 1;
                $next->sort_order = $currentOrder;
                $category->saveQuietly();
                $next->saveQuietly();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Category reordered successfully.'
        ]);
    }
}
