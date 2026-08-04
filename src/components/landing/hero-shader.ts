/**
 * HeroShaderBackground — v2
 * ---------------------------------------------------------------------------
 * TWO-PASS architecture. This is the key change from v1.
 *
 *   Pass 1 -> renders the Perlin fbm noise field into a small offscreen
 *             framebuffer, sized at ONE TEXEL PER GLYPH CELL.
 *   Pass 2 -> fullscreen. Reads one texel per cell (NEAREST filtering), so
 *             every pixel in a cell shares one value, then draws a hard-edged
 *             rectangle whose width AND height scale with that value, and
 *             colours it through the 4-stop gradient map.
 *
 * Why two passes:
 *   1. CORRECTNESS. v1 evaluated noise per-pixel and dithered afterwards, so
 *      cells were never uniform -> the grainy mush. Sampling once per cell is
 *      what makes the rectangles flat and crisp.
 *   2. SPEED. fbm(4 octaves) x 5 blur taps = 20 noise evaluations. At full res
 *      on a 2560x1440 that is ~100M evals/frame. With 5x9 px cells the noise
 *      pass runs at ~1/45th the pixel count. Same image, a fraction of the ALU.
 *
 * Glyph model (derived from the zoomed reference):
 *   level L = quantized cell luminance
 *   bar width  = mix(minW, maxW, L)   -> dim cells are thin
 *   bar height = mix(minH, 1.0,  L)   -> dim cells are short dashes with gaps;
 *                                        at L=1 the bar fills the cell and
 *                                        merges with its vertical neighbours
 *                                        into a continuous run
 *
 * Gradient is dark-dominant: background is locked to the darkest stop and the
 * luminance curve is biased with `contrast` so the mint/white stops only appear
 * at the peaks of the noise field.
 *
 * APPROXIMATED, not ported: Unicorn Studio's exact Noise Blur kernel and its
 * Color Shift curve are internal to their engine. These are matched by eye.
 * Everything else maps 1:1 to the panel values.
 */

// Fullscreen triangle. Shared by both passes.
const VERT_SRC = `#version 300 es
const vec2 verts[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}`;

// ---------------------------------------------------------------------------
// PASS 1 - noise field, one texel per cell
// ---------------------------------------------------------------------------
const NOISE_FRAG_SRC = `#version 300 es
precision highp float;

uniform vec2  u_cellResolution;
uniform vec2  u_pixelResolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_mouseInfluence;
uniform float u_mouseRadius;
uniform float u_mouseStrength;
uniform float u_scale;
uniform float u_skew;
uniform float u_angle;
uniform vec2  u_drift;
uniform float u_blurAmount;
uniform float u_gain;

out vec4 fragColor;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
}

float gradNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

const mat2 OCTAVE_ROT = mat2(0.80, 0.60, -0.60, 0.80);

// Noise Fill: Perlin, 4 octaves, rotated per octave to kill axis alignment.
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * gradNoise(p);
    p = OCTAVE_ROT * p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return sum;
}

// Noise Blur: directional multi-tap average. A true separable Gaussian would
// need yet another pass; for procedural noise this reads the same.
float blurredFbm(vec2 p, float amount, float angle) {
  vec2 dir = vec2(cos(angle), sin(angle));
  float total = 0.0;
  const int N = 5;
  for (int i = 0; i < N; i++) {
    float t = (float(i) / float(N - 1) - 0.5) * 2.0;
    total += fbm(p + dir * t * amount);
  }
  return total / float(N);
}

void main() {
  // This fragment IS one cell. Find where that cell sits on screen.
  vec2 cellIndex = gl_FragCoord.xy;
  vec2 uv = (cellIndex + 0.5) / u_cellResolution;

  float aspect = u_pixelResolution.x / max(u_pixelResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Pointer interaction: push the noise field radially away from the cursor.
  // Only the FIELD is warped; the cell grid lives in screen space, so the
  // rectangles stay perfectly aligned while their values shift.
  vec2 mouseP = (u_mouse - 0.5) * vec2(aspect, 1.0);
  vec2 toP = p - mouseP;
  float d = length(toP);
  float r = max(u_mouseRadius, 1e-4);
  float falloff = exp(-(d * d) / (r * r));
  p += normalize(toP + 1e-5) * u_mouseStrength * falloff * u_mouseInfluence;

  mat2 skewMat = mat2(1.0, u_skew, 0.0, 1.0);
  mat2 rotMat  = mat2(cos(u_angle), -sin(u_angle), sin(u_angle), cos(u_angle));
  vec2 q = rotMat * skewMat * (p * u_scale);

  // Perpetual motion. Drift only - the colour ramp is NOT animated, which is
  // what made v1 wash out to white.
  q += u_drift * u_time;

  // GAIN. Measured: raw fbm here only spans about -0.41..0.24 (std 0.13), so
  // the naive *0.5+0.5 mapping compresses everything into 0.30..0.62. After
  // the contrast curve nothing ever reached the mint/white stops. Expanding
  // around the midpoint is what makes the full ramp usable.
  float n = blurredFbm(q, u_blurAmount, u_angle + 0.7) * u_gain + 0.5;
  fragColor = vec4(clamp(n, 0.0, 1.0), 0.0, 0.0, 1.0);
}`;

