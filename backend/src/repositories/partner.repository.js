import Partner from '../models/Partner.js';

export async function findPartners(filters = {}, pagination = { skip: 0, limit: 100 }) {
  const query = Partner.find(filters)
    .sort({ verificationStatus: 1, name: 1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [items, total] = await Promise.all([
    query,
    Partner.countDocuments(filters)
  ]);

  return { items, total };
}

export function findPartnerById(partnerId) {
  return Partner.findOne({ partnerId: partnerId.toUpperCase() }).lean();
}