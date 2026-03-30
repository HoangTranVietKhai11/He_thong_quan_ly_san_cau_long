const adminStatsService = require('../services/adminStats.s');
const logger = require('../utils/logger');

const getOccupancy = async (req, res) => {
  try {
    const { facilityId, month, year } = req.query;
    const occupancy = await adminStatsService.getOccupancyRate(facilityId, month, year);
    res.status(200).json({ success: true, data: occupancy });
  } catch (error) {
    logger.error('Error fetching occupancy', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tính tỷ lệ lấp đầy', debug: error.message });
  }
};

const getTrends = async (req, res) => {
  try {
    const trends = await adminStatsService.getBookingTrends();
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    logger.error('Error fetching booking trends', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy dữ liệu xu hướng', debug: error.message });
  }
};

const getHourlyDistribution = async (req, res) => {
  try {
    const data = await adminStatsService.getHourlyDistribution();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWeeklyDistribution = async (req, res) => {
  try {
    const data = await adminStatsService.getWeeklyDistribution();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await adminStatsService.getTopCustomers(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConflicts = async (req, res) => {
  try {
    const data = await adminStatsService.getConflicts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGoldenHourPredictions = async (req, res) => {
  try {
    const { facilityId } = req.query;
    const data = await adminStatsService.getPredictedGoldenHours(facilityId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching golden hour predictions', error);
    res.status(500).json({ success: false, message: 'Lỗi khi dự đoán giờ vàng', debug: error.message });
  }
};

module.exports = {
  getOccupancy,
  getTrends,
  getHourlyDistribution,
  getWeeklyDistribution,
  getTopCustomers,
  getConflicts,
  getGoldenHourPredictions
};
