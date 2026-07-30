<!doctype html>

<html
    lang="en"
    class="light-style layout-navbar-fixed layout-menu-fixed layout-compact"
    dir="ltr"
    data-theme="theme-default"
    data-assets-path="{{ asset('assets/').'/'}}"
    data-template="vertical-menu-template"
    data-style="light">

<head>
    <meta charset="utf-8" />
    <meta
        name="viewport" />
    <title>Nexora Admin dashboard</title>

    <meta name="description" content="" />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/img/favicon/favicon.ico')}}" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&ampdisplay=swap"
        rel="stylesheet" />

    <!-- Icons -->
    <link rel="stylesheet" href="{{ asset('assets/vendor/fonts/fontawesome.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/fonts/tabler-icons.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/fonts/flag-icons.css')}}" />

    <!-- Core CSS -->

    <link rel="stylesheet" href="{{ asset('assets/vendor/css/rtl/core.css')}}" class="template-customizer-core-css" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/css/rtl/theme-default.css')}}" class="template-customizer-theme-css" />

    <link rel="stylesheet" href="{{ asset('assets/css/demo.css')}}" />

    <!-- Vendors CSS -->
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/node-waves/node-waves.css')}}" />

    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/typeahead-js/typeahead.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/apex-charts/apex-charts.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/swiper/swiper.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css')}}" />
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/datatables-checkboxes-jquery/datatables.checkboxes.css')}}" />

    <!-- Page CSS -->
    <link rel="stylesheet" href="{{ asset('assets/vendor/css/pages/cards-advance.css')}}" />
    <link rel="stylesheet" href="{{ asset('css/furnixar-theme.css')}}" />

    <!-- Helpers -->
    <script src="{{ asset('assets/vendor/js/helpers.js')}}"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->

    <!--? Template customizer: To hide customizer set displayCustomizer value false in config.js.  -->
    <script src="{{ asset('assets/vendor/js/template-customizer.js')}}"></script>

    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
    <script src="{{ asset('assets/js/config.js')}}"></script>


    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.css')}}" />

    <!-- Responsive Sidebar / Content CSS -->
    <style>
        /* Smooth transitions for sidebar open/close */
        .layout-menu {
            transition: all .25s ease-in-out;
        }

        .layout-content-navbar .content-wrapper {
            transition: margin-left .25s ease-in-out, padding .25s ease-in-out;
        }

        .layout-overlay {
            transition: opacity .25s ease-in-out, visibility .25s ease-in-out;
        }

        .content-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
        }

        .container-xxl {
            max-width: 100%;
        }

        /* Large screens - sidebar always visible, no overlay */
        @media (min-width: 1200px) {
            .layout-overlay {
                display: none;
            }
        }

        /* Tablet & Mobile - sidebar becomes an off-canvas drawer */
        @media (max-width: 1199.98px) {
            .layout-menu-fixed .layout-page,
            .layout-menu-fixed-offcanvas .layout-page {
                margin-left: 0 !important;
            }

            .layout-menu {
                position: fixed;
                top: 0;
                left: -260px;
                height: 100vh;
                z-index: 1090;
            }

            .layout-menu-expanded .layout-menu {
                left: 0;
            }

            .layout-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, .5);
                z-index: 1080;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            .layout-menu-expanded .layout-overlay {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .content-wrapper {
                padding: 12px !important;
            }

            .container-xxl {
                padding-left: 8px;
                padding-right: 8px;
            }
        }

        /* Small tablets */
        @media (max-width: 767.98px) {
            .content-wrapper {
                padding: 10px !important;
            }

            .card {
                margin-bottom: 12px;
            }

            .table-responsive {
                font-size: 13px;
            }
        }

        /* Phones */
        @media (max-width: 575.98px) {
            .content-wrapper {
                padding: 8px !important;
            }

            .container-xxl {
                padding-left: 4px;
                padding-right: 4px;
            }

            .card-header,
            .card-body {
                padding: 12px !important;
            }

            h1, .h1 { font-size: 1.4rem; }
            h2, .h2 { font-size: 1.2rem; }
            h3, .h3 { font-size: 1.1rem; }

            .table-responsive {
                font-size: 12px;
            }
        }
    </style>

    @stack('styles')
</head>
<script>
    var baseUrl = "{{ url('/') }}";
</script>

<body>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <!-- Menu -->

            <!-- / Menu -->

            @include('layouts.partials.sidebar')
            <!-- Layout container -->
            <div class="layout-page">
                <!-- Navbar -->


                @include('layouts.partials.topbar')
                <!-- / Navbar -->

                <!-- Content wrapper -->
                <div class="content-wrapper">
                    <!-- Content -->

                    <div class="container-xxl container-p-y">
                        @yield('content')
                    </div>
                    <!-- / Content -->

                    <div class="content-backdrop fade"></div>
                </div>
                <!-- Content wrapper -->
            </div>
            <!-- / Layout page -->
        </div>

        <!-- Overlay -->
        <div class="layout-overlay layout-menu-toggle"></div>

        <!-- Drag Target Area To SlideIn Menu On Small Screens -->
        <div class="drag-target"></div>
    </div>
    <!-- / Layout wrapper -->

    <!-- Core JS -->
    <!-- build:js assets/vendor/js/core.js -->

    <script src="{{ asset('assets/vendor/libs/jquery/jquery.js')}}"></script>
    <script src="{{ asset('assets/vendor/libs/popper/popper.js')}}"></script>
    <script src="{{ asset('assets/vendor/js/bootstrap.js')}}"></script>
    <script src="{{ asset('assets/vendor/libs/node-waves/node-waves.js')}}"></script>
    <script src="{{ asset('assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js')}}"></script>
    <script src="{{ asset('assets/vendor/libs/hammer/hammer.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/i18n/i18n.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/typeahead-js/typeahead.js') }}"></script>
    <script src="{{ asset('assets/vendor/js/menu.js') }}"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->
    <script src="{{ asset('assets/vendor/libs/apex-charts/apexcharts.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/swiper/swiper.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js') }}"></script>

    <!-- Main JS -->
    <script src="{{ asset('assets/js/main.js') }}"></script>

    <!-- Page JS -->
    <script src="{{ asset('assets/js/dashboards-analytics.js') }}"></script>
    <script src="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.js')}}"></script>
    <script src="{{ asset('assets/js/extended-ui-sweetalert2.js')}}"></script>

    <!-- Responsive Sidebar Toggle JS -->
    

    @yield('page-script')
    @stack('scripts')
</body>

</html>