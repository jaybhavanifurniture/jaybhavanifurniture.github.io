import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promoFilePath = path.join(__dirname, '../src/data/promo.json');

function validatePromos() {
  console.log('Validating promo campaigns...');
  
  if (!fs.existsSync(promoFilePath)) {
    console.error('Error: promo.json not found.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(promoFilePath, 'utf8');
  let promos;
  
  try {
    promos = JSON.parse(rawData);
  } catch (error) {
    console.error('Error parsing promo.json:', error);
    process.exit(1);
  }

  if (!Array.isArray(promos)) {
    console.error('Error: promo.json must be an array of campaign objects.');
    process.exit(1);
  }

  const activePromos = promos.filter(p => p.isActive);

  // Validate dates and check for overlaps
  for (let i = 0; i < activePromos.length; i++) {
    const promo = activePromos[i];
    
    if (promo.campaignType === 'evergreen') {
      continue;
    }

    if (!promo.startDate || !promo.endDate) {
      console.error(`Error in promo '${promo.id}': Missing startDate or endDate.`);
      process.exit(1);
    }
    
    const start = new Date(promo.startDate).getTime();
    const end = new Date(promo.endDate).getTime();
    
    if (isNaN(start) || isNaN(end)) {
      console.error(`Error in promo '${promo.id}': Invalid date format.`);
      process.exit(1);
    }
    
    if (start >= end) {
      console.error(`Error in promo '${promo.id}': startDate must be before endDate.`);
      process.exit(1);
    }

    // Check against all subsequent promos for overlaps
    for (let j = i + 1; j < activePromos.length; j++) {
      const otherPromo = activePromos[j];
      
      if (otherPromo.campaignType === 'evergreen') {
        continue;
      }

      const otherStart = new Date(otherPromo.startDate).getTime();
      const otherEnd = new Date(otherPromo.endDate).getTime();

      // Check if dates overlap
      // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
      if (start <= otherEnd && end >= otherStart) {
        console.error(`\n🔥 VALIDATION FAILED: Overlapping Promotional Campaigns Detected!`);
        console.error(`Campaign '${promo.id}' (${promo.startDate} to ${promo.endDate})`);
        console.error(`overlaps with`);
        console.error(`Campaign '${otherPromo.id}' (${otherPromo.startDate} to ${otherPromo.endDate})\n`);
        console.error(`Please adjust the dates in promo.json or set one to isActive: false.`);
        process.exit(1);
      }
    }
  }

  console.log('✅ Validation passed! No overlapping campaigns detected.');
}

validatePromos();
