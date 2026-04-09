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

export type Tier = "free" | "pro" | "premium";

export type Pack = {
  title: string;
  description: string;
  tier: Tier;
  images?: string[];
};

export type ReferenceSection = {
  style: string;
  packs: Pack[];
};

const referenceData: ReferenceSection[] = [
  {
    style: "Traditional",
    packs: [
      {
        title: "Starter Flash Pack",
        description: "Core traditional designs to build visual familiarity.",
        tier: "free",
        images: [
          "/images/reference/traditional/trad-starter-pk-sh-1.png",
          "/images/reference/traditional/trad-starter-pk-sh-2.png",
          "/images/reference/traditional/trad-starter-pk-sh-3.png",
          "/images/reference/traditional/trad-starter-pk-sh-4.png",
          "/images/reference/traditional/trad-starter-pk-sh-5.png",
        ],
      },
      {
        title: "Animal Flash Pack",
        description: "Eagles, panthers, and classic animal motifs.",
        tier: "pro",
        images: [
          "/images/reference/traditional/trad-animal-pack-sht-1.png",
          "/images/reference/traditional/trad-animal-pack-sht-2.png",
          "/images/reference/traditional/trad-animal-pack-sht-3.png",
        ],
      },
      {
        title: "Mega Traditional Vault",
        description: "Large curated collection of premium flash sheets.",
        tier: "premium",
        images: [
          "/images/reference/traditional/trad-mega-vault-sht-1.png",
          "/images/reference/traditional/trad-mega-vault-sht-2.png",
          "/images/reference/traditional/trad-mega-vault-sht-3.png",
        ],
      },
    ],
  },
  {
    style: "Black & Grey",
    packs: [
      {
        title: "Starter Reference Set",
        description:
          "Foundational black and grey references focused on composition, flow, readability, and contrast.",
        tier: "free",
        images: [
          "/images/reference/black-grey/b&g-flash-starter-pack-sht-1.png",
          "/images/reference/black-grey/b&g-flash-starter-pack-sht-2.png",
          "/images/reference/black-grey/b&g-flash-starter-pack-sht-3.png",
          "/images/reference/black-grey/b&g-flash-starter-pack-sht-4.png",
          "/images/reference/black-grey/b&g-flash-starter-pack-sht-5.png",
        ],
      },
      {
        title: "Rose Study Pack",
        description: "Focused rose designs for shading and structure.",
        tier: "pro",
      },
      {
        title: "Portrait Vault",
        description: "High-level portrait and realism references.",
        tier: "premium",
      },
    ],
  },
  {
    style: "Japanese",
    packs: [
      {
        title: "Starter Japanese Pack",
        description:
          "Traditional Japanese references focused on flow, composition, and readable tattoo structure.",
        tier: "free",
        images: [
          "/images/reference/japanese/jap-starter-pack-sht-1.png",
          "/images/reference/japanese/jap-starter-pack-sht-2.png",
          "/images/reference/japanese/jap-starter-pack-sht-3.png",
          "/images/reference/japanese/jap-starter-pack-sht-4.png",
          "/images/reference/japanese/jap-starter-pack-sht-5.png",
        ],
      },
      {
        title: "Mask & Oni Pack",
        description: "Traditional mask designs and compositions.",
        tier: "pro",
      },
      {
        title: "Sleeve Flow Vault",
        description: "Full composition references for large pieces.",
        tier: "premium",
      },
    ],
  },
  {
    style: "Lettering",
    packs: [
      {
        title: "Starter Lettering Set",
        description:
          "Lettering references for studying flow, spacing, readability, and structure across different tattoo-ready styles.",
        tier: "free",
        images: [
          "/images/reference/lettering/letter-starter-sht-1.png",
          "/images/reference/lettering/letter-starter-sht-2.png",
          "/images/reference/lettering/letter-starter-sht-3.png",
          "/images/reference/lettering/letter-starter-sht-4.png",
          "/images/reference/lettering/letter-starter-sht-5.png",
        ],
      },
      {
        title: "Script Pack",
        description: "Elegant script styles and name layouts.",
        tier: "pro",
      },
      {
        title: "Advanced Layout Vault",
        description: "Complex lettering compositions and designs.",
        tier: "premium",
      },
    ],
  },
  {
    style: "Fine Line",
    packs: [
      {
        title: "Starter Fine Line Set",
        description:
          "Clean minimal references focused on elegance, spacing, and delicate readability.",
        tier: "free",
        images: [
          "/images/reference/fineline/fine-line-starter-pk-sht-1.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-2.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-3.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-4.png",
          "/images/reference/fineline/fine-line-starter-pk-sht-5.png",
        ],
      },
      {
        title: "Botanical Fine Line Pack",
        description:
          "Flowers, leaves, stems, and ornamental references built for softer fine line compositions.",
        tier: "pro",
      },
      {
        title: "Luxury Fine Line Vault",
        description:
          "High-end fine line reference sheets with more refined layouts and advanced detail control.",
        tier: "premium",
      },
    ],
  },
  {
    style: "Neo-Traditional",
    packs: [
      {
        title: "Starter Neo-Traditional Pack",
        description:
          "Bold shape-based references with richer detail, stronger flow, and modernized flash appeal.",
        tier: "free",
         images: [
        "/images/reference/neo-traditional/neo-trad-sheet-1.png",
        "/images/reference/neo-traditional/neo-trad-sheet-2.png",
        "/images/reference/neo-traditional/neo-trad-sheet-3.png",
        "/images/reference/neo-traditional/neo-trad-sheet-4.png",
        "/images/reference/neo-traditional/neo-trad-sheet-5.png",
       ],
      },
      {
        title: "Neo-Traditional Character Pack",
        description:
          "Stylized faces, animals, and decorative compositions with stronger personality and visual weight.",
        tier: "pro",
      },
      {
        title: "Neo-Traditional Master Vault",
        description:
          "Expanded premium collection with layered detail, ornamental builds, and high-impact compositions.",
        tier: "premium",
      },
    ],
  },
];

