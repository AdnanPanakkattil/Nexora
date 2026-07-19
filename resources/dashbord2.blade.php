<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ecommerce Dashboard</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.3/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.49.1/apexcharts.min.js"></script>
<style>
:root{
  --bs-primary:#7367f0;
  --bs-primary-rgb:115,103,240;
  --bs-success:#28c76f;
  --bs-success-rgb:40,199,111;
  --bs-warning:#ff9f43;
  --bs-warning-rgb:255,159,67;
  --bs-danger:#ea5455;
  --bs-danger-rgb:234,84,85;
  --bs-info:#00cfe8;
  --bs-info-rgb:0,207,232;
  --bs-secondary:#82868b;
  --bs-secondary-rgb:130,134,139;
  --card-radius:14px;
  --page-bg:#f5f5fa;
}
*{box-sizing:border-box;}
body{
  font-family:'Inter',sans-serif;
  background:var(--page-bg);
  color:#5d596c;
  font-size:14px;
}
.topbar{
  background:#fff;
  padding:14px 24px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid #eeedf1;
  margin-bottom:22px;
}
.topbar h6{margin:0;font-weight:700;color:#3a3648;}
.breadcrumb-mini{font-size:13px;color:#a7a4b5;display:flex;align-items:center;gap:6px;}
.page-wrap{padding:0 20px 30px;max-width:1720px;margin:0 auto;}
.card{
  border:none;
  border-radius:var(--card-radius);
  box-shadow:0 2px 10px rgba(76,72,133,.06);
  margin-bottom:24px;
  background:#fff;
}
.card-header{
  background:transparent;
  border-bottom:1px solid #f1f0f5;
  padding:18px 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.card-title{font-size:16px;font-weight:700;color:#3a3648;margin:0;}
.card-body{padding:20px;}
.text-muted{color:#a7a4b5!important;}
.fw-medium{font-weight:600;}

/* Welcome card */
.welcome-card{
  background:linear-gradient(180deg,#eeecfb 0%, #fff 65%);
  position:relative;
  overflow:hidden;
  min-height:100%;
}
.welcome-card h4{font-weight:700;color:#3a3648;}
.welcome-card h3{font-weight:700;color:#3a3648;}
.welcome-img{
  width:150px;
  position:absolute;
  right:6px;
  bottom:0;
  opacity:.95;
}
.blur-circle{
  position:absolute;
  width:150px;height:150px;
  background:var(--bs-primary);
  opacity:.12;
  border-radius:50%;
  right:-40px;bottom:-50px;
}
.btn-primary{
  background:var(--bs-primary);
  border-color:var(--bs-primary);
  font-weight:500;
  border-radius:8px;
}
.btn-primary:hover{background:#5e50ee;border-color:#5e50ee;}

/* stat mini cards */
.stat-card .icon-circle{
  width:46px;height:46px;
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:20px;
}
.bg-primary-subtle-c{background:rgba(var(--bs-primary-rgb),.12); color:var(--bs-primary);}
.bg-success-subtle-c{background:rgba(var(--bs-success-rgb),.12); color:var(--bs-success);}
.bg-warning-subtle-c{background:rgba(var(--bs-warning-rgb),.12); color:var(--bs-warning);}
.bg-danger-subtle-c{background:rgba(var(--bs-danger-rgb),.12); color:var(--bs-danger);}
.text-success{color:var(--bs-success)!important;}
.text-danger{color:var(--bs-danger)!important;}
.text-warning{color:var(--bs-warning)!important;}

/* rich list */
.rich-list-item{
  display:flex;align-items:center;gap:12px;
  padding:9px 0;
}
.rich-list-item + .rich-list-item{border-top:1px solid #f4f3f8;}
.rich-list-title{color:#3a3648;font-weight:600;text-decoration:none;font-size:13.5px;display:block;}
.rich-list-title:hover{color:var(--bs-primary);}
.rich-list-subtitle{color:#a7a4b5;font-size:12.5px;}
.rich-list-content{flex:1;min-width:0;}
.avatar{
  width:38px;height:38px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:#f4f3f8;flex-shrink:0;
}
.avatar-circle{border-radius:50%;}
.avatar img{width:100%;height:100%;object-fit:cover;}
.avatar-sm{width:34px;height:34px;}
.scroll-list{max-height:380px;overflow-y:auto;}
.scroll-list::-webkit-scrollbar{width:5px;}
.scroll-list::-webkit-scrollbar-thumb{background:#e4e2ee;border-radius:10px;}

.flag{width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;}
.country-row{display:flex;align-items:center;gap:10px;padding:8px 0;}
.country-row+.country-row{border-top:1px solid #f4f3f8;}
.country-name{flex:1;font-weight:600;color:#3a3648;font-size:13.5px;}
.country-pct{width:38px;text-align:right;font-size:13px;color:#5d596c;}
.progress{height:6px;width:90px;border-radius:10px;background:#f1f0f5;}
.progress-bar{border-radius:10px;}

.badge-label{
  font-size:11px;font-weight:600;padding:5px 10px;border-radius:6px;
}
.badge-success-l{background:rgba(var(--bs-success-rgb),.12);color:var(--bs-success);}
.badge-warning-l{background:rgba(var(--bs-warning-rgb),.12);color:var(--bs-warning);}
.badge-danger-l{background:rgba(var(--bs-danger-rgb),.12);color:var(--bs-danger);}
.badge-info-l{background:rgba(var(--bs-info-rgb),.12);color:var(--bs-info);}
.badge-primary-l{background:rgba(var(--bs-primary-rgb),.12);color:var(--bs-primary);}

/* sidebar */
.sidebar-card{position:sticky; top:20px;}
.platform-icon{
  width:34px;height:34px;border-radius:8px;
  background:#f4f3f8;display:flex;align-items:center;justify-content:center;
  font-size:16px;flex-shrink:0;
}
.sticky-side{position:sticky;top:20px;}

/* table */
.table-custom{font-size:13.5px;}
.table-custom thead th{
  color:#a7a4b5;font-weight:600;font-size:12px;text-transform:uppercase;
  border-bottom:1px solid #f1f0f5;padding:10px 12px;background:#fafafd;
}
.table-custom tbody td{padding:12px;vertical-align:middle;border-bottom:1px solid #f4f3f8;}
.table-custom tbody tr:last-child td{border-bottom:none;}
.prod-thumb{width:36px;height:36px;border-radius:8px;object-fit:cover;background:#f4f3f8;}
.btn-icon-sm{
  width:30px;height:30px;border-radius:8px;border:none;
  display:inline-flex;align-items:center;justify-content:center;font-size:14px;
}
.pagination .page-link{border:none;border-radius:8px;margin:0 2px;color:#5d596c;font-size:13px;}
.pagination .page-item.active .page-link{background:var(--bs-primary);color:#fff;}

.nav-pills-custom{background:#f4f3f8;border-radius:10px;padding:4px;display:inline-flex;gap:2px;}
.nav-pills-custom a{
  padding:6px 14px;border-radius:8px;font-size:13px;color:#5d596c;font-weight:500;
  cursor:pointer;
}
.nav-pills-custom a.active{background:#fff;color:var(--bs-primary);box-shadow:0 2px 6px rgba(0,0,0,.06);}

.stat-mini h4{font-weight:700;color:#3a3648;}
.transaction-icon{
  width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;
}

@media(max-width:575px){
  .page-wrap{padding:0 10px 20px;}
  .topbar{padding:12px 14px;}
}
</style>
</head>
<body>

<div class="topbar">
  <h6>Ecommerce</h6>
  <div class="breadcrumb-mini">
    <i class="bi bi-house"></i>
    <i class="bi bi-chevron-right" style="font-size:10px;"></i>
    <span>Dashboard</span>
    <i class="bi bi-chevron-right" style="font-size:10px;"></i>
    <span style="color:#3a3648;font-weight:600;">Ecommerce</span>
  </div>
</div>

<div class="page-wrap">
  <div class="row">
    <!-- MAIN COLUMN -->
    <div class="col-xl-8 col-xxl-9">
      <div class="row g-3">

        <!-- Welcome -->
        <div class="col-xxl-5 col-md-6">
          <div class="card welcome-card h-100">
            <div class="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <h4 class="mb-3">Welcome Back, Charlie!</h4>
                <p class="text-muted" style="max-width:230px;">Here's a quick look at your store's performance today. Stay on top of your sales, orders, and customers.</p>
              </div>
              <div>
                <h3 class="mb-1">$25,56k</h3>
                <p class="text-muted mb-3">Monthly Sales <span class="text-success fw-medium ms-1"><i class="bi bi-graph-up-arrow"></i> 5.2%</span></p>
                <button class="btn btn-primary">View Reports</button>
              </div>
              <div class="blur-circle"></div>
            </div>
          </div>
        </div>

        <!-- Sales Summary -->
        <div class="col-xxl-7 col-md-6">
          <div class="card h-100 mb-0">
            <div class="card-header">
              <h5 class="card-title">Sales Summary</h5>
              <div class="dropdown">
                <a href="#" class="text-muted small dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">Monthly</a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#">Weekly</a></li>
                  <li><a class="dropdown-item" href="#">Monthly</a></li>
                  <li><a class="dropdown-item" href="#">Yearly</a></li>
                </ul>
              </div>
            </div>
            <div class="card-body">
              <div id="salesSummaryChart"></div>
            </div>
          </div>
        </div>

        <!-- 4 stat cards -->
        <div class="col-6 col-xxl-3">
          <div class="card h-100 stat-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 class="mb-2">Total Sales</h6>
                  <p class="text-muted mb-0 small"><span class="text-success fw-medium"><i class="bi bi-graph-up-arrow"></i> 8.5%</span> vs last week</p>
                </div>
                <div class="icon-circle bg-primary-subtle-c"><i class="bi bi-bag"></i></div>
              </div>
              <h4 class="mb-0">$35,780 <span class="small fw-normal text-muted">/weekly</span></h4>
            </div>
          </div>
        </div>
        <div class="col-6 col-xxl-3">
          <div class="card h-100 stat-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 class="mb-2">Revenue</h6>
                  <p class="text-muted mb-0 small"><span class="text-success fw-medium"><i class="bi bi-graph-up-arrow"></i> 5.7%</span> vs last week</p>
                </div>
                <div class="icon-circle bg-success-subtle-c"><i class="bi bi-credit-card"></i></div>
              </div>
              <h4 class="mb-0">$2,458 <span class="small fw-normal text-muted">/weekly</span></h4>
            </div>
          </div>
        </div>
        <div class="col-6 col-xxl-3">
          <div class="card h-100 stat-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 class="mb-2">Total Orders</h6>
                  <p class="text-muted mb-0 small"><span class="text-danger fw-medium"><i class="bi bi-graph-down-arrow"></i> 2.1%</span> vs last week</p>
                </div>
                <div class="icon-circle bg-warning-subtle-c"><i class="bi bi-cart3"></i></div>
              </div>
              <h4 class="mb-0">1,245 <span class="small fw-normal text-muted">/weekly</span></h4>
            </div>
          </div>
        </div>
        <div class="col-6 col-xxl-3">
          <div class="card h-100 stat-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 class="mb-2">New Customers</h6>
                  <p class="text-muted mb-0 small"><span class="text-success fw-medium"><i class="bi bi-graph-up-arrow"></i> 12%</span> vs last week</p>
                </div>
                <div class="icon-circle bg-danger-subtle-c"><i class="bi bi-people"></i></div>
              </div>
              <h4 class="mb-0">320 <span class="small fw-normal text-muted">/weekly</span></h4>
            </div>
          </div>
        </div>

        <!-- Sales by Country -->
        <div class="col-md-6 col-xxl-4">
          <div class="card h-100 mb-0">
            <div class="card-header">
              <h5 class="card-title">Sales by Country</h5>
              <a href="#" class="text-muted small text-decoration-none">See All <i class="bi bi-arrow-right"></i></a>
            </div>
            <div class="card-body pt-2 scroll-list" style="max-height:400px;">
              <div id="countryList"></div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="col-md-6 col-xxl-4">
          <div class="card h-100 mb-0">
            <div class="card-header">
              <h5 class="card-title">Top Products</h5>
              <div class="dropdown">
                <a href="#" class="text-muted small dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">Weekly</a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="#">Weekly</a></li>
                  <li><a class="dropdown-item" href="#">Monthly</a></li>
                  <li><a class="dropdown-item" href="#">Yearly</a></li>
                </ul>
              </div>
            </div>
            <div class="card-body scroll-list" style="max-height:400px;" id="topProducts"></div>
          </div>
        </div>

        <!-- Top Customers -->
        <div class="col-xxl-4">
          <div class="card h-100 mb-0">
            <div class="card-header">
              <h5 class="card-title">Top Customers</h5>
            </div>
            <div class="card-body scroll-list" style="max-height:400px;" id="topCustomers"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIDEBAR -->
    <div class="col-xl-4 col-xxl-3">
      <div class="card sticky-side mb-0">
        <div class="card-body">
          <div class="mb-4">
            <h5 class="card-title mb-3">Platforms :</h5>
            <div id="platformsList"></div>
          </div>
          <div class="mb-4">
            <h5 class="card-title mb-3">Order Statistics :</h5>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 class="fw-medium mb-1">$71.5k</h5>
                <p class="text-muted mb-0 small">Monthly Earnings</p>
              </div>
              <span class="text-success small fw-medium"><i class="bi bi-graph-up-arrow"></i> 25% Increased</span>
            </div>
            <div id="orderStatistics"></div>
          </div>
          <div>
            <h5 class="card-title mb-3">Quick Transaction :</h5>
            <div class="d-flex flex-wrap align-items-center gap-2 mb-3" id="quickClients"></div>
            <div class="mb-3">
              <label class="form-label small">Select Client</label>
              <select class="form-select form-select-sm">
                <option selected disabled>Choose client...</option>
                <option>Eleanor Pena</option>
                <option>Marvin McKinney</option>
                <option>Courtney Henry</option>
                <option>Jerome Bell</option>
                <option>Devon Lane</option>
              </select>
            </div>
            <button class="btn btn-primary w-100">Transfer Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Row 2 -->
  <div class="row g-3">
    <div class="col-xxl-6">
      <div class="card mb-0 h-100">
        <div class="card-header flex-wrap gap-2">
          <h5 class="card-title">Revenue Statistics</h5>
          <a href="#" class="btn btn-primary btn-sm"><i class="bi bi-download me-1"></i>Download</a>
        </div>
        <div class="card-body">
          <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div class="d-flex gap-4">
              <div>
                <p class="text-muted mb-1 small">Total Revenue</p>
                <h5 class="mb-0 fw-medium">$85,24k</h5>
              </div>
              <div>
                <p class="text-muted mb-1 small">Total Refunds</p>
                <h5 class="mb-0 fw-medium">$4,125</h5>
              </div>
            </div>
            <div class="nav-pills-custom">
              <a class="active" data-tab="monthly">Monthly</a>
              <a data-tab="yearly">Yearly</a>
              <a data-tab="weekly">Weekly</a>
            </div>
          </div>
          <div id="revenueStatisticsChart"></div>
        </div>
      </div>
    </div>

    <div class="col-xl-7 col-xxl-6">
      <div class="card mb-0 h-100">
        <div class="card-header">
          <h5 class="card-title">Top Selling Products</h5>
          <div class="dropdown">
            <a href="#" class="text-muted small dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">Weekly</a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Weekly</a></li>
              <li><a class="dropdown-item" href="#">Monthly</a></li>
              <li><a class="dropdown-item" href="#">Yearly</a></li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-custom mb-0">
              <thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Units Sold</th><th>Revenue</th><th class="text-end">Actions</th></tr></thead>
              <tbody id="sellingProductsBody"></tbody>
            </table>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-3 justify-content-between mt-3">
            <p class="mb-0 text-muted small">Showing <span class="fw-semibold text-body">1</span> - <span class="fw-semibold text-body">4</span> of <span class="fw-semibold text-body">12</span> Products</p>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item"><a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a></li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-5">
      <div class="card mb-0 h-100">
        <div class="card-header">
          <h5 class="card-title">Recent Orders</h5>
          <a href="#" class="text-muted small text-decoration-none">See All <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-custom mb-0">
              <thead><tr><th>Customer</th><th>Product</th><th>Status</th><th>Date</th><th class="text-end">Actions</th></tr></thead>
              <tbody id="recentOrdersBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-5 col-xl-3 col-xxl-2">
      <div class="card stat-mini">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <div>
              <h4 class="mb-0">$71.5k</h4>
              <p class="text-muted small mb-0">Monthly Earnings</p>
            </div>
            <span class="text-success small"><i class="bi bi-graph-up-arrow"></i> 3.5%</span>
          </div>
          <div id="monthlyEarningsChart"></div>
        </div>
      </div>
      <div class="card stat-mini">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <div>
              <h4 class="mb-0">185k</h4>
              <p class="text-muted small mb-0">Weekly Orders</p>
            </div>
            <span class="text-danger small"><i class="bi bi-graph-down-arrow"></i> 4.5%</span>
          </div>
          <div id="weeklyOrdersChart"></div>
          <span class="text-muted small">Last week <span class="text-success fw-medium">+8.2%</span></span>
        </div>
      </div>
    </div>

    <div class="col-md-7 col-xl-4 col-xxl-2">
      <div class="card mb-0 h-100">
        <div class="card-header">
          <h5 class="card-title">Top Categories</h5>
          <a href="#" class="text-muted small text-decoration-none">See All <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="card-body scroll-list" style="max-height:410px;" id="topCategories"></div>
      </div>
    </div>

    <div class="col-xl-5 col-xxl-3">
      <div class="card mb-0 h-100">
        <div class="card-header">
          <h5 class="card-title">Transactions</h5>
          <div class="dropdown">
            <a href="#" class="text-muted small dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">Monthly</a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Weekly</a></li>
              <li><a class="dropdown-item" href="#">Monthly</a></li>
              <li><a class="dropdown-item" href="#">Yearly</a></li>
            </ul>
          </div>
        </div>
        <div class="card-body scroll-list" style="max-height:410px;" id="transactionsList"></div>
      </div>
    </div>
  </div>
</div>

<script>
/* ---------- Data ---------- */
const countries = [
  {name:"United States", pct:65, color:"primary", flag:"🇺🇸"},
  {name:"India", pct:45, color:"warning", flag:"🇮🇳"},
  {name:"Canada", pct:74, color:"danger", flag:"🇨🇦"},
  {name:"Australia", pct:56, color:"info", flag:"🇦🇺"},
  {name:"Germany", pct:48, color:"secondary", flag:"🇩🇪"},
  {name:"France", pct:80, color:"success", flag:"🇫🇷"},
  {name:"United Kingdom", pct:54, color:"danger", flag:"🇬🇧"},
  {name:"Italy", pct:64, color:"info", flag:"🇮🇹"},
];
const products = [
  {name:"Wireless Earbuds", cat:"Electronics", units:"1,240", rev:"$24,800", icon:"🎧", status:"In Stock", statusColor:"success"},
  {name:"Organic Honey", cat:"Grocery", units:"1,520", rev:"$91,200", icon:"🍯", status:"In Stock", statusColor:"success"},
  {name:"Gaming Laptop", cat:"Electronics", units:"750", rev:"$375,000", icon:"💻", status:"In Stock", statusColor:"success"},
  {name:"Leather Jacket", cat:"Clothing", units:"1,100", rev:"$1,320,000", icon:"🧥", status:"In Stock", statusColor:"success"},
  {name:"Makeup Set", cat:"Beauty", units:"758", rev:"$12,600", icon:"💄", status:"Low Stock", statusColor:"warning"},
  {name:"Smart Watch", cat:"Electronics", units:"950", rev:"$57,000", icon:"⌚", status:"Low Stock", statusColor:"warning"},
  {name:"Hydrating Beauty Cream", cat:"Beauty", units:"620", rev:"$18,600", icon:"🧴", status:"In Stock", statusColor:"success"},
];
const customers = [
  {name:"Alice Johnson", type:"Premium Customer", orders:45, amt:"$12,500", img:2},
  {name:"Daniel Carter", type:"Regular Customer", orders:32, amt:"$8,200", img:3},
  {name:"Emma Wilson", type:"Premium Customer", orders:28, amt:"$9,750", img:4},
  {name:"Liam Johnson", type:"Regular Customer", orders:20, amt:"$5,400", img:5},
  {name:"Olivia Brown", type:"Premium Customer", orders:15, amt:"$3,900", img:6},
  {name:"Noah Smith", type:"Regular Customer", orders:12, amt:"$2,750", img:11},
];
const platforms = [
  {name:"Amazon", orders:"12.43k", pct:45, badge:"Top Seller", color:"success", icon:"🅰️"},
  {name:"eBay", orders:"8.92k", pct:32, badge:"Trending", color:"info", icon:"🛒"},
  {name:"Shopify", orders:"6.14k", pct:25, badge:"Fast Growth", color:"warning", icon:"🛍️"},
  {name:"Flipkart", orders:"4.85k", pct:18, badge:"Growing", color:"primary", icon:"📦"},
  {name:"Walmart", orders:"7.56k", pct:28, badge:"Low Stock", color:"danger", icon:"🏬"},
];
const sellingProducts = [
  {name:"Wireless Earbuds", cat:"Electronics", status:"In Stock", statusColor:"success", units:"1,240", rev:"$24,800", icon:"🎧"},
  {name:"Smart Watch", cat:"Electronics", status:"Low Stock", statusColor:"warning", units:"980", rev:"$49,000", icon:"⌚"},
  {name:"iPhone 15 Pro", cat:"Electronics", status:"In Stock", statusColor:"success", units:"1,100", rev:"$1,320,000", icon:"📱"},
  {name:"Luxury Perfume", cat:"Beauty", status:"Low Stock", statusColor:"warning", units:"780", rev:"$46,800", icon:"🧴"},
  {name:"Hydrating Beauty Cream", cat:"Beauty", status:"In Stock", statusColor:"success", units:"620", rev:"$18,600", icon:"🧴"},
];
const recentOrders = [
  {name:"Alice Johnson", prod:"Wireless Earbuds", status:"Delivered", color:"success", date:"11 Sep 2025", icon:"🎧", img:2},
  {name:"Michael Smith", prod:"Smart Watch", status:"Pending", color:"warning", date:"10 Sep 2025", icon:"⌚", img:4},
  {name:"Sophia Lee", prod:"Gaming Laptop", status:"Cancelled", color:"danger", date:"09 Sep 2025", icon:"💻", img:6},
  {name:"Olivia Brown", prod:"Luxury Perfume", status:"Delivered", color:"success", date:"06 Sep 2025", icon:"🧴", img:9},
  {name:"Liam Johnson", prod:"Winter Jacket", status:"Pending", color:"warning", date:"05 Sep 2025", icon:"🧥", img:10},
];
const categories = [
  {name:"Luxury Perfume", rating:4.6, price:"$109", icon:"🧴"},
  {name:"Smart Watch", rating:4.3, price:"$179", icon:"⌚"},
  {name:"Smartphone", rating:4.7, price:"$799", icon:"📱"},
  {name:"Wireless Earbuds", rating:4.5, price:"$99", icon:"🎧"},
  {name:"Leather Jacket", rating:4.5, price:"$99", icon:"🧥"},
  {name:"Gaming Laptop", rating:4.8, price:"$1,299", icon:"💻"},
];
const transactions = [
  {name:"John Doe", type:"PayPal Payment", amt:"+$250", pos:true, icon:"bi-paypal", color:"primary"},
  {name:"Alice Johnson", type:"Credit Card Payment", amt:"+$1,200", pos:true, icon:"bi-credit-card", color:"success"},
  {name:"Daniel Carter", type:"Wallet Payment", amt:"-$350", pos:false, icon:"bi-wallet2", color:"warning"},
  {name:"Emma Wilson", type:"Bank Transfer", amt:"+$720", pos:true, icon:"bi-bank", color:"danger"},
  {name:"Liam Johnson", type:"Cash on Delivery", amt:"-$450", pos:false, icon:"bi-cash-stack", color:"info"},
  {name:"Sophia Martinez", type:"PayPal Payment", amt:"-$680", pos:false, icon:"bi-paypal", color:"primary"},
  {name:"Michael Scott", type:"Credit Card Payment", amt:"+$1,100", pos:true, icon:"bi-credit-card", color:"success"},
  {name:"Olivia Harris", type:"Wallet Payment", amt:"-$430", pos:false, icon:"bi-wallet2", color:"warning"},
  {name:"William Brown", type:"Bank Transfer", amt:"+$950", pos:true, icon:"bi-bank", color:"danger"},
  {name:"Emma Wilson", type:"Cash on Delivery", amt:"-$520", pos:false, icon:"bi-cash-stack", color:"info"},
];

/* ---------- Render helpers ---------- */
function avatarImg(seed, size=38){
  return `<img src="https://i.pravatar.cc/64?img=${seed}" alt="avatar">`;
}

document.getElementById('countryList').innerHTML = countries.map(c=>`
  <div class="country-row">
    <span style="font-size:20px;">${c.flag}</span>
    <span class="country-name">${c.name}</span>
    <span class="country-pct">${c.pct}%</span>
    <div class="progress"><div class="progress-bar bg-${c.color}" style="width:${c.pct}%"></div></div>
  </div>`).join('');

document.getElementById('topProducts').innerHTML = products.map(p=>`
  <div class="rich-list-item">
    <div class="avatar" style="font-size:20px;">${p.icon}</div>
    <div class="rich-list-content">
      <a href="#" class="rich-list-title">${p.name}</a>
      <span class="rich-list-subtitle">${p.cat} · ${p.units} Units Sold</span>
    </div>
    <div class="fw-semibold text-body">${p.rev}</div>
  </div>`).join('');

document.getElementById('topCustomers').innerHTML = customers.map(c=>`
  <div class="rich-list-item">
    <div class="avatar avatar-circle">${avatarImg(c.img)}</div>
    <div class="rich-list-content">
      <a href="#" class="rich-list-title">${c.name}</a>
      <span class="rich-list-subtitle">${c.type} - ${c.orders} Orders</span>
    </div>
    <div class="fw-semibold text-body">${c.amt}</div>
  </div>`).join('');

document.getElementById('platformsList').innerHTML = platforms.map(p=>`
  <div class="rich-list-item">
    <div class="platform-icon">${p.icon}</div>
    <div class="rich-list-content">
      <a href="#" class="rich-list-title">${p.name}</a>
      <span class="rich-list-subtitle">${p.orders} Orders · ${p.pct}% Progress</span>
    </div>
    <span class="badge-label badge-${p.color}-l">${p.badge}</span>
  </div>`).join('');

document.getElementById('quickClients').innerHTML = [11,12,10,9].map(i=>`<div class="avatar avatar-circle avatar-sm">${avatarImg(i)}</div>`).join('') +
  `<div class="avatar avatar-circle avatar-sm border d-flex align-items-center justify-content-center text-muted" style="cursor:pointer;"><i class="bi bi-plus-lg"></i></div>`;

document.getElementById('sellingProductsBody').innerHTML = sellingProducts.map(p=>`
  <tr>
    <td><div class="d-flex align-items-center gap-2"><div class="avatar" style="font-size:18px;">${p.icon}</div><span class="fw-medium text-body">${p.name}</span></div></td>
    <td>${p.cat}</td>
    <td><span class="badge-label badge-${p.statusColor}-l">${p.status}</span></td>
    <td>${p.units}</td>
    <td>${p.rev}</td>
    <td class="text-end">
      <button class="btn-icon-sm badge-success-l"><i class="bi bi-eye"></i></button>
      <button class="btn-icon-sm badge-primary-l"><i class="bi bi-pencil"></i></button>
      <button class="btn-icon-sm badge-danger-l"><i class="bi bi-trash"></i></button>
    </td>
  </tr>`).join('');

document.getElementById('recentOrdersBody').innerHTML = recentOrders.map(o=>`
  <tr>
    <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-circle avatar-sm">${avatarImg(o.img)}</div><span class="fw-semibold text-body">${o.name}</span></div></td>
    <td><div class="d-flex align-items-center gap-2"><div class="avatar" style="font-size:18px;">${o.icon}</div><span>${o.prod}</span></div></td>
    <td><span class="badge-label badge-${o.color}-l">${o.status}</span></td>
    <td>${o.date}</td>
    <td class="text-end">
      <button class="btn-icon-sm badge-primary-l"><i class="bi bi-check-lg"></i></button>
      <button class="btn-icon-sm badge-danger-l"><i class="bi bi-x-lg"></i></button>
    </td>
  </tr>`).join('');

document.getElementById('topCategories').innerHTML = categories.map(c=>`
  <div class="rich-list-item">
    <div class="avatar" style="font-size:20px;">${c.icon}</div>
    <div class="rich-list-content">
      <a href="#" class="rich-list-title mb-1">${c.name}</a>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted small"><i class="bi bi-star-fill text-warning"></i> (${c.rating})</span>
        <span class="fw-medium text-body small">${c.price}</span>
      </div>
    </div>
  </div>`).join('');

document.getElementById('transactionsList').innerHTML = transactions.map(t=>`
  <div class="rich-list-item">
    <div class="transaction-icon badge-${t.color}-l"><i class="bi ${t.icon}"></i></div>
    <div class="rich-list-content">
      <a href="#" class="rich-list-title">${t.name}</a>
      <span class="rich-list-subtitle">${t.type}</span>
    </div>
    <h6 class="mb-0 fw-medium ${t.pos?'text-success':'text-danger'}">${t.amt}</h6>
  </div>`).join('');

/* ---------- Charts ---------- */
const purple = '#7367f0', purpleLight='rgba(115,103,240,.15)';

// Sales Summary (bar)
new ApexCharts(document.querySelector("#salesSummaryChart"), {
  chart:{type:'bar', height:300, toolbar:{show:false}, fontFamily:'Inter'},
  series:[{name:'Sales', data:[3.4,5.2,8.0,11.1,7.0,5.7,4.3,3.4,2.5,1.5,1.0,0.7]}],
  plotOptions:{bar:{borderRadius:6, columnWidth:'45%', distributed:false}},
  colors:[purple],
  dataLabels:{enabled:true, formatter:v=>'$'+v+'k', offsetY:-20, style:{fontSize:'11px', colors:['#3a3648']}},
  xaxis:{categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], axisBorder:{show:false}, axisTicks:{show:false}},
  yaxis:{labels:{formatter:v=>'$'+v+'k'}},
  grid:{borderColor:'#f1f0f5', strokeDashArray:4},
  states:{hover:{filter:{type:'darken'}}}
}).render();

// Order statistics small area
new ApexCharts(document.querySelector("#orderStatistics"), {
  chart:{type:'area', height:180, toolbar:{show:false}, fontFamily:'Inter', sparkline:{enabled:false}},
  series:[{name:'Earnings', data:[20,28,22,24,29,21,26,23,27,24]}],
  colors:[purple],
  stroke:{curve:'smooth', width:3},
  fill:{type:'gradient', gradient:{shadeIntensity:1, opacityFrom:.35, opacityTo:0, stops:[0,90]}},
  dataLabels:{enabled:false},
  xaxis:{labels:{show:false}, axisBorder:{show:false}, axisTicks:{show:false}},
  yaxis:{show:false},
  grid:{show:false}
}).render();

// Revenue statistics - line, two series, tabbed
const revData = {
  monthly:{cats:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    s1:[20,28,18,22,26,20,29,22,26,20,27,23], s2:[10,18,25,10,15,12,10,21,10,16,10,19]},
  yearly:{cats:['2019','2020','2021','2022','2023','2024','2025','2026'],
    s1:[15,22,18,26,20,29,24,27], s2:[8,14,10,19,12,22,15,18]},
  weekly:{cats:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    s1:[12,18,10,22,16,25,20], s2:[8,12,15,9,18,11,14]},
};
const revChart = new ApexCharts(document.querySelector("#revenueStatisticsChart"), {
  chart:{type:'line', height:300, toolbar:{show:false}, fontFamily:'Inter'},
  series:[{name:'Revenue', data:revData.monthly.s1},{name:'Refunds', data:revData.monthly.s2}],
  colors:['#28c76f', purple],
  stroke:{curve:'smooth', width:3},
  dataLabels:{enabled:false},
  xaxis:{categories:revData.monthly.cats, axisBorder:{show:false}, axisTicks:{show:false}},
  yaxis:{labels:{formatter:v=>v+'k'}},
  grid:{borderColor:'#f1f0f5', strokeDashArray:4},
  legend:{show:false}
});
revChart.render();
document.querySelectorAll('.nav-pills-custom a').forEach(a=>{
  a.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-pills-custom a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const d = revData[a.dataset.tab];
    revChart.updateOptions({xaxis:{categories:d.cats}});
    revChart.updateSeries([{name:'Revenue', data:d.s1},{name:'Refunds', data:d.s2}]);
  });
});

// Monthly earnings sparkline
new ApexCharts(document.querySelector("#monthlyEarningsChart"), {
  chart:{type:'line', height:70, sparkline:{enabled:true}},
  series:[{data:[10,14,9,16,12,18,14,20,16,22]}],
  colors:['#28c76f'],
  stroke:{curve:'smooth', width:2.5}
}).render();

// Weekly orders bar sparkline
new ApexCharts(document.querySelector("#weeklyOrdersChart"), {
  chart:{type:'bar', height:90, sparkline:{enabled:true}},
  series:[{data:[14,18,12,20,16,22,19]}],
  colors:['rgba(234,84,85,.35)'],
  plotOptions:{bar:{columnWidth:'45%', borderRadius:4}}
}).render();
</script>
</body>
</html>