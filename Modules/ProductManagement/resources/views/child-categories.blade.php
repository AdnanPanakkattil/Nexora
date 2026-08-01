@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
<link rel="stylesheet" href="{{ asset('assets/vendor/libs/select2/select2.css') }}">
<link rel="stylesheet" href="{{ asset('page-css/productManagement/child-categories.css') }}">
@endpush

@section('content')

<!-- Loading Spinner Overlay -->
<div id="loader-overlay" style="display: none;">
    <div id="loader-center">
        <div class="loader-box">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div class="mt-2 fw-semibold" style="color: #a47bc8; font-size: 0.88rem; letter-spacing: 0.5px;">Loading...</div>
    </div>
</div>

<div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold py-3 mb-0">Child Categories</h4>

        <!-- Button to trigger Add Child Category Modal -->
        <button type="button" class="btn btn-primary" id="addChildCategoryModalBtn">
            <i class="menu-icon tf-icons ti ti-plus"></i>Add Child Category
        </button>
    </div>

    <!-- Child Categories Data Table Card -->
    <div class="card">
        <!-- Filter Button Area inside Card -->
        <div class="p-3 pb-0">
            <button type="button" class="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#filterCollapse" aria-expanded="false" aria-controls="filterCollapse">
                <i class="ti ti-filter me-1"></i> Filter
            </button>
        </div>

        <!-- Collapsible Filter Section (Inside Card Box) -->
        <div class="collapse" id="filterCollapse">
            <div class="px-3 py-2">
                <div class="card border shadow-sm my-2 bg-white">
                    <div class="card-body mb-5">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold mb-1" for="filter_sub_category_id">
                                    <!-- VALUE INFO: Selected value gives sub_category_id to filter DataTables -->
                                    Filter by Sub Category
                                </label>
                                <select id="filter_sub_category_id" class="form-select select2">
                                    <option value="">All Sub Categories</option>
                                    @foreach($subCategories as $subCategory)
                                        <option value="{{ $subCategory->id }}">
                                            {{ $subCategory->name_en }} ({{ $subCategory->category ? $subCategory->category->name_en : 'No Parent Category' }})
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-datatable table-responsive p-3">
            <table class="dt-advanced-search table customer-table" id="child_category_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Child Category (EN)</th>
                        <th>Child Category (AR)</th>
                        <th>Sub Category</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Child Category (EN)</th>
                        <th>Child Category (AR)</th>
                        <th>Sub Category</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- Child Category Add/Edit Modal -->
<div class="modal fade" id="ChildCategoryModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="childCategoryModalTitle">Add Child Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <form id="addChildCategoryForm" enctype="multipart/form-data">
                    
                    <!-- Hidden ID for Edit mode -->
                    <input type="hidden" id="child_category_id" name="child_category_id">

                    <!-- Select Parent Sub Category -->
                    <div class="mb-3">
                        <label for="modal_sub_category_id" class="form-label fw-semibold">Parent Sub Category <span class="text-danger">*</span></label>
                        <select class="form-select select2" id="modal_sub_category_id" name="sub_category_id">
                            <option value="">Select Sub Category</option>
                            @foreach($subCategories as $subCategory)
                                <option value="{{ $subCategory->id }}">
                                    {{ $subCategory->name_en }} (Category: {{ $subCategory->category ? $subCategory->category->name_en : '—' }})
                                </option>
                            @endforeach
                        </select>
                        <span class="text-danger error-text sub_category_id_error"></span>
                    </div>

                    <!-- Image Input -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Child Category Image</label>
                        <div class="upload-wrapper">
                            <div class="upload-left">
                                <input type="file" id="memberPhoto" name="memberPhoto" accept="image/*" hidden>
                                <label for="memberPhoto" class="upload-content" id="uploadContent">
                                    <i class="ti ti-cloud-upload upload-icon"></i>
                                    <h5>Drag &amp; drop an image here</h5>
                                    <p>or click to browse</p>
                                    <small>PNG, JPG, WEBP &bull; Max 2MB</small>
                                    <div class="browse-btn mt-3">
                                        <i class="ti ti-folder"></i>
                                        Browse Files
                                    </div>
                                </label>
                                <span class="text-danger error-text memberPhoto_error mt-2 d-block text-center"></span>
                            </div>

                            <div class="preview-right">
                                <div class="preview-container">
                                    <div class="preview-circle">
                                        <img id="imagePreview" class="preview-image d-none" alt="Child Category Image Preview">
                                        <div class="placeholder-avatar" id="avatarPlaceholder">
                                            <i class="ti ti-photo"></i>
                                        </div>
                                    </div>
                                    <button type="button" id="removeImage" class="remove-image d-none" title="Remove Image">
                                        <i class="ti ti-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Names inputs -->
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="childCategoryName_en" class="form-label fw-semibold">Child Category Name (EN) <span class="text-danger">*</span></label>
                            <input placeholder="Name English" type="text" class="form-control" id="childCategoryName_en" name="childCategoryName_en">
                            <span class="text-danger error-text childCategoryName_en_error"></span>
                        </div>
                        <div class="col-md-6">
                            <label for="childCategoryName_ar" class="form-label fw-semibold">Child Category Name (AR) <span class="text-danger">*</span></label>
                            <input placeholder="Name Arabic" type="text" class="form-control" id="childCategoryName_ar" name="childCategoryName_ar">
                            <span class="text-danger error-text childCategoryName_ar_error"></span>
                        </div>
                    </div>

                    <!-- Modal Actions -->
                    <div class="mt-4 d-flex justify-content-center gap-3">
                        <button type="button" class="btn btn-primary" id="ChildCategorySaveBtn">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- Child Category Modal End -->

@endsection

@push('scripts')
<script src="{{ asset('assets/vendor/libs/select2/select2.js') }}"></script>
<script src="{{ asset('page-js/productManagement/Child-Categories.js') }}"></script>
@endpush