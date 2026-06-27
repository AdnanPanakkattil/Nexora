@extends('layouts.backendlayouts')
@section('title', 'Dashboard')
@section('content')

<!-- Left Main Column (9 Cols) -->
<div class="col-lg-9 col-12">
    <!-- Row 1: Welcome Card & Sales Summary -->
    <div class="row align-items-stretch">
        <!-- Welcome Card -->
        <!-- Welcome Card -->
<div class="col-md-5 col-12 mb-4">
    <div class="card" style="background: linear-gradient(135deg, #f9f5ff 0%, #f4ebff 100%); border: 1px solid #e9d7fe;">
        <div class="row g-0">
            <div class="col-7">
                <div class="card-body d-flex flex-column justify-content-between py-2 px-3" style="min-height: 284px;">
                    <div>
                        <h5 class="card-title fw-bold mb-1" style="color: #6941c6; font-size: 1rem;">Welcome Back, Charlie!</h5>
                        <p class="card-text text-muted mb-2" style="font-size: 0.72rem; line-height: 1.25;">
                            Here's a quick look at your store's performance today. Stay on top of your sales, orders, and customers.
                        </p>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-0" style="color: #1d2939; font-size: 1.4rem;">$25,56k</h3>
                        <div class="d-flex align-items-center gap-1 mb-2">
                            <span class="text-muted small">Monthly Sales</span>
                            <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 5.2%</span>
                        </div>
                        <a href="javascript:void(0);" class="btn btn-primary btn-sm px-3" style="background-color:; border-color:; border-radius: 6px;">
                            View Reports
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-5 d-flex align-items-end justify-content-center" style="min-height: 160px;">
                <!-- <img src="{{ asset('assets/img/illustrations/card-website-analytics-1.png') }}" class="img-fluid" alt="Welcome Illustration" style="max-height: 110px; object-fit: contain;"> -->
            </div>
        </div>
    </div>
</div>

        <!-- Sales Summary Chart Card -->
        <!-- Sales Summary Chart Card -->
<div class="col-md-7 col-12 mb-4">
    <div class="card ">
        <div class="card-header d-flex align-items-center justify-content-between pb-0">
            <h5 class="card-title fw-bold mb-0">Sales Summary</h5>
            <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 6px;">
                    Monthly
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Weekly</a></li>
                    <li><a class="dropdown-item" href="#">Monthly</a></li>
                    <li><a class="dropdown-item" href="#">Yearly</a></li>
                </ul>
            </div>
        </div>
        <div class="card-body py-2">
            <div id="salesSummaryChart" style="min-height: 190px;"></div>
        </div>
    </div>
