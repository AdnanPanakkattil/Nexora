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
      <a href="{{ route('dashboard') }}" class="menu-link">
        <i class="menu-icon ti ti-smart-home"></i>
        <div data-i18n="Dashboards">Dashboards</div>
      </a>
    </li>


    


    <!-- User -->
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

   
  </ul>

</aside>