<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('productmanagement::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('productmanagement::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('productmanagement::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {}
}

// <?php

// namespace Modules\Settings\Http\Controllers;

// use Illuminate\Routing\Controller;
// use Illuminate\Http\Request;
// use Modules\Settings\Http\Requests\CategoryRequest;
// use Modules\Settings\Interfaces\CategoryInterface;
// use Illuminate\Support\Facades\Auth;
// use Carbon\Carbon;
// use Modules\Activitylog\Traits\UserActivityLog;
// use Modules\Service\Models\ClinicServiceCategory;


// class CategoryController extends Controller
// {
//     use UserActivityLog;

//     protected $categoryRepository;

//     public function __construct(CategoryInterface $categoryRepository)
//     {
//         $this->categoryRepository = $categoryRepository;
//     }

//     // Show table
//     public function index(Request $request)
//     {
//         if ($request->ajax()) {
//             return $this->categoryRepository->getAll($request);
//         }

//         return view('settings::category');
//     }

//     // Store data
//     public function store(CategoryRequest $request)
//     {
//         try {
//             $category = $this->categoryRepository->storeCategory($request->all());

//             $logCreated = $this->userActivityLog(
//                 NULL,
//                 config('constants.activitylog.actions.action_add'),
//                 config('constants.activitylog.activity.category'),
//                 $category->categoryId,
//                 Auth::id(),
//                 NULL,
//                 Carbon::now(),
//                 NULL,
//                 $request->ip(),
                
//             );

//             return response()->json([
//                 'status' => true,
//                 'message' => 'Category added successfully',
//                 'data' => $category
//             ], 201);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'An error occurred while adding the category'
//             ], 500);
//         }
//     }

//     // Edit data
//     public function edit($id)
//     {
//         try {
//             $category = $this->categoryRepository->getCategoryById($id);
//             return response()->json($category);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'Category not found.'
//             ], 404);
//         }
//     }

//     // Update data
//     public function update(CategoryRequest $request, $id)
//     {
//         try {

//             list($category, $previousData) =  $this->categoryRepository->updateCategory($id, $request->all());

//             $logCreated = $this->userActivityLog(
//                 NULL,
//                 config('constants.activitylog.actions.action_edit'),
//                 config('constants.activitylog.activity.category'),
//                 $id,
//                 Auth::id(),
//                 NULL,
//                 Carbon::now(),
//                 NULL,
//                 $previousData,
//                 $request->ip(),
                
//             );

//             return response()->json([
//                 'status' => true,
//                 'message' => 'Category updated successfully',
//                 'data' => $category
//             ]);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'An error occurred while updating the category: ' . $e->getMessage()
//             ], 500);
//         }
//     }

//     // Delete data
//     public function destroy(Request $request, $id)
//     {
//         try {
//             $this->categoryRepository->deleteCategory($id);

//             $ClinicServiceCategory = ClinicServiceCategory::where('categoryId', $id)->first();

//             $logCreated = $this->userActivityLog(
//                 NULL,
//                 config('constants.activitylog.actions.action_delete'),
//                 config('constants.activitylog.activity.category'),
//                 $id,
//                 Auth::id(),
//                 NULL,
//                 Carbon::now(),
//                 NULL,
//                 $ClinicServiceCategory->getOriginal(),
//                 $request->ip(),
                
//             );

//             return response()->json([
//                 'status' => true,
//                 'message' => 'Category deleted successfully'
//             ]);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => false,
//                 'message' => 'An error occurred while deleting the category'
//             ], 500);
//         }
//     }

//     public function show($id)
// {
//     try {
//         $category = $this->categoryRepository->getCategoryById($id);
//         return response()->json([
//             'status' => true,
//             'message' => 'Category retrieved successfully',
//             'data' => $category
//         ], 200);
//     } catch (\Throwable $th) {
//         return response()->json([
//             'status' => false,
//             'message' => $th->getMessage(),
//             'data' => null
//         ], 500);
//     }
// }
// }


// <?php

// namespace Modules\Settings\Interfaces;

// interface CategoryInterface
// {
//     public function getAll($request);
//     public function storeCategory($data);
//     public function getCategoryById($id);
//     public function updateCategory($id, $data);
//     public function deleteCategory($id);
// }

// <?php

// namespace Modules\Settings\Repositories;

// use Modules\Settings\Interfaces\CategoryInterface;
// use Modules\Service\Models\ClinicServiceCategory;
// use Yajra\DataTables\Facades\DataTables;
// use Illuminate\Http\Request;

// class CategoryRepository implements CategoryInterface
// {
//     public function getAll($request)
//     {
//         $type = $request->input('type');

//         $query = ClinicServiceCategory::where('deleted', false);
//         if ($type && $type != 'All') {
//             $query->where('type', $type);
//         }
//         return DataTables::of($query)
//            ->addColumn('actions', function ($category) {
//     $detailsUrl = url('detail-category/' . $category->categoryId);
//     $deleteUrl  = url('delete-category/' . $category->categoryId);
//     return '<div class="d-inline-block">
//         <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></a>
//         <ul class="dropdown-menu dropdown-menu-end m-0">
//             <li><a href="javascript:;" class="dropdown-item item-edit" data-id="' . $category->categoryId . '">Edit</a></li>
//             <div class="dropdown-divider"></div>
//             <li><a href="javascript:;" class="dropdown-item item-details" data-id="' . $category->categoryId . '">Details</a></li>
//             <div class="dropdown-divider"></div>
//             <li><a href="javascript:;" class="dropdown-item text-danger item-delete" data-id="' . $deleteUrl . '">Delete</a></li>
//         </ul>
//     </div>';
// })
//             ->rawColumns(['actions'])
//             ->make(true);
//     }

//     public function storeCategory($data)
//     {

//         try {
//             return ClinicServiceCategory::create([
//                 'categoryName_en' => $data['categoryName_en'],
//                 'categoryName_ar' => $data['categoryName_ar'],
//                 'copaymentMaximum' => $data['copaymentMaximum'],
//                 'type' => $data['type'],
//                 'deleted' => 0,
//             ]);
//         } catch (\Exception $e) {
//             dd($e);
//             return response()->json([
//                 'status' => false,
//                 'message' => 'An error occurred while adding the category'
//             ]);
//         }
//     }

//     public function getCategoryById($id)
//     {
//         return ClinicServiceCategory::findOrFail($id);
//     }

//     public function updateCategory($id, $data)
//     {
//         $category = ClinicServiceCategory::findOrFail($id);

//         $previousData = $category->getOriginal();

//         $category->update([
//             'categoryName_en' => $data['categoryName_en'],
//             'categoryName_ar' => $data['categoryName_ar'],
//             'copaymentMaximum' => $data['copaymentMaximum'],
//             'type' => $data['type'],
//         ]);
//         return [$category, $previousData];
//     }

//     public function deleteCategory($id)
//     {
//         $category = ClinicServiceCategory::findOrFail($id);
//         $category->deleted = true;
//         return $category->save();
//     }
// }
