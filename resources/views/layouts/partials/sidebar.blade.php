<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme" role="navigation" aria-label="Main navigation">
  <!-- Logo Section -->
  <div class="app-brand demo py-3">
    <a href="index.html" class="app-brand-link">
      <span class="app-brand-logo demo">
        <img src="{{ asset('assets/imglogo/logo-sm.png') }}" alt="Nexora Logo" height="20px">
      </span>
      <span class="app-brand-text demo menu-text text-dark fw-bolder" style="font-size: 24px;">Nexora</span>
    </a>
  </div>

  <div class="brand-divider"></div>

  <ul class="menu-inner py-1">

    <!-- Dashboard -->
    <li class="menu-header small text-uppercase"><span class="menu-header-text">dashboard</span></li>
    <li class="menu-item">
      <a href="" class="menu-link">
        <i class="menu-icon ti ti-smart-home"></i>
        <div data-i18n="Dashboards">Dashboards</div>
      </a>
    </li>

    <!-- Product Management -->
    <li class="menu-item">
    <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-shopping-bag"></i>
        <div data-i18n="Product Management">Product Management</div>
    </a>

    <ul class="menu-sub">

        <!-- Category -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Categories">Categories</div>
            </a>
        </li>

        <!-- Sub Category -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Sub Categories">Sub Categories</div>
            </a>
        </li>

        <!-- Child Category -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Child Categories">Child Categories</div>
            </a>
        </li>

        <!-- Brands -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Brands">Brands</div>
            </a>
        </li>

        <!-- Attributes -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Attributes">Attributes</div>
            </a>
        </li>

        <!-- Attribute Values -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Attribute Values">Attribute Values</div>
            </a>
        </li>

        <!-- Products -->
        <li class="menu-item {{ request()->routeIs('item-master.*') ? 'active' : '' }}">
            <a href="" class="menu-link">
                <div data-i18n="Products">Products</div>
            </a>
        </li>

        <!-- Product Variants -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Product Variants">Product Variants</div>
            </a>
        </li>

        <!-- Product Images -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Product Images">Product Images</div>
            </a>
        </li>

        <!-- Specifications -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Specifications">Specifications</div>
            </a>
        </li>

        <!-- Tags -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Product Tags">Product Tags</div>
            </a>
        </li>

        <!-- Labels -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Product Labels">Product Labels</div>
            </a>
        </li>

        <!-- Reviews -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Reviews">Reviews</div>
            </a>
        </li>

        <!-- Questions -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Questions & Answers">Questions & Answers</div>
            </a>
        </li>

        <!-- SEO -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="SEO">SEO</div>
            </a>
        </li>

        <!-- Import -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Import Products">Import Products</div>
            </a>
        </li>

        <!-- Export -->
        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Export Products">Export Products</div>
            </a>
        </li>

    </ul>
</li>

    <!-- Purchase Management -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-truck-delivery"></i>
        <div data-i18n="Purchase Management">Purchase Management</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Purchase Entry">Purchase Entry</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Purchase Return">Purchase Return</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Suppliers">Suppliers</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Inventory Management -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-package"></i>
        <div data-i18n="Inventory Management">Inventory Management</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Stock List">Stock List</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Stock Adjustment">Stock Adjustment</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Low Stock Alert">Low Stock Alert</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Order Management -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-shopping-cart"></i>
        <div data-i18n="Order Management">Order Management</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Orders">Orders</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Pending Orders">Pending Orders</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Processing Orders">Processing Orders</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Shipped Orders">Shipped Orders</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Delivered Orders">Delivered Orders</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Cancelled Orders">Cancelled Orders</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Offers & Marketing -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-tag"></i>
        <div data-i18n="Offers & Marketing">Offers &amp; Marketing</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Coupons">Coupons</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Discounts">Discounts</div>
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
      </ul>
    </li>

    <!-- Review Management -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-star"></i>
        <div data-i18n="Review Management">Review Management</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Product Reviews">Product Reviews</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Ratings">Ratings</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Shipping Management -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-truck"></i>
        <div data-i18n="Shipping Management">Shipping Management</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Shipping Methods">Shipping Methods</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Delivery Charges">Delivery Charges</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Tracking">Tracking</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Users -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-user-cog"></i>
        <div data-i18n="Users">Users</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="User">User</div>
          </a>
        </li>
      </ul>
    </li>

    <!-- Reports -->
    <li class="menu-item">
      <a href="javascript:void(0);" class="menu-link menu-toggle">
        <i class="menu-icon ti ti-report"></i>
        <div data-i18n="Reports">Reports</div>
      </a>
      <ul class="menu-sub">
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Sales Report">Sales Report</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Purchase Report">Purchase Report</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Stock Report">Stock Report</div>
          </a>
        </li>
        <li class="menu-item">
          <a href="" class="menu-link">
            <div data-i18n="Customer Report">Customer Report</div>
          </a>
        </li>
      </ul>
    </li>

  </ul>

</aside>