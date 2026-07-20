@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush

@section('content')

<div class="container-fluid">

    <div class="card">

        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Add Category</h5>

            <button type="submit"
                form="categoryForm"
                class="btn btn-primary">
                <i class="ti ti-device-floppy me-1"></i>
                Save Category
            </button>
        </div>

        <div class="card-body">

            <form id="categoryForm" enctype="multipart/form-data">
                <input type="hidden" id="category_id" value="">

                <div class="row">

                    <!-- Category Name English -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Name (English)</label>
                        <input
                            type="text"
                            class="form-control"
                            name="name_en"
                            id="name_en"
                            value=""
                            placeholder="Enter Category Name">
                    </div>

                    <!-- Category Name Arabic -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Name (Arabic)</label>
                        <input
                            type="text"
                            class="form-control"
                            name="name_ar"
                            id="name_ar"
                            value=""
                            placeholder="Enter Arabic Name">
                    </div>

                    <!-- Slug -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Slug</label>
                        <input
                            type="text"
                            class="form-control"
                            name="slug"
                            id="slug"
                            value=""
                            readonly>
                    </div>

                    <!-- Category Image -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Image</label>
                        <input
                            type="file"
                            class="form-control"
                            name="image"
                            accept="image/*">
                    </div>

                    <!-- Banner Image -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Banner Image</label>
                        <input
                            type="file"
                            class="form-control"
                            name="banner_image"
                            accept="image/*">

                    </div>

                    <!-- Status -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status">
                            <option value="1"></option>
                            <option value="0"></option>
                        </select>
                    </div>

                    <!-- Sort Order -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Sort Order</label>
                        <input
                            type="number"
                            class="form-control"
                            name="sort_order"
                            value="">
                    </div>

                    <!-- Description -->
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Description</label>
                        <textarea
                            class="form-control"
                            rows="5"
                            name="description"
                            placeholder="Enter Description"></textarea>
                    </div>

                    <!-- Meta Title -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Meta Title</label>
                        <input
                            type="text"
                            class="form-control"
                            name="meta_title"
                            value="">
                    </div>

                    <!-- Meta Keywords -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Meta Keywords</label>
                        <input
                            type="text"
                            class="form-control"
                            name="meta_keywords"
                            value="">
                    </div>

                    <!-- Meta Description -->
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Meta Description</label>
                        <textarea
                            class="form-control"
                            rows="3"
                            name="meta_description"></textarea>
                    </div>

                    <!-- Featured -->
                    <div class="col-md-3 mb-3 form-check form-switch mt-4">
                        <input type="hidden" name="is_featured" value="0">
                        <input class="form-check-input" type="checkbox" name="is_featured" value="1"
                            id="is_featured">
                        <label class="form-check-label" for="is_featured">Featured</label>
                    </div>

                    <!-- Show in Menu -->
                    <div class="col-md-3 mb-3 form-check form-switch mt-4">
                        <input type="hidden" name="show_in_menu" value="0">
                        <input class="form-check-input" type="checkbox" name="show_in_menu" value="1"
                            id="show_in_menu">
                        <label class="form-check-label" for="show_in_menu">Show in Menu</label>
                    </div>

                </div>

            </form>

        </div>

    </div>

</div>

@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush