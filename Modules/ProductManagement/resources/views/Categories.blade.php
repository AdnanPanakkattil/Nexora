@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush

@section('content')

<div class="container-fluid">

    <form>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Add Category</h5>
                <div class="d-flex gap-2">
                    <a href="{{ route('Categories-list') }}" class="btn btn-light">
                        <i class="fa-solid fa-arrow-left me-1"></i>
                        Cancel
                    </a>
                    <button type="submit" form="categoryForm" class="btn btn-primary">
                        <i class="ti ti-device-floppy me-1"></i>
                        Save Category
                    </button>
                </div>
            </div>

            <div class="card-body">

                <!-- Category Information -->
                <div class="border rounded p-4 mb-4">
                    <h6 class="fw-semibold mb-3">
                        <i class="ti ti-category me-2"></i>
                        Category Information
                    </h6>

                    <div class="row g-3">

                        <div class="col-md-6">
                            <label for="name_en" class="form-label">
                                Category Name (English)
                            </label>
                            <input type="text" class="form-control" id="name_en" name="name_en" placeholder="Enter Category Name En">
                        </div>

                        <div class="col-md-6">
                            <label for="name_ar" class="form-label">
                                Category Name (Arabic)
                            </label>
                            <input type="text" class="form-control" id="name_ar" name="name_ar" placeholder="Enter Category Name Ar">
                        </div>

                    </div>
                </div>

                <!-- Images -->
                <div class="border rounded p-4 mb-4">
                    <h6 class="fw-semibold mb-3">
                        <i class="ti ti-photo me-2"></i>
                        Images
                    </h6>

                    <div class="row g-3">

                        <div class="col-md-6">
                            <label for="image" class="form-label"> Category Image </label>
                            <input type="file" class="form-control" id="image" name="image">
                            <small class="text-muted">  Recommended size: 500 X 500 px </small>
                        </div>

                        <div class="col-md-6">
                            <label for="" class="form-label"> Banner Image </label>
                            <input type="file" class="form-control" name="" accept="image/*">
                            <small class="text-muted"> Recommended size: 1200 X 400 px </small>
                        </div>

                    </div>
                </div>

                <!-- Settings -->
                <div class="border rounded p-4">
                    <h6 class="fw-semibold mb-3">
                        <i class="ti ti-settings me-2"></i>
                        Settings
                    </h6>

                    <div class="form-check form-switch">
                        <input type="hidden" name="" value="0">
                        <input class="form-check-input" type="checkbox" name="" value="1">
                        <label class="form-check-label ms-2" for="">
                            Active Category
                        </label>
                    </div>
                    
                </div>
            </div>
        </div>
    </form>

</div>

@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush