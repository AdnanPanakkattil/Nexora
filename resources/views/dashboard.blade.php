@extends('layouts.backendlayouts')
@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
<style>
    .card {
        background-color: #f8f9fa;
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .btn-hover {
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .btn-hover:hover {
        background-color: #0056b3;
        transform: scale(1.05);
    }

    .bootstrap-select .dropdown-menu {
    width: 100% !important;
    min-width: unset !important;
}

.bootstrap-select {
    width: 100% !important;
}
</style>
@endpush
<!-- <div class="container-xxl flex-grow-1 container-p-y"> -->
<div class="row g-6" style="zoom: 80%;">
    <div class="col-xl-5" style="zoom: 90%;">
        <div class="card">
            <div class="row align-items-end">
                <div class="col-7">
                    <div class="card-body text-nowrap pb-11">
                        <h4 class="card-title mb-0 pb-3">welcomeName</h4>
                        <h5 class="card-title  mb-5 mt-1">welcome</h5>
                        <p class="text-primary mb-1">welcome</p>
                        <div class="d-flex align-items-center mt-2">
                            <div class="badge rounded bg-label-primary me-6 p-4">
                                <i class="ti ti-calendar-event ti-lg" style="font-size: 30px !important;"></i>
                            </div>
                            <div class="card-info d-flex align-items-center">
                                <h5 class="mb-0 me-2">today</h5>
                                <h3 class="mb-0">225</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-5 text-center">
                    <img
                        src="../../assets/img/illustrations/Employee1.png"
                        height="250"
                        width="250"
                        alt="Employer Dashboard" />
                </div>
            </div>
        </div>
    </div>




    <div class="col-xl-7 col-md-12">
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between">
                <h6 class="card-title mb-0">employeeDailyOverview </h6>
                <div>
                    <h6 class="card-title mb-0" id="currentDateTime"></h6>
                </div>
            </div>
            <div class="card-body d-flex align-items-end pb-0">
                <div class="w-100">
                    <div class="row gy-3">
                        <div class="col-4">
                            <div class="d-flex align-items-center">
                                <div class="badge rounded bg-label-primary me-4 p-2">
                                    <i class="ti ti-user ti-lg"></i>
                                </div>
                                <div class="card-info">
                                    <h5 class="mb-0">34</h5>
                                    <h6>todayAttendees</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="d-flex align-items-center">
                                <div class="badge rounded bg-label-danger me-4 p-2">
                                    <i class="ti ti-user-x ti-lg"></i>
                                </div>
                                <div class="card-info">
                                    <h5 class="mb-0">258</h5>
                                    <h6>todayAbsents</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="d-flex align-items-center">
                                <div class="badge rounded bg-label-success me-4 p-2">
                                    <i class="ti ti-file-text ti-lg"></i>
                                </div>
                                <div class="card-info">
                                    <h5 class="mb-0">8965</h5>
                                    <h6>todayPatientsDischarged</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="subscriberGained"></div>
        </div>
    </div>

    <div class="col-lg-5 order-md-0 order-lg-0">
        <div class="card h-100">
            <div class="card-header pb-0 d-flex justify-content-between">
                <div class="card-title mb-0">
                    <h4 class="mb-1">amountCollection</h4>
                    <p class="card-subtitle">weeklyCollectionOverview</p>
                </div>
                <div class="dropdown">
                    <button
                        class="btn btn-text-secondary rounded-pill text-muted border-0 p-2 me-n1"
                        type="button"
                        id="earningReportsId"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <i class="ti ti-dots-vertical ti-md text-muted"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="earningReportsId">
                        <a class="dropdown-item" href="javascript:void(0);">viewMore</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row align-items-center g-md-8">
                    <div class="col-12 col-md-5 d-flex flex-column">
                        <div class="d-flex gap-2 align-items-center mb-3 flex-wrap">
                            <h4 class="mb-0">SAR 25866</h4>
                            <div class="badge rounded bg-label-success">+4.2%</div>
                        </div>
                        <small class="text-body">collection</small>
                    </div>
                    <div class="col-12 col-md-7 ps-xl-8">
                        <div id="weeklyEarningReports"></div>
                    </div>
                </div>
                <div class="border rounded p-5 mt-5">
                    <div class="row gap-4 gap-sm-0">
                        <div class="col-12 col-sm-4">
                            <div class="d-flex gap-2 align-items-center">
                                <div class="badge rounded bg-label-primary p-1">
                                    <i class="ti ti-currency-dollar ti-sm"></i>
                                </div>
                                <h6 class="mb-0 fw-normal">totalCollection</h6>
                            </div>
                            <h5 class="my-2">SAR 1500</h5>
                            <div class="progress w-75" style="height: 4px">
                                <div
                                    class="progress-bar"
                                    role="progressbar"
                                    style="width: 65%"
                                    aria-valuenow="65"
                                    aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4">
                            <div class="d-flex gap-2 align-items-center">
                                <div class="badge rounded bg-label-info p-1"><i class="ti ti-chart-pie-2 ti-sm"></i></div>
                                <h6 class="mb-0 fw-normal">pendingAmount</h6>
                            </div>
                            <h5 class="my-2">SAR 1250</h5>
                            <div class="progress w-75" style="height: 4px">
                                <div
                                    class="progress-bar bg-info"
                                    role="progressbar"
                                    style="width: 50%"
                                    aria-valuenow="50"
                                    aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-4">
                            <div class="d-flex gap-2 align-items-center">
                                <div class="badge rounded bg-label-danger p-1">
                                    <i class="ti ti-brand-paypal ti-sm"></i>
                                </div>
                                <h6 class="mb-0 fw-normal">overdueAmount</h6>
                            </div>
                            <h5 class="my-2">SAR 25</h5>
                            <div class="progress w-75" style="height: 4px">
                                <div
                                    class="progress-bar bg-danger"
                                    role="progressbar"
                                    style="width: 65%"
                                    aria-valuenow="65"
                                    aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-7">
        <div class="row g-6">
            <div class="col-6">
                <div class="card card-border-shadow-success h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <div class="avatar me-4">
                                <span class="avatar-initial rounded bg-label-success"><i class="ti ti-git-fork ti-28px"></i></span>
                            </div>
                            <h6 class="mb-0">appointments</h6>
                        </div>
                        <h4 class="mb-0"><span class="text-heading fw-medium me-2">258</span></h4>
                        <p class="mb-0"><small class="text-muted">appointmentsToday</small></p>
                    </div>
                    <div id="salesLastYear"></div>
                </div>
            </div>

            <div class="col-6">
                <div class="card card-border-shadow-warning h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <div class="avatar me-4">
                                <span class="avatar-initial rounded bg-label-warning"><i class="ti ti-receipt ti-28px"></i></span>
                            </div>
                            <h6 class="mb-0">billing</h6>
                        </div>
                        <h4 class="mb-0"><span class="text-heading fw-medium me-2"></span></h4>
                        <p class="mb-0"><small class="text-muted">todayTransactions</small></p>
                    </div>
                    <div id="orderReceived"></div>
                </div>
            </div>

            <div class="col-6">
                <div class="card card-border-shadow-dark  h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <div class="avatar me-4">
                                <span class="avatar-initial rounded bg-label-dark "><i class="ti ti-x ti-28px"></i></span>
                            </div>
                            <h6 class="mb-0">xRay</h6>
                        </div>
                        <h4 class="mb-0"><span class="text-heading fw-medium me-2">500</span></h4>
                        <p class="mb-0"><small class="text-muted">todayX-ray</small></p>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <div class="card card-border-shadow-info h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <div class="avatar me-4">
                                <span class="avatar-initial rounded bg-label-info"><i class="ti ti-microscope ti-28px"></i></span>
                            </div>
                            laboratory               </div>
                        <h4 class="mb-0"><span class="text-heading fw-medium me-2">100</span></h4>
                        <p class="mb-0"><small class="text-muted">todayLabTest</small></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="">




        <div class="card">
            <h5 class="card-header">heading</h5>
            <div class="card-body">
                <form class="dt_adv_search" method="GET">
                    <div class="row">
                        <div class="col-12">
                            <div class="row g-3">
                                <div class="col">
                                    <label class="form-label labez">allProvider</label>
                                  <select id="provider" class="selectpicker w-100" data-style="btn-default" data-live-search="true" data-width="100%">
                                        <option value="">value_selectProvider</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label for="status" class="form-label labez">allStatus</label>
                                    <select id="status" name="status" class="selectpicker w-100 status" data-style="btn-default" data-icon-base="ti" data-tick-icon="ti-check text-white">
                                        <option value="All">value_all</option>
                                        <option value="approved">value_approved</option>
                                        <option value="checkedin">value_checkedIn</option>
                                        <option value="transfer">value_transfer</option>
                                        <option value="completed">value_completed</option>
                                        <option value="processing">value_processing</option>
                                        <option value="pending">value_pending</option>
                                        <option value="rejected">value_rejected</option>
                                        <option value="cancelled">value_cancelled</option>
                                        <option value="refunded">value_refunded</option>
                                        <option value="absent">value_absent</option>
                                        <option value="insurance_approval_request">value_insuranceApprovalRequest</option>
                                        <option value="insurance_rejected">value_insuranceRejected</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label class="form-label labez">allCategory</label>
                                    <select id="category" class="selectpicker w-100" data-style="btn-default" data-live-search="true">     
                                     <option value="">value_selectCategory</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label class="form-label labez">date</label>
                                    <div class="mb-0">
                                        <input
                                            type="text"
                                            class="form-control dt-date flatpickr-range dt-input"
                                            data-column="5"
                                            placeholder="plhr_dateToDate') }}"
                                            data-column-index="4"
                                            name="dt_date" />
                                        <input
                                            id="startDate"
                                            type="hidden"
                                            class="form-control dt-date start_date dt-input"
                                            data-column="5"
                                            data-column-index="4"
                                            name="value_from_start_date" />
                                        <input
                                            id="endDate"
                                            type="hidden"
                                            class="form-control dt-date end_date dt-input"
                                            name="value_from_end_date"
                                            data-column="5"
                                            data-column-index="4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="card-datatable table-responsive">
                <table id="reservation" class="dt-responsive table text-center">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select_all_reservations" class="form-check-input"></th>
                            <th class="text-center">id</th>
                            <th class="text-center">fileNo</th>
                            <th class="text-center">patientName</th>
                            <th class="text-center">mobile</th>
                            <th class="text-center">serviceName</th>
                            <th class="text-center">appointment</th>
                            <th class="text-center">provider</th>
                            <th class="text-center">totalCost</th>
                            <th class="text-center">paid</th>
                            <th class="text-center">status</th>
                            <th class="text-center">remainingSession</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
    <footer class="footer bg-light footz">
        <div
            class="container-fluid d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-1 container-p-x py-4">
            <div class="allitemz">
                <div class="itemz">
                    <h4 class="m-0">0</h4>
                </div>
                <h5 class="coustom-fontz">reservationSelected</h5>
            </div>
            <div class="d-flex flex-column flex-sm-row">
                <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-file-export menu-icon"></i>Export</a>
                <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-box-archive menu-icon"></i>Archive</a>
                <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-trash-can menu-icon"></i>Delete</a>
                <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-arrow-turn-down menu-icon"></i>Convert</a>
                <a href="" class="footer-link me-6 footzicon"><i class="fa-solid fa-arrow-right-from-bracket menu-icon"></i>Move to</a>
            </div>
        </div>
    </footer>
</div>
@endsection
@push('scripts')
<script>
    function updateDateTime() {
        const now = new Date();
        document.getElementById('currentDateTime').innerText = now.toLocaleString();
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
</script>
<script src="{{ asset('assets/vendor/libs/apex-charts/apexcharts.js') }}"></script>
<script src="{{ asset('assets/js/app-logistics-dashboard.js') }}"></script>
<script src="{{ asset('assets/js/cards-statistics.js') }}"></script>
<script src="{{ asset('assets/js/charts-apex.js') }}"></script>
@endpush