@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
<link rel="stylesheet" href="{{ asset('page-css/productManagement/product-add.css') }}">
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

<div class="container-fluid py-4 product-add-container">
    <form id="product_add_form" enctype="multipart/form-data" action="" method="POST">
        @csrf
        
        <!-- Header & Action Bar -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div>
                <h3 class="fw-bold mb-1" style="color: #1e2022; font-size: 1.5rem;">Add New Product</h3>
            </div>
            
            <div class="d-flex align-items-center gap-2 mt-3 mt-md-0">
                <a href="#" class="btn btn-outline-cancel">Cancel</a>
                <div class="btn-group">
                    <button type="submit" class="btn btn-primary-purple d-flex align-items-center gap-2" id="saveProductBtn">
                        Save Product
                    </button>
                   
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Left Column -->
            <div class="col-12 col-lg-8">
                
                <!-- 01 Basic Information -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">01</div>
                        <h5 class="section-title">Basic Information</h5>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label-custom">Product Name (English) <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-custom" name="product_name_en" id="product_name_en" placeholder="Enter product name in English" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label-custom">Product Name (Arabic) <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-custom text-end" name="product_name_ar" id="product_name_ar" placeholder="اكتب اسم المنتج بالعربية" dir="rtl" required>
                        </div>

                        <div class="col-12">
                            <label class="form-label-custom">Slug <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-custom" name="slug" id="slug" placeholder="enter-product-slug" required>
                            <span class="input-caption">URL friendly unique slug</span>
                        </div>

                        <div class="col-md-5">
                            <label class="form-label-custom">Short Description</label>
                            <textarea class="form-control form-control-custom" name="short_description" id="short_description" rows="5" placeholder="Enter short description" maxlength="150"></textarea>
                            <div class="char-counter">0 / 150</div>
                        </div>

                        <div class="col-md-7">
                            <label class="form-label-custom">Description</label>
                            <div class="editor-container">
                                <div class="editor-toolbar">
                                    <select class="form-select-sm">
                                        <option>Paragraph</option>
                                        <option>Heading 1</option>
                                        <option>Heading 2</option>
                                    </select>
                                    <button type="button" class="editor-btn"><i class="ti ti-bold"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-italic"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-underline"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-strikethrough"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-list"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-list-numbers"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-align-left"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-link"></i></button>
                                    <button type="button" class="editor-btn"><i class="ti ti-photo"></i></button>
                                </div>
                                <div class="editor-content" contenteditable="true" placeholder="Enter product description..."></div>
                                <textarea name="description" id="description" class="d-none"></textarea>
                            </div>
                            <div class="char-counter">0 / 2000</div>
                        </div>
                    </div>
                </div>

                <!-- 02 Classification -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">02</div>
                        <h5 class="section-title">Classification</h5>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-4">
                            <label class="form-label-custom">Category <span class="text-danger">*</span></label>
                            <select class="form-select form-select-custom" name="category_id" id="category_id">
                                <option value="" selected disabled>Select category</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label-custom">Sub Category <span class="text-danger">*</span></label>
                            <select class="form-select form-select-custom" name="sub_category_id" id="sub_category_id">
                                <option value="" selected disabled>Select sub category</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label-custom">Child Category <span class="text-danger">*</span></label>
                            <select class="form-select form-select-custom" name="child_category_id" id="child_category_id">
                                <option value="" selected disabled>Select child category</option>
                            </select>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label-custom">Brand <span class="text-danger">*</span></label>
                            <select class="form-select form-select-custom" name="brand_id" id="brand_id">
                                <option value="" selected disabled>Select brand</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label-custom">Unit <span class="text-danger">*</span></label>
                            <select class="form-select form-select-custom" name="unit_id" id="unit_id">
                                <option value="" selected disabled>Select unit</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 03 Pricing -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">03</div>
                        <h5 class="section-title">Pricing</h5>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label-custom">Cost Price <span class="text-danger">*</span></label>
                            <div class="currency-input-group">
                                <span class="currency-symbol">₹</span>
                                <input type="number" step="0.01" class="form-control form-control-custom" name="cost_price" id="cost_price" value="0.00">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-custom">Selling Price <span class="text-danger">*</span></label>
                            <div class="currency-input-group">
                                <span class="currency-symbol">₹</span>
                                <input type="number" step="0.01" class="form-control form-control-custom" name="selling_price" id="selling_price" value="0.00">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-custom">Offer Price</label>
                            <div class="currency-input-group">
                                <span class="currency-symbol">₹</span>
                                <input type="number" step="0.01" class="form-control form-control-custom" name="offer_price" id="offer_price" value="0.00">
                            </div>
                            <span class="input-caption">Leave blank if no offer</span>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label-custom">Tax (%)</label>
                            <input type="number" class="form-control form-control-custom" name="tax_percentage" id="tax_percentage" value="0">
                            <span class="input-caption">Example: 18 for 18%</span>
                        </div>
                    </div>
                </div>

                <!-- 04 Inventory -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">04</div>
                        <h5 class="section-title">Inventory</h5>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label-custom">SKU <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-custom" name="sku" id="sku" placeholder="Enter SKU">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-custom">Barcode</label>
                            <div class="position-relative">
                                <input type="text" class="form-control form-control-custom pe-4" name="barcode" id="barcode" placeholder="Enter barcode">
                                <button type="button" class="btn btn-link p-0 position-absolute end-0 top-50 translate-middle-y me-2 text-muted" title="Scan Barcode">
                                    <i class="ti ti-scan fs-5"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-custom">Current Stock <span class="text-danger">*</span></label>
                            <input type="number" class="form-control form-control-custom" name="current_stock" id="current_stock" value="0">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label-custom">Minimum Stock <span class="text-danger">*</span></label>
                            <input type="number" class="form-control form-control-custom" name="minimum_stock" id="minimum_stock" value="0">
                        </div>
                    </div>
                </div>

            </div>

            <!-- Right Column Sidebar -->
            <div class="col-12 col-lg-4">
                
                <!-- 05 Media -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">05</div>
                        <h5 class="section-title">Media</h5>
                    </div>

                    <div class="mb-3">
                        <label class="form-label-custom">Thumbnail <span class="text-danger">*</span></label>
                        <div class="upload-box" onclick="document.getElementById('thumbnail_input').click()">
                            <div class="upload-icon-wrapper">
                                <i class="ti ti-cloud-upload"></i>
                            </div>
                            <div class="upload-title">Upload Thumbnail</div>
                            <div class="upload-subtitle">JPG, PNG, WEBP (Max. 2MB)</div>
                            <input type="file" id="thumbnail_input" name="thumbnail" class="d-none" accept="image/*">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label-custom">Gallery Images</label>
                        <div class="upload-box" onclick="document.getElementById('gallery_input').click()">
                            <div class="upload-icon-wrapper">
                                <i class="ti ti-cloud-upload"></i>
                            </div>
                            <div class="upload-title">Upload Images</div>
                            <div class="upload-subtitle">JPG, PNG, WEBP (Max. 5MB)</div>
                            <input type="file" id="gallery_input" name="gallery[]" class="d-none" multiple accept="image/*">
                        </div>
                        <div class="gallery-grid">
                            <div class="gallery-preview-item"><i class="ti ti-photo"></i></div>
                            <div class="gallery-preview-item"><i class="ti ti-photo"></i></div>
                            <div class="gallery-preview-item"><i class="ti ti-photo"></i></div>
                            <div class="gallery-preview-item"><i class="ti ti-photo"></i></div>
                            <div class="gallery-add-item" onclick="document.getElementById('gallery_input').click()"><i class="ti ti-plus"></i></div>
                        </div>
                    </div>

                    <div>
                        <label class="form-label-custom">Product Video (Optional)</label>
                        <input type="url" class="form-control form-control-custom" name="product_video" id="product_video" placeholder="Enter video URL">
                        <span class="input-caption">YouTube / Vimeo / Direct video link</span>
                    </div>
                </div>

                <!-- 06 Settings -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">06</div>
                        <h5 class="section-title">Settings</h5>
                    </div>

                    <div class="setting-toggle-item">
                        <span class="setting-label">Status</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="status" id="statusToggle" checked onchange="document.getElementById('statusLabel').innerText = this.checked ? 'Active' : 'Inactive'">
                            </div>
                            <span class="toggle-status-text" id="statusLabel">Active</span>
                        </div>
                    </div>

                    <div class="setting-toggle-item">
                        <span class="setting-label">Featured</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="is_featured" id="featuredToggle" onchange="document.getElementById('featuredLabel').innerText = this.checked ? 'Yes' : 'No'">
                            </div>
                            <span class="toggle-status-text" id="featuredLabel">No</span>
                        </div>
                    </div>

                    <div class="setting-toggle-item">
                        <span class="setting-label">Trending</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="is_trending" id="trendingToggle" onchange="document.getElementById('trendingLabel').innerText = this.checked ? 'Yes' : 'No'">
                            </div>
                            <span class="toggle-status-text" id="trendingLabel">No</span>
                        </div>
                    </div>

                    <div class="setting-toggle-item">
                        <span class="setting-label">New Arrival</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="is_new_arrival" id="newArrivalToggle" onchange="document.getElementById('newArrivalLabel').innerText = this.checked ? 'Yes' : 'No'">
                            </div>
                            <span class="toggle-status-text" id="newArrivalLabel">No</span>
                        </div>
                    </div>

                    <div class="setting-toggle-item">
                        <span class="setting-label">Best Seller</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="is_best_seller" id="bestSellerToggle" onchange="document.getElementById('bestSellerLabel').innerText = this.checked ? 'Yes' : 'No'">
                            </div>
                            <span class="toggle-status-text" id="bestSellerLabel">No</span>
                        </div>
                    </div>
                </div>

                <!-- 07 Variants -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">07</div>
                        <h5 class="section-title">Variants</h5>
                    </div>

                    <div class="setting-toggle-item border-0 pb-1">
                        <span class="setting-label">Has Variants</span>
                        <div class="d-flex align-items-center">
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" name="has_variants" id="variantsToggle" onchange="document.getElementById('variantsLabel').innerText = this.checked ? 'Yes' : 'No'">
                            </div>
                            <span class="toggle-status-text" id="variantsLabel">No</span>
                        </div>
                    </div>
                    <span class="input-caption">Enable if product has different variants like size, color, etc.</span>
                </div>

                <!-- 08 SEO (Later) -->
                <div class="product-card">
                    <div class="section-header">
                        <div class="step-badge">08</div>
                        <h5 class="section-title">SEO <span class="fw-normal text-muted" style="font-size: 0.85rem;">(Later)</span></h5>
                    </div>

                    <p class="text-muted mb-0" style="font-size: 0.85rem;">SEO fields can be added after saving the product.</p>
                </div>

            </div>
        </div>
    </form>
</div>

@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/item-master.js') }}"></script>
<script>
    // Character counter helpers
    document.getElementById('short_description')?.addEventListener('input', function() {
        this.nextElementSibling.innerText = `${this.value.length} / 150`;
    });

    // Auto-generate slug from English product name
    document.getElementById('product_name_en')?.addEventListener('input', function() {
        const slugInput = document.getElementById('slug');
        if (slugInput) {
            slugInput.value = this.value.toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }
    });
</script>
@endpush