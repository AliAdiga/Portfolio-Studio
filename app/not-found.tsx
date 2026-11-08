import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-32">
      <h1 className="display text-[clamp(3rem,8vw,7rem)]">
        Page not <em>found</em>
      </h1>
      <p className="lede mt-6">That page does not exist. The work and the contact form are one click away.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/#work" className="btn btn-primary">
          Explore my work
        </Link>
        <Link href="/#contact" className="btn btn-ghost">
          Discuss a project
        </Link>
      </div>
    </section>
  );
}
