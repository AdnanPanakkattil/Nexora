@extends('layouts.backendlayouts')
@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
<style>
    .stat-ring-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3.5px solid;
        font-size: 1.15rem;
    }
    .stat-ring-primary {
        background-color: #f0f3ff;
        border-color: #6366f1;
        color: #4f46e5;
    }
    .stat-ring-success {
        background-color: #e6fffa;
        border-color: #14b8a6;
        color: #0d9488;
    }
    .stat-ring-warning {
        background-color: #fffbe6;
        border-color: #f59e0b;
        color: #d97706;
    }
    .stat-ring-danger {
        background-color: #fff5f5;
        border-color: #f87171;
        color: #ef4444;
    }
</style>
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
        {{-- Card 1: Total Sales --}}
        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="fw-bold mb-2 ">Total Sales</h6>
                                <span class="text-success fw-medium small">
                                    <i class="fa-solid fa-arrow-trend-up me-1"></i>8.5%
                                </span>
                                <span class="text-muted small ms-1">vs last week</span>
                            </div>
                            <div class="position-relative d-inline-block" style="width: 52px; height: 52px;">
                                <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                    <circle cx="26" cy="26" r="22" fill="none" stroke="#eef2ff" stroke-width="3.5" />
                                    <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" data-percent="85" />
                                </svg>
                                <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #f0f3ff; color: #4f46e5;">
                                    <i class="fa-solid fa-bag-shopping"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-baseline mt-3">
                        <div>
                            <h4 class="fw-bold mb-0 d-inline-block" data-target="35780" data-prefix="$">$0</h4>
                            <span class="text-muted small">/weekly</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn p-0 text-muted" type="button">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Card 2: Revenue --}}
        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="fw-bold mb-2 ">Revenue</h6>
                                <span class="text-success fw-medium small">
                                    <i class="fa-solid fa-arrow-trend-up me-1"></i>5.7%
                                </span>
                                <span class="text-muted small ms-1">vs last week</span>
                            </div>
                            <div class="position-relative d-inline-block" style="width: 52px; height: 52px;">
                                <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                    <circle cx="26" cy="26" r="22" fill="none" stroke="#e6fffa" stroke-width="3.5" />
                                    <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#14b8a6" stroke-width="3.5" stroke-linecap="round" data-percent="75" />
                                </svg>
                                <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #e6fffa; color: #0d9488;">
                                    <i class="fa-solid fa-credit-card"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-baseline mt-3">
                        <div>
                            <h4 class="fw-bold mb-0 d-inline-block" data-target="2458" data-prefix="$">$0</h4>
                            <span class="text-muted small">/weekly</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn p-0 text-muted" type="button">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Card 3: Total Orders --}}
        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="fw-bold mb-2 ">Total Orders</h6>
                                <span class="text-danger fw-medium small">
                                    <i class="fa-solid fa-arrow-trend-down me-1"></i>2.1%
                                </span>
                                <span class="text-muted small ms-1">vs last week</span>
                            </div>
                            <div class="position-relative d-inline-block" style="width: 52px; height: 52px;">
                                <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                    <circle cx="26" cy="26" r="22" fill="none" stroke="#fffbe6" stroke-width="3.5" />
                                    <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" data-percent="65" />
                                </svg>
                                <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #fffbe6; color: #d97706;">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-baseline mt-3">
                        <div>
                            <h4 class="fw-bold mb-0 d-inline-block" data-target="1245">0</h4>
                            <span class="text-muted small">/weekly</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn p-0 text-muted" type="button">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Card 4: New Customers --}}
        <div class="col-sm-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="fw-bold mb-2 ">New Customers</h6>
                                <span class="text-success fw-medium small">
                                    <i class="fa-solid fa-arrow-trend-up me-1"></i>12%
                                </span>
                                <span class="text-muted small ms-1">vs last week</span>
                            </div>
                            <div class="position-relative d-inline-block" style="width: 52px; height: 52px;">
                                <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                    <circle cx="26" cy="26" r="22" fill="none" stroke="#fff5f5" stroke-width="3.5" />
                                    <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round" data-percent="80" />
                                </svg>
                                <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #fff5f5; color: #ef4444;">
                                    <i class="fa-solid fa-user-group"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-baseline mt-3">
                        <div>
                            <h4 class="fw-bold mb-0 d-inline-block" data-target="320">0</h4>
                            <span class="text-muted small">/weekly</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn p-0 text-muted" type="button">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Chart + Order Status --}}
    <div class="row g-4 mb-4">
        <div class="col-xl-6">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Sales Summary</h5>
                    <select class="form-select form-select-sm w-auto border-0 text-muted shadow-none">
                        <option>Monthly</option>
                        <option>Weekly</option>
                        <option>Yearly</option>
                    </select>
                </div>
                <div class="card-body">
                    <div id="chart"></div>
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

    {{-- Revenue Statistics Card --}}
    <div class="row g-4 mb-4">
        <div class="col-6">
            <div class="card">
                <div class="card-header pb-0">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0 fw-bold fs-5">Revenue Statistics</h5>
                        <button class="btn text-white btn-sm px-3" style="background-color: #8c57ff; border-color: #8c57ff;">
                            <i class="fa-solid fa-download me-1"></i> Download
                        </button>
                    </div>
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div class="d-flex gap-4">
                            <div>
                                <small class="text-muted d-block fw-medium">Total Revenue</small>
                                <h4 class="fw-bold mb-0">$85,24k</h4>
                            </div>
                            <div>
                                <small class="text-muted d-block fw-medium">Total Refunds</small>
                                <h4 class="fw-bold mb-0">$4,125</h4>
                            </div>
                        </div>
                        <div class="nav-align-top">
                            <div class="btn-group btn-group-sm p-1 rounded-3" style="background-color: #f5f5f7;">
                                <button type="button" class="btn btn-white shadow-sm fw-semibold rounded-2 px-3">Monthly</button>
                                <button type="button" class="btn text-muted fw-semibold rounded-2 px-3">Yearly</button>
                                <button type="button" class="btn text-muted fw-semibold rounded-2 px-3">Weekly</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-2">
                    <div id="revenueStatisticsChart"></div>
                </div>
            </div>
        </div>
    </div>

    {{-- Monthly Earnings & Weekly Orders Cards --}}
    <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <h4 class="fw-bold mb-1">$71.5k</h4>
                            <span class="text-muted small">Monthly Earnings</span>
                        </div>
                        <span class="text-success fw-medium small">
                            <i class="fa-solid fa-arrow-trend-up me-1"></i>3.5%
                        </span>
                    </div>
                    <div id="monthlyEarningsChart" class="d-flex justify-content-center"></div>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-xl-3">
            <div class="card h-100">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <div>
                                <h4 class="fw-bold mb-1">185k</h4>
                                <span class="text-muted small">Weekly Orders</span>
                            </div>
                            <span class="text-danger fw-medium small">
                                <i class="fa-solid fa-arrow-trend-down me-1"></i>4.5%
                            </span>
                        </div>
                        <div id="weeklyOrdersChart"></div>
                    </div>
                    <div class="mt-2 text-muted small">
                        Last week <span class="text-success fw-medium">+8.2%</span>
                    </div>
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
<script src="{{ asset('page-js/dashboard-charts.js') }}"></script>
@endpush