<x-guest-layout>
    <!-- Reset Password Card -->
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
            <h4 class="mb-1 text-center">Reset Password 🔒</h4>
            <p class="mb-6 text-center">Enter your email and choose a new secure password</p>

            <form id="formAuthentication" class="mb-6" action="{{ route('password.store') }}" method="POST">
                @csrf

                <!-- Password Reset Token -->
                <input type="hidden" name="token" value="{{ $request->route('token') }}">

                <div class="mb-6">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                        type="email"
                        class="form-control @error('email') is-invalid @enderror"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value="{{ old('email', $request->email) }}"
                        required
                        autofocus />
                    @error('email')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="mb-6 form-password-toggle">
                    <label class="form-label" for="password">New Password</label>
                    <div class="input-group input-group-merge">
                        <input
                            type="password"
                            id="password"
                            class="form-control @error('password') is-invalid @enderror"
                            name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password"
                            required />
                        <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
                        @error('password')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                <div class="mb-6 form-password-toggle">
                    <label class="form-label" for="password_confirmation">Confirm Password</label>
                    <div class="input-group input-group-merge">
                        <input
                            type="password"
                            id="password_confirmation"
                            class="form-control @error('password_confirmation') is-invalid @enderror"
                            name="password_confirmation"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password_confirmation"
                            required />
                        <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
                        @error('password_confirmation')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>
                </div>

                <button class="btn btn-primary d-grid w-100" type="submit">Reset Password</button>
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
