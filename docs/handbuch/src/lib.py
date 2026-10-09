# -*- coding: utf-8 -*-
"""Layout-Bibliothek fuer das Handbuch: Fonts, Stile, Bausteine, Zeichen-Toolkit."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                PageBreak, Table, TableStyle, Flowable, KeepTogether,
                                NextPageTemplate, Preformatted, CondPageBreak)
from reportlab.platypus.tableofcontents import TableOfContents

# ---------------------------------------------------------------- Fonts
FD = "/usr/share/fonts/truetype/crosextra/"
DJ = "/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont("Body", FD + "Carlito-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold", FD + "Carlito-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Body-Italic", FD + "Carlito-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Body-BoldItalic", FD + "Carlito-BoldItalic.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold", italic="Body-Italic", boldItalic="Body-BoldItalic")
pdfmetrics.registerFont(TTFont("Sym", DJ + "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Sym-Bold", DJ + "DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Mono", DJ + "DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont("Mono-Bold", DJ + "DejaVuSansMono-Bold.ttf"))
pdfmetrics.registerFontFamily("Sym", normal="Sym", bold="Sym-Bold", italic="Sym", boldItalic="Sym-Bold")

_BODY_CMAP = set(pdfmetrics.getFont("Body").face.charToGlyph.keys())
_SYM_CMAP = set(pdfmetrics.getFont("Sym").face.charToGlyph.keys())


def symfix(s):
    """Zeichen, die Carlito nicht kennt (z. B. Haekchen), in DejaVu setzen."""
    import re
    s = re.sub(r"&(?!amp;|lt;|gt;|#)", "&amp;", s)
    s = re.sub(r"<(?=[\s\d=])", "&lt;", s)
    out, open_ = [], False
    for ch in s:
        need = ord(ch) > 127 and ord(ch) not in _BODY_CMAP
        if need and ord(ch) not in _SYM_CMAP:
            raise ValueError("Glyph fehlt in allen Fonts: %r (U+%04X)" % (ch, ord(ch)))
        if need and not open_:
            out.append('<font name="Sym">'); open_ = True
        elif not need and open_:
            out.append("</font>"); open_ = False
        out.append(ch)
    if open_:
        out.append("</font>")
    return "".join(out)


# ---------------------------------------------------------------- Farben
NAVY = colors.HexColor("#0B1F3A"); INK = colors.HexColor("#0F172A"); SLATE = colors.HexColor("#334155")
MUTE = colors.HexColor("#64748B"); LINE = colors.HexColor("#CBD5E1"); BG = colors.HexColor("#F1F5F9")
BG2 = colors.HexColor("#F8FAFC")
BLUE = colors.HexColor("#2563EB"); BLUE_L = colors.HexColor("#DBEAFE")
TEAL = colors.HexColor("#0D9488"); TEAL_L = colors.HexColor("#CCFBF1")
GREEN = colors.HexColor("#16A34A"); GREEN_L = colors.HexColor("#DCFCE7")
ORANGE = colors.HexColor("#D97706"); ORANGE_L = colors.HexColor("#FEF3C7")
RED = colors.HexColor("#DC2626"); RED_L = colors.HexColor("#FEE2E2")
PURPLE = colors.HexColor("#7C3AED"); PURPLE_L = colors.HexColor("#EDE9FE")
WHITE = colors.white

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

# ---------------------------------------------------------------- Stile
S = {}
S["body"] = ParagraphStyle("body", fontName="Body", fontSize=10.3, leading=14.2, textColor=SLATE, spaceAfter=5.5)
S["small"] = ParagraphStyle("small", parent=S["body"], fontSize=8.8, leading=11.6, textColor=MUTE, spaceAfter=3)
S["cap"] = ParagraphStyle("cap", parent=S["small"], fontName="Body-Italic", alignment=TA_CENTER, spaceBefore=3, spaceAfter=9)
S["H1"] = ParagraphStyle("H1", fontName="Body-Bold", fontSize=26, leading=30, textColor=NAVY, spaceAfter=10)
S["H2"] = ParagraphStyle("H2", fontName="Body-Bold", fontSize=15.5, leading=19, textColor=BLUE, spaceBefore=13, spaceAfter=6, keepWithNext=1)
S["H3"] = ParagraphStyle("H3", fontName="Body-Bold", fontSize=11.6, leading=15, textColor=NAVY, spaceBefore=8, spaceAfter=3, keepWithNext=1)
S["kicker"] = ParagraphStyle("kicker", fontName="Body-Bold", fontSize=10, leading=12, textColor=TEAL, spaceAfter=2)
S["bul"] = ParagraphStyle("bul", parent=S["body"], leftIndent=13, bulletIndent=2, spaceAfter=2.6)
S["chk"] = ParagraphStyle("chk", parent=S["body"], leftIndent=17, firstLineIndent=-17, spaceAfter=3)
S["cell"] = ParagraphStyle("cell", fontName="Body", fontSize=9.2, leading=11.8, textColor=SLATE)
S["cellb"] = ParagraphStyle("cellb", parent=S["cell"], fontName="Body-Bold", textColor=NAVY)
S["cellh"] = ParagraphStyle("cellh", parent=S["cell"], fontName="Body-Bold", textColor=WHITE)
S["toc1"] = ParagraphStyle("toc1", fontName="Body-Bold", fontSize=10.4, leading=13.5, textColor=NAVY, spaceBefore=3.5)
S["toc2"] = ParagraphStyle("toc2", fontName="Body", fontSize=8.4, leading=10.3, leftIndent=14, textColor=SLATE)


def P(text, style="body", **kw):
    st = S[style] if not kw else ParagraphStyle("tmp", parent=S[style], **kw)
    return Paragraph(symfix(text), st)


def H1(text, kicker=None):
    out = []
    if kicker:
        out.append(Paragraph(symfix(kicker), S["kicker"]))
    out.append(Paragraph(symfix(text), S["H1"]))
    out.append(RuleLine(CONTENT_W, 2.2, BLUE))
    out.append(Spacer(1, 8))
    return out


def H2(text):
    return Paragraph(symfix(text), S["H2"])


def H2f(text, need):
    """H2, das garantiert zusammen mit der folgenden Abbildung (Hoehe `need`) steht."""
    return [CondPageBreak(need), H2(text)]


def H3(text):
    return Paragraph(symfix(text), S["H3"])


def bullets(items, style="bul"):
    return [Paragraph(symfix(t), S[style], bulletText="•") for t in items]


def checks(items):
    return [Paragraph(symfix("☐  " + t), S["chk"]) for t in items]


def numbered(items):
    return [Paragraph(symfix("<b>%d.</b>  %s" % (i + 1, t)), ParagraphStyle("n", parent=S["chk"], leftIndent=18, firstLineIndent=-18))
            for i, t in enumerate(items)]


class RuleLine(Flowable):
    def __init__(self, w, th=1, color=LINE):
        super().__init__(); self.w, self.th, self.color = w, th, color; self.width = w; self.height = th

    def wrap(self, aw, ah):
        return self.w, self.th + 1

    def draw(self):
        self.canv.setStrokeColor(self.color); self.canv.setLineWidth(self.th)
        self.canv.line(0, 0, self.w, 0)


# ---------------------------------------------------------------- Tabellen
def _cell(c, style):
    if isinstance(c, (list, tuple)):
        return [Paragraph(symfix(x), S[style]) if isinstance(x, str) else x for x in c]
    if isinstance(c, str):
        return Paragraph(symfix(c), S[style])
    return c


def table(rows, widths, header=True, zebra=True, first_col_bold=False, valign="TOP", font_hdr=NAVY, repeat=1):
    data = []
    for ri, row in enumerate(rows):
        r = []
        for ci, c in enumerate(row):
            if header and ri == 0:
                r.append(_cell(c, "cellh"))
            elif first_col_bold and ci == 0:
                r.append(_cell(c, "cellb"))
            else:
                r.append(_cell(c, "cell"))
        data.append(r)
    tw = [w * CONTENT_W if w <= 1 else w for w in widths]
    t = Table(data, colWidths=tw, repeatRows=repeat if header else 0)
    st = [("VALIGN", (0, 0), (-1, -1), valign), ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
          ("TOPPADDING", (0, 0), (-1, -1), 4.2), ("BOTTOMPADDING", (0, 0), (-1, -1), 4.2),
          ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE), ("BOX", (0, 0), (-1, -1), 0.6, LINE)]
    if header:
        st += [("BACKGROUND", (0, 0), (-1, 0), font_hdr)]
    if zebra:
        for i in range(1 if header else 0, len(rows)):
            if (i % 2 == 0):
                st.append(("BACKGROUND", (0, i), (-1, i), BG2))
    t.setStyle(TableStyle(st))
    return [t, Spacer(1, 7)]


# ---------------------------------------------------------------- Callouts
_KIND = {
    "tip": ("TIPP", GREEN, GREEN_L), "warn": ("ACHTUNG", RED, RED_L), "info": ("WISSEN", BLUE, BLUE_L),
    "check": ("PRÜFEN", ORANGE, ORANGE_L), "do": ("MACH JETZT", TEAL, TEAL_L), "idea": ("DEINE IDEE", PURPLE, PURPLE_L),
}


def callout(kind, text, title=None):
    label, col, bgc = _KIND[kind]
    head = Paragraph(symfix("<font color='#%s'><b>%s</b></font>%s" % (col.hexval()[2:], title or label, "" if not title else "")),
                     ParagraphStyle("ch", parent=S["cell"], fontSize=8.8, leading=11, spaceAfter=2))
    if title:
        head = Paragraph(symfix("<font color='#%s'><b>%s — %s</b></font>" % (col.hexval()[2:], label, title)),
                         ParagraphStyle("ch", parent=S["cell"], fontSize=8.8, leading=11, spaceAfter=2))
    body = []
    for t in (text if isinstance(text, list) else [text]):
        body.append(Paragraph(symfix(t), ParagraphStyle("cb", parent=S["body"], fontSize=9.6, leading=13, spaceAfter=2.5, textColor=INK)) if isinstance(t, str) else t)
    t = Table([[ "", [head] + body ]], colWidths=[4, CONTENT_W - 4])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), col), ("BACKGROUND", (1, 0), (1, 0), bgc),
                           ("LEFTPADDING", (1, 0), (1, 0), 9), ("RIGHTPADDING", (1, 0), (1, 0), 9),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                           ("LEFTPADDING", (0, 0), (0, 0), 0), ("RIGHTPADDING", (0, 0), (0, 0), 0)]))
    return KeepTogether([t, Spacer(1, 8)])


def step(num, title, body):
    """Schritt-Karte: Nummer links, Titel + Inhalt rechts."""
    badge = Paragraph(symfix("<font color='white'><b>%s</b></font>" % num),
                      ParagraphStyle("bd", fontName="Body-Bold", fontSize=11.5, leading=14, alignment=TA_CENTER))
    content = [Paragraph(symfix(title), ParagraphStyle("st", fontName="Body-Bold", fontSize=11.4, leading=14.5, textColor=NAVY, spaceAfter=3))]
    for b in (body if isinstance(body, list) else [body]):
        content.append(Paragraph(symfix(b), S["body"]) if isinstance(b, str) else b)
    t = Table([[badge, content]], colWidths=[26, CONTENT_W - 26])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), BLUE), ("VALIGN", (0, 0), (0, 0), "TOP"), ("VALIGN", (1, 0), (1, 0), "TOP"),
                           ("TOPPADDING", (0, 0), (0, 0), 6), ("BOTTOMPADDING", (0, 0), (0, 0), 6),
                           ("LEFTPADDING", (1, 0), (1, 0), 10), ("RIGHTPADDING", (1, 0), (1, 0), 4),
                           ("TOPPADDING", (1, 0), (1, 0), 5), ("BOTTOMPADDING", (1, 0), (1, 0), 3),
                           ("LEFTPADDING", (0, 0), (0, 0), 0), ("RIGHTPADDING", (0, 0), (0, 0), 0),
                           ("BOX", (0, 0), (-1, -1), 0.6, LINE)]))
    return t


def gap(h=6):
    return Spacer(1, h)


# ---------------------------------------------------------------- Code
def code_blocks(path, chunk=58, title=None):
    src = wrap_code(open(path, encoding="utf-8").read().replace("\t", "  ").rstrip("\n"), 6.7)
    lines = src.split("\n")
    out = []
    if title:
        out.append(P("<b>%s</b>" % title, "small", textColor=NAVY, spaceAfter=2))
    mono = ParagraphStyle("mono", fontName="Mono", fontSize=6.7, leading=8.5, textColor=INK)
    for i in range(0, len(lines), chunk):
        part = "\n".join(lines[i:i + chunk])
        pre = Preformatted(part, mono)
        t = Table([["", pre]], colWidths=[3, CONTENT_W - 3])
        t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), TEAL), ("BACKGROUND", (1, 0), (1, 0), BG2),
                               ("BOX", (1, 0), (1, 0), 0.4, LINE), ("LEFTPADDING", (1, 0), (1, 0), 7), ("RIGHTPADDING", (1, 0), (1, 0), 3),
                               ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                               ("LEFTPADDING", (0, 0), (0, 0), 0), ("RIGHTPADDING", (0, 0), (0, 0), 0)]))
        out.append(t)
        out.append(Spacer(1, 3))
    return out


def wrap_code(text, size):
    maxc = int(468 / (0.602 * size))
    out = []
    for ln in text.split("\n"):
        indent = len(ln) - len(ln.lstrip())
        first = True
        while len(ln) > maxc:
            cut = ln.rfind(", ", 0, maxc)
            if cut <= indent + 8:
                cut = ln.rfind(" ", indent + 8, maxc)
                if cut <= indent + 8:
                    cut = maxc - 1
                out.append(ln[:cut]); rest = ln[cut:].lstrip()
            else:
                out.append(ln[:cut + 1]); rest = ln[cut + 2:]
            ln = " " * (indent + 4) + rest
            first = False
        out.append(ln)
    return "\n".join(out)


def _code_table(part, size):
    mono = ParagraphStyle("mono2", fontName="Mono", fontSize=size, leading=size * 1.28, textColor=INK)
    pre = Preformatted(part, mono)
    t = Table([["", pre]], colWidths=[3, CONTENT_W - 3])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), TEAL), ("BACKGROUND", (1, 0), (1, 0), BG2), ("BOX", (1, 0), (1, 0), 0.4, LINE),
                           ("LEFTPADDING", (1, 0), (1, 0), 7), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                           ("LEFTPADDING", (0, 0), (0, 0), 0), ("RIGHTPADDING", (0, 0), (0, 0), 0)]))
    return t


def snippet(code, size=7.2):
    text = wrap_code(code.strip("\n").replace("\t", "  "), size)
    lines = text.split("\n")
    if len(lines) <= 30:
        return KeepTogether([_code_table(text, size), Spacer(1, 6)])
    parts = ["\n".join(lines[i:i + 34]) for i in range(0, len(lines), 34)]
    out = []
    for part in parts:
        out += [_code_table(part, size), Spacer(1, 2)]
    return out


# ---------------------------------------------------------------- Zeichen-Toolkit
class G:
    """Zeichnen mit Koordinaten von oben links (y waechst nach unten)."""

    def __init__(self, c, W, H):
        self.c, self.W, self.H = c, W, H

    def _fs(self, s):
        """zerlegt Text in Laeufe (font, text); Symbole aus DejaVu."""
        runs, cur, curf = [], "", None
        for ch in s:
            f = "sym" if (ord(ch) > 127 and ord(ch) not in _BODY_CMAP) else "body"
            if f != curf and cur:
                runs.append((curf, cur)); cur = ""
            curf = f; cur += ch
        if cur:
            runs.append((curf, cur))
        return runs

    def text(self, x, y, s, size=9, color=INK, bold=False, anchor="l", mono=False):
        c = self.c
        fb = "Mono-Bold" if (mono and bold) else "Mono" if mono else "Body-Bold" if bold else "Body"
        fs = "Sym-Bold" if bold else "Sym"
        runs = self._fs(s) if not mono else [("body", s)]
        widths = [pdfmetrics.stringWidth(t, fb if f == "body" else fs, size) for f, t in runs]
        total = sum(widths)
        px = x - total / 2 if anchor == "c" else x - total if anchor == "r" else x
        c.setFillColor(color)
        for (f, t), w in zip(runs, widths):
            c.setFont(fb if f == "body" else fs, size)
            c.drawString(px, self.H - y, t)
            px += w

    def tw(self, s, size, bold=False):
        fb = "Body-Bold" if bold else "Body"
        fs = "Sym-Bold" if bold else "Sym"
        return sum(pdfmetrics.stringWidth(t, fb if f == "body" else fs, size) for f, t in self._fs(s))

    def _tokens(self, s, base_bold):
        import re
        toks, bold, col, stack = [], base_bold, None, []
        for part in re.split(r"(<[^>]+>|\n)", s):
            if part == "\n":
                toks.append(("NL",)); continue
            if part.startswith("<"):
                tag = part.lower()
                if tag == "<b>": bold = True
                elif tag == "</b>": bold = base_bold
                elif tag.startswith("<font"):
                    m = re.search(r"color=['\"]?(#[0-9a-fA-F]{6})", part)
                    stack.append(col); col = colors.HexColor(m.group(1)) if m else col
                elif tag == "</font>": col = stack.pop() if stack else None
                elif tag.startswith("<br"): toks.append(("NL",))
                continue
            for wd in re.split(r"(\s+)", part):
                if wd:
                    toks.append(("W", wd, bold, col))
        return toks

    def para(self, x, y, w, s, size=9, color=INK, leading=None, bold=False, anchor="l", mono=False):
        """Mehrzeiliger Text mit Umbruch; versteht <b>..</b>, <font color='#hex'>..</font> und \\n."""
        leading = leading or size * 1.22
        lines, cur, curw = [], [], 0.0
        space = self.tw(" ", size)
        for t in self._tokens(s, bold):
            if t[0] == "NL":
                lines.append((cur, curw)); cur, curw = [], 0.0; continue
            _, word, b, col = t
            if word.isspace():
                if cur:
                    cur.append((" ", b, col, space)); curw += space
                continue
            ww = self.tw(word, size, b)
            if cur and curw + ww > w:
                while cur and cur[-1][0] == " ":
                    curw -= cur[-1][3]; cur.pop()
                lines.append((cur, curw)); cur, curw = [], 0.0
            cur.append((word, b, col, ww)); curw += ww
        lines.append((cur, curw))
        for i, (items, lw) in enumerate(lines):
            px = x + (w - lw) / 2 if anchor == "c" else x
            for word, b, col, ww in items:
                if word != " ":
                    self.text(px, y + i * leading, word, size, col or color, b)
                px += ww
        return len(lines) * leading

    def rect(self, x, y, w, h, fill=None, stroke=None, r=0, lw=1, dash=None):
        c = self.c
        if fill is not None:
            c.setFillColor(fill)
        if stroke is not None:
            c.setStrokeColor(stroke); c.setLineWidth(lw)
        if dash:
            c.setDash(*dash)
        if r:
            c.roundRect(x, self.H - y - h, w, h, r, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)
        else:
            c.rect(x, self.H - y - h, w, h, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)
        if dash:
            c.setDash()

    def line(self, x1, y1, x2, y2, color=LINE, lw=1, dash=None):
        c = self.c
        c.setStrokeColor(color); c.setLineWidth(lw)
        if dash:
            c.setDash(*dash)
        c.line(x1, self.H - y1, x2, self.H - y2)
        if dash:
            c.setDash()

    def arrow(self, x1, y1, x2, y2, color=SLATE, lw=1.3, head=5.5):
        import math
        self.line(x1, y1, x2, y2, color, lw)
        a = math.atan2(-(y2 - y1), x2 - x1)
        c = self.c
        c.setFillColor(color)
        p = c.beginPath()
        p.moveTo(x2, self.H - y2)
        p.lineTo(x2 - head * math.cos(a - 0.45), self.H - y2 - head * math.sin(a - 0.45))
        p.lineTo(x2 - head * math.cos(a + 0.45), self.H - y2 - head * math.sin(a + 0.45))
        p.close(); c.drawPath(p, stroke=0, fill=1)

    def circle(self, x, y, r, fill=None, stroke=None, lw=1):
        c = self.c
        if fill is not None:
            c.setFillColor(fill)
        if stroke is not None:
            c.setStrokeColor(stroke); c.setLineWidth(lw)
        c.circle(x, self.H - y, r, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)

    def marker(self, x, y, n, color=RED):
        self.circle(x, y, 7.2, fill=color)
        self.text(x, y + 3.4, str(n), 9, WHITE, True, "c")

    def poly(self, pts, fill=None, stroke=None, lw=1):
        c = self.c
        p = c.beginPath()
        p.moveTo(pts[0][0], self.H - pts[0][1])
        for (x, y) in pts[1:]:
            p.lineTo(x, self.H - y)
        p.close()
        if fill is not None:
            c.setFillColor(fill)
        if stroke is not None:
            c.setStrokeColor(stroke); c.setLineWidth(lw)
        c.drawPath(p, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)

    def window(self, x, y, w, h, title="", titlecolor=NAVY):
        self.rect(x, y, w, h, fill=WHITE, stroke=LINE, r=5, lw=1)
        self.rect(x, y, w, 17, fill=titlecolor, r=5)
        self.rect(x, y + 10, w, 7, fill=titlecolor)
        for i, col in enumerate(("#F87171", "#FBBF24", "#34D399")):
            self.circle(x + 9 + i * 10, y + 8.5, 2.6, fill=colors.HexColor(col))
        if title:
            self.text(x + 42, y + 11.8, title, 7.8, WHITE, True)


class Diagram(Flowable):
    def __init__(self, w, h, fn):
        super().__init__(); self.w, self.h, self.fn = w, h, fn

    def wrap(self, aw, ah):
        return self.w, self.h

    def draw(self):
        self.fn(G(self.canv, self.w, self.h))


_fig_no = [0]


def fig(h, fn, caption, w=None):
    _fig_no[0] += 1
    d = Diagram(w or CONTENT_W, h, fn)
    cap = Paragraph(symfix("<b>Abb. %d</b> — %s" % (_fig_no[0], caption)), S["cap"])
    return KeepTogether([d, cap])


# ---------------------------------------------------------------- Dokument
class Doc(BaseDocTemplate):
    def __init__(self, filename, **kw):
        super().__init__(filename, pagesize=A4, leftMargin=MARGIN_X, rightMargin=MARGIN_X, topMargin=24 * mm, bottomMargin=20 * mm,
                         title=kw.get("title"), author="Claude (für L. Schuller)", subject="Roblox-Spielentwicklung: Handbuch")
        self.chapter = ""
        self._k = 0
        main = Frame(MARGIN_X, 20 * mm, CONTENT_W, PAGE_H - 44 * mm, id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        cover = Frame(MARGIN_X, 20 * mm, CONTENT_W, PAGE_H - 40 * mm, id="cover")
        self.addPageTemplates([PageTemplate(id="cover", frames=[cover], onPage=self.draw_cover),
                               PageTemplate(id="main", frames=[main], onPageEnd=self.draw_chrome)])

    def beforeDocument(self):
        self.chapter = ""

    def afterFlowable(self, fl):
        if isinstance(fl, Paragraph):
            nm = fl.style.name
            if nm in ("H1", "H2"):
                text = fl.getPlainText()
                import zlib
                key = "h%08x" % zlib.crc32(text.encode("utf-8"))
                self.canv.bookmarkPage(key)
                lvl = 0 if nm == "H1" else 1
                self.canv.addOutlineEntry(text, key, level=lvl, closed=True)
                self.notify("TOCEntry", (lvl, text, self.page, key))
                if nm == "H1":
                    self.chapter = text

    def draw_chrome(self, c, doc):
        c.saveState()
        c.setStrokeColor(LINE); c.setLineWidth(0.5)
        c.line(MARGIN_X, PAGE_H - 17 * mm, PAGE_W - MARGIN_X, PAGE_H - 17 * mm)
        c.setFont("Body", 8.3); c.setFillColor(MUTE)
        c.drawString(MARGIN_X, PAGE_H - 14.5 * mm, symfix_plain(self.chapter))
        c.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 14.5 * mm, "Roblox-Erfolgsspiel · Handbuch")
        c.line(MARGIN_X, 15 * mm, PAGE_W - MARGIN_X, 15 * mm)
        c.drawString(MARGIN_X, 10.5 * mm, "Stand: 9. Oktober 2026")
        c.setFont("Body-Bold", 9); c.setFillColor(NAVY)
        c.drawRightString(PAGE_W - MARGIN_X, 10.5 * mm, str(doc.page))
        c.restoreState()

    def draw_cover(self, c, doc):
        import math
        c.saveState()
        c.setFillColor(NAVY); c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        # abstrakte Bloecke
        def cube(cx, cy, s, top, left, right):
            h = s * 0.5
            for pts, col in (([(cx, cy + s), (cx + s * .87, cy + s * .5 + 0), (cx, cy), (cx - s * .87, cy + s * .5)], top),
                             ([(cx - s * .87, cy + s * .5), (cx, cy), (cx, cy - s), (cx - s * .87, cy - s * .5)], left),
                             ([(cx, cy), (cx + s * .87, cy + s * .5), (cx + s * .87, cy - s * .5), (cx, cy - s)], right)):
                c.setFillColor(col)
                p = c.beginPath(); p.moveTo(*pts[0])
                for q in pts[1:]:
                    p.lineTo(*q)
                p.close(); c.drawPath(p, stroke=0, fill=1)
        cube(PAGE_W - 62 * mm, PAGE_H - 62 * mm, 36 * mm, colors.HexColor("#60A5FA"), colors.HexColor("#2563EB"), colors.HexColor("#1D4ED8"))
        cube(PAGE_W - 30 * mm, PAGE_H - 95 * mm, 22 * mm, colors.HexColor("#FCD34D"), colors.HexColor("#F59E0B"), colors.HexColor("#D97706"))
        cube(PAGE_W - 92 * mm, PAGE_H - 100 * mm, 15 * mm, colors.HexColor("#5EEAD4"), colors.HexColor("#14B8A6"), colors.HexColor("#0F766E"))
        c.setFillColor(colors.HexColor("#60A5FA")); c.setFont("Body-Bold", 13)
        c.drawString(MARGIN_X, PAGE_H - 120 * mm, "HANDBUCH  ·  SCHRITT FÜR SCHRITT")
        c.setFillColor(WHITE); c.setFont("Body-Bold", 46)
        c.drawString(MARGIN_X, PAGE_H - 140 * mm, "Roblox-")
        c.drawString(MARGIN_X, PAGE_H - 158 * mm, "Erfolgsspiel")
        c.setFont("Body", 17); c.setFillColor(colors.HexColor("#CBD5E1"))
        c.drawString(MARGIN_X, PAGE_H - 175 * mm, "Deine Idee. Mein Fahrplan.")
        c.drawString(MARGIN_X, PAGE_H - 183 * mm, "Von der leeren Seite bis zum Live-Betrieb.")
        c.setStrokeColor(colors.HexColor("#F59E0B")); c.setLineWidth(3); c.line(MARGIN_X, PAGE_H - 195 * mm, MARGIN_X + 38 * mm, PAGE_H - 195 * mm)
        c.setFont("Body", 11); c.setFillColor(colors.HexColor("#94A3B8"))
        c.drawString(MARGIN_X, PAGE_H - 206 * mm, "19 Wochen bis zum Launch  ·  getesteter Starter-Code  ·  Checklisten & Vorlagen")
        c.setFont("Body", 10); c.drawString(MARGIN_X, 22 * mm, "Stand: 9. Oktober 2026")
        c.drawString(MARGIN_X, 16 * mm, "Plan, Zahlen und Quellen: siehe Kapitel „Lies mich zuerst“ und Anhang E")
        c.restoreState()


def symfix_plain(s):
    return s


def make_toc():
    toc = TableOfContents()
    toc.levelStyles = [S["toc1"], S["toc2"]]
    toc.dotsMinLevel = 0
    return toc
