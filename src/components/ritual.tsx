import { ContentImage } from "@/components/ui/content-image";
import { Reveal } from "@/components/reveal";

const steps = [
  {
    num: "01",
    title: "Одна капля",
    text: "Сыворотка AM густая — одной капли достаточно на всё лицо.",
  },
  {
    num: "02",
    title: "Ладони",
    text: "Согрейте между ладонями. Текстура станет шёлком.",
  },
  {
    num: "03",
    title: "Тишина",
    text: "Нанесите и дайте формуле впитаться. Не трогайте кожу.",
  },
];

export function Ritual() {
  return (
    <section id="ritual" className="border-t border-border/80">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <p className="label-caps">Ритуал</p>
            <h2 className="font-display mt-4 text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight">
              Три шага
              <br />
              <span className="italic text-[var(--copper)]">к коже</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-0">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={0.06 * (i + 1)}>
                <div className="group flex gap-5 border border-border/80 bg-secondary/30 p-5 transition-colors hover:border-[var(--copper)]/30 hover:bg-secondary/50 lg:border-0 lg:border-t lg:border-border lg:bg-transparent lg:p-0 lg:py-8 lg:first:border-t-0 lg:first:pt-0">
                  <div className="step-ring shrink-0">{step.num}</div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-[1.8] text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="relative min-h-[380px] lg:min-h-[640px]">
          <ContentImage
            src="/images/peptide-v2.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/30 to-transparent" />
          <blockquote className="absolute right-6 bottom-8 left-6 max-w-sm border-l border-[var(--copper)] pl-5 md:right-10 md:bottom-12 md:left-auto">
            <p className="font-display text-xl italic leading-snug text-foreground/90 md:text-2xl">
              «Формула работает, когда вы перестаёте её трогать»
            </p>
          </blockquote>
        </Reveal>
      </div>

      <div id="story" className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[1.2fr_1fr] md:px-10 md:py-24">
          <Reveal>
            <p className="label-caps">О бренде</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-tight tracking-tight">
              Ателье,
              <br />
              а не конвейер
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm leading-[1.9] text-muted-foreground md:text-[15px] md:pt-8">
              AM Beauty — малые партии, стекло, формулы без лишнего. Каждая позиция
              существует, потому что ей есть место в вашем ритуале. Доставка от 7 500 ₽
              бесплатно.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
