<x-guest-layout>
    <!-- Forgot Password Card -->
    <div class="card">
        <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-6">
                <a href="/" class="app-brand-link d-flex align-items-center">
                    <span class="app-brand-logo demo me-2 d-flex align-items-center">
                        <img src="{{ asset('assets/imglogo/logo-sm.png') }}" alt="Nexora Logo" style="height: 34px; width: auto; object-fit: contain;">
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold" style="font-size: 24px;">Nexora</span>
                </a>
            </div>
            <!-- /Logo -->
            <h4 class="mb-1 text-center">Forgot Password? 🔒</h4>
            <p class="mb-6 text-center">Enter your email and we'll send you instructions to reset your password</p>

            <!-- Session Status -->
            @if (session('status'))
                <div class="alert alert-success mb-4" role="alert">
                    {{ session('status') }}
                </div>
            @endif

            <form id="formAuthentication" class="mb-6" action="{{ route('password.email') }}" method="POST">
                @csrf
                <div class="mb-6">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                        type="email"
                        class="form-control @error('email') is-invalid @enderror"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value="{{ old('email') }}"
                        required
                        autofocus />
                    @error('email')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <button class="btn btn-primary d-grid w-100 mb-6" type="submit">Send Reset Link</button>
            </form>

            <div class="text-center">
                <a href="{{ route('login') }}" class="d-flex align-items-center justify-content-center">
                    <i class="ti ti-chevron-left scaleX-n1-rtl me-1-5"></i>
                    Back to login
                </a>
            </div>
        </div>
    </div>
</x-guest-layout>
