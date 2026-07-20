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
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0">Categories List</h5>

            <a href="{{route ('Categories')}}" class="btn btn-primary">
                <i class="ti ti-plus"></i> Add Category
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
                <table class="dt-advanced-search table customer-table" id="category_table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Category Image</th>
                            <th>Category Name</th>
                            <th>Slug</th>
                            <th>Products</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th>Id</th>
                            <th>Category Image</th>
                            <th>Category Name</th>
                            <th>Slug</th>
                            <th>Products</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Order</th>
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
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush