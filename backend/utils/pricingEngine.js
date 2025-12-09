function applies(criteria, context){
  if(!criteria) return true;
  if(criteria.dayOfWeek){
    const dow = context.start.getDay();
    if(criteria.dayOfWeek === 'weekend') return dow===0 || dow===6;
    if(criteria.dayOfWeek === 'weekday') return dow>=1 && dow<=5;
  }
  if(criteria.courtType){
    if(criteria.courtType !== context.courtType) return false;
  }
  if(criteria.timeRange){
    const toMinutes = t => { const [hh,mm]=t.split(':').map(Number); return hh*60+mm; };
    const st = context.start.getHours()*60 + context.start.getMinutes();
    const s = toMinutes(criteria.timeRange.start); const e = toMinutes(criteria.timeRange.end);
    if(st < s || st >= e) return false;
  }
  return true;
}

async function calculatePrice({ basePrice, start, end, courtType, equipment, coach, pricingRules }){
  let subtotal = basePrice;
  const breakdown = { basePrice, modifiers: [], equipmentFee: 0, coachFee: 0 };

  for(const rule of pricingRules.filter(r=>r.enabled)){
    if(applies(rule.criteria, { start, end, courtType })){
      if(rule.type === 'surcharge'){
        subtotal += rule.value;
        breakdown.modifiers.push({ name: rule.name, effect: `+${rule.value}` });
      } else if(rule.type === 'multiplier'){
        subtotal = subtotal * rule.value;
        breakdown.modifiers.push({ name: rule.name, effect: `*${rule.value}` });
      }
    }
  }

  if(equipment && equipment.length){
    for(const e of equipment){
      const fee = e.perUnitPrice * e.qty;
      breakdown.equipmentFee += fee;
      subtotal += fee;
    }
  }

  if(coach){
    breakdown.coachFee = coach.hourlyFee;
    subtotal += coach.hourlyFee;
  }

  breakdown.total = Number(subtotal.toFixed(2));
  return breakdown;
}

module.exports = { calculatePrice };
