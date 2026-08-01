@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
<link rel="stylesheet" href="{{ asset('page-css/productManagement/categories-list.css') }}">
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
        <h4 class="fw-bold py-3 mb-0"> Categories</h4>

        <button type="button" class="btn btn-primary" id="addCategoryModalBtn">
            <i class="menu-icon tf-icons ti ti-plus"></i>Add Category
        </button>
    </div>
    <div class="card">
        <div class="card-datatable table-responsive p-3">
            <table class="dt-advanced-search table customer-table" id="category_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category Image</th>
                        <th>Category Name (EN)</th>
                        <th>Category Name (AR)</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Category Image</th>
                        <th>Category Name (EN)</th>
                        <th>Category Name (AR)</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- catogery modal start-->

<div class="modal fade" id="addCategoryModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Category</h5>

                <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>
            </div>

            <div class="modal-body">
                <form id="addCategoryForm">
                    <input type="hidden" id="category_id">
                    <div class="mb-3 row">
                        <div class="col-md-12 mb-4">

                            <label class="form-label fw-semibold">
                                Category Image
                            </label>

                            <div class="upload-wrapper">

                                <!-- Left Upload Content -->
                                <div class="upload-left">
                                    <input type="file" id="memberPhoto" name="memberPhoto" accept="image/*" hidden>

                                    <label for="memberPhoto" class="upload-content" id="uploadContent">
                                        <i class="ti ti-cloud-upload upload-icon"></i>

                                        <h5>Drag & drop an image here</h5>
                                        <p>or click to browse</p>

                                        <small>PNG, JPG, WEBP • Max 2MB</small>

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
                        <div class="col-md-6">
                            <label for="categoryName_en" class="form-label labe">Category Name (EN)</label>
                            <input placeholder="Name English" type="text" class="form-control" id="categoryName_en" name="categoryName_en">
                            <span class="text-danger error-text categoryName_en_error"></span>
                        </div>
                        <div class="col-md-6">
                            <label for="categoryName_ar" class="form-label labe">Category Name (AR)</label>
                            <input placeholder="Name Arabic" type="text" class="form-control" id="categoryName_ar" name="categoryName_ar">
                            <span class="text-danger error-text categoryName_ar_error"></span>
                        </div>
                    </div>

                    <div class="mt-5" style="display: flex; justify-content: center; gap: 10px;">
                        <button type="button" class="btn btn-primary" id="CategorySaveBtn">Save</button>
                        <button type="button" class="btn btn-secondary" id="closebtn" data-bs-dismiss="modal">Close</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>

<!-- catogery modal end-->


@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush