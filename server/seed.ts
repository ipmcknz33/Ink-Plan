import { storage } from "./storage";
import type { TattooStyle } from "@shared/schema";

const styles: TattooStyle[] = [
  {
    id: "american_traditional",
    name: "American Traditional",
    tags: ["Traditional", "Bold", "Color"],
    definition: "Bold outlines, limited palette, high contrast, classic flash motifs.",
    rules: [
      "Bold linework with consistent weight (usually 7rl-14rl)",
      "Readable silhouette from a distance",
      "Limited classic palette (Red, Green, Yellow, Black)",
      "Solid black shadows (1/3 rule: 1/3 black, 1/3 color, 1/3 skin)"
    ],
    commonMistakes: [
      "Lines too thin or shaky",
      "Too many colors / muddy palette",
      "Over-rendered shading (keep it punchy)",
      "Weak silhouette (squint test fails)"
    ],
    drills: JSON.stringify([
      { title: "5-min Line Control", minutes: 5, prompt: "Draw 20 consistent-weight lines + 10 clean curves. Do not lift the pen." },
      { title: "10-min Flash Build", minutes: 10, prompt: "Create a simple rose silhouette + bold outline + 2 shadow zones." },
      { title: "Spit Shading Drill", minutes: 15, prompt: "Practice smooth gradients from black to skin tone on 5 simple shapes." }
    ]),
    previewImage: "/src/assets/styles/traditional-rose.png",
  },
  {
    id: "neo_traditional",
    name: "Neo Traditional",
    tags: ["Illustrative", "Dimension", "Flow"],
    definition: "Evolution of traditional with varying line weights, broader color palette, and more dimensional shading.",
    rules: [
      "Bold black outlines are mandatory but use varied weights",
      "Expanded palette (purples, teals, mustard) but still contained",
      "Art Nouveau/Deco influence with ornamental framing",
      "More dimension/depth than American Traditional"
    ],
    commonMistakes: [
      "Designing too small (needs size for details)",
      "Ignoring body flow (must follow S-curves)",
      "Colors bleeding outside outlines",
      "Flat shading (needs layered depth)"
    ],
    drills: JSON.stringify([
      { title: "Line Weight Variation", minutes: 10, prompt: "Draw organic shapes using thick outer lines and thin inner details." },
      { title: "Ornamental Frame", minutes: 15, prompt: "Design an Art Nouveau frame for an oval portrait." }
    ]),
    previewImage: "/src/assets/styles/neotrad-fox.png"
  },
  {
    id: "blackwork",
    name: "Blackwork",
    tags: ["Black", "Graphic", "Texture"],
    definition: "Exclusively black ink. Ranges from geometric patterns to illustrative etching styles.",
    rules: [
      "Use ONLY black ink (no gray wash, no color)",
      "Master negative space (skin breaks create depth)",
      "Bold, precise linework is non-negotiable",
      "Texture via dotwork, hatching, or packing"
    ],
    commonMistakes: [
      "Patchy solid fills (holidays)",
      "Inconsistent needle depth (blowouts visible)",
      "Overly intricate details that blur over time",
      "Lack of negative space (blob effect)"
    ],
    drills: JSON.stringify([
      { title: "Solid Fill Mastery", minutes: 20, prompt: "Fill a 2x2 inch square with solid black. No holidays (gaps)." },
      { title: "Negative Space Balance", minutes: 15, prompt: "Draw a complex pattern where 50% is black and 50% is white." }
    ]),
    previewImage: "/src/assets/styles/blackwork-geo.png"
  },
  {
    id: "japanese_irezumi",
    name: "Japanese Irezumi",
    tags: ["Cultural", "Flow", "Large Scale"],
    definition: "Large-scale body pieces with flowing compositions, mythological creatures, and specific background elements.",
    rules: [
      "Composition must flow with muscles/body structure",
      "Background elements (wind, waves, clouds) are mandatory",
      "Specific seasonal pairings (don't mix cherry blossoms with maple leaves)",
      "Gradual shading (Hikui) from dark to light"
    ],
    commonMistakes: [
      "Ink Salad (random placement without flow)",
      "Ignoring background requirements",
      "Breaking traditional flow (sleeves stopping abruptly)",
      "Wrong element pairing (clashing seasons/meanings)"
    ],
    drills: JSON.stringify([
      { title: "Wind Bar Flow", minutes: 15, prompt: "Draw wind bars that flow around a cylindrical shape (arm/leg)." },
      { title: "Finger Wave Study", minutes: 10, prompt: "Sketch 5 variations of traditional Japanese finger waves." }
    ]),
    previewImage: "/src/assets/styles/irezumi-dragon.png"
  },
  {
    id: "realism",
    name: "Realism",
    tags: ["Photographic", "Detailed", "Shading"],
    definition: "Lifelike detail, accurate shading, and depth to mimic photos. No hard outlines.",
    rules: [
      "NO hard outlines (use soft edges/shading)",
      "Must use high-quality photo reference",
      "Shadow mapping is essential before shading",
      "Smooth gradients and blending are critical"
    ],
    commonMistakes: [
      "Hard outlines (kills the realism)",
      "Poor contrast (needs deep blacks)",
      "Too small (details will blur)",
      "Wrong eye/mouth details in portraits"
    ],
    drills: JSON.stringify([
      { title: "Sphere Shading", minutes: 10, prompt: "Render a perfect sphere with light source, core shadow, and reflection." },
      { title: "Texture Study", minutes: 20, prompt: "Draw a 1-inch square of fur texture and a 1-inch square of water." }
    ]),
    previewImage: "/src/assets/styles/realism-eye.png"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    tags: ["Painterly", "Color", "Abstract"],
    definition: "Mimics watercolor painting with soft gradients, splashes, drips, and minimal outlines.",
    rules: [
      "No bold outlines holding the color",
      "Translucent layering for depth",
      "Use of 'paper' (skin) as highlight",
      "Gradient application from dark to light"
    ],
    commonMistakes: [
      "Muddy blending (overworking color)",
      "Lack of contrast (fades too fast)",
      "No black anchor (needs some structure to last)",
      "Ignoring sun exposure risks"
    ],
    drills: JSON.stringify([
      { title: "Color Bleed", minutes: 10, prompt: "Practice blending two colors into each other with a jagged 'bleed' edge." }
    ]),
    previewImage: "/src/assets/styles/watercolor-bird.png"
  },
  {
    id: "new_school",
    name: "New School",
    tags: ["Cartoon", "Vibrant", "Exaggerated"],
    definition: "Cartoonish exaggeration, heavy outlines, neon-bright colors, and distorted perspectives.",
    rules: [
      "Bold, confident outlines (can be colored)",
      "Exaggerated proportions (big eyes, warped perspective)",
      "Vivid, saturated color packing",
      "Light source usually dramatic/unrealistic"
    ],
    commonMistakes: [
      "Weak linework (needs to be bold)",
      "Patchy color saturation",
      "Lack of depth/3D effect",
      "Restrained proportions (go wilder)"
    ],
    drills: JSON.stringify([
      { title: "Character Warp", minutes: 15, prompt: "Take a standard animal and redraw it with New School proportions (huge eyes/head)." }
    ]),
    previewImage: "/src/assets/styles/newschool-character.png"
  },
  {
    id: "geometric_dotwork",
    name: "Geometric & Dotwork",
    tags: ["Precision", "Pattern", "Sacred"],
    definition: "Built from mathematical shapes, symmetry, and stippling shading.",
    rules: [
      "Precision is everything (straight lines, perfect circles)",
      "Symmetry must be exact",
      "Density of dots controls value/shade",
      "Account for body curvature distortion"
    ],
    commonMistakes: [
      "Wobbly lines (ruins the effect)",
      "Inconsistent dot spacing",
      "Ignoring body topography (circles look ovals)",
      "Rushing the process"
    ],
    drills: JSON.stringify([
      { title: "Perfect Circle", minutes: 10, prompt: "Draw 5 concentric circles freehand. Keep spacing even." },
      { title: "Stipple Gradient", minutes: 15, prompt: "Create a smooth gradient bar using only dots." }
    ]),
    previewImage: "/src/assets/styles/geometric-mandala.png"
  },
  {
    id: "fine_line",
    name: "Fine Line Minimalist",
    tags: ["Delicate", "Small", "Subtle"],
    definition: "Ultra-thin lines, delicate details, and negative space. Often single needle.",
    rules: [
      "Single needle or tight grouping (3RL)",
      "Light hand pressure (don't go deep)",
      "Simplify details (too much blobs together)",
      "Steady hand speed is critical"
    ],
    commonMistakes: [
      "Blowouts (going too deep)",
      "Shaky lines (very visible)",
      "Design too cluttered for size",
      "Poor placement (high friction areas)"
    ],
    drills: JSON.stringify([
      { title: "Steady Hand", minutes: 5, prompt: "Draw 10 parallel straight lines as close as possible without touching." }
    ]),
    previewImage: "/src/assets/styles/fineline-flower.png"
  },
  {
    id: "chicano",
    name: "Chicano",
    tags: ["Black & Grey", "Script", "Cultural"],
    definition: "Fine line black & grey, script, religious/street iconography. Smooth gradients.",
    rules: [
      "Black & Grey ONLY (diluted washes)",
      "Single needle fine line work",
      "Smooth gradient shading (no hard edges)",
      "High contrast (deep blacks)"
    ],
    commonMistakes: [
      "Using grey ink (use diluted black)",
      "Rushing the shading (needs to be smooth)",
      "Cultural appropriation (respect meanings)",
      "Oversimplification (needs detail)"
    ],
    drills: JSON.stringify([
      { title: "Script Flow", minutes: 15, prompt: "Write 'Respect' in custom Chicano lettering with flourishes." }
    ]),
    previewImage: "/src/assets/styles/chicano-portrait.png"
  },
  {
    id: "biomechanical",
    name: "Biomechanical",
    tags: ["3D", "Sci-Fi", "Texture"],
    definition: "Organic elements fused with mechanical parts. Skin rips, gears, pistons.",
    rules: [
      "Anatomical integration (flow with muscles)",
      "Realistic lighting/shading for 3D effect",
      "Fusion of flesh and machine (not just gears on top)",
      "High contrast for depth"
    ],
    commonMistakes: [
      "Flat appearance (needs deep shadows)",
      "Random placement (must fit muscle)",
      "Poor texture rendering (metal vs flesh)",
      "Cluttered composition"
    ],
    drills: JSON.stringify([
      { title: "Skin Rip", minutes: 20, prompt: "Draw a realistic torn skin edge revealing a metal plate underneath." }
    ]),
    previewImage: "/src/assets/styles/biomech-arm.png"
  },
  {
    id: "polynesian",
    name: "Tribal / Polynesian",
    tags: ["Cultural", "Pattern", "Blackwork"],
    definition: "Bold black patterns, storytelling symbols, and body-flow placement.",
    rules: [
      "Storytelling is mandatory (symbols have meaning)",
      "Placement dictates meaning (earth vs spirit)",
      "Bold black contrast",
      "Repetition and symmetry (style dependent)"
    ],
    commonMistakes: [
      "Copying designs (disrespectful/taboo)",
      "Mixing styles (Maori vs Samoan)",
      "Ignoring muscle flow",
      "Inconsistent spacing"
    ],
    drills: JSON.stringify([
      { title: "Pattern Consistency", minutes: 15, prompt: "Fill a defined shape with a repeating triangle/shark tooth pattern." }
    ]),
    previewImage: "/src/assets/styles/polynesian-tribal.png"
  }
];

async function seed() {
  console.log("Seeding tattoo styles...");
  await storage.seedStyles(styles);
  console.log("✓ Seeded 12 tattoo styles");
}

seed()
  .then(() => {
    console.log("Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
