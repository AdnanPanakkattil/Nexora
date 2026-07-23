<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Modules\ProductManagement\Models\Category;

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
     * Fetch list data for DataTables AJAX.
     */
    public function listData(Request $request)
    {
        $query = Category::latest();

        if ($request->has('search') && !empty($request->search['value'])) {
            $search = $request->search['value'];
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $totalRecords = Category::count();
        $filteredRecords = $query->count();

        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        
        if ($length > 0) {
            $categories = $query->skip($start)->take($length)->get();
        } else {
            $categories = $query->get();
        }

        $data = [];
        foreach ($categories as $category) {
            // Fetch category image using static key 'category_image' from MediaFile table
            $mediaImage = MediaFile::where('model_type', Category::class)
                ->where('model_id', $category->id)
                ->where('static_key', 'category_image')
                ->latest()
                ->first();

            $imagePath = $mediaImage ? $mediaImage->file_path : $category->image;

            $imageHtml = $imagePath
                ? '<img src="' . asset('storage/' . $imagePath) . '" alt="' . e($category->name_en) . '" width="40" height="40" class="rounded-circle me-2 object-fit-cover">'
                : '<span class="badge bg-label-secondary">No Image</span>';

            $statusHtml = $category->status == 1
                ? '<span class="badge bg-label-success">Active</span>'
                : '<span class="badge bg-label-danger">Inactive</span>';

            $featuredHtml = $category->is_featured == 1
                ? '<span class="badge bg-label-info">Yes</span>'
                : '<span class="badge bg-label-secondary">No</span>';

            $actionsHtml = '
                <div class="d-flex align-items-center">
                    <a href="' . route('categories.edit', $category->id) . '" class="text-body item-edit me-2" data-id="' . $category->id . '" title="Edit">
                        <i class="ti ti-edit ti-sm text-primary"></i>
                    </a>
                    <a href="javascript:void(0);" class="text-body item-delete" data-id="' . route('categories.delete', $category->id) . '" title="Delete">
                        <i class="ti ti-trash ti-sm text-danger"></i>
                    </a>
                </div>
            ';

            $data[] = [
                'id' => $category->id,
                'categoryId' => $category->id,
                'image' => $imageHtml,
                'categoryName_en' => e($category->name_en),
                'categoryName_ar' => e($category->name_ar ?? ''),
                'slug' => e($category->slug),
                'products' => 0,
                'status' => $statusHtml,
                'is_featured' => $featuredHtml,
                'sort_order' => $category->sort_order,
                'actions' => $actionsHtml
            ];
        }

        return response()->json([
            'draw' => (int) $request->input('draw', 1),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $filteredRecords,
            'data' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('productmanagement::Categories');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:Categories,slug',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'show_in_menu' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        $slugInput = $request->input('slug') ?: $request->input('name_en');
        $slug = Str::slug($slugInput);

        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category = Category::create([
            'name_en' => $request->name_en,
            'name_ar' => $request->name_ar,
            'slug' => $slug,
            'description' => $request->description,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'meta_keywords' => $request->meta_keywords,
            'sort_order' => $request->sort_order ?? 0,
            'status' => $request->has('status') ? (int) $request->status : 1,
            'is_featured' => $request->has('is_featured') ? (int) $request->is_featured : 0,
            'show_in_menu' => $request->has('show_in_menu') ? (int) $request->show_in_menu : 1,
        ]);

        // 1. Upload Category Image & Save to MediaFile DB with static key 'category_image'
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imagePath = $file->store('categories', 'public');

            MediaFile::create([
                'static_key' => 'category_image',
                'file_path'  => $imagePath,
                'file_name'  => $file->getClientOriginalName(),
                'mime_type'  => $file->getClientMimeType(),
                'file_size'  => $file->getSize(),
                'model_type' => Category::class,
                'model_id'   => $category->id,
            ]);

            $category->image = $imagePath;
            $category->save();
        }

        // 2. Upload Category Banner Image & Save to MediaFile DB with static key 'category_banner'
        if ($request->hasFile('banner_image')) {
            $bannerFile = $request->file('banner_image');
            $bannerPath = $bannerFile->store('categories/banners', 'public');

            MediaFile::create([
                'static_key' => 'category_banner',
                'file_path'  => $bannerPath,
                'file_name'  => $bannerFile->getClientOriginalName(),
                'mime_type'  => $bannerFile->getClientMimeType(),
                'file_size'  => $bannerFile->getSize(),
                'model_type' => Category::class,
                'model_id'   => $category->id,
            ]);

            $category->banner_image = $bannerPath;
            $category->save();
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'status' => true,
                'message' => 'Category created successfully!',
                'data' => $category,
                'redirect_url' => route('Categories-list')
            ]);
        }

        return redirect()->route('Categories-list')->with('success', 'Category created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        // Fetch category media files using static keys
        $categoryImage = MediaFile::where('model_type', Category::class)
            ->where('model_id', $category->id)
            ->where('static_key', 'category_image')
            ->latest()
            ->first();

        $bannerImage = MediaFile::where('model_type', Category::class)
            ->where('model_id', $category->id)
            ->where('static_key', 'category_banner')
            ->latest()
            ->first();

        $imagePath = $categoryImage ? $categoryImage->file_path : $category->image;
        $bannerPath = $bannerImage ? $bannerImage->file_path : $category->banner_image;

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'status' => true,
                'categoryId' => $category->id,
                'categoryName_en' => $category->name_en,
                'categoryName_ar' => $category->name_ar,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_url' => $imagePath ? asset('storage/' . $imagePath) : null,
                'banner_url' => $bannerPath ? asset('storage/' . $bannerPath) : null,
                'meta_title' => $category->meta_title,
                'meta_description' => $category->meta_description,
                'meta_keywords' => $category->meta_keywords,
                'sort_order' => $category->sort_order,
                'status' => $category->status,
                'is_featured' => $category->is_featured,
                'show_in_menu' => $category->show_in_menu,
                'category' => $category
            ]);
        }

        return view('productmanagement::Categories', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:Categories,slug,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'sort_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'show_in_menu' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        // Handle Category Image Upload with static key 'category_image'
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imagePath = $file->store('categories', 'public');

            // Delete old media file entry if present
            MediaFile::where('model_type', Category::class)
                ->where('model_id', $category->id)
                ->where('static_key', 'category_image')
                ->delete();

            MediaFile::create([
                'static_key' => 'category_image',
                'file_path'  => $imagePath,
                'file_name'  => $file->getClientOriginalName(),
                'mime_type'  => $file->getClientMimeType(),
                'file_size'  => $file->getSize(),
                'model_type' => Category::class,
                'model_id'   => $category->id,
            ]);

            $category->image = $imagePath;
        }

        // Handle Banner Image Upload with static key 'category_banner'
        if ($request->hasFile('banner_image')) {
            $bannerFile = $request->file('banner_image');
            $bannerPath = $bannerFile->store('categories/banners', 'public');

            MediaFile::create([
                'static_key' => 'category_banner',
                'file_path'  => $bannerPath,
                'file_name'  => $bannerFile->getClientOriginalName(),
                'mime_type'  => $bannerFile->getClientMimeType(),
                'file_size'  => $bannerFile->getSize(),
                'model_type' => Category::class,
                'model_id'   => $category->id,
            ]);

            $category->banner_image = $bannerPath;
        }

        $slugInput = $request->input('slug') ?: $request->input('name_en');
        $slug = Str::slug($slugInput);

        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category->name_en = $request->name_en;
        $category->name_ar = $request->name_ar;
        $category->slug = $slug;
        $category->description = $request->description;
        $category->meta_title = $request->meta_title;
        $category->meta_description = $request->meta_description;
        $category->meta_keywords = $request->meta_keywords;
        $category->sort_order = $request->sort_order ?? 0;
        $category->status = $request->has('status') ? (int) $request->status : 1;
        $category->is_featured = $request->has('is_featured') ? (int) $request->is_featured : 0;
        $category->show_in_menu = $request->has('show_in_menu') ? (int) $request->show_in_menu : 1;
        $category->save();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'status' => true,
                'message' => 'Category updated successfully!',
                'data' => $category,
                'redirect_url' => route('Categories-list')
            ]);
        }

        return redirect()->route('Categories-list')->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Also delete associated MediaFile records
        MediaFile::where('model_type', Category::class)
            ->where('model_id', $category->id)
            ->delete();

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Category deleted successfully!'
        ]);
    }
}
