#!/usr/bin/env python3
import subprocess, os, sys

MD_FILE = "/home/khai/badminton-react/test-cases.md"
HTML_FILE = "/home/khai/badminton-react/test-cases.html"
PDF_FILE = "/home/khai/badminton-react/test-cases.pdf"

with open(MD_FILE, "r", encoding="utf-8") as f:
    md = f.read()

# Simple markdown to HTML converter for this specific file
import re

def md_to_html_tables(text):
    lines = text.split("\n")
    html_lines = []
    in_table = False
    in_list = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Heading levels
        if line.startswith("# "):
            if in_table: html_lines.append("</table>"); in_table = False
            html_lines.append(f"<h1>{line[2:]}</h1>")
        elif line.startswith("## "):
            if in_table: html_lines.append("</table>"); in_table = False
            html_lines.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith("### "):
            if in_table: html_lines.append("</table>"); in_table = False
            html_lines.append(f"<h3>{line[4:]}</h3>")

        # Horizontal rule
        elif line.strip() == "---":
            if in_table: html_lines.append("</table>"); in_table = False
            html_lines.append("<hr>")

        # Table row
        elif line.strip().startswith("|") and line.strip().endswith("|"):
            cells = [c.strip() for c in line.strip()[1:-1].split("|")]
            # Check if next line is separator
            is_header = (i + 1 < len(lines) and
                         re.fullmatch(r"[\|\s\-:]+", lines[i+1].strip()))
            if not in_table:
                html_lines.append('<table>')
                in_table = True
            if is_header:
                html_lines.append("<thead><tr>" +
                    "".join(f"<th>{c}</th>" for c in cells) +
                    "</tr></thead><tbody>")
                i += 2  # skip separator line
                continue
            else:
                html_lines.append("<tr>" +
                    "".join(f"<td>{c}</td>" for c in cells) +
                    "</tr>")

        # Empty line
        elif line.strip() == "":
            if in_table:
                html_lines.append("</tbody></table>")
                in_table = False
            html_lines.append("<br>")

        else:
            if in_table:
                html_lines.append("</tbody></table>")
                in_table = False
            html_lines.append(f"<p>{line}</p>")

        i += 1

    if in_table:
        html_lines.append("</tbody></table>")

    return "\n".join(html_lines)

body = md_to_html_tables(md)

html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Cases - Hệ thống Đặt sân Cầu lông</title>
<style>
  @page {{ size: A4 landscape; margin: 12mm 10mm; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 8pt;
    color: #222;
    background: #fff;
    padding: 8px;
  }}
  h1 {{
    font-size: 16pt;
    color: #1a3a5c;
    border-bottom: 3px solid #1a3a5c;
    padding-bottom: 6px;
    margin: 14px 0 8px 0;
    page-break-before: avoid;
  }}
  h2 {{
    font-size: 11pt;
    color: #fff;
    background: #1a3a5c;
    padding: 5px 10px;
    margin: 12px 0 0 0;
    border-radius: 3px 3px 0 0;
    page-break-after: avoid;
  }}
  h3 {{ font-size: 9pt; color: #1a3a5c; margin: 8px 0 4px 0; }}
  hr {{ border: none; border-top: 1px solid #ddd; margin: 8px 0; }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 7.5pt;
    page-break-inside: auto;
  }}
  thead tr {{
    background: #2e6da4;
    color: #fff;
  }}
  thead th {{
    padding: 5px 4px;
    text-align: left;
    border: 1px solid #1a4a7c;
    font-weight: 600;
    white-space: nowrap;
  }}
  tbody tr:nth-child(even) {{ background: #f0f5fb; }}
  tbody tr:nth-child(odd)  {{ background: #fff; }}
  tbody tr:hover {{ background: #ddeeff; }}
  td {{
    padding: 4px;
    border: 1px solid #c5d8f0;
    vertical-align: top;
    word-break: break-word;
  }}
  /* Highlight status column */
  td:nth-child(7) {{ text-align: center; font-weight: bold; color: #16a34a; }}
  /* Priority column */
  td:nth-child(8) {{ text-align: center; }}
  p {{ margin: 2px 0; }}
  br {{ display: none; }}
  @media print {{
    h2 {{ page-break-before: always; }}
    h1 + h2 {{ page-break-before: avoid; }}
    table {{ page-break-inside: auto; }}
    tr {{ page-break-inside: avoid; }}
  }}
</style>
</head>
<body>
{body}
</body>
</html>"""

with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(html)

print(f"HTML created: {HTML_FILE}")

# Convert HTML to PDF using Chrome headless
chrome_cmd = [
    "google-chrome",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--print-to-pdf=" + PDF_FILE,
    "--print-to-pdf-no-header",
    "--no-pdf-header-footer",
    "file://" + HTML_FILE
]

result = subprocess.run(chrome_cmd, capture_output=True, text=True, timeout=60)
if result.returncode == 0 and os.path.exists(PDF_FILE):
    size = os.path.getsize(PDF_FILE)
    print(f"PDF created: {PDF_FILE} ({size/1024:.1f} KB)")
else:
    print("Chrome failed:", result.stderr[:500])
    sys.exit(1)