// ---------------------------------------------------------------------------
// PASS 2 - glyph rectangles + gradient map
// ---------------------------------------------------------------------------
const GLYPH_FRAG_SRC = `#version 300 es
precision highp float;

uniform sampler2D u_noise;
uniform vec2  u_cellPx;
uniform float u_levels;
uniform float u_contrast;
uniform float u_floor;
uniform float u_widthSteps[5];
uniform float u_columnJitter;
uniform float u_edgeSoftness;

uniform vec3  u_c0;
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;
uniform float u_p1;
uniform float u_p2;

out vec4 fragColor;

float hash1(vec2 p) {
  return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453123);
}

// Gradient Map, stops straight from your panel. NOT animated and NOT mirrored:
// index 0 is the dark teal and it stays the dominant colour of the frame.
vec3 gradientMap(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 col = u_c0;
  col = mix(col, u_c1, smoothstep(0.0,  u_p1, t));
  col = mix(col, u_c2, smoothstep(u_p1, u_p2, t));
  col = mix(col, u_c3, smoothstep(u_p2, 1.0,  t));
  return col;
}

void main() {
  vec2 cell   = floor(gl_FragCoord.xy / u_cellPx);
  vec2 cellUv = fract(gl_FragCoord.xy / u_cellPx);

  // ONE texel per cell. NEAREST filtering + texelFetch means every pixel in
  // this cell reads the identical value -> flat, uniform rectangles.
  float v = texelFetch(u_noise, ivec2(cell), 0).r;

  // Per-COLUMN static offset, hashed on cell.x only. Two reasons it is not
  // per-cell: (a) a per-cell offset jitters the width between vertically
  // adjacent cells, which chews ragged notches into the edge of a continuous
  // column; (b) a column-wide bias is what produces the "some columns are
  // consistently thinner than their neighbours" read in the reference.
  // Static, never time-varying, so it cannot flicker.
  v += (hash1(vec2(cell.x, 0.0)) - 0.5) * u_columnJitter;

  // Bias dark. This is the inversion: most cells resolve to the dark teal,
  // and the mint/white stops are reserved for peaks.
  v = pow(clamp(v, 0.0, 1.0), u_contrast);

  // Quantize into discrete levels, so each segment is one flat colour.
  float L = clamp(floor(v * u_levels) / max(u_levels - 1.0, 1.0), 0.0, 1.0);

  vec3 background = u_c0;

  // Width and colour both scale with level; height does NOT. The bar spans the
  // full cell height so it butts seamlessly against the cells above and below,
  // forming one continuous column whose width and colour step along its length.
  //
  // Width is a fixed 5-rung ladder (2/4/6/8/10 css px, pre-divided into
  // cell-width fractions on the JS side), not a continuous mix. u_widthSteps
  // is already sized so the top rung plus its mandatory gap fits the cell.
  int band = int(clamp(floor(L * 5.0), 0.0, 4.0));
  float halfW = u_widthSteps[band] * 0.5;

  // Only the X edges are masked. There is deliberately no Y term: masking Y
  // -- even at exactly full height -- makes each cell's antialiasing fall to
  // zero at the boundary while its neighbour does the same, leaving a dark
  // hairline seam every cell. That seam is the vertical disconnection.
  float aaX = u_edgeSoftness / u_cellPx.x;
  float mask = 1.0 - smoothstep(halfW - aaX, halfW + aaX, abs(cellUv.x - 0.5));

  // At L=0 the gradient's first stop IS the background colour, so the dimmest
  // segments dissolve into the field on their own. No floor cutoff is needed
  // to hide them, which is what keeps columns unbroken through dark regions.
  if (L < u_floor) {
    fragColor = vec4(background, 1.0);
    return;
  }

  vec3 barColor = gradientMap(L);
  fragColor = vec4(mix(background, barColor, mask), 1.0);
}`;

