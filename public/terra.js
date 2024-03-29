! function(t) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var e;
    "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.terra = t()
  }
}(function() {
  var t;
  return function e(t, n, r) {
    function o(a, u) {
      if (!n[a]) {
        if (!t[a]) {
          var c = "function" == typeof require && require;
          if (!u && c) return c(a, !0);
          if (i) return i(a, !0);
          var f = new Error("Cannot find module '" + a + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var s = n[a] = {
          exports: {}
        };
        t[a][0].call(s.exports, function(e) {
          var n = t[a][1][e];
          return o(n ? n : e)
        }, s, s.exports, e, t, n, r)
      }
      return n[a].exports
    }
    for (var i = "function" == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
    return o
  }({
    1: [function(t, e) {
      var n = t("./terrarium.js"),
        r = t("./creature.js");
      e.exports = {
        Terrarium: n,
        registerCreature: r.registerCreature,
        registerCA: r.registerCA
      }
    }, {
      "./creature.js": 2,
      "./terrarium.js": 5
    }],
    2: [function(t, e) {
      var n = t("./util.js"),
        r = function() {
          function t() {
            this.age = -1
          }

          function e() {
            this.age = -1
          }
          t.prototype.initialEnergy = 50, t.prototype.maxEnergy = 100, t.prototype.efficiency = .7, t.prototype.size = 50, t.prototype.actionRadius = 1, t.prototype.sustainability = 2, t.prototype.reproduceLv = .7, t.prototype.moveLv = 0, t.prototype.boundEnergy = function() {
            this.energy > this.maxEnergy && (this.energy = this.maxEnergy)
          }, t.prototype.isDead = function() {
            return this.energy <= 0
          }, t.prototype.reproduce = function(t) {
            var e = n.filter(t, function(t) {
              return !t.creature
            });
            if (e.length) {
              var o = e[n.random(e.length - 1)],
                i = o.coords,
                a = r.make(this.type),
                u = function() {
                  return this.energy -= this.initialEnergy, !0
                }.bind(this),
                c = this.wait;
              return {
                x: i.x,
                y: i.y,
                creature: a,
                successFn: u,
                failureFn: c
              }
            }
            return !1
          }, t.prototype.move = function(t) {
            var e = this,
              r = n.filter(t, function(t) {
                return t.creature.size < this.size
              }.bind(this));
            if (r.length < this.sustainability && (r = n.filter(t, function(t) {
                return !t.creature
              })), r.length) {
              var o = r[n.random(r.length - 1)],
                i = o.coords,
                a = function() {
                  var t = o.creature.energy * this.efficiency;
                  return this.energy = this.energy + (t || -10), !1
                }.bind(this);
              return {
                x: i.x,
                y: i.y,
                creature: e,
                successFn: a
              }
            }
            return !1
          }, t.prototype.wait = function() {
            return this.energy -= 5, !0
          }, t.prototype.process = function(t) {
            var e = {},
              n = this.maxEnergy;
            this.energy > n * this.reproduceLv && this.reproduce ? e = this.reproduce(t) : this.energy > n * this.moveLv && this.move && (e = this.move(t));
            var r = e.creature;
            return r ? (r.successFn = e.successFn || r.wait, r.failureFn = e.failureFn || r.wait, {
              x: e.x,
              y: e.y,
              creature: r,
              observed: !0
            }) : this.energy !== this.maxEnergy
          }, e.prototype.actionRadius = 1, e.prototype.boundEnergy = function() {}, e.prototype.isDead = function() {
            return !1
          }, e.prototype.process = function() {}, e.prototype.wait = function() {};
          var o = {};
          return {
            make: function(t, e) {
              var n = o[t];
              return n ? new n(e) : !1
            },
            registerCreature: function(e, r) {
              var i = e.type;
              if ("string" == typeof i && "undefined" == typeof o[i]) {
                o[i] = "function" == typeof r ? function() {
                  this.energy = this.initialEnergy, r.call(this)
                } : function() {
                  this.energy = this.initialEnergy
                };
                var a = e.color || e.colour;
                return ("object" != typeof a || 3 !== a.length) && (e.color = [n.random(255), n.random(255), n.random(255)]), o[i].prototype = new t, o[i].prototype.constructor = o[i], n.each(e, function(t, e) {
                  o[i].prototype[e] = t
                }), o[i].prototype.successFn = o[i].prototype.wait, o[i].prototype.failureFn = o[i].prototype.wait, o[i].prototype.energy = e.initialEnergy, !0
              }
              return !1
            },
            registerCA: function(t, r) {
              var i = t.type;
              if ("string" == typeof i && "undefined" == typeof o[i]) {
                o[i] = "function" == typeof r ? function() {
                  r.call(this)
                } : function() {};
                var a = t.color = t.color || t.colour;
                return ("object" != typeof a || 3 !== a.length) && (t.color = [n.random(255), n.random(255), n.random(255)]), t.colorFn = t.colorFn || t.colourFn, o[i].prototype = new e, o[i].prototype.constructor = o[i], n.each(t, function(t, e) {
                  o[i].prototype[e] = t
                }), !0
              }
              return !1
            }
          }
        }();
      e.exports = r
    }, {
      "./util.js": 6
    }],
    3: [function(t, e) {
      var n = t("./util.js");
      e.exports = function(t, e, r, o, i) {
        var a = t.getContext("2d");
        if (o && i) a.fillStyle = "rgba(" + i + "," + (1 - o) + ")", a.fillRect(0, 0, t.width, t.height);
        else {
          if (o) throw "Background must also be set for trails";
          a.clearRect(0, 0, t.width, t.height)
        }
        n.each(e, function(t, e) {
          n.each(t, function(t, n) {
            if (t) {
              var o = t.colorFn ? t.colorFn() : t.color + "," + t.energy / t.maxEnergy;
              a.fillStyle = "rgba(" + o + ")", t.character ? a.fillText(t.character, e * r, n * r + r) : a.fillRect(e * r, n * r, r, r)
            }
          })
        })
      }
    }, {
      "./util.js": 6
    }],
    4: [function(t, e) {
      var n = function(t, e, n, r, o, i) {
        function a() {
          var o = document.createElement("canvas"),
            a = o.getContext("2d"),
            u = function() {
              var t = document.createElement("canvas").getContext("2d"),
                e = window.devicePixelRatio || 1,
                n = t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1;
              return e / n
            }();
          return o.width = t * u, o.height = e * u, o.style.width = t + "px", o.style.height = e + "px", a.scale(u, u), a.font = "bold " + n + "px Arial", r && (o.id = r), i && (o.style.background = "rgb(" + i + ")"), o
        }
        t *= n, e *= n;
        var u = a();
        return o ? o.parentNode.insertBefore(u, o.nextSibling) : document.body.appendChild(u), u
      };
      e.exports = {
        createCanvasElement: n
      }
    }, {}],
    5: [function(t, e) {
      function n(t, e, n) {
        var o, i;
        t = Math.ceil(t), e = Math.ceil(e), n = n || {}, o = n.cellSize || 10, i = n.neighborhood || n.neighbourhood, "string" == typeof i && (i = i.toLowerCase()), this.width = t, this.height = e, this.cellSize = o, this.trails = n.trails, this.background = n.background, this.canvas = a.createCanvasElement(t, e, o, n.id, n.insertAfter, this.background), this.grid = [], this.nextFrame = !1, this.hasChanged = !1, this.getNeighborCoords = r.getNeighborCoordsFn(t, e, "vonneumann" === i, n.periodic)
      }
      var r = t("./util"),
        o = t("./creature.js"),
        i = t("./display.js"),
        a = t("./dom.js");
      n.prototype.makeGrid = function(t) {
        for (var e = [], n = typeof t, r = 0, i = this.width; i > r; r++) {
          e.push([]);
          for (var a = 0, u = this.height; u > a; a++) e[r].push(o.make("function" === n ? t(r, a) : "object" === n && t.length ? (t[a] || [])[r] : "string" === n ? t : void 0))
        }
        return e
      }, n.prototype.makeGridWithDistribution = function(t) {
        for (var e = [], n = 0, i = this.width; i > n; n++) {
          e.push([]);
          for (var a = 0, u = this.height; u > a; a++) e[n].push(o.make(r.pickRandomWeighted(t)))
        }
        return e
      }, n.prototype.step = function(t) {
        function e(t) {
          if (t) {
            var e = r.assign(new t.constructor, t),
              n = e && e.isDead();
            return n && !p.hasChanged && (p.hasChanged = !0), e.age++, n ? !1 : e
          }
          return !1
        }

        function n(t) {
          return r.map(t, e)
        }

        function o(t) {
          return {
            coords: t,
            creature: h[t.x][t.y]
          }
        }

        function i(t) {
          var e = t.creature;
          e ? (e.failureFn(), e.boundEnergy()) : (t.wait(), t.boundEnergy())
        }

        function a(t, e, n) {
          if (t) {
            var a = r.map(p.getNeighborCoords(e, n, t.actionRadius), o),
              u = t.process(a, e, n);
            if ("object" == typeof u) {
              var c = l[u.x],
                f = u.creature,
                s = u.y;
              c[s] || (c[s] = []), c[s].push({
                x: e,
                y: n,
                creature: f
              }), !p.hasChanged && u.observed && (p.hasChanged = !0)
            } else u && !p.hasChanged && (p.hasChanged = !0), i(t)
          }
        }

        function u(t, e) {
          r.each(t, function(t, n) {
            a(t, e, n)
          })
        }

        function c(t, e, n) {
          if (t) {
            var o = t.splice(r.random(t.length - 1), 1)[0],
              a = o.creature;
            a.successFn() || (s[o.x][o.y] = !1), a.boundEnergy(), s[e][n] = a, r.each(t, i)
          }
        }

        function f(t, e) {
          r.each(t, function(t, n) {
            c(t, e, n)
          })
        }
        var s, l, p = this,
          h = (this.width, this.height, this.grid);
        for ("number" != typeof t && (t = 1); t--;)
          if (this.hasChanged = !1, h = s ? r.clone(s) : this.grid, s = r.map(h, n), l = this.makeGrid(), r.each(s, u), r.each(l, f), !this.hasChanged) return !1;
        return s
      }, n.prototype.draw = function() {
        i(this.canvas, this.grid, this.cellSize, this.trails, this.background)
      }, n.prototype.animate = function(t, e) {
        function n() {
          var grid = o.step();

          if (grid) {
            o.grid = grid;
            o.draw();

            if (e) e();

            return (++r !== t)
              ? o.nextFrame = requestAnimationFrame(n)
              : o.nextFrame = !1
          }
        }
        var nextFrame = this.nextFrame;
        if ("function" == typeof t && (e = t, t = null), !nextFrame) {
          var r = 0,
            o = this;
          o.nextFrame = requestAnimationFrame(n)
        }
      }, n.prototype.stop = function() {
        var nextFrame = this.nextFrame;
        cancelAnimationFrame(nextFrame), this.nextFrame = !1
      }, n.prototype.destroy = function() {
        var t = this.canvas;
        this.stop(), t.parentNode.removeChild(t)
      }, e.exports = n
    }, {
      "./creature.js": 2,
      "./display.js": 3,
      "./dom.js": 4,
      "./util": 6
    }],
    6: [function(t, e) {
      t("../bower_components/seedrandom/seedrandom.js")("terra :)", {
        global: !0
      });
      var n = t("../lodash_custom/lodash.custom.min.js")._;
      n.getNeighborCoordsFn = function(t, e, n, r) {
        return r ? n ? function(n, r, o) {
          var i, a, u, c, f, s = [];
          for (a = -o; o >= a; ++a)
            for (f = o - Math.abs(a), c = -f; f >= c; ++c) i = ((a + n) % t + t) % t, u = ((c + r) % e + e) % e, (i !== n || u !== r) && s.push({
              x: i,
              y: u
            });
          return s
        } : function(n, r, o) {
          var i, a, u, c, f, s, l = [];
          for (a = n - o, f = r - o, u = n + o, s = r + o, i = a; u >= i; ++i)
            for (c = f; s >= c; ++c)(i !== n || c !== r) && l.push({
              x: (i % t + t) % t,
              y: (c % e + e) % e
            });
          return l
        } : (t -= 1, e -= 1, n ? function(n, r, o) {
          var i, a, u, c, f, s = [];
          for (a = -o; o >= a; ++a)
            for (f = o - Math.abs(a), c = -f; f >= c; ++c) i = a + n, u = c + r, i >= 0 && u >= 0 && t >= i && e >= u && (i !== n || u !== r) && s.push({
              x: i,
              y: u
            });
          return s
        } : function(n, r, o) {
          var i, a, u, c, f, s, l = [];
          for (a = Math.max(0, n - o), f = Math.max(0, r - o), u = Math.min(n + o, t), s = Math.min(r + o, e), i = a; u >= i; ++i)
            for (c = f; s >= c; ++c)(i !== n || c !== r) && l.push({
              x: i,
              y: c
            });
          return l
        })
      }, n.pickRandomWeighted = function(t) {
        var e, r, o = 0,
          i = n.random(100, !0);
        for (r = 0, _len = t.length; _len > r; r++)
          if (e = t[r], o += e[1], o > i) return e[0];
        return !1
      }, e.exports = n
    }, {
      "../bower_components/seedrandom/seedrandom.js": 7,
      "../lodash_custom/lodash.custom.min.js": 8
    }],
    7: [function(e, n) {
      ! function(t, e, n, r, o, i, a, u, c) {
        function f(t) {
          var e, n = t.length,
            o = this,
            i = 0,
            a = o.i = o.j = 0,
            u = o.S = [];
          for (n || (t = [n++]); r > i;) u[i] = i++;
          for (i = 0; r > i; i++) u[i] = u[a = v & a + t[i % n] + (e = u[i])], u[a] = e;
          (o.g = function(t) {
            for (var e, n = 0, i = o.i, a = o.j, u = o.S; t--;) e = u[i = v & i + 1], n = n * r + u[v & (u[i] = u[a = v & a + e]) + (u[a] = e)];
            return o.i = i, o.j = a, n
          })(r)
        }

        function s(t, e) {
          var n, r = [],
            o = typeof t;
          if (e && "object" == o)
            for (n in t) try {
              r.push(s(t[n], e - 1))
            } catch (i) {}
          return r.length ? r : "string" == o ? t : t + "\x00"
        }

        function l(t, e) {
          for (var n, r = t + "", o = 0; o < r.length;) e[v & o] = v & (n ^= 19 * e[v & o]) + r.charCodeAt(o++);
          return h(e)
        }

        function p(n) {
          try {
            return t.crypto.getRandomValues(n = new Uint8Array(r)), h(n)
          } catch (o) {
            return [+new Date, t, (n = t.navigator) && n.plugins, t.screen, h(e)]
          }
        }

        function h(t) {
          return String.fromCharCode.apply(0, t)
        }
        var y = n.pow(r, o),
          g = n.pow(2, i),
          d = 2 * g,
          v = r - 1,
          m = n["seed" + c] = function(t, i, a) {
            var u = [];
            i = 1 == i ? {
              entropy: !0
            } : i || {};
            var v = l(s(i.entropy ? [t, h(e)] : null == t ? p() : t, 3), u),
              m = new f(u);
            return l(h(m.S), e), (i.pass || a || function(t, e, r) {
              return r ? (n[c] = t, e) : t
            })(function() {
              for (var t = m.g(o), e = y, n = 0; g > t;) t = (t + n) * r, e *= r, n = m.g(1);
              for (; t >= d;) t /= 2, e /= 2, n >>>= 1;
              return (t + n) / e
            }, v, "global" in i ? i.global : this == n)
          };
        l(n[c](), e), a && a.exports ? a.exports = m : u && u.amd && u(function() {
          return m
        })
      }(this, [], Math, 256, 6, 52, "object" == typeof n && n, "function" == typeof t && t, "random")
    }, {}],
    8: [function(t, e, n) {
      (function(t) {
        (function() {
          function r(t) {
            return "function" != typeof t.toString && "string" == typeof(t + "")
          }

          function o(t) {
            t.length = 0, A.length < D && A.push(t)
          }

          function i(t, e) {
            var n;
            e || (e = 0), "undefined" == typeof n && (n = t ? t.length : 0);
            var r = -1;
            n = n - e || 0;
            for (var o = Array(0 > n ? 0 : n); ++r < n;) o[r] = t[e + r];
            return o
          }

          function a() {}

          function u(t) {
            function e() {
              if (r) {
                var t = i(r);
                fe.apply(t, arguments)
              }
              if (this instanceof e) {
                var a = f(n.prototype),
                  t = n.apply(a, t || arguments);
                return m(t) ? t : a
              }
              return n.apply(o, t || arguments)
            }
            var n = t[0],
              r = t[2],
              o = t[4];
            return we(e, t), e
          }

          function c(t, e, n, a, u) {
            if (n) {
              var f = n(t);
              if ("undefined" != typeof f) return f
            }
            if (!m(t)) return t;
            var s = oe.call(t);
            if (!W[s] || !xe.nodeClass && r(t)) return t;
            var l = me[s];
            switch (s) {
              case I:
              case q:
                return new l(+t);
              case G:
              case U:
                return new l(t);
              case K:
                return f = l(t.source, P.exec(t)), f.lastIndex = t.lastIndex, f
            }
            if (s = je(t), e) {
              var p = !a;
              a || (a = A.pop() || []), u || (u = A.pop() || []);
              for (var h = a.length; h--;)
                if (a[h] == t) return u[h];
              f = s ? l(t.length) : {}
            } else f = s ? i(t) : ke({}, t);
            return s && (ce.call(t, "index") && (f.index = t.index), ce.call(t, "input") && (f.input = t.input)), e ? (a.push(t), u.push(f), (s ? _e : Oe)(t, function(t, r) {
              f[r] = c(t, e, n, a, u)
            }), p && (o(a), o(u)), f) : f
          }

          function f(t) {
            return m(t) ? he(t) : {}
          }

          function s(t, e, n) {
            if ("function" != typeof t) return _;
            if ("undefined" == typeof e || !("prototype" in t)) return t;
            var r = t.__bindData__;
            if ("undefined" == typeof r && (xe.funcNames && (r = !t.name), r = r || !xe.funcDecomp, !r)) {
              var o = ue.call(t);
              xe.funcNames || (r = !N.test(o)), r || (r = B.test(o), we(t, r))
            }
            if (!1 === r || !0 !== r && 1 & r[1]) return t;
            switch (n) {
              case 1:
                return function(n) {
                  return t.call(e, n)
                };
              case 2:
                return function(n, r) {
                  return t.call(e, n, r)
                };
              case 3:
                return function(n, r, o) {
                  return t.call(e, n, r, o)
                };
              case 4:
                return function(n, r, o, i) {
                  return t.call(e, n, r, o, i)
                }
            }
            return F(t, e)
          }

          function l(t) {
            function e() {
              var t = s ? u : this;
              if (o) {
                var d = i(o);
                fe.apply(d, arguments)
              }
              return (a || h) && (d || (d = i(arguments)), a && fe.apply(d, a), h && d.length < c) ? (r |= 16, l([n, y ? r : -4 & r, d, null, u, c])) : (d || (d = arguments), p && (n = t[g]), this instanceof e ? (t = f(n.prototype), d = n.apply(t, d), m(d) ? d : t) : n.apply(t, d))
            }
            var n = t[0],
              r = t[1],
              o = t[2],
              a = t[3],
              u = t[4],
              c = t[5],
              s = 1 & r,
              p = 2 & r,
              h = 4 & r,
              y = 8 & r,
              g = n;
            return we(e, t), e
          }

          function p(t, e, n, i, a, u) {
            if (n) {
              var c = n(t, e);
              if ("undefined" != typeof c) return !!c
            }
            if (t === e) return 0 !== t || 1 / t == 1 / e;
            if (t === t && !(t && H[typeof t] || e && H[typeof e])) return !1;
            if (null == t || null == e) return t === e;
            var f = oe.call(t),
              s = oe.call(e);
            if (f == z && (f = $), s == z && (s = $), f != s) return !1;
            switch (f) {
              case I:
              case q:
                return +t == +e;
              case G:
                return t != +t ? e != +e : 0 == t ? 1 / t == 1 / e : t == +e;
              case K:
              case U:
                return t == e + ""
            }
            if (s = f == L, !s) {
              var l = ce.call(t, "__wrapped__"),
                h = ce.call(e, "__wrapped__");
              if (l || h) return p(l ? t.__wrapped__ : t, h ? e.__wrapped__ : e, n, i, a, u);
              if (f != $ || !xe.nodeClass && (r(t) || r(e))) return !1;
              if (f = !xe.argsObject && d(t) ? Object : t.constructor, l = !xe.argsObject && d(e) ? Object : e.constructor, f != l && !(v(f) && f instanceof f && v(l) && l instanceof l) && "constructor" in t && "constructor" in e) return !1
            }
            for (f = !a, a || (a = A.pop() || []), u || (u = A.pop() || []), l = a.length; l--;)
              if (a[l] == t) return u[l] == e;
            var y = 0,
              c = !0;
            if (a.push(t), u.push(e), s) {
              if (l = t.length, y = e.length, (c = y == l) || i)
                for (; y--;)
                  if (s = l, h = e[y], i)
                    for (; s-- && !(c = p(t[s], h, n, i, a, u)););
                  else if (!(c = p(t[y], h, n, i, a, u))) break
            } else Se(e, function(e, r, o) {
              return ce.call(o, r) ? (y++, c = ce.call(t, r) && p(t[r], e, n, i, a, u)) : void 0
            }), c && !i && Se(t, function(t, e, n) {
              return ce.call(n, e) ? c = -1 < --y : void 0
            });
            return a.pop(), u.pop(), f && (o(a), o(u)), c
          }

          function h(t, e, n, r, o, a) {
            var c = 1 & e,
              f = 4 & e,
              s = 16 & e,
              p = 32 & e;
            if (!(2 & e || v(t))) throw new TypeError;
            s && !n.length && (e &= -17, s = n = !1), p && !r.length && (e &= -33, p = r = !1);
            var y = t && t.__bindData__;
            return y && !0 !== y ? (y = i(y), y[2] && (y[2] = i(y[2])), y[3] && (y[3] = i(y[3])), !c || 1 & y[1] || (y[4] = o), !c && 1 & y[1] && (e |= 8), !f || 4 & y[1] || (y[5] = a), s && fe.apply(y[2] || (y[2] = []), n), p && le.apply(y[3] || (y[3] = []), r), y[1] |= e, h.apply(null, y)) : (1 == e || 17 === e ? u : l)([t, e, n, r, o, a])
          }

          function y() {
            V.h = M, V.b = V.c = V.g = V.i = "", V.e = "t", V.j = !0;
            for (var t, e = 0; t = arguments[e]; e++)
              for (var n in t) V[n] = t[n];
            e = V.a, V.d = /^[^,]+/.exec(e)[0], t = Function, e = "return function(" + e + "){", n = V;
            var r = "var n,t=" + n.d + ",E=" + n.e + ";if(!t)return E;" + n.i + ";";
            n.b ? (r += "var u=t.length;n=-1;if(" + n.b + "){", xe.unindexedChars && (r += "if(s(t)){t=t.split('')}"), r += "while(++n<u){" + n.g + ";}}else{") : xe.nonEnumArgs && (r += "var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';" + n.g + ";}}else{"), xe.enumPrototypes && (r += "var G=typeof t=='function';"), xe.enumErrorProps && (r += "var F=t===k||t instanceof Error;");
            var o = [];
            if (xe.enumPrototypes && o.push('!(G&&n=="prototype")'), xe.enumErrorProps && o.push('!(F&&(n=="message"||n=="name"))'), n.j && n.f) r += "var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];", o.length && (r += "if(" + o.join("&&") + "){"), r += n.g + ";", o.length && (r += "}"), r += "}";
            else if (r += "for(n in t){", n.j && o.push("m.call(t, n)"), o.length && (r += "if(" + o.join("&&") + "){"), r += n.g + ";", o.length && (r += "}"), r += "}", xe.nonEnumShadows) {
              for (r += "if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];", k = 0; 7 > k; k++) r += "n='" + n.h[k] + "';if((!(r&&x[n])&&m.call(t,n))", n.j || (r += "||(!x[n]&&t[n]!==A[n])"), r += "){" + n.g + "}";
              r += "}"
            }
            return (n.b || xe.nonEnumArgs) && (r += "}"), r += n.c + ";return E", t("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L", e + r + "}")(s, T, ee, ce, R, d, je, b, V.f, ne, H, be, U, re, oe)
          }

          function g(t) {
            return "function" == typeof t && ie.test(t)
          }

          function d(t) {
            return t && "object" == typeof t && "number" == typeof t.length && oe.call(t) == z || !1
          }

          function v(t) {
            return "function" == typeof t
          }

          function m(t) {
            return !(!t || !H[typeof t])
          }

          function b(t) {
            return "string" == typeof t || t && "object" == typeof t && oe.call(t) == U || !1
          }

          function x(t, e, n) {
            var r = [];
            if (e = a.createCallback(e, n, 3), je(t)) {
              n = -1;
              for (var o = t.length; ++n < o;) {
                var i = t[n];
                e(i, n, t) && r.push(i)
              }
            } else _e(t, function(t, n, o) {
              e(t, n, o) && r.push(t)
            });
            return r
          }

          function w(t, e, n) {
            if (e && "undefined" == typeof n && je(t)) {
              n = -1;
              for (var r = t.length; ++n < r && !1 !== e(t[n], n, t););
            } else _e(t, e, n);
            return t
          }

          function j(t, e, n) {
            var r = -1,
              o = t ? t.length : 0,
              i = Array("number" == typeof o ? o : 0);
            if (e = a.createCallback(e, n, 3), je(t))
              for (; ++r < o;) i[r] = e(t[r], r, t);
            else _e(t, function(t, n, o) {
              i[++r] = e(t, n, o)
            });
            return i
          }

          function E(t, e, n, r) {
            var o = 3 > arguments.length;
            if (e = a.createCallback(e, r, 4), je(t)) {
              var i = -1,
                u = t.length;
              for (o && (n = t[++i]); ++i < u;) n = e(n, t[i], i, t)
            } else _e(t, function(t, r, i) {
              n = o ? (o = !1, t) : e(n, t, r, i)
            });
            return n
          }

          function C(t, e, n) {
            var r;
            if (e = a.createCallback(e, n, 3), je(t)) {
              n = -1;
              for (var o = t.length; ++n < o && !(r = e(t[n], n, t)););
            } else _e(t, function(t, n, o) {
              return !(r = e(t, n, o))
            });
            return !!r
          }

          function F(t, e) {
            return 2 < arguments.length ? h(t, 17, i(arguments, 2), null, e) : h(t, 1, null, null, e)
          }

          function _(t) {
            return t
          }

          function S() {}

          function O(t) {
            return function(e) {
              return e[t]
            }
          }
          var A = [],
            R = {},
            D = 40,
            P = /\w*$/,
            N = /^\s*function[ \n\r\t]+\w/,
            B = /\bthis\b/,
            M = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
            z = "[object Arguments]",
            L = "[object Array]",
            I = "[object Boolean]",
            q = "[object Date]",
            T = "[object Error]",
            G = "[object Number]",
            $ = "[object Object]",
            K = "[object RegExp]",
            U = "[object String]",
            W = {
              "[object Function]": !1
            };
          W[z] = W[L] = W[I] = W[q] = W[G] = W[$] = W[K] = W[U] = !0;
          var J = {
              configurable: !1,
              enumerable: !1,
              value: null,
              writable: !1
            },
            V = {
              a: "",
              b: null,
              c: "",
              d: "",
              e: "",
              v: null,
              g: "",
              h: null,
              support: null,
              i: "",
              j: !1
            },
            H = {
              "boolean": !1,
              "function": !0,
              object: !0,
              number: !1,
              string: !1,
              undefined: !1
            },
            Q = H[typeof window] && window || this,
            X = H[typeof n] && n && !n.nodeType && n,
            Y = H[typeof e] && e && !e.nodeType && e,
            Z = H[typeof t] && t;
          !Z || Z.global !== Z && Z.window !== Z || (Q = Z);
          var te = [],
            ee = Error.prototype,
            ne = Object.prototype,
            re = String.prototype,
            oe = ne.toString,
            ie = RegExp("^" + (oe + "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$"),
            ae = Math.floor,
            ue = Function.prototype.toString,
            ce = ne.hasOwnProperty,
            fe = te.push,
            se = ne.propertyIsEnumerable,
            le = te.unshift,
            pe = function() {
              try {
                var t = {},
                  e = g(e = Object.defineProperty) && e,
                  n = e(t, t, t) && e
              } catch (r) {}
              return n
            }(),
            he = g(he = Object.create) && he,
            ye = g(ye = Array.isArray) && ye,
            ge = g(ge = Object.keys) && ge,
            de = Math.min,
            ve = Math.random,
            me = {};
          me[L] = Array, me[I] = Boolean, me[q] = Date, me["[object Function]"] = Function, me[$] = Object, me[G] = Number, me[K] = RegExp, me[U] = String;
          var be = {};
          be[L] = be[q] = be[G] = {
              constructor: !0,
              toLocaleString: !0,
              toString: !0,
              valueOf: !0
            }, be[I] = be[U] = {
              constructor: !0,
              toString: !0,
              valueOf: !0
            }, be[T] = be["[object Function]"] = be[K] = {
              constructor: !0,
              toString: !0
            }, be[$] = {
              constructor: !0
            },
            function() {
              for (var t = M.length; t--;) {
                var e, n = M[t];
                for (e in be) ce.call(be, e) && !ce.call(be[e], n) && (be[e][n] = !1)
              }
            }();
          var xe = a.support = {};
          ! function() {
            function t() {
              this.x = 1
            }
            var e = {
                0: 1,
                length: 1
              },
              n = [];
            t.prototype = {
              valueOf: 1,
              y: 1
            };
            for (var r in new t) n.push(r);
            for (r in arguments);
            xe.argsClass = oe.call(arguments) == z, xe.argsObject = arguments.constructor == Object && !(arguments instanceof Array), xe.enumErrorProps = se.call(ee, "message") || se.call(ee, "name"), xe.enumPrototypes = se.call(t, "prototype"), xe.funcDecomp = !g(Q.k) && B.test(function() {
              return this
            }), xe.funcNames = "string" == typeof Function.name, xe.nonEnumArgs = 0 != r, xe.nonEnumShadows = !/valueOf/.test(n), xe.spliceObjects = (te.splice.call(e, 0, 1), !e[0]), xe.unindexedChars = "xx" != "x" [0] + Object("x")[0];
            try {
              xe.nodeClass = !(oe.call(document) == $ && !({
                toString: 0
              } + ""))
            } catch (o) {
              xe.nodeClass = !0
            }
          }(1), he || (f = function() {
            function t() {}
            return function(e) {
              if (m(e)) {
                t.prototype = e;
                var n = new t;
                t.prototype = null
              }
              return n || Q.Object()
            }
          }());
          var we = pe ? function(t, e) {
            J.value = e, pe(t, "__bindData__", J)
          } : S;
          xe.argsClass || (d = function(t) {
            return t && "object" == typeof t && "number" == typeof t.length && ce.call(t, "callee") && !se.call(t, "callee") || !1
          });
          var je = ye || function(t) {
              return t && "object" == typeof t && "number" == typeof t.length && oe.call(t) == L || !1
            },
            Ee = y({
              a: "z",
              e: "[]",
              i: "if(!(B[typeof z]))return E",
              g: "E.push(n)"
            }),
            Ce = ge ? function(t) {
              return m(t) ? xe.enumPrototypes && "function" == typeof t || xe.nonEnumArgs && t.length && d(t) ? Ee(t) : ge(t) : []
            } : Ee,
            Z = {
              a: "g,e,K",
              i: "e=e&&typeof K=='undefined'?e:d(e,K,3)",
              b: "typeof u=='number'",
              v: Ce,
              g: "if(e(t[n],n,g)===false)return E"
            },
            ye = {
              a: "z,H,l",
              i: "var a=arguments,b=0,c=typeof l=='number'?2:a.length;while(++b<c){t=a[b];if(t&&B[typeof t]){",
              v: Ce,
              g: "if(typeof E[n]=='undefined')E[n]=t[n]",
              c: "}}"
            },
            Fe = {
              i: "if(!B[typeof t])return E;" + Z.i,
              b: !1
            },
            _e = y(Z),
            ke = y(ye, {
              i: ye.i.replace(";", ";if(c>3&&typeof a[c-2]=='function'){var e=d(a[--c-1],a[c--],2)}else if(c>2&&typeof a[c-1]=='function'){e=a[--c]}"),
              g: "E[n]=e?e(E[n],t[n]):t[n]"
            }),
            Se = y(Z, Fe, {
              j: !1
            }),
            Oe = y(Z, Fe);
          v(/x/) && (v = function(t) {
            return "function" == typeof t && "[object Function]" == oe.call(t)
          }), a.assign = ke, a.bind = F, a.createCallback = function(t, e, n) {
            var r = typeof t;
            if (null == t || "function" == r) return s(t, e, n);
            if ("object" != r) return O(t);
            var o = Ce(t),
              i = o[0],
              a = t[i];
            return 1 != o.length || a !== a || m(a) ? function(e) {
              for (var n = o.length, r = !1; n-- && (r = p(e[o[n]], t[o[n]], null, !0)););
              return r
            } : function(t) {
              return t = t[i], a === t && (0 !== a || 1 / a == 1 / t)
            }
          }, a.filter = x, a.forEach = w, a.forIn = Se, a.forOwn = Oe, a.keys = Ce, a.map = j, a.property = O, a.collect = j, a.each = w, a.extend = ke, a.select = x, a.clone = function(t, e, n, r) {
            return "boolean" != typeof e && null != e && (r = n, n = e, e = !1), c(t, e, "function" == typeof n && s(n, r, 1))
          }, a.identity = _, a.isArguments = d, a.isArray = je, a.isFunction = v, a.isObject = m, a.isString = b, a.noop = S, a.random = function(t, e, n) {
            var r = null == t,
              o = null == e;
            return null == n && ("boolean" == typeof t && o ? (n = t, t = 1) : o || "boolean" != typeof e || (n = e, o = !0)), r && o && (e = 1), t = +t || 0, o ? (e = t, t = 0) : e = +e || 0, n || t % 1 || e % 1 ? (n = ve(), de(t + n * (e - t + parseFloat("1e-" + ((n + "").length - 1))), e)) : t + ae(ve() * (e - t + 1))
          }, a.reduce = E, a.some = C, a.any = C, a.foldl = E, a.inject = E, a.VERSION = "2.4.1", X && Y && (X._ = a)
        }).call(this)
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}]
  }, {}, [1])(1)
});
