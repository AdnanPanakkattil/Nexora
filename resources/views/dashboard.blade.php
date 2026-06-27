@extends('layouts.backendlayouts')
@section('title', 'Dashboard')
@section('content')
    <div class="col-7">
        <div class="  mb-6">
            <h4 class="card-title">Nexora Admin Dashbord !</h4>
            <p>Track your sales activity, leads and deals here.</p>
        </div>
    </div>

    <div class="dashboard-grid">
        <div class="dash-col dash-col--left">

            {{-- Hero Card --}}
            <div class="card hero-card">
                <div class="card-body d-flex justify-content-between align-items-center gap-3">
                    <div class="hero-card-text">
                        <h5 class=" mb-2">Your target is incomplete</h5>
                        <p class="-75 mb-3">You have completed <strong>48%</strong> of the given target, you can
                            also check your status.</p>
                        <a href="javascript:void(0);" class=" text-decoration-underline fw-semibold">Click
                            here</a>
                    </div>
                    <div class="hero-progress-wrapper text-center ">
                        <div class="hero-progress-ring">
                            <span>48%</span>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Top Deals --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Top Deals</h5>
                        <small class="text-muted">Most profitable deals</small>
                    </div>
                    <a href="javascript:void(0);" class="text-muted"><i class="ti ti-dots"></i></a>
                </div>
                <div class="card-body p-0">
                    <ul class="list-unstyled mb-0">
                        @php
                            $deals = [
                                ['initials' => 'MJ', 'color' => 'primary', 'name' => 'Michael Jordan', 'email' => 'michael.jordan@example.com', 'amount' => '$2,893'],
                                ['initials' => 'EK', 'color' => 'warning', 'name' => 'Emigo Kiaren', 'email' => 'emigo.kiaren@gmail.com', 'amount' => '$4,289'],
                                ['initials' => 'RO', 'color' => 'success', 'name' => 'Randy Origoan', 'email' => 'randy.origoan@gmail.com', 'amount' => '$6,347'],
                                ['initials' => 'GP', 'color' => 'secondary', 'name' => 'George Pieterson', 'email' => 'george.pieterson@gmail.com', 'amount' => '$3,894'],
                                ['initials' => 'KA', 'color' => 'info', 'name' => 'Kiara Advain', 'email' => 'kiaraadvain214@gmail.com', 'amount' => '$2,679'],
                            ];
                        @endphp
                        @foreach($deals as $i => $deal)
                            <li
                                class="d-flex align-items-center justify-content-between px-4 py-3 {{ $i < count($deals) - 1 ? 'border-bottom' : '' }}">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="avatar rounded-circle bg-label-{{ $deal['color'] }} text-{{ $deal['color'] }}">
                                        {{ $deal['initials'] }}
                                    </div>
                                    <div>
                                        <strong>{{ $deal['name'] }}</strong>
                                        <p class="mb-0 text-muted smalsl">{{ $deal['email'] }}</p>
                                    </div>
                                </div>
                                <span class="fw-semibold">{{ $deal['amount'] }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>

            {{-- Profit Earned --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Profit Earned</h5>
                        <small class="text-muted">Sales growth this week</small>
                    </div>
                    <a href="javascript:void(0);" class="text-primary">View All</a>
                </div>
                <div class="card-body">
                    <div id="weeklyEarningReports"></div>
                </div>
            </div>

        </div>
        <div class="dash-col dash-col--center">

            {{-- Stats Row --}}
            <div class="row g-3 mb-0">
                <div class="col-12 col-sm-6">
                    <div class="card ">
                        <div class="card-body d-flex align-items-center gap-3">
                            <div class="avatar bg-label-primary text-primary rounded-circle ">
                                <i class="ti ti-users"></i>
                            </div>
                            <div class="row">
                                <p class="text-muted mb-0 small">Total Customers</p>
                                <h4 class="mb-0 fw-bold">1,02,890</h4>
                            </div>
                            <div class="text-end ">
                                <div class="stat-sparkline mb-2">
                                    <svg viewBox="0 0 120 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 0 30 Q 15 15 30 20 T 60 25 T 90 15 T 120 25" fill="none" stroke="#845adf"
                                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <small class="text-success fw-semibold d-block">+40%</small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top d-flex justify-content-center pt-3">
                            <a href="javascript:void(0);"
                                class="text-info small fw-semibold d-inline-flex align-items-center gap-1">View All <i
                                    class="ti ti-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card ">
                        <div class="card-body d-flex align-items-center gap-3">
                            <div class="avatar bg-label-info text-info rounded-circle ">
                                <i class="ti ti-currency-dollar"></i>
                            </div>
                            <div class="row">
                                <p class="text-muted mb-0 small">Total Revenue</p>
                                <h4 class="mb-0 fw-bold">$56,562</h4>
                            </div>
                            <div class="text-end ">
                                <div class="stat-sparkline mb-2">
                                    <svg viewBox="0 0 120 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 0 25 Q 15 15 30 22 T 60 20 T 90 18 T 120 22" fill="none" stroke="#00B7FF"
                                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <small class="text-success fw-semibold d-block">+25%</small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top d-flex justify-content-center pt-3">
                            <a href="javascript:void(0);"
                                class="text-info small fw-semibold d-inline-flex align-items-center gap-1">View All <i
                                    class="ti ti-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card ">
                        <div class="card-body d-flex align-items-center gap-3">
                            <div class="avatar bg-label-success text-success rounded-circle ">
                                <i class="ti ti-arrow-up-right"></i>
                            </div>
                            <div class="row">
                                <p class="text-muted mb-0 small">Conversion Ratio</p>
                                <h4 class="mb-0 fw-bold">12.08%</h4>
                            </div>
                            <div class="text-end ">
                                <div class="stat-sparkline mb-2">
                                    <svg viewBox="0 0 120 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 0 25 Q 15 10 30 28 T 60 20 T 90 15 T 120 25" fill="none" stroke="#28a745"
                                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <small class="text-danger fw-semibold d-block">-12%</small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top d-flex justify-content-center pt-3">
                            <a href="javascript:void(0);"
                                class="text-success small fw-semibold d-inline-flex align-items-center gap-1">View All <i
                                    class="ti ti-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="card ">
                        <div class="card-body d-flex align-items-center gap-3">
                            <div class="avatar bg-label-warning text-warning rounded-circle ">
                                <i class="ti ti-briefcase"></i>
                            </div>
                            <div class="row">
                                <p class="text-muted mb-0 small">Total Deals</p>
                                <h4 class="mb-0 fw-bold">2,543</h4>
                            </div>
                            <div class="text-end ">
                                <div class="stat-sparkline mb-2">
                                    <svg viewBox="0 0 120 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 0 30 Q 15 20 30 25 T 60 28 T 90 18 T 120 22" fill="none" stroke="#ff7f0f"
                                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <small class="text-success fw-semibold d-block">+19%</small>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top d-flex justify-content-center pt-3">
                            <a href="javascript:void(0);"
                                class="text-warning small fw-semibold d-inline-flex align-items-center gap-1">View All <i
                                    class="ti ti-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Revenue Analytics --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Revenue Analytics</h5>
                        <small class="text-muted">Revenue analytics with sales &amp; profit (USD)</small>
                    </div>
                    <a href="javascript:void(0);" class="text-primary">View All</a>
                </div>
                <div class="card-body">
                    <div id="shipmentStatisticsChart"></div>
                </div>
            </div>

        </div>{{-- /CENTER --}}


        {{-- ======================================================
        RIGHT COLUMN
        ====================================================== --}}
        <div class="dash-col dash-col--right">

            {{-- Leads By Source --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Leads By Source</h5>
                        <small class="text-muted">Source breakdown</small>
                    </div>
                    <a href="javascript:void(0);" class="text-muted"><i class="ti ti-dots"></i></a>
                </div>
                <div class="card-body">
                    <div id="deliveryExceptionsChart"></div>
                    <div class="row row-cols-2 row-cols-sm-4 g-3 mt-3">
                        <div class="col d-flex align-items-center gap-2">
                            <span class="source-dot bg-primary"></span>
                            <div>
                                <p class="mb-0 small fw-medium">Mobile</p>
                                <small class="text-muted">1,624</small>
                            </div>
                        </div>
                        <div class="col d-flex align-items-center gap-2">
                            <span class="source-dot bg-info"></span>
                            <div>
                                <p class="mb-0 small fw-medium">Desktop</p>
                                <small class="text-muted">1,267</small>
                            </div>
                        </div>
                        <div class="col d-flex align-items-center gap-2">
                            <span class="source-dot bg-warning"></span>
                            <div>
                                <p class="mb-0 small fw-medium">Laptop</p>
                                <small class="text-muted">1,153</small>
                            </div>
                        </div>
                        <div class="col d-flex align-items-center gap-2">
                            <span class="source-dot bg-success"></span>
                            <div>
                                <p class="mb-0 small fw-medium">Tablet</p>
                                <small class="text-muted">679</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Deals Status --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Deals Status</h5>
                        <small class="text-muted">Compared to last week</small>
                    </div>
                    <a href="javascript:void(0);" class="text-primary">View All</a>
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <h3 class="mb-0 fw-bold">4,289</h3>
                        <span class="badge bg-label-success text-success small">+1.02% ▲</span>
                        <span class="text-muted small">compared to last week</span>
                    </div>
                    <div class="deals-progress mb-4">
                        <div class="deals-progress-bar deals-progress-bar--primary" style="width:23%"></div>
                        <div class="deals-progress-bar deals-progress-bar--info" style="width:25%"></div>
                        <div class="deals-progress-bar deals-progress-bar--warning" style="width:39%"></div>
                        <div class="deals-progress-bar deals-progress-bar--success" style="width:13%"></div>
                    </div>
                    @php
                        $statuses = [
                            ['label' => 'Successful Deals', 'color' => 'primary', 'count' => '987 deals'],
                            ['label' => 'Pending Deals', 'color' => 'info', 'count' => '1,073 deals'],
                            ['label' => 'Rejected Deals', 'color' => 'warning', 'count' => '1,674 deals'],
                            ['label' => 'Upcoming Deals', 'color' => 'success', 'count' => '921 deals'],
                        ];
                    @endphp
                    @foreach($statuses as $status)
                        <div
                            class="d-flex align-items-center justify-content-between py-2 {{ !$loop->last ? 'border-bottom' : '' }}">
                            <div class="d-flex align-items-center gap-2">
                                <span class="source-dot bg-{{ $status['color'] }}"></span>
                                <span class="text-muted small">{{ $status['label'] }}</span>
                            </div>
                            <strong class="small">{{ $status['count'] }}</strong>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Recent Activity --}}
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">Recent Activity</h5>
                        <small class="text-muted">Latest updates</small>
                    </div>
                    <a href="javascript:void(0);"
                        class="text-primary small fw-semibold d-inline-flex align-items-center gap-1">View All <i
                            class="ti ti-arrow-right"></i></a>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled mb-0">
                        <li class="d-flex align-items-start gap-3 pb-3">
                            <span class="activity-dot bg-primary  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small"><strong>Update of calendar events &</strong><br><span
                                        class="text-muted">Added new events in next week.</span></p>
                            </div>
                            <small class="text-muted ">4:45PM</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 py-3">
                            <span class="activity-dot bg-info  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small"><strong>New theme for Spruko Website</strong><br><span
                                        class="text-muted">completed</span></p>
                            </div>
                            <small class="text-muted ">3 hrs</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 py-3">
                            <span class="activity-dot bg-success  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small"><strong>Created a New Task</strong> today</p>
                            </div>
                            <small class="text-muted ">22 hrs</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 py-3">
                            <span class="activity-dot bg-danger  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small"><strong>New member</strong> <span class="text-primary">@andreas
                                        guerrero</span><br><span class="text-muted">added today to AI Summit.</span></p>
                            </div>
                            <small class="text-muted ">Today</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 py-3">
                            <span class="activity-dot bg-warning  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small">32 New people joined summit.</p>
                            </div>
                            <small class="text-muted ">22 hrs</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 pt-3">
                            <span class="activity-dot bg-info  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small">Neon Tarly added <span class="text-primary">Robert Bright</span>
                                    to<br><span class="text-muted">AI summit project.</span></p>
                            </div>
                            <small class="text-muted ">12 hrs</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 pt-3">
                            <span class="activity-dot bg-dark  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small">Replied to new support request ✓</p>
                            </div>
                            <small class="text-muted  ">4 hrs</small>
                        </li>
                        <li class="d-flex align-items-start gap-3 pt-3">
                            <span class="activity-dot bg-primary  mt-1"></span>
                            <div class="row">
                                <p class="mb-1 small">Completed documentation of <span class="text-primary">AI
                                        Summit.</span></p>
                            </div>
                            <small class="text-muted ">4 hrs</small>
                        </li>
                    </ul>
                </div>
            </div>

        </div>{{-- /RIGHT --}}

    </div>{{-- /dashboard-grid --}}


    <style>
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1.6fr 1fr;
            gap: 1.25rem;
            align-items: start;
        }

        .dash-col {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .dashboard-grid {
                grid-template-columns: 1fr 1fr;
            }

            .dash-col--right {
                grid-column: 1 / -1;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }

            .dash-col--right {
                grid-column: auto;
                display: flex;
            }
        }

        /* ── Hero Card ───────────────────────────────────────── */
        .hero-card {
            background: linear-gradient(#845adf, #845adf 0%, #845adf 100%);
            color: #fff;
            position: relative;
            overflow: hidden;
        }

        .hero-card::before {
            content: '';
            position: absolute;
            top: -30px;
            right: -30px;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
        }

        .hero-card-text h5,
        .hero-card-text p,
        .hero-card-text a {
            color: #fff;
        }

        .hero-card-text p{
            color: rgba(255, 255, 255, 0.78) !important;
        }

        .hero-progress-wrapper {
            min-width: 110px;
        }

        .hero-progress-ring {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: conic-gradient(rgba(255, 255, 255, 0.9) 0deg 172.8deg, rgba(255, 255, 255, 0.15) 172.8deg 360deg);
        }

        .hero-progress-ring::after {
            content: '';
            position: absolute;
            inset: 14px;
            border-radius: 50%;
            background: linear-gradient(#845adf, #845adf, #845adf);
        }

        .hero-progress-ring span {
            position: relative;
            z-index: 1;
            font-size: 1.4rem;
            font-weight: 700;
            color: #fff;
        }

        /* ── Stat Cards ──────────────────────────────────────── */
        .stat-card .stat-sparkline {
            width: 80px;
            height: 35px;
        }

        .stat-card .stat-sparkline svg {
            width: 100%;
            height: 100%;
        }

        /* Compact Stat Cards */
        .stat-card {
            border: 1px solid #e7e7e7;
        }

        .card-body {
            padding: 1.25rem;
        }

        .card-footer {
            padding: 0.75rem 1.25rem !important;
        }

        .card-body .stat-sparkline {
            width: 70px;
            height: 38px;
            display: inline-block;
            overflow: visible;
        }

        .card-body .stat-sparkline svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        .card-body .avatar {
            width: 45px;
            height: 45px;
        }

        .card-body h4 {
            font-size: 1.25rem;
            margin: 0 !important;
        }

        .card-body p {
            font-size: 0.85rem;
        }

        /* ── Avatar ──────────────────────────────────────────── */
        .avatar {
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: .85rem;
            font-weight: 600;
            border-radius: 50%;
            flex-shrink: 0;
        }

        /* ── Dot Badges ──────────────────────────────────────── */
        .source-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        /* ── Deals Progress Bar ──────────────────────────────── */
        .deals-progress {
            display: flex;
            height: 8px;
            border-radius: 999px;
            overflow: hidden;
            gap: 3px;
        }

        .deals-progress-bar {
            height: 100%;
            border-radius: 999px;
        }

        .deals-progress-bar--primary {
            background: #845adf;
        }

        .deals-progress-bar--info {
            background: #00CFE8;
        }

        .deals-progress-bar--warning {
            background: #FF9F43;
        }

        .deals-progress-bar--success {
            background: #28C76F;
        }

        /* ── Activity Timeline ───────────────────────────── */
        .activity-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }
    </style>
@endsection

@section('page-script')
    <script src="{{ asset('assets/js/app-logistics-dashboard.js') }}"></script>
@endsection