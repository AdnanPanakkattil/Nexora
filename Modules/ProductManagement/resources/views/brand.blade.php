@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
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
        <h4 class="fw-bold py-3 mb-0"> Brands</h4>

        <button type="button" class="btn btn-primary" id="addBrandModalBtn">
            <i class="menu-icon tf-icons ti ti-plus"></i>Add Brand
        </button>
    </div>
    <div class="card">
        <div class="card-datatable table-responsive p-3">
            <table class="dt-advanced-search table customer-table" id="brand_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Brand Name (EN)</th>
                        <th>Brand Name (AR)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Brand Name (EN)</th>
                        <th>Brand Name (AR)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- brand modal start-->

<div class="modal fade" id="addBrandModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Brand</h5>

                <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>
            </div>

            <div class="modal-body">
                <form id="addBrandForm">
                    <input type="hidden" id="brand_id">
                    <div class="mb-3 row">
                        <div class="col-md-6">
                            <label for="brandName_en" class="form-label labe">Brand Name (EN)</label>
                            <input placeholder="Name English" type="text" class="form-control" id="brandName_en" name="brandName_en">
                            <span class="text-danger error-text brandName_en_error"></span>
                        </div>
                        <div class="col-md-6">
                            <label for="brandName_ar" class="form-label labe">Brand Name (AR)</label>
                            <input placeholder="Name Arabic" type="text" class="form-control" id="brandName_ar" name="brandName_ar">
                            <span class="text-danger error-text brandName_ar_error"></span>
                        </div>
                    </div>

                    <div class="mt-5" style="display: flex; justify-content: center; gap: 10px;">
                        <button type="button" class="btn btn-primary" id="BrandSaveBtn">Save</button>
                        <button type="button" class="btn btn-secondary" id="closebtn" data-bs-dismiss="modal">Close</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>

<!-- brand modal end-->


@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Brand.js') }}"></script>
@endpush