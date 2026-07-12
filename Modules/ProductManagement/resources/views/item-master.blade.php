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
        background: rgba(0,0,0,.3);
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

<div id="loader-overlay">
    <div id="loader-center">
        <div class="sk-chase sk-primary">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    </div>
</div>
<div class="mt-5">
    <div class="">
        <div class="col-12 divhead">
            <div>
                <!-- <h5>{{ __('customer::customer.tb_heading') }}</h5> -->
            </div>
            <div id="">
                <a href="{{ route('item-master-add') }}" class="btn btn-primary"> Add the product<i class="ti ti-plus ti-xs me-sm-2 me-0"></i></a>
            </div>
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
                <table class="dt-advanced-search table customer-table" id="customer_table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="dt-checkboxes form-check-input custom-check1" id="select_all_customer"></th>
                            <th>ID</th>
                            <th>Image</th>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Image</th>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Created At</th>
                            <th>Action</th>
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