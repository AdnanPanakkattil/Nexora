<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\ProductManagement\Http\Requests\BrandRequest;
use Modules\ProductManagement\Models\Brand;
use Yajra\DataTables\DataTables;

/**
 * BrandController
 *
 * Manages full CRUD operations for Brand resources.
 */
class BrandController extends Controller
{
    /**
     * Render main Brand listing page view.
     *
     * Input:  None
     * Output: \Illuminate\View\View (brand.blade.php layout)
     */
    public function index()
    {
        return view('productmanagement::brand');
    }

    /**
     * Fetch formatted JSON data for DataTables AJAX loading.
     *
     * Input:  \Illuminate\Http\Request $request
     * Output: \Illuminate\Http\JsonResponse (DataTables formatted JSON object)
     * AJAX URL: GET /product-management/brand
     */
    public function getData(Request $request)
    {
        // Query active (non-deleted) brand records
        $brands = Brand::where('is_deleted', 0)->orderBy('id', 'desc');

        return DataTables::of($brands)
            ->addColumn('brandName_en', function ($row) {
                return $row->name_en ?? '-';
            })
            ->addColumn('brandName_ar', function ($row) {
                return $row->name_ar ?? '-';
            })
            ->addColumn('status', function ($row) {
                return $row->status ?? 0;
            })
            ->make(true);
    }

    /**
     * Store a new Brand or Update an existing Brand record.
     *
     * Input:  \Modules\ProductManagement\Http\Requests\BrandRequest $request
     *         Fields: brand_id (optional for update), brandName_en, brandName_ar
     * Output: \Illuminate\Http\JsonResponse 
     *         Success: { success: true, message: string, data: Brand }
     *         Error:   { success: false, message: string }
     * AJAX URL: POST /product-management/brand/store
     */
    public function store(BrandRequest $request)
    {
        try {
            // Retrieve validated fields
            $validated = $request->validated();

            // Prepare record values
            $data = [
                'name_en' => $validated['brandName_en'],
                'name_ar' => $validated['brandName_ar'] ?? null,
                'slug'    => Str::slug($validated['brandName_en']),
            ];

            // If brand_id exists, update existing record; otherwise create new record
            if ($request->filled('brand_id')) {
                $brand = Brand::findOrFail($request->brand_id);
                $brand->update($data);
                $message = 'Brand updated successfully!';
            } else {
                $data['status'] = 1; // Default status is Active
                $data['is_deleted'] = 0;
                $brand = Brand::create($data);
                $message = 'Brand added successfully!';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data'    => $brand
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save brand: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Fetch details of a single Brand record for editing.
     *
     * Input:  int $id (Brand Primary Key ID passed via URL)
     * Output: \Illuminate\Http\JsonResponse
     *         Success: { success: true, data: Brand }
     *         Error:   { success: false, message: string }
     * AJAX URL: GET /product-management/brand/edit/{id}
     */
    public function edit($id)
    {
        try {
            $brand = Brand::where('is_deleted', 0)->findOrFail($id);

            return response()->json([
                'success' => true,
                'data'    => $brand
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found!'
            ], 444);
        }
    }

    /**
     * Soft Delete a Brand record by setting is_deleted = 1.
     *
     * Input:  int $id (Brand Primary Key ID passed via URL)
     * Output: \Illuminate\Http\JsonResponse
     *         Success: { success: true, message: string }
     *         Error:   { success: false, message: string }
     * AJAX URL: DELETE /product-management/brand/delete/{id}
     */
    public function destroy($id)
    {
        try {
            $brand = Brand::findOrFail($id);
            
            // Soft delete record
            $brand->is_deleted = 1;
            $brand->save();

            return response()->json([
                'success' => true,
                'message' => 'Brand deleted successfully!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete brand!'
            ], 500);
        }
    }

    /**
     * Toggle active/inactive status of a Brand.
     *
     * Input:  int $id (Brand Primary Key ID passed via URL)
     * Output: \Illuminate\Http\JsonResponse
     *         Success: { success: true, message: string, status: int }
     *         Error:   { success: false, message: string }
     * AJAX URL: POST /product-management/brand/status/{id}
     */
    public function toggleStatus($id)
    {
        try {
            $brand = Brand::where('is_deleted', 0)->findOrFail($id);

            // Toggle status (1 -> 0 or 0 -> 1)
            $brand->status = $brand->status == 1 ? 0 : 1;
            $brand->save();

            return response()->json([
                'success' => true,
                'message' => 'Brand status updated successfully!',
                'status'  => $brand->status
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status!'
            ], 500);
        }
    }
}
