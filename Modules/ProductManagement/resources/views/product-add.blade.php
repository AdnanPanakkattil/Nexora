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
   <form id="lab_items" enctype="multipart/form-data">
<input type="hidden" id="edit_lab_itemsId" value="">
    <div class="mt-5">
        <div class="">
            <div class="app-ecommerce">
                <div class=" " style="zoom: 85%;">
                    <div class="row">
                        <div class="col-12 col-lg-8">
                            <div class="card mb-6">
                                <div class="card invoice-preview-card p-sm-12 p-6">
                                    <div class="d-flex align-items-center justify-content-between mt-8 mb-8">
                                        <div class="d-flex align-items-center flex-column">
                                            <h4 class="m-0 primarycol">Product</h4>
                                        </div>
                                        <div class="d-flex align-items-center">

                
                                            <button type="submit" class="btn btn-primary waves-effect waves-light me-2" id="savelabeitemsButton">
                                                <i class="ti ti-box me-2"></i> Save
                                            </button>
                                            <button type="button" class="btn btn-label-primary waves-effect waves-light me-2" id="item_master_settings_btn">
                                                <i class="ti ti-settings me-2"></i> Setting
                                            </button>

                                            <a id="backToLabitemView" class="btn btn-label-secondary waves-effect waves-light me-2">
                                                <i class="ti ti-arrow-left me-2"></i> Back
                                            </a>
                                        </div>
                                    </div>

                                    <hr class="mt-0 mb-6 custom-line">
        


                                    <div class="d-flex flex-wrap flex-column flex-sm-row justify-content-between text-heading mb-5">
                                        <!-- SKU -->
                                        <div class="col-md-5 pe-0 ps-0 ps-md-2">
                                            <dl class="row mb-0 align-items-center">
                                                <dt class="col-sm-2 mb-2 d-flex align-items-center justify-content-end text-end">
                                                    <span class="h5 primarycol mb-0 text-nowrap ">
                                                        sku
                                                    </span>
                                                </dt>

                                                <dd class="col-sm-7 mb-0 ps-1">
                                                    <input type="text"
                                                        name="sku"
                                                        id="sku"
                                                        class="form-control"
                                                        placeholder=""
                                                        value="{{ old('sku', $itemMaster->sku ?? '') }}">

                                                    <small id="skuError" class="text-danger d-none">
                                                        SKUreq
                                                    </small>
                                                </dd>
                                            </dl>
                                        </div>

                                        <div class="col-md-5 pe-0 ps-0 ps-md-2 mb-5">
                                            <dl class="row mb-0">
                                                <dt class="col-sm-5 mb-2 d-md-flex align-items-center justify-content-end text-end">
                                                    <span class="h5 primarycol text-capitalize mb-0 text-nowrap">
                                                        Item Code
                                                    </span>
                                                </dt>
                                                <dd class="col-sm-7">
                                                    <div class="input-group input-group-merge">
                                                        <input type="text" class="form-control" id="itemcodeId" name="itemcodeId" readonly>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>

                                    <div class="row mb-6">
                                        <div class="col">
                                            <label class="form-label labe" for="ecommerce-product-name">Item Name English</label>
                                            <input
                                                type="text"
                                                class="form-control "
                                                id="itemName_en"
                                                placeholder=""
                                                name="itemName_en"
                                                aria-label="Product title" />
                                            <span class="text-danger itemName_en_error error-text"></span>
                                        </div>
                                        <div class="col">
                                            <label class="form-label labe" for="ecommerce-product-name">Item Name Arabic</label>
                                            <input
                                                type="text"
                                                class="form-control "
                                                id="itemName_ar"
                                                placeholder=""
                                                name="itemName_ar"
                                                aria-label="Product title" />
                                            <span class="text-danger itemName_ar_error error-text"></span>
                                        </div>
                                    </div>
                                    <div class="row mb-6">
                                        <div class="col">
                                            <label class="form-label labez" for="ecommerce-product-sku">Min Retails Price</label>
                                            <input
                                                type="text"
                                                id="itemMinRetailPrice"
                                                class="form-control "
                                                name="itemMinRetailPrice"
                                                placeholder="" />
                                            <span class="text-danger itemMinRetailPrice_error error-text"></span>

                                        </div>
                                        <div class="col">
                                            <label class="form-label labez" for="ecommerce-product-barcode"> Profit Level</label>
                                            <input
                                                type="text"
                                                id="itemProfitLevel"
                                                class="form-control "
                                                name="itemProfitLevel"
                                                placeholder="" />
                                            <span class="text-danger itemProfitLevel_error error-text"></span>
                                        </div>
                                        <div class="col">
                                            <label class="form-label labe" for="ecommerce-product-sku">Minimum Qty</label>
                                            <input
                                                type="text"
                                                id="itemMinimunQty"
                                                class="form-control "
                                                name="itenMinimunQty"
                                                placeholder="" />
                                            <span class="text-danger itemMinimunQty_error error-text"></span>
                                        </div>
                                    </div>
                                    <div class="row mb-6">
                                        <div class="col">
                                            <label class="form-label labe" for="ecommerce-product-sku">Reorder Qty</label>
                                            <input
                                                type="text"
                                                id="itemReorderQty"
                                                class="form-control "
                                                name="itemReorderQty"
                                                placeholder="" />
                                            <span class="text-danger itemReorderQty_error error-text"></span>
                                        </div>
                                        <div class="col">
                                            <label class="form-label labez" for="ecommerce-product-sku">Maximum Qty</label>
                                            <input
                                                type="text"
                                                id="itemMaximunQty"
                                                class="form-control "
                                                name="itemMaximunQty"
                                                placeholder="" />
                                            <span class="text-danger itemMaximunQty_error error-text"></span>
                                        </div>
                                     
                                    </div>
                                    <div class="row mb-6">
                                        <div class="col">
                                            <label class="form-label labez" for="ecommerce-product-sku">Description</label>
                                            <input
                                                type="text"
                                                id="itemDescription"
                                                class="form-control "
                                                name="itemDescription"
                                                placeholder="" />
                                            <span class="text-danger itemDescription_error error-text"></span>
                                        </div>
                                        <div class="col">
                                            <label class="form-label labez" for="ecommerce-product-sku">Note</label>
                                            <input
                                                type="text"
                                                id="itemNote"
                                                class="form-control "
                                                name="itemNote"
                                                placeholder="" />
                                            <span class="text-danger itemNote_error error-text"></span>
                                        </div>
                                        
                                    </div>

                                    <h5 class="card-header primarycol p-0 mb-10 mt-5">unit
                                    </h5>
                                    <div class="form-repeater">
                                        <div data-repeater-list="group-a">
                                            <div data-repeater-item>
                                                <div class="row align-items-end">

                                                 

                                                    <!-- Add Button -->
                                                    <div class="col-lg-1 col-md-1 text-center">
                                                        <div class="mb-3">
                                                            <button type="button"
                                                                class="btn btn-primary btn-icon w-100"
                                                                id="showUnitModal">
                                                                <i class="ti ti-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <!-- Cost Price -->
                                                    <div class="col-lg-3 col-md-3">
                                                        <div class="mb-3">
                                                            <label class="form-label labez">
                                                                Cost Price
                                                            </label>
                                                            <input type="text"
                                                                id="itemBasicCostPrice"
                                                                name="itemBasicCostPrice"
                                                                class="form-control">
                                                        </div>
                                                    </div>

                                                    <!-- Selling Price -->
                                                    <div class="col-lg-3 col-md-3">
                                                        <div class="mb-3">
                                                            <label class="form-label labez">
                                                                Selling Price
                                                            </label>
                                                            <input type="text"
                                                                id="itemBasicSellingPrice"
                                                                name="itemBasicSellingPrice"
                                                                class="form-control">
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr class="mt-0" />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="otherUnitFormsContainer">
                                        <h5 class="card-header primarycol p-0 mb-10 mt-4">Other Units</h5>

                                        <div class="form-repeater" id="otherUnitForm">
                                            <div id="otherUnitRepeater" data-repeater-list="group-a">

                                                <div class="repeater-item" id="initial_repeater_item" data-repeater-item>

                                                    <div class="row g-3 align-items-end">

                                                        <!-- Other Unit -->
                                                       

                                                        <!-- Multiple -->
                                                        <div class="col-lg-1 col-md-1">
                                                            <div class="mb-3">
                                                                <label class="form-label labez">Multiple</label>

                                                                <input type="text"
                                                                    name="itemMultiple[]"
                                                                    class="form-control">

                                                                <span class="text-danger itemMultiple_error error-text"></span>
                                                            </div>
                                                        </div>

                                                        <!-- Cost Price -->
                                                        <div class="col-lg-2 col-md-2">
                                                            <div class="mb-3">
                                                                <label class="form-label labez">Cost Price</label>

                                                                <input type="text"
                                                                    name="itemOtherCostPrice[]"
                                                                    class="form-control">

                                                                <span class="text-danger itemOtherCostPrice_error error-text"></span>
                                                            </div>
                                                        </div>

                                                        <!-- Selling Price -->
                                                        <div class="col-lg-2 col-md-2">
                                                            <div class="mb-3">
                                                                <label class="form-label labez">Selling Price</label>

                                                                <input type="text"
                                                                    name="itemOthersellingPrice[]"
                                                                    class="form-control">

                                                                <span class="text-danger itemOthersellingPrice_error error-text"></span>
                                                            </div>
                                                        </div>

                                                        <!-- Add Button -->
                                                        <div class="col-lg-1 col-md-1">
                                                            <div class="mb-3">
                                                                <button type="button"
                                                                    class="btn btn-primary w-100 showOtherUnitForm">
                                                                    <i class="ti ti-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <!-- Delete Button -->
                                                        <div class="col-lg-2 col-md-2">
                                                            <div class="mb-3">
                                                                <button type="button"
                                                                    class="btn btn-label-danger w-100"
                                                                    id="delete_initial_row"
                                                                    name="0">
                                                                    <i class="ti ti-trash me-1"></i>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <hr>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="col-12 col-lg-4">
                          




                            <div class="card mb-6">
                                <div class="card-header">
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <input type="hidden" id="countRack" value="0">
                                        <div class="col-12 ">
                                            <label class="form-label labez" for="rack">rack</label>
                                            <div class="d-flex">
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        type="checkbox"
                                                        id="single_rack"
                                                        class="form-check-input"
                                                        name="single_rack"
                                                        value="single" />
                                                    <label class="form-check-label labez" for="single-rack">singleRack</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input
                                                        type="checkbox"
                                                        id="multiple_rack"
                                                        class="form-check-input"
                                                        name="multiple_rack"
                                                        value="multiple" />
                                                    <label class="form-check-label labez" for="multiple-rack">multipleRack</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-12 mb-8" id="single-input-box">
                                            <label class="form-label labez" for="selectpickerLiveSearch">singleRack</label>
                                            <input
                                                type="text"
                                                id="itemsingleRack"
                                                name="itemsingleRack"
                                                class="form-control"
                                                placeholder="Add Rack" />
                                            </select>
                                        </div>

                                        <div class="col-12 mb-8" id="multiple-input-box">
                                            <div id="multipleRackForm">
                                                <div id="multipleRackRepeater">
                                                    <label for="TagifyCustomListSuggestion" class="form-label labez">multipleRack</label>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        
                                        <button type="button" class="fw-medium btn btn-icon btn-primary ms-4" id="showBrandModal">
                                            <i class="ti ti-plus ti-md"></i>
                                        </button>
                                    </div>
                                   
                                    <div class="row" style=" margin-bottom: 15px; align-items: end;">
                                        <div class="col-sm-4 mb-4">
                                            <label class="form-label labez" for="ecommerce-product-sku">quantity</label>
                                            <input
                                                type="text"
                                                id="itemQuantity"
                                                class="form-control "
                                                name="itemQuantity"
                                                placeholder="" />
                                            <span class="text-danger itemQuantity_error error-text"></span>
                                        </div>
                                        <div class="col-sm-4 mb-4">
                                            <label class="form-label labez" for="ecommerce-product-sku">wholeSalePrice</label>
                                            <input
                                                type="text"
                                                id="itemWholesalePrice"
                                                class="form-control "
                                                name="itemWholesalePrice"
                                                placeholder="" />
                                            <span class="text-danger itemWholesalePrice_error error-text"></span>
                                        </div>
                                        <div class="col-sm-4 mb-4">
                                            <label class="form-label labez" for="ecommerce-product-sku">agencyPrice</label>
                                            <input
                                                type="text"
                                                id="itemAgencyPrice"
                                                class="form-control "
                                                name="itemAgencyPrice"
                                                placeholder="" />
                                            <span class="text-danger itemAgencyPrice_error error-text"></span>
                                        </div>
                                       
                                        <div class="mb-4">
                                            <label class="form-label labez">barcode</label>
                                            <input type="text" id="itembarcode" name="itembarcode" class="form-control" />
                                            <span class="text-danger barcode_error error-text"></span>
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label labez" for="">qrcode</label>
                                            <input type="text" id="itemQRcode" name="itemQRcode" class="form-control" />
                                            <span class="text-danger QRcode_error error-text"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</form>
