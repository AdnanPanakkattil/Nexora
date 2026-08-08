@extends('layouts.backendlayouts')
@section('content')

<div>
    <div class="col-12 divhead">
        <div>
            <h4> Users </h4>

        </div>
    </div>
    <div class="card">
        <div class="card-header d-flex justify-content-end align-items-center">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#addUserOffcanvas" aria-controls="addUserOffcanvas">
                + Add User
            </button>
        </div>
        <div class="card-datatable table-responsive">
            <table class="dt-advanced-search table service-common-table">
                <thead>
                    <tr>
                        <th> Sl No </th>
                        <th> Employee ID </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Mobile </th>
                        <th> Gender </th>
                        <th> Role </th>
                        <th> Status </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th> Sl No </th>
                        <th> Employee ID </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Mobile </th>
                        <th> Gender </th>
                        <th> Role </th>
                        <th> Status </th>
                        <th> Action </th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>
</div>

<div class="modal" id="statusModal">
    <div class="modal-dialog">
        <div class="col-12 mb-6 mb-xl-0">
            <div class="card">
                <h5 class="card-header">Reservation Tracking</h5>
                <div class="card-body">
                    <ul class="timeline mb-0">

                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<footer class="footer bg-light footz" id="bulk_select" style="display: none;">
    <div
        class="container-fluid d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-1 container-p-x py-4">
        <div class="allitemz">
            <div class="itemz">
                <h4 class="m-0" id="selected_count">10</h4>
            </div>
            <h5 class="coustom-fontz">Items selected</h5>
        </div>

        <div class="d-flex flex-column flex-sm-row">

            <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-copy menu-icon"></i>Duplicate</a>
            <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-file-export menu-icon"></i>Export</a>
            <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-box-archive menu-icon"></i>Archive</a>
            <a href="#" class="footer-link me-6 footzicon" id="delete_selected"><i class="fa-solid fa-trash-can menu-icon"></i>Delete</a>
            <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-arrow-turn-down menu-icon"></i>Convert</a>
            <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-arrow-right-from-bracket menu-icon"></i>Move to</a>
        </div>
    </div>
</footer>
<!-- </div> -->

<div class="modal fade" id="bill-view-modal" tabindex="-1" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="fileViewModalLabel">View File</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="operative-report-file-view-modal-content">
            </div>
        </div>
    </div>
</div>

@push('styles')
<style>
    .role-select-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 20px 10px;
    }

    .role-select-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 230px;
        padding: 12px 24px;
        background-color: #a47bc8;
        color: #ffffff !important;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
        border-radius: 10px;
        text-decoration: none;
        transition: all 0.25s ease-in-out;
        border: none;
    }

    .role-select-btn:hover {
        background-color: #a47bc8;
        color: #ffffff !important;
    }
</style>
@endpush

<!-- Add User Offcanvas -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="addUserOffcanvas" aria-labelledby="addUserOffcanvasLabel">
    <div class="offcanvas-header border-bottom">
        <h5 id="addUserOffcanvasLabel" class="offcanvas-title fw-bold">Select User Role</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div class="role-select-container">
            <a href="#" class="role-select-btn">Super Admin</a>
            <a href="#" class="role-select-btn">Admin</a>
            <a href="#" class="role-select-btn">Vendor Manager</a>
            <a href="#" class="role-select-btn">Product Manager</a>
            <a href="#" class="role-select-btn">Order Manager</a>
            <a href="#" class="role-select-btn">Inventory Manager</a>
            <a href="#" class="role-select-btn">Customer Support</a>
            <a href="#" class="role-select-btn">Finance</a>
            <a href="#" class="role-select-btn">Marketing</a>
            <a href="#" class="role-select-btn">Content Manager</a>
            <a href="#" class="role-select-btn">Report Manager</a>
            <a href="#" class="role-select-btn">Vendor</a>
            <a href="#" class="role-select-btn">Vendor Staff</a>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('modules/backend/js/Product Management/category.js') }}"></script>
<script src="../../assets/vendor/libs/apex-charts/apexcharts.js"></script>
<script src="../../assets/js/main.js"></script>
<script src="../../assets/js/cards-statistics.js"></script>
@endpush