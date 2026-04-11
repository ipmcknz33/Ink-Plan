import Layout from "@/components/Layout";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ImageIcon,
  Info,
  Loader2,
  Play,
  Search,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStyle } from "@/hooks/use-api";
import { useMemo, useState } from "react";

interface Drill {
  title: string;
  minutes: number;
  prompt: string;
}

type StyleItem = {
  id: string;
  name: string;
  definition: string;
  previewImage: string;
  tags: string[];
  rules: string[];
  commonMistakes: string[];
  drills: string;
};

type CoachTopicKey =
  | "definition"
  | "history"
  | "focus"
  | "readability"
  | "mistakes"
  | "practice"
  | "differences"
  | "avoid";

type CoachTopic = {
  label: string;
  title: string;
  body: string;
};

type CoachResourceBlock = {
  artists: string[];
  youtubeSearches: string[];
  googleSearches: string[];
  studyTip: string;
};

type CoachStyleContent = {
  definition: CoachTopic;
  history: CoachTopic;
  focus: CoachTopic;
  readability: CoachTopic;
  mistakes: CoachTopic;
  practice: CoachTopic;
  differences: CoachTopic;
  avoid: CoachTopic;
  resources: CoachResourceBlock;
};

const fallbackStyles: StyleItem[] = [
  {
    id: "traditional",
    name: "American Traditional",
    definition:
      "Bold outlines, strong readability, and classic tattoo structure built to hold up clearly.",
    previewImage: "/images/traditional-style.png",
    tags: ["Bold", "Classic", "Readable"],
    rules: [
      "Use strong line weight hierarchy.",
      "Keep shapes simple and readable.",
      "Prioritize silhouette before details.",
    ],
    commonMistakes: [
      "Adding too much detail too early.",
      "Using inconsistent line weights.",
      "Weak silhouettes that lose clarity fast.",
    ],
    drills: JSON.stringify([
      {
        title: "Traditional line control",
        minutes: 30,
        prompt:
          "Redraw a rose, dagger, or panther head using clean bold lines and simplified shapes.",
      },
      {
        title: "Traditional composition drill",
        minutes: 25,
        prompt:
          "Arrange two classic motifs into a balanced flash design with readable spacing.",
      },
    ]),
  },
  {
    id: "black-grey",
    name: "Black & Grey",
    definition:
      "Smooth shading, value control, and clean form separation built through light, mid, and dark balance.",
    previewImage: "/images/black-grey-style.png",
    tags: ["Smooth", "Value", "Contrast"],
    rules: [
      "Separate lights, mids, and darks clearly.",
      "Build smooth transitions without muddying forms.",
      "Keep the structure readable before soft shading.",
    ],
    commonMistakes: [
      "Flattening everything into one value.",
      "Overworking the same area.",
      "Ignoring structure while chasing smoothness.",
    ],
    drills: JSON.stringify([
      {
        title: "Black and grey shading control",
        minutes: 35,
        prompt:
          "Shade a simple skull or rose study using clear light, mid, and dark separation.",
      },
      {
        title: "Value grouping drill",
        minutes: 25,
        prompt:
          "Break a design into only three clear value families before rendering.",
      },
    ]),
  },
  {
    id: "japanese",
    name: "Japanese",
    definition:
      "Flowing composition, movement, hierarchy, and strong large-form design.",
    previewImage: "/images/japanese-style.png",
    tags: ["Flow", "Movement", "Large Forms"],
    rules: [
      "Let major forms guide the eye first.",
      "Use supporting background elements with intention.",
      "Keep hierarchy between main and secondary forms.",
    ],
    commonMistakes: [
      "Stiff flow and weak movement.",
      "Background elements competing with the subject.",
      "Adding detail before the major forms are working.",
    ],
    drills: JSON.stringify([
      {
        title: "Japanese flow composition",
        minutes: 40,
        prompt:
          "Arrange a koi, waves, and flowers so the eye moves naturally through the design.",
      },
      {
        title: "Large shape hierarchy",
        minutes: 30,
        prompt:
          "Block in the main Japanese forms first before touching internal detail.",
      },
    ]),
  },
  {
    id: "lettering",
    name: "Lettering",
    definition:
      "Clean typography, spacing, rhythm, and readable tattoo design.",
    previewImage: "/images/lettering-style.png",
    tags: ["Typography", "Spacing", "Readable"],
    rules: [
      "Readability comes before decoration.",
      "Keep spacing between letters controlled and intentional.",
      "Use line weight consistently where the style calls for it.",
    ],
    commonMistakes: [
      "Uneven spacing that hurts readability.",
      "Retracing letters repeatedly.",
      "Adding flourishes that confuse the word shape.",
    ],
    drills: JSON.stringify([
      {
        title: "Letter spacing drill",
        minutes: 25,
        prompt:
          "Repeat one phrase multiple times and focus only on spacing and clean structure.",
      },
      {
        title: "Script linework drill",
        minutes: 30,
        prompt:
          "Practice smooth loops, turns, and clean finishes without retracing.",
      },
    ]),
  },
  {
    id: "neo-traditional",
    name: "Neo Traditional",
    definition:
      "A richer, more illustrative evolution of Traditional with stronger color, stylized forms, and extra detail.",
    previewImage: "/images/neo-traditional-style.png",
    tags: ["Stylized", "Color", "Illustrative"],
    rules: [
      "Keep the silhouette strong before rendering details.",
      "Use color and detail to support form, not bury it.",
      "Maintain hierarchy between major and minor elements.",
    ],
    commonMistakes: [
      "Adding detail before the structure is solid.",
      "Over-rendering every area equally.",
      "Losing readable shape language under decoration.",
    ],
    drills: JSON.stringify([
      {
        title: "Neo traditional shape hierarchy",
        minutes: 35,
        prompt:
          "Build a stylized animal head using clean primary forms before adding secondary detail.",
      },
      {
        title: "Neo traditional color planning",
        minutes: 25,
        prompt:
          "Map color zones for a floral design without losing readability or balance.",
      },
    ]),
  },
  {
    id: "fine-line",
    name: "Fine Line",
    definition:
      "Delicate, minimal tattooing built on restraint, spacing, subtle linework, and clean simplicity.",
    previewImage: "/images/lettering-style.png",
    tags: ["Delicate", "Minimal", "Clean"],
    rules: [
      "Use restraint and avoid unnecessary complexity.",
      "Keep spacing open so small designs can breathe.",
      "Make every line intentional because subtle work shows mistakes fast.",
    ],
    commonMistakes: [
      "Overcomplicating tiny designs.",
      "Crowding delicate elements together.",
      "Shaky line quality from rushing or overworking.",
    ],
    drills: JSON.stringify([
      {
        title: "Fine line control",
        minutes: 25,
        prompt:
          "Practice small botanical stems and leaves with smooth, delicate line movement.",
      },
      {
        title: "Minimal composition drill",
        minutes: 20,
        prompt:
          "Create a tiny readable design with clean spacing and intentional restraint.",
      },
    ]),
  },
];

