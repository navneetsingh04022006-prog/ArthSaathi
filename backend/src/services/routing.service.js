import env from '../config/env.js';
import { findPartners } from '../repositories/partner.repository.js';
import { findSchemeBySchemeId } from '../repositories/scheme.repository.js';
import { haversineDistanceKm } from '../utils/geo.js';
import { toPublicPartner } from './partner.service.js';

export async function findNearbyPartners(search) {
  const scheme = await findSchemeBySchemeId(search.schemeId);
  if (!scheme) {
    const error = new Error('Scheme was not found.');
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  const filters = {
    status: 'ACTIVE',
    supportedSchemes: search.schemeId,
    ...(search.service ? { serviceTypes: search.service } : {})
  };
  const result = await findPartners(filters, {
    skip: 0,
    limit: env.maxPartnerResultLimit
  });
  const partners = routePartnersFromData(result.items, search);

  return {
    schemeId: search.schemeId,
    search: {
      latitude: search.latitude,
      longitude: search.longitude,
      radiusKm: search.radiusKm
    },
    partners,
    count: partners.length,
    message: partners.length
      ? undefined
      : 'No matching partners were found within the selected search radius.'
  };
}

export function routePartnersFromData(partners, search) {
  return partners
    .filter((partner) => partner.status === 'ACTIVE')
    .filter((partner) => partner.supportedSchemes?.includes(search.schemeId))
    .filter((partner) => !search.service || partner.serviceTypes?.includes(search.service))
    .filter((partner) => hasValidLocation(partner))
    .map((partner) => ({
      partner,
      distanceKm: haversineDistanceKm(
        { latitude: search.latitude, longitude: search.longitude },
        partner.location
      )
    }))
    .filter(({ distanceKm }) => distanceKm <= search.radiusKm)
    .sort((left, right) => (
      verificationRank(left.partner) - verificationRank(right.partner)
      || left.distanceKm - right.distanceKm
      || left.partner.name.localeCompare(right.partner.name)
    ))
    .slice(0, search.limit)
    .map(({ partner, distanceKm }) => ({
      ...toPublicPartner(partner),
      distance: {
        value: distanceKm,
        unit: 'km',
        method: 'geographic'
      },
      reasons: buildRoutingReasons(partner, search, distanceKm)
    }));
}

function hasValidLocation(partner) {
  return partner.location
    && Number.isFinite(Number(partner.location.latitude))
    && Number.isFinite(Number(partner.location.longitude))
    && Number(partner.location.latitude) >= -90
    && Number(partner.location.latitude) <= 90
    && Number(partner.location.longitude) >= -180
    && Number(partner.location.longitude) <= 180;
}

function verificationRank(partner) {
  return { VERIFIED: 0, DEMO: 1, UNVERIFIED: 2 }[partner.verificationStatus] ?? 3;
}

function buildRoutingReasons(partner, search, distanceKm) {
  const reasons = [
    'Supports the selected scheme.',
    'Partner is currently active.',
    `Approximately ${distanceKm} km away by geographic distance.`
  ];
  if (search.service) reasons.push('Provides the requested service.');
  if (partner.verificationStatus === 'VERIFIED') reasons.push('Partner information is marked as verified.');
  if (partner.verificationStatus === 'DEMO') reasons.push('This partner record is demo data, not an official authorization claim.');
  return reasons;
}