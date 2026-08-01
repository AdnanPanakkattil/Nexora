<x-guest-layout>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
            --mu-primary: #AD7BC7;
            --mu-primary-dark: #8E50B7;
            --mu-primary-hover: #985DB2;
            --mu-primary-glow: rgba(173, 123, 199, 0.28);
            --mu-primary-soft: rgba(173, 123, 199, 0.12);
            --mu-text: #2F2B3D;
            --mu-muted: #9291A5;
            --mu-border: #E2DDEF;
        }

        /* Reset only html/body to avoid template interference */
        html { box-sizing: border-box; }
        *, *::before, *::after { box-sizing: inherit; }

        html, body {
            height: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #1A1528 !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }

        /* Full-screen shell, escapes template wrappers */
        .nx-login-shell {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: 99999 !important;
            display: flex !important;
            overflow: hidden !important;
        }

        /* ===== LEFT PANEL ===== */
        .nx-left {
            flex: 0 0 50%;
            position: relative;
            overflow: hidden;
            background: linear-gradient(155deg, #1A1528 0%, #2B1A44 50%, #3D1F5C 100%);
            display: flex;
            flex-direction: column;
            padding: 44px 52px;
        }

        .nx-left::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 44px 44px;
            z-index: 0;
            pointer-events: none;
        }

        .nx-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            opacity: 0.30;
            pointer-events: none;
        }
        .nx-blob-1 { width: 400px; height: 400px; background: radial-gradient(#AD7BC7, #5A1A8A); top: -120px; right: -80px; animation: bFloat 9s ease-in-out infinite alternate; }
        .nx-blob-2 { width: 280px; height: 280px; background: radial-gradient(#C89BE0, #7E3FA7); bottom: 60px; left: -50px; animation: bFloat 7s ease-in-out infinite alternate-reverse; }

        @keyframes bFloat {
            from { transform: translate(0, 0) scale(1); }
            to   { transform: translate(18px, 28px) scale(1.07); }
        }

        .nx-left-inner {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        /* Brand */
        .nx-brand {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: auto;
        }

        .nx-brand-icon {
            width: 46px;
            height: 46px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.16);
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .nx-brand-icon img {
            height: 26px;
            width: auto;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }

        .nx-brand-name {
            font-size: 20px;
            font-weight: 800;
            color: #fff;
            line-height: 1.2;
            letter-spacing: -0.3px;
        }

        .nx-brand-tag {
            font-size: 11.5px;
            color: rgba(255,255,255,0.50);
            font-weight: 400;
            margin-top: 1px;
        }

        /* Center block */
        .nx-center {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2.5rem 0;
        }

        .nx-pill {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(173,123,199,0.20);
            border: 1px solid rgba(173,123,199,0.40);
            border-radius: 100px;
            padding: 5px 14px;
            font-size: 12px;
            font-weight: 600;
            color: #E4BAF5;
            margin-bottom: 22px;
            width: max-content;
        }

        .nx-pill i { font-size: 13px; }

        .nx-h1 {
            font-size: clamp(2rem, 3.2vw, 2.75rem);
            font-weight: 900;
            color: #fff;
            line-height: 1.14;
            letter-spacing: -1px;
            margin-bottom: 18px;
        }

        .nx-h1 span {
            background: linear-gradient(135deg, #E4BAF5, #AD7BC7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nx-desc {
            font-size: 15px;
            color: rgba(255,255,255,0.55);
            line-height: 1.65;
            max-width: 370px;
            margin-bottom: 36px;
        }

        /* Feature cards */
        .nx-features { display: flex; flex-direction: column; gap: 12px; }

        .nx-feat {
            display: flex;
            align-items: center;
            gap: 14px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 14px;
            padding: 14px 18px;
            transition: background 0.22s, border-color 0.22s;
        }

        .nx-feat:hover {
            background: rgba(255,255,255,0.09);
            border-color: rgba(173,123,199,0.35);
        }

        .nx-feat-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            background: rgba(173,123,199,0.22);
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #E4BAF5;
        }

        .nx-feat-name {
            font-size: 13.5px;
            font-weight: 700;
            color: rgba(255,255,255,0.90);
            margin-bottom: 2px;
        }

        .nx-feat-sub {
            font-size: 12px;
            color: rgba(255,255,255,0.46);
        }

        /* Stats */
        .nx-stats {
            display: flex;
            gap: 2rem;
            padding-top: 24px;
            border-top: 1px solid rgba(255,255,255,0.08);
            margin-top: auto;
        }

        .nx-stat-val {
            font-size: 22px;
            font-weight: 800;
            color: #fff;
            letter-spacing: -0.5px;
            line-height: 1;
        }

        .nx-stat-lbl {
            font-size: 12px;
            color: rgba(255,255,255,0.46);
            margin-top: 4px;
        }

        /* ===== RIGHT PANEL ===== */
        .nx-right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: #F9F8FC;
            overflow-y: auto;
            position: relative;
        }

        .nx-right::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse at 75% 15%, rgba(173,123,199,0.10) 0%, transparent 55%),
                radial-gradient(ellipse at 25% 85%, rgba(173,123,199,0.07) 0%, transparent 45%);
            pointer-events: none;
        }

        .nx-form-card {
            width: 100%;
            max-width: 420px;
            position: relative;
            z-index: 1;
            animation: fadeSlideUp 0.4s ease both;
        }

        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Top badge */
        .nx-secure-badge {
            display: flex;
            justify-content: center;
            margin-bottom: 28px;
        }

        .nx-secure-badge-inner {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: var(--mu-primary-soft);
            border: 1px solid rgba(173,123,199,0.28);
            border-radius: 100px;
            padding: 6px 16px;
            font-size: 12.5px;
            font-weight: 600;
            color: var(--mu-primary-dark);
        }

        .nx-form-title {
            text-align: center;
            margin-bottom: 32px;
        }

        .nx-form-title h2 {
            font-size: 27px;
            font-weight: 800;
            color: var(--mu-text);
            letter-spacing: -0.5px;
            margin-bottom: 7px;
        }

        .nx-form-title p {
            font-size: 14px;
            color: var(--mu-muted);
        }

        /* Status alert */
        .nx-status {
            background: #F0FDF4;
            border: 1px solid #86EFAC;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13.5px;
            color: #15803D;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Field */
        .nx-field { margin-bottom: 18px; }

        .nx-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #4B465C;
            margin-bottom: 8px;
        }

        .nx-label-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .nx-label-row .nx-label { margin-bottom: 0; }

        .nx-forgot {
            font-size: 12.5px;
            font-weight: 600;
            color: var(--mu-primary);
            text-decoration: none;
            transition: color 0.2s;
        }

        .nx-forgot:hover { color: var(--mu-primary-dark); text-decoration: underline; }

        .nx-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }

        .nx-input-icon-l {
            position: absolute;
            left: 14px;
            font-size: 17px;
            color: #C0BDCA;
            pointer-events: none;
            z-index: 2;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .nx-input-icon-r {
            position: absolute;
            right: 14px;
            font-size: 17px;
            color: #C0BDCA;
            cursor: pointer;
            z-index: 2;
            display: flex;
            align-items: center;
            transition: color 0.2s;
            user-select: none;
        }

        .nx-input-icon-r:hover { color: var(--mu-text); }

        .nx-input {
            width: 100%;
            height: 50px;
            padding: 0 46px;
            border: 1.5px solid var(--mu-border);
            border-radius: 11px;
            font-size: 14.5px;
            font-weight: 500;
            color: var(--mu-text);
            background: #FFFFFF;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .nx-input::placeholder { color: #C8C5D3; font-weight: 400; }

        .nx-input:focus {
            border-color: var(--mu-primary);
            box-shadow: 0 0 0 4px var(--mu-primary-glow);
        }

        .nx-input:focus ~ .nx-input-icon-l,
        .nx-input-wrap:focus-within .nx-input-icon-l { color: var(--mu-primary); }

        .nx-input.is-invalid { border-color: #FF4C51; box-shadow: 0 0 0 3px rgba(255,76,81,0.12); }

        .nx-error {
            font-size: 12.5px;
            color: #FF4C51;
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Remember */
        .nx-remember {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 22px;
        }

        .nx-check {
            position: relative;
            width: 18px;
            height: 18px;
            flex-shrink: 0;
        }

        .nx-check input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 1.5px solid var(--mu-border);
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            margin: 0;
            padding: 0;
            transition: all 0.18s;
        }

        .nx-check input[type="checkbox"]:checked {
            background: var(--mu-primary);
            border-color: var(--mu-primary);
        }

        .nx-check input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            left: 5.5px;
            top: 2.5px;
            width: 5.5px;
            height: 9px;
            border: 2px solid #fff;
            border-top: none;
            border-left: none;
            transform: rotate(45deg);
        }

        .nx-remember-lbl {
            font-size: 13.5px;
            color: #5D596C;
            cursor: pointer;
            user-select: none;
        }

        /* Submit btn */
        .nx-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            height: 52px;
            background: linear-gradient(135deg, #B682CF 0%, #8E50B7 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 15.5px;
            font-weight: 700;
            font-family: inherit;
            letter-spacing: 0.2px;
            cursor: pointer;
            box-shadow: 0 6px 22px rgba(142,80,183,0.42);
            transition: all 0.22s ease;
            margin-bottom: 22px;
        }

        .nx-btn:hover {
            background: linear-gradient(135deg, #A56DC0 0%, #7E3FA7 100%);
            box-shadow: 0 8px 30px rgba(142,80,183,0.52);
            transform: translateY(-2px);
        }

        .nx-btn:active { transform: translateY(0); box-shadow: 0 4px 14px rgba(142,80,183,0.35); }

        /* Divider */
        .nx-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
        }

        .nx-divider-line { flex: 1; height: 1px; background: var(--mu-border); }

        .nx-divider span {
            font-size: 12px;
            color: var(--mu-muted);
            white-space: nowrap;
            font-weight: 500;
        }

        /* Social */
        .nx-social {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 24px;
        }

        .nx-social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            height: 46px;
            border: 1.5px solid var(--mu-border);
            border-radius: 10px;
            background: #fff;
            font-size: 13px;
            font-weight: 600;
            color: #4B465C;
            font-family: inherit;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
        }

        .nx-social-btn:hover {
            background: #F5F2FC;
            border-color: rgba(173,123,199,0.38);
            color: var(--mu-text);
            transform: translateY(-2px);
            box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }

        .nx-social-btn:active { transform: translateY(0); }

        /* Footer */
        .nx-footer-txt {
            text-align: center;
            font-size: 13.5px;
            color: var(--mu-muted);
        }

        .nx-footer-txt a {
            color: var(--mu-primary);
            font-weight: 700;
            text-decoration: none;
            transition: color 0.2s;
        }

        .nx-footer-txt a:hover { color: var(--mu-primary-dark); text-decoration: underline; }

        @media (max-width: 992px) {
            .nx-left { display: none; }
            .nx-right { background: #fff; }
        }
    </style>

    <div class="nx-login-shell">

        <!-- ===== LEFT PANEL ===== -->
        <div class="nx-left">
            <div class="nx-blob nx-blob-1"></div>
            <div class="nx-blob nx-blob-2"></div>

            <div class="nx-left-inner">
                <!-- Brand -->
                <div class="nx-brand">
                    <div class="nx-brand-icon">
                        <img src="{{ asset('assets/imglogo/logo.png') }}" alt="Nexora">
                    </div>
                    <div>
                        <div class="nx-brand-name">Nexora</div>
                        <div class="nx-brand-tag">Smart Dashboard & Commerce</div>
                    </div>
                </div>

                <!-- Center content -->
                <div class="nx-center">
                    <div class="nx-pill">
                        <i class="ti ti-sparkles"></i>
                        Trusted by thousands
                    </div>

                    <h1 class="nx-h1">
                        Your all-in-one<br>
                        <span>commerce platform</span>
                    </h1>

                    <p class="nx-desc">
                        Manage products, orders, and customers seamlessly. Sign in to unlock your complete dashboard experience.
                    </p>

                    <div class="nx-features">
                        <div class="nx-feat">
                            <div class="nx-feat-icon"><i class="ti ti-shopping-bag"></i></div>
                            <div>
                                <div class="nx-feat-name">Millions of Products</div>
                                <div class="nx-feat-sub">Find everything you need in one place</div>
                            </div>
                        </div>

                        <div class="nx-feat">
                            <div class="nx-feat-icon"><i class="ti ti-shield-check"></i></div>
                            <div>
                                <div class="nx-feat-name">Secure & Reliable</div>
                                <div class="nx-feat-sub">Your data and payments are always protected</div>
                            </div>
                        </div>

                        <div class="nx-feat">
                            <div class="nx-feat-icon"><i class="ti ti-bolt"></i></div>
                            <div>
                                <div class="nx-feat-name">Lightning Fast</div>
                                <div class="nx-feat-sub">Optimized for speed and performance</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="nx-stats">
                    <div>
                        <div class="nx-stat-val">50K+</div>
                        <div class="nx-stat-lbl">Active Users</div>
                    </div>
                    <div>
                        <div class="nx-stat-val">99.9%</div>
                        <div class="nx-stat-lbl">Uptime SLA</div>
                    </div>
                    <div>
                        <div class="nx-stat-val">4.9 ★</div>
                        <div class="nx-stat-lbl">User Rating</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== RIGHT PANEL ===== -->
        <div class="nx-right">
            <div class="nx-form-card">

                <!-- Secure badge -->
                <div class="nx-secure-badge">
                    <div class="nx-secure-badge-inner">
                        <i class="ti ti-lock" style="font-size:13px;"></i>
                        Secure Login
                    </div>
                </div>

                <!-- Title -->
                <div class="nx-form-title">
                    <h2>Welcome Back! 👋</h2>
                    <p>Sign in to your Nexora account to continue</p>
                </div>

                <!-- Status -->
                @if (session('status'))
                    <div class="nx-status">
                        <i class="ti ti-circle-check" style="font-size:16px;"></i>
                        {{ session('status') }}
                    </div>
                @endif

                <!-- Form -->
                <form id="formAuthentication" action="{{ route('login') }}" method="POST">
                    @csrf

                    <!-- Username -->
                     <div class="mb-6">
                    <label for="email" class="form-label">Email Address</label>
                    
                    <input
                        type="email"
                        class="nx-input @error('email') is-invalid @enderror"
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

                    <!-- Password -->
                    <div class="nx-field">
                        <div class="nx-label-row">
                            <label for="password" class="nx-label">Password</label>
                            @if (Route::has('password.request'))
                                <a href="{{ route('password.request') }}" class="nx-forgot">Forgot password?</a>
                            @endif
                        </div>
                        <div class="nx-input-wrap">
                            <i class="ti ti-lock nx-input-icon-l"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="nx-input @error('password') is-invalid @enderror"
                                placeholder="Enter your password"
                                required />
                            <span class="nx-input-icon-r" id="togglePasswordBtn" role="button" aria-label="Toggle password">
                                <i class="ti ti-eye-off" id="togglePasswordIcon"></i>
                            </span>
                        </div>
                        @error('password')
                            <div class="nx-error">
                                <i class="ti ti-alert-circle" style="font-size:13px;"></i>
                                {{ $message }}
                            </div>
                        @enderror
                    </div>

                    <!-- Remember me -->
                    <div class="nx-remember">
                        <label class="nx-check">
                            <input type="checkbox" id="remember-me" name="remember" />
                        </label>
                        <label class="nx-remember-lbl" for="remember-me">Keep me signed in</label>
                    </div>

                    <!-- Submit -->
                    <button class="nx-btn" type="submit">
                        <span>Sign in to Nexora</span>
                        <i class="ti ti-arrow-right" style="font-size:18px;"></i>
                    </button>
                </form>

                <!-- Divider -->
                <div class="nx-divider">
                    <div class="nx-divider-line"></div>
                    <span>or continue with</span>
                    <div class="nx-divider-line"></div>
                </div>

                <!-- Social -->
                <div class="nx-social">
                    <button type="button" class="nx-social-btn">
                        <svg width="17" height="17" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        Google
                    </button>
                    <button type="button" class="nx-social-btn">
                        <svg width="17" height="17" viewBox="0 0 23 23">
                            <path fill="#f35325" d="M1 1h10v10H1z"/>
                            <path fill="#81bc06" d="M12 1h10v10H12z"/>
                            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                            <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        Microsoft
                    </button>
                </div>

                <!-- Footer -->
                <p class="nx-footer-txt">
                    New to Nexora? <a href="{{ route('register') }}">Create a free account</a>
                </p>

            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const btn = document.getElementById('togglePasswordBtn');
            const inp = document.getElementById('password');
            const ico = document.getElementById('togglePasswordIcon');
            if (btn && inp && ico) {
                btn.addEventListener('click', function () {
                    const hidden = inp.type === 'password';
                    inp.type = hidden ? 'text' : 'password';
                    ico.className = hidden ? 'ti ti-eye' : 'ti ti-eye-off';
                });
            }
        });
    </script>
</x-guest-layout>