</div>
    </div>

    <!-- Row 2: 4 Metric Cards -->
    <div class="row">
        <!-- Total Sales -->
        <div class="col-lg-3 col-sm-6 col-12 mb-3">
            <div class="card card-border-shadow-primary">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div>
                            <span class="text-muted d-block small mb-1">Total Sales</span>
                            <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 8.5%</span>
                        </div>
                        <div class="avatar avatar-sm">
                            <span class="avatar-initial rounded bg-label-primary"><i class="ti ti-shopping-bag"></i></span>
                        </div>
                    </div>
                    <h5 class="mb-0 fw-bold">$35,780</h5>
                    <small class="text-muted">/weekly</small>
                </div>
            </div>
        </div>

        <!-- Revenue -->
        <div class="col-lg-3 col-sm-6 col-12 mb-3">
            <div class="card card-border-shadow-success">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div>
                            <span class="text-muted d-block small mb-1">Revenue</span>
                            <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 5.7%</span>
                        </div>
                        <div class="avatar avatar-sm">
                            <span class="avatar-initial rounded bg-label-success"><i class="ti ti-credit-card"></i></span>
                        </div>
                    </div>
                    <h5 class="mb-0 fw-bold">$2,458</h5>
                    <small class="text-muted">/weekly</small>
                </div>
            </div>
        </div>

        <!-- Total Orders -->
        <div class="col-lg-3 col-sm-6 col-12 mb-3">
            <div class="card card-border-shadow-warning">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div>
                            <span class="text-muted d-block small mb-1">Total Orders</span>
                            <span class="badge bg-label-danger"><i class="ti ti-trending-down ti-xs"></i> 2.1%</span>
                        </div>
                        <div class="avatar avatar-sm">
                            <span class="avatar-initial rounded bg-label-warning"><i class="ti ti-shopping-cart"></i></span>
                        </div>
                    </div>
                    <h5 class="mb-0 fw-bold">1,245</h5>
                    <small class="text-muted">/weekly</small>
                </div>
            </div>
        </div>

        <!-- New Customers -->
        <div class="col-lg-3 col-sm-6 col-12 mb-3">
            <div class="card card-border-shadow-danger">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div>
                            <span class="text-muted d-block small mb-1">New Customers</span>
                            <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 12%</span>
                        </div>
                        <div class="avatar avatar-sm">
                            <span class="avatar-initial rounded bg-label-danger"><i class="ti ti-users"></i></span>
                        </div>
                    </div>
                    <h5 class="mb-0 fw-bold">320</h5>
                    <small class="text-muted">/weekly</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Row 3: Country, Products, Customers Lists -->
    <div class="row">
        <!-- Sales by Country -->
        <div class="col-md-4 col-12 mb-4">
            <div class="card ">
                <div class="card-header d-flex justify-content-between align-items-center pb-2">
                    <h5 class="card-title fw-bold mb-0">Sales by Country</h5>
                    <a href="javascript:void(0);" class="small text-decoration-none">See All <i class="ti ti-arrow-right"></i></a>
                </div>
                <div class="card-body">
                    <ul class="p-0 m-0">
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-us rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">United States</h6>
                                </div>
                                <span class="small fw-bold">65%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 65%;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-in rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">India</h6>
                                </div>
                                <span class="small fw-bold">45%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 45%; background-color: #fac515;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-ca rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Canada</h6>
                                </div>
                                <span class="small fw-bold">74%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 74%; background-color: #fda29b;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-au rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Australia</h6>
                                </div>
                                <span class="small fw-bold">56%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 56%;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-de rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Germany</h6>
                                </div>
                                <span class="small fw-bold">48%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 48%; background-color: #2b70c9;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-fr rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">France</h6>
                                </div>
                                <span class="small fw-bold">80%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 80%; background-color: #20c997;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <i class="flag-icon flag-icon-gb rounded-circle fs-3"></i>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">United Kingdom</h6>
                                </div>
                                <span class="small fw-bold">54%</span>
                                <div class="user-progress" style="width: 80px;">
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" role="progressbar" style="width: 54%; background-color: #f65e5e;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Top Products -->
        <div class="col-md-4 col-12 mb-4">
            <div class="card ">
                <div class="card-header d-flex justify-content-between align-items-center pb-2">
                    <h5 class="card-title fw-bold mb-0">Top Products</h5>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 6px; font-size: 0.75rem;">
                            Weekly
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Weekly</a></li>
                            <li><a class="dropdown-item" href="#">Monthly</a></li>
                        </ul>
                    </div>
                </div>
                <div class="card-body" style="max-height: 420px; overflow-y: auto;">
                    <ul class="p-0 m-0">
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-secondary text-secondary"><i class="ti ti-device-earphones"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Wireless Earbuds</h6>
                                    <small class="text-muted">Electronics - 1,240 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$24,800</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-warning text-warning"><i class="ti ti-leaf"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Organic Honey</h6>
                                    <small class="text-muted">Grocery - 1,520 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$91,200</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-primary text-primary"><i class="ti ti-device-laptop"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Gaming Laptop</h6>
                                    <small class="text-muted">Electronics - 750 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$375,000</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-info text-info"><i class="ti ti-jacket"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Leather Jacket</h6>
                                    <small class="text-muted">Clothing - 1,100 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$1,320,000</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-danger text-danger"><i class="ti ti-brush"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Makeup Set</h6>
                                    <small class="text-muted">Beauty - 758 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$12,600</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-success text-success"><i class="ti ti-device-watch"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Smart Watch</h6>
                                    <small class="text-muted">Electronics - 950 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$57,000</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded bg-label-warning text-warning"><i class="ti ti-bottle"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Hydrating Beauty Cream</h6>
                                    <small class="text-muted">Grocery - 620 Units Sold</small>
                                </div>
                                <span class="fw-bold small">$18,600</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Top Customers -->
        <div class="col-md-4 col-12 mb-4">
            <div class="card ">
                <div class="card-header d-flex justify-content-between align-items-center pb-2">
                    <h5 class="card-title fw-bold mb-0">Top Customers</h5>
                </div>
                <div class="card-body" style="max-height: 420px; overflow-y: auto;">
                    <ul class="p-0 m-0">
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded-circle bg-label-danger text-danger"><i class="ti ti-user"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Alice Johnson</h6>
                                    <small class="text-muted">Premium Customer - 45 Orders</small>
                                </div>
                                <span class="fw-bold small text-success">$12,500</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded-circle bg-label-info text-info"><i class="ti ti-user"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Daniel Carter</h6>
                                    <small class="text-muted">Regular Customer - 32 Orders</small>
                                </div>
                                <span class="fw-bold small text-success">$8,200</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded-circle bg-label-secondary text-primary"><i class="ti ti-user"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Emma Wilson</h6>
                                    <small class="text-muted">Premium Customer - 28 Orders</small>
                                </div>
                                <span class="fw-bold small text-success">$9,750</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded-circle bg-label-success text-success"><i class="ti ti-user"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Liam Johnson</h6>
                                    <small class="text-muted">Regular Customer - 20 Orders</small>
                                </div>
                                <span class="fw-bold small text-success">$5,400</span>
                            </div>
                        </li>
                        <li class="d-flex mb-3 pb-1 align-items-center">
                            <div class="avatar flex-shrink-0 me-3">
                                <span class="avatar-initial rounded-circle bg-label-warning text-warning"><i class="ti ti-user"></i></span>
                            </div>
                            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                    <h6 class="mb-0 small fw-bold">Olivia Brown</h6>
                                    <small class="text-muted">Premium Customer - 15 Orders</small>
                                </div>
                                <span class="fw-bold small text-success">$3,900</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Row 4: Revenue Statistics -->
    <div class="row">
        <!-- Revenue Statistics -->
        <div class="col-12 mb-4">
            <div class="card ">
                <div class="card-header d-flex align-items-center justify-content-between">
                    <div>
                        <h5 class="card-title fw-bold mb-0">Revenue Statistics</h5>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-secondary">Monthly</button>
                            <button type="button" class="btn btn-outline-secondary">Yearly</button>
                            <button type="button" class="btn btn-outline-secondary">Weekly</button>
                        </div>
                        <button class="btn btn-primary btn-sm" style="background-color:; border-color:; border-radius: 6px;"><i class="ti ti-download me-1 ti-xs"></i> Download</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center gap-4 mb-3">
                        <div>
                            <span class="text-muted small">Total Revenue</span>
                            <h4 class="fw-bold mb-0">$85,24k</h4>
                        </div>
                        <div style="border-left: 1px solid #e4e7ec; height: 35px;"></div>
                        <div>
                            <span class="text-muted small">Total Refunds</span>
                            <h4 class="fw-bold mb-0">$4,125</h4>
                        </div>
                    </div>
                    <div id="revenueStatisticsChart" style="min-height: 250px;"></div>
                </div>
            </div>
        </div>

    </div>

    <!-- Row 4b: Top Selling Products (Full Width) -->
    <div class="row">
        <div class="col-12 mb-4">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center pb-2">
                    <h5 class="card-title fw-bold mb-0">Top Selling Products</h5>
                    <span class="text-muted small">Weekly</span>
                </div>
                <div class="table-responsive text-nowrap">
                    <table class="table">
                        <thead class="table-light">
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Units Sold</th>
                                <th>Revenue</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-secondary"><i class="ti ti-device-earphones ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Wireless Earbuds</span>
                                    </div>
                                </td>
                                <td><span class="small text-muted">Electronics</span></td>
                                <td><span class="badge bg-label-success">In Stock</span></td>
                                <td><span class="small fw-bold">1,240</span></td>
                                <td><span class="small fw-semibold">$24,800</span></td>
                                <td>
                                    <div class="d-flex align-items-center gap-1">
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-eye ti-xs"></i></a>
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-pencil ti-xs"></i></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-success"><i class="ti ti-device-watch ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Smart Watch</span>
                                    </div>
                                </td>
                                <td><span class="small text-muted">Electronics</span></td>
                                <td><span class="badge bg-label-warning">Low Stock</span></td>
                                <td><span class="small fw-bold">980</span></td>
                                <td><span class="small fw-semibold">$49,000</span></td>
                                <td>
                                    <div class="d-flex align-items-center gap-1">
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-eye ti-xs"></i></a>
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-pencil ti-xs"></i></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-primary"><i class="ti ti-device-mobile ti-xs"></i></span></div>
                                        <span class="small fw-semibold">iPhone 15 Pro</span>
                                    </div>
                                </td>
                                <td><span class="small text-muted">Electronics</span></td>
                                <td><span class="badge bg-label-success">In Stock</span></td>
                                <td><span class="small fw-bold">1,100</span></td>
                                <td><span class="small fw-semibold">$1,320,000</span></td>
                                <td>
                                    <div class="d-flex align-items-center gap-1">
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-eye ti-xs"></i></a>
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-pencil ti-xs"></i></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-danger"><i class="ti ti-bottle ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Luxury Perfume</span>
                                    </div>
                                </td>
                                <td><span class="small text-muted">Beauty</span></td>
                                <td><span class="badge bg-label-warning">Low Stock</span></td>
                                <td><span class="small fw-bold">780</span></td>
                                <td><span class="small fw-semibold">$46,800</span></td>
                                <td>
                                    <div class="d-flex align-items-center gap-1">
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-eye ti-xs"></i></a>
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-pencil ti-xs"></i></a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-warning"><i class="ti ti-leaf ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Hydrating Beauty Cream</span>
                                    </div>
                                </td>
                                <td><span class="small text-muted">Beauty</span></td>
                                <td><span class="badge bg-label-success">In Stock</span></td>
                                <td><span class="small fw-bold">620</span></td>
                                <td><span class="small fw-semibold">$18,600</span></td>
                                <td>
                                    <div class="d-flex align-items-center gap-1">
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-eye ti-xs"></i></a>
                                        <a href="javascript:;" class="text-muted"><i class="ti ti-pencil ti-xs"></i></a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center py-3">
                    <span class="text-muted small">Showing 1 - 5 of 12 Products</span>
                    <nav>
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item disabled"><a class="page-link" href="#"><i class="ti ti-chevron-left ti-xs"></i></a></li>
                            <li class="page-item active"><a class="page-link" href="#" style="background-color:; border-color:;">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#"><i class="ti ti-chevron-right ti-xs"></i></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- Row 5: Recent Orders -->
    <div class="row">
        <div class="col-12 mb-4">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center pb-2">
                    <h5 class="card-title fw-bold mb-0">Recent Orders</h5>
                    <a href="javascript:;" class="small text-decoration-none" >See All <i class="ti ti-arrow-right"></i></a>
                </div>
                <div class="table-responsive text-nowrap">
                    <table class="table">
                        <thead class="table-light">
                            <tr>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-danger"><i class="ti ti-user ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Alice Johnson</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="ti ti-device-earphones text-secondary"></i>
                                        <span class="small">Wireless Earbuds</span>
                                    </div>
                                </td>
                                <td><span class="badge bg-label-success">Delivered</span></td>
                                <td><span class="small text-muted">11 Sep 2025</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-info"><i class="ti ti-user ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Michael Smith</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="ti ti-device-watch text-success"></i>
                                        <span class="small">Smart Watch</span>
                                    </div>
                                </td>
                                <td><span class="badge bg-label-warning">Pending</span></td>
                                <td><span class="small text-muted">10 Sep 2025</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-secondary"><i class="ti ti-user ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Sophia Lee</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="ti ti-device-laptop text-primary"></i>
                                        <span class="small">Gaming Laptop</span>
                                    </div>
                                </td>
                                <td><span class="badge bg-label-danger">Cancelled</span></td>
                                <td><span class="small text-muted">09 Sep 2025</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-warning"><i class="ti ti-user ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Olivia Brown</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="ti ti-bottle text-danger"></i>
                                        <span class="small">Luxury Perfume</span>
                                    </div>
                                </td>
                                <td><span class="badge bg-label-success">Delivered</span></td>
                                <td><span class="small text-muted">06 Sep 2025</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-primary"><i class="ti ti-user ti-xs"></i></span></div>
                                        <span class="small fw-semibold">Liam Johnson</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="ti ti-jacket text-info"></i>
                                        <span class="small">Winter Jacket</span>
                                    </div>
                                </td>
                                <td><span class="badge bg-label-warning">Pending</span></td>
                                <td><span class="small text-muted">05 Sep 2025</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Sidebar Right Column (3 Cols) -->
