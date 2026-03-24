const adminStatsService = require('./src/services/adminStats.s');
const db = require('./src/config/db.config');

async function test() {
  try {
    console.log('Testing getOccupancyRate with empty string facilityId...');
    const occupancy = await adminStatsService.getOccupancyRate("");
    console.log('Occupancy Result (Empty String):', occupancy);

    console.log('\nTesting getOccupancyRate with null facilityId...');
    const occupancyNull = await adminStatsService.getOccupancyRate(null);
    console.log('Occupancy Result (Null):', occupancyNull);

    console.log('\nTesting getBookingTrends...');
    const trends = await adminStatsService.getBookingTrends();
    console.log('Trends Result:', trends);

    process.exit(0);
  } catch (error) {
    console.error('TEST FAILED:', error);
    process.exit(1);
  }
}

test();
