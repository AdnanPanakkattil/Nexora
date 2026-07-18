<x-guest-layout>
    <!-- Register Card -->
    <div class="card">
        <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-6">
                <a href="/" class="app-brand-link">
                    <span class="app-brand-logo demo">
                        <img src="{{ asset('assets/imglogo/logo-sm.png') }}" alt="Nexora Logo" height="24px">
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold ms-2">Nexora</span>
                </a>
            </div>
            <!-- /Logo -->
            <h4 class="mb-1 text-center">Welcome to Nexora! 👋</h4>
            <p class="mb-6 text-center">Please sign-in to your account to access the dashboard</p>

            <!-- Session Status -->
            @if (session('status'))
                <div class="alert alert-success mb-4" role="alert">
                    {{ session('status') }}
                </div>
            @endif

            <form id="formAuthentication" class="mb-6" action="{{ route('login') }}" method="POST">
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
                <div class="mb-6 form-password-toggle">
                    <div class="d-flex justify-content-between">
                        <label class="form-label" for="password">Password</label>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}">
                                <small>Forgot Password?</small>
                            </a>
                        @endif
                    </div>
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
                <div class="mb-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember-me" name="remember" />
                        <label class="form-check-label" for="remember-me"> Remember Me </label>
                    </div>
                </div>
                <div class="mb-6">
                    <button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                </div>
            </form>

            <p class="text-center">
                <span>New on our platform?</span>
                <a href="{{ route('register') }}">
                    <span>Create an account</span>
                </a>
            </p>
        </div>
    </div>
</x-guest-layout>
