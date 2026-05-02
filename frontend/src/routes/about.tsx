import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MediSave — Affordable medicines for India" },
      {
        name: "description",
        content:
          "MediSave's mission is to make medicines affordable for 1.4 billion Indians by surfacing the cheapest prices and Jan Aushadhi alternatives.",
      },
      { property: "og:title", content: "About MediSave" },
      { property: "og:description", content: "Making medicines affordable for 1.4 billion Indians." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const stats = [
    { value: "63M+", label: "MSME pharmacies" },
    { value: "₹12,000", label: "Avg. annual savings" },
    { value: "1,759", label: "Generic medicines" },
    { value: "10,000+", label: "Jan Aushadhi stores" },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-10 text-white">
        <h1 className="text-3xl font-bold">About MediSave</h1>
        <p className="mt-2 text-sm opacity-85 leading-relaxed">
          Making medicines affordable for 1.4 billion Indians.
        </p>
      </section>

      <section className="px-4 pt-6">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">Our Mission</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              Medicine prices in India vary wildly — the same strip of Atorvastatin can cost ₹98 at
              one pharmacy and ₹8 at a Jan Aushadhi Kendra just down the road. Most people never
              find out.
            </p>
            <p>
              MediSave puts every price in one place. Search a medicine, and instantly see what
              Apollo, MedPlus, Netmeds and the nearest government-approved generic store charge for
              the exact same drug.
            </p>
            <p>
              We surface generics with the same active salt, flag CDSCO-approved alternatives, and
              guide you to the closest Jan Aushadhi store — so a chronic prescription doesn't drain
              your monthly budget.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold tabular-nums text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-mutedfg">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8 pb-6">
        <div className="rounded-xl bg-primary-light/30 p-5 text-center">
          <div className="text-base font-semibold text-foreground">
            Built with ❤️ in India 🇮🇳
          </div>
          <div className="mt-1 text-sm text-mutedfg">
            By Trikam Devasi — Developer passionate about healthcare accessibility.
          </div>
        </div>
      </section>
    </div>
  );
}
