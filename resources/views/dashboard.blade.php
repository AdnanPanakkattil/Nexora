@extends('layouts.backendlayouts')
@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush

<div class="container-xxl flex-grow-1 container-p-y">

    {{-- Page Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Dashboard</h4>
            <small class="text-muted">Welcome back, here's what's happening with your store today.</small>
        </div>
        <div class="text-end">
            <span id="currentDateTime" class="fw-medium"></span>
        </div>
    </div>

    {{-- Stat Cards --}}
    <div class="row g-4 mb-4">
        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="text-muted mb-1">Total Revenue</p>
                            <h4 class="mb-1">₹1,24,500</h4>
                            <small class="text-success fw-medium"><i class="fa-solid fa-arrow-up"></i> 12.5%</small>
                        </div>
                        <div class="avatar">
                            <span class="avatar-initial rounded bg-label-primary">
                                <i class="fa-solid fa-indian-rupee-sign fs-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="text-muted mb-1">Total Orders</p>
                            <h4 class="mb-1">1,240</h4>
                            <small class="text-success fw-medium"><i class="fa-solid fa-arrow-up"></i> 8.2%</small>
                        </div>
                        <div class="avatar">
                            <span class="avatar-initial rounded bg-label-success">
                                <i class="fa-solid fa-cart-shopping fs-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="text-muted mb-1">Total Products</p>
                            <h4 class="mb-1">356</h4>
                            <small class="text-danger fw-medium"><i class="fa-solid fa-arrow-down"></i> 2.1%</small>
                        </div>
                        <div class="avatar">
                            <span class="avatar-initial rounded bg-label-warning">
                                <i class="fa-solid fa-box fs-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="text-muted mb-1">New Customers</p>
                            <h4 class="mb-1">89</h4>
                            <small class="text-success fw-medium"><i class="fa-solid fa-arrow-up"></i> 15.3%</small>
                        </div>
                        <div class="avatar">
                            <span class="avatar-initial rounded bg-label-info">
                                <i class="fa-solid fa-user-plus fs-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Chart + Order Status --}}
    <div class="row g-4 mb-4">
        <div class="col-xl-8">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Sales Overview</h5>
                    <select class="form-select form-select-sm w-auto">
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div class="card-body">
                    <div id="salesChart"></div>
                </div>
            </div>
        </div>

        <div class="col-xl-4">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="mb-0">Order Status</h5>
                </div>
                <div class="card-body">
                    <div id="orderStatusChart"></div>
                </div>
            </div>
        </div>
    </div>

    {{-- Recent Orders Table --}}
    <div class="row g-4">
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Recent Orders</h5>
                    <a href="#" class="btn btn-sm btn-primary">View All</a>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD-1024</td>
                                <td>Anoop K</td>
                                <td>Wireless Mouse</td>
                                <td>₹499</td>
                                <td><span class="badge bg-label-success">Delivered</span></td>
                                <td>19 Jul 2026</td>
                            </tr>
                            <tr>
                                <td>#ORD-1023</td>
                                <td>Sreelakshmi P</td>
                                <td>Bluetooth Speaker</td>
                                <td>₹1,299</td>
                                <td><span class="badge bg-label-warning">Pending</span></td>
                                <td>19 Jul 2026</td>
                            </tr>
                            <tr>
                                <td>#ORD-1022</td>
                                <td>Rahul M</td>
                                <td>USB-C Cable</td>
                                <td>₹199</td>
                                <td><span class="badge bg-label-danger">Cancelled</span></td>
                                <td>18 Jul 2026</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</div>
@endsection

@push('scripts')
{{-- If your layout doesn't already load ApexCharts locally, this CDN guarantees it works --}}
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<script>
    function updateDateTime() {
        const now = new Date();
        document.getElementById('currentDateTime').innerText = now.toLocaleString();
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof ApexCharts === 'undefined') {
            console.error('ApexCharts not loaded — check script path/order.');
            return;
        }

        // Sales line chart
        const salesChart = new ApexCharts(document.querySelector("#salesChart"), {
            chart: { type: 'area', height: 300, toolbar: { show: false } },
            series: [{ name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }],
            xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'] },
            colors: ['#696cff'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 }
        });
        salesChart.render();

        // Order status donut
        const orderStatusChart = new ApexCharts(document.querySelector("#orderStatusChart"), {
            chart: { type: 'donut', height: 300 },
            series: [44, 33, 23],
            labels: ['Delivered', 'Pending', 'Cancelled'],
            colors: ['#71dd37', '#ffab00', '#ff3e1d']
        });
        orderStatusChart.render();
    });
</script>
@endpush