/**
 * FLASH SHEET IMAGE + POSITIONING
 *
 * This is the only section you need to edit to reposition images.
 *
 * Keep baseX/baseY the same for consistency.
 * Change ONLY offsetX / offsetY for the style you want to nudge.
 */
const flashSheetConfigByStyleId: Record<
  string,
  {
    src: string;
    baseX: number;
    baseY: number;
    offsetX: number;
    offsetY: number;
  }
> = {
  traditional: {
    src: "/images/traditional-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "black-grey": {
    src: "/images/black-grey-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  japanese: {
    src: "/images/japanese-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  lettering: {
    src: "/images/lettering-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "neo-traditional": {
    src: "/images/neo-traditional-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
  "fine-line": {
    src: "/images/fine-line-flash-sheet.jpg",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  },
};

const coachTopicOrder: CoachTopicKey[] = [
  "definition",
  "history",
  "focus",
  "readability",
  "mistakes",
  "practice",
  "differences",
  "avoid",
];

const STYLE_COACH: Record<string, CoachStyleContent> = {
  traditional: {
    definition: {
      label: "What defines this style?",
      title: "What defines American Traditional?",
      body: "American Traditional is built around bold outlines, simple readable shapes, limited color palettes, and clear visual hierarchy. It is meant to read fast and stay strong over time. The design should feel intentional at a glance before anyone notices the smaller details.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of American Traditional",
      body: "American Traditional grew out of early Western tattoo culture and became one of the most recognizable tattoo foundations. It is closely associated with classic flash, sailors, military imagery, patriotic symbols, roses, daggers, panthers, eagles, and pinups. Its visual rules were shaped by the need for durability, clarity, and speed of reading on skin.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying this style",
      body: "Study silhouette first. Ask whether the design still reads clearly from a distance. Then look at how interior details support the main shape instead of fighting it. Pay attention to bold line structure, clean spacing, black fill placement, and how the image stays readable without needing excessive detail.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why American Traditional reads so clearly",
      body: "Readability comes from simple shapes, strong contrast, and obvious hierarchy. Major forms are easy to spot, line weight is confident, and the viewer never has to search for the subject. If the silhouette weakens or the details take over, the style loses its strength.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in American Traditional",
      body: "Beginners usually over-detail too early, use weak or uneven outlines, make shapes too small, or pack too much into one design. Another common mistake is trying to make the piece look advanced by adding texture everywhere instead of making the structure stronger.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice American Traditional",
      body: "Redraw classic subjects such as roses, daggers, panthers, swallows, or eagles. First block the big shape. Then place interior divisions. Then add black fills and simple color planning if needed. Practice repetition and speed without rushing. The goal is clean confidence, not complexity.",
    },
    differences: {
      label: "How is it different?",
      title: "How American Traditional differs from similar styles",
      body: "Compared with Neo Traditional, American Traditional is simpler, flatter, and more rigid about readability. Neo Traditional usually adds more rendering, more stylization, and more decorative complexity. Traditional is more stripped down and rule-driven, which is part of why it is such a strong foundation to study first.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not copy finished designs line for line without understanding why they work. Avoid assuming that bold automatically means messy or that simple means easy. Focus on learning structure, spacing, and shape language. Redraw, simplify, and create your own versions instead of tracing with no thought behind it.",
    },
    resources: {
      artists: ["Sailor Jerry", "Bert Grimm", "Don Ed Hardy"],
      youtubeSearches: [
        "american traditional tattoo breakdown",
        "how to draw traditional tattoo flash",
        "sailor jerry tattoo analysis",
      ],
      googleSearches: [
        "american traditional tattoo rules",
        "traditional tattoo flash sheet examples",
        "bold line traditional tattoo design",
      ],
      studyTip:
        "Step back from the design often. If it only works up close, the structure usually is not strong enough yet.",
    },
  },
  "black-grey": {
    definition: {
      label: "What defines this style?",
      title: "What defines Black & Grey?",
      body: "Black & Grey relies on value control, light-to-dark transitions, contrast, and form separation. The strength of the style comes from structure first and rendering second. The design should have clear value families so it does not collapse into muddy grey.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of Black & Grey",
      body: "Black & Grey tattooing developed into one of the most influential modern tattoo directions and became especially recognizable through portrait work, religious imagery, Chicano influence, realism, and softer atmospheric rendering. Its strength comes from using tone and contrast to build depth without relying on full color.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying Black & Grey",
      body: "Pay attention to value grouping. Look at what is kept light, what is midtone, and what is pushed dark. Study where soft transitions happen versus where hard edges are preserved. The goal is not just smoothness — it is controlled form, contrast, and believable structure.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why Black & Grey stays readable",
      body: "Readability comes from separating light, mid, and dark clearly enough that the image still holds together at a glance. If everything turns into similar grey values, the tattoo loses depth and the focal point disappears. Good Black & Grey has softness without losing shape.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in Black & Grey",
      body: "Beginners often overblend everything, flatten the design into one value range, or chase smoothness before understanding form. Another common mistake is overworking the same area until it turns muddy. Structure has to lead the rendering.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice Black & Grey",
      body: "Start by breaking subjects into only three value groups: light, mid, and dark. Practice simple skulls, roses, drapery, statues, or portraits using those value families before trying advanced realism. Train your eye to simplify first and render second.",
    },
    differences: {
      label: "How is it different?",
      title: "How Black & Grey differs from other styles",
      body: "Compared with Traditional, Black & Grey depends much more on value transitions and less on flat color and hard graphic separation. Compared with pure realism drawing, tattoo Black & Grey still has to respect readability and healing, so it cannot rely only on tiny soft detail everywhere.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not copy soft effects without understanding the underlying form. Avoid thinking the goal is only to make it smooth. If you ignore structure and contrast, the work may look polished up close but weak overall. Study light logic, shape edges, and focal control first.",
    },
    resources: {
      artists: ["Nikko Hurtado", "Carlos Torres", "Dmitriy Samohin"],
      youtubeSearches: [
        "black and grey tattoo shading technique",
        "tattoo value study realism",
        "black and grey realism breakdown",
      ],
      googleSearches: [
        "black and grey tattoo value study",
        "realism tattoo light and shadow reference",
        "black and grey portrait tattoo contrast",
      ],
      studyTip:
        "If your darkest darks and lightest lights are not clearly planned, the whole piece usually feels flatter than you think.",
    },
  },
  japanese: {
    definition: {
      label: "What defines this style?",
      title: "What defines Japanese tattooing?",
      body: "Japanese tattooing is built around flow, body movement, storytelling, and large-scale composition. Main subjects and background elements work together as one system. The strength of the style is not only in the individual drawing, but in how everything moves and breathes together.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of Japanese tattooing",
      body: "Japanese tattooing, often connected with Irezumi traditions, is known for large compositions, mythological and cultural subject matter, and strong body-fit design. Dragons, koi, tigers, masks, peonies, chrysanthemums, waves, smoke, and wind bars all play roles in shaping the full visual story.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying Japanese",
      body: "Study how the eye moves through the design. Pay close attention to large shape placement, subject hierarchy, supporting backgrounds, and how negative space helps the composition breathe. This style depends on flow more than isolated details.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why Japanese compositions stay readable",
      body: "Readability comes from hierarchy and flow. The main subject must lead first, supporting forms must reinforce that movement, and background elements must unify rather than compete. When the composition flows well, the whole design feels intentional and alive.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in Japanese tattooing",
      body: "Beginners often make the layout stiff, overcomplicate the background, or let every area compete equally. Another common issue is drawing small details before the large body of the composition is working. That usually kills movement fast.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice Japanese tattooing",
      body: "Start with large composition studies. Use koi, dragons, flowers, or masks with very simple background blocking. Practice arranging major forms first, then supporting shapes, and only after that move into detail. Think about body flow even when working on paper.",
    },
    differences: {
      label: "How is it different?",
      title: "How Japanese differs from similar styles",
      body: "Compared with Traditional flash, Japanese relies much more on movement, environment, and full composition flow. Compared with realism, it is less about optical accuracy and more about design rhythm, hierarchy, and storytelling. It often works as a total composition rather than a single isolated image.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not copy background bars, waves, smoke, or flowers as decoration without understanding what they are doing for the composition. Avoid treating Japanese as just a collection of cool motifs. Learn how the parts support the whole.",
    },
    resources: {
      artists: ["Horiyoshi III", "Horitaka", "Horimitsu"],
      youtubeSearches: [
        "japanese tattoo composition breakdown",
        "irezumi flow tutorial",
        "japanese tattoo background elements explained",
      ],
      googleSearches: [
        "irezumi flow examples",
        "japanese tattoo waves wind bars meaning",
        "japanese tattoo body flow reference",
      ],
      studyTip:
        "Before adding detail, squint at the design and check whether the big movement still feels strong and obvious.",
    },
  },
  lettering: {
    definition: {
      label: "What defines this style?",
      title: "What defines Lettering in tattooing?",
      body: "Lettering in tattooing is defined by readability, rhythm, spacing, and controlled character structure. Whether the style is script, blackletter, gothic, or ornamental, the word must still read clearly. Decoration should support the word shape, not bury it.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of tattoo lettering",
      body: "Tattoo lettering has developed across many influences including sign painting, script traditions, blackletter, graffiti, Chicano work, and ornamental typography. Over time it became one of the strongest ways to personalize tattoos while still requiring discipline in spacing, rhythm, and composition.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying Lettering",
      body: "Look at spacing between letters, consistency in slant, line rhythm, endings, loops, and how the overall word shape feels. Pay attention to whether the design still reads instantly or whether decoration is making it harder to understand.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why strong Lettering stays readable",
      body: "Readability comes from clean spacing, clear structure, and a strong overall rhythm. Good lettering lets the eye move through the word naturally. If letters collide, slant changes randomly, or flourishes take over, readability drops fast.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in Lettering",
      body: "Beginners often crowd letters, retrace too much, vary spacing inconsistently, or add flourishes before the base word shape is solved. Another common issue is focusing on style before making sure the actual word is readable.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice Lettering",
      body: "Pick short words or phrases and redraw them repeatedly with attention on spacing, slant, entry strokes, and endings. Practice the same phrase multiple times instead of constantly chasing new words. Repetition builds control faster than novelty.",
    },
    differences: {
      label: "How is it different?",
      title: "How Lettering differs from image-based tattoo styles",
      body: "Lettering depends more on rhythm, typography, spacing, and the logic of character construction than on illustration. The design challenge is not only beauty, but whether the text remains readable while still feeling stylish and intentional.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not copy complex script or blackletter just because it looks impressive. If you do not understand the spacing and character structure, the result usually feels forced. Build from simple readable words first and let style grow from control.",
    },
    resources: {
      artists: ["Big Sleeps", "Mister Cartoon", "Lalo Yunda"],
      youtubeSearches: [
        "tattoo lettering spacing tutorial",
        "script tattoo lettering breakdown",
        "blackletter tattoo design practice",
      ],
      googleSearches: [
        "tattoo lettering spacing examples",
        "script tattoo word structure",
        "blackletter tattoo reference study",
      ],
      studyTip:
        "Cover the decorative flourishes and ask yourself whether the plain word underneath still feels clean and readable.",
    },
  },
  "neo-traditional": {
    definition: {
      label: "What defines this style?",
      title: "What defines Neo Traditional?",
      body: "Neo Traditional expands on Traditional tattooing with more stylization, richer color, more illustrative forms, and greater decorative complexity. It still needs strong readability, but it usually allows more rendering, variation, and visual personality than classic Traditional.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of Neo Traditional",
      body: "Neo Traditional grew as artists pushed beyond the simplicity of classic Traditional while still keeping strong outline structure and clear shape language. It often blends classic tattoo discipline with illustration, richer palettes, stylized faces, animals, florals, and decorative design elements.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying Neo Traditional",
      body: "Study how the silhouette stays readable even when detail increases. Look at how color zones, ornament, and rendering support the structure. Good Neo Traditional feels rich without becoming muddy or visually overworked.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why Neo Traditional still needs readability",
      body: "Even with more detail, Neo Traditional works best when the main shape is obvious and the eye knows where to land first. The strongest pieces still prioritize major forms, clean hierarchy, and controlled decorative detail rather than equal rendering everywhere.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in Neo Traditional",
      body: "Beginners often add too much detail too early, over-render every area equally, or bury strong form under decoration. Another problem is using color or detail without a clear primary shape, which makes the design look busy instead of strong.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice Neo Traditional",
      body: "Start with stylized subjects such as animal heads, floral clusters, or lady faces. Block primary forms first, then secondary forms, then decorative detail. Practice keeping the piece readable before adding more rendering and ornament.",
    },
    differences: {
      label: "How is it different?",
      title: "How Neo Traditional differs from Traditional",
      body: "Traditional is simpler, flatter, and more stripped down. Neo Traditional is usually more illustrative, more decorative, and more flexible with color and rendering. The challenge is gaining richness without losing the bold clarity that makes tattoo design strong.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not copy surface detail and color palettes without understanding the structure underneath. Neo Traditional can tempt beginners into thinking more detail means better design. It does not. If the main shape fails, the whole piece still fails.",
    },
    resources: {
      artists: ["Emily Rose Murray", "Valerie Vargas", "Tony Talbert"],
      youtubeSearches: [
        "neo traditional tattoo design breakdown",
        "neo traditional color planning",
        "how to draw neo traditional tattoo",
      ],
      googleSearches: [
        "neo traditional tattoo shape language",
        "neo traditional floral reference",
        "neo traditional tattoo color palette",
      ],
      studyTip:
        "If you remove the inner detail and the design falls apart, the base structure probably needs more work.",
    },
  },
  "fine-line": {
    definition: {
      label: "What defines this style?",
      title: "What defines Fine Line?",
      body: "Fine Line is defined by restraint, spacing, subtle linework, and minimal design decisions that still feel intentional. Thin lines do not remove the need for structure. The style succeeds when it stays elegant, controlled, and readable without feeling crowded.",
    },
    history: {
      label: "Brief history",
      title: "Brief history of Fine Line",
      body: "Fine Line gained wider popularity through minimal tattoo trends, delicate botanical work, micro designs, and cleaner modern aesthetics. As it spread, it became known for subtle visual impact, but it still requires serious discipline because thin work exposes mistakes quickly.",
    },
    focus: {
      label: "What should I focus on?",
      title: "What to focus on when studying Fine Line",
      body: "Pay attention to spacing, restraint, confidence in each line, and the overall simplicity of the design. Study how much is left out, not just what is included. Strong Fine Line usually feels calm and deliberate rather than overfilled.",
    },
    readability: {
      label: "What makes it readable?",
      title: "Why Fine Line still needs readability",
      body: "Fine Line remains readable when the composition is open enough to breathe and the subject is still easy to understand. Thin lines do not excuse weak structure. If the design gets too tiny, too crowded, or too detailed, it loses clarity fast.",
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: "Common beginner mistakes in Fine Line",
      body: "Beginners often mistake minimal for easy, crowd tiny elements together, or use weak shaky linework because they are too hesitant. Another common issue is trying to fit too much information into a delicate design that should stay simple.",
    },
    practice: {
      label: "How should I practice?",
      title: "How to practice Fine Line",
      body: "Practice simple stems, leaves, symbols, ornaments, and tiny layouts with controlled spacing. Repeat the same small forms slowly and cleanly. Focus on line confidence and restraint. A strong simple design is more valuable than a weak complicated one.",
    },
    differences: {
      label: "How is it different?",
      title: "How Fine Line differs from heavier tattoo styles",
      body: "Compared with Traditional or Neo Traditional, Fine Line depends less on bold silhouette and heavy contrast and more on subtle composition, elegant spacing, and precision. It is less forgiving, which means the small decisions matter more than they first appear.",
    },
    avoid: {
      label: "What should I avoid?",
      title: "What to avoid copying blindly",
      body: "Do not assume that because the lines are thin, the design can ignore structure. Avoid copying overly delicate references without understanding spacing and scale. Fine Line should still feel planned, not fragile or accidental.",
    },
    resources: {
      artists: ["Dr. Woo", "Miryam Lumpini", "JonBoy"],
      youtubeSearches: [
        "fine line tattoo design practice",
        "minimal tattoo composition breakdown",
        "botanical fine line drawing study",
      ],
      googleSearches: [
        "fine line tattoo reference study",
        "minimal tattoo spacing examples",
        "fine line botanical tattoo design",
      ],
      studyTip:
        "When in doubt, remove something. Fine Line usually improves through restraint, not addition.",
    },
  },
};

function getFocusFromDrillTitle(title: string) {
  const normalized = title.toLowerCase();

  if (
    normalized.includes("line") ||
    normalized.includes("outline") ||
    normalized.includes("letter") ||
    normalized.includes("script")
  ) {
    return "Linework";
  }

  if (
    normalized.includes("shade") ||
    normalized.includes("black and grey") ||
    normalized.includes("value")
  ) {
    return "Shading";
  }

  if (
    normalized.includes("composition") ||
    normalized.includes("layout") ||
    normalized.includes("hierarchy")
  ) {
    return "Composition";
  }

  return "Flash Redraw";
}

function getCoachContent(
  styleId: string,
  styleName: string,
): CoachStyleContent {
  const directMatch = STYLE_COACH[styleId];
  if (directMatch) return directMatch;

  return {
    definition: {
      label: "What defines this style?",
      title: `What defines ${styleName}?`,
      body: `${styleName} should be studied through its structure, readability, subject choices, and the way its visual language stays consistent across different designs.`,
    },
    history: {
      label: "Brief history",
      title: `Brief history of ${styleName}`,
      body: `${styleName} developed through artists building recognizable visual rules, repeated subjects, and design habits that made the style identifiable over time.`,
    },
    focus: {
      label: "What should I focus on?",
      title: `What to focus on when studying ${styleName}`,
      body: `Focus on the big shapes first, then the supporting detail, then the finishing decisions. Study what repeats across the style rather than getting distracted by one-off designs.`,
    },
    readability: {
      label: "What makes it readable?",
      title: `Why ${styleName} stays readable`,
      body: `Readability usually comes from strong hierarchy, clear shape decisions, and enough spacing or contrast to keep the subject easy to understand.`,
    },
    mistakes: {
      label: "Common beginner mistakes",
      title: `Common beginner mistakes in ${styleName}`,
      body: `A common mistake is chasing surface detail before understanding the bigger structure. Beginners also tend to copy appearances without understanding what makes the style hold together.`,
    },
    practice: {
      label: "How should I practice?",
      title: `How to practice ${styleName}`,
      body: `Practice by redrawing simple references, breaking them into major shapes, and building your own variations instead of copying exact finished designs.`,
    },
    differences: {
      label: "How is it different?",
      title: `How ${styleName} differs from similar styles`,
      body: `${styleName} becomes easier to understand when you compare its shape language, detail level, rendering choices, and readability against nearby styles instead of looking at it in isolation.`,
    },
    avoid: {
      label: "What should I avoid?",
      title: `What to avoid when studying ${styleName}`,
      body: `Avoid blindly copying finished pieces or chasing style too early. Build understanding first, then apply that understanding to your own studies.`,
    },
    resources: {
      artists: ["Search respected artists in this style"],
      youtubeSearches: [
        `${styleName.toLowerCase()} tattoo breakdown`,
        `how to study ${styleName.toLowerCase()} tattoo`,
      ],
      googleSearches: [
        `${styleName.toLowerCase()} tattoo references`,
        `${styleName.toLowerCase()} tattoo design rules`,
      ],
      studyTip:
        "Use outside resources to deepen your eye, but always come back and redraw what you learned in your own way.",
    },
  };
}

export default function StyleDetail() {
  const [, params] = useRoute("/styles/:id");
  const styleId = params?.id || "";
  const { data: apiStyle, isLoading } = useStyle(styleId);
  const [activeCoachTopic, setActiveCoachTopic] =
    useState<CoachTopicKey>("definition");

  const fallbackStyle = useMemo(() => {
    return fallbackStyles.find((style) => style.id === styleId) || null;
  }, [styleId]);

  const style = (apiStyle as StyleItem | undefined) ?? fallbackStyle ?? null;

  const flashSheetConfig = flashSheetConfigByStyleId[styleId] || {
    src: "",
    baseX: 50,
    baseY: 35,
    offsetX: 0,
    offsetY: 0,
  };

  const flashSheetSrc = flashSheetConfig.src;

  const drills: Drill[] = useMemo(() => {
    if (!style?.drills) return [];

    try {
      return JSON.parse(style.drills) as Drill[];
    } catch {
      return [];
    }
  }, [style]);

  const coachContent = useMemo(() => {
    return getCoachContent(styleId, style?.name || "This style");
  }, [styleId, style?.name]);

  const activeTopic = coachContent[activeCoachTopic];

  if (isLoading && !style) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!style) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Style not found</h2>
          <p className="mt-2 text-muted-foreground">
            The style you are looking for could not be loaded.
          </p>
          <Link href="/styles">
            <Button className="mt-6">Back to Styles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center">
          <Link href="/styles">
            <Button
              variant="ghost"
              className="gap-2 pl-0 text-white hover:bg-transparent hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Styles
            </Button>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/8">
          <div className="h-[320px]">
            <img
              src={style.previewImage}
              alt={style.name}
              className="h-full w-full object-cover"
              style={
                styleId === "lettering"
                  ? { objectPosition: "center center" }
                  : undefined
              }
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap gap-2">
                {(style.tags || []).map((tag) => (
                  <Badge
                    key={tag}
                    className="border-0 bg-white/10 text-white backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {style.name}
              </h1>

              <p className="max-w-2xl border-l-4 border-red-500 pl-4 text-sm italic text-white/85 md:text-lg">
                {style.definition}
              </p>

              <p className="text-sm text-white/60">Study Reference</p>
            </div>
          </div>
        </section>

        <Card className="border-white/8 bg-card shadow-none">
          <CardContent className="p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-300">
              <BrainCircuit className="h-3.5 w-3.5 text-red-400" />
              AI Tattoo Coach
            </div>

            <h2 className="text-xl font-semibold text-white">
              Learn the style before trying to force the style.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
              Use the coach to understand what defines {style.name}, what
              beginners usually get wrong, how to study it properly, and where
              to go deeper when you need better references.
            </p>
          </CardContent>
        </Card>

        {flashSheetSrc ? (
          <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <ImageIcon className="h-5 w-5 text-red-400" />
                Flash Sheet Preview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                Use this flash sheet as a study reference for {style.name}.
                Focus on structure, readability, spacing, subject choices, and
                how the style holds together before moving into practice drills.
              </p>

              <div className="relative h-[320px] overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] sm:h-[420px]">
                <img
                  src={flashSheetSrc}
                  alt={`${style.name} flash sheet`}
                  className="absolute left-0 top-0 h-full w-full object-cover"
                  style={{
                    objectPosition: `${flashSheetConfig.baseX}% ${flashSheetConfig.baseY}%`,
                    transform: `translate(${flashSheetConfig.offsetX}px, ${flashSheetConfig.offsetY}px)`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <BookOpen className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Study the rules</p>
              <p className="mt-1 text-sm text-zinc-400">
                Learn what makes this style readable.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Avoid mistakes</p>
              <p className="mt-1 text-sm text-zinc-400">
                Spot where beginners usually lose clarity.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/8 bg-card shadow-none">
            <CardContent className="p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Star className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-semibold text-white">Practice with intent</p>
              <p className="mt-1 text-sm text-zinc-400">
                Use drills to reinforce structure, not imitation.
              </p>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-6 rounded-none border-b border-white/8 bg-transparent p-0">
            <TabsTrigger
              value="rules"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Study Guide
            </TabsTrigger>

            <TabsTrigger
              value="coach"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              AI Style Coach
            </TabsTrigger>

            <TabsTrigger
              value="drills"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-semibold data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Practice Drills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="mt-8 space-y-8">
            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">
                    Core Principles
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.rules.map((rule, i) => (
                    <Card
                      key={i}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] shadow-none"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-sm font-bold text-red-400">
                            {i + 1}
                          </div>
                          <p className="leading-7 text-zinc-300">{rule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">
                    Common Mistakes
                  </h3>
                </div>

                <div className="space-y-4">
                  {style.commonMistakes.map((mistake, i) => (
                    <Alert
                      key={i}
                      variant="destructive"
                      className="rounded-2xl border-red-500/20 bg-red-500/8"
                    >
                      <AlertTitle className="font-semibold text-white">
                        Avoid this
                      </AlertTitle>
                      <AlertDescription className="leading-6 text-zinc-300">
                        {mistake}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
              <CardContent className="flex gap-4 p-6">
                <Info className="mt-1 h-6 w-6 flex-shrink-0 text-red-400" />
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    Study focus
                  </h4>
                  <p className="text-zinc-400">
                    When studying {style.name}, focus on{" "}
                    <span className="font-semibold text-white">
                      clarity over complexity
                    </span>
                    . Strong work reads fast, feels intentional, and holds up at
                    a glance before anyone notices the details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="mt-8 space-y-8">
            <Card className="rounded-3xl border border-white/8 bg-card shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <BrainCircuit className="h-5 w-5 text-red-400" />
                  AI Style Coach
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="max-w-3xl text-sm leading-7 text-zinc-400">
                  Ask about the style, how to study it, what usually goes wrong,
                  and where to look next for better references. This is meant to
                  coach understanding — not generate designs to copy.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {coachTopicOrder.map((topicKey) => {
                    const topic = coachContent[topicKey];
                    const isActive = activeCoachTopic === topicKey;

                    return (
                      <Button
                        key={topicKey}
                        type="button"
                        variant="outline"
                        onClick={() => setActiveCoachTopic(topicKey)}
                        className={`h-auto min-h-12 justify-start whitespace-normal border-white/10 px-4 py-3 text-left text-white hover:bg-white/5 ${
                          isActive ? "border-red-500/40 bg-red-500/10" : ""
                        }`}
                      >
                        {topic.label}
                      </Button>
                    );
                  })}
                </div>

                <Card className="rounded-3xl border border-white/8 bg-white/[0.03] shadow-none">
                  <CardContent className="space-y-6 p-5 sm:p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-red-300">
                        Coach response
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        {activeTopic.title}
                      </h3>
                      <p className="mt-3 leading-7 text-zinc-300">
                        {activeTopic.body}
                      </p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                      <Card className="rounded-2xl border border-white/8 bg-card shadow-none">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4 text-red-400" />
                            <p className="font-semibold text-white">
                              Artists to study
                            </p>
                          </div>

                          <ul className="space-y-2 text-sm text-zinc-300">
                            {coachContent.resources.artists.map((artist) => (
                              <li key={artist}>• {artist}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border border-white/8 bg-card shadow-none">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Search className="h-4 w-4 text-red-400" />
                            <p className="font-semibold text-white">
                              Search on YouTube
                            </p>
                          </div>

                          <ul className="space-y-2 text-sm text-zinc-300">
                            {coachContent.resources.youtubeSearches.map(
                              (search) => (
                                <li key={search}>• "{search}"</li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border border-white/8 bg-card shadow-none">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Search className="h-4 w-4 text-red-400" />
                            <p className="font-semibold text-white">
                              Search on Google
                            </p>
                          </div>

                          <ul className="space-y-2 text-sm text-zinc-300">
                            {coachContent.resources.googleSearches.map(
                              (search) => (
                                <li key={search}>• "{search}"</li>
                              ),
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="rounded-2xl border border-red-500/20 bg-red-500/8 shadow-none">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-white">
                          Study tip
                        </p>
                        <p className="mt-2 text-sm leading-7 text-zinc-300">
                          {coachContent.resources.studyTip}
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="mt-8 space-y-8">
            {drills.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-white/10 bg-card shadow-none">
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                  <p className="text-lg font-semibold text-white">
                    No drills yet
                  </p>
                  <p className="mt-2 max-w-md text-sm text-zinc-400">
                    This style does not have drills loaded yet, but the page is
                    ready for them when your API data grows.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {drills.map((drill, i) => {
                  const focus = getFocusFromDrillTitle(drill.title);
                  const practiceHref = `/practice?style=${encodeURIComponent(
                    style.name,
                  )}&focus=${encodeURIComponent(
                    focus,
                  )}&duration=${drill.minutes}&prompt=${encodeURIComponent(
                    drill.prompt,
                  )}`;

                  return (
                    <Card
                      key={i}
                      className="flex flex-col rounded-3xl border border-white/8 bg-card shadow-none transition-colors hover:border-red-500/30"
                    >
                      <CardHeader className="space-y-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Drill #{i + 1} • {drill.minutes} min
                        </div>
                        <CardTitle className="text-2xl text-white">
                          {drill.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <p className="leading-7 text-zinc-400">
                          {drill.prompt}
                        </p>
                      </CardContent>

                      <div className="p-6 pt-0">
                        <Link href={practiceHref}>
                          <Button className="group w-full bg-red-600 text-white hover:bg-red-500">
                            Practice this drill
                            <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
