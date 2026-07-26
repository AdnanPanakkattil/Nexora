<x-guest-layout>
    <!-- Register Card -->
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
            <h4 class="mb-1 text-center">Adventure starts here 🚀</h4>
            <p class="mb-6 text-center">Create an account to start managing your platform</p>

            <form id="formAuthentication" class="mb-6" action="{{ route('register') }}" method="POST">
                @csrf
                <div class="mb-6">
                    <label for="name" class="form-label">Full Name</label>
                    <input
                        type="text"
                        class="form-control @error('name') is-invalid @enderror"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value="{{ old('name') }}"
                        required
                        autofocus />
                    @error('name')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <div class="mb-6">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                        type="email"
                        class="form-control @error('email') is-invalid @enderror"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value="{{ old('email') }}"
                        required />
                    @error('email')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <div class="mb-6 form-password-toggle">
                    <label class="form-label" for="password">Password</label>
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
                <button class="btn btn-primary d-grid w-100 mb-6" type="submit">Sign up</button>
            </form>

            <p class="text-center">
                <span>Already have an account?</span>
                <a href="{{ route('login') }}">
                    <span>Sign in instead</span>
                </a>
            </p>
        </div>
    </div>
</x-guest-layout>