<div class="col-lg-3 col-12">
    <!-- Platforms Card -->
    <!-- Platforms & Order Statistics (Merged Single Card) -->
<div class="card mb-4">
    <div class="card-header pb-2">
        <h5 class="card-title fw-bold mb-0">Platforms :</h5>
    </div>
    <div class="card-body pb-2">
        <ul class="p-0 m-0 list-unstyled">
            <!-- Amazon -->
            <li class="d-flex mb-3 pb-1 align-items-center">
                <div class="flex-shrink-0 me-3" style="width:38px;height:38px;border-radius:8px;background:#fff8e1;display:flex;align-items:center;justify-content:center;border:1px solid #ffe082;">
                    <img src="https://cdn.simpleicons.org/amazon/FF9900" alt="Amazon" width="22" height="22">
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0 small fw-bold">Amazon</h6>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">12.4k Orders · 45% Progress</small>
                    </div>
                    <span class="badge bg-label-success" style="font-size:0.65rem;">Top Seller</span>
                </div>
            </li>
            <!-- eBay -->
            <li class="d-flex mb-3 pb-1 align-items-center">
                <div class="flex-shrink-0 me-3" style="width:38px;height:38px;border-radius:8px;background:#f3f0ff;display:flex;align-items:center;justify-content:center;border:1px solid #d0c4f7;">
                    <img src="https://cdn.simpleicons.org/ebay/E53238" alt="eBay" width="22" height="22">
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0 small fw-bold">eBay</h6>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">8.92k Orders · 32% Progress</small>
                    </div>
                    <span class="badge bg-label-info" style="font-size:0.65rem;">Trending</span>
                </div>
            </li>
            <!-- Shopify -->
            <li class="d-flex mb-3 pb-1 align-items-center">
                <div class="flex-shrink-0 me-3" style="width:38px;height:38px;border-radius:8px;background:#e6f4ea;display:flex;align-items:center;justify-content:center;border:1px solid #a8d5b5;">
                    <img src="https://cdn.simpleicons.org/shopify/96BF48" alt="Shopify" width="22" height="22">
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0 small fw-bold">Shopify</h6>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">6.14k Orders · 25% Progress</small>
                    </div>
                    <span class="badge bg-label-warning" style="font-size:0.65rem;">Fast Growth</span>
                </div>
            </li>
            <!-- Flipkart -->
            <li class="d-flex mb-3 pb-1 align-items-center">
                <div class="flex-shrink-0 me-3" style="width:38px;height:38px;border-radius:8px;background:#e3f2fd;display:flex;align-items:center;justify-content:center;border:1px solid #90caf9;">
                    <img src="https://cdn.simpleicons.org/flipkart/2874F0" alt="Flipkart" width="22" height="22">
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0 small fw-bold">Flipkart</h6>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">4.85k Orders · 18% Progress</small>
                    </div>
                    <span class="badge bg-label-secondary" style="font-size:0.65rem;">Growing</span>
                </div>
            </li>
            <!-- Walmart -->
            <li class="d-flex mb-2 align-items-center">
                <div class="flex-shrink-0 me-3" style="width:38px;height:38px;border-radius:8px;background:#fff3e0;display:flex;align-items:center;justify-content:center;border:1px solid #ffcc80;">
                    <img src="https://cdn.simpleicons.org/walmart/0071CE" alt="Walmart" width="22" height="22">
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                        <h6 class="mb-0 small fw-bold">Walmart</h6>
                        <small class="text-muted d-block" style="font-size: 0.7rem;">7.56k Orders · 28% Progress</small>
                    </div>
                    <span class="badge bg-label-danger" style="font-size:0.65rem;">Low Stock</span>
                </div>
            </li>
        </ul>
    </div>

    <hr class="m-0">

    <div class="card-header pb-2 pt-3">
        <h5 class="card-title fw-bold mb-0">Order Statistics :</h5>
    </div>
    <div class="card-body">
        <div class="d-flex align-items-baseline gap-2 mb-1">
            <h4 class="fw-bold mb-0">$71.5k</h4>
            <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 25% Increased</span>
        </div>
        <small class="text-muted d-block mb-3">Monthly Earnings</small>
        <div id="orderStatisticsChart" style="min-height: 180px;"></div>
    </div>