type ViewerPack = {
  style: string;
  title: string;
  description: string;
  images: string[];
};

function getTierRank(tier: Tier) {
  if (tier === "premium") return 3;
  if (tier === "pro") return 2;
  return 1;
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
  }, [onClose, onSelect, pack, selectedIndex]);

  if (!pack) return null;

  const activeImage = pack.images[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b p-4 md:p-6">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {pack.style}
            </p>
            <h3 className="truncate text-xl font-semibold md:text-2xl">
              {pack.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {pack.description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close viewer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b bg-primary/5 px-4 py-3 md:px-6">
          <p className="text-sm text-muted-foreground">
            These AI-generated sheets are reference material only. Study flow,
            spacing, structure, readability, and composition — then draw up your
            own designs instead of copying them directly.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[140px_minmax(0,1fr)]">
          <div className="order-2 border-t p-3 lg:order-1 lg:border-r lg:border-t-0 lg:p-4">
            <div className="grid max-h-full grid-cols-4 gap-3 overflow-auto lg:grid-cols-1">
              {pack.images.map((image, index) => {
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={image}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      isActive
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${pack.title} sheet ${index + 1}`}
                      className="h-24 w-full object-cover lg:h-28"
                    />
                    <div className="border-t bg-background px-2 py-1 text-center text-[11px] text-muted-foreground">
                      Sheet {index + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="order-1 flex min-h-0 flex-col lg:order-2">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-6">
              <div className="text-sm text-muted-foreground">
                Sheet {selectedIndex + 1} of {pack.images.length}
              </div>

              <div className="flex items-center gap-2">
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

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-4 md:p-6">
              <button
                type="button"
                onClick={() =>
                  onSelect(
                    selectedIndex === 0
                      ? pack.images.length - 1
                      : selectedIndex - 1,
                  )
                }
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/95 p-2 shadow-sm transition hover:bg-background"
                aria-label="Previous sheet"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <img
                src={activeImage}
                alt={`${pack.title} sheet ${selectedIndex + 1}`}
                className="max-h-full max-w-full rounded-2xl border bg-white object-contain shadow-sm"
              />

              <button
                type="button"
                onClick={() =>
                  onSelect(
                    selectedIndex === pack.images.length - 1
                      ? 0
                      : selectedIndex + 1,
                  )
                }
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/95 p-2 shadow-sm transition hover:bg-background"
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

export default function ReferencePacks() {
  const [, setLocation] = useLocation();
  const userTier: Tier = "free";

  const [viewerPack, setViewerPack] = useState<ViewerPack | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const availablePackCount = useMemo(() => {
    return referenceData.reduce((count, section) => {
      return (
        count +
        section.packs.filter(
          (pack) =>
            getTierRank(pack.tier) <= getTierRank(userTier) &&
            pack.images &&
            pack.images.length > 0,
        ).length
      );
    }, 0);
  }, [userTier]);

  const openViewer = (style: string, pack: Pack, startIndex = 0) => {
    if (!pack.images || pack.images.length === 0) return;

    setViewerPack({
      style,
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

        <div className="rounded-3xl border bg-card p-6">
          <h1 className="text-3xl font-bold">Reference Packs</h1>
          <p className="mt-2 text-muted-foreground">
            Study tattoo structure, flow, spacing, readability, and composition
            through organized reference sheets.
          </p>

          <div className="mt-4 rounded-2xl border bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              These references are here to train your eye and inspire stronger
              drawing decisions. They are not meant to replace original design
              work. Use them to study, then draw up your own designs for
              practice and stencil building.
            </p>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {availablePackCount} accessible packs ready to open, inspect, and
            download for stencil study.
          </div>
        </div>

        {referenceData.map((section) => (
          <div key={section.style} className="space-y-4">
            <h2 className="text-xl font-semibold">{section.style}</h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {section.packs.map((pack) => {
                const locked = getTierRank(pack.tier) > getTierRank(userTier);
                const hasImages = Boolean(
                  pack.images && pack.images.length > 0,
                );

                return (
                  <Card
                    key={pack.title}
                    className="relative overflow-hidden rounded-3xl border"
                  >
                    {hasImages && !locked ? (
                      <div className="grid grid-cols-2 gap-1 border-b">
                        {pack.images!.slice(0, 4).map((image, index) => (
                          <button
                            key={image}
                            type="button"
                            onClick={() =>
                              openViewer(section.style, pack, index)
                            }
                            className="group relative text-left"
                          >
                            <img
                              src={image}
                              alt={`${pack.title} preview ${index + 1}`}
                              className="h-28 w-full object-cover transition group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase text-muted-foreground">
                          {pack.tier}
                        </span>

                        {locked ? (
                          <Lock className="h-4 w-4 text-primary" />
                        ) : (
                          <Star className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <h3 className="text-lg font-semibold">{pack.title}</h3>

                      <p className="text-sm text-muted-foreground">
                        {pack.description}
                      </p>

                      {!locked && hasImages ? (
                        <>
                          <div className="rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
                            {pack.images!.length} reference sheets included
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => openViewer(section.style, pack, 0)}
                              className="gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open pack
                            </Button>

                            <a
                              href={pack.images![0]}
                              download={getFileNameFromPath(pack.images![0])}
                              className="inline-flex"
                            >
                              <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Download first sheet
                              </Button>
                            </a>
                          </div>
                        </>
                      ) : !locked ? (
                        <div className="rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
                          Reference pack ready to expand with image sheets
                        </div>
                      ) : null}
                    </CardContent>

                    {locked ? (
                      <div className="absolute inset-0 flex items-end bg-black/40 p-4">
                        <div className="w-full rounded-xl bg-background p-4">
                          <p className="text-sm font-medium">
                            Unlock with {pack.tier}
                          </p>
                          <Button
                            className="mt-3 w-full"
                            onClick={() => setLocation("/upgrade")}
                          >
                            Upgrade
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

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
