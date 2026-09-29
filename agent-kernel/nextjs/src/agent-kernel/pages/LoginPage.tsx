"use client";

import { Waypoints } from "lucide-react";
import { buttonClass } from "../lib/buttons";
import { paths } from "../paths";
import { useNavigate } from "../router";

/**
 * The sign-in screen. Accounts are made by an operator, so there is no sign-up
 * or password reset here. The template only moves on to the overview:
 * replace the submit handler with your own authentication.
 */
export function LoginPage() {
  const navigate = useNavigate();
  return (
    <main className="ak-login">
      <div className="ak-login__card ak-bracketed">
        <p className="ak-login__product">
          {/* Placeholder mark: put your approved logo here, at the same size. */}
          <span className="ak-sidebar__mark" aria-hidden="true">
            <Waypoints size={16} />
          </span>
          Agent hub
        </p>
        <h1 className="ak-login__title">Sign in</h1>
        <p className="ak-login__lede">Use the account your operator set up for you.</p>

        <form
          className="ak-login__form"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(paths.overview());
          }}
        >
          <div className="ak-field">
            <label htmlFor="login-email" className="ak-field__label">
              Email
            </label>
            <input id="login-email" name="email" type="email" autoComplete="username" inputMode="email" required className="ak-field__input" />
          </div>
          <div className="ak-field">
            <label htmlFor="login-password" className="ak-field__label">
              Password
            </label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" required className="ak-field__input" />
          </div>
          <p className="ak-login__message" aria-live="polite" />
          <button type="submit" className={`${buttonClass("primary")} ak-login__submit`}>
            Sign in
          </button>
        </form>
        <p className="ak-login__foot">Need access? Ask the operator who runs your hub.</p>
      </div>
    </main>
  );
}
