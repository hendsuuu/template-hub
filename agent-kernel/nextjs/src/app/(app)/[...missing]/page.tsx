import { notFound } from "next/navigation";

/** Any other address under the template shows its not-found page inside the shell. */
export default function Page() {
  notFound();
}