// ---------------------------------------------------------------------------

export interface HeroShaderConfig {
  /** Noise field zoom. Lower = larger, softer blobs. */
  scale: number;
  /** Noise Fill > Skew. */
  skew: number;
  /** Noise Fill > Angle, in radians. */
  angle: number;
  /** Idle auto-animation speed, 0-100. Drives the field's perpetual drift on
   *  its own timer — fully decoupled from the pointer, so the pattern is
   *  never static while the cursor is still. 10 is the calibrated baseline. */
  autoSpeed: number;
  /** Noise Blur > Amount. */
  blurAmount: number;
  /** Contrast expansion applied to the raw fbm. Without this the field is too
   *  flat to ever reach the bright gradient stops. */
  gain: number;

  /** Cell width in CSS px. Smaller = denser columns. */
  cellWidth: number;
  /** Cell height in CSS px. Taller than wide gives the elongated tick look. */
  cellHeight: number;
  /** Quantization steps. Fewer = chunkier, more poster-like. */
  levels: number;
  /** >1 pushes the field dark. Main dial for "how much dark green". */
  contrast: number;
  /** Levels below this draw nothing but background. */
  floor: number;
  /** Static per-column width bias. Makes some columns consistently thinner
   *  than their neighbours. Keep small; 0 disables. */
  columnJitter: number;
  /** Antialiasing width in device px. 0 = hard aliased edges. */
  edgeSoftness: number;

  /** Gradient stops, hex, dark -> light. */
  colors: [string, string, string, string];
  /** Positions of the middle two stops, 0..1. */
  stop1: number;
  stop2: number;

  /** Pointer warp radius, normalized units. */
  mouseRadius: number;
  /** Pointer warp displacement. */
  mouseStrength: number;

  /** devicePixelRatio cap. */
  pixelRatio: number;
}

const DEFAULTS: HeroShaderConfig = {
  scale: 2.2,
  skew: 0.55,
  angle: 0.4,
  autoSpeed: 10,
  blurAmount: 0.09,
  gain: 2.6,

  cellWidth: 20,
  cellHeight: 18,
  levels: 8,
  contrast: 1.6,
  floor: 0.0,
  columnJitter: 0.07,
  edgeSoftness: 0.75,

  colors: ["#183538", "#12BD64", "#A0E5C1", "#F4F4FF"],
  stop1: 0.434,
  stop2: 0.656,

  mouseRadius: 0.28,
  mouseStrength: 0.12,

  pixelRatio: 2,
};

/** Public export so a debug/tuning panel can read starting values. */
export const HERO_SHADER_DEFAULTS: HeroShaderConfig = DEFAULTS;

