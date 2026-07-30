@extends('layouts.backendlayouts')

@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/Text.css') }}">
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

    /* uplode image start */
.upload-wrapper{
    display:flex;
    align-items:center;
    justify-content:space-between;

    border:2px dashed #c9b5ff;
    border-radius:18px;

    background:linear-gradient(135deg,#faf8ff,#ffffff);

    padding:40px;
    min-height:250px;
}

.upload-left{
    width:60%;
}

.upload-content{
    cursor:pointer;
    text-align:center;
    display:flex;
    flex-direction:column;
    align-items:center;
}

.upload-icon{
    font-size:65px;
    color:#7c4dff;
    margin-bottom:15px;
}

.upload-content h5{
    font-weight:700;
    color:#222;
}

.upload-content p{
    color:#777;
    margin-bottom:5px;
}

.upload-content small{
    color:#999;
}

.browse-btn{
    display:inline-flex;
    align-items:center;
    gap:8px;

    padding:12px 25px;

    background:#6f42ff;
    color:#fff;

    border-radius:10px;
    font-weight:600;

    transition:.3s;
}

.browse-btn:hover{
    background:#5a32d4;
}

/* Right */

.preview-right{
    width:35%;
    display:flex;
    justify-content:center;
}

.preview-container{
    position:relative;
    width:180px;
    height:180px;
}

.preview-circle{
    width:100%;
    height:100%;
    border-radius:50%;
    background:#f4efff;
    border:8px solid white;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
    overflow:hidden;
}

.preview-image{
    width:100%;
    height:100%;
    object-fit:cover;
    border-radius:50%;
}

.placeholder-avatar{
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:60px;
    color:#b7a8ff;
}

.remove-image{
    position:absolute;
    top:2px;
    right:2px;
    width:42px;
    height:42px;
    border:none;
    border-radius:50%;
    background:#ff3b5c;
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    box-shadow:0 8px 20px rgba(255,59,92,.35);
    z-index:10;
    cursor:pointer;
    transition:.2s ease;
}

.remove-image:hover{
    transform:scale(1.1);
}


/* Responsive */

@media(max-width:768px){

.upload-wrapper{
    flex-direction:column;
    gap:30px;
}

.upload-left,
.preview-right{
    width:100%;
}

}

    /* uplode image end  */
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

<div class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold py-3 mb-0"> Categories</h4>

        <button type="button" class="btn btn-primary" id="addCategoryModalBtn">
            <i class="menu-icon tf-icons ti ti-plus"></i>Add Category
        </button>
    </div>
    <div class="card">
        <div class="card-datatable table-responsive p-3">
            <table class="dt-advanced-search table customer-table" id="category_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category Image</th>
                        <th>Category Name (EN)</th>
                        <th>Category Name (AR)</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Id</th>
                        <th>Category Image</th>
                        <th>Category Name (EN)</th>
                        <th>Category Name (AR)</th>
                        <th>Status</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<!-- catogery modal start-->

<div class="modal fade" id="addCategoryModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Category</h5>

                <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>
            </div>

            <div class="modal-body">
                <form id="addCategoryForm">
                    <input type="hidden" id="category_id">
                    <div class="mb-3 row">
                        <div class="col-md-12 mb-4">

                            <label class="form-label fw-semibold">
                                Category Image
                            </label>

                           <div class="upload-wrapper">

    <!-- Left Upload Content -->
    <div class="upload-left">
        <input type="file" id="memberPhoto" name="memberPhoto" accept="image/*" hidden>

        <label for="memberPhoto" class="upload-content" id="uploadContent">
            <i class="ti ti-cloud-upload upload-icon"></i>

            <h5>Drag & drop an image here</h5>
            <p>or click to browse</p>

            <small>PNG, JPG, WEBP • Max 2MB</small>

            <div class="browse-btn mt-3">
                <i class="ti ti-folder"></i>
                Browse Files
            </div>
        </label>
        <span class="text-danger error-text memberPhoto_error mt-2 d-block text-center"></span>
    </div>

    <!-- Right Preview -->
    <div class="preview-right">
        <div class="preview-container">
            <div class="preview-circle">
                <img id="imagePreview" class="preview-image d-none">
                <div class="placeholder-avatar" id="avatarPlaceholder">
                    <i class="ti ti-photo"></i>
                </div>
            </div>
            <button type="button" id="removeImage" class="remove-image d-none">
                <i class="ti ti-trash"></i>
            </button>
        </div>
    </div>


</div>

                        </div>
                        <div class="col-md-6">
                            <label for="categoryName_en" class="form-label labe">Category Name (EN)</label>
                            <input placeholder="Name English" type="text" class="form-control" id="categoryName_en" name="categoryName_en">
                            <span class="text-danger error-text categoryName_en_error"></span>
                        </div>
                        <div class="col-md-6">
                            <label for="categoryName_ar" class="form-label labe">Category Name (AR)</label>
                            <input placeholder="Name Arabic" type="text" class="form-control" id="categoryName_ar" name="categoryName_ar">
                            <span class="text-danger error-text categoryName_ar_error"></span>
                        </div>
                    </div>

                    <div class="mt-5" style="display: flex; justify-content: center; gap: 10px;">
                        <button type="button" class="btn btn-primary" id="CategorySaveBtn">Save</button>
                        <button type="button" class="btn btn-secondary" id="closebtn" data-bs-dismiss="modal">Close</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</div>

<!-- catogery modal end-->


@endsection

@push('scripts')
<script src="{{ asset('page-js/productManagement/Categories.js') }}"></script>
@endpush