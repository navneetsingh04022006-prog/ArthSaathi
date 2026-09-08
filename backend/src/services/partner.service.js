import { findPartnerById, findPartners } from '../repositories/partner.repository.js';

export async function listPartners(queryOptions) {
  const result = await findPartners(queryOptions.filters, queryOptions.pagination);
  return {
    items: result.items.map(toPublicPartner),
    pagination: {
      page: queryOptions.pagination.page,
      limit: queryOptions.pagination.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / queryOptions.pagination.limit)
    }
  };
}

export async function getPartner(partnerId) {
  const partner = await findPartnerById(partnerId);
  if (!partner) {
    const error = new Error('Partner was not found.');
    error.statusCode = 404;
    error.code = 'PARTNER_NOT_FOUND';
    throw error;
  }
  return toPublicPartner(partner);
}

export async function findRelevantPartners(schemeId, queryOptions) {
  const filters = {
    ...queryOptions.filters,
    supportedSchemes: schemeId.toUpperCase(),
    status: 'ACTIVE'
  };
  const result = await findPartners(filters, queryOptions.pagination);
  const partners = discoverPartnersFromData(result.items, schemeId, queryOptions.filters);
  return {
    schemeId: schemeId.toUpperCase(),
    partners,
    count: result.total,
    message: result.total
      ? undefined
      : 'No verified or active channel partners are currently available for this scheme in the selected area.'
  };
}

export function discoverPartnersFromData(partners, schemeId, filters = {}) {
  return partners
    .filter((partner) => partner.status === 'ACTIVE')
    .filter((partner) => partner.supportedSchemes?.includes(schemeId.toUpperCase()))
    .filter((partner) => !filters.serviceTypes || partner.serviceTypes?.includes(filters.serviceTypes))
    .filter((partner) => !filters['address.state'] || partner.address?.state === filters['address.state'])
    .filter((partner) => !filters['address.district'] || partner.address?.district === filters['address.district'])
    .sort((left, right) => verificationRank(left) - verificationRank(right) || left.name.localeCompare(right.name))
    .map((partner) => ({
      ...toPublicPartner(partner),
      reasons: buildReasons(partner, filters)
    }));
}

export function toPublicPartner(partner) {
  return {
    partnerId: partner.partnerId,
    name: partner.name,
    partnerType: partner.partnerType,
    description: partner.description,
    status: partner.status,
    verificationStatus: partner.verificationStatus,
    contactInformation: partner.contactInformation,
    address: partner.address,
    location: partner.location,
    supportedSchemes: partner.supportedSchemes || [],
    supportedCategories: partner.supportedCategories || [],
    supportedPurposes: partner.supportedPurposes || [],
    serviceTypes: partner.serviceTypes || [],
    eligibilityNotes: partner.eligibilityNotes,
    operatingHours: partner.operatingHours,
    source: partner.source
  };
}

function buildReasons(partner, filters) {
  const reasons = ['Supports the selected scheme.', 'Partner is currently active.'];
  if (filters.serviceTypes && partner.serviceTypes?.includes(filters.serviceTypes)) reasons.push('Provides the requested service.');
  if (filters['address.state'] && partner.address?.state === filters['address.state']) reasons.push('Available in the selected state.');
  if (filters['address.district'] && partner.address?.district === filters['address.district']) reasons.push('Available in the selected district.');
  if (partner.verificationStatus === 'VERIFIED') reasons.push('Partner information is marked as verified.');
  if (partner.verificationStatus === 'DEMO') reasons.push('This partner record is demo data, not an official authorization claim.');
  return reasons;
}

function verificationRank(partner) {
  return { VERIFIED: 0, DEMO: 1, UNVERIFIED: 2 }[partner.verificationStatus] ?? 3;
}