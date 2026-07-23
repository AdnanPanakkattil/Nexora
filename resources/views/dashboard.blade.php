@extends('layouts.backendlayouts')
@section('content')
@push('styles')
<link rel="stylesheet" href="{{ asset('page-css/patient.css') }}">
@endpush


<div class="d-flex justify-content-center align-items-center ">
    <div class="">
        <h2 class="text-center">Comming Sooon...!!!</h2>
    </div>
</div>

@endsection
@push('scripts')
<script src="{{ asset('page-js/dashboard-charts.js') }}"></script>
@endpush