<div class="content-backdrop fade"></div>
<div class="modal fade" id="itemMasterSettingsModal" tabindex="-1" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">itemMasterSettings</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <form id="service_common_group_form" action="">
                    <input type="hidden" id="common_group_id">
                    <input type="hidden" id="type" name="type" class="type">
                    <div class="row g-4 d-flex" style="justify-content: center;">

                        <div class="col-12  d-flex" style="flex-direction: column; align-items: center;">

                            <label for="selectpickerLiveSearch" class="form-label labez mb-5">disableOrEnable</label>
                            <div class="" style="display: flex; gap: 50px">

                                <div class="d-flex gap-7 mb-2">
                                    <div class="form-check form-switch me-n2">
                                        <input type="checkbox" class="form-check-input" id="otherUnitFlag" name="otherUnitFlag" value="0">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>

            </div>

            <div class="modal-footer" id="service_common_group_form_footer">
                <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
                    Close
                </button>
                <!-- <button type="button" class="btn btn-primary" id="invoice_settings_save_btn">Save changes</button> -->
            </div>
        </div>
    </div>
</div>

<!-- Modal for viewing file -->
<div class="modal fade" id="file-view-modal" tabindex="-1" aria-hidden="true" style="display: none;">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="fileViewModalLabel">View File</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="file-view-modal-content">
            </div>
        </div>
    </div>
</div>
</div>

@endsection
@push('scripts')
<script src="{{ asset('page-js/productManagement/item-master.js') }}"></script>
@endpush