</div>

    <!-- Quick Transaction -->
    <div class="card mb-4">
        <div class="card-header pb-2">
            <h5 class="card-title fw-bold mb-0">Quick Transition :</h5>
        </div>
        <div class="card-body">
            <!-- Avatars -->
            <div class="d-flex align-items-center gap-2 mb-4 mt-2">
                <div class="avatar avatar-sm"><span class="avatar-initial rounded-circle bg-label-danger"><i class="ti ti-user"></i></span></div>
                <div class="avatar avatar-sm"><span class="avatar-initial rounded-circle bg-label-info"><i class="ti ti-user"></i></span></div>
                <div class="avatar avatar-sm"><span class="avatar-initial rounded-circle bg-label-secondary"><i class="ti ti-user"></i></span></div>
                <div class="avatar avatar-sm"><span class="avatar-initial rounded-circle bg-label-success"><i class="ti ti-user"></i></span></div>
                <a href="javascript:;" class="btn btn-sm btn-icon btn-outline-secondary rounded-circle"><i class="ti ti-plus ti-xs"></i></a>
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-semibold text-muted">Select Client</label>
                <select class="form-select form-select-sm" style="border-radius: 6px;">
                    <option>Select Client</option>
                    <option>Alice Johnson</option>
                    <option>Daniel Carter</option>
                    <option>Emma Wilson</option>
                </select>
            </div>

            <button class="btn btn-primary w-100 mt-2" style="background-color:; border-color:; border-radius: 8px;">Transfer Now</button>
        </div>
    </div>

    <!-- Monthly Earnings radial -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div>
                    <h4 class="fw-bold mb-0">$71.5k</h4>
                    <small class="text-muted">Monthly Earnings</small>
                </div>
                <span class="badge bg-label-success"><i class="ti ti-trending-up ti-xs"></i> 3.5%</span>
            </div>
            <div id="monthlyEarningsRadial" style="min-height: 150px;"></div>
        </div>
    </div>

    <!-- Weekly Orders -->
    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div>
                    <h4 class="fw-bold mb-0">185k</h4>
                    <small class="text-muted">Weekly Orders</small>
                </div>
                <span class="badge bg-label-danger"><i class="ti ti-trending-down ti-xs"></i> 4.5%</span>
            </div>
            <div id="weeklyOrdersBarChart" style="min-height: 120px;"></div>
            <div class="d-flex align-items-center gap-1 mt-2">
                <span class="text-muted small">Last week</span>
                <span class="text-success small fw-semibold">+8.2%</span>
            </div>
        </div>
    </div>

    <!-- Top Categories -->
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center pb-2">
            <h5 class="card-title fw-bold mb-0">Top Categories</h5>
            <a href="javascript:;" class="small text-decoration-none" >See All</a>
        </div>
        <div class="card-body">
            <ul class="p-0 m-0">
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-secondary text-secondary"><i class="ti ti-bottle ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Luxury Perfume</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.6</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$109</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-success text-success"><i class="ti ti-device-watch ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Smart Watch</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.3</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$179</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-primary text-primary"><i class="ti ti-device-mobile ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Smartphone</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.7</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$799</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-secondary text-secondary"><i class="ti ti-device-earphones ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Wireless Earbuds</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.5</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$99</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-info text-info"><i class="ti ti-jacket ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Leather Jacket</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.5</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$99</span>
                </li>
                <li class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded bg-label-primary text-primary"><i class="ti ti-device-laptop ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Gaming Laptop</span>
                            <small class="text-muted" style="font-size: 0.65rem;"><i class="ti ti-star text-warning ti-xs"></i> 4.8</small>
                        </div>
                    </div>
                    <span class="small fw-bold">$1,299</span>
                </li>
            </ul>
        </div>
    </div>

    <!-- Transactions -->
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center pb-2">
            <h5 class="card-title fw-bold mb-0">Transactions</h5>
            <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 6px; font-size: 0.75rem;">
                    Monthly
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Weekly</a></li>
                    <li><a class="dropdown-item" href="#">Monthly</a></li>
                </ul>
            </div>
        </div>
        <div class="card-body">
            <ul class="p-0 m-0">
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-primary"><i class="ti ti-brand-paypal ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">John Doe</span>
                            <small class="text-muted" style="font-size: 0.7rem;">PayPal Payment</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-success">+$250</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-success"><i class="ti ti-credit-card ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Alice Johnson</span>
                            <small class="text-muted" style="font-size: 0.7rem;">Credit Card Payment</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-success">+$1,200</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-warning"><i class="ti ti-wallet ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Daniel Carter</span>
                            <small class="text-muted" style="font-size: 0.7rem;">Wallet Payment</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-danger">-$350</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-info"><i class="ti ti-building-bank ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Emma Wilson</span>
                            <small class="text-muted" style="font-size: 0.7rem;">Bank Transfer</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-success">+$720</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-secondary"><i class="ti ti-truck ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Liam Johnson</span>
                            <small class="text-muted" style="font-size: 0.7rem;">Cash on Delivery</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-danger">-$450</span>
                </li>
                <li class="d-flex mb-3 align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-primary"><i class="ti ti-brand-paypal ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Sophia Martinez</span>
                            <small class="text-muted" style="font-size: 0.7rem;">PayPal Payment</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-danger">-$680</span>
                </li>
                <li class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar avatar-xs"><span class="avatar-initial rounded-circle bg-label-success"><i class="ti ti-credit-card ti-xs"></i></span></div>
                        <div>
                            <span class="small fw-semibold d-block">Michael Scott</span>
                            <small class="text-muted" style="font-size: 0.7rem;">Credit Card Payment</small>
                        </div>
                    </div>
                    <span class="small fw-bold text-success">+$150</span>
                </li>
            </ul>
        </div>
    </div>
