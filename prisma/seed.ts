import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const projects = [
  {
    title: "RNZ Group Website",
    slug: "rnz-group-website",
    category: "web",
    description: "Fast, SEO-optimized corporate agri-tech site that drove a 40% increase in organic traffic.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/rnz-group-website-design.png",
    liveUrl: "https://rnz-group.com/",
    tech: "WordPress,PHP,SEO",
    year: "2024",
    featured: true,
    order: 1,
  },
  {
    title: "RNZ Group Design Portfolio",
    slug: "rnz-group-design-portfolio",
    category: "design",
    description: "Agri brochures, bag packaging and social creatives for a multi-entity agricultural group.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/01/RNZ-Group-Design-Portfolio-–-Agri-Brochures-Bag-Packaging.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/rnz-group-design-portfolio/",
    tech: "Illustrator,Photoshop,Packaging",
    year: "2024",
    featured: true,
    order: 2,
  },
  {
    title: "Expocrop Website",
    slug: "expocrop-website",
    category: "web",
    description: "Modern agriculture brand website focused on SEO, speed and mobile UX.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/expocrop-website-design.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/expocrop-website-design/",
    tech: "WordPress,SEO,UI/UX",
    year: "2024",
    order: 3,
  },
  {
    title: "Expocrop Logo & Branding",
    slug: "expocrop-logo-branding",
    category: "design",
    description: "A clean, scalable visual identity for a modern agriculture brand, built for digital and print.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/01/TITLE-EXPOCROP.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/expocrop-logo-design/",
    tech: "Illustrator,Brand Identity",
    year: "2024",
    order: 4,
  },
  {
    title: "Expocrop Product Brochures",
    slug: "expocrop-product-brochures",
    category: "design",
    description: "Informative, visually rich product brochures crafted for print and digital distribution.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/Expocrop-product-brochures.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/expocrop-product-brochures/",
    tech: "InDesign,Print Design",
    year: "2024",
    order: 5,
  },
  {
    title: "Ajooba LLC Website",
    slug: "ajooba-llc-website",
    category: "web",
    description: "Dubai gift-store website — WordPress, speed-optimized and SEO-ready.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/Ajooba-LLC-website-design.png",
    liveUrl: "https://ajooballc.com/",
    tech: "WordPress,WooCommerce,SEO",
    year: "2023",
    order: 6,
  },
  {
    title: "Ajooba.ae — Custom OpenCart",
    slug: "ajooba-ae-opencart",
    category: "web",
    description: "Fully customized OpenCart e-commerce build; part of a portfolio that lifted conversions 32%.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/Ajooba.ae-website-design.png",
    liveUrl: "https://ajooba.ae/",
    tech: "OpenCart,PHP,E-commerce",
    year: "2023",
    order: 7,
  },
  {
    title: "Ajooba Gift Item Designs",
    slug: "ajooba-gift-item-designs",
    category: "design",
    description: "T-shirts, stickers, greeting cards, labels and packaging designed for retail.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/AjoobaLLC-Gift-Item-Designs.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/ajooballc-gift-item-designs/",
    tech: "Illustrator,Product Design",
    year: "2023",
    order: 8,
  },
  {
    title: "Kalia Law Firm",
    slug: "kalia-law-firm",
    category: "web",
    description: "Law + real-estate site on WordPress & Google Cloud — ranked top in its Canadian province with 3-second loads.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/Kalia-Law-Firm-Website-Design.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/kalia-law-firm-website-design/",
    tech: "WordPress,Google Cloud,SEO",
    year: "2022",
    order: 9,
  },
  {
    title: "ForexAMG Platform",
    slug: "forexamg-platform",
    category: "web",
    description: "Laravel build with SOAP web services, automation modules and Agile delivery.",
    coverImage: "https://thecharanjitsingh.com/wp-content/uploads/2025/04/ForexAMG-Website-Development.png",
    liveUrl: "https://thecharanjitsingh.com/portfolio/forexamg-website-development/",
    tech: "Laravel,Bootstrap,SOAP",
    year: "2021",
    order: 10,
  },
];

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
