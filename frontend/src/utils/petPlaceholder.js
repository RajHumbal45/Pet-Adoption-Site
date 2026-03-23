export function getPetPlaceholder(pet) {
  const title = encodeURIComponent(pet?.name || 'Pet');
  const subtitle = encodeURIComponent(
    [pet?.breed, pet?.species].filter(Boolean).join(' • ') || 'Adoption profile',
  );

  return `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 550'>
    <defs>
      <linearGradient id='bg' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='%23f4e6d0'/>
        <stop offset='100%' stop-color='%23d9e6df'/>
      </linearGradient>
    </defs>
    <rect width='800' height='550' fill='url(%23bg)'/>
    <circle cx='400' cy='215' r='86' fill='%23fff9f0' opacity='0.95'/>
    <circle cx='350' cy='160' r='34' fill='%23fff9f0' opacity='0.95'/>
    <circle cx='450' cy='160' r='34' fill='%23fff9f0' opacity='0.95'/>
    <rect x='290' y='292' width='220' height='118' rx='59' fill='%23fff9f0' opacity='0.95'/>
    <text x='400' y='468' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='38' font-weight='700' fill='%23313f49'>${title}</text>
    <text x='400' y='504' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='22' fill='%235f6e78'>${subtitle}</text>
  </svg>`.replace(/\n/g, '');
}
