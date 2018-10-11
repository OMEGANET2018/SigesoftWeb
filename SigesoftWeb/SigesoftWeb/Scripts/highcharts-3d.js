﻿/*
 Highcharts JS v6.1.0 (2018-04-13)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
*/
(function (B) { "object" === typeof module && module.exports ? module.exports = B : B(Highcharts) })(function (B) {
    (function (b) {
        var p = b.deg2rad, y = b.pick; b.perspective = function (t, g, A) {
            var z = g.options.chart.options3d, n = A ? g.inverted : !1, r = g.plotWidth / 2, x = g.plotHeight / 2, q = z.depth / 2, f = y(z.depth, 1) * y(z.viewDistance, 0), a = g.scale3d || 1, d = p * z.beta * (n ? -1 : 1), z = p * z.alpha * (n ? -1 : 1), h = Math.cos(z), k = Math.cos(-d), e = Math.sin(z), c = Math.sin(-d); A || (r += g.plotLeft, x += g.plotTop); return b.map(t, function (b) {
                var d, l; l = (n ? b.y : b.x) - r; var v = (n ?
                    b.x : b.y) - x, G = (b.z || 0) - q; d = k * l - c * G; b = -e * c * l + h * v - k * e * G; l = h * c * l + e * v + h * k * G; v = 0 < f && f < Number.POSITIVE_INFINITY ? f / (l + q + f) : 1; d = d * v * a + r; b = b * v * a + x; return { x: n ? b : d, y: n ? d : b, z: l * a + q }
            })
        }; b.pointCameraDistance = function (b, g) { var t = g.options.chart.options3d, z = g.plotWidth / 2; g = g.plotHeight / 2; t = y(t.depth, 1) * y(t.viewDistance, 0) + t.depth; return Math.sqrt(Math.pow(z - b.plotX, 2) + Math.pow(g - b.plotY, 2) + Math.pow(t - b.plotZ, 2)) }; b.shapeArea = function (b) {
            var g = 0, t, z; for (t = 0; t < b.length; t++)z = (t + 1) % b.length, g += b[t].x * b[z].y - b[z].x *
                b[t].y; return g / 2
        }; b.shapeArea3d = function (t, g, p) { return b.shapeArea(b.perspective(t, g, p)) }
    })(B); (function (b) {
        function p(a, e, c, b, d, f, k, l) {
            var m = [], C = f - d; return f > d && f - d > Math.PI / 2 + .0001 ? (m = m.concat(p(a, e, c, b, d, d + Math.PI / 2, k, l)), m = m.concat(p(a, e, c, b, d + Math.PI / 2, f, k, l))) : f < d && d - f > Math.PI / 2 + .0001 ? (m = m.concat(p(a, e, c, b, d, d - Math.PI / 2, k, l)), m = m.concat(p(a, e, c, b, d - Math.PI / 2, f, k, l))) : ["C", a + c * Math.cos(d) - c * w * C * Math.sin(d) + k, e + b * Math.sin(d) + b * w * C * Math.cos(d) + l, a + c * Math.cos(f) + c * w * C * Math.sin(f) + k, e + b * Math.sin(f) -
                b * w * C * Math.cos(f) + l, a + c * Math.cos(f) + k, e + b * Math.sin(f) + l]
        } var y = Math.cos, t = Math.PI, g = Math.sin, A = b.animObject, z = b.charts, n = b.color, r = b.defined, x = b.deg2rad, q = b.each, f = b.extend, a = b.inArray, d = b.map, h = b.merge, k = b.perspective, e = b.pick, c = b.SVGElement, l = b.SVGRenderer, u = b.wrap, w = 4 * (Math.sqrt(2) - 1) / 3 / (t / 2); l.prototype.toLinePath = function (a, e) { var c = []; q(a, function (a) { c.push("L", a.x, a.y) }); a.length && (c[0] = "M", e && c.push("Z")); return c }; l.prototype.toLineSegments = function (a) {
            var e = [], c = !0; q(a, function (a) {
                e.push(c ?
                    "M" : "L", a.x, a.y); c = !c
            }); return e
        }; l.prototype.face3d = function (a) {
            var c = this, m = this.createElement("path"); m.vertexes = []; m.insidePlotArea = !1; m.enabled = !0; u(m, "attr", function (a, m) {
                if ("object" === typeof m && (r(m.enabled) || r(m.vertexes) || r(m.insidePlotArea))) {
                    this.enabled = e(m.enabled, this.enabled); this.vertexes = e(m.vertexes, this.vertexes); this.insidePlotArea = e(m.insidePlotArea, this.insidePlotArea); delete m.enabled; delete m.vertexes; delete m.insidePlotArea; var d = k(this.vertexes, z[c.chartIndex], this.insidePlotArea),
                        C = c.toLinePath(d, !0), d = b.shapeArea(d), d = this.enabled && 0 < d ? "visible" : "hidden"; m.d = C; m.visibility = d
                } return a.apply(this, [].slice.call(arguments, 1))
            }); u(m, "animate", function (a, m) {
                if ("object" === typeof m && (r(m.enabled) || r(m.vertexes) || r(m.insidePlotArea))) {
                    this.enabled = e(m.enabled, this.enabled); this.vertexes = e(m.vertexes, this.vertexes); this.insidePlotArea = e(m.insidePlotArea, this.insidePlotArea); delete m.enabled; delete m.vertexes; delete m.insidePlotArea; var d = k(this.vertexes, z[c.chartIndex], this.insidePlotArea),
                        C = c.toLinePath(d, !0), d = b.shapeArea(d), d = this.enabled && 0 < d ? "visible" : "hidden"; m.d = C; this.attr("visibility", d)
                } return a.apply(this, [].slice.call(arguments, 1))
            }); return m.attr(a)
        }; l.prototype.polyhedron = function (a) {
            var e = this, c = this.g(), b = c.destroy; c.attr({ "stroke-linejoin": "round" }); c.faces = []; c.destroy = function () { for (var a = 0; a < c.faces.length; a++)c.faces[a].destroy(); return b.call(this) }; u(c, "attr", function (a, b, m, d, C) {
                if ("object" === typeof b && r(b.faces)) {
                    for (; c.faces.length > b.faces.length;)c.faces.pop().destroy();
                    for (; c.faces.length < b.faces.length;)c.faces.push(e.face3d().add(c)); for (var f = 0; f < b.faces.length; f++)c.faces[f].attr(b.faces[f], null, d, C); delete b.faces
                } return a.apply(this, [].slice.call(arguments, 1))
            }); u(c, "animate", function (a, b, m, d) {
                if (b && b.faces) { for (; c.faces.length > b.faces.length;)c.faces.pop().destroy(); for (; c.faces.length < b.faces.length;)c.faces.push(e.face3d().add(c)); for (var C = 0; C < b.faces.length; C++)c.faces[C].animate(b.faces[C], m, d); delete b.faces } return a.apply(this, [].slice.call(arguments,
                    1))
            }); return c.attr(a)
        }; l.prototype.cuboid = function (a) {
            var e = this.g(), b = e.destroy; a = this.cuboidPath(a); e.attr({ "stroke-linejoin": "round" }); e.front = this.path(a[0]).attr({ "class": "highcharts-3d-front" }).add(e); e.top = this.path(a[1]).attr({ "class": "highcharts-3d-top" }).add(e); e.side = this.path(a[2]).attr({ "class": "highcharts-3d-side" }).add(e); e.fillSetter = function (a) {
                this.front.attr({ fill: a }); this.top.attr({ fill: n(a).brighten(.1).get() }); this.side.attr({ fill: n(a).brighten(-.1).get() }); this.color = a; e.fill =
                    a; return this
            }; e.opacitySetter = function (a) { this.front.attr({ opacity: a }); this.top.attr({ opacity: a }); this.side.attr({ opacity: a }); return this }; e.attr = function (a, e, b, m) { if ("string" === typeof a && "undefined" !== typeof e) { var d = a; a = {}; a[d] = e } if (a.shapeArgs || r(a.x)) a = this.renderer.cuboidPath(a.shapeArgs || a), this.front.attr({ d: a[0] }), this.top.attr({ d: a[1] }), this.side.attr({ d: a[2] }); else return c.prototype.attr.call(this, a, void 0, b, m); return this }; e.animate = function (a, e, b) {
                r(a.x) && r(a.y) ? (a = this.renderer.cuboidPath(a),
                    this.front.animate({ d: a[0] }, e, b), this.top.animate({ d: a[1] }, e, b), this.side.animate({ d: a[2] }, e, b), this.attr({ zIndex: -a[3] })) : a.opacity ? (this.front.animate(a, e, b), this.top.animate(a, e, b), this.side.animate(a, e, b)) : c.prototype.animate.call(this, a, e, b); return this
            }; e.destroy = function () { this.front.destroy(); this.top.destroy(); this.side.destroy(); return b.call(this) }; e.attr({ zIndex: -a[3] }); return e
        }; b.SVGRenderer.prototype.cuboidPath = function (a) {
            function e(a) { return t[a] } var c = a.x, f = a.y, l = a.z, v = a.height,
                u = a.width, h = a.depth, q = z[this.chartIndex], D, w, n = q.options.chart.options3d.alpha, g = 0, t = [{ x: c, y: f, z: l }, { x: c + u, y: f, z: l }, { x: c + u, y: f + v, z: l }, { x: c, y: f + v, z: l }, { x: c, y: f + v, z: l + h }, { x: c + u, y: f + v, z: l + h }, { x: c + u, y: f, z: l + h }, { x: c, y: f, z: l + h }], t = k(t, q, a.insidePlotArea); w = function (a, c) { var m = [[], -1]; a = d(a, e); c = d(c, e); 0 > b.shapeArea(a) ? m = [a, 0] : 0 > b.shapeArea(c) && (m = [c, 1]); return m }; D = w([3, 2, 1, 0], [7, 6, 5, 4]); a = D[0]; u = D[1]; D = w([1, 6, 7, 0], [4, 5, 2, 3]); v = D[0]; h = D[1]; D = w([1, 2, 5, 6], [0, 7, 4, 3]); w = D[0]; D = D[1]; 1 === D ? g += 1E4 * (1E3 - c) : D ||
                    (g += 1E4 * c); g += 10 * (!h || 0 <= n && 180 >= n || 360 > n && 357.5 < n ? q.plotHeight - f : 10 + f); 1 === u ? g += 100 * l : u || (g += 100 * (1E3 - l)); g = -Math.round(g); return [this.toLinePath(a, !0), this.toLinePath(v, !0), this.toLinePath(w, !0), g]
        }; b.SVGRenderer.prototype.arc3d = function (b) {
            function d(c) { var e = !1, b = {}; c = h(c); for (var d in c) -1 !== a(d, k) && (b[d] = c[d], delete c[d], e = !0); return e ? b : !1 } var m = this.g(), l = m.renderer, k = "x y r innerR start end".split(" "); b = h(b); b.alpha *= x; b.beta *= x; m.top = l.path(); m.side1 = l.path(); m.side2 = l.path(); m.inn = l.path();
            m.out = l.path(); m.onAdd = function () { var a = m.parentGroup, c = m.attr("class"); m.top.add(m); q(["out", "inn", "side1", "side2"], function (e) { m[e].attr({ "class": c + " highcharts-3d-side" }).add(a) }) }; q(["addClass", "removeClass"], function (a) { m[a] = function () { var c = arguments; q(["top", "out", "inn", "side1", "side2"], function (e) { m[e][a].apply(m[e], c) }) } }); m.setPaths = function (a) {
                var c = m.renderer.arc3dPath(a), e = 100 * c.zTop; m.attribs = a; m.top.attr({ d: c.top, zIndex: c.zTop }); m.inn.attr({ d: c.inn, zIndex: c.zInn }); m.out.attr({
                    d: c.out,
                    zIndex: c.zOut
                }); m.side1.attr({ d: c.side1, zIndex: c.zSide1 }); m.side2.attr({ d: c.side2, zIndex: c.zSide2 }); m.zIndex = e; m.attr({ zIndex: e }); a.center && (m.top.setRadialReference(a.center), delete a.center)
            }; m.setPaths(b); m.fillSetter = function (a) { var c = n(a).brighten(-.1).get(); this.fill = a; this.side1.attr({ fill: c }); this.side2.attr({ fill: c }); this.inn.attr({ fill: c }); this.out.attr({ fill: c }); this.top.attr({ fill: a }); return this }; q(["opacity", "translateX", "translateY", "visibility"], function (a) {
                m[a + "Setter"] = function (a,
                    c) { m[c] = a; q(["out", "inn", "side1", "side2", "top"], function (e) { m[e].attr(c, a) }) }
            }); u(m, "attr", function (a, c) { var e; "object" === typeof c && (e = d(c)) && (f(m.attribs, e), m.setPaths(m.attribs)); return a.apply(this, [].slice.call(arguments, 1)) }); u(m, "animate", function (a, c, b, f) {
                var l, k = this.attribs, u; delete c.center; delete c.z; delete c.depth; delete c.alpha; delete c.beta; u = A(e(b, this.renderer.globalAnimation)); u.duration && (l = d(c), c.dummy = m.dummy++ , l && (u.step = function (a, c) {
                    function b(a) {
                        return k[a] + (e(l[a], k[a]) - k[a]) *
                            c.pos
                    } "dummy" === c.prop && c.elem.setPaths(h(k, { x: b("x"), y: b("y"), r: b("r"), innerR: b("innerR"), start: b("start"), end: b("end") }))
                }), b = u); return a.call(this, c, b, f)
            }); m.dummy = 0; m.destroy = function () { this.top.destroy(); this.out.destroy(); this.inn.destroy(); this.side1.destroy(); this.side2.destroy(); c.prototype.destroy.call(this) }; m.hide = function () { this.top.hide(); this.out.hide(); this.inn.hide(); this.side1.hide(); this.side2.hide() }; m.show = function () {
                this.top.show(); this.out.show(); this.inn.show(); this.side1.show();
                this.side2.show()
            }; return m
        }; l.prototype.arc3dPath = function (a) {
            function c(a) { a %= 2 * Math.PI; a > Math.PI && (a = 2 * Math.PI - a); return a } var e = a.x, b = a.y, d = a.start, f = a.end - .00001, l = a.r, k = a.innerR, u = a.depth, h = a.alpha, q = a.beta, v = Math.cos(d), w = Math.sin(d); a = Math.cos(f); var n = Math.sin(f), r = l * Math.cos(q), l = l * Math.cos(h), z = k * Math.cos(q), x = k * Math.cos(h), k = u * Math.sin(q), A = u * Math.sin(h), u = ["M", e + r * v, b + l * w], u = u.concat(p(e, b, r, l, d, f, 0, 0)), u = u.concat(["L", e + z * a, b + x * n]), u = u.concat(p(e, b, z, x, f, d, 0, 0)), u = u.concat(["Z"]), B =
                0 < q ? Math.PI / 2 : 0, q = 0 < h ? 0 : Math.PI / 2, B = d > -B ? d : f > -B ? -B : d, E = f < t - q ? f : d < t - q ? t - q : f, F = 2 * t - q, h = ["M", e + r * y(B), b + l * g(B)], h = h.concat(p(e, b, r, l, B, E, 0, 0)); f > F && d < F ? (h = h.concat(["L", e + r * y(E) + k, b + l * g(E) + A]), h = h.concat(p(e, b, r, l, E, F, k, A)), h = h.concat(["L", e + r * y(F), b + l * g(F)]), h = h.concat(p(e, b, r, l, F, f, 0, 0)), h = h.concat(["L", e + r * y(f) + k, b + l * g(f) + A]), h = h.concat(p(e, b, r, l, f, F, k, A)), h = h.concat(["L", e + r * y(F), b + l * g(F)]), h = h.concat(p(e, b, r, l, F, E, 0, 0))) : f > t - q && d < t - q && (h = h.concat(["L", e + r * Math.cos(E) + k, b + l * Math.sin(E) + A]), h = h.concat(p(e,
                    b, r, l, E, f, k, A)), h = h.concat(["L", e + r * Math.cos(f), b + l * Math.sin(f)]), h = h.concat(p(e, b, r, l, f, E, 0, 0))); h = h.concat(["L", e + r * Math.cos(E) + k, b + l * Math.sin(E) + A]); h = h.concat(p(e, b, r, l, E, B, k, A)); h = h.concat(["Z"]); q = ["M", e + z * v, b + x * w]; q = q.concat(p(e, b, z, x, d, f, 0, 0)); q = q.concat(["L", e + z * Math.cos(f) + k, b + x * Math.sin(f) + A]); q = q.concat(p(e, b, z, x, f, d, k, A)); q = q.concat(["Z"]); v = ["M", e + r * v, b + l * w, "L", e + r * v + k, b + l * w + A, "L", e + z * v + k, b + x * w + A, "L", e + z * v, b + x * w, "Z"]; e = ["M", e + r * a, b + l * n, "L", e + r * a + k, b + l * n + A, "L", e + z * a + k, b + x * n + A, "L", e + z *
                        a, b + x * n, "Z"]; n = Math.atan2(A, -k); b = Math.abs(f + n); a = Math.abs(d + n); d = Math.abs((d + f) / 2 + n); b = c(b); a = c(a); d = c(d); d *= 1E5; f = 1E5 * a; b *= 1E5; return { top: u, zTop: 1E5 * Math.PI + 1, out: h, zOut: Math.max(d, f, b), inn: q, zInn: Math.max(d, f, b), side1: v, zSide1: .99 * b, side2: e, zSide2: .99 * f }
        }
    })(B); (function (b) {
        function p(b, f) {
            var a = b.plotLeft, d = b.plotWidth + a, h = b.plotTop, k = b.plotHeight + h, e = a + b.plotWidth / 2, c = h + b.plotHeight / 2, l = Number.MAX_VALUE, u = -Number.MAX_VALUE, q = Number.MAX_VALUE, v = -Number.MAX_VALUE, n, m = 1; n = [{ x: a, y: h, z: 0 }, {
                x: a, y: h,
                z: f
            }]; g([0, 1], function (a) { n.push({ x: d, y: n[a].y, z: n[a].z }) }); g([0, 1, 2, 3], function (a) { n.push({ x: n[a].x, y: k, z: n[a].z }) }); n = z(n, b, !1); g(n, function (a) { l = Math.min(l, a.x); u = Math.max(u, a.x); q = Math.min(q, a.y); v = Math.max(v, a.y) }); a > l && (m = Math.min(m, 1 - Math.abs((a + e) / (l + e)) % 1)); d < u && (m = Math.min(m, (d - e) / (u - e))); h > q && (m = 0 > q ? Math.min(m, (h + c) / (-q + h + c)) : Math.min(m, 1 - (h + c) / (q + c) % 1)); k < v && (m = Math.min(m, Math.abs((k - c) / (v - c)))); return m
        } var y = b.addEvent, t = b.Chart, g = b.each, A = b.merge, z = b.perspective, n = b.pick, r = b.wrap; t.prototype.is3d =
            function () { return this.options.chart.options3d && this.options.chart.options3d.enabled }; t.prototype.propsRequireDirtyBox.push("chart.options3d"); t.prototype.propsRequireUpdateSeries.push("chart.options3d"); y(t, "afterInit", function () { var b = this.options; this.is3d() && g(b.series, function (f) { "scatter" === (f.type || b.chart.type || b.chart.defaultSeriesType) && (f.type = "scatter3d") }) }); b.wrap(b.Chart.prototype, "isInsidePlot", function (b) { return this.is3d() || b.apply(this, [].slice.call(arguments, 1)) }); var x = b.getOptions();
        A(!0, x, { chart: { options3d: { enabled: !1, alpha: 0, beta: 0, depth: 100, fitToPlot: !0, viewDistance: 25, axisLabelPosition: "default", frame: { visible: "default", size: 1, bottom: {}, top: {}, left: {}, right: {}, back: {}, front: {} } } } }); r(t.prototype, "setClassName", function (b) { b.apply(this, [].slice.call(arguments, 1)); this.is3d() && (this.container.className += " highcharts-3d-chart") }); y(b.Chart, "afterSetChartSize", function () {
            var b = this.options.chart.options3d; if (this.is3d()) {
                var f = this.inverted, a = this.clipBox, d = this.margin; a[f ? "y" :
                    "x"] = -(d[3] || 0); a[f ? "x" : "y"] = -(d[0] || 0); a[f ? "height" : "width"] = this.chartWidth + (d[3] || 0) + (d[1] || 0); a[f ? "width" : "height"] = this.chartHeight + (d[0] || 0) + (d[2] || 0); this.scale3d = 1; !0 === b.fitToPlot && (this.scale3d = p(this, b.depth)); this.frame3d = this.get3dFrame()
            }
        }); y(t, "beforeRedraw", function () { this.is3d() && (this.isDirtyBox = !0) }); y(t, "beforeRender", function () { this.is3d() && (this.frame3d = this.get3dFrame()) }); r(t.prototype, "renderSeries", function (b) {
            var f = this.series.length; if (this.is3d()) for (; f--;)b = this.series[f],
                b.translate(), b.render(); else b.call(this)
        }); y(t, "afterDrawChartBox", function () {
            if (this.is3d()) {
                var n = this.renderer, f = this.options.chart.options3d, a = this.get3dFrame(), d = this.plotLeft, h = this.plotLeft + this.plotWidth, k = this.plotTop, e = this.plotTop + this.plotHeight, f = f.depth, c = d - (a.left.visible ? a.left.size : 0), l = h + (a.right.visible ? a.right.size : 0), u = k - (a.top.visible ? a.top.size : 0), w = e + (a.bottom.visible ? a.bottom.size : 0), v = 0 - (a.front.visible ? a.front.size : 0), g = f + (a.back.visible ? a.back.size : 0), m = this.hasRendered ?
                    "animate" : "attr"; this.frame3d = a; this.frameShapes || (this.frameShapes = { bottom: n.polyhedron().add(), top: n.polyhedron().add(), left: n.polyhedron().add(), right: n.polyhedron().add(), back: n.polyhedron().add(), front: n.polyhedron().add() }); this.frameShapes.bottom[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-bottom", zIndex: a.bottom.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.bottom.color).brighten(.1).get(), vertexes: [{ x: c, y: w, z: v }, { x: l, y: w, z: v }, { x: l, y: w, z: g }, { x: c, y: w, z: g }], enabled: a.bottom.visible },
                        { fill: b.color(a.bottom.color).brighten(.1).get(), vertexes: [{ x: d, y: e, z: f }, { x: h, y: e, z: f }, { x: h, y: e, z: 0 }, { x: d, y: e, z: 0 }], enabled: a.bottom.visible }, { fill: b.color(a.bottom.color).brighten(-.1).get(), vertexes: [{ x: c, y: w, z: v }, { x: c, y: w, z: g }, { x: d, y: e, z: f }, { x: d, y: e, z: 0 }], enabled: a.bottom.visible && !a.left.visible }, { fill: b.color(a.bottom.color).brighten(-.1).get(), vertexes: [{ x: l, y: w, z: g }, { x: l, y: w, z: v }, { x: h, y: e, z: 0 }, { x: h, y: e, z: f }], enabled: a.bottom.visible && !a.right.visible }, {
                            fill: b.color(a.bottom.color).get(), vertexes: [{
                                x: l,
                                y: w, z: v
                            }, { x: c, y: w, z: v }, { x: d, y: e, z: 0 }, { x: h, y: e, z: 0 }], enabled: a.bottom.visible && !a.front.visible
                        }, { fill: b.color(a.bottom.color).get(), vertexes: [{ x: c, y: w, z: g }, { x: l, y: w, z: g }, { x: h, y: e, z: f }, { x: d, y: e, z: f }], enabled: a.bottom.visible && !a.back.visible }]
                    }); this.frameShapes.top[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-top", zIndex: a.top.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.top.color).brighten(.1).get(), vertexes: [{ x: c, y: u, z: g }, { x: l, y: u, z: g }, { x: l, y: u, z: v }, { x: c, y: u, z: v }], enabled: a.top.visible },
                        { fill: b.color(a.top.color).brighten(.1).get(), vertexes: [{ x: d, y: k, z: 0 }, { x: h, y: k, z: 0 }, { x: h, y: k, z: f }, { x: d, y: k, z: f }], enabled: a.top.visible }, { fill: b.color(a.top.color).brighten(-.1).get(), vertexes: [{ x: c, y: u, z: g }, { x: c, y: u, z: v }, { x: d, y: k, z: 0 }, { x: d, y: k, z: f }], enabled: a.top.visible && !a.left.visible }, { fill: b.color(a.top.color).brighten(-.1).get(), vertexes: [{ x: l, y: u, z: v }, { x: l, y: u, z: g }, { x: h, y: k, z: f }, { x: h, y: k, z: 0 }], enabled: a.top.visible && !a.right.visible }, {
                            fill: b.color(a.top.color).get(), vertexes: [{ x: c, y: u, z: v },
                            { x: l, y: u, z: v }, { x: h, y: k, z: 0 }, { x: d, y: k, z: 0 }], enabled: a.top.visible && !a.front.visible
                        }, { fill: b.color(a.top.color).get(), vertexes: [{ x: l, y: u, z: g }, { x: c, y: u, z: g }, { x: d, y: k, z: f }, { x: h, y: k, z: f }], enabled: a.top.visible && !a.back.visible }]
                    }); this.frameShapes.left[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-left", zIndex: a.left.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.left.color).brighten(.1).get(), vertexes: [{ x: c, y: w, z: v }, { x: d, y: e, z: 0 }, { x: d, y: e, z: f }, { x: c, y: w, z: g }], enabled: a.left.visible && !a.bottom.visible },
                        { fill: b.color(a.left.color).brighten(.1).get(), vertexes: [{ x: c, y: u, z: g }, { x: d, y: k, z: f }, { x: d, y: k, z: 0 }, { x: c, y: u, z: v }], enabled: a.left.visible && !a.top.visible }, { fill: b.color(a.left.color).brighten(-.1).get(), vertexes: [{ x: c, y: w, z: g }, { x: c, y: u, z: g }, { x: c, y: u, z: v }, { x: c, y: w, z: v }], enabled: a.left.visible }, { fill: b.color(a.left.color).brighten(-.1).get(), vertexes: [{ x: d, y: k, z: f }, { x: d, y: e, z: f }, { x: d, y: e, z: 0 }, { x: d, y: k, z: 0 }], enabled: a.left.visible }, {
                            fill: b.color(a.left.color).get(), vertexes: [{ x: c, y: w, z: v }, { x: c, y: u, z: v },
                            { x: d, y: k, z: 0 }, { x: d, y: e, z: 0 }], enabled: a.left.visible && !a.front.visible
                        }, { fill: b.color(a.left.color).get(), vertexes: [{ x: c, y: u, z: g }, { x: c, y: w, z: g }, { x: d, y: e, z: f }, { x: d, y: k, z: f }], enabled: a.left.visible && !a.back.visible }]
                    }); this.frameShapes.right[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-right", zIndex: a.right.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.right.color).brighten(.1).get(), vertexes: [{ x: l, y: w, z: g }, { x: h, y: e, z: f }, { x: h, y: e, z: 0 }, { x: l, y: w, z: v }], enabled: a.right.visible && !a.bottom.visible },
                        { fill: b.color(a.right.color).brighten(.1).get(), vertexes: [{ x: l, y: u, z: v }, { x: h, y: k, z: 0 }, { x: h, y: k, z: f }, { x: l, y: u, z: g }], enabled: a.right.visible && !a.top.visible }, { fill: b.color(a.right.color).brighten(-.1).get(), vertexes: [{ x: h, y: k, z: 0 }, { x: h, y: e, z: 0 }, { x: h, y: e, z: f }, { x: h, y: k, z: f }], enabled: a.right.visible }, { fill: b.color(a.right.color).brighten(-.1).get(), vertexes: [{ x: l, y: w, z: v }, { x: l, y: u, z: v }, { x: l, y: u, z: g }, { x: l, y: w, z: g }], enabled: a.right.visible }, {
                            fill: b.color(a.right.color).get(), vertexes: [{ x: l, y: u, z: v }, {
                                x: l,
                                y: w, z: v
                            }, { x: h, y: e, z: 0 }, { x: h, y: k, z: 0 }], enabled: a.right.visible && !a.front.visible
                        }, { fill: b.color(a.right.color).get(), vertexes: [{ x: l, y: w, z: g }, { x: l, y: u, z: g }, { x: h, y: k, z: f }, { x: h, y: e, z: f }], enabled: a.right.visible && !a.back.visible }]
                    }); this.frameShapes.back[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-back", zIndex: a.back.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.back.color).brighten(.1).get(), vertexes: [{ x: l, y: w, z: g }, { x: c, y: w, z: g }, { x: d, y: e, z: f }, { x: h, y: e, z: f }], enabled: a.back.visible && !a.bottom.visible },
                        { fill: b.color(a.back.color).brighten(.1).get(), vertexes: [{ x: c, y: u, z: g }, { x: l, y: u, z: g }, { x: h, y: k, z: f }, { x: d, y: k, z: f }], enabled: a.back.visible && !a.top.visible }, { fill: b.color(a.back.color).brighten(-.1).get(), vertexes: [{ x: c, y: w, z: g }, { x: c, y: u, z: g }, { x: d, y: k, z: f }, { x: d, y: e, z: f }], enabled: a.back.visible && !a.left.visible }, { fill: b.color(a.back.color).brighten(-.1).get(), vertexes: [{ x: l, y: u, z: g }, { x: l, y: w, z: g }, { x: h, y: e, z: f }, { x: h, y: k, z: f }], enabled: a.back.visible && !a.right.visible }, {
                            fill: b.color(a.back.color).get(),
                            vertexes: [{ x: d, y: k, z: f }, { x: h, y: k, z: f }, { x: h, y: e, z: f }, { x: d, y: e, z: f }], enabled: a.back.visible
                        }, { fill: b.color(a.back.color).get(), vertexes: [{ x: c, y: w, z: g }, { x: l, y: w, z: g }, { x: l, y: u, z: g }, { x: c, y: u, z: g }], enabled: a.back.visible }]
                    }); this.frameShapes.front[m]({
                        "class": "highcharts-3d-frame highcharts-3d-frame-front", zIndex: a.front.frontFacing ? -1E3 : 1E3, faces: [{ fill: b.color(a.front.color).brighten(.1).get(), vertexes: [{ x: c, y: w, z: v }, { x: l, y: w, z: v }, { x: h, y: e, z: 0 }, { x: d, y: e, z: 0 }], enabled: a.front.visible && !a.bottom.visible },
                        { fill: b.color(a.front.color).brighten(.1).get(), vertexes: [{ x: l, y: u, z: v }, { x: c, y: u, z: v }, { x: d, y: k, z: 0 }, { x: h, y: k, z: 0 }], enabled: a.front.visible && !a.top.visible }, { fill: b.color(a.front.color).brighten(-.1).get(), vertexes: [{ x: c, y: u, z: v }, { x: c, y: w, z: v }, { x: d, y: e, z: 0 }, { x: d, y: k, z: 0 }], enabled: a.front.visible && !a.left.visible }, { fill: b.color(a.front.color).brighten(-.1).get(), vertexes: [{ x: l, y: w, z: v }, { x: l, y: u, z: v }, { x: h, y: k, z: 0 }, { x: h, y: e, z: 0 }], enabled: a.front.visible && !a.right.visible }, {
                            fill: b.color(a.front.color).get(),
                            vertexes: [{ x: h, y: k, z: 0 }, { x: d, y: k, z: 0 }, { x: d, y: e, z: 0 }, { x: h, y: e, z: 0 }], enabled: a.front.visible
                        }, { fill: b.color(a.front.color).get(), vertexes: [{ x: l, y: w, z: v }, { x: c, y: w, z: v }, { x: c, y: u, z: v }, { x: l, y: u, z: v }], enabled: a.front.visible }]
                    })
            }
        }); t.prototype.retrieveStacks = function (b) { var f = this.series, a = {}, d, h = 1; g(this.series, function (k) { d = n(k.options.stack, b ? 0 : f.length - 1 - k.index); a[d] ? a[d].series.push(k) : (a[d] = { series: [k], position: h }, h++) }); a.totalStacks = h + 1; return a }; t.prototype.get3dFrame = function () {
            var q = this, f = q.options.chart.options3d,
                a = f.frame, d = q.plotLeft, h = q.plotLeft + q.plotWidth, k = q.plotTop, e = q.plotTop + q.plotHeight, c = f.depth, l = function (a) { a = b.shapeArea3d(a, q); return .5 < a ? 1 : -.5 > a ? -1 : 0 }, u = l([{ x: d, y: e, z: c }, { x: h, y: e, z: c }, { x: h, y: e, z: 0 }, { x: d, y: e, z: 0 }]), w = l([{ x: d, y: k, z: 0 }, { x: h, y: k, z: 0 }, { x: h, y: k, z: c }, { x: d, y: k, z: c }]), v = l([{ x: d, y: k, z: 0 }, { x: d, y: k, z: c }, { x: d, y: e, z: c }, { x: d, y: e, z: 0 }]), r = l([{ x: h, y: k, z: c }, { x: h, y: k, z: 0 }, { x: h, y: e, z: 0 }, { x: h, y: e, z: c }]), m = l([{ x: d, y: e, z: 0 }, { x: h, y: e, z: 0 }, { x: h, y: k, z: 0 }, { x: d, y: k, z: 0 }]), l = l([{ x: d, y: k, z: c }, { x: h, y: k, z: c },
                { x: h, y: e, z: c }, { x: d, y: e, z: c }]), t = !1, A = !1, x = !1, p = !1; g([].concat(q.xAxis, q.yAxis, q.zAxis), function (a) { a && (a.horiz ? a.opposite ? A = !0 : t = !0 : a.opposite ? p = !0 : x = !0) }); var y = function (a, c, e) { for (var b = ["size", "color", "visible"], d = {}, f = 0; f < b.length; f++)for (var l = b[f], h = 0; h < a.length; h++)if ("object" === typeof a[h]) { var k = a[h][l]; if (void 0 !== k && null !== k) { d[l] = k; break } } a = e; !0 === d.visible || !1 === d.visible ? a = d.visible : "auto" === d.visible && (a = 0 < c); return { size: n(d.size, 1), color: n(d.color, "none"), frontFacing: 0 < c, visible: a } },
                    a = { bottom: y([a.bottom, a.top, a], u, t), top: y([a.top, a.bottom, a], w, A), left: y([a.left, a.right, a.side, a], v, x), right: y([a.right, a.left, a.side, a], r, p), back: y([a.back, a.front, a], l, !0), front: y([a.front, a.back, a], m, !1) }; "auto" === f.axisLabelPosition ? (r = function (a, c) { return a.visible !== c.visible || a.visible && c.visible && a.frontFacing !== c.frontFacing }, f = [], r(a.left, a.front) && f.push({ y: (k + e) / 2, x: d, z: 0, xDir: { x: 1, y: 0, z: 0 } }), r(a.left, a.back) && f.push({ y: (k + e) / 2, x: d, z: c, xDir: { x: 0, y: 0, z: -1 } }), r(a.right, a.front) && f.push({
                        y: (k +
                            e) / 2, x: h, z: 0, xDir: { x: 0, y: 0, z: 1 }
                    }), r(a.right, a.back) && f.push({ y: (k + e) / 2, x: h, z: c, xDir: { x: -1, y: 0, z: 0 } }), u = [], r(a.bottom, a.front) && u.push({ x: (d + h) / 2, y: e, z: 0, xDir: { x: 1, y: 0, z: 0 } }), r(a.bottom, a.back) && u.push({ x: (d + h) / 2, y: e, z: c, xDir: { x: -1, y: 0, z: 0 } }), w = [], r(a.top, a.front) && w.push({ x: (d + h) / 2, y: k, z: 0, xDir: { x: 1, y: 0, z: 0 } }), r(a.top, a.back) && w.push({ x: (d + h) / 2, y: k, z: c, xDir: { x: -1, y: 0, z: 0 } }), v = [], r(a.bottom, a.left) && v.push({ z: (0 + c) / 2, y: e, x: d, xDir: { x: 0, y: 0, z: -1 } }), r(a.bottom, a.right) && v.push({
                        z: (0 + c) / 2, y: e, x: h, xDir: {
                            x: 0,
                            y: 0, z: 1
                        }
                    }), e = [], r(a.top, a.left) && e.push({ z: (0 + c) / 2, y: k, x: d, xDir: { x: 0, y: 0, z: -1 } }), r(a.top, a.right) && e.push({ z: (0 + c) / 2, y: k, x: h, xDir: { x: 0, y: 0, z: 1 } }), d = function (a, c, e) { if (0 === a.length) return null; if (1 === a.length) return a[0]; for (var b = 0, d = z(a, q, !1), f = 1; f < d.length; f++)e * d[f][c] > e * d[b][c] ? b = f : e * d[f][c] === e * d[b][c] && d[f].z < d[b].z && (b = f); return a[b] }, a.axes = { y: { left: d(f, "x", -1), right: d(f, "x", 1) }, x: { top: d(w, "y", -1), bottom: d(u, "y", 1) }, z: { top: d(e, "y", -1), bottom: d(v, "y", 1) } }) : a.axes = {
                        y: {
                            left: {
                                x: d, z: 0, xDir: {
                                    x: 1,
                                    y: 0, z: 0
                                }
                            }, right: { x: h, z: 0, xDir: { x: 0, y: 0, z: 1 } }
                        }, x: { top: { y: k, z: 0, xDir: { x: 1, y: 0, z: 0 } }, bottom: { y: e, z: 0, xDir: { x: 1, y: 0, z: 0 } } }, z: { top: { x: x ? h : d, y: k, xDir: x ? { x: 0, y: 0, z: 1 } : { x: 0, y: 0, z: -1 } }, bottom: { x: x ? h : d, y: e, xDir: x ? { x: 0, y: 0, z: 1 } : { x: 0, y: 0, z: -1 } } }
                    }; return a
        }; b.Fx.prototype.matrixSetter = function () {
            var g; if (1 > this.pos && (b.isArray(this.start) || b.isArray(this.end))) { var f = this.start || [1, 0, 0, 1, 0, 0], a = this.end || [1, 0, 0, 1, 0, 0]; g = []; for (var d = 0; 6 > d; d++)g.push(this.pos * a[d] + (1 - this.pos) * f[d]) } else g = this.end; this.elem.attr(this.prop,
                g, null, !0)
        }
    })(B); (function (b) {
        function p(e, c, b) {
            if (!e.chart.is3d() || "colorAxis" === e.coll) return c; var d = e.chart, l = z * d.options.chart.options3d.alpha, h = z * d.options.chart.options3d.beta, k = f(b && e.options.title.position3d, e.options.labels.position3d); b = f(b && e.options.title.skew3d, e.options.labels.skew3d); var m = d.frame3d, g = d.plotLeft, n = d.plotWidth + g, r = d.plotTop, t = d.plotHeight + r, d = !1, x = 0, A = 0, p = { x: 0, y: 1, z: 0 }; c = e.swapZ({ x: c.x, y: c.y, z: 0 }); if (e.isZAxis) if (e.opposite) {
                if (null === m.axes.z.top) return {}; A = c.y - r;
                c.x = m.axes.z.top.x; c.y = m.axes.z.top.y; g = m.axes.z.top.xDir; d = !m.top.frontFacing
            } else { if (null === m.axes.z.bottom) return {}; A = c.y - t; c.x = m.axes.z.bottom.x; c.y = m.axes.z.bottom.y; g = m.axes.z.bottom.xDir; d = !m.bottom.frontFacing } else if (e.horiz) if (e.opposite) { if (null === m.axes.x.top) return {}; A = c.y - r; c.y = m.axes.x.top.y; c.z = m.axes.x.top.z; g = m.axes.x.top.xDir; d = !m.top.frontFacing } else { if (null === m.axes.x.bottom) return {}; A = c.y - t; c.y = m.axes.x.bottom.y; c.z = m.axes.x.bottom.z; g = m.axes.x.bottom.xDir; d = !m.bottom.frontFacing } else if (e.opposite) {
                if (null ===
                    m.axes.y.right) return {}; x = c.x - n; c.x = m.axes.y.right.x; c.z = m.axes.y.right.z; g = m.axes.y.right.xDir; g = { x: g.z, y: g.y, z: -g.x }
            } else { if (null === m.axes.y.left) return {}; x = c.x - g; c.x = m.axes.y.left.x; c.z = m.axes.y.left.z; g = m.axes.y.left.xDir } "chart" !== k && ("flap" === k ? e.horiz ? (h = Math.sin(l), l = Math.cos(l), e.opposite && (h = -h), d && (h = -h), p = { x: g.z * h, y: l, z: -g.x * h }) : g = { x: Math.cos(h), y: 0, z: Math.sin(h) } : "ortho" === k ? e.horiz ? (p = Math.cos(l), k = Math.sin(h) * p, l = -Math.sin(l), h = -p * Math.cos(h), p = {
                x: g.y * h - g.z * l, y: g.z * k - g.x * h, z: g.x * l -
                    g.y * k
            }, l = 1 / Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z), d && (l = -l), p = { x: l * p.x, y: l * p.y, z: l * p.z }) : g = { x: Math.cos(h), y: 0, z: Math.sin(h) } : e.horiz ? p = { x: Math.sin(h) * Math.sin(l), y: Math.cos(l), z: -Math.cos(h) * Math.sin(l) } : g = { x: Math.cos(h), y: 0, z: Math.sin(h) }); c.x += x * g.x + A * p.x; c.y += x * g.y + A * p.y; c.z += x * g.z + A * p.z; d = q([c], e.chart)[0]; b ? (0 > a(q([c, { x: c.x + g.x, y: c.y + g.y, z: c.z + g.z }, { x: c.x + p.x, y: c.y + p.y, z: c.z + p.z }], e.chart)) && (g = { x: -g.x, y: -g.y, z: -g.z }), e = q([{ x: c.x, y: c.y, z: c.z }, { x: c.x + g.x, y: c.y + g.y, z: c.z + g.z }, {
                x: c.x + p.x, y: c.y + p.y,
                z: c.z + p.z
            }], e.chart), d.matrix = [e[1].x - e[0].x, e[1].y - e[0].y, e[2].x - e[0].x, e[2].y - e[0].y, d.x, d.y], d.matrix[4] -= d.x * d.matrix[0] + d.y * d.matrix[2], d.matrix[5] -= d.x * d.matrix[1] + d.y * d.matrix[3]) : d.matrix = null; return d
        } var y, t = b.addEvent, g = b.Axis, A = b.Chart, z = b.deg2rad, n = b.each, r = b.extend, x = b.merge, q = b.perspective, f = b.pick, a = b.shapeArea, d = b.splat, h = b.Tick, k = b.wrap; x(!0, g.prototype.defaultOptions, { labels: { position3d: "offset", skew3d: !1 }, title: { position3d: null, skew3d: null } }); t(g, "afterSetOptions", function () {
            var a;
            this.chart.is3d && this.chart.is3d() && "colorAxis" !== this.coll && (a = this.options, a.tickWidth = f(a.tickWidth, 0), a.gridLineWidth = f(a.gridLineWidth, 1))
        }); k(g.prototype, "getPlotLinePath", function (a) {
            var c = a.apply(this, [].slice.call(arguments, 1)); if (!this.chart.is3d() || "colorAxis" === this.coll || null === c) return c; var b = this.chart, e = b.options.chart.options3d, e = this.isZAxis ? b.plotWidth : e.depth, b = b.frame3d, c = [this.swapZ({ x: c[1], y: c[2], z: 0 }), this.swapZ({ x: c[1], y: c[2], z: e }), this.swapZ({ x: c[4], y: c[5], z: 0 }), this.swapZ({
                x: c[4],
                y: c[5], z: e
            })], e = []; this.horiz ? (this.isZAxis ? (b.left.visible && e.push(c[0], c[2]), b.right.visible && e.push(c[1], c[3])) : (b.front.visible && e.push(c[0], c[2]), b.back.visible && e.push(c[1], c[3])), b.top.visible && e.push(c[0], c[1]), b.bottom.visible && e.push(c[2], c[3])) : (b.front.visible && e.push(c[0], c[2]), b.back.visible && e.push(c[1], c[3]), b.left.visible && e.push(c[0], c[1]), b.right.visible && e.push(c[2], c[3])); e = q(e, this.chart, !1); return this.chart.renderer.toLineSegments(e)
        }); k(g.prototype, "getLinePath", function (a) {
            return this.chart.is3d() &&
                "colorAxis" !== this.coll ? [] : a.apply(this, [].slice.call(arguments, 1))
        }); k(g.prototype, "getPlotBandPath", function (a) { if (!this.chart.is3d() || "colorAxis" === this.coll) return a.apply(this, [].slice.call(arguments, 1)); var b = arguments, e = b[2], d = [], b = this.getPlotLinePath(b[1]), e = this.getPlotLinePath(e); if (b && e) for (var f = 0; f < b.length; f += 6)d.push("M", b[f + 1], b[f + 2], "L", b[f + 4], b[f + 5], "L", e[f + 4], e[f + 5], "L", e[f + 1], e[f + 2], "Z"); return d }); k(h.prototype, "getMarkPath", function (a) {
            var b = a.apply(this, [].slice.call(arguments,
                1)), b = [p(this.axis, { x: b[1], y: b[2], z: 0 }), p(this.axis, { x: b[4], y: b[5], z: 0 })]; return this.axis.chart.renderer.toLineSegments(b)
        }); t(h, "afterGetLabelPosition", function (a) { r(a.pos, p(this.axis, a.pos)) }); k(g.prototype, "getTitlePosition", function (a) { var b = a.apply(this, [].slice.call(arguments, 1)); return p(this, b, !0) }); t(g, "drawCrosshair", function (a) { this.chart.is3d() && "colorAxis" !== this.coll && a.point && (a.point.crosshairPos = this.isXAxis ? a.point.plotXold || a.point.plotX : this.len - (a.point.plotYold || a.point.plotY)) });
        t(g, "destroy", function () { n(["backFrame", "bottomFrame", "sideFrame"], function (a) { this[a] && (this[a] = this[a].destroy()) }, this) }); g.prototype.swapZ = function (a, b) { return this.isZAxis ? (b = b ? 0 : this.chart.plotLeft, { x: b + a.z, y: a.y, z: a.x - b }) : a }; y = b.ZAxis = function () { this.init.apply(this, arguments) }; r(y.prototype, g.prototype); r(y.prototype, {
            isZAxis: !0, setOptions: function (a) { a = x({ offset: 0, lineWidth: 0 }, a); g.prototype.setOptions.call(this, a); this.coll = "zAxis" }, setAxisSize: function () {
                g.prototype.setAxisSize.call(this);
                this.width = this.len = this.chart.options.chart.options3d.depth; this.right = this.chart.chartWidth - this.width - this.left
            }, getSeriesExtremes: function () {
                var a = this, b = a.chart; a.hasVisibleSeries = !1; a.dataMin = a.dataMax = a.ignoreMinPadding = a.ignoreMaxPadding = null; a.buildStacks && a.buildStacks(); n(a.series, function (c) {
                    if (c.visible || !b.options.chart.ignoreHiddenSeries) a.hasVisibleSeries = !0, c = c.zData, c.length && (a.dataMin = Math.min(f(a.dataMin, c[0]), Math.min.apply(null, c)), a.dataMax = Math.max(f(a.dataMax, c[0]), Math.max.apply(null,
                        c)))
                })
            }
        }); t(A, "afterGetAxes", function () { var a = this, b = this.options, b = b.zAxis = d(b.zAxis || {}); a.is3d() && (this.zAxis = [], n(b, function (b, c) { b.index = c; b.isX = !0; (new y(a, b)).setScale() })) })
    })(B); (function (b) {
        var p = b.addEvent, y = b.perspective, t = b.pick; p(b.Series, "afterTranslate", function () { this.chart.is3d() && this.translate3dPoints() }); b.Series.prototype.translate3dPoints = function () {
            var b = this.chart, p = t(this.zAxis, b.options.zAxis[0]), z = [], n, r, x; for (x = 0; x < this.data.length; x++)n = this.data[x], p && p.translate ? (r =
                p.isLog && p.val2lin ? p.val2lin(n.z) : n.z, n.plotZ = p.translate(r), n.isInside = n.isInside ? r >= p.min && r <= p.max : !1) : n.plotZ = 0, z.push({ x: t(n.plotXold, n.plotX), y: t(n.plotYold, n.plotY), z: t(n.plotZold, n.plotZ) }); b = y(z, b, !0); for (x = 0; x < this.data.length; x++)n = this.data[x], p = b[x], n.plotXold = n.plotX, n.plotYold = n.plotY, n.plotZold = n.plotZ, n.plotX = p.x, n.plotY = p.y, n.plotZ = p.z
        }
    })(B); (function (b) {
        function p(b) {
            var a = b.apply(this, [].slice.call(arguments, 1)); this.chart.is3d && this.chart.is3d() && (a.stroke = this.options.edgeColor ||
                a.fill, a["stroke-width"] = A(this.options.edgeWidth, 1)); return a
        } var y = b.addEvent, t = b.each, g = b.perspective, A = b.pick, z = b.Series, n = b.seriesTypes, r = b.inArray, x = b.svg, q = b.wrap; q(n.column.prototype, "translate", function (b) { b.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && this.translate3dShapes() }); q(b.Series.prototype, "alignDataLabel", function (b) { arguments[3].outside3dPlot = arguments[1].outside3dPlot; b.apply(this, [].slice.call(arguments, 1)) }); q(b.Series.prototype, "justifyDataLabel", function (b) {
            return arguments[2].outside3dPlot ?
                !1 : b.apply(this, [].slice.call(arguments, 1))
        }); n.column.prototype.translate3dPoints = function () { }; n.column.prototype.translate3dShapes = function () {
            var b = this, a = b.chart, d = b.options, h = d.depth || 25, k = (d.stacking ? d.stack || 0 : b.index) * (h + (d.groupZPadding || 1)), e = b.borderWidth % 2 ? .5 : 0; a.inverted && !b.yAxis.reversed && (e *= -1); !1 !== d.grouping && (k = 0); k += d.groupZPadding || 1; t(b.data, function (c) {
                c.outside3dPlot = null; if (null !== c.y) {
                    var d = c.shapeArgs, f = c.tooltipPos, n; t([["x", "width"], ["y", "height"]], function (a) {
                        n = d[a[0]] -
                            e; 0 > n && (d[a[1]] += d[a[0]] + e, d[a[0]] = -e, n = 0); n + d[a[1]] > b[a[0] + "Axis"].len && 0 !== d[a[1]] && (d[a[1]] = b[a[0] + "Axis"].len - d[a[0]]); if (0 !== d[a[1]] && (d[a[0]] >= b[a[0] + "Axis"].len || d[a[0]] + d[a[1]] <= e)) { for (var f in d) d[f] = 0; c.outside3dPlot = !0 }
                    }); c.shapeType = "cuboid"; d.z = k; d.depth = h; d.insidePlotArea = !0; f = g([{ x: f[0], y: f[1], z: k }], a, !0)[0]; c.tooltipPos = [f.x, f.y]
                }
            }); b.z = k
        }; q(n.column.prototype, "animate", function (b) {
            if (this.chart.is3d()) {
                var a = arguments[1], d = this.yAxis, f = this, k = this.yAxis.reversed; x && (a ? t(f.data, function (a) {
                    null !==
                        a.y && (a.height = a.shapeArgs.height, a.shapey = a.shapeArgs.y, a.shapeArgs.height = 1, k || (a.shapeArgs.y = a.stackY ? a.plotY + d.translate(a.stackY) : a.plotY + (a.negative ? -a.height : a.height)))
                }) : (t(f.data, function (a) { null !== a.y && (a.shapeArgs.height = a.height, a.shapeArgs.y = a.shapey, a.graphic && a.graphic.animate(a.shapeArgs, f.options.animation)) }), this.drawDataLabels(), f.animate = null))
            } else b.apply(this, [].slice.call(arguments, 1))
        }); q(n.column.prototype, "plotGroup", function (b, a, d, h, k, e) {
            this.chart.is3d() && e && !this[a] &&
                (this.chart.columnGroup || (this.chart.columnGroup = this.chart.renderer.g("columnGroup").add(e)), this[a] = this.chart.columnGroup, this.chart.columnGroup.attr(this.getPlotBox()), this[a].survive = !0); return b.apply(this, Array.prototype.slice.call(arguments, 1))
        }); q(n.column.prototype, "setVisible", function (b, a) {
            var d = this, f; d.chart.is3d() && t(d.data, function (b) { f = (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a) ? "visible" : "hidden"; d.options.data[r(b, d.data)] = b.options; b.graphic && b.graphic.attr({ visibility: f }) });
            b.apply(this, Array.prototype.slice.call(arguments, 1))
        }); n.column.prototype.handle3dGrouping = !0; y(z, "afterInit", function () { if (this.chart.is3d() && this.handle3dGrouping) { var b = this.options, a = b.grouping, d = b.stacking, h = A(this.yAxis.options.reversedStacks, !0), k = 0; if (void 0 === a || a) { a = this.chart.retrieveStacks(d); k = b.stack || 0; for (d = 0; d < a[k].series.length && a[k].series[d] !== this; d++); k = 10 * (a.totalStacks - a[k].position) + (h ? d : -d); this.xAxis.reversed || (k = 10 * a.totalStacks - k) } b.zIndex = k } }); q(n.column.prototype, "pointAttribs",
            p); n.columnrange && (q(n.columnrange.prototype, "pointAttribs", p), n.columnrange.prototype.plotGroup = n.column.prototype.plotGroup, n.columnrange.prototype.setVisible = n.column.prototype.setVisible); q(z.prototype, "alignDataLabel", function (b) { if (this.chart.is3d() && ("column" === this.type || "columnrange" === this.type)) { var a = arguments, d = a[4], a = a[1], f = { x: d.x, y: d.y, z: this.z }, f = g([f], this.chart, !0)[0]; d.x = f.x; d.y = a.outside3dPlot ? -9E9 : f.y } b.apply(this, [].slice.call(arguments, 1)) }); q(b.StackItem.prototype, "getStackBox",
                function (f, a) { var d = f.apply(this, [].slice.call(arguments, 1)); if (a.is3d()) { var h = { x: d.x, y: d.y, z: 0 }, h = b.perspective([h], a, !0)[0]; d.x = h.x; d.y = h.y } return d })
    })(B); (function (b) {
        var p = b.deg2rad, y = b.each, t = b.pick, g = b.seriesTypes, A = b.svg; b = b.wrap; b(g.pie.prototype, "translate", function (b) {
            b.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var g = this, r = g.options, t = r.depth || 0, q = g.chart.options.chart.options3d, f = q.alpha, a = q.beta, d = r.stacking ? (r.stack || 0) * t : g._i * t, d = d + t / 2; !1 !== r.grouping && (d = 0); y(g.data,
                    function (b) { var h = b.shapeArgs; b.shapeType = "arc3d"; h.z = d; h.depth = .75 * t; h.alpha = f; h.beta = a; h.center = g.center; h = (h.end + h.start) / 2; b.slicedTranslation = { translateX: Math.round(Math.cos(h) * r.slicedOffset * Math.cos(f * p)), translateY: Math.round(Math.sin(h) * r.slicedOffset * Math.cos(f * p)) } })
            }
        }); b(g.pie.prototype.pointClass.prototype, "haloPath", function (b) { var g = arguments; return this.series.chart.is3d() ? [] : b.call(this, g[1]) }); b(g.pie.prototype, "pointAttribs", function (b, g, r) {
            b = b.call(this, g, r); r = this.options; this.chart.is3d() &&
                (b.stroke = r.edgeColor || g.color || this.color, b["stroke-width"] = t(r.edgeWidth, 1)); return b
        }); b(g.pie.prototype, "drawPoints", function (b) { b.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && y(this.points, function (b) { var g = b.graphic; if (g) g[b.y && b.visible ? "show" : "hide"]() }) }); b(g.pie.prototype, "drawDataLabels", function (b) {
            if (this.chart.is3d()) {
                var g = this.chart.options.chart.options3d; y(this.data, function (b) {
                    var n = b.shapeArgs, q = n.r, f = (n.start + n.end) / 2, a = b.labelPos, d = -q * (1 - Math.cos((n.alpha || g.alpha) *
                        p)) * Math.sin(f), h = q * (Math.cos((n.beta || g.beta) * p) - 1) * Math.cos(f); y([0, 2, 4], function (b) { a[b] += h; a[b + 1] += d })
                })
            } b.apply(this, [].slice.call(arguments, 1))
        }); b(g.pie.prototype, "addPoint", function (b) { b.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && this.update(this.userOptions, !0) }); b(g.pie.prototype, "animate", function (b) {
            if (this.chart.is3d()) {
                var g = arguments[1], r = this.options.animation, p = this.center, q = this.group, f = this.markerGroup; A && (!0 === r && (r = {}), g ? (q.oldtranslateX = q.translateX, q.oldtranslateY =
                    q.translateY, g = { translateX: p[0], translateY: p[1], scaleX: .001, scaleY: .001 }, q.attr(g), f && (f.attrSetters = q.attrSetters, f.attr(g))) : (g = { translateX: q.oldtranslateX, translateY: q.oldtranslateY, scaleX: 1, scaleY: 1 }, q.animate(g, r), f && f.animate(g, r), this.animate = null))
            } else b.apply(this, [].slice.call(arguments, 1))
        })
    })(B); (function (b) {
        var p = b.Point, y = b.seriesType, t = b.seriesTypes; y("scatter3d", "scatter", { tooltip: { pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e" } },
            { pointAttribs: function (g) { var p = t.scatter.prototype.pointAttribs.apply(this, arguments); this.chart.is3d() && g && (p.zIndex = b.pointCameraDistance(g, this.chart)); return p }, axisTypes: ["xAxis", "yAxis", "zAxis"], pointArrayMap: ["x", "y", "z"], parallelArrays: ["x", "y", "z"], directTouch: !0 }, { applyOptions: function () { p.prototype.applyOptions.apply(this, arguments); void 0 === this.z && (this.z = 0); return this } })
    })(B); (function (b) {
        var p = b.addEvent, y = b.Axis, t = b.SVGRenderer, g = b.VMLRenderer; g && (b.setOptions({ animate: !1 }), g.prototype.face3d =
            t.prototype.face3d, g.prototype.polyhedron = t.prototype.polyhedron, g.prototype.cuboid = t.prototype.cuboid, g.prototype.cuboidPath = t.prototype.cuboidPath, g.prototype.toLinePath = t.prototype.toLinePath, g.prototype.toLineSegments = t.prototype.toLineSegments, g.prototype.createElement3D = t.prototype.createElement3D, g.prototype.arc3d = function (b) { b = t.prototype.arc3d.call(this, b); b.css({ zIndex: b.zIndex }); return b }, b.VMLRenderer.prototype.arc3dPath = b.SVGRenderer.prototype.arc3dPath, p(y, "render", function () {
                this.sideFrame &&
                    (this.sideFrame.css({ zIndex: 0 }), this.sideFrame.front.attr({ fill: this.sideFrame.color })); this.bottomFrame && (this.bottomFrame.css({ zIndex: 1 }), this.bottomFrame.front.attr({ fill: this.bottomFrame.color })); this.backFrame && (this.backFrame.css({ zIndex: 0 }), this.backFrame.front.attr({ fill: this.backFrame.color }))
            }))
    })(B)
});