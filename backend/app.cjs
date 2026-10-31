"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// generated/prisma/runtime/library.js
var require_library = __commonJS({
  "generated/prisma/runtime/library.js"(exports2, module2) {
    "use strict";
    var yu = Object.create;
    var jt = Object.defineProperty;
    var bu = Object.getOwnPropertyDescriptor;
    var Eu = Object.getOwnPropertyNames;
    var wu = Object.getPrototypeOf;
    var xu = Object.prototype.hasOwnProperty;
    var Do = (e, r) => () => (e && (r = e(e = 0)), r);
    var ue = (e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports);
    var tr = (e, r) => {
      for (var t in r) jt(e, t, { get: r[t], enumerable: true });
    };
    var Oo = (e, r, t, n) => {
      if (r && typeof r == "object" || typeof r == "function") for (let i of Eu(r)) !xu.call(e, i) && i !== t && jt(e, i, { get: () => r[i], enumerable: !(n = bu(r, i)) || n.enumerable });
      return e;
    };
    var O = (e, r, t) => (t = e != null ? yu(wu(e)) : {}, Oo(r || !e || !e.__esModule ? jt(t, "default", { value: e, enumerable: true }) : t, e));
    var vu = (e) => Oo(jt({}, "__esModule", { value: true }), e);
    var hi = ue((_g, is) => {
      "use strict";
      is.exports = (e, r = process.argv) => {
        let t = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = r.indexOf(t + e), i = r.indexOf("--");
        return n !== -1 && (i === -1 || n < i);
      };
    });
    var as = ue((Ng, ss) => {
      "use strict";
      var Fc = require("node:os"), os = require("node:tty"), de = hi(), { env: G } = process, Qe;
      de("no-color") || de("no-colors") || de("color=false") || de("color=never") ? Qe = 0 : (de("color") || de("colors") || de("color=true") || de("color=always")) && (Qe = 1);
      "FORCE_COLOR" in G && (G.FORCE_COLOR === "true" ? Qe = 1 : G.FORCE_COLOR === "false" ? Qe = 0 : Qe = G.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(G.FORCE_COLOR, 10), 3));
      function yi(e) {
        return e === 0 ? false : { level: e, hasBasic: true, has256: e >= 2, has16m: e >= 3 };
      }
      function bi(e, r) {
        if (Qe === 0) return 0;
        if (de("color=16m") || de("color=full") || de("color=truecolor")) return 3;
        if (de("color=256")) return 2;
        if (e && !r && Qe === void 0) return 0;
        let t = Qe || 0;
        if (G.TERM === "dumb") return t;
        if (process.platform === "win32") {
          let n = Fc.release().split(".");
          return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? Number(n[2]) >= 14931 ? 3 : 2 : 1;
        }
        if ("CI" in G) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((n) => n in G) || G.CI_NAME === "codeship" ? 1 : t;
        if ("TEAMCITY_VERSION" in G) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(G.TEAMCITY_VERSION) ? 1 : 0;
        if (G.COLORTERM === "truecolor") return 3;
        if ("TERM_PROGRAM" in G) {
          let n = parseInt((G.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
          switch (G.TERM_PROGRAM) {
            case "iTerm.app":
              return n >= 3 ? 3 : 2;
            case "Apple_Terminal":
              return 2;
          }
        }
        return /-256(color)?$/i.test(G.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(G.TERM) || "COLORTERM" in G ? 1 : t;
      }
      function Mc(e) {
        let r = bi(e, e && e.isTTY);
        return yi(r);
      }
      ss.exports = { supportsColor: Mc, stdout: yi(bi(true, os.isatty(1))), stderr: yi(bi(true, os.isatty(2))) };
    });
    var cs = ue((Lg, us) => {
      "use strict";
      var $c = as(), br = hi();
      function ls(e) {
        if (/^\d{3,4}$/.test(e)) {
          let t = /(\d{1,2})(\d{2})/.exec(e) || [];
          return { major: 0, minor: parseInt(t[1], 10), patch: parseInt(t[2], 10) };
        }
        let r = (e || "").split(".").map((t) => parseInt(t, 10));
        return { major: r[0], minor: r[1], patch: r[2] };
      }
      function Ei(e) {
        let { CI: r, FORCE_HYPERLINK: t, NETLIFY: n, TEAMCITY_VERSION: i, TERM_PROGRAM: o, TERM_PROGRAM_VERSION: s, VTE_VERSION: a, TERM: l } = process.env;
        if (t) return !(t.length > 0 && parseInt(t, 10) === 0);
        if (br("no-hyperlink") || br("no-hyperlinks") || br("hyperlink=false") || br("hyperlink=never")) return false;
        if (br("hyperlink=true") || br("hyperlink=always") || n) return true;
        if (!$c.supportsColor(e) || e && !e.isTTY) return false;
        if ("WT_SESSION" in process.env) return true;
        if (process.platform === "win32" || r || i) return false;
        if (o) {
          let u = ls(s || "");
          switch (o) {
            case "iTerm.app":
              return u.major === 3 ? u.minor >= 1 : u.major > 3;
            case "WezTerm":
              return u.major >= 20200620;
            case "vscode":
              return u.major > 1 || u.major === 1 && u.minor >= 72;
            case "ghostty":
              return true;
          }
        }
        if (a) {
          if (a === "0.50.0") return false;
          let u = ls(a);
          return u.major > 0 || u.minor >= 50;
        }
        switch (l) {
          case "alacritty":
            return true;
        }
        return false;
      }
      us.exports = { supportsHyperlink: Ei, stdout: Ei(process.stdout), stderr: Ei(process.stderr) };
    });
    var ps = ue((Kg, qc) => {
      qc.exports = { name: "@prisma/internals", version: "6.19.3", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "8.0.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/schema-engine-wasm": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
    });
    var Ti = ue((gh, Qc) => {
      Qc.exports = { name: "@prisma/engines-version", version: "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var on = ue((nn) => {
      "use strict";
      Object.defineProperty(nn, "__esModule", { value: true });
      nn.enginesVersion = void 0;
      nn.enginesVersion = Ti().prisma.enginesVersion;
    });
    var hs = ue((Ih, gs) => {
      "use strict";
      gs.exports = (e) => {
        let r = e.match(/^[ \t]*(?=\S)/gm);
        return r ? r.reduce((t, n) => Math.min(t, n.length), 1 / 0) : 0;
      };
    });
    var Di = ue((kh, Es) => {
      "use strict";
      Es.exports = (e, r = 1, t) => {
        if (t = { indent: " ", includeEmptyLines: false, ...t }, typeof e != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
        if (typeof r != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof r}\``);
        if (typeof t.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof t.indent}\``);
        if (r === 0) return e;
        let n = t.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return e.replace(n, t.indent.repeat(r));
      };
    });
    var vs = ue((jh, tp) => {
      tp.exports = { name: "dotenv", version: "16.5.0", description: "Loads environment variables from .env file", main: "lib/main.js", types: "lib/main.d.ts", exports: { ".": { types: "./lib/main.d.ts", require: "./lib/main.js", default: "./lib/main.js" }, "./config": "./config.js", "./config.js": "./config.js", "./lib/env-options": "./lib/env-options.js", "./lib/env-options.js": "./lib/env-options.js", "./lib/cli-options": "./lib/cli-options.js", "./lib/cli-options.js": "./lib/cli-options.js", "./package.json": "./package.json" }, scripts: { "dts-check": "tsc --project tests/types/tsconfig.json", lint: "standard", pretest: "npm run lint && npm run dts-check", test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000", "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov", prerelease: "npm test", release: "standard-version" }, repository: { type: "git", url: "git://github.com/motdotla/dotenv.git" }, homepage: "https://github.com/motdotla/dotenv#readme", funding: "https://dotenvx.com", keywords: ["dotenv", "env", ".env", "environment", "variables", "config", "settings"], readmeFilename: "README.md", license: "BSD-2-Clause", devDependencies: { "@types/node": "^18.11.3", decache: "^4.6.2", sinon: "^14.0.1", standard: "^17.0.0", "standard-version": "^9.5.0", tap: "^19.2.0", typescript: "^4.8.4" }, engines: { node: ">=12" }, browser: { fs: false } };
    });
    var As = ue((Bh, _e) => {
      "use strict";
      var Fi = require("node:fs"), Mi = require("node:path"), np = require("node:os"), ip = require("node:crypto"), op = vs(), Ts = op.version, sp = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
      function ap(e) {
        let r = {}, t = e.toString();
        t = t.replace(/\r\n?/mg, `
`);
        let n;
        for (; (n = sp.exec(t)) != null; ) {
          let i = n[1], o = n[2] || "";
          o = o.trim();
          let s = o[0];
          o = o.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), s === '"' && (o = o.replace(/\\n/g, `
`), o = o.replace(/\\r/g, "\r")), r[i] = o;
        }
        return r;
      }
      function lp(e) {
        let r = Rs(e), t = B.configDotenv({ path: r });
        if (!t.parsed) {
          let s = new Error(`MISSING_DATA: Cannot parse ${r} for an unknown reason`);
          throw s.code = "MISSING_DATA", s;
        }
        let n = Ss(e).split(","), i = n.length, o;
        for (let s = 0; s < i; s++) try {
          let a = n[s].trim(), l = cp(t, a);
          o = B.decrypt(l.ciphertext, l.key);
          break;
        } catch (a) {
          if (s + 1 >= i) throw a;
        }
        return B.parse(o);
      }
      function up(e) {
        console.log(`[dotenv@${Ts}][WARN] ${e}`);
      }
      function ot(e) {
        console.log(`[dotenv@${Ts}][DEBUG] ${e}`);
      }
      function Ss(e) {
        return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0 ? e.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
      }
      function cp(e, r) {
        let t;
        try {
          t = new URL(r);
        } catch (a) {
          if (a.code === "ERR_INVALID_URL") {
            let l = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
            throw l.code = "INVALID_DOTENV_KEY", l;
          }
          throw a;
        }
        let n = t.password;
        if (!n) {
          let a = new Error("INVALID_DOTENV_KEY: Missing key part");
          throw a.code = "INVALID_DOTENV_KEY", a;
        }
        let i = t.searchParams.get("environment");
        if (!i) {
          let a = new Error("INVALID_DOTENV_KEY: Missing environment part");
          throw a.code = "INVALID_DOTENV_KEY", a;
        }
        let o = `DOTENV_VAULT_${i.toUpperCase()}`, s = e.parsed[o];
        if (!s) {
          let a = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${o} in your .env.vault file.`);
          throw a.code = "NOT_FOUND_DOTENV_ENVIRONMENT", a;
        }
        return { ciphertext: s, key: n };
      }
      function Rs(e) {
        let r = null;
        if (e && e.path && e.path.length > 0) if (Array.isArray(e.path)) for (let t of e.path) Fi.existsSync(t) && (r = t.endsWith(".vault") ? t : `${t}.vault`);
        else r = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
        else r = Mi.resolve(process.cwd(), ".env.vault");
        return Fi.existsSync(r) ? r : null;
      }
      function Ps(e) {
        return e[0] === "~" ? Mi.join(np.homedir(), e.slice(1)) : e;
      }
      function pp(e) {
        !!(e && e.debug) && ot("Loading env from encrypted .env.vault");
        let t = B._parseVault(e), n = process.env;
        return e && e.processEnv != null && (n = e.processEnv), B.populate(n, t, e), { parsed: t };
      }
      function dp(e) {
        let r = Mi.resolve(process.cwd(), ".env"), t = "utf8", n = !!(e && e.debug);
        e && e.encoding ? t = e.encoding : n && ot("No encoding is specified. UTF-8 is used by default");
        let i = [r];
        if (e && e.path) if (!Array.isArray(e.path)) i = [Ps(e.path)];
        else {
          i = [];
          for (let l of e.path) i.push(Ps(l));
        }
        let o, s = {};
        for (let l of i) try {
          let u = B.parse(Fi.readFileSync(l, { encoding: t }));
          B.populate(s, u, e);
        } catch (u) {
          n && ot(`Failed to load ${l} ${u.message}`), o = u;
        }
        let a = process.env;
        return e && e.processEnv != null && (a = e.processEnv), B.populate(a, s, e), o ? { parsed: s, error: o } : { parsed: s };
      }
      function mp(e) {
        if (Ss(e).length === 0) return B.configDotenv(e);
        let r = Rs(e);
        return r ? B._configVault(e) : (up(`You set DOTENV_KEY but you are missing a .env.vault file at ${r}. Did you forget to build it?`), B.configDotenv(e));
      }
      function fp(e, r) {
        let t = Buffer.from(r.slice(-64), "hex"), n = Buffer.from(e, "base64"), i = n.subarray(0, 12), o = n.subarray(-16);
        n = n.subarray(12, -16);
        try {
          let s = ip.createDecipheriv("aes-256-gcm", t, i);
          return s.setAuthTag(o), `${s.update(n)}${s.final()}`;
        } catch (s) {
          let a = s instanceof RangeError, l = s.message === "Invalid key length", u = s.message === "Unsupported state or unable to authenticate data";
          if (a || l) {
            let c = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
            throw c.code = "INVALID_DOTENV_KEY", c;
          } else if (u) {
            let c = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
            throw c.code = "DECRYPTION_FAILED", c;
          } else throw s;
        }
      }
      function gp(e, r, t = {}) {
        let n = !!(t && t.debug), i = !!(t && t.override);
        if (typeof r != "object") {
          let o = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
          throw o.code = "OBJECT_REQUIRED", o;
        }
        for (let o of Object.keys(r)) Object.prototype.hasOwnProperty.call(e, o) ? (i === true && (e[o] = r[o]), n && ot(i === true ? `"${o}" is already defined and WAS overwritten` : `"${o}" is already defined and was NOT overwritten`)) : e[o] = r[o];
      }
      var B = { configDotenv: dp, _configVault: pp, _parseVault: lp, config: mp, decrypt: fp, parse: ap, populate: gp };
      _e.exports.configDotenv = B.configDotenv;
      _e.exports._configVault = B._configVault;
      _e.exports._parseVault = B._parseVault;
      _e.exports.config = B.config;
      _e.exports.decrypt = B.decrypt;
      _e.exports.parse = B.parse;
      _e.exports.populate = B.populate;
      _e.exports = B;
    });
    var Os = ue((Kh, cn) => {
      "use strict";
      cn.exports = (e = {}) => {
        let r;
        if (e.repoUrl) r = e.repoUrl;
        else if (e.user && e.repo) r = `https://github.com/${e.user}/${e.repo}`;
        else throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");
        let t = new URL(`${r}/issues/new`), n = ["body", "title", "labels", "template", "milestone", "assignee", "projects"];
        for (let i of n) {
          let o = e[i];
          if (o !== void 0) {
            if (i === "labels" || i === "projects") {
              if (!Array.isArray(o)) throw new TypeError(`The \`${i}\` option should be an array`);
              o = o.join(",");
            }
            t.searchParams.set(i, o);
          }
        }
        return t.toString();
      };
      cn.exports.default = cn.exports;
    });
    var Ki = ue((vb, ea) => {
      "use strict";
      ea.exports = /* @__PURE__ */ (function() {
        function e(r, t, n, i, o) {
          return r < t || n < t ? r > n ? n + 1 : r + 1 : i === o ? t : t + 1;
        }
        return function(r, t) {
          if (r === t) return 0;
          if (r.length > t.length) {
            var n = r;
            r = t, t = n;
          }
          for (var i = r.length, o = t.length; i > 0 && r.charCodeAt(i - 1) === t.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && r.charCodeAt(s) === t.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, l, u, c, p, d, f, h, g, I, T, S, b, D = [];
          for (l = 0; l < i; l++) D.push(l + 1), D.push(r.charCodeAt(s + l));
          for (var me4 = D.length - 1; a < o - 3; ) for (I = t.charCodeAt(s + (u = a)), T = t.charCodeAt(s + (c = a + 1)), S = t.charCodeAt(s + (p = a + 2)), b = t.charCodeAt(s + (d = a + 3)), f = a += 4, l = 0; l < me4; l += 2) h = D[l], g = D[l + 1], u = e(h, u, c, I, g), c = e(u, c, p, T, g), p = e(c, p, d, S, g), f = e(p, d, f, b, g), D[l] = f, d = p, p = c, c = u, u = h;
          for (; a < o; ) for (I = t.charCodeAt(s + (u = a)), f = ++a, l = 0; l < me4; l += 2) h = D[l], D[l] = f = e(h, u, f, I, D[l + 1]), u = h;
          return f;
        };
      })();
    });
    var oa = Do(() => {
      "use strict";
    });
    var sa = Do(() => {
      "use strict";
    });
    var jf = {};
    tr(jf, { DMMF: () => ct, Debug: () => N, Decimal: () => Fe, Extensions: () => ni, MetricsClient: () => Lr, PrismaClientInitializationError: () => P2, PrismaClientKnownRequestError: () => z11, PrismaClientRustPanicError: () => ae, PrismaClientUnknownRequestError: () => V, PrismaClientValidationError: () => Z, Public: () => ii, Sql: () => ie, createParam: () => va, defineDmmfProperty: () => Ca, deserializeJsonResponse: () => Vr, deserializeRawResult: () => Xn, dmmfToRuntimeDataModel: () => Ns, empty: () => Oa, getPrismaClient: () => fu, getRuntime: () => Kn, join: () => Da, makeStrictEnum: () => gu, makeTypedQueryFactory: () => Ia, objectEnumValues: () => On, raw: () => no, serializeJsonQuery: () => $n, skip: () => Mn, sqltag: () => io, warnEnvConflicts: () => hu, warnOnce: () => at });
    module2.exports = vu(jf);
    var ni = {};
    tr(ni, { defineExtension: () => ko, getExtensionContext: () => _o });
    function ko(e) {
      return typeof e == "function" ? e : (r) => r.$extends(e);
    }
    function _o(e) {
      return e;
    }
    var ii = {};
    tr(ii, { validator: () => No });
    function No(...e) {
      return (r) => r;
    }
    var Bt = {};
    tr(Bt, { $: () => qo, bgBlack: () => ku, bgBlue: () => Fu, bgCyan: () => $u, bgGreen: () => Nu, bgMagenta: () => Mu, bgRed: () => _u, bgWhite: () => qu, bgYellow: () => Lu, black: () => Cu, blue: () => nr, bold: () => W, cyan: () => De, dim: () => Ce, gray: () => Hr, green: () => qe, grey: () => Ou, hidden: () => Ru, inverse: () => Su, italic: () => Tu, magenta: () => Iu, red: () => ce, reset: () => Pu, strikethrough: () => Au, underline: () => Y, white: () => Du, yellow: () => Ie });
    var oi;
    var Lo;
    var Fo;
    var Mo;
    var $o = true;
    typeof process < "u" && ({ FORCE_COLOR: oi, NODE_DISABLE_COLORS: Lo, NO_COLOR: Fo, TERM: Mo } = process.env || {}, $o = process.stdout && process.stdout.isTTY);
    var qo = { enabled: !Lo && Fo == null && Mo !== "dumb" && (oi != null && oi !== "0" || $o) };
    function F(e, r) {
      let t = new RegExp(`\\x1b\\[${r}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${r}m`;
      return function(o) {
        return !qo.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(t, i + n) : o) + i;
      };
    }
    var Pu = F(0, 0);
    var W = F(1, 22);
    var Ce = F(2, 22);
    var Tu = F(3, 23);
    var Y = F(4, 24);
    var Su = F(7, 27);
    var Ru = F(8, 28);
    var Au = F(9, 29);
    var Cu = F(30, 39);
    var ce = F(31, 39);
    var qe = F(32, 39);
    var Ie = F(33, 39);
    var nr = F(34, 39);
    var Iu = F(35, 39);
    var De = F(36, 39);
    var Du = F(37, 39);
    var Hr = F(90, 39);
    var Ou = F(90, 39);
    var ku = F(40, 49);
    var _u = F(41, 49);
    var Nu = F(42, 49);
    var Lu = F(43, 49);
    var Fu = F(44, 49);
    var Mu = F(45, 49);
    var $u = F(46, 49);
    var qu = F(47, 49);
    var Vu = 100;
    var Vo = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var Yr = [];
    var jo = Date.now();
    var ju = 0;
    var si = typeof process < "u" ? process.env : {};
    globalThis.DEBUG ??= si.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= si.DEBUG_COLORS ? si.DEBUG_COLORS === "true" : true;
    var zr = { enable(e) {
      typeof e == "string" && (globalThis.DEBUG = e);
    }, disable() {
      let e = globalThis.DEBUG;
      return globalThis.DEBUG = "", e;
    }, enabled(e) {
      let r = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), t = r.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = r.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return t && !n;
    }, log: (...e) => {
      let [r, t, ...n] = e;
      (console.warn ?? console.log)(`${r} ${t}`, ...n);
    }, formatters: {} };
    function Bu(e) {
      let r = { color: Vo[ju++ % Vo.length], enabled: zr.enabled(e), namespace: e, log: zr.log, extend: () => {
      } }, t = (...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = r;
        if (n.length !== 0 && Yr.push([o, ...n]), Yr.length > Vu && Yr.shift(), zr.enabled(o) || i) {
          let l = n.map((c) => typeof c == "string" ? c : Uu(c)), u = `+${Date.now() - jo}ms`;
          jo = Date.now(), globalThis.DEBUG_COLORS ? a(Bt[s](W(o)), ...l, Bt[s](u)) : a(o, ...l, u);
        }
      };
      return new Proxy(t, { get: (n, i) => r[i], set: (n, i, o) => r[i] = o });
    }
    var N = new Proxy(Bu, { get: (e, r) => zr[r], set: (e, r, t) => zr[r] = t });
    function Uu(e, r = 2) {
      let t = /* @__PURE__ */ new Set();
      return JSON.stringify(e, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (t.has(i)) return "[Circular *]";
          t.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, r);
    }
    function Bo(e = 7500) {
      let r = Yr.map(([t, ...n]) => `${t} ${n.map((i) => typeof i == "string" ? i : JSON.stringify(i)).join(" ")}`).join(`
`);
      return r.length < e ? r : r.slice(-e);
    }
    function Uo() {
      Yr.length = 0;
    }
    var gr = N;
    var Go = O(require("node:fs"));
    function ai() {
      let e = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
      if (!(e && Go.default.existsSync(e)) && process.arch === "ia32") throw new Error('The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set `engineType = "binary"` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)');
    }
    var li = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
    var Ut = "libquery_engine";
    function Gt(e, r) {
      let t = r === "url";
      return e.includes("windows") ? t ? "query_engine.dll.node" : `query_engine-${e}.dll.node` : e.includes("darwin") ? t ? `${Ut}.dylib.node` : `${Ut}-${e}.dylib.node` : t ? `${Ut}.so.node` : `${Ut}-${e}.so.node`;
    }
    var Ko = O(require("node:child_process"));
    var mi = O(require("node:fs/promises"));
    var Ht = O(require("node:os"));
    var Oe = /* @__PURE__ */ Symbol.for("@ts-pattern/matcher");
    var Gu = /* @__PURE__ */ Symbol.for("@ts-pattern/isVariadic");
    var Wt = "@ts-pattern/anonymous-select-key";
    var ui = (e) => !!(e && typeof e == "object");
    var Qt = (e) => e && !!e[Oe];
    var Ee = (e, r, t) => {
      if (Qt(e)) {
        let n = e[Oe](), { matched: i, selections: o } = n.match(r);
        return i && o && Object.keys(o).forEach((s) => t(s, o[s])), i;
      }
      if (ui(e)) {
        if (!ui(r)) return false;
        if (Array.isArray(e)) {
          if (!Array.isArray(r)) return false;
          let n = [], i = [], o = [];
          for (let s of e.keys()) {
            let a = e[s];
            Qt(a) && a[Gu] ? o.push(a) : o.length ? i.push(a) : n.push(a);
          }
          if (o.length) {
            if (o.length > 1) throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
            if (r.length < n.length + i.length) return false;
            let s = r.slice(0, n.length), a = i.length === 0 ? [] : r.slice(-i.length), l = r.slice(n.length, i.length === 0 ? 1 / 0 : -i.length);
            return n.every((u, c) => Ee(u, s[c], t)) && i.every((u, c) => Ee(u, a[c], t)) && (o.length === 0 || Ee(o[0], l, t));
          }
          return e.length === r.length && e.every((s, a) => Ee(s, r[a], t));
        }
        return Reflect.ownKeys(e).every((n) => {
          let i = e[n];
          return (n in r || Qt(o = i) && o[Oe]().matcherType === "optional") && Ee(i, r[n], t);
          var o;
        });
      }
      return Object.is(r, e);
    };
    var Ge = (e) => {
      var r, t, n;
      return ui(e) ? Qt(e) ? (r = (t = (n = e[Oe]()).getSelectionKeys) == null ? void 0 : t.call(n)) != null ? r : [] : Array.isArray(e) ? Zr(e, Ge) : Zr(Object.values(e), Ge) : [];
    };
    var Zr = (e, r) => e.reduce((t, n) => t.concat(r(n)), []);
    function pe(e) {
      return Object.assign(e, { optional: () => Qu(e), and: (r) => q(e, r), or: (r) => Wu(e, r), select: (r) => r === void 0 ? Qo(e) : Qo(r, e) });
    }
    function Qu(e) {
      return pe({ [Oe]: () => ({ match: (r) => {
        let t = {}, n = (i, o) => {
          t[i] = o;
        };
        return r === void 0 ? (Ge(e).forEach((i) => n(i, void 0)), { matched: true, selections: t }) : { matched: Ee(e, r, n), selections: t };
      }, getSelectionKeys: () => Ge(e), matcherType: "optional" }) });
    }
    function q(...e) {
      return pe({ [Oe]: () => ({ match: (r) => {
        let t = {}, n = (i, o) => {
          t[i] = o;
        };
        return { matched: e.every((i) => Ee(i, r, n)), selections: t };
      }, getSelectionKeys: () => Zr(e, Ge), matcherType: "and" }) });
    }
    function Wu(...e) {
      return pe({ [Oe]: () => ({ match: (r) => {
        let t = {}, n = (i, o) => {
          t[i] = o;
        };
        return Zr(e, Ge).forEach((i) => n(i, void 0)), { matched: e.some((i) => Ee(i, r, n)), selections: t };
      }, getSelectionKeys: () => Zr(e, Ge), matcherType: "or" }) });
    }
    function A(e) {
      return { [Oe]: () => ({ match: (r) => ({ matched: !!e(r) }) }) };
    }
    function Qo(...e) {
      let r = typeof e[0] == "string" ? e[0] : void 0, t = e.length === 2 ? e[1] : typeof e[0] == "string" ? void 0 : e[0];
      return pe({ [Oe]: () => ({ match: (n) => {
        let i = { [r ?? Wt]: n };
        return { matched: t === void 0 || Ee(t, n, (o, s) => {
          i[o] = s;
        }), selections: i };
      }, getSelectionKeys: () => [r ?? Wt].concat(t === void 0 ? [] : Ge(t)) }) });
    }
    function ye(e) {
      return typeof e == "number";
    }
    function Ve(e) {
      return typeof e == "string";
    }
    function je(e) {
      return typeof e == "bigint";
    }
    var eg = pe(A(function(e) {
      return true;
    }));
    var Be = (e) => Object.assign(pe(e), { startsWith: (r) => {
      return Be(q(e, (t = r, A((n) => Ve(n) && n.startsWith(t)))));
      var t;
    }, endsWith: (r) => {
      return Be(q(e, (t = r, A((n) => Ve(n) && n.endsWith(t)))));
      var t;
    }, minLength: (r) => Be(q(e, ((t) => A((n) => Ve(n) && n.length >= t))(r))), length: (r) => Be(q(e, ((t) => A((n) => Ve(n) && n.length === t))(r))), maxLength: (r) => Be(q(e, ((t) => A((n) => Ve(n) && n.length <= t))(r))), includes: (r) => {
      return Be(q(e, (t = r, A((n) => Ve(n) && n.includes(t)))));
      var t;
    }, regex: (r) => {
      return Be(q(e, (t = r, A((n) => Ve(n) && !!n.match(t)))));
      var t;
    } });
    var rg = Be(A(Ve));
    var be = (e) => Object.assign(pe(e), { between: (r, t) => be(q(e, ((n, i) => A((o) => ye(o) && n <= o && i >= o))(r, t))), lt: (r) => be(q(e, ((t) => A((n) => ye(n) && n < t))(r))), gt: (r) => be(q(e, ((t) => A((n) => ye(n) && n > t))(r))), lte: (r) => be(q(e, ((t) => A((n) => ye(n) && n <= t))(r))), gte: (r) => be(q(e, ((t) => A((n) => ye(n) && n >= t))(r))), int: () => be(q(e, A((r) => ye(r) && Number.isInteger(r)))), finite: () => be(q(e, A((r) => ye(r) && Number.isFinite(r)))), positive: () => be(q(e, A((r) => ye(r) && r > 0))), negative: () => be(q(e, A((r) => ye(r) && r < 0))) });
    var tg = be(A(ye));
    var Ue = (e) => Object.assign(pe(e), { between: (r, t) => Ue(q(e, ((n, i) => A((o) => je(o) && n <= o && i >= o))(r, t))), lt: (r) => Ue(q(e, ((t) => A((n) => je(n) && n < t))(r))), gt: (r) => Ue(q(e, ((t) => A((n) => je(n) && n > t))(r))), lte: (r) => Ue(q(e, ((t) => A((n) => je(n) && n <= t))(r))), gte: (r) => Ue(q(e, ((t) => A((n) => je(n) && n >= t))(r))), positive: () => Ue(q(e, A((r) => je(r) && r > 0))), negative: () => Ue(q(e, A((r) => je(r) && r < 0))) });
    var ng = Ue(A(je));
    var ig = pe(A(function(e) {
      return typeof e == "boolean";
    }));
    var og = pe(A(function(e) {
      return typeof e == "symbol";
    }));
    var sg = pe(A(function(e) {
      return e == null;
    }));
    var ag = pe(A(function(e) {
      return e != null;
    }));
    var ci = class extends Error {
      constructor(r) {
        let t;
        try {
          t = JSON.stringify(r);
        } catch {
          t = r;
        }
        super(`Pattern matching error: no pattern matches value ${t}`), this.input = void 0, this.input = r;
      }
    };
    var pi = { matched: false, value: void 0 };
    function hr(e) {
      return new di(e, pi);
    }
    var di = class e {
      constructor(r, t) {
        this.input = void 0, this.state = void 0, this.input = r, this.state = t;
      }
      with(...r) {
        if (this.state.matched) return this;
        let t = r[r.length - 1], n = [r[0]], i;
        r.length === 3 && typeof r[1] == "function" ? i = r[1] : r.length > 2 && n.push(...r.slice(1, r.length - 1));
        let o = false, s = {}, a = (u, c) => {
          o = true, s[u] = c;
        }, l = !n.some((u) => Ee(u, this.input, a)) || i && !i(this.input) ? pi : { matched: true, value: t(o ? Wt in s ? s[Wt] : s : this.input, this.input) };
        return new e(this.input, l);
      }
      when(r, t) {
        if (this.state.matched) return this;
        let n = !!r(this.input);
        return new e(this.input, n ? { matched: true, value: t(this.input, this.input) } : pi);
      }
      otherwise(r) {
        return this.state.matched ? this.state.value : r(this.input);
      }
      exhaustive() {
        if (this.state.matched) return this.state.value;
        throw new ci(this.input);
      }
      run() {
        return this.exhaustive();
      }
      returnType() {
        return this;
      }
    };
    var Ho = require("node:util");
    var Ju = { warn: Ie("prisma:warn") };
    var Ku = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
    function Jt(e, ...r) {
      Ku.warn() && console.warn(`${Ju.warn} ${e}`, ...r);
    }
    var Hu = (0, Ho.promisify)(Ko.default.exec);
    var ee = gr("prisma:get-platform");
    var Yu = ["1.0.x", "1.1.x", "3.0.x"];
    async function Yo() {
      let e = Ht.default.platform(), r = process.arch;
      if (e === "freebsd") {
        let s = await Yt("freebsd-version");
        if (s && s.trim().length > 0) {
          let l = /^(\d+)\.?/.exec(s);
          if (l) return { platform: "freebsd", targetDistro: `freebsd${l[1]}`, arch: r };
        }
      }
      if (e !== "linux") return { platform: e, arch: r };
      let t = await Zu(), n = await sc(), i = ec({ arch: r, archFromUname: n, familyDistro: t.familyDistro }), { libssl: o } = await rc(i);
      return { platform: "linux", libssl: o, arch: r, archFromUname: n, ...t };
    }
    function zu(e) {
      let r = /^ID="?([^"\n]*)"?$/im, t = /^ID_LIKE="?([^"\n]*)"?$/im, n = r.exec(e), i = n && n[1] && n[1].toLowerCase() || "", o = t.exec(e), s = o && o[1] && o[1].toLowerCase() || "", a = hr({ id: i, idLike: s }).with({ id: "alpine" }, ({ id: l }) => ({ targetDistro: "musl", familyDistro: l, originalDistro: l })).with({ id: "raspbian" }, ({ id: l }) => ({ targetDistro: "arm", familyDistro: "debian", originalDistro: l })).with({ id: "nixos" }, ({ id: l }) => ({ targetDistro: "nixos", originalDistro: l, familyDistro: "nixos" })).with({ id: "debian" }, { id: "ubuntu" }, ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).with({ id: "rhel" }, { id: "centos" }, { id: "fedora" }, ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).when(({ idLike: l }) => l.includes("debian") || l.includes("ubuntu"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).when(({ idLike: l }) => i === "arch" || l.includes("arch"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "arch", originalDistro: l })).when(({ idLike: l }) => l.includes("centos") || l.includes("fedora") || l.includes("rhel") || l.includes("suse"), ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).otherwise(({ id: l }) => ({ targetDistro: void 0, familyDistro: void 0, originalDistro: l }));
      return ee(`Found distro info:
${JSON.stringify(a, null, 2)}`), a;
    }
    async function Zu() {
      let e = "/etc/os-release";
      try {
        let r = await mi.default.readFile(e, { encoding: "utf-8" });
        return zu(r);
      } catch {
        return { targetDistro: void 0, familyDistro: void 0, originalDistro: void 0 };
      }
    }
    function Xu(e) {
      let r = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(e);
      if (r) {
        let t = `${r[1]}.x`;
        return zo(t);
      }
    }
    function Wo(e) {
      let r = /libssl\.so\.(\d)(\.\d)?/.exec(e);
      if (r) {
        let t = `${r[1]}${r[2] ?? ".0"}.x`;
        return zo(t);
      }
    }
    function zo(e) {
      let r = (() => {
        if (Xo(e)) return e;
        let t = e.split(".");
        return t[1] = "0", t.join(".");
      })();
      if (Yu.includes(r)) return r;
    }
    function ec(e) {
      return hr(e).with({ familyDistro: "musl" }, () => (ee('Trying platform-specific paths for "alpine"'), ["/lib", "/usr/lib"])).with({ familyDistro: "debian" }, ({ archFromUname: r }) => (ee('Trying platform-specific paths for "debian" (and "ubuntu")'), [`/usr/lib/${r}-linux-gnu`, `/lib/${r}-linux-gnu`])).with({ familyDistro: "rhel" }, () => (ee('Trying platform-specific paths for "rhel"'), ["/lib64", "/usr/lib64"])).otherwise(({ familyDistro: r, arch: t, archFromUname: n }) => (ee(`Don't know any platform-specific paths for "${r}" on ${t} (${n})`), []));
    }
    async function rc(e) {
      let r = 'grep -v "libssl.so.0"', t = await Jo(e);
      if (t) {
        ee(`Found libssl.so file using platform-specific paths: ${t}`);
        let o = Wo(t);
        if (ee(`The parsed libssl version is: ${o}`), o) return { libssl: o, strategy: "libssl-specific-path" };
      }
      ee('Falling back to "ldconfig" and other generic paths');
      let n = await Yt(`ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${r}`);
      if (n || (n = await Jo(["/lib64", "/usr/lib64", "/lib", "/usr/lib"])), n) {
        ee(`Found libssl.so file using "ldconfig" or other generic paths: ${n}`);
        let o = Wo(n);
        if (ee(`The parsed libssl version is: ${o}`), o) return { libssl: o, strategy: "ldconfig" };
      }
      let i = await Yt("openssl version -v");
      if (i) {
        ee(`Found openssl binary with version: ${i}`);
        let o = Xu(i);
        if (ee(`The parsed openssl version is: ${o}`), o) return { libssl: o, strategy: "openssl-binary" };
      }
      return ee("Couldn't find any version of libssl or OpenSSL in the system"), {};
    }
    async function Jo(e) {
      for (let r of e) {
        let t = await tc(r);
        if (t) return t;
      }
    }
    async function tc(e) {
      try {
        return (await mi.default.readdir(e)).find((t) => t.startsWith("libssl.so.") && !t.startsWith("libssl.so.0"));
      } catch (r) {
        if (r.code === "ENOENT") return;
        throw r;
      }
    }
    async function ir() {
      let { binaryTarget: e } = await Zo();
      return e;
    }
    function nc(e) {
      return e.binaryTarget !== void 0;
    }
    async function fi() {
      let { memoized: e, ...r } = await Zo();
      return r;
    }
    var Kt = {};
    async function Zo() {
      if (nc(Kt)) return Promise.resolve({ ...Kt, memoized: true });
      let e = await Yo(), r = ic(e);
      return Kt = { ...e, binaryTarget: r }, { ...Kt, memoized: false };
    }
    function ic(e) {
      let { platform: r, arch: t, archFromUname: n, libssl: i, targetDistro: o, familyDistro: s, originalDistro: a } = e;
      r === "linux" && !["x64", "arm64"].includes(t) && Jt(`Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures (detected "${t}" instead). If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${n}".`);
      let l = "1.1.x";
      if (r === "linux" && i === void 0) {
        let c = hr({ familyDistro: s }).with({ familyDistro: "debian" }, () => "Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.").otherwise(() => "Please manually install OpenSSL and try installing Prisma again.");
        Jt(`Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${l}".
${c}`);
      }
      let u = "debian";
      if (r === "linux" && o === void 0 && ee(`Distro is "${a}". Falling back to Prisma engines built for "${u}".`), r === "darwin" && t === "arm64") return "darwin-arm64";
      if (r === "darwin") return "darwin";
      if (r === "win32") return "windows";
      if (r === "freebsd") return o;
      if (r === "openbsd") return "openbsd";
      if (r === "netbsd") return "netbsd";
      if (r === "linux" && o === "nixos") return "linux-nixos";
      if (r === "linux" && t === "arm64") return `${o === "musl" ? "linux-musl-arm64" : "linux-arm64"}-openssl-${i || l}`;
      if (r === "linux" && t === "arm") return `linux-arm-openssl-${i || l}`;
      if (r === "linux" && o === "musl") {
        let c = "linux-musl";
        return !i || Xo(i) ? c : `${c}-openssl-${i}`;
      }
      return r === "linux" && o && i ? `${o}-openssl-${i}` : (r !== "linux" && Jt(`Prisma detected unknown OS "${r}" and may not work as expected. Defaulting to "linux".`), i ? `${u}-openssl-${i}` : o ? `${o}-openssl-${l}` : `${u}-openssl-${l}`);
    }
    async function oc(e) {
      try {
        return await e();
      } catch {
        return;
      }
    }
    function Yt(e) {
      return oc(async () => {
        let r = await Hu(e);
        return ee(`Command "${e}" successfully returned "${r.stdout}"`), r.stdout;
      });
    }
    async function sc() {
      return typeof Ht.default.machine == "function" ? Ht.default.machine() : (await Yt("uname -m"))?.trim();
    }
    function Xo(e) {
      return e.startsWith("1.");
    }
    var Xt = {};
    tr(Xt, { beep: () => kc, clearScreen: () => Cc, clearTerminal: () => Ic, cursorBackward: () => mc, cursorDown: () => pc, cursorForward: () => dc, cursorGetPosition: () => hc, cursorHide: () => Ec, cursorLeft: () => ts, cursorMove: () => cc, cursorNextLine: () => yc, cursorPrevLine: () => bc, cursorRestorePosition: () => gc, cursorSavePosition: () => fc, cursorShow: () => wc, cursorTo: () => uc, cursorUp: () => rs, enterAlternativeScreen: () => Dc, eraseDown: () => Tc, eraseEndLine: () => vc, eraseLine: () => ns, eraseLines: () => xc, eraseScreen: () => gi, eraseStartLine: () => Pc, eraseUp: () => Sc, exitAlternativeScreen: () => Oc, iTerm: () => Lc, image: () => Nc, link: () => _c, scrollDown: () => Ac, scrollUp: () => Rc });
    var Zt = O(require("node:process"), 1);
    var zt = globalThis.window?.document !== void 0;
    var gg = globalThis.process?.versions?.node !== void 0;
    var hg = globalThis.process?.versions?.bun !== void 0;
    var yg = globalThis.Deno?.version?.deno !== void 0;
    var bg = globalThis.process?.versions?.electron !== void 0;
    var Eg = globalThis.navigator?.userAgent?.includes("jsdom") === true;
    var wg = typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
    var xg = typeof DedicatedWorkerGlobalScope < "u" && globalThis instanceof DedicatedWorkerGlobalScope;
    var vg = typeof SharedWorkerGlobalScope < "u" && globalThis instanceof SharedWorkerGlobalScope;
    var Pg = typeof ServiceWorkerGlobalScope < "u" && globalThis instanceof ServiceWorkerGlobalScope;
    var Xr = globalThis.navigator?.userAgentData?.platform;
    var Tg = Xr === "macOS" || globalThis.navigator?.platform === "MacIntel" || globalThis.navigator?.userAgent?.includes(" Mac ") === true || globalThis.process?.platform === "darwin";
    var Sg = Xr === "Windows" || globalThis.navigator?.platform === "Win32" || globalThis.process?.platform === "win32";
    var Rg = Xr === "Linux" || globalThis.navigator?.platform?.startsWith("Linux") === true || globalThis.navigator?.userAgent?.includes(" Linux ") === true || globalThis.process?.platform === "linux";
    var Ag = Xr === "iOS" || globalThis.navigator?.platform === "MacIntel" && globalThis.navigator?.maxTouchPoints > 1 || /iPad|iPhone|iPod/.test(globalThis.navigator?.platform);
    var Cg = Xr === "Android" || globalThis.navigator?.platform === "Android" || globalThis.navigator?.userAgent?.includes(" Android ") === true || globalThis.process?.platform === "android";
    var C = "\x1B[";
    var rt = "\x1B]";
    var yr = "\x07";
    var et = ";";
    var es = !zt && Zt.default.env.TERM_PROGRAM === "Apple_Terminal";
    var ac = !zt && Zt.default.platform === "win32";
    var lc = zt ? () => {
      throw new Error("`process.cwd()` only works in Node.js, not the browser.");
    } : Zt.default.cwd;
    var uc = (e, r) => {
      if (typeof e != "number") throw new TypeError("The `x` argument is required");
      return typeof r != "number" ? C + (e + 1) + "G" : C + (r + 1) + et + (e + 1) + "H";
    };
    var cc = (e, r) => {
      if (typeof e != "number") throw new TypeError("The `x` argument is required");
      let t = "";
      return e < 0 ? t += C + -e + "D" : e > 0 && (t += C + e + "C"), r < 0 ? t += C + -r + "A" : r > 0 && (t += C + r + "B"), t;
    };
    var rs = (e = 1) => C + e + "A";
    var pc = (e = 1) => C + e + "B";
    var dc = (e = 1) => C + e + "C";
    var mc = (e = 1) => C + e + "D";
    var ts = C + "G";
    var fc = es ? "\x1B7" : C + "s";
    var gc = es ? "\x1B8" : C + "u";
    var hc = C + "6n";
    var yc = C + "E";
    var bc = C + "F";
    var Ec = C + "?25l";
    var wc = C + "?25h";
    var xc = (e) => {
      let r = "";
      for (let t = 0; t < e; t++) r += ns + (t < e - 1 ? rs() : "");
      return e && (r += ts), r;
    };
    var vc = C + "K";
    var Pc = C + "1K";
    var ns = C + "2K";
    var Tc = C + "J";
    var Sc = C + "1J";
    var gi = C + "2J";
    var Rc = C + "S";
    var Ac = C + "T";
    var Cc = "\x1Bc";
    var Ic = ac ? `${gi}${C}0f` : `${gi}${C}3J${C}H`;
    var Dc = C + "?1049h";
    var Oc = C + "?1049l";
    var kc = yr;
    var _c = (e, r) => [rt, "8", et, et, r, yr, e, rt, "8", et, et, yr].join("");
    var Nc = (e, r = {}) => {
      let t = `${rt}1337;File=inline=1`;
      return r.width && (t += `;width=${r.width}`), r.height && (t += `;height=${r.height}`), r.preserveAspectRatio === false && (t += ";preserveAspectRatio=0"), t + ":" + Buffer.from(e).toString("base64") + yr;
    };
    var Lc = { setCwd: (e = lc()) => `${rt}50;CurrentDir=${e}${yr}`, annotation(e, r = {}) {
      let t = `${rt}1337;`, n = r.x !== void 0, i = r.y !== void 0;
      if ((n || i) && !(n && i && r.length !== void 0)) throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
      return e = e.replaceAll("|", ""), t += r.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", r.length > 0 ? t += (n ? [e, r.length, r.x, r.y] : [r.length, e]).join("|") : t += e, t + yr;
    } };
    var en = O(cs(), 1);
    function or(e, r, { target: t = "stdout", ...n } = {}) {
      return en.default[t] ? Xt.link(e, r) : n.fallback === false ? e : typeof n.fallback == "function" ? n.fallback(e, r) : `${e} (\u200B${r}\u200B)`;
    }
    or.isSupported = en.default.stdout;
    or.stderr = (e, r, t = {}) => or(e, r, { target: "stderr", ...t });
    or.stderr.isSupported = en.default.stderr;
    function wi(e) {
      return or(e, e, { fallback: Y });
    }
    var Vc = ps();
    var xi = Vc.version;
    function Er(e) {
      let r = jc();
      return r || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : e?.config.engineType === "client" ? "client" : Bc());
    }
    function jc() {
      let e = process.env.PRISMA_CLIENT_ENGINE_TYPE;
      return e === "library" ? "library" : e === "binary" ? "binary" : e === "client" ? "client" : void 0;
    }
    function Bc() {
      return "library";
    }
    function vi(e) {
      return e.name === "DriverAdapterError" && typeof e.cause == "object";
    }
    function rn(e) {
      return { ok: true, value: e, map(r) {
        return rn(r(e));
      }, flatMap(r) {
        return r(e);
      } };
    }
    function sr(e) {
      return { ok: false, error: e, map() {
        return sr(e);
      }, flatMap() {
        return sr(e);
      } };
    }
    var ds = N("driver-adapter-utils");
    var Pi = class {
      registeredErrors = [];
      consumeError(r) {
        return this.registeredErrors[r];
      }
      registerNewError(r) {
        let t = 0;
        for (; this.registeredErrors[t] !== void 0; ) t++;
        return this.registeredErrors[t] = { error: r }, t;
      }
    };
    var tn = (e, r = new Pi()) => {
      let t = { adapterName: e.adapterName, errorRegistry: r, queryRaw: ke(r, e.queryRaw.bind(e)), executeRaw: ke(r, e.executeRaw.bind(e)), executeScript: ke(r, e.executeScript.bind(e)), dispose: ke(r, e.dispose.bind(e)), provider: e.provider, startTransaction: async (...n) => (await ke(r, e.startTransaction.bind(e))(...n)).map((o) => Uc(r, o)) };
      return e.getConnectionInfo && (t.getConnectionInfo = Gc(r, e.getConnectionInfo.bind(e))), t;
    };
    var Uc = (e, r) => ({ adapterName: r.adapterName, provider: r.provider, options: r.options, queryRaw: ke(e, r.queryRaw.bind(r)), executeRaw: ke(e, r.executeRaw.bind(r)), commit: ke(e, r.commit.bind(r)), rollback: ke(e, r.rollback.bind(r)) });
    function ke(e, r) {
      return async (...t) => {
        try {
          return rn(await r(...t));
        } catch (n) {
          if (ds("[error@wrapAsync]", n), vi(n)) return sr(n.cause);
          let i = e.registerNewError(n);
          return sr({ kind: "GenericJs", id: i });
        }
      };
    }
    function Gc(e, r) {
      return (...t) => {
        try {
          return rn(r(...t));
        } catch (n) {
          if (ds("[error@wrapSync]", n), vi(n)) return sr(n.cause);
          let i = e.registerNewError(n);
          return sr({ kind: "GenericJs", id: i });
        }
      };
    }
    var Wc = O(on());
    var M = O(require("node:path"));
    var Jc = O(on());
    var wh = N("prisma:engines");
    function ms() {
      return M.default.join(__dirname, "../");
    }
    M.default.join(__dirname, "../query-engine-darwin");
    M.default.join(__dirname, "../query-engine-darwin-arm64");
    M.default.join(__dirname, "../query-engine-debian-openssl-1.0.x");
    M.default.join(__dirname, "../query-engine-debian-openssl-1.1.x");
    M.default.join(__dirname, "../query-engine-debian-openssl-3.0.x");
    M.default.join(__dirname, "../query-engine-linux-static-x64");
    M.default.join(__dirname, "../query-engine-linux-static-arm64");
    M.default.join(__dirname, "../query-engine-rhel-openssl-1.0.x");
    M.default.join(__dirname, "../query-engine-rhel-openssl-1.1.x");
    M.default.join(__dirname, "../query-engine-rhel-openssl-3.0.x");
    M.default.join(__dirname, "../libquery_engine-darwin.dylib.node");
    M.default.join(__dirname, "../libquery_engine-darwin-arm64.dylib.node");
    M.default.join(__dirname, "../libquery_engine-debian-openssl-1.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-debian-openssl-1.1.x.so.node");
    M.default.join(__dirname, "../libquery_engine-debian-openssl-3.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.1.x.so.node");
    M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-3.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-linux-musl.so.node");
    M.default.join(__dirname, "../libquery_engine-linux-musl-openssl-3.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-rhel-openssl-1.0.x.so.node");
    M.default.join(__dirname, "../libquery_engine-rhel-openssl-1.1.x.so.node");
    M.default.join(__dirname, "../libquery_engine-rhel-openssl-3.0.x.so.node");
    M.default.join(__dirname, "../query_engine-windows.dll.node");
    var Si = O(require("node:fs"));
    var fs = gr("chmodPlusX");
    function Ri(e) {
      if (process.platform === "win32") return;
      let r = Si.default.statSync(e), t = r.mode | 64 | 8 | 1;
      if (r.mode === t) {
        fs(`Execution permissions of ${e} are fine`);
        return;
      }
      let n = t.toString(8).slice(-3);
      fs(`Have to call chmodPlusX on ${e}`), Si.default.chmodSync(e, n);
    }
    function Ai(e) {
      let r = e.e, t = (a) => `Prisma cannot find the required \`${a}\` system library in your system`, n = r.message.includes("cannot open shared object file"), i = `Please refer to the documentation about Prisma's system requirements: ${wi("https://pris.ly/d/system-requirements")}`, o = `Unable to require(\`${Ce(e.id)}\`).`, s = hr({ message: r.message, code: r.code }).with({ code: "ENOENT" }, () => "File does not exist.").when(({ message: a }) => n && a.includes("libz"), () => `${t("libz")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libgcc_s"), () => `${t("libgcc_s")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libssl"), () => {
        let a = e.platformInfo.libssl ? `openssl-${e.platformInfo.libssl}` : "openssl";
        return `${t("libssl")}. Please install ${a} and try again.`;
      }).when(({ message: a }) => a.includes("GLIBC"), () => `Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${i}`).when(({ message: a }) => e.platformInfo.platform === "linux" && a.includes("symbol not found"), () => `The Prisma engines are not compatible with your system ${e.platformInfo.originalDistro} on (${e.platformInfo.archFromUname}) which uses the \`${e.platformInfo.binaryTarget}\` binaryTarget by default. ${i}`).otherwise(() => `The Prisma engines do not seem to be compatible with your system. ${i}`);
      return `${o}
${s}

Details: ${r.message}`;
    }
    var ys = O(hs(), 1);
    function Ci(e) {
      let r = (0, ys.default)(e);
      if (r === 0) return e;
      let t = new RegExp(`^[ \\t]{${r}}`, "gm");
      return e.replace(t, "");
    }
    var bs = "prisma+postgres";
    var sn = `${bs}:`;
    function an(e) {
      return e?.toString().startsWith(`${sn}//`) ?? false;
    }
    function Ii(e) {
      if (!an(e)) return false;
      let { host: r } = new URL(e);
      return r.includes("localhost") || r.includes("127.0.0.1") || r.includes("[::1]");
    }
    var ws = O(Di());
    function ki(e) {
      return String(new Oi(e));
    }
    var Oi = class {
      constructor(r) {
        this.config = r;
      }
      toString() {
        let { config: r } = this, t = r.provider.fromEnvVar ? `env("${r.provider.fromEnvVar}")` : r.provider.value, n = JSON.parse(JSON.stringify({ provider: t, binaryTargets: Kc(r.binaryTargets) }));
        return `generator ${r.name} {
${(0, ws.default)(Hc(n), 2)}
}`;
      }
    };
    function Kc(e) {
      let r;
      if (e.length > 0) {
        let t = e.find((n) => n.fromEnvVar !== null);
        t ? r = `env("${t.fromEnvVar}")` : r = e.map((n) => n.native ? "native" : n.value);
      } else r = void 0;
      return r;
    }
    function Hc(e) {
      let r = Object.keys(e).reduce((t, n) => Math.max(t, n.length), 0);
      return Object.entries(e).map(([t, n]) => `${t.padEnd(r)} = ${Yc(n)}`).join(`
`);
    }
    function Yc(e) {
      return JSON.parse(JSON.stringify(e, (r, t) => Array.isArray(t) ? `[${t.map((n) => JSON.stringify(n)).join(", ")}]` : JSON.stringify(t)));
    }
    var nt = {};
    tr(nt, { error: () => Xc, info: () => Zc, log: () => zc, query: () => ep, should: () => xs, tags: () => tt, warn: () => _i });
    var tt = { error: ce("prisma:error"), warn: Ie("prisma:warn"), info: De("prisma:info"), query: nr("prisma:query") };
    var xs = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
    function zc(...e) {
      console.log(...e);
    }
    function _i(e, ...r) {
      xs.warn() && console.warn(`${tt.warn} ${e}`, ...r);
    }
    function Zc(e, ...r) {
      console.info(`${tt.info} ${e}`, ...r);
    }
    function Xc(e, ...r) {
      console.error(`${tt.error} ${e}`, ...r);
    }
    function ep(e, ...r) {
      console.log(`${tt.query} ${e}`, ...r);
    }
    function ln(e, r) {
      if (!e) throw new Error(`${r}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
    }
    function ar(e, r) {
      throw new Error(r);
    }
    function Ni({ onlyFirst: e = false } = {}) {
      let t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
      return new RegExp(t, e ? void 0 : "g");
    }
    var rp = Ni();
    function wr(e) {
      if (typeof e != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
      return e.replace(rp, "");
    }
    var it = O(require("node:path"));
    function Li(e) {
      return it.default.sep === it.default.posix.sep ? e : e.split(it.default.sep).join(it.default.posix.sep);
    }
    var qi = O(As());
    var un = O(require("node:fs"));
    var xr = O(require("node:path"));
    function Cs(e) {
      let r = e.ignoreProcessEnv ? {} : process.env, t = (n) => n.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g)?.reduce(function(o, s) {
        let a = /(.?)\${([a-zA-Z0-9_]+)?}/g.exec(s);
        if (!a) return o;
        let l = a[1], u, c;
        if (l === "\\") c = a[0], u = c.replace("\\$", "$");
        else {
          let p = a[2];
          c = a[0].substring(l.length), u = Object.hasOwnProperty.call(r, p) ? r[p] : e.parsed[p] || "", u = t(u);
        }
        return o.replace(c, u);
      }, n) ?? n;
      for (let n in e.parsed) {
        let i = Object.hasOwnProperty.call(r, n) ? r[n] : e.parsed[n];
        e.parsed[n] = t(i);
      }
      for (let n in e.parsed) r[n] = e.parsed[n];
      return e;
    }
    var $i = gr("prisma:tryLoadEnv");
    function st({ rootEnvPath: e, schemaEnvPath: r }, t = { conflictCheck: "none" }) {
      let n = Is(e);
      t.conflictCheck !== "none" && hp(n, r, t.conflictCheck);
      let i = null;
      return Ds(n?.path, r) || (i = Is(r)), !n && !i && $i("No Environment variables loaded"), i?.dotenvResult.error ? console.error(ce(W("Schema Env Error: ")) + i.dotenvResult.error) : { message: [n?.message, i?.message].filter(Boolean).join(`
`), parsed: { ...n?.dotenvResult?.parsed, ...i?.dotenvResult?.parsed } };
    }
    function hp(e, r, t) {
      let n = e?.dotenvResult.parsed, i = !Ds(e?.path, r);
      if (n && r && i && un.default.existsSync(r)) {
        let o = qi.default.parse(un.default.readFileSync(r)), s = [];
        for (let a in o) n[a] === o[a] && s.push(a);
        if (s.length > 0) {
          let a = xr.default.relative(process.cwd(), e.path), l = xr.default.relative(process.cwd(), r);
          if (t === "error") {
            let u = `There is a conflict between env var${s.length > 1 ? "s" : ""} in ${Y(a)} and ${Y(l)}
Conflicting env vars:
${s.map((c) => `  ${W(c)}`).join(`
`)}

We suggest to move the contents of ${Y(l)} to ${Y(a)} to consolidate your env vars.
`;
            throw new Error(u);
          } else if (t === "warn") {
            let u = `Conflict for env var${s.length > 1 ? "s" : ""} ${s.map((c) => W(c)).join(", ")} in ${Y(a)} and ${Y(l)}
Env vars from ${Y(l)} overwrite the ones from ${Y(a)}
      `;
            console.warn(`${Ie("warn(prisma)")} ${u}`);
          }
        }
      }
    }
    function Is(e) {
      if (yp(e)) {
        $i(`Environment variables loaded from ${e}`);
        let r = qi.default.config({ path: e, debug: process.env.DOTENV_CONFIG_DEBUG ? true : void 0 });
        return { dotenvResult: Cs(r), message: Ce(`Environment variables loaded from ${xr.default.relative(process.cwd(), e)}`), path: e };
      } else $i(`Environment variables not found at ${e}`);
      return null;
    }
    function Ds(e, r) {
      return e && r && xr.default.resolve(e) === xr.default.resolve(r);
    }
    function yp(e) {
      return !!(e && un.default.existsSync(e));
    }
    function Vi(e, r) {
      return Object.prototype.hasOwnProperty.call(e, r);
    }
    function pn(e, r) {
      let t = {};
      for (let n of Object.keys(e)) t[n] = r(e[n], n);
      return t;
    }
    function ji(e, r) {
      if (e.length === 0) return;
      let t = e[0];
      for (let n = 1; n < e.length; n++) r(t, e[n]) < 0 && (t = e[n]);
      return t;
    }
    function x(e, r) {
      Object.defineProperty(e, "name", { value: r, configurable: true });
    }
    var ks = /* @__PURE__ */ new Set();
    var at = (e, r, ...t) => {
      ks.has(e) || (ks.add(e), _i(r, ...t));
    };
    var P2 = class e extends Error {
      clientVersion;
      errorCode;
      retryable;
      constructor(r, t, n) {
        super(r), this.name = "PrismaClientInitializationError", this.clientVersion = t, this.errorCode = n, Error.captureStackTrace(e);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    x(P2, "PrismaClientInitializationError");
    var z11 = class extends Error {
      code;
      meta;
      clientVersion;
      batchRequestIdx;
      constructor(r, { code: t, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(r), this.name = "PrismaClientKnownRequestError", this.code = t, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    x(z11, "PrismaClientKnownRequestError");
    var ae = class extends Error {
      clientVersion;
      constructor(r, t) {
        super(r), this.name = "PrismaClientRustPanicError", this.clientVersion = t;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    x(ae, "PrismaClientRustPanicError");
    var V = class extends Error {
      clientVersion;
      batchRequestIdx;
      constructor(r, { clientVersion: t, batchRequestIdx: n }) {
        super(r), this.name = "PrismaClientUnknownRequestError", this.clientVersion = t, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    x(V, "PrismaClientUnknownRequestError");
    var Z = class extends Error {
      name = "PrismaClientValidationError";
      clientVersion;
      constructor(r, { clientVersion: t }) {
        super(r), this.clientVersion = t;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    x(Z, "PrismaClientValidationError");
    var we = class {
      _map = /* @__PURE__ */ new Map();
      get(r) {
        return this._map.get(r)?.value;
      }
      set(r, t) {
        this._map.set(r, { value: t });
      }
      getOrCreate(r, t) {
        let n = this._map.get(r);
        if (n) return n.value;
        let i = t();
        return this.set(r, i), i;
      }
    };
    function We(e) {
      return e.substring(0, 1).toLowerCase() + e.substring(1);
    }
    function _s(e, r) {
      let t = {};
      for (let n of e) {
        let i = n[r];
        t[i] = n;
      }
      return t;
    }
    function lt(e) {
      let r;
      return { get() {
        return r || (r = { value: e() }), r.value;
      } };
    }
    function Ns(e) {
      return { models: Bi(e.models), enums: Bi(e.enums), types: Bi(e.types) };
    }
    function Bi(e) {
      let r = {};
      for (let { name: t, ...n } of e) r[t] = n;
      return r;
    }
    function vr(e) {
      return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
    }
    function mn(e) {
      return e.toString() !== "Invalid Date";
    }
    var Pr = 9e15;
    var Ye = 1e9;
    var Ui = "0123456789abcdef";
    var hn = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
    var yn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
    var Gi = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -Pr, maxE: Pr, crypto: false };
    var $s;
    var Ne;
    var w = true;
    var En = "[DecimalError] ";
    var He = En + "Invalid argument: ";
    var qs = En + "Precision limit exceeded";
    var Vs = En + "crypto unavailable";
    var js = "[object Decimal]";
    var X = Math.floor;
    var U = Math.pow;
    var bp = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
    var Ep = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
    var wp = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
    var Bs = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    var fe = 1e7;
    var E = 7;
    var xp = 9007199254740991;
    var vp = hn.length - 1;
    var Qi = yn.length - 1;
    var m = { toStringTag: js };
    m.absoluteValue = m.abs = function() {
      var e = new this.constructor(this);
      return e.s < 0 && (e.s = 1), y(e);
    };
    m.ceil = function() {
      return y(new this.constructor(this), this.e + 1, 2);
    };
    m.clampedTo = m.clamp = function(e, r) {
      var t, n = this, i = n.constructor;
      if (e = new i(e), r = new i(r), !e.s || !r.s) return new i(NaN);
      if (e.gt(r)) throw Error(He + r);
      return t = n.cmp(e), t < 0 ? e : n.cmp(r) > 0 ? r : new i(n);
    };
    m.comparedTo = m.cmp = function(e) {
      var r, t, n, i, o = this, s = o.d, a = (e = new o.constructor(e)).d, l = o.s, u = e.s;
      if (!s || !a) return !l || !u ? NaN : l !== u ? l : s === a ? 0 : !s ^ l < 0 ? 1 : -1;
      if (!s[0] || !a[0]) return s[0] ? l : a[0] ? -u : 0;
      if (l !== u) return l;
      if (o.e !== e.e) return o.e > e.e ^ l < 0 ? 1 : -1;
      for (n = s.length, i = a.length, r = 0, t = n < i ? n : i; r < t; ++r) if (s[r] !== a[r]) return s[r] > a[r] ^ l < 0 ? 1 : -1;
      return n === i ? 0 : n > i ^ l < 0 ? 1 : -1;
    };
    m.cosine = m.cos = function() {
      var e, r, t = this, n = t.constructor;
      return t.d ? t.d[0] ? (e = n.precision, r = n.rounding, n.precision = e + Math.max(t.e, t.sd()) + E, n.rounding = 1, t = Pp(n, Js(n, t)), n.precision = e, n.rounding = r, y(Ne == 2 || Ne == 3 ? t.neg() : t, e, r, true)) : new n(1) : new n(NaN);
    };
    m.cubeRoot = m.cbrt = function() {
      var e, r, t, n, i, o, s, a, l, u, c = this, p = c.constructor;
      if (!c.isFinite() || c.isZero()) return new p(c);
      for (w = false, o = c.s * U(c.s * c, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (t = J(c.d), e = c.e, (o = (e - t.length + 1) % 3) && (t += o == 1 || o == -2 ? "0" : "00"), o = U(t, 1 / 3), e = X((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), o == 1 / 0 ? t = "5e" + e : (t = o.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new p(t), n.s = c.s) : n = new p(o.toString()), s = (e = p.precision) + 3; ; ) if (a = n, l = a.times(a).times(a), u = l.plus(c), n = L(u.plus(c).times(a), u.plus(l), s + 2, 1), J(a.d).slice(0, s) === (t = J(n.d)).slice(0, s)) if (t = t.slice(s - 3, s + 1), t == "9999" || !i && t == "4999") {
        if (!i && (y(a, e + 1, 0), a.times(a).times(a).eq(c))) {
          n = a;
          break;
        }
        s += 4, i = 1;
      } else {
        (!+t || !+t.slice(1) && t.charAt(0) == "5") && (y(n, e + 1, 1), r = !n.times(n).times(n).eq(c));
        break;
      }
      return w = true, y(n, e, p.rounding, r);
    };
    m.decimalPlaces = m.dp = function() {
      var e, r = this.d, t = NaN;
      if (r) {
        if (e = r.length - 1, t = (e - X(this.e / E)) * E, e = r[e], e) for (; e % 10 == 0; e /= 10) t--;
        t < 0 && (t = 0);
      }
      return t;
    };
    m.dividedBy = m.div = function(e) {
      return L(this, new this.constructor(e));
    };
    m.dividedToIntegerBy = m.divToInt = function(e) {
      var r = this, t = r.constructor;
      return y(L(r, new t(e), 0, 1, 1), t.precision, t.rounding);
    };
    m.equals = m.eq = function(e) {
      return this.cmp(e) === 0;
    };
    m.floor = function() {
      return y(new this.constructor(this), this.e + 1, 3);
    };
    m.greaterThan = m.gt = function(e) {
      return this.cmp(e) > 0;
    };
    m.greaterThanOrEqualTo = m.gte = function(e) {
      var r = this.cmp(e);
      return r == 1 || r === 0;
    };
    m.hyperbolicCosine = m.cosh = function() {
      var e, r, t, n, i, o = this, s = o.constructor, a = new s(1);
      if (!o.isFinite()) return new s(o.s ? 1 / 0 : NaN);
      if (o.isZero()) return a;
      t = s.precision, n = s.rounding, s.precision = t + Math.max(o.e, o.sd()) + 4, s.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), r = (1 / xn(4, e)).toString()) : (e = 16, r = "2.3283064365386962890625e-10"), o = Tr(s, 1, o.times(r), new s(1), true);
      for (var l, u = e, c = new s(8); u--; ) l = o.times(o), o = a.minus(l.times(c.minus(l.times(c))));
      return y(o, s.precision = t, s.rounding = n, true);
    };
    m.hyperbolicSine = m.sinh = function() {
      var e, r, t, n, i = this, o = i.constructor;
      if (!i.isFinite() || i.isZero()) return new o(i);
      if (r = o.precision, t = o.rounding, o.precision = r + Math.max(i.e, i.sd()) + 4, o.rounding = 1, n = i.d.length, n < 3) i = Tr(o, 2, i, i, true);
      else {
        e = 1.4 * Math.sqrt(n), e = e > 16 ? 16 : e | 0, i = i.times(1 / xn(5, e)), i = Tr(o, 2, i, i, true);
        for (var s, a = new o(5), l = new o(16), u = new o(20); e--; ) s = i.times(i), i = i.times(a.plus(s.times(l.times(s).plus(u))));
      }
      return o.precision = r, o.rounding = t, y(i, r, t, true);
    };
    m.hyperbolicTangent = m.tanh = function() {
      var e, r, t = this, n = t.constructor;
      return t.isFinite() ? t.isZero() ? new n(t) : (e = n.precision, r = n.rounding, n.precision = e + 7, n.rounding = 1, L(t.sinh(), t.cosh(), n.precision = e, n.rounding = r)) : new n(t.s);
    };
    m.inverseCosine = m.acos = function() {
      var e = this, r = e.constructor, t = e.abs().cmp(1), n = r.precision, i = r.rounding;
      return t !== -1 ? t === 0 ? e.isNeg() ? xe(r, n, i) : new r(0) : new r(NaN) : e.isZero() ? xe(r, n + 4, i).times(0.5) : (r.precision = n + 6, r.rounding = 1, e = new r(1).minus(e).div(e.plus(1)).sqrt().atan(), r.precision = n, r.rounding = i, e.times(2));
    };
    m.inverseHyperbolicCosine = m.acosh = function() {
      var e, r, t = this, n = t.constructor;
      return t.lte(1) ? new n(t.eq(1) ? 0 : NaN) : t.isFinite() ? (e = n.precision, r = n.rounding, n.precision = e + Math.max(Math.abs(t.e), t.sd()) + 4, n.rounding = 1, w = false, t = t.times(t).minus(1).sqrt().plus(t), w = true, n.precision = e, n.rounding = r, t.ln()) : new n(t);
    };
    m.inverseHyperbolicSine = m.asinh = function() {
      var e, r, t = this, n = t.constructor;
      return !t.isFinite() || t.isZero() ? new n(t) : (e = n.precision, r = n.rounding, n.precision = e + 2 * Math.max(Math.abs(t.e), t.sd()) + 6, n.rounding = 1, w = false, t = t.times(t).plus(1).sqrt().plus(t), w = true, n.precision = e, n.rounding = r, t.ln());
    };
    m.inverseHyperbolicTangent = m.atanh = function() {
      var e, r, t, n, i = this, o = i.constructor;
      return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, r = o.rounding, n = i.sd(), Math.max(n, e) < 2 * -i.e - 1 ? y(new o(i), e, r, true) : (o.precision = t = n - i.e, i = L(i.plus(1), new o(1).minus(i), t + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = r, i.times(0.5))) : new o(NaN);
    };
    m.inverseSine = m.asin = function() {
      var e, r, t, n, i = this, o = i.constructor;
      return i.isZero() ? new o(i) : (r = i.abs().cmp(1), t = o.precision, n = o.rounding, r !== -1 ? r === 0 ? (e = xe(o, t + 4, n).times(0.5), e.s = i.s, e) : new o(NaN) : (o.precision = t + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = t, o.rounding = n, i.times(2)));
    };
    m.inverseTangent = m.atan = function() {
      var e, r, t, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding;
      if (u.isFinite()) {
        if (u.isZero()) return new c(u);
        if (u.abs().eq(1) && p + 4 <= Qi) return s = xe(c, p + 4, d).times(0.25), s.s = u.s, s;
      } else {
        if (!u.s) return new c(NaN);
        if (p + 4 <= Qi) return s = xe(c, p + 4, d).times(0.5), s.s = u.s, s;
      }
      for (c.precision = a = p + 10, c.rounding = 1, t = Math.min(28, a / E + 2 | 0), e = t; e; --e) u = u.div(u.times(u).plus(1).sqrt().plus(1));
      for (w = false, r = Math.ceil(a / E), n = 1, l = u.times(u), s = new c(u), i = u; e !== -1; ) if (i = i.times(l), o = s.minus(i.div(n += 2)), i = i.times(l), s = o.plus(i.div(n += 2)), s.d[r] !== void 0) for (e = r; s.d[e] === o.d[e] && e--; ) ;
      return t && (s = s.times(2 << t - 1)), w = true, y(s, c.precision = p, c.rounding = d, true);
    };
    m.isFinite = function() {
      return !!this.d;
    };
    m.isInteger = m.isInt = function() {
      return !!this.d && X(this.e / E) > this.d.length - 2;
    };
    m.isNaN = function() {
      return !this.s;
    };
    m.isNegative = m.isNeg = function() {
      return this.s < 0;
    };
    m.isPositive = m.isPos = function() {
      return this.s > 0;
    };
    m.isZero = function() {
      return !!this.d && this.d[0] === 0;
    };
    m.lessThan = m.lt = function(e) {
      return this.cmp(e) < 0;
    };
    m.lessThanOrEqualTo = m.lte = function(e) {
      return this.cmp(e) < 1;
    };
    m.logarithm = m.log = function(e) {
      var r, t, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding, f = 5;
      if (e == null) e = new c(10), r = true;
      else {
        if (e = new c(e), t = e.d, e.s < 0 || !t || !t[0] || e.eq(1)) return new c(NaN);
        r = e.eq(10);
      }
      if (t = u.d, u.s < 0 || !t || !t[0] || u.eq(1)) return new c(t && !t[0] ? -1 / 0 : u.s != 1 ? NaN : t ? 0 : 1 / 0);
      if (r) if (t.length > 1) o = true;
      else {
        for (i = t[0]; i % 10 === 0; ) i /= 10;
        o = i !== 1;
      }
      if (w = false, a = p + f, s = Ke(u, a), n = r ? bn(c, a + 10) : Ke(e, a), l = L(s, n, a, 1), ut(l.d, i = p, d)) do
        if (a += 10, s = Ke(u, a), n = r ? bn(c, a + 10) : Ke(e, a), l = L(s, n, a, 1), !o) {
          +J(l.d).slice(i + 1, i + 15) + 1 == 1e14 && (l = y(l, p + 1, 0));
          break;
        }
      while (ut(l.d, i += 10, d));
      return w = true, y(l, p, d);
    };
    m.minus = m.sub = function(e) {
      var r, t, n, i, o, s, a, l, u, c, p, d, f = this, h = f.constructor;
      if (e = new h(e), !f.d || !e.d) return !f.s || !e.s ? e = new h(NaN) : f.d ? e.s = -e.s : e = new h(e.d || f.s !== e.s ? f : NaN), e;
      if (f.s != e.s) return e.s = -e.s, f.plus(e);
      if (u = f.d, d = e.d, a = h.precision, l = h.rounding, !u[0] || !d[0]) {
        if (d[0]) e.s = -e.s;
        else if (u[0]) e = new h(f);
        else return new h(l === 3 ? -0 : 0);
        return w ? y(e, a, l) : e;
      }
      if (t = X(e.e / E), c = X(f.e / E), u = u.slice(), o = c - t, o) {
        for (p = o < 0, p ? (r = u, o = -o, s = d.length) : (r = d, t = c, s = u.length), n = Math.max(Math.ceil(a / E), s) + 2, o > n && (o = n, r.length = 1), r.reverse(), n = o; n--; ) r.push(0);
        r.reverse();
      } else {
        for (n = u.length, s = d.length, p = n < s, p && (s = n), n = 0; n < s; n++) if (u[n] != d[n]) {
          p = u[n] < d[n];
          break;
        }
        o = 0;
      }
      for (p && (r = u, u = d, d = r, e.s = -e.s), s = u.length, n = d.length - s; n > 0; --n) u[s++] = 0;
      for (n = d.length; n > o; ) {
        if (u[--n] < d[n]) {
          for (i = n; i && u[--i] === 0; ) u[i] = fe - 1;
          --u[i], u[n] += fe;
        }
        u[n] -= d[n];
      }
      for (; u[--s] === 0; ) u.pop();
      for (; u[0] === 0; u.shift()) --t;
      return u[0] ? (e.d = u, e.e = wn(u, t), w ? y(e, a, l) : e) : new h(l === 3 ? -0 : 0);
    };
    m.modulo = m.mod = function(e) {
      var r, t = this, n = t.constructor;
      return e = new n(e), !t.d || !e.s || e.d && !e.d[0] ? new n(NaN) : !e.d || t.d && !t.d[0] ? y(new n(t), n.precision, n.rounding) : (w = false, n.modulo == 9 ? (r = L(t, e.abs(), 0, 3, 1), r.s *= e.s) : r = L(t, e, 0, n.modulo, 1), r = r.times(e), w = true, t.minus(r));
    };
    m.naturalExponential = m.exp = function() {
      return Wi(this);
    };
    m.naturalLogarithm = m.ln = function() {
      return Ke(this);
    };
    m.negated = m.neg = function() {
      var e = new this.constructor(this);
      return e.s = -e.s, y(e);
    };
    m.plus = m.add = function(e) {
      var r, t, n, i, o, s, a, l, u, c, p = this, d = p.constructor;
      if (e = new d(e), !p.d || !e.d) return !p.s || !e.s ? e = new d(NaN) : p.d || (e = new d(e.d || p.s === e.s ? p : NaN)), e;
      if (p.s != e.s) return e.s = -e.s, p.minus(e);
      if (u = p.d, c = e.d, a = d.precision, l = d.rounding, !u[0] || !c[0]) return c[0] || (e = new d(p)), w ? y(e, a, l) : e;
      if (o = X(p.e / E), n = X(e.e / E), u = u.slice(), i = o - n, i) {
        for (i < 0 ? (t = u, i = -i, s = c.length) : (t = c, n = o, s = u.length), o = Math.ceil(a / E), s = o > s ? o + 1 : s + 1, i > s && (i = s, t.length = 1), t.reverse(); i--; ) t.push(0);
        t.reverse();
      }
      for (s = u.length, i = c.length, s - i < 0 && (i = s, t = c, c = u, u = t), r = 0; i; ) r = (u[--i] = u[i] + c[i] + r) / fe | 0, u[i] %= fe;
      for (r && (u.unshift(r), ++n), s = u.length; u[--s] == 0; ) u.pop();
      return e.d = u, e.e = wn(u, n), w ? y(e, a, l) : e;
    };
    m.precision = m.sd = function(e) {
      var r, t = this;
      if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(He + e);
      return t.d ? (r = Us(t.d), e && t.e + 1 > r && (r = t.e + 1)) : r = NaN, r;
    };
    m.round = function() {
      var e = this, r = e.constructor;
      return y(new r(e), e.e + 1, r.rounding);
    };
    m.sine = m.sin = function() {
      var e, r, t = this, n = t.constructor;
      return t.isFinite() ? t.isZero() ? new n(t) : (e = n.precision, r = n.rounding, n.precision = e + Math.max(t.e, t.sd()) + E, n.rounding = 1, t = Sp(n, Js(n, t)), n.precision = e, n.rounding = r, y(Ne > 2 ? t.neg() : t, e, r, true)) : new n(NaN);
    };
    m.squareRoot = m.sqrt = function() {
      var e, r, t, n, i, o, s = this, a = s.d, l = s.e, u = s.s, c = s.constructor;
      if (u !== 1 || !a || !a[0]) return new c(!u || u < 0 && (!a || a[0]) ? NaN : a ? s : 1 / 0);
      for (w = false, u = Math.sqrt(+s), u == 0 || u == 1 / 0 ? (r = J(a), (r.length + l) % 2 == 0 && (r += "0"), u = Math.sqrt(r), l = X((l + 1) / 2) - (l < 0 || l % 2), u == 1 / 0 ? r = "5e" + l : (r = u.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + l), n = new c(r)) : n = new c(u.toString()), t = (l = c.precision) + 3; ; ) if (o = n, n = o.plus(L(s, o, t + 2, 1)).times(0.5), J(o.d).slice(0, t) === (r = J(n.d)).slice(0, t)) if (r = r.slice(t - 3, t + 1), r == "9999" || !i && r == "4999") {
        if (!i && (y(o, l + 1, 0), o.times(o).eq(s))) {
          n = o;
          break;
        }
        t += 4, i = 1;
      } else {
        (!+r || !+r.slice(1) && r.charAt(0) == "5") && (y(n, l + 1, 1), e = !n.times(n).eq(s));
        break;
      }
      return w = true, y(n, l, c.rounding, e);
    };
    m.tangent = m.tan = function() {
      var e, r, t = this, n = t.constructor;
      return t.isFinite() ? t.isZero() ? new n(t) : (e = n.precision, r = n.rounding, n.precision = e + 10, n.rounding = 1, t = t.sin(), t.s = 1, t = L(t, new n(1).minus(t.times(t)).sqrt(), e + 10, 0), n.precision = e, n.rounding = r, y(Ne == 2 || Ne == 4 ? t.neg() : t, e, r, true)) : new n(NaN);
    };
    m.times = m.mul = function(e) {
      var r, t, n, i, o, s, a, l, u, c = this, p = c.constructor, d = c.d, f = (e = new p(e)).d;
      if (e.s *= c.s, !d || !d[0] || !f || !f[0]) return new p(!e.s || d && !d[0] && !f || f && !f[0] && !d ? NaN : !d || !f ? e.s / 0 : e.s * 0);
      for (t = X(c.e / E) + X(e.e / E), l = d.length, u = f.length, l < u && (o = d, d = f, f = o, s = l, l = u, u = s), o = [], s = l + u, n = s; n--; ) o.push(0);
      for (n = u; --n >= 0; ) {
        for (r = 0, i = l + n; i > n; ) a = o[i] + f[n] * d[i - n - 1] + r, o[i--] = a % fe | 0, r = a / fe | 0;
        o[i] = (o[i] + r) % fe | 0;
      }
      for (; !o[--s]; ) o.pop();
      return r ? ++t : o.shift(), e.d = o, e.e = wn(o, t), w ? y(e, p.precision, p.rounding) : e;
    };
    m.toBinary = function(e, r) {
      return Ji(this, 2, e, r);
    };
    m.toDecimalPlaces = m.toDP = function(e, r) {
      var t = this, n = t.constructor;
      return t = new n(t), e === void 0 ? t : (ne(e, 0, Ye), r === void 0 ? r = n.rounding : ne(r, 0, 8), y(t, e + t.e + 1, r));
    };
    m.toExponential = function(e, r) {
      var t, n = this, i = n.constructor;
      return e === void 0 ? t = ve(n, true) : (ne(e, 0, Ye), r === void 0 ? r = i.rounding : ne(r, 0, 8), n = y(new i(n), e + 1, r), t = ve(n, true, e + 1)), n.isNeg() && !n.isZero() ? "-" + t : t;
    };
    m.toFixed = function(e, r) {
      var t, n, i = this, o = i.constructor;
      return e === void 0 ? t = ve(i) : (ne(e, 0, Ye), r === void 0 ? r = o.rounding : ne(r, 0, 8), n = y(new o(i), e + i.e + 1, r), t = ve(n, false, e + n.e + 1)), i.isNeg() && !i.isZero() ? "-" + t : t;
    };
    m.toFraction = function(e) {
      var r, t, n, i, o, s, a, l, u, c, p, d, f = this, h = f.d, g = f.constructor;
      if (!h) return new g(f);
      if (u = t = new g(1), n = l = new g(0), r = new g(n), o = r.e = Us(h) - f.e - 1, s = o % E, r.d[0] = U(10, s < 0 ? E + s : s), e == null) e = o > 0 ? r : u;
      else {
        if (a = new g(e), !a.isInt() || a.lt(u)) throw Error(He + a);
        e = a.gt(r) ? o > 0 ? r : u : a;
      }
      for (w = false, a = new g(J(h)), c = g.precision, g.precision = o = h.length * E * 2; p = L(a, r, 0, 1, 1), i = t.plus(p.times(n)), i.cmp(e) != 1; ) t = n, n = i, i = u, u = l.plus(p.times(i)), l = i, i = r, r = a.minus(p.times(i)), a = i;
      return i = L(e.minus(t), n, 0, 1, 1), l = l.plus(i.times(u)), t = t.plus(i.times(n)), l.s = u.s = f.s, d = L(u, n, o, 1).minus(f).abs().cmp(L(l, t, o, 1).minus(f).abs()) < 1 ? [u, n] : [l, t], g.precision = c, w = true, d;
    };
    m.toHexadecimal = m.toHex = function(e, r) {
      return Ji(this, 16, e, r);
    };
    m.toNearest = function(e, r) {
      var t = this, n = t.constructor;
      if (t = new n(t), e == null) {
        if (!t.d) return t;
        e = new n(1), r = n.rounding;
      } else {
        if (e = new n(e), r === void 0 ? r = n.rounding : ne(r, 0, 8), !t.d) return e.s ? t : e;
        if (!e.d) return e.s && (e.s = t.s), e;
      }
      return e.d[0] ? (w = false, t = L(t, e, 0, r, 1).times(e), w = true, y(t)) : (e.s = t.s, t = e), t;
    };
    m.toNumber = function() {
      return +this;
    };
    m.toOctal = function(e, r) {
      return Ji(this, 8, e, r);
    };
    m.toPower = m.pow = function(e) {
      var r, t, n, i, o, s, a = this, l = a.constructor, u = +(e = new l(e));
      if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new l(U(+a, u));
      if (a = new l(a), a.eq(1)) return a;
      if (n = l.precision, o = l.rounding, e.eq(1)) return y(a, n, o);
      if (r = X(e.e / E), r >= e.d.length - 1 && (t = u < 0 ? -u : u) <= xp) return i = Gs(l, a, t, n), e.s < 0 ? new l(1).div(i) : y(i, n, o);
      if (s = a.s, s < 0) {
        if (r < e.d.length - 1) return new l(NaN);
        if ((e.d[r] & 1) == 0 && (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1) return a.s = s, a;
      }
      return t = U(+a, u), r = t == 0 || !isFinite(t) ? X(u * (Math.log("0." + J(a.d)) / Math.LN10 + a.e + 1)) : new l(t + "").e, r > l.maxE + 1 || r < l.minE - 1 ? new l(r > 0 ? s / 0 : 0) : (w = false, l.rounding = a.s = 1, t = Math.min(12, (r + "").length), i = Wi(e.times(Ke(a, n + t)), n), i.d && (i = y(i, n + 5, 1), ut(i.d, n, o) && (r = n + 10, i = y(Wi(e.times(Ke(a, r + t)), r), r + 5, 1), +J(i.d).slice(n + 1, n + 15) + 1 == 1e14 && (i = y(i, n + 1, 0)))), i.s = s, w = true, l.rounding = o, y(i, n, o));
    };
    m.toPrecision = function(e, r) {
      var t, n = this, i = n.constructor;
      return e === void 0 ? t = ve(n, n.e <= i.toExpNeg || n.e >= i.toExpPos) : (ne(e, 1, Ye), r === void 0 ? r = i.rounding : ne(r, 0, 8), n = y(new i(n), e, r), t = ve(n, e <= n.e || n.e <= i.toExpNeg, e)), n.isNeg() && !n.isZero() ? "-" + t : t;
    };
    m.toSignificantDigits = m.toSD = function(e, r) {
      var t = this, n = t.constructor;
      return e === void 0 ? (e = n.precision, r = n.rounding) : (ne(e, 1, Ye), r === void 0 ? r = n.rounding : ne(r, 0, 8)), y(new n(t), e, r);
    };
    m.toString = function() {
      var e = this, r = e.constructor, t = ve(e, e.e <= r.toExpNeg || e.e >= r.toExpPos);
      return e.isNeg() && !e.isZero() ? "-" + t : t;
    };
    m.truncated = m.trunc = function() {
      return y(new this.constructor(this), this.e + 1, 1);
    };
    m.valueOf = m.toJSON = function() {
      var e = this, r = e.constructor, t = ve(e, e.e <= r.toExpNeg || e.e >= r.toExpPos);
      return e.isNeg() ? "-" + t : t;
    };
    function J(e) {
      var r, t, n, i = e.length - 1, o = "", s = e[0];
      if (i > 0) {
        for (o += s, r = 1; r < i; r++) n = e[r] + "", t = E - n.length, t && (o += Je(t)), o += n;
        s = e[r], n = s + "", t = E - n.length, t && (o += Je(t));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    function ne(e, r, t) {
      if (e !== ~~e || e < r || e > t) throw Error(He + e);
    }
    function ut(e, r, t, n) {
      var i, o, s, a;
      for (o = e[0]; o >= 10; o /= 10) --r;
      return --r < 0 ? (r += E, i = 0) : (i = Math.ceil((r + 1) / E), r %= E), o = U(10, E - r), a = e[i] % o | 0, n == null ? r < 3 ? (r == 0 ? a = a / 100 | 0 : r == 1 && (a = a / 10 | 0), s = t < 4 && a == 99999 || t > 3 && a == 49999 || a == 5e4 || a == 0) : s = (t < 4 && a + 1 == o || t > 3 && a + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == U(10, r - 2) - 1 || (a == o / 2 || a == 0) && (e[i + 1] / o / 100 | 0) == 0 : r < 4 ? (r == 0 ? a = a / 1e3 | 0 : r == 1 ? a = a / 100 | 0 : r == 2 && (a = a / 10 | 0), s = (n || t < 4) && a == 9999 || !n && t > 3 && a == 4999) : s = ((n || t < 4) && a + 1 == o || !n && t > 3 && a + 1 == o / 2) && (e[i + 1] / o / 1e3 | 0) == U(10, r - 3) - 1, s;
    }
    function fn(e, r, t) {
      for (var n, i = [0], o, s = 0, a = e.length; s < a; ) {
        for (o = i.length; o--; ) i[o] *= r;
        for (i[0] += Ui.indexOf(e.charAt(s++)), n = 0; n < i.length; n++) i[n] > t - 1 && (i[n + 1] === void 0 && (i[n + 1] = 0), i[n + 1] += i[n] / t | 0, i[n] %= t);
      }
      return i.reverse();
    }
    function Pp(e, r) {
      var t, n, i;
      if (r.isZero()) return r;
      n = r.d.length, n < 32 ? (t = Math.ceil(n / 3), i = (1 / xn(4, t)).toString()) : (t = 16, i = "2.3283064365386962890625e-10"), e.precision += t, r = Tr(e, 1, r.times(i), new e(1));
      for (var o = t; o--; ) {
        var s = r.times(r);
        r = s.times(s).minus(s).times(8).plus(1);
      }
      return e.precision -= t, r;
    }
    var L = /* @__PURE__ */ (function() {
      function e(n, i, o) {
        var s, a = 0, l = n.length;
        for (n = n.slice(); l--; ) s = n[l] * i + a, n[l] = s % o | 0, a = s / o | 0;
        return a && n.unshift(a), n;
      }
      function r(n, i, o, s) {
        var a, l;
        if (o != s) l = o > s ? 1 : -1;
        else for (a = l = 0; a < o; a++) if (n[a] != i[a]) {
          l = n[a] > i[a] ? 1 : -1;
          break;
        }
        return l;
      }
      function t(n, i, o, s) {
        for (var a = 0; o--; ) n[o] -= a, a = n[o] < i[o] ? 1 : 0, n[o] = a * s + n[o] - i[o];
        for (; !n[0] && n.length > 1; ) n.shift();
      }
      return function(n, i, o, s, a, l) {
        var u, c, p, d, f, h, g, I, T, S, b, D, me4, se, Kr, j, te, Ae, K, fr, Vt = n.constructor, ti = n.s == i.s ? 1 : -1, H = n.d, k = i.d;
        if (!H || !H[0] || !k || !k[0]) return new Vt(!n.s || !i.s || (H ? k && H[0] == k[0] : !k) ? NaN : H && H[0] == 0 || !k ? ti * 0 : ti / 0);
        for (l ? (f = 1, c = n.e - i.e) : (l = fe, f = E, c = X(n.e / f) - X(i.e / f)), K = k.length, te = H.length, T = new Vt(ti), S = T.d = [], p = 0; k[p] == (H[p] || 0); p++) ;
        if (k[p] > (H[p] || 0) && c--, o == null ? (se = o = Vt.precision, s = Vt.rounding) : a ? se = o + (n.e - i.e) + 1 : se = o, se < 0) S.push(1), h = true;
        else {
          if (se = se / f + 2 | 0, p = 0, K == 1) {
            for (d = 0, k = k[0], se++; (p < te || d) && se--; p++) Kr = d * l + (H[p] || 0), S[p] = Kr / k | 0, d = Kr % k | 0;
            h = d || p < te;
          } else {
            for (d = l / (k[0] + 1) | 0, d > 1 && (k = e(k, d, l), H = e(H, d, l), K = k.length, te = H.length), j = K, b = H.slice(0, K), D = b.length; D < K; ) b[D++] = 0;
            fr = k.slice(), fr.unshift(0), Ae = k[0], k[1] >= l / 2 && ++Ae;
            do
              d = 0, u = r(k, b, K, D), u < 0 ? (me4 = b[0], K != D && (me4 = me4 * l + (b[1] || 0)), d = me4 / Ae | 0, d > 1 ? (d >= l && (d = l - 1), g = e(k, d, l), I = g.length, D = b.length, u = r(g, b, I, D), u == 1 && (d--, t(g, K < I ? fr : k, I, l))) : (d == 0 && (u = d = 1), g = k.slice()), I = g.length, I < D && g.unshift(0), t(b, g, D, l), u == -1 && (D = b.length, u = r(k, b, K, D), u < 1 && (d++, t(b, K < D ? fr : k, D, l))), D = b.length) : u === 0 && (d++, b = [0]), S[p++] = d, u && b[0] ? b[D++] = H[j] || 0 : (b = [H[j]], D = 1);
            while ((j++ < te || b[0] !== void 0) && se--);
            h = b[0] !== void 0;
          }
          S[0] || S.shift();
        }
        if (f == 1) T.e = c, $s = h;
        else {
          for (p = 1, d = S[0]; d >= 10; d /= 10) p++;
          T.e = p + c * f - 1, y(T, a ? o + T.e + 1 : o, s, h);
        }
        return T;
      };
    })();
    function y(e, r, t, n) {
      var i, o, s, a, l, u, c, p, d, f = e.constructor;
      e: if (r != null) {
        if (p = e.d, !p) return e;
        for (i = 1, a = p[0]; a >= 10; a /= 10) i++;
        if (o = r - i, o < 0) o += E, s = r, c = p[d = 0], l = c / U(10, i - s - 1) % 10 | 0;
        else if (d = Math.ceil((o + 1) / E), a = p.length, d >= a) if (n) {
          for (; a++ <= d; ) p.push(0);
          c = l = 0, i = 1, o %= E, s = o - E + 1;
        } else break e;
        else {
          for (c = a = p[d], i = 1; a >= 10; a /= 10) i++;
          o %= E, s = o - E + i, l = s < 0 ? 0 : c / U(10, i - s - 1) % 10 | 0;
        }
        if (n = n || r < 0 || p[d + 1] !== void 0 || (s < 0 ? c : c % U(10, i - s - 1)), u = t < 4 ? (l || n) && (t == 0 || t == (e.s < 0 ? 3 : 2)) : l > 5 || l == 5 && (t == 4 || n || t == 6 && (o > 0 ? s > 0 ? c / U(10, i - s) : 0 : p[d - 1]) % 10 & 1 || t == (e.s < 0 ? 8 : 7)), r < 1 || !p[0]) return p.length = 0, u ? (r -= e.e + 1, p[0] = U(10, (E - r % E) % E), e.e = -r || 0) : p[0] = e.e = 0, e;
        if (o == 0 ? (p.length = d, a = 1, d--) : (p.length = d + 1, a = U(10, E - o), p[d] = s > 0 ? (c / U(10, i - s) % U(10, s) | 0) * a : 0), u) for (; ; ) if (d == 0) {
          for (o = 1, s = p[0]; s >= 10; s /= 10) o++;
          for (s = p[0] += a, a = 1; s >= 10; s /= 10) a++;
          o != a && (e.e++, p[0] == fe && (p[0] = 1));
          break;
        } else {
          if (p[d] += a, p[d] != fe) break;
          p[d--] = 0, a = 1;
        }
        for (o = p.length; p[--o] === 0; ) p.pop();
      }
      return w && (e.e > f.maxE ? (e.d = null, e.e = NaN) : e.e < f.minE && (e.e = 0, e.d = [0])), e;
    }
    function ve(e, r, t) {
      if (!e.isFinite()) return Ws(e);
      var n, i = e.e, o = J(e.d), s = o.length;
      return r ? (t && (n = t - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Je(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (o = "0." + Je(-i - 1) + o, t && (n = t - s) > 0 && (o += Je(n))) : i >= s ? (o += Je(i + 1 - s), t && (n = t - i - 1) > 0 && (o = o + "." + Je(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), t && (n = t - s) > 0 && (i + 1 === s && (o += "."), o += Je(n))), o;
    }
    function wn(e, r) {
      var t = e[0];
      for (r *= E; t >= 10; t /= 10) r++;
      return r;
    }
    function bn(e, r, t) {
      if (r > vp) throw w = true, t && (e.precision = t), Error(qs);
      return y(new e(hn), r, 1, true);
    }
    function xe(e, r, t) {
      if (r > Qi) throw Error(qs);
      return y(new e(yn), r, t, true);
    }
    function Us(e) {
      var r = e.length - 1, t = r * E + 1;
      if (r = e[r], r) {
        for (; r % 10 == 0; r /= 10) t--;
        for (r = e[0]; r >= 10; r /= 10) t++;
      }
      return t;
    }
    function Je(e) {
      for (var r = ""; e--; ) r += "0";
      return r;
    }
    function Gs(e, r, t, n) {
      var i, o = new e(1), s = Math.ceil(n / E + 4);
      for (w = false; ; ) {
        if (t % 2 && (o = o.times(r), Fs(o.d, s) && (i = true)), t = X(t / 2), t === 0) {
          t = o.d.length - 1, i && o.d[t] === 0 && ++o.d[t];
          break;
        }
        r = r.times(r), Fs(r.d, s);
      }
      return w = true, o;
    }
    function Ls(e) {
      return e.d[e.d.length - 1] & 1;
    }
    function Qs(e, r, t) {
      for (var n, i, o = new e(r[0]), s = 0; ++s < r.length; ) {
        if (i = new e(r[s]), !i.s) {
          o = i;
          break;
        }
        n = o.cmp(i), (n === t || n === 0 && o.s === t) && (o = i);
      }
      return o;
    }
    function Wi(e, r) {
      var t, n, i, o, s, a, l, u = 0, c = 0, p = 0, d = e.constructor, f = d.rounding, h = d.precision;
      if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
      for (r == null ? (w = false, l = h) : l = r, a = new d(0.03125); e.e > -2; ) e = e.times(a), p += 5;
      for (n = Math.log(U(2, p)) / Math.LN10 * 2 + 5 | 0, l += n, t = o = s = new d(1), d.precision = l; ; ) {
        if (o = y(o.times(e), l, 1), t = t.times(++c), a = s.plus(L(o, t, l, 1)), J(a.d).slice(0, l) === J(s.d).slice(0, l)) {
          for (i = p; i--; ) s = y(s.times(s), l, 1);
          if (r == null) if (u < 3 && ut(s.d, l - n, f, u)) d.precision = l += 10, t = o = a = new d(1), c = 0, u++;
          else return y(s, d.precision = h, f, w = true);
          else return d.precision = h, s;
        }
        s = a;
      }
    }
    function Ke(e, r) {
      var t, n, i, o, s, a, l, u, c, p, d, f = 1, h = 10, g = e, I = g.d, T = g.constructor, S = T.rounding, b = T.precision;
      if (g.s < 0 || !I || !I[0] || !g.e && I[0] == 1 && I.length == 1) return new T(I && !I[0] ? -1 / 0 : g.s != 1 ? NaN : I ? 0 : g);
      if (r == null ? (w = false, c = b) : c = r, T.precision = c += h, t = J(I), n = t.charAt(0), Math.abs(o = g.e) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && t.charAt(1) > 3; ) g = g.times(e), t = J(g.d), n = t.charAt(0), f++;
        o = g.e, n > 1 ? (g = new T("0." + t), o++) : g = new T(n + "." + t.slice(1));
      } else return u = bn(T, c + 2, b).times(o + ""), g = Ke(new T(n + "." + t.slice(1)), c - h).plus(u), T.precision = b, r == null ? y(g, b, S, w = true) : g;
      for (p = g, l = s = g = L(g.minus(1), g.plus(1), c, 1), d = y(g.times(g), c, 1), i = 3; ; ) {
        if (s = y(s.times(d), c, 1), u = l.plus(L(s, new T(i), c, 1)), J(u.d).slice(0, c) === J(l.d).slice(0, c)) if (l = l.times(2), o !== 0 && (l = l.plus(bn(T, c + 2, b).times(o + ""))), l = L(l, new T(f), c, 1), r == null) if (ut(l.d, c - h, S, a)) T.precision = c += h, u = s = g = L(p.minus(1), p.plus(1), c, 1), d = y(g.times(g), c, 1), i = a = 1;
        else return y(l, T.precision = b, S, w = true);
        else return T.precision = b, l;
        l = u, i += 2;
      }
    }
    function Ws(e) {
      return String(e.s * e.s / 0);
    }
    function gn(e, r) {
      var t, n, i;
      for ((t = r.indexOf(".")) > -1 && (r = r.replace(".", "")), (n = r.search(/e/i)) > 0 ? (t < 0 && (t = n), t += +r.slice(n + 1), r = r.substring(0, n)) : t < 0 && (t = r.length), n = 0; r.charCodeAt(n) === 48; n++) ;
      for (i = r.length; r.charCodeAt(i - 1) === 48; --i) ;
      if (r = r.slice(n, i), r) {
        if (i -= n, e.e = t = t - n - 1, e.d = [], n = (t + 1) % E, t < 0 && (n += E), n < i) {
          for (n && e.d.push(+r.slice(0, n)), i -= E; n < i; ) e.d.push(+r.slice(n, n += E));
          r = r.slice(n), n = E - r.length;
        } else n -= i;
        for (; n--; ) r += "0";
        e.d.push(+r), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]));
      } else e.e = 0, e.d = [0];
      return e;
    }
    function Tp(e, r) {
      var t, n, i, o, s, a, l, u, c;
      if (r.indexOf("_") > -1) {
        if (r = r.replace(/(\d)_(?=\d)/g, "$1"), Bs.test(r)) return gn(e, r);
      } else if (r === "Infinity" || r === "NaN") return +r || (e.s = NaN), e.e = NaN, e.d = null, e;
      if (Ep.test(r)) t = 16, r = r.toLowerCase();
      else if (bp.test(r)) t = 2;
      else if (wp.test(r)) t = 8;
      else throw Error(He + r);
      for (o = r.search(/p/i), o > 0 ? (l = +r.slice(o + 1), r = r.substring(2, o)) : r = r.slice(2), o = r.indexOf("."), s = o >= 0, n = e.constructor, s && (r = r.replace(".", ""), a = r.length, o = a - o, i = Gs(n, new n(t), o, o * 2)), u = fn(r, t, fe), c = u.length - 1, o = c; u[o] === 0; --o) u.pop();
      return o < 0 ? new n(e.s * 0) : (e.e = wn(u, c), e.d = u, w = false, s && (e = L(e, i, a * 4)), l && (e = e.times(Math.abs(l) < 54 ? U(2, l) : Le.pow(2, l))), w = true, e);
    }
    function Sp(e, r) {
      var t, n = r.d.length;
      if (n < 3) return r.isZero() ? r : Tr(e, 2, r, r);
      t = 1.4 * Math.sqrt(n), t = t > 16 ? 16 : t | 0, r = r.times(1 / xn(5, t)), r = Tr(e, 2, r, r);
      for (var i, o = new e(5), s = new e(16), a = new e(20); t--; ) i = r.times(r), r = r.times(o.plus(i.times(s.times(i).minus(a))));
      return r;
    }
    function Tr(e, r, t, n, i) {
      var o, s, a, l, u = 1, c = e.precision, p = Math.ceil(c / E);
      for (w = false, l = t.times(t), a = new e(n); ; ) {
        if (s = L(a.times(l), new e(r++ * r++), c, 1), a = i ? n.plus(s) : n.minus(s), n = L(s.times(l), new e(r++ * r++), c, 1), s = a.plus(n), s.d[p] !== void 0) {
          for (o = p; s.d[o] === a.d[o] && o--; ) ;
          if (o == -1) break;
        }
        o = a, a = n, n = s, s = o, u++;
      }
      return w = true, s.d.length = p + 1, s;
    }
    function xn(e, r) {
      for (var t = e; --r; ) t *= e;
      return t;
    }
    function Js(e, r) {
      var t, n = r.s < 0, i = xe(e, e.precision, 1), o = i.times(0.5);
      if (r = r.abs(), r.lte(o)) return Ne = n ? 4 : 1, r;
      if (t = r.divToInt(i), t.isZero()) Ne = n ? 3 : 2;
      else {
        if (r = r.minus(t.times(i)), r.lte(o)) return Ne = Ls(t) ? n ? 2 : 3 : n ? 4 : 1, r;
        Ne = Ls(t) ? n ? 1 : 4 : n ? 3 : 2;
      }
      return r.minus(i).abs();
    }
    function Ji(e, r, t, n) {
      var i, o, s, a, l, u, c, p, d, f = e.constructor, h = t !== void 0;
      if (h ? (ne(t, 1, Ye), n === void 0 ? n = f.rounding : ne(n, 0, 8)) : (t = f.precision, n = f.rounding), !e.isFinite()) c = Ws(e);
      else {
        for (c = ve(e), s = c.indexOf("."), h ? (i = 2, r == 16 ? t = t * 4 - 3 : r == 8 && (t = t * 3 - 2)) : i = r, s >= 0 && (c = c.replace(".", ""), d = new f(1), d.e = c.length - s, d.d = fn(ve(d), 10, i), d.e = d.d.length), p = fn(c, 10, i), o = l = p.length; p[--l] == 0; ) p.pop();
        if (!p[0]) c = h ? "0p+0" : "0";
        else {
          if (s < 0 ? o-- : (e = new f(e), e.d = p, e.e = o, e = L(e, d, t, n, 0, i), p = e.d, o = e.e, u = $s), s = p[t], a = i / 2, u = u || p[t + 1] !== void 0, u = n < 4 ? (s !== void 0 || u) && (n === 0 || n === (e.s < 0 ? 3 : 2)) : s > a || s === a && (n === 4 || u || n === 6 && p[t - 1] & 1 || n === (e.s < 0 ? 8 : 7)), p.length = t, u) for (; ++p[--t] > i - 1; ) p[t] = 0, t || (++o, p.unshift(1));
          for (l = p.length; !p[l - 1]; --l) ;
          for (s = 0, c = ""; s < l; s++) c += Ui.charAt(p[s]);
          if (h) {
            if (l > 1) if (r == 16 || r == 8) {
              for (s = r == 16 ? 4 : 3, --l; l % s; l++) c += "0";
              for (p = fn(c, i, r), l = p.length; !p[l - 1]; --l) ;
              for (s = 1, c = "1."; s < l; s++) c += Ui.charAt(p[s]);
            } else c = c.charAt(0) + "." + c.slice(1);
            c = c + (o < 0 ? "p" : "p+") + o;
          } else if (o < 0) {
            for (; ++o; ) c = "0" + c;
            c = "0." + c;
          } else if (++o > l) for (o -= l; o--; ) c += "0";
          else o < l && (c = c.slice(0, o) + "." + c.slice(o));
        }
        c = (r == 16 ? "0x" : r == 2 ? "0b" : r == 8 ? "0o" : "") + c;
      }
      return e.s < 0 ? "-" + c : c;
    }
    function Fs(e, r) {
      if (e.length > r) return e.length = r, true;
    }
    function Rp(e) {
      return new this(e).abs();
    }
    function Ap(e) {
      return new this(e).acos();
    }
    function Cp(e) {
      return new this(e).acosh();
    }
    function Ip(e, r) {
      return new this(e).plus(r);
    }
    function Dp(e) {
      return new this(e).asin();
    }
    function Op(e) {
      return new this(e).asinh();
    }
    function kp(e) {
      return new this(e).atan();
    }
    function _p(e) {
      return new this(e).atanh();
    }
    function Np(e, r) {
      e = new this(e), r = new this(r);
      var t, n = this.precision, i = this.rounding, o = n + 4;
      return !e.s || !r.s ? t = new this(NaN) : !e.d && !r.d ? (t = xe(this, o, 1).times(r.s > 0 ? 0.25 : 0.75), t.s = e.s) : !r.d || e.isZero() ? (t = r.s < 0 ? xe(this, n, i) : new this(0), t.s = e.s) : !e.d || r.isZero() ? (t = xe(this, o, 1).times(0.5), t.s = e.s) : r.s < 0 ? (this.precision = o, this.rounding = 1, t = this.atan(L(e, r, o, 1)), r = xe(this, o, 1), this.precision = n, this.rounding = i, t = e.s < 0 ? t.minus(r) : t.plus(r)) : t = this.atan(L(e, r, o, 1)), t;
    }
    function Lp(e) {
      return new this(e).cbrt();
    }
    function Fp(e) {
      return y(e = new this(e), e.e + 1, 2);
    }
    function Mp(e, r, t) {
      return new this(e).clamp(r, t);
    }
    function $p(e) {
      if (!e || typeof e != "object") throw Error(En + "Object expected");
      var r, t, n, i = e.defaults === true, o = ["precision", 1, Ye, "rounding", 0, 8, "toExpNeg", -Pr, 0, "toExpPos", 0, Pr, "maxE", 0, Pr, "minE", -Pr, 0, "modulo", 0, 9];
      for (r = 0; r < o.length; r += 3) if (t = o[r], i && (this[t] = Gi[t]), (n = e[t]) !== void 0) if (X(n) === n && n >= o[r + 1] && n <= o[r + 2]) this[t] = n;
      else throw Error(He + t + ": " + n);
      if (t = "crypto", i && (this[t] = Gi[t]), (n = e[t]) !== void 0) if (n === true || n === false || n === 0 || n === 1) if (n) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[t] = true;
      else throw Error(Vs);
      else this[t] = false;
      else throw Error(He + t + ": " + n);
      return this;
    }
    function qp(e) {
      return new this(e).cos();
    }
    function Vp(e) {
      return new this(e).cosh();
    }
    function Ks(e) {
      var r, t, n;
      function i(o) {
        var s, a, l, u = this;
        if (!(u instanceof i)) return new i(o);
        if (u.constructor = i, Ms(o)) {
          u.s = o.s, w ? !o.d || o.e > i.maxE ? (u.e = NaN, u.d = null) : o.e < i.minE ? (u.e = 0, u.d = [0]) : (u.e = o.e, u.d = o.d.slice()) : (u.e = o.e, u.d = o.d ? o.d.slice() : o.d);
          return;
        }
        if (l = typeof o, l === "number") {
          if (o === 0) {
            u.s = 1 / o < 0 ? -1 : 1, u.e = 0, u.d = [0];
            return;
          }
          if (o < 0 ? (o = -o, u.s = -1) : u.s = 1, o === ~~o && o < 1e7) {
            for (s = 0, a = o; a >= 10; a /= 10) s++;
            w ? s > i.maxE ? (u.e = NaN, u.d = null) : s < i.minE ? (u.e = 0, u.d = [0]) : (u.e = s, u.d = [o]) : (u.e = s, u.d = [o]);
            return;
          }
          if (o * 0 !== 0) {
            o || (u.s = NaN), u.e = NaN, u.d = null;
            return;
          }
          return gn(u, o.toString());
        }
        if (l === "string") return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), u.s = -1) : (a === 43 && (o = o.slice(1)), u.s = 1), Bs.test(o) ? gn(u, o) : Tp(u, o);
        if (l === "bigint") return o < 0 ? (o = -o, u.s = -1) : u.s = 1, gn(u, o.toString());
        throw Error(He + o);
      }
      if (i.prototype = m, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.EUCLID = 9, i.config = i.set = $p, i.clone = Ks, i.isDecimal = Ms, i.abs = Rp, i.acos = Ap, i.acosh = Cp, i.add = Ip, i.asin = Dp, i.asinh = Op, i.atan = kp, i.atanh = _p, i.atan2 = Np, i.cbrt = Lp, i.ceil = Fp, i.clamp = Mp, i.cos = qp, i.cosh = Vp, i.div = jp, i.exp = Bp, i.floor = Up, i.hypot = Gp, i.ln = Qp, i.log = Wp, i.log10 = Kp, i.log2 = Jp, i.max = Hp, i.min = Yp, i.mod = zp, i.mul = Zp, i.pow = Xp, i.random = ed, i.round = rd, i.sign = td, i.sin = nd, i.sinh = id, i.sqrt = od, i.sub = sd, i.sum = ad, i.tan = ld, i.tanh = ud, i.trunc = cd, e === void 0 && (e = {}), e && e.defaults !== true) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], r = 0; r < n.length; ) e.hasOwnProperty(t = n[r++]) || (e[t] = this[t]);
      return i.config(e), i;
    }
    function jp(e, r) {
      return new this(e).div(r);
    }
    function Bp(e) {
      return new this(e).exp();
    }
    function Up(e) {
      return y(e = new this(e), e.e + 1, 3);
    }
    function Gp() {
      var e, r, t = new this(0);
      for (w = false, e = 0; e < arguments.length; ) if (r = new this(arguments[e++]), r.d) t.d && (t = t.plus(r.times(r)));
      else {
        if (r.s) return w = true, new this(1 / 0);
        t = r;
      }
      return w = true, t.sqrt();
    }
    function Ms(e) {
      return e instanceof Le || e && e.toStringTag === js || false;
    }
    function Qp(e) {
      return new this(e).ln();
    }
    function Wp(e, r) {
      return new this(e).log(r);
    }
    function Jp(e) {
      return new this(e).log(2);
    }
    function Kp(e) {
      return new this(e).log(10);
    }
    function Hp() {
      return Qs(this, arguments, -1);
    }
    function Yp() {
      return Qs(this, arguments, 1);
    }
    function zp(e, r) {
      return new this(e).mod(r);
    }
    function Zp(e, r) {
      return new this(e).mul(r);
    }
    function Xp(e, r) {
      return new this(e).pow(r);
    }
    function ed(e) {
      var r, t, n, i, o = 0, s = new this(1), a = [];
      if (e === void 0 ? e = this.precision : ne(e, 1, Ye), n = Math.ceil(e / E), this.crypto) if (crypto.getRandomValues) for (r = crypto.getRandomValues(new Uint32Array(n)); o < n; ) i = r[o], i >= 429e7 ? r[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i % 1e7;
      else if (crypto.randomBytes) {
        for (r = crypto.randomBytes(n *= 4); o < n; ) i = r[o] + (r[o + 1] << 8) + (r[o + 2] << 16) + ((r[o + 3] & 127) << 24), i >= 214e7 ? crypto.randomBytes(4).copy(r, o) : (a.push(i % 1e7), o += 4);
        o = n / 4;
      } else throw Error(Vs);
      else for (; o < n; ) a[o++] = Math.random() * 1e7 | 0;
      for (n = a[--o], e %= E, n && e && (i = U(10, E - e), a[o] = (n / i | 0) * i); a[o] === 0; o--) a.pop();
      if (o < 0) t = 0, a = [0];
      else {
        for (t = -1; a[0] === 0; t -= E) a.shift();
        for (n = 1, i = a[0]; i >= 10; i /= 10) n++;
        n < E && (t -= E - n);
      }
      return s.e = t, s.d = a, s;
    }
    function rd(e) {
      return y(e = new this(e), e.e + 1, this.rounding);
    }
    function td(e) {
      return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
    }
    function nd(e) {
      return new this(e).sin();
    }
    function id(e) {
      return new this(e).sinh();
    }
    function od(e) {
      return new this(e).sqrt();
    }
    function sd(e, r) {
      return new this(e).sub(r);
    }
    function ad() {
      var e = 0, r = arguments, t = new this(r[e]);
      for (w = false; t.s && ++e < r.length; ) t = t.plus(r[e]);
      return w = true, y(t, this.precision, this.rounding);
    }
    function ld(e) {
      return new this(e).tan();
    }
    function ud(e) {
      return new this(e).tanh();
    }
    function cd(e) {
      return y(e = new this(e), e.e + 1, 1);
    }
    m[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = m.toString;
    m[Symbol.toStringTag] = "Decimal";
    var Le = m.constructor = Ks(Gi);
    hn = new Le(hn);
    yn = new Le(yn);
    var Fe = Le;
    function Sr(e) {
      return Le.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
    }
    var ct = {};
    tr(ct, { ModelAction: () => Rr, datamodelEnumToSchemaEnum: () => pd });
    function pd(e) {
      return { name: e.name, values: e.values.map((r) => r.name) };
    }
    var Rr = ((b) => (b.findUnique = "findUnique", b.findUniqueOrThrow = "findUniqueOrThrow", b.findFirst = "findFirst", b.findFirstOrThrow = "findFirstOrThrow", b.findMany = "findMany", b.create = "create", b.createMany = "createMany", b.createManyAndReturn = "createManyAndReturn", b.update = "update", b.updateMany = "updateMany", b.updateManyAndReturn = "updateManyAndReturn", b.upsert = "upsert", b.delete = "delete", b.deleteMany = "deleteMany", b.groupBy = "groupBy", b.count = "count", b.aggregate = "aggregate", b.findRaw = "findRaw", b.aggregateRaw = "aggregateRaw", b))(Rr || {});
    var Xs = O(Di());
    var Zs = O(require("node:fs"));
    var Hs = { keyword: De, entity: De, value: (e) => W(nr(e)), punctuation: nr, directive: De, function: De, variable: (e) => W(nr(e)), string: (e) => W(qe(e)), boolean: Ie, number: De, comment: Hr };
    var dd = (e) => e;
    var vn = {};
    var md = 0;
    var v = { manual: vn.Prism && vn.Prism.manual, disableWorkerMessageHandler: vn.Prism && vn.Prism.disableWorkerMessageHandler, util: { encode: function(e) {
      if (e instanceof ge) {
        let r = e;
        return new ge(r.type, v.util.encode(r.content), r.alias);
      } else return Array.isArray(e) ? e.map(v.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
    }, type: function(e) {
      return Object.prototype.toString.call(e).slice(8, -1);
    }, objId: function(e) {
      return e.__id || Object.defineProperty(e, "__id", { value: ++md }), e.__id;
    }, clone: function e(r, t) {
      let n, i, o = v.util.type(r);
      switch (t = t || {}, o) {
        case "Object":
          if (i = v.util.objId(r), t[i]) return t[i];
          n = {}, t[i] = n;
          for (let s in r) r.hasOwnProperty(s) && (n[s] = e(r[s], t));
          return n;
        case "Array":
          return i = v.util.objId(r), t[i] ? t[i] : (n = [], t[i] = n, r.forEach(function(s, a) {
            n[a] = e(s, t);
          }), n);
        default:
          return r;
      }
    } }, languages: { extend: function(e, r) {
      let t = v.util.clone(v.languages[e]);
      for (let n in r) t[n] = r[n];
      return t;
    }, insertBefore: function(e, r, t, n) {
      n = n || v.languages;
      let i = n[e], o = {};
      for (let a in i) if (i.hasOwnProperty(a)) {
        if (a == r) for (let l in t) t.hasOwnProperty(l) && (o[l] = t[l]);
        t.hasOwnProperty(a) || (o[a] = i[a]);
      }
      let s = n[e];
      return n[e] = o, v.languages.DFS(v.languages, function(a, l) {
        l === s && a != e && (this[a] = o);
      }), o;
    }, DFS: function e(r, t, n, i) {
      i = i || {};
      let o = v.util.objId;
      for (let s in r) if (r.hasOwnProperty(s)) {
        t.call(r, s, r[s], n || s);
        let a = r[s], l = v.util.type(a);
        l === "Object" && !i[o(a)] ? (i[o(a)] = true, e(a, t, null, i)) : l === "Array" && !i[o(a)] && (i[o(a)] = true, e(a, t, s, i));
      }
    } }, plugins: {}, highlight: function(e, r, t) {
      let n = { code: e, grammar: r, language: t };
      return v.hooks.run("before-tokenize", n), n.tokens = v.tokenize(n.code, n.grammar), v.hooks.run("after-tokenize", n), ge.stringify(v.util.encode(n.tokens), n.language);
    }, matchGrammar: function(e, r, t, n, i, o, s) {
      for (let g in t) {
        if (!t.hasOwnProperty(g) || !t[g]) continue;
        if (g == s) return;
        let I = t[g];
        I = v.util.type(I) === "Array" ? I : [I];
        for (let T = 0; T < I.length; ++T) {
          let S = I[T], b = S.inside, D = !!S.lookbehind, me4 = !!S.greedy, se = 0, Kr = S.alias;
          if (me4 && !S.pattern.global) {
            let j = S.pattern.toString().match(/[imuy]*$/)[0];
            S.pattern = RegExp(S.pattern.source, j + "g");
          }
          S = S.pattern || S;
          for (let j = n, te = i; j < r.length; te += r[j].length, ++j) {
            let Ae = r[j];
            if (r.length > e.length) return;
            if (Ae instanceof ge) continue;
            if (me4 && j != r.length - 1) {
              S.lastIndex = te;
              var p = S.exec(e);
              if (!p) break;
              var c = p.index + (D ? p[1].length : 0), d = p.index + p[0].length, a = j, l = te;
              for (let k = r.length; a < k && (l < d || !r[a].type && !r[a - 1].greedy); ++a) l += r[a].length, c >= l && (++j, te = l);
              if (r[j] instanceof ge) continue;
              u = a - j, Ae = e.slice(te, l), p.index -= te;
            } else {
              S.lastIndex = 0;
              var p = S.exec(Ae), u = 1;
            }
            if (!p) {
              if (o) break;
              continue;
            }
            D && (se = p[1] ? p[1].length : 0);
            var c = p.index + se, p = p[0].slice(se), d = c + p.length, f = Ae.slice(0, c), h = Ae.slice(d);
            let K = [j, u];
            f && (++j, te += f.length, K.push(f));
            let fr = new ge(g, b ? v.tokenize(p, b) : p, Kr, p, me4);
            if (K.push(fr), h && K.push(h), Array.prototype.splice.apply(r, K), u != 1 && v.matchGrammar(e, r, t, j, te, true, g), o) break;
          }
        }
      }
    }, tokenize: function(e, r) {
      let t = [e], n = r.rest;
      if (n) {
        for (let i in n) r[i] = n[i];
        delete r.rest;
      }
      return v.matchGrammar(e, t, r, 0, 0, false), t;
    }, hooks: { all: {}, add: function(e, r) {
      let t = v.hooks.all;
      t[e] = t[e] || [], t[e].push(r);
    }, run: function(e, r) {
      let t = v.hooks.all[e];
      if (!(!t || !t.length)) for (var n = 0, i; i = t[n++]; ) i(r);
    } }, Token: ge };
    v.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true }, "class-name": { pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i, lookbehind: true, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/, boolean: /\b(?:true|false)\b/, function: /\w+(?=\()/, number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/, punctuation: /[{}[\];(),.:]/ };
    v.languages.javascript = v.languages.extend("clike", { "class-name": [v.languages.clike["class-name"], { pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/, lookbehind: true }], keyword: [{ pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: true }, { pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/, lookbehind: true }], number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/, function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/, operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/ });
    v.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
    v.languages.insertBefore("javascript", "keyword", { regex: { pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/, lookbehind: true, greedy: true }, "function-variable": { pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/, alias: "function" }, parameter: [{ pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/, lookbehind: true, inside: v.languages.javascript }, { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i, inside: v.languages.javascript }, { pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/, lookbehind: true, inside: v.languages.javascript }, { pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/, lookbehind: true, inside: v.languages.javascript }], constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/ });
    v.languages.markup && v.languages.markup.tag.addInlined("script", "javascript");
    v.languages.js = v.languages.javascript;
    v.languages.typescript = v.languages.extend("javascript", { keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/, builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/ });
    v.languages.ts = v.languages.typescript;
    function ge(e, r, t, n, i) {
      this.type = e, this.content = r, this.alias = t, this.length = (n || "").length | 0, this.greedy = !!i;
    }
    ge.stringify = function(e, r) {
      return typeof e == "string" ? e : Array.isArray(e) ? e.map(function(t) {
        return ge.stringify(t, r);
      }).join("") : fd(e.type)(e.content);
    };
    function fd(e) {
      return Hs[e] || dd;
    }
    function Ys(e) {
      return gd(e, v.languages.javascript);
    }
    function gd(e, r) {
      return v.tokenize(e, r).map((n) => ge.stringify(n)).join("");
    }
    function zs(e) {
      return Ci(e);
    }
    var Pn = class e {
      firstLineNumber;
      lines;
      static read(r) {
        let t;
        try {
          t = Zs.default.readFileSync(r, "utf-8");
        } catch {
          return null;
        }
        return e.fromContent(t);
      }
      static fromContent(r) {
        let t = r.split(/\r?\n/);
        return new e(1, t);
      }
      constructor(r, t) {
        this.firstLineNumber = r, this.lines = t;
      }
      get lastLineNumber() {
        return this.firstLineNumber + this.lines.length - 1;
      }
      mapLineAt(r, t) {
        if (r < this.firstLineNumber || r > this.lines.length + this.firstLineNumber) return this;
        let n = r - this.firstLineNumber, i = [...this.lines];
        return i[n] = t(i[n]), new e(this.firstLineNumber, i);
      }
      mapLines(r) {
        return new e(this.firstLineNumber, this.lines.map((t, n) => r(t, this.firstLineNumber + n)));
      }
      lineAt(r) {
        return this.lines[r - this.firstLineNumber];
      }
      prependSymbolAt(r, t) {
        return this.mapLines((n, i) => i === r ? `${t} ${n}` : `  ${n}`);
      }
      slice(r, t) {
        let n = this.lines.slice(r - 1, t).join(`
`);
        return new e(r, zs(n).split(`
`));
      }
      highlight() {
        let r = Ys(this.toString());
        return new e(this.firstLineNumber, r.split(`
`));
      }
      toString() {
        return this.lines.join(`
`);
      }
    };
    var hd = { red: ce, gray: Hr, dim: Ce, bold: W, underline: Y, highlightSource: (e) => e.highlight() };
    var yd = { red: (e) => e, gray: (e) => e, dim: (e) => e, bold: (e) => e, underline: (e) => e, highlightSource: (e) => e };
    function bd({ message: e, originalMethod: r, isPanic: t, callArguments: n }) {
      return { functionName: `prisma.${r}()`, message: e, isPanic: t ?? false, callArguments: n };
    }
    function Ed({ callsite: e, message: r, originalMethod: t, isPanic: n, callArguments: i }, o) {
      let s = bd({ message: r, originalMethod: t, isPanic: n, callArguments: i });
      if (!e || typeof window < "u" || process.env.NODE_ENV === "production") return s;
      let a = e.getLocation();
      if (!a || !a.lineNumber || !a.columnNumber) return s;
      let l = Math.max(1, a.lineNumber - 3), u = Pn.read(a.fileName)?.slice(l, a.lineNumber), c = u?.lineAt(a.lineNumber);
      if (u && c) {
        let p = xd(c), d = wd(c);
        if (!d) return s;
        s.functionName = `${d.code})`, s.location = a, n || (u = u.mapLineAt(a.lineNumber, (h) => h.slice(0, d.openingBraceIndex))), u = o.highlightSource(u);
        let f = String(u.lastLineNumber).length;
        if (s.contextLines = u.mapLines((h, g) => o.gray(String(g).padStart(f)) + " " + h).mapLines((h) => o.dim(h)).prependSymbolAt(a.lineNumber, o.bold(o.red("\u2192"))), i) {
          let h = p + f + 1;
          h += 2, s.callArguments = (0, Xs.default)(i, h).slice(h);
        }
      }
      return s;
    }
    function wd(e) {
      let r = Object.keys(Rr).join("|"), n = new RegExp(String.raw`\.(${r})\(`).exec(e);
      if (n) {
        let i = n.index + n[0].length, o = e.lastIndexOf(" ", n.index) + 1;
        return { code: e.slice(o, i), openingBraceIndex: i };
      }
      return null;
    }
    function xd(e) {
      let r = 0;
      for (let t = 0; t < e.length; t++) {
        if (e.charAt(t) !== " ") return r;
        r++;
      }
      return r;
    }
    function vd({ functionName: e, location: r, message: t, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], l = r ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l}`)), r && a.push(s.underline(Pd(r))), i) {
        a.push("");
        let u = [i.toString()];
        o && (u.push(o), u.push(s.dim(")"))), a.push(u.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(t), a.join(`
`);
    }
    function Pd(e) {
      let r = [e.fileName];
      return e.lineNumber && r.push(String(e.lineNumber)), e.columnNumber && r.push(String(e.columnNumber)), r.join(":");
    }
    function Tn(e) {
      let r = e.showColors ? hd : yd, t;
      return t = Ed(e, r), vd(t, r);
    }
    var la = O(Ki());
    function na(e, r, t) {
      let n = ia(e), i = Td(n), o = Rd(i);
      o ? Sn(o, r, t) : r.addErrorMessage(() => "Unknown error");
    }
    function ia(e) {
      return e.errors.flatMap((r) => r.kind === "Union" ? ia(r) : [r]);
    }
    function Td(e) {
      let r = /* @__PURE__ */ new Map(), t = [];
      for (let n of e) {
        if (n.kind !== "InvalidArgumentType") {
          t.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = r.get(i);
        o ? r.set(i, { ...n, argument: { ...n.argument, typeNames: Sd(o.argument.typeNames, n.argument.typeNames) } }) : r.set(i, n);
      }
      return t.push(...r.values()), t;
    }
    function Sd(e, r) {
      return [...new Set(e.concat(r))];
    }
    function Rd(e) {
      return ji(e, (r, t) => {
        let n = ra(r), i = ra(t);
        return n !== i ? n - i : ta(r) - ta(t);
      });
    }
    function ra(e) {
      let r = 0;
      return Array.isArray(e.selectionPath) && (r += e.selectionPath.length), Array.isArray(e.argumentPath) && (r += e.argumentPath.length), r;
    }
    function ta(e) {
      switch (e.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    var le = class {
      constructor(r, t) {
        this.name = r;
        this.value = t;
      }
      isRequired = false;
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(r) {
        let { colors: { green: t } } = r.context;
        r.addMarginSymbol(t(this.isRequired ? "+" : "?")), r.write(t(this.name)), this.isRequired || r.write(t("?")), r.write(t(": ")), typeof this.value == "string" ? r.write(t(this.value)) : r.write(this.value);
      }
    };
    sa();
    var Ar = class {
      constructor(r = 0, t) {
        this.context = t;
        this.currentIndent = r;
      }
      lines = [];
      currentLine = "";
      currentIndent = 0;
      marginSymbol;
      afterNextNewLineCallback;
      write(r) {
        return typeof r == "string" ? this.currentLine += r : r.write(this), this;
      }
      writeJoined(r, t, n = (i, o) => o.write(i)) {
        let i = t.length - 1;
        for (let o = 0; o < t.length; o++) n(t[o], this), o !== i && this.write(r);
        return this;
      }
      writeLine(r) {
        return this.write(r).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let r = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, r?.(), this;
      }
      withIndent(r) {
        return this.indent(), r(this), this.unindent(), this;
      }
      afterNextNewline(r) {
        return this.afterNextNewLineCallback = r, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(r) {
        return this.marginSymbol = r, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let r = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + r.slice(1) : r;
      }
    };
    oa();
    var Rn = class {
      constructor(r) {
        this.value = r;
      }
      write(r) {
        r.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    var An = (e) => e;
    var Cn = { bold: An, red: An, green: An, dim: An, enabled: false };
    var aa = { bold: W, red: ce, green: qe, dim: Ce, enabled: true };
    var Cr = { write(e) {
      e.writeLine(",");
    } };
    var Pe = class {
      constructor(r) {
        this.contents = r;
      }
      isUnderlined = false;
      color = (r) => r;
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(r) {
        return this.color = r, this;
      }
      write(r) {
        let t = r.getCurrentLineLength();
        r.write(this.color(this.contents)), this.isUnderlined && r.afterNextNewline(() => {
          r.write(" ".repeat(t)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    var ze = class {
      hasError = false;
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var Ir = class extends ze {
      items = [];
      addItem(r) {
        return this.items.push(new Rn(r)), this;
      }
      getField(r) {
        return this.items[r];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((t) => t.value.getPrintWidth())) + 2;
      }
      write(r) {
        if (this.items.length === 0) {
          this.writeEmpty(r);
          return;
        }
        this.writeWithItems(r);
      }
      writeEmpty(r) {
        let t = new Pe("[]");
        this.hasError && t.setColor(r.context.colors.red).underline(), r.write(t);
      }
      writeWithItems(r) {
        let { colors: t } = r.context;
        r.writeLine("[").withIndent(() => r.writeJoined(Cr, this.items).newLine()).write("]"), this.hasError && r.afterNextNewline(() => {
          r.writeLine(t.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var Dr = class e extends ze {
      fields = {};
      suggestions = [];
      addField(r) {
        this.fields[r.name] = r;
      }
      addSuggestion(r) {
        this.suggestions.push(r);
      }
      getField(r) {
        return this.fields[r];
      }
      getDeepField(r) {
        let [t, ...n] = r, i = this.getField(t);
        if (!i) return;
        let o = i;
        for (let s of n) {
          let a;
          if (o.value instanceof e ? a = o.value.getField(s) : o.value instanceof Ir && (a = o.value.getField(Number(s))), !a) return;
          o = a;
        }
        return o;
      }
      getDeepFieldValue(r) {
        return r.length === 0 ? this : this.getDeepField(r)?.value;
      }
      hasField(r) {
        return !!this.getField(r);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(r) {
        delete this.fields[r];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(r) {
        return this.getField(r)?.value;
      }
      getDeepSubSelectionValue(r) {
        let t = this;
        for (let n of r) {
          if (!(t instanceof e)) return;
          let i = t.getSubSelectionValue(n);
          if (!i) return;
          t = i;
        }
        return t;
      }
      getDeepSelectionParent(r) {
        let t = this.getSelectionParent();
        if (!t) return;
        let n = t;
        for (let i of r) {
          let o = n.value.getFieldValue(i);
          if (!o || !(o instanceof e)) return;
          let s = o.getSelectionParent();
          if (!s) return;
          n = s;
        }
        return n;
      }
      getSelectionParent() {
        let r = this.getField("select")?.value.asObject();
        if (r) return { kind: "select", value: r };
        let t = this.getField("include")?.value.asObject();
        if (t) return { kind: "include", value: t };
      }
      getSubSelectionValue(r) {
        return this.getSelectionParent()?.value.fields[r].value;
      }
      getPrintWidth() {
        let r = Object.values(this.fields);
        return r.length == 0 ? 2 : Math.max(...r.map((n) => n.getPrintWidth())) + 2;
      }
      write(r) {
        let t = Object.values(this.fields);
        if (t.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(r);
          return;
        }
        this.writeWithContents(r, t);
      }
      asObject() {
        return this;
      }
      writeEmpty(r) {
        let t = new Pe("{}");
        this.hasError && t.setColor(r.context.colors.red).underline(), r.write(t);
      }
      writeWithContents(r, t) {
        r.writeLine("{").withIndent(() => {
          r.writeJoined(Cr, [...t, ...this.suggestions]).newLine();
        }), r.write("}"), this.hasError && r.afterNextNewline(() => {
          r.writeLine(r.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    var Q = class extends ze {
      constructor(t) {
        super();
        this.text = t;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(t) {
        let n = new Pe(this.text);
        this.hasError && n.underline().setColor(t.context.colors.red), t.write(n);
      }
      asObject() {
      }
    };
    var pt = class {
      fields = [];
      addField(r, t) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${r}: ${t}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(r) {
        let { colors: { green: t } } = r.context;
        r.writeLine(t("{")).withIndent(() => {
          r.writeJoined(Cr, this.fields).newLine();
        }).write(t("}")).addMarginSymbol(t("+"));
      }
    };
    function Sn(e, r, t) {
      switch (e.kind) {
        case "MutuallyExclusiveFields":
          Ad(e, r);
          break;
        case "IncludeOnScalar":
          Cd(e, r);
          break;
        case "EmptySelection":
          Id(e, r, t);
          break;
        case "UnknownSelectionField":
          _d(e, r);
          break;
        case "InvalidSelectionValue":
          Nd(e, r);
          break;
        case "UnknownArgument":
          Ld(e, r);
          break;
        case "UnknownInputField":
          Fd(e, r);
          break;
        case "RequiredArgumentMissing":
          Md(e, r);
          break;
        case "InvalidArgumentType":
          $d(e, r);
          break;
        case "InvalidArgumentValue":
          qd(e, r);
          break;
        case "ValueTooLarge":
          Vd(e, r);
          break;
        case "SomeFieldsMissing":
          jd(e, r);
          break;
        case "TooManyFieldsGiven":
          Bd(e, r);
          break;
        case "Union":
          na(e, r, t);
          break;
        default:
          throw new Error("not implemented: " + e.kind);
      }
    }
    function Ad(e, r) {
      let t = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      t && (t.getField(e.firstField)?.markAsError(), t.getField(e.secondField)?.markAsError()), r.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    function Cd(e, r) {
      let [t, n] = Or(e.selectionPath), i = e.outputType, o = r.arguments.getDeepSelectionParent(t)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new le(s.name, "true"));
      r.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${dt(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    function Id(e, r, t) {
      let n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          Dd(e, r, i);
          return;
        }
        if (n.hasField("select")) {
          Od(e, r);
          return;
        }
      }
      if (t?.[We(e.outputType.name)]) {
        kd(e, r);
        return;
      }
      r.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
    }
    function Dd(e, r, t) {
      t.removeAllFields();
      for (let n of e.outputType.fields) t.addSuggestion(new le(n.name, "false"));
      r.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    function Od(e, r) {
      let t = e.outputType, n = r.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), pa(n, t)), r.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(t.name)} must not be empty. ${dt(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(t.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    function kd(e, r) {
      let t = new pt();
      for (let i of e.outputType.fields) i.isRelation || t.addField(i.name, "false");
      let n = new le("omit", t).makeRequired();
      if (e.selectionPath.length === 0) r.arguments.addSuggestion(n);
      else {
        let [i, o] = Or(e.selectionPath), a = r.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let l = a?.value.asObject() ?? new Dr();
          l.addSuggestion(n), a.value = l;
        }
      }
      r.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    function _d(e, r) {
      let t = da(e.selectionPath, r);
      if (t.parentKind !== "unknown") {
        t.field.markAsError();
        let n = t.parent;
        switch (t.parentKind) {
          case "select":
            pa(n, e.outputType);
            break;
          case "include":
            Ud(n, e.outputType);
            break;
          case "omit":
            Gd(n, e.outputType);
            break;
        }
      }
      r.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${t.fieldName}\``)}`];
        return t.parentKind !== "unknown" && i.push(`for ${n.bold(t.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(dt(n)), i.join(" ");
      });
    }
    function Nd(e, r) {
      let t = da(e.selectionPath, r);
      t.parentKind !== "unknown" && t.field.value.markAsError(), r.addErrorMessage((n) => `Invalid value for selection field \`${n.red(t.fieldName)}\`: ${e.underlyingError}`);
    }
    function Ld(e, r) {
      let t = e.argumentPath[0], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && (n.getField(t)?.markAsError(), Qd(n, e.arguments)), r.addErrorMessage((i) => ua(i, t, e.arguments.map((o) => o.name)));
    }
    function Fd(e, r) {
      let [t, n] = Or(e.argumentPath), i = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(e.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(t)?.asObject();
        o && ma(o, e.inputType);
      }
      r.addErrorMessage((o) => ua(o, n, e.inputType.fields.map((s) => s.name)));
    }
    function ua(e, r, t) {
      let n = [`Unknown argument \`${e.red(r)}\`.`], i = Jd(r, t);
      return i && n.push(`Did you mean \`${e.green(i)}\`?`), t.length > 0 && n.push(dt(e)), n.join(" ");
    }
    function Md(e, r) {
      let t;
      r.addErrorMessage((l) => t?.value instanceof Q && t.value.text === "null" ? `Argument \`${l.green(o)}\` must not be ${l.red("null")}.` : `Argument \`${l.green(o)}\` is missing.`);
      let n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = Or(e.argumentPath), s = new pt(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) {
        if (t = a.getField(o), t && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
          for (let l of e.inputTypes[0].fields) s.addField(l.name, l.typeNames.join(" | "));
          a.addSuggestion(new le(o, s).makeRequired());
        } else {
          let l = e.inputTypes.map(ca).join(" | ");
          a.addSuggestion(new le(o, l).makeRequired());
        }
        if (e.dependentArgumentPath) {
          n.getDeepField(e.dependentArgumentPath)?.markAsError();
          let [, l] = Or(e.dependentArgumentPath);
          r.addErrorMessage((u) => `Argument \`${u.green(o)}\` is required because argument \`${u.green(l)}\` was provided.`);
        }
      }
    }
    function ca(e) {
      return e.kind === "list" ? `${ca(e.elementType)}[]` : e.name;
    }
    function $d(e, r) {
      let t = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), r.addErrorMessage((i) => {
        let o = In("or", e.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(t)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
      });
    }
    function qd(e, r) {
      let t = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), r.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(t)}\``];
        if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
          let s = In("or", e.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    function Vd(e, r) {
      let t = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(e.argumentPath)?.value;
        s?.markAsError(), s instanceof Q && (i = s.text);
      }
      r.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(t)}\``), s.join(" ");
      });
    }
    function jd(e, r) {
      let t = e.argumentPath[e.argumentPath.length - 1], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
        i && ma(i, e.inputType);
      }
      r.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(t)}\` of type ${i.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${In("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(dt(i)), o.join(" ");
      });
    }
    function Bd(e, r) {
      let t = e.argumentPath[e.argumentPath.length - 1], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      r.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(t)}\` of type ${o.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${In("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    function pa(e, r) {
      for (let t of r.fields) e.hasField(t.name) || e.addSuggestion(new le(t.name, "true"));
    }
    function Ud(e, r) {
      for (let t of r.fields) t.isRelation && !e.hasField(t.name) && e.addSuggestion(new le(t.name, "true"));
    }
    function Gd(e, r) {
      for (let t of r.fields) !e.hasField(t.name) && !t.isRelation && e.addSuggestion(new le(t.name, "true"));
    }
    function Qd(e, r) {
      for (let t of r) e.hasField(t.name) || e.addSuggestion(new le(t.name, t.typeNames.join(" | ")));
    }
    function da(e, r) {
      let [t, n] = Or(e), i = r.arguments.getDeepSubSelectionValue(t)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), l = o?.getField(n);
      return o && l ? { parentKind: "select", parent: o, field: l, fieldName: n } : (l = s?.getField(n), s && l ? { parentKind: "include", field: l, parent: s, fieldName: n } : (l = a?.getField(n), a && l ? { parentKind: "omit", field: l, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    function ma(e, r) {
      if (r.kind === "object") for (let t of r.fields) e.hasField(t.name) || e.addSuggestion(new le(t.name, t.typeNames.join(" | ")));
    }
    function Or(e) {
      let r = [...e], t = r.pop();
      if (!t) throw new Error("unexpected empty path");
      return [r, t];
    }
    function dt({ green: e, enabled: r }) {
      return "Available options are " + (r ? `listed in ${e("green")}` : "marked with ?") + ".";
    }
    function In(e, r) {
      if (r.length === 1) return r[0];
      let t = [...r], n = t.pop();
      return `${t.join(", ")} ${e} ${n}`;
    }
    var Wd = 3;
    function Jd(e, r) {
      let t = 1 / 0, n;
      for (let i of r) {
        let o = (0, la.default)(e, i);
        o > Wd || o < t && (t = o, n = i);
      }
      return n;
    }
    var mt = class {
      modelName;
      name;
      typeName;
      isList;
      isEnum;
      constructor(r, t, n, i, o) {
        this.modelName = r, this.name = t, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let r = this.isList ? "List" : "", t = this.isEnum ? "Enum" : "";
        return `${r}${t}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function kr(e) {
      return e instanceof mt;
    }
    var Dn = /* @__PURE__ */ Symbol();
    var Yi = /* @__PURE__ */ new WeakMap();
    var Me = class {
      constructor(r) {
        r === Dn ? Yi.set(this, `Prisma.${this._getName()}`) : Yi.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return Yi.get(this);
      }
    };
    var ft = class extends Me {
      _getNamespace() {
        return "NullTypes";
      }
    };
    var gt = class extends ft {
      #e;
    };
    zi(gt, "DbNull");
    var ht = class extends ft {
      #e;
    };
    zi(ht, "JsonNull");
    var yt = class extends ft {
      #e;
    };
    zi(yt, "AnyNull");
    var On = { classes: { DbNull: gt, JsonNull: ht, AnyNull: yt }, instances: { DbNull: new gt(Dn), JsonNull: new ht(Dn), AnyNull: new yt(Dn) } };
    function zi(e, r) {
      Object.defineProperty(e, "name", { value: r, configurable: true });
    }
    var fa = ": ";
    var kn = class {
      constructor(r, t) {
        this.name = r;
        this.value = t;
      }
      hasError = false;
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + fa.length;
      }
      write(r) {
        let t = new Pe(this.name);
        this.hasError && t.underline().setColor(r.context.colors.red), r.write(t).write(fa).write(this.value);
      }
    };
    var Zi = class {
      arguments;
      errorMessages = [];
      constructor(r) {
        this.arguments = r;
      }
      write(r) {
        r.write(this.arguments);
      }
      addErrorMessage(r) {
        this.errorMessages.push(r);
      }
      renderAllMessages(r) {
        return this.errorMessages.map((t) => t(r)).join(`
`);
      }
    };
    function _r(e) {
      return new Zi(ga(e));
    }
    function ga(e) {
      let r = new Dr();
      for (let [t, n] of Object.entries(e)) {
        let i = new kn(t, ha(n));
        r.addField(i);
      }
      return r;
    }
    function ha(e) {
      if (typeof e == "string") return new Q(JSON.stringify(e));
      if (typeof e == "number" || typeof e == "boolean") return new Q(String(e));
      if (typeof e == "bigint") return new Q(`${e}n`);
      if (e === null) return new Q("null");
      if (e === void 0) return new Q("undefined");
      if (Sr(e)) return new Q(`new Prisma.Decimal("${e.toFixed()}")`);
      if (e instanceof Uint8Array) return Buffer.isBuffer(e) ? new Q(`Buffer.alloc(${e.byteLength})`) : new Q(`new Uint8Array(${e.byteLength})`);
      if (e instanceof Date) {
        let r = mn(e) ? e.toISOString() : "Invalid Date";
        return new Q(`new Date("${r}")`);
      }
      return e instanceof Me ? new Q(`Prisma.${e._getName()}`) : kr(e) ? new Q(`prisma.${We(e.modelName)}.$fields.${e.name}`) : Array.isArray(e) ? Kd(e) : typeof e == "object" ? ga(e) : new Q(Object.prototype.toString.call(e));
    }
    function Kd(e) {
      let r = new Ir();
      for (let t of e) r.addItem(ha(t));
      return r;
    }
    function _n(e, r) {
      let t = r === "pretty" ? aa : Cn, n = e.renderAllMessages(t), i = new Ar(0, { colors: t }).write(e).toString();
      return { message: n, args: i };
    }
    function Nn({ args: e, errors: r, errorFormat: t, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = _r(e);
      for (let p of r) Sn(p, a, s);
      let { message: l, args: u } = _n(a, t), c = Tn({ message: l, callsite: n, originalMethod: i, showColors: t === "pretty", callArguments: u });
      throw new Z(c, { clientVersion: o });
    }
    function Te(e) {
      return e.replace(/^./, (r) => r.toLowerCase());
    }
    function ba(e, r, t) {
      let n = Te(t);
      return !r.result || !(r.result.$allModels || r.result[n]) ? e : Hd({ ...e, ...ya(r.name, e, r.result.$allModels), ...ya(r.name, e, r.result[n]) });
    }
    function Hd(e) {
      let r = new we(), t = (n, i) => r.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => t(o, i)) : [n]));
      return pn(e, (n) => ({ ...n, needs: t(n.name, /* @__PURE__ */ new Set()) }));
    }
    function ya(e, r, t) {
      return t ? pn(t, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: Yd(r, o, i) })) : {};
    }
    function Yd(e, r, t) {
      let n = e?.[r]?.compute;
      return n ? (i) => t({ ...i, [r]: n(i) }) : t;
    }
    function Ea(e, r) {
      if (!r) return e;
      let t = { ...e };
      for (let n of Object.values(r)) if (e[n.name]) for (let i of n.needs) t[i] = true;
      return t;
    }
    function wa(e, r) {
      if (!r) return e;
      let t = { ...e };
      for (let n of Object.values(r)) if (!e[n.name]) for (let i of n.needs) delete t[i];
      return t;
    }
    var Ln = class {
      constructor(r, t) {
        this.extension = r;
        this.previous = t;
      }
      computedFieldsCache = new we();
      modelExtensionsCache = new we();
      queryCallbacksCache = new we();
      clientExtensions = lt(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      batchCallbacks = lt(() => {
        let r = this.previous?.getAllBatchQueryCallbacks() ?? [], t = this.extension.query?.$__internalBatch;
        return t ? r.concat(t) : r;
      });
      getAllComputedFields(r) {
        return this.computedFieldsCache.getOrCreate(r, () => ba(this.previous?.getAllComputedFields(r), this.extension, r));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(r) {
        return this.modelExtensionsCache.getOrCreate(r, () => {
          let t = Te(r);
          return !this.extension.model || !(this.extension.model[t] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(r) : { ...this.previous?.getAllModelExtensions(r), ...this.extension.model.$allModels, ...this.extension.model[t] };
        });
      }
      getAllQueryCallbacks(r, t) {
        return this.queryCallbacksCache.getOrCreate(`${r}:${t}`, () => {
          let n = this.previous?.getAllQueryCallbacks(r, t) ?? [], i = [], o = this.extension.query;
          return !o || !(o[r] || o.$allModels || o[t] || o.$allOperations) ? n : (o[r] !== void 0 && (o[r][t] !== void 0 && i.push(o[r][t]), o[r].$allOperations !== void 0 && i.push(o[r].$allOperations)), r !== "$none" && o.$allModels !== void 0 && (o.$allModels[t] !== void 0 && i.push(o.$allModels[t]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[t] !== void 0 && i.push(o[t]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var Nr = class e {
      constructor(r) {
        this.head = r;
      }
      static empty() {
        return new e();
      }
      static single(r) {
        return new e(new Ln(r));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(r) {
        return new e(new Ln(r, this.head));
      }
      getAllComputedFields(r) {
        return this.head?.getAllComputedFields(r);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(r) {
        return this.head?.getAllModelExtensions(r);
      }
      getAllQueryCallbacks(r, t) {
        return this.head?.getAllQueryCallbacks(r, t) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    var Fn = class {
      constructor(r) {
        this.name = r;
      }
    };
    function xa(e) {
      return e instanceof Fn;
    }
    function va(e) {
      return new Fn(e);
    }
    var Pa = /* @__PURE__ */ Symbol();
    var bt = class {
      constructor(r) {
        if (r !== Pa) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(r) {
        return r === void 0 ? Mn : r;
      }
    };
    var Mn = new bt(Pa);
    function Se(e) {
      return e instanceof bt;
    }
    var zd = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var Ta = "explicitly `undefined` values are not allowed";
    function $n({ modelName: e, action: r, args: t, runtimeDataModel: n, extensions: i = Nr.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c }) {
      let p = new Xi({ runtimeDataModel: n, modelName: e, action: r, rootArgs: t, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c });
      return { modelName: e, action: zd[r], query: Et(t, p) };
    }
    function Et({ select: e, include: r, ...t } = {}, n) {
      let i = t.omit;
      return delete t.omit, { arguments: Ra(t, n), selection: Zd(e, r, i, n) };
    }
    function Zd(e, r, t, n) {
      return e ? (r ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : t && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), tm(e, n)) : Xd(n, r, t);
    }
    function Xd(e, r, t) {
      let n = {};
      return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), r && em(n, r, e), rm(n, t, e), n;
    }
    function em(e, r, t) {
      for (let [n, i] of Object.entries(r)) {
        if (Se(i)) continue;
        let o = t.nestSelection(n);
        if (eo(i, o), i === false || i === void 0) {
          e[n] = false;
          continue;
        }
        let s = t.findField(n);
        if (s && s.kind !== "object" && t.throwValidationError({ kind: "IncludeOnScalar", selectionPath: t.getSelectionPath().concat(n), outputType: t.getOutputTypeDescription() }), s) {
          e[n] = Et(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          e[n] = true;
          continue;
        }
        e[n] = Et(i, o);
      }
    }
    function rm(e, r, t) {
      let n = t.getComputedFields(), i = { ...t.getGlobalOmit(), ...r }, o = wa(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (Se(a)) continue;
        eo(a, t.nestSelection(s));
        let l = t.findField(s);
        n?.[s] && !l || (e[s] = !a);
      }
    }
    function tm(e, r) {
      let t = {}, n = r.getComputedFields(), i = Ea(e, n);
      for (let [o, s] of Object.entries(i)) {
        if (Se(s)) continue;
        let a = r.nestSelection(o);
        eo(s, a);
        let l = r.findField(o);
        if (!(n?.[o] && !l)) {
          if (s === false || s === void 0 || Se(s)) {
            t[o] = false;
            continue;
          }
          if (s === true) {
            l?.kind === "object" ? t[o] = Et({}, a) : t[o] = true;
            continue;
          }
          t[o] = Et(s, a);
        }
      }
      return t;
    }
    function Sa(e, r) {
      if (e === null) return null;
      if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
      if (typeof e == "bigint") return { $type: "BigInt", value: String(e) };
      if (vr(e)) {
        if (mn(e)) return { $type: "DateTime", value: e.toISOString() };
        r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r.getSelectionPath(), argumentPath: r.getArgumentPath(), argument: { name: r.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (xa(e)) return { $type: "Param", value: e.name };
      if (kr(e)) return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
      if (Array.isArray(e)) return nm(e, r);
      if (ArrayBuffer.isView(e)) {
        let { buffer: t, byteOffset: n, byteLength: i } = e;
        return { $type: "Bytes", value: Buffer.from(t, n, i).toString("base64") };
      }
      if (im(e)) return e.values;
      if (Sr(e)) return { $type: "Decimal", value: e.toFixed() };
      if (e instanceof Me) {
        if (e !== On.instances[e._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: e._getName() };
      }
      if (om(e)) return e.toJSON();
      if (typeof e == "object") return Ra(e, r);
      r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r.getSelectionPath(), argumentPath: r.getArgumentPath(), argument: { name: r.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    function Ra(e, r) {
      if (e.$type) return { $type: "Raw", value: e };
      let t = {};
      for (let n in e) {
        let i = e[n], o = r.nestArgument(n);
        Se(i) || (i !== void 0 ? t[n] = Sa(i, o) : r.isPreviewFeatureOn("strictUndefinedChecks") && r.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: r.getSelectionPath(), argument: { name: r.getArgumentName(), typeNames: [] }, underlyingError: Ta }));
      }
      return t;
    }
    function nm(e, r) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let i = r.nestArgument(String(n)), o = e[n];
        if (o === void 0 || Se(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${r.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        t.push(Sa(o, i));
      }
      return t;
    }
    function im(e) {
      return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
    }
    function om(e) {
      return typeof e == "object" && e !== null && typeof e.toJSON == "function";
    }
    function eo(e, r) {
      e === void 0 && r.isPreviewFeatureOn("strictUndefinedChecks") && r.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: r.getSelectionPath(), underlyingError: Ta });
    }
    var Xi = class e {
      constructor(r) {
        this.params = r;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      modelOrType;
      throwValidationError(r) {
        Nn({ errors: [r], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((r) => ({ name: r.name, typeName: "boolean", isRelation: r.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(r) {
        return this.params.previewFeatures.includes(r);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(r) {
        return this.modelOrType?.fields.find((t) => t.name === r);
      }
      nestSelection(r) {
        let t = this.findField(r), n = t?.kind === "object" ? t.type : void 0;
        return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(r) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[We(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "updateManyAndReturn":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            ar(this.params.action, "Unknown action");
        }
      }
      nestArgument(r) {
        return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(r) });
      }
    };
    function Aa(e) {
      if (!e._hasPreviewFlag("metrics")) throw new Z("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: e._clientVersion });
    }
    var Lr = class {
      _client;
      constructor(r) {
        this._client = r;
      }
      prometheus(r) {
        return Aa(this._client), this._client._engine.metrics({ format: "prometheus", ...r });
      }
      json(r) {
        return Aa(this._client), this._client._engine.metrics({ format: "json", ...r });
      }
    };
    function Ca(e, r) {
      let t = lt(() => sm(r));
      Object.defineProperty(e, "dmmf", { get: () => t.get() });
    }
    function sm(e) {
      return { datamodel: { models: ro(e.models), enums: ro(e.enums), types: ro(e.types) } };
    }
    function ro(e) {
      return Object.entries(e).map(([r, t]) => ({ name: r, ...t }));
    }
    var to = /* @__PURE__ */ new WeakMap();
    var qn = "$$PrismaTypedSql";
    var wt = class {
      constructor(r, t) {
        to.set(this, { sql: r, values: t }), Object.defineProperty(this, qn, { value: qn });
      }
      get sql() {
        return to.get(this).sql;
      }
      get values() {
        return to.get(this).values;
      }
    };
    function Ia(e) {
      return (...r) => new wt(e, r);
    }
    function Vn(e) {
      return e != null && e[qn] === qn;
    }
    var cu = O(Ti());
    var pu = require("node:async_hooks");
    var du = require("node:events");
    var mu = O(require("node:fs"));
    var ri = O(require("node:path"));
    var ie = class e {
      constructor(r, t) {
        if (r.length - 1 !== t.length) throw r.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${r.length} strings to have ${r.length - 1} values`);
        let n = t.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = r[0];
        let i = 0, o = 0;
        for (; i < t.length; ) {
          let s = t[i++], a = r[i];
          if (s instanceof e) {
            this.strings[o] += s.strings[0];
            let l = 0;
            for (; l < s.values.length; ) this.values[o++] = s.values[l++], this.strings[o] = s.strings[l];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let r = this.strings.length, t = 1, n = this.strings[0];
        for (; t < r; ) n += `?${this.strings[t++]}`;
        return n;
      }
      get statement() {
        let r = this.strings.length, t = 1, n = this.strings[0];
        for (; t < r; ) n += `:${t}${this.strings[t++]}`;
        return n;
      }
      get text() {
        let r = this.strings.length, t = 1, n = this.strings[0];
        for (; t < r; ) n += `$${t}${this.strings[t++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function Da(e, r = ",", t = "", n = "") {
      if (e.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new ie([t, ...Array(e.length - 1).fill(r), n], e);
    }
    function no(e) {
      return new ie([e], []);
    }
    var Oa = no("");
    function io(e, ...r) {
      return new ie(e, r);
    }
    function xt(e) {
      return { getKeys() {
        return Object.keys(e);
      }, getPropertyValue(r) {
        return e[r];
      } };
    }
    function re(e, r) {
      return { getKeys() {
        return [e];
      }, getPropertyValue() {
        return r();
      } };
    }
    function lr(e) {
      let r = new we();
      return { getKeys() {
        return e.getKeys();
      }, getPropertyValue(t) {
        return r.getOrCreate(t, () => e.getPropertyValue(t));
      }, getPropertyDescriptor(t) {
        return e.getPropertyDescriptor?.(t);
      } };
    }
    var jn = { enumerable: true, configurable: true, writable: true };
    function Bn(e) {
      let r = new Set(e);
      return { getPrototypeOf: () => Object.prototype, getOwnPropertyDescriptor: () => jn, has: (t, n) => r.has(n), set: (t, n, i) => r.add(n) && Reflect.set(t, n, i), ownKeys: () => [...r] };
    }
    var ka = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
    function he(e, r) {
      let t = am(r), n = /* @__PURE__ */ new Set(), i = new Proxy(e, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = t.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = t.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = _a(Reflect.ownKeys(o), t), a = _a(Array.from(t.keys()), t);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return t.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let l = t.get(s);
        return l ? l.getPropertyDescriptor ? { ...jn, ...l?.getPropertyDescriptor(s) } : jn : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      }, getPrototypeOf: () => Object.prototype });
      return i[ka] = function() {
        let o = { ...this };
        return delete o[ka], o;
      }, i;
    }
    function am(e) {
      let r = /* @__PURE__ */ new Map();
      for (let t of e) {
        let n = t.getKeys();
        for (let i of n) r.set(i, t);
      }
      return r;
    }
    function _a(e, r) {
      return e.filter((t) => r.get(t)?.has?.(t) ?? true);
    }
    function Fr(e) {
      return { getKeys() {
        return e;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    function Mr(e, r) {
      return { batch: e, transaction: r?.kind === "batch" ? { isolationLevel: r.options.isolationLevel } : void 0 };
    }
    function Na(e) {
      if (e === void 0) return "";
      let r = _r(e);
      return new Ar(0, { colors: Cn }).write(r).toString();
    }
    var lm = "P2037";
    function $r({ error: e, user_facing_error: r }, t, n) {
      return r.error_code ? new z11(um(r, n), { code: r.error_code, clientVersion: t, meta: r.meta, batchRequestIdx: r.batch_request_idx }) : new V(e, { clientVersion: t, batchRequestIdx: r.batch_request_idx });
    }
    function um(e, r) {
      let t = e.message;
      return (r === "postgresql" || r === "postgres" || r === "mysql") && e.error_code === lm && (t += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), t;
    }
    var vt = "<unknown>";
    function La(e) {
      var r = e.split(`
`);
      return r.reduce(function(t, n) {
        var i = dm(n) || fm(n) || ym(n) || xm(n) || Em(n);
        return i && t.push(i), t;
      }, []);
    }
    var cm = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    var pm = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    function dm(e) {
      var r = cm.exec(e);
      if (!r) return null;
      var t = r[2] && r[2].indexOf("native") === 0, n = r[2] && r[2].indexOf("eval") === 0, i = pm.exec(r[2]);
      return n && i != null && (r[2] = i[1], r[3] = i[2], r[4] = i[3]), { file: t ? null : r[2], methodName: r[1] || vt, arguments: t ? [r[2]] : [], lineNumber: r[3] ? +r[3] : null, column: r[4] ? +r[4] : null };
    }
    var mm = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function fm(e) {
      var r = mm.exec(e);
      return r ? { file: r[2], methodName: r[1] || vt, arguments: [], lineNumber: +r[3], column: r[4] ? +r[4] : null } : null;
    }
    var gm = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
    var hm = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    function ym(e) {
      var r = gm.exec(e);
      if (!r) return null;
      var t = r[3] && r[3].indexOf(" > eval") > -1, n = hm.exec(r[3]);
      return t && n != null && (r[3] = n[1], r[4] = n[2], r[5] = null), { file: r[3], methodName: r[1] || vt, arguments: r[2] ? r[2].split(",") : [], lineNumber: r[4] ? +r[4] : null, column: r[5] ? +r[5] : null };
    }
    var bm = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
    function Em(e) {
      var r = bm.exec(e);
      return r ? { file: r[3], methodName: r[1] || vt, arguments: [], lineNumber: +r[4], column: r[5] ? +r[5] : null } : null;
    }
    var wm = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    function xm(e) {
      var r = wm.exec(e);
      return r ? { file: r[2], methodName: r[1] || vt, arguments: [], lineNumber: +r[3], column: r[4] ? +r[4] : null } : null;
    }
    var oo = class {
      getLocation() {
        return null;
      }
    };
    var so = class {
      _error;
      constructor() {
        this._error = new Error();
      }
      getLocation() {
        let r = this._error.stack;
        if (!r) return null;
        let n = La(r).find((i) => {
          if (!i.file) return false;
          let o = Li(i.file);
          return o !== "<anonymous>" && !o.includes("@prisma") && !o.includes("/packages/client/src/runtime/") && !o.endsWith("/runtime/binary.js") && !o.endsWith("/runtime/library.js") && !o.endsWith("/runtime/edge.js") && !o.endsWith("/runtime/edge-esm.js") && !o.startsWith("internal/") && !i.methodName.includes("new ") && !i.methodName.includes("getCallSite") && !i.methodName.includes("Proxy.") && i.methodName.split(".").length < 4;
        });
        return !n || !n.file ? null : { fileName: n.file, lineNumber: n.lineNumber, columnNumber: n.column };
      }
    };
    function Ze(e) {
      return e === "minimal" ? typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite() : new oo() : new so();
    }
    var Fa = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function qr(e = {}) {
      let r = Pm(e);
      return Object.entries(r).reduce((n, [i, o]) => (Fa[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    function Pm(e = {}) {
      return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
    }
    function Un(e = {}) {
      return (r) => (typeof e._count == "boolean" && (r._count = r._count._all), r);
    }
    function Ma(e, r) {
      let t = Un(e);
      return r({ action: "aggregate", unpacker: t, argsMapper: qr })(e);
    }
    function Tm(e = {}) {
      let { select: r, ...t } = e;
      return typeof r == "object" ? qr({ ...t, _count: r }) : qr({ ...t, _count: { _all: true } });
    }
    function Sm(e = {}) {
      return typeof e.select == "object" ? (r) => Un(e)(r)._count : (r) => Un(e)(r)._count._all;
    }
    function $a(e, r) {
      return r({ action: "count", unpacker: Sm(e), argsMapper: Tm })(e);
    }
    function Rm(e = {}) {
      let r = qr(e);
      if (Array.isArray(r.by)) for (let t of r.by) typeof t == "string" && (r.select[t] = true);
      else typeof r.by == "string" && (r.select[r.by] = true);
      return r;
    }
    function Am(e = {}) {
      return (r) => (typeof e?._count == "boolean" && r.forEach((t) => {
        t._count = t._count._all;
      }), r);
    }
    function qa(e, r) {
      return r({ action: "groupBy", unpacker: Am(e), argsMapper: Rm })(e);
    }
    function Va(e, r, t) {
      if (r === "aggregate") return (n) => Ma(n, t);
      if (r === "count") return (n) => $a(n, t);
      if (r === "groupBy") return (n) => qa(n, t);
    }
    function ja(e, r) {
      let t = r.fields.filter((i) => !i.relationName), n = _s(t, "name");
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new mt(e, o, s.type, s.isList, s.kind === "enum");
      }, ...Bn(Object.keys(n)) });
    }
    var Ba = (e) => Array.isArray(e) ? e : e.split(".");
    var ao = (e, r) => Ba(r).reduce((t, n) => t && t[n], e);
    var Ua = (e, r, t) => Ba(r).reduceRight((n, i, o, s) => Object.assign({}, ao(e, s.slice(0, o)), { [i]: n }), t);
    function Cm(e, r) {
      return e === void 0 || r === void 0 ? [] : [...r, "select", e];
    }
    function Im(e, r, t) {
      return r === void 0 ? e ?? {} : Ua(r, t, e || true);
    }
    function lo(e, r, t, n, i, o) {
      let a = e._runtimeDataModel.models[r].fields.reduce((l, u) => ({ ...l, [u.name]: u }), {});
      return (l) => {
        let u = Ze(e._errorFormat), c = Cm(n, i), p = Im(l, o, c), d = t({ dataPath: c, callsite: u })(p), f = Dm(e, r);
        return new Proxy(d, { get(h, g) {
          if (!f.includes(g)) return h[g];
          let T = [a[g].type, t, g], S = [c, p];
          return lo(e, ...T, ...S);
        }, ...Bn([...f, ...Object.getOwnPropertyNames(d)]) });
      };
    }
    function Dm(e, r) {
      return e._runtimeDataModel.models[r].fields.filter((t) => t.kind === "object").map((t) => t.name);
    }
    var Om = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var km = ["aggregate", "count", "groupBy"];
    function uo(e, r) {
      let t = e._extensions.getAllModelExtensions(r) ?? {}, n = [_m(e, r), Lm(e, r), xt(t), re("name", () => r), re("$name", () => r), re("$parent", () => e._appliedParent)];
      return he({}, n);
    }
    function _m(e, r) {
      let t = Te(r), n = Object.keys(Rr).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = (a) => (l) => {
          let u = Ze(e._errorFormat);
          return e._createPrismaPromise((c) => {
            let p = { args: l, dataPath: [], action: o, model: r, clientMethod: `${t}.${i}`, jsModelName: t, transaction: c, callsite: u };
            return e._request({ ...p, ...a });
          }, { action: o, args: l, model: r });
        };
        return Om.includes(o) ? lo(e, r, s) : Nm(i) ? Va(e, i, s) : s({});
      } };
    }
    function Nm(e) {
      return km.includes(e);
    }
    function Lm(e, r) {
      return lr(re("fields", () => {
        let t = e._runtimeDataModel.models[r];
        return ja(r, t);
      }));
    }
    function Ga(e) {
      return e.replace(/^./, (r) => r.toUpperCase());
    }
    var co = /* @__PURE__ */ Symbol();
    function Pt(e) {
      let r = [Fm(e), Mm(e), re(co, () => e), re("$parent", () => e._appliedParent)], t = e._extensions.getAllClientExtensions();
      return t && r.push(xt(t)), he(e, r);
    }
    function Fm(e) {
      let r = Object.getPrototypeOf(e._originalClient), t = [...new Set(Object.getOwnPropertyNames(r))];
      return { getKeys() {
        return t;
      }, getPropertyValue(n) {
        return e[n];
      } };
    }
    function Mm(e) {
      let r = Object.keys(e._runtimeDataModel.models), t = r.map(Te), n = [...new Set(r.concat(t))];
      return lr({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = Ga(i);
        if (e._runtimeDataModel.models[o] !== void 0) return uo(e, o);
        if (e._runtimeDataModel.models[i] !== void 0) return uo(e, i);
      }, getPropertyDescriptor(i) {
        if (!t.includes(i)) return { enumerable: false };
      } });
    }
    function Qa(e) {
      return e[co] ? e[co] : e;
    }
    function Wa(e) {
      if (typeof e == "function") return e(this);
      if (e.client?.__AccelerateEngine) {
        let t = e.client.__AccelerateEngine;
        this._originalClient._engine = new t(this._originalClient._accelerateEngineConfig);
      }
      let r = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } });
      return Pt(r);
    }
    function Ja({ result: e, modelName: r, select: t, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(r);
      if (!o) return e;
      let s = [], a = [];
      for (let l of Object.values(o)) {
        if (n) {
          if (n[l.name]) continue;
          let u = l.needs.filter((c) => n[c]);
          u.length > 0 && a.push(Fr(u));
        } else if (t) {
          if (!t[l.name]) continue;
          let u = l.needs.filter((c) => !t[c]);
          u.length > 0 && a.push(Fr(u));
        }
        $m(e, l.needs) && s.push(qm(l, he(e, s)));
      }
      return s.length > 0 || a.length > 0 ? he(e, [...s, ...a]) : e;
    }
    function $m(e, r) {
      return r.every((t) => Vi(e, t));
    }
    function qm(e, r) {
      return lr(re(e.name, () => e.compute(r)));
    }
    function Gn({ visitor: e, result: r, args: t, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(r)) {
        for (let s = 0; s < r.length; s++) r[s] = Gn({ result: r[s], args: t, modelName: i, runtimeDataModel: n, visitor: e });
        return r;
      }
      let o = e(r, i, t) ?? r;
      return t.include && Ka({ includeOrSelect: t.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), t.select && Ka({ includeOrSelect: t.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
    }
    function Ka({ includeOrSelect: e, result: r, parentModelName: t, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(e)) {
        if (!s || r[o] == null || Se(s)) continue;
        let l = n.models[t].fields.find((c) => c.name === o);
        if (!l || l.kind !== "object" || !l.relationName) continue;
        let u = typeof s == "object" ? s : {};
        r[o] = Gn({ visitor: i, result: r[o], args: u, modelName: l.type, runtimeDataModel: n });
      }
    }
    function Ha({ result: e, modelName: r, args: t, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || e == null || typeof e != "object" || !i.models[r] ? e : Gn({ result: e, args: t ?? {}, modelName: r, runtimeDataModel: i, visitor: (a, l, u) => {
        let c = Te(l);
        return Ja({ result: a, modelName: c, select: u.select, omit: u.select ? void 0 : { ...o?.[c], ...u.omit }, extensions: n });
      } });
    }
    var Vm = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
    var Ya = Vm;
    function za(e) {
      if (e instanceof ie) return jm(e);
      if (Vn(e)) return Bm(e);
      if (Array.isArray(e)) {
        let t = [e[0]];
        for (let n = 1; n < e.length; n++) t[n] = Tt(e[n]);
        return t;
      }
      let r = {};
      for (let t in e) r[t] = Tt(e[t]);
      return r;
    }
    function jm(e) {
      return new ie(e.strings, e.values);
    }
    function Bm(e) {
      return new wt(e.sql, e.values);
    }
    function Tt(e) {
      if (typeof e != "object" || e == null || e instanceof Me || kr(e)) return e;
      if (Sr(e)) return new Fe(e.toFixed());
      if (vr(e)) return /* @__PURE__ */ new Date(+e);
      if (ArrayBuffer.isView(e)) return e.slice(0);
      if (Array.isArray(e)) {
        let r = e.length, t;
        for (t = Array(r); r--; ) t[r] = Tt(e[r]);
        return t;
      }
      if (typeof e == "object") {
        let r = {};
        for (let t in e) t === "__proto__" ? Object.defineProperty(r, t, { value: Tt(e[t]), configurable: true, enumerable: true, writable: true }) : r[t] = Tt(e[t]);
        return r;
      }
      ar(e, "Unknown value");
    }
    function Xa(e, r, t, n = 0) {
      return e._createPrismaPromise((i) => {
        let o = r.customDataProxyFetch;
        return "transaction" in r && i !== void 0 && (r.transaction?.kind === "batch" && r.transaction.lock.then(), r.transaction = i), n === t.length ? e._executeRequest(r) : t[n]({ model: r.model, operation: r.model ? r.action : r.clientMethod, args: za(r.args ?? {}), __internalParams: r, query: (s, a = r) => {
          let l = a.customDataProxyFetch;
          return a.customDataProxyFetch = nl(o, l), a.args = s, Xa(e, a, t, n + 1);
        } });
      });
    }
    function el(e, r) {
      let { jsModelName: t, action: n, clientMethod: i } = r, o = t ? n : i;
      if (e._extensions.isEmpty()) return e._executeRequest(r);
      let s = e._extensions.getAllQueryCallbacks(t ?? "$none", o);
      return Xa(e, r, s);
    }
    function rl(e) {
      return (r) => {
        let t = { requests: r }, n = r[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? tl(t, n, 0, e) : e(t);
      };
    }
    function tl(e, r, t, n) {
      if (t === r.length) return n(e);
      let i = e.customDataProxyFetch, o = e.requests[0].transaction;
      return r[t]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: e, query(s, a = e) {
        let l = a.customDataProxyFetch;
        return a.customDataProxyFetch = nl(i, l), tl(a, r, t + 1, n);
      } });
    }
    var Za = (e) => e;
    function nl(e = Za, r = Za) {
      return (t) => e(r(t));
    }
    var il = N("prisma:client");
    var ol = { Vercel: "vercel", "Netlify CI": "netlify" };
    function sl({ postinstall: e, ciName: r, clientVersion: t, generator: n }) {
      if (il("checkPlatformCaching:postinstall", e), il("checkPlatformCaching:ciName", r), e === true && !(n?.output && typeof (n.output.fromEnvVar ?? n.output.value) == "string") && r && r in ol) {
        let i = `Prisma has detected that this project was built on ${r}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${ol[r]}-build`;
        throw console.error(i), new P2(i, t);
      }
    }
    function al(e, r) {
      return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [r[0]]: { url: e.datasourceUrl } } : {} : {};
    }
    var dl = O(require("node:fs"));
    var St = O(require("node:path"));
    function Qn(e) {
      let { runtimeBinaryTarget: r } = e;
      return `Add "${r}" to \`binaryTargets\` in the "schema.prisma" file and run \`prisma generate\` after saving it:

${Um(e)}`;
    }
    function Um(e) {
      let { generator: r, generatorBinaryTargets: t, runtimeBinaryTarget: n } = e, i = { fromEnvVar: null, value: n }, o = [...t, i];
      return ki({ ...r, binaryTargets: o });
    }
    function Xe(e) {
      let { runtimeBinaryTarget: r } = e;
      return `Prisma Client could not locate the Query Engine for runtime "${r}".`;
    }
    function er(e) {
      let { searchedLocations: r } = e;
      return `The following locations have been searched:
${[...new Set(r)].map((i) => `  ${i}`).join(`
`)}`;
    }
    function ll(e) {
      let { runtimeBinaryTarget: r } = e;
      return `${Xe(e)}

This happened because \`binaryTargets\` have been pinned, but the actual deployment also required "${r}".
${Qn(e)}

${er(e)}`;
    }
    function Wn(e) {
      return `We would appreciate if you could take the time to share some information with us.
Please help us by answering a few questions: https://pris.ly/${e}`;
    }
    function Jn(e) {
      let { errorStack: r } = e;
      return r?.match(/\/\.next|\/next@|\/next\//) ? `

We detected that you are using Next.js, learn how to fix this: https://pris.ly/d/engine-not-found-nextjs.` : "";
    }
    function ul(e) {
      let { queryEngineName: r } = e;
      return `${Xe(e)}${Jn(e)}

This is likely caused by a bundler that has not copied "${r}" next to the resulting bundle.
Ensure that "${r}" has been copied next to the bundle or in "${e.expectedLocation}".

${Wn("engine-not-found-bundler-investigation")}

${er(e)}`;
    }
    function cl(e) {
      let { runtimeBinaryTarget: r, generatorBinaryTargets: t } = e, n = t.find((i) => i.native);
      return `${Xe(e)}

This happened because Prisma Client was generated for "${n?.value ?? "unknown"}", but the actual deployment required "${r}".
${Qn(e)}

${er(e)}`;
    }
    function pl(e) {
      let { queryEngineName: r } = e;
      return `${Xe(e)}${Jn(e)}

This is likely caused by tooling that has not copied "${r}" to the deployment folder.
Ensure that you ran \`prisma generate\` and that "${r}" has been copied to "${e.expectedLocation}".

${Wn("engine-not-found-tooling-investigation")}

${er(e)}`;
    }
    var Gm = N("prisma:client:engines:resolveEnginePath");
    var Qm = () => new RegExp("runtime[\\\\/]library\\.m?js$");
    async function ml(e, r) {
      let t = { binary: process.env.PRISMA_QUERY_ENGINE_BINARY, library: process.env.PRISMA_QUERY_ENGINE_LIBRARY }[e] ?? r.prismaPath;
      if (t !== void 0) return t;
      let { enginePath: n, searchedLocations: i } = await Wm(e, r);
      if (Gm("enginePath", n), n !== void 0 && e === "binary" && Ri(n), n !== void 0) return r.prismaPath = n;
      let o = await ir(), s = r.generator?.binaryTargets ?? [], a = s.some((d) => d.native), l = !s.some((d) => d.value === o), u = __filename.match(Qm()) === null, c = { searchedLocations: i, generatorBinaryTargets: s, generator: r.generator, runtimeBinaryTarget: o, queryEngineName: fl(e, o), expectedLocation: St.default.relative(process.cwd(), r.dirname), errorStack: new Error().stack }, p;
      throw a && l ? p = cl(c) : l ? p = ll(c) : u ? p = ul(c) : p = pl(c), new P2(p, r.clientVersion);
    }
    async function Wm(e, r) {
      let t = await ir(), n = [], i = [r.dirname, St.default.resolve(__dirname, ".."), r.generator?.output?.value ?? __dirname, St.default.resolve(__dirname, "../../../.prisma/client"), "/tmp/prisma-engines", r.cwd];
      __filename.includes("resolveEnginePath") && i.push(ms());
      for (let o of i) {
        let s = fl(e, t), a = St.default.join(o, s);
        if (n.push(o), dl.default.existsSync(a)) return { enginePath: a, searchedLocations: n };
      }
      return { enginePath: void 0, searchedLocations: n };
    }
    function fl(e, r) {
      return e === "library" ? Gt(r, "fs") : `query-engine-${r}${r === "windows" ? ".exe" : ""}`;
    }
    function gl(e) {
      return e ? e.replace(/".*"/g, '"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g, (r) => `${r[0]}5`) : "";
    }
    function hl(e) {
      return e.split(`
`).map((r) => r.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/, "").replace(/\+\d+\s*ms$/, "")).join(`
`);
    }
    var yl = O(Os());
    function bl({ title: e, user: r = "prisma", repo: t = "prisma", template: n = "bug_report.yml", body: i }) {
      return (0, yl.default)({ user: r, repo: t, template: n, title: e, body: i });
    }
    function El({ version: e, binaryTarget: r, title: t, description: n, engineVersion: i, database: o, query: s }) {
      let a = Bo(6e3 - (s?.length ?? 0)), l = hl(wr(a)), u = n ? `# Description
\`\`\`
${n}
\`\`\`` : "", c = wr(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process.version?.padEnd(19)}| 
| OS              | ${r?.padEnd(19)}|
| Prisma Client   | ${e?.padEnd(19)}|
| Query Engine    | ${i?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${u}

## Logs
\`\`\`
${l}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s ? gl(s) : ""}
\`\`\`
`), p = bl({ title: t, body: c });
      return `${t}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${Y(p)}

If you want the Prisma team to look into it, please open the link above \u{1F64F}
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
    }
    function wl(e, r) {
      throw new Error(r);
    }
    function Jm(e) {
      return e !== null && typeof e == "object" && typeof e.$type == "string";
    }
    function Km(e, r) {
      let t = {};
      for (let n of Object.keys(e)) t[n] = r(e[n], n);
      return t;
    }
    function Vr(e) {
      return e === null ? e : Array.isArray(e) ? e.map(Vr) : typeof e == "object" ? Jm(e) ? Hm(e) : e.constructor !== null && e.constructor.name !== "Object" ? e : Km(e, Vr) : e;
    }
    function Hm({ $type: e, value: r }) {
      switch (e) {
        case "BigInt":
          return BigInt(r);
        case "Bytes": {
          let { buffer: t, byteOffset: n, byteLength: i } = Buffer.from(r, "base64");
          return new Uint8Array(t, n, i);
        }
        case "DateTime":
          return new Date(r);
        case "Decimal":
          return new Le(r);
        case "Json":
          return JSON.parse(r);
        default:
          wl(r, "Unknown tagged value");
      }
    }
    var xl = "6.19.3";
    var zm = () => globalThis.process?.release?.name === "node";
    var Zm = () => !!globalThis.Bun || !!globalThis.process?.versions?.bun;
    var Xm = () => !!globalThis.Deno;
    var ef = () => typeof globalThis.Netlify == "object";
    var rf = () => typeof globalThis.EdgeRuntime == "object";
    var tf = () => globalThis.navigator?.userAgent === "Cloudflare-Workers";
    function nf() {
      return [[ef, "netlify"], [rf, "edge-light"], [tf, "workerd"], [Xm, "deno"], [Zm, "bun"], [zm, "node"]].flatMap((t) => t[0]() ? [t[1]] : []).at(0) ?? "";
    }
    var of = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function Kn() {
      let e = nf();
      return { id: e, prettyName: of[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
    }
    function jr({ inlineDatasources: e, overrideDatasources: r, env: t, clientVersion: n }) {
      let i, o = Object.keys(e)[0], s = e[o]?.url, a = r[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = t[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw new P2(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new P2("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    var Hn = class extends Error {
      clientVersion;
      cause;
      constructor(r, t) {
        super(r), this.clientVersion = t.clientVersion, this.cause = t.cause;
      }
      get [Symbol.toStringTag]() {
        return this.name;
      }
    };
    var oe = class extends Hn {
      isRetryable;
      constructor(r, t) {
        super(r, t), this.isRetryable = t.isRetryable ?? true;
      }
    };
    function R(e, r) {
      return { ...e, isRetryable: r };
    }
    var ur = class extends oe {
      name = "InvalidDatasourceError";
      code = "P6001";
      constructor(r, t) {
        super(r, R(t, false));
      }
    };
    x(ur, "InvalidDatasourceError");
    function vl(e) {
      let r = { clientVersion: e.clientVersion }, t = Object.keys(e.inlineDatasources)[0], n = jr({ inlineDatasources: e.inlineDatasources, overrideDatasources: e.overrideDatasources, clientVersion: e.clientVersion, env: { ...e.env, ...typeof process < "u" ? process.env : {} } }), i;
      try {
        i = new URL(n);
      } catch {
        throw new ur(`Error validating datasource \`${t}\`: the URL must start with the protocol \`prisma://\``, r);
      }
      let { protocol: o, searchParams: s } = i;
      if (o !== "prisma:" && o !== sn) throw new ur(`Error validating datasource \`${t}\`: the URL must start with the protocol \`prisma://\` or \`prisma+postgres://\``, r);
      let a = s.get("api_key");
      if (a === null || a.length < 1) throw new ur(`Error validating datasource \`${t}\`: the URL must contain a valid API key`, r);
      let l = Ii(i) ? "http:" : "https:";
      process.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR && i.searchParams.has("use_http") && (l = "http:");
      let u = new URL(i.href.replace(o, l));
      return { apiKey: a, url: u };
    }
    var Pl = O(on());
    var Yn = class {
      apiKey;
      tracingHelper;
      logLevel;
      logQueries;
      engineHash;
      constructor({ apiKey: r, tracingHelper: t, logLevel: n, logQueries: i, engineHash: o }) {
        this.apiKey = r, this.tracingHelper = t, this.logLevel = n, this.logQueries = i, this.engineHash = o;
      }
      build({ traceparent: r, transactionId: t } = {}) {
        let n = { Accept: "application/json", Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Prisma-Engine-Hash": this.engineHash, "Prisma-Engine-Version": Pl.enginesVersion };
        this.tracingHelper.isEnabled() && (n.traceparent = r ?? this.tracingHelper.getTraceParent()), t && (n["X-Transaction-Id"] = t);
        let i = this.#e();
        return i.length > 0 && (n["X-Capture-Telemetry"] = i.join(", ")), n;
      }
      #e() {
        let r = [];
        return this.tracingHelper.isEnabled() && r.push("tracing"), this.logLevel && r.push(this.logLevel), this.logQueries && r.push("query"), r;
      }
    };
    function sf(e) {
      return e[0] * 1e3 + e[1] / 1e6;
    }
    function po(e) {
      return new Date(sf(e));
    }
    var Br = class extends oe {
      name = "ForcedRetryError";
      code = "P5001";
      constructor(r) {
        super("This request must be retried", R(r, true));
      }
    };
    x(Br, "ForcedRetryError");
    var cr = class extends oe {
      name = "NotImplementedYetError";
      code = "P5004";
      constructor(r, t) {
        super(r, R(t, false));
      }
    };
    x(cr, "NotImplementedYetError");
    var $ = class extends oe {
      response;
      constructor(r, t) {
        super(r, t), this.response = t.response;
        let n = this.response.headers.get("prisma-request-id");
        if (n) {
          let i = `(The request id was: ${n})`;
          this.message = this.message + " " + i;
        }
      }
    };
    var pr = class extends $ {
      name = "SchemaMissingError";
      code = "P5005";
      constructor(r) {
        super("Schema needs to be uploaded", R(r, true));
      }
    };
    x(pr, "SchemaMissingError");
    var mo = "This request could not be understood by the server";
    var Rt = class extends $ {
      name = "BadRequestError";
      code = "P5000";
      constructor(r, t, n) {
        super(t || mo, R(r, false)), n && (this.code = n);
      }
    };
    x(Rt, "BadRequestError");
    var At = class extends $ {
      name = "HealthcheckTimeoutError";
      code = "P5013";
      logs;
      constructor(r, t) {
        super("Engine not started: healthcheck timeout", R(r, true)), this.logs = t;
      }
    };
    x(At, "HealthcheckTimeoutError");
    var Ct = class extends $ {
      name = "EngineStartupError";
      code = "P5014";
      logs;
      constructor(r, t, n) {
        super(t, R(r, true)), this.logs = n;
      }
    };
    x(Ct, "EngineStartupError");
    var It = class extends $ {
      name = "EngineVersionNotSupportedError";
      code = "P5012";
      constructor(r) {
        super("Engine version is not supported", R(r, false));
      }
    };
    x(It, "EngineVersionNotSupportedError");
    var fo = "Request timed out";
    var Dt = class extends $ {
      name = "GatewayTimeoutError";
      code = "P5009";
      constructor(r, t = fo) {
        super(t, R(r, false));
      }
    };
    x(Dt, "GatewayTimeoutError");
    var af = "Interactive transaction error";
    var Ot = class extends $ {
      name = "InteractiveTransactionError";
      code = "P5015";
      constructor(r, t = af) {
        super(t, R(r, false));
      }
    };
    x(Ot, "InteractiveTransactionError");
    var lf = "Request parameters are invalid";
    var kt = class extends $ {
      name = "InvalidRequestError";
      code = "P5011";
      constructor(r, t = lf) {
        super(t, R(r, false));
      }
    };
    x(kt, "InvalidRequestError");
    var go = "Requested resource does not exist";
    var _t = class extends $ {
      name = "NotFoundError";
      code = "P5003";
      constructor(r, t = go) {
        super(t, R(r, false));
      }
    };
    x(_t, "NotFoundError");
    var ho = "Unknown server error";
    var Ur = class extends $ {
      name = "ServerError";
      code = "P5006";
      logs;
      constructor(r, t, n) {
        super(t || ho, R(r, true)), this.logs = n;
      }
    };
    x(Ur, "ServerError");
    var yo = "Unauthorized, check your connection string";
    var Nt = class extends $ {
      name = "UnauthorizedError";
      code = "P5007";
      constructor(r, t = yo) {
        super(t, R(r, false));
      }
    };
    x(Nt, "UnauthorizedError");
    var bo = "Usage exceeded, retry again later";
    var Lt = class extends $ {
      name = "UsageExceededError";
      code = "P5008";
      constructor(r, t = bo) {
        super(t, R(r, true));
      }
    };
    x(Lt, "UsageExceededError");
    async function uf(e) {
      let r;
      try {
        r = await e.text();
      } catch {
        return { type: "EmptyError" };
      }
      try {
        let t = JSON.parse(r);
        if (typeof t == "string") switch (t) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: t };
          default:
            return { type: "UnknownTextError", body: t };
        }
        if (typeof t == "object" && t !== null) {
          if ("is_panic" in t && "message" in t && "error_code" in t) return { type: "QueryEngineError", body: t };
          if ("EngineNotStarted" in t || "InteractiveTransactionMisrouted" in t || "InvalidRequestError" in t) {
            let n = Object.values(t)[0].reason;
            return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: t } : { type: "DataProxyError", body: t };
          }
        }
        return { type: "UnknownJsonError", body: t };
      } catch {
        return r === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: r };
      }
    }
    async function Ft(e, r) {
      if (e.ok) return;
      let t = { clientVersion: r, response: e }, n = await uf(e);
      if (n.type === "QueryEngineError") throw new z11(n.body.message, { code: n.body.error_code, clientVersion: r });
      if (n.type === "DataProxyError") {
        if (n.body === "InternalDataProxyError") throw new Ur(t, "Internal Data Proxy error");
        if ("EngineNotStarted" in n.body) {
          if (n.body.EngineNotStarted.reason === "SchemaMissing") return new pr(t);
          if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported") throw new It(t);
          if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
            throw new Ct(t, i, o);
          }
          if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
            throw new P2(i, r, o);
          }
          if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
            let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
            throw new At(t, i);
          }
        }
        if ("InteractiveTransactionMisrouted" in n.body) {
          let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
          throw new Ot(t, i[n.body.InteractiveTransactionMisrouted.reason]);
        }
        if ("InvalidRequestError" in n.body) throw new kt(t, n.body.InvalidRequestError.reason);
      }
      if (e.status === 401 || e.status === 403) throw new Nt(t, Gr(yo, n));
      if (e.status === 404) return new _t(t, Gr(go, n));
      if (e.status === 429) throw new Lt(t, Gr(bo, n));
      if (e.status === 504) throw new Dt(t, Gr(fo, n));
      if (e.status >= 500) throw new Ur(t, Gr(ho, n));
      if (e.status >= 400) throw new Rt(t, Gr(mo, n));
    }
    function Gr(e, r) {
      return r.type === "EmptyError" ? e : `${e}: ${JSON.stringify(r)}`;
    }
    function Tl(e) {
      let r = Math.pow(2, e) * 50, t = Math.ceil(Math.random() * r) - Math.ceil(r / 2), n = r + t;
      return new Promise((i) => setTimeout(() => i(n), n));
    }
    var $e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function Sl(e) {
      let r = new TextEncoder().encode(e), t = "", n = r.byteLength, i = n % 3, o = n - i, s, a, l, u, c;
      for (let p = 0; p < o; p = p + 3) c = r[p] << 16 | r[p + 1] << 8 | r[p + 2], s = (c & 16515072) >> 18, a = (c & 258048) >> 12, l = (c & 4032) >> 6, u = c & 63, t += $e[s] + $e[a] + $e[l] + $e[u];
      return i == 1 ? (c = r[o], s = (c & 252) >> 2, a = (c & 3) << 4, t += $e[s] + $e[a] + "==") : i == 2 && (c = r[o] << 8 | r[o + 1], s = (c & 64512) >> 10, a = (c & 1008) >> 4, l = (c & 15) << 2, t += $e[s] + $e[a] + $e[l] + "="), t;
    }
    function Rl(e) {
      if (!!e.generator?.previewFeatures.some((t) => t.toLowerCase().includes("metrics"))) throw new P2("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e.clientVersion);
    }
    var Al = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "7.1.1-3.c2990dca591cba766e3b7ef5d9e8a84796e47ab7", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
    var Mt = class extends oe {
      name = "RequestError";
      code = "P5010";
      constructor(r, t) {
        super(`Cannot fetch data from service:
${r}`, R(t, true));
      }
    };
    x(Mt, "RequestError");
    async function dr(e, r, t = (n) => n) {
      let { clientVersion: n, ...i } = r, o = t(fetch);
      try {
        return await o(e, i);
      } catch (s) {
        let a = s.message ?? "Unknown error";
        throw new Mt(a, { clientVersion: n, cause: s });
      }
    }
    var pf = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
    var Cl = N("prisma:client:dataproxyEngine");
    async function df(e, r) {
      let t = Al["@prisma/engines-version"], n = r.clientVersion ?? "unknown";
      if (process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
      if (e.includes("accelerate") && n !== "0.0.0" && n !== "in-memory") return n;
      let [i, o] = n?.split("-") ?? [];
      if (o === void 0 && pf.test(i)) return i;
      if (o !== void 0 || n === "0.0.0" || n === "in-memory") {
        let [s] = t.split("-") ?? [], [a, l, u] = s.split("."), c = mf(`<=${a}.${l}.${u}`), p = await dr(c, { clientVersion: n });
        if (!p.ok) throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${p.status} ${p.statusText}, response body: ${await p.text() || "<empty body>"}`);
        let d = await p.text();
        Cl("length of body fetched from unpkg.com", d.length);
        let f;
        try {
          f = JSON.parse(d);
        } catch (h) {
          throw console.error("JSON.parse error: body fetched from unpkg.com: ", d), h;
        }
        return f.version;
      }
      throw new cr("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
    }
    async function Il(e, r) {
      let t = await df(e, r);
      return Cl("version", t), t;
    }
    function mf(e) {
      return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
    }
    var Dl = 3;
    var $t = N("prisma:client:dataproxyEngine");
    var qt = class {
      name = "DataProxyEngine";
      inlineSchema;
      inlineSchemaHash;
      inlineDatasources;
      config;
      logEmitter;
      env;
      clientVersion;
      engineHash;
      tracingHelper;
      remoteClientVersion;
      host;
      headerBuilder;
      startPromise;
      protocol;
      constructor(r) {
        Rl(r), this.config = r, this.env = r.env, this.inlineSchema = Sl(r.inlineSchema), this.inlineDatasources = r.inlineDatasources, this.inlineSchemaHash = r.inlineSchemaHash, this.clientVersion = r.clientVersion, this.engineHash = r.engineVersion, this.logEmitter = r.logEmitter, this.tracingHelper = r.tracingHelper;
      }
      apiKey() {
        return this.headerBuilder.apiKey;
      }
      version() {
        return this.engineHash;
      }
      async start() {
        this.startPromise !== void 0 && await this.startPromise, this.startPromise = (async () => {
          let { apiKey: r, url: t } = this.getURLAndAPIKey();
          this.host = t.host, this.protocol = t.protocol, this.headerBuilder = new Yn({ apiKey: r, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel ?? "error", logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await Il(this.host, this.config), $t("host", this.host), $t("protocol", this.protocol);
        })(), await this.startPromise;
      }
      async stop() {
      }
      propagateResponseExtensions(r) {
        r?.logs?.length && r.logs.forEach((t) => {
          switch (t.level) {
            case "debug":
            case "trace":
              $t(t);
              break;
            case "error":
            case "warn":
            case "info": {
              this.logEmitter.emit(t.level, { timestamp: po(t.timestamp), message: t.attributes.message ?? "", target: t.target ?? "BinaryEngine" });
              break;
            }
            case "query": {
              this.logEmitter.emit("query", { query: t.attributes.query ?? "", timestamp: po(t.timestamp), duration: t.attributes.duration_ms ?? 0, params: t.attributes.params ?? "", target: t.target ?? "BinaryEngine" });
              break;
            }
            default:
              t.level;
          }
        }), r?.traces?.length && this.tracingHelper.dispatchEngineSpans(r.traces);
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the remote query engine');
      }
      async url(r) {
        return await this.start(), `${this.protocol}//${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${r}`;
      }
      async uploadSchema() {
        let r = { name: "schemaUpload", internal: true };
        return this.tracingHelper.runInChildSpan(r, async () => {
          let t = await dr(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
          t.ok || $t("schema response status", t.status);
          let n = await Ft(t, this.clientVersion);
          if (n) throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: /* @__PURE__ */ new Date(), target: "" }), n;
          this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
        });
      }
      request(r, { traceparent: t, interactiveTransaction: n, customDataProxyFetch: i }) {
        return this.requestInternal({ body: r, traceparent: t, interactiveTransaction: n, customDataProxyFetch: i });
      }
      async requestBatch(r, { traceparent: t, transaction: n, customDataProxyFetch: i }) {
        let o = n?.kind === "itx" ? n.options : void 0, s = Mr(r, n);
        return (await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: t })).map((l) => (l.extensions && this.propagateResponseExtensions(l.extensions), "errors" in l ? this.convertProtocolErrorsToClientError(l.errors) : l));
      }
      requestInternal({ body: r, traceparent: t, customDataProxyFetch: n, interactiveTransaction: i }) {
        return this.withRetry({ actionGerund: "querying", callback: async ({ logHttpCall: o }) => {
          let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
          o(s);
          let a = await dr(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: t, transactionId: i?.id }), body: JSON.stringify(r), clientVersion: this.clientVersion }, n);
          a.ok || $t("graphql response status", a.status), await this.handleError(await Ft(a, this.clientVersion));
          let l = await a.json();
          if (l.extensions && this.propagateResponseExtensions(l.extensions), "errors" in l) throw this.convertProtocolErrorsToClientError(l.errors);
          return "batchResult" in l ? l.batchResult : l;
        } });
      }
      async transaction(r, t, n) {
        let i = { start: "starting", commit: "committing", rollback: "rolling back" };
        return this.withRetry({ actionGerund: `${i[r]} transaction`, callback: async ({ logHttpCall: o }) => {
          if (r === "start") {
            let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
            o(a);
            let l = await dr(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: t.traceparent }), body: s, clientVersion: this.clientVersion });
            await this.handleError(await Ft(l, this.clientVersion));
            let u = await l.json(), { extensions: c } = u;
            c && this.propagateResponseExtensions(c);
            let p = u.id, d = u["data-proxy"].endpoint;
            return { id: p, payload: { endpoint: d } };
          } else {
            let s = `${n.payload.endpoint}/${r}`;
            o(s);
            let a = await dr(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: t.traceparent }), clientVersion: this.clientVersion });
            await this.handleError(await Ft(a, this.clientVersion));
            let l = await a.json(), { extensions: u } = l;
            u && this.propagateResponseExtensions(u);
            return;
          }
        } });
      }
      getURLAndAPIKey() {
        return vl({ clientVersion: this.clientVersion, env: this.env, inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources });
      }
      metrics() {
        throw new cr("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
      }
      async withRetry(r) {
        for (let t = 0; ; t++) {
          let n = (i) => {
            this.logEmitter.emit("info", { message: `Calling ${i} (n=${t})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          };
          try {
            return await r.callback({ logHttpCall: n });
          } catch (i) {
            if (!(i instanceof oe) || !i.isRetryable) throw i;
            if (t >= Dl) throw i instanceof Br ? i.cause : i;
            this.logEmitter.emit("warn", { message: `Attempt ${t + 1}/${Dl} failed for ${r.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: /* @__PURE__ */ new Date(), target: "" });
            let o = await Tl(t);
            this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }
        }
      }
      async handleError(r) {
        if (r instanceof pr) throw await this.uploadSchema(), new Br({ clientVersion: this.clientVersion, cause: r });
        if (r) throw r;
      }
      convertProtocolErrorsToClientError(r) {
        return r.length === 1 ? $r(r[0], this.config.clientVersion, this.config.activeProvider) : new V(JSON.stringify(r), { clientVersion: this.config.clientVersion });
      }
      applyPendingMigrations() {
        throw new Error("Method not implemented.");
      }
    };
    function Ol(e) {
      if (e?.kind === "itx") return e.options.id;
    }
    var wo = O(require("node:os"));
    var kl = O(require("node:path"));
    var Eo = /* @__PURE__ */ Symbol("PrismaLibraryEngineCache");
    function ff() {
      let e = globalThis;
      return e[Eo] === void 0 && (e[Eo] = {}), e[Eo];
    }
    function gf(e) {
      let r = ff();
      if (r[e] !== void 0) return r[e];
      let t = kl.default.toNamespacedPath(e), n = { exports: {} }, i = 0;
      return process.platform !== "win32" && (i = wo.default.constants.dlopen.RTLD_LAZY | wo.default.constants.dlopen.RTLD_DEEPBIND), process.dlopen(n, t, i), r[e] = n.exports, n.exports;
    }
    var _l = { async loadLibrary(e) {
      let r = await fi(), t = await ml("library", e);
      try {
        return e.tracingHelper.runInChildSpan({ name: "loadLibrary", internal: true }, () => gf(t));
      } catch (n) {
        let i = Ai({ e: n, platformInfo: r, id: t });
        throw new P2(i, e.clientVersion);
      }
    } };
    var xo;
    var Nl = { async loadLibrary(e) {
      let { clientVersion: r, adapter: t, engineWasm: n } = e;
      if (t === void 0) throw new P2(`The \`adapter\` option for \`PrismaClient\` is required in this context (${Kn().prettyName})`, r);
      if (n === void 0) throw new P2("WASM engine was unexpectedly `undefined`", r);
      xo === void 0 && (xo = (async () => {
        let o = await n.getRuntime(), s = await n.getQueryEngineWasmModule();
        if (s == null) throw new P2("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", r);
        let a = { "./query_engine_bg.js": o }, l = new WebAssembly.Instance(s, a), u = l.exports.__wbindgen_start;
        return o.__wbg_set_wasm(l.exports), u(), o.QueryEngine;
      })());
      let i = await xo;
      return { debugPanic() {
        return Promise.reject("{}");
      }, dmmf() {
        return Promise.resolve("{}");
      }, version() {
        return { commit: "unknown", version: "unknown" };
      }, QueryEngine: i };
    } };
    var hf = "P2036";
    var Re = N("prisma:client:libraryEngine");
    function yf(e) {
      return e.item_type === "query" && "query" in e;
    }
    function bf(e) {
      return "level" in e ? e.level === "error" && e.message === "PANIC" : false;
    }
    var Ll = [...li, "native"];
    var Ef = 0xffffffffffffffffn;
    var vo = 1n;
    function wf() {
      let e = vo++;
      return vo > Ef && (vo = 1n), e;
    }
    var Qr = class {
      name = "LibraryEngine";
      engine;
      libraryInstantiationPromise;
      libraryStartingPromise;
      libraryStoppingPromise;
      libraryStarted;
      executingQueryPromise;
      config;
      QueryEngineConstructor;
      libraryLoader;
      library;
      logEmitter;
      libQueryEnginePath;
      binaryTarget;
      datasourceOverrides;
      datamodel;
      logQueries;
      logLevel;
      lastQuery;
      loggerRustPanic;
      tracingHelper;
      adapterPromise;
      versionInfo;
      constructor(r, t) {
        this.libraryLoader = t ?? _l, r.engineWasm !== void 0 && (this.libraryLoader = t ?? Nl), this.config = r, this.libraryStarted = false, this.logQueries = r.logQueries ?? false, this.logLevel = r.logLevel ?? "error", this.logEmitter = r.logEmitter, this.datamodel = r.inlineSchema, this.tracingHelper = r.tracingHelper, r.enableDebugLogs && (this.logLevel = "debug");
        let n = Object.keys(r.overrideDatasources)[0], i = r.overrideDatasources[n]?.url;
        n !== void 0 && i !== void 0 && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
      }
      wrapEngine(r) {
        return { applyPendingMigrations: r.applyPendingMigrations?.bind(r), commitTransaction: this.withRequestId(r.commitTransaction.bind(r)), connect: this.withRequestId(r.connect.bind(r)), disconnect: this.withRequestId(r.disconnect.bind(r)), metrics: r.metrics?.bind(r), query: this.withRequestId(r.query.bind(r)), rollbackTransaction: this.withRequestId(r.rollbackTransaction.bind(r)), sdlSchema: r.sdlSchema?.bind(r), startTransaction: this.withRequestId(r.startTransaction.bind(r)), trace: r.trace.bind(r), free: r.free?.bind(r) };
      }
      withRequestId(r) {
        return async (...t) => {
          let n = wf().toString();
          try {
            return await r(...t, n);
          } finally {
            if (this.tracingHelper.isEnabled()) {
              let i = await this.engine?.trace(n);
              if (i) {
                let o = JSON.parse(i);
                this.tracingHelper.dispatchEngineSpans(o.spans);
              }
            }
          }
        };
      }
      async applyPendingMigrations() {
        throw new Error("Cannot call this method from this type of engine instance");
      }
      async transaction(r, t, n) {
        await this.start();
        let i = await this.adapterPromise, o = JSON.stringify(t), s;
        if (r === "start") {
          let l = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
          s = await this.engine?.startTransaction(l, o);
        } else r === "commit" ? s = await this.engine?.commitTransaction(n.id, o) : r === "rollback" && (s = await this.engine?.rollbackTransaction(n.id, o));
        let a = this.parseEngineResponse(s);
        if (xf(a)) {
          let l = this.getExternalAdapterError(a, i?.errorRegistry);
          throw l ? l.error : new z11(a.message, { code: a.error_code, clientVersion: this.config.clientVersion, meta: a.meta });
        } else if (typeof a.message == "string") throw new V(a.message, { clientVersion: this.config.clientVersion });
        return a;
      }
      async instantiateLibrary() {
        if (Re("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
        ai(), this.binaryTarget = await this.getCurrentBinaryTarget(), await this.tracingHelper.runInChildSpan("load_engine", () => this.loadEngine()), this.version();
      }
      async getCurrentBinaryTarget() {
        {
          if (this.binaryTarget) return this.binaryTarget;
          let r = await this.tracingHelper.runInChildSpan("detect_platform", () => ir());
          if (!Ll.includes(r)) throw new P2(`Unknown ${ce("PRISMA_QUERY_ENGINE_LIBRARY")} ${ce(W(r))}. Possible binaryTargets: ${qe(Ll.join(", "))} or a path to the query engine library.
You may have to run ${qe("prisma generate")} for your changes to take effect.`, this.config.clientVersion);
          return r;
        }
      }
      parseEngineResponse(r) {
        if (!r) throw new V("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
        try {
          return JSON.parse(r);
        } catch {
          throw new V("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
        }
      }
      async loadEngine() {
        if (!this.engine) {
          this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
          try {
            let r = new WeakRef(this);
            this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(tn));
            let t = await this.adapterPromise;
            t && Re("Using driver adapter: %O", t), this.engine = this.wrapEngine(new this.QueryEngineConstructor({ datamodel: this.datamodel, env: process.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json", enableTracing: this.tracingHelper.isEnabled() }, (n) => {
              r.deref()?.logger(n);
            }, t));
          } catch (r) {
            let t = r, n = this.parseInitError(t.message);
            throw typeof n == "string" ? t : new P2(n.message, this.config.clientVersion, n.error_code);
          }
        }
      }
      logger(r) {
        let t = this.parseEngineResponse(r);
        t && (t.level = t?.level.toLowerCase() ?? "unknown", yf(t) ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: t.query, params: t.params, duration: Number(t.duration_ms), target: t.module_path }) : bf(t) ? this.loggerRustPanic = new ae(Po(this, `${t.message}: ${t.reason} in ${t.file}:${t.line}:${t.column}`), this.config.clientVersion) : this.logEmitter.emit(t.level, { timestamp: /* @__PURE__ */ new Date(), message: t.message, target: t.module_path }));
      }
      parseInitError(r) {
        try {
          return JSON.parse(r);
        } catch {
        }
        return r;
      }
      parseRequestError(r) {
        try {
          return JSON.parse(r);
        } catch {
        }
        return r;
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
      }
      async start() {
        if (this.libraryInstantiationPromise || (this.libraryInstantiationPromise = this.instantiateLibrary()), await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return Re(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
        if (this.libraryStarted) return;
        let r = async () => {
          Re("library starting");
          try {
            let t = { traceparent: this.tracingHelper.getTraceParent() };
            await this.engine?.connect(JSON.stringify(t)), this.libraryStarted = true, this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(tn)), await this.adapterPromise, Re("library started");
          } catch (t) {
            let n = this.parseInitError(t.message);
            throw typeof n == "string" ? t : new P2(n.message, this.config.clientVersion, n.error_code);
          } finally {
            this.libraryStartingPromise = void 0;
          }
        };
        return this.libraryStartingPromise = this.tracingHelper.runInChildSpan("connect", r), this.libraryStartingPromise;
      }
      async stop() {
        if (await this.libraryInstantiationPromise, await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return Re("library is already stopping"), this.libraryStoppingPromise;
        if (!this.libraryStarted) {
          await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0;
          return;
        }
        let r = async () => {
          await new Promise((n) => setImmediate(n)), Re("library stopping");
          let t = { traceparent: this.tracingHelper.getTraceParent() };
          await this.engine?.disconnect(JSON.stringify(t)), this.engine?.free && this.engine.free(), this.engine = void 0, this.libraryStarted = false, this.libraryStoppingPromise = void 0, this.libraryInstantiationPromise = void 0, await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0, Re("library stopped");
        };
        return this.libraryStoppingPromise = this.tracingHelper.runInChildSpan("disconnect", r), this.libraryStoppingPromise;
      }
      version() {
        return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
      }
      debugPanic(r) {
        return this.library?.debugPanic(r);
      }
      async request(r, { traceparent: t, interactiveTransaction: n }) {
        Re(`sending request, this.libraryStarted: ${this.libraryStarted}`);
        let i = JSON.stringify({ traceparent: t }), o = JSON.stringify(r);
        try {
          await this.start();
          let s = await this.adapterPromise;
          this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
          let a = this.parseEngineResponse(await this.executingQueryPromise);
          if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], s?.errorRegistry) : new V(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
          if (this.loggerRustPanic) throw this.loggerRustPanic;
          return { data: a };
        } catch (s) {
          if (s instanceof P2) throw s;
          if (s.code === "GenericFailure" && s.message?.startsWith("PANIC:")) throw new ae(Po(this, s.message), this.config.clientVersion);
          let a = this.parseRequestError(s.message);
          throw typeof a == "string" ? s : new V(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
        }
      }
      async requestBatch(r, { transaction: t, traceparent: n }) {
        Re("requestBatch");
        let i = Mr(r, t);
        await this.start();
        let o = await this.adapterPromise;
        this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine?.query(this.lastQuery, JSON.stringify({ traceparent: n }), Ol(t));
        let s = await this.executingQueryPromise, a = this.parseEngineResponse(s);
        if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], o?.errorRegistry) : new V(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
        let { batchResult: l, errors: u } = a;
        if (Array.isArray(l)) return l.map((c) => c.errors && c.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(c.errors[0], o?.errorRegistry) : { data: c });
        throw u && u.length === 1 ? new Error(u[0].error) : new Error(JSON.stringify(a));
      }
      buildQueryError(r, t) {
        if (r.user_facing_error.is_panic) return new ae(Po(this, r.user_facing_error.message), this.config.clientVersion);
        let n = this.getExternalAdapterError(r.user_facing_error, t);
        return n ? n.error : $r(r, this.config.clientVersion, this.config.activeProvider);
      }
      getExternalAdapterError(r, t) {
        if (r.error_code === hf && t) {
          let n = r.meta?.id;
          ln(typeof n == "number", "Malformed external JS error received from the engine");
          let i = t.consumeError(n);
          return ln(i, "External error with reported id was not registered"), i;
        }
      }
      async metrics(r) {
        await this.start();
        let t = await this.engine.metrics(JSON.stringify(r));
        return r.format === "prometheus" ? t : this.parseEngineResponse(t);
      }
    };
    function xf(e) {
      return typeof e == "object" && e !== null && e.error_code !== void 0;
    }
    function Po(e, r) {
      return El({ binaryTarget: e.binaryTarget, title: r, version: e.config.clientVersion, engineVersion: e.versionInfo?.commit, database: e.config.activeProvider, query: e.lastQuery });
    }
    function Fl({ url: e, adapter: r, copyEngine: t, targetBuildType: n }) {
      let i = [], o = [], s = (g) => {
        i.push({ _tag: "warning", value: g });
      }, a = (g) => {
        let I = g.join(`
`);
        o.push({ _tag: "error", value: I });
      }, l = !!e?.startsWith("prisma://"), u = an(e), c = !!r, p = l || u;
      !c && t && p && n !== "client" && n !== "wasm-compiler-edge" && s(["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);
      let d = p || !t;
      c && (d || n === "edge") && (n === "edge" ? a(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : p ? a(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.", "Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]) : t || a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
      let f = { accelerate: d, ppg: u, driverAdapters: c };
      function h(g) {
        return g.length > 0;
      }
      return h(o) ? { ok: false, diagnostics: { warnings: i, errors: o }, isUsing: f } : { ok: true, diagnostics: { warnings: i }, isUsing: f };
    }
    function Ml({ copyEngine: e = true }, r) {
      let t;
      try {
        t = jr({ inlineDatasources: r.inlineDatasources, overrideDatasources: r.overrideDatasources, env: { ...r.env, ...process.env }, clientVersion: r.clientVersion });
      } catch {
      }
      let { ok: n, isUsing: i, diagnostics: o } = Fl({ url: t, adapter: r.adapter, copyEngine: e, targetBuildType: "library" });
      for (let p of o.warnings) at(...p.value);
      if (!n) {
        let p = o.errors[0];
        throw new Z(p.value, { clientVersion: r.clientVersion });
      }
      let s = Er(r.generator), a = s === "library", l = s === "binary", u = s === "client", c = (i.accelerate || i.ppg) && !i.driverAdapters;
      return i.accelerate ? new qt(r) : (i.driverAdapters, a ? new Qr(r) : new Qr(r));
    }
    function $l({ generator: e }) {
      return e?.previewFeatures ?? [];
    }
    var ql = (e) => ({ command: e });
    var Vl = (e) => e.strings.reduce((r, t, n) => `${r}@P${n}${t}`);
    function Wr(e) {
      try {
        return jl(e, "fast");
      } catch {
        return jl(e, "slow");
      }
    }
    function jl(e, r) {
      return JSON.stringify(e.map((t) => Ul(t, r)));
    }
    function Ul(e, r) {
      if (Array.isArray(e)) return e.map((t) => Ul(t, r));
      if (typeof e == "bigint") return { prisma__type: "bigint", prisma__value: e.toString() };
      if (vr(e)) return { prisma__type: "date", prisma__value: e.toJSON() };
      if (Fe.isDecimal(e)) return { prisma__type: "decimal", prisma__value: e.toJSON() };
      if (Buffer.isBuffer(e)) return { prisma__type: "bytes", prisma__value: e.toString("base64") };
      if (vf(e)) return { prisma__type: "bytes", prisma__value: Buffer.from(e).toString("base64") };
      if (ArrayBuffer.isView(e)) {
        let { buffer: t, byteOffset: n, byteLength: i } = e;
        return { prisma__type: "bytes", prisma__value: Buffer.from(t, n, i).toString("base64") };
      }
      return typeof e == "object" && r === "slow" ? Gl(e) : e;
    }
    function vf(e) {
      return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    function Gl(e) {
      if (typeof e != "object" || e === null) return e;
      if (typeof e.toJSON == "function") return e.toJSON();
      if (Array.isArray(e)) return e.map(Bl);
      let r = {};
      for (let t of Object.keys(e)) r[t] = Bl(e[t]);
      return r;
    }
    function Bl(e) {
      return typeof e == "bigint" ? e.toString() : Gl(e);
    }
    var Pf = /^(\s*alter\s)/i;
    var Ql = N("prisma:client");
    function To(e, r, t, n) {
      if (!(e !== "postgresql" && e !== "cockroachdb") && t.length > 0 && Pf.exec(r)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    var So = ({ clientMethod: e, activeProvider: r }) => (t) => {
      let n = "", i;
      if (Vn(t)) n = t.sql, i = { values: Wr(t.values), __prismaRawParameters__: true };
      else if (Array.isArray(t)) {
        let [o, ...s] = t;
        n = o, i = { values: Wr(s || []), __prismaRawParameters__: true };
      } else switch (r) {
        case "sqlite":
        case "mysql": {
          n = t.sql, i = { values: Wr(t.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = t.text, i = { values: Wr(t.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = Vl(t), i = { values: Wr(t.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${r} provider does not support ${e}`);
      }
      return i?.values ? Ql(`prisma.${e}(${n}, ${i.values})`) : Ql(`prisma.${e}(${n})`), { query: n, parameters: i };
    };
    var Wl = { requestArgsToMiddlewareArgs(e) {
      return [e.strings, ...e.values];
    }, middlewareArgsToRequestArgs(e) {
      let [r, ...t] = e;
      return new ie(r, t);
    } };
    var Jl = { requestArgsToMiddlewareArgs(e) {
      return [e];
    }, middlewareArgsToRequestArgs(e) {
      return e[0];
    } };
    function Ro(e) {
      return function(t, n) {
        let i, o = (s = e) => {
          try {
            return s === void 0 || s?.kind === "itx" ? i ??= Kl(t(s)) : Kl(t(s));
          } catch (a) {
            return Promise.reject(a);
          }
        };
        return { get spec() {
          return n;
        }, then(s, a) {
          return o().then(s, a);
        }, catch(s) {
          return o().catch(s);
        }, finally(s) {
          return o().finally(s);
        }, requestTransaction(s) {
          let a = o(s);
          return a.requestTransaction ? a.requestTransaction(s) : a;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    function Kl(e) {
      return typeof e.then == "function" ? e : Promise.resolve(e);
    }
    var Tf = xi.split(".")[0];
    var Sf = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, dispatchEngineSpans() {
    }, getActiveContext() {
    }, runInChildSpan(e, r) {
      return r();
    } };
    var Ao = class {
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(r) {
        return this.getGlobalTracingHelper().getTraceParent(r);
      }
      dispatchEngineSpans(r) {
        return this.getGlobalTracingHelper().dispatchEngineSpans(r);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(r, t) {
        return this.getGlobalTracingHelper().runInChildSpan(r, t);
      }
      getGlobalTracingHelper() {
        let r = globalThis[`V${Tf}_PRISMA_INSTRUMENTATION`], t = globalThis.PRISMA_INSTRUMENTATION;
        return r?.helper ?? t?.helper ?? Sf;
      }
    };
    function Hl() {
      return new Ao();
    }
    function Yl(e, r = () => {
    }) {
      let t, n = new Promise((i) => t = i);
      return { then(i) {
        return --e === 0 && t(r()), i?.(n);
      } };
    }
    function zl(e) {
      return typeof e == "string" ? e : e.reduce((r, t) => {
        let n = typeof t == "string" ? t : t.level;
        return n === "query" ? r : r && (t === "info" || r === "info") ? "info" : n;
      }, void 0);
    }
    function zn(e) {
      return typeof e.batchRequestIdx == "number";
    }
    function Zl(e) {
      if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow") return;
      let r = [];
      return e.modelName && r.push(e.modelName), e.query.arguments && r.push(Co(e.query.arguments)), r.push(Co(e.query.selection)), r.join("");
    }
    function Co(e) {
      return `(${Object.keys(e).sort().map((t) => {
        let n = e[t];
        return typeof n == "object" && n !== null ? `(${t} ${Co(n)})` : t;
      }).join(" ")})`;
    }
    var Rf = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
    function Io(e) {
      return Rf[e];
    }
    var Zn = class {
      constructor(r) {
        this.options = r;
        this.batches = {};
      }
      batches;
      tickActive = false;
      request(r) {
        let t = this.options.batchBy(r);
        return t ? (this.batches[t] || (this.batches[t] = [], this.tickActive || (this.tickActive = true, process.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[t].push({ request: r, resolve: n, reject: i });
        })) : this.options.singleLoader(r);
      }
      dispatchBatches() {
        for (let r in this.batches) {
          let t = this.batches[r];
          delete this.batches[r], t.length === 1 ? this.options.singleLoader(t[0].request).then((n) => {
            n instanceof Error ? t[0].reject(n) : t[0].resolve(n);
          }).catch((n) => {
            t[0].reject(n);
          }) : (t.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(t.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < t.length; i++) t[i].reject(n);
            else for (let i = 0; i < t.length; i++) {
              let o = n[i];
              o instanceof Error ? t[i].reject(o) : t[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < t.length; i++) t[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    function mr(e, r) {
      if (r === null) return r;
      switch (e) {
        case "bigint":
          return BigInt(r);
        case "bytes": {
          let { buffer: t, byteOffset: n, byteLength: i } = Buffer.from(r, "base64");
          return new Uint8Array(t, n, i);
        }
        case "decimal":
          return new Fe(r);
        case "datetime":
        case "date":
          return new Date(r);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${r}Z`);
        case "bigint-array":
          return r.map((t) => mr("bigint", t));
        case "bytes-array":
          return r.map((t) => mr("bytes", t));
        case "decimal-array":
          return r.map((t) => mr("decimal", t));
        case "datetime-array":
          return r.map((t) => mr("datetime", t));
        case "date-array":
          return r.map((t) => mr("date", t));
        case "time-array":
          return r.map((t) => mr("time", t));
        default:
          return r;
      }
    }
    function Xn(e) {
      let r = [], t = Af(e);
      for (let n = 0; n < e.rows.length; n++) {
        let i = e.rows[n], o = { ...t };
        for (let s = 0; s < i.length; s++) o[e.columns[s]] = mr(e.types[s], i[s]);
        r.push(o);
      }
      return r;
    }
    function Af(e) {
      let r = {};
      for (let t = 0; t < e.columns.length; t++) r[e.columns[t]] = null;
      return r;
    }
    var Cf = N("prisma:client:request_handler");
    var ei = class {
      client;
      dataloader;
      logEmitter;
      constructor(r, t) {
        this.logEmitter = t, this.client = r, this.dataloader = new Zn({ batchLoader: rl(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((p) => p.protocolQuery), l = this.client._tracingHelper.getTraceParent(s), u = n.some((p) => Io(p.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: l, transaction: If(o), containsWrite: u, customDataProxyFetch: i })).map((p, d) => {
            if (p instanceof Error) return p;
            try {
              return this.mapQueryEngineResult(n[d], p);
            } catch (f) {
              return f;
            }
          });
        }), singleLoader: async (n) => {
          let i = n.transaction?.kind === "itx" ? Xl(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: Io(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, batchBy: (n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Zl(n.protocolQuery), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(r) {
        try {
          return await this.dataloader.request(r);
        } catch (t) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = r;
          this.handleAndLogRequestError({ error: t, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: r.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: r, unpacker: t }, n) {
        let i = n?.data, o = this.unpack(i, r, t);
        return process.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
      }
      handleAndLogRequestError(r) {
        try {
          this.handleRequestError(r);
        } catch (t) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: t.message, target: r.clientMethod, timestamp: /* @__PURE__ */ new Date() }), t;
        }
      }
      handleRequestError({ error: r, clientMethod: t, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (Cf(r), Df(r, i)) throw r;
        if (r instanceof z11 && Of(r)) {
          let u = eu(r.meta);
          Nn({ args: o, errors: [u], callsite: n, errorFormat: this.client._errorFormat, originalMethod: t, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let l = r.message;
        if (n && (l = Tn({ callsite: n, originalMethod: t, isPanic: r.isPanic, showColors: this.client._errorFormat === "pretty", message: l })), l = this.sanitizeMessage(l), r.code) {
          let u = s ? { modelName: s, ...r.meta } : r.meta;
          throw new z11(l, { code: r.code, clientVersion: this.client._clientVersion, meta: u, batchRequestIdx: r.batchRequestIdx });
        } else {
          if (r.isPanic) throw new ae(l, this.client._clientVersion);
          if (r instanceof V) throw new V(l, { clientVersion: this.client._clientVersion, batchRequestIdx: r.batchRequestIdx });
          if (r instanceof P2) throw new P2(l, this.client._clientVersion);
          if (r instanceof ae) throw new ae(l, this.client._clientVersion);
        }
        throw r.clientVersion = this.client._clientVersion, r;
      }
      sanitizeMessage(r) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? wr(r) : r;
      }
      unpack(r, t, n) {
        if (!r || (r.data && (r = r.data), !r)) return r;
        let i = Object.keys(r)[0], o = Object.values(r)[0], s = t.filter((u) => u !== "select" && u !== "include"), a = ao(o, s), l = i === "queryRaw" ? Xn(a) : Vr(a);
        return n ? n(l) : l;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function If(e) {
      if (e) {
        if (e.kind === "batch") return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
        if (e.kind === "itx") return { kind: "itx", options: Xl(e) };
        ar(e, "Unknown transaction kind");
      }
    }
    function Xl(e) {
      return { id: e.id, payload: e.payload };
    }
    function Df(e, r) {
      return zn(e) && r?.kind === "batch" && e.batchRequestIdx !== r.index;
    }
    function Of(e) {
      return e.code === "P2009" || e.code === "P2012";
    }
    function eu(e) {
      if (e.kind === "Union") return { kind: "Union", errors: e.errors.map(eu) };
      if (Array.isArray(e.selectionPath)) {
        let [, ...r] = e.selectionPath;
        return { ...e, selectionPath: r };
      }
      return e;
    }
    var ru = xl;
    var su = O(Ki());
    var _ = class extends Error {
      constructor(r) {
        super(r + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    x(_, "PrismaClientConstructorValidationError");
    var tu = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var nu = ["pretty", "colorless", "minimal"];
    var iu = ["info", "query", "warn", "error"];
    var kf = { datasources: (e, { datasourceNames: r }) => {
      if (e) {
        if (typeof e != "object" || Array.isArray(e)) throw new _(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
        for (let [t, n] of Object.entries(e)) {
          if (!r.includes(t)) {
            let i = Jr(t, r) || ` Available datasources: ${r.join(", ")}`;
            throw new _(`Unknown datasource ${t} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new _(`Invalid value ${JSON.stringify(e)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new _(`Invalid value ${JSON.stringify(e)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new _(`Invalid value ${JSON.stringify(o)} for datasource "${t}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, adapter: (e, r) => {
      if (!e && Er(r.generator) === "client") throw new _('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
      if (e !== null) {
        if (e === void 0) throw new _('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
        if (Er(r.generator) === "binary") throw new _('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
      }
    }, datasourceUrl: (e) => {
      if (typeof e < "u" && typeof e != "string") throw new _(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, errorFormat: (e) => {
      if (e) {
        if (typeof e != "string") throw new _(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!nu.includes(e)) {
          let r = Jr(e, nu);
          throw new _(`Invalid errorFormat ${e} provided to PrismaClient constructor.${r}`);
        }
      }
    }, log: (e) => {
      if (!e) return;
      if (!Array.isArray(e)) throw new _(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
      function r(t) {
        if (typeof t == "string" && !iu.includes(t)) {
          let n = Jr(t, iu);
          throw new _(`Invalid log level "${t}" provided to PrismaClient constructor.${n}`);
        }
      }
      for (let t of e) {
        r(t);
        let n = { level: r, emit: (i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = Jr(i, o);
            throw new _(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        } };
        if (t && typeof t == "object") for (let [i, o] of Object.entries(t)) if (n[i]) n[i](o);
        else throw new _(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, transactionOptions: (e) => {
      if (!e) return;
      let r = e.maxWait;
      if (r != null && r <= 0) throw new _(`Invalid value ${r} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let t = e.timeout;
      if (t != null && t <= 0) throw new _(`Invalid value ${t} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, omit: (e, r) => {
      if (typeof e != "object") throw new _('"omit" option is expected to be an object.');
      if (e === null) throw new _('"omit" option can not be `null`');
      let t = [];
      for (let [n, i] of Object.entries(e)) {
        let o = Nf(n, r.runtimeDataModel);
        if (!o) {
          t.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let l = o.fields.find((u) => u.name === s);
          if (!l) {
            t.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (l.relationName) {
            t.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && t.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (t.length > 0) throw new _(Lf(e, t));
    }, __internal: (e) => {
      if (!e) return;
      let r = ["debug", "engine", "configOverride"];
      if (typeof e != "object") throw new _(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
      for (let [t] of Object.entries(e)) if (!r.includes(t)) {
        let n = Jr(t, r);
        throw new _(`Invalid property ${JSON.stringify(t)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    } };
    function au(e, r) {
      for (let [t, n] of Object.entries(e)) {
        if (!tu.includes(t)) {
          let i = Jr(t, tu);
          throw new _(`Unknown property ${t} provided to PrismaClient constructor.${i}`);
        }
        kf[t](n, r);
      }
      if (e.datasourceUrl && e.datasources) throw new _('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    function Jr(e, r) {
      if (r.length === 0 || typeof e != "string") return "";
      let t = _f(e, r);
      return t ? ` Did you mean "${t}"?` : "";
    }
    function _f(e, r) {
      if (r.length === 0) return null;
      let t = r.map((i) => ({ value: i, distance: (0, su.default)(e, i) }));
      t.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = t[0];
      return n.distance < 3 ? n.value : null;
    }
    function Nf(e, r) {
      return ou(r.models, e) ?? ou(r.types, e);
    }
    function ou(e, r) {
      let t = Object.keys(e).find((n) => We(n) === r);
      if (t) return e[t];
    }
    function Lf(e, r) {
      let t = _r(e);
      for (let o of r) switch (o.kind) {
        case "UnknownModel":
          t.arguments.getField(o.modelKey)?.markAsError(), t.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          t.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), t.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          t.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), t.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          t.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), t.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = _n(t, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    function lu(e) {
      return e.length === 0 ? Promise.resolve([]) : new Promise((r, t) => {
        let n = new Array(e.length), i = null, o = false, s = 0, a = () => {
          o || (s++, s === e.length && (o = true, i ? t(i) : r(n)));
        }, l = (u) => {
          o || (o = true, t(u));
        };
        for (let u = 0; u < e.length; u++) e[u].then((c) => {
          n[u] = c, a();
        }, (c) => {
          if (!zn(c)) {
            l(c);
            return;
          }
          c.batchRequestIdx === u ? l(c) : (i || (i = c), a());
        });
      });
    }
    var rr = N("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var Ff = { requestArgsToMiddlewareArgs: (e) => e, middlewareArgsToRequestArgs: (e) => e };
    var Mf = /* @__PURE__ */ Symbol.for("prisma.client.transaction.id");
    var $f = { id: 0, nextId() {
      return ++this.id;
    } };
    function fu(e) {
      class r {
        _originalClient = this;
        _runtimeDataModel;
        _requestHandler;
        _connectionPromise;
        _disconnectionPromise;
        _engineConfig;
        _accelerateEngineConfig;
        _clientVersion;
        _errorFormat;
        _tracingHelper;
        _previewFeatures;
        _activeProvider;
        _globalOmit;
        _extensions;
        _engine;
        _appliedParent;
        _createPrismaPromise = Ro();
        constructor(n) {
          e = n?.__internal?.configOverride?.(e) ?? e, sl(e), n && au(n, e);
          let i = new du.EventEmitter().on("error", () => {
          });
          this._extensions = Nr.empty(), this._previewFeatures = $l(e), this._clientVersion = e.clientVersion ?? ru, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = Hl();
          let o = e.relativeEnvPaths && { rootEnvPath: e.relativeEnvPaths.rootEnvPath && ri.default.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && ri.default.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = n.adapter;
            let l = e.activeProvider === "postgresql" || e.activeProvider === "cockroachdb" ? "postgres" : e.activeProvider;
            if (s.provider !== l) throw new P2(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new P2("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = !s && o && st(o, { conflictCheck: "none" }) || e.injectableEdgeEnv?.();
          try {
            let l = n ?? {}, u = l.__internal ?? {}, c = u.debug === true;
            c && N.enable("prisma:client");
            let p = ri.default.resolve(e.dirname, e.relativePath);
            mu.default.existsSync(p) || (p = e.dirname), rr("dirname", e.dirname), rr("relativePath", e.relativePath), rr("cwd", p);
            let d = u.engine || {};
            if (l.errorFormat ? this._errorFormat = l.errorFormat : process.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : process.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: p, dirname: e.dirname, enableDebugLogs: c, allowTriggerPanic: d.allowTriggerPanic, prismaPath: d.binaryPath ?? void 0, engineEndpoint: d.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: l.log && zl(l.log), logQueries: l.log && !!(typeof l.log == "string" ? l.log === "query" : l.log.find((f) => typeof f == "string" ? f === "query" : f.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, compilerWasm: e.compilerWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: al(l, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l.transactionOptions?.maxWait ?? 2e3, timeout: l.transactionOptions?.timeout ?? 5e3, isolationLevel: l.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: jr, getBatchRequestPayload: Mr, prismaGraphQLToJSError: $r, PrismaClientUnknownRequestError: V, PrismaClientInitializationError: P2, PrismaClientKnownRequestError: z11, debug: N("prisma:client:accelerateEngine"), engineVersion: cu.version, clientVersion: e.clientVersion } }, rr("clientVersion", e.clientVersion), this._engine = Ml(e, this._engineConfig), this._requestHandler = new ei(this, i), l.log) for (let f of l.log) {
              let h = typeof f == "string" ? f : f.emit === "stdout" ? f.level : null;
              h && this.$on(h, (g) => {
                nt.log(`${nt.tags[h] ?? ""}`, g.message || g.query);
              });
            }
          } catch (l) {
            throw l.clientVersion = this._clientVersion, l;
          }
          return this._appliedParent = Pt(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $on(n, i) {
          return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            Uo();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: So({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = uu(n, i);
              return To(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new Z("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (To(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (e.activeProvider !== "mongodb") throw new Z(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: ql, callsite: Ze(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: So({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...uu(n, i));
            throw new Z("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new Z("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = $f.nextId(), s = Yl(n.length), a = n.map((l, u) => {
            if (l?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let c = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, p = { kind: "batch", id: o, index: u, isolationLevel: c, lock: s };
            return l.requestTransaction?.(p) ?? l;
          });
          return lu(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), l;
          try {
            let u = { kind: "itx", ...a };
            l = await n(this._createItxClient(u)), await this._engine.transaction("commit", o, a);
          } catch (u) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), u;
          }
          return l;
        }
        _createItxClient(n) {
          return he(Pt(he(Qa(this), [re("_appliedParent", () => this._appliedParent._createItxClient(n)), re("_createPrismaPromise", () => Ro(n)), re(Mf, () => n.id)])), [Fr(Ya)]);
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = () => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          } : o = () => this._transactionWithCallback({ callback: n, options: i }) : o = () => this._transactionWithArray({ promises: n, options: i });
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? Ff, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = async (l) => {
            let { runInTransaction: u, args: c, ...p } = l, d = { ...n, ...p };
            c && (d.args = i.middlewareArgsToRequestArgs(c)), n.transaction !== void 0 && u === false && delete d.transaction;
            let f = await el(this, d);
            return d.model ? Ha({ result: f, modelName: d.model, args: d.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : f;
          };
          return this._tracingHelper.runInChildSpan(s.operation, () => new pu.AsyncResource("prisma-client-request").runInAsyncScope(() => a(o)));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: l, argsMapper: u, transaction: c, unpacker: p, otelParentCtx: d, customDataProxyFetch: f }) {
          try {
            n = u ? u(n) : n;
            let h = { name: "serialize" }, g = this._tracingHelper.runInChildSpan(h, () => $n({ modelName: l, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return N.enabled("prisma:client") && (rr("Prisma Client call:"), rr(`prisma.${i}(${Na(n)})`), rr("Generated request:"), rr(JSON.stringify(g, null, 2) + `
`)), c?.kind === "batch" && await c.lock, this._requestHandler.request({ protocolQuery: g, modelName: l, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: c, unpacker: p, otelParentCtx: d, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: f });
          } catch (h) {
            throw h.clientVersion = this._clientVersion, h;
          }
        }
        $metrics = new Lr(this);
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
        $extends = Wa;
      }
      return r;
    }
    function uu(e, r) {
      return qf(e) ? [new ie(e, r), Wl] : [e, Jl];
    }
    function qf(e) {
      return Array.isArray(e) && Array.isArray(e.raw);
    }
    var Vf = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function gu(e) {
      return new Proxy(e, { get(r, t) {
        if (t in r) return r[t];
        if (!Vf.has(t)) throw new TypeError(`Invalid enum value: ${String(t)}`);
      } });
    }
    function hu(e) {
      st(e, { conflictCheck: "warn" });
    }
  }
});

// generated/prisma/index.js
var require_prisma = __commonJS({
  "generated/prisma/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join3,
      raw: raw2,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug2,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2,
      createParam: createParam2
    } = require_library();
    var Prisma12 = {};
    exports2.Prisma = Prisma12;
    exports2.$Enums = {};
    Prisma12.prismaVersion = {
      client: "6.19.3",
      engine: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
    };
    Prisma12.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma12.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma12.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma12.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma12.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma12.Decimal = Decimal2;
    Prisma12.sql = sqltag2;
    Prisma12.empty = empty2;
    Prisma12.join = join3;
    Prisma12.raw = raw2;
    Prisma12.validator = Public2.validator;
    Prisma12.getExtensionContext = Extensions2.getExtensionContext;
    Prisma12.defineExtension = Extensions2.defineExtension;
    Prisma12.DbNull = objectEnumValues2.instances.DbNull;
    Prisma12.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma12.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma12.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    var path = require("path");
    exports2.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    exports2.Prisma.UserScalarFieldEnum = {
      id: "id",
      email: "email",
      passwordHash: "passwordHash",
      fullName: "fullName",
      phone: "phone",
      preferredLocale: "preferredLocale",
      isActive: "isActive",
      lastLoginAt: "lastLoginAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.RoleScalarFieldEnum = {
      id: "id",
      key: "key",
      name: "name",
      description: "description",
      isSystem: "isSystem",
      createdAt: "createdAt"
    };
    exports2.Prisma.PermissionScalarFieldEnum = {
      id: "id",
      key: "key",
      description: "description"
    };
    exports2.Prisma.UserRoleScalarFieldEnum = {
      userId: "userId",
      roleId: "roleId",
      assignedAt: "assignedAt"
    };
    exports2.Prisma.RolePermissionScalarFieldEnum = {
      roleId: "roleId",
      permissionId: "permissionId"
    };
    exports2.Prisma.SessionScalarFieldEnum = {
      id: "id",
      userId: "userId",
      tokenHash: "tokenHash",
      expiresAt: "expiresAt",
      revokedAt: "revokedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      createdAt: "createdAt",
      lastSeenAt: "lastSeenAt"
    };
    exports2.Prisma.PasswordResetTokenScalarFieldEnum = {
      id: "id",
      userId: "userId",
      tokenHash: "tokenHash",
      purpose: "purpose",
      expiresAt: "expiresAt",
      usedAt: "usedAt",
      createdAt: "createdAt"
    };
    exports2.Prisma.CourseCategoryScalarFieldEnum = {
      id: "id",
      slug: "slug",
      nameEn: "nameEn",
      nameBn: "nameBn",
      sortOrder: "sortOrder",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.CourseScalarFieldEnum = {
      id: "id",
      slug: "slug",
      icon: "icon",
      status: "status",
      sortOrder: "sortOrder",
      categoryId: "categoryId",
      publishedAt: "publishedAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.CourseTranslationScalarFieldEnum = {
      id: "id",
      courseId: "courseId",
      locale: "locale",
      title: "title",
      summary: "summary",
      description: "description",
      duration: "duration",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.CourseTopicScalarFieldEnum = {
      id: "id",
      courseId: "courseId",
      sortOrder: "sortOrder",
      textEn: "textEn",
      textBn: "textBn"
    };
    exports2.Prisma.LearningOutcomeScalarFieldEnum = {
      id: "id",
      courseId: "courseId",
      sortOrder: "sortOrder",
      textEn: "textEn",
      textBn: "textBn"
    };
    exports2.Prisma.TrainingBatchScalarFieldEnum = {
      id: "id",
      code: "code",
      name: "name",
      courseId: "courseId",
      startDate: "startDate",
      endDate: "endDate",
      capacity: "capacity",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.BatchTeacherScalarFieldEnum = {
      batchId: "batchId",
      userId: "userId"
    };
    exports2.Prisma.StudentProfileScalarFieldEnum = {
      id: "id",
      userId: "userId",
      studentCode: "studentCode",
      educationLevel: "educationLevel",
      currentStatus: "currentStatus",
      status: "status",
      graduatedAt: "graduatedAt",
      sourceApplicationId: "sourceApplicationId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.EnrollmentScalarFieldEnum = {
      id: "id",
      studentId: "studentId",
      batchId: "batchId",
      status: "status",
      progress: "progress",
      enrolledAt: "enrolledAt",
      completedAt: "completedAt"
    };
    exports2.Prisma.AttendanceScalarFieldEnum = {
      id: "id",
      enrollmentId: "enrollmentId",
      date: "date",
      status: "status",
      note: "note",
      recordedById: "recordedById",
      createdAt: "createdAt"
    };
    exports2.Prisma.AssessmentScalarFieldEnum = {
      id: "id",
      batchId: "batchId",
      title: "title",
      type: "type",
      maxScore: "maxScore",
      dueDate: "dueDate",
      createdAt: "createdAt"
    };
    exports2.Prisma.AssessmentResultScalarFieldEnum = {
      id: "id",
      assessmentId: "assessmentId",
      enrollmentId: "enrollmentId",
      score: "score",
      feedback: "feedback",
      gradedById: "gradedById",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.LearningMaterialScalarFieldEnum = {
      id: "id",
      courseId: "courseId",
      title: "title",
      description: "description",
      url: "url",
      assetId: "assetId",
      isPublished: "isPublished",
      sortOrder: "sortOrder",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.CertificateScalarFieldEnum = {
      id: "id",
      enrollmentId: "enrollmentId",
      certificateNo: "certificateNo",
      status: "status",
      approvedById: "approvedById",
      approvedAt: "approvedAt",
      issuedAt: "issuedAt",
      notes: "notes",
      createdAt: "createdAt"
    };
    exports2.Prisma.StudentApplicationScalarFieldEnum = {
      id: "id",
      referenceCode: "referenceCode",
      idempotencyKey: "idempotencyKey",
      userId: "userId",
      fullName: "fullName",
      email: "email",
      phone: "phone",
      currentStatus: "currentStatus",
      highestEducation: "highestEducation",
      areaOfInterest: "areaOfInterest",
      motivation: "motivation",
      preferredContact: "preferredContact",
      locale: "locale",
      consentAt: "consentAt",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.ApplicationStatusHistoryScalarFieldEnum = {
      id: "id",
      applicationId: "applicationId",
      fromStatus: "fromStatus",
      toStatus: "toStatus",
      changedById: "changedById",
      note: "note",
      createdAt: "createdAt"
    };
    exports2.Prisma.ApplicationInternalNoteScalarFieldEnum = {
      id: "id",
      applicationId: "applicationId",
      authorId: "authorId",
      body: "body",
      createdAt: "createdAt"
    };
    exports2.Prisma.CompanyScalarFieldEnum = {
      id: "id",
      name: "name",
      website: "website",
      industry: "industry",
      contactName: "contactName",
      contactEmail: "contactEmail",
      phone: "phone",
      notes: "notes",
      status: "status",
      listedPublicly: "listedPublicly",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.PartnershipInquiryScalarFieldEnum = {
      id: "id",
      organizationName: "organizationName",
      contactName: "contactName",
      workEmail: "workEmail",
      phone: "phone",
      website: "website",
      interest: "interest",
      message: "message",
      consentAt: "consentAt",
      status: "status",
      companyId: "companyId",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.PartnershipInteractionScalarFieldEnum = {
      id: "id",
      inquiryId: "inquiryId",
      companyId: "companyId",
      authorId: "authorId",
      type: "type",
      note: "note",
      occurredAt: "occurredAt"
    };
    exports2.Prisma.OpportunityScalarFieldEnum = {
      id: "id",
      companyId: "companyId",
      title: "title",
      type: "type",
      description: "description",
      location: "location",
      applyUrl: "applyUrl",
      deadline: "deadline",
      audience: "audience",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.AlumniCohortScalarFieldEnum = {
      id: "id",
      slug: "slug",
      name: "name",
      graduationYear: "graduationYear",
      courseId: "courseId",
      description: "description",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.AlumniProfileScalarFieldEnum = {
      id: "id",
      userId: "userId",
      studentProfileId: "studentProfileId",
      slug: "slug",
      displayName: "displayName",
      cohortId: "cohortId",
      courseId: "courseId",
      graduationYear: "graduationYear",
      programName: "programName",
      professionalTitle: "professionalTitle",
      organization: "organization",
      professionalField: "professionalField",
      skills: "skills",
      interests: "interests",
      bioEn: "bioEn",
      bioBn: "bioBn",
      linkedinUrl: "linkedinUrl",
      portfolioUrl: "portfolioUrl",
      photoAssetId: "photoAssetId",
      contactEmail: "contactEmail",
      contactPhone: "contactPhone",
      verificationStatus: "verificationStatus",
      isPublic: "isPublic",
      publicConsentAt: "publicConsentAt",
      publicationStatus: "publicationStatus",
      pendingChanges: "pendingChanges",
      reviewNote: "reviewNote",
      archivedAt: "archivedAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.AlumniRegistrationRequestScalarFieldEnum = {
      id: "id",
      userId: "userId",
      fullName: "fullName",
      email: "email",
      graduationYear: "graduationYear",
      courseId: "courseId",
      cohortId: "cohortId",
      studentCode: "studentCode",
      message: "message",
      matchedStudentId: "matchedStudentId",
      status: "status",
      reviewNote: "reviewNote",
      reviewedById: "reviewedById",
      reviewedAt: "reviewedAt",
      createdAt: "createdAt"
    };
    exports2.Prisma.AlumniStoryScalarFieldEnum = {
      id: "id",
      slug: "slug",
      authorId: "authorId",
      titleEn: "titleEn",
      titleBn: "titleBn",
      excerptEn: "excerptEn",
      excerptBn: "excerptBn",
      bodyEn: "bodyEn",
      bodyBn: "bodyBn",
      imageAssetId: "imageAssetId",
      status: "status",
      reviewNote: "reviewNote",
      publishedAt: "publishedAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.AlumniAnnouncementScalarFieldEnum = {
      id: "id",
      titleEn: "titleEn",
      titleBn: "titleBn",
      bodyEn: "bodyEn",
      bodyBn: "bodyBn",
      status: "status",
      publishedAt: "publishedAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.WebsiteSectionScalarFieldEnum = {
      id: "id",
      key: "key",
      locale: "locale",
      draftContent: "draftContent",
      publishedContent: "publishedContent",
      publishedAt: "publishedAt",
      updatedById: "updatedById",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.WebsiteSettingScalarFieldEnum = {
      id: "id",
      key: "key",
      group: "group",
      value: "value",
      isPublic: "isPublic",
      description: "description",
      updatedById: "updatedById",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.FaqScalarFieldEnum = {
      id: "id",
      questionEn: "questionEn",
      answerEn: "answerEn",
      questionBn: "questionBn",
      answerBn: "answerBn",
      category: "category",
      sortOrder: "sortOrder",
      isPublished: "isPublished",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports2.Prisma.MediaAssetScalarFieldEnum = {
      id: "id",
      bucket: "bucket",
      objectKey: "objectKey",
      fileName: "fileName",
      mimeType: "mimeType",
      sizeBytes: "sizeBytes",
      visibility: "visibility",
      altText: "altText",
      uploadedById: "uploadedById",
      createdAt: "createdAt"
    };
    exports2.Prisma.ContactMessageScalarFieldEnum = {
      id: "id",
      name: "name",
      email: "email",
      subject: "subject",
      message: "message",
      category: "category",
      userId: "userId",
      isRead: "isRead",
      readAt: "readAt",
      createdAt: "createdAt"
    };
    exports2.Prisma.NotificationScalarFieldEnum = {
      id: "id",
      userId: "userId",
      title: "title",
      body: "body",
      link: "link",
      readAt: "readAt",
      createdAt: "createdAt"
    };
    exports2.Prisma.AuditLogScalarFieldEnum = {
      id: "id",
      actorId: "actorId",
      action: "action",
      entityType: "entityType",
      entityId: "entityId",
      metadata: "metadata",
      ipAddress: "ipAddress",
      createdAt: "createdAt"
    };
    exports2.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports2.Prisma.NullableJsonNullValueInput = {
      DbNull: Prisma12.DbNull,
      JsonNull: Prisma12.JsonNull
    };
    exports2.Prisma.JsonNullValueInput = {
      JsonNull: Prisma12.JsonNull
    };
    exports2.Prisma.QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    exports2.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports2.Prisma.JsonNullValueFilter = {
      DbNull: Prisma12.DbNull,
      JsonNull: Prisma12.JsonNull,
      AnyNull: Prisma12.AnyNull
    };
    exports2.ContentStatus = exports2.$Enums.ContentStatus = {
      DRAFT: "DRAFT",
      PUBLISHED: "PUBLISHED",
      ARCHIVED: "ARCHIVED"
    };
    exports2.ApplicationStatus = exports2.$Enums.ApplicationStatus = {
      SUBMITTED: "SUBMITTED",
      UNDER_REVIEW: "UNDER_REVIEW",
      SHORTLISTED: "SHORTLISTED",
      ACCEPTED: "ACCEPTED",
      REJECTED: "REJECTED",
      WAITLISTED: "WAITLISTED"
    };
    exports2.StudentStatus = exports2.$Enums.StudentStatus = {
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE",
      GRADUATED: "GRADUATED",
      WITHDRAWN: "WITHDRAWN"
    };
    exports2.BatchStatus = exports2.$Enums.BatchStatus = {
      PLANNED: "PLANNED",
      ACTIVE: "ACTIVE",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED"
    };
    exports2.EnrollmentStatus = exports2.$Enums.EnrollmentStatus = {
      ACTIVE: "ACTIVE",
      COMPLETED: "COMPLETED",
      WITHDRAWN: "WITHDRAWN"
    };
    exports2.AttendanceStatus = exports2.$Enums.AttendanceStatus = {
      PRESENT: "PRESENT",
      ABSENT: "ABSENT",
      LATE: "LATE",
      EXCUSED: "EXCUSED"
    };
    exports2.CertificateStatus = exports2.$Enums.CertificateStatus = {
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      ISSUED: "ISSUED",
      REVOKED: "REVOKED"
    };
    exports2.CompanyStatus = exports2.$Enums.CompanyStatus = {
      PROSPECT: "PROSPECT",
      ACTIVE: "ACTIVE",
      INACTIVE: "INACTIVE"
    };
    exports2.InquiryStatus = exports2.$Enums.InquiryStatus = {
      NEW: "NEW",
      IN_REVIEW: "IN_REVIEW",
      CONTACTED: "CONTACTED",
      CLOSED: "CLOSED"
    };
    exports2.OpportunityType = exports2.$Enums.OpportunityType = {
      INTERNSHIP: "INTERNSHIP",
      JOB: "JOB",
      TRAINING: "TRAINING",
      PROJECT: "PROJECT",
      MENTORING: "MENTORING",
      OTHER: "OTHER"
    };
    exports2.OpportunityAudience = exports2.$Enums.OpportunityAudience = {
      STUDENTS: "STUDENTS",
      ALUMNI: "ALUMNI",
      ALL: "ALL"
    };
    exports2.OpportunityStatus = exports2.$Enums.OpportunityStatus = {
      DRAFT: "DRAFT",
      PUBLISHED: "PUBLISHED",
      CLOSED: "CLOSED"
    };
    exports2.ReviewStatus = exports2.$Enums.ReviewStatus = {
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      REJECTED: "REJECTED"
    };
    exports2.AlumniVerification = exports2.$Enums.AlumniVerification = {
      PENDING: "PENDING",
      VERIFIED: "VERIFIED",
      REJECTED: "REJECTED"
    };
    exports2.PublicationStatus = exports2.$Enums.PublicationStatus = {
      NOT_SUBMITTED: "NOT_SUBMITTED",
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      REJECTED: "REJECTED"
    };
    exports2.StoryStatus = exports2.$Enums.StoryStatus = {
      SUBMITTED: "SUBMITTED",
      PUBLISHED: "PUBLISHED",
      REJECTED: "REJECTED",
      ARCHIVED: "ARCHIVED"
    };
    exports2.AssetVisibility = exports2.$Enums.AssetVisibility = {
      PUBLIC: "PUBLIC",
      PRIVATE: "PRIVATE"
    };
    exports2.Prisma.ModelName = {
      User: "User",
      Role: "Role",
      Permission: "Permission",
      UserRole: "UserRole",
      RolePermission: "RolePermission",
      Session: "Session",
      PasswordResetToken: "PasswordResetToken",
      CourseCategory: "CourseCategory",
      Course: "Course",
      CourseTranslation: "CourseTranslation",
      CourseTopic: "CourseTopic",
      LearningOutcome: "LearningOutcome",
      TrainingBatch: "TrainingBatch",
      BatchTeacher: "BatchTeacher",
      StudentProfile: "StudentProfile",
      Enrollment: "Enrollment",
      Attendance: "Attendance",
      Assessment: "Assessment",
      AssessmentResult: "AssessmentResult",
      LearningMaterial: "LearningMaterial",
      Certificate: "Certificate",
      StudentApplication: "StudentApplication",
      ApplicationStatusHistory: "ApplicationStatusHistory",
      ApplicationInternalNote: "ApplicationInternalNote",
      Company: "Company",
      PartnershipInquiry: "PartnershipInquiry",
      PartnershipInteraction: "PartnershipInteraction",
      Opportunity: "Opportunity",
      AlumniCohort: "AlumniCohort",
      AlumniProfile: "AlumniProfile",
      AlumniRegistrationRequest: "AlumniRegistrationRequest",
      AlumniStory: "AlumniStory",
      AlumniAnnouncement: "AlumniAnnouncement",
      WebsiteSection: "WebsiteSection",
      WebsiteSetting: "WebsiteSetting",
      Faq: "Faq",
      MediaAsset: "MediaAsset",
      ContactMessage: "ContactMessage",
      Notification: "Notification",
      AuditLog: "AuditLog"
    };
    var config = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "C:\\Projects\\The Bridge Institute\\backend\\generated\\prisma",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "windows",
            "native": true
          },
          {
            "fromEnvVar": null,
            "value": "rhel-openssl-3.0.x"
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "C:\\Projects\\The Bridge Institute\\database\\prisma\\schema.prisma",
        "isCustomOutput": true
      },
      "relativeEnvPaths": {
        "rootEnvPath": null,
        "schemaEnvPath": "../../.env"
      },
      "relativePath": "../../../database/prisma",
      "clientVersion": "6.19.3",
      "engineVersion": "c2990dca591cba766e3b7ef5d9e8a84796e47ab7",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "postgresql",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": '// The Bridge Institute - database schema (Neon Lakebase Postgres via Prisma)\n// Schema, migrations and seed live in database/prisma. The client is generated\n// into backend/generated/prisma so the backend can import it directly.\n\ngenerator client {\n  provider      = "prisma-client-js"\n  output        = "../../backend/generated/prisma"\n  binaryTargets = ["native", "rhel-openssl-3.0.x"]\n}\n\ndatasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}\n\n// ---------------------------------------------------------------------------\n// Enums\n// ---------------------------------------------------------------------------\n\nenum ContentStatus {\n  DRAFT\n  PUBLISHED\n  ARCHIVED\n}\n\nenum ApplicationStatus {\n  SUBMITTED\n  UNDER_REVIEW\n  SHORTLISTED\n  ACCEPTED\n  REJECTED\n  WAITLISTED\n}\n\nenum StudentStatus {\n  ACTIVE\n  INACTIVE\n  GRADUATED\n  WITHDRAWN\n}\n\nenum BatchStatus {\n  PLANNED\n  ACTIVE\n  COMPLETED\n  CANCELLED\n}\n\nenum EnrollmentStatus {\n  ACTIVE\n  COMPLETED\n  WITHDRAWN\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  LATE\n  EXCUSED\n}\n\nenum CertificateStatus {\n  PENDING\n  APPROVED\n  ISSUED\n  REVOKED\n}\n\nenum CompanyStatus {\n  PROSPECT\n  ACTIVE\n  INACTIVE\n}\n\nenum InquiryStatus {\n  NEW\n  IN_REVIEW\n  CONTACTED\n  CLOSED\n}\n\nenum OpportunityType {\n  INTERNSHIP\n  JOB\n  TRAINING\n  PROJECT\n  MENTORING\n  OTHER\n}\n\nenum OpportunityAudience {\n  STUDENTS\n  ALUMNI\n  ALL\n}\n\nenum OpportunityStatus {\n  DRAFT\n  PUBLISHED\n  CLOSED\n}\n\nenum ReviewStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum AlumniVerification {\n  PENDING\n  VERIFIED\n  REJECTED\n}\n\nenum PublicationStatus {\n  NOT_SUBMITTED\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum StoryStatus {\n  SUBMITTED\n  PUBLISHED\n  REJECTED\n  ARCHIVED\n}\n\nenum AssetVisibility {\n  PUBLIC\n  PRIVATE\n}\n\n// ---------------------------------------------------------------------------\n// Authentication and access control\n// ---------------------------------------------------------------------------\n\nmodel User {\n  id              String    @id @default(uuid()) @db.Uuid\n  email           String    @unique\n  passwordHash    String?\n  fullName        String\n  phone           String?\n  preferredLocale String    @default("en")\n  isActive        Boolean   @default(true)\n  lastLoginAt     DateTime? @db.Timestamptz(3)\n  createdAt       DateTime  @default(now()) @db.Timestamptz(3)\n  updatedAt       DateTime  @updatedAt @db.Timestamptz(3)\n\n  roles                UserRole[]\n  sessions             Session[]\n  passwordResetTokens  PasswordResetToken[]\n  studentProfile       StudentProfile?\n  alumniProfile        AlumniProfile?\n  alumniRequests       AlumniRegistrationRequest[] @relation("AlumniRequestUser")\n  reviewedAlumni       AlumniRegistrationRequest[] @relation("AlumniRequestReviewer")\n  applications         StudentApplication[]\n  statusChanges        ApplicationStatusHistory[]\n  applicationNotes     ApplicationInternalNote[]\n  teachingBatches      BatchTeacher[]\n  auditLogs            AuditLog[]\n  notifications        Notification[]\n  mediaAssets          MediaAsset[]\n  interactions         PartnershipInteraction[]\n  contactMessages      ContactMessage[]\n  approvedCertificates Certificate[]\n\n  @@index([createdAt])\n}\n\nmodel Role {\n  id          String           @id @default(uuid()) @db.Uuid\n  key         String           @unique\n  name        String\n  description String?\n  isSystem    Boolean          @default(true)\n  createdAt   DateTime         @default(now()) @db.Timestamptz(3)\n  users       UserRole[]\n  permissions RolePermission[]\n}\n\nmodel Permission {\n  id          String           @id @default(uuid()) @db.Uuid\n  key         String           @unique\n  description String?\n  roles       RolePermission[]\n}\n\nmodel UserRole {\n  userId     String   @db.Uuid\n  roleId     String   @db.Uuid\n  assignedAt DateTime @default(now()) @db.Timestamptz(3)\n  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role       Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)\n\n  @@id([userId, roleId])\n  @@index([roleId])\n}\n\nmodel RolePermission {\n  roleId       String     @db.Uuid\n  permissionId String     @db.Uuid\n  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)\n  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  @@id([roleId, permissionId])\n  @@index([permissionId])\n}\n\nmodel Session {\n  id         String    @id @default(uuid()) @db.Uuid\n  userId     String    @db.Uuid\n  tokenHash  String    @unique\n  expiresAt  DateTime  @db.Timestamptz(3)\n  revokedAt  DateTime? @db.Timestamptz(3)\n  ipAddress  String?\n  userAgent  String?\n  createdAt  DateTime  @default(now()) @db.Timestamptz(3)\n  lastSeenAt DateTime  @default(now()) @db.Timestamptz(3)\n  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([expiresAt])\n}\n\nmodel PasswordResetToken {\n  id        String    @id @default(uuid()) @db.Uuid\n  userId    String    @db.Uuid\n  tokenHash String    @unique\n  purpose   String    @default("reset")\n  expiresAt DateTime  @db.Timestamptz(3)\n  usedAt    DateTime? @db.Timestamptz(3)\n  createdAt DateTime  @default(now()) @db.Timestamptz(3)\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n}\n\n// ---------------------------------------------------------------------------\n// Courses and training\n// ---------------------------------------------------------------------------\n\nmodel CourseCategory {\n  id        String   @id @default(uuid()) @db.Uuid\n  slug      String   @unique\n  nameEn    String\n  nameBn    String?\n  sortOrder Int      @default(0)\n  createdAt DateTime @default(now()) @db.Timestamptz(3)\n  updatedAt DateTime @updatedAt @db.Timestamptz(3)\n  courses   Course[]\n}\n\nmodel Course {\n  id           String              @id @default(uuid()) @db.Uuid\n  slug         String              @unique\n  icon         String              @default("book-open")\n  status       ContentStatus       @default(DRAFT)\n  sortOrder    Int                 @default(0)\n  categoryId   String?             @db.Uuid\n  publishedAt  DateTime?           @db.Timestamptz(3)\n  createdAt    DateTime            @default(now()) @db.Timestamptz(3)\n  updatedAt    DateTime            @updatedAt @db.Timestamptz(3)\n  category     CourseCategory?     @relation(fields: [categoryId], references: [id], onDelete: SetNull)\n  translations CourseTranslation[]\n  topics       CourseTopic[]\n  outcomes     LearningOutcome[]\n  batches      TrainingBatch[]\n  materials    LearningMaterial[]\n  cohorts      AlumniCohort[]\n  alumni       AlumniProfile[]\n\n  @@index([status, sortOrder])\n}\n\n/// One row per language so editing English never overwrites Bangla (and vice versa).\nmodel CourseTranslation {\n  id          String   @id @default(uuid()) @db.Uuid\n  courseId    String   @db.Uuid\n  locale      String\n  title       String\n  summary     String\n  description String\n  duration    String?\n  updatedAt   DateTime @updatedAt @db.Timestamptz(3)\n  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@unique([courseId, locale])\n}\n\nmodel CourseTopic {\n  id        String  @id @default(uuid()) @db.Uuid\n  courseId  String  @db.Uuid\n  sortOrder Int     @default(0)\n  textEn    String\n  textBn    String?\n  course    Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@index([courseId, sortOrder])\n}\n\nmodel LearningOutcome {\n  id        String  @id @default(uuid()) @db.Uuid\n  courseId  String  @db.Uuid\n  sortOrder Int     @default(0)\n  textEn    String\n  textBn    String?\n  course    Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@index([courseId, sortOrder])\n}\n\nmodel TrainingBatch {\n  id          String         @id @default(uuid()) @db.Uuid\n  code        String         @unique\n  name        String\n  courseId    String?        @db.Uuid\n  startDate   DateTime?      @db.Date\n  endDate     DateTime?      @db.Date\n  capacity    Int?\n  status      BatchStatus    @default(PLANNED)\n  createdAt   DateTime       @default(now()) @db.Timestamptz(3)\n  updatedAt   DateTime       @updatedAt @db.Timestamptz(3)\n  course      Course?        @relation(fields: [courseId], references: [id], onDelete: SetNull)\n  teachers    BatchTeacher[]\n  enrollments Enrollment[]\n  assessments Assessment[]\n\n  @@index([status])\n}\n\nmodel BatchTeacher {\n  batchId String        @db.Uuid\n  userId  String        @db.Uuid\n  batch   TrainingBatch @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  user    User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@id([batchId, userId])\n  @@index([userId])\n}\n\nmodel StudentProfile {\n  id                  String              @id @default(uuid()) @db.Uuid\n  userId              String              @unique @db.Uuid\n  studentCode         String              @unique\n  educationLevel      String?\n  currentStatus       String?\n  status              StudentStatus       @default(ACTIVE)\n  graduatedAt         DateTime?           @db.Timestamptz(3)\n  sourceApplicationId String?             @unique @db.Uuid\n  createdAt           DateTime            @default(now()) @db.Timestamptz(3)\n  updatedAt           DateTime            @updatedAt @db.Timestamptz(3)\n  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)\n  sourceApplication   StudentApplication? @relation(fields: [sourceApplicationId], references: [id], onDelete: SetNull)\n  enrollments         Enrollment[]\n  alumniProfile       AlumniProfile?\n\n  @@index([status])\n}\n\nmodel Enrollment {\n  id          String             @id @default(uuid()) @db.Uuid\n  studentId   String             @db.Uuid\n  batchId     String             @db.Uuid\n  status      EnrollmentStatus   @default(ACTIVE)\n  progress    Int                @default(0)\n  enrolledAt  DateTime           @default(now()) @db.Timestamptz(3)\n  completedAt DateTime?          @db.Timestamptz(3)\n  student     StudentProfile     @relation(fields: [studentId], references: [id], onDelete: Restrict)\n  batch       TrainingBatch      @relation(fields: [batchId], references: [id], onDelete: Restrict)\n  attendance  Attendance[]\n  results     AssessmentResult[]\n  certificate Certificate?\n\n  @@unique([studentId, batchId])\n  @@index([batchId])\n}\n\nmodel Attendance {\n  id           String           @id @default(uuid()) @db.Uuid\n  enrollmentId String           @db.Uuid\n  date         DateTime         @db.Date\n  status       AttendanceStatus\n  note         String?\n  recordedById String?          @db.Uuid\n  createdAt    DateTime         @default(now()) @db.Timestamptz(3)\n  enrollment   Enrollment       @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)\n\n  @@unique([enrollmentId, date])\n}\n\nmodel Assessment {\n  id        String             @id @default(uuid()) @db.Uuid\n  batchId   String             @db.Uuid\n  title     String\n  type      String             @default("assignment")\n  maxScore  Int                @default(100)\n  dueDate   DateTime?          @db.Timestamptz(3)\n  createdAt DateTime           @default(now()) @db.Timestamptz(3)\n  batch     TrainingBatch      @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  results   AssessmentResult[]\n\n  @@index([batchId])\n}\n\nmodel AssessmentResult {\n  id           String     @id @default(uuid()) @db.Uuid\n  assessmentId String     @db.Uuid\n  enrollmentId String     @db.Uuid\n  score        Decimal    @db.Decimal(6, 2)\n  feedback     String?\n  gradedById   String?    @db.Uuid\n  createdAt    DateTime   @default(now()) @db.Timestamptz(3)\n  updatedAt    DateTime   @updatedAt @db.Timestamptz(3)\n  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)\n  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)\n\n  @@unique([assessmentId, enrollmentId])\n}\n\nmodel LearningMaterial {\n  id          String      @id @default(uuid()) @db.Uuid\n  courseId    String      @db.Uuid\n  title       String\n  description String?\n  url         String?\n  assetId     String?     @db.Uuid\n  isPublished Boolean     @default(false)\n  sortOrder   Int         @default(0)\n  createdAt   DateTime    @default(now()) @db.Timestamptz(3)\n  updatedAt   DateTime    @updatedAt @db.Timestamptz(3)\n  course      Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)\n  asset       MediaAsset? @relation(fields: [assetId], references: [id], onDelete: SetNull)\n\n  @@index([courseId])\n}\n\n/// Certificates are never issued automatically: they require explicit staff approval.\nmodel Certificate {\n  id            String            @id @default(uuid()) @db.Uuid\n  enrollmentId  String            @unique @db.Uuid\n  certificateNo String            @unique\n  status        CertificateStatus @default(PENDING)\n  approvedById  String?           @db.Uuid\n  approvedAt    DateTime?         @db.Timestamptz(3)\n  issuedAt      DateTime?         @db.Timestamptz(3)\n  notes         String?\n  createdAt     DateTime          @default(now()) @db.Timestamptz(3)\n  enrollment    Enrollment        @relation(fields: [enrollmentId], references: [id], onDelete: Restrict)\n  approvedBy    User?             @relation(fields: [approvedById], references: [id], onDelete: SetNull)\n}\n\n// ---------------------------------------------------------------------------\n// Admissions\n// ---------------------------------------------------------------------------\n\nmodel StudentApplication {\n  id               String                     @id @default(uuid()) @db.Uuid\n  referenceCode    String                     @unique\n  idempotencyKey   String?                    @unique\n  userId           String?                    @db.Uuid\n  fullName         String\n  email            String\n  phone            String\n  currentStatus    String\n  highestEducation String?\n  areaOfInterest   String\n  motivation       String\n  preferredContact String?\n  locale           String                     @default("en")\n  consentAt        DateTime                   @db.Timestamptz(3)\n  status           ApplicationStatus          @default(SUBMITTED)\n  createdAt        DateTime                   @default(now()) @db.Timestamptz(3)\n  updatedAt        DateTime                   @updatedAt @db.Timestamptz(3)\n  user             User?                      @relation(fields: [userId], references: [id], onDelete: SetNull)\n  history          ApplicationStatusHistory[]\n  notes            ApplicationInternalNote[]\n  studentProfile   StudentProfile?\n\n  @@index([email])\n  @@index([status, createdAt])\n  @@index([userId])\n}\n\nmodel ApplicationStatusHistory {\n  id            String             @id @default(uuid()) @db.Uuid\n  applicationId String             @db.Uuid\n  fromStatus    ApplicationStatus?\n  toStatus      ApplicationStatus\n  changedById   String?            @db.Uuid\n  note          String?\n  createdAt     DateTime           @default(now()) @db.Timestamptz(3)\n  application   StudentApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)\n  changedBy     User?              @relation(fields: [changedById], references: [id], onDelete: SetNull)\n\n  @@index([applicationId])\n}\n\n/// Private staff notes. Never returned by applicant-facing endpoints.\nmodel ApplicationInternalNote {\n  id            String             @id @default(uuid()) @db.Uuid\n  applicationId String             @db.Uuid\n  authorId      String?            @db.Uuid\n  body          String\n  createdAt     DateTime           @default(now()) @db.Timestamptz(3)\n  application   StudentApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)\n  author        User?              @relation(fields: [authorId], references: [id], onDelete: SetNull)\n\n  @@index([applicationId])\n}\n\n// ---------------------------------------------------------------------------\n// Industry partnerships\n// ---------------------------------------------------------------------------\n\nmodel Company {\n  id             String                   @id @default(uuid()) @db.Uuid\n  name           String\n  website        String?\n  industry       String?\n  contactName    String?\n  contactEmail   String?\n  phone          String?\n  notes          String?\n  status         CompanyStatus            @default(PROSPECT)\n  /// Name, industry and website may be shown on the public site. Contact details never are.\n  listedPublicly Boolean                  @default(false)\n  createdAt      DateTime                 @default(now()) @db.Timestamptz(3)\n  updatedAt      DateTime                 @updatedAt @db.Timestamptz(3)\n  inquiries      PartnershipInquiry[]\n  interactions   PartnershipInteraction[]\n  opportunities  Opportunity[]\n\n  @@index([name])\n}\n\nmodel PartnershipInquiry {\n  id               String                   @id @default(uuid()) @db.Uuid\n  organizationName String\n  contactName      String\n  workEmail        String\n  phone            String?\n  website          String?\n  interest         String\n  message          String\n  consentAt        DateTime                 @db.Timestamptz(3)\n  status           InquiryStatus            @default(NEW)\n  companyId        String?                  @db.Uuid\n  createdAt        DateTime                 @default(now()) @db.Timestamptz(3)\n  updatedAt        DateTime                 @updatedAt @db.Timestamptz(3)\n  company          Company?                 @relation(fields: [companyId], references: [id], onDelete: SetNull)\n  interactions     PartnershipInteraction[]\n\n  @@index([status, createdAt])\n}\n\nmodel PartnershipInteraction {\n  id         String              @id @default(uuid()) @db.Uuid\n  inquiryId  String?             @db.Uuid\n  companyId  String?             @db.Uuid\n  authorId   String?             @db.Uuid\n  type       String              @default("note")\n  note       String\n  occurredAt DateTime            @default(now()) @db.Timestamptz(3)\n  inquiry    PartnershipInquiry? @relation(fields: [inquiryId], references: [id], onDelete: Cascade)\n  company    Company?            @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  author     User?               @relation(fields: [authorId], references: [id], onDelete: SetNull)\n\n  @@index([inquiryId])\n  @@index([companyId])\n}\n\nmodel Opportunity {\n  id          String              @id @default(uuid()) @db.Uuid\n  companyId   String?             @db.Uuid\n  title       String\n  type        OpportunityType     @default(OTHER)\n  description String\n  location    String?\n  applyUrl    String?\n  deadline    DateTime?           @db.Timestamptz(3)\n  audience    OpportunityAudience @default(ALL)\n  status      OpportunityStatus   @default(DRAFT)\n  createdAt   DateTime            @default(now()) @db.Timestamptz(3)\n  updatedAt   DateTime            @updatedAt @db.Timestamptz(3)\n  company     Company?            @relation(fields: [companyId], references: [id], onDelete: SetNull)\n\n  @@index([status, audience])\n}\n\n// ---------------------------------------------------------------------------\n// Alumni\n// ---------------------------------------------------------------------------\n\nmodel AlumniCohort {\n  id             String                      @id @default(uuid()) @db.Uuid\n  slug           String                      @unique\n  name           String\n  graduationYear Int?\n  courseId       String?                     @db.Uuid\n  description    String?\n  createdAt      DateTime                    @default(now()) @db.Timestamptz(3)\n  updatedAt      DateTime                    @updatedAt @db.Timestamptz(3)\n  course         Course?                     @relation(fields: [courseId], references: [id], onDelete: SetNull)\n  profiles       AlumniProfile[]\n  requests       AlumniRegistrationRequest[]\n}\n\n/// Public directory shows a profile only when verificationStatus = VERIFIED,\n/// isPublic = true (explicit consent), publicationStatus = APPROVED and archivedAt is null.\nmodel AlumniProfile {\n  id                 String             @id @default(uuid()) @db.Uuid\n  userId             String             @unique @db.Uuid\n  studentProfileId   String?            @unique @db.Uuid\n  slug               String             @unique\n  displayName        String\n  cohortId           String?            @db.Uuid\n  courseId           String?            @db.Uuid\n  graduationYear     Int?\n  programName        String?\n  professionalTitle  String?\n  organization       String?\n  professionalField  String?\n  skills             String[]           @default([])\n  interests          String[]           @default([])\n  bioEn              String?\n  bioBn              String?\n  linkedinUrl        String?\n  portfolioUrl       String?\n  photoAssetId       String?            @db.Uuid\n  contactEmail       String?\n  contactPhone       String?\n  verificationStatus AlumniVerification @default(PENDING)\n  isPublic           Boolean            @default(false)\n  publicConsentAt    DateTime?          @db.Timestamptz(3)\n  publicationStatus  PublicationStatus  @default(NOT_SUBMITTED)\n  pendingChanges     Json?\n  reviewNote         String?\n  archivedAt         DateTime?          @db.Timestamptz(3)\n  createdAt          DateTime           @default(now()) @db.Timestamptz(3)\n  updatedAt          DateTime           @updatedAt @db.Timestamptz(3)\n  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  studentProfile     StudentProfile?    @relation(fields: [studentProfileId], references: [id], onDelete: SetNull)\n  cohort             AlumniCohort?      @relation(fields: [cohortId], references: [id], onDelete: SetNull)\n  course             Course?            @relation(fields: [courseId], references: [id], onDelete: SetNull)\n  photo              MediaAsset?        @relation(fields: [photoAssetId], references: [id], onDelete: SetNull)\n  stories            AlumniStory[]\n\n  @@index([verificationStatus, isPublic, publicationStatus])\n  @@index([graduationYear])\n}\n\nmodel AlumniRegistrationRequest {\n  id               String        @id @default(uuid()) @db.Uuid\n  userId           String        @db.Uuid\n  fullName         String\n  email            String\n  graduationYear   Int?\n  courseId         String?       @db.Uuid\n  cohortId         String?       @db.Uuid\n  studentCode      String?\n  message          String?\n  matchedStudentId String?       @db.Uuid\n  status           ReviewStatus  @default(PENDING)\n  reviewNote       String?\n  reviewedById     String?       @db.Uuid\n  reviewedAt       DateTime?     @db.Timestamptz(3)\n  createdAt        DateTime      @default(now()) @db.Timestamptz(3)\n  user             User          @relation("AlumniRequestUser", fields: [userId], references: [id], onDelete: Cascade)\n  reviewedBy       User?         @relation("AlumniRequestReviewer", fields: [reviewedById], references: [id], onDelete: SetNull)\n  cohort           AlumniCohort? @relation(fields: [cohortId], references: [id], onDelete: SetNull)\n\n  @@index([status, createdAt])\n  @@index([userId])\n}\n\nmodel AlumniStory {\n  id           String        @id @default(uuid()) @db.Uuid\n  slug         String        @unique\n  authorId     String        @db.Uuid\n  titleEn      String?\n  titleBn      String?\n  excerptEn    String?\n  excerptBn    String?\n  bodyEn       String?\n  bodyBn       String?\n  imageAssetId String?       @db.Uuid\n  status       StoryStatus   @default(SUBMITTED)\n  reviewNote   String?\n  publishedAt  DateTime?     @db.Timestamptz(3)\n  createdAt    DateTime      @default(now()) @db.Timestamptz(3)\n  updatedAt    DateTime      @updatedAt @db.Timestamptz(3)\n  author       AlumniProfile @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  image        MediaAsset?   @relation(fields: [imageAssetId], references: [id], onDelete: SetNull)\n\n  @@index([status, publishedAt])\n}\n\nmodel AlumniAnnouncement {\n  id          String        @id @default(uuid()) @db.Uuid\n  titleEn     String\n  titleBn     String?\n  bodyEn      String\n  bodyBn      String?\n  status      ContentStatus @default(DRAFT)\n  publishedAt DateTime?     @db.Timestamptz(3)\n  createdAt   DateTime      @default(now()) @db.Timestamptz(3)\n  updatedAt   DateTime      @updatedAt @db.Timestamptz(3)\n\n  @@index([status, publishedAt])\n}\n\n// ---------------------------------------------------------------------------\n// CMS\n// ---------------------------------------------------------------------------\n\n/// Draft and published content are stored separately so editing never changes the\n/// public site until publication. One row per (key, locale).\nmodel WebsiteSection {\n  id               String    @id @default(uuid()) @db.Uuid\n  key              String\n  locale           String\n  draftContent     Json\n  publishedContent Json?\n  publishedAt      DateTime? @db.Timestamptz(3)\n  updatedById      String?   @db.Uuid\n  createdAt        DateTime  @default(now()) @db.Timestamptz(3)\n  updatedAt        DateTime  @updatedAt @db.Timestamptz(3)\n\n  @@unique([key, locale])\n}\n\n/// Key/value settings grouped by purpose: contact, qr, social, seo, program.\n/// isPublic controls whether the value may be returned by public endpoints.\nmodel WebsiteSetting {\n  id          String   @id @default(uuid()) @db.Uuid\n  key         String   @unique\n  group       String\n  value       Json\n  isPublic    Boolean  @default(false)\n  description String?\n  updatedById String?  @db.Uuid\n  updatedAt   DateTime @updatedAt @db.Timestamptz(3)\n\n  @@index([group])\n}\n\nmodel Faq {\n  id          String   @id @default(uuid()) @db.Uuid\n  questionEn  String\n  answerEn    String\n  questionBn  String?\n  answerBn    String?\n  category    String   @default("general")\n  sortOrder   Int      @default(0)\n  isPublished Boolean  @default(false)\n  createdAt   DateTime @default(now()) @db.Timestamptz(3)\n  updatedAt   DateTime @updatedAt @db.Timestamptz(3)\n\n  @@index([isPublished, sortOrder])\n}\n\n/// Metadata for objects held in external storage (Supabase Storage). Binaries are never stored here.\nmodel MediaAsset {\n  id           String             @id @default(uuid()) @db.Uuid\n  bucket       String\n  objectKey    String\n  fileName     String\n  mimeType     String\n  sizeBytes    Int\n  visibility   AssetVisibility    @default(PRIVATE)\n  altText      String?\n  uploadedById String?            @db.Uuid\n  createdAt    DateTime           @default(now()) @db.Timestamptz(3)\n  uploadedBy   User?              @relation(fields: [uploadedById], references: [id], onDelete: SetNull)\n  materials    LearningMaterial[]\n  alumniPhotos AlumniProfile[]\n  storyImages  AlumniStory[]\n\n  @@unique([bucket, objectKey])\n}\n\n// ---------------------------------------------------------------------------\n// Communication and auditing\n// ---------------------------------------------------------------------------\n\nmodel ContactMessage {\n  id        String    @id @default(uuid()) @db.Uuid\n  name      String\n  email     String\n  subject   String\n  message   String\n  category  String    @default("general")\n  userId    String?   @db.Uuid\n  isRead    Boolean   @default(false)\n  readAt    DateTime? @db.Timestamptz(3)\n  createdAt DateTime  @default(now()) @db.Timestamptz(3)\n  user      User?     @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([isRead, createdAt])\n}\n\nmodel Notification {\n  id        String    @id @default(uuid()) @db.Uuid\n  userId    String    @db.Uuid\n  title     String\n  body      String\n  link      String?\n  readAt    DateTime? @db.Timestamptz(3)\n  createdAt DateTime  @default(now()) @db.Timestamptz(3)\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, readAt])\n}\n\nmodel AuditLog {\n  id         String   @id @default(uuid()) @db.Uuid\n  actorId    String?  @db.Uuid\n  action     String\n  entityType String\n  entityId   String?\n  metadata   Json?\n  ipAddress  String?\n  createdAt  DateTime @default(now()) @db.Timestamptz(3)\n  actor      User?    @relation(fields: [actorId], references: [id], onDelete: SetNull)\n\n  @@index([entityType, entityId])\n  @@index([createdAt])\n  @@index([actorId])\n}\n',
      "inlineSchemaHash": "27a6decb4b2695ff77dd01c483b806182d25bc54059b4ded9b77eefec10199d1",
      "copyEngine": true
    };
    var fs = require("fs");
    config.dirname = __dirname;
    if (!fs.existsSync(path.join(__dirname, "schema.prisma"))) {
      const alternativePaths = [
        "generated/prisma",
        "prisma"
      ];
      const alternativePath = alternativePaths.find((altPath) => {
        return fs.existsSync(path.join(process.cwd(), altPath, "schema.prisma"));
      }) ?? alternativePaths[0];
      config.dirname = path.join(process.cwd(), alternativePath);
      config.isBundled = true;
    }
    config.runtimeDataModel = JSON.parse('{"models":{"User":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"passwordHash","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"fullName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"preferredLocale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"en","isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"lastLoginAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"roles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"UserRole","nativeType":null,"relationName":"UserToUserRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"sessions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Session","nativeType":null,"relationName":"SessionToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"passwordResetTokens","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PasswordResetToken","nativeType":null,"relationName":"PasswordResetTokenToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"studentProfile","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentProfile","nativeType":null,"relationName":"StudentProfileToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"alumniProfile","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniProfileToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"alumniRequests","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniRegistrationRequest","nativeType":null,"relationName":"AlumniRequestUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviewedAlumni","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniRegistrationRequest","nativeType":null,"relationName":"AlumniRequestReviewer","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"applications","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentApplication","nativeType":null,"relationName":"StudentApplicationToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"statusChanges","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationStatusHistory","nativeType":null,"relationName":"ApplicationStatusHistoryToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"applicationNotes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationInternalNote","nativeType":null,"relationName":"ApplicationInternalNoteToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"teachingBatches","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BatchTeacher","nativeType":null,"relationName":"BatchTeacherToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"auditLogs","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AuditLog","nativeType":null,"relationName":"AuditLogToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"notifications","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Notification","nativeType":null,"relationName":"NotificationToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"mediaAssets","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"MediaAsset","nativeType":null,"relationName":"MediaAssetToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"interactions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PartnershipInteraction","nativeType":null,"relationName":"PartnershipInteractionToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"contactMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ContactMessage","nativeType":null,"relationName":"ContactMessageToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"approvedCertificates","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Certificate","nativeType":null,"relationName":"CertificateToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Role":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"key","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isSystem","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"users","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"UserRole","nativeType":null,"relationName":"RoleToUserRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"permissions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"RolePermission","nativeType":null,"relationName":"RoleToRolePermission","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Permission":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"key","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"roles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"RolePermission","nativeType":null,"relationName":"PermissionToRolePermission","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"UserRole":{"dbName":null,"schema":null,"fields":[{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"roleId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"assignedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"UserToUserRole","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Role","nativeType":null,"relationName":"RoleToUserRole","relationFromFields":["roleId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["userId","roleId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"RolePermission":{"dbName":null,"schema":null,"fields":[{"name":"roleId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"permissionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Role","nativeType":null,"relationName":"RoleToRolePermission","relationFromFields":["roleId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"permission","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Permission","nativeType":null,"relationName":"PermissionToRolePermission","relationFromFields":["permissionId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["roleId","permissionId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Session":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"tokenHash","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"revokedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"ipAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userAgent","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"lastSeenAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"SessionToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PasswordResetToken":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"tokenHash","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"purpose","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"reset","isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"usedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"PasswordResetTokenToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CourseCategory":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"nameEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"nameBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"courses","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToCourseCategory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Course":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"icon","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"book-open","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ContentStatus","nativeType":null,"default":"DRAFT","isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"publishedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"category","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CourseCategory","nativeType":null,"relationName":"CourseToCourseCategory","relationFromFields":["categoryId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"translations","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CourseTranslation","nativeType":null,"relationName":"CourseToCourseTranslation","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"topics","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CourseTopic","nativeType":null,"relationName":"CourseToCourseTopic","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"outcomes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LearningOutcome","nativeType":null,"relationName":"CourseToLearningOutcome","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"batches","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"TrainingBatch","nativeType":null,"relationName":"CourseToTrainingBatch","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"materials","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LearningMaterial","nativeType":null,"relationName":"CourseToLearningMaterial","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"cohorts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniCohort","nativeType":null,"relationName":"AlumniCohortToCourse","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"alumni","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniProfileToCourse","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CourseTranslation":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"locale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"summary","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"duration","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"course","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToCourseTranslation","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["courseId","locale"]],"uniqueIndexes":[{"name":null,"fields":["courseId","locale"]}],"isGenerated":false,"documentation":"One row per language so editing English never overwrites Bangla (and vice versa)."},"CourseTopic":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"textEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"textBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"course","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToCourseTopic","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"LearningOutcome":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"textEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"textBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"course","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToLearningOutcome","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"TrainingBatch":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"code","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"startDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Date",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"endDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Date",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"capacity","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"BatchStatus","nativeType":null,"default":"PLANNED","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"course","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToTrainingBatch","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"teachers","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BatchTeacher","nativeType":null,"relationName":"BatchTeacherToTrainingBatch","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"enrollments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Enrollment","nativeType":null,"relationName":"EnrollmentToTrainingBatch","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"assessments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Assessment","nativeType":null,"relationName":"AssessmentToTrainingBatch","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"BatchTeacher":{"dbName":null,"schema":null,"fields":[{"name":"batchId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"batch","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"TrainingBatch","nativeType":null,"relationName":"BatchTeacherToTrainingBatch","relationFromFields":["batchId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"BatchTeacherToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":{"name":null,"fields":["batchId","userId"]},"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"StudentProfile":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"studentCode","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"educationLevel","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"currentStatus","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"StudentStatus","nativeType":null,"default":"ACTIVE","isGenerated":false,"isUpdatedAt":false},{"name":"graduatedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"sourceApplicationId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"StudentProfileToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"sourceApplication","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentApplication","nativeType":null,"relationName":"StudentApplicationToStudentProfile","relationFromFields":["sourceApplicationId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"enrollments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Enrollment","nativeType":null,"relationName":"EnrollmentToStudentProfile","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"alumniProfile","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniProfileToStudentProfile","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Enrollment":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"studentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"batchId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"EnrollmentStatus","nativeType":null,"default":"ACTIVE","isGenerated":false,"isUpdatedAt":false},{"name":"progress","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"enrolledAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"completedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"student","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentProfile","nativeType":null,"relationName":"EnrollmentToStudentProfile","relationFromFields":["studentId"],"relationToFields":["id"],"relationOnDelete":"Restrict","isGenerated":false,"isUpdatedAt":false},{"name":"batch","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"TrainingBatch","nativeType":null,"relationName":"EnrollmentToTrainingBatch","relationFromFields":["batchId"],"relationToFields":["id"],"relationOnDelete":"Restrict","isGenerated":false,"isUpdatedAt":false},{"name":"attendance","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Attendance","nativeType":null,"relationName":"AttendanceToEnrollment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"results","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AssessmentResult","nativeType":null,"relationName":"AssessmentResultToEnrollment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"certificate","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Certificate","nativeType":null,"relationName":"CertificateToEnrollment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["studentId","batchId"]],"uniqueIndexes":[{"name":null,"fields":["studentId","batchId"]}],"isGenerated":false},"Attendance":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"enrollmentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Date",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AttendanceStatus","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"note","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"recordedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"enrollment","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Enrollment","nativeType":null,"relationName":"AttendanceToEnrollment","relationFromFields":["enrollmentId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["enrollmentId","date"]],"uniqueIndexes":[{"name":null,"fields":["enrollmentId","date"]}],"isGenerated":false},"Assessment":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"batchId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"assignment","isGenerated":false,"isUpdatedAt":false},{"name":"maxScore","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":100,"isGenerated":false,"isUpdatedAt":false},{"name":"dueDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"batch","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"TrainingBatch","nativeType":null,"relationName":"AssessmentToTrainingBatch","relationFromFields":["batchId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"results","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AssessmentResult","nativeType":null,"relationName":"AssessmentToAssessmentResult","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AssessmentResult":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"assessmentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"enrollmentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"score","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","nativeType":["Decimal",["6","2"]],"isGenerated":false,"isUpdatedAt":false},{"name":"feedback","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"gradedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"assessment","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Assessment","nativeType":null,"relationName":"AssessmentToAssessmentResult","relationFromFields":["assessmentId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"enrollment","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Enrollment","nativeType":null,"relationName":"AssessmentResultToEnrollment","relationFromFields":["enrollmentId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["assessmentId","enrollmentId"]],"uniqueIndexes":[{"name":null,"fields":["assessmentId","enrollmentId"]}],"isGenerated":false},"LearningMaterial":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"assetId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"isPublished","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"course","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"CourseToLearningMaterial","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"asset","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"MediaAsset","nativeType":null,"relationName":"LearningMaterialToMediaAsset","relationFromFields":["assetId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Certificate":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"enrollmentId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"certificateNo","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"CertificateStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"approvedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"approvedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"issuedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"enrollment","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Enrollment","nativeType":null,"relationName":"CertificateToEnrollment","relationFromFields":["enrollmentId"],"relationToFields":["id"],"relationOnDelete":"Restrict","isGenerated":false,"isUpdatedAt":false},{"name":"approvedBy","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"CertificateToUser","relationFromFields":["approvedById"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false,"documentation":"Certificates are never issued automatically: they require explicit staff approval."},"StudentApplication":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"referenceCode","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"idempotencyKey","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"fullName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"currentStatus","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"highestEducation","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"areaOfInterest","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"motivation","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"preferredContact","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"locale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"en","isGenerated":false,"isUpdatedAt":false},{"name":"consentAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ApplicationStatus","nativeType":null,"default":"SUBMITTED","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"StudentApplicationToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"history","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationStatusHistory","nativeType":null,"relationName":"ApplicationStatusHistoryToStudentApplication","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationInternalNote","nativeType":null,"relationName":"ApplicationInternalNoteToStudentApplication","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"studentProfile","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentProfile","nativeType":null,"relationName":"StudentApplicationToStudentProfile","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ApplicationStatusHistory":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"applicationId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"fromStatus","kind":"enum","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationStatus","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"toStatus","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ApplicationStatus","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"changedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"note","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"application","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentApplication","nativeType":null,"relationName":"ApplicationStatusHistoryToStudentApplication","relationFromFields":["applicationId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"changedBy","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ApplicationStatusHistoryToUser","relationFromFields":["changedById"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ApplicationInternalNote":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"applicationId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"body","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"application","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentApplication","nativeType":null,"relationName":"ApplicationInternalNoteToStudentApplication","relationFromFields":["applicationId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ApplicationInternalNoteToUser","relationFromFields":["authorId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false,"documentation":"Private staff notes. Never returned by applicant-facing endpoints."},"Company":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"website","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"industry","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contactName","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contactEmail","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"CompanyStatus","nativeType":null,"default":"PROSPECT","isGenerated":false,"isUpdatedAt":false},{"name":"listedPublicly","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false,"documentation":"Name, industry and website may be shown on the public site. Contact details never are."},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"inquiries","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PartnershipInquiry","nativeType":null,"relationName":"CompanyToPartnershipInquiry","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"interactions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PartnershipInteraction","nativeType":null,"relationName":"CompanyToPartnershipInteraction","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"opportunities","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Opportunity","nativeType":null,"relationName":"CompanyToOpportunity","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PartnershipInquiry":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"organizationName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contactName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"workEmail","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"website","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"interest","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"consentAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"InquiryStatus","nativeType":null,"default":"NEW","isGenerated":false,"isUpdatedAt":false},{"name":"companyId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"company","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CompanyToPartnershipInquiry","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"interactions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PartnershipInteraction","nativeType":null,"relationName":"PartnershipInquiryToPartnershipInteraction","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PartnershipInteraction":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"inquiryId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"companyId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"note","isGenerated":false,"isUpdatedAt":false},{"name":"note","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"occurredAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"inquiry","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PartnershipInquiry","nativeType":null,"relationName":"PartnershipInquiryToPartnershipInteraction","relationFromFields":["inquiryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"company","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CompanyToPartnershipInteraction","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"PartnershipInteractionToUser","relationFromFields":["authorId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Opportunity":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"companyId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OpportunityType","nativeType":null,"default":"OTHER","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"applyUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"deadline","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"audience","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OpportunityAudience","nativeType":null,"default":"ALL","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OpportunityStatus","nativeType":null,"default":"DRAFT","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"company","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Company","nativeType":null,"relationName":"CompanyToOpportunity","relationFromFields":["companyId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AlumniCohort":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"graduationYear","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"course","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"AlumniCohortToCourse","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"profiles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniCohortToAlumniProfile","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"requests","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniRegistrationRequest","nativeType":null,"relationName":"AlumniCohortToAlumniRegistrationRequest","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AlumniProfile":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"studentProfileId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"displayName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"cohortId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"graduationYear","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"programName","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"professionalTitle","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"organization","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"professionalField","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"skills","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":[],"isGenerated":false,"isUpdatedAt":false},{"name":"interests","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":[],"isGenerated":false,"isUpdatedAt":false},{"name":"bioEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bioBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"linkedinUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"portfolioUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"photoAssetId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"contactEmail","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contactPhone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"verificationStatus","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"AlumniVerification","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"isPublic","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"publicConsentAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"publicationStatus","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"PublicationStatus","nativeType":null,"default":"NOT_SUBMITTED","isGenerated":false,"isUpdatedAt":false},{"name":"pendingChanges","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"reviewNote","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"archivedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AlumniProfileToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"studentProfile","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"StudentProfile","nativeType":null,"relationName":"AlumniProfileToStudentProfile","relationFromFields":["studentProfileId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"cohort","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniCohort","nativeType":null,"relationName":"AlumniCohortToAlumniProfile","relationFromFields":["cohortId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"course","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Course","nativeType":null,"relationName":"AlumniProfileToCourse","relationFromFields":["courseId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"photo","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"MediaAsset","nativeType":null,"relationName":"AlumniProfileToMediaAsset","relationFromFields":["photoAssetId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"stories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniStory","nativeType":null,"relationName":"AlumniProfileToAlumniStory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false,"documentation":"Public directory shows a profile only when verificationStatus = VERIFIED,\\\\nisPublic = true (explicit consent), publicationStatus = APPROVED and archivedAt is null."},"AlumniRegistrationRequest":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"fullName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"graduationYear","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"courseId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"cohortId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"studentCode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"matchedStudentId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ReviewStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"reviewNote","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"reviewedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"reviewedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AlumniRequestUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"reviewedBy","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AlumniRequestReviewer","relationFromFields":["reviewedById"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"cohort","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniCohort","nativeType":null,"relationName":"AlumniCohortToAlumniRegistrationRequest","relationFromFields":["cohortId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AlumniStory":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"titleEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"titleBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"excerptEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"excerptBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bodyEn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bodyBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"imageAssetId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"StoryStatus","nativeType":null,"default":"SUBMITTED","isGenerated":false,"isUpdatedAt":false},{"name":"reviewNote","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"publishedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true},{"name":"author","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniProfileToAlumniStory","relationFromFields":["authorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"MediaAsset","nativeType":null,"relationName":"AlumniStoryToMediaAsset","relationFromFields":["imageAssetId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AlumniAnnouncement":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"titleEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"titleBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bodyEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bodyBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ContentStatus","nativeType":null,"default":"DRAFT","isGenerated":false,"isUpdatedAt":false},{"name":"publishedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"WebsiteSection":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"key","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"locale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"draftContent","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"publishedContent","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"publishedAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"updatedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["key","locale"]],"uniqueIndexes":[{"name":null,"fields":["key","locale"]}],"isGenerated":false,"documentation":"Draft and published content are stored separately so editing never changes the\\\\npublic site until publication. One row per (key, locale)."},"WebsiteSetting":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"key","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"group","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isPublic","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"updatedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false,"documentation":"Key/value settings grouped by purpose: contact, qr, social, seo, program.\\\\nisPublic controls whether the value may be returned by public endpoints."},"Faq":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"questionEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"answerEn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"questionBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"answerBn","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"general","isGenerated":false,"isUpdatedAt":false},{"name":"sortOrder","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"isPublished","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"MediaAsset":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"bucket","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"objectKey","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"fileName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"mimeType","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sizeBytes","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"visibility","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"AssetVisibility","nativeType":null,"default":"PRIVATE","isGenerated":false,"isUpdatedAt":false},{"name":"altText","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"uploadedById","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"uploadedBy","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"MediaAssetToUser","relationFromFields":["uploadedById"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false},{"name":"materials","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LearningMaterial","nativeType":null,"relationName":"LearningMaterialToMediaAsset","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"alumniPhotos","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniProfile","nativeType":null,"relationName":"AlumniProfileToMediaAsset","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"storyImages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AlumniStory","nativeType":null,"relationName":"AlumniStoryToMediaAsset","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["bucket","objectKey"]],"uniqueIndexes":[{"name":null,"fields":["bucket","objectKey"]}],"isGenerated":false,"documentation":"Metadata for objects held in external storage (Supabase Storage). Binaries are never stored here."},"ContactMessage":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"subject","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":"general","isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"isRead","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"readAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ContactMessageToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Notification":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"body","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"link","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"readAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":["Timestamptz",["3"]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"NotificationToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AuditLog":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":["Uuid",[]],"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"actorId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":["Uuid",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"entityType","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"entityId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"metadata","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"ipAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":["Timestamptz",["3"]],"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"actor","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AuditLogToUser","relationFromFields":["actorId"],"relationToFields":["id"],"relationOnDelete":"SetNull","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{"ContentStatus":{"values":[{"name":"DRAFT","dbName":null},{"name":"PUBLISHED","dbName":null},{"name":"ARCHIVED","dbName":null}],"dbName":null},"ApplicationStatus":{"values":[{"name":"SUBMITTED","dbName":null},{"name":"UNDER_REVIEW","dbName":null},{"name":"SHORTLISTED","dbName":null},{"name":"ACCEPTED","dbName":null},{"name":"REJECTED","dbName":null},{"name":"WAITLISTED","dbName":null}],"dbName":null},"StudentStatus":{"values":[{"name":"ACTIVE","dbName":null},{"name":"INACTIVE","dbName":null},{"name":"GRADUATED","dbName":null},{"name":"WITHDRAWN","dbName":null}],"dbName":null},"BatchStatus":{"values":[{"name":"PLANNED","dbName":null},{"name":"ACTIVE","dbName":null},{"name":"COMPLETED","dbName":null},{"name":"CANCELLED","dbName":null}],"dbName":null},"EnrollmentStatus":{"values":[{"name":"ACTIVE","dbName":null},{"name":"COMPLETED","dbName":null},{"name":"WITHDRAWN","dbName":null}],"dbName":null},"AttendanceStatus":{"values":[{"name":"PRESENT","dbName":null},{"name":"ABSENT","dbName":null},{"name":"LATE","dbName":null},{"name":"EXCUSED","dbName":null}],"dbName":null},"CertificateStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"APPROVED","dbName":null},{"name":"ISSUED","dbName":null},{"name":"REVOKED","dbName":null}],"dbName":null},"CompanyStatus":{"values":[{"name":"PROSPECT","dbName":null},{"name":"ACTIVE","dbName":null},{"name":"INACTIVE","dbName":null}],"dbName":null},"InquiryStatus":{"values":[{"name":"NEW","dbName":null},{"name":"IN_REVIEW","dbName":null},{"name":"CONTACTED","dbName":null},{"name":"CLOSED","dbName":null}],"dbName":null},"OpportunityType":{"values":[{"name":"INTERNSHIP","dbName":null},{"name":"JOB","dbName":null},{"name":"TRAINING","dbName":null},{"name":"PROJECT","dbName":null},{"name":"MENTORING","dbName":null},{"name":"OTHER","dbName":null}],"dbName":null},"OpportunityAudience":{"values":[{"name":"STUDENTS","dbName":null},{"name":"ALUMNI","dbName":null},{"name":"ALL","dbName":null}],"dbName":null},"OpportunityStatus":{"values":[{"name":"DRAFT","dbName":null},{"name":"PUBLISHED","dbName":null},{"name":"CLOSED","dbName":null}],"dbName":null},"ReviewStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"APPROVED","dbName":null},{"name":"REJECTED","dbName":null}],"dbName":null},"AlumniVerification":{"values":[{"name":"PENDING","dbName":null},{"name":"VERIFIED","dbName":null},{"name":"REJECTED","dbName":null}],"dbName":null},"PublicationStatus":{"values":[{"name":"NOT_SUBMITTED","dbName":null},{"name":"PENDING","dbName":null},{"name":"APPROVED","dbName":null},{"name":"REJECTED","dbName":null}],"dbName":null},"StoryStatus":{"values":[{"name":"SUBMITTED","dbName":null},{"name":"PUBLISHED","dbName":null},{"name":"REJECTED","dbName":null},{"name":"ARCHIVED","dbName":null}],"dbName":null},"AssetVisibility":{"values":[{"name":"PUBLIC","dbName":null},{"name":"PRIVATE","dbName":null}],"dbName":null}},"types":{}}');
    defineDmmfProperty2(exports2.Prisma, config.runtimeDataModel);
    config.engineWasm = void 0;
    config.compilerWasm = void 0;
    var { warnEnvConflicts: warnEnvConflicts2 } = require_library();
    warnEnvConflicts2({
      rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
      schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
    });
    var PrismaClient2 = getPrismaClient2(config);
    exports2.PrismaClient = PrismaClient2;
    Object.assign(exports2, Prisma12);
    path.join(__dirname, "query_engine-windows.dll.node");
    path.join(process.cwd(), "generated/prisma/query_engine-windows.dll.node");
    path.join(__dirname, "libquery_engine-rhel-openssl-3.0.x.so.node");
    path.join(process.cwd(), "generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node");
    path.join(__dirname, "schema.prisma");
    path.join(process.cwd(), "generated/prisma/schema.prisma");
  }
});

// src/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);

// src/app.ts
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_express10 = __toESM(require("express"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_pino_http = require("pino-http");

// src/config/env.ts
var import_zod = require("zod");
function deploymentOrigins() {
  const hosts = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(
    (host) => Boolean(host)
  );
  return [...new Set(hosts.map((host) => `https://${host}`))];
}
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}
var origins = deploymentOrigins();
var localOrigin = (value) => !value || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(value);
if (origins.length > 0) {
  const primary = process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : origins[0];
  if (localOrigin(process.env.WEB_ORIGIN)) process.env.WEB_ORIGIN = origins.join(",");
  if (localOrigin(process.env.APP_URL)) process.env.APP_URL = primary;
  if (!process.env.TRUST_PROXY || process.env.TRUST_PROXY === "0") process.env.TRUST_PROXY = "1";
}
var schema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  PORT: import_zod.z.coerce.number().int().positive().default(5e3),
  WEB_ORIGIN: import_zod.z.string().default("http://localhost:5173"),
  APP_URL: import_zod.z.string().url().default("http://localhost:5173"),
  DATABASE_URL: import_zod.z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: import_zod.z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_TTL_HOURS: import_zod.z.coerce.number().positive().default(72),
  COOKIE_SAMESITE: import_zod.z.enum(["lax", "strict", "none"]).default("lax"),
  /** Number of reverse proxies in front of the API (needed for correct client IPs and rate limits). */
  TRUST_PROXY: import_zod.z.coerce.number().int().min(0).max(5).default(0),
  STORAGE_URL: import_zod.z.string().optional().default(""),
  STORAGE_SERVICE_KEY: import_zod.z.string().optional().default(""),
  STORAGE_PUBLIC_BUCKET: import_zod.z.string().default("public-media"),
  STORAGE_PRIVATE_BUCKET: import_zod.z.string().default("private-files"),
  EMAIL_PROVIDER_API_KEY: import_zod.z.string().optional().default(""),
  EMAIL_FROM: import_zod.z.string().optional().default(""),
  LOG_LEVEL: import_zod.z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info")
});
var parsed = schema.safeParse(process.env);
var envError = parsed.success ? null : parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
var fallback = {
  NODE_ENV: "production",
  PORT: "5000",
  WEB_ORIGIN: "http://localhost:5173",
  APP_URL: "http://localhost:5173",
  DATABASE_URL: "postgresql://invalid:invalid@127.0.0.1:5432/invalid",
  SESSION_SECRET: "x".repeat(32),
  SESSION_TTL_HOURS: "72",
  COOKIE_SAMESITE: "lax",
  TRUST_PROXY: "1",
  LOG_LEVEL: "silent"
};
var env = parsed.success ? parsed.data : schema.parse(fallback);
var isProduction = env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
var isTest = env.NODE_ENV === "test";
var allowedOrigins = [
  .../* @__PURE__ */ new Set([...env.WEB_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean), ...deploymentOrigins()])
];
var storageConfigured = Boolean(env.STORAGE_URL && env.STORAGE_SERVICE_KEY);

// src/lib/logger.ts
var import_pino = __toESM(require("pino"), 1);
var logger = (0, import_pino.default)({
  level: isTest ? "silent" : env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'req.headers["x-csrf-token"]',
      'res.headers["set-cookie"]',
      "*.password",
      "*.token",
      "*.passwordHash"
    ],
    censor: "[redacted]"
  },
  ...isProduction || isTest ? {} : { transport: { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss" } } }
});

// src/services/auth.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/lib/prisma-engine.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_node_os = require("node:os");
var engineName = (0, import_node_os.platform)() === "win32" ? "query_engine-windows.dll.node" : (0, import_node_os.platform)() === "darwin" ? "libquery_engine-darwin-arm64.dylib.node" : "libquery_engine-rhel-openssl-3.0.x.so.node";
var directories = [
  (0, import_node_path.join)(process.cwd(), "query-engine"),
  (0, import_node_path.join)(process.cwd(), "backend/query-engine"),
  (0, import_node_path.join)(process.cwd(), "generated/prisma"),
  (0, import_node_path.join)(process.cwd(), "backend/generated/prisma")
];
if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  for (const directory2 of directories) {
    const engine = (0, import_node_path.join)(directory2, engineName);
    if ((0, import_node_fs.existsSync)(engine)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = engine;
      break;
    }
  }
}

// src/lib/prisma.ts
var import_prisma = __toESM(require_prisma(), 1);
var import_prisma2 = __toESM(require_prisma(), 1);
function unavailable(message) {
  return new Proxy({}, {
    get(_target, property) {
      if (property === "then") return void 0;
      throw new Error(message);
    }
  });
}
function createClient() {
  if (envError) return unavailable(envError);
  try {
    return new import_prisma.PrismaClient({ log: isProduction ? ["error"] : ["warn", "error"] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database client failed to start";
    console.error(message);
    return unavailable(message);
  }
}
var prisma = createClient();

// src/utils/crypto.ts
var import_node_crypto = require("node:crypto");
var randomToken = (bytes = 32) => (0, import_node_crypto.randomBytes)(bytes).toString("base64url");
var hashToken = (token) => (0, import_node_crypto.createHmac)("sha256", env.SESSION_SECRET).update(token).digest("hex");
function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && (0, import_node_crypto.timingSafeEqual)(ab, bb);
}
var REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function referenceCode(prefix, length = 8) {
  const bytes = (0, import_node_crypto.randomBytes)(length);
  let out = "";
  for (const b of bytes) out += REF_ALPHABET[b % REF_ALPHABET.length];
  return `${prefix}-${(/* @__PURE__ */ new Date()).getUTCFullYear()}-${out}`;
}

// src/utils/http.ts
var import_zod2 = require("zod");
var ApiError = class _ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
  status;
  code;
  details;
  static badRequest(message = "Bad request", details) {
    return new _ApiError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Authentication required") {
    return new _ApiError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "You do not have permission to perform this action") {
    return new _ApiError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Resource not found") {
    return new _ApiError(404, "NOT_FOUND", message);
  }
  static conflict(message = "Conflict", code = "CONFLICT") {
    return new _ApiError(409, code, message);
  }
  static unavailable(message = "Service unavailable", code = "SERVICE_UNAVAILABLE") {
    return new _ApiError(503, code, message);
  }
};
function ok(res, data, meta, status = 200) {
  return res.status(status).json(meta ? { data, meta } : { data });
}
function created(res, data) {
  return ok(res, data, void 0, 201);
}
function noContent(res) {
  return res.status(204).end();
}
function parse(schema2, input) {
  const result = schema2.safeParse(input);
  if (!result.success) {
    throw new ApiError(
      422,
      "VALIDATION_ERROR",
      "Validation failed",
      result.error.issues.map((i) => ({ path: i.path.join("."), code: i.code, message: i.message }))
    );
  }
  return result.data;
}
var body = (req, schema2) => parse(schema2, req.body ?? {});
var uuidParam = import_zod2.z.object({ id: import_zod2.z.string().uuid() });
var idParam = (req) => {
  const result = uuidParam.safeParse(req.params);
  if (!result.success) throw ApiError.notFound();
  return result.data.id;
};
var paginationSchema = import_zod2.z.object({
  page: import_zod2.z.coerce.number().int().min(1).max(1e4).default(1),
  pageSize: import_zod2.z.coerce.number().int().min(1).max(100).default(20),
  q: import_zod2.z.string().trim().max(200).optional(),
  sort: import_zod2.z.string().max(50).optional(),
  order: import_zod2.z.enum(["asc", "desc"]).default("desc")
});
function pageArgs(p) {
  return { skip: (p.page - 1) * p.pageSize, take: p.pageSize };
}
function pageMeta(p, total) {
  return { page: p.page, pageSize: p.pageSize, total, totalPages: Math.max(1, Math.ceil(total / p.pageSize)) };
}
function orderBy(p, allowed, fallback2 = "createdAt") {
  const field = p.sort && allowed.includes(p.sort) ? p.sort : fallback2;
  return { [field]: p.order };
}
var optionalText = (max) => import_zod2.z.string().trim().max(max).optional().nullable().transform((v) => v ? v : null);
var optionalUrl = import_zod2.z.string().trim().max(500).optional().nullable().refine((v) => !v || /^https?:\/\//i.test(v), "Must be an http(s) URL").transform((v) => v ? v : null);
var email = import_zod2.z.string().trim().toLowerCase().email().max(254);

// src/services/auth.service.ts
var BCRYPT_ROUNDS = 12;
var DUMMY_HASH = import_bcryptjs.default.hashSync("timing-equaliser-not-a-password", BCRYPT_ROUNDS);
var hashPassword = (password2) => import_bcryptjs.default.hash(password2, BCRYPT_ROUNDS);
async function verifyCredentials(email2, password2) {
  const user = await prisma.user.findUnique({ where: { email: email2.toLowerCase() } });
  const valid = await import_bcryptjs.default.compare(password2, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !valid || !user.isActive) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  return user;
}
async function createSession(userId, meta) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 36e5);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      ipAddress: meta.ip?.slice(0, 64),
      userAgent: meta.userAgent?.slice(0, 300)
    }
  });
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: /* @__PURE__ */ new Date() } });
  return { token, expiresAt };
}
async function resolveSession(token) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      }
    }
  });
  if (!session || session.revokedAt || session.expiresAt < /* @__PURE__ */ new Date() || !session.user.isActive) return null;
  if (Date.now() - session.lastSeenAt.getTime() > 5 * 6e4) {
    await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: /* @__PURE__ */ new Date() } });
  }
  const permissions = /* @__PURE__ */ new Set();
  for (const ur of session.user.roles) for (const rp of ur.role.permissions) permissions.add(rp.permission.key);
  return {
    id: session.user.id,
    sessionId: session.id,
    email: session.user.email,
    fullName: session.user.fullName,
    roles: session.user.roles.map((r) => r.role.key),
    permissions
  };
}
var revokeSession = (sessionId) => prisma.session.update({ where: { id: sessionId }, data: { revokedAt: /* @__PURE__ */ new Date() } });
var revokeAllSessions = (userId) => prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: /* @__PURE__ */ new Date() } });
async function createPasswordToken(userId, purpose, ttlHours) {
  const token = randomToken(32);
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: /* @__PURE__ */ new Date() }
  });
  await prisma.passwordResetToken.create({
    data: { userId, purpose, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + ttlHours * 36e5) }
  });
  return token;
}
async function consumePasswordToken(token, newPassword) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt < /* @__PURE__ */ new Date()) {
    throw new ApiError(400, "INVALID_TOKEN", "This link is invalid or has expired");
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: /* @__PURE__ */ new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: /* @__PURE__ */ new Date() } })
  ]);
  return record.userId;
}
var passwordSchemaRules = { min: 10, max: 128 };

// src/middleware/auth.ts
var SESSION_COOKIE = "bi_session";
var sessionCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction || env.COOKIE_SAMESITE === "none",
  sameSite: env.COOKIE_SAMESITE,
  path: "/",
  maxAge: env.SESSION_TTL_HOURS * 36e5
});
async function loadSession(req, _res, next) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string" && token.length > 0 && token.length < 200) {
    req.auth = await resolveSession(token) ?? void 0;
  }
  next();
}
function requireAuth(req, _res, next) {
  if (!req.auth) throw ApiError.unauthorized();
  next();
}
var hasPermission = (req, permission) => Boolean(req.auth?.permissions.has(permission));
var requirePermission = (...permissions) => (req, _res, next) => {
  if (!req.auth) throw ApiError.unauthorized();
  if (!permissions.some((p) => req.auth.permissions.has(p))) throw ApiError.forbidden();
  next();
};
function currentUser(req) {
  if (!req.auth) throw ApiError.unauthorized();
  return req.auth;
}

// src/middleware/csrf.ts
var CSRF_COOKIE = "bi_csrf";
var SAFE_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
function issueCsrfToken(req, res) {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token = typeof existing === "string" && existing.length >= 32 ? existing : randomToken(24);
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: isProduction || env.COOKIE_SAMESITE === "none",
    sameSite: env.COOKIE_SAMESITE,
    path: "/"
  });
  return token;
}
function csrfProtection(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) throw new ApiError(403, "CSRF_ORIGIN", "Origin not allowed");
  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get("x-csrf-token");
  if (typeof cookie !== "string" || !header || !safeEqual(cookie, header)) {
    throw new ApiError(403, "CSRF_INVALID", "Invalid or missing CSRF token");
  }
  next();
}

// src/middleware/errorHandler.ts
var import_multer = require("multer");
var notFoundHandler = (req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found", requestId: req.id } });
};
var errorHandler = (err, req, res, _next) => {
  let error;
  if (err instanceof ApiError) {
    error = err;
  } else if (err instanceof import_prisma2.Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") error = ApiError.conflict("A record with these details already exists", "DUPLICATE");
    else if (err.code === "P2025") error = ApiError.notFound();
    else if (err.code === "P2003") error = ApiError.conflict("This record is referenced by other records", "IN_USE");
    else error = new ApiError(500, "INTERNAL_ERROR", "An unexpected error occurred");
  } else if (err instanceof import_multer.MulterError) {
    error = ApiError.badRequest(err.code === "LIMIT_FILE_SIZE" ? "File is too large" : "Invalid upload");
  } else if (err?.type === "entity.parse.failed") {
    error = ApiError.badRequest("Malformed JSON body");
  } else if (err?.type === "entity.too.large") {
    error = new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
  } else {
    error = new ApiError(500, "INTERNAL_ERROR", "An unexpected error occurred");
  }
  if (error.status >= 500) logger.error({ err, requestId: req.id }, "Unhandled error");
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...error.details !== void 0 ? { details: error.details } : {},
      requestId: req.id,
      ...!isProduction && error.status >= 500 && err instanceof Error ? { debug: err.message } : {}
    }
  });
};

// src/middleware/rateLimit.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var handler = (req, res) => {
  res.status(429).json({
    error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later.", requestId: req.id }
  });
};
var make = (windowMs, limit) => (0, import_express_rate_limit.default)({ windowMs, limit, standardHeaders: "draft-8", legacyHeaders: false, handler, skip: () => isTest });
var globalLimiter = make(15 * 6e4, 600);
var authLimiter = make(15 * 6e4, 20);
var formLimiter = make(10 * 6e4, 10);

// src/middleware/requestId.ts
var import_node_crypto2 = require("node:crypto");
var VALID_ID = /^[A-Za-z0-9._-]{8,64}$/;
function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && VALID_ID.test(incoming) ? incoming : (0, import_node_crypto2.randomUUID)();
  res.setHeader("X-Request-Id", req.id);
  next();
}

// src/routes/index.ts
var import_express9 = require("express");

// src/routes/admin.routes.ts
var import_express = require("express");

// src/config/permissions.ts
var P = {
  dashboardView: "dashboard.view",
  usersManage: "users.manage",
  rolesManage: "roles.manage",
  coursesManage: "courses.manage",
  applicationsManage: "applications.manage",
  studentsManage: "students.manage",
  trainingManage: "training.manage",
  trainingTeach: "training.teach",
  certificatesManage: "certificates.manage",
  companiesManage: "companies.manage",
  contactManage: "contact.manage",
  cmsEdit: "cms.edit",
  cmsPublish: "cms.publish",
  faqsManage: "faqs.manage",
  settingsManage: "settings.manage",
  auditRead: "audit.read",
  alumniManage: "alumni.manage",
  studentSelf: "student.self",
  alumniSelf: "alumni.self"
};
var ALL_PERMISSIONS = Object.values(P);

// src/services/audit.service.ts
async function audit(req, entry, tx = prisma) {
  try {
    await tx.auditLog.create({
      data: {
        actorId: req.auth?.id ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        metadata: entry.metadata ?? void 0,
        ipAddress: req.ip?.slice(0, 64)
      }
    });
  } catch (error) {
    if (tx !== prisma) throw error;
    logger.error({ err: error, action: entry.action }, "Failed to write audit log");
  }
}

// src/services/email.service.ts
var emailConfigured = () => Boolean(env.EMAIL_PROVIDER_API_KEY && env.EMAIL_FROM);
async function sendEmail(message) {
  if (!emailConfigured()) {
    if (!isProduction && !isTest) {
      logger.info({ to: message.to, subject: message.subject }, `[email:not-configured]
${message.text}`);
    } else if (isProduction) {
      logger.warn({ subject: message.subject }, "Email provider not configured; message not sent");
    }
    return false;
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.EMAIL_PROVIDER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [message.to], subject: message.subject, text: message.text })
    });
    if (!response.ok) {
      const detail = await response.text();
      logger.error({ status: response.status, detail }, "Email provider rejected message");
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ err: error }, "Email delivery failed");
    return false;
  }
}

// src/services/user.service.ts
async function buildMe(auth) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: auth.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      preferredLocale: true,
      studentProfile: { select: { id: true, studentCode: true, status: true } },
      alumniProfile: { select: { id: true, slug: true, verificationStatus: true } },
      alumniRequests: { select: { id: true, status: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 }
    }
  });
  const { alumniRequests, ...rest } = user;
  return {
    ...rest,
    roles: auth.roles,
    permissions: [...auth.permissions].sort(),
    latestAlumniRequest: alumniRequests[0] ?? null
  };
}
async function inviteUser(userId, emailAddress, fullName) {
  const token = await createPasswordToken(userId, "invite", 72);
  const link = `${env.APP_URL.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(token)}&invite=1`;
  const sent = await sendEmail({
    to: emailAddress,
    subject: "Your account at The Bridge Institute",
    text: `Hello ${fullName},

An account has been created for you at The Bridge Institute. Set your password using this link (valid for 72 hours):

${link}

If you were not expecting this message you can ignore it.`
  });
  return { emailSent: sent, inviteUrl: sent ? null : link };
}

// src/validators/admin.validators.ts
var import_zod3 = require("zod");
var uuid = import_zod3.z.string().uuid();
var optionalUuid = uuid.optional().nullable().transform((v) => v ?? null);
var optionalDate = import_zod3.z.coerce.date().optional().nullable().transform((v) => v ?? null);
var sortOrder = import_zod3.z.coerce.number().int().min(0).max(1e4);
var roleKey = import_zod3.z.string().regex(/^[A-Z][A-Z0-9_]{1,40}$/);
var createUserSchema = import_zod3.z.object({
  fullName: import_zod3.z.string().trim().min(2).max(120),
  email,
  phone: optionalText(30),
  roleKeys: import_zod3.z.array(roleKey).max(10).default([])
});
var updateUserSchema = import_zod3.z.object({
  fullName: import_zod3.z.string().trim().min(2).max(120),
  phone: optionalText(30),
  isActive: import_zod3.z.boolean(),
  roleKeys: import_zod3.z.array(roleKey).max(10)
}).partial();
var userFilterSchema = import_zod3.z.object({
  role: roleKey.optional(),
  isActive: import_zod3.z.enum(["true", "false"]).optional()
});
var createRoleSchema = import_zod3.z.object({
  key: roleKey,
  name: import_zod3.z.string().trim().min(2).max(80),
  description: optionalText(300),
  permissions: import_zod3.z.array(import_zod3.z.string().max(60)).max(100).default([])
});
var rolePermissionsSchema = import_zod3.z.object({ permissions: import_zod3.z.array(import_zod3.z.string().max(60)).max(100) });
var translation = import_zod3.z.object({
  title: import_zod3.z.string().trim().min(2).max(160),
  summary: import_zod3.z.string().trim().min(2).max(500),
  description: import_zod3.z.string().trim().min(2).max(1e4),
  duration: optionalText(80)
});
var bilingualItem = import_zod3.z.object({ en: import_zod3.z.string().trim().min(1).max(300), bn: optionalText(300) });
var courseSchema = import_zod3.z.object({
  slug: import_zod3.z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens").max(80).optional(),
  icon: import_zod3.z.string().trim().regex(/^[a-z0-9-]{1,40}$/).default("book-open"),
  categoryId: optionalUuid,
  sortOrder: sortOrder.default(0),
  translations: import_zod3.z.object({ en: translation, bn: translation.optional() }),
  topics: import_zod3.z.array(bilingualItem).max(50).default([]),
  outcomes: import_zod3.z.array(bilingualItem).max(50).default([])
});
var courseUpdateSchema = import_zod3.z.object({
  slug: courseSchema.shape.slug,
  icon: import_zod3.z.string().trim().regex(/^[a-z0-9-]{1,40}$/),
  categoryId: optionalUuid,
  sortOrder,
  translations: import_zod3.z.object({ en: translation.optional(), bn: translation.optional() }),
  topics: import_zod3.z.array(bilingualItem).max(50),
  outcomes: import_zod3.z.array(bilingualItem).max(50)
}).partial();
var courseStatusSchema = import_zod3.z.object({ status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]) });
var reorderSchema = import_zod3.z.object({ ids: import_zod3.z.array(uuid).min(1).max(200) });
var categorySchema = import_zod3.z.object({
  slug: import_zod3.z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  nameEn: import_zod3.z.string().trim().min(2).max(120),
  nameBn: optionalText(120),
  sortOrder: sortOrder.default(0)
});
var materialSchema = import_zod3.z.object({
  courseId: uuid,
  title: import_zod3.z.string().trim().min(2).max(200),
  description: optionalText(2e3),
  url: optionalUrl,
  assetId: optionalUuid,
  isPublished: import_zod3.z.boolean().default(false),
  sortOrder: sortOrder.default(0)
});
var materialFilterSchema = import_zod3.z.object({ courseId: uuid.optional() });
var applicationStatus = import_zod3.z.enum(["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "WAITLISTED"]);
var applicationFilterSchema = import_zod3.z.object({ status: applicationStatus.optional() });
var applicationStatusSchema = import_zod3.z.object({ status: applicationStatus, note: optionalText(2e3) });
var noteSchema = import_zod3.z.object({ body: import_zod3.z.string().trim().min(1).max(5e3) });
var studentUpdateSchema = import_zod3.z.object({
  status: import_zod3.z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "WITHDRAWN"]),
  educationLevel: optionalText(120),
  currentStatus: optionalText(120)
}).partial();
var studentSelfUpdateSchema = import_zod3.z.object({ educationLevel: optionalText(120), currentStatus: optionalText(120) }).partial();
var studentFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "WITHDRAWN"]).optional() });
var batchStatus = import_zod3.z.enum(["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"]);
var batchBase = {
  code: import_zod3.z.string().trim().regex(/^[A-Za-z0-9-]{2,40}$/),
  name: import_zod3.z.string().trim().min(2).max(160),
  courseId: optionalUuid,
  startDate: optionalDate,
  endDate: optionalDate,
  capacity: import_zod3.z.coerce.number().int().min(1).max(1e4).optional().nullable().transform((v) => v ?? null),
  status: batchStatus.default("PLANNED")
};
var batchSchema = import_zod3.z.object(batchBase);
var batchUpdateSchema = import_zod3.z.object({ ...batchBase, status: batchStatus }).partial();
var batchTeachersSchema = import_zod3.z.object({ userIds: import_zod3.z.array(uuid).max(20) });
var batchFilterSchema = import_zod3.z.object({ status: batchStatus.optional(), courseId: uuid.optional() });
var enrollmentSchema = import_zod3.z.object({ studentId: uuid, batchId: uuid });
var enrollmentUpdateSchema = import_zod3.z.object({ status: import_zod3.z.enum(["ACTIVE", "COMPLETED", "WITHDRAWN"]), progress: import_zod3.z.coerce.number().int().min(0).max(100) }).partial();
var enrollmentFilterSchema = import_zod3.z.object({ batchId: uuid.optional(), studentId: uuid.optional() });
var attendanceQuerySchema = import_zod3.z.object({ batchId: uuid, date: import_zod3.z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
var attendanceSaveSchema = import_zod3.z.object({
  batchId: uuid,
  date: import_zod3.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  records: import_zod3.z.array(import_zod3.z.object({ enrollmentId: uuid, status: import_zod3.z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]), note: optionalText(500) })).max(500)
});
var assessmentSchema = import_zod3.z.object({
  batchId: uuid,
  title: import_zod3.z.string().trim().min(2).max(200),
  type: import_zod3.z.enum(["assignment", "quiz", "exam", "project", "practical"]).default("assignment"),
  maxScore: import_zod3.z.coerce.number().int().min(1).max(1e3).default(100),
  dueDate: optionalDate
});
var assessmentUpdateSchema = assessmentSchema.omit({ batchId: true }).partial();
var assessmentFilterSchema = import_zod3.z.object({ batchId: uuid.optional() });
var resultsQuerySchema = import_zod3.z.object({ assessmentId: uuid });
var resultsSaveSchema = import_zod3.z.object({
  assessmentId: uuid,
  records: import_zod3.z.array(import_zod3.z.object({ enrollmentId: uuid, score: import_zod3.z.coerce.number().min(0).max(1e3), feedback: optionalText(2e3) })).max(500)
});
var certificateCreateSchema = import_zod3.z.object({ enrollmentId: uuid, notes: optionalText(1e3) });
var certificateActionSchema = import_zod3.z.object({ notes: optionalText(1e3) });
var certificateFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["PENDING", "APPROVED", "ISSUED", "REVOKED"]).optional() });
var companyBase = {
  name: import_zod3.z.string().trim().min(2).max(160),
  website: optionalUrl,
  industry: optionalText(120),
  contactName: optionalText(120),
  contactEmail: email.optional().nullable().transform((v) => v ?? null),
  phone: optionalText(30),
  notes: optionalText(5e3),
  status: import_zod3.z.enum(["PROSPECT", "ACTIVE", "INACTIVE"]).default("PROSPECT")
};
var companySchema = import_zod3.z.object({ ...companyBase, listedPublicly: import_zod3.z.boolean().default(false) });
var companyUpdateSchema = import_zod3.z.object({ ...companyBase, status: import_zod3.z.enum(["PROSPECT", "ACTIVE", "INACTIVE"]), listedPublicly: import_zod3.z.boolean() }).partial();
var companyFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["PROSPECT", "ACTIVE", "INACTIVE"]).optional() });
var inquiryUpdateSchema = import_zod3.z.object({ status: import_zod3.z.enum(["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"]), companyId: optionalUuid }).partial();
var inquiryFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"]).optional() });
var interactionSchema = import_zod3.z.object({
  type: import_zod3.z.enum(["note", "call", "email", "meeting"]).default("note"),
  note: import_zod3.z.string().trim().min(1).max(5e3)
});
var opportunityBase = {
  companyId: optionalUuid,
  title: import_zod3.z.string().trim().min(2).max(200),
  type: import_zod3.z.enum(["INTERNSHIP", "JOB", "TRAINING", "PROJECT", "MENTORING", "OTHER"]).default("OTHER"),
  description: import_zod3.z.string().trim().min(10).max(1e4),
  location: optionalText(160),
  applyUrl: optionalUrl,
  deadline: optionalDate,
  audience: import_zod3.z.enum(["STUDENTS", "ALUMNI", "ALL"]).default("ALL"),
  status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).default("DRAFT")
};
var opportunitySchema = import_zod3.z.object(opportunityBase);
var opportunityUpdateSchema = import_zod3.z.object({
  ...opportunityBase,
  type: import_zod3.z.enum(["INTERNSHIP", "JOB", "TRAINING", "PROJECT", "MENTORING", "OTHER"]),
  audience: import_zod3.z.enum(["STUDENTS", "ALUMNI", "ALL"]),
  status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "CLOSED"])
}).partial();
var opportunityFilterSchema = import_zod3.z.object({
  status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
  audience: import_zod3.z.enum(["STUDENTS", "ALUMNI", "ALL"]).optional()
});
var contactFilterSchema = import_zod3.z.object({
  isRead: import_zod3.z.enum(["true", "false"]).optional(),
  category: import_zod3.z.enum(["general", "admission", "partnership", "alumni-assistance"]).optional()
});
var contactUpdateSchema = import_zod3.z.object({ isRead: import_zod3.z.boolean() });
var faqBase = {
  questionEn: import_zod3.z.string().trim().min(5).max(300),
  answerEn: import_zod3.z.string().trim().min(5).max(5e3),
  questionBn: optionalText(300),
  answerBn: optionalText(5e3),
  category: import_zod3.z.string().trim().regex(/^[a-z0-9-]{1,40}$/).default("general"),
  sortOrder: sortOrder.default(0),
  isPublished: import_zod3.z.boolean().default(false)
};
var faqSchema = import_zod3.z.object(faqBase);
var faqUpdateSchema = import_zod3.z.object({ ...faqBase, category: import_zod3.z.string().trim().regex(/^[a-z0-9-]{1,40}$/), sortOrder, isPublished: import_zod3.z.boolean() }).partial();
var sectionKey = import_zod3.z.string().regex(/^[a-z][a-z0-9-]{1,40}$/);
var jsonValue = import_zod3.z.lazy(
  () => import_zod3.z.union([import_zod3.z.string().max(1e4), import_zod3.z.number(), import_zod3.z.boolean(), import_zod3.z.null(), import_zod3.z.array(jsonValue).max(100), import_zod3.z.record(import_zod3.z.string().max(60), jsonValue)])
);
var sectionContentSchema = import_zod3.z.object({ content: import_zod3.z.record(import_zod3.z.string().max(60), jsonValue) });
var auditFilterSchema = import_zod3.z.object({
  entityType: import_zod3.z.string().max(60).optional(),
  action: import_zod3.z.string().max(80).optional(),
  actorId: uuid.optional()
});
var cohortBase = {
  slug: import_zod3.z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  name: import_zod3.z.string().trim().min(2).max(160),
  graduationYear: import_zod3.z.coerce.number().int().min(2e3).max(2100).optional().nullable().transform((v) => v ?? null),
  courseId: optionalUuid,
  description: optionalText(2e3)
};
var cohortSchema = import_zod3.z.object(cohortBase);
var cohortUpdateSchema = import_zod3.z.object(cohortBase).partial();
var announcementBase = {
  titleEn: import_zod3.z.string().trim().min(2).max(200),
  titleBn: optionalText(200),
  bodyEn: import_zod3.z.string().trim().min(2).max(1e4),
  bodyBn: optionalText(1e4),
  status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT")
};
var announcementSchema = import_zod3.z.object(announcementBase);
var announcementUpdateSchema = import_zod3.z.object({ ...announcementBase, status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]) }).partial();
var announcementFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional() });
var reviewDecisionSchema = import_zod3.z.object({ note: optionalText(2e3) });
var reviewFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["PENDING", "APPROVED", "REJECTED"]).optional() });
var profileFilterSchema = import_zod3.z.object({
  verificationStatus: import_zod3.z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
  publicationStatus: import_zod3.z.enum(["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"]).optional(),
  archived: import_zod3.z.enum(["true", "false"]).optional()
});
var storyFilterSchema = import_zod3.z.object({ status: import_zod3.z.enum(["SUBMITTED", "PUBLISHED", "REJECTED", "ARCHIVED"]).optional() });
var adminProfileUpdateSchema = import_zod3.z.object({
  displayName: import_zod3.z.string().trim().min(2).max(120),
  cohortId: optionalUuid,
  courseId: optionalUuid,
  graduationYear: cohortBase.graduationYear,
  programName: optionalText(160)
}).partial();
var adminStoryUpdateSchema = import_zod3.z.object({
  titleEn: optionalText(200),
  titleBn: optionalText(200),
  excerptEn: optionalText(500),
  excerptBn: optionalText(500),
  bodyEn: optionalText(2e4),
  bodyBn: optionalText(2e4)
}).partial();

// src/controllers/users.controller.ts
var userSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  roles: { select: { role: { select: { key: true, name: true } } } }
};
var shapeUser = (u) => ({
  ...u,
  roles: u.roles.map((r) => r.role)
});
async function resolveRoles(req, roleKeys) {
  const roles = await prisma.role.findMany({ where: { key: { in: roleKeys } } });
  if (roles.length !== new Set(roleKeys).size) throw ApiError.badRequest("One or more roles do not exist");
  if (roleKeys.includes("SUPER_ADMIN") && !currentUser(req).roles.includes("SUPER_ADMIN")) {
    throw ApiError.forbidden("Only a Super Admin can grant the Super Admin role");
  }
  return roles;
}
async function listUsers(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(userFilterSchema, req.query);
  const where = {
    ...f.role ? { roles: { some: { role: { key: f.role } } } } : {},
    ...f.isActive ? { isActive: f.isActive === "true" } : {},
    ...p.q ? { OR: [{ fullName: { contains: p.q, mode: "insensitive" } }, { email: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: orderBy(p, ["createdAt", "fullName", "email", "lastLoginAt"]), ...pageArgs(p) }),
    prisma.user.count({ where })
  ]);
  ok(res, items.map(shapeUser), pageMeta(p, total));
}
async function getUser(req, res) {
  const user = await prisma.user.findUnique({ where: { id: idParam(req) }, select: userSelect });
  if (!user) throw ApiError.notFound();
  ok(res, shapeUser(user));
}
async function createUser(req, res) {
  const input = body(req, createUserSchema);
  const roles = await resolveRoles(req, input.roleKeys);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      roles: { create: roles.map((r) => ({ roleId: r.id })) }
    },
    select: userSelect
  });
  const invite = await inviteUser(user.id, user.email, user.fullName);
  await audit(req, { action: "user.create", entityType: "User", entityId: user.id, metadata: { roles: input.roleKeys } });
  created(res, { user: shapeUser(user), ...invite });
}
async function updateUser(req, res) {
  const id = idParam(req);
  const actor = currentUser(req);
  const input = body(req, updateUserSchema);
  const target = await prisma.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
  if (!target) throw ApiError.notFound();
  const targetIsSuper = target.roles.some((r) => r.role.key === "SUPER_ADMIN");
  if (targetIsSuper && !actor.roles.includes("SUPER_ADMIN")) throw ApiError.forbidden("Only a Super Admin can modify a Super Admin");
  if (id === actor.id && input.isActive === false) throw ApiError.badRequest("You cannot deactivate your own account");
  if (id === actor.id && input.roleKeys && targetIsSuper && !input.roleKeys.includes("SUPER_ADMIN")) {
    throw ApiError.badRequest("You cannot remove your own Super Admin role");
  }
  const { roleKeys, ...fields } = input;
  await prisma.$transaction(async (tx) => {
    if (Object.keys(fields).length) await tx.user.update({ where: { id }, data: fields });
    if (roleKeys) {
      const roles = await resolveRoles(req, roleKeys);
      if (targetIsSuper && !roleKeys.includes("SUPER_ADMIN") && !actor.roles.includes("SUPER_ADMIN")) throw ApiError.forbidden();
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.createMany({ data: roles.map((r) => ({ userId: id, roleId: r.id })) });
    }
    if (input.isActive === false) {
      await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: /* @__PURE__ */ new Date() } });
    }
    await audit(req, { action: "user.update", entityType: "User", entityId: id, metadata: { fields: Object.keys(input), roles: roleKeys } }, tx);
  });
  const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
  ok(res, shapeUser(user));
}
async function deleteUser(req, res) {
  const id = idParam(req);
  const actor = currentUser(req);
  if (id === actor.id) throw ApiError.badRequest("You cannot delete your own account");
  const target = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      studentProfile: { select: { enrollments: { select: { id: true } } } }
    }
  });
  if (!target) throw ApiError.notFound();
  const targetIsSuper = target.roles.some((r) => r.role.key === "SUPER_ADMIN");
  if (targetIsSuper && !actor.roles.includes("SUPER_ADMIN")) {
    throw ApiError.forbidden("Only a Super Admin can delete a Super Admin");
  }
  if (targetIsSuper) {
    const otherSupers = await prisma.user.count({
      where: { id: { not: id }, roles: { some: { role: { key: "SUPER_ADMIN" } } } }
    });
    if (otherSupers === 0) throw ApiError.badRequest("The last Super Admin account cannot be deleted");
  }
  const enrollmentIds = target.studentProfile?.enrollments.map((e) => e.id) ?? [];
  await prisma.$transaction(async (tx) => {
    if (enrollmentIds.length) {
      await tx.certificate.deleteMany({ where: { enrollmentId: { in: enrollmentIds } } });
      await tx.enrollment.deleteMany({ where: { id: { in: enrollmentIds } } });
    }
    await tx.user.delete({ where: { id } });
    await audit(req, { action: "user.delete", entityType: "User", entityId: id, metadata: { email: target.email, fullName: target.fullName } }, tx);
  });
  noContent(res);
}
async function revokeUserSessions(req, res) {
  const id = idParam(req);
  await revokeAllSessions(id);
  await audit(req, { action: "user.sessions_revoked", entityType: "User", entityId: id });
  noContent(res);
}
async function resendInvite(req, res) {
  const user = await prisma.user.findUnique({ where: { id: idParam(req) } });
  if (!user) throw ApiError.notFound();
  const invite = await inviteUser(user.id, user.email, user.fullName);
  await audit(req, { action: "user.invite_sent", entityType: "User", entityId: user.id });
  ok(res, invite);
}
async function listRoles(_req, res) {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } }
  });
  ok(
    res,
    roles.map((r) => ({
      id: r.id,
      key: r.key,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      userCount: r._count.users,
      permissions: r.permissions.map((p) => p.permission.key).sort()
    }))
  );
}
async function listPermissions(_req, res) {
  ok(res, await prisma.permission.findMany({ orderBy: { key: "asc" } }));
}
async function permissionIds(keys) {
  const unknown = keys.filter((k) => !ALL_PERMISSIONS.includes(k));
  if (unknown.length) throw ApiError.badRequest(`Unknown permissions: ${unknown.join(", ")}`);
  const rows = await prisma.permission.findMany({ where: { key: { in: keys } } });
  return rows.map((r) => r.id);
}
async function createRole(req, res) {
  const input = body(req, createRoleSchema);
  const ids = await permissionIds(input.permissions);
  const role = await prisma.role.create({
    data: {
      key: input.key,
      name: input.name,
      description: input.description,
      isSystem: false,
      permissions: { create: ids.map((permissionId) => ({ permissionId })) }
    }
  });
  await audit(req, { action: "role.create", entityType: "Role", entityId: role.id, metadata: { permissions: input.permissions } });
  created(res, role);
}
async function setRolePermissions(req, res) {
  const id = idParam(req);
  const input = body(req, rolePermissionsSchema);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw ApiError.notFound();
  if (role.key === "SUPER_ADMIN") throw ApiError.badRequest("Super Admin permissions cannot be changed");
  const ids = await permissionIds(input.permissions);
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: id } });
    await tx.rolePermission.createMany({ data: ids.map((permissionId) => ({ roleId: id, permissionId })) });
    await audit(req, { action: "role.permissions_update", entityType: "Role", entityId: id, metadata: { permissions: input.permissions } }, tx);
  });
  ok(res, { id, permissions: input.permissions });
}
async function deleteRole(req, res) {
  const id = idParam(req);
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw ApiError.notFound();
  if (role.isSystem) throw ApiError.badRequest("System roles cannot be deleted");
  await prisma.role.delete({ where: { id } });
  await audit(req, { action: "role.delete", entityType: "Role", entityId: id });
  noContent(res);
}

// src/controllers/cms.controller.ts
var import_zod4 = require("zod");
var locale = import_zod4.z.enum(["en", "bn"]);
var sectionParams = import_zod4.z.object({ key: sectionKey, locale });
var MAX_SECTION_BYTES = 64 * 1024;
var getSectionParams = (req) => {
  const r = sectionParams.safeParse(req.params);
  if (!r.success) throw ApiError.notFound();
  return r.data;
};
async function publicSections(req, res) {
  const { locale: lang } = parse(import_zod4.z.object({ locale: locale.default("en") }), req.query);
  const rows = await prisma.websiteSection.findMany({ where: { locale: lang, publishedContent: { not: import_prisma2.Prisma.AnyNull } } });
  res.set("Cache-Control", "no-cache");
  ok(res, Object.fromEntries(rows.map((r) => [r.key, r.publishedContent])));
}
async function adminSections(_req, res) {
  const rows = await prisma.websiteSection.findMany({ orderBy: [{ key: "asc" }, { locale: "asc" }] });
  ok(
    res,
    rows.map((r) => ({
      key: r.key,
      locale: r.locale,
      draftContent: r.draftContent,
      publishedContent: r.publishedContent,
      publishedAt: r.publishedAt,
      updatedAt: r.updatedAt,
      hasUnpublishedChanges: JSON.stringify(r.draftContent) !== JSON.stringify(r.publishedContent)
    }))
  );
}
async function saveDraft(req, res) {
  const { key, locale: lang } = getSectionParams(req);
  const { content } = body(req, sectionContentSchema);
  if (Buffer.byteLength(JSON.stringify(content)) > MAX_SECTION_BYTES) throw ApiError.badRequest("Section content is too large");
  const row = await prisma.websiteSection.upsert({
    where: { key_locale: { key, locale: lang } },
    update: { draftContent: content, updatedById: currentUser(req).id },
    create: { key, locale: lang, draftContent: content, updatedById: currentUser(req).id }
  });
  await audit(req, { action: "cms.draft_save", entityType: "WebsiteSection", entityId: row.id, metadata: { key, locale: lang } });
  ok(res, row);
}
async function publish(req, res) {
  const { key, locale: lang } = getSectionParams(req);
  const row = await prisma.websiteSection.findUnique({ where: { key_locale: { key, locale: lang } } });
  if (!row) throw ApiError.notFound("Save a draft before publishing");
  const updated = await prisma.websiteSection.update({
    where: { id: row.id },
    data: { publishedContent: row.draftContent, publishedAt: /* @__PURE__ */ new Date(), updatedById: currentUser(req).id }
  });
  await audit(req, { action: "cms.publish", entityType: "WebsiteSection", entityId: row.id, metadata: { key, locale: lang } });
  ok(res, updated);
}
async function unpublish(req, res) {
  const { key, locale: lang } = getSectionParams(req);
  const row = await prisma.websiteSection.findUnique({ where: { key_locale: { key, locale: lang } } });
  if (!row) throw ApiError.notFound();
  const updated = await prisma.websiteSection.update({ where: { id: row.id }, data: { publishedContent: import_prisma2.Prisma.DbNull, publishedAt: null } });
  await audit(req, { action: "cms.unpublish", entityType: "WebsiteSection", entityId: row.id, metadata: { key, locale: lang } });
  ok(res, updated);
}
async function publicFaqs(req, res) {
  const { locale: lang } = parse(import_zod4.z.object({ locale: locale.default("en") }), req.query);
  const faqs = await prisma.faq.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  res.set("Cache-Control", "no-cache");
  ok(
    res,
    faqs.map((f) => ({
      id: f.id,
      category: f.category,
      question: lang === "bn" && f.questionBn || f.questionEn,
      answer: lang === "bn" && f.answerBn || f.answerEn
    }))
  );
}
var emailOrEmpty = import_zod4.z.union([import_zod4.z.literal(""), import_zod4.z.string().trim().toLowerCase().email().max(254)]);
var urlOrEmpty = import_zod4.z.union([import_zod4.z.literal(""), import_zod4.z.string().trim().max(500).regex(/^https?:\/\/[^\s]+$/i, "Must be an http(s) URL")]);
function settingRule(key) {
  if (/^contact\.[a-zA-Z]+Email$/.test(key)) return emailOrEmpty;
  if (key === "contact.phone") return import_zod4.z.string().trim().max(40);
  if (key === "contact.address") return import_zod4.z.string().trim().max(500);
  if (key === "social.facebookUrl" || key.startsWith("qr.")) return urlOrEmpty;
  if (key === "social.links") return import_zod4.z.array(import_zod4.z.object({ label: import_zod4.z.string().trim().min(1).max(60), url: urlOrEmpty })).max(20);
  if (key === "seo.defaults") {
    return import_zod4.z.object({
      titleEn: import_zod4.z.string().trim().max(120),
      titleBn: import_zod4.z.string().trim().max(120),
      descriptionEn: import_zod4.z.string().trim().max(300),
      descriptionBn: import_zod4.z.string().trim().max(300)
    });
  }
  if (key === "program.sixMonthProgram") {
    return import_zod4.z.object({
      status: import_zod4.z.enum(["requires_review", "confirmed", "not_applicable"]),
      enabled: import_zod4.z.boolean(),
      relationship: import_zod4.z.string().trim().max(1e3)
    });
  }
  throw ApiError.badRequest("This setting cannot be edited");
}
async function publicSettings(_req, res) {
  const rows = await prisma.websiteSetting.findMany({ where: { isPublic: true } });
  res.set("Cache-Control", "no-cache");
  ok(res, Object.fromEntries(rows.map((r) => [r.key, r.value])));
}
async function adminSettings(_req, res) {
  ok(res, await prisma.websiteSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }));
}
async function updateSetting(req, res) {
  const key = import_zod4.z.string().regex(/^[a-zA-Z.]{3,60}$/).safeParse(req.params.key);
  if (!key.success) throw ApiError.notFound();
  const existing = await prisma.websiteSetting.findUnique({ where: { key: key.data } });
  if (!existing) throw ApiError.notFound("Unknown setting");
  const { value } = body(req, import_zod4.z.object({ value: settingRule(key.data) }));
  const program = value;
  const isPublic = key.data === "program.sixMonthProgram" ? program.status === "confirmed" && program.enabled === true : existing.isPublic;
  const updated = await prisma.websiteSetting.update({
    where: { key: key.data },
    data: { value, isPublic, updatedById: currentUser(req).id }
  });
  await audit(req, { action: "settings.update", entityType: "WebsiteSetting", entityId: updated.id, metadata: { key: key.data } });
  ok(res, updated);
}
async function auditLogs(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(auditFilterSchema, req.query);
  const where = {
    ...f.entityType ? { entityType: f.entityType } : {},
    ...f.action ? { action: { startsWith: f.action } } : {},
    ...f.actorId ? { actorId: f.actorId } : {},
    ...p.q ? { OR: [{ action: { contains: p.q, mode: "insensitive" } }, { entityId: { contains: p.q } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: orderBy(p, ["createdAt", "action", "entityType"]), ...pageArgs(p), include: { actor: { select: { fullName: true, email: true } } } }),
    prisma.auditLog.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function dashboard(req, res) {
  const [
    applications,
    pendingApplications,
    publishedCourses2,
    activeStudents,
    batches,
    partnershipInquiries,
    newInquiries,
    unreadMessages,
    verifiedAlumni,
    pendingAlumniRegistrations,
    publicAlumniProfiles,
    storiesAwaitingReview,
    publishedStories
  ] = await Promise.all([
    prisma.studentApplication.count(),
    prisma.studentApplication.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.studentProfile.count({ where: { status: "ACTIVE" } }),
    prisma.trainingBatch.count({ where: { status: { in: ["PLANNED", "ACTIVE"] } } }),
    prisma.partnershipInquiry.count(),
    prisma.partnershipInquiry.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.alumniProfile.count({ where: { verificationStatus: "VERIFIED", archivedAt: null } }),
    prisma.alumniRegistrationRequest.count({ where: { status: "PENDING" } }),
    prisma.alumniProfile.count({
      where: { verificationStatus: "VERIFIED", isPublic: true, publicConsentAt: { not: null }, publicationStatus: "APPROVED", archivedAt: null }
    }),
    prisma.alumniStory.count({ where: { status: "SUBMITTED" } }),
    prisma.alumniStory.count({ where: { status: "PUBLISHED" } })
  ]);
  const recentApplications = hasPermission(req, P.applicationsManage) ? await prisma.studentApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, referenceCode: true, fullName: true, status: true, createdAt: true }
  }) : [];
  ok(res, {
    counts: {
      applications,
      pendingApplications,
      publishedCourses: publishedCourses2,
      activeStudents,
      batches,
      partnershipInquiries,
      newInquiries,
      unreadMessages,
      verifiedAlumni,
      pendingAlumniRegistrations,
      publicAlumniProfiles,
      storiesAwaitingReview,
      publishedStories
    },
    recentApplications
  });
}

// src/routes/admin.routes.ts
var userRoutes = (0, import_express.Router)();
var manageUsers = requirePermission(P.usersManage);
userRoutes.get("/", manageUsers, listUsers);
userRoutes.post("/", manageUsers, createUser);
userRoutes.get("/:id", manageUsers, getUser);
userRoutes.patch("/:id", manageUsers, updateUser);
userRoutes.post("/:id/revoke-sessions", manageUsers, revokeUserSessions);
userRoutes.post("/:id/invite", manageUsers, resendInvite);
userRoutes.delete("/:id", manageUsers, deleteUser);
var roleRoutes = (0, import_express.Router)();
var manageRoles = requirePermission(P.rolesManage);
roleRoutes.get("/", requirePermission(P.rolesManage, P.usersManage), listRoles);
roleRoutes.get("/permissions", manageRoles, listPermissions);
roleRoutes.post("/", manageRoles, createRole);
roleRoutes.put("/:id/permissions", manageRoles, setRolePermissions);
roleRoutes.delete("/:id", manageRoles, deleteRole);
var auditRoutes = (0, import_express.Router)();
auditRoutes.get("/", requirePermission(P.auditRead), auditLogs);
var dashboardRoutes = (0, import_express.Router)();
dashboardRoutes.get("/", requirePermission(P.dashboardView), dashboard);

// src/routes/admissions.routes.ts
var import_express2 = require("express");

// src/validators/public.validators.ts
var import_zod5 = require("zod");
var consent = import_zod5.z.literal(true, { error: "Consent is required" });
var applicationSchema = import_zod5.z.object({
  fullName: import_zod5.z.string().trim().min(2).max(120),
  email,
  phone: import_zod5.z.string().trim().min(6).max(30).regex(/^[+0-9 ()-]+$/, "Invalid phone number"),
  currentStatus: import_zod5.z.enum(["graduate_seeking_employment", "hsc_qualified", "student", "employed", "other"]),
  highestEducation: optionalText(120),
  /** Ignored. The programme is always all five foundation courses. */
  areaOfInterest: import_zod5.z.string().trim().max(120).optional(),
  motivation: import_zod5.z.string().trim().min(20).max(2e3),
  preferredContact: import_zod5.z.enum(["email", "phone", "either"]).optional().nullable(),
  locale: import_zod5.z.enum(["en", "bn"]).default("en"),
  privacyConsent: consent,
  idempotencyKey: import_zod5.z.string().uuid().optional()
});
var contactSchema = import_zod5.z.object({
  name: import_zod5.z.string().trim().min(2).max(120),
  email,
  subject: import_zod5.z.string().trim().min(2).max(200),
  message: import_zod5.z.string().trim().min(10).max(5e3),
  category: import_zod5.z.enum(["general", "admission", "partnership"]).default("general")
});
var partnershipInquirySchema = import_zod5.z.object({
  organizationName: import_zod5.z.string().trim().min(2).max(160),
  contactName: import_zod5.z.string().trim().min(2).max(120),
  workEmail: email,
  phone: optionalText(30),
  website: optionalUrl,
  interest: import_zod5.z.enum([
    "skill_requirements",
    "training_collaboration",
    "guest_sessions_mentoring",
    "practical_projects",
    "workplace_learning",
    "internships",
    "employment",
    "reskilling_upskilling",
    "other"
  ]),
  message: import_zod5.z.string().trim().min(10).max(5e3),
  consent
});

// src/controllers/applications.controller.ts
var DUPLICATE_WINDOW_MS = 24 * 36e5;
var FOUNDATION_PROGRAMME = "All five foundation courses";
async function submit(req, res) {
  const input = body(req, applicationSchema);
  if (input.idempotencyKey) {
    const replay = await prisma.studentApplication.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (replay) return ok(res, { referenceCode: replay.referenceCode, createdAt: replay.createdAt, duplicate: true });
  }
  const recent = await prisma.studentApplication.findFirst({
    where: {
      email: input.email,
      areaOfInterest: { equals: FOUNDATION_PROGRAMME, mode: "insensitive" },
      status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
    }
  });
  if (recent) {
    throw ApiError.conflict("An application with this email was already submitted recently and is awaiting review.", "DUPLICATE_APPLICATION");
  }
  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.studentApplication.create({
      data: {
        referenceCode: referenceCode("BI"),
        idempotencyKey: input.idempotencyKey,
        userId: req.auth?.id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        currentStatus: input.currentStatus,
        highestEducation: input.highestEducation,
        areaOfInterest: FOUNDATION_PROGRAMME,
        motivation: input.motivation,
        preferredContact: input.preferredContact ?? null,
        locale: input.locale,
        consentAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.applicationStatusHistory.create({ data: { applicationId: app.id, toStatus: "SUBMITTED" } });
    return app;
  });
  await sendEmail({
    to: application.email,
    subject: `Application received (${application.referenceCode}) - The Bridge Institute`,
    text: `Dear ${application.fullName},

Thank you for applying to The Bridge Institute. Your application reference is ${application.referenceCode}. Our admissions team will review it and contact you.

Submitting an application does not confirm admission or enrolment.`
  });
  created(res, { referenceCode: application.referenceCode, createdAt: application.createdAt });
}
async function mine(req, res) {
  const auth = currentUser(req);
  const items = await prisma.studentApplication.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceCode: true,
      areaOfInterest: true,
      currentStatus: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      history: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: "asc" } }
    }
  });
  ok(res, items);
}
async function list(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(applicationFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? {
      OR: [
        { fullName: { contains: p.q, mode: "insensitive" } },
        { email: { contains: p.q, mode: "insensitive" } },
        { referenceCode: { contains: p.q, mode: "insensitive" } }
      ]
    } : {}
  };
  const [items, total] = await Promise.all([
    prisma.studentApplication.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "status", "fullName", "updatedAt"]),
      ...pageArgs(p),
      select: { id: true, referenceCode: true, fullName: true, email: true, phone: true, areaOfInterest: true, currentStatus: true, status: true, createdAt: true }
    }),
    prisma.studentApplication.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function get(req, res) {
  const application = await prisma.studentApplication.findUnique({
    where: { id: idParam(req) },
    include: {
      history: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { id: true, fullName: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, fullName: true } } } },
      studentProfile: { select: { id: true, studentCode: true } }
    }
  });
  if (!application) throw ApiError.notFound();
  const { idempotencyKey: _ignored, ...rest } = application;
  void _ignored;
  ok(res, rest);
}
async function updateStatus(req, res) {
  const id = idParam(req);
  const input = body(req, applicationStatusSchema);
  const auth = currentUser(req);
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.studentApplication.findUnique({ where: { id } });
    if (!current) throw ApiError.notFound();
    if (current.status === input.status) throw ApiError.badRequest("Application already has this status");
    const updated = await tx.studentApplication.update({ where: { id }, data: { status: input.status } });
    await tx.applicationStatusHistory.create({
      data: { applicationId: id, fromStatus: current.status, toStatus: input.status, changedById: auth.id, note: input.note }
    });
    await audit(req, { action: "application.status", entityType: "StudentApplication", entityId: id, metadata: { from: current.status, to: input.status } }, tx);
    return updated;
  });
  ok(res, { id: result.id, status: result.status });
}
async function addNote(req, res) {
  const id = idParam(req);
  const input = body(req, noteSchema);
  const exists = await prisma.studentApplication.count({ where: { id } });
  if (!exists) throw ApiError.notFound();
  const note = await prisma.applicationInternalNote.create({
    data: { applicationId: id, authorId: currentUser(req).id, body: input.body },
    include: { author: { select: { id: true, fullName: true } } }
  });
  await audit(req, { action: "application.note", entityType: "StudentApplication", entityId: id });
  created(res, note);
}
async function nextStudentCode(tx) {
  const year2 = (/* @__PURE__ */ new Date()).getUTCFullYear();
  const count = await tx.studentProfile.count({ where: { studentCode: { startsWith: `BIS-${year2}-` } } });
  return `BIS-${year2}-${String(count + 1).padStart(4, "0")}`;
}
async function onboard(req, res) {
  const id = idParam(req);
  const { user, profile } = await prisma.$transaction(async (tx) => {
    const app = await tx.studentApplication.findUnique({ where: { id }, include: { studentProfile: true } });
    if (!app) throw ApiError.notFound();
    if (app.status !== "ACCEPTED") throw ApiError.badRequest("Only accepted applications can be onboarded");
    if (app.studentProfile) throw ApiError.conflict("This application has already been onboarded");
    const user2 = (app.userId ? await tx.user.findUnique({ where: { id: app.userId } }) : null) ?? await tx.user.findUnique({ where: { email: app.email } }) ?? await tx.user.create({ data: { email: app.email, fullName: app.fullName, phone: app.phone, preferredLocale: app.locale } });
    const existingProfile = await tx.studentProfile.findUnique({ where: { userId: user2.id } });
    if (existingProfile) throw ApiError.conflict("This person already has a student record");
    const studentRole = await tx.role.findUniqueOrThrow({ where: { key: "STUDENT" } });
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: user2.id, roleId: studentRole.id } },
      update: {},
      create: { userId: user2.id, roleId: studentRole.id }
    });
    const profile2 = await tx.studentProfile.create({
      data: {
        userId: user2.id,
        studentCode: await nextStudentCode(tx),
        educationLevel: app.highestEducation,
        currentStatus: app.currentStatus,
        sourceApplicationId: app.id
      }
    });
    if (!app.userId) await tx.studentApplication.update({ where: { id }, data: { userId: user2.id } });
    await audit(req, { action: "application.onboard", entityType: "StudentApplication", entityId: id, metadata: { studentId: profile2.id } }, tx);
    return { user: user2, profile: profile2 };
  });
  const invite = user.passwordHash ? { emailSent: false, inviteUrl: null } : await inviteUser(user.id, user.email, user.fullName);
  created(res, { studentId: profile.id, studentCode: profile.studentCode, ...invite });
}

// src/controllers/students.controller.ts
var courseTitle = { translations: { where: { locale: "en" }, select: { title: true } } };
async function me(req, res) {
  const auth = currentUser(req);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: auth.id },
    include: {
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        include: {
          batch: { include: { course: { select: { id: true, slug: true, ...courseTitle } } } },
          attendance: { orderBy: { date: "desc" }, select: { date: true, status: true } },
          results: { include: { assessment: { select: { title: true, type: true, maxScore: true, dueDate: true } } } },
          certificate: { select: { certificateNo: true, status: true, issuedAt: true } }
        }
      }
    }
  });
  if (!profile) return ok(res, null);
  const courseIds = profile.enrollments.map((e) => e.batch.courseId).filter((id) => Boolean(id));
  const materials = courseIds.length ? await prisma.learningMaterial.findMany({
    where: { courseId: { in: courseIds }, isPublished: true },
    orderBy: [{ courseId: "asc" }, { sortOrder: "asc" }],
    select: { id: true, courseId: true, title: true, description: true, url: true }
  }) : [];
  ok(res, {
    id: profile.id,
    studentCode: profile.studentCode,
    status: profile.status,
    educationLevel: profile.educationLevel,
    currentStatus: profile.currentStatus,
    enrollments: profile.enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      batch: { code: e.batch.code, name: e.batch.name, startDate: e.batch.startDate, endDate: e.batch.endDate, status: e.batch.status },
      course: e.batch.course ? { id: e.batch.course.id, slug: e.batch.course.slug, title: e.batch.course.translations[0]?.title ?? "" } : null,
      attendance: {
        total: e.attendance.length,
        present: e.attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length,
        recent: e.attendance.slice(0, 10)
      },
      results: e.results.map((r) => ({ assessment: r.assessment, score: Number(r.score), feedback: r.feedback })),
      certificate: e.certificate?.status === "ISSUED" ? e.certificate : null
    })),
    materials
  });
}
async function updateMe(req, res) {
  const auth = currentUser(req);
  const input = body(req, studentSelfUpdateSchema);
  const profile = await prisma.studentProfile.findUnique({ where: { userId: auth.id } });
  if (!profile) throw ApiError.notFound("No student record");
  await prisma.studentProfile.update({ where: { id: profile.id }, data: input });
  ok(res, { updated: true });
}
var studentInclude = {
  user: { select: { id: true, fullName: true, email: true, phone: true } },
  _count: { select: { enrollments: true } }
};
async function list2(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(studentFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? {
      OR: [
        { studentCode: { contains: p.q, mode: "insensitive" } },
        { user: { fullName: { contains: p.q, mode: "insensitive" } } },
        { user: { email: { contains: p.q, mode: "insensitive" } } }
      ]
    } : {}
  };
  const [items, total] = await Promise.all([
    prisma.studentProfile.findMany({ where, include: studentInclude, orderBy: orderBy(p, ["createdAt", "studentCode", "status"]), ...pageArgs(p) }),
    prisma.studentProfile.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function get2(req, res) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: idParam(req) },
    include: {
      ...studentInclude,
      enrollments: { include: { batch: { select: { id: true, code: true, name: true } }, certificate: true } },
      sourceApplication: { select: { id: true, referenceCode: true } }
    }
  });
  if (!student) throw ApiError.notFound();
  ok(res, student);
}
async function update(req, res) {
  const id = idParam(req);
  const input = body(req, studentUpdateSchema);
  const student = await prisma.studentProfile.update({
    where: { id },
    data: { ...input, ...input.status === "GRADUATED" ? { graduatedAt: /* @__PURE__ */ new Date() } : {} },
    include: studentInclude
  });
  await audit(req, { action: "student.update", entityType: "StudentProfile", entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, student);
}

// src/controllers/training.controller.ts
async function assertBatchAccess(req, batchId) {
  if (hasPermission(req, P.trainingManage)) return;
  if (!hasPermission(req, P.trainingTeach)) throw ApiError.forbidden();
  const assigned = await prisma.batchTeacher.count({ where: { batchId, userId: currentUser(req).id } });
  if (!assigned) throw ApiError.forbidden("You are not assigned to this batch");
}
var batchScope = (req) => hasPermission(req, P.trainingManage) ? {} : { teachers: { some: { userId: currentUser(req).id } } };
var studentSummary = { select: { id: true, studentCode: true, user: { select: { fullName: true, email: true } } } };
async function listBatches(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(batchFilterSchema, req.query);
  const where = {
    ...batchScope(req),
    ...f.status ? { status: f.status } : {},
    ...f.courseId ? { courseId: f.courseId } : {},
    ...p.q ? { OR: [{ name: { contains: p.q, mode: "insensitive" } }, { code: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.trainingBatch.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "startDate", "code", "name"]),
      ...pageArgs(p),
      include: {
        course: { select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { title: true } } } },
        teachers: { include: { user: { select: { id: true, fullName: true } } } },
        _count: { select: { enrollments: true } }
      }
    }),
    prisma.trainingBatch.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function getBatch(req, res) {
  const id = idParam(req);
  await assertBatchAccess(req, id);
  const batch = await prisma.trainingBatch.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, slug: true, translations: { where: { locale: "en" }, select: { title: true } } } },
      teachers: { include: { user: { select: { id: true, fullName: true, email: true } } } },
      enrollments: { include: { student: studentSummary }, orderBy: { enrolledAt: "asc" } },
      assessments: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!batch) throw ApiError.notFound();
  ok(res, batch);
}
async function createBatch(req, res) {
  const input = body(req, batchSchema);
  if (input.startDate && input.endDate && input.endDate < input.startDate) throw ApiError.badRequest("End date must be after start date");
  const batch = await prisma.trainingBatch.create({ data: input });
  await audit(req, { action: "batch.create", entityType: "TrainingBatch", entityId: batch.id });
  created(res, batch);
}
async function updateBatch(req, res) {
  const id = idParam(req);
  const input = body(req, batchUpdateSchema);
  const existing = await prisma.trainingBatch.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  const start = input.startDate !== void 0 ? input.startDate : existing.startDate;
  const end = input.endDate !== void 0 ? input.endDate : existing.endDate;
  if (start && end && end < start) throw ApiError.badRequest("End date must be after start date");
  const batch = await prisma.trainingBatch.update({ where: { id }, data: input });
  await audit(req, { action: "batch.update", entityType: "TrainingBatch", entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, batch);
}
async function deleteBatch(req, res) {
  const id = idParam(req);
  const count = await prisma.enrollment.count({ where: { batchId: id } });
  if (count) throw ApiError.conflict("Batches with enrollments cannot be deleted. Cancel the batch instead.", "IN_USE");
  await prisma.trainingBatch.delete({ where: { id } });
  await audit(req, { action: "batch.delete", entityType: "TrainingBatch", entityId: id });
  noContent(res);
}
async function setTeachers(req, res) {
  const id = idParam(req);
  const { userIds } = body(req, batchTeachersSchema);
  const teachers = await prisma.user.count({
    where: { id: { in: userIds }, isActive: true, roles: { some: { role: { permissions: { some: { permission: { key: P.trainingTeach } } } } } } }
  });
  if (teachers !== new Set(userIds).size) throw ApiError.badRequest("Every assigned user must be an active teacher");
  await prisma.$transaction([
    prisma.batchTeacher.deleteMany({ where: { batchId: id } }),
    prisma.batchTeacher.createMany({ data: userIds.map((userId) => ({ batchId: id, userId })) })
  ]);
  await audit(req, { action: "batch.teachers", entityType: "TrainingBatch", entityId: id, metadata: { userIds } });
  ok(res, { id, userIds });
}
async function listTeachers(_req, res) {
  const users = await prisma.user.findMany({
    where: { isActive: true, roles: { some: { role: { permissions: { some: { permission: { key: P.trainingTeach } } } } } } },
    select: { id: true, fullName: true, email: true },
    orderBy: { fullName: "asc" }
  });
  ok(res, users);
}
async function listEnrollments(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(enrollmentFilterSchema, req.query);
  if (f.batchId) await assertBatchAccess(req, f.batchId);
  else if (!hasPermission(req, P.trainingManage)) throw ApiError.badRequest("batchId is required");
  const where = {
    ...f.batchId ? { batchId: f.batchId } : {},
    ...f.studentId ? { studentId: f.studentId } : {}
  };
  const [items, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      orderBy: orderBy(p, ["enrolledAt", "progress", "status"], "enrolledAt"),
      ...pageArgs(p),
      include: { student: studentSummary, batch: { select: { id: true, code: true, name: true } }, certificate: { select: { id: true, status: true } } }
    }),
    prisma.enrollment.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function createEnrollment(req, res) {
  const input = body(req, enrollmentSchema);
  const [student, batch] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { id: input.studentId } }),
    prisma.trainingBatch.findUnique({ where: { id: input.batchId }, include: { _count: { select: { enrollments: true } } } })
  ]);
  if (!student || !batch) throw ApiError.badRequest("Student or batch not found");
  if (batch.status === "CANCELLED" || batch.status === "COMPLETED") throw ApiError.badRequest("This batch is not open for enrollment");
  if (batch.capacity && batch._count.enrollments >= batch.capacity) throw ApiError.conflict("This batch is full", "BATCH_FULL");
  const enrollment = await prisma.enrollment.create({ data: input });
  await audit(req, { action: "enrollment.create", entityType: "Enrollment", entityId: enrollment.id });
  created(res, enrollment);
}
async function updateEnrollment(req, res) {
  const id = idParam(req);
  const input = body(req, enrollmentUpdateSchema);
  const existing = await prisma.enrollment.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  await assertBatchAccess(req, existing.batchId);
  if (input.status && !hasPermission(req, P.trainingManage)) throw ApiError.forbidden();
  const enrollment = await prisma.enrollment.update({
    where: { id },
    data: { ...input, ...input.status === "COMPLETED" ? { completedAt: /* @__PURE__ */ new Date() } : {} }
  });
  await audit(req, { action: "enrollment.update", entityType: "Enrollment", entityId: id, metadata: input });
  ok(res, enrollment);
}
var toDate = (iso) => /* @__PURE__ */ new Date(`${iso}T00:00:00.000Z`);
async function getAttendance(req, res) {
  const q = parse(attendanceQuerySchema, req.query);
  await assertBatchAccess(req, q.batchId);
  const enrollments = await prisma.enrollment.findMany({
    where: { batchId: q.batchId, status: { not: "WITHDRAWN" } },
    include: { student: studentSummary, attendance: { where: { date: toDate(q.date) } } },
    orderBy: { enrolledAt: "asc" }
  });
  ok(
    res,
    enrollments.map((e) => ({ enrollmentId: e.id, student: e.student, record: e.attendance[0] ?? null }))
  );
}
async function saveAttendance(req, res) {
  const input = body(req, attendanceSaveSchema);
  await assertBatchAccess(req, input.batchId);
  const valid = await prisma.enrollment.count({ where: { id: { in: input.records.map((r) => r.enrollmentId) }, batchId: input.batchId } });
  if (valid !== input.records.length) throw ApiError.badRequest("Every record must belong to this batch");
  const date = toDate(input.date);
  const recordedById = currentUser(req).id;
  await prisma.$transaction(
    input.records.map(
      (r) => prisma.attendance.upsert({
        where: { enrollmentId_date: { enrollmentId: r.enrollmentId, date } },
        update: { status: r.status, note: r.note, recordedById },
        create: { enrollmentId: r.enrollmentId, date, status: r.status, note: r.note, recordedById }
      })
    )
  );
  await audit(req, { action: "attendance.save", entityType: "TrainingBatch", entityId: input.batchId, metadata: { date: input.date, count: input.records.length } });
  ok(res, { saved: input.records.length });
}
async function listAssessments(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(assessmentFilterSchema, req.query);
  if (f.batchId) await assertBatchAccess(req, f.batchId);
  const where = f.batchId ? { batchId: f.batchId } : { batch: batchScope(req) };
  const [items, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "dueDate", "title"]),
      ...pageArgs(p),
      include: { batch: { select: { id: true, code: true, name: true } }, _count: { select: { results: true } } }
    }),
    prisma.assessment.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function createAssessment(req, res) {
  const input = body(req, assessmentSchema);
  await assertBatchAccess(req, input.batchId);
  const assessment = await prisma.assessment.create({ data: input });
  await audit(req, { action: "assessment.create", entityType: "Assessment", entityId: assessment.id });
  created(res, assessment);
}
async function loadAssessment(req, id) {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw ApiError.notFound();
  await assertBatchAccess(req, assessment.batchId);
  return assessment;
}
async function updateAssessment(req, res) {
  const id = idParam(req);
  await loadAssessment(req, id);
  const input = body(req, assessmentUpdateSchema);
  const assessment = await prisma.assessment.update({ where: { id }, data: input });
  await audit(req, { action: "assessment.update", entityType: "Assessment", entityId: id });
  ok(res, assessment);
}
async function deleteAssessment(req, res) {
  const id = idParam(req);
  await loadAssessment(req, id);
  await prisma.assessment.delete({ where: { id } });
  await audit(req, { action: "assessment.delete", entityType: "Assessment", entityId: id });
  noContent(res);
}
async function getResults(req, res) {
  const q = parse(resultsQuerySchema, req.query);
  const assessment = await loadAssessment(req, q.assessmentId);
  const enrollments = await prisma.enrollment.findMany({
    where: { batchId: assessment.batchId, status: { not: "WITHDRAWN" } },
    include: { student: studentSummary, results: { where: { assessmentId: assessment.id } } },
    orderBy: { enrolledAt: "asc" }
  });
  ok(res, {
    assessment,
    rows: enrollments.map((e) => ({
      enrollmentId: e.id,
      student: e.student,
      result: e.results[0] ? { score: Number(e.results[0].score), feedback: e.results[0].feedback } : null
    }))
  });
}
async function saveResults(req, res) {
  const input = body(req, resultsSaveSchema);
  const assessment = await loadAssessment(req, input.assessmentId);
  if (input.records.some((r) => r.score > assessment.maxScore)) throw ApiError.badRequest(`Scores cannot exceed ${assessment.maxScore}`);
  const valid = await prisma.enrollment.count({ where: { id: { in: input.records.map((r) => r.enrollmentId) }, batchId: assessment.batchId } });
  if (valid !== input.records.length) throw ApiError.badRequest("Every record must belong to this assessment batch");
  const gradedById = currentUser(req).id;
  await prisma.$transaction(
    input.records.map(
      (r) => prisma.assessmentResult.upsert({
        where: { assessmentId_enrollmentId: { assessmentId: assessment.id, enrollmentId: r.enrollmentId } },
        update: { score: r.score, feedback: r.feedback, gradedById },
        create: { assessmentId: assessment.id, enrollmentId: r.enrollmentId, score: r.score, feedback: r.feedback, gradedById }
      })
    )
  );
  await audit(req, { action: "results.save", entityType: "Assessment", entityId: assessment.id, metadata: { count: input.records.length } });
  ok(res, { saved: input.records.length });
}
async function listCertificates(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(certificateFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? { certificateNo: { contains: p.q, mode: "insensitive" } } : {}
  };
  const [items, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "status", "issuedAt"]),
      ...pageArgs(p),
      include: {
        enrollment: { include: { student: studentSummary, batch: { select: { code: true, name: true } } } },
        approvedBy: { select: { fullName: true } }
      }
    }),
    prisma.certificate.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function createCertificate(req, res) {
  const input = body(req, certificateCreateSchema);
  const enrollment = await prisma.enrollment.findUnique({ where: { id: input.enrollmentId } });
  if (!enrollment) throw ApiError.badRequest("Enrollment not found");
  if (enrollment.status !== "COMPLETED") throw ApiError.badRequest("Certificates can only be prepared for completed enrollments");
  const certificate = await prisma.certificate.create({
    data: { enrollmentId: enrollment.id, certificateNo: referenceCode("BIC"), notes: input.notes }
  });
  await audit(req, { action: "certificate.create", entityType: "Certificate", entityId: certificate.id });
  created(res, certificate);
}
var transitions = {
  approve: { from: ["PENDING"], to: "APPROVED" },
  issue: { from: ["APPROVED"], to: "ISSUED" },
  revoke: { from: ["PENDING", "APPROVED", "ISSUED"], to: "REVOKED" }
};
var certificateAction = (action) => async (req, res) => {
  const id = idParam(req);
  const input = body(req, certificateActionSchema);
  const certificate = await prisma.certificate.findUnique({ where: { id } });
  if (!certificate) throw ApiError.notFound();
  const rule = transitions[action];
  if (!rule.from.includes(certificate.status)) throw ApiError.badRequest(`Cannot ${action} a certificate with status ${certificate.status}`);
  const now = /* @__PURE__ */ new Date();
  const updated = await prisma.certificate.update({
    where: { id },
    data: {
      status: rule.to,
      ...rule.to === "APPROVED" ? { approvedById: currentUser(req).id, approvedAt: now } : {},
      ...rule.to === "ISSUED" ? { issuedAt: now } : {},
      ...input.notes ? { notes: input.notes } : {}
    }
  });
  await audit(req, { action: `certificate.${action}`, entityType: "Certificate", entityId: id });
  ok(res, updated);
};

// src/routes/admissions.routes.ts
var applicationRoutes = (0, import_express2.Router)();
var admissions = requirePermission(P.applicationsManage);
applicationRoutes.post("/", formLimiter, submit);
applicationRoutes.get("/mine", requireAuth, mine);
applicationRoutes.get("/", admissions, list);
applicationRoutes.get("/:id", admissions, get);
applicationRoutes.patch("/:id/status", admissions, updateStatus);
applicationRoutes.post("/:id/notes", admissions, addNote);
applicationRoutes.post("/:id/onboard", admissions, onboard);
var studentRoutes = (0, import_express2.Router)();
var viewStudents = requirePermission(P.studentsManage, P.trainingManage);
studentRoutes.get("/me", requireAuth, me);
studentRoutes.patch("/me", requireAuth, updateMe);
studentRoutes.get("/", viewStudents, list2);
studentRoutes.get("/:id", viewStudents, get2);
studentRoutes.patch("/:id", requirePermission(P.studentsManage), update);
var manage = requirePermission(P.trainingManage);
var teachOrManage = requirePermission(P.trainingManage, P.trainingTeach);
var batchRoutes = (0, import_express2.Router)();
batchRoutes.get("/teachers", manage, listTeachers);
batchRoutes.get("/", teachOrManage, listBatches);
batchRoutes.post("/", manage, createBatch);
batchRoutes.get("/:id", teachOrManage, getBatch);
batchRoutes.patch("/:id", manage, updateBatch);
batchRoutes.delete("/:id", manage, deleteBatch);
batchRoutes.put("/:id/teachers", manage, setTeachers);
var enrollmentRoutes = (0, import_express2.Router)();
enrollmentRoutes.get("/", teachOrManage, listEnrollments);
enrollmentRoutes.post("/", manage, createEnrollment);
enrollmentRoutes.patch("/:id", teachOrManage, updateEnrollment);
var attendanceRoutes = (0, import_express2.Router)();
attendanceRoutes.get("/", teachOrManage, getAttendance);
attendanceRoutes.put("/", teachOrManage, saveAttendance);
var assessmentRoutes = (0, import_express2.Router)();
assessmentRoutes.get("/", teachOrManage, listAssessments);
assessmentRoutes.post("/", teachOrManage, createAssessment);
assessmentRoutes.patch("/:id", teachOrManage, updateAssessment);
assessmentRoutes.delete("/:id", teachOrManage, deleteAssessment);
var resultRoutes = (0, import_express2.Router)();
resultRoutes.get("/", teachOrManage, getResults);
resultRoutes.put("/", teachOrManage, saveResults);
var certificateRoutes = (0, import_express2.Router)();
var certs = requirePermission(P.certificatesManage);
certificateRoutes.get("/", certs, listCertificates);
certificateRoutes.post("/", certs, createCertificate);
certificateRoutes.post("/:id/approve", certs, certificateAction("approve"));
certificateRoutes.post("/:id/issue", certs, certificateAction("issue"));
certificateRoutes.post("/:id/revoke", certs, certificateAction("revoke"));

// src/routes/alumni.routes.ts
var import_express4 = require("express");

// src/controllers/alumni.controller.ts
var import_zod8 = require("zod");

// src/services/storage.service.ts
var import_node_crypto3 = require("node:crypto");
var SIGNATURES = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 255 && b[1] === 216 && b[2] === 255 },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  { mime: "application/pdf", ext: "pdf", test: (b) => b.subarray(0, 5).toString() === "%PDF-" }
];
var MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
function detectFileType(buffer, allowed) {
  const match = SIGNATURES.find((s) => allowed.includes(s.mime) && s.test(buffer));
  if (!match) throw ApiError.badRequest("Unsupported or invalid file type");
  return match;
}
var sanitizeFileName = (name) => name.replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_").slice(-120) || "file";
function assertConfigured() {
  if (!storageConfigured) {
    throw ApiError.unavailable("File storage is not configured", "STORAGE_NOT_CONFIGURED");
  }
}
var base = () => env.STORAGE_URL.replace(/\/+$/, "");
var headers = () => ({ Authorization: `Bearer ${env.STORAGE_SERVICE_KEY}`, apikey: env.STORAGE_SERVICE_KEY });
async function putObject(visibility, folder, ext, mime, data) {
  assertConfigured();
  const bucket = visibility === "PUBLIC" ? env.STORAGE_PUBLIC_BUCKET : env.STORAGE_PRIVATE_BUCKET;
  const objectKey = `${folder}/${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}/${(0, import_node_crypto3.randomUUID)()}.${ext}`;
  const response = await fetch(`${base()}/storage/v1/object/${bucket}/${objectKey}`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": mime, "x-upsert": "false" },
    body: new Uint8Array(data)
  });
  if (!response.ok) throw ApiError.unavailable("Upload failed", "STORAGE_ERROR");
  return { bucket, objectKey };
}
function publicUrl(bucket, objectKey) {
  if (!storageConfigured) return null;
  return `${base()}/storage/v1/object/public/${bucket}/${objectKey}`;
}
async function signedUrl(bucket, objectKey, expiresIn = 300) {
  assertConfigured();
  const response = await fetch(`${base()}/storage/v1/object/sign/${bucket}/${objectKey}`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn })
  });
  if (!response.ok) throw ApiError.unavailable("Could not sign URL", "STORAGE_ERROR");
  const json = await response.json();
  return json.signedURL ? `${base()}/storage/v1${json.signedURL}` : null;
}

// src/services/alumni.service.ts
var PUBLIC_PROFILE_WHERE = {
  verificationStatus: "VERIFIED",
  isPublic: true,
  publicConsentAt: { not: null },
  publicationStatus: "APPROVED",
  archivedAt: null
};
var publicProfileInclude = {
  cohort: { select: { slug: true, name: true, graduationYear: true } },
  course: { select: { slug: true, translations: { select: { locale: true, title: true } } } },
  photo: { select: { bucket: true, objectKey: true, visibility: true, altText: true } }
};
var assetUrl = (asset) => asset && asset.visibility === "PUBLIC" ? publicUrl(asset.bucket, asset.objectKey) : null;
function toPublicProfile(p, locale3) {
  const courseTitle2 = p.course?.translations.find((t) => t.locale === locale3)?.title ?? p.course?.translations.find((t) => t.locale === "en")?.title ?? null;
  return {
    slug: p.slug,
    displayName: p.displayName,
    graduationYear: p.graduationYear ?? p.cohort?.graduationYear ?? null,
    cohort: p.cohort ? { slug: p.cohort.slug, name: p.cohort.name } : null,
    course: p.course ? { slug: p.course.slug, title: courseTitle2 } : null,
    programName: p.programName,
    professionalTitle: p.professionalTitle,
    organization: p.organization,
    professionalField: p.professionalField,
    skills: p.skills,
    interests: p.interests,
    bio: (locale3 === "bn" ? p.bioBn || p.bioEn : p.bioEn || p.bioBn) ?? null,
    linkedinUrl: p.linkedinUrl,
    portfolioUrl: p.portfolioUrl,
    photoUrl: assetUrl(p.photo),
    photoAlt: p.photo?.altText ?? p.displayName
  };
}
var storyInclude = {
  author: {
    select: { verificationStatus: true, isPublic: true, publicConsentAt: true, publicationStatus: true, archivedAt: true, slug: true, displayName: true }
  },
  image: { select: { bucket: true, objectKey: true, visibility: true, altText: true } }
};
function isProfilePublic(a) {
  return a.verificationStatus === "VERIFIED" && a.isPublic && Boolean(a.publicConsentAt) && a.publicationStatus === "APPROVED" && !a.archivedAt;
}
function toPublicStory(s, locale3, withBody) {
  const pick = (en, bn) => (locale3 === "bn" ? bn || en : en || bn) ?? null;
  const authorPublic = isProfilePublic(s.author);
  return {
    slug: s.slug,
    title: pick(s.titleEn, s.titleBn),
    excerpt: pick(s.excerptEn, s.excerptBn),
    ...withBody ? { body: pick(s.bodyEn, s.bodyBn) } : {},
    publishedAt: s.publishedAt,
    imageUrl: assetUrl(s.image),
    imageAlt: s.image?.altText ?? null,
    author: authorPublic ? { displayName: s.author.displayName, slug: s.author.slug } : null
  };
}
async function directoryFilters(locale3) {
  const profiles = await prisma.alumniProfile.findMany({
    where: PUBLIC_PROFILE_WHERE,
    select: { graduationYear: true, professionalField: true, cohort: { select: { slug: true, name: true } }, course: { select: { slug: true, translations: { select: { locale: true, title: true } } } } }
  });
  const years = /* @__PURE__ */ new Set();
  const fields = /* @__PURE__ */ new Set();
  const cohorts = /* @__PURE__ */ new Map();
  const courses = /* @__PURE__ */ new Map();
  for (const p of profiles) {
    if (p.graduationYear) years.add(p.graduationYear);
    if (p.professionalField) fields.add(p.professionalField);
    if (p.cohort) cohorts.set(p.cohort.slug, p.cohort.name);
    if (p.course) {
      const title = p.course.translations.find((t) => t.locale === locale3)?.title ?? p.course.translations.find((t) => t.locale === "en")?.title ?? p.course.slug;
      courses.set(p.course.slug, title);
    }
  }
  return {
    years: [...years].sort((a, b) => b - a),
    fields: [...fields].sort(),
    cohorts: [...cohorts].map(([slug, name]) => ({ slug, name })),
    courses: [...courses].map(([slug, title]) => ({ slug, title }))
  };
}

// src/utils/slug.ts
var import_node_crypto4 = require("node:crypto");
function slugify(input) {
  const base2 = input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return base2 || "item";
}
var uniqueSlug = (input) => `${slugify(input)}-${(0, import_node_crypto4.randomBytes)(3).toString("hex")}`;

// src/validators/alumni.validators.ts
var import_zod7 = require("zod");

// src/validators/auth.validators.ts
var import_zod6 = require("zod");
var password = import_zod6.z.string().min(passwordSchemaRules.min).max(passwordSchemaRules.max);
var locale2 = import_zod6.z.enum(["en", "bn"]);
var loginSchema = import_zod6.z.object({
  email,
  password: import_zod6.z.string().min(1).max(passwordSchemaRules.max)
});
var registerSchema = import_zod6.z.object({
  fullName: import_zod6.z.string().trim().min(2).max(120),
  email,
  password,
  phone: optionalText(30),
  preferredLocale: locale2.default("en")
});
var forgotPasswordSchema = import_zod6.z.object({ email });
var resetPasswordSchema = import_zod6.z.object({
  token: import_zod6.z.string().min(20).max(200),
  password
});
var changePasswordSchema = import_zod6.z.object({
  currentPassword: import_zod6.z.string().min(1).max(passwordSchemaRules.max),
  newPassword: password
});
var updateMeSchema = import_zod6.z.object({
  fullName: import_zod6.z.string().trim().min(2).max(120),
  phone: optionalText(30),
  preferredLocale: locale2
}).partial();

// src/validators/alumni.validators.ts
var year = import_zod7.z.coerce.number().int().min(2e3).max(2100).optional().nullable().transform((v) => v ?? null);
var optionalUuid2 = import_zod7.z.string().uuid().optional().nullable().transform((v) => v ?? null);
var tagList = import_zod7.z.array(import_zod7.z.string().trim().min(1).max(40)).max(20);
var directoryQuerySchema = import_zod7.z.object({
  page: import_zod7.z.coerce.number().int().min(1).max(1e4).default(1),
  pageSize: import_zod7.z.coerce.number().int().min(1).max(48).default(12),
  q: import_zod7.z.string().trim().max(100).optional(),
  cohort: import_zod7.z.string().max(80).optional(),
  course: import_zod7.z.string().max(80).optional(),
  year: import_zod7.z.coerce.number().int().min(2e3).max(2100).optional(),
  field: import_zod7.z.string().max(80).optional()
});
var alumniJoinSchema = import_zod7.z.object({
  fullName: import_zod7.z.string().trim().min(2).max(120),
  email,
  password: password.optional(),
  graduationYear: year,
  courseId: optionalUuid2,
  cohortId: optionalUuid2,
  studentCode: optionalText(40),
  message: optionalText(2e3)
});
var alumniSelfUpdateSchema = import_zod7.z.object({
  displayName: import_zod7.z.string().trim().min(2).max(120),
  professionalTitle: optionalText(160),
  organization: optionalText(160),
  professionalField: optionalText(120),
  skills: tagList,
  interests: tagList,
  bioEn: optionalText(3e3),
  bioBn: optionalText(3e3),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  photoAssetId: optionalUuid2,
  contactEmail: email.optional().nullable().transform((v) => v ?? null),
  contactPhone: optionalText(30)
}).partial();
var PUBLIC_PROFILE_FIELDS = [
  "displayName",
  "professionalTitle",
  "organization",
  "professionalField",
  "skills",
  "interests",
  "bioEn",
  "bioBn",
  "linkedinUrl",
  "portfolioUrl",
  "photoAssetId"
];
var visibilitySchema = import_zod7.z.object({
  isPublic: import_zod7.z.boolean(),
  consent: import_zod7.z.boolean().optional()
});
var storySubmitSchema = import_zod7.z.object({
  titleEn: optionalText(200),
  titleBn: optionalText(200),
  excerptEn: optionalText(500),
  excerptBn: optionalText(500),
  bodyEn: optionalText(2e4),
  bodyBn: optionalText(2e4),
  imageAssetId: optionalUuid2
}).refine((s) => s.titleEn && s.bodyEn || s.titleBn && s.bodyBn, {
  message: "Provide a title and story in at least one language"
});
var assistanceSchema = import_zod7.z.object({
  subject: import_zod7.z.string().trim().min(2).max(200),
  message: import_zod7.z.string().trim().min(10).max(5e3)
});

// src/controllers/alumni.controller.ts
var localeQuery = import_zod8.z.object({ locale: import_zod8.z.enum(["en", "bn"]).default("en") });
var slugParam = import_zod8.z.object({ slug: import_zod8.z.string().regex(/^[a-z0-9-]{1,100}$/) });
var getSlug = (req) => {
  const r = slugParam.safeParse(req.params);
  if (!r.success) throw ApiError.notFound();
  return r.data.slug;
};
async function directory(req, res) {
  const q = parse(directoryQuerySchema, req.query);
  const { locale: locale3 } = parse(localeQuery, req.query);
  const where = {
    ...PUBLIC_PROFILE_WHERE,
    ...q.cohort ? { cohort: { slug: q.cohort } } : {},
    ...q.course ? { course: { slug: q.course } } : {},
    ...q.year ? { graduationYear: q.year } : {},
    ...q.field ? { professionalField: { equals: q.field, mode: "insensitive" } } : {},
    ...q.q ? {
      OR: [
        { displayName: { contains: q.q, mode: "insensitive" } },
        { professionalTitle: { contains: q.q, mode: "insensitive" } },
        { organization: { contains: q.q, mode: "insensitive" } },
        { skills: { has: q.q } }
      ]
    } : {}
  };
  const [items, total] = await Promise.all([
    prisma.alumniProfile.findMany({
      where,
      include: publicProfileInclude,
      orderBy: [{ graduationYear: "desc" }, { displayName: "asc" }],
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize
    }),
    prisma.alumniProfile.count({ where })
  ]);
  res.set("Cache-Control", "no-cache");
  ok(res, items.map((p) => toPublicProfile(p, locale3)), pageMeta({ page: q.page, pageSize: q.pageSize, order: "desc" }, total));
}
async function filters(req, res) {
  const { locale: locale3 } = parse(localeQuery, req.query);
  res.set("Cache-Control", "no-cache");
  ok(res, await directoryFilters(locale3));
}
async function publicProfile(req, res) {
  const { locale: locale3 } = parse(localeQuery, req.query);
  const profile = await prisma.alumniProfile.findFirst({ where: { ...PUBLIC_PROFILE_WHERE, slug: getSlug(req) }, include: publicProfileInclude });
  if (!profile) throw ApiError.notFound("Profile not found");
  const stories = await prisma.alumniStory.findMany({
    where: { authorId: profile.id, status: "PUBLISHED" },
    include: storyInclude,
    orderBy: { publishedAt: "desc" },
    take: 10
  });
  ok(res, { ...toPublicProfile(profile, locale3), stories: stories.map((s) => toPublicStory(s, locale3, false)) });
}
async function publicStories(req, res) {
  const { locale: locale3 } = parse(localeQuery, req.query);
  const page = import_zod8.z.coerce.number().int().min(1).max(1e3).catch(1).parse(req.query.page);
  const pageSize = 9;
  const where = { status: "PUBLISHED", author: { archivedAt: null } };
  const [items, total] = await Promise.all([
    prisma.alumniStory.findMany({ where, include: storyInclude, orderBy: { publishedAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.alumniStory.count({ where })
  ]);
  res.set("Cache-Control", "no-cache");
  ok(res, items.map((s) => toPublicStory(s, locale3, false)), pageMeta({ page, pageSize, order: "desc" }, total));
}
async function publicStory(req, res) {
  const { locale: locale3 } = parse(localeQuery, req.query);
  const story = await prisma.alumniStory.findFirst({
    where: { slug: getSlug(req), status: "PUBLISHED", author: { archivedAt: null } },
    include: storyInclude
  });
  if (!story) throw ApiError.notFound("Story not found");
  ok(res, toPublicStory(story, locale3, true));
}
async function cohortsAndCourses(_req, res) {
  const [cohorts, courses] = await Promise.all([
    prisma.alumniCohort.findMany({ select: { id: true, name: true, graduationYear: true }, orderBy: [{ graduationYear: "desc" }, { name: "asc" }] }),
    prisma.course.findMany({
      where: { status: { in: ["PUBLISHED", "ARCHIVED"] } },
      select: { id: true, translations: { select: { locale: true, title: true } } },
      orderBy: { sortOrder: "asc" }
    })
  ]);
  ok(res, { cohorts, courses });
}
async function register(req, res) {
  const input = body(req, alumniJoinSchema);
  let userId = req.auth?.id;
  if (!userId) {
    if (!input.password) throw ApiError.badRequest("A password is required to create your account");
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw ApiError.conflict("An account with this email already exists. Please sign in and submit the request again.", "EMAIL_IN_USE");
    const user = await prisma.user.create({
      data: { email: input.email, fullName: input.fullName, passwordHash: await hashPassword(input.password) }
    });
    userId = user.id;
    const { token } = await createSession(user.id, { ip: req.ip, userAgent: req.get("user-agent") });
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  }
  const [profile, pending] = await Promise.all([
    prisma.alumniProfile.findUnique({ where: { userId } }),
    prisma.alumniRegistrationRequest.findFirst({ where: { userId, status: "PENDING" } })
  ]);
  if (profile?.verificationStatus === "VERIFIED") throw ApiError.conflict("Your alumni status is already verified");
  if (pending) throw ApiError.conflict("You already have a registration request awaiting review", "REQUEST_PENDING");
  const student = await prisma.studentProfile.findFirst({
    where: { userId, status: "GRADUATED", ...input.studentCode ? { studentCode: input.studentCode } : {} }
  });
  const request = await prisma.alumniRegistrationRequest.create({
    data: {
      userId,
      fullName: input.fullName,
      email: req.auth?.email ?? input.email,
      graduationYear: input.graduationYear,
      courseId: input.courseId,
      cohortId: input.cohortId,
      studentCode: input.studentCode,
      message: input.message,
      matchedStudentId: student?.id ?? null
    },
    select: { id: true, status: true, createdAt: true }
  });
  await audit(req, { action: "alumni.register", entityType: "AlumniRegistrationRequest", entityId: request.id });
  created(res, request);
}
var ownProfileSelect = {
  id: true,
  slug: true,
  displayName: true,
  graduationYear: true,
  programName: true,
  professionalTitle: true,
  organization: true,
  professionalField: true,
  skills: true,
  interests: true,
  bioEn: true,
  bioBn: true,
  linkedinUrl: true,
  portfolioUrl: true,
  photoAssetId: true,
  contactEmail: true,
  contactPhone: true,
  verificationStatus: true,
  isPublic: true,
  publicConsentAt: true,
  publicationStatus: true,
  pendingChanges: true,
  archivedAt: true,
  cohort: { select: { id: true, name: true } },
  course: { select: { id: true, slug: true, translations: { select: { locale: true, title: true } } } }
};
async function me2(req, res) {
  const auth = currentUser(req);
  const [profile, requests] = await Promise.all([
    prisma.alumniProfile.findUnique({ where: { userId: auth.id }, select: ownProfileSelect }),
    prisma.alumniRegistrationRequest.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, status: true, createdAt: true, reviewedAt: true }
    })
  ]);
  ok(res, { profile, requests });
}
async function ownActiveProfile(req) {
  const profile = await prisma.alumniProfile.findUnique({ where: { userId: currentUser(req).id } });
  if (!profile || profile.verificationStatus !== "VERIFIED") throw ApiError.forbidden("A verified alumni profile is required");
  if (profile.archivedAt) throw ApiError.forbidden("This alumni profile has been archived");
  return profile;
}
async function updateMe2(req, res) {
  const profile = await ownActiveProfile(req);
  const input = body(req, alumniSelfUpdateSchema);
  if (input.photoAssetId) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: input.photoAssetId, uploadedById: profile.userId, mimeType: { startsWith: "image/" } } });
    if (!asset) throw ApiError.badRequest("Invalid photo");
  }
  const publicChanges = {};
  const direct = {};
  for (const [key, value] of Object.entries(input)) {
    if (PUBLIC_PROFILE_FIELDS.includes(key)) publicChanges[key] = value;
    else direct[key] = value;
  }
  const published = profile.publicationStatus === "APPROVED";
  const data = published ? {
    ...direct,
    ...Object.keys(publicChanges).length ? { pendingChanges: { ...profile.pendingChanges ?? {}, ...publicChanges } } : {}
  } : { ...direct, ...publicChanges };
  const updated = await prisma.alumniProfile.update({ where: { id: profile.id }, data, select: ownProfileSelect });
  await audit(req, { action: "alumni.profile_update", entityType: "AlumniProfile", entityId: profile.id, metadata: { fields: Object.keys(input), heldForReview: published } });
  ok(res, updated);
}
async function setVisibility(req, res) {
  const profile = await ownActiveProfile(req);
  const input = body(req, visibilitySchema);
  let data;
  if (input.isPublic) {
    if (input.consent !== true) throw ApiError.badRequest("Explicit consent is required to make your profile public");
    data = {
      isPublic: true,
      publicConsentAt: /* @__PURE__ */ new Date(),
      publicationStatus: profile.publicationStatus === "APPROVED" ? "APPROVED" : "PENDING"
    };
  } else {
    data = { isPublic: false, publicConsentAt: null };
  }
  const updated = await prisma.alumniProfile.update({ where: { id: profile.id }, data, select: ownProfileSelect });
  await audit(req, { action: input.isPublic ? "alumni.consent_granted" : "alumni.consent_revoked", entityType: "AlumniProfile", entityId: profile.id });
  ok(res, updated);
}
async function myStories(req, res) {
  const profile = await ownActiveProfile(req);
  const stories = await prisma.alumniStory.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, titleEn: true, titleBn: true, excerptEn: true, excerptBn: true, bodyEn: true, bodyBn: true, status: true, publishedAt: true, createdAt: true }
  });
  ok(res, stories);
}
async function submitStory(req, res) {
  const profile = await ownActiveProfile(req);
  const input = body(req, storySubmitSchema);
  if (input.imageAssetId) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: input.imageAssetId, uploadedById: profile.userId } });
    if (!asset) throw ApiError.badRequest("Invalid image");
  }
  const story = await prisma.alumniStory.create({
    data: { ...input, authorId: profile.id, slug: uniqueSlug(input.titleEn ?? profile.displayName), status: "SUBMITTED" },
    select: { id: true, slug: true, status: true, createdAt: true }
  });
  await audit(req, { action: "alumni.story_submit", entityType: "AlumniStory", entityId: story.id });
  created(res, story);
}
async function updateStory(req, res) {
  const profile = await ownActiveProfile(req);
  const id = idParam(req);
  const story = await prisma.alumniStory.findFirst({ where: { id, authorId: profile.id } });
  if (!story) throw ApiError.notFound();
  if (story.status === "PUBLISHED" || story.status === "ARCHIVED") throw ApiError.badRequest("Published stories cannot be edited. Contact the institute to request changes.");
  const input = body(req, storySubmitSchema);
  const updated = await prisma.alumniStory.update({
    where: { id },
    data: { ...input, status: "SUBMITTED" },
    select: { id: true, slug: true, status: true }
  });
  ok(res, updated);
}
async function announcements(req, res) {
  const { locale: locale3 } = parse(localeQuery, req.query);
  const items = await prisma.alumniAnnouncement.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 50 });
  ok(
    res,
    items.map((a) => ({
      id: a.id,
      title: locale3 === "bn" && a.titleBn || a.titleEn,
      body: locale3 === "bn" && a.bodyBn || a.bodyEn,
      publishedAt: a.publishedAt
    }))
  );
}
async function requestAssistance(req, res) {
  const auth = currentUser(req);
  const input = body(req, assistanceSchema);
  const message = await prisma.contactMessage.create({
    data: { name: auth.fullName, email: auth.email, subject: input.subject, message: input.message, category: "alumni-assistance", userId: auth.id },
    select: { id: true, createdAt: true }
  });
  created(res, message);
}

// src/controllers/alumniAdmin.controller.ts
async function overview(_req, res) {
  const [verified, pendingRegistrations, publicProfiles, pendingPublication, storiesAwaitingReview, publishedStories, cohorts, announcements2] = await Promise.all([
    prisma.alumniProfile.count({ where: { verificationStatus: "VERIFIED", archivedAt: null } }),
    prisma.alumniRegistrationRequest.count({ where: { status: "PENDING" } }),
    prisma.alumniProfile.count({ where: PUBLIC_PROFILE_WHERE }),
    prisma.alumniProfile.count({ where: { OR: [{ publicationStatus: "PENDING" }, { pendingChanges: { not: import_prisma2.Prisma.AnyNull } }], archivedAt: null } }),
    prisma.alumniStory.count({ where: { status: "SUBMITTED" } }),
    prisma.alumniStory.count({ where: { status: "PUBLISHED" } }),
    prisma.alumniCohort.count(),
    prisma.alumniAnnouncement.count({ where: { status: "PUBLISHED" } })
  ]);
  ok(res, { verified, pendingRegistrations, publicProfiles, pendingPublication, storiesAwaitingReview, publishedStories, cohorts, announcements: announcements2 });
}
async function listRegistrations(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(reviewFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? { OR: [{ fullName: { contains: p.q, mode: "insensitive" } }, { email: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.alumniRegistrationRequest.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "status", "fullName"]),
      ...pageArgs(p),
      include: { cohort: { select: { name: true } }, reviewedBy: { select: { fullName: true } } }
    }),
    prisma.alumniRegistrationRequest.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function getRegistration(req, res) {
  const request = await prisma.alumniRegistrationRequest.findUnique({
    where: { id: idParam(req) },
    include: { cohort: true, reviewedBy: { select: { fullName: true } }, user: { select: { id: true, email: true, fullName: true, createdAt: true } } }
  });
  if (!request) throw ApiError.notFound();
  const matchedStudent = request.matchedStudentId ? await prisma.studentProfile.findUnique({ where: { id: request.matchedStudentId }, select: { id: true, studentCode: true, status: true, graduatedAt: true } }) : null;
  ok(res, { ...request, matchedStudent });
}
var RESERVED_PROFILE_SLUGS = /* @__PURE__ */ new Set(["login", "join", "dashboard", "profile", "stories", "story", "opportunities", "item"]);
async function uniqueProfileSlug(tx, name) {
  const slug = slugify(name);
  const base2 = RESERVED_PROFILE_SLUGS.has(slug) ? `alumni-${slug === "item" ? "member" : slug}` : slug;
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base2 : `${base2}-${i + 1}`;
    if (!await tx.alumniProfile.findUnique({ where: { slug: candidate } })) return candidate;
  }
  return `${base2}-${Date.now().toString(36)}`;
}
async function approveRegistration(req, res) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const reviewer = currentUser(req);
  const profile = await prisma.$transaction(async (tx) => {
    const request = await tx.alumniRegistrationRequest.findUnique({ where: { id } });
    if (!request) throw ApiError.notFound();
    if (request.status !== "PENDING") throw ApiError.badRequest("This request has already been reviewed");
    await tx.alumniRegistrationRequest.update({
      where: { id },
      data: { status: "APPROVED", reviewNote: note, reviewedById: reviewer.id, reviewedAt: /* @__PURE__ */ new Date() }
    });
    const existing = await tx.alumniProfile.findUnique({ where: { userId: request.userId } });
    const profile2 = existing ? await tx.alumniProfile.update({ where: { id: existing.id }, data: { verificationStatus: "VERIFIED", archivedAt: null } }) : await tx.alumniProfile.create({
      data: {
        userId: request.userId,
        slug: await uniqueProfileSlug(tx, request.fullName),
        displayName: request.fullName,
        graduationYear: request.graduationYear,
        courseId: request.courseId,
        cohortId: request.cohortId,
        studentProfileId: request.matchedStudentId,
        verificationStatus: "VERIFIED"
      }
    });
    const alumniRole = await tx.role.findUniqueOrThrow({ where: { key: "ALUMNI" } });
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: request.userId, roleId: alumniRole.id } },
      update: {},
      create: { userId: request.userId, roleId: alumniRole.id }
    });
    await audit(req, { action: "alumni.registration_approve", entityType: "AlumniRegistrationRequest", entityId: id, metadata: { profileId: profile2.id } }, tx);
    return profile2;
  });
  ok(res, { requestId: id, profileId: profile.id, status: "APPROVED" });
}
async function rejectRegistration(req, res) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const request = await prisma.alumniRegistrationRequest.findUnique({ where: { id } });
  if (!request) throw ApiError.notFound();
  if (request.status !== "PENDING") throw ApiError.badRequest("This request has already been reviewed");
  await prisma.alumniRegistrationRequest.update({
    where: { id },
    data: { status: "REJECTED", reviewNote: note, reviewedById: currentUser(req).id, reviewedAt: /* @__PURE__ */ new Date() }
  });
  await audit(req, { action: "alumni.registration_reject", entityType: "AlumniRegistrationRequest", entityId: id });
  ok(res, { requestId: id, status: "REJECTED" });
}
async function listProfiles(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(profileFilterSchema, req.query);
  const where = {
    ...f.verificationStatus ? { verificationStatus: f.verificationStatus } : {},
    ...f.publicationStatus ? { publicationStatus: f.publicationStatus } : {},
    ...f.archived === "true" ? { archivedAt: { not: null } } : f.archived === "false" ? { archivedAt: null } : {},
    ...p.q ? { OR: [{ displayName: { contains: p.q, mode: "insensitive" } }, { user: { email: { contains: p.q, mode: "insensitive" } } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.alumniProfile.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "displayName", "graduationYear", "updatedAt"]),
      ...pageArgs(p),
      include: { user: { select: { email: true } }, cohort: { select: { name: true } } }
    }),
    prisma.alumniProfile.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function getProfile(req, res) {
  const profile = await prisma.alumniProfile.findUnique({
    where: { id: idParam(req) },
    include: { user: { select: { email: true, fullName: true } }, cohort: true, course: { select: { id: true, slug: true } }, stories: { select: { id: true, titleEn: true, status: true } } }
  });
  if (!profile) throw ApiError.notFound();
  ok(res, profile);
}
async function updateProfile(req, res) {
  const id = idParam(req);
  const input = body(req, adminProfileUpdateSchema);
  const profile = await prisma.alumniProfile.update({ where: { id }, data: input });
  await audit(req, { action: "alumni.profile_admin_update", entityType: "AlumniProfile", entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, profile);
}
async function approvePublication(req, res) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const profile = await prisma.alumniProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound();
  if (profile.verificationStatus !== "VERIFIED") throw ApiError.badRequest("Only verified alumni can be published");
  if (!profile.isPublic || !profile.publicConsentAt) throw ApiError.badRequest("The alumnus has not consented to a public profile");
  const changes = profile.pendingChanges ?? {};
  const updated = await prisma.alumniProfile.update({
    where: { id },
    data: { ...changes, pendingChanges: import_prisma2.Prisma.DbNull, publicationStatus: "APPROVED", reviewNote: note }
  });
  await audit(req, { action: "alumni.publication_approve", entityType: "AlumniProfile", entityId: id, metadata: { appliedFields: Object.keys(changes) } });
  ok(res, updated);
}
async function rejectPublication(req, res) {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const profile = await prisma.alumniProfile.findUnique({ where: { id } });
  if (!profile) throw ApiError.notFound();
  const keepPublished = profile.publicationStatus === "APPROVED" && profile.pendingChanges !== null;
  const updated = await prisma.alumniProfile.update({
    where: { id },
    data: { pendingChanges: import_prisma2.Prisma.DbNull, publicationStatus: keepPublished ? "APPROVED" : "REJECTED", reviewNote: note }
  });
  await audit(req, { action: "alumni.publication_reject", entityType: "AlumniProfile", entityId: id });
  ok(res, updated);
}
var setArchived = (archived) => async (req, res) => {
  const id = idParam(req);
  const profile = await prisma.alumniProfile.update({ where: { id }, data: { archivedAt: archived ? /* @__PURE__ */ new Date() : null } });
  await audit(req, { action: archived ? "alumni.archive" : "alumni.unarchive", entityType: "AlumniProfile", entityId: id });
  ok(res, profile);
};
async function listStories(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(storyFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? { OR: [{ titleEn: { contains: p.q, mode: "insensitive" } }, { titleBn: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.alumniStory.findMany({
      where,
      orderBy: orderBy(p, ["createdAt", "publishedAt", "status"]),
      ...pageArgs(p),
      include: { author: { select: { id: true, displayName: true, slug: true } } }
    }),
    prisma.alumniStory.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function updateStory2(req, res) {
  const id = idParam(req);
  const input = body(req, adminStoryUpdateSchema);
  const story = await prisma.alumniStory.update({ where: { id }, data: input });
  await audit(req, { action: "alumni.story_edit", entityType: "AlumniStory", entityId: id, metadata: { fields: Object.keys(input) } });
  ok(res, story);
}
var storyTransitions = {
  publish: { from: ["SUBMITTED", "REJECTED", "ARCHIVED"], to: "PUBLISHED" },
  reject: { from: ["SUBMITTED"], to: "REJECTED" },
  archive: { from: ["PUBLISHED", "SUBMITTED", "REJECTED"], to: "ARCHIVED" }
};
var storyAction = (action) => async (req, res) => {
  const id = idParam(req);
  const { note } = body(req, reviewDecisionSchema);
  const story = await prisma.alumniStory.findUnique({ where: { id }, include: { author: true } });
  if (!story) throw ApiError.notFound();
  const rule = storyTransitions[action];
  if (!rule.from.includes(story.status)) throw ApiError.badRequest(`Cannot ${action} a story with status ${story.status}`);
  if (action === "publish") {
    if (story.author.verificationStatus !== "VERIFIED" || story.author.archivedAt) throw ApiError.badRequest("The author is not an active verified alumnus");
    if (!(story.titleEn && story.bodyEn) && !(story.titleBn && story.bodyBn)) throw ApiError.badRequest("A title and body are required");
  }
  const updated = await prisma.alumniStory.update({
    where: { id },
    data: { status: rule.to, reviewNote: note, ...rule.to === "PUBLISHED" ? { publishedAt: story.publishedAt ?? /* @__PURE__ */ new Date() } : {} }
  });
  await audit(req, { action: `alumni.story_${action}`, entityType: "AlumniStory", entityId: id });
  ok(res, updated);
};

// src/controllers/crud.factory.ts
var import_express3 = require("express");
function crudRouter(options) {
  const router = (0, import_express3.Router)();
  const guard = requirePermission(options.permission);
  const { delegate } = options;
  const list3 = async (req, res) => {
    const pagination = parse(paginationSchema, req.query);
    const extra = options.filterSchema ? parse(options.filterSchema, req.query) : {};
    const where = { ...options.filters?.(extra) ?? {} };
    if (pagination.q && options.searchFields?.length) {
      where.OR = options.searchFields.map((f) => ({ [f]: { contains: pagination.q, mode: "insensitive" } }));
    }
    const order = req.query.order ? pagination.order : options.defaultOrder ?? pagination.order;
    const sort = orderBy({ ...pagination, order }, options.sortable, options.defaultSort ?? "createdAt");
    const [items, total] = await Promise.all([
      delegate.findMany({ where, orderBy: sort, include: options.include, ...pageArgs(pagination) }),
      delegate.count({ where })
    ]);
    ok(res, items, pageMeta(pagination, total));
  };
  const get3 = async (req, res) => {
    const item = await delegate.findUnique({ where: { id: idParam(req) }, include: options.include });
    if (!item) throw ApiError.notFound();
    ok(res, item);
  };
  const create = async (req, res) => {
    let data = body(req, options.createSchema);
    if (options.prepare) data = await options.prepare(data, req, "create");
    const item = await delegate.create({ data, include: options.include });
    await audit(req, { action: `${options.entity}.create`, entityType: options.entity, entityId: item.id });
    created(res, item);
  };
  const update2 = async (req, res) => {
    const id = idParam(req);
    let data = body(req, options.updateSchema);
    if (Object.keys(data).length === 0) throw ApiError.badRequest("No changes supplied");
    if (options.prepare) data = await options.prepare(data, req, "update");
    const item = await delegate.update({ where: { id }, data, include: options.include });
    await audit(req, { action: `${options.entity}.update`, entityType: options.entity, entityId: id, metadata: { fields: Object.keys(data) } });
    ok(res, item);
  };
  const remove = async (req, res) => {
    const id = idParam(req);
    await delegate.delete({ where: { id } });
    await audit(req, { action: `${options.entity}.delete`, entityType: options.entity, entityId: id });
    noContent(res);
  };
  router.get("/", guard, list3);
  router.get("/:id", guard, get3);
  router.post("/", guard, create);
  router.patch("/:id", guard, update2);
  if (options.allowDelete !== false) router.delete("/:id", guard, remove);
  return router;
}

// src/routes/alumni.routes.ts
var alumniRoutes = (0, import_express4.Router)();
var self = requirePermission(P.alumniSelf);
alumniRoutes.get("/directory", directory);
alumniRoutes.get("/directory/filters", filters);
alumniRoutes.get("/directory/:slug", publicProfile);
alumniRoutes.get("/stories", publicStories);
alumniRoutes.get("/stories/:slug", publicStory);
alumniRoutes.get("/registration-options", cohortsAndCourses);
alumniRoutes.post("/register", authLimiter, register);
alumniRoutes.get("/me", requireAuth, me2);
alumniRoutes.patch("/me", self, updateMe2);
alumniRoutes.put("/me/visibility", self, setVisibility);
alumniRoutes.get("/me/stories", self, myStories);
alumniRoutes.post("/me/stories", self, formLimiter, submitStory);
alumniRoutes.put("/me/stories/:id", self, updateStory);
alumniRoutes.get("/announcements", self, announcements);
alumniRoutes.post("/me/assistance", self, formLimiter, requestAssistance);
var alumniAdminRoutes = (0, import_express4.Router)();
var manage2 = requirePermission(P.alumniManage);
alumniAdminRoutes.get("/overview", manage2, overview);
alumniAdminRoutes.get("/registrations", manage2, listRegistrations);
alumniAdminRoutes.get("/registrations/:id", manage2, getRegistration);
alumniAdminRoutes.post("/registrations/:id/approve", manage2, approveRegistration);
alumniAdminRoutes.post("/registrations/:id/reject", manage2, rejectRegistration);
alumniAdminRoutes.get("/profiles", manage2, listProfiles);
alumniAdminRoutes.get("/profiles/:id", manage2, getProfile);
alumniAdminRoutes.patch("/profiles/:id", manage2, updateProfile);
alumniAdminRoutes.post("/profiles/:id/publication/approve", manage2, approvePublication);
alumniAdminRoutes.post("/profiles/:id/publication/reject", manage2, rejectPublication);
alumniAdminRoutes.post("/profiles/:id/archive", manage2, setArchived(true));
alumniAdminRoutes.post("/profiles/:id/unarchive", manage2, setArchived(false));
alumniAdminRoutes.get("/stories", manage2, listStories);
alumniAdminRoutes.patch("/stories/:id", manage2, updateStory2);
alumniAdminRoutes.post("/stories/:id/publish", manage2, storyAction("publish"));
alumniAdminRoutes.post("/stories/:id/reject", manage2, storyAction("reject"));
alumniAdminRoutes.post("/stories/:id/archive", manage2, storyAction("archive"));
alumniAdminRoutes.use(
  "/cohorts",
  crudRouter({
    delegate: prisma.alumniCohort,
    entity: "AlumniCohort",
    permission: P.alumniManage,
    createSchema: cohortSchema,
    updateSchema: cohortUpdateSchema,
    searchFields: ["name", "slug"],
    sortable: ["name", "graduationYear", "createdAt"],
    include: { _count: { select: { profiles: true } } }
  })
);
alumniAdminRoutes.use(
  "/announcements",
  crudRouter({
    delegate: prisma.alumniAnnouncement,
    entity: "AlumniAnnouncement",
    permission: P.alumniManage,
    createSchema: announcementSchema,
    updateSchema: announcementUpdateSchema,
    searchFields: ["titleEn", "titleBn"],
    sortable: ["createdAt", "publishedAt", "titleEn", "status"],
    filterSchema: announcementFilterSchema,
    filters: (f) => f.status ? { status: f.status } : {},
    prepare: (data) => data.status === "PUBLISHED" && !data.publishedAt ? { ...data, publishedAt: /* @__PURE__ */ new Date() } : data
  })
);

// src/routes/auth.routes.ts
var import_express5 = require("express");

// src/controllers/auth.controller.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
async function startSession(req, res, userId) {
  const { token } = await createSession(userId, { ip: req.ip, userAgent: req.get("user-agent") });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  const auth = await resolveSession(token);
  req.auth = auth ?? void 0;
  return auth;
}
function csrf(req, res) {
  ok(res, { csrfToken: issueCsrfToken(req, res) });
}
async function login(req, res) {
  const input = body(req, loginSchema);
  const user = await verifyCredentials(input.email, input.password);
  if (req.auth) await revokeSession(req.auth.sessionId);
  const auth = await startSession(req, res, user.id);
  await audit(req, { action: "auth.login", entityType: "User", entityId: user.id });
  ok(res, await buildMe(auth));
}
async function logout(req, res) {
  if (req.auth) {
    await revokeSession(req.auth.sessionId);
    await audit(req, { action: "auth.logout", entityType: "User", entityId: req.auth.id });
  }
  const options = sessionCookieOptions();
  delete options.maxAge;
  res.clearCookie(SESSION_COOKIE, options);
  ok(res, { loggedOut: true });
}
async function me3(req, res) {
  res.set("Cache-Control", "private, no-store");
  if (!req.auth) return ok(res, null);
  ok(res, await buildMe(req.auth));
}
async function register2(req, res) {
  const input = body(req, registerSchema);
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("An account with this email already exists. Please sign in instead.", "EMAIL_IN_USE");
  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      preferredLocale: input.preferredLocale,
      passwordHash: await hashPassword(input.password)
    }
  });
  await audit(req, { action: "auth.register", entityType: "User", entityId: user.id });
  const auth = await startSession(req, res, user.id);
  ok(res, await buildMe(auth), void 0, 201);
}
async function forgotPassword(req, res) {
  const input = body(req, forgotPasswordSchema);
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (user && user.isActive) {
    const token = await createPasswordToken(user.id, "reset", 1);
    const link = `${env.APP_URL.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password - The Bridge Institute",
      text: `Hello ${user.fullName},

Use this link to reset your password (valid for 1 hour):

${link}

If you did not request this, you can ignore this email.`
    });
    await audit(req, { action: "auth.password_reset_requested", entityType: "User", entityId: user.id });
  }
  ok(res, { message: "If an account exists for this email, a reset link has been sent." });
}
async function resetPassword(req, res) {
  const input = body(req, resetPasswordSchema);
  const userId = await consumePasswordToken(input.token, input.password);
  await audit(req, { action: "auth.password_reset", entityType: "User", entityId: userId });
  ok(res, { reset: true });
}
async function changePassword(req, res) {
  const auth = currentUser(req);
  const input = body(req, changePasswordSchema);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.id } });
  if (!user.passwordHash || !await import_bcryptjs2.default.compare(input.currentPassword, user.passwordHash)) {
    throw new ApiError(400, "INVALID_PASSWORD", "Current password is incorrect");
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: auth.id }, data: { passwordHash: await hashPassword(input.newPassword) } }),
    // Sign out every other device.
    prisma.session.updateMany({
      where: { userId: auth.id, revokedAt: null, NOT: { id: auth.sessionId } },
      data: { revokedAt: /* @__PURE__ */ new Date() }
    })
  ]);
  await audit(req, { action: "auth.password_changed", entityType: "User", entityId: auth.id });
  ok(res, { changed: true });
}
async function updateMe3(req, res) {
  const auth = currentUser(req);
  const input = body(req, updateMeSchema);
  await prisma.user.update({ where: { id: auth.id }, data: input });
  ok(res, await buildMe(auth));
}

// src/routes/auth.routes.ts
var authRoutes = (0, import_express5.Router)();
authRoutes.get("/csrf", csrf);
authRoutes.get("/me", me3);
authRoutes.patch("/me", requireAuth, updateMe3);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/logout", logout);
authRoutes.post("/register", authLimiter, register2);
authRoutes.post("/forgot-password", authLimiter, forgotPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);
authRoutes.post("/change-password", requireAuth, authLimiter, changePassword);

// src/routes/cms.routes.ts
var import_express6 = require("express");

// src/controllers/media.controller.ts
var import_multer2 = __toESM(require("multer"), 1);
var import_zod9 = require("zod");
var uploadMiddleware = (0, import_multer2.default)({
  storage: import_multer2.default.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 }
}).single("file");
var IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
var uploadFields = import_zod9.z.object({
  purpose: import_zod9.z.enum(["alumni-photo", "story-image", "cms-image", "learning-material"]),
  altText: import_zod9.z.string().trim().max(200).optional()
});
function rulesFor(req, purpose) {
  switch (purpose) {
    case "alumni-photo":
    case "story-image":
      if (!hasPermission(req, P.alumniSelf) && !hasPermission(req, P.alumniManage)) throw ApiError.forbidden();
      return { types: IMAGE_TYPES, visibility: "PUBLIC" };
    case "cms-image":
      if (!hasPermission(req, P.cmsEdit)) throw ApiError.forbidden();
      return { types: IMAGE_TYPES, visibility: "PUBLIC" };
    case "learning-material":
      if (!hasPermission(req, P.coursesManage)) throw ApiError.forbidden();
      return { types: [...IMAGE_TYPES, "application/pdf"], visibility: "PRIVATE" };
  }
}
async function upload(req, res) {
  const auth = currentUser(req);
  const fields = parse(uploadFields, req.body ?? {});
  const rules = rulesFor(req, fields.purpose);
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const type = detectFileType(req.file.buffer, rules.types);
  const { bucket, objectKey } = await putObject(rules.visibility, fields.purpose, type.ext, type.mime, req.file.buffer);
  const asset = await prisma.mediaAsset.create({
    data: {
      bucket,
      objectKey,
      fileName: sanitizeFileName(req.file.originalname),
      mimeType: type.mime,
      sizeBytes: req.file.size,
      visibility: rules.visibility,
      altText: fields.altText,
      uploadedById: auth.id
    }
  });
  await audit(req, { action: "media.upload", entityType: "MediaAsset", entityId: asset.id, metadata: { purpose: fields.purpose } });
  created(res, { id: asset.id, fileName: asset.fileName, mimeType: asset.mimeType, url: asset.visibility === "PUBLIC" ? publicUrl(bucket, objectKey) : null });
}
async function url(req, res) {
  const auth = currentUser(req);
  const asset = await prisma.mediaAsset.findUnique({ where: { id: idParam(req) }, include: { materials: { select: { courseId: true, isPublished: true } } } });
  if (!asset) throw ApiError.notFound();
  if (asset.visibility === "PUBLIC") return ok(res, { url: publicUrl(asset.bucket, asset.objectKey) });
  let allowed = asset.uploadedById === auth.id || hasPermission(req, P.coursesManage);
  if (!allowed && asset.materials.length) {
    const courseIds = asset.materials.filter((m) => m.isPublished).map((m) => m.courseId);
    allowed = courseIds.length > 0 && await prisma.enrollment.count({ where: { student: { userId: auth.id }, batch: { courseId: { in: courseIds } }, status: { not: "WITHDRAWN" } } }) > 0;
  }
  if (!allowed) throw ApiError.notFound();
  ok(res, { url: await signedUrl(asset.bucket, asset.objectKey) });
}

// src/routes/cms.routes.ts
var cmsRoutes = (0, import_express6.Router)();
cmsRoutes.get("/sections", publicSections);
cmsRoutes.get("/admin/sections", requirePermission(P.cmsEdit), adminSections);
cmsRoutes.put("/admin/sections/:key/:locale", requirePermission(P.cmsEdit), saveDraft);
cmsRoutes.post("/admin/sections/:key/:locale/publish", requirePermission(P.cmsPublish), publish);
cmsRoutes.post("/admin/sections/:key/:locale/unpublish", requirePermission(P.cmsPublish), unpublish);
var faqRoutes = (0, import_express6.Router)();
faqRoutes.get("/", publicFaqs);
faqRoutes.use(
  "/admin",
  crudRouter({
    delegate: prisma.faq,
    entity: "Faq",
    permission: P.faqsManage,
    createSchema: faqSchema,
    updateSchema: faqUpdateSchema,
    searchFields: ["questionEn", "questionBn"],
    sortable: ["sortOrder", "createdAt", "category"],
    defaultSort: "sortOrder",
    defaultOrder: "asc"
  })
);
var settingsRoutes = (0, import_express6.Router)();
settingsRoutes.get("/public", publicSettings);
settingsRoutes.get("/", requirePermission(P.settingsManage), adminSettings);
settingsRoutes.put("/:key", requirePermission(P.settingsManage), updateSetting);
var mediaRoutes = (0, import_express6.Router)();
mediaRoutes.post("/", requireAuth, uploadMiddleware, upload);
mediaRoutes.get("/:id/url", requireAuth, url);

// src/routes/courses.routes.ts
var import_express7 = require("express");

// src/controllers/courses.controller.ts
var import_zod10 = require("zod");

// src/services/course.service.ts
var courseInclude = {
  translations: true,
  topics: { orderBy: { sortOrder: "asc" } },
  outcomes: { orderBy: { sortOrder: "asc" } },
  category: true
};
function localizeCourse(course, locale3) {
  const en = course.translations.find((t) => t.locale === "en");
  const tr = course.translations.find((t) => t.locale === locale3) ?? en;
  const pick = (enText, bnText) => locale3 === "bn" && bnText ? bnText : enText;
  return {
    id: course.id,
    slug: course.slug,
    icon: course.icon,
    sortOrder: course.sortOrder,
    locale: tr?.locale ?? "en",
    title: tr?.title ?? "",
    summary: tr?.summary ?? "",
    description: tr?.description ?? "",
    duration: tr?.duration ?? en?.duration ?? null,
    category: course.category ? { slug: course.category.slug, name: pick(course.category.nameEn, course.category.nameBn) } : null,
    topics: course.topics.map((t) => pick(t.textEn, t.textBn)),
    outcomes: course.outcomes.map((o) => pick(o.textEn, o.textBn))
  };
}
var publishedCourses = () => prisma.course.findMany({ where: { status: "PUBLISHED" }, include: courseInclude, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
function adminCourse(course) {
  const byLocale = (locale3) => {
    const t = course.translations.find((x) => x.locale === locale3);
    return t ? { title: t.title, summary: t.summary, description: t.description, duration: t.duration } : null;
  };
  return {
    id: course.id,
    slug: course.slug,
    icon: course.icon,
    status: course.status,
    sortOrder: course.sortOrder,
    categoryId: course.categoryId,
    category: course.category,
    publishedAt: course.publishedAt,
    updatedAt: course.updatedAt,
    translations: { en: byLocale("en"), bn: byLocale("bn") },
    topics: course.topics.map((t) => ({ en: t.textEn, bn: t.textBn })),
    outcomes: course.outcomes.map((o) => ({ en: o.textEn, bn: o.textBn }))
  };
}

// src/controllers/courses.controller.ts
var localeQuery2 = import_zod10.z.object({ locale: import_zod10.z.enum(["en", "bn"]).default("en") });
var slugParam2 = import_zod10.z.object({ slug: import_zod10.z.string().regex(/^[a-z0-9-]{1,80}$/) });
async function listPublic(req, res) {
  const { locale: locale3 } = parse(localeQuery2, req.query);
  const courses = await publishedCourses();
  res.set("Cache-Control", "no-cache");
  ok(res, courses.map((c) => localizeCourse(c, locale3)));
}
async function getPublic(req, res) {
  const { locale: locale3 } = parse(localeQuery2, req.query);
  const params = slugParam2.safeParse(req.params);
  if (!params.success) throw ApiError.notFound("Course not found");
  const course = await prisma.course.findFirst({ where: { slug: params.data.slug, status: "PUBLISHED" }, include: courseInclude });
  if (!course) throw ApiError.notFound("Course not found");
  res.set("Cache-Control", "no-cache");
  ok(res, localizeCourse(course, locale3));
}
var adminFilter = import_zod10.z.object({ status: import_zod10.z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional() });
async function adminList(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(adminFilter, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? { translations: { some: { title: { contains: p.q, mode: "insensitive" } } } } : {}
  };
  const [items, total] = await Promise.all([
    prisma.course.findMany({ where, include: courseInclude, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], ...pageArgs(p) }),
    prisma.course.count({ where })
  ]);
  ok(res, items.map(adminCourse), pageMeta(p, total));
}
async function adminGet(req, res) {
  const course = await prisma.course.findUnique({ where: { id: idParam(req) }, include: courseInclude });
  if (!course) throw ApiError.notFound();
  ok(res, adminCourse(course));
}
var translationRows = (t) => ({
  title: t.title,
  summary: t.summary,
  description: t.description,
  duration: t.duration
});
async function adminCreate(req, res) {
  const input = body(req, courseSchema);
  const slug = input.slug ?? slugify(input.translations.en.title);
  const course = await prisma.course.create({
    data: {
      slug,
      icon: input.icon,
      categoryId: input.categoryId,
      sortOrder: input.sortOrder,
      status: "DRAFT",
      translations: {
        create: [
          { locale: "en", ...translationRows(input.translations.en) },
          ...input.translations.bn ? [{ locale: "bn", ...translationRows(input.translations.bn) }] : []
        ]
      },
      topics: { create: input.topics.map((t, i) => ({ sortOrder: i, textEn: t.en, textBn: t.bn })) },
      outcomes: { create: input.outcomes.map((o, i) => ({ sortOrder: i, textEn: o.en, textBn: o.bn })) }
    },
    include: courseInclude
  });
  await audit(req, { action: "course.create", entityType: "Course", entityId: course.id });
  created(res, adminCourse(course));
}
async function adminUpdate(req, res) {
  const id = idParam(req);
  const input = body(req, courseUpdateSchema);
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound();
  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id },
      data: {
        ...input.slug ? { slug: input.slug } : {},
        ...input.icon ? { icon: input.icon } : {},
        ...input.categoryId !== void 0 ? { categoryId: input.categoryId } : {},
        ...input.sortOrder !== void 0 ? { sortOrder: input.sortOrder } : {}
      }
    });
    for (const locale3 of ["en", "bn"]) {
      const t = input.translations?.[locale3];
      if (!t) continue;
      await tx.courseTranslation.upsert({
        where: { courseId_locale: { courseId: id, locale: locale3 } },
        update: translationRows(t),
        create: { courseId: id, locale: locale3, ...translationRows(t) }
      });
    }
    if (input.topics) {
      await tx.courseTopic.deleteMany({ where: { courseId: id } });
      await tx.courseTopic.createMany({ data: input.topics.map((t, i) => ({ courseId: id, sortOrder: i, textEn: t.en, textBn: t.bn })) });
    }
    if (input.outcomes) {
      await tx.learningOutcome.deleteMany({ where: { courseId: id } });
      await tx.learningOutcome.createMany({ data: input.outcomes.map((o, i) => ({ courseId: id, sortOrder: i, textEn: o.en, textBn: o.bn })) });
    }
    await audit(req, { action: "course.update", entityType: "Course", entityId: id, metadata: { fields: Object.keys(input) } }, tx);
  });
  const course = await prisma.course.findUniqueOrThrow({ where: { id }, include: courseInclude });
  ok(res, adminCourse(course));
}
async function adminSetStatus(req, res) {
  const id = idParam(req);
  const { status } = body(req, courseStatusSchema);
  const existing = await prisma.course.findUnique({ where: { id }, include: { translations: true } });
  if (!existing) throw ApiError.notFound();
  if (status === "PUBLISHED" && !existing.translations.some((t) => t.locale === "en")) {
    throw ApiError.badRequest("An English translation is required before publishing");
  }
  const course = await prisma.course.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? /* @__PURE__ */ new Date() : existing.publishedAt },
    include: courseInclude
  });
  await audit(req, { action: `course.status.${status.toLowerCase()}`, entityType: "Course", entityId: id });
  ok(res, adminCourse(course));
}
async function adminReorder(req, res) {
  const { ids } = body(req, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.course.update({ where: { id }, data: { sortOrder: index } })));
  await audit(req, { action: "course.reorder", entityType: "Course", metadata: { ids } });
  ok(res, { reordered: ids.length });
}
async function adminDelete(req, res) {
  const id = idParam(req);
  const course = await prisma.course.findUnique({ where: { id }, include: { _count: { select: { batches: true, alumni: true, cohorts: true } } } });
  if (!course) throw ApiError.notFound();
  if (course.status !== "DRAFT" || course._count.batches || course._count.alumni || course._count.cohorts) {
    throw ApiError.conflict("Only unused draft courses can be deleted. Archive this course instead.", "IN_USE");
  }
  await prisma.course.delete({ where: { id } });
  await audit(req, { action: "course.delete", entityType: "Course", entityId: id });
  noContent(res);
}

// src/routes/courses.routes.ts
var courseRoutes = (0, import_express7.Router)();
var manage3 = requirePermission(P.coursesManage);
courseRoutes.get("/admin", manage3, adminList);
courseRoutes.post("/admin", manage3, adminCreate);
courseRoutes.post("/admin/reorder", manage3, adminReorder);
courseRoutes.get("/admin/:id", manage3, adminGet);
courseRoutes.put("/admin/:id", manage3, adminUpdate);
courseRoutes.post("/admin/:id/status", manage3, adminSetStatus);
courseRoutes.delete("/admin/:id", manage3, adminDelete);
courseRoutes.get("/", listPublic);
courseRoutes.get("/:slug", getPublic);
var courseCategoryRoutes = crudRouter({
  delegate: prisma.courseCategory,
  entity: "CourseCategory",
  permission: P.coursesManage,
  createSchema: categorySchema,
  updateSchema: categorySchema.partial(),
  searchFields: ["nameEn", "slug"],
  sortable: ["sortOrder", "nameEn", "createdAt"],
  defaultSort: "sortOrder",
  defaultOrder: "asc",
  include: { _count: { select: { courses: true } } }
});
var learningMaterialRoutes = crudRouter({
  delegate: prisma.learningMaterial,
  entity: "LearningMaterial",
  permission: P.coursesManage,
  createSchema: materialSchema,
  updateSchema: materialSchema.partial(),
  searchFields: ["title"],
  sortable: ["sortOrder", "title", "createdAt"],
  defaultSort: "sortOrder",
  defaultOrder: "asc",
  filterSchema: materialFilterSchema,
  filters: (f) => f.courseId ? { courseId: f.courseId } : {}
});

// src/routes/engagement.routes.ts
var import_express8 = require("express");

// src/controllers/engagement.controller.ts
async function submitInquiry(req, res) {
  const input = body(req, partnershipInquirySchema);
  const inquiry = await prisma.partnershipInquiry.create({
    data: {
      organizationName: input.organizationName,
      contactName: input.contactName,
      workEmail: input.workEmail,
      phone: input.phone,
      website: input.website,
      interest: input.interest,
      message: input.message,
      consentAt: /* @__PURE__ */ new Date()
    },
    select: { id: true, createdAt: true }
  });
  created(res, inquiry);
}
async function listInquiries(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(inquiryFilterSchema, req.query);
  const where = {
    ...f.status ? { status: f.status } : {},
    ...p.q ? { OR: [{ organizationName: { contains: p.q, mode: "insensitive" } }, { contactName: { contains: p.q, mode: "insensitive" } }, { workEmail: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.partnershipInquiry.findMany({ where, orderBy: orderBy(p, ["createdAt", "status", "organizationName"]), ...pageArgs(p), include: { company: { select: { id: true, name: true } } } }),
    prisma.partnershipInquiry.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function getInquiry(req, res) {
  const inquiry = await prisma.partnershipInquiry.findUnique({
    where: { id: idParam(req) },
    include: {
      company: { select: { id: true, name: true } },
      interactions: { orderBy: { occurredAt: "desc" }, include: { author: { select: { fullName: true } } } }
    }
  });
  if (!inquiry) throw ApiError.notFound();
  ok(res, inquiry);
}
async function updateInquiry(req, res) {
  const id = idParam(req);
  const input = body(req, inquiryUpdateSchema);
  const inquiry = await prisma.partnershipInquiry.update({ where: { id }, data: input });
  await audit(req, { action: "inquiry.update", entityType: "PartnershipInquiry", entityId: id, metadata: input });
  ok(res, inquiry);
}
async function addInteraction(req, res) {
  const id = idParam(req);
  const input = body(req, interactionSchema);
  const inquiry = await prisma.partnershipInquiry.findUnique({ where: { id } });
  if (!inquiry) throw ApiError.notFound();
  const interaction = await prisma.partnershipInteraction.create({
    data: { inquiryId: id, companyId: inquiry.companyId, authorId: currentUser(req).id, type: input.type, note: input.note },
    include: { author: { select: { fullName: true } } }
  });
  created(res, interaction);
}
async function convertInquiry(req, res) {
  const id = idParam(req);
  const company = await prisma.$transaction(async (tx) => {
    const inquiry = await tx.partnershipInquiry.findUnique({ where: { id } });
    if (!inquiry) throw ApiError.notFound();
    if (inquiry.companyId) throw ApiError.conflict("This inquiry is already linked to a company");
    const company2 = await tx.company.create({
      data: {
        name: inquiry.organizationName,
        website: inquiry.website,
        contactName: inquiry.contactName,
        contactEmail: inquiry.workEmail,
        phone: inquiry.phone,
        status: "PROSPECT"
      }
    });
    await tx.partnershipInquiry.update({ where: { id }, data: { companyId: company2.id } });
    await audit(req, { action: "inquiry.convert", entityType: "PartnershipInquiry", entityId: id, metadata: { companyId: company2.id } }, tx);
    return company2;
  });
  created(res, company);
}
async function availableOpportunities(req, res) {
  const audiences = [];
  if (hasPermission(req, P.studentSelf)) audiences.push("STUDENTS");
  if (hasPermission(req, P.alumniSelf)) audiences.push("ALUMNI");
  if (!audiences.length) throw ApiError.forbidden("Opportunities are available to enrolled students and verified alumni");
  audiences.push("ALL");
  const items = await prisma.opportunity.findMany({
    where: { status: "PUBLISHED", audience: { in: audiences }, OR: [{ deadline: null }, { deadline: { gte: /* @__PURE__ */ new Date() } }] },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      title: true,
      type: true,
      description: true,
      location: true,
      applyUrl: true,
      deadline: true,
      audience: true,
      company: { select: { name: true, website: true } }
    }
  });
  ok(res, items);
}
async function submitContact(req, res) {
  const input = body(req, contactSchema);
  const message = await prisma.contactMessage.create({
    data: { ...input, userId: req.auth?.id },
    select: { id: true, createdAt: true }
  });
  created(res, message);
}
async function listContact(req, res) {
  const p = parse(paginationSchema, req.query);
  const f = parse(contactFilterSchema, req.query);
  const where = {
    ...f.isRead ? { isRead: f.isRead === "true" } : {},
    ...f.category ? { category: f.category } : {},
    ...p.q ? { OR: [{ name: { contains: p.q, mode: "insensitive" } }, { email: { contains: p.q, mode: "insensitive" } }, { subject: { contains: p.q, mode: "insensitive" } }] } : {}
  };
  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: orderBy(p, ["createdAt", "isRead"]), ...pageArgs(p) }),
    prisma.contactMessage.count({ where })
  ]);
  ok(res, items, pageMeta(p, total));
}
async function updateContact(req, res) {
  const id = idParam(req);
  const { isRead } = body(req, contactUpdateSchema);
  const message = await prisma.contactMessage.update({ where: { id }, data: { isRead, readAt: isRead ? /* @__PURE__ */ new Date() : null } });
  ok(res, message);
}
async function deleteContact(req, res) {
  const id = idParam(req);
  await prisma.contactMessage.delete({ where: { id } });
  await audit(req, { action: "contact.delete", entityType: "ContactMessage", entityId: id });
  noContent(res);
}
async function listPublicPartners(_req, res) {
  const partners = await prisma.company.findMany({
    where: { listedPublicly: true, status: "ACTIVE" },
    select: { name: true, industry: true, website: true },
    orderBy: { name: "asc" }
  });
  res.set("Cache-Control", "no-cache");
  ok(res, partners);
}

// src/routes/engagement.routes.ts
var companies = requirePermission(P.companiesManage);
var companyRoutes = (0, import_express8.Router)();
companyRoutes.get("/partners", listPublicPartners);
companyRoutes.use(
  crudRouter({
    delegate: prisma.company,
    entity: "Company",
    permission: P.companiesManage,
    createSchema: companySchema,
    updateSchema: companyUpdateSchema,
    searchFields: ["name", "industry", "contactName"],
    sortable: ["name", "createdAt", "status"],
    filterSchema: companyFilterSchema,
    filters: (f) => f.status ? { status: f.status } : {},
    include: { _count: { select: { opportunities: true, inquiries: true } } }
  })
);
var inquiryRoutes = (0, import_express8.Router)();
inquiryRoutes.post("/", formLimiter, submitInquiry);
inquiryRoutes.get("/", companies, listInquiries);
inquiryRoutes.get("/:id", companies, getInquiry);
inquiryRoutes.patch("/:id", companies, updateInquiry);
inquiryRoutes.post("/:id/interactions", companies, addInteraction);
inquiryRoutes.post("/:id/convert", companies, convertInquiry);
var opportunityRoutes = (0, import_express8.Router)();
opportunityRoutes.get("/available", requireAuth, availableOpportunities);
opportunityRoutes.use(
  crudRouter({
    delegate: prisma.opportunity,
    entity: "Opportunity",
    permission: P.companiesManage,
    createSchema: opportunitySchema,
    updateSchema: opportunityUpdateSchema,
    searchFields: ["title", "description"],
    sortable: ["createdAt", "deadline", "title", "status"],
    filterSchema: opportunityFilterSchema,
    filters: (f) => ({ ...f.status ? { status: f.status } : {}, ...f.audience ? { audience: f.audience } : {} }),
    include: { company: { select: { id: true, name: true } } }
  })
);
var contactRoutes = (0, import_express8.Router)();
var contact = requirePermission(P.contactManage);
contactRoutes.post("/", formLimiter, submitContact);
contactRoutes.get("/", contact, listContact);
contactRoutes.patch("/:id", contact, updateContact);
contactRoutes.delete("/:id", contact, deleteContact);

// src/routes/index.ts
var apiRouter = (0, import_express9.Router)();
apiRouter.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ data: { status: "ok", database: "ok" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unreachable";
    const detail = message.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://redacted").slice(0, 240);
    res.status(503).json({ data: { status: "degraded", database: "unreachable", detail } });
  }
});
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/roles", roleRoutes);
apiRouter.use("/courses", courseRoutes);
apiRouter.use("/course-categories", courseCategoryRoutes);
apiRouter.use("/learning-materials", learningMaterialRoutes);
apiRouter.use("/applications", applicationRoutes);
apiRouter.use("/students", studentRoutes);
apiRouter.use("/batches", batchRoutes);
apiRouter.use("/enrollments", enrollmentRoutes);
apiRouter.use("/attendance", attendanceRoutes);
apiRouter.use("/assessments", assessmentRoutes);
apiRouter.use("/results", resultRoutes);
apiRouter.use("/certificates", certificateRoutes);
apiRouter.use("/companies", companyRoutes);
apiRouter.use("/partnership-inquiries", inquiryRoutes);
apiRouter.use("/opportunities", opportunityRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/alumni", alumniRoutes);
apiRouter.use("/admin/alumni", alumniAdminRoutes);
apiRouter.use("/admin/dashboard", dashboardRoutes);
apiRouter.use("/cms", cmsRoutes);
apiRouter.use("/faqs", faqRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/audit-logs", auditRoutes);
apiRouter.use("/media", mediaRoutes);

// src/app.ts
function createApp() {
  const app = (0, import_express10.default)();
  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);
  app.use(requestId);
  app.use(
    (0, import_pino_http.pinoHttp)({
      logger,
      genReqId: (req) => req.id,
      customLogLevel: (_req, res, err) => err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode })
      }
    })
  );
  app.use(
    (0, import_helmet.default)({
      // The API only serves JSON; a locked-down CSP is safe.
      contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
      crossOriginResourcePolicy: { policy: "same-site" }
    })
  );
  app.use(
    (0, import_cors.default)({
      origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "X-CSRF-Token", "X-Request-Id"],
      maxAge: 600
    })
  );
  app.use(import_express10.default.json({ limit: "200kb" }));
  app.use(import_express10.default.urlencoded({ extended: false, limit: "50kb" }));
  app.use((0, import_cookie_parser.default)());
  app.use("/api/v1", globalLimiter, loadSession, csrfProtection, apiRouter);
  app.get("/", (_req, res) => res.json({ data: { name: "The Bridge Institute API", docs: "/api/v1/health" } }));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
function configurationErrorApp(message) {
  const app = (0, import_express10.default)();
  app.disable("x-powered-by");
  app.use((_req, res) => {
    res.status(500).json({
      data: { status: "degraded", database: "unreachable" },
      error: { code: "CONFIG", message }
    });
  });
  return app;
}
var app_default = envError ? configurationErrorApp(envError) : createApp();

// src/server.ts
var server_default = app_default;
if (!process.env.VERCEL) {
  const server = app_default.listen(env.PORT, () => {
    logger.info(`The Bridge Institute API listening on http://localhost:${env.PORT}/api/v1`);
  });
  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 1e4).unref();
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}
/*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/
module.exports = module.exports.default ?? module.exports;

