const photos = [
  { src: "/8U0A1304.jpg", alt: "Muay Thai training" },
  { src: "/8U0A9902.jpg", alt: "Kids Jiu-Jitsu" },
  { src: "/8U0A0947.jpg", alt: "Muay Thai sparring" },
  { src: "/8U0A9974.jpg", alt: "Kids class" },
  { src: "/gi-bjj-guard.jpg", alt: "Adult Jiu-Jitsu" },
  { src: "/gi-bjj-instruction.jpg", alt: "Instruction" },
];

export default function PhotoBanner() {
  return (
    <section className="bg-black py-6 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {photos.map((photo) => (
            <div key={photo.src} className="aspect-square overflow-hidden rounded-lg">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
