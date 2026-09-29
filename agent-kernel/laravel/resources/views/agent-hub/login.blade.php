{{-- The sign-in screen. The form only moves on to the overview: its inputs have no names, so nothing lands in the address. Replace it with your own sign-in. --}}
<x-layouts.base title="Sign in · Agent hub">
    <main class="ak-login">
        <div class="ak-login__card ak-bracketed">
            <p class="ak-login__product"><span class="ak-sidebar__mark" aria-hidden="true"><x-ak.icon name="waypoints" /></span>Agent hub</p>
            <h1 class="ak-login__title">Sign in</h1>
            <p class="ak-login__lede">Use the account your operator set up for you.</p>
            <form class="ak-login__form" action="/" method="get">
                <div class="ak-field">
                    <label for="login-email" class="ak-field__label">Email</label>
                    <input id="login-email" type="email" autocomplete="username" inputmode="email" required class="ak-field__input">
                </div>
                <div class="ak-field">
                    <label for="login-password" class="ak-field__label">Password</label>
                    <input id="login-password" type="password" autocomplete="current-password" required class="ak-field__input">
                </div>
                <p class="ak-login__message" aria-live="polite"></p>
                <button type="submit" class="ak-btn ak-btn--primary ak-login__submit">Sign in</button>
            </form>
            <p class="ak-login__foot">Need access? Ask the operator who runs your hub.</p>
        </div>
    </main>
</x-layouts.base>
