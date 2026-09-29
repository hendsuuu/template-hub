import { Compass } from "lucide-react";
import { buttonClass } from "../lib/buttons";
import { paths } from "../paths";
import { Link } from "../router";

export function NotFoundPage() {
  return (
    <div className="ak-notfound">
      <div className="ak-notfound__box ak-bracketed">
        <span className="ak-notfound__icon" aria-hidden="true">
          <Compass size={20} />
        </span>
        <p className="ak-notfound__code">404</p>
        <p className="ak-notfound__title">This page does not exist</p>
        <p className="ak-notfound__text">The link may be out of date. Everything is still reachable from the menu.</p>
        <Link href={paths.overview()} className={buttonClass("primary", "sm")}>
          Go to the overview
        </Link>
      </div>
    </div>
  );
}
