@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush

@section('content')

<div class="container-fluid">

    <div class="card">

        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ isset($category) ? 'Edit Category' : 'Add Category' }}</h5>

            <a href="{{ route('Categories-list') }}" class="btn btn-secondary me-2">
                <i class="ti ti-arrow-left me-1"></i> Back to List
            </a>
        </div>

        <div class="card-body">

            @if(session('success'))
                <div class="alert alert-success alert-dismissible mb-3" role="alert">
                    {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            <form id="categoryForm" action="{{ isset($category) ? route('categories.update', $category->id) : route('categories.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="hidden" id="category_id" name="category_id" value="{{ isset($category) ? $category->id : '' }}">

                <div class="row">

                    <!-- Category Name English -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Name (English) <span class="text-danger">*</span></label>
                        <input
                            type="text"
                            class="form-control @error('name_en') is-invalid @enderror"
                            name="name_en"
                            id="name_en"
                            value="{{ old('name_en', $category->name_en ?? '') }}"
                            placeholder="Enter Category Name" required>
                        @error('name_en')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Category Name Arabic -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Name (Arabic)</label>
                        <input
                            type="text"
                            class="form-control @error('name_ar') is-invalid @enderror"
                            name="name_ar"
                            id="name_ar"
                            value="{{ old('name_ar', $category->name_ar ?? '') }}"
                            placeholder="Enter Arabic Name">
                        @error('name_ar')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Slug -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Slug</label>
                        <input
                            type="text"
                            class="form-control @error('slug') is-invalid @enderror"
                            name="slug"
                            id="slug"
                            value="{{ old('slug', $category->slug ?? '') }}"
                            placeholder="Auto-generated slug">
                        @error('slug')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <!-- Category Image -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category Image</label>
                        <input
                            type="file"
                            class="form-control"
                            name="image"
                            accept="image/*">
                        @if(isset($category) && $category->image)
                            <div class="mt-2">
                                <img src="{{ asset('storage/' . $category->image) }}" alt="Category Image" width="60" class="rounded">
                            </div>
                        @endif
                    </div>

                    <!-- Banner Image -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Banner Image</label>
                        <input
                            type="file"
                            class="form-control"
                            name="banner_image"
                            accept="image/*">
                        @if(isset($category) && $category->banner_image)
                            <div class="mt-2">
                                <img src="{{ asset('storage/' . $category->banner_image) }}" alt="Banner Image" width="120" class="rounded">
                            </div>
                        @endif
                    </div>

                    <!-- Status -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status">
                            <option value="1" {{ old('status', $category->status ?? 1) == 1 ? 'selected' : '' }}>Active</option>
                            <option value="0" {{ old('status', $category->status ?? 1) == 0 ? 'selected' : '' }}>Inactive</option>
                        </select>
                    </div>

                    <!-- Sort Order -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Sort Order</label>
                        <input
                            type="number"
                            class="form-control"
                            name="sort_order"
                            value="{{ old('sort_order', $category->sort_order ?? 0) }}">
                    </div>

                    <!-- Description -->
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Description</label>
                        <textarea
                            class="form-control"
                            rows="4"
                            name="description"
                            placeholder="Enter Description">{{ old('description', $category->description ?? '') }}</textarea>
                    </div>

                    <!-- Meta Title -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Meta Title</label>
                        <input
                            type="text"
                            class="form-control"
                            name="meta_title"
                            value="{{ old('meta_title', $category->meta_title ?? '') }}">
                    </div>

                    <!-- Meta Keywords -->
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Meta Keywords</label>
                        <input
                            type="text"
                            class="form-control"
                            name="meta_keywords"
                            value="{{ old('meta_keywords', $category->meta_keywords ?? '') }}">
                    </div>

                    <!-- Meta Description -->
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Meta Description</label>
                        <textarea
                            class="form-control"
                            rows="2"
                            name="meta_description">{{ old('meta_description', $category->meta_description ?? '') }}</textarea>
                    </div>

                    <!-- Featured -->
                    <div class="col-md-3 mb-3 form-check form-switch mt-3 ms-2">
                        <input type="hidden" name="is_featured" value="0">
                        <input class="form-check-input" type="checkbox" name="is_featured" value="1"
                            id="is_featured" {{ old('is_featured', $category->is_featured ?? 0) == 1 ? 'checked' : '' }}>
                        <label class="form-check-label" for="is_featured">Featured</label>
                    </div>

                    <!-- Show in Menu -->
                    <div class="col-md-3 mb-3 form-check form-switch mt-3">
                        <input type="hidden" name="show_in_menu" value="0">
                        <input class="form-check-input" type="checkbox" name="show_in_menu" value="1"
                            id="show_in_menu" {{ old('show_in_menu', $category->show_in_menu ?? 1) == 1 ? 'checked' : '' }}>
                        <label class="form-check-label" for="show_in_menu">Show in Menu</label>
                    </div>

                </div>

                <div class="mt-4 text-end">
                    <button type="submit" id="CategorySaveBtn" class="btn btn-primary">
                        <i class="ti ti-device-floppy me-1"></i>
                        {{ isset($category) ? 'Update Category' : 'Save Category' }}
                    </button>
                </div>

            </form>

        </div>

    </div>

</div>

@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush