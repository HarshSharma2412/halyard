'use client';

export function MaterialsTable() {
  return (
    <section className="materials-section" id="materials" aria-labelledby="materials-heading">
      <div className="section-label">Metallurgy &amp; Integrity</div>
      <h2 className="section-title" id="materials-heading">
        Recycled 316L vs. 925 Sterling Silver
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '28%' }}>Specification</th>
              <th scope="col" style={{ width: '36%' }}>Recycled 316L Stainless Steel</th>
              <th scope="col" style={{ width: '36%' }}>925 Sterling Silver</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row-label">Base Composition</td>
              <td>Marine/surgical grade Fe-Cr-Ni-Mo alloy</td>
              <td>92.5% pure elemental silver + 7.5% copper</td>
            </tr>
            <tr>
              <td className="row-label">Water &amp; Sweat Resistance</td>
              <td>100% waterproof (fresh, salt, shower, sauna)</td>
              <td>Water safe (rinse and dry thoroughly)</td>
            </tr>
            <tr>
              <td className="row-label">Tarnish &amp; Oxidation</td>
              <td>Zero tarnish, non-corroding under all conditions</td>
              <td>Develops rich, distinctive patina with age</td>
            </tr>
            <tr>
              <td className="row-label">Skin Sensitivity</td>
              <td>Certified hypoallergenic (implant grade)</td>
              <td>100% nickel-free &amp; lead-free hypoallergenic</td>
            </tr>
            <tr>
              <td className="row-label">Weight &amp; Feel</td>
              <td>Substantial, cold, modern industrial density</td>
              <td>Warm, organic, precious-metal balance</td>
            </tr>
            <tr>
              <td className="row-label">Maintenance Routine</td>
              <td>Zero fuss: rinse with warm water, wipe dry</td>
              <td>Buff periodically with treated silver cloth</td>
            </tr>
            <tr>
              <td className="row-label">Lifecycle &amp; Sustainability</td>
              <td>100% infinitely recyclable post-consumer steel</td>
              <td>Certified conflict-free recycled precious metal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
