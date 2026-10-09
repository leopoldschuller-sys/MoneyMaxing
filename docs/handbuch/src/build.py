# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
import front, ch34, ch5, ch678, ch910, appendix

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Roblox-Erfolgsspiel-Handbuch.pdf"))


def toc_page():
    head = Paragraph("Inhaltsverzeichnis", ParagraphStyle("TOCH", parent=S["H1"]))
    return [Paragraph("ÜBERSICHT", S["kicker"]), head, RuleLine(CONTENT_W, 2.2, BLUE), Spacer(1, 8), make_toc()]


def flat(xs):
    out = []
    for x in xs:
        if isinstance(x, (list, tuple)):
            out += flat(x)
        else:
            out.append(x)
    return out


def main():
    story = [NextPageTemplate("main"), PageBreak()]
    story += toc_page()
    story += front.readme_first()
    story += front.chapter1() + front.chapter2()
    story += ch34.chapter3() + ch34.chapter4()
    story += ch5.chapter5()
    story += ch678.chapter6() + ch678.chapter7() + ch678.chapter8()
    story += ch910.chapter9() + ch910.chapter10()
    story += appendix.appendix_a() + appendix.appendix_b() + appendix.appendix_c() + appendix.appendix_d() + appendix.appendix_e()
    story = flat(story)
    doc = Doc(OUT, title="Roblox-Erfolgsspiel: Das Schritt-für-Schritt-Handbuch")
    doc.multiBuild(story)
    print("PDF:", OUT, os.path.getsize(OUT) // 1024, "KB")


if __name__ == "__main__":
    main()
