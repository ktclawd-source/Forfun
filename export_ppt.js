const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const readline = require("readline");

// Read the markdown file
const markdown = fs.readFileSync("/home/kt/clawd/bank_presentation_cyber_ransomware.md", "utf-8");

// Split by slide separators (---)
const slides = markdown.split(/^---$/gm);

// Create presentation
const pres = new PptxGenJS();

// Set presentation properties
pres.author = "kt";
pres.title = "Cyber Threat Landscape & Ransomware";
pres.subject = "Presentation for HK Bank";
pres.company = "";

// Define colors
const colors = {
  navy: "003366",
  dark: "1a1a1a",
  red: "cc0000",
  white: "ffffff",
  lightGray: "f5f5f5",
  accent: "0066cc"
};

// Helper to parse markdown slide content
function parseSlide(slideText) {
  const lines = slideText.trim().split("\n");
  const content = { title: "", bullets: [], notes: "" };
  
  let inNotes = false;
  let currentBullet = "";
  
  lines.forEach((line) => {
    // Skip empty lines at start
    if (line.trim() === "" && !content.title && content.bullets.length === 0) return;
    
    // Check for notes section
    if (line.toLowerCase().startsWith("notes:")) {
      inNotes = true;
      content.notes = line.substring(6).trim();
      return;
    }
    
    if (inNotes) {
      content.notes += " " + line.trim();
      return;
    }
    
    // Title line (starts with #)
    if (line.startsWith("#")) {
      content.title = line.replace(/^#+\s*/, "").trim();
      return;
    }
    
    // Bullet points (starts with - or |)
    if (line.trim().startsWith("-") || line.trim().startsWith("|")) {
      const text = line.replace(/^[-|]\s*/, "").trim();
      if (text) content.bullets.push(text);
      return;
    }
    
    // Regular paragraph - add to last bullet or as standalone
    if (line.trim() && !line.startsWith("```")) {
      const text = line.trim();
      if (content.bullets.length > 0) {
        content.bullets[content.bullets.length - 1] += " " + text;
      } else {
        content.bullets.push(text);
      }
    }
  });
  
  return content;
}

// Process each slide
slides.forEach((slideText, index) => {
  const parsed = parseSlide(slideText);
  if (!parsed.title && parsed.bullets.length === 0) return;
  
  const slide = pres.addSlide();
  
  // Title slide
  if (index === 0) {
    slide.background = { color: colors.navy };
    
    slide.addText(parsed.title, {
      x: 0.5, y: 2.5, w: "90%", h: 1.5,
      fontSize: 36,
      color: colors.white,
      align: "center",
      bold: true
    });
    
    // Add subtitle if present
    if (parsed.bullets.length > 0) {
      slide.addText(parsed.bullets.join("\n"), {
        x: 0.5, y: 4.5, w: "90%", h: 2,
        fontSize: 18,
        color: colors.white,
        align: "center"
      });
    }
    
    slide.addText("January 2026", {
      x: 0.5, y: 7, w: "90%", h: 0.5,
      fontSize: 14,
      color: "cccccc",
      align: "center"
    });
    
    return;
  }
  
  // Regular slides
  slide.background = { color: colors.white };
  
  // Title bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.8,
    fill: { color: colors.navy }
  });
  
  slide.addText(parsed.title, {
    x: 0.5, y: 0.15, w: "95%", h: 0.5,
    fontSize: 24,
    color: colors.white,
    bold: true
  });
  
  // Content area
  if (parsed.bullets.length > 0) {
    slide.addText(parsed.bullets.map(b => "• " + b).join("\n"), {
      x: 0.5, y: 1.2, w: "90%", h: 5.5,
      fontSize: 18,
      color: colors.dark,
      valign: "top",
      lineSpacing: 32
    });
  }
  
  // Add notes if present
  if (parsed.notes) {
    slide.addNotes(parsed.notes);
  }
  
  // Footer
  slide.addText("Cyber Threat Landscape - HK Bank Presentation", {
    x: 0.5, y: 7, w: "90%", h: 0.3,
    fontSize: 10,
    color: "888888",
    align: "right"
  });
});

// Save the presentation
pres.writeFile({ fileName: "/home/kt/clawd/bank_presentation_cyber_ransomware.pptx" })
  .then(() => {
    console.log("✅ PowerPoint file created: bank_presentation_cyber_ransomware.pptx");
  })
  .catch(err => {
    console.error("Error creating PowerPoint:", err);
    process.exit(1);
  });