// Glyph width ladder: always exactly 5 rungs in arithmetic progression
// (1x, 2x, 3x, 4x, 5x a base step), so the ratio between rungs is fixed --
// e.g. 2/4/6/8/10 -- but the base step itself scales with cellWidth so the
// "Cell Width" control actually grows the glyphs, not just the gap between
// them. Widest rung (5x) + its mandatory gap (2x, per spec) = 7x, which is
// why the pitch is divided by 7: the ladder always exactly fits the cell
// with zero slack, no separate clamping required.
const WIDTH_RUNGS = [1, 2, 3, 4, 5] as const;
const PITCH_UNITS = WIDTH_RUNGS[WIDTH_RUNGS.length - 1] + 2 * WIDTH_RUNGS[0];
// Baseline drift vector for autoSpeed = 10 (the calibrated "10%" default).
const BASE_DRIFT: [number, number] = [0.03, -0.018];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const int = parseInt(full, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

export class HeroShaderBackground {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private config: HeroShaderConfig;

  private noiseProgram: WebGLProgram;
  private glyphProgram: WebGLProgram;
  private noiseU: Record<string, WebGLUniformLocation | null> = {};
  private glyphU: Record<string, WebGLUniformLocation | null> = {};

  private vao: WebGLVertexArrayObject;
  private fbo: WebGLFramebuffer;
  private noiseTex: WebGLTexture;

  private cellCols = 1;
  private cellRows = 1;
  private cellPxW = 1;
  private cellPxH = 1;
  private widthStepsFrac: number[] = WIDTH_RUNGS.map(() => 0);

  private raf = 0;
  private startTime = performance.now();
  private elapsed = 0;

  private mouse = { x: 0.5, y: 0.5 };
  private mouseTarget = { x: 0.5, y: 0.5 };
  private influence = 0;
  private influenceTarget = 0;

  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private onScreen = true;
  private reducedMotion: boolean;
  private disposed = false;

  private onPointerMove: (e: PointerEvent) => void;
  private onPointerOut: () => void;

  constructor(canvas: HTMLCanvasElement, config: Partial<HeroShaderConfig> = {}) {
    this.canvas = canvas;
    this.config = { ...DEFAULTS, ...config };

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) throw new Error("WebGL2 is required for HeroShaderBackground");
    this.gl = gl;

    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.noiseProgram = this.link(VERT_SRC, NOISE_FRAG_SRC);
    this.glyphProgram = this.link(VERT_SRC, GLYPH_FRAG_SRC);
    this.cacheUniforms();

    const vao = gl.createVertexArray();
    if (!vao) throw new Error("Failed to create VAO");
    this.vao = vao;

    const tex = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!tex || !fbo) throw new Error("Failed to create render target");
    this.noiseTex = tex;
    this.fbo = fbo;

    gl.bindTexture(gl.TEXTURE_2D, this.noiseTex);
    // NEAREST is load-bearing: it keeps each cell a single flat value.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.noiseTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();

    // Listen on window so the effect keeps tracking the cursor across overlaid
    // hero content (headline, CTA) instead of dying on every child node.
    this.onPointerMove = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseTarget.x = (e.clientX - rect.left) / rect.width;
      this.mouseTarget.y = 1 - (e.clientY - rect.top) / rect.height;
      this.influenceTarget = 1;
    };
    this.onPointerOut = () => {
      this.influenceTarget = 0;
    };
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("blur", this.onPointerOut);

    this.io = new IntersectionObserver(([e]) => {
      this.onScreen = e.isIntersecting;
    });
    this.io.observe(canvas);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.raf = requestAnimationFrame(this.frame);
  }

  private link(vsSrc: string, fsSrc: string): WebGLProgram {
    const gl = this.gl;
    const vs = this.compile(gl.VERTEX_SHADER, vsSrc);
    const fs = this.compile(gl.FRAGMENT_SHADER, fsSrc);
    const p = gl.createProgram();
    if (!p) throw new Error("Failed to create program");
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(`Program link failed: ${info}`);
    }
    return p;
  }

  private compile(type: number, src: string): WebGLShader {
    const gl = this.gl;
    const s = gl.createShader(type);
    if (!s) throw new Error("Failed to create shader");
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(`Shader compile failed: ${info}`);
    }
    return s;
  }

  private cacheUniforms() {
    const gl = this.gl;
    const noiseNames = [
      "u_cellResolution",
      "u_pixelResolution",
      "u_time",
      "u_mouse",
      "u_mouseInfluence",
      "u_mouseRadius",
      "u_mouseStrength",
      "u_scale",
      "u_skew",
      "u_angle",
      "u_drift",
      "u_blurAmount",
      "u_gain",
    ];
    for (const n of noiseNames) {
      this.noiseU[n] = gl.getUniformLocation(this.noiseProgram, n);
    }
    const glyphNames = [
      "u_noise",
      "u_cellPx",
      "u_levels",
      "u_contrast",
      "u_floor",
      "u_widthSteps",
      "u_columnJitter",
      "u_edgeSoftness",
      "u_c0",
      "u_c1",
      "u_c2",
      "u_c3",
      "u_p1",
      "u_p2",
    ];
    for (const n of glyphNames) {
      this.glyphU[n] = gl.getUniformLocation(this.glyphProgram, n);
    }
  }

  private resize = () => {
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, this.config.pixelRatio);
    const rect = this.canvas.getBoundingClientRect();

    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    // Cell size is specified in CSS px, so density reads identically at any DPR.
    this.cellPxW = Math.max(1, this.config.cellWidth * dpr);
    this.cellPxH = Math.max(1, this.config.cellHeight * dpr);
    this.cellCols = Math.max(1, Math.ceil(w / this.cellPxW));
    this.cellRows = Math.max(1, Math.ceil(h / this.cellPxH));

    // Base step derived from the pitch itself, so "Cell Width" actually
    // resizes the glyphs. Expressed directly as cell-width fractions since
    // that's what the shader mask compares against.
    const baseStepFrac = 1 / PITCH_UNITS;
    this.widthStepsFrac = WIDTH_RUNGS.map((n) => n * baseStepFrac);

    gl.bindTexture(gl.TEXTURE_2D, this.noiseTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.R8,
      this.cellCols,
      this.cellRows,
      0,
      gl.RED,
      gl.UNSIGNED_BYTE,
      null,
    );
  };

  private onVisibility = () => {
    if (document.visibilityState === "visible") {
      // Rebase the clock so the field does not jump after a hidden tab.
      this.startTime = performance.now() - this.elapsed * 1000;
    }
  };

  private frame = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (!this.onScreen || document.hidden) return;

    const gl = this.gl;
    const cfg = this.config;

    this.mouse.x += (this.mouseTarget.x - this.mouse.x) * 0.07;
    this.mouse.y += (this.mouseTarget.y - this.mouse.y) * 0.07;
    this.influence += (this.influenceTarget - this.influence) * 0.05;

    const speed = this.reducedMotion ? 0.06 : 1.0;
    this.elapsed = ((now - this.startTime) / 1000) * speed;

    gl.bindVertexArray(this.vao);

    // ---- Pass 1: noise -> offscreen, one texel per cell -------------------
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.cellCols, this.cellRows);
    gl.useProgram(this.noiseProgram);
    gl.uniform2f(this.noiseU.u_cellResolution, this.cellCols, this.cellRows);
    gl.uniform2f(this.noiseU.u_pixelResolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.noiseU.u_time, this.elapsed);
    gl.uniform2f(this.noiseU.u_mouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.noiseU.u_mouseInfluence, this.influence);
    gl.uniform1f(this.noiseU.u_mouseRadius, cfg.mouseRadius);
    gl.uniform1f(this.noiseU.u_mouseStrength, cfg.mouseStrength);
    gl.uniform1f(this.noiseU.u_scale, cfg.scale);
    gl.uniform1f(this.noiseU.u_skew, cfg.skew);
    gl.uniform1f(this.noiseU.u_angle, cfg.angle);
    const speedMul = cfg.autoSpeed / 10;
    gl.uniform2f(this.noiseU.u_drift, BASE_DRIFT[0] * speedMul, BASE_DRIFT[1] * speedMul);
    gl.uniform1f(this.noiseU.u_blurAmount, cfg.blurAmount);
    gl.uniform1f(this.noiseU.u_gain, cfg.gain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---- Pass 2: glyph rectangles -> screen -------------------------------
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.glyphProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.noiseTex);
    gl.uniform1i(this.glyphU.u_noise, 0);
    gl.uniform2f(this.glyphU.u_cellPx, this.cellPxW, this.cellPxH);
    gl.uniform1f(this.glyphU.u_levels, cfg.levels);
    gl.uniform1f(this.glyphU.u_contrast, cfg.contrast);
    gl.uniform1f(this.glyphU.u_floor, cfg.floor);
    gl.uniform1fv(this.glyphU.u_widthSteps, this.widthStepsFrac);
    gl.uniform1f(this.glyphU.u_columnJitter, cfg.columnJitter);
    gl.uniform1f(this.glyphU.u_edgeSoftness, cfg.edgeSoftness);

    const rgb = cfg.colors.map(hexToRgb);
    gl.uniform3f(this.glyphU.u_c0, rgb[0][0], rgb[0][1], rgb[0][2]);
    gl.uniform3f(this.glyphU.u_c1, rgb[1][0], rgb[1][1], rgb[1][2]);
    gl.uniform3f(this.glyphU.u_c2, rgb[2][0], rgb[2][1], rgb[2][2]);
    gl.uniform3f(this.glyphU.u_c3, rgb[3][0], rgb[3][1], rgb[3][2]);
    gl.uniform1f(this.glyphU.u_p1, cfg.stop1);
    gl.uniform1f(this.glyphU.u_p2, cfg.stop2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(null);
  };

  /** Read current config, e.g. to seed a tuning panel's initial slider values. */
  public getConfig(): HeroShaderConfig {
    return { ...this.config };
  }

  /** Live-tune from a debug panel without rebuilding. */
  public setConfig(patch: Partial<HeroShaderConfig>) {
    const needsResize =
      patch.cellWidth !== undefined ||
      patch.cellHeight !== undefined ||
      patch.pixelRatio !== undefined;
    this.config = { ...this.config, ...patch };
    if (needsResize) this.resize();
  }

  public destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("blur", this.onPointerOut);
    const gl = this.gl;
    gl.deleteFramebuffer(this.fbo);
    gl.deleteTexture(this.noiseTex);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.noiseProgram);
    gl.deleteProgram(this.glyphProgram);
  }
}
