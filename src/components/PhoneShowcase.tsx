import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import videoOne from "@/assets/ProductVideos/meghdoot1.mp4";
import videoTwo from "@/assets/ProductVideos/Meghdoot2.mp4";
import videoThree from "@/assets/ProductVideos/meghdoot3.mp4";

const PhoneShowcase = () => {
  const navigate = useNavigate();
  
  const phoneVideos = [
    {
      src: videoOne,
      title: "Saree Collection",
      glow: "from-rose-400/40 via-amber-300/20 to-transparent",
      className: "lg:-translate-x-16 lg:translate-y-8 lg:-rotate-3 lg:scale-[0.95] shadow-[0_30px_80px_rgba(244,114,182,0.25)]",
    },
    {
      src: videoTwo,
      title: "Studio Showcase",
      glow: "from-violet-400/40 via-indigo-500/25 to-transparent",
      className: "z-20 lg:-translate-y-4 lg:scale-105 shadow-[0_40px_120px_rgba(165,180,252,0.35)]",
    },
    {
      src: videoThree,
      title: "Detail Close-ups",
      glow: "from-emerald-400/40 via-sky-300/25 to-transparent",
      className: "lg:translate-x-16 lg:translate-y-10 lg:rotate-3 lg:scale-[0.95] shadow-[0_30px_90px_rgba(94,234,212,0.28)]",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-section-title text-primary mb-4">
            Experience Our Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Watch our premium ethnic wear in action. See the quality, feel the elegance, 
            and discover why retailers choose Meghdoot Textiles.
          </p>
        </div>

        {/* Phone Showcase */}
        <div className="relative flex items-center justify-center">
          {/* Background glow effect */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-32 rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-60 blur-3xl"
          />
          
          <div className="relative flex w-full max-w-5xl flex-col items-center gap-12 sm:gap-16 lg:flex-row lg:justify-center lg:gap-8">
            {phoneVideos.map((phone, index) => (
              <div
                key={phone.src}
                className={cn(
                  "group relative aspect-[9/19.5] w-[280px] overflow-hidden rounded-[48px] border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl transition-all duration-700 ease-out hover:scale-105 sm:w-[320px] lg:w-[340px]",
                  phone.className
                )}
              >
                {/* Glow effect */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -inset-[20px] rounded-[60px] bg-gradient-to-br opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-90",
                    phone.glow
                  )}
                />
                
                {/* Phone frame */}
                <div className="relative z-10 m-3 flex h-[calc(100%-24px)] flex-col overflow-hidden rounded-[40px] bg-slate-950/95 shadow-[0_25px_70px_rgba(15,23,42,0.45)] ring-1 ring-white/20">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-4 h-2 w-20 -translate-x-1/2 rounded-full bg-white/30" />
                  
                  {/* Side button */}
                  <div className="absolute right-2 top-[45%] h-24 w-1 -translate-y-1/2 rounded-full bg-white/20" />
                  
                  {/* Video content */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                  >
                    <source src={phone.src} type="video/mp4" />
                  </video>
                  
                  {/* Video overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                
                {/* Outer border */}
                <div className="absolute inset-0 rounded-[48px] border border-white/10" />
                
                {/* Title badge */}
                <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
                  <div className="rounded-full bg-white/15 px-6 py-2 backdrop-blur-sm border border-white/20">
                    <span className="text-sm font-medium text-white/90 tracking-wide">
                      {phone.title}
                    </span>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-[48px] bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Ready to see more? Explore our complete collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/catalogs')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View Full Catalog
            </button>
            <button 
              onClick={() => navigate('/contact?category=samples&subject=Sample Request')}
              className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              Request Samples
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhoneShowcase;
