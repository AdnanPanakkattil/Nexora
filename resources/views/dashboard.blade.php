@extends('layouts.backendlayouts')
@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush
<div class="">
    <h1>dashbord</h1>
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