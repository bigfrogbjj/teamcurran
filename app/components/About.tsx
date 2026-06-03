export default function About() {
  return (
    <section id="about" className="bg-gray-950 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Photo placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-800 border border-blue-900/40">
              <img
                src="https://export-download.canva.com/10b81ac2-9fd1-4cd4-b0db-315e90dbfac3/0/0009-1926920012282008426.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260603T092434Z&X-Amz-Expires=35891&X-Amz-Signature=ac1ae186d34d9a971f13f4af3811263d2d15ebe54abc1ccb171141c9d3c0237c&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Wed%2C%2003%20Jun%202026%2019%3A22%3A45%20GMT"
                alt="Professor Jeff Curran"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Accent badge */}
            <div className="absolute -bottom-6 -right-6 bg-brand text-white px-6 py-4 rounded text-center shadow-xl">
              <div className="text-3xl font-black">4th°</div>
              <div className="text-xs uppercase tracking-widest font-bold">Black Belt</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-3">
              About the Professor
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase leading-tight mb-6">
              Jeff <span className="text-brand">Curran</span>
            </h2>
            <div className="w-16 h-1 bg-brand mb-8" />

            <p className="text-gray-300 leading-relaxed mb-4">
              Professor Jeff Curran is a 4th Degree Black Belt under the legendary{" "}
              <strong className="text-white">Master Pedro Sauer</strong>, and one of the most
              accomplished martial artists in the world. With over{" "}
              <strong className="text-white">27 years of competitive martial arts experience</strong>,
              Jeff founded his first school in 1997 and has since built a globally recognized team.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              A former professional MMA fighter and dedicated Jiu-Jitsu competitor, Professor
              Curran has devoted his life to the art — developing programs recognized both locally
              and around the world, grounded in ethical and moral development alongside technical mastery.
            </p>
            <p className="text-gray-400 italic leading-relaxed mb-8">
              "The hardest part about starting training in any martial art is that first step
              through the academy door." — Jeff Curran
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {[
                "Pedro Sauer Association",
                "27+ Years Experience",
                "Gracie Jiu-Jitsu",
                "MMA Veteran",
              ].map((badge) => (
                <span
                  key={badge}
                  className="bg-gray-800 border border-blue-900/50 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
