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

    .platform-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f9;
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    .platform-icon.pf-amazon {
        background: #232f3e;
        color: #ff9900;
    }

    .platform-icon.pf-ebay {
        background: #f5f5f5;
        color: #e53238;
    }

    .platform-icon.pf-shopify {
        background: #e6f9ee;
        color: #95bf47;
    }

    .platform-icon.pf-flipkart {
        background: #fff4d6;
        color: #f9a825;
    }

    .platform-icon.pf-walmart {
        background: #e8f0ff;
        color: #0071ce;
    }

    .badge-soft-success {
        background: #e6fffa;
        color: #0d9488;
    }

    .badge-soft-info {
        background: #eef2ff;
        color: #4f46e5;
    }

    .badge-soft-warning {
        background: #fffbe6;
        color: #d97706;
    }

    .badge-soft-danger {
        background: #fff5f5;
        color: #ef4444;
    }

    .country-flag {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .bg-teal {
        background-color: #14b8a6 !important;
    }

    .avatar-sm {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
    }

    .avatar-round {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .progress-thin {
        height: 6px;
        border-radius: 4px;
    }

    .max-w-96 {
        max-width: 24rem;
    }

    .welcome-illustration {
        position: absolute;
        right: -10px;
        bottom: 0;
        width: 330px;
        max-width: 53%;
        opacity: 0.95;
        pointer-events: none;
    }

    /* ===== New bottom-section styles ===== */
    .table-actions {
        white-space: nowrap;
        min-width: 90px;
    }

    .table-actions .btn {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin-left: 4px;
        vertical-align: middle;
    }

    .table-actions .btn:first-child {
        margin-left: 0;
    }

    .table-clean {
        min-width: 520px;
    }

    /* Smooth horizontal scroll for responsive tables */
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 0 0 0.5rem 0.5rem;
    }

    .table-responsive::-webkit-scrollbar {
        height: 4px;
    }

    .table-responsive::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
    }

    .table-responsive::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
    }

    .table-responsive::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }

    .btn-icon-soft-success {
        background: #e6fffa;
        color: #0d9488;
        border: none;
    }

    .btn-icon-soft-primary {
        background: #eef2ff;
        color: #4f46e5;
        border: none;
    }

    .btn-icon-soft-danger {
        background: #fff5f5;
        color: #ef4444;
        border: none;
    }

    .status-pill {
        font-size: 12px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        white-space: nowrap;
    }

    .status-in-stock,
    .status-delivered {
        background: #e6fffa;
        color: #0d9488;
    }

    .status-low-stock,
    .status-pending {
        background: #fffbe6;
        color: #d97706;
    }

    .status-cancelled {
        background: #fff5f5;
        color: #ef4444;
    }

    .table-clean thead th {
        font-size: 12px;
        text-transform: uppercase;
        color: #9ca3af;
        font-weight: 600;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 0.75rem;
        white-space: nowrap;
    }

    .table-clean td {
        vertical-align: middle;
        border-bottom: 1px solid #f5f5f5;
        padding: 0.85rem 0.5rem;
    }

    .table-clean tr:last-child td {
        border-bottom: none;
    }

    .txn-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .rating-star {
        color: #f59e0b;
        font-size: 12px;
    }

    /* ===================================================== */
    /* FIX 1: Consistent card padding / gap across all cards */
    /* ===================================================== */
    .card {
        margin-bottom: 0;
    }

    .card-body {
        padding: 1.25rem;
    }

    .card-header {
        padding: 1rem 1.25rem;
    }

    .row.g-4>* {
        padding-top: 0;
    }

    /* ===================================================== */
    /* FIX 2: Stop text getting cut off (text-truncate removed
       from markup below; this is a safety-net override in
       case text-truncate is reintroduced anywhere later)     */
    /* ===================================================== */
    .text-truncate {
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: unset !important;
        word-break: break-word;
    }

    .min-w-0 {
        min-width: 0;
    }

    /* List rows: align to top so 2-line names don't push the
       amount/price out of vertical center awkwardly */
    .list-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .list-row:last-child {
        margin-bottom: 0;
    }

    .list-row .list-row-left {
        display: flex;
        align-items: center;
        min-width: 0;
        flex: 1 1 auto;
        gap: 0.5rem;
        overflow: hidden;
    }

    .list-row .list-row-right {
        flex-shrink: 0;
        white-space: nowrap;
        padding-top: 0;
    }

    .list-row h6 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .list-row small {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        display: block;
    }

    /* Country list row: progress bar takes available space */
    .country-list-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
    }
    /* Adjust progress bar dynamically so it fits even when sidebar toggles */
    .country-progress {
        width: 55px;
        flex-shrink: 0;
    }

    .country-pct {
        color: #4f46e5;
        min-width: 28px;
        font-size: 13px;
        font-weight: 500;
        text-align: right;
    }

    /* Badges (Top Seller / Trending / Fast Growth / Growing /
       Low Stock) were getting clipped in the narrow sidebar
       card - allow them to wrap onto a second line instead
       of being cut off */
    .list-row-right.badge-wrap {
        white-space: normal;
        text-align: right;
        max-width: 80px;
        line-height: 1.3;
    }

    /* Scrollable list: shows ~7 rows, rest scrolls with hidden scrollbar */
    .scroll-list-7 {
        max-height: 434px;
        overflow-y: auto;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE/Edge */
    }

    .scroll-list-7::-webkit-scrollbar {
        display: none;
        /* Chrome/Safari/Edge */
    }

    /* ===================================================== */
    /* FIX 3: Full responsiveness                            */
    /* ===================================================== */
    @media (min-width: 1400px) {
        .country-progress {
            width: 75px;
        }
    }

    @media (max-width: 1199.98px) {
        .country-progress {
            width: 45px;
        }
    }

    @media (max-width: 991.98px) {
        .welcome-illustration {
            width: 170px;
        }

        /* On md screens the 3-col cards become 2-col (md-6),
           progress bar can be a bit narrower */
        .country-progress {
            width: 70px;
        }
    }

    @media (max-width: 767.98px) {
        .card-body {
            padding: 1rem;
        }

        .card-header {
            padding: 0.85rem 1rem;
        }

        /* Tablet: reduce min-width so tables fit more naturally */
        .table-clean {
            min-width: 420px;
        }

        /* Tablet: make progress bar slightly narrower */
        .country-progress {
            width: 60px;
        }
    }

    @media (max-width: 575.98px) {

        .stat-ring-icon,
        .platform-icon,
        .avatar-sm,
        .avatar-round,
        .txn-icon {
            width: 36px;
            height: 36px;
        }

        .table-clean th,
        .table-clean td {
            padding: 0.6rem 0.4rem;
            font-size: 13px;
        }

        .welcome-illustration {
            display: none !important;
        }

        .card-body {
            padding: 0.9rem;
        }

        /* Hide less critical columns on mobile to reduce scroll */
        .table-hide-mobile {
            display: none !important;
        }

        /* Mobile: shrink progress bar further */
        .country-progress {
            width: 50px;
        }

        /* Mobile: slightly smaller list row gap */
        .list-row {
            gap: 0.4rem;
            margin-bottom: 0.75rem;
        }
    }

    /* ===================================================== */
    /* FIX 4: Equal-height cards - contain overflow properly  */
    /* (Sales by Country / Top Products / Top Customers list  */
    /* content was breaking past the card's bottom border,    */
    /* and right sidebar card was not aligning with them)     */
    /* ===================================================== */
    .card.h-100 {
        display: flex;
        flex-direction: column;
    }

    .card.h-100 .card-body {
        flex: 1 1 auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .card.h-100 .scroll-list-7 {
        flex: 1 1 auto;
        min-height: 0;
    }
</style>
@endpush

<div class="container-xxl flex-grow-1 container-p-y">

    {{-- Page Header --}}
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
            <h4 class="fw-bold mb-0">Dashboard</h4>
            <small class="text-muted">Welcome back, here's what's happening with your store today.</small>
        </div>
        <div class="text-end">
            <span id="currentDateTime" class="fw-medium"></span>
        </div>
    </div>

    <div class="row g-3 g-lg-4">

        {{-- LEFT / MAIN COLUMN --}}
        <div class="col-12 col-xl-9">
            <div class="row g-3 g-lg-4">

                {{-- Welcome Card --}}
                <div class="col-12 col-xxl-5">
                    <div class="card overflow-hidden h-100">
                        <div class="card-body d-flex flex-column h-100 justify-content-between position-relative">
                            <img src="{{ asset('assets/dashboard/welcome.png') }}"
                                alt="Welcome illustration"
                                class="welcome-illustration d-none d-sm-block">
                            <div>
                                <h4 class="fw-medium mb-4">Welcome Back, Charlie!</h4>
                                <p class="mb-6 text-muted fs-14 lh-base">
                                    Here's a quick look at your store's performance today. Stay on top of your sales, orders, and customers.
                                </p>
                            </div>
                            <div>
                                <h3 class="fw-normal mb-2">$25,56k</h3>
                                <p class="text-muted fs-14 mb-6">
                                    Monthly Sales
                                    <span class="text-success me-1"><i class="fa-solid fa-arrow-trend-up"></i> 5.2%</span>
                                </p>
                                <a href="javascript:void(0)" class="btn btn-primary btn-sm">View Reports</a>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Sales Summary Chart --}}
                <div class="col-12 col-xxl-7">
                    <div class="card h-100">
                        <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold">Sales Summary</h5>
                            <select class="form-select form-select-sm w-auto border-0 text-muted shadow-none">
                                <option>Monthly</option>
                                <option>Weekly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div id="chart" class="flex-grow-1" style="min-height: 0;"></div>
                        </div>
                    </div>
                </div>

                {{-- Stat Cards --}}
                <div class="col-6 col-md-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="fw-bold mb-2">Total Sales</h6>
                                    <span class="text-success fw-medium small">
                                        <i class="fa-solid fa-arrow-trend-up me-1"></i>8.5%
                                    </span>
                                    <span class="text-muted small ms-1 d-none d-xl-inline">vs last week</span>
                                </div>
                                <div class="position-relative d-inline-block flex-shrink-0" style="width: 52px; height: 52px;">
                                    <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                        <circle cx="26" cy="26" r="22" fill="none" stroke="#eef2ff" stroke-width="3.5" />
                                        <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" data-percent="85" />
                                    </svg>
                                    <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #f0f3ff; color: #4f46e5;">
                                        <i class="fa-solid fa-bag-shopping"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-baseline mt-3">
                                <div>
                                    <h4 class="fw-bold mb-0 d-inline-block" data-target="35780" data-prefix="$">$0</h4>
                                    <span class="text-muted small">/weekly</span>
                                </div>
                                <button class="btn p-0 text-muted" type="button">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="fw-bold mb-2">Revenue</h6>
                                    <span class="text-success fw-medium small">
                                        <i class="fa-solid fa-arrow-trend-up me-1"></i>5.7%
                                    </span>
                                    <span class="text-muted small ms-1 d-none d-xl-inline">vs last week</span>
                                </div>
                                <div class="position-relative d-inline-block flex-shrink-0" style="width: 52px; height: 52px;">
                                    <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                        <circle cx="26" cy="26" r="22" fill="none" stroke="#e6fffa" stroke-width="3.5" />
                                        <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#14b8a6" stroke-width="3.5" stroke-linecap="round" data-percent="75" />
                                    </svg>
                                    <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #e6fffa; color: #0d9488;">
                                        <i class="fa-solid fa-credit-card"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-baseline mt-3">
                                <div>
                                    <h4 class="fw-bold mb-0 d-inline-block" data-target="2458" data-prefix="$">$0</h4>
                                    <span class="text-muted small">/weekly</span>
                                </div>
                                <button class="btn p-0 text-muted" type="button">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="fw-bold mb-2">Total Orders</h6>
                                    <span class="text-danger fw-medium small">
                                        <i class="fa-solid fa-arrow-trend-down me-1"></i>2.1%
                                    </span>
                                    <span class="text-muted small ms-1 d-none d-xl-inline">vs last week</span>
                                </div>
                                <div class="position-relative d-inline-block flex-shrink-0" style="width: 52px; height: 52px;">
                                    <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                        <circle cx="26" cy="26" r="22" fill="none" stroke="#fffbe6" stroke-width="3.5" />
                                        <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" data-percent="65" />
                                    </svg>
                                    <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #fffbe6; color: #d97706;">
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-baseline mt-3">
                                <div>
                                    <h4 class="fw-bold mb-0 d-inline-block" data-target="1245">0</h4>
                                    <span class="text-muted small">/weekly</span>
                                </div>
                                <button class="btn p-0 text-muted" type="button">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-3">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="fw-bold mb-2">New Customers</h6>
                                    <span class="text-success fw-medium small">
                                        <i class="fa-solid fa-arrow-trend-up me-1"></i>12%
                                    </span>
                                    <span class="text-muted small ms-1 d-none d-xl-inline">vs last week</span>
                                </div>
                                <div class="position-relative d-inline-block flex-shrink-0" style="width: 52px; height: 52px;">
                                    <svg width="52" height="52" viewBox="0 0 52 52" style="transform: rotate(-90deg);">
                                        <circle cx="26" cy="26" r="22" fill="none" stroke="#fff5f5" stroke-width="3.5" />
                                        <circle class="progress-ring-circle" cx="26" cy="26" r="22" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round" data-percent="80" />
                                    </svg>
                                    <div class="position-absolute top-50 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #fff5f5; color: #ef4444;">
                                        <i class="fa-solid fa-user-group"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-baseline mt-3">
                                <div>
                                    <h4 class="fw-bold mb-0 d-inline-block" data-target="320">0</h4>
                                    <span class="text-muted small">/weekly</span>
                                </div>
                                <button class="btn p-0 text-muted" type="button">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Sales by Country --}}
                <div class="col-12 col-md-6 col-xxl-4">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold">Sales by Country</h5>
                            <a href="javascript:void(0)" class="fs-13">See All <i class="fa-solid fa-arrow-right ms-1"></i></a>
                        </div>
                        <div class="card-body">
                            @php
                            $countries = [
                            ['name' => 'United States', 'flag' => 'us', 'percent' => 65, 'color' => 'bg-primary'],
                            ['name' => 'India', 'flag' => 'in', 'percent' => 45, 'color' => 'bg-warning'],
                            ['name' => 'Canada', 'flag' => 'ca', 'percent' => 74, 'color' => 'bg-danger'],
                            ['name' => 'Australia', 'flag' => 'au', 'percent' => 56, 'color' => 'bg-info'],
                            ['name' => 'Germany', 'flag' => 'de', 'percent' => 48, 'color' => 'bg-secondary'],
                            ['name' => 'France', 'flag' => 'fr', 'percent' => 80, 'color' => 'bg-teal'],
                            ['name' => 'United Kingdom', 'flag' => 'gb', 'percent' => 54, 'color' => 'bg-danger'],
                            ['name' => 'Italy', 'flag' => 'it', 'percent' => 64, 'color' => 'bg-primary'],
                            ['name' => 'Italy', 'flag' => 'it', 'percent' => 64, 'color' => 'bg-primary'],
                            ['name' => 'Italy', 'flag' => 'it', 'percent' => 64, 'color' => 'bg-primary'],
                            ['name' => 'Italy', 'flag' => 'it', 'percent' => 64, 'color' => 'bg-primary'],
                            ];
                            @endphp
                            <div class="scroll-list-7">
                                @foreach ($countries as $country)
                                <div class="list-row">
                                    <div class="list-row-left">
                                        <img src="https://flagcdn.com/w80/{{ $country['flag'] }}.png" class="avatar-round flex-shrink-0" alt="{{ $country['name'] }}" style="width:28px;height:28px;">
                                        <div class="min-w-0">
                                            <h6 class="mb-0 fs-14">{{ $country['name'] }}</h6>
                                        </div>
                                    </div>
                                    <div class="country-list-right">
                                        <span class="country-pct">{{ $country['percent'] }}%</span>
                                        <div class="progress progress-thin country-progress">
                                            <div class="progress-bar {{ $country['color'] }}" style="width: {{ $country['percent'] }}%"></div>
                                        </div>
                                    </div>
                                </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Top Products --}}
                <div class="col-12 col-md-6 col-xxl-4">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold">Top Products</h5>
                            <select class="form-select form-select-sm w-auto border-0 text-muted shadow-none">
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div class="card-body">
                            @php
                            $products = [
                            ['name' => 'Wireless Earbuds', 'cat' => 'Electronics', 'sold' => '1,240 Units Sold', 'price' => '$24,800'],
                            ['name' => 'Organic Honey', 'cat' => 'Grocery', 'sold' => '1,520 Units Sold', 'price' => '$91,200'],
                            ['name' => 'Gaming Laptop', 'cat' => 'Electronics', 'sold' => '750 Units Sold', 'price' => '$375,000'],
                            ['name' => 'Leather Jacket', 'cat' => 'Clothing', 'sold' => '1,100 Units Sold', 'price' => '$1,320,000'],
                            ['name' => 'Makeup Set', 'cat' => 'Beauty', 'sold' => '758 Units Sold', 'price' => '$12,600'],
                            ['name' => 'Smart Watch', 'cat' => 'Electronics', 'sold' => '950 Units Sold', 'price' => '$57,000'],
                            ['name' => 'Hydrating Beauty Cream', 'cat' => 'Beauty', 'sold' => '620 Units Sold', 'price' => '$18,600'],
                            ['name' => 'Bluetooth Speaker','cat' => 'Electronics', 'sold' => '540 Units Sold', 'price' => '$21,600'],
                            ['name' => 'Yoga Mat', 'cat' => 'Fitness', 'sold' => '480 Units Sold', 'price' => '$9,600'],
                            ['name' => 'Sunglasses', 'cat' => 'Fashion', 'sold' => '390 Units Sold', 'price' => '$15,600'],
                            ];
                            @endphp
                            <div class="scroll-list-7">

                                @foreach ($products as $product)
                                <div class="list-row">
                                    <div class="list-row-left">
                                        <div class="avatar-sm bg-light d-flex align-items-center justify-content-center">
                                            <i class="fa-solid fa-box"></i>
                                        </div>
                                        <div class="min-w-0">
                                            <h6 class="mb-0 fs-14">{{ $product['name'] }}</h6>
                                            <small class="text-muted">{{ $product['cat'] }} - {{ $product['sold'] }}</small>
                                        </div>
                                    </div>
                                    <span class="fw-medium fs-14 list-row-right">{{ $product['price'] }}</span>
                                </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Top Customers --}}
                <div class="col-12 col-md-12 col-xxl-4">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold">Top Customers</h5>
                        </div>
                        <div class="card-body">
                            @php
                            $customers = [
                            ['name' => 'Olivia Brown', 'type' => 'Premium Customer', 'orders' => 15, 'amount' => '$3,900'],
                            ['name' => 'Daniel Carter', 'type' => 'Regular Customer', 'orders' => 32, 'amount' => '$8,200'],
                            ['name' => 'Emma Wilson', 'type' => 'Premium Customer', 'orders' => 28, 'amount' => '$9,750'],
                            ['name' => 'Liam Johnson', 'type' => 'Regular Customer', 'orders' => 20, 'amount' => '$5,400'],
                            ['name' => 'Sophia Lee', 'type' => 'Premium Customer', 'orders' => 18, 'amount' => '$6,100'],
                            ['name' => 'Noah Smith', 'type' => 'Regular Customer', 'orders' => 12, 'amount' => '$2,750'],
                            ['name' => 'Noah Smith', 'type' => 'Regular Customer', 'orders' => 12, 'amount' => '$2,750'],
                            ['name' => 'Noah Smith', 'type' => 'Regular Customer', 'orders' => 12, 'amount' => '$2,750'],
                            ['name' => 'Noah Smith', 'type' => 'Regular Customer', 'orders' => 12, 'amount' => '$2,750'],
                            ];
                            @endphp
                            <div class="scroll-list-7">
                                @foreach ($customers as $customer)
                                <div class="list-row">
                                    <div class="list-row-left">
                                        <img src="https://ui-avatars.com/api/?name={{ urlencode($customer['name']) }}&background=random&rounded=true&size=64"
                                            class="avatar-round" alt="{{ $customer['name'] }}">
                                        <div class="min-w-0">
                                            <h6 class="mb-0 fs-14">{{ $customer['name'] }}</h6>
                                            <small class="text-muted">{{ $customer['type'] }} - {{ $customer['orders'] }} Orders</small>
                                        </div>
                                    </div>
                                    <span class="fw-medium fs-14 list-row-right">{{ $customer['amount'] }}</span>
                                </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {{-- RIGHT SIDEBAR --}}
        <div class="col-12 col-xl-3">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Platforms</h5>
                    <a href="javascript:void(0)" class="fs-13">See All <i class="fa-solid fa-arrow-right ms-1"></i></a>
                </div>
                <div class="card-body">

                    @php
                    $platforms = [
                        ['name' => 'Amazon',  'icon' => 'fa-brands fa-amazon',       'iconClass' => 'pf-amazon',  'orders' => '12.43k', 'pct' => 45, 'badge' => 'Top Seller',  'badgeClass' => 'badge-soft-success'],
                        ['name' => 'eBay',    'icon' => 'fa-brands fa-ebay',          'iconClass' => 'pf-ebay',    'orders' => '8.92k',  'pct' => 32, 'badge' => 'Trending',    'badgeClass' => 'badge-soft-info'],
                        ['name' => 'Shopify', 'icon' => 'fa-brands fa-shopify',       'iconClass' => 'pf-shopify', 'orders' => '6.14k',  'pct' => 25, 'badge' => 'Fast Growth', 'badgeClass' => 'badge-soft-warning'],
                        ['name' => 'Flipkart','icon' => 'fa-solid fa-cart-shopping',  'iconClass' => 'pf-flipkart','orders' => '4.85k',  'pct' => 18, 'badge' => 'Growing',     'badgeClass' => 'badge-soft-info'],
                        ['name' => 'Walmart', 'icon' => 'fa-solid fa-store',          'iconClass' => 'pf-walmart', 'orders' => '7.56k',  'pct' => 28, 'badge' => 'Low Stock',   'badgeClass' => 'badge-soft-danger'],
                    ];
                    @endphp

                    @foreach ($platforms as $platform)
                    <div class="mb-3">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <div class="d-flex align-items-center gap-2 min-w-0">
                                <div class="platform-icon {{ $platform['iconClass'] }} flex-shrink-0">
                                    <i class="{{ $platform['icon'] }}"></i>
                                </div>
                                <div class="min-w-0">
                                    <h6 class="mb-0 fs-14 fw-semibold">{{ $platform['name'] }}</h6>
                                    <small class="text-muted">{{ $platform['orders'] }} Orders</small>
                                </div>
                            </div>
                            <span class="badge {{ $platform['badgeClass'] }} fs-11 flex-shrink-0 ms-1">{{ $platform['badge'] }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <div class="progress progress-thin flex-grow-1">
                                <div class="progress-bar
                                    @if($platform['pct'] >= 40) bg-primary
                                    @elseif($platform['pct'] >= 28) bg-teal
                                    @elseif($platform['pct'] >= 20) bg-warning
                                    @else bg-info
                                    @endif"
                                    style="width: {{ $platform['pct'] }}%">
                                </div>
                            </div>
                            <span class="text-muted fw-medium" style="font-size:12px; min-width:26px; text-align:right;">{{ $platform['pct'] }}%</span>
                        </div>
                    </div>
                    @endforeach

                    <hr class="my-3">

                    <h6 class="fw-bold mb-1">Order Statistics :</h6>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="mb-0">$71.5k</h4>
                        <span class="text-success fs-13"><i class="fa-solid fa-arrow-trend-up"></i> 25% Increased</span>
                    </div>
                    <small class="text-muted d-block mb-2">Monthly Earnings</small>
                    <div id="orderStatusChart"></div>

                    <h6 class="fw-bold mb-3 mt-4">Quick Transaction :</h6>
                    <div class="d-flex align-items-center mb-3 gap-2 overflow-auto" style="scrollbar-width: none; -ms-overflow-style: none;">
                        <style>
                            .quick-tx-avatars::-webkit-scrollbar { display: none; }
                        </style>
                        <div class="d-flex align-items-center gap-2 quick-tx-avatars flex-nowrap overflow-auto py-1" style="scrollbar-width: none; -ms-overflow-style: none;">
                            @foreach ($customers as $qc)
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($qc['name']) }}&background=random&rounded=true&size=64"
                                class="avatar-round flex-shrink-0" alt="{{ $qc['name'] }}">
                            @endforeach
                            <div class="avatar-round border d-flex align-items-center justify-content-center flex-shrink-0 bg-light text-muted" style="cursor: pointer;">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                    </div>
                    <label class="form-label fs-13 text-muted">Select Client</label>
                    <div>
   <select class="select2 form-select-sm mb-3 w-100">
                        <option selected disabled>Choose client...</option>
                        @foreach ($customers as $qc)
                        <option>{{ $qc['name'] }}</option>
                        @endforeach
                    </select>
                    </div>
                 
                    <button type="button" class="btn btn-primary w-100">Transfer Now</button>
                </div>
            </div>
        </div>

    </div>

    {{-- ============================================================ --}}
    {{-- BOTTOM SECTION - Revenue Statistics / Top Selling / Orders   --}}
    {{-- ============================================================ --}}
    <div class="row g-3 g-lg-4 mt-1" id="bottom-section">

        {{-- Revenue Statistics --}}
        <div class="col-12 col-lg-6">
            <div class="card h-100">
                <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Revenue Statistics</h5>
                    <button class="btn btn-primary btn-sm"><i class="fa-solid fa-download me-1"></i> Download</button>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
                        <div class="d-flex gap-4">
                            <div>
                                <small class="text-muted d-block">Total Revenue</small>
                                <h5 class="mb-0 fw-bold">$85.24k</h5>
                            </div>
                            <div>
                                <small class="text-muted d-block">Total Refunds</small>
                                <h5 class="mb-0 fw-bold">$4,125</h5>
                            </div>
                        </div>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-primary">Monthly</button>
                            <button type="button" class="btn btn-outline-secondary">Yearly</button>
                            <button type="button" class="btn btn-outline-secondary">Weekly</button>
                        </div>
                    </div>
                    <div id="revenueStatisticsChart"></div>
                </div>
            </div>
        </div>

        {{-- Top Selling Products --}}
        <div class="col-12 col-lg-6">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Top Selling Products</h5>
                    <select class="form-select form-select-sm w-auto border-0 text-muted shadow-none">
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>
                <div class="card-body">
                    @php
                    $topSelling = [
                    ['name' => 'Wireless Earbuds', 'cat' => 'Electronics', 'status' => 'In Stock', 'units' => '1,240', 'revenue' => '$24,800'],
                    ['name' => 'Smart Watch', 'cat' => 'Electronics', 'status' => 'Low Stock', 'units' => '980', 'revenue' => '$49,000'],
                    ['name' => 'iPhone 15 Pro', 'cat' => 'Electronics', 'status' => 'In Stock', 'units' => '1,100', 'revenue' => '$1,320,000'],
                    ['name' => 'Luxury Perfume', 'cat' => 'Beauty', 'status' => 'Low Stock', 'units' => '780', 'revenue' => '$46,800'],
                    ['name' => 'Hydrating Beauty Cream', 'cat' => 'Beauty','status' => 'In Stock', 'units' => '620', 'revenue' => '$18,600'],
                    ];
                    @endphp
                    <div class="table-responsive">
                        <table class="table table-clean align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th class="table-hide-mobile">Category</th>
                                    <th>Status</th>
                                    <th class="table-hide-mobile">Units Sold</th>
                                    <th>Revenue</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($topSelling as $p)
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm bg-light d-flex align-items-center justify-content-center me-2">
                                                <i class="fa-solid fa-box"></i>
                                            </div>
                                            <span class="fw-medium fs-14">{{ $p['name'] }}</span>
                                        </div>
                                    </td>
                                    <td class="text-muted fs-14 table-hide-mobile">{{ $p['cat'] }}</td>
                                    <td>
                                        <span class="status-pill status-{{ Str::slug($p['status']) }}">{{ $p['status'] }}</span>
                                    </td>
                                    <td class="fs-14 table-hide-mobile">{{ $p['units'] }}</td>
                                    <td class="fw-medium fs-14">{{ $p['revenue'] }}</td>
                                    <td class="text-end table-actions">
                                        <button class="btn btn-icon-soft-primary"><i class="fa-solid fa-eye"></i></button>
                                        <button class="btn btn-icon-soft-success"><i class="fa-solid fa-pen"></i></button>
                                        <button class="btn btn-icon-soft-danger"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                        <small class="text-muted">Showing 1 - 5 of 12 Products</small>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item"><a class="page-link" href="javascript:void(0)"><i class="fa-solid fa-chevron-left"></i></a></li>
                                <li class="page-item active"><a class="page-link" href="javascript:void(0)">1</a></li>
                                <li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
                                <li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
                                <li class="page-item"><a class="page-link" href="javascript:void(0)"><i class="fa-solid fa-chevron-right"></i></a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        {{-- Recent Orders --}}
        <div class="col-12 col-xl-5 col-xxl-5">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Recent Orders</h5>
                    <a href="javascript:void(0)" class="fs-13">See All <i class="fa-solid fa-arrow-right ms-1"></i></a>
                </div>
                <div class="card-body">
                    @php
                    $recentOrders = [
                    ['name' => 'Alice Johnson', 'product' => 'Wireless Earbuds', 'status' => 'Delivered', 'date' => '11 Sep 2025'],
                    ['name' => 'Michael Smith', 'product' => 'Smart Watch', 'status' => 'Pending', 'date' => '10 Sep 2025'],
                    ['name' => 'Sophia Lee', 'product' => 'Gaming Laptop', 'status' => 'Cancelled', 'date' => '09 Sep 2025'],
                    ['name' => 'Olivia Brown', 'product' => 'Luxury Perfume', 'status' => 'Delivered', 'date' => '06 Sep 2025'],
                    ['name' => 'Liam Johnson', 'product' => 'Winter Jacket', 'status' => 'Pending', 'date' => '05 Sep 2025'],
                    ];
                    @endphp
                    <div class="table-responsive">
                        <table class="table table-clean align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th class="table-hide-mobile">Product</th>
                                    <th>Status</th>
                                    <th class="table-hide-mobile">Date</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($recentOrders as $o)
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="https://ui-avatars.com/api/?name={{ urlencode($o['name']) }}&background=random&rounded=true&size=64"
                                                class="avatar-round me-2" alt="{{ $o['name'] }}">
                                            <span class="fw-medium fs-14">{{ $o['name'] }}</span>
                                        </div>
                                    </td>
                                    <td class="text-muted fs-14 table-hide-mobile">{{ $o['product'] }}</td>
                                    <td>
                                        <span class="status-pill status-{{ Str::slug($o['status']) }}">{{ $o['status'] }}</span>
                                    </td>
                                    <td class="text-muted fs-14 table-hide-mobile">{{ $o['date'] }}</td>
                                    <td class="text-end table-actions">
                                        <button class="btn btn-icon-soft-primary"><i class="fa-solid fa-check"></i></button>
                                        <button class="btn btn-icon-soft-danger"><i class="fa-solid fa-xmark"></i></button>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        {{-- Monthly Earnings + Weekly Orders --}}
        <div class="col-12 col-sm-6 col-xl-2">
            <div class="row g-3 g-lg-4 h-100">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h4 class="mb-0 fw-bold">$71.5k</h4>
                                    <small class="text-muted">Monthly Earnings</small>
                                </div>
                                <span class="text-success fs-13"><i class="fa-solid fa-arrow-trend-up"></i> 3.5%</span>
                            </div>
                            <div id="monthlyEarningsChart"></div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h4 class="mb-0 fw-bold">185k</h4>
                                    <small class="text-muted">Weekly Orders</small>
                                </div>
                                <span class="text-danger fs-13"><i class="fa-solid fa-arrow-trend-down"></i> 4.5%</span>
                            </div>
                            <div id="weeklyOrdersChart"></div>
                            <small class="text-success d-block mt-2">Last week +8.2%</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Top Categories --}}
        <div class="col-12 col-sm-6 col-xl-2">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Top Categories</h5>
                    <a href="javascript:void(0)" class="fs-13">See All <i class="fa-solid fa-arrow-right ms-1"></i></a>
                </div>
                <div class="card-body">
                    @php
                    $topCategories = [
                    ['name' => 'Luxury Perfume', 'rating' => 4.6, 'price' => '$109'],
                    ['name' => 'Smart Watch', 'rating' => 4.3, 'price' => '$179'],
                    ['name' => 'Smartphone', 'rating' => 4.7, 'price' => '$799'],
                    ['name' => 'Wireless Earbuds','rating' => 4.5, 'price' => '$99'],
                    ['name' => 'Leather Jacket', 'rating' => 4.5, 'price' => '$99'],
                    ];
                    @endphp
                    @foreach ($topCategories as $c)
                    <div class="list-row">
                        <div class="list-row-left">
                            <div class="avatar-sm bg-light d-flex align-items-center justify-content-center">
                                <i class="fa-solid fa-tag"></i>
                            </div>
                            <div class="min-w-0">
                                <h6 class="mb-0 fs-14">{{ $c['name'] }}</h6>
                                <small class="rating-star"><i class="fa-solid fa-star"></i> ({{ $c['rating'] }})</small>
                            </div>
                        </div>
                        <span class="fw-medium fs-14 list-row-right">{{ $c['price'] }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Transactions --}}
        <div class="col-12 col-xl-3">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Transactions</h5>
                    <select class="form-select form-select-sm w-auto border-0 text-muted shadow-none">
                        <option>Monthly</option>
                        <option>Weekly</option>
                    </select>
                </div>
                <div class="card-body">
                    @php
                    $transactions = [
                    ['name' => 'Sophia Martinez', 'type' => 'PayPal Payment', 'amount' => '-$680', 'icon' => 'fa-brands fa-paypal', 'bg' => '#eef2ff', 'color' => '#4f46e5', 'neg' => true],
                    ['name' => 'Michael Scott', 'type' => 'Credit Card Payment', 'amount' => '+$1,100','icon' => 'fa-solid fa-credit-card', 'bg' => '#e6fffa', 'color' => '#0d9488', 'neg' => false],
                    ['name' => 'Olivia Harris', 'type' => 'Wallet Payment', 'amount' => '-$430', 'icon' => 'fa-solid fa-wallet', 'bg' => '#fffbe6', 'color' => '#d97706', 'neg' => true],
                    ['name' => 'William Brown', 'type' => 'Bank Transfer', 'amount' => '+$950', 'icon' => 'fa-solid fa-building-columns','bg' => '#fff5f5', 'color' => '#ef4444', 'neg' => false],
                    ['name' => 'Emma Wilson', 'type' => 'Cash on Delivery', 'amount' => '-$520', 'icon' => 'fa-solid fa-truck', 'bg' => '#eef2ff', 'color' => '#4f46e5', 'neg' => true],
                    ['name' => 'Liam Johnson', 'type' => 'PayPal Payment', 'amount' => '-$770', 'icon' => 'fa-brands fa-paypal', 'bg' => '#eef2ff', 'color' => '#4f46e5', 'neg' => true],
                    ];
                    @endphp
                    @foreach ($transactions as $t)
                    <div class="list-row">
                        <div class="list-row-left">
                            <div class="txn-icon" style="background-color: {{ $t['bg'] }}; color: {{ $t['color'] }};">
                                <i class="{{ $t['icon'] }}"></i>
                            </div>
                            <div class="min-w-0">
                                <h6 class="mb-0 fs-14">{{ $t['name'] }}</h6>
                                <small class="text-muted">{{ $t['type'] }}</small>
                            </div>
                        </div>
                        <span class="fw-medium fs-14 list-row-right {{ $t['neg'] ? 'text-danger' : 'text-success' }}">{{ $t['amount'] }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>

    </div>

</div>
@endsection

@push('scripts')
<script src="{{ asset('page-js/dashboard-charts.js') }}"></script>
@endpush