</div>

@endsection

@section('page-script')
<script>
document.addEventListener("DOMContentLoaded", function () {
    // 1. Sales Summary Bar Chart
    const salesSummaryChartEl = document.querySelector("#salesSummaryChart");
    if (salesSummaryChartEl) {
        try {
            const salesSummaryOptions = {
                series: [{
                    name: 'Sales',
                    data: [3.4, 5.2, 8.0, 11.1, 7.0, 5.7, 4.3, 3.4, 2.5, 1.5, 1.0, 0.7]
                }],
                chart: {
                    height: 200,
                    type: 'bar',
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '40%',
                        borderRadius: 6,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                colors: ['#e1d5f5'], // fallback
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return "$" + val + "k";
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '9px',
                        colors: ["#6941c6"],
                        fontWeight: 'bold'
                    }
                },
                grid: {
                    show: false,
                    padding: {
                        top: 10,
                        bottom: 0,
                        left: 0,
                        right: 0
                    }
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: {
                        style: {
                            colors: '#98a2b3',
                            fontSize: '11px'
                        }
                    }
                },
                yaxis: {
                    show: false
                }
            };

            salesSummaryOptions.colors = [
                function({ value, seriesIndex, dataPointIndex, w }) {
                    if (dataPointIndex === 3) {
                        return '#7f56d9'; // Highlight April
                    }
                    return '#e1d5f5';
                }
            ];

            const salesSummaryChart = new ApexCharts(salesSummaryChartEl, salesSummaryOptions);
            salesSummaryChart.render();
        } catch (e) {
            console.error("Sales Summary Chart failed:", e);
        }
    }

    // 2. Order Statistics Curve Chart
    const orderStatsChartEl = document.querySelector("#orderStatisticsChart");
    if (orderStatsChartEl) {
        try {
            const orderStatsOptions = {
                series: [{
                    name: 'Earnings',
                    data: [10, 15, 8, 22, 12, 28, 14, 30]
                }],
                chart: {
                    height: 180,
                    type: 'area',
                    sparkline: { enabled: true },
                    toolbar: { show: false }
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                    colors: ['#7f56d9']
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.45,
                        opacityTo: 0.05,
                        stops: [0, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: '#7f56d9',
                                opacity: 0.4
                            },
                            {
                                offset: 100,
                                color: '#7f56d9',
                                opacity: 0.0
                            }
                        ]
                    }
                },
                grid: {
                    show: false
                },
                colors: ['#7f56d9'],
                tooltip: {
                    enabled: true,
                    x: { show: false }
                }
            };

            const orderStatsChart = new ApexCharts(orderStatsChartEl, orderStatsOptions);
            orderStatsChart.render();
        } catch (e) {
            console.error("Order Statistics Chart failed:", e);
        }
    }

    // 3. Revenue Statistics Multi-line Chart
    const revenueStatsChartEl = document.querySelector("#revenueStatisticsChart");
    if (revenueStatsChartEl) {
        try {
            const revenueStatsOptions = {
                series: [
                    {
                        name: 'Total Revenue',
                        data: [18, 29, 21, 23, 15, 20, 28, 23, 27, 18, 26, 21]
                    },
                    {
                        name: 'Total Refunds',
                        data: [11, 19, 11, 17, 13, 9, 4, 15, 12, 8, 15, 12]
                    }
                ],
                chart: {
                    height: 250,
                    type: 'line',
                    toolbar: { show: false }
                },
                stroke: {
                    curve: 'smooth',
                    width: [3, 3]
                },
                colors: ['#20c997', '#7f56d9'],
                grid: {
                    strokeDashArray: 5,
                    padding: { right: 20, left: 10 }
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                legend: {
                    show: false
                }
            };
            const revenueStatsChart = new ApexCharts(revenueStatsChartEl, revenueStatsOptions);
            revenueStatsChart.render();
        } catch (e) {
            console.error("Revenue Statistics Chart failed:", e);
        }
    }

    // 4. Monthly Earnings Radial Chart
    const monthlyRadialEl = document.querySelector("#monthlyEarningsRadial");
    if (monthlyRadialEl) {
        try {
            const radialOptions = {
                series: [74],
                chart: {
                    height: 150,
                    type: 'radialBar',
                    sparkline: { enabled: true }
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -90,
                        endAngle: 90,
                        hollow: { size: '65%' },
                        track: { background: '#f2f4f7' },
                        dataLabels: {
                            name: { show: false },
                            value: {
                                offsetY: -5,
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#1d2939'
                            }
                        }
                    }
                },
                colors: ['#20c997'],
                stroke: { lineCap: 'round' }
            };
            const radialChart = new ApexCharts(monthlyRadialEl, radialOptions);
            radialChart.render();
        } catch (e) {
            console.error("Monthly Earnings Radial Chart failed:", e);
        }
    }

    // 5. Weekly Orders Bar Chart
    const weeklyOrdersEl = document.querySelector("#weeklyOrdersBarChart");
    if (weeklyOrdersEl) {
        try {
            const barOptions = {
                series: [{
                    name: 'Orders',
                    data: [40, 95, 60, 45, 90, 50, 75]
                }],
                chart: {
                    height: 100,
                    type: 'bar',
                    sparkline: { enabled: true }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%',
                        borderRadius: 3
                    }
                },
                colors: ['#fda29b']
            };
            const barChart = new ApexCharts(weeklyOrdersEl, barOptions);
            barChart.render();
        } catch (e) {
            console.error("Weekly Orders Bar Chart failed:", e);
        }
    }
});
</script>
@endsection