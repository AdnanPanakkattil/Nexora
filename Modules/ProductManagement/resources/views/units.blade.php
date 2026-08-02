@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
@endpush

@section('content')

{{-- Loader Overlay: AJAX request ചെയ്യുന്ന സമയത്ത് screen block ചെയ്യുന്നു --}}
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
    {{-- Page Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold py-3 mb-0">Units</h4>

        {{-- Add Unit Button: Click ചെയ്‌താൽ modal open ആകും --}}
        <button type="button" class="btn btn-primary" id="addUnitModalBtn">
            <i class="menu-icon tf-icons ti ti-plus"></i>Add Unit
        </button>
    </div>

    {{-- DataTable Card --}}
    <div class="card">
        <div class="card-datatable table-responsive p-3">
            {{--
                #unit_table → Unit.js-ൽ DataTable initialize ചെയ്യും.
                Columns: Id, Name EN, Name AR, Short Name, Status, Order, Actions
            --}}
            <table class="dt-advanced-search table customer-table" id="unit_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Unit Name (EN)</th>
                        <th>Unit Name (AR)</th>
                        <th>Short Name</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Unit Name (EN)</th>
                        <th>Unit Name (AR)</th>
                        <th>Short Name</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

{{-- ==================== Add / Edit Unit Modal ==================== --}}
{{-- Modal open ആകുമ്പോൾ Add Unit form കാണിക്കും.
     Edit click ചെയ്‌താൽ JS existing data populate ചെയ്യും. --}}

<div class="modal fade" id="addUnitModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                {{-- Modal title: Add → Edit-ൽ JS "Edit Unit" ആക്കി change ചെയ്യും --}}
                <h5 class="modal-title" id="unitModalTitle">Add Unit</h5>
                <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>
            </div>

            <div class="modal-body">
                <form id="addUnitForm">

                    {{-- Hidden field: unit_id ഉണ്ടെങ്കിൽ update, ഇല്ലെങ്കിൽ create --}}
                    <input type="hidden" id="unit_id" name="unit_id">

                    <div class="mb-3 row">
                        {{-- Unit Name English --}}
                        <div class="col-md-6 mb-3">
                            <label for="unitName_en" class="form-label labe">Unit Name (EN)</label>
                            <input
                                placeholder="e.g., Kilogram"
                                type="text"
                                class="form-control"
                                id="unitName_en"
                                name="unitName_en">
                            {{-- Validation error: unitName_en_error class → JS inject ചെയ്യും --}}
                            <span class="text-danger error-text unitName_en_error"></span>
                        </div>

                        {{-- Unit Name Arabic --}}
                        <div class="col-md-6 mb-3">
                            <label for="unitName_ar" class="form-label labe">Unit Name (AR)</label>
                            <input
                                placeholder="e.g., كيلوغرام"
                                type="text"
                                class="form-control"
                                id="unitName_ar"
                                name="unitName_ar">
                            {{-- Validation error: unitName_ar_error class → JS inject ചെയ്യും --}}
                            <span class="text-danger error-text unitName_ar_error"></span>
                        </div>

                        {{-- Short Name / Abbreviation --}}
                        <div class="col-md-12">
                            <label for="short_name" class="form-label labe">Short Name</label>
                            <input
                                placeholder="e.g., kg, pcs, ltr"
                                type="text"
                                class="form-control"
                                id="short_name"
                                name="short_name">
                            {{-- Optional field — no required validation --}}
                            <span class="text-danger error-text short_name_error"></span>
                        </div>
                    </div>

                    {{-- Form Action Buttons --}}
                    <div class="mt-4" style="display: flex; justify-content: center; gap: 10px;">
                        {{-- Save Button: Click → JS store AJAX call ചെയ്യും --}}
                        <button type="button" class="btn btn-primary" id="UnitSaveBtn">Save</button>
                        {{-- Close Button: Modal close ചെയ്യും --}}
                        <button type="button" class="btn btn-secondary" id="closeUnitBtn" data-bs-dismiss="modal">Close</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>
{{-- ==================== Modal End ==================== --}}

@endsection

@push('scripts')
{{-- Unit.js: DataTable init, CRUD AJAX calls, Modal handling --}}
<script src="{{ asset('page-js/productManagement/Unit.js') }}"></script>
@endpush
