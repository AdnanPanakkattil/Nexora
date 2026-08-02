<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme" role="navigation" aria-label="Main navigation">
  <!-- Logo Section -->
  <div class="app-brand demo py-3">
    <a href="{{ route('dashboard') }}" class="app-brand-link d-flex align-items-center">
      <span class="app-brand-logo demo me-2 d-flex align-items-center">
        <img src="{{ asset('assets/imglogo/logo.png') }}" alt="Nexora Logo" style="height: 34px; width: auto; object-fit: contain;">
      </span>
      <span class="app-brand-text demo menu-text fw-bolder" style="font-size: 22px;">Nexora</span>
    </a>
  </div>

  <div class="brand-divider"></div>

  <ul class="menu-inner py-1">

    <!-- Dashboard -->
    <li class="menu-header small text-uppercase"><span class="menu-header-text">dashboard</span></li>
    <li class="menu-item">
      <a href="{{ route('dashboard') }}" class="menu-link">
        <i class="menu-icon ti ti-smart-home"></i>
        <div data-i18n="Dashboards">Dashboards</div>
      </a>
    </li>

    <!-- ========================= Product Management ==================================== -->

    <li class="menu-item" id="product_management_main_menu">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-shopping-bag"></i>
        <div data-i18n="Product Management">Product Management</div>
      </a>

      <!-- Products -->
      <ul class="menu-sub">
        <li class="menu-item" id="product_management_sub_menu">
          <a href="{{ route('product') }}" class="menu-link">
            <div data-i18n="Products">Products</div>
          </a>
        </li>
      </ul>

      <!-- Product Variants -->
      <ul class="menu-sub">
        <li class="menu-item" id="product_management_sub_menu">
          <a href="{{ route('product') }}" class="menu-link">
            <div data-i18n="Product Variants">Product Variants</div>
          </a>
        </li>
      </ul>

      <!-- Categories -->
      <ul class="menu-sub">
        <li class="menu-item" id="Categories_sub_menu">
          <a href="{{ route('Categories-list') }}" class="menu-link">
            <div data-i18n="Categories">Categories</div>
          </a>
        </li>
      </ul>

      <!-- Sub Categories -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="{{ route('Sub-catogery')}}" class="menu-link">
            <div data-i18n="Sub Categories">Sub Categories</div>
          </a>
        </li>
      </ul>

      <!-- Child Categories -->
      <ul class="menu-sub">
        <li class="menu-item" id="Child_categories_sub_menu">
          <a href="{{ route('child-categories') }}" class="menu-link">
            <div data-i18n="Child Categories">Child Categories</div>
          </a>
        </li>
      </ul>

      <!-- Brand -->
      <ul class="menu-sub">
        <li class="menu-item" id="Brands_sub_menu">
          <a href="{{ route('brand') }}" class="menu-link">
            <div data-i18n="Brands">Brands</div>
          </a>
        </li>
      </ul>

      <!-- Unit -->
      <ul class="menu-sub">
        <li class="menu-item" id="Units_sub_menu">
          <a href="{{ route('units.list') }}" class="menu-link">
            <div data-i18n="Units">Units</div>
          </a>
        </li>
      </ul>

      <!-- Attributes -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Attributes">Attributes</div>
          </a>
        </li>
      </ul>

      <!-- Attribute Values -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Attribute Values">Attribute Values</div>
          </a>
        </li>
      </ul>

      <!-- Tags -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Tags">Tags</div>
          </a>
        </li>
      </ul>

      <!-- Collections -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Collections">Collections</div>
          </a>
        </li>
      </ul>

      <!-- Product Labels -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Product Labels">Product Labels</div>
          </a>
        </li>
      </ul>

      <!-- Inventory -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Inventory">Inventory</div>
          </a>
        </li>
      </ul>

      <!-- Stock History -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Stock History">Stock History</div>
          </a>
        </li>
      </ul>

      <!-- Bulk Import -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Bulk Import">Bulk Import</div>
          </a>
        </li>
      </ul>

      <!-- Bulk Export -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Bulk Export">Bulk Export</div>
          </a>
        </li>
      </ul>

      <!-- Product Reviews -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Product Reviews">Product Reviews</div>
          </a>
        </li>
      </ul>

      <!-- Product Approval -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Product Approval">Product Approval</div>
          </a>
        </li>
      </ul>

      <!-- Draft Products -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Draft Products">Draft Products</div>
          </a>
        </li>
      </ul>

      <!-- Product Settings -->
      <ul class="menu-sub">
        <li class="menu-item" id="sub_catogery_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Product Settings">Product Settings</div>
          </a>
        </li>
      </ul>

    </li>
    <!-- =================================================================================== -->


    <!-- ========================= Order Management ==================================== -->

    <li class="menu-item" id="order_management_main_menu">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-truck-delivery"></i>
        <div data-i18n="Order Management">Order Management</div>
      </a>

      <!-- Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Orders">Orders</div>
          </a>
        </li>
      </ul>

      <!-- Pending Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Pending Orders">Pending Orders</div>
          </a>
        </li>
      </ul>

      <!-- Confirmed Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Confirmed Orders">Confirmed Orders</div>
          </a>
        </li>
      </ul>

      <!-- Packed Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Packed Orders">Packed Orders</div>
          </a>
        </li>
      </ul>

      <!-- Shipped Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Shipped Orders">Shipped Orders</div>
          </a>
        </li>
      </ul>

      <!-- Delivered Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Delivered Orders">Delivered Orders</div>
          </a>
        </li>
      </ul>

      <!-- Cancelled Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Cancelled Orders">Cancelled Orders</div>
          </a>
        </li>
      </ul>

      <!-- Returned Orders -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Returned Orders">Returned Orders</div>
          </a>
        </li>
      </ul>

      <!-- Invoices -->
      <ul class="menu-sub">
        <li class="menu-item" id="order_management_sub_menu">
          <a href="" class="menu-link">
            <div data-i18n="Invoices">Invoices</div>
          </a>
        </li>
      </ul>

    </li>

    <!-- =================================================================================== -->


    <!-- ==================== Customer Management ================================= -->

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-user-heart"></i>
        <div data-i18n="Customer Management">Customer Management</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Customers">Customers</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Customer Groups">Customer Groups</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Addresses">Addresses</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Wishlists">Wishlists</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Wallet">Wallet</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Customer Reviews">Customer Reviews</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Support Tickets">Support Tickets</div>
          </a>
        </li>

      </ul>
    </li>

    <!-- =================================================================================== -->

    <!-- ==================== Vendor Management ================================= -->

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-building-store"></i>
        <div data-i18n="Vendor Management">Vendor Management</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Vendors">Vendors</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Vendor Requests">Vendor Requests</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Vendor Products">Vendor Products</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Vendor Payments">Vendor Payments</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Vendor Reviews">Vendor Reviews</div>
          </a>
        </li>

      </ul>
    </li>

    <!-- =================================================================================== -->

    <!-- ==================== Marketing ================================= -->

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-speakerphone"></i>
        <div data-i18n="Marketing">Marketing</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Coupons">Coupons</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Offers">Offers</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Flash Sales">Flash Sales</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Banners">Banners</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Sliders">Sliders</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Promo Codes">Promo Codes</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Newsletter">Newsletter</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Push Notifications">Push Notifications</div>
          </a>
        </li>

      </ul>
    </li>

    <!-- =================================================================================== -->

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-users"></i>
        <div data-i18n="User">User</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="{{ route('authuser.index') }}" class="menu-link">
            <div data-i18n="Users">Users</div>
          </a>
        </li>

      </ul>
    </li>

    <li class="menu-item">
      <a href="" class="menu-link">
        <i class="menu-icon ti ti-timeline"></i>
        <div data-i18n="Activity Logs">Activity Logs</div>
      </a>
    </li>

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-wallet"></i>
        <div data-i18n="Finance">Finance</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Transactions">Transactions</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Payments">Payments</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Refunds">Refunds</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Taxes">Taxes</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Reports">Reports</div>
          </a>
        </li>

      </ul>
    </li>

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-truck-delivery"></i>
        <div data-i18n="Shipping">Shipping</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Shipping Methods">Shipping Methods</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Shipping Charges">Shipping Charges</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Delivery Areas">Delivery Areas</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Pincodes">Pincodes</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Delivery Partners">Delivery Partners</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Tracking">Tracking</div>
          </a>
        </li>

      </ul>
    </li>

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-chart-bar"></i>
        <div data-i18n="Reports">Reports</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Sales Reports">Sales Reports</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Order Reports">Order Reports</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Customer Reports">Customer Reports</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Product Reports">Product Reports</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Inventory Reports">Inventory Reports</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Revenue Reports">Revenue Reports</div>
          </a>
        </li>

      </ul>
    </li>

    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-settings"></i>
        <div data-i18n="Settings">Settings</div>
      </a>
      <ul class="menu-sub">

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="General Settings">General Settings</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Store Settings">Store Settings</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Email Settings">Email Settings</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="SMS Settings">SMS Settings</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Payment Gateway">Payment Gateway</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Social Login">Social Login</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="SEO Settings">SEO Settings</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Currencies">Currencies</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Languages">Languages</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Countries">Countries</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="States">States</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Taxes">Taxes</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Backup">Backup</div>
          </a>
        </li>

        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="System Logs">System Logs</div>
          </a>
        </li>

      </ul>
    </li>


  </ul>

</aside>