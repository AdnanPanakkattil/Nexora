@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
<link rel="stylesheet" href="{{ asset('assets/vendor/libs/select2/select2.css') }}">
<link rel="stylesheet" href="{{ asset('page-css/productManagement/sub-categories.css') }}">
@endpush

@section('content')

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
        <h4 class="fw-bold py-3 mb-0">Sub Categories</h4>

        <div class="d-flex gap-2">

            <button type="button" class="btn btn-primary" id="addSubCategoryModalBtn">
                <i class="menu-icon tf-icons ti ti-plus"></i>Add Sub Category
            </button>

        </div>
    </div>

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
                            <div class="col-md-4 mb-4">
                                <label for="filter_category_id" class="form-label mb-1 fw-semibold">Filter by Category</label>
                                <select id="filter_category_id" class="form-select select2" data-placeholder="All Categories">
                                    <option value="">All Categories</option>
                                    @foreach($categories as $cat)
                                        <option value="{{ $cat->id }}">{{ $cat->name_en }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-datatable table-responsive p-3">
            <table class="dt-advanced-search table customer-table" id="sub_category_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Sub Category (EN)</th>
                        <th>Sub Category (AR)</th>
                        <th>Parent Category</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Sub Category (EN)</th>
                        <th>Sub Category (AR)</th>
                        <th>Parent Category</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- Sub Category Modal -->
<div class="modal fade" id="addSubCategoryModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="subCategoryModalTitle">Add Sub Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <form id="addSubCategoryForm">
                    <input type="hidden" id="sub_category_id">

                    <div class="mb-3">
                        <label for="modal_category_id" class="form-label labe fw-semibold">Parent Category</label>
                        <select id="modal_category_id" name="category_id" class="form-select select2" data-placeholder="-- Select Category --" data-allow-clear="true">
                            <option value=""> Select Category </option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name_en }}</option>
                            @endforeach
                        </select>
                        <span class="text-danger error-text category_id_error"></span>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold">Sub Category Image</label>
                        <div class="upload-wrapper">
                            <!-- Left Upload Content -->
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

                            <!-- Right Preview -->
                            <div class="preview-right">
                                <div class="preview-container">
                                    <div class="preview-circle">
                                        <img id="imagePreview" class="preview-image d-none">
                                        <div class="placeholder-avatar" id="avatarPlaceholder">
                                            <i class="ti ti-photo"></i>
                                        </div>
                                    </div>
                                    <button type="button" id="removeImage" class="remove-image d-none">
                                        <i class="ti ti-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="subCategoryName_en" class="form-label fw-semibold">Sub Category Name (EN) <span class="text-danger">*</span></label>
                            <input placeholder="Name English" type="text" class="form-control" id="subCategoryName_en" name="subCategoryName_en">
                            <span class="text-danger error-text subCategoryName_en_error"></span>
                        </div>
                        <div class="col-md-6">
                            <label for="subCategoryName_ar" class="form-label fw-semibold">Sub Category Name (AR) <span class="text-danger">*</span></label>
                            <input placeholder="Name Arabic" type="text" class="form-control" id="subCategoryName_ar" name="subCategoryName_ar">
                            <span class="text-danger error-text subCategoryName_ar_error"></span>
                        </div>
                    </div>

                    <div class="mt-4 d-flex justify-content-center gap-3">
                        <button type="button" class="btn btn-primary" id="SubCategorySaveBtn">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- Sub Category Modal End -->

@endsection

@push('scripts')
<script src="{{ asset('assets/vendor/libs/select2/select2.js') }}"></script>
<script>
    $(function () {
        // Initialize Select2 on filter dropdown
        $('#filter_category_id').select2({
            placeholder: 'All Categories',
            allowClear: true,
            width: '100%'
        });

        // Initialize Select2 on modal dropdown (inside modal so use dropdownParent)
        $('#modal_category_id').select2({
            placeholder: 'Select Category',
            allowClear: true,
            width: '100%',
            dropdownParent: $('#addSubCategoryModal')
        });
    });
</script>
<script src="{{ asset('page-js/productManagement/Sub-Categories.js') }}"></script>
@endpush