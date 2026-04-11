import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Lock,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ensureTrialStarted,
  getAccessPhase,
  getTrialDaysLeftLabel,
  type AccessPhase,
} from "@/lib/access";

type DisplayTier = "trial" | "subscriber" | "premium";

export type Pack = {
  title: string;
  description: string;
  tier: DisplayTier;
  coverImage: string;
  images?: string[];
};

export type ReferenceSection = {
  style: string;
  packs: Pack[];
};

type ViewerPack = {
  style: string;
  title: string;
  description: string;
  images: string[];
};

const referenceData: ReferenceSection[] = [
  {
    style: "Fine Line",
    packs: [
      {
        title: "Starter Fine Line Set",
        description:
          "Clean minimal references focused on elegance, spacing, and delicate readability.",
        tier: "trial",
        coverImage: "/images/reference/fineline/fineline-cover.png",
        images: [
          "/images/reference/fineline/fine-line-starter-pk-sht-1.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-2.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-3.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-4.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-5.png",
        ],
      },
    ],
  },
  {
    style: "Blackwork",
    packs: [
      {
        title: "Starter Blackwork Set",
        description:
          "Foundational blackwork references focused on shape, contrast, spacing, and readable beginner compositions.",
        tier: "trial",
        coverImage: "/images/reference/blackwork/blackwork-cover-img.png",
        images: [
          "/images/reference/blackwork/black-work-starter-pk-sh-1.png",
          "/images/reference/blackwork/black-work-starter-pk-sh-2.png",
          "/images/reference/blackwork/black-work-starter-pk-sh-3.png",
          "/images/reference/blackwork/black-work-starter-pk-sh-4.png",
          "/images/reference/blackwork/black-work-starter-pk-sh-5.png",
        ],
      },
    ],
  },
  {
    style: "Traditional",
    packs: [
      {
        title: "Starter Traditional Set",
        description:
          "Core traditional designs for stronger silhouette reading, classic structure, and clean beginner fundamentals.",
        tier: "subscriber",
        coverImage: "/images/reference/traditional/traditional-cover.png",
        images: [
          "/images/reference/traditional/trad-starter-pk-sh-1.png",
          "/images/reference/traditional/trad-starter-pk-sh-2.png",
          "/images/reference/traditional/trad-starter-pk-sh-3.png",
          "/images/reference/traditional/trad-starter-pk-sh-4.png",
          "/images/reference/traditional/trad-starter-pk-sh-5.png",
        ],
      },
    ],
  },
  {
    style: "Lettering",
    packs: [
      {
        title: "Starter Lettering Set",
        description:
          "Lettering references for studying flow, spacing, readability, and cleaner tattoo-ready word structure.",
        tier: "subscriber",
        coverImage: "/images/reference/lettering/letter-cover.png",
        images: [
          "/images/reference/lettering/letter-starter-sht-1.png",
          "/images/reference/lettering/letter-starter-sht-2.png",
          "/images/reference/lettering/letter-starter-sht-3.png",
          "/images/reference/lettering/letter-starter-sht-4.png",
          "/images/reference/lettering/letter-starter-sht-5.png",
        ],
      },
    ],
  },
  {
    style: "Black & Grey",
    packs: [
      {
        title: "Black & Grey Reference Pack",
        description:
          "Value control, softness, patience, observation, and stronger rendering discipline.",
        tier: "premium",
        coverImage: "/images/reference/black-grey/black&grey-cover.png",
      },
    ],
  },
  {
    style: "Japanese",
    packs: [
      {
        title: "Japanese Reference Pack",
        description:
          "Flow, movement, motif discipline, and stronger large-form composition thinking.",
        tier: "premium",
        coverImage: "/images/reference/japanese/jap-trad-cover.png",
      },
    ],
  },
  {
    style: "Chicano",
    packs: [
      {
        title: "Chicano Reference Pack",
        description:
          "Lettering rhythm, black-and-grey storytelling, and respect for stylistic identity.",
        tier: "premium",
        coverImage: "/images/reference/chicano/chicano-cover.png",
      },
    ],
  },
  {
    style: "Japanese Realism",
    packs: [
      {
        title: "Japanese Realism Reference Pack",
        description:
          "Advanced realism control mixed with movement, motif structure, and storytelling flow.",
        tier: "premium",
        coverImage:
          "/images/reference/japanese-realism/japanese-realism-cover.png",
      },
    ],
  },
  {
    style: "Geometric",
    packs: [
      {
        title: "Geometric Reference Pack",
        description:
          "Precision, repeatability, symmetry, spacing, and measured visual structure.",
        tier: "premium",
        coverImage: "/images/reference/geometric/geometric-cover.png",
      },
    ],
  },
  {
    style: "Biomechanical",
    packs: [
      {
        title: "Biomechanical Reference Pack",
        description:
          "Complex construction, texture logic, and advanced form-building discipline.",
        tier: "premium",
        coverImage: "/images/reference/biomechanical/biomechanical-cover.png",
      },
    ],
  },
  {
    style: "Polynesian",
    packs: [
      {
        title: "Polynesian Reference Pack",
        description:
          "Pattern discipline, placement structure, and cultural respect in design study.",
        tier: "premium",
        coverImage: "/images/reference/polynesian/polynesian-cover.png",
      },
    ],
  },
  {
    style: "Color Realism",
    packs: [
      {
        title: "Color Realism Reference Pack",
        description:
          "Advanced color control, value relationships, rendering accuracy, and patience.",
        tier: "premium",
        coverImage: "/images/reference/color-realism/color-realism-cover.png",
      },
    ],
  },
  {
    style: "Surrealism",
    packs: [
      {
        title: "Surrealism Reference Pack",
        description:
          "Concept-driven imagery, symbolism, imagination, and unusual composition thinking.",
        tier: "premium",
        coverImage: "/images/reference/surrealism/surrealism-cover.png",
      },
    ],
  },
  {
    style: "Watercolor",
    packs: [
      {
        title: "Watercolor Reference Pack",
        description:
          "Soft transitions, painterly movement, restraint, and controlled visual flow.",
        tier: "premium",
        coverImage: "/images/reference/watercolor/watercolor-cover.png",
      },
    ],
  },
];

