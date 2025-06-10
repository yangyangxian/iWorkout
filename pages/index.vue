<template>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-24 gap-4 auto-rows-min">

    <!-- Example Dashboard Cards with varying sizes -->
    <DashboardCard title="Small Card" class="col-span-2">
      <p>Just a number or small widget.</p>
    </DashboardCard>

    <DashboardCard title="Medium Card (2 cols)" class="col-span-full md:col-span-4">
      <p>A slightly larger component.</p>
    </DashboardCard>

    <DashboardCard title="Wide Card (Full width on smaller screens, 3 cols on desktop)" class="col-span-full lg:col-span-6">
      <p>Good for line charts.</p>
    </DashboardCard>

    <DashboardCard title="Tall Card (1 col, 2 rows)" class="col-span-2 row-span-2">
      <p>Something that needs vertical space.</p>
    </DashboardCard>

    <DashboardCard title="Large Card (Spans 6 columns)" class="col-span-full 2xl:col-span-12">
      <p>Perfect for a large data table or complex chart.</p>
    </DashboardCard>

    <DashboardCard title="Another Small Card" class="col-span-2">
      <p>More small data.</p>
    </DashboardCard>

    <DashboardCard title="Dynamic Sized Card" class="col-span-full 2xl:col-span-8">
      <p>This card adjusts its width based on screen size.</p>
    </DashboardCard>

  </div>
</template> 