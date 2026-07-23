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

    /* --- Responsive fixes --- */
    @media (max-width: 991.98px) {
        .card.sticky-top {
            position: static;
        }

        .welcome-vector {
            display: none;
        }
    }

    @media (max-width: 575.98px) {
        .rich-list-item {
            flex-wrap: wrap;
        }

        .rich-list-append {
            margin-left: auto;
        }
    }
</style>
@endpush
<!-- end page title -->
<div class="row g-3">
    <div class="col-12 col-xl-8 col-xxl-9">
        <div class="row g-3">
            <div class="col-12 col-lg-6 col-xxl-5">
                <div class="card overflow-hidden card-h-100">
                    <div class="card-body d-flex flex-column h-100 justify-content-between">
                        <div>
                            <h4 class="fw-medium mb-4">Welcome Back, Charlie!</h4>
                            <p class="mb-6 text-muted fs-14 lh-base max-w-96">Here’s a quick look at your store’s performance today.Stay on top of your sales, orders, and customers.</p>
                        </div>
                        <div>
                            <h3 class="fw-normal mb-2">$25,56k</h3>
                            <p class="text-muted fs-14 mb-6">Monthly Sales <span class="text-success me-1"><i data-eva="trending-up" class="size-4 me-1"></i>5.2%</span></p>
                            <a href="#!" class="btn btn-primary">View Reports</a>
                        </div>
                        <img src="{{ asset('assets/dashboard/welcome.png') }}"
                            alt="Welcome"
                            class="img-fluid position-absolute z-2 welcome-vector">
                        <div class="position-absolute h-44 w-44 bg-primary me-16 bottom-0 end-0 rounded-circle blury-effect"></div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-6 col-xxl-7">
                <div class="card">
                    <div class="card-header flex-wrap gap-2">
                        <h5 class="card-title">Sales Summary</h5>
                        <div class="dropdown">
                            <a href="#!" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="more">Monthly</a>
                            <ul class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                <li><a class="dropdown-item" href="#!">Weekly</a></li>
                                <li><a class="dropdown-item" href="#!">Monthly</a></li>
                                <li><a class="dropdown-item" href="#!">Yearly</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="chart"></div>
                    </div>
                </div>
            </div>
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

            <div class="col-12 col-md-6 col-xxl-4">
                <div class="card">
                    <div class="card-header flex-wrap gap-2">
                        <h5 class="card-title">Sales by Country</h5>
                        <a href="#!" class="text-muted">See All <i class="mdi mdi-arrow-right"></i></a>
                    </div>
                    <div class="card-body px-1 py-2">
                        <div class="px-1 mx-n1" data-simplebar style="max-height: 397px;">
                            <div class="table-responsive text-nowrap">
                                <table class="table table-borderless align-middle mb-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a href="#!" class="d-flex align-items-center gap-2 text-body">
                                                    <span class="avatar size-7 avatar-circle overflow-hidden">
                                                        <img src="assets/images/flag/us.svg" alt="Country" class="img-fluid">
                                                    </span>
                                                    <p class="fw-semibold mb-0">United States</p>
                                                </a>
                                            </td>
                                            <td>65%</td>
                                            <td>
                                                <div class="progress progress-sm w-24 ms-auto bg-primary-subtle">
                                                    <div class="progress-bar progress-bar-striped bg-primary" style="width: 65%;"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#!" class="d-flex align-items-center gap-2 text-body">
                                                    <span class="avatar size-7 avatar-circle overflow-hidden">
                                                        <img src="assets/images/flag/in.svg" alt="Country" class="img-fluid">
                                                    </span>
                                                    <p class="fw-semibold mb-0">India</p>
                                                </a>
                                            </td>
                                            <td>45%</td>
                                            <td>
                                                <div class="progress progress-sm w-24 ms-auto bg-warning-subtle">
                                                    <div class="progress-bar progress-bar-striped bg-warning" style="width: 45%;"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#!" class="d-flex align-items-center gap-2 text-body">
                                                    <span class="avatar size-7 avatar-circle overflow-hidden">
                                                        <img src="assets/images/flag/ca.svg" alt="Country" class="img-fluid">
                                                    </span>
                                                    <p class="fw-semibold mb-0">Canada</p>
                                                </a>
                                            </td>
                                            <td>74%</td>
                                            <td>
                                                <div class="progress progress-sm w-24 ms-auto bg-danger-subtle">
                                                    <div class="progress-bar progress-bar-striped bg-danger" style="width: 74%;"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#!" class="d-flex align-items-center gap-2 text-body">
                                                    <span class="avatar size-7 avatar-circle overflow-hidden">
                                                        <img src="assets/images/flag/it.svg" alt="Country" class="img-fluid">
                                                    </span>
                                                    <p class="fw-semibold mb-0">Italy</p>
                                                </a>
                                            </td>
                                            <td>64%</td>
                                            <td>
                                                <div class="progress progress-sm w-24 ms-auto bg-info-subtle">
                                                    <div class="progress-bar progress-bar-striped bg-info" style="width: 64%;"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-xxl-4">
                <div class="card">
                    <div class="card-header flex-wrap gap-2">
                        <h5 class="card-title">Top Products</h5>
                        <div class="dropdown">
                            <a href="#!" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="more">Weekly</a>
                            <ul class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                <li><a class="dropdown-item" href="#!">Weekly</a></li>
                                <li><a class="dropdown-item" href="#!">Monthly</a></li>
                                <li><a class="dropdown-item" href="#!">Yearly</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="rich-list px-4 mx-n4" data-simplebar style="max-height: 381px;">
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm bg-dark-subtle">
                                        <img src="assets/images/apps/ecommrece/buds.png" alt="Wireless Earbuds" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="apps-product-overview.html" class="rich-list-title text-body fs-14 fw-semibold">Wireless Earbuds</a>
                                    <span class="rich-list-subtitle">Electronics - 1,240 Units Sold</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$24,800</span>
                                </div>
                            </div>
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm bg-warning-subtle">
                                        <img src="assets/images/apps/ecommrece/honey.png" alt="Running Shoes" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="apps-product-overview.html" class="rich-list-title text-body fs-14 fw-semibold">Organic Honey</a>
                                    <span class="rich-list-subtitle">Grocery - 1,520 Units Sold</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$91,200</span>
                                </div>
                            </div>
                            
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm bg-primary-subtle">
                                        <img src="assets/images/apps/ecommrece/product-1.png" alt="Hydrating Beauty Cream" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="apps-product-overview.html" class="rich-list-title text-body fs-14 fw-semibold">Hydrating Beauty Cream</a>
                                    <span class="rich-list-subtitle">Beauty - 620 Units Sold</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$18,600</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 col-xxl-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Top Customers</h5>
                    </div>
                    <div class="card-body">
                        <div class="rich-list px-4 mx-n4" data-simplebar style="max-height: 378px;">
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm avatar-circle">
                                        <img src="assets/images/users/avatar-2.png" alt="Alice Johnson" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="#!" class="rich-list-title text-body fs-14 fw-semibold">Alice Johnson</a>
                                    <span class="rich-list-subtitle">Premium Customer - 45 Orders</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$12,500</span>
                                </div>
                            </div>
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm avatar-circle">
                                        <img src="assets/images/users/avatar-3.png" alt="Daniel Carter" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="#!" class="rich-list-title text-body fs-14 fw-semibold">Daniel Carter</a>
                                    <span class="rich-list-subtitle">Regular Customer - 32 Orders</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$8,200</span>
                                </div>
                            </div>
                            
                            <div class="rich-list-item px-0 py-2">
                                <div class="rich-list-prepend">
                                    <div class="avatar avatar-sm avatar-circle">
                                        <img src="assets/images/users/avatar-10.png" alt="Olivia Brown" class="size-7">
                                    </div>
                                </div>
                                <div class="rich-list-content">
                                    <a href="#!" class="rich-list-title text-body fs-14 fw-semibold">Olivia Brown</a>
                                    <span class="rich-list-subtitle">Premium Customer - 15 Orders</span>
                                </div>
                                <div class="rich-list-append text-end flex-column">
                                    <span class="fw-semibold text-body">$3,900</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-xl-4 col-xxl-3">
        <div class="card sticky-lg-top">
            <div class="card-body">
                <div class="mb-5">
                    <h5 class="card-title mb-2">Platforms :</h5>
                    <div class="rich-list">
                        <div class="d-flex align-items-center justify-content-between py-2">
                            <!-- Left -->
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded p-2 me-3">
                                    <img src="{{ asset('assets/dashboard/amazon.png') }}"
                                        alt="Amazon"
                                        width="28"
                                        height="28">
                                </div>

                                <div>
                                    <h6 class="mb-0 fw-semibold">Amazon</h6>
                                    <small class="text-muted">12.43k Orders · 45% Progress</small>
                                </div>
                            </div>

                            <!-- Right -->
                            <span class="badge bg-success-subtle text-success">
                                Top Seller
                            </span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between py-2">
                            <!-- Left -->
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded p-2 me-3">
                                    <img src="{{ asset('assets/dashboard/eBay.png') }}"
                                        alt="Amazon"
                                        width="28"
                                        height="28">
                                </div>

                                <div>
                                    <h6 class="mb-0 fw-semibold">eBay</h6>
                                    <small class="text-muted">8.92k Orders · 32% Progress</small>
                                </div>
                            </div>

                            <!-- Right -->
                            <span class="badge px-3 py-2"
                                style="background-color: #EEF0FF; color: #6C63FF;">
                                Trending
                            </span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between py-2">
                            <!-- Left -->
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded p-2 me-3">
                                    <img src="{{ asset('assets/dashboard/shopify.png') }}"
                                        alt="Amazon"
                                        width="28"
                                        height="28">
                                </div>

                                <div>
                                    <h6 class="mb-0 fw-semibold">Shopify</h6>
                                    <small class="text-muted">6.14k Orders · 25% Progress</small>
                                </div>
                            </div>

                            <!-- Right -->
                            <span class="badge px-3 py-2"
                                style="background-color: #FFF7E8; color: #F5B342;">
                                Fast Growth
                            </span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between py-2">
                            <!-- Left -->
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded p-2 me-3">
                                    <img src="{{ asset('assets/dashboard/flipkart.png') }}"
                                        alt="Flipkart"
                                        width="28"
                                        height="28">
                                </div>

                                <div>
                                    <h6 class="mb-0 fw-semibold">Flipkart</h6>
                                    <small class="text-muted">4.85k Orders · 18% Progress</small>
                                </div>
                            </div>

                            <!-- Right -->
                            <span class="badge bg-success-subtle text-success">
                                Growin
                            </span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between py-2">
                            <!-- Left -->
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded p-2 me-3">
                                    <img src="{{ asset('assets/dashboard/walmart.png') }}"
                                        alt="Walmart"
                                        width="28"
                                        height="28">
                                </div>

                                <div>
                                    <h6 class="mb-0 fw-semibold">Walmart</h6>
                                    <small class="text-muted">7.56k Orders · 28% Progress</small>
                                </div>
                            </div>

                            <!-- Right -->
                            <span class="badge bg-success-subtle text-success">
                                Low Stoc
                            </span>
                        </div>
                    </div>
                </div>
                <div class="mb-8">
                    <h5 class="card-title mb-4">Order Statistics :</h5>
                    <div class="d-flex flex-wrap align-items-start justify-content-between mb-5">
                        <div>
                            <h5 class="fw-medium mb-1">$71.5k</h5>
                            <p class="text-muted mb-0">Monthly Earnings</p>
                        </div>
                        <span class="text-muted"><i data-eva="trending-up" class="text-success me-1 size-4"></i>25% Increassed</span>
                    </div>
                    <div id="orderStatusChart"></div>
                </div>
                <div>
                    <h5 class="card-title mb-4">Quick Transiction :</h5>
                    <div class="mb-5">
                        <div class="d-flex flex-wrap align-items-center gap-2">
                            <a href="#!" class="avatar avatar-sm avatar-circle">
                                <img src="{{ asset('assets/dashboard/avatar-11.png') }}" class="size-7" alt="Client">
                            </a>
                            <a href="#!" class="avatar avatar-sm avatar-circle">
                                <img src="{{ asset('assets/dashboard/avatar-12.png ') }}" class="size-7" alt="Client">
                            </a>
                            <a href="#!" class="avatar avatar-sm avatar-circle">
                                <img src="{{ asset('assets/dashboard/avatar-10.png') }}" class="size-7" alt="Client">
                            </a>
                            <a href="#!" class="avatar avatar-sm avatar-circle">
                                <img src="{{ asset('assets/dashboard/avatar-9.png') }}" class="size-7" alt="Client">
                            </a>
                            <a href="#!" class="avatar avatar-sm avatar-circle border d-flex justify-content-center align-items-center bg-light text-muted" aria-label="Add">
                                <i class="fa-solid fa-plus"></i>
                            </a>
                        </div>
                    </div>
                    <div class="mb-5">
                        <label for="transferClient" class="form-label">Select Client</label>
                        <select id="transferClient" class="form-select">
                            <option selected disabled>Choose client...</option>
                            <option value="1">Eleanor Pena</option>
                            <option value="2">Marvin McKinney</option>
                            <option value="3">Courtney Henry</option>
                            <option value="4">Jerome Bell</option>
                            <option value="5">Devon Lane</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary w-100">Transfer Now</button>
                </div>
            </div>
        </div>
    </div>
</div>

</div><!-- container-fluid -->
</div><!-- End Page-content -->
@endsection

@push('scripts')
<script src="{{ asset('page-js/dashboard-charts.js') }}"></script>
@endpush