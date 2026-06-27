@extends('layouts.backendlayouts')
@section('title', 'Item Master')

@section('content')

<div class="col-12">

    {{-- Page Header --}}
    <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
            <h4 class="fw-bold mb-1">Item Master</h4>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <span class="text-muted">Product Management</span>
                    </li>
                    <li class="breadcrumb-item active">Item Master</li>
                </ol>
            </nav>
        </div>
        <a href="{{ route('item-master.create') }}" class="btn btn-primary">
            <i class="ti ti-plus me-1"></i> Add New Item
        </a>
    </div>

    {{-- Flash Messages --}}
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show mb-3" role="alert">
            <i class="ti ti-circle-check me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    {{-- DataTable Card --}}
    <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between py-3">
            <h5 class="card-title mb-0">Items List</h5>
        </div>
        <div class="card-body px-0">
            <div class="table-responsive px-3">
                <table id="itemMasterTable" class="table  table-bordered align-middle w-100">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Unit</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Tax %</th>
                            <th>Stock Qty</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($items as $index => $item)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>
                                <span class="fw-semibold text-primary">{{ $item->item_code }}</span>
                            </td>
                            <td>{{ $item->item_name }}</td>
                            <td>{{ $item->category ?? '—' }}</td>
                            <td>{{ $item->brand ?? '—' }}</td>
                            <td>{{ $item->unit ?? '—' }}</td>
                            <td class="text-end">
                                ₹{{ number_format($item->purchase_price, 2) }}
                            </td>
                            <td class="text-end">
                                ₹{{ number_format($item->selling_price, 2) }}
                            </td>
                            <td class="text-center">{{ $item->tax_percentage }}%</td>
                            <td class="text-center">
                                @if($item->stock_quantity <= 0)
                                    <span class="badge bg-label-danger">{{ $item->stock_quantity }}</span>
                                @elseif($item->stock_quantity <= 10)
                                    <span class="badge bg-label-warning">{{ $item->stock_quantity }}</span>
                                @else
                                    <span class="badge bg-label-success">{{ $item->stock_quantity }}</span>
                                @endif
                            </td>
                            <td class="text-center">
                                @if($item->status === 'active')
                                    <span class="badge bg-label-success">Active</span>
                                @else
                                    <span class="badge bg-label-secondary">Inactive</span>
                                @endif
                            </td>
                            <td>
                                <div class="d-flex gap-1 justify-content-center">
                                    <a href="{{ route('item-master.edit', $item->id) }}"
                                       class="btn btn-sm btn-icon btn-outline-primary"
                                       title="Edit">
                                        <i class="ti ti-pencil"></i>
                                    </a>
                                    <form action="{{ route('item-master.destroy', $item->id) }}"
                                          method="POST"
                                          class="d-inline delete-form">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                                class="btn btn-sm btn-icon btn-outline-danger"
                                                title="Delete"
                                                onclick="return confirmDelete(this)">
                                            <i class="ti ti-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="12" class="text-center py-5">
                                <div class="d-flex flex-column align-items-center text-muted">
                                    <i class="ti ti-box-off mb-2" style="font-size: 2.5rem;"></i>
                                    <p class="mb-1">No items found.</p>
                                    <a href="{{ route('item-master.create') }}" class="btn btn-sm btn-primary mt-2">
                                        <i class="ti ti-plus me-1"></i> Add First Item
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

@endsection

@section('page-script')
<script>
    // Initialize DataTable
    $(document).ready(function () {
        $('#itemMasterTable').DataTable({
            responsive: true,
            pageLength: 25,
            order: [[0, 'asc']],
            columnDefs: [
                { orderable: false, targets: [11] }
            ],
            language: {
                search: '',
                searchPlaceholder: 'Search items...',
                lengthMenu: 'Show _MENU_ entries',
                info: 'Showing _START_ to _END_ of _TOTAL_ items',
                paginate: {
                    previous: '<i class="ti ti-chevron-left"></i>',
                    next: '<i class="ti ti-chevron-right"></i>'
                }
            },
            dom: '<"d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 mb-3"lf>rt<"d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 mt-3"ip>'
        });
    });

    // Delete confirmation
    function confirmDelete(btn) {
        event.preventDefault();
        Swal.fire({
            title: 'Delete Item?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                btn.closest('form').submit();
            }
        });
        return false;
    }
</script>
@endsection