function isPackUnlocked(packTier: DisplayTier, phase: AccessPhase) {
  if (packTier === "trial") return true;
  if (packTier === "subscriber") return phase === "subscribed";
  return false;
}

function getTierBadge(packTier: DisplayTier, phase: AccessPhase) {
  if (packTier === "trial") {
    return phase === "subscribed" ? "Open" : "Trial";
  }

  if (packTier === "subscriber") {
    return phase === "subscribed" ? "Open" : "Subscription";
  }

  return "Premium";
}

function getLockedMessage(packTier: DisplayTier) {
  if (packTier === "subscriber") {
    return "Unlock subscription to open this starter pack.";
  }

  return "Premium stays locked for now.";
}

function getFileNameFromPath(path: string) {
  const cleaned = path.split("?")[0];
  return cleaned.substring(cleaned.lastIndexOf("/") + 1) || "reference-sheet";
}

function ReferencePackViewer({
  pack,
  selectedIndex,
  onClose,
  onSelect,
}: {
  pack: ViewerPack | null;
  selectedIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  useEffect(() => {
    if (!pack) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowLeft") {
        onSelect(
          selectedIndex === 0 ? pack.images.length - 1 : selectedIndex - 1,
        );
      }

      if (event.key === "ArrowRight") {
        onSelect(
          selectedIndex === pack.images.length - 1 ? 0 : selectedIndex + 1,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pack, selectedIndex, onClose, onSelect]);

  if (!pack) return null;

  const activeImage = pack.images[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 p-2 md:p-4">
      <div className="mx-auto flex h-[calc(100dvh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl md:h-[calc(100dvh-2rem)]">
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3 md:px-6 md:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:text-xs">
              {pack.style}
            </p>
            <h3 className="truncate text-lg font-semibold md:text-2xl">
              {pack.title}
            </h3>
            <p className="mt-1 line-clamp-2 max-w-3xl text-xs text-muted-foreground md:mt-2 md:text-sm">
              {pack.description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close viewer"
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b bg-primary/5 px-4 py-2 md:px-6 md:py-3">
          <p className="line-clamp-2 text-[11px] text-muted-foreground md:text-sm">
            These sheets are reference material for study. Use them to train
            your eye for flow, spacing, structure, and readability, then draw
            your own original designs instead of copying them directly.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-b px-4 py-2 md:px-6 md:py-3">
          <div className="text-xs text-muted-foreground md:text-sm">
            Sheet {selectedIndex + 1} of {pack.images.length}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={activeImage}
              download={getFileNameFromPath(activeImage)}
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </a>

            <a
              href={activeImage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open image
              </Button>
            </a>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_92px] lg:grid-cols-[92px_minmax(0,1fr)] lg:grid-rows-1">
          <div className="order-2 border-t p-2 lg:order-1 lg:border-r lg:border-t-0 lg:p-3">
            <div className="grid h-full grid-cols-5 gap-2 lg:grid-cols-1 lg:grid-rows-5">
              {pack.images.map((image, index) => {
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={image}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`min-h-0 overflow-hidden rounded-xl border transition ${
                      isActive
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex h-full flex-col">
                      <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-1">
                        <img
                          src={image}
                          alt={`${pack.title} sheet ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="border-t bg-background px-1 py-1 text-center text-[10px] text-muted-foreground">
                        Sheet {index + 1}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="order-1 flex min-h-0 flex-col lg:order-2">
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/20 p-2 md:p-4">
              <button
                type="button"
                onClick={() =>
                  onSelect(
                    selectedIndex === 0
                      ? pack.images.length - 1
                      : selectedIndex - 1,
                  )
                }
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/95 p-2 shadow-sm transition hover:bg-background md:left-3"
                aria-label="Previous sheet"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border bg-white px-2 py-2 shadow-sm md:px-4 md:py-4">
                <img
                  src={activeImage}
                  alt={`${pack.title} sheet ${selectedIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelect(
                    selectedIndex === pack.images.length - 1
                      ? 0
                      : selectedIndex + 1,
                  )
                }
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/95 p-2 shadow-sm transition hover:bg-background md:right-3"
                aria-label="Next sheet"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackCard({
  section,
  phase,
  onOpen,
  onUpgrade,
}: {
  section: ReferenceSection;
  phase: AccessPhase;
  onOpen: () => void;
  onUpgrade: () => void;
}) {
  const pack = section.packs[0];
  const unlocked = isPackUnlocked(pack.tier, phase);
  const accessLabel = getTierBadge(pack.tier, phase);
  const imageCount = pack.images?.length ?? 0;

  return (
    <Card className="overflow-hidden rounded-3xl border">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{section.style}</h2>
          <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            {accessLabel}
          </span>
        </div>

        {unlocked ? (
          <Star className="h-4 w-4 text-primary" />
        ) : (
          <Lock className="h-4 w-4 text-primary" />
        )}
      </div>

      <button
        type="button"
        onClick={unlocked ? onOpen : onUpgrade}
        disabled={unlocked ? !pack.images || pack.images.length === 0 : false}
        className="group relative block w-full overflow-hidden border-b text-left"
      >
        <img
          src={pack.coverImage}
          alt={`${section.style} cover`}
          className={`h-56 w-full object-cover transition duration-300 ${
            unlocked ? "group-hover:scale-[1.02]" : "opacity-60 grayscale-[20%]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            unlocked ? "bg-black/10" : "bg-black/30"
          }`}
        />
      </button>

      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-muted-foreground">
            {unlocked ? "ready to open" : "locked"}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
            {imageCount > 0 ? `${imageCount} sheets` : "preview"}
          </span>
        </div>

        <h3 className="text-lg font-semibold">{pack.title}</h3>
        <p className="text-sm text-muted-foreground">{pack.description}</p>

        {unlocked ? (
          <div className="flex flex-wrap gap-2">
            {pack.images && pack.images.length > 0 ? (
              <Button onClick={onOpen} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open pack
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Full pack coming next
              </Button>
            )}

            <a
              href={pack.coverImage}
              download={getFileNameFromPath(pack.coverImage)}
              className="inline-flex"
            >
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download cover
              </Button>
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {getLockedMessage(pack.tier)}
            </p>

            <Button onClick={onUpgrade}>
              {pack.tier === "subscriber"
                ? "Unlock with Subscription"
                : "Premium Coming Next"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReferencePacks() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<AccessPhase>("trial");
  const [trialLabel, setTrialLabel] = useState("3 days left");

  const [viewerPack, setViewerPack] = useState<ViewerPack | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    ensureTrialStarted();
    const nextPhase = getAccessPhase();
    setPhase(nextPhase);
    setTrialLabel(getTrialDaysLeftLabel());
  }, []);

  const trialSections = useMemo(
    () => referenceData.filter((section) => section.packs[0].tier === "trial"),
    [],
  );

  const subscriberSections = useMemo(
    () =>
      referenceData.filter((section) => section.packs[0].tier === "subscriber"),
    [],
  );

  const premiumSections = useMemo(
    () =>
      referenceData.filter((section) => section.packs[0].tier === "premium"),
    [],
  );

  const accessiblePackCount = useMemo(() => {
    return referenceData.filter((section) =>
      isPackUnlocked(section.packs[0].tier, phase),
    ).length;
  }, [phase]);

  const openViewer = (section: ReferenceSection, startIndex = 0) => {
    const pack = section.packs[0];

    if (!pack.images || pack.images.length === 0) return;
    if (!isPackUnlocked(pack.tier, phase)) return;

    setViewerPack({
      style: section.style,
      title: pack.title,
      description: pack.description,
      images: pack.images,
    });
    setSelectedImageIndex(startIndex);
  };

  const closeViewer = () => {
    setViewerPack(null);
    setSelectedImageIndex(0);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <Button
          variant="ghost"
          className="gap-2 pl-0"
          onClick={() => setLocation("/library")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>

        <section className="rounded-3xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Reference Packs</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Study tattoo structure, flow, spacing, readability, and composition
            through organized starter packs. Trial opens Fine Line and
            Blackwork. Subscription unlocks Traditional and Lettering. Premium
            stays locked until that layer is built.
          </p>

          <div className="mt-4 rounded-2xl border bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              These references are for study and inspiration only. InkPlan helps
              users build stronger design awareness and drawing discipline. It
              is not a replacement for apprenticeship.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{accessiblePackCount} accessible packs right now.</span>

            <span className="rounded-full border px-3 py-1 text-xs">
              {phase === "subscribed"
                ? "Subscription active"
                : phase === "trial"
                  ? `3-day trial active • ${trialLabel}`
                  : "Trial mode"}
            </span>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Trial Packs</h2>
            <p className="text-sm text-muted-foreground">
              Fine Line and Blackwork are the only packs open during the 3-day
              trial.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {trialSections.map((section) => (
              <PackCard
                key={section.style}
                section={section}
                phase={phase}
                onOpen={() => openViewer(section, 0)}
                onUpgrade={() => setLocation("/upgrade")}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Opens with Subscription</h2>
            <p className="text-sm text-muted-foreground">
              Traditional and Lettering stay visible during trial, but remain
              locked until subscribed.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {subscriberSections.map((section) => (
              <PackCard
                key={section.style}
                section={section}
                phase={phase}
                onOpen={() => openViewer(section, 0)}
                onUpgrade={() => setLocation("/upgrade")}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Premium Packs</h2>
            <p className="text-sm text-muted-foreground">
              These stay visible for the path, but locked until the premium
              layer is built.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {premiumSections.map((section) => (
              <PackCard
                key={section.style}
                section={section}
                phase={phase}
                onOpen={() => openViewer(section, 0)}
                onUpgrade={() => setLocation("/upgrade")}
              />
            ))}
          </div>
        </section>

        <ReferencePackViewer
          pack={viewerPack}
          selectedIndex={selectedImageIndex}
          onClose={closeViewer}
          onSelect={setSelectedImageIndex}
        />
      </div>
    </Layout>
  );
}
