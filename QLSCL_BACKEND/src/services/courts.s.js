const db = require('../config/db.config');

// Lấy tất cả sân
const getAllCourts = async (params = {}) => {
    let query = db('Courts as c')
        .leftJoin('Locations as l', 'c.location_id', 'l.id')
        .select('c.*', 'l.name as location_name', 'l.address as location_address');

    if (params.status) query = query.whereILike('c.status', params.status);
    if (params.type) query = query.whereILike('c.type', params.type);

    return query.orderBy('c.id');
};

// Lấy sân theo ID
const getCourtById = async (id) => {
    return db('Courts as c')
        .leftJoin('Locations as l', 'c.location_id', 'l.id')
        .where('c.id', id)
        .select('c.*', 'l.name as location_name', 'l.address as location_address')
        .first();
};

// Tạo sân mới
const createCourt = async (data) => {
    const result = await db('Courts').insert({
        name: data.name,
        type: data.type || 'Double',
        location_id: data.location_id,
        price_per_hour: data.price_per_hour,
        status: data.status || 'Active',
        description: data.description || null,
        image_url: data.image_url || null
    }).returning('id');
    const id = Array.isArray(result[0]) ? result[0] : (result[0]?.id || result[0]);
    return getCourtById(id);
};


// Cập nhật sân
const updateCourt = async (id, data) => {
    const allowed = {};
    if (data.name) allowed.name = data.name;
    if (data.type) allowed.type = data.type;
    if (data.location_id) allowed.location_id = data.location_id;
    if (data.price_per_hour) allowed.price_per_hour = data.price_per_hour;
    if (data.status) allowed.status = data.status;
    if (data.description !== undefined) allowed.description = data.description;
    if (data.image_url !== undefined) allowed.image_url = data.image_url;

    await db('Courts').where({ id }).update(allowed);
    return getCourtById(id);
};

// Xóa sân
const deleteCourt = async (id) => {
    return db('Courts').where({ id }).del();
};

module.exports = { getAllCourts, getCourtById, createCourt, updateCourt, deleteCourt };