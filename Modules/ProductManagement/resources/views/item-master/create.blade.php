@extends('layouts.backendlayouts')
@section('title', 'Create Item Master')

@section('content')

<div class="col-12">
    {{-- Page Header --}}
    <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
            <h4 class="fw-bold mb-1">Create Item</h4>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <a href="{{ url('/dashboard') }}" class="text-muted">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item">
                        <span class="text-muted">Product Management</span>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="{{ route('item-master.index') }}" class="text-muted">Item Master</a>
                    </li>
                    <li class="breadcrumb-item active">Create</li>
                </ol>
            </nav>
        </div>
        <a href="{{ route('item-master.index') }}" class="btn btn-outline-secondary">
            <i class="ti ti-arrow-left me-1"></i> Back to List
        </a>
    </div>

    {{-- Form Card --}}
    <div class="card">
        <div class="card-body">
            <form action="{{ route('item-master.store') }}" method="POST">
                @csrf

                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Item Code <span class="text-danger">*</span></label>
                        <input type="text" name="item_code" class="form-control @error('item_code') is-invalid @enderror" value="{{ old('item_code') }}" required>
                        @error('item_code')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">Item Name <span class="text-danger">*</span></label>
                        <input type="text" name="item_name" class="form-control @error('item_name') is-invalid @enderror" value="{{ old('item_name') }}" required>
                        @error('item_name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Category</label>
                        <input type="text" name="category" class="form-control" value="{{ old('category') }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Brand</label>
                        <input type="text" name="brand" class="form-control" value="{{ old('brand') }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Unit</label>
                        <input type="text" name="unit" class="form-control" value="{{ old('unit') }}" placeholder="e.g. Kg, Ltr, Pcs">
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Purchase Price <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" step="0.01" name="purchase_price" class="form-control @error('purchase_price') is-invalid @enderror" value="{{ old('purchase_price', 0) }}" required>
                        </div>
                        @error('purchase_price')
                            <div class="text-danger small mt-1">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Selling Price <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" step="0.01" name="selling_price" class="form-control @error('selling_price') is-invalid @enderror" value="{{ old('selling_price', 0) }}" required>
                        </div>
                        @error('selling_price')
                            <div class="text-danger small mt-1">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Tax Percentage (%)</label>
                        <input type="number" step="0.01" name="tax_percentage" class="form-control" value="{{ old('tax_percentage', 0) }}">
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Initial Stock Quantity</label>
                        <input type="number" name="stock_quantity" class="form-control" value="{{ old('stock_quantity', 0) }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Barcode</label>
                        <input type="text" name="barcode" class="form-control" value="{{ old('barcode') }}">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Status</label>
                        <select name="status" class="form-select">
                            <option value="active" {{ old('status') == 'active' ? 'selected' : '' }}>Active</option>
                            <option value="inactive" {{ old('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
                        </select>
                    </div>

                    <div class="col-12">
                        <label class="form-label">Description</label>
                        <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
                    </div>
                </div>

                <div class="mt-4 text-end">
                    <button type="submit" class="btn btn-primary">
                        <i class="ti ti-device-floppy me-1"></i> Save Item
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection
