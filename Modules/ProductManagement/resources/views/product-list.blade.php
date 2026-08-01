@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
<style>
    #loader-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .3);
        z-index: 9990;
    }

    #loader-center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }
</style>
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
<div class="mt-5">
    <div class="">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">Product List</h5>

            <a href="{{route ('product-add') }}" class="btn btn-primary">
                <i class="ti ti-plus"></i> Add Product
            </a>
        </div>
        <div class="card">

            <div class="card-body">
                <form class="dt_adv_search" method="GET">
                    <div class="row">
                        <div class="col-12">
                        </div>
                    </div>
                </form>
            </div>

            <div class="card-datatable table-responsive">
                <table class="dt-advanced-search table customer-table" id="">
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="dt-checkboxes form-check-input custom-check1" id="select_all_customer"></th>
                            <th>ID</th>
                            <th>Products</th>
                            <th>Category</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th><input type="checkbox" class="dt-checkboxes form-check-input custom-check1" id="select_all_customer"></th>
                            <th>ID</th>
                            <th>Products</th>
                            <th>Category</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>

@endsection
@push('scripts')
<script src="{{ asset('page-js/productManagement/item-master.js') }}"></script>
@endpush